export interface Model {
  architecture: string;
  subtype: string;
  insights: string[];
  parameters: string;
  active_parameters: string;
  context_size: string;
  tokenizer: string;
  hidden_size: string;
  vocab_size: string;
  positional_embedding: string;
  attention_variant: string;
  activation: string;
}

export interface Training {
  tokens: string;
}

export interface Bonus {
  type: string;
  title: string;
  url: string;
}

export interface Readme {
  raw?: string;
  url?: string;
}

export interface LLM {
  id: string;
  name: string;
  release_date: string;
  from: string;
  logo_file?: string;
  usage_type: string;
  description: string;
  readme?: Readme;
  model: Model;
  training: Training;
  license: string;
  license_url: string;
  download: string;
  paper: string;
  bonus: Bonus[];
  updated: string;
}