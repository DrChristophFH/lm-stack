import { Readme } from "@/lib/types/llm";
import { Link, ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import Markdown from 'react-markdown'
import { useEffect, useState } from "react";
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

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
    }
  }, [readme]);

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <CardTitle>Readme</CardTitle>
        {readme && readme.url && <Button asChild size="sm" className="ml-auto gap-1">
          <Link href={readme.url}>
            View
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>}
      </CardHeader>
      <CardContent className={markdown ? 'prose max-w-none min-w-48' : ''}>
        {!readme &&
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
                  const { children, className, node, ...rest } = props
                  const match = /language-(\w+)/.exec(className || '')
                  return match ? (
                    <SyntaxHighlighter
                      {...rest}
                      PreTag="div"
                      children={String(children).replace(/\n$/, '')}
                      language={match[1]}
                      style={a11yDark}
                    />
                  ) : (
                    <code {...rest} className={className}>
                      {children}
                    </code>
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