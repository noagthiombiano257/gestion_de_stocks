'use client';

import { Users, Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: 'users' | 'package' | 'trending-up' | 'alert-triangle' | 'dollar-sign';
  trend?: number;
  color: 'blue' | 'orange' | 'yellow' | 'red' | 'green' | 'purple';
}

const iconMap = {
  'users': Users,
  'package': Package,
  'trending-up': TrendingUp,
  'alert-triangle': AlertTriangle,
  'dollar-sign': DollarSign,
};

const colorMap = {
  blue: {
    bg: 'bg-blue-500/10',
    icon: 'text-blue-500',
    badge: 'bg-emerald-500/10 text-emerald-500',
  },
  orange: {
    bg: 'bg-orange-500/10',
    icon: 'text-orange-500',
    badge: 'bg-emerald-500/10 text-emerald-500',
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    icon: 'text-yellow-500',
    badge: 'bg-emerald-500/10 text-emerald-500',
  },
  red: {
    bg: 'bg-red-500/10',
    icon: 'text-red-500',
    badge: 'bg-red-500/10 text-red-500',
  },
  green: {
    bg: 'bg-emerald-500/10',
    icon: 'text-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-500',
  },
  purple: {
    bg: 'bg-purple-500/10',
    icon: 'text-purple-500',
    badge: 'bg-emerald-500/10 text-emerald-500',
  },
};

export default function StatCard({ label, value, icon, trend, color }: StatCardProps) {
  const Icon = iconMap[icon as keyof typeof iconMap];
  const colors = colorMap[color];
  const isNegative = trend !== undefined && trend < 0;
  const badgeColors = isNegative ? 'bg-red-500/10 text-red-500' : colors.badge;

  return (
    <div className="bg-[#252836] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          <Icon className={colors.icon} size={24} />
        </div>
        {trend !== undefined && (
          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${badgeColors}`}>
            {isNegative ? '' : '+'}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value.toLocaleString()}</h3>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}