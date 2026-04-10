import express from "express";
import cors from "cors";
import { connectDB } from "./database.js";
import { initDB } from "./init.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/signup", async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username et mot de passe requis" });
  }

  try {
    await initDB({
      username,
      password,
      firstName,
      lastName,
      role: "member",
    });

    res.status(201).json({ message: "Utilisateur créé" });
  } catch (error) {
    if (error.message === "Username is already used") {
      return res.status(409).json({ message: "Nom d'utilisateur déjà utilisé" });
    }

    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const db = await connectDB();
  const user = await db.collection("users").findOne({ username, password });

  if (!user) {
    return res.status(401).json({ message: "Utilisateur ou mot de passe incorrect" });
  }

  if (user.status === "pending") {
    return res.status(403).json({ message: "Votre inscription est en attente de validation par un administrateur." });
  }

  res.json({ username: user.username, role: user.role, firstName: user.firstName, lastName: user.lastName });
});

app.get("/users/pending", async (_req, res) => {
  try {
    const db = await connectDB();
    const users = await db.collection("users").find({ status: "pending" }).toArray();
    res.json({ users: users.map(u => ({ username: u.username, firstName: u.firstName, lastName: u.lastName, dateCreation: u.dateCreation })) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.put("/users/:username/validate", async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("users").updateOne(
      { username: req.params.username, status: "pending" },
      { $set: { status: "validated" } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé ou déjà validé" });
    }
    res.json({ message: "Utilisateur validé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.put("/users/:username/reject", async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("users").deleteOne({ username: req.params.username, status: "pending" });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé ou déjà traité" });
    }
    res.json({ message: "Utilisateur rejeté" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.get("/users", async (_req, res) => {
  try {
    const db = await connectDB();
    const users = await db.collection("users").find({ status: "validated" }).toArray();
    res.json({ users: users.map(u => ({ username: u.username, firstName: u.firstName, lastName: u.lastName, role: u.role })) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.get("/users/:username", async (req, res) => {
  try {
    const db = await connectDB();
    const user = await db.collection("users").findOne({ username: req.params.username, status: { $ne: "pending" } });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ username: user.username, firstName: user.firstName, lastName: user.lastName, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.put("/users/:username/role", async (req, res) => {
  const { role, requester } = req.body;

  if (!["admin", "member"].includes(role)) {
    return res.status(400).json({ message: "Rôle invalide" });
  }
  if (req.params.username === requester) {
    return res.status(403).json({ message: "Impossible de modifier son propre rôle" });
  }

  try {
    const db = await connectDB();
    const result = await db.collection("users").updateOne(
      { username: req.params.username },
      { $set: { role } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ message: "Rôle mis à jour" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.get("/messages", async (_req, res) => {
  try {
    const db = await connectDB();
    const doc = await db.collection("forum_data").findOne({ key: "messages" });
    res.json({ messages: doc?.value || [] });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.put("/messages", async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ message: "Format de messages invalide" });
  }

  try {
    const db = await connectDB();
    await db.collection("forum_data").updateOne(
      { key: "messages" },
      {
        $set: {
          key: "messages",
          value: messages,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    res.json({ message: "Messages sauvegardés" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.listen(3001, () => console.log("Serveur login démarré sur http://localhost:3001"));