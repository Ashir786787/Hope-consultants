/**
 * Core domain types for the entire Hope Consultants site.
 * Shared across data layer, page components, and form schemas.
 */

export type CountrySlug =
  | "italy"
  | "germany"
  | "belgium"
  | "sweden"
  | "portugal"
  | "lithuania"
  | "turkey"
  | "china"
  | "japan"
  | "cyprus"
  | "hungary"
  | "malta"
  | "finland"
  | "netherlands";

export type CostBand = "low" | "medium" | "high";

export interface CountryCost {
  /** Annual tuition in EUR (typical range, undergrad public programs) */
  tuitionEurMin: number;
  tuitionEurMax: number;
  /** Monthly cost of living in EUR (typical student budget, incl. rent) */
  livingEurMin: number;
  livingEurMax: number;
  band: CostBand;
  /** Is funding the norm (public university, low/no tuition)? */
  fundedByDefault: boolean;
}

export interface CountryDestination {
  slug: CountrySlug;
  name: string;
  /** One-line positioning for study-abroad cards */
  tagline: string;
  /** Longer editorial "why this country" blurb */
  description: string;
  /** Emoji flag (no rainbow UI — single glyph per country) */
  flag: string;
  /** Language English is widely spoken in → IELTS waiver usually possible */
  englishFriendly: boolean;
  /** Typical academic intakes */
  intakes: string[];
  /** General admission requirements (always approximate — flag where unsure) */
  requirements: string[];
  /** Popular study fields for Pakistani students */
  popularFields: string[];
  cost: CountryCost;
  /** Do public universities charge meaningful tuition? (flag honesty) */
  tuitionNote: string;
  /** Is a student visa straightforward APART from IELTS? */
  visaNote: string;
}
