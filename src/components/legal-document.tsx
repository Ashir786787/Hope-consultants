import type { LegalPage } from "@/lib/data/legal";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function LegalDocument({ page }: { page: LegalPage }) {
  return (
    <main className="w-full">
      <section className="border-b border-border">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-16 sm:px-6 sm:py-20">
          <Reveal>
            <Badge variant="outline" className="w-fit uppercase tracking-widest text-muted-foreground">
              Legal
            </Badge>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
              {page.title}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-sm text-muted-foreground">Last updated: {page.lastUpdated}</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-14 sm:px-6">
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