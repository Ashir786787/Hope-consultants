import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCollection } from "@/lib/store";
import type { Service } from "@/lib/data/services";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Services | Hope Consultants",
  description:
    "Ten areas of honest, step-by-step guidance for Pakistani students planning to study abroad — selection, admissions, documents, scholarships, visas and arrival support.",
};

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="hope-card hope-card--light flex h-full flex-col gap-4 p-6">
      <h2 className="font-display text-xl font-semibold text-card-foreground">
        {service.name}
      </h2>
      <p className="mt-auto text-sm leading-7 text-muted-foreground">{service.description}</p>
      <Separator />
      <a className={buttonVariants({ variant: "outline", size: "sm" })} href={`/services/${service.slug}`}>
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

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {services.map((service, index) => (
          <Reveal key={service.slug} delay={index * 0.05} className="h-full">
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </section>
    </main>
  );
}