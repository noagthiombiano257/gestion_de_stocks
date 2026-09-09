'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Package, TrendingDown, Clock, Filter, X, Info, Calendar, User, MapPin, CheckCircle } from 'lucide-react';

interface Alert {
  id: string;
  type: 'low_stock' | 'expired' | 'movement' | 'threshold';
  severity: 'high' | 'medium' | 'low';
  product: {
    name: string;
    sku: string;
  };
  message: string;
  value: number;
  threshold: number;
  createdAt: string;
  resolved: boolean;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  useEffect(() => {
    // Simulate loading alerts
    setTimeout(() => {
      const mockAlerts: Alert[] = [
        {
          id: '1',
          type: 'low_stock',
          severity: 'high',
          product: { name: 'iPhone 15 Pro Max', sku: 'IPH15PM' },
          message: 'Stock critique - seulement 2 unités restantes',
          value: 2,
          threshold: 5,
          createdAt: '2024-01-15T10:30:00Z',
          resolved: false
        },
        {
          id: '2',
          type: 'expired',
          severity: 'medium',
          product: { name: 'Lait UHT 1L', sku: 'LAIT001' },
          message: 'Date de péremption dépassée depuis 3 jours',
          value: 15,
          threshold: 0,
          createdAt: '2024-01-14T15:45:00Z',
          resolved: false
        },
        {
          id: '3',
          type: 'threshold',
          severity: 'low',
          product: { name: 'Câble USB-C', sku: 'USB001' },
          message: 'Stock bas - 8 unités restantes',
          value: 8,
          threshold: 10,
          createdAt: '2024-01-13T09:15:00Z',
          resolved: true
        }
      ];
      setAlerts(mockAlerts);
      setLoading(false);
    }, 800);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'low_stock': return <Package className="w-5 h-5" />;
      case 'expired': return <Clock className="w-5 h-5" />;
      case 'movement': return <TrendingDown className="w-5 h-5" />;
      case 'threshold': return <AlertTriangle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unresolved') return !alert.resolved;
    if (filter === 'resolved') return alert.resolved;
    return true;
  });

  const handleMarkAsResolved = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Alertes Stock</h1>
          <p className="text-gray-400 mt-1">
            Surveillez les problèmes de stock en temps réel
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter('unresolved')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'unresolved' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Non résolues
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'resolved' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Résolues
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500/20">
              <AlertTriangle className="text-red-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Alertes critiques</p>
              <p className="text-2xl font-bold text-white">
                {alerts.filter(a => a.severity === 'high' && !a.resolved).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <Clock className="text-yellow-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">En attente</p>
              <p className="text-2xl font-bold text-white">
                {alerts.filter(a => !a.resolved).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500/20">
              <Package className="text-green-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Résolues</p>
              <p className="text-2xl font-bold text-white">
                {alerts.filter(a => a.resolved).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <TrendingDown className="text-blue-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-2xl font-bold text-white">{alerts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-[#252836] rounded-xl border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">
            Alertes {filter === 'unresolved' ? 'non résolues' : filter === 'resolved' ? 'résolues' : 'récentes'}
          </h2>
        </div>
        
        <div className="divide-y divide-gray-800">
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <p className="text-gray-400">Aucune alerte trouvée</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-6 hover:bg-gray-800/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                      {getTypeIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-white">{alert.product.name}</h3>
                        <span className="text-xs text-gray-400">({alert.product.sku})</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity === 'high' ? 'Critique' : 
                           alert.severity === 'medium' ? 'Moyen' : 'Faible'}
                        </span>
                        {alert.resolved && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                            Résolue
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 mb-3">{alert.message}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Actuel: {alert.value} unités</span>
                        <span>Seuil: {alert.threshold} unités</span>
                        <span>•</span>
                        <span>{new Date(alert.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!alert.resolved && (
                      <button 
                        onClick={() => handleMarkAsResolved(alert.id)}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium text-white transition-colors"
                      >
                        Marquer résolu
                      </button>
                    )}
                    <button 
                      onClick={() => handleViewDetails(alert)}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium text-white transition-colors"
                    >
                      Voir détails
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Alert Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1d29] rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg border ${getSeverityColor(selectedAlert.severity)}`}>
                    {getTypeIcon(selectedAlert.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">
                      Détails de l'alerte
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(selectedAlert.severity)}`}>
                        {selectedAlert.severity === 'high' ? 'Critique' : 
                         selectedAlert.severity === 'medium' ? 'Moyen' : 'Faible'}
                      </span>
                      {selectedAlert.resolved && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                          Résolue
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAlert(null)}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Nom du produit</p>
                    <p className="text-white font-medium">{selectedAlert.product.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">SKU</p>
                    <p className="text-white font-medium">{selectedAlert.product.sku}</p>
                  </div>
                </div>
              </div>

              {/* Alert Details */}
              <div className="bg-[#252836] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Info size={20} className="text-blue-400" />
                  Détails de l'alerte
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Type d'alerte</p>
                    <p className="text-white font-medium">
                      {selectedAlert.type === 'low_stock' ? 'Stock bas' : 
                       selectedAlert.type === 'expired' ? 'Produit périmé' : 
                       selectedAlert.type === 'movement' ? 'Mouvement anormal' : 'Seuil atteint'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Message</p>
                    <p className="text-white font-medium">{selectedAlert.message}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Valeur actuelle</p>
                      <p className="text-2xl font-bold text-white">{selectedAlert.value} unités</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Seuil critique</p>
                      <p className="text-2xl font-bold text-white">{selectedAlert.threshold} unités</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamp Information */}
              <div className="bg-[#252836] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-green-400" />
                  Informations temporelles
                </h3>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Date de création</p>
                  <p className="text-white font-medium">
                    {new Date(selectedAlert.createdAt).toLocaleString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                {!selectedAlert.resolved && (
                  <button 
                    onClick={() => {
                      handleMarkAsResolved(selectedAlert.id);
                      setSelectedAlert(null);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Marquer comme résolue
                  </button>
                )}
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}