"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ChartColumn,
  ChevronDown,
  ClipboardList,
  FileText,
  Globe2,
  Info,
  Layers3,
  LayoutDashboard,
  ListTree,
  LogOut,
  Newspaper,
  Quote,
  Settings,
  Settings2,
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
  { href: "/admin/content", label: "Content editor", icon: FileText },
  { href: "/admin/admins", label: "Admin users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({
  name,
  email,
  newLeads,
  newOnboarding,
  allowedSections,
  allowedCollections,
}: {
  name: string;
  email: string;
  newLeads: number;
  newOnboarding: number;
  allowedSections: AdminPanelSection[];
  allowedCollections: string[] | null;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const onContentPage = pathname.startsWith("/admin/content");
  const [pending, setPending] = useState(false);
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

  async function handleLogout() {
    setPending(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 bg-[linear-gradient(180deg,rgb(var(--hope-midnight-rgb)),rgb(var(--hope-obsidian-rgb)/0.55))] px-4 py-6 text-hope-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:min-h-0 lg:px-5 lg:overflow-hidden">
      <div className="flex flex-col gap-1 px-3">
        <p className="text-sm font-bold">Hope Consultants</p>
        <p className="text-xs text-hope-white/70">Admin panel</p>
      </div>

      <nav
        aria-label="Admin"
        className={cn(
          "flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-x-visible",
          showCollections && "lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain",
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
                : 0;
          if (item.href !== "/admin/content") {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors lg:w-full",
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
                      "ml-auto flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums lg:ml-auto",
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
            <div key={item.href} className="flex shrink-0 flex-col lg:w-full">
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
                  aria-controls="admin-content-collections"
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
                <ul
                  id="admin-content-collections"
                  className="mt-1 flex flex-col gap-0.5 lg:pb-1"
                >
                  {visibleCollections.map((entry) => {
                    const EntryIcon = COLLECTION_ICONS[entry.key];
                    const selected = activeCollection === entry.key;
                    return (
                      <li key={entry.key}>
                        <Link
                          href={`/admin/content?collection=${entry.key}`}
                          aria-current={selected ? "page" : undefined}
                          className={cn(
                            "flex min-h-11 items-center gap-2.5 rounded-lg py-2 pr-3 text-sm transition-colors lg:pl-9",
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

      <div className="mt-auto flex flex-col gap-3 border-t border-hope-white/10 pt-4 lg:mt-0">
        <div className="flex flex-col gap-0.5 px-3">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="truncate text-xs text-hope-white/70">{email}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={pending}
          className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-hope-white/80 transition-colors hover:bg-hope-white/10 hover:text-hope-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          {pending ? "Signing out…" : "Logout"}
        </button>
      </div>
    </aside>
  );
}
