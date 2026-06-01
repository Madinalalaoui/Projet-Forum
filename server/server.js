import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { connectDB } from "./database.js";
import { initDB } from "./init.js";

const app = express();
app.use(cors());          // Autorise les requêtes cross-origin depuis le client React
app.use(express.json());  // Parse automatiquement le body JSON des requêtes entrantes

// Utilitaire : connecte à la BDD, exécute fn(db), et gère les erreurs serveur centralement.
// Évite de répéter le bloc try/catch dans chaque route.
function withDB(res, fn) {
  return connectDB()
    .then(fn)
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    });
}

// ─── ROUTES UTILISATEURS ────────────────────────────────────────────────────

// POST /signup — Crée un nouveau compte utilisateur
// Le premier compte créé devient automatiquement admin et est validé d'emblée.
// Les suivants sont en statut "pending" jusqu'à validation par un admin.
app.post("/signup", async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username et mot de passe requis" });
  }

  try {
    const db = await connectDB();
    // Détecte si la base est vide pour accorder le rôle admin au premier inscrit
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

// POST /login — Authentifie un utilisateur
// Vérifie le mot de passe avec bcrypt.compare (comparaison avec le hash en base).
// Refuse la connexion si le compte est encore en attente de validation.
// Renvoie les données utilisateur ; la session est ensuite gérée côté client (localStorage).
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  return withDB(res, async (db) => {
    const user = await db.collection("users").findOne({ username });

    // bcrypt.compare compare le mot de passe en clair avec le hash stocké en base
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Utilisateur ou mot de passe incorrect" });
    }

    // Bloque la connexion si le compte n'a pas encore été validé par un admin
    if (user.status === "pending") {
      return res.status(403).json({ message: "Votre inscription est en attente de validation par un administrateur." });
    }

    // Renvoie uniquement les champs nécessaires au client (pas le mot de passe hashé)
    res.json({ username: user.username, role: user.role, firstName: user.firstName, lastName: user.lastName });
  });
});

// GET /users/pending — Liste les comptes en attente de validation (usage admin)
// Doit être déclaré avant GET /users/:username pour ne pas être capturé par ce paramètre.
app.get("/users/pending", (_req, res) => {
  return withDB(res, async (db) => {
    const users = await db.collection("users").find({ status: "pending" }).toArray();
    res.json({ users: users.map(u => ({ username: u.username, firstName: u.firstName, lastName: u.lastName, dateCreation: u.dateCreation })) });
  });
});

// PUT /users/:username/validate — Passe le statut d'un compte de "pending" à "validated"
// Seuls les comptes effectivement en attente sont ciblés par le filtre.
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

// PUT /users/:username/reject — Supprime un compte en attente (refus d'inscription)
app.put("/users/:username/reject", (req, res) => {
  return withDB(res, async (db) => {
    const result = await db.collection("users").deleteOne({ username: req.params.username, status: "pending" });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé ou déjà traité" });
    }
    res.json({ message: "Utilisateur rejeté" });
  });
});

// GET /users — Retourne la liste de tous les utilisateurs validés
// Exclut les champs sensibles comme le mot de passe hashé.
app.get("/users", (_req, res) => {
  return withDB(res, async (db) => {
    const users = await db.collection("users").find({ status: "validated" }).toArray();
    res.json({ users: users.map(u => ({ username: u.username, firstName: u.firstName, lastName: u.lastName, role: u.role })) });
  });
});

// GET /users/:username — Retourne le profil d'un utilisateur précis
// Exclut les comptes en attente ($ne : "pending") pour éviter leur exposition publique.
app.get("/users/:username", (req, res) => {
  return withDB(res, async (db) => {
    const user = await db.collection("users").findOne({ username: req.params.username, status: { $ne: "pending" } });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ username: user.username, firstName: user.firstName, lastName: user.lastName, role: user.role });
  });
});

// PUT /users/:username/role — Modifie le rôle d'un utilisateur (admin ↔ member)
// Un utilisateur ne peut pas modifier son propre rôle (vérification via le champ "requester").
app.put("/users/:username/role", (req, res) => {
  const { role, requester } = req.body;

  // Valide que le rôle demandé est l'un des deux valeurs acceptées
  if (!["admin", "member"].includes(role)) {
    return res.status(400).json({ message: "Rôle invalide" });
  }
  // Empêche un admin de modifier son propre rôle (se rétograder accidentellement)
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

// ─── ROUTES MESSAGES ────────────────────────────────────────────────────────

// GET /messages — Retourne tous les messages du forum
// Les messages sont stockés dans un unique document MongoDB de la collection "posts",
// sous la forme { key: "messages", value: [...] } pour conserver la hiérarchie imbriquée
// (messages + réponses récursives) sans avoir besoin de jointures.
app.get("/messages", (_req, res) => {
  return withDB(res, async (db) => {
    const doc = await db.collection("posts").findOne({ key: "messages" });
    // Retourne un tableau vide si aucun message n'existe encore
    res.json({ messages: doc?.value || [] });
  });
});

// PUT /messages — Sauvegarde le tableau complet des messages en base
// Le client envoie l'intégralité du tableau à jour (ajout, suppression, réponse, like).
// upsert: true crée le document s'il n'existe pas encore.
app.put("/messages", (req, res) => {
  const { messages } = req.body;

  // Validation : le corps doit contenir un tableau
  if (!Array.isArray(messages)) {
    return res.status(400).json({ message: "Format de messages invalide" });
  }

  return withDB(res, async (db) => {
    // updateOne avec upsert remplace la valeur existante ou crée le document
    await db.collection("posts").updateOne(
      { key: "messages" },
      { $set: { key: "messages", value: messages, updatedAt: new Date() } },
      { upsert: true }
    );
    res.json({ message: "Messages sauvegardés" });
  });
});

// ─── PEUPLEMENT INITIAL ─────────────────────────────────────────────────────

// Vérifie au démarrage si la base est vide et la peuple si nécessaire.
// Garantit qu'il existe toujours au moins un compte admin opérationnel.
async function seed() {
  const db = await connectDB();

  const count = await db.collection("users").countDocuments();

  if (count === 0) {
    console.log("Base vide : peuplement initial");

    // Compte administrateur principal
    await initDB({
      username: "madina",
      password: "Web123",
      role: "admin",
      firstName: "Madina",
      lastName: "LALAOUI",
      status: "validated",
    });

    // Compte membre de démonstration
    await initDB({
      username: "rasheequa",
      password: "Web789",
      role: "member",
      firstName: "Rasheequa",
      lastName: "BAGADADSAIB",
      status: "validated",
    });
  } else {
    console.log("Base déjà peuplée : rien à faire");
  }
}

// Exécution du seed au lancement du serveur
seed();

app.listen(3001, () => {
  console.log("Serveur démarré sur http://localhost:3001");
});
