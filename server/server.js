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

  res.json({ username: user.username, role: user.role });
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