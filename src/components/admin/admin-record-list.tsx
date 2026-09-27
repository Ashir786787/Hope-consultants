"use client";

import { useMemo } from "react";
import type { RefObject } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Search, Trash2 } from "lucide-react";

import { AdminButton } from "@/components/admin/admin-ui";
import {
  recordMeta,
  recordSearchText,
  recordTitle,
  type FieldMap,
} from "@/lib/admin/content-form";
import type { CollectionSchema } from "@/lib/content/schemas";

export function AdminRecordList({
  schema,
  records,
  query,
  onQueryChange,
  onEdit,
  onMove,
  onDelete,
  onCreate,
  saving,
  headingRef,
}: {
  schema: CollectionSchema;
  records: FieldMap[];
  query: string;
  onQueryChange: (value: string) => void;
  onEdit: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onDelete: (index: number) => void;
  onCreate: () => void;
  saving: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return records
      .map((record, index) => ({ record, index }))
      .filter(({ record }) => !needle || recordSearchText(schema, record).includes(needle));
  }, [records, query, schema]);

  const iconButton =
    "grid size-11 shrink-0 place-items-center rounded-lg border border-hope-midnight/15 text-hope-midnight transition-colors hover:border-hope-ember/60 hover:bg-hope-ember/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-hope-midnight/15 disabled:hover:bg-transparent";

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-xl font-semibold text-hope-midnight focus-visible:outline-none"
        >
          {schema.label}
          <span className="ml-2 text-base font-normal text-hope-fog tabular-nums">
            {records.length}
          </span>
        </h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {records.length > 4 ? (
            <div className="relative sm:w-64">
              <label htmlFor="admin-record-search" className="sr-only">
                Search {schema.label.toLowerCase()}
              </label>
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-hope-fog"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <input
                id="admin-record-search"
                type="search"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder={`Search ${schema.label.toLowerCase()}`}
                className="min-h-11 w-full rounded-xl border border-hope-midnight/20 bg-hope-white pr-3 pl-9 text-sm text-hope-midnight transition-colors placeholder:text-hope-fog focus-visible:border-hope-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
              />
            </div>
          ) : null}
          <AdminButton
            variant="primary"
            onClick={onCreate}
            disabled={saving}
            className="w-full sm:w-auto"
          >
            <Plus className="size-4" strokeWidth={1.75} aria-hidden="true" />
            Add {schema.singular.toLowerCase()}
          </AdminButton>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-hope-midnight/20 bg-hope-midnight/[0.02] px-6 py-12 text-center">
          <p className="font-display text-lg font-semibold text-hope-midnight">
            No {schema.label.toLowerCase()} yet
          </p>
          <p className="max-w-sm text-sm leading-6 text-hope-fog">
            This collection is empty. Add the first {schema.singular.toLowerCase()} and it
            will be saved to your content straight away.
          </p>
          <AdminButton variant="primary" onClick={onCreate} disabled={saving}>
            <Plus className="size-4" strokeWidth={1.75} aria-hidden="true" />
            Add {schema.singular.toLowerCase()}
          </AdminButton>
        </div>
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-hope-midnight/15 px-6 py-12 text-center">
          <p className="font-display text-lg font-semibold text-hope-midnight">
            Nothing matches “{query.trim()}”
          </p>
          <p className="text-sm text-hope-fog">
            {records.length} {records.length === 1 ? "record" : "records"} in this
            collection.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {matches.map(({ record, index }, position) => {
            const title = recordTitle(schema, record, index);
            const meta = recordMeta(schema, record);
            return (
              <li
                key={`${index}-${title}`}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-hope-midnight/10 bg-hope-white p-3 transition-colors hover:border-hope-ember/50 sm:flex-nowrap sm:px-4"
              >
                <span
                  className="hidden w-6 shrink-0 text-center text-xs font-semibold text-hope-fog tabular-nums sm:block"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-hope-midnight">
                    {title}
                  </p>
                  {meta ? (
                    <p className="truncate text-xs text-hope-fog">{meta}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {!schema.singleton ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onMove(index, -1)}
                        disabled={saving || position === 0}
                        aria-label={`Move ${title} up`}
                        className={iconButton}
                      >
                        <ArrowUp className="size-4" strokeWidth={1.75} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMove(index, 1)}
                        disabled={saving || position === matches.length - 1}
                        aria-label={`Move ${title} down`}
                        className={iconButton}
                      >
                        <ArrowDown className="size-4" strokeWidth={1.75} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(index)}
                        disabled={saving}
                        aria-label={`Delete ${title}`}
                        className={iconButton}
                      >
                        <Trash2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
                      </button>
                    </>
                  ) : null}
                  <AdminButton
                    variant="secondary"
                    onClick={() => onEdit(index)}
                    disabled={saving}
                    className="ml-1"
                  >
                    <Pencil className="size-4" strokeWidth={1.75} aria-hidden="true" />
                    Edit
                  </AdminButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
