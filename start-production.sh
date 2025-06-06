#!/bin/bash

# Obtenir l'IP de la machine
IP=$(hostname -I | awk '{print $1}')

echo "========================================="
echo "Démarrage de l'application en production"
echo "========================================="
echo ""
echo "L'application sera accessible sur:"
echo "  → http://$IP:5000"
echo ""

# S'assurer que tout est compilé
echo "Compilation du backend..."
cd /home/doud/Gestion.Projet
npm run build

echo "Compilation du frontend..."
cd client
npm run build

# Copier les fichiers du frontend dans le dossier du backend
echo "Déploiement des fichiers statiques..."
cd ..
rm -rf dist/client
cp -r client/dist dist/client

# Démarrer le serveur
echo "Démarrage du serveur..."
NODE_ENV=production HOST=0.0.0.0 node dist/server.js
echo "Démarrage du serveur..."
NODE_ENV=production HOST=0.0.0.0 node dist/server.js
