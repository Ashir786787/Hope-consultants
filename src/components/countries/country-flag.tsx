function star(cx: number, cy: number, r: number, rotation = 0): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? r : r * 0.382;
    const angle = (Math.PI / 5) * i - Math.PI / 2 + rotation;
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`);
  }
  return points.join(" ");
}

const BORDERS = "#1A1A1A";

const CRESCENT_PATH =
  "M11.38 10.139A4 4 0 1 1 11.38 5.861A3.2 3.2 0 1 0 11.38 10.139Z";

const CRESCENT_STAR_POINTS = star(13.13, 8, 2, -Math.PI / 2);

const IT = (
  <>
    <rect width="8" height="16" fill="#169B62" />
    <rect x="8" width="8" height="16" fill="#FFFFFF" />
    <rect x="16" width="8" height="16" fill="#CE1126" />
  </>
);

const DE = (
  <>
    <rect width="24" height="5.34" fill="#1A1A1A" />
    <rect y="5.33" width="24" height="5.34" fill="#CE1126" />
    <rect y="10.66" width="24" height="5.34" fill="#FFCE00" />
  </>
);

const SE = (
  <>
    <rect width="24" height="16" fill="#005293" />
    <rect x="7" width="3.4" height="16" fill="#FECB00" />
    <rect y="6.3" width="24" height="3.4" fill="#FECB00" />
  </>
);

const FI = (
  <>
    <rect width="24" height="16" fill="#FFFFFF" />
    <rect x="7" width="3.4" height="16" fill="#002F6C" />
    <rect y="6.3" width="24" height="3.4" fill="#002F6C" />
  </>
);

const TR = (
  <>
    <rect width="24" height="16" fill="#E30A17" />
    <path d={CRESCENT_PATH} fill="#FFFFFF" />
    <polygon points={CRESCENT_STAR_POINTS} fill="#FFFFFF" />
  </>
);

const PT = (
  <>
    <rect width="24" height="16" fill="#DA291C" />
    <rect width="9.6" height="16" fill="#046A38" />
    <circle cx="9.6" cy="8" r="2.4" fill="#FFE900" />
    <circle cx="9.6" cy="8" r="1.4" fill="#DA291C" />
  </>
);

const HU = (
  <>
    <rect width="24" height="5.34" fill="#CE2939" />
    <rect y="5.33" width="24" height="5.34" fill="#FFFFFF" />
    <rect y="10.66" width="24" height="5.34" fill="#477050" />
  </>
);

const BE = (
  <>
    <rect width="8" height="16" fill="#1A1A1A" />
    <rect x="8" width="8" height="16" fill="#FECB00" />
    <rect x="16" width="8" height="16" fill="#ED2939" />
  </>
);

const NL = (
  <>
    <rect width="24" height="5.34" fill="#AE1C28" />
    <rect y="5.33" width="24" height="5.34" fill="#FFFFFF" />
    <rect y="10.66" width="24" height="5.34" fill="#21468B" />
  </>
);

const LT = (
  <>
    <rect width="24" height="5.34" fill="#FDB913" />
    <rect y="5.33" width="24" height="5.34" fill="#006A44" />
    <rect y="10.66" width="24" height="5.34" fill="#C1272D" />
  </>
);

const CY = (
  <>
    <rect width="24" height="16" fill="#FFFFFF" />
    <rect y="1.6" width="24" height="1.6" fill="#E30A17" />
    <rect y="12.8" width="24" height="1.6" fill="#E30A17" />
    <path d={CRESCENT_PATH} fill="#E30A17" />
    <polygon points={CRESCENT_STAR_POINTS} fill="#E30A17" />
  </>
);

const MT = (
  <>
    <rect width="12" height="16" fill="#FFFFFF" />
    <rect x="12" width="12" height="16" fill="#CF142B" />
    <rect x="11.4" y="4.6" width="1.2" height="6.8" fill="#9AA3AD" />
    <rect x="9" y="7" width="6" height="1.2" fill="#9AA3AD" />
  </>
);

const JP = (
  <>
    <rect width="24" height="16" fill="#FFFFFF" />
    <circle cx="12" cy="8" r="4.4" fill="#BC002D" />
  </>
);

const CN = (
  <>
    <rect width="24" height="16" fill="#DE2910" />
    <polygon points={star(4.4, 4.2, 2.6)} fill="#FFDE00" />
    <polygon points={star(10.2, 1.9, 1)} fill="#FFDE00" />
    <polygon points={star(11.4, 5.1, 1)} fill="#FFDE00" />
    <polygon points={star(9.4, 8.4, 1)} fill="#FFDE00" />
    <polygon points={star(5.9, 9.4, 1)} fill="#FFDE00" />
  </>
);

const FLAGS: Record<string, React.ReactNode> = {
  IT,
  DE,
  SE,
  FI,
  TR,
  PT,
  HU,
  BE,
  NL,
  LT,
  CY,
  MT,
  JP,
  CN,
};

export function CountryFlag({ iso, className = "" }: { iso: string; className?: string }) {
  const art = FLAGS[iso];
  if (!art) return null;

  return (
    <svg
      viewBox="0 0 24 16"
      className={`shrink-0 overflow-hidden rounded-[3px] shadow-[0_0_0_1px_rgb(255_255_255/0.22)] ${className}`}
      style={{ width: "1.65em", height: "1.1em" }}
      role="img"
      aria-label={`Flag of ${iso}`}
    >
      <g stroke={BORDERS} strokeWidth="0.35">
        {art}
      </g>
    </svg>
  );
}
