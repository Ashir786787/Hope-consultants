import type { Metadata } from "next";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DarkPageHero } from "@/components/sections/dark-page-hero";
import { DarkSection } from "@/components/sections/dark-section";
import { Magnetic } from "@/components/motion/magnetic";
import { PreviewGrid } from "@/components/ui/preview-grid";
import { getCollection } from "@/lib/store";
import type { ResourceItem } from "@/lib/data/resources";

export const metadata: Metadata = {
  title: "Resources | Hope Consultants",
  description:
    "Plain-language guides we have written for Pakistani students on studying abroad — no fluff, no fabricated promises.",
};

function ResourceCard({ resource }: { resource: ResourceItem }) {
  return (
    <article className="hope-card hope-card--light flex h-full flex-col gap-4 p-6">
      {resource.image ? (
        <div className="relative -mx-6 -mt-6 aspect-16/9 w-[calc(100%+3rem)] overflow-hidden rounded-t-[1.5rem]">
          <Image
            src={resource.image}
            alt={resource.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">
          {resource.category}
        </Badge>
        <h2 className="font-display text-xl font-semibold text-card-foreground">{resource.title}</h2>
      </div>
      <p className="text-sm leading-7 text-muted-foreground">{resource.description}</p>
      <Separator />
      <Button
        className="w-fit"
        size="sm"
        nativeButton={false}
        render={<a href="/contact" />}
        variant="outline"
      >
        Ask us about this
      </Button>
    </article>
  );
}

export default async function ResourcesPage() {
  const resources = await getCollection<ResourceItem[]>("resources");
  return (
    <main id="main-content" className="w-full">
      <DarkPageHero
        eyebrow="Resources"
        title="Guides we have written"
        lede="Short, honest, plain-language reading on studying abroad. We only publish what we actually know — and we update it when things change."
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <PreviewGrid
          items={resources.map((resource) => ({
            key: resource.title,
            content: <ResourceCard resource={resource} />,
          }))}
        />
      </section>

      <DarkSection>
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-xl font-semibold text-hope-white">
            Want a topic covered?
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-hope-white/70">
            Tell us what you are unsure about. If it is a real question for Pakistani
            students, we will write about it honestly.
          </p>
          <div className="pt-2">
            <Magnetic>
              <Button nativeButton={false} render={<a href="/contact" />} size="lg">
                Suggest a resource
              </Button>
            </Magnetic>
          </div>
        </div>
      </DarkSection>
    </main>
  );
}
