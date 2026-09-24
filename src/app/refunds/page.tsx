import type { Metadata } from "next";
import { getLegalPage } from "@/lib/data/legal";
import { LegalDocument } from "@/components/legal-document";

const page = getLegalPage("refunds")!;

export const metadata: Metadata = {
  title: "Refund & Fee Policy | Hope Consultants",
  description: "Our fee principle and when fees are or are not refundable.",
};

export default function RefundsPage() {
  return <LegalDocument page={page} />;
}