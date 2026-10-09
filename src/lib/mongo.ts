import { MongoClient, type Collection, type Document, type Filter, type FindOptions, type UpdateFilter } from "mongodb";

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
  const instance = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
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

async function collection(name: string): Promise<Collection<Document>> {
  return (await client()).db(MONGO_DB).collection(name);
}

function withoutMongoId(options?: FindOptions): FindOptions {
  return { ...options, projection: { ...(options?.projection ?? {}), _id: 0 } };
}

export async function mongoFindOne<T>(
  name: string,
  filter: Filter<Document>
): Promise<T | null> {
  const doc = await (await collection(name)).findOne(filter, withoutMongoId());
  return (doc as T | undefined) ?? null;
}

export async function mongoFind<T>(
  name: string,
  filter: Filter<Document>,
  options?: FindOptions
): Promise<T[]> {
  return (await collection(name))
    .find(filter, withoutMongoId(options))
    .toArray() as Promise<T[]>;
}

export async function mongoInsertOne(name: string, doc: Document): Promise<void> {
  await (await collection(name)).insertOne(doc);
}

export async function mongoUpdateOne(
  name: string,
  filter: Filter<Document>,
  update: UpdateFilter<Document>,
  options?: { upsert?: boolean }
): Promise<void> {
  await (await collection(name)).updateOne(filter, update, { upsert: options?.upsert ?? false });
}

export async function mongoDeleteOne(
  name: string,
  filter: Filter<Document>
): Promise<number> {
  const result = await (await collection(name)).deleteOne(filter);
  return result.deletedCount;
}

export async function mongoCount(name: string, filter: Filter<Document>): Promise<number> {
  return (await collection(name)).countDocuments(filter);
}

export async function mongoEnsureIndex(
  name: string,
  keys: Document,
  options?: { unique?: boolean; expireAfterSeconds?: number }
): Promise<void> {
  await (await collection(name)).createIndex(keys, options);
}