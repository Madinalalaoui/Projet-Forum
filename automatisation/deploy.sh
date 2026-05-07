#!/bin/bash

if [ -z "$ADMIN_PASSWORD" ]; then
  echo "Erreur : ADMIN_PASSWORD non defini. Lance avec : ADMIN_PASSWORD='monmdp' bash deploy.sh"
  exit 1
fi

PROJECT="project-cd5b6f0c-22eb-400e-b4f"
ZONE="europe-west9-a"
VM_NAME="vm-formation"
USER="rasheequa"
REPO="https://github.com/Madinalalaoui/Projet-Forum.git"
BRANCH="cloud-bot"
DOMAIN="organiz-asso.ddns.net"
STATIC_IP="34.155.71.109"

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

echo "=== 3. Attachement IP statique ==="
gcloud compute instances delete-access-config $VM_NAME --access-config-name "external-nat" --zone=$ZONE
gcloud compute instances add-access-config $VM_NAME --access-config-name "external-nat" --address=$STATIC_IP --zone=$ZONE

echo "=== 4. Installation des dependances ==="
gcloud compute ssh $USER@$VM_NAME --zone=$ZONE --command="
  sudo apt update -y &&
  sudo apt install python3-pip git nginx certbot python3-certbot-nginx -y &&
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

echo "=== 5. Clone du repo ==="
gcloud compute ssh $USER@$VM_NAME --zone=$ZONE --command="
  git clone -b $BRANCH $REPO &&
  cd Projet-Forum &&
  npm install &&
  npm run build
"

echo "=== 6. Configuration Nginx ==="
gcloud compute ssh $USER@$VM_NAME --zone=$ZONE --command="
  sudo bash -c 'cat > /etc/nginx/sites-available/organiz-asso << NGINX
server {
    server_name $DOMAIN;
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\\$http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_set_header Host \\\$host;
        proxy_cache_bypass \\\$http_upgrade;
    }
    location /api/ {
        rewrite ^/api/(.*) /\\\$1 break;
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \\\$host;
    }
    listen 80;
}
NGINX' &&
  sudo ln -s /etc/nginx/sites-available/organiz-asso /etc/nginx/sites-enabled/ &&
  sudo nginx -t &&
  sudo systemctl restart nginx &&
  sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m rasheequa.m@gmail.com
"

echo "=== 7. Lancement des services ==="
gcloud compute ssh $USER@$VM_NAME --zone=$ZONE --command="
  cd Projet-Forum &&
  pm2 start server/server.js --name forum-backend --interpreter node &&
  pm2 start 'serve -s dist -l 5173' --name forum-frontend &&
  pm2 startup &&
  pm2 save
"

echo "=== 8. Configuration cron ==="
gcloud compute ssh $USER@$VM_NAME --zone=$ZONE --command="
  (crontab -l 2>/dev/null; echo '0 8 * * * python3 /home/$USER/Projet-Forum/cyber_forum_bot.py >> /home/$USER/forum_bot.log 2>&1') | crontab -
"

echo "=== 9. Firewall ==="
gcloud compute firewall-rules create allow-forum --allow 'tcp:3001,tcp:5173' --target-tags forum --description 'Ports forum' 2>/dev/null || true
gcloud compute firewall-rules create allow-http --allow 'tcp:80,tcp:443' --target-tags forum --description 'HTTP et HTTPS' 2>/dev/null || true
gcloud compute instances add-tags $VM_NAME --tags forum --zone=$ZONE

echo "=== Deploiement termine ! ==="
echo "Forum accessible sur : https://$DOMAIN"
