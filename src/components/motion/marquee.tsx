"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { cn } from "cn";

export type MarqueeProps = {
  children: ReactNode;
  direction?: "left" | "right";
  duration?: number;
  className?: string;
};

export function Marquee({ children, direction = "left", duration = 24, className }: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const style = {
    "--marquee-duration": `${duration}s`,
  } as CSSProperties;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const track = root.querySelector<HTMLElement>(".hope-marquee__track");
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          track.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(root);
    track.style.animationPlayState = "running";

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className={cn("hope-marquee", className)} data-direction={direction} style={style}>
      <div className="hope-marquee__track">
        <div className="hope-marquee__group">{children}</div>
        <div className="hope-marquee__group" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}