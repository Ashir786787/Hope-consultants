import type { Metadata } from "next";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { ProcessSequence } from "@/components/sections/process-sequence";
import { getCollection } from "@/lib/store";
import type { ProcessStep } from "@/lib/data/process";

export const metadata: Metadata = {
  title: "Our Process | Hope Consultants",
  description:
    "How we work with Pakistani students in seven honest, step-by-step phases — from your first free conversation to arriving on campus.",
};

export default async function ProcessPage() {
  const processSteps = await getCollection<ProcessStep[]>("process");
  return (
    <main className="w-full">
      <PageHero
        eyebrow="Our process"
        title="How we work with you"
        lede="Seven clear phases, from the first free conversation to the day you arrive. No pressure, no invented timelines, and nothing is promised beyond what we can actually deliver."
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <ProcessSequence>
          {processSteps.map((step, index) => (
            <li key={step.step} className="relative pb-10 pl-0 last:pb-0">
              <Reveal className="w-full" delay={index * 0.03}>
                <div className="relative flex flex-col gap-3 lg:flex-row lg:items-baseline lg:gap-8">
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="relative z-10 flex size-10 items-center justify-center rounded-full border border-border bg-background font-display text-sm font-bold text-hope-ember">
                      {String(step.step).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="font-display text-xl font-semibold text-card-foreground">
                      {step.title}
                    </h2>
                    <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ProcessSequence>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-12 sm:px-6">
          <h2 className="font-display text-xl font-semibold text-card-foreground">
            Start with a free conversation
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            No fee, no pressure, no fake assurances. If we cannot help you reach a genuinely good
            outcome, we will say so early.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button size="lg" nativeButton={false} render={<a href="/contact" />}>
              Book a free consultation
            </Button>
            <Link
              className={buttonVariants({ variant: "outline", size: "lg" })}
              href="/services"
            >
              See our services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}