# Organiz'asso — Forum + Bot de Veille Cyber

Application web de forum pour une association. Gestion des membres, des rôles et des messages avec réponses imbriquées. Cette branche (`cloud-bot`) ajoute un bot automatisé — **Captain Hook** — qui publie chaque matin les dernières actualités cybersécurité issues de [The Hacker News](https://thehackernews.com), ainsi que les scripts de déploiement sur Google Cloud.

---

## Fonctionnalités

- Inscription avec validation par un admin (le premier inscrit devient admin automatiquement)
- Connexion / déconnexion
- Forums public et privé (réservé aux admins)
- Messages avec réponses imbriquées, recherche et filtres par date
- Page profil par membre
- Dashboard admin : valider/rejeter les inscriptions, promouvoir/rétrograder les membres
- **Bot Captain Hook** : publie automatiquement des posts cybersécurité chaque matin à 8h

---

## Stack technique

| Côté | Technologie |
|------|-------------|
| Frontend | React 19, React Router v7, Vite |
| Backend | Node.js, Express 5 |
| Base de données | MongoDB |
| Bot | Python 3, BeautifulSoup4, Requests |
| Cloud | Google Cloud Platform (Compute Engine, e2-micro) |
| Sécurité | bcryptjs (hashage des mots de passe) |
| Icônes | Lucide React |

---

## Prérequis

- [Node.js](https://nodejs.org) v18+
- [MongoDB](https://www.mongodb.com) en local (port 27017 par défaut)
- Python 3 + pip (pour le bot)

---

## Lancer le projet en local

**1. Installer les dépendances**
```bash
npm install
pip3 install requests beautifulsoup4
```

**2. Lancer le backend**
```bash
node server/server.js
```

**3. Lancer le frontend** (dans un autre terminal)
```bash
npm run dev
```

**4. Lancer le bot manuellement** (optionnel)
```bash
python3 cyber_forum_bot.py
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3001 |

> Le premier compte créé via l'interface devient automatiquement administrateur.

> En déploiement cloud, on remplace `localhost` par l'IP publique de la VM (L'IP peut changer à chaque recréation de la VM. IP actuelle : http://34.155.149.189:5173)

---

## Déploiement sur Google Cloud (Ne pas le faire c'est juste pour l'explication)

**1. Déployer l'infrastructure**
```bash
ADMIN_PASSWORD="tonmotdepasse" bash deploy.sh
```

Crée la VM, installe les dépendances, clone le repo, lance les services et configure le cron — en une seule commande. L'IP du forum s'affiche à la fin.

**2. Initialiser les comptes**
```bash
ADMIN_PASSWORD="tonmotdepasse" CAPTAIN_PASSWORD="mdp_bot" bash seed.sh
```

---

## Arborescence

```
├── server/
│   ├── database.js       # Connexion MongoDB
│   ├── init.js           # Création d'un utilisateur en base
│   └── server.js         # API REST (users, messages)
│
├── src/
│   ├── config.js         # URL de l'API
│   ├── utils/messages.js # Utilitaires partagés (création, suppression, formatage)
│   ├── pages/            # LoginPage, SignupPage, ForumPage, ProfilPage, AdminDashboard
│   ├── components/
│   │   ├── forum/        # Message, MessageList, MessageForm, ForumType
│   │   ├── layout/       # NavigationPanel
│   │   └── user/         # UserCard
│   └── assets/
│       ├── styles/       # CSS par composant
│       └── images/
│
├── cyber_forum_bot.py    # Bot de veille cybersécurité
├── deploy.sh             # Script de déploiement automatique
└── seed.sh               # Script d'initialisation des comptes
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

---

## Documentation

Pour une explication détaillée du fonctionnement interne du projet (React, routing, récursion, backend...) : [`explication_du_projet.md`](explication_du_projet.md)