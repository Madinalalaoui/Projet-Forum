# Explication du projet — Forum Organiz'asso
---

## C'est quoi ce projet ?

C'est une application web de forum pour une association. Les membres peuvent :
- Créer un compte et se connecter
- Poster des messages dans différents forums
- Répondre à des messages (réponses imbriquées)
- Voir le profil d'un membre et ses messages
- Supprimer leurs propres messages

Les administrateurs peuvent en plus :
- Valider ou rejeter les nouvelles inscriptions
- Promouvoir ou rétrograder des membres
- Accéder à un forum privé
- Supprimer n'importe quel message

---

## La stack technique

| Quoi | Technologie | Rôle |
|---|---|---|
| Frontend | React 19 | Ce que l'utilisateur voit et clique |
| Routing | React Router v7 | Navigation entre les pages via les URLs |
| Build tool | Vite | Compile et lance le projet React |
| Backend | Express.js | Serveur qui répond aux requêtes HTTP |
| Base de données | MongoDB | Stocke les utilisateurs et les messages |
| Icônes | Lucide React | Bibliothèque d'icônes SVG |
| Hashage | bcryptjs | Sécurise les mots de passe |

---

## Architecture générale

L'application est découpée en deux parties qui tournent séparément :

```
┌─────────────────────────────────┐        ┌──────────────────────────────┐
│         FRONTEND (React)        │        │       BACKEND (Express)      │
│         localhost:5173          │◄──────►│        localhost:3001        │
│                                 │  HTTP  │                              │
│  Ce que l'utilisateur voit      │        │  Gère la base de données     │
└─────────────────────────────────┘        └──────────────────────────────┘
                                                          │
                                                          ▼
                                              ┌──────────────────────┐
                                              │   MongoDB (forum)    │
                                              │  - collection users  │
                                              │  - collection posts  │
                                              └──────────────────────┘
```

Le frontend **ne parle jamais directement à MongoDB** — il passe toujours par le backend via des requêtes HTTP.

---

## Structure des fichiers

```
Projet-Forum/
│
├── server/                   ← Tout le backend (Node.js)
│   ├── server.js             ← Point d'entrée du serveur, toutes les routes API
│   ├── database.js           ← Connexion à MongoDB
│   └── init.js               ← Fonction pour créer un utilisateur en base
│
├── src/                      ← Tout le frontend (React)
│   ├── main.jsx              ← Point d'entrée React (monte l'app dans le HTML)
│   ├── App.jsx               ← Composant racine, gère les routes et l'état global
│   ├── config.js             ← URL de l'API (pour ne pas la répéter partout)
│   │
│   ├── utils/
│   │   └── messages.js       ← Fonctions utilitaires partagées pour les messages
│   │
│   ├── pages/                ← Chaque "page" de l'application (une par URL)
│   │   ├── LoginPage.jsx     ← /login
│   │   ├── SignupPage.jsx    ← /signup
│   │   ├── ForumPage.jsx     ← /forum
│   │   ├── ProfilPage.jsx    ← /profil/:username
│   │   └── AdminDashboard.jsx← /admin
│   │
│   ├── components/           ← Petits morceaux réutilisables de l'interface
│   │   ├── layout/
│   │   │   └── NavigationPanel.jsx  ← La barre de navigation en haut
│   │   ├── forum/
│   │   │   ├── ForumType.jsx        ← Liste des forums dans la sidebar
│   │   │   ├── MessageList.jsx      ← Liste de messages
│   │   │   ├── Message.jsx          ← Un seul message (avec ses réponses)
│   │   │   └── MessageForm.jsx      ← Formulaire pour écrire un message
│   │   └── user/
│   │       └── UserCard.jsx         ← Carte de présentation d'un membre
│   │
│   └── assets/
│       ├── styles/           ← Fichiers CSS (un par page/composant)
│       └── images/           ← Images statiques
│
└── index.html                ← Page HTML de base (React s'y injecte)
```

---

## Comment React fonctionne ici

### Le concept de composant

En React, l'interface est découpée en **composants** : des fonctions JavaScript qui retournent du HTML (appelé JSX).

```jsx
// Un composant simple
function UserCard({ user }) {
  return (
    <div className="user-card">
      <h2>{user.firstName} {user.lastName}</h2>
      <p>@{user.username}</p>
    </div>
  );
}
```

Les `{}` dans le JSX permettent d'insérer du JavaScript dans le HTML.
Les **props** (ici `user`) sont les données qu'on passe au composant, comme des paramètres de fonction.

