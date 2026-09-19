import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm, ContactInfo } from "@/components/contact/contact";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Contact us | Hope Consultants",
  description:
    "Reach the Hope Consultants team. Simple email form, real people, honest answers within two working days.",
};

export default function ContactPage() {
  return (
    <main className="w-full">
      <section className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6">
          <Badge variant="secondary" className="w-fit border border-border uppercase">
            Contact
          </Badge>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-card-foreground sm:text-5xl">
            A real person reads every message
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            Tell us where you want to study and what you are working with. We will answer
            honestly — including whether we think the goal is realistic for you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <ContactInfo />
        <ContactForm />
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-12 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Prefer to read first? Start on our{" "}
            <Link className={buttonVariants({ variant: "link" })} href="/process">
              free consultation process
            </Link>
            .
          </p>
          <Link className={buttonVariants({ variant: "outline" })} href="/">
            Back to home
          </Link>
        </div>
      </section>
      <Separator />
    </main>
  );
}
