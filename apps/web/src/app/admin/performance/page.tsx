'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Activity } from 'lucide-react';

interface PerformanceMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  icon: any;
  color: string;
}

export default function PerformancePage() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [conversionData, setConversionData] = useState<any[]>([]);

  const generateChartData = (days: number) => {
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        value: Math.floor(Math.random() * 5000) + 1000,
        conversion: Math.random() * 5 + 1
      });
    }
    
    return data;
  };

  useEffect(() => {
    // Simulate loading performance data
    setTimeout(() => {
      const mockMetrics: PerformanceMetric[] = [
        {
          id: 'revenue',
          title: 'Chiffre d\'affaires',
          value: '45 230 €',
          change: 12.5,
          icon: DollarSign,
          color: 'text-green-400'
        },
        {
          id: 'orders',
          title: 'Commandes',
          value: '1 247',
          change: 8.3,
          icon: ShoppingCart,
          color: 'text-blue-400'
        },
        {
          id: 'conversion',
          title: 'Taux de conversion',
          value: '3.2%',
          change: -2.1,
          icon: TrendingUp,
          color: 'text-yellow-400'
        },
        {
          id: 'customers',
          title: 'Nouveaux clients',
          value: '89',
          change: 15.7,
          icon: Users,
          color: 'text-purple-400'
        }
      ];
      
      // Generate chart data based on time range
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      const chartData = generateChartData(days);
      
      setMetrics(mockMetrics);
      setSalesData(chartData);
      setConversionData(chartData.map(d => ({ date: d.date, value: d.conversion })));
      setLoading(false);
    }, 800);
  }, [timeRange]);

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
          <h1 className="text-2xl font-bold text-white">Performance</h1>
          <p className="text-gray-400 mt-1">
            Analysez les performances commerciales
          </p>
        </div>
        <div className="flex bg-gray-800 rounded-lg p-1">
          {[
            { id: '7d', label: '7j' },
            { id: '30d', label: '30j' },
            { id: '90d', label: '90j' },
            { id: '1y', label: '1an' }
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === range.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.change >= 0;
          
          return (
            <div key={metric.id} className="bg-[#252836] rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{metric.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                  <div className={`flex items-center mt-2 ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isPositive ? (
                      <TrendingUp size={16} className="mr-1" />
                    ) : (
                      <TrendingDown size={16} className="mr-1" />
                    )}
                    <span className="text-sm font-medium">
                      {isPositive ? '+' : ''}{metric.change}%
                    </span>
                    <span className="text-gray-400 text-sm ml-1">vs période précédente</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${metric.color.replace('text-', 'bg-').replace('-400', '-500/20')}`}>
                  <Icon size={24} className={metric.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Évolution des ventes</h2>
            <div className="flex items-center gap-2 text-green-400">
              <TrendingUp size={20} />
              <span className="font-medium">+12.5%</span>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg p-4">
            <div className="h-full flex items-end justify-between gap-2">
              {salesData.slice(-14).map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t"
                    style={{ 
                      height: `${(item.value / Math.max(...salesData.map(d => d.value))) * 100}%`,
                      minHeight: '4px'
                    }}
                  />
                  <span className="text-xs text-gray-400 mt-1 rotate-45 origin-left">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Taux de conversion</h2>
            <div className="flex items-center gap-2 text-yellow-400">
              <TrendingDown size={20} />
              <span className="font-medium">-2.1%</span>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg p-4">
            <div className="h-full flex items-end justify-between gap-2">
              {conversionData.slice(-14).map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-yellow-500 to-orange-400 rounded-t"
                    style={{ 
                      height: `${(item.value / Math.max(...conversionData.map(d => d.value))) * 100}%`,
                      minHeight: '4px'
                    }}
                  />
                  <span className="text-xs text-gray-400 mt-1 rotate-45 origin-left">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Performance */}
      <div className="bg-[#252836] rounded-xl border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Détails des performances</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white">Top catégories</h3>
                <ShoppingCart className="text-blue-400" size={20} />
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Électronique', value: '35%', change: '+12%' },
                  { name: 'Vêtements', value: '28%', change: '+5%' },
                  { name: 'Alimentation', value: '22%', change: '-3%' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-300">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{item.value}</span>
                      <span className="text-green-400 text-sm">{item.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white">Canal de vente</h3>
                <Activity className="text-purple-400" size={20} />
              </div>
              <div className="space-y-3">
                {[
                  { name: 'En ligne', value: '65%', change: '+8%' },
                  { name: 'Magasin', value: '30%', change: '-2%' },
                  { name: 'Téléphone', value: '5%', change: '+15%' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-300">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{item.value}</span>
                      <span className="text-green-400 text-sm">{item.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white">Performance client</h3>
                <Users className="text-green-400" size={20} />
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Nouveaux', value: '89', change: '+15%' },
                  { name: 'Récurrence', value: '67%', change: '+3%' },
                  { name: 'Panier moyen', value: '85€', change: '+7%' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-300">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{item.value}</span>
                      <span className="text-green-400 text-sm">{item.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}