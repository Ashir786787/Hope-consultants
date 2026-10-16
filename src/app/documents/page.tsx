import { FormWelcome } from "@/components/forms/form-welcome";
import { getFormDefinition } from "@/lib/forms/store";

export const dynamic = "force-dynamic";

export default async function DocumentsWelcomePage() {
  const definition = await getFormDefinition("documents");
  return <FormWelcome definition={definition} />;
}
