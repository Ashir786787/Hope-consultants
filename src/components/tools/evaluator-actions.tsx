"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Download, Mail, Printer, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export type EvaluatorActionsProps = {
  csv: string;
  mailto: string;
  summary: string;
  onReset: () => void;
};

type CopyState = "idle" | "copied" | "failed";

const FILE_NAME = "hope-consultants-profile-evaluation.csv";

export function EvaluatorActions({ csv, mailto, summary, onReset }: EvaluatorActionsProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function announceCopy(next: CopyState) {
    setCopyState(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopyState("idle"), 2600);
  }

  async function copySummary() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summary);
      } else {
        const area = document.createElement("textarea");
        area.value = summary;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(area);
        if (!ok) {
          announceCopy("failed");
          return;
        }
      }
      announceCopy("copied");
    } catch {
      announceCopy("failed");
    }
  }

  function exportCsv() {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = FILE_NAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="evaluator-no-print flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Button type="button" size="lg" className="w-full" onClick={() => window.print()}>
          <Printer className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Print / Save PDF Report
        </Button>
        <Button type="button" size="lg" variant="outline" className="w-full" onClick={exportCsv}>
          <Download className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Export CSV Data
        </Button>
        <Button
          nativeButton={false}
          render={<a href={mailto} />}
          size="lg"
          variant="outline"
          className="w-full"
        >
          <Mail className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Email Report
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="w-full"
          onClick={copySummary}
        >
          <Copy className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Copy Text Summary
        </Button>
        <Button type="button" size="lg" variant="outline" className="w-full" onClick={onReset}>
          <RotateCcw className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Start New Assessment
        </Button>
      </div>
      <p aria-live="polite" className="sr-only">
        {copyState === "copied"
          ? "Summary copied to clipboard"
          : copyState === "failed"
            ? "Copy failed, select and copy manually"
            : ""}
      </p>
      {copyState === "idle" ? null : (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4">
          <div
            role={copyState === "failed" ? "alert" : "status"}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-hope-midnight/15 bg-hope-white px-4 py-3 shadow-[0_1px_2px_rgb(var(--hope-midnight-rgb)/0.06),0_24px_48px_-24px_rgb(var(--hope-midnight-rgb)/0.28)]"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-hope-ember text-hope-midnight">
              <Check className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="text-sm font-medium text-hope-midnight">
              {copyState === "failed" ? "Copy failed, select and copy manually" : "Summary copied to clipboard"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
