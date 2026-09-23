import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, Eyebrow } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { Logo } from "@/components/ui/logo";
import { Marquee } from "@/components/motion/marquee";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";

const SWATCHES = [
  { name: "Pure White", hex: "#FFFFFF", className: "bg-hope-white border-border text-hope-midnight" },
  { name: "Fogstone", hex: "#6C757D", className: "bg-hope-fog text-hope-white" },
  { name: "Solar Ember", hex: "#FFB703", className: "bg-hope-ember text-hope-midnight" },
  { name: "Midnight Blue", hex: "#000C38", className: "bg-hope-midnight text-hope-white" },
  { name: "Obsidian Veil", hex: "#090909", className: "bg-hope-obsidian text-hope-white" },
] as const;

const TYPE_SCALE = [
  { label: "Display", className: "text-display font-extrabold tracking-[-0.02em]" },
  { label: "h2", className: "text-h2 font-bold" },
  { label: "h3", className: "text-h3 font-bold" },
  { label: "Body", className: "text-base leading-7" },
  { label: "Small", className: "text-sm leading-6" },
  { label: "Eyebrow", className: "text-xs font-bold uppercase tracking-[0.18em] text-hope-ember" },
] as const;

function DemoLabel({ children }: { children: ReactNode }) {
  return <p className="text-sm font-medium uppercase tracking-[0.18em] text-hope-fog">{children}</p>;
}

function DemoBlock({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}

export const metadata: Metadata = {
  title: "Design System — Hope Consultants",
  description: "Brand tokens, type scale, components and motion primitives.",
  robots: { index: false, follow: false },
};

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="bg-hope-white text-hope-midnight">
      <Section tone="light">
        <div className="flex flex-col gap-2">
          <Eyebrow>Design system</Eyebrow>
          <h1 className="font-display text-h2">Hope Consultants design foundation</h1>
          <p className="max-w-xl text-base leading-7 text-hope-fog">
            Brand tokens, type scale, shared components and motion primitives. This route is
            dev-only and is deleted in the final step.
          </p>
        </div>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-hope-midnight underline-offset-4 hover:underline"
          >
            Back to home <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>

      <Section tone="light" className="border-t border-border">
        <Reveal stagger={0.06}>
          <Eyebrow>Brand colours</Eyebrow>
          <h2 className="mt-2 font-display text-h3">The five tokens</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SWATCHES.map((swatch) => (
              <div
                key={swatch.name}
                className="overflow-hidden rounded-3xl border border-border"
              >
                <div className={`flex h-28 items-end p-4 ${swatch.className}`}>
                  <span className="text-sm font-bold lowercase">{swatch.hex}</span>
                </div>
                <div className="p-4">
                  <p className="font-display text-base font-bold">{swatch.name}</p>
                  <p className="text-sm text-hope-fog">{swatch.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section tone="light" className="border-t border-border">
        <Reveal stagger={0.06}>
          <Eyebrow>Typography</Eyebrow>
          <div className="mt-6 flex flex-col gap-6">
            {TYPE_SCALE.map((item) => (
              <div key={item.label} className="flex flex-col gap-1 border-b border-border pb-4">
                <DemoLabel>{item.label}</DemoLabel>
                <p className={item.className}>Montserrat sample</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section tone="light" className="border-t border-border">
        <Reveal stagger={0.06}>
          <Eyebrow>Buttons</Eyebrow>
          <div className="mt-6 flex flex-col gap-8">
            <DemoBlock>
              <DemoLabel>Variants</DemoLabel>
              <div className="flex flex-wrap items-center gap-3">
                <Magnetic>
                  <Button href="/contact">
                    Primary <ArrowRight className="size-4" />
                  </Button>
                </Magnetic>
                <Button href="/contact" variant="secondary">
                  Secondary
                </Button>
                <Button href="/contact" variant="outline">
                  Outline
                </Button>
                <Button href="/contact" variant="ghost">
                  Ghost
                </Button>
              </div>
            </DemoBlock>
            <DemoBlock>
              <DemoLabel>Sizes</DemoLabel>
              <div className="flex flex-wrap items-center gap-3">
                <Button href="/contact" size="sm">
                  Small
                </Button>
                <Button href="/contact">Default</Button>
                <Button href="/contact" size="lg">
                  Large
                </Button>
              </div>
            </DemoBlock>
          </div>
        </Reveal>
      </Section>

      <Section tone="light" className="border-t border-border">
        <Reveal stagger={0.06}>
          <Eyebrow>Badges</Eyebrow>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge>Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="ghost">Ghost</Badge>
          </div>
        </Reveal>
      </Section>

      <Section tone="dark" className="mt-8">
        <Reveal stagger={0.06}>
          <Eyebrow tone="dark">Cards · dark section</Eyebrow>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Card key={index} tone="dark" className="flex h-40 flex-col justify-between p-6">
                <p className="font-display text-lg font-bold text-hope-white">Dark card</p>
                <p className="text-base leading-7 text-hope-white/70">
                  A glass card with a spotlight that follows the pointer on hover.
                </p>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <Card tone="light" className="flex h-40 flex-col justify-between p-6">
              <p className="font-display text-lg font-bold text-hope-midnight">Light card</p>
              <p className="text-base leading-7 text-hope-fog">
                The light variant with a soft shadow and midnight border.
              </p>
            </Card>
          </div>
        </Reveal>
      </Section>

      <Section tone="dark" className="mt-8">
        <Reveal stagger={0.06}>
          <Eyebrow tone="dark">Logo</Eyebrow>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="flex h-40 flex-col items-center justify-center gap-4 rounded-3xl bg-hope-white p-6">
              <Logo variant="lockup" className="h-14" />
              <p className="text-sm text-hope-fog">Lockup on light</p>
            </div>
            <div className="flex h-40 flex-col items-center justify-center gap-4 rounded-3xl bg-hope-midnight p-6">
              <Logo variant="lockup" className="h-14" />
              <p className="text-sm text-hope-white/70">Lockup on midnight</p>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section tone="light" className="border-t border-border">
        <Reveal>
          <Eyebrow>Marquee</Eyebrow>
          <div className="mt-6 overflow-hidden rounded-3xl bg-hope-midnight py-5 text-hope-white">
            <Marquee duration={18}>
              {["Pure White", "Fogstone", "Solar Ember", "Midnight Blue", "Obsidian Veil"].map(
                (name) => (
                  <span
                    key={name}
                    className="mx-6 text-sm font-semibold tracking-[0.18em] uppercase"
                  >
                    {name}
                  </span>
                )
              )}
            </Marquee>
          </div>
        </Reveal>
      </Section>

      <Section tone="light" className="border-t border-border">
        <Reveal stagger={0.06}>
          <Eyebrow>Motion primitives</Eyebrow>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <DemoBlock>
              <DemoLabel>CountUp</DemoLabel>
              <p className="font-display text-4xl font-extrabold text-hope-midnight">
                <CountUp to={850} suffix="+" />
              </p>
            </DemoBlock>
            <DemoBlock>
              <DemoLabel>Reveal</DemoLabel>
              <p className="rounded-3xl border border-border p-6 text-base leading-7 text-hope-fog">
                This block lifts in when it enters the viewport, once.
              </p>
            </DemoBlock>
            <DemoBlock>
              <DemoLabel>Magnetic</DemoLabel>
              <Magnetic>
                <Button href="/contact">
                  Pull me <ArrowRight className="size-4" />
                </Button>
              </Magnetic>
            </DemoBlock>
          </div>
        </Reveal>
      </Section>
    </main>
  );
}