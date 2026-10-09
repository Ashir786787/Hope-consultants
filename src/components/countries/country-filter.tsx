"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CountryDestination } from "@/lib/data/types";

function admissionBadge(open: boolean | undefined) {
  if (open === undefined) return null;
  return (
    <Badge
      className={
        open
          ? "border-[rgb(var(--hope-ember-rgb)/0.4)] bg-hope-ember text-hope-midnight"
          : "border-[rgb(var(--hope-midnight-rgb)/0.24)] bg-transparent text-hope-midnight"
      }
    >
      {open ? "Admissions open" : "Admissions closed"}
    </Badge>
  );
}

export default function CountryFilter({
  countries,
}: {
  countries: CountryDestination[];
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...countries]
      .sort((a, b) => a.position - b.position)
      .filter((c) => {
        if (q) {
          const hay = `${c.name} ${c.financialInsight}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
  }, [countries, query]);

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
      </div>

      {results.length === 0 ? (
        <div className="hope-card hope-card--light p-10 text-center">
          <p className="font-display text-xl font-semibold text-card-foreground">
            No countries match those filters yet
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try clearing the search — or ask us; we keep this list honest and current.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((country) => (
            <li key={country.slug}>
              <article className="hope-card hope-card--light flex h-full flex-col gap-4 p-6">
                {country.images[0] ? (
                  <div className="relative -mx-6 -mt-6 aspect-16/9 shrink-0 overflow-hidden rounded-t-[1.5rem]">
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
                  {admissionBadge(country.admissionOpen)}
                </div>
                <h2 className="font-display text-xl font-semibold text-card-foreground">
                  {country.name}
                </h2>
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
