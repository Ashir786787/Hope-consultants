export interface SiteFields {
  email: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
}

export const defaultSite: SiteFields = {
  email: "",
  phone: "",
  phoneHref: "",
  whatsapp: "",
};

export async function getSite(): Promise<SiteFields> {
  const { getCollection } = await import("@/lib/store");
  return getCollection<SiteFields>("site");
}