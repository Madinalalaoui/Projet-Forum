import bcrypt from "bcryptjs";
import { connectDB } from "./database.js";

// Crée un utilisateur en base après avoir haché son mot de passe.
// Utilisée à l'inscription (signup) et au peuplement initial (seed).
// Lève une erreur si le nom d'utilisateur est déjà pris.
async function initDB({ username, password, role, firstName, lastName, status = "pending" }) {
  const database = await connectDB();
  const collection = database.collection('users');

  // Vérifie l'unicité du nom d'utilisateur avant insertion
  const existingUser = await collection.findOne({ username });
  if (existingUser) {
    throw new Error('Username is already used');
  }

  // Hachage du mot de passe avec bcrypt (facteur de coût : 10 tours)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insertion du document utilisateur en base
  const result = await collection.insertOne({
    username,
    password: hashedPassword,
    role,       // "admin" ou "member"
    status,     // "validated" ou "pending"
    firstName,
    lastName,
    dateCreation: new Date(),
  });

  return result;
}

export { initDB };
