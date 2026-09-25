"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ProcessSequence({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLOListElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
        if (!line.current || !scope.current) return;
        gsap.fromTo(
          line.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: scope.current,
              start: "top 70%",
              end: "bottom 70%",
              scrub: 0.4,
            },
          }
        );
      });

      return () => media.revert();
    },
    { scope, revertOnUpdate: true }
  );

  return (
    <ol ref={scope} className="relative flex flex-col gap-0 pl-0">
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[1.1875rem] hidden w-px bg-border lg:block"
      />
      <span
        ref={line}
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[1.1875rem] hidden w-px origin-top bg-hope-ember lg:block"
      />
      {children}
    </ol>
  );
}
