import type { ReactNode } from "react";
import { cn } from "cn";

export type SectionProps = {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
};

const TONE_CLASSES = {
  light: "bg-hope-white text-hope-midnight",
  dark: "bg-hope-midnight text-hope-white",
} as const;

export function Section({ children, tone = "light", className }: SectionProps) {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 md:py-20 lg:py-24",
        TONE_CLASSES[tone],
        className
      )}
    >
      {children}
    </section>
  );
}