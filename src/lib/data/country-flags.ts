export const COUNTRY_ISO: Record<string, string> = {
  italy: "IT",
  germany: "DE",
  sweden: "SE",
  finland: "FI",
  turkey: "TR",
  portugal: "PT",
  hungary: "HU",
  belgium: "BE",
  netherlands: "NL",
  lithuania: "LT",
  cyprus: "CY",
  malta: "MT",
  japan: "JP",
  china: "CN",
};

export function isoFor(slug: string): string {
  return COUNTRY_ISO[slug] ?? "";
}
