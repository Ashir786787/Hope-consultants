"use client";

export function AdminSwitch({
  id,
  checked,
  label,
  onChange,
}: {
  id: string;
  checked: boolean;
  label: string;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex min-h-11 items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
    >
      <span
        aria-hidden="true"
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors ${
          checked
            ? "border-hope-ember bg-hope-ember"
            : "border-hope-midnight/25 bg-hope-midnight/10 hover:border-hope-midnight/40"
        }`}
      >
        <span
          className={`absolute top-1 left-0.5 size-4 rounded-full transition-transform duration-200 motion-reduce:transition-none ${
            checked ? "translate-x-6 bg-hope-midnight" : "bg-hope-midnight/60"
          }`}
        />
      </span>
      <span className="text-sm font-medium text-hope-midnight">{label}</span>
    </button>
  );
}
