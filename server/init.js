import bcrypt from "bcryptjs";
import { connectDB } from "./database.js";

async function initDB({ username, password, role, firstName, lastName, status = "pending" }) {
  const database = await connectDB();
  const collection = database.collection('users');

  const existingUser = await collection.findOne({ username });
  if (existingUser) {
    throw new Error('Username is already used');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await collection.insertOne({
    username,
    password: hashedPassword,
    role,
    status,
    firstName,
    lastName,
    dateCreation: new Date(),
  });

  return result;
}

export { initDB };
