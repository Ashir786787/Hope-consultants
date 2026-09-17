import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { processSteps } from "@/lib/data/process";

export const metadata: Metadata = {
  title: "Our Process | Hope Consultants",
  description:
    "How we work with Pakistani students in six honest, step-by-step phases — from your first free conversation to settling in.",
};

export default function ProcessPage() {
  return (
    <main className="w-full">
      <section className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6">
          <Badge variant="secondary" className="w-fit border border-border">
            Our process
          </Badge>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
            How we work with you
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            Six clear phases, from the first free conversation to the day you arrive.
            No pressure, no invented timelines, and nothing is promised beyond what
            we can actually deliver.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <ol className="flex flex-col gap-0">
          {processSteps.map((step) => (
            <li key={step.step} className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-5">
                <span className="font-display text-2xl font-semibold text-primary">
                  {String(step.step).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2">
                  <h2 className="font-display text-xl font-semibold text-card-foreground">
                    {step.title}
                  </h2>
                  <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
              {step.step < processSteps.length ? <Separator className="my-6" /> : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-12 sm:px-6">
          <h2 className="font-display text-xl font-semibold text-card-foreground">
            Start with a free conversation
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            No fee, no pressure, no fake assurances. If we cannot help you reach a
            genuinely good outcome, we will say so early.
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
