import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost");
const dbName = "forum_ML_RB";

export async function connectDB() {
  await client.connect();
  return client.db(dbName);
}