import Link from "next/link";

import { Logo, Wordmark } from "@/components/ui/logo";

const EXPLORE_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Countries", href: "/countries" },
  { label: "Process", href: "/process" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "Resources", href: "/resources" },
] as const;

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
] as const;

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-xs font-semibold tracking-[0.18em] text-hope-ember uppercase">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-hope-fog transition-colors hover:text-hope-ember"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-hope-midnight text-hope-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col items-start gap-5">
            <Link href="/" className="flex items-center gap-2" aria-label="Hope Consultants home">
              <Logo variant="mark" tone="dark" />
              <Wordmark tone="dark" />
            </Link>
            <p className="max-w-xs text-sm leading-6 text-hope-fog">
              Honest study abroad guidance for Pakistani students — universities,
              scholarships, and student visas across 14 destinations.
            </p>
          </div>
          <FooterColumn title="Explore" links={EXPLORE_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-xs font-semibold tracking-[0.18em] text-hope-ember uppercase">
              Visit
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-hope-fog">
              <li>
                <a
                  href="mailto:hello@hopeconsultants.example"
                  className="transition-colors hover:text-hope-ember"
                >
                  hello@hopeconsultants.example
                </a>
              </li>
              <li>
                <a
                  href="tel:+920000000000"
                  className="transition-colors hover:text-hope-ember"
                >
                  +92 (0) 000 000 0000
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-hope-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-hope-fog">
            © {new Date().getFullYear()} Hope Consultants. Study abroad guidance for
            Pakistani students.
          </p>
        </div>
      </div>
    </footer>
  );
}