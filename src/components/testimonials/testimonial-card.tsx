import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Testimonial } from "@/lib/data/testimonials";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="hope-card hope-card--light flex h-full flex-col gap-6 p-6 sm:p-8">
      <div className="flex flex-col gap-2">
        {testimonial.destination ? (
          <Badge variant="outline" className="w-fit text-muted-foreground">
            {testimonial.destination}
          </Badge>
        ) : null}
        <p className="font-display text-xl font-semibold text-card-foreground">
          {testimonial.name}
        </p>
        {testimonial.outcome ? (
          <p className="text-sm leading-6 text-muted-foreground">{testimonial.outcome}</p>
        ) : null}
      </div>
      {testimonial.quote ? (
        <>
          <Separator />
          <blockquote className="text-lg leading-8 text-foreground">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
        </>
      ) : null}
    </article>
  );
}
