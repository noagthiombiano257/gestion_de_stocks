#  ShopFlow - Système de Gestion de Stock Complet

Application full-stack de gestion de stock avec interface mobile (Flutter) et panneau d'administration web (Next.js).

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Flutter](https://img.shields.io/badge/Flutter-3.38.9-02569B?logo=flutter)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql)

---

##  Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [API Documentation](#api-documentation)
- [Déploiement](#déploiement)
- [Contributeurs](#contributeurs)

---

##  Vue d'ensemble

ShopFlow est une solution complète de gestion de stock comprenant :

- ** Application Mobile** : Interface Flutter pour la gestion quotidienne du stock
- ** Panneau Admin Web** : Interface Next.js pour l'administration et les analyses
- ** API REST** : Backend robuste avec 12 endpoints
- ** Base de données** : PostgreSQL hébergée sur Neon

### Captures d'écran

#### Application Mobile
- Dashboard avec statistiques en temps réel
- Gestion CRUD des produits
- Scanner de code-barres
- Ajustement de stock
- Mode invité (lecture seule)

#### Panneau Admin
- Dashboard avec graphiques et analytics
- Gestion des produits (grille interactive)
- Gestion des utilisateurs
- Historique des mouvements de stock
- Authentification sécurisée

---

##  Fonctionnalités

###  Application Mobile (Flutter)

#### Authentification
-  Inscription / Connexion
-  Gestion de profil
-  Mode invité (lecture seule)
-  Persistance de session

#### Gestion de Stock
-  Liste des produits avec recherche
-  Ajout de produits
-  Modification de produits
-  Suppression de produits
-  Ajustement de stock (+/-)
-  Scanner de code-barres/QR
-  Historique des mouvements

#### Interface
-  Design moderne mode sombre
-  Animations fluides
-  Icônes intelligentes par catégorie
-  Badges de stock colorés
-  Pull-to-refresh
-  Navigation par drawer

###  Panneau Admin Web (Next.js)

#### Dashboard
-  Statistiques en temps réel
-  Graphique des ventes (30 jours)
-  Timeline d'activités récentes
-  Aperçu des utilisateurs

#### Gestion
-  Gestion des produits (grille de cartes)
-  Gestion des utilisateurs
-  Recherche et filtres
-  Export de données

#### Sécurité
-  Authentification obligatoire
-  Gestion de sessions
-  Protection des routes
-  Déconnexion sécurisée

---

##  Technologies

### Frontend Mobile
- **Flutter** 3.38.9
- **Dart** 3.x
- **Provider** (State Management)
- **http** (API calls)
- **mobile_scanner** (Barcode scanning)

### Frontend Web
- **Next.js** 16.1.6 (App Router)
- **React** 19.2
- **TypeScript** 5.9
- **Tailwind CSS** 3.4
- **Recharts** (Graphiques)
- **Lucide React** (Icônes)
- **date-fns** (Dates)

### Backend
- **Next.js API Routes**
- **Drizzle ORM** 0.33
- **JWT** (Authentication)
- **bcryptjs** (Password hashing)

### Base de données
- **PostgreSQL** (Neon Cloud)
- **Connection Pooling**
- **SSL/TLS**

---

##  Architecture

### Structure du projet (Monorepo)
```
Our_Stocks_Project/
├── apps/
│   ├── mobile/                # Application Flutter
│   │   ├── lib/
│   │   │   ├── models/        # Modèles de données
│   │   │   ├── providers/     # State management
│   │   │   ├── screens/       # Écrans UI
│   │   │   ├── services/      # API service
│   │   │   └── widgets/       # Composants réutilisables
│   │   └── pubspec.yaml
│   │
│   └── web/                   # Admin Next.js
│       ├── src/
│       │   ├── app/
│       │   │   ├── admin/     # Pages admin
│       │   │   ├── api/       # API routes
│       │   │   └── login/     # Page de connexion
│       │   └── types/         # TypeScript types
│       └── package.json
│
├── packages/
│   └── db/                    # Package database partagé
│       ├── src/
│       │   ├── index.ts       # Connexion DB
│       │   └── schema.ts      # Schema Drizzle
│       └── package.json
│
├── package.json               # Root package.json
├── pnpm-workspace.yaml        # Configuration workspace
└── README.md
```

### Base de données - Schema

#### Table `users`
```sql
- id (SERIAL PRIMARY KEY)
- name (TEXT)
- email (TEXT UNIQUE)
- password_hash (TEXT)
- avatar_url (TEXT)
- role (TEXT) - 'admin' | 'user'
- status (VARCHAR) - 'active' | 'inactive'
- last_login (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Table `products`
```sql
- id (SERIAL PRIMARY KEY)
- name (TEXT)
- sku (TEXT UNIQUE)
- quantity (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Table `stock_movements`
```sql
- id (SERIAL PRIMARY KEY)
- product_id (INTEGER FK → products)
- user_id (INTEGER FK → users)
- quantity (INTEGER)
- type (TEXT) - 'purchase', 'sale', 'adjustment'
- created_at (TIMESTAMP)
```

#### Table `activity_logs`
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FK → users)
- action_type (TEXT)
- description (TEXT)
- entity_type (TEXT)
- entity_id (INTEGER)
- metadata (JSONB)
- created_at (TIMESTAMP)
```

---

##  Installation

### Prérequis

- **Node.js** 18.x ou supérieur
- **pnpm** 8.x ou supérieur
- **Flutter** 3.38.9
- **Dart** 3.x
- **PostgreSQL** (ou compte Neon)

### 1. Cloner le projet
```bash
git clone https://github.com/votre-repo/shopflow.git
cd shopflow
```

### 2. Installer les dépendances

#### Backend/Web
```bash
# Installer pnpm si nécessaire
npm install -g pnpm

# Installer toutes les dépendances du monorepo
pnpm install
```

#### Mobile
```bash
cd apps/mobile
flutter pub get
```

### 3. Configuration de la base de données

#### Option A : Utiliser Neon (Recommandé)

1. Créez un compte sur [neon.tech](https://neon.tech)
2. Créez un nouveau projet
3. Copiez la connection string

#### Option B : PostgreSQL local
```bash
# Créer une base de données
createdb shopflow

# Importer le schema (fichier fourni séparément)
psql shopflow < schema.sql
```

---

##  Configuration

### 1. Variables d'environnement - Web

**Créer** : `apps/web/.env.local`
```env
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=votre-secret-jwt-super-securise-changez-moi
```

### 2. Variables d'environnement - Database

**Créer** : `packages/db/.env`
```env
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

### 3. Configuration Flutter

**Modifier** : `apps/mobile/lib/services/api_service.dart`
```dart
static const String baseUrl = 'http://localhost:3000/api';
// OU en production :
// static const String baseUrl = 'https://votre-domaine.com/api';
```

---

##  Utilisation

### Lancer le serveur web (Admin + API)
```bash
cd apps/web
pnpm dev
```

Accès : `http://localhost:3000`

### Lancer l'application mobile
```bash
cd apps/mobile

# Android
flutter run

# iOS
flutter run -d ios

# Web (dev)
flutter run -d chrome
```

### Créer un premier compte admin
```bash
# Via l'API (curl ou Postman)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Principal",
    "email": "admin@shopflow.com",
    "password": "VotreMotDePasse123"
  }'
```

Ensuite, connectez-vous avec ces identifiants dans l'admin ou l'app mobile.

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentification

#### POST `/auth/register`
Créer un nouveau compte utilisateur.

**Body :**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response :**
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "user" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST `/auth/login`
Se connecter avec email/password.

**Body :**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response :**
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "user" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### GET `/auth/me`
Récupérer le profil de l'utilisateur connecté.

**Headers :**
```
Authorization: Bearer {token}
```

**Response :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Produits

#### GET `/products`
Récupérer tous les produits.

**Response :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Clavier Mécanique",
      "sku": "KEY-MECH-001",
      "quantity": 149,
      "created_at": "2026-02-11T00:31:47.822Z",
      "updated_at": "2026-02-11T00:31:47.822Z"
    }
  ]
}
```

#### POST `/products`
Créer un nouveau produit.

**Body :**
```json
{
  "name": "Souris Gaming",
  "sku": "MOUSE-GAME-001",
  "quantity": 50
}
```

**Response :**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Souris Gaming",
    "sku": "MOUSE-GAME-001",
    "quantity": 50
  },
  "message": "Product created successfully"
}
```

