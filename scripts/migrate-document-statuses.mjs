import nextEnv from "@next/env";
import { MongoClient } from "mongodb";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const STATUS_MAP = {
  Contacted: "Checked",
  Converted: "Downloaded",
  Lost: "Information Missing",
};

const LEGACY_STATUSES = Object.keys(STATUS_MAP);

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
    const submissions = client.db(dbName).collection("documentSubmissions");

    for (const [from, to] of Object.entries(STATUS_MAP)) {
      const result = await submissions.updateMany({ status: from }, { $set: { status: to } });
      report(`${from} -> ${to}`, result.modifiedCount);
    }

    const remaining = await submissions.countDocuments({
      status: { $in: LEGACY_STATUSES },
    });
    report("rows still on old names", remaining);

    const total = await submissions.countDocuments({});
    report("document submissions total", total);

    const byStatus = await submissions.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).toArray();
    process.stdout.write("statuses now stored:\n");
    for (const row of byStatus) {
      process.stdout.write(`  ${row._id}: ${row.count}\n`);
    }
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
