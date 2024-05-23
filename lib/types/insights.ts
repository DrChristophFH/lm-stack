export interface Insights {
  model_insights: Insight[];
  companies: Company[];
}

export interface Insight {
  id: string;
  name: string;
  description: string;
  url: string;
}

export interface Company {
  id: string;
  name: string;
  url: string;
  logo: string;
}