import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DarkPageHero } from "@/components/sections/dark-page-hero";
import { DarkSection } from "@/components/sections/dark-section";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { getCollection } from "@/lib/store";
import type { Testimonial } from "@/lib/data/testimonials";

export const metadata: Metadata = {
  title: "Student Testimonials | Hope Consultants",
  description:
    "Real words from students we have helped. We only publish a testimonial when the student has given written permission — and we never stage or rewrite what they said.",
};

export default async function TestimonialsPage() {
  const testimonials = await getCollection<Testimonial[]>("testimonials");
  return (
    <main id="main-content" className="w-full">
      <DarkPageHero
        eyebrow="Testimonials"
        title="Students we have genuinely helped"
        lede="One page, one promise: every word here is a real student's own, published with their written permission. No stock faces, no invented quotes, no scholarship stories that never happened."
      />

      <DarkSection>
        {testimonials.length > 0 ? (
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.id} delay={index * 0.05} className="h-full">
                <article className="hope-card flex h-full flex-col gap-6 p-6 sm:p-8">
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant="outline"
                      className="w-fit border-[rgb(255_255_255/0.20)] text-hope-white"
                    >
                      {testimonial.destination}
                    </Badge>
                    <p className="font-display text-xl font-semibold text-hope-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-hope-white/70">{testimonial.outcome}</p>
                  </div>
                  <Separator className="bg-[rgb(255_255_255/0.10)]" />
                  <blockquote className="text-lg leading-8 text-hope-white">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                </article>
              </Reveal>
            ))}
          </div>
        ) : null}

        <Reveal className="mt-6 w-full">
          <div className="hope-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex max-w-2xl flex-col gap-2">
              <p className="text-sm font-medium text-hope-white">We only publish with permission</p>
              <p className="text-sm leading-7 text-hope-white/70">
                If you are one of our students and would like your story told here, we will
                happily share it — but only in your own words, only with your written
                consent, and you can withdraw at any time.
              </p>
            </div>
            <Magnetic>
              <Button size="lg" nativeButton={false} render={<a href="/contact" />}>
                Share your story
              </Button>
            </Magnetic>
          </div>
        </Reveal>
      </DarkSection>
    </main>
  );
}
