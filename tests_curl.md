# Tests curl — Projet Organiz'asso

Serveur : `http://localhost:3001`

---

## Schéma logique de la base de données MongoDB

La base contient 2 collections : `users` et `posts`.

### Collection : users

```json
{
  "username":     "string",
  "password":     "string (bcrypt hash)",
  "firstName":    "string",
  "lastName":     "string",
  "role":         "member | admin",
  "status":       "pending | validated",
  "dateCreation": "date"
}
```

### Collection : posts

```json
{
  "key":       "messages",
  "updatedAt": "date",
  "value": [
    {
      "id":       "string",
      "auteur":   "string",
      "createdAt":"string (ISO date)",
      "contenu":  "string",
      "forumId":  1,
      "likes":    ["string"],
      "reponses": [
        {
          "id":       "string",
          "auteur":   "string",
          "createdAt":"string",
          "contenu":  "string",
          "likes":    ["string"],
          "reponses": []
        }
      ]
    }
  ]
}
```

---

## Tests curl

### Routes Messages

#### GET /messages — Récupérer tous les messages

```bash
curl http://localhost:3001/messages
```

Résultat :
```json
{"messages":[{"id":"1780084074035-3ff5oiguu48","auteur":"madina","createdAt":"2026-04-15T19:47:54.035Z","contenu":"heey","reponses":[{"id":"1780084543413-18v5j4duo4f","auteur":"jade","createdAt":"2026-04-15T19:55:43.413Z","contenu":"helloooo","reponses":[],"likes":[]}],"likes":["jade"],"forumId":1}]}
```

#### PUT /messages — Sauvegarder les messages

```bash
curl -s -X PUT http://localhost:3001/messages \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "id": "1780084074035-3ff5oiguu48",
        "auteur": "madina",
        "createdAt": "2026-04-15T19:47:54.035Z",
        "contenu": "heey",
        "reponses": [
          {
            "id": "1780084543413-18v5j4duo4f",
            "auteur": "jade",
            "createdAt": "2026-04-15T19:55:43.413Z",
            "contenu": "helloooo",
            "reponses": [],
            "likes": []
          }
        ],
        "likes": ["jade"],
        "forumId": 1
      }
    ]
  }'
```

Résultat :
```json
{"message":"Messages sauvegardés"}
```

#### PUT /messages — Erreur : body invalide

```bash
curl -s -X PUT http://localhost:3001/messages \
  -H "Content-Type: application/json" \
  -d '{"messages": "mauvais format"}'
```

Résultat :
```json
{"message":"Format de messages invalide"}
```

---

### Routes Utilisateurs

#### POST /login — Connexion valide

```bash
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"username":"jade","password":"Web789;"}'
```

Résultat :
```json
{"username":"jade","role":"member","firstName":"Jade","lastName":"DUPONT"}
```

#### POST /login — Erreur : mot de passe incorrect

```bash
curl -s -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"username":"jade","password":"mauvais"}'
```

Résultat :
```json
{"message":"Utilisateur ou mot de passe incorrect"}
```

#### POST /login — Erreur : compte en attente de validation

```bash
curl -s -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"username":"bob","password":"Pass123;"}'
```

Résultat :
```json
{"message":"Votre inscription est en attente de validation par un administrateur."}
```

#### POST /signup — Créer un compte (devient pending)

```bash
curl -s -X POST http://localhost:3001/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"bob","password":"Pass123;","firstName":"Bob","lastName":"Martin"}'
```

Résultat :
```json
{"message":"Utilisateur créé"}
```

#### POST /signup — Erreur : champs manquants

```bash
curl -s -X POST http://localhost:3001/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"bob"}'
```

Résultat :
```json
{"message":"Username et mot de passe requis"}
```

#### POST /signup — Erreur : username déjà utilisé

```bash
curl -s -X POST http://localhost:3001/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"bob","password":"Pass123;","firstName":"Bob","lastName":"Martin"}'
```

Résultat :
```json
{"message":"Nom d'utilisateur déjà utilisé"}
```

#### GET /users — Liste de tous les utilisateurs validés

```bash
curl http://localhost:3001/users
```

Résultat :
```json
{"users":[{"username":"madina","firstName":"Madina","lastName":"LALAOUI","role":"admin"},{"username":"rasheequa","firstName":"Rasheequa","lastName":"Bagadad saib","role":"member"},{"username":"jade","firstName":"Jade","lastName":"DUPONT","role":"member"},{"username":"anne","firstName":"Anne","lastName":"Hartman","role":"member"}]}
```

#### GET /users/:username — Profil d'un utilisateur

```bash
curl http://localhost:3001/users/madina
```

Résultat :
```json
{"username":"madina","firstName":"Madina","lastName":"LALAOUI","role":"admin"}
```

#### GET /users/:username — Erreur : utilisateur inexistant

```bash
curl -s http://localhost:3001/users/inconnu
```

Résultat :
```json
{"message":"Utilisateur non trouvé"}
```

#### GET /users/pending — Liste des comptes en attente (admin)

```bash
curl -s http://localhost:3001/users/pending
```

Résultat :
```json
{"users":[{"username":"bob","firstName":"Bob","lastName":"Martin","dateCreation":"2026-06-02T13:44:29.330Z"}]}
```

#### PUT /users/:username/validate — Valider un compte

```bash
curl -s -X PUT http://localhost:3001/users/bob/validate
```

Résultat :
```json
{"message":"Utilisateur validé"}
```

#### PUT /users/:username/validate — Erreur : utilisateur inexistant

```bash
curl -s -X PUT http://localhost:3001/users/inconnu/validate
```

Résultat :
```json
{"message":"Utilisateur non trouvé ou déjà validé"}
```

#### PUT /users/:username/reject — Rejeter un compte en attente

```bash
curl -s -X PUT http://localhost:3001/users/bob/reject
```

Résultat :
```json
{"message":"Utilisateur rejeté"}
```

#### PUT /users/:username/role — Modifier le rôle d'un utilisateur

```bash
curl -s -X PUT http://localhost:3001/users/rasheequa/role \
  -H "Content-Type: application/json" \
  -d '{"role":"admin","requester":"madina"}'
```

Résultat :
```json
{"message":"Rôle mis à jour"}
```

#### PUT /users/:username/role — Erreur : modifier son propre rôle

```bash
curl -s -X PUT http://localhost:3001/users/madina/role \
  -H "Content-Type: application/json" \
  -d '{"role":"member","requester":"madina"}'
```

Résultat :
```json
{"message":"Impossible de modifier son propre rôle"}
```

#### PUT /users/:username/role — Erreur : rôle invalide

```bash
curl -s -X PUT http://localhost:3001/users/rasheequa/role \
  -H "Content-Type: application/json" \
  -d '{"role":"superuser","requester":"madina"}'
```

Résultat :
```json
{"message":"Rôle invalide"}
```
