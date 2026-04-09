import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const db = await connectDB();
  const user = await db.collection("users").findOne({ username, password });

  if (!user) {
    return res.status(401).json({ message: "Utilisateur ou mot de passe incorrect" });
  }

  res.json({ username: user.username, role: user.role });
});

app.listen(3001, () => console.log("Serveur login démarré sur http://localhost:3001"));