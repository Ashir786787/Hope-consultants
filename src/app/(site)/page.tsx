import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PreviewGrid } from "@/components/ui/preview-grid";
import { BlogCard } from "@/components/blog/blog-card";
import { TestimonialCard } from "@/components/testimonials/testimonial-card";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { CountryMarquee } from "@/components/countries/country-marquee";
import { DestinationsSpotlight } from "@/components/countries/destinations-spotlight";
import { Hero } from "@/components/sections/hero";
import { HeroBackdrop } from "@/components/motion/hero-backdrop";
import { ParentsVisual } from "@/components/sections/parents-visual";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getSite } from "@/lib/site";
import { getCollection } from "@/lib/store";
import { resolveHeroMedia } from "@/lib/hero-media";
import { resolveParentsImage } from "@/lib/parents-media";
import type { CountryDestination } from "@/lib/data/types";
import type { BlogPost } from "@/lib/data/blog";
import type { Testimonial } from "@/lib/data/testimonials";
import type { Service } from "@/lib/data/services";
import type { ProcessStep } from "@/lib/data/process";

const HERO = {
  eyebrow: "Hope Consultants",
  headline: "From your first question to your first day abroad, we're with you.",
  sub: "Admissions, scholarships, visas, and arrival guidance for students from Pakistan, all in one place, with honest advice and affordable support.",
  primaryCta: "Book a Free Consultation",
  secondaryCta: "Chat on WhatsApp",
} as const;

const INTRO = {
  title: "Studying abroad shouldn't mean piecing together answers from a dozen sources.",
  body: "Hope Consultants guides Pakistani students through every stage \u2014 choosing where to go, getting in, funding it, and actually arriving \u2014 with honest advice and affordable support.",
} as const;

const OUR_SERVICES = {
  eyebrow: "Our services",
  title: "Everything you need, in one place.",
  lede: "Ten focused services that carry you from the first conversation to the day you land.",
} as const;

const FOR_PARENTS = {
  title: "For parents",
  body: "Studying abroad is a family decision. We walk parents through costs, safety and timelines in a calm, honest conversation \u2014 so everyone agrees on the plan before anything starts.",
  cta: "Book a Parent Session",
} as const;

const COMING_SOON = {
  eyebrow: "Coming soon",
  title: "Two things we're building next.",
  items: [
    {
      name: "Language Classes & Courses",
      description: "In-house language preparation for IELTS and the languages your destination actually needs.",
    },
    {
      name: "Student Profile Assessment Tool",
      description: "A quick, honest read on where your grades, budget and goals realistically point.",
    },
  ],
  cta: "Notify Me When It Launches",
} as const;

const WHY_US = {
  eyebrow: "Why students and families choose us",
  title: "Honest advice, real people, no empty promises.",
  items: [
    {
      title: "We tell you the truth",
      body: "No inflated promises, no fake success stories. If a goal isn't realistic, we say so in the first conversation.",
    },
    {
      title: "Verified institutions only",
      body: "We verify every university, scholarship and agent before recommending it - so you never commit to something that isn't what it claims.",
    },
    {
      title: "We're with you the whole way",
      body: "From the first question to your first day abroad, a real person stays alongside you - not a form that disappears after payment.",
    },
    {
      title: "Affordable, transparent support",
      body: "Clear fees explained before you commit, and guidance in a language you actually understand.",
    },
  ],
} as const;

const FAQ = {
  eyebrow: "FAQ",
  title: "Questions families actually ask.",
  items: [
    {
      q: "Do you guarantee admission or a scholarship?",
      a: "No. Admission, scholarships and visas rest with universities, scholarship bodies and immigration authorities. We prepare the strongest honest application we can, and we never promise an outcome we don't control.",
    },
    {
      q: "How much does it cost to work with you?",
      a: "Fees depend on the service and are agreed with you in writing before any work begins. The first consultation is free, and there are no hidden charges.",
    },
    {
      q: "When should I start planning to study abroad?",
      a: "Ideally 9\u201312 months before your intended intake. Some routes \u2014 like national scholarships \u2014 have fixed annual windows, so starting early keeps every option open.",
    },
    {
      q: "Can you help if I already have an offer from an agent?",
      a: "Yes. We independently verify the institution, the offer and the pressure to pay before you commit a rupee. Many families come to us exactly for this check.",
    },
    {
      q: "Do you only work with European destinations?",
      a: "No. We work with students across Europe, Asia and beyond \u2014 including destinations like Japan, China, T\u00fcrkiye and Australia, depending on what fits your profile.",
    },
  ],
} as const;

