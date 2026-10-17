"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import {
  ChartColumn,
  ChevronDown,
  ClipboardList,
  FileText,
  FolderOpen,
  Globe2,
  Info,
  Layers3,
  LayoutDashboard,
  ListTree,
  Newspaper,
  Quote,
  Settings,
  Settings2,
  SlidersHorizontal,
  Users,
  Inbox,
} from "lucide-react";

import { SECTION_BY_HREF } from "@/lib/admin/permissions";
import type { AdminPanelSection } from "@/lib/admin/types";
import { SCHEMAS } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

const COLLECTION_ICONS: Record<string, typeof Layers3> = {
  services: Layers3,
  countries: Globe2,
  testimonials: Quote,
  scholarships: ChartColumn,
  process: ListTree,
  blog: Newspaper,
  site: Settings2,
  about: Info,
  team: Users,
};

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/onboarding", label: "Onboarding forms", icon: ClipboardList },
  { href: "/admin/documents", label: "Document submissions", icon: FolderOpen },
  { href: "/admin/forms", label: "Form builder", icon: SlidersHorizontal },
  { href: "/admin/content", label: "Content editor", icon: FileText },
  { href: "/admin/admins", label: "Admin users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNavList({
  newLeads,
  newOnboarding,
  newDocuments,
  allowedSections,
  allowedCollections,
  onNavigate,
}: {
  newLeads: number;
  newOnboarding: number;
  newDocuments: number;
  allowedSections: AdminPanelSection[];
  allowedCollections: string[] | null;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const collectionsId = useId();
  const onContentPage = pathname.startsWith("/admin/content");
  const [collectionsOpen, setCollectionsOpen] = useState(onContentPage);

  const allowed = new Set(allowedSections);
  const visibleItems = NAV_ITEMS.filter((item) => {
    const section = SECTION_BY_HREF[item.href];
    return !section || allowed.has(section);
  });

  const visibleCollections =
    allowedCollections === null
      ? SCHEMAS
      : SCHEMAS.filter((entry) => allowedCollections.includes(entry.key));

  const defaultCollection =
    allowedCollections === null
      ? SCHEMAS[0].key
      : allowedCollections[0] ?? visibleCollections[0]?.key ?? "";
  const activeCollection = onContentPage
    ? (searchParams.get("collection") ?? defaultCollection)
    : null;
  const showCollections = collectionsOpen;

  function isActive(href: string): boolean {
    return href === "/admin" ? pathname === href : pathname.startsWith(href);
  }

  return (
    <nav
      aria-label="Admin"
      className={cn(
        "flex flex-col gap-1",
        showCollections && "min-h-0 flex-1 overflow-y-auto overscroll-contain",
      )}
    >
      {visibleItems.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        const badge =
          item.href === "/admin/leads"
            ? newLeads
            : item.href === "/admin/onboarding"
              ? newOnboarding
              : item.href === "/admin/documents"
                ? newDocuments
                : 0;
        if (item.href !== "/admin/content") {
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                active
                  ? "bg-hope-ember text-hope-midnight"
                  : "text-hope-white/80 hover:bg-hope-white/10 hover:text-hope-white",
              )}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              {item.label}
              {badge > 0 ? (
                <span
                  className={cn(
                    "ml-auto flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums",
                    active
                      ? "bg-hope-midnight text-hope-ember"
                      : "bg-hope-ember text-hope-midnight",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-1.5 rounded-full",
                      active ? "bg-hope-ember" : "bg-hope-midnight",
                    )}
                  />
                  {badge}
                  <span className="sr-only">new awaiting a reply</span>
                </span>
              ) : null}
            </Link>
          );
        }

        return (
          <div key={item.href} className="flex flex-col">
            <div
              className={cn(
                "flex items-center rounded-lg transition-colors",
                active
                  ? "bg-hope-ember text-hope-midnight"
                  : "text-hope-white/80 hover:bg-hope-white/10 hover:text-hope-white",
              )}
            >
              <Link
                href="/admin/content"
                onClick={onNavigate}
                aria-current={active && !showCollections ? "page" : undefined}
                className="flex min-h-11 flex-1 items-center gap-3 rounded-lg px-3 text-sm font-medium"
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                {item.label}
              </Link>
              <button
                type="button"
                onClick={() => setCollectionsOpen((value) => !value)}
                aria-expanded={showCollections}
                aria-controls={collectionsId}
                aria-label={
                  showCollections ? "Hide content collections" : "Show content collections"
                }
                className="mr-1 flex size-9 shrink-0 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
              >
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 transition-transform",
                    showCollections && "rotate-180",
                  )}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </button>
            </div>

            {showCollections ? (
              <ul id={collectionsId} className="mt-1 flex flex-col gap-0.5 pb-1">
                {visibleCollections.map((entry) => {
                  const EntryIcon = COLLECTION_ICONS[entry.key];
                  const selected = activeCollection === entry.key;
                  return (
                    <li key={entry.key}>
                      <Link
                        href={`/admin/content?collection=${entry.key}`}
                        onClick={onNavigate}
                        aria-current={selected ? "page" : undefined}
                        className={cn(
                          "flex min-h-11 items-center gap-2.5 rounded-lg py-2 pr-3 pl-9 text-sm transition-colors",
                          selected
                            ? "bg-hope-white/15 font-semibold text-hope-white"
                            : "text-hope-white/70 hover:bg-hope-white/10 hover:text-hope-white",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            selected ? "bg-hope-ember" : "bg-hope-white/30",
                          )}
                        />
                        {EntryIcon ? (
                          <EntryIcon className="size-4 shrink-0" strokeWidth={1.75} />
                        ) : null}
                        <span className="truncate">{entry.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
