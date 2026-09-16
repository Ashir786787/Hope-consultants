import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { resources } from "@/lib/data/resources";

export const metadata: Metadata = {
  title: "Resources | Hope Consultants",
  description:
    "Plain-language guides we have written for Pakistani students on studying abroad — no fluff, no fabricated promises.",
};

export default function ResourcesPage() {
  return (
    <main className="w-full">
      <section className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6">
          <Badge variant="secondary" className="w-fit border border-border">
            Resources
          </Badge>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Guides we have written
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            Short, honest, plain-language reading on studying abroad. We only publish what
            we actually know — and we update it when things change.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-16 sm:px-6 md:grid-cols-2">
        {resources.map((resource) => (
          <article
            key={resource.title}
            className="flex flex-col gap-4 border border-border bg-card p-6"
          >
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
              render={<a href="/contact" />}
              variant="outline"
            >
              Ask us about this
            </Button>
          </article>
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
            <Button render={<a href="/contact" />} size="lg">
              Suggest a resource
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
