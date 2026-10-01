"use client";

import { useMemo, useState } from "react";

import { ScholarshipCard, SpotlightCard } from "@/components/scholarships/scholarship-card";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { PreviewGrid } from "@/components/ui/preview-grid";
import { SearchEmptyState } from "@/components/ui/search-empty-state";
import { SearchField } from "@/components/ui/search-field";

import type { ScholarshipGroup, ScholarshipProgram } from "@/lib/data/types";

type ScholarshipBrowserProps = {
  scholarships: ScholarshipProgram[];
};

type ScholarshipSection = {
  group: ScholarshipGroup;
  eyebrow: string;
  title: string;
  spotlight: boolean;
};

const SECTIONS: ScholarshipSection[] = [
  {
    group: "spotlight",
    eyebrow: "National routes that matter",
    title: "Government scholarships by country",
    spotlight: true,
  },
  {
    group: "fully-funded",
    eyebrow: "Fully funded",
    title: "Scholarships that cover everything",
    spotlight: false,
  },
  {
    group: "partially-funded",
    eyebrow: "Partially funded",
    title: "Routes that reduce the cost",
    spotlight: false,
  },
];

function matchesQuery(program: ScholarshipProgram, normalized: string): boolean {
  return [
    program.name,
    program.country,
    program.benefits,
    program.level ?? "",
    program.eligibility ?? "",
    program.deadline ?? "",
    program.applyAt ?? "",
    program.source ?? "",
    ...(program.universities ?? []),
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalized);
}

export function ScholarshipBrowser({ scholarships }: ScholarshipBrowserProps) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalized) return scholarships;
    return scholarships.filter((program) => matchesQuery(program, normalized));
  }, [scholarships, normalized]);

  return (
    <div className="flex w-full flex-col gap-16">
      <div className="flex w-full flex-col gap-4">
        <SearchField
          label="Search scholarships"
          placeholder="Search scholarships, countries or benefits…"
          value={query}
          onValueChange={setQuery}
        />
        {query.trim() ? (
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Showing {results.length} of {scholarships.length}
          </p>
        ) : null}
      </div>

      {results.length === 0 ? (
        <SearchEmptyState
          heading="No scholarships match your search"
          body="Try a country, a level of study, or a benefit — or clear the search box to see every route."
        />
      ) : (
        SECTIONS.map((section) => {
          const programs = results.filter((program) => program.group === section.group);
          if (programs.length === 0) return null;

          return (
            <section key={section.group} className="border-b border-border last:border-b-0">
              <div className="flex w-full flex-col gap-10 py-12 first:pt-0 last:pb-0">
                <Reveal className="w-full">
                  <div className="flex flex-col gap-2">
                    <Badge
                      variant="outline"
                      className="w-fit uppercase tracking-widest text-muted-foreground"
                    >
                      {section.eyebrow}
                    </Badge>
                    <h2 className="font-display text-3xl font-semibold tracking-tight text-card-foreground">
                      {section.title}
                    </h2>
                  </div>
                </Reveal>
                <PreviewGrid
                  columns={2}
                  items={programs.map((program) => ({
                    key: program.id,
                    content: section.spotlight ? (
                      <SpotlightCard program={program} />
                    ) : (
                      <ScholarshipCard program={program} />
                    ),
                  }))}
                />
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
