"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { countries } from "@/lib/data/countries";
import type { CountryDestination } from "@/lib/data/types";

const bandLabel: Record<CountryDestination["cost"]["band"], string> = {
  low: "Low cost",
  medium: "Medium cost",
  high: "High cost",
};

const bandClasses: Record<CountryDestination["cost"]["band"], string> = {
  low: "border-emerald-300 bg-emerald-50 text-emerald-800",
  medium: "border-amber-300 bg-amber-50 text-amber-800",
  high: "border-rose-300 bg-rose-50 text-rose-800",
};

export default function CountryFilter() {
  const [query, setQuery] = useState("");
  const [bands, setBands] = useState<Set<CountryDestination["cost"]["band"]>>(
    new Set()
  );
  const [englishOnly, setEnglishOnly] = useState(false)
  const [fundedOnly, setFundedOnly] = useState(false)

  const toggleBand = (band: CountryDestination["cost"]["band"]) => {
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
    return countries.filter((c) => {
      if (q) {
        const hay = (c.name + " " + c.tagline + " " + c.popularFields.join(" ")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (bands.size > 0 && !bands.has(c.cost.band)) return false;
      if (englishOnly && !c.englishFriendly) return false;
      if (fundedOnly && !c.cost.fundedByDefault) return false;
      return true;
    });
  }, [query, bands, englishOnly, fundedOnly]);

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-6">
        <Input
          type="search"
          placeholder="Search countries, fields, or keywords…"
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
                (bands.has(band) ? " text-foreground underline underline-offset-4" : " text-muted-foreground hover:text-foreground")
              }
              aria-pressed={bands.has(band)}
            >
              {bandLabel[band]}
            </button>
          ))}
          <Separator orientation="vertical" className="hidden h-5 sm:block" />
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={englishOnly}
              onChange={(e) => setEnglishOnly(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            English-friendly
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={fundedOnly}
              onChange={(e) => setFundedOnly(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Low/funded tuition
          </label>
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
                <div className="flex items-start justify-between gap-3">
                  <span className="text-3xl leading-none" aria-hidden="true">
                    {country.flag}
                  </span>
                  <Badge className={bandClasses[country.cost.band]}>
                    {bandLabel[country.cost.band]}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-card-foreground">
                    {country.name}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {country.tagline}
                  </p>
                </div>
                <p className="mt-auto text-sm leading-6 text-muted-foreground">
                  {country.cost.tuitionEurMin > 0
                    ? `€${country.cost.tuitionEurMin.toLocaleString()}–€${country.cost.tuitionEurMax.toLocaleString()}/yr tuition`
                    : "No tuition at public universities"}{" "}
                  · {country.englishFriendly ? "English-friendly" : "IELTS may be needed"}
                </p>
                <Button nativeButton={false} render={<a href={`/countries/${country.slug}`} />} size="sm" variant="outline">
                  View {country.name}
                </Button>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
