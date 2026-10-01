import Image from "next/image";
import { Separator } from "@/components/ui/separator";

import type { Service } from "@/lib/data/services";

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="hope-card hope-card--light flex h-full flex-col gap-4 p-6">
      {service.image ? (
        <div className="relative -mx-6 -mt-6 aspect-16/9 shrink-0 overflow-hidden rounded-t-[1.5rem]">
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
