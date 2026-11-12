"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import { DURATIONS } from "@/lib/motion";

export type EvaluatorScoreGaugeProps = {
  score: number;
  tag: string;
};

const SIZE = 220;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function EvaluatorScoreGauge({ score, tag }: EvaluatorScoreGaugeProps) {
  const ringRef = useRef<SVGCircleElement>(null);
  const target = Math.min(Math.max(score, 0), 10) / 10;
  const offset = CIRCUMFERENCE * (1 - target);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(ring, { attr: { "stroke-dashoffset": offset } });
      return;
    }

    const tween = gsap.fromTo(
      ring,
      { attr: { "stroke-dashoffset": CIRCUMFERENCE } },
      { attr: { "stroke-dashoffset": offset }, duration: DURATIONS.hero, ease: "expo.out" }
    );

    return () => {
      tween.kill();
    };
  }, [offset]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative grid place-items-center" style={{ width: SIZE, height: SIZE }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="size-full -rotate-90" aria-hidden="true">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgb(var(--hope-midnight-rgb) / 0.1)"
            strokeWidth={STROKE}
          />
          <circle
            ref={ringRef}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--hope-ember)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
          />
        </svg>
        <div className="absolute flex flex-col items-center gap-1">
          <span className="font-display text-5xl font-bold tracking-tight text-hope-midnight">
            {score.toFixed(2)}
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-hope-fog">
            out of 10
          </span>
        </div>
      </div>
      <p className="rounded-full bg-hope-ember px-5 py-2 text-center text-sm font-bold uppercase tracking-[0.14em] text-hope-midnight">
        {tag}
      </p>
    </div>
  );
}
