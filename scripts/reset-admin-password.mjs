import nextEnv from "@next/env";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const ADMINS = "adminUsers";
const CHALLENGES = "otpChallenges";
const BCRYPT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 12;

function required(name) {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function argValue(flag) {
  const inline = process.argv.find((arg) => arg.startsWith(`${flag}=`));
  if (inline) {
    const value = inline.slice(flag.length + 1);
    if (value.length === 0) {
      throw new Error(`${flag} needs a value.`);
    }
    return value;
  }
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} needs a value.`);
  }
  return value;
}

async function main() {
  const uri = required("MONGODB_URI");
  const dbName = process.env.MONGODB_DB?.trim() || "hope-consultants";
  const email = (argValue("--email") ?? required("RESET_ADMIN_EMAIL")).toLowerCase();
  const forget = process.argv.includes("--forget");
  const password = forget
    ? null
    : (argValue("--password") ?? required("RESET_ADMIN_PASSWORD"));

  if (password !== null && password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `The new password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    );
  }

  const passwordHash =
    password === null ? null : await bcrypt.hash(password, BCRYPT_ROUNDS);

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
  await client.connect();

  try {
    const db = client.db(dbName);
    const admins = db.collection(ADMINS);

    const existing = await admins.findOne({ email });
    if (!existing) {
      throw new Error(
        `No admin with the email ${email} exists. Nothing was changed.`
      );
    }

    await admins.updateOne(
      { email },
      {
        $set: {
          passwordHash,
          hasCompletedFirstLogin: false,
          firstLoginVerifiedAt: null,
        },
      }
    );

    const cleared = await db
      .collection(CHALLENGES)
      .deleteMany({ adminUserId: existing.id, purpose: "first_login" });

    process.stdout.write(
      `Reset the password for "${existing.email}" (${existing.role}) in database "${dbName}".\n`
    );

    if (forget) {
      process.stdout.write(
        `No password is stored now, so this person chooses their own on the next sign-in.\n`
      );
    } else {
      process.stdout.write(
        `They choose a new password on the next sign-in, because a password reset counts as a password change.\n`
      );
    }

    process.stdout.write(
      `Cleared ${cleared.deletedCount} pending first-login code(s), so no resend cooldown is in the way.\n`
    );
    process.stdout.write(`The password was not printed and was not stored in plain text.\n`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
