"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";

/**
 * Global Lenis (smooth scroll) provider. Root mode so the whole viewport
 * scrolls smoothly; reduced-motion + anchor support included.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        anchors: true,
        smoothWheel: true,
        lerp: 0.1,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      }}
    >
      {children}
    </ReactLenis>
  );
}