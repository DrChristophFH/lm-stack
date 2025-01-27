export interface LLM {
  id: string;
  name: string;
  family: string;
  release_date: string;
  from: string;
  usage_type: string;
  description: string;
  readme?: Readme;
  model: Model;
  training: Training;
  license: string;
  license_url?: string;
  download_url?: string;
  paper_url?: string;
  bonus?: Bonus[];
  logo_file?: string;
  updated: string;
}

export interface Readme {
  url: string;
  raw_url?: string;
}

export interface Model {
  architecture: string;
  subtype: string;
  insights: string[];
  parameters: number;
  active_parameters?: number;
  context_size: number;
  tokenizer: string;
  hidden_size: number;
  vocab_size: number;
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