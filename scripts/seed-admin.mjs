import nextEnv from "@next/env";
import { randomUUID } from "node:crypto";
import { MongoClient } from "mongodb";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const COLLECTION = "adminUsers";

function required(name) {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

async function main() {
  const uri = required("MONGODB_URI");
  const dbName = process.env.MONGODB_DB?.trim() || "hope-consultants";
  const name = required("SEED_ADMIN_NAME");
  const email = required("SEED_ADMIN_EMAIL").toLowerCase();

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
  await client.connect();

  try {
    const admins = client.db(dbName).collection(COLLECTION);
    await admins.createIndex({ email: 1 }, { unique: true });

    const existing = await admins.findOne({ email });
    if (existing) {
      throw new Error(
        `An admin with the email ${email} already exists. Nothing was changed.`
      );
    }

    const now = new Date().toISOString();

    await admins.insertOne({
      id: randomUUID(),
      name,
      email,
      passwordHash: null,
      role: "Administrator",
      hasCompletedFirstLogin: false,
      isActive: true,
      createdAt: now,
      lastLoginAt: null,
      isOwner: false,
      firstLoginVerifiedAt: null,
      sessionsValidAfter: null,
    });

    process.stdout.write(
      `Created admin "${name}" <${email}> in database "${dbName}".\n`
    );
    process.stdout.write(
      `No default password was set. On their first sign-in this person chooses their own password, and a one-time code is emailed to ${email} to confirm it is really them.\n`
    );
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
