"use client";

import { useState } from "react";
import { ImageOff, LinkIcon, Upload } from "lucide-react";

import { CoverImage } from "@/components/ui/cover-image";

const ACCEPT = "image/png,image/jpeg,image/webp,image/avif";

export function AdminImageField({
  id,
  value,
  onPick,
  onChange,
  onClear,
  onError,
}: {
  id: string;
  value: string;
  onPick: (file: File) => void;
  onChange: (value: string) => void;
  onClear: () => void;
  onError: (message: string) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const hasImage = Boolean(value);

  function accept(file: File | undefined) {
    if (file) onPick(file);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            accept(event.dataTransfer.files?.[0]);
          }}
          className={`relative h-36 w-full shrink-0 overflow-hidden rounded-xl border bg-hope-midnight/5 transition-colors sm:w-56 ${
            dragging ? "border-hope-ember" : "border-hope-midnight/15"
          }`}
        >
          {hasImage ? (
            <CoverImage src={value} alt="" />
          ) : (
            <div className="grid h-full place-items-center px-4 text-center text-xs text-hope-fog">
              No image yet — drop one here or paste a URL below
            </div>
          )}
        </div>
        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-wrap gap-2">
            <label
              htmlFor={id}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-hope-ember px-4 text-sm font-semibold text-hope-midnight transition-[filter] hover:brightness-105 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-hope-ember"
            >
              <Upload className="size-4" strokeWidth={1.75} aria-hidden="true" />
              {hasImage ? "Replace image" : "Choose image"}
            </label>
            {hasImage ? (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-hope-midnight/30 px-4 text-sm font-semibold text-hope-midnight transition-colors hover:bg-hope-midnight/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
              >
                <ImageOff className="size-4" strokeWidth={1.75} aria-hidden="true" />
                Remove
              </button>
            ) : null}
          </div>
          <input
            id={id}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={(event) => {
              accept(event.target.files?.[0]);
              event.target.value = "";
            }}
            onError={() => onError("That file could not be read. Try another one.")}
          />
          <p className="text-xs text-hope-fog">
            Upload a file, or use the URL field below to link an existing image.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-url`} className="flex items-center gap-2 text-sm font-medium text-hope-midnight">
          <LinkIcon className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Image URL
        </label>
        <input
          id={`${id}-url`}
          type="url"
          inputMode="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://example.com/image.jpg or /services/your-image.jpg"
          className="w-full rounded-lg border border-hope-midnight/20 bg-hope-white px-4 py-2.5 text-sm text-hope-midnight shadow-[0_1px_2px_rgb(var(--hope-midnight-rgb)/0.04)] transition-colors placeholder:text-hope-fog/70 focus:border-hope-ember focus:outline-2 focus:outline-offset-2 focus:outline-hope-ember"
        />
        <p className="text-xs text-hope-fog">
          If you paste a URL, it will be used as-is. For local files in <code className="rounded bg-hope-midnight/5 px-1">/public</code>, use a path like
          <code className="rounded bg-hope-midnight/5 px-1">/services/cover.jpg</code>.
        </p>
      </div>
    </div>
  );
}
