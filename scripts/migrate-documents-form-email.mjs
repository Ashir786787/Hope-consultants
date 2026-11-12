import nextEnv from "@next/env";
import { MongoClient } from "mongodb";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const FORM_DEFINITION_KEY = "form-definition:documents";
const SECTION_KEY = "application-details";
const FULL_NAME_KEY = "fullName";
const EMAIL_KEY = "email";

const EMAIL_FIELD = {
  key: "email",
  label: "Email address",
  kind: "email",
  required: true,
  requiredMessage: "Email address is required.",
  invalidMessage: "That email address does not look right.",
};

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
      report("stored documents form definition", "none — the seed writes itself on next load");
      return;
    }

    const data = stored.data ?? {};
    const sections = Array.isArray(data.sections) ? data.sections : [];
    const section = sections.find((entry) => entry?.key === SECTION_KEY);

    if (!section) {
      report(`${SECTION_KEY} section`, "not found — nothing changed");
      return;
    }

    const fields = Array.isArray(section.fields) ? section.fields : [];
    const emailFields = fields.filter((field) => field?.key === EMAIL_KEY);
    const emailField = emailFields[0] ?? EMAIL_FIELD;
    const rest = fields.filter((field) => field?.key !== EMAIL_KEY);
    const fullNameRestIndex = rest.findIndex((field) => field?.key === FULL_NAME_KEY);
    const insertAt = fullNameRestIndex === -1 ? rest.length : fullNameRestIndex + 1;
    const nextFields = [...rest.slice(0, insertAt), emailField, ...rest.slice(insertAt)];

    const nextKeys = nextFields.map((field) => field?.key).join(",");
    const currentKeys = fields.map((field) => field?.key).join(",");

    if (nextKeys === currentKeys && emailFields.length === 1) {
      report("email field", `already present right after ${FULL_NAME_KEY} — nothing to do`);
      return;
    }

    section.fields = nextFields;
    await content.updateOne({ key: FORM_DEFINITION_KEY }, { $set: { data } });
    report("email field placed after " + FULL_NAME_KEY, "yes");
    report("new field order", nextKeys);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
