'use client'

import {
  BotMessageSquare,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import React, { useEffect, useState } from "react"
import { LLM } from "@/lib/types/llm"
import { Header } from "@/components/lms/header"
import LlmTimeline from "@/components/lms/llm-timeline"
import ModelCard from "@/components/lms/model-card"
import ModelReadme from "@/components/lms/model-readme"
import { Insights } from "@/lib/types/insights"


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
      <Header></Header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>LLM Timeline</CardTitle>
            <div className="flex flex-row items-center space-x-2">
              <span className="text-sm text-gray-500">ℹ️ Click on a model to view more details</span>
              <BotMessageSquare />
            </div>
          </CardHeader>
          <CardContent>
            <LlmTimeline llms={llms} insights={insights} selectCallback={selectCallback} />
          </CardContent>
        </Card>
        <div className="grid gap-4 grid-cols-1 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <ModelReadme readme={selectedLLM?.readme}></ModelReadme>
          <ModelCard llm={selectedLLM} insights={insights} className="order-first lg:order-1" />
        </div>
      </main>
    </div>
  )
}