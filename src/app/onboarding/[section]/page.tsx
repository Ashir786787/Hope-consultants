import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { FormSectionScreen } from "@/components/forms/form-section-screen";
import { toDraftAnswers } from "@/lib/forms/answers";
import { getFormDefinition } from "@/lib/forms/store";
import { readDraftToken } from "@/lib/onboarding/draft-cookie";
import { loadDraft } from "@/lib/onboarding/submission";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

async function loadInitialAnswers(definition: Awaited<ReturnType<typeof getFormDefinition>>) {
  try {
    const token = await readDraftToken();
    const stored = token ? await loadDraft(token).catch(() => null) : null;
    return toDraftAnswers(definition, stored?.answers);
  } catch {
    return toDraftAnswers(definition, null);
  }
}

export default async function OnboardingSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: slug } = await params;
  const definition = await getFormDefinition("onboarding");
  const section = definition.sections.find((entry) => entry.slug === slug);
  if (!section) notFound();

  const initialAnswers = await loadInitialAnswers(definition);

  return (
    <FormSectionScreen
      definition={definition}
      sectionKey={section.key}
      initialAnswers={initialAnswers}
      draftEndpoint="/api/onboarding/draft"
      submitEndpoint="/api/onboarding"
      completeHref="/onboarding/complete"
    />
  );
}
