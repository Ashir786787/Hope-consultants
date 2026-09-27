import { redirect } from "next/navigation";

import { AdminEditor } from "@/components/admin/admin-editor";
import { requireAdmin } from "@/lib/admin/require-admin";
import { SCHEMAS, schemaFor } from "@/lib/content/schemas";
import { mongoConfigured } from "@/lib/mongo";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const admin = await requireAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const requested = firstValue((await searchParams).collection);
  const collection = schemaFor(requested ?? "")?.key ?? SCHEMAS[0].key;

  return (
    <AdminEditor
      collection={collection}
      storage={mongoConfigured() ? "mongodb" : "json-files"}
    />
  );
}
