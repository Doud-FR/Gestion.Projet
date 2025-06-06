#!/bin/bash

echo "🔨 Build de production..."

# Backend
echo "📦 Compilation du backend..."
npm run build

# Frontend
echo "📦 Compilation du frontend..."
cd client
npm run build

# Copier les fichiers du frontend au bon endroit
echo "📁 Copie des fichiers statiques..."
cd ..
mkdir -p dist/client
cp -r client/dist/* dist/client/

echo "✅ Build terminé!"
echo "📂 Structure des fichiers:"
ls -la dist/
ls -la dist/client/

echo ""
echo "Pour lancer: NODE_ENV=production HOST=0.0.0.0 node dist/server.js"
