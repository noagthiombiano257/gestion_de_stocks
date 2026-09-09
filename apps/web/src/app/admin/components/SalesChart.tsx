'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SalesData {
  month: string;
  transactionCount: number;
  totalRevenue: number;
  averageTransactionValue: number;
  uniqueProductsSold: number;
}

interface SalesMetrics {
  totalRevenue: number;
  totalTransactions: number;
  averageMonthlyRevenue: number;
  growthRate: number;
}

interface SalesApiResponse {
  success: boolean;
  data?: {
    monthlyData: SalesData[];
    metrics: SalesMetrics;
    period: string;
  };
  error?: string;
}

export default function SalesChart() {
  const [salesData, setSalesData] = useState<SalesData[] | null>(null);
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timePeriod, setTimePeriod] = useState(6);

  useEffect(() => {
    fetchSalesData();
  }, [timePeriod]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      
      // Generate simulated data for demonstration
      const simulatedData = generateSimulatedData(timePeriod);
      setSalesData(simulatedData.monthlyData);
      setMetrics(simulatedData.metrics);
      
      // In a real implementation, you would fetch from API:
      // const response = await fetch(`/api/sales?months=${timePeriod}`);
      // const result: SalesApiResponse = await response.json();
      // if (result.success && result.data) {
      //   setSalesData(result.data.monthlyData);
      //   setMetrics(result.data.metrics);
      // } else {
      //   setError(result.error || 'Failed to load sales data');
      // }
      
    } catch (err) {
      setError('Network error while fetching sales data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSimulatedData = (months: number) => {
    const monthlyData: SalesData[] = [];
    const now = new Date();
    
    // Generate realistic sales data with growth trend
    let baseRevenue = 15000;
    let totalRevenue = 0;
    let totalTransactions = 0;
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const growthFactor = 1 + (Math.random() * 0.3 - 0.1); // ±15% variation
      const revenue = Math.round(baseRevenue * growthFactor);
      
      const transactions = Math.floor(revenue / (50 + Math.random() * 100));
      const avgTransaction = revenue / transactions;
      
      monthlyData.push({
        month: date.toISOString(),
        transactionCount: transactions,
        totalRevenue: revenue,
        averageTransactionValue: avgTransaction,
        uniqueProductsSold: Math.floor(transactions * 0.7)
      });
      
      totalRevenue += revenue;
      totalTransactions += transactions;
      baseRevenue *= 1.08; // 8% average monthly growth
    }
    
    const averageMonthlyRevenue = totalRevenue / months;
    const growthRate = ((monthlyData[monthlyData.length - 1].totalRevenue - monthlyData[0].totalRevenue) / monthlyData[0].totalRevenue) * 100;
    
    return {
      monthlyData,
      metrics: {
        totalRevenue,
        totalTransactions,
        averageMonthlyRevenue,
        growthRate
      }
    };
  };

  const formatMonthLabel = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const chartData = {
    labels: salesData?.map(d => formatMonthLabel(d.month)) || [],
    datasets: [
      {
        label: 'Chiffre d\'affaires (€)',
        data: salesData?.map(d => d.totalRevenue) || [],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(139, 92, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e5e7eb',
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: `Évolution du chiffre d'affaires (${timePeriod} derniers mois)`,
        color: '#ffffff',
        font: {
          size: 18,
          weight: 'bold' as const
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 30, 40, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e5e7eb',
        borderColor: 'rgba(139, 92, 246, 0.8)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            })}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12
          },
          callback: function(value: any) {
            return value.toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            });
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    }
  };

  if (loading) {
    return (
      <div className="h-96 bg-gray-800/50 rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 bg-gray-800/50 rounded-lg flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="font-medium">Erreur de chargement</p>
          <p className="text-sm mt-2">{error}</p>
          <button 
            onClick={fetchSalesData}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {[3, 6, 12].map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timePeriod === period
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              {period} mois
            </button>
          ))}
        </div>
        
        {metrics && (
          <div className="text-right">
            <p className="text-sm text-gray-400">Taux de croissance</p>
            <p className={`text-xl font-bold flex items-center ${
              metrics.growthRate >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {metrics.growthRate >= 0 ? '↗' : '↘'} 
              <span className="ml-1">{Math.abs(metrics.growthRate).toFixed(1)}%</span>
            </p>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-96 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-4 border border-gray-700/50">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Metrics Summary */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-700">
          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <p className="text-2xl font-bold text-white truncate">
              {metrics.totalRevenue.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              })}
            </p>
            <p className="text-sm text-gray-400 mt-1">CA Total</p>
          </div>
          
          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <p className="text-2xl font-bold text-white">
              {metrics.totalTransactions.toLocaleString('fr-FR')}
            </p>
            <p className="text-sm text-gray-400 mt-1">Transactions</p>
          </div>
          
          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <p className="text-2xl font-bold text-white truncate">
              {metrics.averageMonthlyRevenue.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              })}
            </p>
            <p className="text-sm text-gray-400 mt-1">Moyenne/mois</p>
          </div>
          
          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <p className="text-2xl font-bold text-white">
              {salesData?.length || 0}
            </p>
            <p className="text-sm text-gray-400 mt-1">Mois analysés</p>
          </div>
        </div>
      )}
    </div>
  );
}