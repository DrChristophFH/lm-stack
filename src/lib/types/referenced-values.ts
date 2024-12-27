export interface RVCollection {
  "from": Organization[];
  "usage_types": UsageType[];
  "model": {
    "architecture": Architecture[];
    "insights": Insight[];
    "tokenizer": Tokenizer[];
    "positional_embedding": PositionalEmbedding[];
    "attention_variant": AttentionVariant[];
  };
  "license": License[];
}

export interface Organization {
  name: string;
  url: string;
  logo: string;
}

export interface UsageType {
  name: string;
  description: string;
}

export interface Architecture {
  name: string;
  description: string;
  subtypes: SubType[];
  paper?: string;
}

export interface SubType {
  name: string;
  description: string;
}

export interface Insight {
  name: string;
  description: string;
  url?: string;
  type: string;
}

export interface InsightType {
  id: string;
  color: string;
}
  
export interface Tokenizer {
  name: string;
  description: string;
  url: string;
}

export interface PositionalEmbedding {
  name: string;
  description: string;
}

export interface AttentionVariant {
  name: string;
  description: string;
}

export interface License {
  name: string;
  url: string;
}