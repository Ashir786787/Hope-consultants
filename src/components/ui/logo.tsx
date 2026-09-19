import Image from "next/image";
import { cn } from "cn";

export type LogoProps = {
  tone?: "light" | "dark";
  variant?: "full" | "mark";
  className?: string;
};

export function Logo({ tone = "light", variant = "full", className }: LogoProps) {
  void tone;
  void variant;
  return (
    <Image
      src="/brand/logo-full-color.jpg"
      alt="Hope Consultants"
      width={258}
      height={317}
      className={cn("p-1.5 object-contain", className)}
    />
  );
}