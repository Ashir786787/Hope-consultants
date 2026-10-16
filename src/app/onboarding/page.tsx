import { FormWelcome } from "@/components/forms/form-welcome";
import { getFormDefinition } from "@/lib/forms/store";

export const dynamic = "force-dynamic";

export default async function OnboardingWelcomePage() {
  const definition = await getFormDefinition("onboarding");
  return <FormWelcome definition={definition} />;
}
