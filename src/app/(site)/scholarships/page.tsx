import type { Metadata } from "next";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScholarshipBrowser } from "@/components/scholarships/scholarship-browser";
import { DarkPageHero } from "@/components/sections/dark-page-hero";
import { DarkSection } from "@/components/sections/dark-section";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { getCollection } from "@/lib/store";
import { scholarshipsIntro, scholarshipsDisclaimer } from "@/lib/data/scholarships";
import type { ScholarshipProgram } from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Scholarships & Funding | Hope Consultants",
  description:
    "Honest, current, plain-language guidance on the scholarships and funding routes we actually help with — and the conditions that come with them.",
};

export default async function ScholarshipsPage() {
  const scholarships = await getCollection<ScholarshipProgram[]>("scholarships");

  return (
    <main id="main-content" className="w-full">
      <DarkPageHero
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

      <div className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <ScholarshipBrowser scholarships={scholarships} />
        </div>
      </div>

      <section className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-12 sm:px-6">
          <div className="hope-card hope-card--light flex flex-col gap-3 p-6 sm:p-8">
            <p className="text-sm leading-7 text-muted-foreground">{scholarshipsDisclaimer}</p>
          </div>
        </div>
      </section>

      <DarkSection>
        <Reveal className="w-full">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-semibold text-hope-white">
              Need a realistic funding plan?
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-hope-white/70">
              Tell us your budget, your family situation, and your goals. We will tell you which
              of these routes are realistic for you — and which are not.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Magnetic>
                <Button size="lg" nativeButton={false} render={<a href="/contact" />}>
                  Talk to us about funding
                </Button>
              </Magnetic>
              <Link
                className={buttonVariants({ variant: "outline", size: "lg" })}
                href="/countries"
              >
                Compare study destinations
              </Link>
            </div>
          </div>
        </Reveal>
      </DarkSection>
    </main>
  );
}