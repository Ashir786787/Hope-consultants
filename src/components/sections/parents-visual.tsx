import Image from "next/image";

export function ParentsVisual({ image }: { image: string | null }) {
  return (
    <div className="relative aspect-16/9 w-full overflow-hidden rounded-3xl border border-hope-white/10 bg-hope-midnight shadow-[var(--shadow-card)]">
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          priority={false}
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
        />
      ) : (
        <ParentsArtwork />
      )}
    </div>
  );
}

function ParentsArtwork() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_78%_28%,rgb(var(--hope-ember-rgb)/0.15),transparent_58%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_12%_92%,rgb(255_255_255/0.06),transparent_62%)]" />

      <svg
        viewBox="0 0 400 300"
        fill="none"
        className="pointer-events-none absolute inset-0 size-full"
      >
        <defs>
          <pattern id="parents-dots" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgb(255 255 255 / 0.06)" />
          </pattern>
          <linearGradient id="parents-arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgb(var(--hope-ember-rgb))" stopOpacity="0.05" />
            <stop offset="0.55" stopColor="rgb(var(--hope-ember-rgb))" stopOpacity="0.55" />
            <stop offset="1" stopColor="rgb(var(--hope-ember-rgb))" stopOpacity="0.12" />
          </linearGradient>
          <clipPath id="parents-disc-clip">
            <circle cx="292" cy="132" r="66" />
          </clipPath>
        </defs>

        <rect width="400" height="300" fill="url(#parents-dots)" />

        <g stroke="rgb(var(--hope-ember-rgb))" opacity="0.16" fill="none">
          <ellipse cx="292" cy="132" rx="94" ry="30" />
          <ellipse cx="292" cy="132" rx="94" ry="62" />
        </g>

        <circle cx="292" cy="132" r="66" stroke="url(#parents-arc)" strokeWidth="1.75" fill="none" />

        <g clipPath="url(#parents-disc-clip)" stroke="rgb(var(--hope-ember-rgb))" opacity="0.4" fill="none">
          <ellipse cx="292" cy="132" rx="66" ry="24" strokeWidth="1.1" />
          <ellipse cx="292" cy="132" rx="66" ry="47" strokeWidth="1.1" />
          <ellipse cx="292" cy="132" rx="23" ry="66" strokeWidth="1.1" />
          <ellipse cx="292" cy="132" rx="47" ry="66" strokeWidth="1.1" />
          <path d="M226 132h132" strokeWidth="1.1" />
        </g>

        <circle cx="292" cy="132" r="4.5" fill="rgb(var(--hope-ember-rgb))" />
        <circle cx="292" cy="132" r="9" stroke="rgb(var(--hope-ember-rgb))" strokeOpacity="0.4" fill="none" />

        <path
          d="M212 254C244 236 268 200 280 168"
          stroke="rgb(var(--hope-ember-rgb))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 11"
          opacity="0.5"
        />
        <g transform="translate(278 158) rotate(-58) scale(2.5)" fill="rgb(var(--hope-ember-rgb))">
          <path d="M2.5 3.2 21.5 12 2.5 20.8l2.9-8.8z" />
        </g>

        <g opacity="0.95">
          <rect x="36" y="88" width="116" height="16" rx="8" fill="rgb(255 255 255 / 0.14)" />
          <rect x="36" y="118" width="148" height="16" rx="8" fill="rgb(255 255 255 / 0.1)" />
          <rect x="36" y="148" width="92" height="16" rx="8" fill="rgb(255 255 255 / 0.07)" />
        </g>

        <g>
          <path d="M44 200h96" stroke="rgb(var(--hope-ember-rgb))" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
          <path d="M140 200l14 14 26-30" stroke="rgb(var(--hope-ember-rgb))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>

        <path
          d="M36 262C104 240 168 282 236 258"
          stroke="rgb(var(--hope-ember-rgb))"
          strokeWidth="1.75"
          strokeLinecap="round"
          opacity="0.22"
        />
        <path
          d="M36 282C110 262 178 300 250 278"
          stroke="rgb(255 183 3)"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.12"
        />
      </svg>
    </div>
  );
}
