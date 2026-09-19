import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { ScrollProgress } from "@/components/scroll-progress";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://www.hopeconsultants.pk";

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
        <SmoothScroll>
          <ScrollProgress />
          <Navbar />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}