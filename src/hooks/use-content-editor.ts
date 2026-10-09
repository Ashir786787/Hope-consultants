"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  toRecords,
  validateContentForm,
  type FieldMap,
} from "@/lib/admin/content-form";
import {
  defaultRecord,
  flattenRecord,
  SCHEMAS,
  schemaFor,
  slugify,
  unflattenRecord,
  type FieldDef,
} from "@/lib/content/schemas";

export type ContentDialog =
  | { kind: "delete"; index: number }
  | { kind: "discard" }
  | null;
export type ContentResult = { ok: boolean; message: string };

const IMAGE_LIMIT = 1_500_000;
const LOAD_ERROR =
  "We could not load this collection. Check your connection, then pick another collection and come back.";

function fingerprint(value: FieldMap): string {
  return JSON.stringify(Object.keys(value).sort().map((key) => [key, value[key]]));
}

export function useContentEditor(initialCollection: string, allowedKeys?: string[]) {
  const router = useRouter();
  const [collection, setCollection] = useState<string>(initialCollection);
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [records, setRecords] = useState<FieldMap[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<FieldMap>({});
  const [baseline, setBaseline] = useState<FieldMap>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<ContentDialog>(null);
  const primed = useRef(false);

  const schema = useMemo(() => schemaFor(collection) ?? SCHEMAS[0], [collection]);

  const [syncedFrom, setSyncedFrom] = useState(initialCollection);
  if (syncedFrom !== initialCollection) {
    setSyncedFrom(initialCollection);
    setCollection(initialCollection);
  }

  const applyRecords = useCallback(
    (next: FieldMap[] | null) => {
      if (next === null) {
        setRecords([]);
        setLoadError(LOAD_ERROR);
        return;
      }
      setRecords(next);
      setLoadError(null);
      if (!schema.singleton) return;
      const source =
        next.length > 0 ? flattenRecord(schema, next[0]) : defaultRecord(schema);
      setForm(source);
      setBaseline(source);
      setErrors({});
      setEditing(next.length > 0 ? 0 : "new");
    },
    [schema],
  );

  useEffect(() => {
    let cancelled = false;
    const keys = primed.current
      ? [collection]
      : allowedKeys && allowedKeys.length > 0
        ? allowedKeys
        : SCHEMAS.map((item) => item.key);

    async function load() {
      const results = await Promise.all(
        keys.map(async (key) => {
          try {
            const response = await fetch(`/api/data/${key}`, { cache: "no-store" });
            if (!response.ok) return { key, records: null };
            const payload = (await response.json()) as { data?: unknown };
            return { key, records: toRecords(payload.data) };
          } catch {
            return { key, records: null };
          }
        }),
      );
      if (cancelled) return;
      primed.current = true;

      const loaded = new Map(results.map((item) => [item.key, item.records]));
      setCounts((previous) => {
        const next = { ...previous };
        for (const [key, value] of loaded) {
          next[key] = value === null ? null : value.length;
        }
        return next;
      });
      applyRecords(loaded.get(collection) ?? null);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [collection, applyRecords, allowedKeys]);

  const dirty = useMemo(
    () => fingerprint(form) !== fingerprint(baseline),
    [form, baseline],
  );

  async function persist(next: FieldMap[], successMessage: string): Promise<ContentResult> {
    setSaving(true);
    const payload = schema.singleton ? (next[0] ?? {}) : next;
    try {
      const response = await fetch(`/api/data/${collection}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        return {
          ok: false,
          message: body?.error ?? "We could not save your changes. Try again.",
        };
      }
      applyRecords(next);
      return { ok: true, message: successMessage };
    } catch {
      return {
        ok: false,
        message: "We could not reach the server, so nothing was saved.",
      };
    } finally {
      setSaving(false);
    }
  }

  function pickCollection(key: string) {
    if (key === collection) return;
    setCollection(key);
    setRecords(null);
    setEditing(null);
    setQuery("");
    setErrors({});
    setLoadError(null);
    setDialog(null);
    router.replace(`/admin/content?collection=${key}`, { scroll: false });
  }

  function loadIntoForm(source: FieldMap, index: number | "new") {
    setForm(source);
    setBaseline(source);
    setErrors({});
    setEditing(index);
  }

  function startEdit(index: number) {
    if (!records) return;
    loadIntoForm(flattenRecord(schema, records[index]), index);
  }

  function startNew() {
    loadIntoForm(defaultRecord(schema), "new");
  }

  function closeEditor() {
    setErrors({});
    setQuery("");
    if (schema.singleton) {
      const hasRecord = Boolean(records && records.length > 0);
      const source =
        records && hasRecord
          ? flattenRecord(schema, records[0])
          : defaultRecord(schema);
      loadIntoForm(source, hasRecord ? 0 : "new");
      return;
    }
    setEditing(null);
  }

  function requestClose() {
    if (editing === null) return;
    if (!dirty) {
      closeEditor();
      return;
    }
    setDialog({ kind: "discard" });
  }

  function confirmClose() {
    setDialog(null);
    closeEditor();
  }

  function setField(field: FieldDef, value: unknown) {
    setForm((previous) => {
      const next = { ...previous, [field.key]: value };
      if (collection === "blog" && field.key === "title" && typeof value === "string") {
        const currentSlug = next.slug;
        next.slug =
          typeof currentSlug === "string" && currentSlug.trim()
            ? currentSlug
            : slugify(value);
      }
      return next;
    });
    setErrors((previous) => {
      if (!previous[field.key]) return previous;
      const next = { ...previous };
      delete next[field.key];
      return next;
    });
  }

  function readImage(field: FieldDef, file: File, onTooLarge: () => void) {
    if (file.size > IMAGE_LIMIT) {
      onTooLarge();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setField(field, String(reader.result));
    reader.onerror = onTooLarge;
    reader.readAsDataURL(file);
  }

  async function save(): Promise<ContentResult | null> {
    if (!records || editing === null) return null;
    const found = validateContentForm(schema, form);
    setErrors(found);
    const invalid = schema.fields.find((field) => found[field.key]);
    if (invalid) {
      return {
        ok: false,
        message: `Fill in ${invalid.label.toLowerCase()} before saving.`,
      };
    }

    const record = unflattenRecord(schema, form);
    const next = records.slice();
    const adding = editing === "new";
    if (adding) {
      next.push(record);
    } else {
      next[editing] = { ...records[editing], ...record };
    }

    const name = schema.singular.toLowerCase();
    const result = await persist(next, adding ? `${name} added.` : `${name} saved.`);
    if (result.ok && !schema.singleton) {
      setEditing(null);
      setQuery("");
    }
    return result;
  }

  async function move(index: number, direction: -1 | 1): Promise<ContentResult> {
    if (!records || schema.singleton) {
      return { ok: false, message: "This collection cannot be reordered." };
    }
    const target = index + direction;
    if (target < 0 || target >= records.length) {
      return { ok: false, message: "That record is already at the end of the list." };
    }
    const next = records.slice();
    const moved = next[index];
    next.splice(index, 1);
    next.splice(target, 0, moved);
    return persist(next, "Order updated.");
  }

  async function remove(index: number): Promise<ContentResult> {
    if (!records || schema.singleton) {
      return { ok: false, message: "This record cannot be deleted." };
    }
    const next = records.slice();
    next.splice(index, 1);
    const result = await persist(next, "Record deleted.");
    if (result.ok) {
      setEditing(null);
      setQuery("");
      setDialog(null);
    }
    return result;
  }

  return {
    collection,
    schema,
    counts,
    records,
    loadError,
    editing,
    form,
    errors,
    dirty,
    saving,
    query,
    dialog,
    setQuery,
    setDialog,
    pickCollection,
    startEdit,
    startNew,
    requestClose,
    confirmClose,
    setField,
    readImage,
    save,
    move,
    remove,
  };
}
