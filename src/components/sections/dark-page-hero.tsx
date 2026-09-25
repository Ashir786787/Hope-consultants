import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";

export type DarkPageHeroProps = {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: ReactNode;
};

export function DarkPageHero({ eyebrow, title, lede, children }: DarkPageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-[rgb(255_255_255/0.10)] bg-hope-midnight">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 right-[-10%] size-[30rem] rounded-full bg-[radial-gradient(circle,rgb(var(--hope-ember-rgb)/0.14),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="hope-dot-grid pointer-events-none absolute inset-0 opacity-[0.06]"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6 sm:py-24">
        <Reveal>
          <Badge
            variant="outline"
            className="w-fit border-[rgb(255_255_255/0.20)] uppercase tracking-widest text-hope-white"
          >
            {eyebrow}
          </Badge>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-hope-white sm:text-5xl">
            {title}
          </h1>
        </Reveal>
        {lede ? (
          <Reveal delay={0.2}>
            <p className="max-w-2xl text-lg leading-8 text-hope-white/70">{lede}</p>
          </Reveal>
        ) : null}
        {children ? <Reveal delay={0.3}>{children}</Reveal> : null}
      </div>
    </section>
  );
}