const BLOG = {
  eyebrow: "Blog",
  title: "Notes from the road",
  lede: "Practical, honest writing on studying abroad — universities, scholarships, visas, and student life. New posts appear here automatically when the team publishes them.",
  cta: "View more articles",
} as const;

const TESTIMONIALS = {
  eyebrow: "Testimonials",
  title: "Students we have genuinely helped",
  lede: "One page, one promise: every word here is a real student's own, published with their written permission. No stock faces, no invented quotes, no scholarship stories that never happened.",
} as const;

const FINAL_CTA = {
  title: "Not sure where to start? Start with a conversation.",
  body: "Tell us where you want to study and what you're working with. We'll answer honestly \u2014 including whether we think the goal is realistic for you.",
} as const;

export const metadata = {
  title: "Hope Consultants | Study Abroad Guidance for Pakistani Students",
  description:
    "Hope Consultants guides Pakistani students through admissions, scholarships, visas and arrival - with honest advice and affordable support across 14 destinations.",
};

export default async function Home() {
  const [countries, services, processSteps, blog, testimonials] = await Promise.all([
    getCollection<CountryDestination[]>("countries"),
    getCollection<Service[]>("services"),
    getCollection<ProcessStep[]>("process"),
    getCollection<BlogPost[]>("blog"),
    getCollection<Testimonial[]>("testimonials"),
  ]);
  const site = await getSite();
  const parentsImage = resolveParentsImage();

  const sortedCountries = [...countries].sort((a, b) => a.position - b.position);
  const featuredServices = services.slice(0, 3);
  const testimonialPreview = testimonials
    .slice(0, 3)
    .map((testimonial) => ({
      key: testimonial.id,
      content: <TestimonialCard testimonial={testimonial} />,
    }));
  const blogPreview = [...blog]
    .filter((post) => post.published && post.coverImage)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3)
    .map((post) => ({ key: post.slug, content: <BlogCard post={post} /> }));

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none sticky top-0 z-0 h-svh w-full overflow-hidden"
        >
          <HeroBackdrop media={resolveHeroMedia()} />
        </div>

        <Hero
          countries={sortedCountries}
          services={services}
          processSteps={processSteps}
          whatsapp={site.whatsapp ?? ""}
        />

        <div className="relative z-10">
          <CountryMarquee countries={sortedCountries} />
        </div>
      </div>

      <section id="intro" className="border-b border-border bg-background">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal className="w-full">
            <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              {INTRO.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="w-full">
            <p className="max-w-xl text-base leading-7 text-muted-foreground">{INTRO.body}</p>
          </Reveal>
        </div>
      </section>

      <section id="services" className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6">
          <Reveal className="w-full">
            <SectionHeading
              eyebrow={OUR_SERVICES.eyebrow}
              title={OUR_SERVICES.title}
              lede={OUR_SERVICES.lede}
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.05} className="h-full">
                <article className="hope-card hope-card--light flex h-full flex-col gap-3 p-6">
                  <h3 className="font-display text-lg font-semibold text-card-foreground">
                    {service.name}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">{service.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="w-full">
            <Button nativeButton={false} render={<Link href="/services" />} variant="outline" size="lg">
              View more services
            </Button>
          </Reveal>
        </div>
      </section>

      <DestinationsSpotlight countries={sortedCountries} />

      <section id="for-parents" className="border-b border-border">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal className="w-full">
            <div className="flex flex-col gap-4">
              <Badge variant="outline" className="w-fit uppercase tracking-widest text-muted-foreground">
                {FOR_PARENTS.title}
              </Badge>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">{FOR_PARENTS.body}</p>
              <div className="pt-2">
                <Button nativeButton={false} render={<a href="/contact" />} size="lg">
                  {FOR_PARENTS.cta}
                </Button>
              </div>
            </div>
          </Reveal>
          <Reveal className="w-full" delay={0.1}>
            <ParentsVisual image={parentsImage} />
          </Reveal>
        </div>
      </section>

      <section id="coming-soon" className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6">
          <Reveal className="w-full">
            <SectionHeading
              eyebrow={COMING_SOON.eyebrow}
              title={COMING_SOON.title}
              lede=""
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {COMING_SOON.items.map((item, index) => (
              <Reveal key={item.name} delay={index * 0.05} className="h-full">
                <article className="hope-card hope-card--light flex h-full flex-col gap-3 p-6">
                  <h3 className="font-display text-lg font-semibold text-card-foreground">{item.name}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="w-full">
            <Button nativeButton={false} render={<a href="/contact" />} variant="outline" size="lg">
              {COMING_SOON.cta}
            </Button>
          </Reveal>
        </div>
      </section>

      <section id="why-us" className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6">
          <Reveal className="w-full">
            <SectionHeading
              eyebrow={WHY_US.eyebrow}
              title={WHY_US.title}
              lede=""
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {WHY_US.items.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05} className="h-full">
                <article className="hope-card hope-card--light flex h-full flex-col gap-3 p-6">
                  <h3 className="font-display text-lg font-semibold text-card-foreground">{item.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {blogPreview.length > 0 ? (
        <section id="blog" className="border-b border-border">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6">
            <Reveal className="w-full">
              <SectionHeading
                eyebrow={BLOG.eyebrow}
                title={BLOG.title}
                lede={BLOG.lede}
              />
            </Reveal>
            <PreviewGrid
              items={blogPreview}
              viewMoreLink={
                <Reveal className="w-full">
                  <Button nativeButton={false} render={<Link href="/blog" />} variant="outline" size="lg">
                    {BLOG.cta}
                  </Button>
                </Reveal>
              }
            />
          </div>
        </section>
      ) : null}

      {testimonialPreview.length > 0 ? (
        <section id="testimonials" className="border-b border-border">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6">
            <Reveal className="w-full">
              <SectionHeading
                eyebrow={TESTIMONIALS.eyebrow}
                title={TESTIMONIALS.title}
                lede={TESTIMONIALS.lede}
              />
            </Reveal>
            <PreviewGrid
              items={testimonialPreview}
              viewMoreLink={
                <Reveal className="w-full">
                  <Button
                    nativeButton={false}
                    render={<Link href="/testimonials" />}
                    variant="outline"
                    size="lg"
                  >
                    View more
                  </Button>
                </Reveal>
              }
            />
          </div>
        </section>
      ) : null}

      <section id="faq" className="border-b border-border">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-20 sm:px-6">
          <Reveal className="w-full">
            <SectionHeading eyebrow={FAQ.eyebrow} title={FAQ.title} lede="" />
          </Reveal>
          <Reveal className="w-full">
            <Accordion>
              {FAQ.items.map((item, index) => (
                <AccordionItem key={item.q} value={`faq-${index}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <section id="contact" className="bg-primary text-primary-foreground">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-4 py-20 sm:px-6">
          <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {FINAL_CTA.title}
          </h2>
          <p className="max-w-xl text-base leading-7 text-primary-foreground/80">{FINAL_CTA.body}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button nativeButton={false} render={<a href="/contact" />} size="lg" variant="secondary">
                {HERO.primaryCta}
              </Button>
            </Magnetic>
            {site.whatsapp ? (
              <Magnetic>
                <Button
                  nativeButton={false}
                  render={
                    <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" />
                  }
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  {HERO.secondaryCta}
                </Button>
              </Magnetic>
            ) : null}
          </div>
        </div>
      </section>
      <Separator />
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
      <Badge variant="outline" className="uppercase tracking-widest text-muted-foreground">
        {eyebrow}
      </Badge>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {lede ? <p className="text-base leading-7 text-muted-foreground">{lede}</p> : null}
    </div>
  );
}
