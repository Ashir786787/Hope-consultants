import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageHero } from "@/components/page-hero";
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
    <main className="w-full">
      <PageHero
        eyebrow="Testimonials"
        title="Students we have genuinely helped"
        lede="One page, one promise: every word here is a real student's own, published with their written permission. No stock faces, no invented quotes, no scholarship stories that never happened."
      />

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-16 sm:px-6">
        {testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.id} delay={index * 0.05} className="h-full">
            <article className="hope-card hope-card--light flex h-full flex-col gap-6 px-6 py-8 sm:px-8">
              <div className="flex flex-col gap-1">
                <Badge variant="outline" className="w-fit border-border">
                  {testimonial.destination}
                </Badge>
                <p className="font-display text-xl font-semibold text-card-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">{testimonial.outcome}</p>
              </div>
              <Separator />
              <blockquote className="text-lg leading-8 text-card-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
            </article>
          </Reveal>
        ))}

        <Reveal className="h-full">
          <div className="hope-card hope-card--light flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex max-w-2xl flex-col gap-2">
              <p className="text-sm font-medium text-card-foreground">
                We only publish with permission
              </p>
              <p className="text-sm leading-7 text-muted-foreground">
                If you are one of our students and would like your story told here, we will
                happily share it — but only in your own words, only with your written
                consent, and you can withdraw at any time.
              </p>
            </div>
            <Button size="lg" render={<a href="/contact" />}>
              Share your story
            </Button>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
