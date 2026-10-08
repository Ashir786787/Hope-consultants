"use client";

import type { ReactNode } from "react";

export function OnboardingProgress({
  page,
  total,
  label,
}: {
  page: number;
  total: number;
  label: string;
}) {
  const percent = Math.round((Math.min(Math.max(page, 1), total) / total) * 100);

  return (
    <div className="flex flex-col gap-2">
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-1.5 w-full overflow-hidden rounded-full bg-hope-midnight/10"
      >
        <div
          className="h-full rounded-full bg-hope-ember"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-sm font-semibold text-hope-fog">{label}</p>
    </div>
  );
}

export function OnboardingStepper({ children }: { children: ReactNode }) {
  return <ol className="flex flex-col gap-1 text-sm sm:flex-row sm:flex-wrap sm:gap-2">{children}</ol>;
}