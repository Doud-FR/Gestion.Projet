# Instructions d'installation

## Installation des dépendances

### Backend
```bash
cd /home/doud/Gestion.Projet
npm install
```

### Frontend
```bash
cd /home/doud/Gestion.Projet/client
npm install
```

Si vous rencontrez des erreurs de dépendances, utilisez :
```bash
npm install --legacy-peer-deps
```

## Configuration de la base de données

1. Créer une base de données PostgreSQL
2. Configurer le fichier .env avec l'URL de connexion
3. Exécuter les migrations :
```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Lancement en développement

Terminal 1 - Backend :
```bash
npm run dev
```

Terminal 2 - Frontend :
```bash
cd client
npm run dev
```

L'application sera accessible sur http://localhost:3000
