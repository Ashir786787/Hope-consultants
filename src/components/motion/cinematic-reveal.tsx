"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "cn";
import { DURATIONS } from "@/lib/motion";
import type { HeroMedia } from "@/lib/hero-media";

gsap.registerPlugin(useGSAP);

const INTRO_EVENT = "hope:intro-complete";
const INTRO_FALLBACK_MS = 200;

type IdleWindow = {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

type CinematicRevealProps = {
  media: HeroMedia;
  className?: string;
};

export function CinematicReveal({ media, className }: CinematicRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const clipRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const activeRef = useRef(0);

  const clips = media.clips;

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
    const root = rootRef.current;
    if (clips.length === 0 || !root) return;

    const idle = window as IdleWindow;
    const promoted = new Set<number>();
    const idleHandles: number[] = [];
    let timeline: gsap.core.Timeline | null = null;
    let ladderStarted = false;

    const getClip = (index: number): HTMLVideoElement | null =>
      clipRefs.current[index] ?? null;

    const promote = (index: number) => {
      if (promoted.has(index)) return;
      const clip = getClip(index);
      if (!clip) return;
      promoted.add(index);
      clip.preload = "auto";
      if (clip.paused) clip.load();
    };

    const schedule = (task: () => void) => {
      const handle = idle.requestIdleCallback
        ? idle.requestIdleCallback(task, { timeout: 2000 })
        : window.setTimeout(task, 400);
      idleHandles.push(handle);
    };

    const advance = (fromIndex: number) => {
      if (timeline) return;
      if (clips.length < 2) return;

      const toIndex = (fromIndex + 1) % clips.length;
      const from = getClip(fromIndex);
      const to = getClip(toIndex);
      if (!from || !to) return;

      from.style.willChange = "opacity";
      to.style.willChange = "opacity";
      promote(toIndex);
      to.play().catch(() => undefined);

      const duration = DURATIONS.crossfade;

      timeline = gsap.timeline({
        onComplete: () => {
          from.pause();
          from.currentTime = 0;
          from.style.willChange = "";
          to.style.willChange = "";
          activeRef.current = toIndex;
          timeline = null;
        },
      });

      timeline
        .fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration, ease: "power2.inOut" }, 0)
        .to(from, { autoAlpha: 0, duration, ease: "power2.inOut" }, 0);
    };

    const onEnded = clips.map((_, index) => () => {
      if (index === activeRef.current) advance(index);
    });

    const normalise = () => {
      timeline?.kill();
      timeline = null;

      clips.forEach((_, index) => {
        const clip = getClip(index);
        if (!clip) return;
        clip.pause();
        clip.style.willChange = "";
        const isActive = index === activeRef.current;
        gsap.set(clip, { autoAlpha: isActive ? 1 : 0 });
        if (isActive) clip.currentTime = 0;
      });
    };

    clips.forEach((_, index) => {
      const clip = getClip(index);
      if (!clip) return;
      gsap.set(clip, { autoAlpha: index === activeRef.current ? 1 : 0 });
      clip.addEventListener("ended", onEnded[index]);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            normalise();
            continue;
          }

          const active = getClip(activeRef.current);
          if (active) active.play().catch(() => undefined);

          if (ladderStarted) continue;
          ladderStarted = true;

          for (let index = 1; index < clips.length; index += 1) {
            schedule(() => promote(index));
          }
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(root);

    return () => {
      observer.disconnect();
      timeline?.kill();

      clips.forEach((_, index) => {
        const clip = getClip(index);
        clip?.removeEventListener("ended", onEnded[index]);
        clip?.pause();
      });

      for (const handle of idleHandles) {
        if (idle.cancelIdleCallback) idle.cancelIdleCallback(handle);
        else window.clearTimeout(handle);
      }
    };
  }, [clips]);

  if (clips.length === 0) return null;

  const single = clips.length === 1;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div ref={layerRef} className="absolute inset-0">
        {clips.map((clip, index) => (
          <video
            key={clip.src}
            ref={(element) => {
              clipRefs.current[index] = element;
            }}
            src={clip.src}
            poster={clip.poster}
            muted
            loop={single}
            playsInline
            preload="metadata"
            disablePictureInPicture
            disableRemotePlayback
            className="absolute inset-0 size-full object-cover"
          />
        ))}
      </div>
    </div>
  );
}
