import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { getCollection } from "@/lib/store";
import type { ScholarshipProgram } from "@/lib/data/scholarships";

export const metadata: Metadata = {
  title: "Scholarships & Funding | Hope Consultants",
  description:
    "Honest, current, plain-language guidance on the scholarships and funding routes we actually help with - and the conditions that come with them.",
};

export default async function ScholarshipsPage() {
  const scholarships = await getCollection<ScholarshipProgram[]>("scholarships");
  return (
    <main className="w-full">
      <PageHero
        eyebrow="Scholarships & funding"
        title="Funding routes we actually help with"
        lede="No invented scholarship databases. No guarantees. These are the real, current routes we work with - and the honest conditions attached to each."
      />

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-16 sm:px-6 md:grid-cols-2">
        {scholarships.map((program, index) => (
          <Reveal key={program.name} delay={index * 0.05} className="h-full">
            <article className="hope-card hope-card--light flex h-full flex-col gap-5 p-6">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-xl font-semibold text-card-foreground">
                  {program.name}
                </h2>
                <Badge variant="outline" className="w-fit">
                  {program.provider}
                </Badge>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{program.country}</p>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                What it covers
              </p>
              <p className="text-sm leading-6 text-muted-foreground">{program.covers}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Honest advice
              </p>
              <p className="text-sm leading-6 text-muted-foreground">{program.advice}</p>
            </div>
          </article>
          </Reveal>
        ))}
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-12 sm:px-6">
          <h2 className="font-display text-xl font-semibold text-card-foreground">
            Need a realistic funding plan?
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Tell us your budget, your family situation, and your goals. We will tell you
            which of these routes are realistic for you - and which are not.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button size="lg" nativeButton={false} render={<a href="/contact" />}>
              Talk to us about funding
            </Button>
            <Link className={buttonVariants({ variant: "outline", size: "lg" })} href="/services/scholarships">
              Scholarship guidance service
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}