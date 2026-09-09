#!/bin/bash

# Script de déploiement Docker pour ShopFlow
echo "🚀 Déploiement de ShopFlow avec Docker..."

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord."
    exit 1
fi

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env à partir de .env.example..."
    cp .env.example .env
    echo "⚠️  Veuillez éditer le fichier .env avec vos configurations avant de continuer."
    echo "   Appuyez sur Entrée pour continuer ou Ctrl+C pour annuler..."
    read
fi

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose down

# Construire les images
echo "🔨 Construction des images Docker..."
docker-compose build --no-cache

# Démarrer les services
echo "🚀 Démarrage des services..."
docker-compose up -d

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 30

# Vérifier l'état des services
echo "📊 État des services:"
docker-compose ps

# Afficher les logs
echo "📋 Logs des services:"
docker-compose logs --tail=50

echo "✅ Déploiement terminé!"
echo "🌐 Application web: http://localhost:3000"
echo "📱 Pour l'application mobile, utilisez l'URL de l'API: http://localhost:3000"
echo ""
echo "🔧 Commandes utiles:"
echo "  - Voir les logs: docker-compose logs -f"
echo "  - Arrêter: docker-compose down"
echo "  - Redémarrer: docker-compose restart"
echo "  - Mettre à jour: docker-compose pull && docker-compose up -d"
