"use client";

import { useMemo, useState } from "react";

import { ServiceCard } from "@/components/services/service-card";
import { PreviewGrid } from "@/components/ui/preview-grid";
import { SearchEmptyState } from "@/components/ui/search-empty-state";
import { SearchField } from "@/components/ui/search-field";

import type { Service } from "@/lib/data/services";

type ServiceBrowserProps = {
  services: Service[];
};

export function ServiceBrowser({ services }: ServiceBrowserProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return services;
    return services.filter((service) =>
      `${service.name} ${service.description}`.toLowerCase().includes(normalized)
    );
  }, [services, query]);

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex w-full flex-col gap-4">
        <SearchField
          label="Search services"
          placeholder="Search services or keywords…"
          value={query}
          onValueChange={setQuery}
        />
        {query.trim() ? (
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Showing {results.length} of {services.length}
          </p>
        ) : null}
      </div>

      {results.length === 0 ? (
        <SearchEmptyState
          heading="No services match your search"
          body="Try a broader keyword, or clear the search box to see everything we offer."
        />
      ) : (
        <PreviewGrid
          items={results.map((service) => ({
            key: service.slug,
            content: <ServiceCard service={service} />,
          }))}
        />
      )}
    </div>
  );
}
