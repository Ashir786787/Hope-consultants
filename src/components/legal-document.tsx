import type { LegalPage } from "@/lib/data/legal";
import { Reveal } from "@/components/motion/reveal";
import { Separator } from "@/components/ui/separator";
import { DarkPageHero } from "@/components/sections/dark-page-hero";

export function LegalDocument({ page }: { page: LegalPage }) {
  return (
    <main id="main-content" className="w-full">
      <DarkPageHero eyebrow="Legal" title={page.title} />

      <section className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-14 sm:px-6 sm:py-16">
        <Reveal>
          <p className="text-sm text-muted-foreground">Last updated: {page.lastUpdated}</p>
        </Reveal>
        {page.sections.map((section, index) => (
          <Reveal key={section.heading} delay={index * 0.02} className="w-full">
            <div className="flex flex-col gap-3">
              <h2 className="font-display text-xl font-semibold text-card-foreground">
                {section.heading}
              </h2>
              <Separator className="max-w-md" />
              <p className="text-sm leading-7 text-muted-foreground">{section.body}</p>
            </div>
          </Reveal>
        ))}
      </section>
    </main>
  );
}