import { MongoClient } from "mongodb";

// Connexion à MongoDB en local (instance tournant sur la même machine)
const client = new MongoClient("mongodb://localhost");

// Nom de la base de données — initiales Madina Lalaoui + Rasheequa Bellot
const dbName = "forum_ML_RB";

// Ouvre (ou réutilise) la connexion et retourne l'objet base de données
export async function connectDB() {
  await client.connect();
  return client.db(dbName);
}
