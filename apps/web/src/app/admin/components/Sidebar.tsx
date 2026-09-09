'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  Package, 
  Users, 
  Shield, 
  FileText,
  Settings,
  // Nouvelles icônes
  TrendingUp,
  AlertTriangle,
  Truck,
  Calendar,
  Zap,
  Palette,
  Globe,
  CreditCard,
  Wrench
} from 'lucide-react';

const menuItems = {
  principal: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Produits', href: '/admin/products' },
    { icon: BarChart3, label: 'Analytiques', href: '/admin/analytics' },
    { icon: FileText, label: 'Rapports', href: '/admin/reports' },
    { icon: AlertTriangle, label: 'Alertes Stock', href: '/admin/alerts' },
    { icon: TrendingUp, label: 'Performance', href: '/admin/performance' },
  ],
  gestion: [
    { icon: Truck, label: 'Fournisseurs', href: '/admin/suppliers' },
    { icon: Calendar, label: 'Commandes', href: '/admin/orders' },
    { icon: Zap, label: 'Mouvements', href: '/admin/movements' },
    { icon: Wrench, label: 'Catégories', href: '/admin/categories' },
  ],
  configuration: [
    { icon: Settings, label: 'Paramètres généraux', href: '/admin/settings/general' },
    { icon: Palette, label: 'Apparence & Thème', href: '/admin/settings/theme' },
    { icon: Globe, label: 'Multi-devises', href: '/admin/settings/currencies' },
  ],
  systeme: [
    { icon: Shield, label: 'Rôles & Permissions', href: '/admin/system/roles' },
    { icon: FileText, label: "Journaux d'activité", href: '/admin/system/logs' },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1a1d29] border-r border-gray-800 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-[#8b5cf6]">StockAdmin</h1>
        <p className="text-sm text-gray-400 mt-1">Panel administrateur</p>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-6">
        {/* PRINCIPAL */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Principal
          </p>
          <div className="space-y-1">
            {menuItems.principal.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:translate-x-1 ${
                    active
                      ? 'bg-[#8b5cf6] text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* GESTION */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Gestion
          </p>
          <div className="space-y-1">
            {menuItems.gestion.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:translate-x-1 ${
                    active
                      ? 'bg-[#8b5cf6] text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CONFIGURATION */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Configuration
          </p>
          <div className="space-y-1">
            {menuItems.configuration.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:translate-x-1 ${
                    active
                      ? 'bg-[#8b5cf6] text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* SYSTÈME */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Système
          </p>
          <div className="space-y-1">
            {menuItems.systeme.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:translate-x-1 ${
                    active
                      ? 'bg-[#8b5cf6] text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}