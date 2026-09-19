"use client";

import type { ReactNode } from "react";
import { cn } from "cn";
import { usePointerSpotlight } from "@/hooks/use-pointer-spotlight";

export type CardProps = {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
};

export function Card({ children, tone = "dark", className }: CardProps) {
  const ref = usePointerSpotlight<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn("hope-card", tone === "light" && "hope-card--light", className)}
    >
      {children}
    </div>
  );
}