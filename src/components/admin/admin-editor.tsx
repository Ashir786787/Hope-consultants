"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpenCheck,
  ChartColumn,
  Globe2,
  Layers3,
  ListTree,
  Newspaper,
  Quote,
  Settings2,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CoverImage } from "@/components/ui/cover-image";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import {
  defaultRecord,
  flattenRecord,
  schemaFor,
  slugify,
  unflattenRecord,
  type FieldDef,
  type CollectionSchema,
} from "@/lib/content/schemas";
import { SCHEMAS } from "@/lib/content/schemas";

const INPUT_CLASS =
  "w-full rounded-lg border border-border bg-hope-fog/10 px-3 py-2 text-sm text-card-foreground outline-none focus-visible:border-ring";

const NAV_ICONS: Record<string, typeof Layers3> = {
  services: Layers3,
  countries: Globe2,
  testimonials: Quote,
  scholarships: ChartColumn,
  resources: BookOpenCheck,
  process: ListTree,
  blog: Newspaper,
  site: Settings2,
};

type FieldMap = Record<string, unknown>;

export function AdminEditor({ storage }: { storage: "mongodb" | "json-files" }) {
  const router = useRouter();
  const [collection, setCollection] = useState<string>("services");
  const schema = schemaFor(collection) as CollectionSchema;
  const [model, setModel] = useState<FieldMap[] | null>(null);
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<FieldMap>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const activeSchema = schemaFor(collection);
    fetch(`/api/data/${collection}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { data?: unknown }) => {
        if (cancelled) return;
        const raw = payload.data;
        const records = Array.isArray(raw)
          ? (raw as unknown[])
          : raw == null
            ? []
            : [raw];
        const typed = records as FieldMap[];
        setModel(typed);
        if (activeSchema?.singleton && typed.length > 0) {
          setForm(flattenRecord(activeSchema, typed[0]));
          setEditing(0);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setModel([]);
          setError("Could not load this collection.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [collection]);

  function pickCollection(name: string) {
    setCollection(name);
    setModel(null);
    setEditing(null);
    setMessage(null);
    setError(null);
  }

  function startNew() {
    setForm(defaultRecord(schema));
    setEditing("new");
    setMessage(null);
  }

  function startEdit(index: number) {
    if (!model) return;
    setForm(flattenRecord(schema, model[index] as FieldMap));
    setEditing(index);
    setMessage(null);
  }

  function cancelEdit() {
    setEditing(schema.singleton ? 0 : null);
  }

  function handleField(field: FieldDef, value: unknown) {
    const next: FieldMap = { ...form, [field.key]: value };
    if (
      collection === "blog" &&
      field.key === "title" &&
      typeof value === "string"
    ) {
      const currentSlug = next.slug;
      next.slug =
        typeof currentSlug === "string" && currentSlug.trim()
          ? currentSlug
          : slugify(value);
    }
    setForm(next);
    if (error) setError(null);
  }

  function handleImage(field: FieldDef, file: File | undefined) {
    if (!file) return;
    if (file.size > 1_500_000) {
      setError("Image is too large — choose one under ~1.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => handleField(field, String(reader.result));
    reader.readAsDataURL(file);
  }

  async function persist(next: FieldMap[]) {
    setSaving(true);
    setMessage(null);
    setError(null);
    const payload = schema.singleton ? (next[0] ?? {}) : next;
    const response = await fetch(`/api/data/${collection}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: payload }),
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "Could not save.");
      setSaving(false);
      return false;
    }
    setModel(next);
    setEditing(schema.singleton ? 0 : null);
    setSaving(false);
    setMessage(
      collection === "blog"
        ? "Saved — published posts appear on /blog right away."
        : "Saved. Changes apply on the next build or deploy."
    );
    return true;
  }

  async function handleSave() {
    if (!model || editing === null) return;
    const record = unflattenRecord(schema, form);
    const next = model.slice();
    if (editing === "new") {
      next.push(record);
    } else {
      const existing = (model[editing] as FieldMap) ?? {};
      next[editing] = { ...existing, ...record };
    }
    await persist(next);
  }

  async function handleDelete(index: number) {
    if (!model || schema.singleton) return;
    if (!window.confirm(`Delete this ${schema.singular}? This cannot be undone.`)) {
      return;
    }
    const next = model.slice();
    next.splice(index, 1);
    await persist(next);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  function renderField(field: FieldDef) {
    const value = form[field.key];
    const id = `field-${field.key}`;
    const help = field.help ? (
      <p className="text-xs leading-5 text-muted-foreground">{field.help}</p>
    ) : null;

    switch (field.kind) {
      case "textarea":
        return (
          <>
            <textarea
              id={id}
              rows={4}
              className={INPUT_CLASS}
              value={String(value ?? "")}
              onChange={(event) => handleField(field, event.target.value)}
            />
            {help}
          </>
        );
      case "number":
        return (
          <>
            <input
              id={id}
              type="number"
              className={INPUT_CLASS}
              value={Number(value ?? 0)}
              onChange={(event) => handleField(field, Number(event.target.value))}
            />
            {help}
          </>
        );
      case "boolean":
        return (
          <div className="flex items-center gap-3">
            <input
              id={id}
              type="checkbox"
              className="h-4 w-4 accent-hope-ember"
              checked={Boolean(value)}
              onChange={(event) => handleField(field, event.target.checked)}
            />
            <span className="text-sm text-muted-foreground">
              {field.help ?? "Enabled"}
            </span>
          </div>
        );
      case "select":
        return (
          <>
            <select
              id={id}
              className={INPUT_CLASS}
              value={String(value ?? "")}
              onChange={(event) => handleField(field, event.target.value)}
            >
              {(field.options ?? []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {help}
          </>
        );
      case "liststrings":
        return (
          <>
            <textarea
              id={id}
              rows={Math.max(3, String(value ?? "").split("\n").length)}
              className={`${INPUT_CLASS} font-mono text-xs leading-6`}
              value={String(value ?? "")}
              onChange={(event) => handleField(field, event.target.value)}
            />
            {help}
          </>
        );
      case "image":
        return (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {typeof value === "string" && value.startsWith("data:") ? (
                <div className="h-32 w-56 overflow-hidden rounded-lg border border-border">
                  <CoverImage src={value} alt="" />
                </div>
              ) : (
                <div className="flex h-32 w-56 items-center justify-center rounded-lg border border-dashed border-border bg-hope-fog/10 text-xs text-muted-foreground">
                  No image yet
                </div>
              )}
              <input
                id={id}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-hope-ember/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-hope-ember"
                onChange={(event) =>
                  handleImage(field, event.target.files?.[0])
                }
              />
            </div>
            {help}
          </>
        );
      case "date":
        return (
          <>
            <input
              id={id}
              type="date"
              className={INPUT_CLASS}
              value={String(value ?? "")}
              onChange={(event) => handleField(field, event.target.value)}
            />
            {help}
          </>
        );
      default:
        return (
          <>
            <input
              id={id}
              type="text"
              className={INPUT_CLASS}
              placeholder={field.placeholder}
              value={String(value ?? "")}
              onChange={(event) => handleField(field, event.target.value)}
            />
            {help}
          </>
        );
    }
  }

  return (
    <main className="min-h-dvh bg-hope-white">
      <div className="flex flex-col lg:flex-row">
        <aside className="border-b border-hope-white/10 bg-hope-midnight lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="sticky top-0 flex flex-col gap-6 p-4 sm:px-6 lg:h-dvh lg:p-5">
            <div className="flex items-center justify-between gap-3 lg:justify-start">
              <Logo variant="lockup" className="h-10" />
              <Badge
                variant="outline"
                className="border-hope-white/15 text-hope-fog"
              >
                Panel
              </Badge>
            </div>

            <div className="flex flex-col gap-2">
              <span className="px-1 text-[0.65rem] font-semibold tracking-[0.18em] text-hope-fog uppercase">
                Content
              </span>
              <nav className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
                {SCHEMAS.map((item) => {
                  const Icon = NAV_ICONS[item.key];
                  const active = collection === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => pickCollection(item.key)}
                      className={cn(
                        "flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                        active
                          ? "bg-hope-ember text-hope-white"
                          : "text-hope-fog hover:bg-hope-white/10 hover:text-hope-white"
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4 shrink-0" />}
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto flex flex-col gap-1 border-t border-hope-white/10 pt-4">
              <Link
                href="/blog"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-hope-fog transition-colors hover:bg-hope-white/10 hover:text-hope-white"
              >
                <ExternalLink className="h-4 w-4 shrink-0" />
                View blog
              </Link>
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-hope-fog transition-colors hover:bg-hope-white/10 hover:text-hope-white"
              >
                <ExternalLink className="h-4 w-4 shrink-0" />
                View site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-hope-fog transition-colors hover:bg-hope-white/10 hover:text-hope-white"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <section className="flex-1">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:py-10">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{schema.label}</Badge>
                  <Badge variant="outline">
                    {storage === "mongodb" ? "MongoDB" : "JSON files"}
                  </Badge>
                </div>
                {model !== null && editing === null && !schema.singleton && (
                  <Button size="sm" onClick={startNew}>
                    Add new {schema.singular.toLowerCase()}
                  </Button>
                )}
              </div>
              <h1 className="font-display text-2xl font-semibold text-card-foreground">
                {schema.label}
              </h1>
              <p className="text-sm text-muted-foreground">
                {storage === "mongodb"
                  ? "Saved instantly to your database."
                  : `Stored locally in data/${collection}.json. ${
                      collection === "blog"
                        ? "Published posts appear on /blog right away; "
                        : ""
                    }Other changes apply on the next build or deploy. Add MONGODB_URI to switch to your database.`}
              </p>
            </div>

            <div className="hope-card hope-card--light flex flex-col gap-4 p-5">
              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              {model === null ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : editing === null ? (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Label className="font-medium">
                      {model.length} {model.length === 1 ? "record" : "records"}
                    </Label>
                  </div>
                  {model.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nothing here yet. Add the first record.
                    </p>
                  ) : (
                    <ul className="flex flex-col divide-y divide-border">
                      {model.map((record, index) => (
                        <li
                          key={`${index}-${JSON.stringify(record).slice(0, 48)}`}
                          className="flex items-center justify-between gap-3 py-3"
                        >
                          <span className="truncate text-sm font-medium text-card-foreground">
                            {String(record[schema.titleKey] ?? `Item ${index + 1}`)}
                          </span>
                          <div className="flex shrink-0 items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEdit(index)}
                            >
                              Edit
                            </Button>
                            {!schema.singleton && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(index)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Label className="font-medium">
                      {editing === "new"
                        ? `New ${schema.singular.toLowerCase()}`
                        : `Edit ${schema.singular.toLowerCase()} · ${
                            typeof editing === "number"
                              ? String(
                                  model[editing]?.[schema.titleKey] ??
                                    editing + 1
                                )
                              : ""
                          }`}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelEdit}
                        disabled={saving}
                      >
                        {schema.singleton ? "Reload" : "Cancel"}
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving…" : "Save"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {schema.fields.map((field) => {
                      const full = field.kind === "textarea";
                      return (
                        <div
                          key={field.key}
                          className={`flex flex-col gap-2 ${
                            full || field.kind === "image" ? "md:col-span-2" : ""
                          }`}
                        >
                          <Label
                            htmlFor={`field-${field.key}`}
                            className="text-xs font-semibold text-card-foreground"
                          >
                            {field.label}
                            {field.required ? " *" : ""}
                          </Label>
                          {renderField(field)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {message && (
                <p className="text-sm text-muted-foreground">{message}</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}