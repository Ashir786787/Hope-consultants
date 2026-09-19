import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { PageHero } from "@/components/page-hero";
import CountryFilter from "@/components/countries/country-filter";
import { getCollection } from "@/lib/store";
import type { CountryDestination } from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Study Destinations",
  description:
    "Honest, current profiles of 14 countries for Pakistani students — real tuition ranges, living costs, intakes, requirements, and straight talk on visas and IELTS.",
};

export default async function DestinationsPage() {
  const countries = await getCollection<CountryDestination[]>("countries");
  return (
    <div className="w-full">
      <PageHero
        eyebrow={`${countries.length} destinations · 1 honest direction`}
        title="Study destinations, without the fairy tales"
        lede="Every profile lists what a year really costs, when intakes actually happen, whether you can study in English, and what the visa genuinely requires — including the things most agencies quietly skip."
      />

      <section className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6">
          <CountryFilter countries={countries} />
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
          <footer className="flex flex-col gap-1 text-sm text-muted-foreground">
            <Separator className="mb-4" />
            <p className="font-medium text-foreground">Costs are ranges, not quotes.</p>
            <p>
              Tuition and living figures are typical public-university ranges and change every
              year. Your final numbers depend on the specific university and city. We verify
              with you before anything is added to an application.
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
}
