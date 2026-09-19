import type { CSSProperties, ReactNode } from "react";
import { cn } from "cn";

export type MarqueeProps = {
  children: ReactNode;
  direction?: "left" | "right";
  duration?: number;
  className?: string;
};

export function Marquee({ children, direction = "left", duration = 24, className }: MarqueeProps) {
  const style = {
    "--marquee-duration": `${duration}s`,
  } as CSSProperties;

  return (
    <div className={cn("hope-marquee", className)} data-direction={direction} style={style}>
      <div className="hope-marquee__track">
        <div className="hope-marquee__group">{children}</div>
        <div className="hope-marquee__group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}