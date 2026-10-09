import { redirect } from "next/navigation";

import { AdminEditor } from "@/components/admin/admin-editor";
import { firstPermittedHref } from "@/lib/admin/permissions";
import { requireSection } from "@/lib/admin/require-admin";
import { CONTENT_KEYS } from "@/lib/content/schemas";
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
  const admin = await requireSection("content");

  const contentCollections = admin.contentCollections;
  const allowedKeys =
    contentCollections === null || contentCollections === undefined
      ? [...CONTENT_KEYS]
      : CONTENT_KEYS.filter((key) => contentCollections.includes(key));

  if (allowedKeys.length === 0) {
    redirect(firstPermittedHref(admin));
  }

  const requested = firstValue((await searchParams).collection);
  const collection = allowedKeys.includes(requested ?? "")
    ? (requested ?? "")
    : allowedKeys[0];

  return (
    <AdminEditor
      collection={collection}
      storage={mongoConfigured() ? "mongodb" : "json-files"}
      allowedCollections={allowedKeys}
    />
  );
}
