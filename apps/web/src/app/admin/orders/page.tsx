'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Package, Truck, CheckCircle, Clock, XCircle, Eye, Download, X, Info, Calendar, User, MapPin, CreditCard } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  date: string;
  paymentMethod: string;
  shippingAddress?: string;
  products?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Simulate loading orders
    setTimeout(() => {
      const mockOrders: Order[] = [
        {
          id: 'ORD-2024-001',
          customer: 'Marie Dubois',
          email: 'marie.dubois@email.com',
          total: 1249.99,
          status: 'delivered',
          items: 3,
          date: '2024-01-15T14:30:00Z',
          paymentMethod: 'Carte bancaire',
          shippingAddress: '123 Rue de la Paix, 75001 Paris, France',
          products: [
            { name: 'iPhone 15 Pro Max', quantity: 1, price: 999.99 },
            { name: 'Coque de protection', quantity: 1, price: 29.99 },
            { name: 'Film protecteur', quantity: 1, price: 19.99 }
          ]
        },
        {
          id: 'ORD-2024-002',
          customer: 'Pierre Martin',
          email: 'pierre.martin@email.com',
          total: 899.50,
          status: 'shipped',
          items: 2,
          date: '2024-01-14T10:15:00Z',
          paymentMethod: 'PayPal',
          shippingAddress: '45 Avenue des Champs-Élysées, 75008 Paris, France',
          products: [
            { name: 'MacBook Air M2', quantity: 1, price: 799.99 },
            { name: 'Souris Magic Mouse', quantity: 1, price: 99.51 }
          ]
        },
        {
          id: 'ORD-2024-003',
          customer: 'Sophie Laurent',
          email: 'sophie.laurent@email.com',
          total: 2450.00,
          status: 'processing',
          items: 5,
          date: '2024-01-13T16:45:00Z',
          paymentMethod: 'Virement',
          shippingAddress: '22 Rue du Commerce, 69002 Lyon, France',
          products: [
            { name: 'iPad Pro 12.9"', quantity: 1, price: 1299.00 },
            { name: 'Apple Pencil', quantity: 1, price: 129.00 },
            { name: 'Clavier Magic Keyboard', quantity: 1, price: 299.00 },
            { name: 'Coque iPad', quantity: 2, price: 49.50 }
          ]
        },
        {
          id: 'ORD-2024-004',
          customer: 'Jean Dupont',
          email: 'jean.dupont@email.com',
          total: 150.75,
          status: 'pending',
          items: 1,
          date: '2024-01-12T09:20:00Z',
          paymentMethod: 'Carte bancaire',
          shippingAddress: '8 Boulevard de la République, 44000 Nantes, France',
          products: [
            { name: 'AirPods Pro', quantity: 1, price: 150.75 }
          ]
        },
        {
          id: 'ORD-2024-005',
          customer: 'Claire Bernard',
          email: 'claire.bernard@email.com',
          total: 3200.25,
          status: 'cancelled',
          items: 4,
          date: '2024-01-11T13:30:00Z',
          paymentMethod: 'PayPal',
          shippingAddress: '15 Place de la Concorde, 75008 Paris, France',
          products: [
            { name: 'iMac 24"', quantity: 1, price: 1499.00 },
            { name: 'Moniteur externe', quantity: 1, price: 599.00 },
            { name: 'Webcam HD', quantity: 1, price: 129.25 },
            { name: 'Microphone USB', quantity: 1, price: 973.00 }
          ]
        }
      ];
      setOrders(mockOrders);
      setLoading(false);
    }, 800);
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'En attente' };
      case 'processing':
        return { icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'En préparation' };
      case 'shipped':
        return { icon: Truck, color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'Expédiée' };
      case 'delivered':
        return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Livrée' };
      case 'cancelled':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Annulée' };
      default:
        return { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-500/20', label: 'Inconnu' };
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filter === 'all' || order.status === filter;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const handleExport = () => {
    const csvContent = [
      ['ID Commande', 'Client', 'Email', 'Montant', 'Statut', 'Articles', 'Date', 'Méthode de paiement'],
      ...filteredOrders.map(order => [
        order.id,
        order.customer,
        order.email,
        order.total.toString(),
        getStatusInfo(order.status).label,
        order.items.toString(),
        new Date(order.date).toLocaleString('fr-FR'),
        order.paymentMethod
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `commandes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleOrderDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Commandes</h1>
          <p className="text-gray-400 mt-1">
            Gérez les commandes clients
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher une commande..."
            className="w-full pl-10 pr-4 py-3 bg-[#252836] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'pending' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            En attente
          </button>
          <button
            onClick={() => setFilter('processing')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'processing' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            En préparation
          </button>
          <button
            onClick={() => setFilter('shipped')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'shipped' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Expédiées
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Package className="text-blue-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Total commandes</p>
              <p className="text-2xl font-bold text-white">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500/20">
              <CheckCircle className="text-green-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Livrées</p>
              <p className="text-2xl font-bold text-white">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <Clock className="text-yellow-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">En attente</p>
              <p className="text-2xl font-bold text-white">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <Truck className="text-purple-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">CA total</p>
              <p className="text-2xl font-bold text-white">
                {orders.reduce((sum, order) => sum + order.total, 0).toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500/20">
              <XCircle className="text-red-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Annulées</p>
              <p className="text-2xl font-bold text-white">
                {orders.filter(o => o.status === 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-[#252836] rounded-xl border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Commandes récentes</h2>
        </div>
        
        <div className="divide-y divide-gray-800">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <p className="text-gray-400">Aucune commande trouvée</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={order.id} className="p-6 hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gray-700">
                        <Package className="text-gray-300" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-white">{order.id}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color} border ${statusInfo.bg.replace('/20', '/30')}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-gray-300"><span className="font-medium">Client:</span> {order.customer}</p>
                            <p className="text-gray-300"><span className="font-medium">Email:</span> {order.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-300"><span className="font-medium">Montant:</span> {order.total.toLocaleString('fr-FR', {
                              style: 'currency',
                              currency: 'EUR'
                            })}</p>
                            <p className="text-gray-300"><span className="font-medium">Articles:</span> {order.items} produits</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>Paiement: {order.paymentMethod}</span>
                          <span>•</span>
                          <span>{new Date(order.date).toLocaleString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewOrder(order)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleOrderDetails(order)}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium text-white transition-colors"
                      >
                        Détails
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1d29] rounded-xl border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gray-700">
                    <Package className="text-gray-300" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">
                      Détails de la commande {selectedOrder.id}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(selectedOrder.status).bg} ${getStatusInfo(selectedOrder.status).color} border ${getStatusInfo(selectedOrder.status).bg.replace('/20', '/30')}`}>
                        {getStatusInfo(selectedOrder.status).label}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-[#252836] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <User size={20} className="text-blue-400" />
                  Informations client
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Nom du client</p>
                    <p className="text-white font-medium">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Email</p>
                    <p className="text-white font-medium">{selectedOrder.email}</p>
                  </div>
                  {selectedOrder.shippingAddress && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-400 mb-1">Adresse de livraison</p>
                      <p className="text-white font-medium">{selectedOrder.shippingAddress}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Information */}
              <div className="bg-[#252836] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Info size={20} className="text-purple-400" />
                  Informations commande
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Montant total</p>
                    <p className="text-2xl font-bold text-white">
                      {selectedOrder.total.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Méthode de paiement</p>
                    <p className="text-white font-medium flex items-center gap-2">
                      <CreditCard size={16} className="text-gray-400" />
                      {selectedOrder.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Nombre d'articles</p>
                    <p className="text-2xl font-bold text-white">{selectedOrder.items}</p>
                  </div>
                </div>
              </div>

              {/* Products */}
              {selectedOrder.products && (
                <div className="bg-[#252836] rounded-lg p-4 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Package size={20} className="text-green-400" />
                    Produits commandés
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.products.map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-[#1a1d29] rounded-lg border border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Package size={16} className="text-purple-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{product.name}</p>
                            <p className="text-sm text-gray-400">Quantité: {product.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">
                            {(product.price * product.quantity).toLocaleString('fr-FR', {
                              style: 'currency',
                              currency: 'EUR'
                            })}
                          </p>
                          <p className="text-sm text-gray-400">
                            {product.price.toLocaleString('fr-FR', {
                              style: 'currency',
                              currency: 'EUR'
                            })} / unité
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamp Information */}
              <div className="bg-[#252836] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-green-400" />
                  Informations temporelles
                </h3>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Date de commande</p>
                  <p className="text-white font-medium">
                    {new Date(selectedOrder.date).toLocaleString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                >
                  Fermer
                </button>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2">
                  <Download size={18} />
                  Exporter PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}