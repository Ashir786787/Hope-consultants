import Image from "next/image";
import Link from "next/link";

import { Marquee } from "@/components/motion/marquee";
import type { CountryDestination } from "@/lib/data/types";

export function CountryMarquee({ countries }: { countries: CountryDestination[] }) {
  const withImage = countries.filter((country) => country.images[0]);

  if (withImage.length === 0) return null;

  return (
    <Marquee
      className="border-y border-[rgb(255_255_255/0.10)] bg-hope-midnight py-6"
      duration={60}
    >
      {withImage.map((country) => (
        <Link
          key={country.slug}
          href={`/countries/${country.slug}`}
          data-cursor="view"
          className="group relative mx-2 block h-60 w-44 shrink-0 overflow-hidden rounded-[1.25rem] border border-[rgb(255_255_255/0.10)] outline-none transition-[border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[rgb(var(--hope-ember-rgb)/0.4)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:h-72 sm:w-54"
        >
          <Image
            src={country.images[0]}
            alt=""
            fill
            sizes="(max-width: 640px) 176px, 216px"
            loading="eager"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,var(--hope-midnight),rgb(var(--hope-midnight-rgb)/0.72)_38%,rgb(var(--hope-midnight-rgb)/0.15)_70%,transparent)]"
          />
          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
            <span className="flex min-w-0 flex-col gap-1.5">
              <span aria-hidden="true" className="text-lg leading-none">
                {country.flag}
              </span>
              <span className="truncate font-display text-sm font-bold tracking-[0.12em] uppercase text-hope-white">
                {country.name}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="shrink-0 text-base text-hope-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </Link>
      ))}
    </Marquee>
  );
}
