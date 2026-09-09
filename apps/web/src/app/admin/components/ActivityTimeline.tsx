'use client';

import { UserPlus, Package, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Activity {
  id: number;
  action_type: string;
  description: string;
  created_at: string;
  user?: {
    name: string;
  };
}

interface ActivityTimelineProps {
  activities: Activity[];
}

const getActivityIcon = (actionType: string) => {
  switch (actionType) {
    case 'user_created':
      return { icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-500/10' };
    case 'stock_updated':
    case 'product_created':
      return { icon: Package, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    case 'stock_alert':
      return { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
    default:
      return { icon: Package, color: 'text-gray-500', bg: 'bg-gray-500/10' };
  }
};

const getActivityTitle = (actionType: string) => {
  switch (actionType) {
    case 'user_created':
      return 'Nouvel utilisateur inscrit';
    case 'stock_updated':
      return 'Stock mis à jour';
    case 'product_created':
      return 'Nouveau produit ajouté';
    case 'stock_alert':
      return 'Alerte stock bas';
    default:
      return 'Activité';
  }
};

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-6">Activité récente</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const { icon: Icon, color, bg } = getActivityIcon(activity.action_type);
          const title = getActivityTitle(activity.action_type);
          
          return (
            <div key={activity.id} className="flex gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={color} size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{title}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(activity.created_at), { 
                    addSuffix: true,
                    locale: fr 
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}