import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI;
const MONGO_DB = process.env.MONGODB_DB || "hope-consultants";

type MongoGlobals = {
  __hopeMongoClient?: MongoClient;
};

export function mongoConfigured(): boolean {
  return Boolean(MONGO_URI && MONGO_URI.trim().length > 0);
}

async function client(): Promise<MongoClient> {
  if (!MONGO_URI) {
    throw new Error("MONGODB_URI is not set.");
  }
  const globals = globalThis as unknown as MongoGlobals;
  if (globals.__hopeMongoClient) return globals.__hopeMongoClient;
  const instance = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  await instance.connect();
  globals.__hopeMongoClient = instance;
  return instance;
}

export async function mongoRead(collection: string): Promise<unknown | null> {
  const doc = await (await client()).db(MONGO_DB).collection("content").findOne({ key: collection });
  return doc?.data ?? null;
}

export async function mongoWrite(collection: string, value: unknown): Promise<void> {
  await (await client())
    .db(MONGO_DB)
    .collection("content")
    .updateOne({ key: collection }, { $set: { data: value } }, { upsert: true });
}

export async function mongoPing(): Promise<boolean> {
  try {
    await (await client()).db(MONGO_DB).command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}