# Configuration de PostgreSQL

## Option 1: Utiliser le script automatique

```bash
chmod +x scripts/setup-database.sh
./scripts/setup-database.sh
```

## Option 2: Configuration manuelle

### 1. Installer PostgreSQL (si pas déjà installé)

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Démarrer PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Créer un utilisateur et une base de données

```bash
# Se connecter en tant que postgres
sudo -u postgres psql

# Dans le shell PostgreSQL, exécuter :
CREATE USER gestion_user WITH PASSWORD 'votre_mot_de_passe_securise';
CREATE DATABASE gestion_projet OWNER gestion_user;
GRANT ALL PRIVILEGES ON DATABASE gestion_projet TO gestion_user;
\q
```

### 3. Tester la connexion

```bash
psql -h localhost -U gestion_user -d gestion_projet
```

### 4. Mettre à jour le fichier .env

Modifier le fichier `.env` avec vos informations :

```
DATABASE_URL="postgresql://gestion_user:votre_mot_de_passe_securise@localhost:5432/gestion_projet"
```

### 5. Exécuter les migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

## Dépannage

### Erreur d'authentification

Si vous avez l'erreur "Authentication failed", vérifiez :

1. **Le service PostgreSQL est démarré** :
   ```bash
   sudo systemctl status postgresql
   ```

2. **Les credentials sont corrects** :
   ```bash
   psql -h localhost -U votre_utilisateur -d votre_base
   ```

3. **Le fichier pg_hba.conf autorise les connexions locales** :
   ```bash
   sudo nano /etc/postgresql/*/main/pg_hba.conf
   ```
   
   Assurez-vous d'avoir cette ligne :
   ```
   local   all             all                                     md5
   host    all             all             127.0.0.1/32            md5
   ```

4. **Redémarrer PostgreSQL après modification** :
   ```bash
   sudo systemctl restart postgresql
   ```

### Utiliser PostgreSQL avec l'utilisateur par défaut

Si vous voulez utiliser l'utilisateur `postgres` par défaut :

1. Définir un mot de passe pour postgres :
   ```bash
   sudo -u postgres psql
   ALTER USER postgres PASSWORD 'votre_nouveau_mot_de_passe';
   \q
   ```

2. Mettre à jour .env :
   ```
   DATABASE_URL="postgresql://postgres:votre_nouveau_mot_de_passe@localhost:5432/gestion_projet"
   ```

3. Créer la base de données :
   ```bash
   sudo -u postgres createdb gestion_projet
   ```
