'use client';

import { useState, useEffect } from 'react';
import { Filter, Calendar, User, Activity, Search, Eye, X, Shield, Monitor, MapPin, Clock } from 'lucide-react';

interface LogEntry {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  status: 'success' | 'failed';
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  useEffect(() => {
    // Simulate loading logs
    setTimeout(() => {
      const mockLogs: LogEntry[] = [
        {
          id: '1',
          user: 'admin@shopflow.fr',
          action: 'LOGIN',
          resource: 'Authentification',
          timestamp: '2024-01-15T14:30:22Z',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          status: 'success'
        },
        {
          id: '2',
          user: 'manager@shopflow.fr',
          action: 'CREATE',
          resource: 'Produit #PROD-001',
          timestamp: '2024-01-15T13:45:17Z',
          ip: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          status: 'success'
        },
        {
          id: '3',
          user: 'guest@shopflow.fr',
          action: 'ACCESS_DENIED',
          resource: 'Rapports financiers',
          timestamp: '2024-01-15T12:20:05Z',
          ip: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
          status: 'failed'
        },
        {
          id: '4',
          user: 'admin@shopflow.fr',
          action: 'UPDATE',
          resource: 'Paramètres système',
          timestamp: '2024-01-15T11:15:33Z',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          status: 'success'
        },
        {
          id: '5',
          user: 'manager@shopflow.fr',
          action: 'DELETE',
          resource: 'Produit #PROD-045',
          timestamp: '2024-01-15T10:05:41Z',
          ip: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          status: 'success'
        }
      ];
      setLogs(mockLogs);
      setLoading(false);
    }, 800);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesStatus = filter === 'all' || log.status === filter;
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    return status === 'success' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const handleViewLog = (log: LogEntry) => {
    setSelectedLog(log);
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
          <h1 className="text-2xl font-bold text-white">Journaux d'activité</h1>
          <p className="text-gray-400 mt-1">
            Historique des actions et événements système
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
              Tous
            </button>
            <button
              onClick={() => setFilter('success')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'success' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Réussis
            </button>
            <button
              onClick={() => setFilter('failed')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'failed' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Échoués
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher dans les journaux..."
          className="w-full pl-10 pr-4 py-3 bg-[#252836] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Activity className="text-blue-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Total événements</p>
              <p className="text-2xl font-bold text-white">{logs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500/20">
              <User className="text-green-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Actions réussies</p>
              <p className="text-2xl font-bold text-white">
                {logs.filter(l => l.status === 'success').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500/20">
              <Activity className="text-red-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Actions échouées</p>
              <p className="text-2xl font-bold text-white">
                {logs.filter(l => l.status === 'failed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <Calendar className="text-purple-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Utilisateurs uniques</p>
              <p className="text-2xl font-bold text-white">
                {new Set(logs.map(l => l.user)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-[#252836] rounded-xl border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Événements récents</h2>
        </div>
        
        <div className="divide-y divide-gray-800">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center">
              <Activity className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <p className="text-gray-400">Aucun événement trouvé</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-gray-800/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg border ${getStatusColor(log.status)}`}>
                      <Activity size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-white">{log.user}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                          {log.status === 'success' ? 'Réussi' : 'Échoué'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-2 text-gray-300">
                        <span className="font-medium">{log.action}</span>
                        <span>sur</span>
                        <span className="text-purple-400">{log.resource}</span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <span>IP: {log.ip}</span>
                        <span>•</span>
                        <span>{new Date(log.timestamp).toLocaleString('fr-FR')}</span>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-2 truncate">
                        {log.userAgent}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleViewLog(log)}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1d29] rounded-xl border border-gray-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg border ${getStatusColor(selectedLog.status)}`}>
                    <Activity size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">
                      Détails de l'événement #{selectedLog.id}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLog.status)}`}>
                        {selectedLog.status === 'success' ? 'Réussi' : 'Échoué'}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* User Information */}
              <div className="bg-[#252836] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <User size={20} className="text-blue-400" />
                  Informations utilisateur
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Utilisateur</p>
                    <p className="text-white font-medium text-lg">{selectedLog.user}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Adresse IP</p>
                    <p className="text-white font-medium flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      {selectedLog.ip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Information */}
              <div className="bg-[#252836] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield size={20} className="text-purple-400" />
                  Détails de l'action
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Action effectuée</p>
                    <p className="text-white font-medium text-lg">{selectedLog.action}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Ressource ciblée</p>
                    <p className="text-white font-medium text-lg">{selectedLog.resource}</p>
                  </div>
                </div>
              </div>

              {/* Technical Information */}
              <div className="bg-[#252836] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Monitor size={20} className="text-green-400" />
                  Informations techniques
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Navigateur (User Agent)</p>
                    <div className="p-3 bg-[#1a1d29] rounded-lg border border-gray-700">
                      <p className="text-white font-mono text-sm break-all">{selectedLog.userAgent}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamp Information */}
              <div className="bg-[#252836] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-yellow-400" />
                  Informations temporelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Date et heure</p>
                    <p className="text-white font-medium">
                      {new Date(selectedLog.timestamp).toLocaleString('fr-FR', {
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
                    <p className="text-white font-mono text-sm">{selectedLog.timestamp}</p>
                  </div>
                </div>
              </div>

              {/* Security Analysis */}
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/30">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Shield size={20} className="text-red-400" />
                  Analyse de sécurité
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Niveau de risque</p>
                    <p className={`text-xl font-bold ${
                      selectedLog.status === 'failed' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {selectedLog.status === 'failed' ? 'Élevé' : 'Bas'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Type d'événement</p>
                    <p className="text-xl font-bold text-purple-400">
                      {selectedLog.action === 'LOGIN' ? 'Connexion' :
                       selectedLog.action === 'CREATE' ? 'Création' :
                       selectedLog.action === 'UPDATE' ? 'Mise à jour' :
                       selectedLog.action === 'DELETE' ? 'Suppression' :
                       selectedLog.action === 'ACCESS_DENIED' ? 'Accès refusé' : 'Autre'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Statut</p>
                    <p className={`text-xl font-bold ${
                      selectedLog.status === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {selectedLog.status === 'success' ? 'Réussi' : 'Échoué'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                >
                  Fermer
                </button>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2">
                  <Eye size={18} />
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