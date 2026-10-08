"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

type CopyState = "idle" | "copied" | "failed";

export function AdminCopyLink({ url }: { url: string }) {
  const [state, setState] = useState<CopyState>("idle");
  const [announcement, setAnnouncement] = useState("");
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  function announce(next: CopyState) {
    setState(next);
    setAnnouncement(next === "copied" ? "Link copied to clipboard" : "Copy failed, select and copy manually");
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setState("idle"), 2500);
  }

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const area = document.createElement("textarea");
        area.value = url;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(area);
        if (!ok) {
          announce("failed");
          return;
        }
      }
      announce("copied");
    } catch {
      announce("failed");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="onboarding-share-link"
        className="text-sm font-semibold text-hope-midnight"
      >
        Share this link directly with students
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="onboarding-share-link"
          readOnly
          value={url}
          onFocus={(event) => event.currentTarget.select()}
          className="min-h-11 flex-1 rounded-lg border border-hope-midnight/20 bg-hope-white px-3 font-mono text-sm text-hope-midnight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
        />
        <Button
          type="button"
          onClick={copy}
          className="min-h-11 shrink-0"
          aria-describedby="onboarding-share-link"
        >
          {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy link"}
        </Button>
      </div>
      <p className="text-sm leading-6 text-hope-fog">
        This page is not linked from anywhere on the website and is excluded from search engines.
        Send it only to the students you want to fill it in.
      </p>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}