#### GET `/products/:id`
Récupérer un produit par ID.

**Response :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Clavier Mécanique",
    "sku": "KEY-MECH-001",
    "quantity": 149
  }
}
```

#### PUT `/products/:id`
Modifier un produit.

**Body :**
```json
{
  "name": "Clavier Mécanique RGB",
  "sku": "KEY-MECH-001",
  "quantity": 150
}
```

#### DELETE `/products/:id`
Supprimer un produit.

**Response :**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

#### POST `/products/:id/adjust`
Ajuster le stock d'un produit.

**Body :**
```json
{
  "adjustment": 10,
  "type": "restock",
  "user_id": 1
}
```

**Response :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "quantity": 159
  },
  "message": "Stock increased by 10"
}
```

#### GET `/products/:id/history`
Récupérer l'historique des mouvements d'un produit.

**Query params :**
- `limit` : Nombre de résultats (défaut: 50)

**Response :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "user_id": 1,
      "quantity": 10,
      "type": "restock",
      "created_at": "2026-02-15T10:30:00.000Z",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "product": {
        "id": 1,
        "name": "Clavier Mécanique",
        "sku": "KEY-MECH-001"
      }
    }
  ]
}
```

### Recherche

#### GET `/barcode?sku={sku}`
Rechercher un produit par code-barres/SKU.

**Response :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Clavier Mécanique",
    "sku": "KEY-MECH-001",
    "quantity": 149
  }
}
```

