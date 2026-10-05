import { cn } from "@/lib/utils";

export function PlaneMotif({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 200"
      fill="none"
      className={cn("pointer-events-none block", className)}
    >
      <path
        d="M12 160C48 104 104 70 150 62"
        stroke="rgb(var(--hope-ember-rgb))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="5 12"
        opacity="0.34"
      />
      <g transform="translate(138 40) rotate(-22) scale(3)" fill="rgb(var(--hope-ember-rgb))">
        <path d="M2.5 3.2 21.5 12 2.5 20.8l2.9-8.8z" />
      </g>
    </svg>
  );
}
