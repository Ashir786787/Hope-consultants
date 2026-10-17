"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

import type { AdminPanelSection } from "@/lib/admin/types";

import { AdminAccountBlock } from "./admin-account-block";
import { AdminNavList } from "./admin-nav-list";

const SIDEBAR_SURFACE =
  "bg-[linear-gradient(180deg,rgb(var(--hope-midnight-rgb)),rgb(var(--hope-obsidian-rgb)/0.55))]";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function AdminBrand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "flex min-w-0 flex-col" : "flex min-w-0 flex-col gap-1 px-3"}>
      <p className="truncate text-sm font-bold">Hope Consultants</p>
      <p className="truncate text-xs text-hope-white/70">Admin panel</p>
    </div>
  );
}

export function AdminSidebar({
  name,
  email,
  newLeads,
  newOnboarding,
  newDocuments,
  allowedSections,
  allowedCollections,
}: {
  name: string;
  email: string;
  newLeads: number;
  newOnboarding: number;
  newDocuments: number;
  allowedSections: AdminPanelSection[];
  allowedCollections: string[] | null;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
    focusables()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open, close]);

  return (
    <>
      <aside
        className={`hidden shrink-0 flex-col gap-6 px-5 py-6 text-hope-white lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:min-h-0 lg:w-64 lg:overflow-hidden ${SIDEBAR_SURFACE}`}
      >
        <AdminBrand />
        <AdminNavList
          newLeads={newLeads}
          newOnboarding={newOnboarding}
          newDocuments={newDocuments}
          allowedSections={allowedSections}
          allowedCollections={allowedCollections}
        />
        <AdminAccountBlock name={name} email={email} />
      </aside>

      <header
        className={`sticky top-0 z-40 flex items-center justify-between gap-3 px-4 py-3 text-hope-white lg:hidden ${SIDEBAR_SURFACE}`}
      >
        <AdminBrand compact />
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="admin-mobile-nav"
          aria-label="Open admin navigation"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-hope-white transition-colors hover:bg-hope-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
        >
          <Menu className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={close}
            aria-label="Close admin navigation"
            className="absolute inset-0 bg-hope-obsidian/60"
          />
          <div
            ref={panelRef}
            id="admin-mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            className={`admin-rise absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col gap-4 overflow-y-auto px-4 py-5 text-hope-white ${SIDEBAR_SURFACE}`}
          >
            <div className="flex items-center justify-between gap-3">
              <AdminBrand compact />
              <button
                type="button"
                onClick={close}
                aria-label="Close admin navigation"
                className="flex size-11 shrink-0 items-center justify-center rounded-lg text-hope-white transition-colors hover:bg-hope-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
              >
                <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
            <AdminNavList
              newLeads={newLeads}
              newOnboarding={newOnboarding}
              newDocuments={newDocuments}
              allowedSections={allowedSections}
              allowedCollections={allowedCollections}
              onNavigate={close}
            />
            <AdminAccountBlock name={name} email={email} onNavigate={close} />
          </div>
        </div>
      ) : null}
    </>
  );
}
