'use client';

import { useEffect, useState } from 'react';
import StatCard from './components/StatCard';
import SalesChart from './components/SalesChart';
import ActivityTimeline from './components/ActivityTimeline';
import UsersTable from './components/UsersTable';
import { useCurrency } from './providers/CurrencyProvider';

// Fonction pour récupérer les stats
async function getStats() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/stats`, {
      next: { revalidate: 30 }, // Cache pendant 30 secondes
    });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
}

// Fonction pour récupérer le prix total des produits
async function getTotalPrice() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    
    if (data.success) {
      const products = data.data;
      const totalPrice = products.reduce((sum: number, product: any) => {
        return sum + (product.price ? product.price * product.quantity : 0);
      }, 0);
      
      return totalPrice;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching total price:', error);
    return 0;
  }
}

// Fonction pour récupérer les activités
async function getActivities() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/activity?limit=5`, {
      next: { revalidate: 60 }, // Cache pendant 60 secondes
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
}

// Fonction pour récupérer les utilisateurs
async function getUsers() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/users`, {
      next: { revalidate: 60 }, // Cache pendant 60 secondes
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// Générer des données de graphique basées sur les mouvements
function generateChartData() {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: `${date.getDate()}/${date.getMonth() + 1}`,
      value: Math.floor(Math.random() * 100) + 50,
    });
  }
  
  return data;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { formatAmount } = useCurrency();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, activitiesData, usersData, priceData] = await Promise.all([
          getStats(),
          getActivities(),
          getUsers(),
          getTotalPrice()
        ]);
        
        setStats(statsData);
        setActivities(activitiesData);
        setUsers(usersData);
        setTotalPrice(priceData / 100); // Convertir cents en euros
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = generateChartData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Tableau de bord administrateur
        </h1>
        <p className="text-gray-400">
          Vue d'ensemble de votre système de gestion de stock
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          label="Utilisateurs actifs"
          value={stats?.active_users || 0}
          icon="users"
          trend={12}
          color="blue"
        />
        <StatCard
          label="Produits en stock"
          value={stats?.total_products || 0}
          icon="package"
          trend={8}
          color="orange"
        />
        <StatCard
          label="Quantité totale"
          value={stats?.total_quantity || 0}
          icon="trending-up"
          trend={24}
          color="yellow"
        />
        <StatCard
          label="Prix total des stocks"
          value={formatAmount(totalPrice)}
          icon="dollar-sign"
          color="green"
        />
        <StatCard
          label="Alertes stock bas"
          value={stats?.low_stock_alerts || 0}
          icon="alert-triangle"
          trend={-5}
          color="red"
        />
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <ActivityTimeline activities={activities} />
        </div>
      </div>

      {/* Users Table */}
      <UsersTable users={users.slice(0, 5)} />
    </div>
  );
}