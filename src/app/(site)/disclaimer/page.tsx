import type { Metadata } from "next";
import { getLegalPage } from "@/lib/data/legal";
import { LegalDocument } from "@/components/legal-document";

const page = getLegalPage("disclaimer")!;

export const metadata: Metadata = {
  title: "Disclaimer | Hope Consultants",
  description: "The limits of the general information published on the Hope Consultants website.",
};

export default function DisclaimerPage() {
  return <LegalDocument page={page} />;
}