import type { Metadata } from "next";
import { getLegalPage } from "@/lib/data/legal";
import { LegalDocument } from "@/components/legal-document";

const page = getLegalPage("privacy")!;

export const metadata: Metadata = {
  title: "Privacy Policy | Hope Consultants",
  description: "How Hope Consultants collects, uses and protects your personal information.",
};

export default function PrivacyPage() {
  return <LegalDocument page={page} />;
}