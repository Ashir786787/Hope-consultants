import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { CountUp } from "@/components/motion/count-up";
import type { CountryDestination } from "@/lib/data/types";
import type { Service } from "@/lib/data/services";
import type { ProcessStep } from "@/lib/data/process";

const HERO = {
  eyebrow: "Hope Consultants",
  headline: "From your first question to your first day abroad, we're with you.",
  sub: "Admissions, scholarships, visas, and arrival guidance for students from Pakistan, all in one place, with honest advice and affordable support.",
  primaryCta: "Book a Free Consultation",
  secondaryCta: "Chat on WhatsApp",
} as const;

export type HeroProps = {
  countries: CountryDestination[];
  services: Service[];
  processSteps: ProcessStep[];
  whatsapp: string;
};

export function Hero({ countries, services, processSteps, whatsapp }: HeroProps) {
  const chips = countries.slice(0, 6);

  return (
    <section className="relative z-10 -mt-[100svh] grid min-h-svh w-full grid-cols-1 content-center gap-14 px-4 pt-28 pb-20 text-white sm:px-6 sm:pt-32 lg:gap-16 lg:pt-36 lg:pb-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-7">
          <Badge className="bg-hope-ember text-hope-midnight">{HERO.eyebrow}</Badge>
          <h1 className="max-w-3xl font-display text-[clamp(2.5rem,5vw+0.5rem,4.5rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
            {HERO.headline}
          </h1>
          <ul
            aria-label="Popular destinations"
            className="flex flex-wrap items-center gap-2"
          >
            {chips.map((country) => (
              <li
                key={country.slug}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/80 transition-colors duration-300 hover:border-white/30 hover:text-white"
              >
                <span aria-hidden="true" className="text-base leading-none">
                  {country.flag}
                </span>
                {country.name}
              </li>
            ))}
          </ul>
          <p className="max-w-xl text-lg leading-8 text-white/70">{HERO.sub}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button nativeButton={false} render={<a href="/contact" />} size="lg" className="bg-hope-ember text-hope-midnight hover:bg-hope-ember/90">
                {HERO.primaryCta}
              </Button>
            </Magnetic>
            {whatsapp ? (
              <Magnetic>
                <Button
                  nativeButton={false}
                  render={
                    <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" />
                  }
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:border-white hover:bg-white/10 hover:text-white"
                >
                  {HERO.secondaryCta}
                </Button>
              </Magnetic>
            ) : null}
          </div>
          <dl className="mt-4 grid w-full max-w-xl grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
            <div>
              <dt className="font-display text-3xl font-bold">
                <CountUp to={countries.length} />
              </dt>
              <dd className="mt-1 text-sm text-white/60">Study destinations</dd>
            </div>
            <div>
              <dt className="font-display text-3xl font-bold">
                <CountUp to={services.length} />
              </dt>
              <dd className="mt-1 text-sm text-white/60">Services we offer</dd>
            </div>
            <div>
              <dt className="font-display text-3xl font-bold">
                <CountUp to={processSteps.length} />
              </dt>
              <dd className="mt-1 text-sm text-white/60">Steps in our process</dd>
            </div>
            <div>
              <dt className="font-display text-3xl font-bold">
                <CountUp to={0} />
              </dt>
              <dd className="mt-1 text-sm text-white/60">Fake promises</dd>
            </div>
          </dl>
      </div>
    </section>
  );
}