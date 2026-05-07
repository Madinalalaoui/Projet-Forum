#!/bin/bash

PROJECT="project-cd5b6f0c-22eb-400e-b4f"
ZONE="europe-west9-a"
VM_NAME="vm-formation"
USER="rasheequa"
REPO="https://github.com/Madinalalaoui/Projet-Forum.git"
BRANCH="cloud-bot"

echo "=== 0. Nettoyage cache SSH ==="
reg delete "HKCU\Software\SimonTatham\PuTTY\SshHostKeys" /f 2>/dev/null || true

echo "=== 1. Creation de la VM ==="
gcloud compute instances create $VM_NAME \
  --project=$PROJECT \
  --zone=$ZONE \
  --machine-type=e2-micro \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud

echo "=== 2. Attente demarrage VM ==="
sleep 30

echo "=== 3. Installation des dependances ==="
gcloud compute ssh $USER@$VM_NAME --zone=$ZONE --command="
  sudo apt update -y &&
  sudo apt install python3-pip git -y &&
  pip3 install requests beautifulsoup4 &&
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - &&
  sudo apt install -y nodejs &&
  curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor &&
  echo 'deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse' | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list &&
  sudo apt update &&
  sudo apt install -y mongodb-org &&
  sudo systemctl start mongod &&
  sudo systemctl enable mongod &&
  sudo npm install -g pm2 serve
"

echo "=== 4. Clone du repo ==="
gcloud compute ssh $USER@$VM_NAME --zone=$ZONE --command="
  git clone -b $BRANCH $REPO &&
  cd Projet-Forum &&
  npm install &&
  npm run build
"

echo "=== 5. Lancement des services ==="
gcloud compute ssh $USER@$VM_NAME --zone=$ZONE --command="
  cd Projet-Forum &&
  pm2 start server/server.js --name forum-backend --interpreter node &&
  pm2 start 'serve -s dist -l 5173' --name forum-frontend &&
  pm2 startup &&
  pm2 save
"

echo "=== 6. Configuration cron ==="
gcloud compute ssh $USER@$VM_NAME --zone=$ZONE --command="
  (crontab -l 2>/dev/null; echo '0 8 * * * python3 /home/$USER/Projet-Forum/cyber_forum_bot.py >> /home/$USER/forum_bot.log 2>&1') | crontab -
"

echo "=== 7. Firewall ==="
gcloud compute firewall-rules create allow-forum --allow 'tcp:3001,tcp:5173' --target-tags forum --description 'Ports forum' 2>/dev/null || true
gcloud compute instances add-tags $VM_NAME --tags forum --zone=$ZONE

echo "=== Deploiement termine ! ==="
gcloud compute instances describe $VM_NAME --zone=$ZONE --format="get(networkInterfaces[0].accessConfigs[0].natIP)"
