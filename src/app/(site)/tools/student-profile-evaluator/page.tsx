import type { Metadata } from "next";

import { DarkPageHero } from "@/components/sections/dark-page-hero";
import { ProfileEvaluator } from "@/components/tools/profile-evaluator";
import { getSite } from "@/lib/site";

export const metadata: Metadata = {
  title: "Student Profile Evaluator",
  description:
    "Answer six quick questions and get an honest score out of 10, the study destinations your budget realistically points to, and the next steps that would strengthen your application.",
};

export default async function StudentProfileEvaluatorPage() {
  const { email } = await getSite();

  return (
    <main id="main-content" className="w-full">
      <div className="evaluator-no-print">
        <DarkPageHero
          eyebrow="Assessment"
          title="How strong is your study-abroad profile?"
          lede="Six quick questions, no sign-up. You get an honest score out of 10, the destinations your budget realistically points to, and the next steps that would strengthen your application. Nothing you enter here leaves your browser."
        />
      </div>
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <ProfileEvaluator recipientEmail={email} />
      </section>
    </main>
  );
}
