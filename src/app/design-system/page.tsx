import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRightIcon, StarIcon } from "lucide-react";
import { Badge, Eyebrow } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { Section } from "@/components/ui/section";
import { CountUp } from "@/components/motion/count-up";
import { Magnetic } from "@/components/motion/magnetic";
import { Marquee } from "@/components/motion/marquee";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Design System | Hope Consultants",
};

const TOKENS = [
  {
    name: "Hope White",
    hex: "#FFFFFF",
    variable: "--hope-white",
    background: "#FFFFFF",
    foreground: "#000C38",
    ring: "ring-1 ring-[rgb(var(--hope-obsidian-rgb)/0.15)]",
  },
  {
    name: "Hope Fog",
    hex: "#6C757D",
    variable: "--hope-fog",
    background: "#6C757D",
    foreground: "#FFFFFF",
    ring: "",
  },
  {
    name: "Hope Ember",
    hex: "#FFB703",
    variable: "--hope-ember",
    background: "#FFB703",
    foreground: "#000C38",
    ring: "",
  },
  {
    name: "Hope Midnight",
    hex: "#000C38",
    variable: "--hope-midnight",
    background: "#000C38",
    foreground: "#FFFFFF",
    ring: "",
  },
  {
    name: "Hope Obsidian",
    hex: "#090909",
    variable: "--hope-obsidian",
    background: "#090909",
    foreground: "#FFFFFF",
    ring: "",
  },
] as const;

