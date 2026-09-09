'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Package, Euro, Tag, Building, AlertTriangle } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number | null;
  category_name: string | null;
  supplier: string | null;
  low_stock_threshold: number;
  created_at: string;
  updated_at: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProduct(data.data);
        } else {
          setError(data.error || 'Produit non trouvé');
        }
      } else {
        setError('Produit non trouvé');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error fetching product:', err);
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

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-xl mb-4">{error || 'Produit non trouvé'}</div>
        <button
          onClick={() => router.back()}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
        >
          Retour
        </button>
      </div>
    );
  }

  const isLowStock = product.quantity < product.low_stock_threshold;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Retour
          </button>
          <h1 className="text-2xl font-bold text-white">Détails du produit</h1>
        </div>
        <button 
          onClick={() => router.push(`/admin/products/${productId}/edit`)}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Edit className="mr-2" size={16} />
          Modifier
        </button>
      </div>

      {/* Product Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Product Name & SKU */}
        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center mb-4">
            <Package className="text-blue-500 mr-3" size={24} />
            <h3 className="text-lg font-semibold text-white">Informations</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400">Nom</p>
              <p className="text-white font-medium">{product.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">SKU</p>
              <p className="text-gray-300 font-mono">{product.sku}</p>
            </div>
          </div>
        </div>

        {/* Stock Info */}
        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center mb-4">
            <div className={`p-2 rounded-lg ${isLowStock ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
              <Package className={isLowStock ? 'text-red-500' : 'text-green-500'} size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white ml-3">Stock</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400">Quantité actuelle</p>
              <p className={`text-2xl font-bold ${isLowStock ? 'text-red-400' : 'text-green-400'}`}>
                {product.quantity}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Seuil d'alerte</p>
              <p className="text-white">{product.low_stock_threshold}</p>
            </div>
            {isLowStock && (
              <div className="flex items-center text-red-400">
                <AlertTriangle className="mr-2" size={16} />
                <span className="text-sm font-medium">Stock bas</span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center mb-4">
            <Euro className="text-yellow-500 mr-3" size={24} />
            <h3 className="text-lg font-semibold text-white">Prix</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400">Prix unitaire</p>
              <p className="text-white text-xl font-bold">
                {product.price ? `${(product.price / 100).toFixed(2)} €` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Valeur totale</p>
              <p className="text-green-400 font-bold">
                {product.price 
                  ? `${((product.price / 100) * product.quantity).toFixed(2)} €`
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Supplier & Category */}
        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center mb-4">
            <Building className="text-purple-500 mr-3" size={24} />
            <h3 className="text-lg font-semibold text-white">Détails</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400">Catégorie</p>
              <div className="mt-1">
                {product.category_name ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400">
                    <Tag className="mr-1" size={14} />
                    {product.category_name}
                  </span>
                ) : (
                  <span className="text-gray-500">Non catégorisé</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400">Fournisseur</p>
              <p className="text-white">
                {product.supplier || 'Non spécifié'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Historique</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Date de création</p>
            <p className="text-white">
              {new Date(product.created_at).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Dernière mise à jour</p>
            <p className="text-white">
              {new Date(product.updated_at).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}