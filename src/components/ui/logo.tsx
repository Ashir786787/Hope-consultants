export type LogoProps = {
  tone?: "light" | "dark";
  variant?: "full" | "mark";
  className?: string;
};

export function Logo({ tone = "light", variant = "full", className }: LogoProps) {
  void tone;
  void variant;
  void className;
  return null;
}