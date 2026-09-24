import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Marquee } from "@/components/motion/marquee";
import { Hero } from "@/components/sections/hero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getSite } from "@/lib/site";
import { getCollection } from "@/lib/store";
import { getCostBandLabel } from "@/lib/data/helpers";
import type { CountryDestination, CostBand } from "@/lib/data/types";
import type { Service } from "@/lib/data/services";
import type { ProcessStep } from "@/lib/data/process";

const bandColor: Record<CostBand, string> = {
  low: "border-[rgb(var(--hope-ember-rgb)/0.4)] bg-hope-ember text-hope-midnight",
  medium: "border-[rgb(var(--hope-midnight-rgb)/0.18)] bg-hope-midnight text-hope-white",
  high: "border-[rgb(var(--hope-obsidian-rgb)/0.18)] bg-hope-obsidian text-hope-white",
};

const HERO = {
  eyebrow: "Hope Consultants",
  headline: "From your first question to your first day abroad, we're with you.",
  sub: "Admissions, scholarships, visas, and arrival guidance for students from Pakistan, all in one place, with honest advice and affordable support.",
  primaryCta: "Book a Free Consultation",
  secondaryCta: "Chat on WhatsApp",
} as const;

const INTRO = {
  title: "Studying abroad shouldn't mean piecing together answers from a dozen sources.",
  body: "Hope Consultants guides Pakistani students through every stage â€” choosing where to go, getting in, funding it, and actually arriving â€” with honest advice and affordable support.",
} as const;

const HOW_IT_WORKS = {
  eyebrow: "How it works",
  title: "Seven steps, from first call to first day on campus.",
  lede: "A clear path with a real person alongside you at every stage.",
} as const;

const OUR_SERVICES = {
  eyebrow: "Our services",
  title: "Everything you need, in one place.",
  lede: "Ten focused services that carry you from the first conversation to the day you land.",
} as const;

const FOR_PARENTS = {
  title: "For parents",
  body: "Studying abroad is a family decision. We walk parents through costs, safety and timelines in a calm, honest conversation â€” so everyone agrees on the plan before anything starts.",
  cta: "Book a Parent Session",
} as const;

const COMING_SOON = {
  eyebrow: "Coming soon",
  title: "Two things we're building next.",
  items: [
    {
      name: "Language Classes & Courses",
      description: "In-house language preparation for IELTS and the languages your destination actually needs.",
    },
    {
      name: "Student Profile Assessment Tool",
      description: "A quick, honest read on where your grades, budget and goals realistically point.",
    },
  ],
  cta: "Notify Me When It Launches",
} as const;

const WHY_US = {
  eyebrow: "Why students and families choose us",
  title: "Honest advice, real people, no empty promises.",
  items: [
    {
      title: "We tell you the truth",
      body: "No inflated promises, no fake success stories. If a goal isn't realistic, we say so in the first conversation.",
    },
    {
      title: "Verified institutions only",
      body: "We verify every university, scholarship and agent before recommending it â€” so you never commit to something that isn't what it claims.",
    },
    {
      title: "We're with you the whole way",
      body: "From the first question to your first day abroad, a real person stays alongside you â€” not a form that disappears after payment.",
    },
    {
      title: "Affordable, transparent support",
      body: "Clear fees explained before you commit, and guidance in a language you actually understand.",
    },
  ],
} as const;

const FAQ = {
  eyebrow: "FAQ",
  title: "Questions families actually ask.",
  items: [
    {
      q: "Do you guarantee admission or a scholarship?",
      a: "No. Admission, scholarships and visas rest with universities, scholarship bodies and immigration authorities. We prepare the strongest honest application we can, and we never promise an outcome we don't control.",
    },
    {
      q: "How much does it cost to work with you?",
      a: "Fees depend on the service and are agreed with you in writing before any work begins. The first consultation is free, and there are no hidden charges.",
    },
    {
      q: "When should I start planning to study abroad?",
      a: "Ideally 9â€“12 months before your intended intake. Some routes â€” like national scholarships â€” have fixed annual windows, so starting early keeps every option open.",
    },
    {
      q: "Can you help if I already have an offer from an agent?",
      a: "Yes. We independently verify the institution, the offer and the pressure to pay before you commit a rupee. Many families come to us exactly for this check.",
    },
    {
      q: "Do you only work with European destinations?",
      a: "No. We work with students across Europe, Asia and beyond â€” including destinations like Japan, China, TÃ¼rkiye and Australia, depending on what fits your profile.",
    },
  ],
} as const;

const FINAL_CTA = {
  title: "Not sure where to start? Start with a conversation.",
  body: "Tell us where you want to study and what you're working with. We'll answer honestly â€” including whether we think the goal is realistic for you.",
} as const;

export const metadata = {
  title: "Hope Consultants | Study Abroad Guidance for Pakistani Students",
  description:
    "Hope Consultants guides Pakistani students through admissions, scholarships, visas and arrival â€” with honest advice and affordable support across 14 destinations.",
};

