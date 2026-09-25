"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCostBandLabel } from "@/lib/data/helpers";
import type { CountryDestination, CostBand } from "@/lib/data/types";

const bandColors: Record<CostBand, string> = {
  low: "border-[rgb(var(--hope-ember-rgb)/0.4)] bg-hope-ember text-hope-midnight",
  medium: "border-[rgb(var(--hope-midnight-rgb)/0.18)] bg-hope-midnight text-hope-white",
  high: "border-[rgb(var(--hope-obsidian-rgb)/0.18)] bg-hope-obsidian text-hope-white",
};

export default function CountryFilter({
  countries,
}: {
  countries: CountryDestination[];
}) {
  const [query, setQuery] = useState("");
  const [bands, setBands] = useState<Set<CostBand>>(new Set());

  const toggleBand = (band: CostBand) => {
    setBands((prev) => {
      const next = new Set(prev);
      if (next.has(band)) {
        next.delete(band);
      } else {
        next.add(band);
      }
      return next;
    });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...countries]
      .sort((a, b) => a.position - b.position)
      .filter((c) => {
        if (q) {
          const hay = `${c.name} ${c.financialInsight}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (bands.size > 0 && !bands.has(c.costBand)) return false;
        return true;
      });
  }, [countries, query, bands]);

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-6">
        <Input
          type="search"
          placeholder="Search countries or keywords…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11 w-full max-w-md"
          aria-label="Search study destinations"
        />
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">Filter by cost:</span>
          {(["low", "medium", "high"] as const).map((band) => (
            <button
              key={band}
              type="button"
              onClick={() => toggleBand(band)}
              className={
                "text-sm font-medium capitalize transition-colors" +
                (bands.has(band)
                  ? " text-foreground underline underline-offset-4"
                  : " text-muted-foreground hover:text-foreground")
              }
              aria-pressed={bands.has(band)}
            >
              {getCostBandLabel(band)}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="hope-card hope-card--light p-10 text-center">
          <p className="font-display text-xl font-semibold text-card-foreground">
            No countries match those filters yet
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try clearing the search or a filter — or ask us; we keep this list honest and current.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((country) => (
            <li key={country.slug}>
              <article className="hope-card hope-card--light flex h-full flex-col gap-4 p-6">
                {country.images[0] ? (
                  <div className="relative -mx-6 -mt-6 aspect-16/9 w-[calc(100%+3rem)] overflow-hidden rounded-t-[1.5rem]">
                    <Image
                      src={country.images[0]}
                      alt={`${country.name} — study destination`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="flex items-start justify-between gap-3">
                  <span className="text-3xl leading-none" aria-hidden="true">
                    {country.flag}
                  </span>
                  <Badge className={bandColors[country.costBand]}>
                    {getCostBandLabel(country.costBand)}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-card-foreground">
                    {country.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Homepage position {country.position}
                  </p>
                </div>
                <p className="mt-auto text-sm leading-6 text-muted-foreground">
                  {country.financialInsight}
                </p>
                <Button
                  nativeButton={false}
                  render={<a href={`/countries/${country.slug}`} />}
                  size="sm"
                  variant="outline"
                >
                  Read about {country.name}
                </Button>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}