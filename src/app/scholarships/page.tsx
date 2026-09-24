import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { getCollection } from "@/lib/store";
import { scholarshipsIntro, scholarshipsDisclaimer } from "@/lib/data/scholarships";
import type { ScholarshipProgram } from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Scholarships & Funding | Hope Consultants",
  description:
    "Honest, current, plain-language guidance on the scholarships and funding routes we actually help with — and the conditions that come with them.",
};

function ScholarshipCard({ program }: { program: ScholarshipProgram }) {
  return (
    <article className="hope-card hope-card--light flex h-full flex-col gap-5 p-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-xl font-semibold text-card-foreground">
            {program.name}
          </h2>
          {program.group === "fully-funded" ? (
            <Badge className="bg-hope-ember text-hope-midnight">Fully funded</Badge>
          ) : (
            <Badge variant="outline">Partially funded</Badge>
          )}
        </div>
        <Badge variant="outline" className="w-fit">
          {program.country}
        </Badge>
      </div>
      <div className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
        {program.level ? (
          <p>
            <span className="font-medium text-card-foreground">Level:</span> {program.level}
          </p>
        ) : null}
        <p>
          <span className="font-medium text-card-foreground">What it covers:</span> {program.benefits}
        </p>
        {program.eligibility ? (
          <p>
            <span className="font-medium text-card-foreground">Who can apply:</span>{" "}
            {program.eligibility}
          </p>
        ) : null}
        {program.deadline ? (
          <p>
            <span className="font-medium text-card-foreground">Deadline:</span> {program.deadline}
          </p>
        ) : null}
        {program.applyAt ? (
          <p>
            <span className="font-medium text-card-foreground">Apply at:</span> {program.applyAt}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export default async function ScholarshipsPage() {
  const scholarships = await getCollection<ScholarshipProgram[]>("scholarships");
  const spotlights = scholarships.filter((item) => item.group === "spotlight");
  const fullyFunded = scholarships.filter((item) => item.group === "fully-funded");
  const partiallyFunded = scholarships.filter((item) => item.group === "partially-funded");

  return (
    <main className="w-full">
      <PageHero
        eyebrow="Scholarships & funding"
        title="Funding routes we actually help with"
        lede="No invented scholarship databases. No guarantees. These are the real, current routes we work with — and the honest conditions attached to each."
      />

      <section className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6">
          <Reveal className="w-full">
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">{scholarshipsIntro}</p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6">
          <Reveal className="w-full">
            <div className="flex flex-col gap-2">
              <Badge variant="outline" className="w-fit uppercase tracking-widest text-muted-foreground">
                National routes that matter
              </Badge>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-card-foreground">
                Government scholarships by country
              </h2>
            </div>
          </Reveal>
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            {spotlights.map((program, index) => (
              <Reveal key={program.id} delay={index * 0.05} className="h-full">
                <article className="hope-card hope-card--light flex h-full flex-col gap-5 p-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-xl font-semibold text-card-foreground">
                      {program.name}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">{program.benefits}</p>
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
                    {program.level ? (
                      <p>
                        <span className="font-medium text-card-foreground">Level:</span>{" "}
                        {program.level}
                      </p>
                    ) : null}
                    {program.deadline ? (
                      <p>
                        <span className="font-medium text-card-foreground">Deadline:</span>{" "}
                        {program.deadline}
                      </p>
                    ) : null}
                    {program.applyAt ? (
                      <p>
                        <span className="font-medium text-card-foreground">Apply at:</span>{" "}
                        {program.applyAt}
                      </p>
                    ) : null}
                    {program.source ? (
                      <p>
                        <span className="font-medium text-card-foreground">Official source:</span>{" "}
                        {program.source}
                      </p>
                    ) : null}
                  </div>
                  {program.universities && program.universities.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Universities we commonly assist students to apply to
                      </p>
                      <ul className="flex flex-col gap-1.5 text-sm leading-6 text-muted-foreground">
                        {program.universities.map((university) => (
                          <li key={university} className="flex items-start gap-2">
                            <span aria-hidden="true" className="mt-0.5 text-primary">
                              ✓
                            </span>
                            <span>{university}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6">
          <Reveal className="w-full">
            <div className="flex flex-col gap-2">
              <Badge variant="outline" className="w-fit uppercase tracking-widest text-muted-foreground">
                Fully funded
              </Badge>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-card-foreground">
                Scholarships that cover everything
              </h2>
            </div>
          </Reveal>
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            {fullyFunded.map((program, index) => (
              <Reveal key={program.id} delay={index * 0.05} className="h-full">
                <ScholarshipCard program={program} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6">
          <Reveal className="w-full">
            <div className="flex flex-col gap-2">
              <Badge variant="outline" className="w-fit uppercase tracking-widest text-muted-foreground">
                Partially funded
              </Badge>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-card-foreground">
                Routes that reduce the cost
              </h2>
            </div>
          </Reveal>
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            {partiallyFunded.map((program, index) => (
              <Reveal key={program.id} delay={index * 0.05} className="h-full">
                <ScholarshipCard program={program} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-12 sm:px-6">
          <div className="hope-card hope-card--light flex flex-col gap-3 p-6 sm:p-8">
            <p className="text-sm leading-7 text-muted-foreground">{scholarshipsDisclaimer}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-12 sm:px-6">
          <h2 className="font-display text-xl font-semibold text-card-foreground">
            Need a realistic funding plan?
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Tell us your budget, your family situation, and your goals. We will tell you which of
            these routes are realistic for you — and which are not.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button size="lg" nativeButton={false} render={<a href="/contact" />}>
              Talk to us about funding
            </Button>
            <Link className={buttonVariants({ variant: "outline", size: "lg" })} href="/countries">
              Compare study destinations
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}