import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { getFormDefinition } from "@/lib/forms/store";
import { FORM_KEYS } from "@/lib/forms/definitions";
import { requireSection } from "@/lib/admin/require-admin";

export const metadata: Metadata = {
  title: "Form builder",
  robots: { index: false, follow: false },
};

export default async function AdminFormsPage() {
  await requireSection("forms");
  const definitions = await Promise.all(FORM_KEYS.map((key) => getFormDefinition(key)));

  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold text-hope-midnight">Form builder</h1>
        <p className="text-hope-fog">
          Edit the sections and fields of the public forms. Changes take effect on the live form
          immediately after saving.
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {definitions.map((definition) => (
          <li key={definition.key}>
            <Link
              href={`/admin/forms/${definition.key}`}
              className="flex h-full flex-col gap-2 rounded-2xl border border-hope-midnight/10 bg-hope-white p-6 transition-colors hover:border-hope-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-hope-ember">
                {definition.key === "onboarding" ? "Onboarding" : "Documents"}
              </p>
              <p className="text-lg font-bold text-hope-midnight">{definition.title}</p>
              <p className="text-sm text-hope-fog">
                {definition.sections.length} section
                {definition.sections.length === 1 ? "" : "s"} ·{" "}
                {definition.sections.reduce((total, section) => total + section.fields.length, 0)}{" "}
                fields
              </p>
              <span className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-hope-midnight">
                <Pencil className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                Edit form
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
