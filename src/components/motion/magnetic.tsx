"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "cn";
import { DURATIONS, EASE_OUT } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

export type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
  range?: number;
};

export function Magnetic({ children, className, strength = 12, range = 80 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!window.matchMedia("(hover: hover)").matches) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const xTo = gsap.quickTo(el, "x", { duration: DURATIONS.base, ease: EASE_OUT });
      const yTo = gsap.quickTo(el, "y", { duration: DURATIONS.base, ease: EASE_OUT });
      const onPointerMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);
        if (distance > range) {
          xTo(0);
          yTo(0);
          return;
        }
        const scale = 1 - distance / range;
        xTo(dx * scale * (strength / 40));
        yTo(dy * scale * (strength / 40));
      };
      const onPointerLeave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener("pointermove", onPointerMove);
      el.addEventListener("pointerleave", onPointerLeave);
      return () => {
        el.removeEventListener("pointermove", onPointerMove);
        el.removeEventListener("pointerleave", onPointerLeave);
      };
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={cn("inline-block will-change-transform", className)}>
      {children}
    </div>
  );
}