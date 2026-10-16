import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { AdminFormBuilder } from "@/components/admin/admin-form-builder";
import { getFormDefinition } from "@/lib/forms/store";
import { isFormKey } from "@/lib/forms/definitions";
import { requireSection } from "@/lib/admin/require-admin";

export const metadata: Metadata = {
  title: "Form builder",
  robots: { index: false, follow: false },
};

export default async function AdminFormBuilderPage({
  params,
}: {
  params: Promise<{ form: string }>;
}) {
  await requireSection("forms");
  const { form } = await params;
  if (!isFormKey(form)) notFound();

  const definition = await getFormDefinition(form);

  return (
    <>
      <header className="flex flex-col gap-2">
        <Link
          href="/admin/forms"
          className="text-sm font-semibold text-hope-midnight underline decoration-hope-ember decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
        >
          Back to forms
        </Link>
        <h1 className="font-display text-3xl font-bold text-hope-midnight">{definition.title}</h1>
        <p className="text-hope-fog">
          Edit the sections and fields of this form. Changes appear on the live form after saving.
        </p>
      </header>

      <AdminFormBuilder definition={definition} />
    </>
  );
}
