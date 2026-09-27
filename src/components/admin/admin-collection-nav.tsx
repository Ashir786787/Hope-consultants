"use client";

import {
  BookOpenCheck,
  ChartColumn,
  Globe2,
  Layers3,
  ListTree,
  Newspaper,
  Quote,
  Settings2,
} from "lucide-react";

import { SCHEMAS } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

const ICONS: Record<string, typeof Layers3> = {
  services: Layers3,
  countries: Globe2,
  testimonials: Quote,
  scholarships: ChartColumn,
  resources: BookOpenCheck,
  process: ListTree,
  blog: Newspaper,
  site: Settings2,
};

export function AdminCollectionNav({
  active,
  counts,
  onSelect,
}: {
  active: string;
  counts: Record<string, number | null>;
  onSelect: (key: string) => void;
}) {
  return (
    <nav aria-label="Content collections" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex w-max gap-2 pb-1 sm:w-full sm:flex-wrap sm:pb-0">
        {SCHEMAS.map((item) => {
          const Icon = ICONS[item.key];
          const selected = active === item.key;
          const count = counts[item.key];
          return (
            <li key={item.key} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(item.key)}
                aria-current={selected ? "true" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember",
                  selected
                    ? "border-hope-ember bg-hope-ember text-hope-midnight"
                    : "border-hope-midnight/15 bg-hope-white text-hope-midnight hover:border-hope-ember/50 hover:bg-hope-midnight/5",
                )}
              >
                {Icon ? (
                  <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                ) : null}
                {item.label}
                {typeof count === "number" ? (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-xs font-bold tabular-nums",
                      selected
                        ? "bg-hope-midnight text-hope-white"
                        : "bg-hope-midnight/10 text-hope-midnight",
                    )}
                  >
                    {count}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
