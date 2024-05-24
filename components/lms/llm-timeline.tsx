import { useEffect, useRef, useState } from "react";
import { Timeline } from "vis-timeline/esnext";
import 'vis-timeline/styles/vis-timeline-graph2d.css';

import { LLM } from "@/lib/types/llm"
import React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

interface Props {
  llms: LLM[];
  selectCallback: (llm: LLM) => void;
}

const LlmTimeline: React.FC<Props> = ({ llms, selectCallback }) => {
  const container = useRef(null);
  const [timeline, setTimeline] = useState<Timeline | null>(null);

  const items: any = llms.map((llm) => {
    let html = document.createElement("div");
    html.appendChild(document.createTextNode(llm.name));
    let image = document.createElement("img");
    image.src = "logos/" + llm.from + ".svg";
    image.style.maxHeight = "1em";
    image.style.marginLeft = "0.5em";
    html.appendChild(image);
    html.style.display = "flex";
    html.style.alignItems = "center";

    return ({
      id: llm.id,
      content: html,
      start: llm.release_date,
      data: llm,
    });
  });

  let now = new Date(); // today

  const options: any = {
    stack: true,
    showMajorLabels: true,
    showMinorLabels: true,
    zoomKey: "ctrlKey",
    maxMinorChars: 4,
    minHeight: "400px",
    start: new Date("2022-01-01"),
    end: now.setDate(now.getDate() + 30), // today + 30 days
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

  return (
    <div style={{ position: "relative" }}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" style={{ position: "absolute", top: "0.5em", right: "0.5em", zIndex: 5 }} onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent style={{ zIndex: 5 }}>
            <p>Reset Zoom</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div ref={container}></div>
    </div>
  );
}

export default LlmTimeline;