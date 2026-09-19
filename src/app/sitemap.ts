import type { MetadataRoute } from "next";

import { getCollection } from "@/lib/store";
import type { Service } from "@/lib/data/services";
import type { CountryDestination } from "@/lib/data/types";

const BASE_URL = "https://www.hopeconsultants.pk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [countries, services] = await Promise.all([
    getCollection<CountryDestination[]>("countries"),
    getCollection<Service[]>("services"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/process`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/services`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/countries`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/scholarships`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/testimonials`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/resources`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const countryRoutes: MetadataRoute.Sitemap = countries.map((country) => ({
    url: `${BASE_URL}/countries/${country.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...countryRoutes, ...serviceRoutes];
}