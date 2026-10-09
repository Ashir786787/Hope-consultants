"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DURATIONS, VIEWPORT } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function TeamPhoto({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const image = el.querySelector("img");
      gsap.fromTo(
        image ?? el,
        { scale: 1.15, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: DURATIONS.reveal,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: el,
            start: VIEWPORT.trigger,
            once: true,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="team-photo relative aspect-square w-full overflow-hidden">
      {src.startsWith("data:") ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-top"
          style={{ backgroundImage: `url(${src})` }}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width:1024px) 33vw, 100vw"
          className="object-cover object-top"
        />
      )}
    </div>
  );
}