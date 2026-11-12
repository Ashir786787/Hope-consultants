import nextEnv from "@next/env";
import { MongoClient } from "mongodb";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const FORM_DEFINITION_KEY = "form-definition:onboarding";
const FIELD_KEY = "contactNumber";

function report(label, value) {
  process.stdout.write(`${label}: ${value}\n`);
}

async function main() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error("Missing required environment variable: MONGODB_URI");
  }

  const dbName = process.env.MONGODB_DB?.trim() || "hope-consultants";
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  await client.connect();

  try {
    const content = client.db(dbName).collection("content");
    const stored = await content.findOne({ key: FORM_DEFINITION_KEY });

    if (!stored) {
      report("stored onboarding form definition", "none — the seed writes itself on next load");
      return;
    }

    const data = stored.data ?? {};
    const sections = Array.isArray(data.sections) ? data.sections : [];
    const section = sections.find((entry) =>
      Array.isArray(entry?.fields) && entry.fields.some((field) => field?.key === FIELD_KEY)
    );

    if (!section) {
      report(`${FIELD_KEY} field`, "not found — nothing changed");
      return;
    }

    const field = section.fields.find((entry) => entry?.key === FIELD_KEY);

    if (field.kind === "phone") {
      report(`${FIELD_KEY} kind`, "already phone — nothing to do");
      return;
    }

    field.kind = "phone";
    delete field.minDigits;
    await content.updateOne({ key: FORM_DEFINITION_KEY }, { $set: { data } });
    report(`${FIELD_KEY} kind changed to phone`, "yes");
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
