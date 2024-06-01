import { use, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Timeline } from "vis-timeline/esnext";

import { LLM } from "@/lib/types/llm"
import React from "react";
import { Check, Expand, Minimize2, MoreVertical, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { Insights } from "@/lib/types/insights";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { differenceInCalendarDays } from "date-fns";

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
  const [groupByParent, setGroupByParent] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [parentGroups, setParentGroups] = useState<any[]>([]);
  const [selectedParent, setSelectedParent] = useState<any>(null);

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
    let llm = properties.llm ? properties.llm : llms.find((llm) => llm.id === properties.item);

    if (llm) {
      selectCallback(llm);
      updateURL({ ...state, selected: llm.id });
    }
  };

  const showDialogOnClick: ((properties: any) => void) = function (properties) {
    let item = parentGroups.find((group) => group.id === properties.item);

    if (item && item.items.length > 1) {
      setSelectedParent({
        item: item,
        x: properties.event.x,
        y: properties.event.y,
      });
    } else {
      setSelectedParent(null);
    }
  }

  const now = new Date(); // today
  const future = new Date(); // today + 30 days
  future.setDate(future.getDate() + 30);

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
          className: item.className,
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

        // update parent potentialEnd to latest child start
        if (item.start > existingEntry.potentialEnd) {
          existingEntry.potentialEnd = item.start;
        }

        // if the parent would span more than 1 month, set end to make it a span item
        if (differenceInCalendarDays(existingEntry.potentialEnd, existingEntry.start) > 30) {
          existingEntry.end = existingEntry.potentialEnd;
        }

        // if any child but not every child is closed-source, set parent to semi-closed-source
        if (
          existingEntry.className === 'closed-source' && item.className !== 'closed-source' ||
          existingEntry.className !== 'closed-source' && item.className === 'closed-source'
        ) {
          existingEntry.className = "semi-closed-source";
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
        potentialEnd: item.start,
        items: [item.id],
        className: item.className,
      });
      return acc;
    }, []);

    setParentGroups(newParentGroups);
    setItems(newItems);
  }

  // update timeline items 
  useLayoutEffect(() => {
    if (timeline) {
      if (groupByParent) {
        timeline.setItems(parentGroups);
      } else {
        timeline.setItems(items);
      }
    }
  }, [items, parentGroups]);

  // update timeline items when llms change
  useEffect(() => {
    transformItems(llms);
  }, [llms]);

  // update selected on timeline change
  useEffect(() => {
    if (!timeline) return;

    selectURLSelected();

    timeline.on("click", selectItemOnClick);

    return () => {
      timeline.off("click", selectItemOnClick);
    };
  }, [timeline]);

  // update event listener for showing parent group dialog when parent or timeline changes
  useEffect(() => {
    if (!timeline) return;

    timeline.on("click", showDialogOnClick);

    return () => {
      timeline.off("click", showDialogOnClick);
    };
  }, [timeline, parentGroups]);

  // setup timeline on mount
  useEffect(() => {
    if (!container.current) return;

    let timelineItems = groupByParent ? parentGroups : items;

    let newTimeline = new Timeline(container.current, timelineItems, options);

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
      timeline?.setOptions({ ...options, minHeight: "700px", maxHeight: "700px" });
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
        {selectedParent && (
          <DropdownMenu open onOpenChange={(open) => !open && setSelectedParent(null)}>
            <DropdownMenuContent align="end" style={{ position: "absolute", top: selectedParent.y, left: selectedParent.x }}
            className="z-10 w-max">
              <DropdownMenuLabel>{selectedParent.item.id}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {selectedParent.item.items.map((item: string) => {
                let llm = llms.find((llm) => llm.id === item);
                if (!llm) return null;
                return (
                  <DropdownMenuItem key={llm.id} onSelect={() => selectItemOnClick({ llm: llm })} className={llm.download ? "" : "bg-closed-source"}>
                    <span>{llm.name}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardContent>
    </Card>
  );
}

export default LlmTimeline;