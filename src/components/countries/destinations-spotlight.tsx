"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

import { CountryFlag } from "@/components/countries/country-flag";
import { GlobeMotif } from "@/components/countries/globe-motif";
import { SpotlightRow } from "@/components/countries/spotlight-row";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { isoFor } from "@/lib/data/country-flags";
import type { CountryDestination } from "@/lib/data/types";

type Zone = "left" | "middle" | "right" | null;

const REST: Record<Exclude<Zone, null>, number> = { left: 35, middle: 30, right: 35 };
const HOVERED = 46;
const SHRUNK = 27;

const IDLE_PROMPT = "Pick a country to see what studying there really involves.";

function byPosition(a: CountryDestination, b: CountryDestination): number {
  return a.position - b.position;
}

function growFor(zone: Exclude<Zone, null>, active: Zone): number {
  if (active === null) return REST[zone];
  return active === zone ? HOVERED : SHRUNK;
}

export function DestinationsSpotlight({ countries }: { countries: CountryDestination[] }) {
  const ordered = [...countries].sort(byPosition);
  const left = ordered.slice(0, 7);
  const right = ordered.slice(7, 14);
  const [selected, setSelected] = useState<CountryDestination | null>(null);
  const [zone, setZone] = useState<Zone>(null);
  const [zoneMotionSafe, setZoneMotionSafe] = useState(false);
  const [resizing, setResizing] = useState(false);
  const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setZoneMotionSafe(!motion.matches && desktop.matches && fine.matches);
    sync();
    motion.addEventListener("change", sync);
    desktop.addEventListener("change", sync);
    fine.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      desktop.removeEventListener("change", sync);
      fine.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
    };
  }, []);

  const markResizing = useCallback(() => {
    setResizing(true);
    if (resizeTimer.current) clearTimeout(resizeTimer.current);
    resizeTimer.current = setTimeout(() => setResizing(false), 560);
  }, []);

  const enterZone = useCallback(
    (next: Exclude<Zone, null>) => {
      if (!zoneMotionSafe) return;
      setZone(next);
      markResizing();
    },
    [markResizing, zoneMotionSafe],
  );

  const leaveZone = useCallback(() => {
    if (!zoneMotionSafe) return;
    setZone(null);
    markResizing();
  }, [markResizing, zoneMotionSafe]);

  const activeZone = zoneMotionSafe ? zone : null;

  const zoneProps = (key: Exclude<Zone, null>, extra = "") => ({
    className: `spotlight-zone ${extra}`.trim(),
    style: { "--zone-grow": String(growFor(key, activeZone)) } as CSSProperties,
    "data-resizing": resizing ? "true" : undefined,
    onPointerEnter: () => enterZone(key),
    onPointerLeave: leaveZone,
  });

  const list = (entries: CountryDestination[], mirrored: boolean) => (
    <ul className="flex flex-col gap-1.5">
      {entries.map((country) => (
        <li key={country.slug}>
          <SpotlightRow
            country={country}
            mirrored={mirrored}
            selected={selected?.slug === country.slug}
            onSelect={setSelected}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <section id="destinations" aria-labelledby="destinations-spotlight-title">
      <Reveal
        className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6"
        stagger={0.12}
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <p className="text-sm font-bold tracking-[0.18em] text-hope-midnight uppercase">
            Destinations
          </p>
          <h2
            id="destinations-spotlight-title"
            className="font-display text-3xl font-semibold tracking-tight text-hope-midnight sm:text-4xl"
          >
            Fourteen countries, one honest picture.
          </h2>
          <p className="text-base leading-7 text-hope-midnight/70">
            Each profile gives you real figures for tuition, living costs and visa reality - no
            hidden fees, no invented scholarships.
          </p>
        </div>

        <div className="flex flex-col overflow-hidden rounded-[1.5rem] border border-hope-white/10 bg-hope-midnight lg:flex-row">
          <div {...zoneProps("left", "py-2")}>{list(left, false)}</div>

          <div
            {...zoneProps("middle", "relative min-h-60 border-hope-white/10 p-5 sm:min-h-64 sm:p-6 lg:border-x")}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-14 -right-12 size-48 rounded-full bg-hope-ember/10 blur-3xl"
            />
            <div aria-live="polite" className="relative flex h-full flex-col gap-3">
              {selected === null ? (
                <div className="flex flex-1 flex-col items-start justify-center gap-4">
                  <GlobeMotif className="size-20 text-hope-ember/70" />
                  <p className="text-base leading-7 text-hope-white/85">{IDLE_PROMPT}</p>
                </div>
              ) : (
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <CountryFlag iso={isoFor(selected.slug)} className="text-xl" />
                    <h3 className="font-display text-xl font-semibold tracking-tight text-hope-white">
                      {selected.name}
                    </h3>
                  </div>
                  {selected.images[0] ? (
                    <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl border border-hope-white/10 bg-hope-white/5 sm:h-60">
                      <Image
                        src={selected.images[0]}
                        alt={`${selected.name} - study destination`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 32vw"
                        className="object-cover"
                      />
                      <Button
                        href={`/countries/${selected.slug}`}
                        size="sm"
                        className="absolute right-3 bottom-3 h-9 overflow-visible gap-1.5 px-3.5 text-sm after:absolute after:-inset-1 after:content-['']"
                      >
                        View full page
                        <span aria-hidden="true">→</span>
                      </Button>
                    </div>
                  ) : null}
                  <p className="text-base leading-7 text-hope-white/80">
                    {selected.financialInsight}
                  </p>
                  {selected.images[0] ? null : (
                    <Button href={`/countries/${selected.slug}`} size="sm" className="w-fit gap-1.5 px-4 text-sm">
                      View full page
                      <span aria-hidden="true">→</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div {...zoneProps("right", "py-2")}>{list(right, true)}</div>
        </div>
      </Reveal>
    </section>
  );
}
