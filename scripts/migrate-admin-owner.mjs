import nextEnv from "@next/env";
import { MongoClient } from "mongodb";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$/;
const RETENTION_DAYS = 90;

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
    const db = client.db(dbName);
    const admins = db.collection("adminUsers");
    const challenges = db.collection("otpChallenges");

    const backfilled = await admins.updateMany(
      { isOwner: { $exists: false } },
      { $set: { isOwner: false } }
    );
    report("admins given isOwner:false", backfilled.modifiedCount);

    const verifiedBackfill = await admins.updateMany(
      { firstLoginVerifiedAt: { $exists: false } },
      { $set: { firstLoginVerifiedAt: null } }
    );
    report("admins given firstLoginVerifiedAt:null", verifiedBackfill.modifiedCount);

    const ownerEmail = (
      process.env.ADMIN_OWNER_EMAIL?.trim() ||
      process.env.SEED_ADMIN_EMAIL?.trim() ||
      ""
    ).toLowerCase();

    let resolvedOwner = ownerEmail;
    if (!resolvedOwner) {
      const earliest = await admins.find({}, { sort: { createdAt: 1 }, limit: 1 }).toArray();
      resolvedOwner = typeof earliest[0]?.email === "string" ? earliest[0].email : "";
    }

    if (!resolvedOwner) {
      report("owner assigned", "none found, skipped");
    } else {
      const result = await admins.updateOne(
        { email: resolvedOwner },
        { $set: { isOwner: true } }
      );
      report("owner assigned", `${resolvedOwner} (matched ${result.matchedCount})`);
    }

    const owners = await admins.countDocuments({ isOwner: true });
    report("total owners", owners);

    const legacy = await challenges.deleteMany({
      codeHash: { $not: BCRYPT_HASH_PATTERN },
    });
    report("legacy non-bcrypt challenges deleted", legacy.deletedCount);

    const challengeBackfill = await challenges.updateMany(
      { purgeAt: { $exists: false } },
      [
        {
          $set: {
            verifiedAt: { $ifNull: ["$verifiedAt", null] },
            failedAt: { $ifNull: ["$failedAt", null] },
            attemptsUsed: { $ifNull: ["$attemptsUsed", "$attempts"] },
            ip: { $ifNull: ["$ip", null] },
            purgeAt: { $dateAdd: { startDate: "$createdAt", unit: "day", amount: RETENTION_DAYS } },
          },
        },
      ]
    );
    report("challenges given retention deadline", challengeBackfill.modifiedCount);

    await challenges.createIndex({ purgeAt: 1 }, { expireAfterSeconds: 0 });
    report("ttl index on purgeAt", "ensured");

    const remaining = await challenges.countDocuments({});
    report("challenge documents remaining", remaining);

    const adminDocs = await admins.find({}, { projection: { passwordHash: 0 } }).toArray();
    process.stdout.write("admins now stored:\n");
    for (const doc of adminDocs) {
      process.stdout.write(
        `  ${doc.email} | role ${doc.role} | owner ${doc.isOwner} | active ${doc.isActive} | firstLogin ${doc.hasCompletedFirstLogin} | verifiedAt ${doc.firstLoginVerifiedAt}\n`
      );
    }
    process.stdout.write(`retention window: ${RETENTION_DAYS} days\n`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
