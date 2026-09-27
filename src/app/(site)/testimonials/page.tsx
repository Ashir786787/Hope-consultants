import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { DarkPageHero } from "@/components/sections/dark-page-hero";
import { DarkSection } from "@/components/sections/dark-section";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { TestimonialCard } from "@/components/testimonials/testimonial-card";
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

      {testimonials.length > 0 ? (
        <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.id} delay={index * 0.05} className="h-full">
              <TestimonialCard testimonial={testimonial} />
            </Reveal>
          ))}
        </section>
      ) : null}

      <DarkSection>
        <Reveal className="w-full">
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
