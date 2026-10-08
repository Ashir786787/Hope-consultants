import Link from "next/link";

import { cn } from "@/lib/utils";

export function AdminStatCard({
  label,
  value,
  supporting,
  accent,
  badge,
  href,
}: {
  label: string;
  value: number;
  supporting: string;
  accent: "ember" | "midnight";
  badge?: number;
  href?: string;
}) {
  const surface =
    "relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-hope-midnight/15 bg-hope-white p-6 [box-shadow:var(--shadow-card)]";

  const body = (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${
          accent === "ember" ? "bg-hope-ember" : "bg-hope-midnight"
        }`}
      />
      <h3 className="text-sm font-semibold text-hope-midnight">{label}</h3>
      <div className="flex items-center gap-3">
        <p className="font-display text-4xl font-bold text-hope-midnight">{value}</p>
        {badge !== undefined && badge > 0 ? (
          <span className="rounded-full bg-hope-ember px-2.5 py-1 text-xs font-bold text-hope-midnight tabular-nums">
            {badge} new
          </span>
        ) : null}
      </div>
      <p className="text-sm text-hope-fog">{supporting}</p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          surface,
          "transition-colors hover:border-hope-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember",
        )}
      >
        {body}
      </Link>
    );
  }

  return <article className={surface}>{body}</article>;
}
