import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { services } from "@/lib/data/services";
import type { Service } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services | Hope Consultants",
  description:
    "Seven areas of honest, step-by-step guidance for Pakistani students planning to study abroad — counselling, admissions, scholarships, visa, language prep and more.",
};

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="flex flex-col gap-4 border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-card-foreground">
          {service.name}
        </h2>
        <Badge variant="outline" className="shrink-0">
          {service.shortName}
        </Badge>
      </div>
      <p className="text-sm leading-7 text-muted-foreground">{service.description}</p>
      <Separator />
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        What it covers
      </p>
      <ul className="flex flex-col gap-2">
        {service.deliverables.map((deliverable) => (
          <li
            key={deliverable}
            className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
          >
            <span aria-hidden="true" className="mt-0.5 text-primary">✓</span>
            <span>{deliverable}</span>
          </li>
        ))}
      </ul>
      <Separator />
      <a
        className={buttonVariants({ variant: "outline", size: "sm" })}
        href={`/services/${service.slug}`}
      >
        Learn more
      </a>
    </article>
  );
}

export default function ServicesPage() {
  return (
    <main className="w-full">
      <section className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6">
          <Badge variant="secondary" className="w-fit border border-border">
            Services
          </Badge>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-card-foreground sm:text-5xl">
            What we actually help with
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            Seven areas of step-by-step guidance — no guaranteed admissions, no
            promised visas, no invented scholarships. Just honest support from
            the first call to the day you fly.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </section>
    </main>
  );
}
