import { Readme } from "@/lib/types/llm";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import Markdown from 'react-markdown'
import { useEffect, useState } from "react";
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Link from "next/link";

interface ModelReadmeProps {
  readme?: Readme;
}

const ModelReadme: React.FC<ModelReadmeProps> = ({ readme }) => {
  const [markdown, setMarkdown] = useState<string | null>(null);

  useEffect(() => {
    if (readme && readme.raw) {
      fetch(readme.raw)
        .then(response => response.text())
        .then(text => {
          // remove any frontmatter
          text = text.replace(/---[\s\S]*?---/, '')
          setMarkdown(text)
        });
    } else {
      setMarkdown(null);
    }
  }, [readme]);

  if (!readme) {
    return null;
  }

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <CardTitle>Readme</CardTitle>
        {readme.link && (
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href={readme.link}>
              View
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>)
        }
      </CardHeader>
      <CardContent className={markdown ? 'prose dark:prose-invert max-w-none min-w-48' : ''}>
        {!readme || !markdown &&
          (
            <div className="flex justify-center content-center">
              <span className="text-muted-foreground">No readme available</span>
            </div>
          )
        }
        {readme && markdown &&
          (
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                code(props) {
                  const { children, className, node } = props
                  const match = /language-(\w+)/.exec(className || '')
                  return match ? (
                    <SyntaxHighlighter
                      PreTag="div"
                      language={match[1]}
                      style={a11yDark}
                    >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                  ) : (
                    <code className={className}>
                      {children}
                    </code>
                  )
                },
                table(props) {
                  return (
                    <div className="overflow-x-auto">
                      <table {...props} />
                    </div>
                  )
                }
              }}
            >
              {markdown}
            </Markdown>
          )
        }
      </CardContent>
    </Card>
  );
}

export default ModelReadme;