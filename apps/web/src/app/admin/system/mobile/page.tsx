'use client';

import { useState, useEffect } from 'react';
import { Download, Smartphone, QrCode, Wifi, Battery, Signal } from 'lucide-react';

interface MobileApp {
  id: string;
  deviceName: string;
  deviceModel: string;
  osVersion: string;
  appVersion: string;
  lastSync: string;
  status: 'online' | 'offline';
  batteryLevel: number;
  storageUsed: string;
  user: string;
}

export default function MobileAppsPage() {
  const [apps, setApps] = useState<MobileApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading mobile apps
    setTimeout(() => {
      const mockApps: MobileApp[] = [
        {
          id: '1',
          deviceName: 'iPhone de Marie',
          deviceModel: 'iPhone 14 Pro',
          osVersion: 'iOS 17.2',
          appVersion: '1.2.3',
          lastSync: '2024-01-15T14:30:00Z',
          status: 'online',
          batteryLevel: 87,
          storageUsed: '2.3 GB',
          user: 'marie.dubois@shopflow.fr'
        },
        {
          id: '2',
          deviceName: 'Samsung Galaxy',
          deviceModel: 'Galaxy S23',
          osVersion: 'Android 14',
          appVersion: '1.2.2',
          lastSync: '2024-01-15T12:15:00Z',
          status: 'offline',
          batteryLevel: 42,
          storageUsed: '1.8 GB',
          user: 'pierre.martin@shopflow.fr'
        },
        {
          id: '3',
          deviceName: 'iPad Pro',
          deviceModel: 'iPad Pro 12.9"',
          osVersion: 'iPadOS 17.2',
          appVersion: '1.2.3',
          lastSync: '2024-01-15T10:45:00Z',
          status: 'online',
          batteryLevel: 95,
          storageUsed: '3.1 GB',
          user: 'sophie.laurent@shopflow.fr'
        }
      ];
      setApps(mockApps);
      setLoading(false);
    }, 800);
  }, []);

  const getStatusColor = (status: string) => {
    return status === 'online' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getBatteryColor = (level: number) => {
    if (level > 70) return 'text-green-500';
    if (level > 30) return 'text-yellow-500';
    return 'text-red-500';
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
          <h1 className="text-2xl font-bold text-white">Applications Mobile</h1>
          <p className="text-gray-400 mt-1">
            Gérez les appareils mobiles connectés
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors">
          <Download size={20} />
          Télécharger l'app
        </button>
      </div>

      {/* QR Code Section */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-500/30 p-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white rounded-lg">
            <QrCode className="text-gray-800" size={48} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-2">Installer l'application mobile</h2>
            <p className="text-gray-300 mb-4">
              Scannez ce QR code avec votre appareil mobile pour télécharger l'application ShopFlow
            </p>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                <Smartphone size={18} />
                iOS App Store
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                <Download size={18} />
                Google Play
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Smartphone className="text-blue-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Appareils connectés</p>
              <p className="text-2xl font-bold text-white">
                {apps.filter(a => a.status === 'online').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500/20">
              <Wifi className="text-green-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Total appareils</p>
              <p className="text-2xl font-bold text-white">{apps.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <Signal className="text-purple-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Dernière synchro</p>
              <p className="text-2xl font-bold text-white">
                {new Date(Math.max(...apps.map(a => new Date(a.lastSync).getTime()))).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <Battery className="text-yellow-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Batterie moyenne</p>
              <p className="text-2xl font-bold text-white">
                {Math.round(apps.reduce((sum, a) => sum + a.batteryLevel, 0) / apps.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Apps List */}
      <div className="bg-[#252836] rounded-xl border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Appareils mobiles</h2>
        </div>
        
        <div className="divide-y divide-gray-800">
          {apps.length === 0 ? (
            <div className="p-12 text-center">
              <Smartphone className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <p className="text-gray-400">Aucun appareil mobile trouvé</p>
            </div>
          ) : (
            apps.map((app) => (
              <div key={app.id} className="p-6 hover:bg-gray-800/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gray-700">
                      <Smartphone className="text-gray-300" size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-white text-lg">{app.deviceName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status === 'online' ? 'En ligne' : 'Hors ligne'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="text-gray-300">
                          <span className="font-medium">Modèle:</span> {app.deviceModel}
                        </div>
                        <div className="text-gray-300">
                          <span className="font-medium">Utilisateur:</span> {app.user}
                        </div>
                        <div className="text-gray-300">
                          <span className="font-medium">OS:</span> {app.osVersion}
                        </div>
                        <div className="text-gray-300">
                          <span className="font-medium">Version app:</span> {app.appVersion}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Battery size={16} className={getBatteryColor(app.batteryLevel)} />
                          <span>{app.batteryLevel}%</span>
                        </div>
                        <span className="text-gray-400">
                          Stockage: <span className="text-white font-medium">{app.storageUsed}</span>
                        </span>
                        <span className="text-gray-400">
                          Dernière synchro: <span className="text-white font-medium">
                            {new Date(app.lastSync).toLocaleString('fr-FR')}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors">
                      Détails
                    </button>
                    <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium text-white transition-colors">
                      Déconnecter
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}