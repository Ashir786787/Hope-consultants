"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Z } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

const OVERRIDE_SCALE = 64 / 36;

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set([dot, ring, label], { opacity: 0 });
    gsap.set([dot, ring], { x: -100, y: -100 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3.out" });
    const setScale = (target: number) => {
      gsap.to(ring, { scale: target, duration: 0.3, ease: "power3.out" });
    };

    const move = (event: MouseEvent) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
      const target = event.target as Element | null;
      const interactive = target?.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor]"
      );
      const isField = Boolean(
        target?.closest("input, textarea, select")
      );
      if (isField) {
        gsap.to([dot, ring, label], { opacity: 0, duration: 0.2 });
        return;
      }
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
      const isView = Boolean(target?.closest('[data-cursor="view"]'));
      if (isView) {
        gsap.to(label, { opacity: 1 });
        setScale(OVERRIDE_SCALE);
      } else if (interactive) {
        gsap.to(label, { opacity: 0 });
        setScale(OVERRIDE_SCALE);
      } else {
        gsap.to(label, { opacity: 0 });
        setScale(1);
      }
    };

    const press = () => {
      gsap.to(ring, { scale: 0.85, duration: 0.2, ease: "power3.out" });
    };
    const release = () => {
      gsap.to(ring, { scale: 1, duration: 0.3, ease: "power3.out" });
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", press);
    window.addEventListener("mouseup", release);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", press);
      window.removeEventListener("mouseup", release);
    };
  });

  return (
    <div
      aria-hidden="true"
      style={{ zIndex: Z.cursor }}
      className="pointer-events-none fixed inset-0 hidden lg:block"
    >
      <div
        ref={ringRef}
        className="absolute top-0 left-0 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-hope-ember"
      >
        <span
          ref={labelRef}
          className="text-[0.6rem] font-bold tracking-[0.18em] text-hope-ember uppercase"
        >
          View
        </span>
      </div>
      <div
        ref={dotRef}
        className="absolute top-0 left-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-hope-ember"
      />
    </div>
  );
}