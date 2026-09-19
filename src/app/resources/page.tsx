import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { resources } from "@/lib/data/resources";

export const metadata: Metadata = {
  title: "Resources | Hope Consultants",
  description:
    "Plain-language guides we have written for Pakistani students on studying abroad — no fluff, no fabricated promises.",
};

export default function ResourcesPage() {
  return (
    <main className="w-full">
      <PageHero
        eyebrow="Resources"
        title="Guides we have written"
        lede="Short, honest, plain-language reading on studying abroad. We only publish what we actually know — and we update it when things change."
      />

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-16 sm:px-6 md:grid-cols-2">
        {resources.map((resource, index) => (
          <Reveal key={resource.title} delay={index * 0.05} className="h-full">
            <article className="hope-card hope-card--light flex h-full flex-col gap-4 p-6">
            <div className="flex flex-col gap-2">
              <Badge variant="outline" className="w-fit">
                {resource.category}
              </Badge>
              <h2 className="font-display text-xl font-semibold text-card-foreground">
                {resource.title}
              </h2>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">{resource.description}</p>
            <Separator />
            <Button
              className="w-fit"
              size="sm"
              nativeButton={false} render={<a href="/contact" />}
              variant="outline"
            >
              Ask us about this
            </Button>
          </article>
          </Reveal>
        ))}
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-12 sm:px-6">
          <h2 className="font-display text-xl font-semibold text-card-foreground">
            Want a topic covered?
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Tell us what you are unsure about. If it is a real question for Pakistani
            students, we will write about it honestly.
          </p>
          <div className="pt-2">
            <Button nativeButton={false} render={<a href="/contact" />} size="lg">
              Suggest a resource
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
