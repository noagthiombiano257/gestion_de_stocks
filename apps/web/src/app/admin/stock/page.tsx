import { Package, Plus, Search } from 'lucide-react';
import ProductsGrid from './components/ProductsGrid';

// Fonction pour récupérer les produits
async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products`, {
      next: { revalidate: 30 },
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function StockPage() {
  const products = await getProducts();

  // Calculer les stats rapides
  const totalProducts = products.length;
  const lowStock = products.filter((p: any) => p.quantity < 10).length;
  const totalQuantity = products.reduce((sum: number, p: any) => sum + p.quantity, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestion de Stock</h1>
          <p className="text-gray-400">Gérez votre inventaire de produits</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-[#0f1115] rounded-lg font-semibold hover:bg-[#c29d2f] transition-colors">
          <Plus size={20} />
          Ajouter un produit
        </button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Produits Total</p>
              <p className="text-3xl font-bold text-white">{totalProducts}</p>
            </div>
            <div className="p-3 bg-[#d4af37]/10 rounded-lg">
              <Package className="text-[#d4af37]" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Stock Bas</p>
              <p className="text-3xl font-bold text-white">{lowStock}</p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-lg">
              <Package className="text-red-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Quantité Totale</p>
              <p className="text-3xl font-bold text-white">{totalQuantity}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <Package className="text-emerald-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-[#252836] rounded-xl p-4 border border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un produit par nom ou SKU..."
              className="w-full bg-[#1a1d29] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-[#8b5cf6]"
            />
          </div>
          <button className="px-4 py-2.5 bg-[#1a1d29] border border-gray-700 rounded-lg text-white hover:bg-gray-800 transition-colors">
            Filtrer
          </button>
        </div>
      </div>

      {/* Grille de produits */}
      {products.length === 0 ? (
        <div className="bg-[#252836] rounded-xl p-12 border border-gray-800 text-center">
          <Package className="mx-auto mb-4 text-gray-600" size={64} />
          <h3 className="text-xl font-semibold text-white mb-2">Aucun produit</h3>
          <p className="text-gray-400 mb-6">Commencez par ajouter votre premier produit</p>
          <button className="px-6 py-3 bg-[#d4af37] text-[#0f1115] rounded-lg font-semibold hover:bg-[#c29d2f] transition-colors">
            Ajouter un produit
          </button>
        </div>
      ) : (
        <ProductsGrid products={products} />
      )}
    </div>
  );
}