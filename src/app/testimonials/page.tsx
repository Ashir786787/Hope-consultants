import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { testimonials } from "@/lib/data/testimonials";

export const metadata: Metadata = {
  title: "Student Testimonials | Hope Consultants",
  description:
    "Real words from students we have helped. We only publish a testimonial when the student has given written permission — and we never stage or rewrite what they said.",
};

export default function TestimonialsPage() {
  return (
    <main className="w-full">
      <section className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6">
          <Badge variant="secondary" className="w-fit border border-border uppercase">
            Testimonials
          </Badge>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-card-foreground sm:text-5xl">
            Students we have genuinely helped
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            One page, one promise: every word here is a real student&apos;s own,
            published with their written permission. No stock faces, no invented quotes,
            no scholarship stories that never happened.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-16 sm:px-6">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.id}
            className="flex flex-col gap-6 border border-border bg-card px-6 py-8 sm:px-8"
          >
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
        ))}

        <div className="flex flex-col gap-4 rounded-none border border-border bg-muted/50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
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
      </section>
    </main>
  );
}
