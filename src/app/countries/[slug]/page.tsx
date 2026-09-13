import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { countries, getCountry } from "@/lib/data/countries";
import { getCostBandLabel } from "@/lib/data/helpers";
import type {
  CountrySlug,
  CostBand,
  CountryCost,
} from "@/lib/data/types";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const dynamicParams = false;
export const revalidate = false;

export function generateStaticParams() {
  return countries.map((country) => ({ slug: country.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: CountrySlug }> }): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountry(slug);
  return {
    title: country?.name ?? "Country not found",
    description: country?.tagline,
  };
}

export default async function CountryPage({ params }: { params: Promise<{ slug: CountrySlug }> }) {
  const { slug } = await params;
  const country = getCountry(slug);
  if (!country) notFound();
  const cost = country.cost;

  return (
    <main className="w-full">
      <section className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="text-4xl">{country.flag}</span>
              <h1 className="font-display text-4xl font-semibold text-card-foreground">{country.name}</h1>
            </div>
            <Badge className={cn(badgeVariants(), "uppercase")}>{getCostBandLabel(cost.band)}</Badge>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">{country.tagline}</p>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{country.description}</p>
          <Separator />
          <div className="grid w-full grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Tuition / yr</span>
              <span className="font-display text-xl font-semibold">€{cost.tuitionEurMin.toLocaleString()}–{cost.tuitionEurMax.toLocaleString()}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Living / mo</span>
              <span className="font-display text-xl font-semibold">€{cost.livingEurMin.toLocaleString()}–{cost.livingEurMax.toLocaleString()}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Intakes</span>
              <span className="font-display text-xl font-semibold">{country.intakes.join(" · ")}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">English</span>
              <span className="font-display text-xl font-semibold">{country.englishFriendly ? "Yes" : "Varies"}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-xl font-semibold">Why {country.name}</h2>
            <p className="text-sm leading-7 text-muted-foreground">{country.description}</p>
            <Separator />
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Costs & funding</h3>
            <p className="text-sm leading-7 text-muted-foreground">{cost.fundedByDefault ? "Public universities are typically tuition-free in " + country.name + ". Tuition only applies at some private or professional institutions." : "Public universities charge modest annual tuition. Living costs are the real budget driver."}</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Popular fields</h3>
            <div className="flex flex-wrap gap-2">
              {country.popularFields.map((field) => (
                <Badge key={field} variant="secondary">{field}</Badge>
              ))}
            </div>
            <Separator />
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Requirements</h3>
            <ul className="flex flex-col gap-2">
              {country.requirements.map((req) => (
                <li key={req} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                  <span aria-hidden="true" className="mt-0.5 text-primary">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
            <Separator />
            <div className="flex flex-wrap gap-3">
              <Button render={<a href={"/contact?country=" + country.slug} />} size="lg">
                Ask about {country.name}
              </Button>
              <a className={buttonVariants({ variant: "outline", size: "lg" })} href="/countries">
                All destinations
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}