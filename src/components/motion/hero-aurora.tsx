"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { GlobeMotif } from "@/components/countries/globe-motif";

gsap.registerPlugin(useGSAP);

export function HeroAurora() {
  const rootRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);
  const coolRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const tweensRef = useRef<gsap.core.Animation[]>([]);

  useGSAP(
    () => {
      const far = farRef.current;
      const near = nearRef.current;
      const cool = coolRef.current;
      const globe = globeRef.current;
      const sweep = sweepRef.current;
      if (!far || !near || !cool || !globe || !sweep) return;

      const mm = gsap.matchMedia();

      mm.add({ motion: "(prefers-reduced-motion: no-preference)" }, () => {
        const loops = [
          gsap.to(far, { x: 110, y: -70, scale: 1.14, duration: 23, ease: "sine.inOut", repeat: -1, yoyo: true }),
          gsap.to(near, { x: -80, y: 60, scale: 1.2, duration: 19, ease: "sine.inOut", repeat: -1, yoyo: true }),
          gsap.to(cool, { x: 70, y: 80, scale: 1.12, duration: 29, ease: "sine.inOut", repeat: -1, yoyo: true }),
          gsap.to(globe, { x: -56, y: -24, duration: 37, ease: "sine.inOut", repeat: -1, yoyo: true }),
          gsap.fromTo(
            sweep,
            { xPercent: -160, autoAlpha: 0 },
            {
              xPercent: 160,
              duration: 26,
              ease: "power1.inOut",
              keyframes: { autoAlpha: [0, 0.8, 0.8, 0] },
              repeat: -1,
            }
          ),
        ];
        tweensRef.current = loops;
        return () => {
          for (const tween of loops) tween.kill();
          tweensRef.current = [];
        };
      });

      mm.add({ reduce: "(prefers-reduced-motion: reduce)" }, () => {
        gsap.set([far, near, cool, globe], { clearProps: "all" });
        gsap.set(sweep, { autoAlpha: 0 });
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef }
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const onScreen = entries.some((entry) => entry.isIntersecting);
        for (const tween of tweensRef.current) {
          if (onScreen) tween.play();
          else tween.pause();
        }
      },
      { threshold: 0 }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-hope-midnight"
    >
      <div
        ref={farRef}
        className="absolute -top-48 -left-40 size-[42rem] rounded-full bg-[radial-gradient(circle,rgb(var(--hope-ember-rgb)/0.22),rgb(var(--hope-ember-rgb)/0.13)_38%,rgb(var(--hope-ember-rgb)/0.05)_62%,transparent_78%)]"
      />
      <div
        ref={nearRef}
        className="absolute -bottom-40 -left-24 size-[28rem] rounded-full bg-[radial-gradient(circle,rgb(var(--hope-ember-rgb)/0.3),rgb(var(--hope-ember-rgb)/0.18)_34%,rgb(var(--hope-ember-rgb)/0.06)_58%,transparent_74%)]"
      />
      <div
        ref={coolRef}
        className="absolute -top-32 -right-36 size-[36rem] rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.08),rgb(255_255_255/0.05)_40%,rgb(255_255_255/0.02)_65%,transparent_80%)]"
      />
      <div ref={globeRef} className="absolute inset-0">
        <div className="flex size-full items-center justify-center">
          <GlobeMotif className="size-[40rem] text-white/[0.06] sm:size-[52rem]" />
        </div>
      </div>
      <div
        ref={sweepRef}
        className="absolute -top-1/4 -left-1/3 h-[150%] w-[38%] rotate-12 bg-[radial-gradient(ellipse_at_center,rgb(255_255_255/0.07),rgb(var(--hope-ember-rgb)/0.06)_45%,transparent_70%)]"
      />
    </div>
  );
}
