import type { LeadStatus } from "@/lib/admin/types";
import { LEAD_STATUSES } from "@/lib/admin/types";
import type { LeadDay } from "@/lib/admin/lead";

const DONUT_COLOURS: Record<LeadStatus, string> = {
  New: "var(--hope-ember)",
  Contacted: "var(--hope-midnight)",
  Converted: "var(--hope-fog)",
  Lost: "var(--hope-obsidian)",
};

const DONUT_ORDER: LeadStatus[] = ["New", "Contacted", "Converted", "Lost"];

function areaPath(points: { x: number; y: number }[], width: number, height: number): string {
  if (points.length === 0) return "";
  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");
  return `${line} L${width} ${height} L0 ${height} Z`;
}

export function AdminLeadsAreaChart({ data }: { data: LeadDay[] }) {
  const width = 640;
  const height = 220;
  const padding = { top: 16, right: 8, bottom: 28, left: 34 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const max = Math.max(1, ...data.map((day) => day.count));
  const step = data.length > 1 ? innerWidth / (data.length - 1) : 0;
  const points = data.map((day, index) => ({
    x: padding.left + (data.length > 1 ? index * step : innerWidth / 2),
    y: padding.top + innerHeight - (day.count / max) * innerHeight,
  }));
  const total = data.reduce((sum, day) => sum + day.count, 0);

  return (
    <figure className="flex flex-col gap-3 rounded-2xl border border-hope-midnight/10 bg-hope-white p-6">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-hope-midnight">Leads over the last 30 days</span>
        <span className="text-xs text-hope-fog">
          {total === 0 ? "No enquiries yet" : `${total} in the last 30 days`}
        </span>
      </figcaption>
      {total === 0 ? (
        <p className="rounded-xl border border-dashed border-hope-midnight/20 px-4 py-10 text-center text-sm text-hope-fog">
          The line appears here once the contact form starts sending enquiries.
        </p>
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          role="img"
          aria-label={`Leads per day over the last 30 days, ${total} in total, peaking at ${max} in a day`}
        >
          <title>Leads per day over the last 30 days</title>
          <line
            x1={padding.left}
            y1={padding.top + innerHeight}
            x2={width - padding.right}
            y2={padding.top + innerHeight}
            stroke="var(--hope-midnight)"
            strokeOpacity={0.15}
          />
          <path d={areaPath(points, width, padding.top + innerHeight)} fill="var(--hope-ember)" fillOpacity={0.16} />
          <path
            d={points
              .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
              .join(" ")}
            fill="none"
            stroke="var(--hope-ember)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((point, index) =>
            data[index] && data[index].count > 0 ? (
              <circle key={data[index].date} cx={point.x} cy={point.y} r={3.5} fill="var(--hope-ember)" />
            ) : null
          )}
          <text x={padding.left} y={height - 8} fontSize={11} fill="var(--hope-fog)">
            {data[0]?.date.slice(5) ?? ""}
          </text>
          <text x={width - padding.right} y={height - 8} fontSize={11} textAnchor="end" fill="var(--hope-fog)">
            {data[data.length - 1]?.date.slice(5) ?? ""}
          </text>
          <text x={4} y={padding.top + 4} fontSize={11} fill="var(--hope-fog)">
            {max}
          </text>
        </svg>
      )}
    </figure>
  );
}

export function AdminLeadStatusDonut({ counts }: { counts: Record<LeadStatus, number> }) {
  const total = LEAD_STATUSES.reduce((sum, status) => sum + (counts[status] ?? 0), 0);
  const size = 200;
  const radius = 70;
  const stroke = 28;
  const circumference = 2 * Math.PI * radius;

  const segments = DONUT_ORDER.reduce<
    { status: LeadStatus; dash: string; offset: number; length: number }[]
  >((accumulator, status) => {
      const value = counts[status] ?? 0;
      if (value === 0) return accumulator;
      const length = (value / total) * circumference;
      const previous = accumulator[accumulator.length - 1];
      const start = previous ? previous.offset + previous.length : 0;
      accumulator.push({
        status,
        dash: `${length} ${circumference - length}`,
        offset: start,
        length,
      });
      return accumulator;
    },
    []
  );

  return (
    <figure className="flex flex-col gap-4 rounded-2xl border border-hope-midnight/10 bg-hope-white p-6">
      <figcaption className="text-sm font-semibold text-hope-midnight">Leads by status</figcaption>
      {total === 0 ? (
        <p className="rounded-xl border border-dashed border-hope-midnight/20 px-4 py-10 text-center text-sm text-hope-fog">
          No enquiries to group yet.
        </p>
      ) : (
        <>
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="mx-auto h-auto w-40"
            role="img"
            aria-label={DONUT_ORDER.map((status) => `${counts[status] ?? 0} ${status}`).join(", ")}
          >
            <title>Leads by status</title>
            <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="var(--hope-midnight)"
                strokeOpacity={0.08}
                strokeWidth={stroke}
              />
              {segments.map((segment) => (
                <circle
                  key={segment.status}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={DONUT_COLOURS[segment.status]}
                  strokeWidth={stroke}
                  strokeDasharray={segment.dash}
                  strokeDashoffset={-segment.offset}
                />
              ))}
            </g>
            <text
              x={size / 2}
              y={size / 2 - 2}
              textAnchor="middle"
              fontSize={30}
              fontWeight={700}
              fill="var(--hope-midnight)"
            >
              {total}
            </text>
            <text x={size / 2} y={size / 2 + 18} textAnchor="middle" fontSize={11} fill="var(--hope-fog)">
              total
            </text>
          </svg>
          <ul className="flex flex-col gap-2">
            {DONUT_ORDER.map((status) => (
              <li key={status} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-hope-midnight">
                  <span
                    aria-hidden="true"
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: DONUT_COLOURS[status] }}
                  />
                  {status}
                </span>
                <span className="font-semibold text-hope-midnight">{counts[status] ?? 0}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </figure>
  );
}
