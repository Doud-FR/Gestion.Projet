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

## Automatiser le lancement du serveur
# Installer PM2 globalement
npm install -g pm2

# Créer le dossier logs
mkdir -p /home/doud/Gestion.Projet/logs

# Lancer l'application avec PM2
cd /home/doud/Gestion.Projet
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup systemd
# Suivre les instructions affichées (copier/coller la commande sudo)

# Commandes utiles PM2
pm2 status        # Voir le statut
pm2 logs          # Voir les logs
pm2 restart all   # Redémarrer
pm2 stop all      # Arrêter
pm2 delete all    # Supprimer
