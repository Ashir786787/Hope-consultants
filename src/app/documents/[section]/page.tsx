import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { FormSectionScreen } from "@/components/forms/form-section-screen";
import { toDraftAnswers } from "@/lib/forms/answers";
import { readFormDraftToken, loadFormDraft } from "@/lib/forms/draft-store";
import { getFormDefinition } from "@/lib/forms/store";
import type { FormDefinition } from "@/lib/forms/types";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

async function loadInitialAnswers(definition: FormDefinition) {
  try {
    const token = await readFormDraftToken(definition.draftCookieName);
    const stored = token ? await loadFormDraft(definition.draftCollection, token).catch(() => null) : null;
    return toDraftAnswers(definition, stored?.answers);
  } catch {
    return toDraftAnswers(definition, null);
  }
}

export default async function DocumentsSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: slug } = await params;
  const definition = await getFormDefinition("documents");
  const section = definition.sections.find((entry) => entry.slug === slug);
  if (!section) notFound();

  const initialAnswers = await loadInitialAnswers(definition);

  return (
    <FormSectionScreen
      definition={definition}
      sectionKey={section.key}
      initialAnswers={initialAnswers}
      draftEndpoint="/api/documents/draft"
      submitEndpoint="/api/documents"
      completeHref="/documents/complete"
    />
  );
}
