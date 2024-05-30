import {
  ArrowRightFromLine,
  Copy,
  Download,
  FileJson,
  GraduationCap,
  Mail,
  MoreVertical,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { LLM } from "@/lib/types/llm"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Insights } from "@/lib/types/insights"
import InsightBadge from "./insight-badge"

interface ModelCardProps {
  llm: LLM | null;
  insights: Insights | null;
  className?: string;
}

const ModelCard: React.FC<ModelCardProps> = ({ llm, insights, className }) => {
  if (!llm || !insights) {
    return null;
  }

  const company = insights.companies[llm.from];
  const fall_back_file = llm.from.replace(" ", "_").toLowerCase() + `.svg`

  const logo_path = `logos/` + (
    company ? company.logo :
      llm.logo_file ? llm.logo_file :
        fall_back_file
  )

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(llm, null, 2))
  }

  const exportToJSON = () => {
    const data = new Blob([JSON.stringify(llm, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'model.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <Card className={cn("overflow-hidden h-min", className)}>
      <CardHeader className="flex flex-row items-start bg-muted/50 py-6 pr-6 pl-4">
        <Avatar className="h-12 w-12 self-center mr-2">
          <AvatarImage src={logo_path} className="object-scale-down p-1" />
          <AvatarFallback className="text-accent-background">
            {company ? company.name : llm.from}
          </AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {llm.name}
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={copyToClipboard}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </CardTitle>
          <CardDescription>Release Date: {llm.release_date}</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          {/* <Button size="sm" variant="outline" className="h-8 gap-1">
            <Truck className="h-3.5 w-3.5" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              Track Order
            </span>
          </Button> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{llm.name}</DropdownMenuLabel>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                <span>Propose Change</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={copyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copy</span>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <ArrowRightFromLine className="mr-2 h-4 w-4" />
                    <span>Export</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onSelect={exportToJSON}>
                        <FileJson className="mr-2 h-4 w-4" />
                        <span>JSON</span>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>XML</span>
                      </DropdownMenuItem> */}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Outline</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Id
              </span>
              <span>
                {llm.id}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Name
              </span>
              <span>
                {llm.name}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                From
              </span>
              <span>
                {llm.from}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                License
              </span>
              <span>
                <a href={llm.license_url}>
                  {llm.license}
                </a>
              </span>
            </li>
          </ul>
          <div className="grid grid-cols-2 gap-4 justify-items-stretch">
            <Button disabled={llm.download === ""} asChild={llm.download !== ""} variant="outline" className={llm.paper !== "" ? "gap-1" : "border-rose-400 bg-rose-300"}>
              {llm.download === "" ? "Closed Source" : (
                <Link href={llm.download}>
                  Download
                  <Download className="ml-2 h-4 w-4" />
                </Link>
              )}
            </Button>
            <Button disabled={llm.paper === ""} asChild={llm.paper !== ""} variant="outline" className="gap-1">
              {llm.paper === "" ? "No Paper" : (
                <Link href={llm.paper}>
                  Paper
                  <GraduationCap className="ml-2 h-4 w-4" />
                </Link>
              )}
            </Button>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Architecture</div>
          <div className="grid gird-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Base
                </span>
                <span>
                  {llm.model.architecture}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Type
                </span>
                <span>
                  {llm.model.subtype}
                </span>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Parameters
                </span>
                <span>
                  {llm.model.parameters}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Active Parameters
                </span>
                <span>
                  {llm.model.active_parameters}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap col-span-2 gap-2">
              <span className="text-muted-foreground mr-4">
                Additional Insights
              </span>
              {llm.model.insights.map((insight, index) => (
                <InsightBadge insight={insight} insights={insights} key={index} />
              ))}
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Input</div>
          <div className="grid gird-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Context Size
                </span>
                <span>
                  {llm.model.context_size}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Embedding Size
                </span>
                <span>
                  {llm.model.hidden_size}
                </span>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Tokenizer
                </span>
                <span>
                  {llm.model.tokenizer}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Vocabulary Size
                </span>
                <span>
                  {llm.model.vocab_size}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Internals</div>
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Positional Embedding
              </span>
              <span>
                {llm.model.positional_embedding}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Attention Variant
              </span>
              <span>
                {llm.model.attention_variant}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Activation Function
              </span>
              <span>
                {llm.model.activation}
              </span>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Training</div>
          <div className="grid gird-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Tokens
                </span>
                <span>
                  {llm.training.tokens}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        {/* TODO: Map bonus to link buttons with optional icons based on their type */}
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated <time dateTime={llm.updated}>{llm.updated}</time>
        </div>
        {/* <Pagination className="ml-auto mr-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6">
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Previous Order</span>
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6">
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Next Order</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination> */}
      </CardFooter>
    </Card>
  )
}

export default ModelCard;