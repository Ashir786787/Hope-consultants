"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

import { OnboardingField } from "@/components/onboarding/onboarding-field";
import {
  UPLOAD_ACCEPT,
  UPLOAD_MAX_BYTES,
  UPLOAD_MAX_FILES,
  UPLOAD_MIME_TYPES,
} from "@/lib/forms/uploads";
import type { FormFileRef } from "@/lib/forms/types";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FormFileField({
  id,
  label,
  hint,
  required,
  error,
  value,
  onChange,
  uploadEndpoint,
}: {
  id: string;
  label: string;
  hint?: string;
  required: boolean;
  error?: string;
  value: FormFileRef[];
  onChange: (files: FormFileRef[]) => void;
  uploadEndpoint: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList);
    setLocalError(null);

    if (value.length + incoming.length > UPLOAD_MAX_FILES) {
      setLocalError(`You can upload up to ${UPLOAD_MAX_FILES} files for this field.`);
      return;
    }
    const invalid = incoming.find(
      (file) =>
        !(UPLOAD_MIME_TYPES as readonly string[]).includes(file.type) ||
        file.size > UPLOAD_MAX_BYTES
    );
    if (invalid) {
      setLocalError("Use a PDF, JPG, PNG or WEBP file no larger than 10 MB each.");
      return;
    }

    setBusy(true);
    try {
      const uploaded: FormFileRef[] = [];
      for (const file of incoming) {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch(uploadEndpoint, { method: "POST", body });
        const payload = (await response.json().catch(() => null)) as {
          file?: FormFileRef;
          error?: string;
        } | null;
        if (!response.ok || !payload?.file) {
          setLocalError(payload?.error ?? "We could not upload that file. Please try again.");
          break;
        }
        uploaded.push(payload.file);
      }
      if (uploaded.length > 0) onChange([...value, ...uploaded]);
    } catch {
      setLocalError("We could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <OnboardingField
      id={id}
      label={label}
      error={localError ?? error}
      hint={hint}
      required={required}
      field={id}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <label
            className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-hope-midnight/30 bg-hope-white px-4 text-sm font-semibold text-hope-midnight transition-colors hover:bg-hope-midnight/5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-hope-ember ${
              busy ? "opacity-60" : ""
            }`}
          >
            <Upload className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {value.length > 0 ? "Add more files" : "Choose files"}
            <input
              ref={inputRef}
              id={id}
              name={id}
              type="file"
              multiple
              accept={UPLOAD_ACCEPT}
              disabled={busy}
              aria-invalid={error ? true : undefined}
              onChange={(event) => void handleFiles(event.target.files)}
              className="sr-only"
            />
          </label>
          {busy ? (
            <p className="text-sm leading-6 text-hope-fog" aria-live="polite">
              Uploading…
            </p>
          ) : null}
        </div>
        {value.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {value.map((file) => (
              <li
                key={file.id}
                className="flex items-center gap-3 rounded-lg border border-hope-midnight/15 bg-hope-white px-3 py-2"
              >
                <span className="min-w-0 flex-1 truncate text-sm text-hope-midnight">
                  {file.name}
                </span>
                <span className="shrink-0 text-xs text-hope-fog">{formatSize(file.size)}</span>
                <button
                  type="button"
                  onClick={() => onChange(value.filter((entry) => entry.id !== file.id))}
                  className="shrink-0 text-sm font-semibold text-hope-midnight underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm leading-6 text-hope-fog">No files attached yet.</p>
        )}
      </div>
    </OnboardingField>
  );
}
