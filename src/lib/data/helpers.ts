import type { CountryGroup, CostBand } from "@/lib/data/types";

const bandLabels: Record<CostBand, string> = {
  low: "Low cost",
  medium: "Moderate cost",
  high: "Higher cost",
};

export function getCostBandLabel(band: CostBand): string {
  return bandLabels[band];
}

const groupLabels: Record<CountryGroup, string> = {
  one: "Priority group one",
  two: "Priority group two",
};

export function getCountryGroupLabel(group: CountryGroup): string {
  return groupLabels[group];
}