'use client';

import { useState, useEffect } from 'react';
import { Filter, Calendar, Package, Plus, Minus, ArrowUpDown, Search, Download, X, Info, User, MapPin, Barcode } from 'lucide-react';

interface Movement {
  id: string;
  productId: number;
  productName: string;
  sku: string;
  type: 'entry' | 'exit' | 'adjustment';
  quantity: number;
  reason: string;
  user: string;
  timestamp: string;
  location: string;
}

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [filter, setFilter] = useState<'all' | 'entry' | 'exit' | 'adjustment'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);

  useEffect(() => {
    // Simulate loading movements
    setTimeout(() => {
      const mockMovements: Movement[] = [
        {
          id: 'MOV-2024-001',
          productId: 1,
          productName: 'iPhone 15 Pro Max',
          sku: 'IPH15PM',
          type: 'entry',
          quantity: 25,
          reason: 'Livraison fournisseur TechSupply',
          user: 'admin@shopflow.fr',
          timestamp: '2024-01-15T14:30:00Z',
          location: 'Entrepôt A'
        },
        {
          id: 'MOV-2024-002',
          productId: 2,
          productName: 'Casque Bluetooth',
          sku: 'CASQ001',
          type: 'exit',
          quantity: 8,
          reason: 'Vente en magasin',
          user: 'marie.dubois@shopflow.fr',
          timestamp: '2024-01-15T13:45:00Z',
          location: 'Magasin principal'
        },
        {
          id: 'MOV-2024-003',
          productId: 3,
          productName: 'Bouteille de gaz',
          sku: 'GAZ001',
          type: 'adjustment',
          quantity: -3,
          reason: 'Péremption produit',
          user: 'pierre.martin@shopflow.fr',
          timestamp: '2024-01-15T12:20:00Z',
          location: 'Entrepôt B'
        },
        {
          id: 'MOV-2024-004',
          productId: 1,
          productName: 'iPhone 15 Pro Max',
          sku: 'IPH15PM',
          type: 'exit',
          quantity: 2,
          reason: 'Commande client #ORD-2024-001',
          user: 'sophie.laurent@shopflow.fr',
          timestamp: '2024-01-15T11:15:00Z',
          location: 'Préparation commande'
        },
        {
          id: 'MOV-2024-005',
          productId: 4,
          productName: 'Calendrier 2024',
          sku: 'CAL2024',
          type: 'entry',
          quantity: 100,
          reason: 'Nouvelle saison',
          user: 'admin@shopflow.fr',
          timestamp: '2024-01-15T10:05:00Z',
          location: 'Entrepôt A'
        }
      ];
      setMovements(mockMovements);
      setLoading(false);
    }, 800);
  }, []);

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'entry':
        return { icon: Plus, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Entrée' };
      case 'exit':
        return { icon: Minus, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Sortie' };
      case 'adjustment':
        return { icon: ArrowUpDown, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Ajustement' };
      default:
        return { icon: Package, color: 'text-gray-400', bg: 'bg-gray-500/20', label: 'Inconnu' };
    }
  };

  const filteredMovements = movements.filter(movement => {
    const matchesType = filter === 'all' || movement.type === filter;
    const matchesSearch = 
      movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const handleExport = () => {
    const csvContent = [
      ['ID Mouvement', 'Produit', 'SKU', 'Type', 'Quantité', 'Motif', 'Utilisateur', 'Emplacement', 'Date'],
      ...filteredMovements.map(movement => [
        movement.id,
        movement.productName,
        movement.sku,
        getTypeInfo(movement.type).label,
        movement.quantity.toString(),
        movement.reason,
        movement.user,
        movement.location,
        new Date(movement.timestamp).toLocaleString('fr-FR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mouvements_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMovementDetails = (movement: Movement) => {
    setSelectedMovement(movement);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Mouvements de stock</h1>
          <p className="text-gray-400 mt-1">
            Historique des mouvements de stock
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un mouvement..."
            className="w-full pl-10 pr-4 py-3 bg-[#252836] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('entry')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'entry' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Entrées
          </button>
          <button
            onClick={() => setFilter('exit')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'exit' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sorties
          </button>
          <button
            onClick={() => setFilter('adjustment')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'adjustment' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Ajustements
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <ArrowUpDown className="text-blue-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Total mouvements</p>
              <p className="text-2xl font-bold text-white">{movements.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500/20">
              <Plus className="text-green-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Entrées</p>
              <p className="text-2xl font-bold text-white">
                {movements.filter(m => m.type === 'entry').reduce((sum, m) => sum + m.quantity, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500/20">
              <Minus className="text-red-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Sorties</p>
              <p className="text-2xl font-bold text-white">
                {Math.abs(movements.filter(m => m.type === 'exit').reduce((sum, m) => sum + m.quantity, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <Package className="text-yellow-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Produits concernés</p>
              <p className="text-2xl font-bold text-white">
                {new Set(movements.map(m => m.productId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Movements List */}
      <div className="bg-[#252836] rounded-xl border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Historique des mouvements</h2>
        </div>
        
        <div className="divide-y divide-gray-800">
          {filteredMovements.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <p className="text-gray-400">Aucun mouvement trouvé</p>
            </div>
          ) : (
            filteredMovements.map((movement) => {
              const typeInfo = getTypeInfo(movement.type);
              const TypeIcon = typeInfo.icon;
              
              return (
                <div key={movement.id} className="p-6 hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${typeInfo.bg}`}>
                        <TypeIcon className={typeInfo.color} size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-white">{movement.productName}</h3>
                          <span className="text-gray-400 text-sm">({movement.sku})</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.bg} ${typeInfo.color} border ${typeInfo.bg.replace('/20', '/30')}`}>
                            {typeInfo.label}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-gray-300">
                              <span className="font-medium">Quantité:</span> 
                              <span className={`ml-2 font-bold ${
                                movement.quantity > 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                              </span>
                            </p>
                            <p className="text-gray-300"><span className="font-medium">Motif:</span> {movement.reason}</p>
                          </div>
                          <div>
                            <p className="text-gray-300"><span className="font-medium">Utilisateur:</span> {movement.user}</p>
                            <p className="text-gray-300"><span className="font-medium">Emplacement:</span> {movement.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>ID: {movement.id}</span>
                          <span>•</span>
                          <span>{new Date(movement.timestamp).toLocaleString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleMovementDetails(movement)}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium text-white transition-colors"
                    >
                      Détails
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Movement Details Modal */}
      {selectedMovement && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1d29] rounded-xl border border-gray-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${getTypeInfo(selectedMovement.type).bg}`}>
                    {(() => {
                      const Icon = getTypeInfo(selectedMovement.type).icon;
                      return <Icon className={getTypeInfo(selectedMovement.type).color} size={24} />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">
                      Détails du mouvement {selectedMovement.id}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeInfo(selectedMovement.type).bg} ${getTypeInfo(selectedMovement.type).color} border ${getTypeInfo(selectedMovement.type).bg.replace('/20', '/30')}`}>
                        {getTypeInfo(selectedMovement.type).label}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedMovement(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Product Information */}
              <div className="bg-[#252836] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Package size={20} className="text-purple-400" />
                  Informations du produit
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Nom du produit</p>
                    <p className="text-white font-medium">{selectedMovement.productName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">SKU</p>
                    <p className="text-white font-medium flex items-center gap-2">
                      <Barcode size={16} className="text-gray-400" />
                      {selectedMovement.sku}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">ID Produit</p>
                    <p className="text-white font-medium">#{selectedMovement.productId}</p>
                  </div>
                </div>
              </div>

              {/* Movement Details */}
              <div className="bg-[#252836] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Info size={20} className="text-blue-400" />
                  Détails du mouvement
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Type de mouvement</p>
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${getTypeInfo(selectedMovement.type).bg}`}>
                        {(() => {
                          const Icon = getTypeInfo(selectedMovement.type).icon;
                          return <Icon className={getTypeInfo(selectedMovement.type).color} size={20} />;
                        })()}
                      </div>
                      <p className="text-white font-medium text-lg">
                        {getTypeInfo(selectedMovement.type).label}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Quantité</p>
                    <p className={`text-3xl font-bold ${
                      selectedMovement.quantity > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {selectedMovement.quantity > 0 ? '+' : ''}{selectedMovement.quantity} unités
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-1">Motif du mouvement</p>
                  <div className="p-3 bg-[#1a1d29] rounded-lg border border-gray-700">
                    <p className="text-white font-medium">{selectedMovement.reason}</p>
                  </div>
                </div>
              </div>

              {/* User and Location Information */}
              <div className="bg-[#252836] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <User size={20} className="text-green-400" />
                  Informations d'exécution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Utilisateur</p>
                    <p className="text-white font-medium flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      {selectedMovement.user}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Emplacement</p>
                    <p className="text-white font-medium flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      {selectedMovement.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timestamp Information */}
              <div className="bg-[#252836] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-yellow-400" />
                  Informations temporelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Date et heure</p>
                    <p className="text-white font-medium">
                      {new Date(selectedMovement.timestamp).toLocaleString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Timestamp</p>
                    <p className="text-white font-mono text-sm">{selectedMovement.timestamp}</p>
                  </div>
                </div>
              </div>

              {/* Impact Summary */}
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/30">
                <h3 className="text-lg font-semibold text-white mb-3">Résumé de l'impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Mouvement</p>
                    <p className={`text-xl font-bold ${
                      selectedMovement.quantity > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {selectedMovement.quantity > 0 ? 'Entrée' : 'Sortie'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Magnitude</p>
                    <p className="text-xl font-bold text-white">
                      {Math.abs(selectedMovement.quantity)} unités
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Type</p>
                    <p className="text-xl font-bold text-purple-400">
                      {getTypeInfo(selectedMovement.type).label}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  onClick={() => setSelectedMovement(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                >
                  Fermer
                </button>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2">
                  <Download size={18} />
                  Exporter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}