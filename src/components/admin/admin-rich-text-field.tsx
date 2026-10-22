"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import {
  Bold,
  Eye,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  PenLine,
  Quote,
  Underline,
} from "lucide-react";

import { adminControlClass } from "@/components/admin/admin-ui";
import { RichText } from "@/lib/blog/rich-text";

type ToolKey = "bold" | "italic" | "underline" | "h2" | "h3" | "bullet" | "numbered" | "quote";

const TOOLS: { key: ToolKey; label: string; icon: ReactNode }[] = [
  {
    key: "bold",
    label: "Bold (Ctrl+B)",
    icon: <Bold className="size-4" strokeWidth={2} aria-hidden="true" />,
  },
  {
    key: "italic",
    label: "Italic (Ctrl+I)",
    icon: <Italic className="size-4" strokeWidth={2} aria-hidden="true" />,
  },
  {
    key: "underline",
    label: "Underline (Ctrl+U)",
    icon: <Underline className="size-4" strokeWidth={2} aria-hidden="true" />,
  },
  {
    key: "h2",
    label: "Section heading",
    icon: <Heading2 className="size-4" strokeWidth={2} aria-hidden="true" />,
  },
  {
    key: "h3",
    label: "Sub heading",
    icon: <Heading3 className="size-4" strokeWidth={2} aria-hidden="true" />,
  },
  {
    key: "bullet",
    label: "Bulleted list",
    icon: <List className="size-4" strokeWidth={2} aria-hidden="true" />,
  },
  {
    key: "numbered",
    label: "Numbered list",
    icon: <ListOrdered className="size-4" strokeWidth={2} aria-hidden="true" />,
  },
  {
    key: "quote",
    label: "Quote",
    icon: <Quote className="size-4" strokeWidth={2} aria-hidden="true" />,
  },
];

const TOOL_BUTTON =
  "inline-flex size-11 items-center justify-center rounded-lg text-hope-midnight transition-colors hover:bg-hope-midnight/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember";

export function AdminRichTextField({
  id,
  value,
  error,
  describedBy,
  onChange,
}: {
  id: string;
  value: unknown;
  error?: string;
  describedBy?: string;
  onChange: (value: unknown) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);
  const text = typeof value === "string" ? value : "";
  const control = adminControlClass(Boolean(error));

  function applyInline(prefix: string, suffix: string, fallback: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = text.slice(start, end);
    const wrapped = selected.length > 0 ? selected : fallback;
    const next = `${text.slice(0, start)}${prefix}${wrapped}${suffix}${text.slice(end)}`;
    onChange(next);
    const caret = start + prefix.length + wrapped.length + suffix.length;
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(caret, caret);
    });
  }

  function applyLineMarker(marker: string | ((index: number) => string)) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const lineStart = text.lastIndexOf("\n", Math.max(start - 1, 0)) + 1;
    const lineEndIndex = text.indexOf("\n", end);
    const lineEnd = lineEndIndex === -1 ? text.length : lineEndIndex;
    const lines = text.slice(lineStart, lineEnd).split("\n");
    const updated = lines
      .map((line, index) => {
        const prefix = typeof marker === "string" ? marker : marker(index);
        return line.startsWith(prefix) ? line : `${prefix}${line}`;
      })
      .join("\n");
    const next = `${text.slice(0, lineStart)}${updated}${text.slice(lineEnd)}`;
    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart, lineStart + updated.length);
    });
  }

  function runTool(tool: ToolKey) {
    if (tool === "bold") applyInline("**", "**", "bold text");
    if (tool === "italic") applyInline("*", "*", "italic text");
    if (tool === "underline") applyInline("<u>", "</u>", "underlined text");
    if (tool === "h2") applyLineMarker("## ");
    if (tool === "h3") applyLineMarker("### ");
    if (tool === "bullet") applyLineMarker("- ");
    if (tool === "numbered") applyLineMarker((index) => `${index + 1}. `);
    if (tool === "quote") applyLineMarker("> ");
  }

  function handleToolClick(event: MouseEvent<HTMLButtonElement>) {
    const tool = event.currentTarget.dataset.tool as ToolKey | undefined;
    if (!tool) return;
    runTool(tool);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (!(event.ctrlKey || event.metaKey)) return;
    const key = event.key.toLowerCase();
    if (key === "b") {
      event.preventDefault();
      applyInline("**", "**", "bold text");
      return;
    }
    if (key === "i") {
      event.preventDefault();
      applyInline("*", "*", "italic text");
      return;
    }
    if (key === "u") {
      event.preventDefault();
      applyInline("<u>", "</u>", "underlined text");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-hope-midnight/15 bg-hope-midnight/5 p-1">
        {TOOLS.map((tool) => (
          <button
            key={tool.key}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            data-tool={tool.key}
            onClick={handleToolClick}
            className={TOOL_BUTTON}
          >
            {tool.icon}
          </button>
        ))}
        <button
          type="button"
          title={preview ? "Back to editing" : "Preview"}
          aria-label={preview ? "Back to editing" : "Preview"}
          aria-pressed={preview}
          onClick={() => setPreview((current) => !current)}
          className={`${TOOL_BUTTON} ml-auto`}
        >
          {preview ? (
            <PenLine className="size-4" strokeWidth={2} aria-hidden="true" />
          ) : (
            <Eye className="size-4" strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>

      {preview ? (
        <div className="min-h-64 rounded-xl border border-hope-midnight/20 bg-hope-white px-4 py-4">
          {text.trim().length > 0 ? (
            <RichText content={text} />
          ) : (
            <p className="text-sm text-hope-fog">Nothing to preview yet.</p>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          id={id}
          aria-invalid={error ? (true as const) : undefined}
          aria-describedby={describedBy}
          aria-required
          rows={18}
          value={text}
          spellCheck
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className={`${control} resize-y py-3 leading-7`}
        />
      )}
    </div>
  );
}
