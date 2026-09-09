# 🐳 Déploiement Docker de ShopFlow

Ce guide explique comment déployer l'application ShopFlow complète avec Docker.

## 📋 Prérequis

- Docker installé sur votre machine
- Docker Compose installé
- Une base de données Neon PostgreSQL
- Git

## 🚀 Architecture de Déploiement

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │   Backend       │    │   Neon DB       │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│   Port: 3000    │    │   Port: 3001    │    │   Cloud         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲
         │                       │
         └───────────────────────┘
                    │
              ┌─────────────┐
              │   Nginx     │
              │  (Proxy)    │
              │ Port: 80/443│
              └─────────────┘
```

## 📝 Configuration

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd Our_Stocks_Project
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Éditez le fichier `.env` avec vos configurations :

```env
# Base de données Neon PostgreSQL
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-secret-ici

# Configuration de l'application
NODE_ENV=production
```

### 3. Déploiement rapide

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Lancer le déploiement
./deploy.sh
```

## 🔧 Déploiement Manuel

### Étape 1: Construction des images

```bash
docker-compose build --no-cache
```

### Étape 2: Démarrage des services

```bash
docker-compose up -d
```

### Étape 3: Vérification

```bash
# Vérifier l'état des conteneurs
docker-compose ps

# Voir les logs
docker-compose logs -f
```

## 🌐 Accès aux Services

- **Application Web**: http://localhost:3000
- **API Backend**: http://localhost:3001 (si nécessaire)
- **Nginx Proxy**: http://localhost:80 (mode production)

## 📱 Application Mobile

Pour l'application Flutter:

1. Configurez l'URL de l'API dans votre application mobile:
   ```dart
   const String API_BASE_URL = 'http://localhost:3000';
   ```

2. Build et déploiement:
   ```bash
   cd apps/mobile
   flutter build apk --release
   flutter build ios --release
   ```

## 🔍 Monitoring et Débogage

### Voir les logs en temps réel

```bash
# Logs de tous les services
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f web
docker-compose logs -f backend
```

### Gérer les conteneurs

```bash
# Arrêter les services
docker-compose down

# Redémarrer un service
docker-compose restart web

# Mettre à jour les images
docker-compose pull
docker-compose up -d
```

### Entrer dans un conteneur

```bash
# Entrer dans le conteneur web
docker-compose exec web sh

# Entrer dans le conteneur backend
docker-compose exec backend sh
```

## 🚀 Déploiement en Production

Pour un déploiement en production:

```bash
# Utiliser le profil production
docker-compose --profile production up -d
```

Cela inclut:
- Nginx comme reverse proxy
- Configuration SSL (certificats à placer dans `nginx/ssl/`)
- Optimisations de performance

## 🔧 Configuration Nginx (Optionnel)

Créez le fichier `nginx/nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream web {
        server web:3000;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://web;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## 🛠️ Dépannage

### Problèmes courants

1. **Port déjà utilisé**: Changez les ports dans `docker-compose.yml`
2. **Base de données inaccessible**: Vérifiez votre `DATABASE_URL`
3. **Build échoue**: Vérifiez vos dépendances dans `package.json`

### Nettoyer tout

```bash
# Arrêter et supprimer les conteneurs
docker-compose down -v

# Supprimer les images non utilisées
docker image prune -a
```

## 📚 Documentation Complémentaire

- [Documentation Docker](https://docs.docker.com/)
- [Documentation Docker Compose](https://docs.docker.com/compose/)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Flutter](https://flutter.dev/docs)

## 🆘 Support

En cas de problème:

1. Vérifiez les logs: `docker-compose logs`
2. Vérifiez votre configuration `.env`
3. Assurez-vous que Docker est bien démarré

---

**Note**: La base de données Neon est managée en cloud, donc pas besoin de conteneur PostgreSQL.
