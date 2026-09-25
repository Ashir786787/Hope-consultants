import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { DarkSection } from "@/components/sections/dark-section";
import { FlightPath } from "@/components/motion/flight-path";
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
  dark,
}: {
  section: CountrySection;
  index: number;
  dark: boolean;
}) {
  return (
    <Reveal delay={index * 0.05} className="w-full">
      <div className="flex flex-col gap-4">
        <h2
          className={
            dark
              ? "font-display text-2xl font-semibold text-hope-white"
              : "font-display text-2xl font-semibold text-card-foreground"
          }
        >
          {section.title}
        </h2>
        <Separator
          className={
            dark ? "max-w-md bg-[rgb(255_255_255/0.10)]" : "max-w-md"
          }
        />
        {section.body ? (
          <p
            className={
              dark
                ? "max-w-2xl text-sm leading-7 text-hope-white/70"
                : "max-w-2xl text-sm leading-7 text-muted-foreground"
            }
          >
            {section.body}
          </p>
        ) : null}
        {section.items ? (
          <ul className="flex flex-col gap-3">
            {section.items.map((item) => (
              <li
                key={item}
                className={
                  dark
                    ? "flex items-start gap-3 text-sm leading-6 text-hope-white/70"
                    : "flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                }
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
            <table
              className={
                dark
                  ? "w-full min-w-[32rem] divide-y divide-[rgb(255_255_255/0.10)] border border-[rgb(255_255_255/0.10)] text-left text-sm"
                  : "w-full min-w-[32rem] divide-y divide-border border border-border text-left text-sm"
              }
            >
              <thead className={dark ? "bg-[rgb(255_255_255/0.04)]" : "bg-muted/40"}>
                <tr>
                  <th
                    scope="col"
                    className={
                      dark
                        ? "px-4 py-3 font-display font-semibold text-hope-white"
                        : "px-4 py-3 font-display font-semibold text-card-foreground"
                    }
                  >
                    {section.table.header[0]}
                  </th>
                  <th
                    scope="col"
                    className={
                      dark
                        ? "px-4 py-3 font-display font-semibold text-hope-white"
                        : "px-4 py-3 font-display font-semibold text-card-foreground"
                    }
                  >
                    {section.table.header[1]}
                  </th>
                </tr>
              </thead>
              <tbody
                className={
                  dark ? "divide-y divide-[rgb(255_255_255/0.10)]" : "divide-y divide-border"
                }
              >
                {section.table.rows.map((row) => (
                  <tr key={row[0]}>
                    <td
                      className={
                        dark
                          ? "px-4 py-3 font-medium text-hope-white"
                          : "px-4 py-3 font-medium text-card-foreground"
                      }
                    >
                      {row[0]}
                    </td>
                    <td
                      className={
                        dark ? "px-4 py-3 text-hope-white/70" : "px-4 py-3 text-muted-foreground"
                      }
                    >
                      {row[1]}
                    </td>
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
    <main id="main-content" className="w-full">
      <section className="relative isolate overflow-hidden border-b border-[rgb(255_255_255/0.10)] bg-hope-midnight">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 right-[-10%] size-[30rem] rounded-full bg-[radial-gradient(circle,rgb(var(--hope-ember-rgb)/0.14),transparent_65%)]"
        />
        <div
          aria-hidden="true"
          className="hope-dot-grid pointer-events-none absolute inset-0 opacity-[0.06]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-50"
        >
          <FlightPath
            d="M-40 170 C 220 30, 500 210, 760 90 S 1120 20, 1260 100"
            className="h-full w-full"
          />
        </div>
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6 sm:py-20">
          <Reveal>
            <div className="flex items-center gap-6">
              <span aria-hidden="true" className="text-6xl sm:text-7xl">
                {country.flag}
              </span>
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium uppercase tracking-wider text-hope-white/70">
                  Study in {country.name}
                </p>
                <h1 className="font-display text-4xl font-semibold leading-tight text-hope-white sm:text-5xl">
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
              <div className="relative aspect-16/9 w-full overflow-hidden rounded-3xl border border-[rgb(255_255_255/0.10)]">
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
            <p className="max-w-2xl text-base leading-7 text-hope-white/70">{country.intro}</p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="hope-card flex max-w-3xl flex-col gap-3 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-hope-white/70">
                Key financial insight
              </p>
              <p className="text-sm leading-7 text-hope-white">{country.financialInsight}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {galleryImages.length > 0 ? (
        <section>
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

      {country.sections.map((section, index) =>
        index % 2 === 0 ? (
          <section
            key={section.title}
            className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-14 sm:px-6"
          >
            <SectionBlock section={section} index={index} dark={false} />
          </section>
        ) : (
          <DarkSection key={section.title}>
            <SectionBlock section={section} index={index} dark />
          </DarkSection>
        )
      )}

      <DarkSection>
        <div className="flex flex-col items-start gap-6">
          <Reveal className="w-full">
            <div className="flex max-w-3xl flex-col gap-4">
              <h2 className="font-display text-2xl font-semibold text-hope-white">
                Start your {country.name} journey
              </h2>
              <p className="text-base leading-7 text-hope-white/70">{country.journey}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button nativeButton={false} render={<a href="/contact" />} size="lg">
                Book a free consultation
              </Button>
            </Magnetic>
            <Link
              className={buttonVariants({ variant: "outline", size: "lg" })}
              href="/countries"
            >
              All destinations
            </Link>
          </Reveal>
        </div>
      </DarkSection>
    </main>
  );
}