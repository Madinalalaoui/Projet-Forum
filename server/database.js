import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost");
const dbName = "forum";

export async function connectDB() {
  await client.connect();
  return client.db(dbName);
}