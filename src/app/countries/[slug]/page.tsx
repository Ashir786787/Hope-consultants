import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { countries, getCountry } from "@/lib/data/countries";
import { getCostBandLabel } from "@/lib/data/helpers";
import type { CountrySlug } from "@/lib/data/types";

type CountryPageProps = {
  params: Promise<{ slug: CountrySlug }>;
};

export const dynamicParams = false;
export const revalidate = false;

export function generateStaticParams() {
  return countries.map((country) => ({ slug: country.slug }));
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountry(slug);
  if (!country) return { title: "Destination not found | Hope Consultants" };
  return {
    title: `${country.name} — Study costs & requirements | Hope Consultants`,
    description: `${country.description} Honest study cost guidance for Pakistani students.`,
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { slug } = await params;
  const country = getCountry(slug);
  if (!country) notFound();

  const cost = country.cost;
  const fields = country.popularFields;

  return (
    <main className="w-full">
      <section className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6">
          <div className="flex items-center gap-6">
            <span aria-hidden="true" className="text-6xl sm:text-7xl">
              {country.flag}
            </span>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {country.name}
              </p>
              <h1 className="font-display text-4xl font-semibold leading-tight text-card-foreground sm:text-5xl">
                {country.tagline}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                {country.description}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid w-full grid-cols-2 gap-8 gap-y-10 sm:grid-cols-4">
            <div className="flex flex-col gap-168">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Tuition per year
              </span>
              <span className="font-display text-2xl font-semibold text-card-foreground">
                €{cost.tuitionEurMin.toLocaleString("en-PK")}–€{cost.tuitionEurMax.toLocaleString("en-PK")}
              </span>
              <span className="text-xs leading-5 text-muted-foreground">{country.tuitionNote}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Living per month
              </span>
              <span className="font-display text-2xl font-semibold text-card-foreground">
                €{cost.livingEurMin.toLocaleString("en-PK")}–€{cost.livingEurMax.toLocaleString("en-PK")}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                English-friendliness
              </span>
              <Badge variant="secondary" className="w-fit">
                {country.englishFriendly ? "English-friendly" : "Partially English"}
              </Badge>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Intakes
              </span>
              <span className="font-display text-lg font-semibold text-card-foreground">
                {country.intakes.join(" · ")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid w-full gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-2xl font-semibold text-card-foreground">
                Popular fields of study
              </h2>
              <div className="flex flex-wrap gap-2">
                {fields.map((field) => (
                  <Badge key={field} variant="outline">
                    {field}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-2xl font-semibold text-card-foreground">
                Typical entry requirements
              </h2>
              <ul className="flex flex-col gap-3">
                {country.requirements.map((req) => (
                  <li key={req} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                    <span aria-hidden="true" className="mt-0.5 text-primary">
                      ✓
                    </span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="flex flex-col gap-6 border-l border-border pl-8">
            <h2 className="font-display text-2xl font-semibold text-card-foreground">
              What this country costs
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">Overall cost band</span>
                <Badge>{getCostBandLabel(cost.band)}</Badge>
              </div>
              <Separator />
              {country.visaNote ? (
                <p className="text-sm leading-6 text-muted-foreground">{country.visaNote}</p>
              ) : null}
            </div>
            <Separator />
            <div className="flex flex-col gap-3">
              <Button nativeButton={false} render={<a href={`/contact?country=${country.slug}`} />} size="lg">
                Ask about {country.name}
              </Button>
              <Link className={buttonVariants({ variant: "outline", size: "lg" })} href="/countries">
                All destinations
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
