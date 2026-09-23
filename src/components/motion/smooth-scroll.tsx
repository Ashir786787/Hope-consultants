"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type LenisControls = {
  isStopped: boolean;
  stop: () => void;
  start: () => void;
};

const LenisContext = createContext<LenisControls | null>(null);

export function useLenis() {
  const value = useContext(LenisContext);
  if (!value) throw new Error("useLenis must be used within SmoothScroll");
  return value;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [isStopped, setIsStopped] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true });
    lenisRef.current = lenis;
    lenis.on("scroll", () => ScrollTrigger.update());
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const value = useMemo<LenisControls>(
    () => ({
      isStopped,
      stop: () => {
        lenisRef.current?.stop();
        setIsStopped(true);
      },
      start: () => {
        lenisRef.current?.start();
        setIsStopped(false);
      },
    }),
    [isStopped]
  );

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>;
}