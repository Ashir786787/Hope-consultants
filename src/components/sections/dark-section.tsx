import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DarkSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function DarkSection({ children, className, id }: DarkSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate overflow-hidden border-y border-[rgb(255_255_255/0.10)] bg-hope-midnight",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(var(--hope-ember-rgb)/0.12),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="hope-dot-grid pointer-events-none absolute inset-0 opacity-[0.06]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        {children}
      </div>
    </section>
  );
}
