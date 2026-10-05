import nextEnv from "@next/env";
import { MongoClient } from "mongodb";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const RETIRED_COLLECTIONS = ["resources"];
const KEEP = new Set([
  "services",
  "countries",
  "testimonials",
  "scholarships",
  "process",
  "blog",
  "site",
]);

function report(label, value) {
  process.stdout.write(`${label}: ${value}\n`);
}

async function main() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    report("mongo", "not configured, nothing to clean");
    return;
  }

  const dbName = process.env.MONGODB_DB?.trim() || "hope-consultants";
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  await client.connect();

  try {
    const db = client.db(dbName);
    const content = db.collection("content");

    const keys = await content.distinct("key");
    report("content keys found", keys.length);

    for (const key of keys) {
      if (KEEP.has(key)) continue;
      if (!RETIRED_COLLECTIONS.includes(key)) {
        report("skipped unknown key", key);
        continue;
      }
      const doc = await content.findOne({ key }, { projection: { data: 1 } });
      const size = Array.isArray(doc?.data) ? `${doc.data.length} entries` : typeof doc?.data;
      const removed = await content.deleteOne({ key });
      report(`deleted retired collection`, `${key} (${size}) matched=${removed.deletedCount}`);
    }

    const remaining = await content.distinct("key");
    report("content keys remaining", remaining.sort().join(", "));

    const orphans = remaining.filter((key) => !KEEP.has(key));
    report("unexpected keys", orphans.length ? orphans.join(", ") : "none");
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
