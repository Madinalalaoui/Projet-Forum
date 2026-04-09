//afficher les users
const { connectDB } = await import("./db.js");

const db = await connectDB();
const users = await db.collection("users").find({}).toArray();
console.log(users);

await db.client.close();