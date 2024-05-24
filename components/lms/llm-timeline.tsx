import { useEffect, useRef, useState } from "react";
import { Timeline } from "vis-timeline/esnext";
import 'vis-timeline/styles/vis-timeline-graph2d.css';

import { LLM } from "@/lib/types/llm"
import React from "react";
import { Expand, Minimize2, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

interface Props {
  llms: LLM[];
  selectCallback: (llm: LLM) => void;
}

const LlmTimeline: React.FC<Props> = ({ llms, selectCallback }) => {
  const container = useRef(null);
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [expanded, setExpanded] = useState(false);

  let now = new Date(); // today
  let future = new Date().setDate(now.getDate() + 30); // today + 30 days

  const items: any = llms.filter((llm) => !(llm.release_date === "nan")).map((llm) => {
    let html = document.createElement("div");
    html.appendChild(document.createTextNode(llm.name));
    let image = document.createElement("img");
    image.src = "logos/" + (llm.logo_file ? llm.logo_file : (llm.from.replace(" ", "_").toLowerCase() + ".svg"));
    image.style.maxHeight = "1em";
    image.style.marginLeft = "0.5em";
    image.alt = "";
    html.appendChild(image);
    html.style.display = "flex";
    html.style.alignItems = "center";

    let release_date = Date.parse(llm.release_date) ? new Date(llm.release_date) : future;

    return ({
      id: llm.id,
      content: html,
      start: release_date,
      data: llm,
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
    start: new Date("2022-01-01"),
    end: future, // today + 30 days
  };
  
  useEffect(() => {
    if (!container.current) return;
    
    let newTimeline = new Timeline(container.current, items, options);

    setTimeline(newTimeline);

    newTimeline.on("click", function (properties) {
      let item = properties.item;
      if (item) {
        let llm = llms.find((llm) => llm.id === item);
        if (!llm) return;
        selectCallback(llm);
      }
    });

    return () => {
      newTimeline.destroy();
    };
  }, [container, llms]);

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