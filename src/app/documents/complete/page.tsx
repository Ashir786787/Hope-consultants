import type { Metadata } from "next";

import { FormComplete } from "@/components/forms/form-complete";
import { getFormDefinition } from "@/lib/forms/store";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function DocumentsCompletePage() {
  const definition = await getFormDefinition("documents");
  return <FormComplete definition={definition} />;
}
