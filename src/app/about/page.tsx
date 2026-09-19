import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "About Hope Consultants",
  description:
    "Who we are and why we exist: honest study-abroad guidance for Pakistani students that never sells fake promises.",
};

const commitments = [
  {
    title: "We tell you the truth about costs",
    body: "Every destination page shows real tuition and living figures in euros, and we flag which programmes are genuinely tuition-free versus which are not.",
  },
  {
    title: "We never invent scholarships",
    body: "Scholarships are competitive and change every year. We list the funding routes that actually exist and note clearly that none are guaranteed.",
  },
  {
    title: "We do not pad the team",
    body: "No stock photos, no invented staff, no fabricated success stories. What we cannot show you honestly, we do not show you at all.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="w-full">
      <section className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6">
          <Badge variant="secondary" className="w-fit border border-border">
            About us
          </Badge>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Guidance a Pakistani student can actually trust
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            Hope Consultants exists for one reason: most study-abroad advice for Pakistani
            students is built on inflated promises. We built the opposite — honest,
            patient guidance that respects your money and your time.
          </p>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-reminder6">
          <h2 className="font-display text-2xl font-semibold text-card-foreground">
            What we commit to
          </h2>
          <Separator />
        </div>
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          {commitments.map((item) => (
            <article key={item.title} className="flex flex-col gap-3 border border-border bg-card p-6">
              <h3 className="font-display text-lg font-semibold text-card-foreground">
                {item.title}
              </h3>
              <p className="text-sm leading-7 text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>

        <Separator />

        <div className="flex flex-col gap-5">
          <h2 className="font-display text-2xl font-semibold text-card-foreground">
            Who we serve
          </h2>
          <div className="flex flex-col gap-4">
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              Pakistani students and their families planning to study in 14 European
              destinations — and anyone who wants honest answers about cost, admissions,
              and the reality of studying abroad before spending a rupee.
            </p>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              We are equally honest with the people we cannot help. If a goal is not
              realistic, we say so in the first conversation — without charging for it.
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-5">
          <h2 className="font-display text-2xl font-semibold text-card-foreground">
            How to start with us
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            The first conversation is free and carries no obligation. Book it, bring your
            questionshare — and we will tell you honestly what is and is not possible.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button size="lg" render={<a href="/contact" />}>
              Book a free consultation
            </Button>
            <Button size="lg" variant="outline" render={<a href="/process" />}>
              See how we work
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
