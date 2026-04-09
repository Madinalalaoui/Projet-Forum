import { MongoClient } from "mongodb";

const uri = "mongodb://localhost"; 
export const client = new MongoClient(uri);

const dbName = "maBase";

export async function connectDB() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db(dbName);
}