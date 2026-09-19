import Image from "next/image";
import { cn } from "cn";

export type LogoProps = {
  tone?: "light" | "dark";
  variant?: "full" | "mark";
  className?: string;
};

const LOGO_SRC = {
  "full-light": "/brand/logo-full-color.svg",
  "full-dark": "/brand/logo-white.svg",
  "mark-light": "/brand/logo-mark.svg",
  "mark-dark": "/brand/logo-mark-white.svg",
} as const;

export function Logo({ tone = "light", variant = "full", className }: LogoProps) {
  const dimensions =
    variant === "full" ? { width: 200, height: 52 } : { width: 40, height: 40 };
  return (
    <Image
      src={LOGO_SRC[`${variant}-${tone}`]}
      alt="Hope Consultants"
      width={dimensions.width}
      height={dimensions.height}
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}

type WordmarkProps = {
  tone?: "light" | "dark";
  className?: string;
};

export function Wordmark({ tone = "light", className }: WordmarkProps) {
  return (
    <span
      className={cn(
        "font-display text-xl font-bold tracking-tight",
        tone === "dark" ? "text-hope-white" : "text-hope-midnight",
        className
      )}
    >
      Hope<span className="text-hope-ember"> Consultants</span>
    </span>
  );
}