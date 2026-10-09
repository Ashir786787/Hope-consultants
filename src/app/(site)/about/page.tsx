import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DarkPageHero } from "@/components/sections/dark-page-hero";
import { DarkSection } from "@/components/sections/dark-section";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { TeamPhoto } from "@/components/sections/team-photo";
import type { TeamMember } from "@/lib/data/types";
import { defaultAbout, type AboutFields } from "@/lib/data/about";
import { getCollection } from "@/lib/store";
import { resolveTeamImage } from "@/lib/team-media";

export const metadata = {
  title: "About Hope Consultants",
  description:
    "Who we are and why we exist: honest study-abroad guidance for Pakistani students that never sells fake promises.",
};

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

export default async function AboutPage() {
  const [stored, members] = await Promise.all([
    getCollection<Partial<AboutFields>>("about"),
    getCollection<TeamMember[]>("team"),
  ]);
  const content: AboutFields = { ...defaultAbout, ...(stored ?? {}) };

  return (
    <main id="main-content" className="w-full">
      <DarkPageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        lede={content.heroLede}
      />

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-16 sm:px-6">
        <Reveal className="mx-auto flex w-full max-w-3xl flex-col gap-5 text-center">
          <Badge variant="outline" className="mx-auto w-fit uppercase tracking-widest text-muted-foreground">
            Our story
          </Badge>
          <p className="text-lg leading-8 text-card-foreground">{content.story}</p>
        </Reveal>

        <Separator />

        <Reveal className="mx-auto flex w-full max-w-3xl flex-col gap-5 text-center">
          <Badge variant="outline" className="mx-auto w-fit uppercase tracking-widest text-muted-foreground">
            Our mission
          </Badge>
          <p className="text-lg leading-8 text-card-foreground">{content.mission}</p>
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
          <p className="text-lg leading-8 text-card-foreground">{content.journey}</p>
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
            {(members ?? []).map((member, index) => {
              const image = member.image ?? "";
              const photo = image.startsWith("data:") ? image : resolveTeamImage(image);
              return (
                <Reveal key={member.name} delay={index * 0.05} className="h-full">
                  <article className="hope-card hope-card--light group flex h-full flex-col">
                    {photo ? <TeamPhoto src={photo} alt={member.name} /> : null}
                    <div className="flex flex-col gap-4 p-6">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-display text-xl font-semibold text-hope-midnight">
                          {member.name}
                        </h3>
                        <p className="text-sm font-medium text-hope-fog">{member.role}</p>
                      </div>
                      <blockquote className="border-l-2 border-hope-ember pl-4 text-sm leading-7 text-hope-midnight/90">
                        &ldquo;{member.quote}&rdquo;
                      </blockquote>
                      <p className="text-sm leading-7 text-hope-fog">{member.bioShort}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Separator />

        <Reveal className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <Badge variant="outline" className="mx-auto w-fit uppercase tracking-widest text-muted-foreground">
            {content.parentsTitle}
          </Badge>
          <p className="text-lg leading-8 text-card-foreground">{content.parentsBody}</p>
        </Reveal>

        <Separator />

        <DarkSection className="border-t-0">
          <Reveal className="mx-auto w-full max-w-3xl">
            <div className="hope-card hope-card--radius-lg flex flex-col items-center gap-4 p-8 text-center sm:p-10">
              <h2 className="max-w-xl font-display text-2xl font-semibold leading-tight tracking-tight text-hope-white sm:text-3xl">
                {content.ctaTitle}
              </h2>
              <p className="max-w-xl text-base leading-7 text-hope-white/70">{content.ctaBody}</p>
              <div className="pt-1">
                <Magnetic>
                  <Button size="lg" nativeButton={false} render={<a href="/contact" />}>
                    {content.ctaLabel}
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