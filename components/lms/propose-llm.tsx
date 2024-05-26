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
  logo_file: z.string().optional(),
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
  logo_file: "",
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
    console.log(JSON.stringify(data, null, 2))

    const title = encodeURIComponent(`Propose LLM: ${data.name}`)
    const body = encodeURIComponent(`## Model\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\n## Sources\n`)

    const issue_create_link = `https://github.com/DrChristophFH/lm-stack/issues/new?labels=llm-addition&assignees=DrChristophFH&body=${body}&title=${title}&template=llm-proposal.md`
    window.open(issue_create_link, "_blank")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Propose LLM</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Propose LLM</DialogTitle>
          <DialogDescription>
            Propose a new LLM to be added to the stack.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name. It can be your real name or a
                    pseudonym. You can only change this once every 30 days.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="release_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Release Date</FormLabel>
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
                  <FormDescription>
                    The date the LLM was released.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name. It can be your real name or a
                    pseudonym. You can only change this once every 30 days.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usage_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name. It can be your real name or a
                    pseudonym. You can only change this once every 30 days.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <DialogFooter>
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