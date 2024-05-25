export interface ModelInsight {
  name: string;
  description: string;
  url: string;
  color: string;
}

export interface Company {
  name: string;
  url: string;
  logo: string;
}

export interface ModelInsights {
  [key: string]: ModelInsight;
}

export interface Companies {
  [key: string]: Company;
}

export interface Insights {
  model_insights: ModelInsights;
  companies: Companies;
}