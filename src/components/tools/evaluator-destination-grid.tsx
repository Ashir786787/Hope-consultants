import { CountryFlag } from "@/components/countries/country-flag";
import type { EvaluatorDestination } from "@/lib/data/profile-evaluator";

export function EvaluatorDestinationGrid({
  destinations,
}: {
  destinations: EvaluatorDestination[];
}) {
  if (destinations.length === 0) return null;

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {destinations.map((country) => (
        <li
          key={country.name}
          className="flex items-center gap-3 rounded-2xl border border-hope-midnight/10 bg-hope-white p-4 shadow-[0_1px_2px_rgb(var(--hope-midnight-rgb)/0.06),0_24px_48px_-24px_rgb(var(--hope-midnight-rgb)/0.18)]"
        >
          <CountryFlag iso={country.iso} className="text-3xl" />
          <span className="text-base font-semibold text-hope-midnight">{country.name}</span>
        </li>
      ))}
    </ul>
  );
}
