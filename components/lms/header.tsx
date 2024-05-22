import Link from "next/link"
import Image from "next/image"

import Icon from '@/public/icon.svg'

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react";

export function Header() {
  return (<header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
    <nav className="flex items-center space-x-1">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Image src={Icon} alt={""} className="h-6 w-auto" />
        <span className="hidden font-bold sm:inline-block">lm-stack</span>
      </Link>
    </nav>
    <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <form className="ml-auto flex-1 sm:flex-initial">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search for a specific LLM..." className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[500px]" />
        </div>
      </form>
    </div>
  </header>);
}