### Admin

#### GET `/admin/stats`
Récupérer les statistiques du dashboard.

**Response :**
```json
{
  "success": true,
  "data": {
    "active_users": 5,
    "total_products": 23,
    "total_quantity": 1547,
    "low_stock_alerts": 3
  }
}
```

#### GET `/admin/activity?limit=10`
Récupérer les logs d'activité récents.

**Response :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "action_type": "product_created",
      "description": "Produit ajouté: Clavier Mécanique",
      "created_at": "2026-02-15T10:30:00.000Z"
    }
  ]
}
```

#### GET `/auth/users`
Récupérer tous les utilisateurs (admin).

**Response :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "status": "active",
      "last_login": "2026-02-15T10:00:00.000Z",
      "created_at": "2026-02-11T00:00:00.000Z"
    }
  ]
}
```

---

##  Déploiement

### Admin Web sur Vercel
```bash
cd apps/web

# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

**Variables d'environnement à configurer sur Vercel :**
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`

### Application Mobile

#### Android
```bash
cd apps/mobile
flutter build apk --release
```

L'APK sera dans `build/app/outputs/flutter-apk/`

#### iOS
```bash
flutter build ios --release
```

Puis utilisez Xcode pour publier sur l'App Store.

---

##  Personnalisation

### Changer les couleurs

**Web (Tailwind)** : `apps/web/src/app/admin/styles/colors.ts`
```typescript
export const colors = {
  primary: '#8b5cf6',  // Violet
  secondary: '#d4af37', // Or
  // ...
};
```

**Mobile (Flutter)** : `apps/mobile/lib/theme/app_theme.dart`
```dart
static const Color primaryGold = Color(0xFFD4AF37);
static const Color primaryDark = Color(0xFF1A1D29);
```

---

---

---

##  Remerciements

- **Neon** pour l'hébergement de la base de données
- **Communautés Flutter & Next.js**

---

##  Support

Pour toute question ou problème :
- Email : support@shopflow.com
- Issues : [GitHub Issues](https://github.com/votre-repo/shopflow/issues)

---

**Développé avec par BONKOUNGOU Chantal, THIOMBIANO Jeannine, VAIMBAMBA Armand**# Stock_sales_management