### Le concept d'état (`useState`)

Un **état** est une variable qui, quand elle change, provoque un re-rendu du composant. C'est le mécanisme central de React.

```jsx
const [messages, setMessages] = useState([]);
// messages    → la valeur actuelle
// setMessages → la fonction pour la modifier
// []          → la valeur initiale
```

On ne modifie **jamais** un état directement (`messages.push(...)` est interdit). On appelle toujours le setter (`setMessages(...)`).

### Le concept d'effet (`useEffect`)

Un **effet** est du code qui s'exécute après le rendu du composant — typiquement pour charger des données depuis une API.

```jsx
useEffect(() => {
  // Ce code s'exécute une seule fois au démarrage (grâce au [] à la fin)
  fetch(`${API_URL}/messages`)
    .then(res => res.json())
    .then(data => setMessages(data.messages));
}, []); // ← tableau de dépendances vide = exécution au montage uniquement
```

Si le tableau contient des variables, l'effet se relance à chaque fois que ces variables changent.

### Le concept de référence (`useRef`)

Un `useRef` est comme une variable normale : elle peut stocker n'importe quelle valeur, mais contrairement à un état elle **ne provoque pas de re-rendu** quand elle change. Utile pour garder une information "en mémoire" entre les rendus sans déclencher de mise à jour visuelle.

```jsx
const initialLoad = useRef(true); // valeur initiale : true

// Plus tard dans un effet :
if (initialLoad.current) {
  initialLoad.current = false; // on modifie la ref → pas de re-rendu
  return;
}
```

Dans ce projet, on l'utilise pour ignorer la première exécution du `useEffect` de sauvegarde des messages (voir section dédiée).

---

## Comment la navigation fonctionne (React Router)

Ce projet utilise **React Router** pour gérer la navigation. Chaque page correspond à une URL réelle dans le navigateur.

### Déclaration des routes dans `App.jsx`

```jsx
import { Routes, Route, Navigate } from 'react-router-dom';

<Routes>
  <Route path="/"        element={<Navigate to="/forum" replace />} />
  <Route path="/forum"   element={<ForumPage ... />} />
  <Route path="/login"   element={<LoginPage ... />} />
  <Route path="/signup"  element={<SignupPage />} />
  <Route path="/profil/:username" element={<ProfilPage ... />} />
  <Route path="/admin"   element={
    user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/forum" replace />
  } />
</Routes>
```

- `path="/profil/:username"` → le `:username` est un **paramètre d'URL** (ex: `/profil/alice`)
- `<Navigate to="..." replace />` → redirige automatiquement vers une autre URL
- La route `/admin` est protégée : si l'utilisateur n'est pas admin, il est redirigé vers `/forum`

### Naviguer depuis le code (`useNavigate`)

Pour déclencher une navigation par programmation (après un clic, une action, etc.) :

```jsx
import { useNavigate } from 'react-router-dom';

function LoginPage({ login }) {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // ... connexion réussie
    login(data);        // mise à jour du state
    navigate('/forum'); // redirection vers le forum
  };
}
```

### Récupérer un paramètre d'URL (`useParams`)

Dans `ProfilPage`, le nom d'utilisateur vient directement de l'URL :

```jsx
import { useParams } from 'react-router-dom';

function ProfilPage({ user, messages }) {
  const { username } = useParams(); // récupère "alice" depuis /profil/alice
  // ...
}
```

### La barre de navigation (`NavLink`)

`NavLink` est comme un lien `<a>` mais il ajoute automatiquement la classe CSS `active` quand l'URL correspond à son `to` :

```jsx
import { NavLink } from 'react-router-dom';

<NavLink to="/forum">Forum</NavLink>
// Si l'URL est /forum → <a class="active">Forum</a>
// Sinon            → <a>Forum</a>
```

Plus besoin de gérer manuellement quelle page est "active" comme on ferait avec un état.

### Le `BrowserRouter` dans `main.jsx`

Tout React Router doit être enveloppé dans un `<BrowserRouter>`. C'est lui qui lit l'URL du navigateur et la met à disposition des composants :

```jsx
// main.jsx
import { BrowserRouter } from 'react-router-dom';

createRoot(...).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

---

## Flux de données : du bas vers le haut

En React, les données descendent (parent → enfant via les props) mais les actions remontent (enfant → parent via des fonctions passées en prop).

Exemple avec la suppression d'un message :

```
App.jsx
  │  passe messages + setMessages
  ▼
