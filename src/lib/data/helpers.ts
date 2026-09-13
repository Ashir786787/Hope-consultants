import type { CostBand } from "@/lib/data/types";

/**
 * Human-readable label for a country's overall cost band.
 * Pure map — no fabricated figures, just a wording ladder for the band.
 */
const bandLabels: Record<CostBand, string> = {
  low: "Low cost",
  medium: "Moderate cost",
  high: "Higher cost",
};

export function getCostBandLabel(band: CostBand): string {
  return bandLabels[band];
}
