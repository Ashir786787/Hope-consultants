"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

import { EASE_OUT, Z } from "@/lib/motion";

const SESSION_KEY = "hope-consultants-preloaded";

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (hidden) return;
    const root = rootRef.current;
    const mark = markRef.current;
    const arc = arcRef.current;
    const plane = planeRef.current;
    if (!root || !mark || !arc || !plane) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.delayedCall(0.001, () => setHidden(true));
      return;
    }
    let repeat = false;
    try {
      repeat = sessionStorage.getItem(SESSION_KEY) !== null;
    } catch {
      repeat = false;
    }
    if (repeat) {
      gsap.delayedCall(0.001, () => setHidden(true));
      return;
    }

    gsap.set(mark, { autoAlpha: 0, scale: 0.92 });
    gsap.set(plane, { autoAlpha: 0 });
    const total = arc.getTotalLength();
    gsap.set(arc, { strokeDasharray: total, strokeDashoffset: total });

    const state = { progress: 0 };
    const positionPlane = () => {
      const len = total * state.progress;
      const point = arc.getPointAtLength(Math.min(total, len));
      const ahead = arc.getPointAtLength(Math.min(total, len + 1));
      const angle = (Math.atan2(ahead.y - point.y, ahead.x - point.x) * 180) / Math.PI;
      gsap.set(plane, {
        x: point.x,
        y: point.y,
        rotation: angle,
        autoAlpha: 1,
      });
    };

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      onComplete: () => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setHidden(true);
      },
    });

    tl.to(mark, { autoAlpha: 1, scale: 1, duration: 0.5 }, 0.1)
      .to(arc, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 0.25)
      .to(
        state,
        {
          progress: 1,
          duration: 1,
          ease: "power2.inOut",
          onUpdate: positionPlane,
        },
        0.3
      )
      .to(root, { autoAlpha: 0, duration: 0.45 }, "+=0.15");

    return () => {
      tl.kill();
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-preloader
      style={{ zIndex: Z.preloader }}
      className="preloader fixed inset-0 flex items-center justify-center bg-hope-midnight"
    >
      <div ref={markRef} className="relative flex size-40 items-center justify-center">
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full"
          fill="none"
        >
          <path
            ref={arcRef}
            d="M 30 120 A 70 70 0 1 1 170 120"
            stroke="rgb(var(--hope-ember-rgb))"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <g
            ref={planeRef}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <path
              d="M2.5 3.2 21.5 12 2.5 20.8l2.9-8.8z"
              fill="rgb(var(--hope-ember-rgb))"
            />
          </g>
        </svg>
        <Image
          src="/brand/logo-mark-white.png"
          alt=""
          width={286}
          height={321}
          className="h-24 w-auto object-contain"
        />
      </div>
    </div>
  );
}