export default async function Home() {
  const [countries, services, processSteps] = await Promise.all([
    getCollection<CountryDestination[]>("countries"),
    getCollection<Service[]>("services"),
    getCollection<ProcessStep[]>("process"),
  ]);
  const site = await getSite();

  const sortedCountries = [...countries].sort((a, b) => a.position - b.position);
  const featuredCountries = sortedCountries.slice(0, 3);
  const featuredServices = services.slice(0, 3);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero
        countries={sortedCountries}
        services={services}
        processSteps={processSteps}
        whatsapp={site.whatsapp ?? ""}
      />

      <Marquee
        className="border-b border-border bg-hope-midnight py-5 text-hope-white"
        duration={30}
      >
        {sortedCountries.map((country) => (
          <span
            key={country.slug}
            className="mx-5 flex items-center gap-2 text-sm font-semibold tracking-[0.18em] uppercase"
          >
            <span aria-hidden="true" className="text-base">
              {country.flag}
            </span>
            {country.name}
          </span>
        ))}
      </Marquee>

      <section id="intro" className="border-b border-border">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal className="w-full">
            <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              {INTRO.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="w-full">
            <p className="max-w-xl text-base leading-7 text-muted-foreground">{INTRO.body}</p>
          </Reveal>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6">
          <Reveal className="w-full">
            <SectionHeading
              eyebrow={HOW_IT_WORKS.eyebrow}
              title={HOW_IT_WORKS.title}
              lede={HOW_IT_WORKS.lede}
            />
          </Reveal>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <Reveal key={step.step} delay={index * 0.05} className="h-full">
                <li className="hope-card hope-card--light flex h-full flex-col gap-3 p-6">
                  <span className="font-display text-4xl font-bold text-primary">
                    {String(step.step).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-card-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section id="services" className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6">
          <Reveal className="w-full">
            <SectionHeading
              eyebrow={OUR_SERVICES.eyebrow}
              title={OUR_SERVICES.title}
              lede={OUR_SERVICES.lede}
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.05} className="h-full">
                <article className="hope-card hope-card--light flex h-full flex-col gap-3 p-6">
                  <h3 className="font-display text-lg font-semibold text-card-foreground">
                    {service.name}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">{service.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="w-full">
            <Button nativeButton={false} render={<Link href="/services" />} variant="outline" size="lg">
              View more services
            </Button>
          </Reveal>
        </div>
      </section>

      <section id="destinations" className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6">
          <Reveal className="w-full">
            <SectionHeading
              eyebrow="Destinations"
              title="Fourteen countries, one honest picture."
              lede="Each profile gives you real figures for tuition, living costs and visa reality â€” no hidden fees, no invented scholarships."
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCountries.map((country, index) => (
              <Reveal key={country.slug} delay={index * 0.05} className="h-full">
                <article className="hope-card hope-card--light flex h-full flex-col gap-4 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-3xl leading-none" aria-hidden="true">
                      {country.flag}
                    </div>
                    <Badge className={cn("border", bandColor[country.costBand])}>
                      {getCostBandLabel(country.costBand)}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-card-foreground">
                      {country.name}
                    </h3>
                  </div>
                  <p className="mt-auto text-sm leading-6 text-muted-foreground">
                    {country.financialInsight}
                  </p>
                  <Link
                    href={`/countries/${country.slug}`}
                    className="text-sm font-semibold text-primary"
                  >
                    View {country.name} â†’
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="w-full">
            <Button nativeButton={false} render={<Link href="/countries" />} variant="outline" size="lg">
              View more destinations
            </Button>
          </Reveal>
        </div>
      </section>

      <section id="for-parents" className="border-b border-border">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal className="w-full">
            <div className="flex flex-col gap-4">
              <Badge variant="outline" className="w-fit uppercase tracking-widest text-muted-foreground">
                {FOR_PARENTS.title}
              </Badge>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">{FOR_PARENTS.body}</p>
              <div className="pt-2">
                <Button nativeButton={false} render={<a href="/contact" />} size="lg">
                  {FOR_PARENTS.cta}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="coming-soon" className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6">
          <Reveal className="w-full">
            <SectionHeading
              eyebrow={COMING_SOON.eyebrow}
              title={COMING_SOON.title}
              lede=""
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {COMING_SOON.items.map((item, index) => (
              <Reveal key={item.name} delay={index * 0.05} className="h-full">
                <article className="hope-card hope-card--light flex h-full flex-col gap-3 p-6">
                  <h3 className="font-display text-lg font-semibold text-card-foreground">{item.name}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="w-full">
            <Button nativeButton={false} render={<a href="/contact" />} variant="outline" size="lg">
              {COMING_SOON.cta}
            </Button>
          </Reveal>
        </div>
      </section>

      <section id="why-us" className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6">
          <Reveal className="w-full">
            <SectionHeading
              eyebrow={WHY_US.eyebrow}
              title={WHY_US.title}
              lede=""
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {WHY_US.items.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05} className="h-full">
                <article className="hope-card hope-card--light flex h-full flex-col gap-3 p-6">
                  <h3 className="font-display text-lg font-semibold text-card-foreground">{item.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-b border-border">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-20 sm:px-6">
          <Reveal className="w-full">
            <SectionHeading eyebrow={FAQ.eyebrow} title={FAQ.title} lede="" />
          </Reveal>
          <Reveal className="w-full">
            <Accordion>
              {FAQ.items.map((item, index) => (
                <AccordionItem key={item.q} value={`faq-${index}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <section id="contact" className="bg-primary text-primary-foreground">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-4 py-20 sm:px-6">
          <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {FINAL_CTA.title}
          </h2>
          <p className="max-w-xl text-base leading-7 text-primary-foreground/80">{FINAL_CTA.body}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button nativeButton={false} render={<a href="/contact" />} size="lg" variant="secondary">
                {HERO.primaryCta}
              </Button>
            </Magnetic>
            {site.whatsapp ? (
              <Magnetic>
                <Button
                  nativeButton={false}
                  render={
                    <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" />
                  }
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  {HERO.secondaryCta}
                </Button>
              </Magnetic>
            ) : null}
          </div>
        </div>
      </section>
      <Separator />
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
      <Badge variant="outline" className="uppercase tracking-widest text-muted-foreground">
        {eyebrow}
      </Badge>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {lede ? <p className="text-base leading-7 text-muted-foreground">{lede}</p> : null}
    </div>
  );
}