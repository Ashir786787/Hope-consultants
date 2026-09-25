import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { ScrollProgress } from "@/components/scroll-progress";
import { Preloader } from "@/components/motion/preloader";
import { Cursor } from "@/components/motion/cursor";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://www.hopeconsultants.pk";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Hope Consultants",
  url: new URL(SITE_URL).toString(),
  email: "hello@hopeconsultants.example",
  description:
    "Honest study-abroad guidance for Pakistani students — university admissions, scholarships, and student visas across 14 study destinations.",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hope Consultants | Study Abroad for Pakistani Students",
    template: "%s | Hope Consultants",
  },
  description:
    "Hope Consultants guides Pakistani students through university admissions, scholarships, and student visas across 14 study destinations.",
  openGraph: {
    title: "Hope Consultants | Study Abroad for Pakistani Students",
    description:
      "Honest study-abroad guidance for Pakistani students — university admissions, scholarships, and student visas across 14 destinations.",
    url: SITE_URL,
    siteName: "Hope Consultants",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hope Consultants | Study Abroad for Pakistani Students",
    description:
      "Honest study-abroad guidance for Pakistani students — university admissions, scholarships, and student visas across 14 destinations.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
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
      </body>
    </html>
  );
}