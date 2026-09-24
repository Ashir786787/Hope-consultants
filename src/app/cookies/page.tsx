import type { Metadata } from "next";
import { getLegalPage } from "@/lib/data/legal";
import { LegalDocument } from "@/components/legal-document";

const page = getLegalPage("cookies")!;

export const metadata: Metadata = {
  title: "Cookie Notice | Hope Consultants",
  description: "How the Hope Consultants website uses cookies and how you can manage them.",
};

export default function CookiesPage() {
  return <LegalDocument page={page} />;
}