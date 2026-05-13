import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { connectDB } from "./database.js";
import { initDB } from "./init.js";

const app = express();
app.use(cors());
app.use(express.json());

function withDB(res, fn) {
  return connectDB()
    .then(fn)
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    });
}

app.post("/signup", async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username et mot de passe requis" });
  }

  try {
    const db = await connectDB();
    const isFirst = (await db.collection("users").countDocuments()) === 0;

    await initDB({
      username,
      password,
      firstName,
      lastName,
      role: isFirst ? "admin" : "member",
      status: isFirst ? "validated" : "pending",
    });

    res.status(201).json({ message: "Utilisateur créé" });
  } catch (error) {
    if (error.message === "Username is already used") {
      return res.status(409).json({ message: "Nom d'utilisateur déjà utilisé" });
    }
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  return withDB(res, async (db) => {
    const user = await db.collection("users").findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Utilisateur ou mot de passe incorrect" });
    }

    if (user.status === "pending") {
      return res.status(403).json({ message: "Votre inscription est en attente de validation par un administrateur." });
    }

    res.json({ username: user.username, role: user.role, firstName: user.firstName, lastName: user.lastName });
  });
});

app.get("/users/pending", (_req, res) => {
  return withDB(res, async (db) => {
    const users = await db.collection("users").find({ status: "pending" }).toArray();
    res.json({ users: users.map(u => ({ username: u.username, firstName: u.firstName, lastName: u.lastName, dateCreation: u.dateCreation })) });
  });
});

app.put("/users/:username/validate", (req, res) => {
  return withDB(res, async (db) => {
    const result = await db.collection("users").updateOne(
      { username: req.params.username, status: "pending" },
      { $set: { status: "validated" } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé ou déjà validé" });
    }
    res.json({ message: "Utilisateur validé" });
  });
});

app.put("/users/:username/reject", (req, res) => {
  return withDB(res, async (db) => {
    const result = await db.collection("users").deleteOne({ username: req.params.username, status: "pending" });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé ou déjà traité" });
    }
    res.json({ message: "Utilisateur rejeté" });
  });
});

app.get("/users", (_req, res) => {
  return withDB(res, async (db) => {
    const users = await db.collection("users").find({ status: "validated" }).toArray();
    res.json({ users: users.map(u => ({ username: u.username, firstName: u.firstName, lastName: u.lastName, role: u.role })) });
  });
});

app.get("/users/:username", (req, res) => {
  return withDB(res, async (db) => {
    const user = await db.collection("users").findOne({ username: req.params.username, status: { $ne: "pending" } });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ username: user.username, firstName: user.firstName, lastName: user.lastName, role: user.role });
  });
});

app.put("/users/:username/role", (req, res) => {
  const { role, requester } = req.body;

  if (!["admin", "member"].includes(role)) {
    return res.status(400).json({ message: "Rôle invalide" });
  }
  if (req.params.username === requester) {
    return res.status(403).json({ message: "Impossible de modifier son propre rôle" });
  }

  return withDB(res, async (db) => {
    const result = await db.collection("users").updateOne(
      { username: req.params.username },
      { $set: { role } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ message: "Rôle mis à jour" });
  });
});

app.get("/messages", (_req, res) => {
  return withDB(res, async (db) => {
    const doc = await db.collection("posts").findOne({ key: "messages" });
    res.json({ messages: doc?.value || [] });
  });
});

app.put("/messages", (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ message: "Format de messages invalide" });
  }

  return withDB(res, async (db) => {
    await db.collection("posts").updateOne(
      { key: "messages" },
      { $set: { key: "messages", value: messages, updatedAt: new Date() } },
      { upsert: true }
    );
    res.json({ message: "Messages sauvegardés" });
  });
});

async function seed() {
  const db = await connectDB();

  const count = await db.collection("users").countDocuments();

  if (count === 0) {
    console.log("Base vide : peuplement initial");

    await initDB({
      username: "madina",
      password: "Web123;",
      role: "admin",
      firstName: "Madina",
      lastName: "LALAOUI",
      status: "validated",
    });

    await initDB({
      username: "jade",
      password: "Web789;",
      role: "member",
      firstName: "Jade",
      lastName: "DUPONT",
      status: "validated",
    });
  } else { 
    console.log("Base déjà peuplée : rien à faire");
  }
}

seed();

app.listen(3001, () => {
  console.log("Serveur démarré sur http://localhost:3001");
});
