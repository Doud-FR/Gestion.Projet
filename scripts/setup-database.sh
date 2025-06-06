#!/bin/bash

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Configuration de la base de données PostgreSQL..."

# Demander les informations de connexion
read -p "Nom d'utilisateur PostgreSQL (par défaut: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "Mot de passe PostgreSQL: " DB_PASSWORD
echo

read -p "Nom de la base de données (par défaut: gestion_projet): " DB_NAME
DB_NAME=${DB_NAME:-gestion_projet}

# Créer la base de données
echo -e "\n${GREEN}Création de la base de données...${NC}"
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h localhost -c "CREATE DATABASE $DB_NAME;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Base de données créée avec succès!${NC}"
else
    echo -e "${RED}La base de données existe peut-être déjà ou erreur de connexion${NC}"
fi

# Mettre à jour le fichier .env
echo -e "\n${GREEN}Mise à jour du fichier .env...${NC}"
cat > .env << EOF
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
EOF

echo -e "${GREEN}Fichier .env créé!${NC}"

# Exécuter les migrations
echo -e "\n${GREEN}Exécution des migrations Prisma...${NC}"
npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Migrations appliquées avec succès!${NC}"
    npx prisma generate
    echo -e "${GREEN}Client Prisma généré!${NC}"
else
    echo -e "${RED}Erreur lors de l'application des migrations${NC}"
    exit 1
fi

echo -e "\n${GREEN}Configuration terminée!${NC}"
