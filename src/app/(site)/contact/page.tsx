import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm, ContactInfo } from "@/components/contact/contact";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DarkPageHero } from "@/components/sections/dark-page-hero";
import { DarkSection } from "@/components/sections/dark-section";
import { Magnetic } from "@/components/motion/magnetic";

export const metadata: Metadata = {
  title: "Contact us | Hope Consultants",
  description:
    "Reach the Hope Consultants team. Simple email form, real people, honest answers within two working days.",
};

export default function ContactPage() {
  return (
    <main id="main-content" className="w-full">
      <DarkPageHero
        eyebrow="Contact"
        title="A real person reads every message"
        lede="Tell us where you want to study and what you are working with. We will answer honestly — including whether we think the goal is realistic for you."
      />

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <ContactInfo />
        <ContactForm />
      </section>

      <DarkSection>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-7 text-hope-white/70">
            Prefer to read first? Start on our{" "}
            <Link
              className="font-medium text-hope-white underline underline-offset-4"
              href="/process"
            >
              free consultation process
            </Link>
            .
          </p>
          <Magnetic>
            <Link className={buttonVariants({ size: "lg" })} href="/">
              Back to home
            </Link>
          </Magnetic>
        </div>
      </DarkSection>
      <Separator />
    </main>
  );
}
