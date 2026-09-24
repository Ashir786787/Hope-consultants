"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { MaskWords } from "@/components/motion/mask-words";
import { FlightPath } from "@/components/motion/flight-path";
import { CountUp } from "@/components/motion/count-up";
import { EASE_OUT } from "@/lib/motion";
import type { CountryDestination } from "@/lib/data/types";
import type { Service } from "@/lib/data/services";
import type { ProcessStep } from "@/lib/data/process";

gsap.registerPlugin(useGSAP);

const HERO = {
  eyebrow: "Hope Consultants",
  headline: "From your first question to your first day abroad, we're with you.",
  sub: "Admissions, scholarships, visas, and arrival guidance for students from Pakistan, all in one place, with honest advice and affordable support.",
  primaryCta: "Book a Free Consultation",
  secondaryCta: "Chat on WhatsApp",
} as const;

const FLIGHT_D = "M 60 340 C 300 300 380 170 560 190 C 740 210 860 90 1160 40";

function ApplicationProgress({ steps }: { steps: ProcessStep[] }) {
  const rowsRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
const rows = Array.from(rowsRef.current?.children ?? []) as HTMLLIElement[];
      const bar = barRef.current;
      const label = labelRef.current;
      if (!rows.length || !bar || !label) return;
      const state = { step: 0 };
      const apply = () => {
        rows.forEach((row, index) => {
          const active = index === state.step;
          const dot = row.querySelector("[data-step-dot]");
          const title = row.querySelector("[data-step-title]");
          row.classList.toggle("bg-white/[0.06]", active);
          dot?.classList.toggle("bg-hope-ember", active);
          dot?.classList.toggle("border-hope-ember", active);
          title?.classList.toggle("text-white", active);
        });
        gsap.to(bar, {
          scaleX: (state.step + 1) / rows.length,
          duration: 0.5,
          ease: EASE_OUT,
        });
        label.textContent = `${state.step + 1} of ${rows.length}`;
      };
      apply();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const loop = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
      for (let index = 1; index < rows.length; index += 1) {
        loop.add(() => {
          state.step = index;
          apply();
        });
        loop.to({}, { duration: 1.6 });
      }
      loop.to({}, { duration: 2.4 }).add(() => {
        state.step = 0;
        apply();
      });
      return () => {
        loop.kill();
      };
    },
    { scope: rowsRef }
  );

  return (
    <div className="relative flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
      <div aria-hidden="true" className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-white/25" />
        <span className="size-2 rounded-full bg-white/25" />
        <span className="size-2 rounded-full bg-white/25" />
      </div>
      <div aria-hidden="true" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <p ref={labelRef} className="text-xs font-semibold tracking-[0.18em] text-white/50 uppercase tabular-nums">
            1 of {steps.length}
          </p>
          <span className="rounded-full bg-hope-ember/15 px-3 py-1 text-xs font-bold text-hope-ember">
            In progress
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            ref={barRef}
            className="h-full w-full origin-left scale-x-0 rounded-full bg-hope-ember"
          />
        </div>
      </div>
      <ul ref={rowsRef} className="flex flex-col divide-y divide-white/5">
        {steps.map((step) => (
          <li
            key={step.step}
            className="flex items-center gap-3 py-2.5 text-sm text-white/60 transition-colors duration-300"
          >
            <span
              data-step-dot
              className="size-2 shrink-0 rounded-full border border-white/20 transition-colors duration-300"
            />
            <span data-step-title className="flex-1 truncate transition-colors duration-300">
              {step.title}
            </span>
            <span className="shrink-0 font-display text-xs font-semibold text-white/30 tabular-nums">
              {String(step.step).padStart(2, "0")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type HeroProps = {
  countries: CountryDestination[];
  services: Service[];
  processSteps: ProcessStep[];
  whatsapp: string;
};

export function Hero({ countries, services, processSteps, whatsapp }: HeroProps) {
  const chips = countries.slice(0, 6);

  return (
    <section className="relative overflow-hidden bg-hope-midnight text-white">
      <div
        aria-hidden="true"
        className="hope-dot-grid pointer-events-none absolute inset-0 opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] size-[34rem] rounded-full bg-[radial-gradient(circle,rgb(var(--hope-ember-rgb)/0.16),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-12rem] left-[-8%] size-[30rem] rounded-full bg-[radial-gradient(circle,rgb(var(--hope-ember-rgb)/0.1),transparent_65%)]"
      />
      <FlightPath
        d={FLIGHT_D}
        viewBox="0 0 1200 420"
        className="absolute inset-x-0 top-10 h-72 w-full text-hope-ember sm:top-16 sm:h-96"
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-4 pt-16 pb-20 sm:px-6 sm:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pt-32 lg:pb-28">
        <div className="flex flex-col items-start gap-7">
          <Badge className="bg-hope-ember text-hope-midnight">{HERO.eyebrow}</Badge>
          <h1 className="max-w-3xl font-display text-[clamp(2.5rem,5vw+0.5rem,4.5rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
            <MaskWords text={HERO.headline} stagger={0.045} />
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

        <div className={cn("relative hidden lg:block")}>
          <ApplicationProgress steps={processSteps} />
        </div>
      </div>
    </section>
  );
}