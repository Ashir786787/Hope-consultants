"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "cn";

import { DURATIONS, EASE_OUT } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type FlightPathProps = {
  d: string;
  viewBox?: string;
  className?: string;
  scrub?: boolean;
  strokeWidth?: number;
};

export function FlightPath({
  d,
  viewBox = "0 0 1200 400",
  className,
  scrub = true,
  strokeWidth = 2,
}: FlightPathProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const path = pathRef.current;
      const plane = planeRef.current;
      if (!path || !plane) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const total = path.getTotalLength();
      gsap.set(path, { strokeDasharray: total, strokeDashoffset: total });
      gsap.set(plane, { opacity: 0 });

      const positionPlane = (progress: number) => {
        const clamped = Math.min(1, Math.max(0, progress));
        const len = total * clamped;
        const point = path.getPointAtLength(len);
        const ahead = path.getPointAtLength(Math.min(total, len + 2));
        const angle = (Math.atan2(ahead.y - point.y, ahead.x - point.x) * 180) / Math.PI;
        gsap.set(plane, { x: point.x, y: point.y, rotation: angle, opacity: 1 });
      };

      if (!scrub) {
        const tl = gsap.timeline({
          defaults: { ease: EASE_OUT },
          delay: 0.4,
        });
        const state = { progress: 0 };
        tl.to(path, {
          strokeDashoffset: 0,
          duration: DURATIONS.hero,
          ease: "power2.inOut",
        });
        tl.to(
          state,
          {
            progress: 1,
            duration: DURATIONS.hero,
            ease: "power2.inOut",
            onUpdate: () => positionPlane(state.progress),
          },
          "-=0.9"
        );
        return () => {
          tl.kill();
        };
      }

      const state = { progress: 0 };
      const tween = gsap.to(state, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 85%",
          end: "top 10%",
          scrub: 0.6,
        },
        onUpdate: () => {
          gsap.set(path, { strokeDashoffset: total * (1 - state.progress) });
          positionPlane(state.progress);
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: svgRef }
  );

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={cn("pointer-events-none block", className)}
    >
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="rgb(var(--hope-ember-rgb))"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g
        ref={planeRef}
        fill="rgb(var(--hope-ember-rgb))"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <path d="M2.5 3.2 21.5 12 2.5 20.8l2.9-8.8z" stroke="none" />
      </g>
    </svg>
  );
}