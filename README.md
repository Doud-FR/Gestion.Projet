# Application de Gestion de Projet

## Installation en production

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- Docker et Docker Compose (optionnel)

### Installation avec Docker

1. Cloner le repository
```bash
git clone <your-repo-url>
cd Gestion.Projet
```

2. Configurer les variables d'environnement
```bash
cp .env.example .env
# Éditer le fichier .env avec vos valeurs
```

3. Lancer l'application
```bash
docker-compose up -d
```

### Installation manuelle

1. Installer les dépendances backend
```bash
npm install
```

2. Installer les dépendances frontend
```bash
cd client
npm install
cd ..
```

3. Configurer la base de données
```bash
npx prisma migrate deploy
npx prisma generate
```

4. Build de l'application
```bash
npm run build
cd client && npm run build
```

5. Lancer l'application
```bash
NODE_ENV=production npm start
```

## Fonctionnalités

- ✅ Authentification JWT sécurisée
- ✅ Gestion des utilisateurs avec rôles
- ✅ Gestion des clients
- ✅ Gestion des projets avec diagramme de Gantt
- ✅ Système de notes
- ✅ Dashboard temps réel
- ✅ Mode sombre
- ✅ Interface responsive
- ✅ API RESTful sécurisée

## Sécurité

- Mots de passe hashés avec bcrypt
- Tokens JWT avec refresh tokens
- Protection CSRF
- Validation des entrées
- Rate limiting
- Logs d'activité

## Performance

- Mise en cache des requêtes
- Pagination des résultats
- Optimisation des requêtes Prisma
- Code splitting React
- Lazy loading des composants
