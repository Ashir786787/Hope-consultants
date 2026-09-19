"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Z } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = barRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: 0.3,
        },
      }
    );
  });

  return (
    <div
      aria-hidden="true"
      style={{ zIndex: Z.progress }}
      className="pointer-events-none fixed inset-x-0 top-0 h-0.5"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-hope-ember shadow-[0_0_8px_rgb(var(--hope-ember-rgb)/0.9)]"
      />
    </div>
  );
}