import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/shared/lenis-provider";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hope Consultants | Study Abroad for Pakistani Students",
    template: "%s | Hope Consultants",
  },
  description:
    "Hope Consultants guides Pakistani students through university admissions, scholarships, and student visas across 14 study destinations.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} scroll-smooth`}>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
