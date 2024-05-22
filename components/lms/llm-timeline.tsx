import { useEffect, useRef } from "react";
import { Timeline } from "vis-timeline/esnext";
import 'vis-timeline/styles/vis-timeline-graph2d.css';

import { LLM } from "@/lib/types/llm"
import React from "react";

interface Props {
  llms: LLM[];
}

const LlmTimeline: React.FC<Props> = ({ llms }) => {
  const container = useRef(null);

  const items: any = llms.map((llm) => {
    let html = document.createElement("div");
    html.appendChild(document.createTextNode(llm.name));
    let image = document.createElement("img");
    image.src = "/logos/" + llm.from + ".svg";
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

  const options = {
    stack: true,
    showMajorLabels: true,
    showMinorLabels: true,
    maxMinorChars: 4,
    minHeight: "400px",
    start: new Date("2022-01-01"),
    end: new Date(), // today
  };

  useEffect(() => {
    if (!container.current) return;

    const timeline = new Timeline(container.current, items, options);

    return () => {
      timeline.destroy();
    };
  }, [container, items, options]);

  return (
    <div ref={container}></div>
  );
}

export default LlmTimeline;