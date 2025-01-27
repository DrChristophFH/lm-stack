import Link from "next/link"
import Image from "next/image"

import Icon from '@/public/icon.svg'

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react";
import ProposeModel from "./propose-llm";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "../ui/icons";
import { siteConfig } from "@/config/site";
import { ModeToggle } from "../mode-toggle";
import { AutoComplete, type Option } from "../autocomplete";
import { LLM } from "@/lib/types/llm";
import { useState } from "react";

interface Props {
  llms: LLM[];
  selectCallback: (llm: LLM) => void;
}

export function Header({ llms, selectCallback }: Props) {
  const [value, setValue] = useState<Option>()

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-20">
      <nav className="flex items-center space-x-1">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src={Icon} alt={""} className="h-6 w-auto" />
          <span className="hidden font-bold sm:inline-block">lm-stack</span>
        </Link>
      </nav>
      <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <ModeToggle />
        <AutoComplete
          options={llms.map((llm) => ({
            value: llm.id,
            label: llm.name,
          }))}
          emptyMessage="No resulsts."
          placeholder="Find something"
          onValueChange={(value) => {
            setValue(value)
            let llm = llms.find((llm) => llm.id === value?.value)
            if (llm) selectCallback(llm)
          }}
          isLoading={llms.length === 0}
          value={value}
        />
      </div>
      <ProposeModel />
      <nav className="flex items-center">
        <Link
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
        >
          <div
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "w-9 px-0"
            )}
          >
            <Icons.gitHub className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </div>
        </Link>
      </nav>
    </header>
  );
}