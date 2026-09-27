"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { CountryFlag } from "@/components/countries/country-flag";
import { isoFor } from "@/lib/data/country-flags";
import type { CountryDestination } from "@/lib/data/types";

export function SpotlightRow({
  country,
  selected,
  mirrored,
  onSelect,
}: {
  country: CountryDestination;
  selected: boolean;
  mirrored: boolean;
  onSelect: (country: CountryDestination) => void;
}) {
  const router = useRouter();
  const image = country.images[0];
  const iso = isoFor(country.slug);

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => {
        if (selected) {
          router.push(`/countries/${country.slug}`);
          return;
        }
        onSelect(country);
      }}
      className={[
        "group relative flex min-h-14 w-full items-center gap-2.5 rounded-xl border px-3 text-left transition-[background-color,border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember",
        mirrored ? "flex-row-reverse pr-3 pl-6 text-right" : "pl-6",
        selected
          ? "border-hope-ember bg-hope-ember/16"
          : "border-transparent bg-hope-white/5 hover:border-hope-white/25 hover:bg-hope-white/10",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "absolute inset-y-2 w-0.5 rounded-full transition-colors duration-300",
          mirrored ? "right-1" : "left-1",
          selected ? "bg-hope-ember" : "bg-transparent",
        ].join(" ")}
      />
      <CountryFlag iso={iso} className="text-base" />
        {image ? (
        <span className="relative size-8 shrink-0 overflow-hidden rounded-full border border-hope-white/25">
          <Image
            src={image}
            alt=""
            fill
            sizes="32px"
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
          />
        </span>
      ) : null}
      <span
        className={[
          "min-w-0 flex-1 text-sm font-semibold leading-5 transition-colors duration-300",
          selected ? "text-hope-ember" : "text-hope-white/85 group-hover:text-hope-white",
        ].join(" ")}
      >
        {country.name}
      </span>
    </button>
  );
}
