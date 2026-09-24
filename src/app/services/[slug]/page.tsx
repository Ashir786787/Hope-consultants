import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/motion/reveal";
import { getCollection } from "@/lib/store";
import type { Service } from "@/lib/data/services";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;
export const revalidate = false;

export async function generateStaticParams() {
  const services = await getCollection<Service[]>("services");
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const services = await getCollection<Service[]>("services");
  const service = services.find((item) => item.slug === slug);
  if (!service) return { title: "Service not found | Hope Consultants" };
  return {
    title: `${service.name} | Hope Consultants`,
    description: service.description,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const services = await getCollection<Service[]>("services");
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <main className="w-full">
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 right-[-10%] size-[30rem] rounded-full bg-[radial-gradient(circle,rgb(var(--hope-ember-rgb)/0.14),transparent_65%)]"
        />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6">
          <Reveal>
            <Badge variant="outline" className="w-fit uppercase tracking-widest text-muted-foreground">
              Service
            </Badge>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              {service.name}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">{service.description}</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid w-full gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-2xl font-semibold text-card-foreground">
              How we help with this
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              We work through this service with clear checklists, honest timelines and real
              documentation — and we tell you exactly what is and is not possible at every step.
            </p>
          </div>

          <aside className="flex flex-col gap-6">
            <Separator />
            <div className="flex flex-col gap-3">
              <Button nativeButton={false} render={<a href="/contact" />} size="lg">
                Book a free consultation
              </Button>
              <Link className={buttonVariants({ variant: "outline", size: "lg" })} href="/services">
                All services
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}