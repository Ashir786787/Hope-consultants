import type { Metadata } from "next";

import { ServiceBrowser } from "@/components/services/service-browser";
import { DarkPageHero } from "@/components/sections/dark-page-hero";
import { getCollection } from "@/lib/store";
import type { Service } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services | Hope Consultants",
  description:
    "Ten areas of honest, step-by-step guidance for Pakistani students planning to study abroad — selection, admissions, documents, scholarships, visas and arrival support.",
};

export default async function ServicesPage() {
  const services = await getCollection<Service[]>("services");
  return (
    <main id="main-content" className="w-full">
      <DarkPageHero
        eyebrow="Services"
        title="What we actually help with"
        lede="Ten areas of step-by-step guidance — from choosing where to go, to the day you arrive. No guaranteed admissions, no promised visas, no invented scholarships."
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <ServiceBrowser services={services} />
      </section>
    </main>
  );
}
