'use client';

import { useState } from 'react';
import { BookOpen, Search, Copy, Check, ExternalLink } from 'lucide-react';

interface DocumentationSection {
  id: string;
  title: string;
  content: string;
  icon: string;
}

export default function DocumentationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const documentationSections: DocumentationSection[] = [
    {
      id: 'overview',
      title: 'Vue d\'ensemble de l\'application',
      content: `ShopFlow est une application de gestion de stock complète conçue pour les entreprises modernes. L'application offre une interface intuitive permettant de gérer efficacement les produits, les commandes, les fournisseurs et les mouvements de stock.

L'architecture suit les principes du développement web moderne avec Next.js 14, TypeScript, et une base de données PostgreSQL. L'application est conçue selon une approche mobile-first avec un design sombre élégant et responsive.

**Caractéristiques principales:**
- Interface administrateur complète
- Gestion multi-devises (EUR, FCFA, USD)
- Système de thèmes (clair/sombre)
- Gestion des catégories de produits
- Suivi des mouvements de stock
- Analyse des performances commerciales
- Gestion des commandes et fournisseurs`,
      icon: '📊'
    },
    {
      id: 'authentication',
      title: 'Système d\'authentification',
      content: `L'application dispose d'un système d'authentification robuste avec plusieurs niveaux d'accès:

**Types d'utilisateurs:**
- **Administrateurs**: Accès complet à toutes les fonctionnalités
- **Gestionnaires**: Gestion des produits et commandes
- **Lecteurs**: Accès en lecture seule aux rapports

**Fonctionnalités:**
- Connexion sécurisée avec JWT
- Mode invité pour démonstration
- Gestion des sessions persistantes
- Déconnexion sécurisée avec vidage du stockage

**Sécurité:**
- Protection CSRF
- Validation des tokens
- Timeout de session configurable
- Journalisation des activités`,
      icon: '🔒'
    },
    {
      id: 'products',
      title: 'Gestion des produits',
      content: `La section produits permet une gestion complète de votre catalogue:

**Champs de produit:**
- Nom et SKU (identifiant unique)
- Quantité en stock
- Prix (en centimes pour éviter les erreurs de précision)
- Catégorie (liée à la table des catégories)
- Seuil d'alerte de stock bas
- Fournisseur

**Fonctionnalités:**
- Ajout/modification/suppression de produits
- Recherche et filtrage avancé
- Scan de codes-barres
- Gestion des images de produits
- Historique des modifications

**Validation:**
- SKU unique obligatoire
- Format de prix validé
- Seuils de stock configurables`,
      icon: '📦'
    },
    {
      id: 'categories',
      title: 'Système de catégories',
      content: `Le système de catégories permet d'organiser vos produits de manière hiérarchique:

**Gestion des catégories:**
- Création de nouvelles catégories
- Modification des catégories existantes
- Attribution de couleurs personnalisées
- Suppression (si aucune dépendance)

**Fonctionnalités:**
- Interface de gestion complète
- Choix de couleurs avec sélecteur
- Comptage des produits par catégorie
- Tri et recherche des catégories

**Intégration:**
- Liaison directe avec les produits
- Affichage coloré dans les listes
- Filtres par catégorie dans les rapports`,
      icon: '🏷️'
    },
    {
      id: 'inventory',
      title: 'Gestion du stock et mouvements',
      content: `Le suivi des mouvements de stock est essentiel pour maintenir des niveaux optimaux:

**Types de mouvements:**
- **Entrées**: Réceptions de fournisseurs, retours
- **Sorties**: Ventes, transferts, casse
- **Ajustements**: Corrections d'inventaire

**Traçabilité:**
- Utilisateur responsable
- Motif du mouvement
- Horodatage précis
- Emplacement physique

**Alertes:**
- Stock bas selon seuils configurés
- Péremption des produits
- Ruptures de stock
- Surstocks`,
      icon: '🔄'
    },
    {
      id: 'orders',
      title: 'Gestion des commandes',
      content: `Le système de commandes gère le cycle complet de vente:

**Statuts de commande:**
- **En attente**: Nouvelle commande reçue
- **En préparation**: Préparation en cours
- **Expédiée**: Commande envoyée
- **Livrée**: Commande terminée
- **Annulée**: Commande annulée

**Informations de commande:**
- Détails du client
- Articles commandés
- Montant total
- Méthode de paiement
- Historique des statuts

**Fonctionnalités:**
- Suivi en temps réel
- Notifications automatiques
- Export des données
- Statistiques de performance`,
      icon: '🛒'
    },
    {
      id: 'suppliers',
      title: 'Gestion des fournisseurs',
      content: `Une gestion efficace des fournisseurs est cruciale pour l'approvisionnement:

**Informations fournisseur:**
- Coordonnées complètes
- Personne de contact
- Historique des commandes
- Statistiques d'achat
- Évaluation des performances

**Fonctionnalités:**
- Fiche détaillée par fournisseur
- Suivi des dépenses
- Historique des livraisons
- Gestion des contrats
- Communication intégrée

**Intégration:**
- Liaison avec les produits
- Automatisation des commandes
- Suivi des délais de livraison`,
      icon: '🚚'
    },
    {
      id: 'analytics',
      title: 'Analyse et rapports',
      content: `Les outils d'analyse fournissent des insights précieux pour la prise de décision:

**Tableaux de bord:**
- KPI commerciaux en temps réel
- Graphiques d'évolution
- Comparaisons périodiques
- Alertes personnalisées

**Types de rapports:**
- Performance des ventes
- Rotation de stock
- Analyse des catégories
- Comportement client
- Rentabilité par produit

**Export:**
- Formats PDF, Excel, CSV
- Personnalisation des périodes
- Automatisation des rapports
- Partage sécurisé`,
      icon: '📈'
    },
    {
      id: 'settings',
      title: 'Configuration et personnalisation',
      content: `L'application est hautement configurable pour s'adapter à vos besoins:

**Paramètres généraux:**
- Informations de l'entreprise
- Fuseaux horaires
- Langues et formats
- Paramètres régionaux

**Apparence:**
- Thèmes clair/sombre
- Couleurs personnalisées
- Logo et branding
- Disposition de l'interface

**Système:**
- Gestion des utilisateurs
- Rôles et permissions
- Journaux d'activité
- Sauvegarde des données

**Multi-devises:**
- Support des principales devises
- Taux de change automatiques
- Conversion en temps réel
- Taux personnalisés`,
      icon: '⚙️'
    },
    {
      id: 'simulated-features',
      title: 'Fonctionnalités simulées',
      content: `Certaines fonctionnalités sont simulées pour démonstration:

**API simulées:**
- Données de démonstration réalistes
- Réponses d'API avec délais
- Erreurs simulées pour test
- Données cohérentes entre sections

**Fonctionnalités en développement:**
- Intégration avec systèmes externes
- Notification push
- Export avancé
- Intelligence artificielle

**Limitations actuelles:**
- Données non persistantes entre sessions
- Pas de synchronisation en temps réel
- Interface utilisateur statique
- Pas de traitement batch

**Roadmap:**
- Intégration API complète
- Synchronisation mobile
- Machine learning pour prévisions
- IoT pour capteurs de stock`,
      icon: '🧪'
    },
    {
      id: 'technical',
      title: 'Architecture technique',
      content: `L'application suit les meilleures pratiques de développement moderne:

**Frontend:**
- Next.js 14 avec App Router
- TypeScript pour la sécurité de type
- Tailwind CSS pour le styling
- React Context pour la gestion d'état
- Hooks personnalisés

**Backend:**
- API Routes Next.js
- PostgreSQL avec Drizzle ORM
- JWT pour l'authentification
- Validation avec Zod

**Déploiement:**
- Monorepo avec pnpm
- CI/CD automatisé
- Docker pour containerisation
- Hébergement cloud scalable

**Performance:**
- Chargement progressif
- Mise en cache stratégique
- Optimisation des images
- Bundle splitting`,
      icon: '💻'
    }
  ];

  const filteredSections = documentationSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Documentation</h1>
        <p className="text-gray-400 mt-1">
          Guide complet de l'application ShopFlow
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher dans la documentation..."
          className="w-full pl-10 pr-4 py-3 bg-[#252836] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {documentationSections.slice(0, 4).map((section) => (
          <button
            key={section.id}
            onClick={() => {
              const element = document.getElementById(section.id);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-[#252836] hover:bg-[#2d303e] rounded-lg p-4 border border-gray-800 transition-colors text-left"
          >
            <div className="text-2xl mb-2">{section.icon}</div>
            <h3 className="font-medium text-white text-sm">{section.title}</h3>
          </button>
        ))}
      </div>

      {/* Documentation Content */}
      <div className="space-y-6">
        {filteredSections.length === 0 ? (
          <div className="bg-[#252836] rounded-xl p-12 text-center border border-gray-800">
            <BookOpen className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400">Aucune section de documentation trouvée</p>
          </div>
        ) : (
          filteredSections.map((section) => (
            <div 
              key={section.id} 
              id={section.id}
              className="bg-[#252836] rounded-xl border border-gray-800 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{section.icon}</div>
                    <h2 className="text-xl font-bold text-white">{section.title}</h2>
                  </div>
                  <button
                    onClick={() => copyToClipboard(section.content, section.id)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-colors"
                  >
                    {copiedId === section.id ? (
                      <>
                        <Check size={16} />
                        Copié!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copier
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-line text-gray-300 leading-relaxed">
                    {section.content}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>ID: {section.id}</span>
                    <span>Dernière mise à jour: Janvier 2024</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white mb-2">Besoin d'aide supplémentaire?</h3>
            <p className="text-gray-400 text-sm">
              Consultez notre centre d'aide ou contactez le support technique
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors">
            <ExternalLink size={20} />
            Centre d'aide
          </button>
        </div>
      </div>
    </div>
  );
}