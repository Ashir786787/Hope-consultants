import Link from "next/link";

import { Logo } from "@/components/ui/logo";
import { PlaneMotif } from "@/components/motion/plane-motif";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/ui/social-icons";
import { getSite } from "@/lib/site";

const EXPLORE_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Countries", href: "/countries" },
  { label: "Process", href: "/process" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "Blog", href: "/blog" },
] as const;

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
] as const;

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund & Fee Policy", href: "/refunds" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Cookie Notice", href: "/cookies" },
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
      <h3 className="font-display text-sm font-semibold tracking-[0.18em] text-hope-ember uppercase">
        {title}
      </h3>
      <ul className="flex flex-col gap-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-11 min-w-11 items-center text-sm text-hope-white/70 transition-colors hover:text-hope-ember"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function Footer() {
  const site = await getSite();
  const hasContact =
    Boolean(site.email.trim()) || Boolean(site.phone.trim()) || Boolean(site.whatsapp.trim());
  const tiktok = (site.tiktok ?? "").trim();

  return (
    <footer className="relative isolate overflow-hidden bg-hope-midnight text-hope-white">
      <PlaneMotif className="pointer-events-none absolute -bottom-12 right-[-6%] hidden size-[26rem] opacity-[0.10] lg:block" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col items-start gap-5">
            <Link href="/" className="flex items-center" aria-label="Hope Consultants home">
              <Logo variant="lockup-dark" className="h-14 w-auto" />
            </Link>
            <p className="max-w-xs text-sm leading-6 text-hope-white/70">
              Honest study abroad guidance for Pakistani students — universities, scholarships,
              and student visas across 14 destinations.
            </p>
          </div>
          <FooterColumn title="Explore" links={EXPLORE_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Legal" links={LEGAL_LINKS} />
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-sm font-semibold tracking-[0.18em] text-hope-ember uppercase">
              Contact
            </h3>
            <ul className="flex flex-col gap-1 text-sm text-hope-white/70">
              {site.email.trim() ? (
                <li>
                  <a href={`mailto:${site.email}`} className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-hope-ember">
                    {site.email}
                  </a>
                </li>
              ) : null}
              {site.phone.trim() ? (
                <li>
                  <a href={`tel:${site.phoneHref}`} className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-hope-ember">
                    {site.phone}
                  </a>
                </li>
              ) : null}
              {site.whatsapp.trim() ? (
                <li>
                  <a
                    href={`https://wa.me/${site.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-hope-ember"
                  >
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {!hasContact ? (
                <li>
                  <Link href="/contact" className="inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-hope-ember">
                    Contact page
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-hope-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-hope-white/70">
            © {new Date().getFullYear()} Hope Consultants. Study abroad guidance for Pakistani
            students.
          </p>
          <nav aria-label="Social media">
            <ul className="flex items-center gap-2">
              <li>
                <a
                  href="https://www.instagram.com/hopeconsultants.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex size-11 items-center justify-center rounded-full border border-hope-white/15 text-hope-white/70 transition-colors hover:border-hope-ember/50 hover:text-hope-ember"
                >
                  <InstagramIcon className="size-5" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61594400921050"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex size-11 items-center justify-center rounded-full border border-hope-white/15 text-hope-white/70 transition-colors hover:border-hope-ember/50 hover:text-hope-ember"
                >
                  <FacebookIcon className="size-5" />
                </a>
              </li>
              {tiktok ? (
                <li>
                  <a
                    href={tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="flex size-11 items-center justify-center rounded-full border border-hope-white/15 text-hope-white/70 transition-colors hover:border-hope-ember/50 hover:text-hope-ember"
                  >
                    <TikTokIcon className="size-5" />
                  </a>
                </li>
              ) : (
                <li>
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    aria-label="TikTok (coming soon)"
                    className="flex size-11 cursor-not-allowed items-center justify-center rounded-full border border-hope-white/15 text-hope-white/50 transition-colors disabled:text-hope-white/50 disabled:hover:border-hope-white/15 disabled:hover:text-hope-white/50"
                  >
                    <TikTokIcon className="size-5" />
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
