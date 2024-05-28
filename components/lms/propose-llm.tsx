import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { cn } from "@/lib/utils";
import { CalendarIcon, GitPullRequestCreateArrow } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns"
import { Calendar } from "../ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

const ModelSchema = z.object({
  architecture: z.string(),
  subtype: z.string(),
  insights: z.array(z.string()),
  parameters: z.string(),
  active_parameters: z.string(),
  context_size: z.string(),
  tokenizer: z.string(),
  hidden_size: z.string(),
  vocab_size: z.string(),
  positional_embedding: z.string(),
  attention_variant: z.string(),
  activation: z.string(),
});

const TrainingSchema = z.object({
  tokens: z.string(),
});

const BonusSchema = z.object({
  type: z.string(),
  title: z.string(),
  url: z.string(),
});

const ReadmeSchema = z.object({
  raw: z.string().optional(),
  link: z.string().optional(),
});

const LLMFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  release_date: z.date(),
  from: z.string(),
  usage_type: z.string(),
  description: z.string(),
  readme: ReadmeSchema.optional(),
  model: ModelSchema,
  training: TrainingSchema,
  license: z.string(),
  license_url: z.string(),
  download: z.string(),
  paper: z.string(),
  bonus: z.array(BonusSchema),
  updated: z.string(),
});

type LLMFormValues = z.infer<typeof LLMFormSchema>

const defaultValues: LLMFormValues = {
  id: "",
  name: "",
  release_date: new Date(),
  from: "",
  usage_type: "",
  description: "",
  model: {
    architecture: "",
    subtype: "",
    insights: [],
    parameters: "",
    active_parameters: "",
    context_size: "",
    tokenizer: "",
    hidden_size: "",
    vocab_size: "",
    positional_embedding: "",
    attention_variant: "",
    activation: "",
  },
  training: {
    tokens: "",
  },
  license: "",
  license_url: "",
  download: "",
  paper: "",
  bonus: [],
  updated: "",
};

interface ProposeModelProps {
}

