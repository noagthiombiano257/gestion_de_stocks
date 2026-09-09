'use client';

import { MoreVertical, Package, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  created_at: string;
}

interface ProductsGridProps {
  products: Product[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [showMenu, setShowMenu] = useState(false);

  // Déterminer la couleur du badge selon le stock
  const getBadgeColor = () => {
    if (product.quantity < 10) return 'bg-red-500/20 text-red-500';
    if (product.quantity < 30) return 'bg-yellow-500/20 text-yellow-500';
    return 'bg-emerald-500/20 text-emerald-500';
  };

  return (
    <div className="bg-[#252836] rounded-xl border border-gray-800 hover:border-gray-700 transition-all overflow-hidden group">
      {/* Header avec menu */}
      <div className="p-6 relative">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <MoreVertical className="text-gray-400" size={20} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1d29] border border-gray-700 rounded-lg shadow-xl z-10">
              <button className="w-full px-4 py-2.5 text-left text-white hover:bg-gray-800 flex items-center gap-3 transition-colors">
                <Edit size={16} />
                <span>Modifier</span>
              </button>
              <button className="w-full px-4 py-2.5 text-left text-white hover:bg-gray-800 flex items-center gap-3 transition-colors">
                <TrendingUp size={16} />
                <span>Ajuster stock</span>
              </button>
              <div className="border-t border-gray-700"></div>
              <button className="w-full px-4 py-2.5 text-left text-red-500 hover:bg-gray-800 flex items-center gap-3 transition-colors">
                <Trash2 size={16} />
                <span>Supprimer</span>
              </button>
            </div>
          )}
        </div>

        {/* Icône produit */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-[#d4af37]/10 rounded-full flex items-center justify-center">
            <Package className="text-[#d4af37]" size={36} />
          </div>
        </div>

        {/* Infos produit */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-400 mb-4">SKU: {product.sku}</p>

          {/* Badge stock */}
          <div className="inline-flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${getBadgeColor()}`}>
              Stock: {product.quantity}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-[#1a1d29] border-t border-gray-800">
        <button className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors">
          Voir les détails
        </button>
      </div>
    </div>
  );
}