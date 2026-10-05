import Image from "next/image";
import { cn } from "cn";

const LOGO_SOURCES = {
  "lockup-dark": { src: "/brand/logo-lockup-white.png", width: 1573, height: 772 },
  "lockup-light": { src: "/brand/logo-lockup.png", width: 1573, height: 772 },
} as const;

export type LogoProps = {
  variant?: keyof typeof LOGO_SOURCES;
  priority?: boolean;
  className?: string;
};

export function Logo({ variant = "lockup-dark", priority = false, className }: LogoProps) {
  const source = LOGO_SOURCES[variant];

  return (
    <Image
      src={source.src}
      alt="Hope Consultants"
      width={source.width}
      height={source.height}
      priority={priority}
      sizes="(min-width: 1024px) 124px, 105px"
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}
