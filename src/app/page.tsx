import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { countries } from "@/lib/data/countries";
import { services } from "@/lib/data/services";
import { processSteps } from "@/lib/data/process";
import { scholarships } from "@/lib/data/scholarships";
import { testimonials } from "@/lib/data/testimonials";
import { Separator } from "@/components/ui/separator";
import type { CostBand } from "@/lib/data/types";

const costBandLabel: Record<CostBand, string> = {
  low: "Low cost",
  medium: "Medium cost",
  high: "Premium cost",
};

const bandColor: Record<CostBand, string> = {
  low: "border-border bg-emerald-50 text-emerald-800",
  medium: "border-border bg-amber-50 text-amber-800",
  high: "border-border bg-rose-50 text-rose-800",
};

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
      <p className="text-base leading-7 text-muted-foreground">{lede}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-tight">
              Hope<span className="text-primary"> Consultants</span>
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
            <a href="#countries" className="transition-colors hover:text-foreground">
              Countries
            </a>
            <a href="#services" className="transition-colors hover:text-foreground">
              Services
            </a>
            <a href="#process" className="transition-colors hover:text-foreground">
              Process
            </a>
            <a href="#scholarships" className="transition-colors hover:text-foreground">
              Funding
            </a>
          </nav>
            <Button render={<a href="#contact" />} size="sm">
              Free consultation
            </Button>
        </div>
      </header>

      <section id="top" className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-10 px-4 py-20 sm:px-6 sm:py-28">
          <div className="flex flex-col items-start gap-5">
            <Badge className="bg-primary text-primary-foreground">
              Trusted guidance for Pakistani students
            </Badge>
            <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Your degree in Europe starts with <span className="text-primary">honest</span>{" "}
              guidance, not promises.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              Hope Consultants helps you find a university that genuinely fits your{" "}
              <strong className="font-medium text-foreground">grades, budget, and goals</strong>{" "}
              across {countries.length} destinations and {services.length} services. We tell
              you the truth about costs, visas, and scholarships — before you spend a rupee.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button render={<a href="#countries" />} size="lg">
              Explore {countries.length} countries
            </Button>
            <Button render={<a href="#contact" />} size="lg" variant="outline">
              Book a free consultation
            </Button>
          </div>
          <dl className="grid w-full max-w-2xl grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
            {[
              { value: String(countries.length), label: "Study destinations" },
              { value: String(services.length), label: "Services we offer" },
              { value: "6", label: "Step-by-step process" },
              { value: "0", label: "Fake promises" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-2xl font-bold text-foreground">{stat.value}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="services" className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="What we do"
            title="Services that cover the whole journey"
            lede="From the first conversation to the day you land, everything we do is built on honesty about what's possible."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.slug}
                className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6"
              >
                <div>
                  <h3 className="font-display text-lg font-semibold text-card-foreground">
                    {service.shortName}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{service.name}</p>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{service.description}</p>
                <ul className="mt-auto flex flex-col gap-2 text-sm text-card-foreground">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span aria-hidden="true" className="mt-0.5 text-primary">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="countries" className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Destinations"
            title="Fourteen countries, one honest picture"
            lede="Each profile gives you real figures for tuition, living costs, and visa reality — with no tuition fees hidden and no scholarship promises invented."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((country) => (
              <article
                key={country.slug}
                className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-3xl leading-none" aria-hidden="true">
                    {country.flag}
                  </div>
                  <Badge className={cn("border", bandColor[country.cost.band])}>
                    {costBandLabel[country.cost.band]}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-card-foreground">
                    {country.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{country.tagline}</p>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{country.description}</p>
                <div className="flex flex-wrap gap-2">
                  {country.popularFields.slice(0, 3).map((field) => (
                    <Badge key={field} variant="secondary">
                      {field}
                    </Badge>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="How it works"
            title="A six-step process with zero surprises"
            lede="Clear, transparent stages. If something isn't possible, we tell you at step one — not after you've paid."
          />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step) => (
              <li
                key={step.step}
                className="flex flex-col gap-3 rounded-lg border border-border bg-card p-6"
              >
                <span className="font-display text-4xl font-bold text-primary">
                  {String(step.step).padStart(2, "0")}
                </span>
                <h3 className="font-display text-lg font-semibold text-card-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="scholarships" className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Funding, honestly"
            title="Scholarships are possible. They are never guaranteed."
            lede="We will never sell you a scholarship. We explain the real routes to funding, and we tell you which ones are actually worth your time."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {scholarships.map((item) => (
              <article
                key={item.name}
                className="flex flex-col gap-3 rounded-lg border border-border bg-card p-6"
              >
                <h3 className="font-display text-lg font-semibold text-card-foreground">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground">{item.provider}</p>
                <p className="text-sm text-muted-foreground">{item.country}</p>
                <p className="text-sm font-medium text-primary">{item.covers}</p>
                <p className="text-sm leading-6 text-muted-foreground">{item.advice}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="border-b border-border">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="From our students"
            title="What students remember us for"
            lede="Real feedback. We only publish a testimonial when a student gives us permission."
          />
          <figure className="rounded-lg border border-border bg-card p-8 text-center">
            <blockquote className="font-display text-xl font-medium leading-8 text-card-foreground">
              {testimonials[0].quote}
            </blockquote>
            <figcaption className="mt-6 text-sm text-muted-foreground">
              <span className="font-medium text-card-foreground">{testimonials[0].name}</span>
              {" — "}
              {testimonials[0].destination}
              <br />
              <span className="text-xs leading-relaxed">{testimonials[0].outcome}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="contact" className="bg-primary text-primary-foreground">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-4 py-20 sm:px-6">
          <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Book your free consultation. Bring your questions — and your honesty.
          </h2>
          <p className="max-w-xl text-base leading-7 text-primary-foreground/80">
            No pressure, no fake assurances, no fee for the first conversation. If we can't
            help you reach a genuinely good outcome, we'll say so.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button render={<a href="mailto:hello@hopeconsultants.example" />} size="lg" variant="secondary">
              Email us
            </Button>
            <Button
              render={<a href="tel:+920000000000" />}
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              Call +92 (0) 000 000 0000
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-muted">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Hope Consultants. Study abroad guidance for
            Pakistani students.
          </p>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#services" className="transition-colors hover:text-foreground">
              Services
            </a>
            <a href="#countries" className="transition-colors hover:text-foreground">
              Countries
            </a>
            <a href="#process" className="transition-colors hover:text-foreground">
              Process
            </a>
            <a href="#contact" className="transition-colors hover:text-foreground">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
