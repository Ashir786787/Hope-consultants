import { cache } from "react";

export interface SiteFields {
  email: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  tiktok: string;
}

export const defaultSite: SiteFields = {
  email: "hopeconsultants.pk@gmail.com",
  phone: "",
  phoneHref: "",
  whatsapp: "",
  tiktok: "https://www.tiktok.com/@hope.consultants",
};

export const getSite = cache(async (): Promise<SiteFields> => {
  const { getCollection } = await import("@/lib/store");
  return getCollection<SiteFields>("site");
});