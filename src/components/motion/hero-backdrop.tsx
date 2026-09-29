"use client";

import { useSyncExternalStore } from "react";
import { CinematicReveal } from "@/components/motion/cinematic-reveal";
import { HeroAurora } from "@/components/motion/hero-aurora";
import type { HeroMedia } from "@/lib/hero-media";

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

type NetworkInformation = { saveData?: boolean };

function subscribe(onChange: () => void) {
  const media = window.matchMedia(REDUCE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return window.matchMedia(REDUCE_QUERY).matches || Boolean(connection?.saveData);
}

function getServerSnapshot(): boolean {
  return false;
}

type HeroBackdropProps = {
  media: HeroMedia;
};

export function HeroBackdrop({ media }: HeroBackdropProps) {
  const stillPreferred = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (media.clips.length === 0 || stillPreferred) return <HeroAurora />;

  return <CinematicReveal media={media} />;
}
