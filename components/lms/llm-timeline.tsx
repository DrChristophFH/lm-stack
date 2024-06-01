import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Timeline } from "vis-timeline/esnext";

import { LLM } from "@/lib/types/llm"
import React from "react";
import { Check, Expand, Minimize2, MoreVertical, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { Insights } from "@/lib/types/insights";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface Props {
  llms: LLM[];
  insights: Insights | null;
  selectCallback: (llm: LLM) => void;
}

const LlmTimeline: React.FC<Props> = ({ llms, insights, selectCallback }) => {
  const container = useRef(null);
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [state, setState] = useState({});
  const [groupByParent, setGroupByParent] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [parentGroups, setParentGroups] = useState<any[]>([]);

  // Update URL with new state without reloading the page
  const updateURL = (newState: any) => {
    if (newState && newState !== state) {
      setState(newState);
      const newParams = new URLSearchParams(newState).toString();
      const newURL = `${window.location.pathname}?${newParams}`;
      window.history.pushState({ path: newURL }, '', newURL);
    }
  };

  const selectItemOnClick: ((properties: any) => void) = function (properties) {
    let item = properties.item;
    if (item) {
      let llm = llms.find((llm) => llm.id === item);
      if (llm) {
        selectCallback(llm);
        updateURL({ ...state, selected: llm.id });
      }
    }
  };

  const now = new Date(); // today
  const future = new Date().setDate(now.getDate() + 30); // today + 30 days

  const options: any = {
    stack: true,
    showMajorLabels: true,
    showMinorLabels: true,
    verticalScroll: true,
    zoomKey: "ctrlKey",
    maxMinorChars: 4,
    minHeight: "400px",
    maxHeight: "400px",
    start: new Date("2023-01-01"),
    end: future, // today + 30 days
  };

  // navigate to URL based on selected parameter
  const selectURLSelected = () => {
    if (!timeline) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const selected = urlParams.get("selected");
    if (selected) {
      const llm = llms.find((llm) => llm.id === selected);
      if (llm) {
        timeline.setSelection([selected]);
        selectCallback(llm);
      }
    }
  }

  const setupTimeline = (): Timeline => {
    if (!container.current) throw new Error("Container not found");

    let newTimeline = new Timeline(container.current, items, options);

    newTimeline.on("click", selectItemOnClick);

    return newTimeline;
  }

  const transformItems = (llms: LLM[]) => {
    let newItems = llms.filter((llm) => !(llm.release_date === "nan")).map((llm) => {
      const html = document.createElement("div");
      html.appendChild(document.createTextNode(llm.name));
      const image = document.createElement("img");

      const company = insights?.companies[llm.from];
      const fall_back_file = llm.from.replace(" ", "_").toLowerCase() + `.svg`

      const logo_path = `logos/` + (
        company ? company.logo :
          llm.logo_file ? llm.logo_file :
            fall_back_file
      )

      image.src = logo_path;
      image.style.maxHeight = "1em";
      image.style.maxWidth = "2em";
      image.style.marginLeft = "0.5em";
      image.alt = "";
      html.appendChild(image);
      html.style.display = "flex";
      html.style.alignItems = "center";

      let release_date = Date.parse(llm.release_date) ? new Date(llm.release_date) : future;

      const className = llm.download === '' ? 'closed-source' : ''

      return ({
        id: llm.id,
        content: html,
        start: release_date,
        data: llm,
        className: className,
      });
    });

    let newParentGroups = newItems.reduce((acc: any[], item: any) => { // group by parent
      // if no parent, create a single item for the model
      if (!item.data.parent) { 
        acc.push({
          id: item.id,
          content: item.content,
          start: item.start,
          items: [item.id],
        });
        return acc;
      }
  
      const existingEntry = acc.find((entry) => entry.id === item.data.parent);
      const llm = item.data;

      if (existingEntry) {
        existingEntry.items.push(item.id); // add child id to the parents items
        
        // update parent start to earliest child start
        if (item.start < existingEntry.start) {
          existingEntry.start = item.start;
        }

        return acc;
      }

      // create new parent entry
      const parentContent = document.createElement("div");
      parentContent.appendChild(document.createTextNode(llm.parent));
      const image = document.createElement("img");

      const company = insights?.companies[llm.from];
      const fall_back_file = llm.from.replace(" ", "_").toLowerCase() + `.svg`

      const logo_path = `logos/` + (
        company ? company.logo :
          llm.logo_file ? llm.logo_file :
            fall_back_file
      )

      image.src = logo_path;
      image.style.maxHeight = "1em";
      image.style.maxWidth = "2em";
      image.style.marginLeft = "0.5em";
      image.alt = "";
      parentContent.appendChild(image);
      parentContent.style.display = "flex";
      parentContent.style.alignItems = "center";

      acc.push({
        id: item.data.parent,
        content: parentContent,
        start: item.start,
        items: [item.id],
      });
      return acc;
    }, []);

    setParentGroups(newParentGroups);
    setItems(newItems);
  }

  // update timeline items when llms change
  useEffect(() => {
    transformItems(llms);
  }, [llms]);

  // update selected on timeline change
  useEffect(() => {
    selectURLSelected();
  }, [timeline]);

  // setup timeline effect
  useEffect(() => {
    if (!container.current) return;

    const newTimeline = setupTimeline();
    setTimeline(newTimeline);

    return () => {
      newTimeline.destroy();
    };
  }, [container.current]);

  // listen for popstate event to update state
  useEffect(() => {
    addEventListener('popstate', selectURLSelected);

    return () => {
      removeEventListener('popstate', selectURLSelected);
    };
  });

  // update timeline when groupByParent changes
  useEffect(() => {
    if (!timeline) return;

    if (groupByParent) {
      timeline.setItems(parentGroups); // group items
    } else {
      timeline.setItems(items); // reset items
    }
  }, [groupByParent]);

  if (!insights) {
    return null;
  }

  const handleReset = () => {
    timeline?.setWindow(options.start, options.end);
  };

  const toggleExpand = () => {
    if (expanded) {
      timeline?.setOptions({ ...options, minHeight: "400px", maxHeight: "400px" });
      setExpanded(false);
    } else {
      timeline?.setOptions({ ...options, minHeight: "800px", maxHeight: "800px" });
      setExpanded(true);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>LLM Timeline</CardTitle>
        <div className="flex flex-row items-center space-x-2">
          <span className="text-sm text-gray-500">ℹ️ Click on a model to view more details</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-10">
              <DropdownMenuLabel>Timeline Settings</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => setGroupByParent(!groupByParent)}>
                <span>Group Models of same Parent</span>
                <Check className={`h-4 w-4 ml-2 ${groupByParent ? "text-blue-600" : "text-gray-300"}`} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ position: "relative" }}>
          <div className="absolute top-2 right-2 z-10 flex gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent style={{ zIndex: 5 }}>
                  <p>Reset Zoom</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={toggleExpand}>
                    {expanded ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent style={{ zIndex: 5 }}>
                  <p>{expanded ? "Collapse" : "Expand"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div ref={container}></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default LlmTimeline;