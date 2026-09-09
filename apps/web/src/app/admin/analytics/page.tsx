'use client';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Package, Users, Activity } from 'lucide-react';
import SalesChart from '../components/SalesChart';
import { useCurrency } from '../providers/CurrencyProvider';

interface Stats {
  total_products: number;
  total_stock_value: number;
  low_stock_items: number;
  recent_movements: number;
  total_users: number;
  active_users: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { formatAmount } = useCurrency();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch multiple stats in parallel
      const [productsRes, usersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/auth/users')
      ]);

      if (productsRes.ok && usersRes.ok) {
        const productsData = await productsRes.json();
        const usersData = await usersRes.json();

        if (productsData.success && usersData.success) {
          const products = productsData.data || [];
          const users = usersData.data || [];

          // Calculate stats
          const totalStockValue = products.reduce((sum: number, product: any) => {
            return sum + (product.price ? (product.price / 100) * product.quantity : 0);
          }, 0);

          const lowStockItems = products.filter((product: any) => 
            product.quantity < product.low_stock_threshold
          ).length;

          setStats({
            total_products: products.length,
            total_stock_value: totalStockValue,
            low_stock_items: lowStockItems,
            recent_movements: 0, // Will be updated when we have movement API
            total_users: users.length,
            active_users: users.filter((u: any) => u.status === 'active').length
          });
        }
      }
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
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
      <div>
        <h1 className="text-2xl font-bold text-white">Analytiques</h1>
        <p className="text-gray-400 mt-1">
          Tableau de bord des performances et statistiques
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Package className="text-blue-500" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Total Produits</p>
                <p className="text-2xl font-bold text-white">{stats.total_products}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-500/20">
                <DollarSign className="text-green-500" size={24} />
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-sm text-gray-400">Valeur Totale</p>
                <div className="group relative">
                  <p className="text-xl font-bold text-white truncate">
                    {formatAmount(stats.total_stock_value)}
                  </p>
                  <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 2
                    }).format(stats.total_stock_value)}
                    <div className="absolute top-full left-4 -mt-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-500/20">
                <Activity className="text-red-500" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Stock Bas</p>
                <p className="text-2xl font-bold text-white">{stats.low_stock_items}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <BarChart3 className="text-purple-500" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Mouvements Récents</p>
                <p className="text-2xl font-bold text-white">{stats.recent_movements}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-500/20">
                <Users className="text-yellow-500" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Utilisateurs</p>
                <p className="text-2xl font-bold text-white">{stats.total_users}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-cyan-500/20">
                <TrendingUp className="text-cyan-500" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Actifs</p>
                <p className="text-2xl font-bold text-white">{stats.active_users}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Chart */}
      <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-6">Performance Commerciale</h2>
        <SalesChart />
      </div>

      {/* Recent Activity */}
      <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-6">Activité Récente</h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-800/30 rounded-lg">
            <div className="p-2 rounded-lg bg-green-500/20 mr-4">
              <Activity className="text-green-500" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Nouveau produit ajouté</p>
              <p className="text-gray-400 text-sm">iPhone 15 Pro Max - Il y a 2 heures</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-800/30 rounded-lg">
            <div className="p-2 rounded-lg bg-blue-500/20 mr-4">
              <Package className="text-blue-500" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Mouvement de stock</p>
              <p className="text-gray-400 text-sm">Sortie de 5 unités - Il y a 4 heures</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-800/30 rounded-lg">
            <div className="p-2 rounded-lg bg-purple-500/20 mr-4">
              <Users className="text-purple-500" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Nouvel utilisateur</p>
              <p className="text-gray-400 text-sm">marie.dupont@entreprise.com - Aujourd'hui</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}