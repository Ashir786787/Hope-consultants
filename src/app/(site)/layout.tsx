import type { ReactNode } from "react";

import { Cursor } from "@/components/motion/cursor";
import { Preloader } from "@/components/motion/preloader";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { ScrollProgress } from "@/components/scroll-progress";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const SITE_URL = "https://www.hopeconsultants.pk";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Hope Consultants",
  url: new URL(SITE_URL).toString(),
  email: "hopeconsultants.pk@gmail.com",
  description:
    "Honest study-abroad guidance for Pakistani students — university admissions, scholarships, and student visas across 14 study destinations.",
};

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-hope-ember focus:px-5 focus:py-3 focus:font-semibold focus:text-hope-midnight"
      >
        Skip to content
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Preloader />
      <SmoothScroll>
        <ScrollProgress />
        <Navbar />
        {children}
        <Footer />
      </SmoothScroll>
      <Cursor />
    </>
  );
}
