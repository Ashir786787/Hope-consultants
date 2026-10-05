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
  suffix?: string;
  className?: string;
};

const formatNumber = (value: number, suffix: string) =>
  `${value.toLocaleString("en-US")}${suffix}`;

export function CountUp({
  to,
  from = 0,
  duration = DURATIONS.base + 1,
  suffix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [fallback] = useState(() => formatNumber(from, suffix));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const state = { value: from };
    const vars: gsap.TweenVars = {
      value: to,
      duration,
      ease: EASE_OUT,
      onUpdate: () => {
        el.textContent = formatNumber(Math.round(state.value), suffix);
      },
    };

    if (el.getBoundingClientRect().top < window.innerHeight) {
      const tween = gsap.to(state, vars);
      return () => {
        tween.kill();
      };
    }

    const tween = gsap.to(state, {
      ...vars,
      scrollTrigger: {
        trigger: el,
        start: VIEWPORT.trigger,
        once: true,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [from, to, duration, suffix]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {fallback}
    </span>
  );
}