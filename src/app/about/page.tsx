import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DarkPageHero } from "@/components/sections/dark-page-hero";
import { DarkSection } from "@/components/sections/dark-section";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { team } from "@/lib/data/team";

export const metadata = {
  title: "About Hope Consultants",
  description:
    "Who we are and why we exist: honest study-abroad guidance for Pakistani students that never sells fake promises.",
};

const OUR_STORY =
  "Hope Consultants was built on a simple frustration: most study-abroad advice for Pakistani students is either inflated, expensive, or both. We are a team of researchers, processors and former international students who lived the process ourselves — and we started this firm to give students the guidance we wish someone had given us.";

const OUR_MISSION =
  "To help every Pakistani student reach a genuinely good, affordable study abroad outcome — through verified universities, honest financial figures, and support that lasts until the student actually arrives and settles in.";

const STAND_FOR = [
  {
    title: "Honesty over hype",
    body: "Every claim on this website is checked against an official source before it is published. We do not invent scholarships, rankings, success rates or testimonials.",
  },
  {
    title: "Verification before payment",
    body: "We verify universities, offers and agents before a rupee changes hands — for us and for you.",
  },
  {
    title: "Accessible, honest service",
    body: "Study abroad guidance should not be a luxury. We keep our fees within reach and explain them clearly before any commitment.",
  },
  {
    title: "No false guarantees",
    body: "Admission, funding and visas are decided by universities, scholarship bodies and immigration authorities — never by us. We never pretend otherwise.",
  },
  {
    title: "We stay until you arrive",
    body: "The relationship does not end at payment or at the visa. We support enrollment, arrival and settling in — because a completed journey is the only real success.",
  },
] as const;

const JOURNEY =
  "Every year we help more students across Europe — and beyond — move from a first question to a first day on campus. We work in small, careful batches, because the quality of our processing depends on our attention, not our speed.";

const PARENTS_NOTE = {
  title: "A note for parents",
  body: "We know this decision belongs to the whole family. In our parent sessions we explain costs, safety, timelines and the real risks in plain language — and we never push a family towards any plan they are not comfortable with.",
};

const CLOSING_CTA = {
  title: "If researching abroad feels like a maze, you are in the right place.",
  body: "Book a free consultation. We will tell you honestly what is realistic for your grades, budget and goals — even if that means telling you to wait, or not to go.",
  cta: "Book a free consultation",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="w-full">
      <DarkPageHero
        eyebrow="About us"
        title="Study abroad, without the struggle or the scams."
        lede="We guide Pakistani students through admissions, scholarships, visas and arrival — honestly, affordably, and to the very end."
      />

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-16 sm:px-6">
        <Reveal className="mx-auto flex w-full max-w-3xl flex-col gap-5 text-center">
          <Badge variant="outline" className="mx-auto w-fit uppercase tracking-widest text-muted-foreground">
            Our story
          </Badge>
          <p className="text-lg leading-8 text-card-foreground">{OUR_STORY}</p>
        </Reveal>

        <Separator />

        <Reveal className="mx-auto flex w-full max-w-3xl flex-col gap-5 text-center">
          <Badge variant="outline" className="mx-auto w-fit uppercase tracking-widest text-muted-foreground">
            Our mission
          </Badge>
          <p className="text-lg leading-8 text-card-foreground">{OUR_MISSION}</p>
        </Reveal>

        <Separator />

        <div className="flex flex-col gap-8">
          <Reveal className="flex flex-col gap-3 text-center">
            <Badge variant="outline" className="mx-auto w-fit uppercase tracking-widest text-muted-foreground">
              What we stand for
            </Badge>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-card-foreground sm:text-4xl">
              Five commitments we never break
            </h2>
          </Reveal>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STAND_FOR.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05} className="h-full">
                <article className="hope-card hope-card--light flex h-full flex-col gap-3 p-6">
                  <h3 className="font-display text-lg font-semibold text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <Separator />

        <Reveal className="mx-auto flex w-full max-w-3xl flex-col gap-5 text-center">
          <Badge variant="outline" className="mx-auto w-fit uppercase tracking-widest text-muted-foreground">
            Our journey
          </Badge>
          <p className="text-lg leading-8 text-card-foreground">{JOURNEY}</p>
        </Reveal>

        <Separator />

        <div className="flex flex-col gap-10">
          <Reveal className="flex flex-col gap-3 text-center">
            <Badge variant="outline" className="mx-auto w-fit uppercase tracking-widest text-muted-foreground">
              The team
            </Badge>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-card-foreground sm:text-4xl">
              Real people, real accountability
            </h2>
          </Reveal>
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
            {team.map((member, index) => (
              <Reveal key={member.name} delay={index * 0.05} className="h-full">
                <article className="hope-card hope-card--light flex h-full flex-col gap-4 p-6">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display text-xl font-semibold text-card-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm font-semibold text-primary">{member.role}</p>
                  </div>
                  <blockquote className="border-l-2 border-primary pl-4 text-sm leading-7 text-card-foreground">
                    &ldquo;{member.quote}&rdquo;
                  </blockquote>
                  <p className="text-sm leading-7 text-muted-foreground">{member.bioShort}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <Separator />

        <Reveal className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <Badge variant="outline" className="mx-auto w-fit uppercase tracking-widest text-muted-foreground">
            {PARENTS_NOTE.title}
          </Badge>
          <p className="text-lg leading-8 text-card-foreground">{PARENTS_NOTE.body}</p>
        </Reveal>

        <Separator />

        <DarkSection className="border-t-0">
          <Reveal className="mx-auto w-full max-w-3xl">
            <div className="hope-card flex flex-col items-center gap-4 p-8 text-center sm:p-10">
              <h2 className="max-w-xl font-display text-2xl font-semibold leading-tight tracking-tight text-hope-white sm:text-3xl">
                {CLOSING_CTA.title}
              </h2>
              <p className="max-w-xl text-base leading-7 text-hope-white/70">{CLOSING_CTA.body}</p>
              <div className="pt-1">
                <Magnetic>
                  <Button size="lg" nativeButton={false} render={<a href="/contact" />}>
                    {CLOSING_CTA.cta}
                  </Button>
                </Magnetic>
              </div>
            </div>
          </Reveal>
        </DarkSection>
      </section>
    </main>
  );
}