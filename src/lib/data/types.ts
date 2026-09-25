export type CountrySlug =
  | "italy"
  | "germany"
  | "sweden"
  | "finland"
  | "turkey"
  | "portugal"
  | "hungary"
  | "belgium"
  | "netherlands"
  | "lithuania"
  | "cyprus"
  | "malta"
  | "japan"
  | "china";

export type CountryGroup = "one" | "two";

export type CostBand = "low" | "medium" | "high";

export interface CountryTable {
  header: [string, string];
  rows: Array<[string, string]>;
}

export interface CountrySection {
  title: string;
  body?: string;
  items?: string[];
  table?: CountryTable;
}

export interface CountryDestination {
  slug: CountrySlug;
  name: string;
  flag: string;
  position: number;
  group: CountryGroup;
  costBand: CostBand;
  financialInsight: string;
  intro: string;
  sections: CountrySection[];
  journey: string;
  images: string[];
}

export type ScholarshipGroup = "spotlight" | "fully-funded" | "partially-funded";

export interface ScholarshipProgram {
  id: string;
  group: ScholarshipGroup;
  name: string;
  country: string;
  level?: string;
  deadline?: string;
  benefits: string;
  eligibility?: string;
  applyAt?: string;
  source?: string;
  universities?: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  quote: string;
  bioShort: string;
  bioLong: string;
}