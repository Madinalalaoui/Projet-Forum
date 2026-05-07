#!/bin/bash

if [ -z "$ADMIN_PASSWORD" ] || [ -z "$CAPTAIN_PASSWORD" ]; then
  echo "Erreur : variables manquantes. Lance avec : ADMIN_PASSWORD='mdp1' CAPTAIN_PASSWORD='mdp2' bash seed.sh"
  exit 1
fi

VM_NAME="vm-formation"
ZONE="europe-west9-a"
USER="rasheequa"

echo "=== Création des comptes ==="
gcloud compute ssh $USER@$VM_NAME --zone=$ZONE --command="
  curl -X POST http://localhost:3001/signup \
    -H 'Content-Type: application/json' \
    -d '{\"username\":\"rasheequa\",\"password\":\"$ADMIN_PASSWORD\",\"firstName\":\"Rasheequa\",\"lastName\":\"B\"}' &&
  curl -X POST http://localhost:3001/signup \
    -H 'Content-Type: application/json' \
    -d '{\"username\":\"Captain Hook\",\"password\":\"$CAPTAIN_PASSWORD\",\"firstName\":\"Captain\",\"lastName\":\"Hook\"}' &&
  curl -X PUT http://localhost:3001/users/Captain%20Hook/validate
"

echo "=== Seed termine ! ==="
EOF