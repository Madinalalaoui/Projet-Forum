import { MongoClient } from "mongodb";

const uri = "mongodb://localhost"; 
export const client = new MongoClient(uri);

const dbName = "forum";

export async function connectDB() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db(dbName);
}