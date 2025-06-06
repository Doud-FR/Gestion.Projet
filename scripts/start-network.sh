#!/bin/bash

echo "Démarrage de l'application en mode réseau..."

# Obtenir l'adresse IP de la machine
IP=$(hostname -I | awk '{print $1}')

echo "L'application sera accessible sur:"
echo "  - Backend API: http://$IP:5000"
echo "  - Frontend: http://$IP:3000"

# Démarrer le backend
echo "Démarrage du backend..."
cd /home/doud/Gestion.Projet
NODE_ENV=production npm start &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 5

# Démarrer le frontend
echo "Démarrage du frontend..."
cd /home/doud/Gestion.Projet/client
npm run preview -- --host 0.0.0.0 &
FRONTEND_PID=$!

echo "Application démarrée!"
echo "PID Backend: $BACKEND_PID"
echo "PID Frontend: $FRONTEND_PID"

# Attendre Ctrl+C
wait