const MARQUEE_ITEMS = [
  "Admissions",
  "Visa guidance",
  "Scholarships",
  "14 countries",
  "Honest advice",
] as const;

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="w-full">
      <Section tone="dark">
        <Eyebrow tone="dark">Hope Consultants · Step 1</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-display font-bold tracking-tight">
          Design system
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-hope-fog">
          The shared tokens, primitives, and motion behind the site rebuild. This page is
          stripped from the production build.
        </p>
      </Section>

      <Section>
        <Eyebrow>Tokens</Eyebrow>
        <h2 className="mt-4 text-h2 font-bold">Brand colors</h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {TOKENS.map((token) => (
            <div
              key={token.name}
              className="overflow-hidden rounded-2xl border border-[rgb(var(--hope-midnight-rgb)/0.12)]"
            >
              <div
                className={`flex h-28 items-end p-3 ${token.ring}`}
                style={{ backgroundColor: token.background }}
              >
                <span
                  className="text-xs font-bold"
                  style={{ color: token.foreground }}
                >
                  {token.name}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 bg-hope-white p-4">
                <span className="text-xs font-bold text-hope-midnight">{token.hex}</span>
                <span className="text-[0.7rem] text-hope-fog">{token.variable}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <Eyebrow tone="dark">Typography</Eyebrow>
        <div className="mt-10 flex flex-col gap-12">
          <div>
            <p className="eyebrow text-hope-ember">Display</p>
            <p className="mt-3 max-w-3xl text-display font-bold tracking-tight">
              A fresh start abroad
            </p>
          </div>
          <div>
            <p className="eyebrow text-hope-ember">Heading 2</p>
            <p className="mt-3 text-h2 font-bold">Every destination, honestly priced</p>
          </div>
          <div>
            <p className="eyebrow text-hope-ember">Heading 3</p>
            <p className="mt-3 text-h3 font-bold">Scholarships that actually exist</p>
          </div>
          <div>
            <p className="eyebrow text-hope-ember">Body</p>
            <p className="mt-3 max-w-2xl text-base leading-7 text-hope-fog">
              Hope Consultants guides Pakistani students through university admissions,
              scholarships, and student visas across 14 study destinations — with honest
              answers about cost and reality before a rupee is spent.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <Eyebrow>Buttons</Eyebrow>
        <h2 className="mt-4 text-h2 font-bold">Variants</h2>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button variant="primary" size="lg">
            Book a consultation
            <ArrowRightIcon />
          </Button>
          <Button variant="secondary" size="lg">
            See how we work
          </Button>
          <Button variant="ghost" size="lg">
            Learn more
          </Button>
          <Button variant="outline" size="lg">
            Back to home
          </Button>
          <Button href="/contact">Links via next/link</Button>
        </div>
        <h3 className="mt-14 text-h3 font-bold">Sizes</h3>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section tone="dark">
        <Eyebrow tone="dark">Badges &amp; labels</Eyebrow>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Eyebrow tone="dark">Eyebrow label</Eyebrow>
        </div>
      </Section>

      <Section>
        <Eyebrow>Cards</Eyebrow>
        <h2 className="mt-4 text-h2 font-bold">Spotlight cards</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="flex flex-col gap-4 bg-[rgb(var(--hope-obsidian-rgb)/0.85)] p-8">
            <Eyebrow tone="dark">Count up</Eyebrow>
            <p className="mt-2 text-5xl font-bold tracking-tight text-hope-white">
              <CountUp to={14250} />
            </p>
            <p className="text-sm text-hope-fog">students guided across 14 countries</p>
          </Card>
          <Card className="flex flex-col gap-4 bg-[rgb(var(--hope-obsidian-rgb)/0.85)] p-8">
            <Eyebrow tone="dark">Magnetic</Eyebrow>
            <p className="mt-2 text-sm leading-7 text-hope-white">
              Desktop pointers gently pull the element within an 80px reach.
            </p>
            <Magnetic className="mt-auto">
              <Button variant="primary" size="lg">
                Hover me
                <ArrowRightIcon />
              </Button>
            </Magnetic>
          </Card>
          <Card tone="light" className="flex flex-col gap-4 p-8">
            <Eyebrow>Light card</Eyebrow>
            <p className="mt-2 text-sm leading-7 text-hope-midnight">
              The light variant keeps the ember spotlight but starts from a crisp white
              surface with a soft shadow.
            </p>
            <div className="mt-auto flex items-center gap-3">
              <Badge variant="secondary">Visa</Badge>
              <Badge variant="outline">€23,000</Badge>
            </div>
          </Card>
        </div>
      </Section>

      <Section>
        <Eyebrow>Marquee</Eyebrow>
        <Marquee duration={18}>
          {MARQUEE_ITEMS.map((item) => (
            <span
              key={item}
              className="mx-3 flex items-center gap-3 text-2xl font-bold tracking-tight text-hope-midnight"
            >
              {item}
              <StarIcon className="size-5 text-hope-ember" aria-hidden="true" />
            </span>
          ))}
        </Marquee>
      </Section>

      <Section>
        <Eyebrow>Reveal</Eyebrow>
        <h2 className="mt-4 text-h2 font-bold">Staggered on scroll</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Reveal>
            <Card className="flex h-full flex-col gap-3 bg-[rgb(var(--hope-obsidian-rgb)/0.85)] p-6">
              <Eyebrow tone="dark">01</Eyebrow>
              <p className="font-bold text-hope-white">Free first conversation</p>
              <p className="text-sm leading-6 text-hope-fog">
                No obligation, honest feasibility check.
              </p>
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <Card className="flex h-full flex-col gap-3 bg-[rgb(var(--hope-obsidian-rgb)/0.85)] p-6">
              <Eyebrow tone="dark">02</Eyebrow>
              <p className="font-bold text-hope-white">Real documents</p>
              <p className="text-sm leading-6 text-hope-fog">
                Tuition and living costs in euros from the source.
              </p>
            </Card>
          </Reveal>
          <Reveal delay={0.2}>
            <Card className="flex h-full flex-col gap-3 bg-[rgb(var(--hope-obsidian-rgb)/0.85)] p-6">
              <Eyebrow tone="dark">03</Eyebrow>
              <p className="font-bold text-hope-white">Honest timelines</p>
              <p className="text-sm leading-6 text-hope-fog">
                Realistic expectations from day one.
              </p>
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section tone="dark">
        <Eyebrow tone="dark">Logo</Eyebrow>
        <div className="mt-6 flex flex-col gap-6 sm:flex-row">
          <div className="flex min-h-40 flex-1 items-center justify-center rounded-2xl border border-hope-white/10 bg-hope-white/5 p-8">
            <Logo variant="full" className="h-12 w-auto" />
          </div>
          <div className="flex min-h-40 flex-1 items-center justify-center rounded-2xl border border-[rgb(var(--hope-midnight-rgb)/0.12)] bg-hope-white p-8">
            <Logo variant="full" className="h-12 w-auto" />
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-hope-fog">
          Live asset: /public/brand/logo-full-color.jpg — used by the navbar, mobile menu,
          and footer. Replace that one file to swap the logo everywhere.
        </p>
      </Section>
    </main>
  );
}