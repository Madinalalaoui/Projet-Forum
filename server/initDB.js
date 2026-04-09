import { connectDB } from "./db.js";

async function initDB() {
  const db = await connectDB();
  const usersCol = db.collection("users");

  await usersCol.deleteMany({});
  const count = await usersCol.countDocuments();
  if (count > 0) {
    console.log("Utilisateurs initiaux déjà créés !");
    return;
  }

  const initialUsers = [
    { username: "Bob", password: "1234", role: "member" },
    { username: "Alice", password: "admin567", role: "admin" }
  ];
  await usersCol.insertMany(initialUsers);
  console.log("Utilisateurs initiaux créés !");
   await db.client.close();
}

initDB().catch(console.error);