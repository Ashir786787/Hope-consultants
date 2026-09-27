export function GlobeMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="60" cy="60" r="34" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="60" cy="60" rx="14" ry="34" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="60" cy="60" rx="25" ry="34" stroke="currentColor" strokeWidth="0.6" />
      <path d="M26 60h68" stroke="currentColor" strokeWidth="1" />
      <path
        d="M32 42c9 5 19 7 28 7s19-2 28-7M32 78c9-5 19-7 28-7s19 2 28 7"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      <path
        d="M12 96c14 8 30 12 48 12s34-4 48-12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M22 104c10 5 23 8 38 8s28-3 38-8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
