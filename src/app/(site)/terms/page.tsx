import type { Metadata } from "next";
import { getLegalPage } from "@/lib/data/legal";
import { LegalDocument } from "@/components/legal-document";

const page = getLegalPage("terms")!;

export const metadata: Metadata = {
  title: "Terms of Service | Hope Consultants",
  description: "The terms that govern engagement with Hope Consultants' services.",
};

export default function TermsPage() {
  return <LegalDocument page={page} />;
}