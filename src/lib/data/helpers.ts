import type { CountryGroup } from "@/lib/data/types";

const groupLabels: Record<CountryGroup, string> = {
  one: "Priority group one",
  two: "Priority group two",
};

export function getCountryGroupLabel(group: CountryGroup): string {
  return groupLabels[group];
}