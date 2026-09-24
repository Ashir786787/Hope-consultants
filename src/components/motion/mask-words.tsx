"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "cn";

import { splitWords, type SplitWord } from "@/lib/split";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type MaskWordsProps = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  stagger?: number;
};

export function MaskWords({ text, className, as: Tag = "span", stagger = 0.06 }: MaskWordsProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = splitWords(text);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const inner = el.querySelectorAll("[data-mask-inner]");
      if (!inner.length) return;

      gsap.set(inner, { yPercent: 110 });
      gsap.to(inner, {
        yPercent: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={cn("inline-block", className)}>
      {words.map((split: SplitWord, index) => (
        <span
          key={`${split.word}-${index}`}
          className="inline-flex overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]"
        >
          <span data-mask-inner className="inline-block will-change-transform">
            {split.word}
            {split.trailingSpace ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}