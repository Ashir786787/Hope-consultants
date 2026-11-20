import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Search } from "lucide-react";

import { AdminButton } from "@/components/admin/admin-ui";
import { AdminCopyLink } from "@/components/admin/admin-copy-link";
import { AdminOnboardingList } from "@/components/admin/admin-onboarding-list";
import { AdminStatusFilter } from "@/components/admin/admin-status-filter";
import { getFormDefinition } from "@/lib/forms/store";
import { listSubmissions } from "@/lib/onboarding/submission";
import { ONBOARDING_STATUSES, type OnboardingStatus } from "@/lib/onboarding/types";
import { hasSection } from "@/lib/admin/permissions";
import { requireSection } from "@/lib/admin/require-admin";

export const metadata: Metadata = {
  title: "Onboarding forms",
  robots: { index: false, follow: false },
};

const PUBLIC_FORM_URL = "https://www.hopeconsultants.pk/onboarding";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function AdminOnboardingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const admin = await requireSection("onboarding");
  const canEditForm = hasSection(admin, "forms");

  const params = await searchParams;
  const query = (firstValue(params.q) ?? "").trim();
  const rawStatus = firstValue(params.status) ?? "";
  const status = (ONBOARDING_STATUSES as readonly string[]).includes(rawStatus)
    ? (rawStatus as OnboardingStatus)
    : null;

  const definition = await getFormDefinition("onboarding");
  const levelOptions = definition.sections
    .flatMap((section) => section.fields)
    .find((field) => field.key === "desiredLevel")
    ?.options?.filter((option): option is string => typeof option === "string" && option !== "") ?? [];
  const rawLevel = firstValue(params.level) ?? "";
  const level = levelOptions.includes(rawLevel) ? rawLevel : null;

  const submissions = await listSubmissions(query, status, level);

  return (
    <>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-3xl font-bold text-hope-midnight">Onboarding forms</h1>
          <p className="text-hope-fog">
            Every student who completed the eight-page onboarding form, newest first. Status and
            notes stay inside this panel.
          </p>
        </div>
        {canEditForm ? (
          <Link
            href="/admin/forms/onboarding"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-hope-midnight/30 px-4 text-sm font-semibold text-hope-midnight transition-colors hover:bg-hope-midnight/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
          >
            <Pencil className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            Edit form
          </Link>
        ) : null}
      </header>

      <section className="flex flex-col gap-5 rounded-2xl border border-hope-midnight/10 bg-hope-white p-6">
        <AdminCopyLink url={PUBLIC_FORM_URL} />
        <form action="/admin/onboarding" method="get" role="search" className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative min-w-0 flex-1 sm:min-w-64">
            <label htmlFor="onboarding-search" className="sr-only">
              Search by student name or case number
            </label>
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-hope-fog"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <input
              id="onboarding-search"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search by student name or case number"
              className="min-h-11 w-full rounded-xl border border-hope-midnight/20 bg-hope-white pr-3 pl-9 text-sm text-hope-midnight transition-colors placeholder:text-hope-fog focus-visible:border-hope-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
            />
          </div>
          <AdminStatusFilter
            id="onboarding-status"
            statuses={ONBOARDING_STATUSES}
            value={status ?? ""}
          />
          <AdminStatusFilter
            id="onboarding-level"
            name="level"
            statuses={levelOptions}
            value={level ?? ""}
            allLabel="All levels"
            label="Filter by study level"
          />
          <div className="flex items-center gap-2">
            <AdminButton type="submit" variant="primary" className="w-full sm:w-auto">
              Search
            </AdminButton>
            {query || status || level ? (
              <Link
                href="/admin/onboarding"
                className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-hope-midnight underline decoration-hope-ember decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
              >
                Clear
              </Link>
            ) : null}
          </div>
        </form>
      </section>

      {query || status || level ? (
        <p aria-live="polite" className="text-sm text-hope-fog">
          {submissions.length} {submissions.length === 1 ? "result" : "results"}
          {query ? <> for “{query}”</> : null}
          {status ? <> with status {status}</> : null}
          {level ? <>{status ? " and" : " with"} level {level}</> : null}.
        </p>
      ) : null}

      {submissions.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-hope-midnight/20 px-6 py-16 text-center text-hope-fog">
          {query && !status && !level
            ? `No forms match “${query}”. Try a different name or case number.`
            : query || status || level
              ? "No forms match your filters. Try a different name, case number, status or study level."
              : "No completed forms yet. They appear here as soon as a student submits the form."}
        </p>
      ) : (
        <AdminOnboardingList submissions={submissions} />
      )}
    </>
  );
}
