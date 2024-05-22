'use client'

import Link from "next/link"
import {
  ArrowUpRight,
  BotMessageSquare,
  RotateCcw,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React, { useEffect, useState } from "react"
import { LLM } from "@/lib/types/llm"
import { Header } from "@/components/lms/header"
import LlmTimeline from "@/components/lms/llm-timeline"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip"


export default function Dashboard() {
  const [llms, setLLMs] = useState<LLM[]>([]);
  const [selectedLLM, setSelectedLLM] = useState<LLM | null>(null);

  useEffect(() => {
    const fetchLLMs = async () => {
      const response = await fetch('generated/llms.json');
      const data: LLM[] = await response.json();
      setLLMs(data);
    };

    fetchLLMs();
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header></Header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid md:gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>LLM Timeline</CardTitle>
              <BotMessageSquare />
            </CardHeader>
            <CardContent>
              <LlmTimeline llms={llms} />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  Recent transactions from your store.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>

            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}