import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "Student Onboarding Form",
  description: "Hope Consultants student onboarding form.",
  robots: { index: false, follow: false, nocache: true },
};

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-hope-white text-hope-midnight">
      <header className="border-b border-hope-midnight/10 bg-hope-white">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Logo variant="lockup-light" priority className="h-10 w-auto shrink-0" />
          <p className="text-right text-sm font-semibold text-hope-fog">Student onboarding form</p>
        </div>
      </header>
      <main id="main-content" className="mx-auto w-full max-w-3xl flex-1 px-5 py-8 sm:px-8 sm:py-12">
        {children}
      </main>
      <footer className="border-t border-hope-midnight/10 bg-hope-white">
        <div className="mx-auto w-full max-w-3xl px-5 py-6 text-sm text-hope-fog sm:px-8">
          HOPE CONSULTANTS
        </div>
      </footer>
    </div>
  );
}