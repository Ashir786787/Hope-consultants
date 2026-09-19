"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "cn";
import { DURATIONS, EASE_OUT, VIEWPORT } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export type CountUpProps = {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
};

const formatNumber = (value: number) => value.toLocaleString("en-US");

export function CountUp({ to, from = 0, duration = DURATIONS.base + 1, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [fallback] = useState(() => formatNumber(from));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const state = { value: from };
    const tween = gsap.to(state, {
      value: to,
      duration,
      ease: EASE_OUT,
      scrollTrigger: {
        trigger: el,
        start: VIEWPORT.trigger,
        once: true,
      },
      onUpdate: () => {
        el.textContent = formatNumber(Math.round(state.value));
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [from, to, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {fallback}
    </span>
  );
}