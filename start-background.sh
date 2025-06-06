#!/bin/bash

# Arrêter l'instance existante
pkill -f "node dist/server.js"

# Compiler si nécessaire
echo "Compilation..."
npm run build
cd client && npm run build && cd ..
rm -rf dist/client && cp -r client/dist dist/client

# Créer les dossiers de logs
mkdir -p logs

# Démarrer en arrière-plan
echo "Démarrage du serveur en arrière-plan..."
NODE_ENV=production HOST=0.0.0.0 nohup node dist/server.js > logs/server.log 2>&1 &

# Sauvegarder le PID
echo $! > server.pid

echo "✅ Serveur démarré (PID: $(cat server.pid))"
echo "📋 Logs: tail -f logs/server.log"
