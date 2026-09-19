export interface SiteFields {
  email: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
}

export const defaultSite: SiteFields = {
  email: "hello@hopeconsultants.example",
  phone: "+92 (0) 000 000 0000",
  phoneHref: "+920000000000",
  whatsapp: "",
};

export async function getSite(): Promise<SiteFields> {
  const { getCollection } = await import("@/lib/store");
  return getCollection<SiteFields>("site");
}