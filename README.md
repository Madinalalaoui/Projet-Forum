# Organiz'asso — Forum

Application web de forum pour une association. Gestion des membres, des rôles et des messages avec réponses imbriquées.

---

## Fonctionnalités

- Inscription avec validation par un admin (le premier inscrit devient admin automatiquement)
- Connexion / déconnexion
- Forums public et privé (réservé aux admins)
- Messages avec réponses imbriquées, recherche et filtres par date
- Page profil par membre
- Dashboard admin : valider/rejeter les inscriptions, promouvoir/rétrograder les membres

---

## Stack technique

| Côté | Technologie |
|------|-------------|
| Frontend | React 19, React Router v7, Vite |
| Backend | Node.js, Express 5 |
| Base de données | MongoDB |
| Sécurité | bcryptjs (hashage des mots de passe) |
| Icônes | Lucide React |

---

## Prérequis

- [Node.js](https://nodejs.org) v18+
- [MongoDB](https://www.mongodb.com) en local (port 27017 par défaut)

---

## Lancer le projet

**1. Installer les dépendances**
```bash
npm install
```

**2. Lancer le backend**
```bash
node server/server.js
```

**3. Lancer le frontend** (dans un autre terminal)
```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3001 |

> Le premier compte créé via l'interface devient automatiquement administrateur.

---

## Arborescence

```
├── server/
│   ├── database.js       # Connexion MongoDB
│   ├── init.js           # Création d'un utilisateur en base
│   └── server.js         # API REST (users, messages)
│
└── src/
    ├── config.js         # URL de l'API
    ├── utils/messages.js # Utilitaires partagés (création, suppression, formatage)
    ├── pages/            # LoginPage, SignupPage, ForumPage, ProfilPage, AdminDashboard
    ├── components/
    │   ├── forum/        # Message, MessageList, MessageForm, ForumType
    │   ├── layout/       # NavigationPanel
    │   └── user/         # UserCard
    └── assets/
        ├── styles/       # CSS par composant
        └── images/
```

---

### Photos du rendu : 
 
**Connexion :**
[`photo connexion`](rendus/connexion.png)

**Inscription :** 
[`photo inscription`](rendus/inscription.png)

**Admin :**
[`photo dashboard admin`](rendus/admin.png)

**Profil :**
[`photo profil`](rendus/profil.png)

**Forum :**
[`photo Forum`](rendus/forum.png)


## Documentation

Pour une explication détaillée du fonctionnement interne du projet (React, routing, récursion, backend...) : [`explication_du_projet.md`](explication_du_projet.md)
