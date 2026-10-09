"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { AdminCollectionNav } from "@/components/admin/admin-collection-nav";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminContentHeader } from "@/components/admin/admin-content-header";
import { AdminContentSkeleton } from "@/components/admin/admin-content-skeleton";
import { AdminRecordForm } from "@/components/admin/admin-record-form";
import { AdminRecordList } from "@/components/admin/admin-record-list";
import { AdminToast, type AdminToastState } from "@/components/admin/admin-toast";
import { AdminAlert } from "@/components/admin/admin-ui";
import { recordTitle } from "@/lib/admin/content-form";
import { useContentEditor } from "@/hooks/use-content-editor";

export function AdminEditor({
  collection,
  storage,
  allowedCollections,
}: {
  collection: string;
  storage: "mongodb" | "json-files";
  allowedCollections: string[];
}) {
  const editor = useContentEditor(collection, allowedCollections);
  const {
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
  } = editor;

  const [toast, setToast] = useState<AdminToastState>(null);
  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const listHeadingRef = useRef<HTMLHeadingElement>(null);
  const requestCloseRef = useRef(editor.requestClose);

  const notify = useCallback((result: { ok: boolean; message: string }) => {
    setToast({ tone: result.ok ? "success" : "error", text: result.message });
  }, []);

  useEffect(() => {
    requestCloseRef.current = editor.requestClose;
  });

  useEffect(() => {
    if (editing !== null) {
      formHeadingRef.current?.focus();
      return;
    }
    listHeadingRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    if (dirty === false || editing === null) return;
    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty, editing]);

  useEffect(() => {
    if (editing === null || dialog) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        requestCloseRef.current();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editing, dialog]);

  const heading =
    editing === "new"
      ? `New ${schema.singular.toLowerCase()}`
      : `Edit ${schema.singular.toLowerCase()}${
          editing !== null && records
            ? ` · ${recordTitle(schema, records[editing], editing)}`
            : ""
        }`;

  const deleteTitle =
    dialog?.kind === "delete" && records ? recordTitle(schema, records[dialog.index], dialog.index) : "";

  return (
    <div className="flex flex-col gap-7">
      <AdminContentHeader schema={schema} />

      <AdminCollectionNav
        active={editor.collection}
        counts={counts}
        onSelect={editor.pickCollection}
        only={allowedCollections}
      />

      {loadError ? <AdminAlert tone="error">{loadError}</AdminAlert> : null}

      {records === null ? (
        <AdminContentSkeleton />
      ) : editing !== null ? (
        <AdminRecordForm
          schema={schema}
          form={form}
          errors={errors}
          dirty={dirty}
          saving={saving}
          heading={heading}
          headingRef={formHeadingRef}
          onField={editor.setField}
          onPickImage={(field, file) =>
            editor.readImage(field, file, () =>
              notify({
                ok: false,
                message: "That image is larger than 1.5 MB. Please choose a smaller file.",
              }),
            )
          }
          onSave={async () => {
            const result = await editor.save();
            if (result) notify(result);
          }}
          onDiscard={editor.requestClose}
          onToast={(text) => notify({ ok: false, message: text })}
        />
      ) : (
        <AdminRecordList
          schema={schema}
          records={records}
          query={query}
          onQueryChange={editor.setQuery}
          onEdit={editor.startEdit}
          onMove={async (index, direction) => notify(await editor.move(index, direction))}
          onDelete={(index) => editor.setDialog({ kind: "delete", index })}
          onCreate={editor.startNew}
          saving={saving}
          headingRef={listHeadingRef}
        />
      )}

      <p className="border-t border-hope-midnight/10 pt-4 text-sm leading-6 text-hope-fog">
        {storage === "mongodb"
          ? "Saved instantly to your content store."
          : `Stored locally in data/${editor.collection}.json. ${
              editor.collection === "blog"
                ? "Published posts appear on /blog right away; "
                : ""
            }Other changes apply on the next build or deploy.`}
      </p>

      <AdminConfirmDialog
        open={dialog !== null}
        busy={saving}
        title={dialog?.kind === "delete" ? `Delete ${deleteTitle}?` : "Discard your changes?"}
        description={
          dialog?.kind === "delete"
            ? `This removes ${deleteTitle || "this record"} from the ${schema.label.toLowerCase()} collection straight away. This cannot be undone.`
            : "Your edits to this record have not been saved yet. Discarding goes back to the version that is live."
        }
        confirmLabel={dialog?.kind === "delete" ? "Delete record" : "Discard changes"}
        onCancel={() => editor.setDialog(null)}
        onConfirm={async () => {
          if (dialog?.kind === "delete") {
            notify(await editor.remove(dialog.index));
            return;
          }
          editor.confirmClose();
        }}
      />

      <AdminToast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
