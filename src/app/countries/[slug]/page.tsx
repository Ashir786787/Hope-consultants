import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/motion/reveal";
import { getCostBandLabel } from "@/lib/data/helpers";
import { getCollection } from "@/lib/store";
import type { CountryDestination, CountrySection, CountrySlug } from "@/lib/data/types";

type CountryPageProps = {
  params: Promise<{ slug: CountrySlug }>;
};

export const dynamicParams = false;
export const revalidate = false;

export async function generateStaticParams() {
  const countries = await getCollection<CountryDestination[]>("countries");
  return countries.map((country) => ({ slug: country.slug }));
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const countries = await getCollection<CountryDestination[]>("countries");
  const country = countries.find((item) => item.slug === slug);
  if (!country) return { title: "Destination not found | Hope Consultants" };
  return {
    title: `Study in ${country.name} | Hope Consultants`,
    description: country.intro,
  };
}

function SectionBlock({
  section,
  index,
}: {
  section: CountrySection;
  index: number;
}) {
  return (
    <Reveal delay={index * 0.05} className="w-full">
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold text-card-foreground">
          {section.title}
        </h2>
        <Separator className="max-w-md" />
        {section.body ? (
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{section.body}</p>
        ) : null}
        {section.items ? (
          <ul className="flex flex-col gap-3">
            {section.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
              >
                <span aria-hidden="true" className="mt-0.5 text-primary">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {section.table ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] divide-y divide-border border border-border text-left text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th scope="col" className="px-4 py-3 font-display font-semibold text-card-foreground">
                    {section.table.header[0]}
                  </th>
                  <th scope="col" className="px-4 py-3 font-display font-semibold text-card-foreground">
                    {section.table.header[1]}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {section.table.rows.map((row) => (
                  <tr key={row[0]}>
                    <td className="px-4 py-3 font-medium text-card-foreground">{row[0]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { slug } = await params;
  const countries = await getCollection<CountryDestination[]>("countries");
  const country = countries.find((item) => item.slug === slug);
  if (!country) notFound();

  const heroImage = country.images[0] ?? null;
  const galleryImages = country.images.slice(1);

  return (
    <main className="w-full">
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 right-[-10%] size-[30rem] rounded-full bg-[radial-gradient(circle,rgb(var(--hope-ember-rgb)/0.14),transparent_65%)]"
        />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6">
          <Reveal>
            <div className="flex items-center gap-6">
              <span aria-hidden="true" className="text-6xl sm:text-7xl">
                {country.flag}
              </span>
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Study in {country.name}
                </p>
                <h1 className="font-display text-4xl font-semibold leading-tight text-card-foreground sm:text-5xl">
                  {country.name}
                </h1>
                <Badge className="w-fit border-[rgb(var(--hope-ember-rgb)/0.4)] bg-hope-ember text-hope-midnight">
                  {getCostBandLabel(country.costBand)}
                </Badge>
              </div>
            </div>
          </Reveal>

          {heroImage ? (
            <Reveal delay={0.1}>
              <div className="relative aspect-16/9 w-full overflow-hidden rounded-3xl border border-border">
                <Image
                  src={heroImage}
                  alt={`${country.name} — study destination`}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1152px"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={0.15}>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">{country.intro}</p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="hope-card hope-card--light flex max-w-3xl flex-col gap-3 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Key financial insight
              </p>
              <p className="text-sm leading-7 text-card-foreground">{country.financialInsight}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {galleryImages.length > 0 ? (
        <section className="border-b border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {galleryImages.map((image, index) => (
                <Reveal key={image} delay={index * 0.08} className="h-full">
                  <li className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-border">
                    <Image
                      src={image}
                      alt={`${country.name} — landmark`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 560px"
                      className="object-cover"
                    />
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-14 sm:px-6">
        {country.sections.map((section, index) => (
          <SectionBlock key={section.title} section={section} index={index} />
        ))}
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6">
          <Reveal className="w-full">
            <div className="flex max-w-3xl flex-col gap-4">
              <h2 className="font-display text-2xl font-semibold text-card-foreground">
                Start your {country.name} journey
              </h2>
              <p className="text-base leading-7 text-muted-foreground">{country.journey}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap items-center gap-3">
            <Button nativeButton={false} render={<a href="/contact" />} size="lg">
              Book a free consultation
            </Button>
            <Link className={buttonVariants({ variant: "outline", size: "lg" })} href="/countries">
              All destinations
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}