ForumPage.jsx
  │  passe onDelete={handleDeleteMessage}
  ▼
MessageList.jsx
  │  passe onDelete à chaque message
  ▼
Message.jsx
  │  l'utilisateur clique "Supprimer"
  │  → appelle onDelete(id)
  │
  └─► remonte jusqu'à ForumPage
        → handleDeleteMessage(id)
        → setMessages(prev => deleteRecursive(prev, id))
        → App.jsx sauvegarde automatiquement
```

---

## Les messages imbriqués (récursion)

Les messages peuvent avoir des réponses, qui peuvent elles-mêmes avoir des réponses — c'est une structure en arbre :

```
Message A
├── Réponse 1
│   └── Réponse 1.1
└── Réponse 2
```

En JavaScript, ça ressemble à ça :

```js
{
  id: "1744455600000-x7k2m",
  auteur: "alice",
  contenu: "Bonjour !",
  createdAt: "2026-04-12T10:00:00.000Z",
  reponses: [
    {
      id: "1744455660000-p9n4q",
      auteur: "bob",
      contenu: "Salut !",
      reponses: []
    }
  ]
}
```

Pour supprimer un message dans cet arbre (même s'il est profondément imbriqué), on utilise la **récursion** — une fonction qui s'appelle elle-même :

```js
// Dans src/utils/messages.js
function deleteRecursive(messages, id) {
  return messages
    .filter(msg => msg.id !== id)           // supprime si c'est le bon ID
    .map(msg => ({
      ...msg,
      reponses: deleteRecursive(msg.reponses || [], id)  // ← s'appelle elle-même
    }));
}
```

Le composant `Message.jsx` est lui aussi récursif : il s'affiche lui-même pour chaque réponse, ce qui crée l'imbrication visuelle automatiquement.

---

## Comment fonctionne le backend

### Express et les routes

Express est un framework qui permet de créer un **serveur HTTP**. On définit des **routes** : des URLs que le serveur sait gérer.

```js
// Quand le navigateur fait GET /messages
app.get("/messages", (req, res) => {
  // req = la requête entrante
  // res = la réponse à envoyer
  res.json({ messages: [...] });
});
```

Les méthodes HTTP utilisées ici :
- `GET` → lire des données
- `POST` → créer une ressource
- `PUT` → modifier une ressource

### Le pattern `withDB`

Presque toutes les routes ont besoin de la base de données. Plutôt que de répéter le même `try/catch` partout, on a une fonction utilitaire :

```js
function withDB(res, fn) {
  return connectDB()
    .then(fn)           // exécute la logique avec la connexion DB
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    });
}

// Utilisation :
app.get("/users", (req, res) => {
  return withDB(res, async (db) => {
    const users = await db.collection("users").find(...).toArray();
    res.json({ users });
  });
});
```

### MongoDB et les collections

MongoDB stocke des données sous forme de **documents JSON** regroupés en **collections** (l'équivalent des tables en SQL) :

- `users` → tous les comptes utilisateurs
- `posts` → les messages du forum (stockés dans un seul document avec une clé `"messages"`)

Pour interagir avec MongoDB :
```js
const db = await connectDB();

// Lire
const user = await db.collection("users").findOne({ username: "alice" });

// Écrire
await db.collection("users").insertOne({ username: "bob", ... });

// Modifier
await db.collection("users").updateOne(
  { username: "bob" },           // filtre : quel document modifier
  { $set: { role: "admin" } }   // modification à appliquer
);
```

---

## La gestion des utilisateurs

### Les rôles et statuts

Chaque utilisateur a un `role` et un `status` :

| Champ | Valeurs possibles | Signification |
|---|---|---|
| `role` | `"member"` ou `"admin"` | Niveau de permission |
| `status` | `"pending"` ou `"validated"` | Compte en attente ou validé |

À l'inscription :
- Si c'est le **premier compte créé** → `role: "admin"`, `status: "validated"` (automatiquement admin et validé)
- Sinon → `role: "member"`, `status: "pending"` (en attente de validation par un admin)

### Les mots de passe hashés

On ne stocke **jamais** un mot de passe en clair en base de données. On utilise `bcryptjs` pour le transformer en une chaîne illisible :

```js
// À l'inscription
const hashedPassword = await bcrypt.hash("monMotDePasse", 10);
// hashedPassword → "$2a$10$xK8jL..." (impossible à déchiffrer)

