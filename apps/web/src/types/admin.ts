export interface DashboardStats {
  active_users: number;
  total_products: number;
  total_quantity: number;
  low_stock_alerts: number;
  critical_stock: number;
  total_movements_today: number;
  total_movements_month: number;
}

export interface StatCardData {
  label: string;
  value: string | number;
  icon: string;
  trend?: number; // Pourcentage de variation
  color: 'blue' | 'orange' | 'yellow' | 'red' | 'green' | 'purple';
}

export interface ActivityLog {
  id: number;
  user_id: number | null;
  action_type: string;
  description: string;
  entity_type: string | null;
  entity_id: number | null;
  metadata: any;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  avatar_url: string | null;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}