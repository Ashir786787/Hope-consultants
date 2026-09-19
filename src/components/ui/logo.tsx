import Image from "next/image";
import { cn } from "cn";

export type LogoProps = {
  tone?: "light" | "dark";
  variant?: "full" | "mark";
  className?: string;
};

export function Logo({ tone = "light", variant = "full", className }: LogoProps) {
  void tone;
  const dimensions =
    variant === "full" ? { width: 200, height: 52 } : { width: 40, height: 40 };
  return (
    <Image
      src="/brand/logo-full-color.jpg"
      alt="Hope Consultants"
      width={dimensions.width}
      height={dimensions.height}
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}