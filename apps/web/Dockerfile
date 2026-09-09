# Étape 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier package files
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY ../../pnpm-lock.yaml ../../

# Installer pnpm
RUN npm install -g pnpm

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier le code source
COPY . .

# Builder l'application
RUN pnpm build

# Étape 2: Production
FROM node:18-alpine AS runner

WORKDIR /app

# Créer l'utilisateur nextjs
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copier package files
COPY package*.json ./
COPY ../../pnpm-lock.yaml ../../

# Installer pnpm
RUN npm install -g pnpm

# Installer seulement les dépendances de production
RUN pnpm install --frozen-lockfile --prod

# Copier le build depuis l'étape builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Créer le répertoire .next/static
RUN mkdir .next/static

# Changer le propriétaire
RUN chown -R nextjs:nodejs /app/.next
RUN chown -R nextjs:nodejs /app/node_modules

USER nextjs

# Exposer le port 3000
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Démarrer l'application
CMD ["pnpm", "start"]
