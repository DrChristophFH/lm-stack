export interface ModelInsights {
  id: string;
}

export interface Model {
  architecture: string;
  subtype: string;
  insights: ModelInsights[];
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

export interface LLM {
  id: string;
  name: string;
  release_date: string;
  from: string;
  description: string;
  model: Model;
  training: Training;
  license: string;
  license_url: string;
  download: string;
  paper: string;
  updated: string;
}