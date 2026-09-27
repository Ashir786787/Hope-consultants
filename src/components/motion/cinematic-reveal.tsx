"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "cn";
import { DURATIONS } from "@/lib/motion";
import type { HeroMedia } from "@/lib/hero-media";

gsap.registerPlugin(useGSAP);

const INTRO_EVENT = "hope:intro-complete";
const INTRO_FALLBACK_MS = 200;

type NetworkInformation = { saveData?: boolean };

type CinematicRevealProps = {
  media: HeroMedia;
  className?: string;
};

export function CinematicReveal({ media, className }: CinematicRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [staticOnly, setStaticOnly] = useState(false);

  const hasVideo = Boolean(media.mp4 || media.webm);
  const stillSrc = media.poster ?? media.still;
  const hasAnything = hasVideo || Boolean(stillSrc);

  useGSAP(
    () => {
      const layer = layerRef.current;
      if (!layer) return;

      const mm = gsap.matchMedia();

      mm.add({ motion: "(prefers-reduced-motion: no-preference)" }, () => {
        gsap.set(layer, { scale: 1.1, filter: "blur(30px)", autoAlpha: 0 });

        let revealed = false;
        const reveal = () => {
          if (revealed) return;
          revealed = true;
          window.removeEventListener(INTRO_EVENT, reveal);
          gsap.to(layer, {
            scale: 1,
            filter: "blur(0px)",
            autoAlpha: 1,
            duration: DURATIONS.hero,
            ease: "expo.out",
          });
        };

        window.addEventListener(INTRO_EVENT, reveal);
        const fallback = window.setTimeout(reveal, INTRO_FALLBACK_MS);

        return () => {
          window.clearTimeout(fallback);
          window.removeEventListener(INTRO_EVENT, reveal);
        };
      });

      mm.add({ reduce: "(prefers-reduced-motion: reduce)" }, () => {
        gsap.set(layer, { clearProps: "all" });
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef }
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;

    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const stillPreferred =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      Boolean(connection?.saveData);

    setStaticOnly(stillPreferred);
    if (stillPreferred) return;

    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(root);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [hasVideo]);

  if (!hasAnything) return null;

  const showVideo = hasVideo && !staticOnly;
  const showStill = !showVideo && Boolean(stillSrc);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div ref={layerRef} className="absolute inset-0">
        {showVideo ? (
          <video
            ref={videoRef}
            className="absolute inset-0 size-full object-cover"
            loop
            muted
            playsInline
            preload="metadata"
            poster={media.poster}
          >
            {media.webm ? <source src={media.webm} type="video/webm" /> : null}
            {media.mp4 ? <source src={media.mp4} type="video/mp4" /> : null}
          </video>
        ) : null}

        {showStill && stillSrc ? (
          <Image
            src={stillSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="absolute inset-0 bg-hope-midnight/50" />
    </div>
  );
}
