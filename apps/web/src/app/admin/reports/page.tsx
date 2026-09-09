'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, Users, Package, Calendar, TrendingUp } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number | null;
  supplier: string | null;
  category_name: string | null;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function ReportsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<'products' | 'users'>('products');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Récupérer les produits
      const productsRes = await fetch('/api/products');
      const productsData = await productsRes.json();
      
      // Récupérer les utilisateurs
      const usersRes = await fetch('/api/auth/users');
      const usersData = await usersRes.json();
      
      if (productsData.success) {
        setProducts(productsData.data);
      }
      
      if (usersData.success) {
        setUsers(usersData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCSV = (data: any[], headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          // Échapper les virgules et guillemets
          return typeof value === 'string' 
            ? `"${value.replace(/"/g, '""')}"`
            : value ?? '';
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  const downloadReport = () => {
    let csvContent = '';
    let filename = '';

    if (reportType === 'products') {
      const productHeaders = ['ID', 'Nom', 'SKU', 'Quantité', 'Prix', 'Catégorie', 'Fournisseur', 'Date_Création'];
      const productData = products.map(p => ({
        ID: p.id,
        Nom: p.name,
        SKU: p.sku,
        Quantité: p.quantity,
        Prix: p.price ? `${(p.price / 100).toFixed(2)} €` : 'N/A',
        Catégorie: p.category_name || 'Non catégorisé',
        Fournisseur: p.supplier || 'Non spécifié',
        Date_Création: new Date(p.created_at).toLocaleDateString('fr-FR')
      }));
      
      csvContent = generateCSV(productData, productHeaders);
      filename = `rapport_produits_${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      const userHeaders = ['ID', 'Nom', 'Email', 'Rôle', 'Date_Inscription'];
      const userData = users.map(u => ({
        ID: u.id,
        Nom: u.name,
        Email: u.email,
        Rôle: u.role,
        Date_Inscription: new Date(u.created_at).toLocaleDateString('fr-FR')
      }));
      
      csvContent = generateCSV(userData, userHeaders);
      filename = `rapport_utilisateurs_${new Date().toISOString().split('T')[0]}.csv`;
    }

    // Créer et télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          Rapports et Analytics
        </h1>
        <p className="text-gray-400">
          Générez des rapports détaillés de vos produits et utilisateurs
        </p>
      </div>

      {/* Sélecteur de type de rapport */}
      <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setReportType('products')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              reportType === 'products'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Package className="inline mr-2" size={16} />
            Rapport Produits
          </button>
          <button
            onClick={() => setReportType('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              reportType === 'users'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Users className="inline mr-2" size={16} />
            Rapport Utilisateurs
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center">
              <Package className="text-purple-400 mr-3" size={20} />
              <div>
                <p className="text-2xl font-bold text-white">
                  {products.length}
                </p>
                <p className="text-gray-400 text-sm">Total Produits</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="text-blue-400 mr-3" size={20} />
              <div>
                <p className="text-2xl font-bold text-white">
                  {users.length}
                </p>
                <p className="text-gray-400 text-sm">Total Utilisateurs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="text-green-400 mr-3" size={20} />
              <div>
                <p className="text-2xl font-bold text-white">
                  {products.reduce((sum, p) => sum + (p.price ? (p.price / 100) * p.quantity : 0), 0).toFixed(2)} €
                </p>
                <p className="text-gray-400 text-sm">Valeur Totale</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton de téléchargement */}
        <button
          onClick={downloadReport}
          className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <Download className="mr-2" size={18} />
          Télécharger le rapport CSV
        </button>
      </div>

      {/* Prévisualisation des données */}
      <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <FileText className="mr-2" size={20} />
          Prévisualisation des données
        </h3>
        
        <div className="overflow-x-auto">
          {reportType === 'products' ? (
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantité</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Prix</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Catégorie</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fournisseur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {products.slice(0, 10).map((product) => (
                  <tr key={product.id} className="hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-sm text-white">{product.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{product.sku}</td>
                    <td className="px-4 py-3 text-sm text-white">{product.quantity}</td>
                    <td className="px-4 py-3 text-sm text-white">
                      {product.price ? `${(product.price / 100).toFixed(2)} €` : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {product.category_name || 'Non catégorisé'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {product.supplier || 'Non spécifié'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rôle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Inscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-sm text-white">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{user.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {reportType === 'products' && products.length > 10 && (
          <p className="mt-4 text-sm text-gray-400">
            Affichage des 10 premiers produits. Le rapport complet contiendra {products.length} produits.
          </p>
        )}
      </div>
    </div>
  );
}