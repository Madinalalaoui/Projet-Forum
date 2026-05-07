# Organiz'asso — Forum

Application web de forum pour une association avec gestion des membres, des rôles et d'un fil de discussions. Le dépôt contient aussi un script Python optionnel de veille (bot) et des scripts d'automatisation.

---

## Résumé rapide

- **Frontend** : application React servie par Vite (dev : `npm run dev`, port 5173).
- **Backend** : API Express (écoute sur le port `3001`).
- **BDD** : MongoDB locale (base `forum`, connexion par défaut sur `mongodb://localhost`).
- **Bot (optionnel)** : script Python de veille présent dans `automatisation/`.

---

## Fonctionnalités principales

- Inscription avec validation par un administrateur (le premier utilisateur créé est promu `admin`).
- Authentification (login / logout).
- Publication de messages et réponses imbriquées.
- Dashboard administrateur : valider/rejeter les inscriptions, modifier les rôles.
- Page profil pour chaque membre.

---

## Stack technique

- Frontend : React, Vite
- Backend : Node.js, Express
- Base de données : MongoDB (connexion par défaut dans [server/database.js](server/database.js#L1))
- Bot : Python 3 (optionnel)
- Auth : `bcryptjs` pour le hachage des mots de passe

---

## Prérequis

- Node.js v18+
- MongoDB (instance locale ou accessible depuis `mongodb://localhost`)
- Python 3 + pip (si vous voulez exécuter le bot)

---

## Installation et exécution en local

1. Installer les dépendances frontend/backend :

```bash
npm install
```

2. Lancer l'API (backend) :

```bash
node server/server.js
```

3. Lancer l'interface (frontend) dans un autre terminal :

```bash
npm run dev
```

4. (Optionnel) Lancer le bot manuellement :

```bash
python3 automatisation/cyber_forum_bot.py
```

Services locaux par défaut :

- Frontend : http://localhost:5173
- Backend  : http://localhost:3001

Remarque : l'URL de l'API utilisée par le frontend est définie dans [src/config.js](src/config.js#L1). Pour du développement local, mettez-la à `http://localhost:3001/api`.

---

## Scripts et automatisation

Les scripts d'automatisation sont présents dans le dossier `automatisation/` :

- `automatisation/deploy.sh` — script d'automatisation (inspectez-le avant utilisation).
- `automatisation/seed.sh` — script d'initialisation (création d'utilisateurs de test).

Exécutez ces scripts uniquement si vous comprenez leurs effets et après adaptation à votre environnement.

---

## Arborescence (extrait)

```
├── server/
│   ├── database.js       # Connexion MongoDB
│   ├── init.js           # Création d'un utilisateur en base
│   └── server.js         # API REST (users, messages)
│
├── src/
│   ├── config.js         # URL de l'API
│   ├── pages/            # LoginPage, SignupPage, ForumPage, ProfilPage, AdminDashboard
│   └── components/       # composants UI
│
├── automatisation/       # bot et scripts (deploy, seed)
└── rendus/               # captures d'écran
```

---

## Images (captures)

- [rendus/connexion.png](rendus/connexion.png)
- [rendus/inscription.png](rendus/inscription.png)
- [rendus/admin.png](rendus/admin.png)
- [rendus/profil.png](rendus/profil.png)
- [rendus/forum.png](rendus/forum.png)

---

## Documentation

Pour une explication détaillée du fonctionnement interne : [explication_du_projet.md](explication_du_projet.md)