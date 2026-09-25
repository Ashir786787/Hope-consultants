import type { Metadata } from "next";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { getCollection } from "@/lib/store";
import type { Service } from "@/lib/data/services";
import { PageHero } from "@/components/page-hero";
import { PreviewGrid } from "@/components/ui/preview-grid";

export const metadata: Metadata = {
  title: "Services | Hope Consultants",
  description:
    "Ten areas of honest, step-by-step guidance for Pakistani students planning to study abroad — selection, admissions, documents, scholarships, visas and arrival support.",
};

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="hope-card hope-card--light flex h-full flex-col gap-4 p-6">
      {service.image ? (
        <div className="relative -mx-6 -mt-6 aspect-16/9 w-[calc(100%+3rem)] overflow-hidden rounded-t-[1.5rem]">
          <Image
            src={service.image}
            alt={service.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <h2 className="font-display text-xl font-semibold text-card-foreground">{service.name}</h2>
      <p className="mt-auto text-sm leading-7 text-muted-foreground">{service.description}</p>
      <Separator />
      <a
        className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
        href={`/services/${service.slug}`}
      >
        Learn more
      </a>
    </article>
  );
}

export default async function ServicesPage() {
  const services = await getCollection<Service[]>("services");
  return (
    <main className="w-full">
      <PageHero
        eyebrow="Services"
        title="What we actually help with"
        lede="Ten areas of step-by-step guidance — from choosing where to go, to the day you arrive. No guaranteed admissions, no promised visas, no invented scholarships."
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <PreviewGrid
          items={services.map((service) => ({
            key: service.slug,
            content: <ServiceCard service={service} />,
          }))}
        />
      </section>
    </main>
  );
}
