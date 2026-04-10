# Forum

Application web de forum avec gestion des utilisateurs, des rôles et des messages.

---

## Lancer le projet

Backend
```bash
node server/server.js
```

Frontend
```bash
npm install
npm run dev
```

Le frontend tourne sur `http://localhost:5173`, le backend sur `http://localhost:3001`.

Pour initialiser la base avec les utilisateurs par défaut :
```bash
node server/init.js
```

---

## Arborescence

```
├── server/
│   ├── database.js       # Connexion MongoDB
│   ├── init.js           # Initialisation des utilisateurs en base
│   └── server.js         # API Express (routes messages, users)
│
└── src/
    ├── pages/            # Pages principales (Forum, Login, Signup, Profil, Admin)
    ├── components/
    │   ├── forum/        # Composants liés aux messages et forums
    │   ├── layout/       # NavigationPanel
    │   └── user/         # Composants liés aux utilisateurs
    └── assets/
        ├── styles/       # Fichiers CSS
        └── images/       # Images statiques
```

---

## Stack technique

| Côté | Techno |
|------|--------|
| Frontend | React 19, Vite |
| Backend | Node.js, Express 5 |
| Base de données | MongoDB |
| Icônes | Lucide React |
