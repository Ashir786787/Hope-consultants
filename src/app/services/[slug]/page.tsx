import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { services } from "@/lib/data/services";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;
export const revalidate = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return { title: "Service not found | Hope Consultants" };
  return {
    title: `${service.name} | Hope Consultants`,
    description: service.description,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <main className="w-full">
      <section className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6">
          <Badge variant="secondary" className="w-fit">
            {service.shortName}
          </Badge>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-card-foreground sm:text-5xl">
            {service.name}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">{service.description}</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid w-full gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-2xl font-semibold text-card-foreground">
              What we help you with
            </h2>
            <ul className="flex flex-col gap-3">
              {service.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                  <span aria-hidden="true" className="mt-0.5 text-primary">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="flex flex-col gap-6">
            <Separator />
            <div className="flex flex-col gap-3">
              <Button render={<a href="/contact" />} size="lg">
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
