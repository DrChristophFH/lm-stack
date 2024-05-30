import { useEffect, useRef, useState } from "react";
import { Timeline } from "vis-timeline/esnext";
import 'vis-timeline/styles/vis-timeline-graph2d.css';

import { LLM } from "@/lib/types/llm"
import React from "react";
import { Expand, Minimize2, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { Insights } from "@/lib/types/insights";

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

  // Update URL with new state without reloading the page
  const updateURL = (newState: any) => {
    if (newState && newState !== state) {
      setState(newState);
      const newParams = new URLSearchParams(newState).toString();
      const newURL = `${window.location.pathname}?${newParams}`;
      window.history.pushState({ path: newURL }, '', newURL);
    }
  };

  // listen for popstate event to update state
  window.addEventListener('popstate', (event) => {
    navigateToURL();
  });

  const now = new Date(); // today
  const future = new Date().setDate(now.getDate() + 30); // today + 30 days

  const items: any = llms.filter((llm) => !(llm.release_date === "nan")).map((llm) => {
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
  const navigateToURL = () => {
    if (!timeline) return;

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

  const setupTimeline = () : Timeline => {
    if (!container.current) throw new Error("Container not found");

    let newTimeline = new Timeline(container.current, items, options);

    newTimeline.on("click", function (properties) {
      let item = properties.item;
      if (item) {
        let llm = llms.find((llm) => llm.id === item);
        if (!llm) return;
        selectCallback(llm);
        updateURL({ ...state, selected: llm.id });
      }
    });

    // if selected is in the URL, select it
    navigateToURL();

    return newTimeline;
  }

  useEffect(() => {
    if (!container.current) return;

    const newTimeline = setupTimeline();
    setTimeline(newTimeline);

    return () => {
      newTimeline.destroy();
    };
  }, [container, llms]);

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
  );
}

export default LlmTimeline;