import Image from "next/image";
import { cn } from "cn";

const LOGO_SOURCES = {
  lockup: { src: "/brand/logo-full-color.jpg", width: 258, height: 317 },
  mark: { src: "/brand/logo-full-color.jpg", width: 258, height: 317 },
} as const;

export type LogoProps = {
  variant?: "lockup" | "mark";
  priority?: boolean;
  className?: string;
};

export function Logo({ variant = "lockup", priority = false, className }: LogoProps) {
  const source = LOGO_SOURCES[variant];
  const sizes = variant === "lockup" ? "(min-width: 1024px) 124px, 105px" : "44px";

  return (
    <Image
      src={source.src}
      alt="Hope Consultants"
      width={source.width}
      height={source.height}
      priority={priority}
      sizes={sizes}
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}