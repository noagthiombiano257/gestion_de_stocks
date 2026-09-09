'use client';

import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, X, Package } from 'lucide-react';

interface LowStockAlert {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  low_stock_threshold: number;
  supplier: string | null;
  category_name: string | null;
  category_color: string | null;
}

export default function NotificationBell() {
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchAlerts();
    // Rafraîchir les alertes toutes les 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/notifications/low-stock');
      const data = await res.json();
      
      if (data.success) {
        setAlerts(data.data.alerts);
        setUnreadCount(data.data.alerts.length);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const markAsRead = () => {
    setUnreadCount(0);
  };

  const clearAll = async () => {
    // Dans une vraie application, vous voudriez envoyer une requête pour marquer toutes les alertes comme lues
    setAlerts([]);
    setUnreadCount(0);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Cloche de notification */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) {
            markAsRead();
          }
        }}
        className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown des notifications */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#252836] rounded-xl shadow-xl border border-gray-800 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="font-semibold text-white flex items-center">
              <AlertTriangle className="mr-2 text-yellow-500" size={18} />
              Alertes de stock ({alerts.length})
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Liste des alertes */}
          <div className="max-h-96 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="mx-auto text-gray-500 mb-3" size={32} />
                <p className="text-gray-400">Aucune alerte de stock bas</p>
                <p className="text-sm text-gray-500 mt-1">Tous vos produits ont un stock suffisant</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className="p-4 hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <Package className="text-yellow-500 mr-2" size={16} />
                          <h4 className="font-medium text-white truncate">
                            {alert.name}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">
                          <span className="font-mono">{alert.sku}</span>
                        </p>
                        <div className="flex items-center text-sm">
                          <span className="text-red-400 font-semibold">
                            {alert.quantity} en stock
                          </span>
                          <span className="mx-2 text-gray-500">•</span>
                          <span className="text-gray-400">
                            Seuil: {alert.low_stock_threshold}
                          </span>
                        </div>
                        {alert.category_name && (
                          <div className="mt-2">
                            <span 
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${alert.category_color || '#3b82f6'}20`,
                                color: alert.category_color || '#3b82f6'
                              }}
                            >
                              {alert.category_name}
                            </span>
                          </div>
                        )}
                        {alert.supplier && (
                          <p className="text-xs text-gray-500 mt-1">
                            Fournisseur: {alert.supplier}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {alerts.length > 0 && (
            <div className="p-3 border-t border-gray-700 flex justify-end">
              <button
                onClick={clearAll}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Tout marquer comme lu
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}