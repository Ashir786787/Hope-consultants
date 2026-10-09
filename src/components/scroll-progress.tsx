"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import { Z } from "@/lib/motion";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const setProgress = gsap.quickTo(el, "scaleX", {
      duration: 0.3,
      ease: "none",
      overwrite: "auto",
    });

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      setProgress(Math.min(Math.max(progress, 0), 1));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      gsap.killTweensOf(el);
    };
  }, []);

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