const ProposeModel: React.FC<ProposeModelProps> = ({ }) => {

  const form = useForm<LLMFormValues>({
    resolver: zodResolver(LLMFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const { fields, append } = useFieldArray({
    name: "bonus",
    control: form.control,
  })

  function onSubmit(data: LLMFormValues) {
    const temp : any = data

    temp.updated = new Date().toISOString().split("T")[0]
    temp.release_date = temp.release_date.toISOString().split("T")[0]

    const title = encodeURIComponent(`Propose LLM: ${temp.name}`)
    const body = encodeURIComponent(`## Model\n\`\`\`json\n${JSON.stringify(temp, null, 2)}\n\`\`\`\n\n## Sources\n`)

    const issue_create_link = `https://github.com/DrChristophFH/lm-stack/issues/new?labels=llm-addition&assignees=DrChristophFH&body=${body}&title=${title}&template=llm-proposal.md`
    window.open(issue_create_link, "_blank")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Propose LLM</Button>
      </DialogTrigger>
      <DialogContent className={"max-w-screen-lg overflow-y-scroll overflow-x-visible max-h-[90vh]"}>
        <DialogHeader>
          <DialogTitle>Propose LLM</DialogTitle>
          <DialogDescription>
            Propose a new LLM to be added to the stack.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gird-cols-1 gap-4">
            <div className="grid gird-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormDescription variant="info-hover">
                      The full name of the LLM.
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="OpenELM-270M" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="release_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div>
                      <FormLabel>Release Date</FormLabel>
                      <FormDescription variant="info-hover">
                        The date the LLM was released.
                      </FormDescription>
                    </div>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormDescription variant="info-hover">
                      The name of the company or organization that released the LLM.
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="Apple" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usage_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage-Type</FormLabel>
                    <FormDescription variant="info-hover">
                      The primary use case of the LLM.
                    </FormDescription>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a usage type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GP-LLM">General-Purpose-LLM</SelectItem>
                        <SelectItem value="Code-LLM">Code-LLM</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Accordion type="multiple" className="mt-8">
              <AccordionItem value="item-1">
                <AccordionTrigger>Model Details</AccordionTrigger>
                <AccordionContent className="grid gird-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="model.architecture"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Architecture</FormLabel>
                        <FormDescription variant="info-hover">
                          The base architecture. (e.g. Transformer, SSM, LSTM, etc.)
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="Transformer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model.subtype"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormDescription variant="info-hover">
                          The sub architecture type. (e.g. decoder-only, encoder-only, etc.)
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="decoder-only" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model.parameters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parameters</FormLabel>
                        <FormDescription variant="info-hover">
                          The number of parameters in the model. (e.g. 270M, 1.3B, etc.)
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="270M" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model.active_parameters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Active Parameters</FormLabel>
                        <FormDescription variant="info-hover">
                          The number of parameters in the model. (e.g. 270M, 1.3B, etc.)
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="270M" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model.context_size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Context Size</FormLabel>
                        <FormDescription variant="info-hover">
                          The context size of the model, i.e. the number of tokens it can process at once. (e.g. 1024, 2048, etc.)
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="2048" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model.tokenizer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tokenizer</FormLabel>
                        <FormDescription variant="info-hover">
                          The name of the tokenizer used by the model. (e.g. SentencePiece, tiktoken, etc.)
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="SentencePiece" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model.hidden_size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hidden Size</FormLabel>
                        <FormDescription variant="info-hover">
                          The hidden size of the model. This is also the size of the embeddings. (e.g. 768, 1024, etc.)
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="4096" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model.vocab_size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vocabulary Size</FormLabel>
                        <FormDescription variant="info-hover">
                          The size of the vocabulary used by the model. (e.g. 32k, 64k, etc.)
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="32k" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model.positional_embedding"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Positional Embedding</FormLabel>
                        <FormDescription variant="info-hover">
                          The type of positional embedding used by the model. (e.g. RoPe, Sinusoidal, etc.)
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="RoPE" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model.attention_variant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attention Variant</FormLabel>
                        <FormDescription variant="info-hover">
                          The type of attention mechanism used by the model. (e.g. Multi-Head, Grouped-Query, Multi-Query, etc.)
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="Grouped-Query Attention" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model.activation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activation Function</FormLabel>
                        <FormDescription variant="info-hover">
                          The neural network activation function used by the model. (e.g. ReLU, GELU, SwiGLU, etc.)
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="SwiGLU" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Training Details</AccordionTrigger>
                <AccordionContent className="grid gird-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="training.tokens"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tokens trained on</FormLabel>
                        <FormDescription variant="info-hover">
                          The number of tokens the model was trained on. (e.g. 1T, 10T, etc.)
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="1T" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Links</AccordionTrigger>
                <AccordionContent className="grid gird-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="license"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Name</FormLabel>
                        <FormDescription variant="info-hover">
                          The name of the license under which the model is released. (e.g. MIT, Apache 2.0, etc.)
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="Apache 2.0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="license_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License URL</FormLabel>
                        <FormDescription variant="info-hover">
                          The URL to the license text.
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="https://huggingface.co/apple/OpenELM-3B/blob/main/LICENSE" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="download"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Download URL</FormLabel>
                        <FormDescription variant="info-hover">
                          The URL to the download page of the model.
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="https://huggingface.co/apple/OpenELM-3B" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paper"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paper URL</FormLabel>
                        <FormDescription variant="info-hover">
                          The URL to the paper/technical report of the model. This <strong>should</strong> be an arxiv link.
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="https://arxiv.org/abs/2404.14619" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* <div>
              {fields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name="bonus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>
                        URLs
                      </FormLabel>
                      <FormDescription className={cn(index !== 0 && "sr-only")}>
                        Add links to your website, blog, or social media profiles.
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ value: "" })}
              >
                Add URL
              </Button>
            </div> */}
            <DialogFooter className="sticky bottom-0 mt-6">
              <Button type="submit">
                Propose
                <GitPullRequestCreateArrow className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  )
}

export default ProposeModel;