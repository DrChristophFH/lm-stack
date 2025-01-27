import { Insights } from "@/lib/types/referenced-values";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Link from "next/link";

interface InsightBadgeProps {
  insight: string;
  insights: Insights;
}

const InsightBadge: React.FC<InsightBadgeProps> = ({ insight, insights }) => {
  const insight_definition = insights.model_insights[insight]
  const background_color = 'bg-' + (insight_definition ? insight_definition.color : 'rose-700')
  const text_color = parseInt(background_color.split('-')[2]) < 500 ? ' text-black' : ' text-white'

  if (insight_definition) {
    return (
      <HoverCard>
        <HoverCardTrigger>
          <Badge className={background_color + ' ' + text_color}>
            {insight_definition.name}
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{insight_definition.name}</h4>
            <p className="text-sm">
              {insight_definition.description}
            </p>
            <div className="flex">
              <Button asChild variant="link" className="">
                <Link href={insight_definition.url} className="flex ml-auto gap-1 link flex flex-row items-center text-purple-800">
                  Paper
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    )
  } else {
    return (
      <Badge className={background_color + ' ' + text_color}>
        {insight}
      </Badge>
    )
  }
}

export default InsightBadge;