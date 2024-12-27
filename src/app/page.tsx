'use client'

import React, { useEffect, useState } from "react"
import { LLM } from "@/lib/types/llm"
import { Header } from "@/components/lms/header"
import LlmTimeline from "@/components/lms/llm-timeline"
import ModelCard from "@/components/lms/model-card"
import ModelReadme from "@/components/lms/model-readme"
import { Insights } from "@/lib/types/referenced-values"
import { Footer } from "@/components/lms/footer"


export default function Dashboard() {
  const [llms, setLLMs] = useState<LLM[]>([]);
  const [selectedLLM, setSelectedLLM] = useState<LLM | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);

  useEffect(() => {
    const fetchLLMs = async () => {
      const response = await fetch('generated/llms.json');
      const data: LLM[] = await response.json();
      setLLMs(data);
    };

    const fetchInsights = async () => {
      const response = await fetch('generated/insights.json');
      const data: Insights = await response.json();
      setInsights(data);
    }

    fetchInsights();
    fetchLLMs();
  }, [])

  let selectCallback = (llm: LLM) => {
    setSelectedLLM(llm);
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header llms={llms} selectCallback={selectCallback}></Header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-4">
        <LlmTimeline llms={llms} insights={insights} selectCallback={selectCallback} />
        <div className="grid gap-4 grid-cols-1 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <ModelReadme readme={selectedLLM?.readme}></ModelReadme>
          <ModelCard llm={selectedLLM} insights={insights} className="order-first lg:order-1" />
        </div>
      </main>
      <Footer />
    </div>
  )
}