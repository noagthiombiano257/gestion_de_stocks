# Étape 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier package files
COPY package*.json ./
COPY db/package*.json ./db/
COPY ../pnpm-lock.yaml ../

# Installer pnpm
RUN npm install -g pnpm

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier le code source
COPY . .

# Builder la base de données
RUN cd db && pnpm db:push

# Étape 2: Production
FROM node:18-alpine AS runner

WORKDIR /app

# Créer l'utilisateur node
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copier package files
COPY package*.json ./
COPY db/package*.json ./db/
COPY ../pnpm-lock.yaml ../

# Installer pnpm
RUN npm install -g pnpm

# Installer seulement les dépendances de production
RUN pnpm install --frozen-lockfile --prod

# Copier le code source
COPY . .

# Copier les modules construits depuis l'étape builder
COPY --from=builder /app/db/dist ./db/dist
COPY --from=builder /app/db/node_modules ./db/node_modules

# Créer les répertoires nécessaires
RUN mkdir -p scripts

# Copier les scripts
COPY scripts/ ./scripts/

# Changer le propriétaire
RUN chown -R nodejs:nodejs /app

USER nodejs

# Exposer le port pour l'API (si nécessaire)
EXPOSE 3001

# Variables d'environnement
ENV NODE_ENV=production

# Point d'entrée
CMD ["node", "scripts/create_real_users.js"]
