"use client";

export function AdminStatusFilter({
  id,
  statuses,
  value,
  name = "status",
  allLabel = "All statuses",
  label = "Filter by status",
}: {
  id: string;
  statuses: readonly string[];
  value: string;
  name?: string;
  allLabel?: string;
  label?: string;
}) {
  return (
    <div className="w-full sm:w-56">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={value}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="min-h-11 w-full rounded-xl border border-hope-midnight/20 bg-hope-white px-3 text-sm text-hope-midnight transition-colors focus-visible:border-hope-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hope-ember"
      >
        <option value="">{allLabel}</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}