// À la connexion
const ok = await bcrypt.compare("monMotDePasse", hashedPassword);
// ok → true (bcrypt sait comparer sans décoder)
```

Le `10` est le "coût" du hashage — plus il est élevé, plus c'est lent à casser pour un attaquant.

### La session utilisateur

Il n'y a pas de système de session côté serveur. Quand un utilisateur se connecte avec succès, le serveur renvoie ses informations (`username`, `role`, etc.) et le frontend les stocke dans le **localStorage** du navigateur :

```js
// À la connexion (dans App.jsx)
localStorage.setItem("user", JSON.stringify(userData));

// Au démarrage de l'app, on relit le localStorage
const [user, setUser] = useState(() => {
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
});

// À la déconnexion
localStorage.removeItem("user");
```

Le localStorage persiste entre les rechargements de page, ce qui simule une session.

---

## La sauvegarde des messages

Les messages sont chargés au démarrage de l'app et sauvegardés automatiquement à chaque modification :

```js
// Chargement au démarrage (une seule fois)
useEffect(() => {
  fetch(`${API_URL}/messages`)
    .then(res => res.ok ? res.json() : null)
    .then(data => { if (data) setMessages(data.messages || []); });
}, []);

// Sauvegarde automatique à chaque changement de messages
const initialLoad = useRef(true);
useEffect(() => {
  if (initialLoad.current) {
    initialLoad.current = false;
    return; // on ignore la première exécution (au montage)
  }
  fetch(`${API_URL}/messages`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
}, [messages]); // se relance à chaque fois que messages change
```

Pourquoi le `useRef` ? Sans lui, le deuxième `useEffect` s'exécuterait dès le montage (avec `messages = []`) et sauvegarderait un tableau vide en base, effaçant tous les messages existants. Le `useRef` permet de sauter cette première exécution.

---

## Le fichier `src/utils/messages.js`

Ce fichier regroupe les fonctions partagées entre plusieurs composants pour éviter la duplication :

```js
// Crée un objet message avec les bons champs
createMessage(username, contenu)
// → { id: "1744455600000-x7k2m", auteur, createdAt, contenu, reponses: [] }
// L'ID combine Date.now() + une chaîne aléatoire pour éviter les doublons

// Supprime un message dans l'arbre (par ID)
deleteRecursive(messages, id)

// Ajoute une réponse à un message dans l'arbre
addReplyRecursive(messages, idMessage, reply)

// Formate une date ISO en format lisible
formatDate("2026-04-12T10:00:00.000Z")
// → "12/04/2026 10:00:00"
```

---

## Résumé du flux complet : poster un message

1. L'utilisateur tape un message dans `MessageForm.jsx` et clique "Envoyer"
2. `handleSubmit` appelle `createMessage(user.username, contenu)` → crée l'objet message
3. `addMsg(message)` est appelé → c'est la prop `handleAddMessage` passée depuis `ForumPage`
4. `handleAddMessage` appelle `setMessages(prev => [{ ...msg, forumId }, ...prev])` → ajoute le message au début
5. `messages` a changé → le `useEffect` de sauvegarde dans `App.jsx` se déclenche
6. Le frontend fait `PUT /messages` avec tous les messages
7. Le backend reçoit la requête et met à jour le document dans MongoDB

---

## Résumé du flux complet : se connecter

1. L'utilisateur remplit le formulaire dans `LoginPage.jsx` et soumet
2. Le frontend fait `POST /login` avec `{ username, password }`
3. Le backend cherche l'utilisateur par username dans MongoDB
4. Il compare le mot de passe avec `bcrypt.compare()`
5. Si ça correspond et que le compte est validé → le backend renvoie `{ username, role, firstName, lastName }`
6. `login(data)` est appelé dans `App.jsx` → stocke dans localStorage, met à jour `user`
7. `navigate('/forum')` redirige vers la page du forum

---

## Résumé du flux complet : voir le profil d'un autre membre

1. L'utilisateur clique sur le nom d'un auteur dans un message (`Message.jsx`)
2. `onViewProfile(auteur)` est appelé → remonte jusqu'à `ForumPage`
3. `ForumPage` appelle `navigate('/profil/alice')` → React Router change l'URL
4. Le composant `ProfilPage` se monte, `useParams()` retourne `{ username: "alice" }`
5. Un `useEffect` détecte que c'est pas son propre profil → fait `GET /users/alice`
6. Le backend renvoie les infos publiques de alice
7. `ProfilPage` affiche la carte de alice et ses messages (filtrés depuis le state global)
