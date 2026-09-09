import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/products_provider.dart';
import '../providers/auth_provider.dart';
import '../widgets/app_drawer.dart';
import '../widgets/product_grid.dart';
import '../theme/app_theme.dart';
import 'product_detail_screen.dart';
import 'scanner_screen.dart';
import 'add_product_screen.dart';

class ProductsListScreen extends StatefulWidget {
  const ProductsListScreen({super.key});

  @override
  State<ProductsListScreen> createState() => _ProductsListScreenState();
}

class _ProductsListScreenState extends State<ProductsListScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(
      () => context.read<ProductsProvider>().fetchProducts(),
    );
  }

  Future<void> _handleRefresh() async {
    await context.read<ProductsProvider>().fetchProducts();
  }

  void _handleProductTap(product) {
    final isGuest = context.read<AuthProvider>().isGuestMode;

    if (isGuest) {
      // Mode invité : afficher seulement les détails en lecture seule
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text(product.name),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('SKU: ${product.sku}'),
              const SizedBox(height: 8),
              Text('Stock: ${product.quantity}'),
              const SizedBox(height: 16),
              const Text(
                'Connectez-vous pour modifier ce produit',
                style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Fermer'),
            ),
          ],
        ),
      );
    } else {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => ProductDetailScreen(product: product),
        ),
      );
    }
  }

  Future<void> _handleMenuAction(product, String action) async {
    final isGuest = context.read<AuthProvider>().isGuestMode;

    if (isGuest && action != 'view') {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Connectez-vous pour effectuer cette action'),
          backgroundColor: AppTheme.warning,
        ),
      );
      return;
    }

    switch (action) {
      case 'view':
        _handleProductTap(product);
        break;
      case 'edit':
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ProductDetailScreen(product: product),
          ),
        );
        break;
      case 'delete':
        _showDeleteDialog(product);
        break;
    }
  }

  void _showDeleteDialog(product) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Supprimer le produit'),
        content: Text('Êtes-vous sûr de vouloir supprimer "${product.name}" ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () async {
              final success = await context
                  .read<ProductsProvider>()
                  .deleteProduct(product.id);
              if (context.mounted) {
                Navigator.pop(context);
                if (success) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('✓ Produit supprimé'),
                      backgroundColor: AppTheme.success,
                    ),
                  );
                }
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.danger),
            child: const Text('Supprimer'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isGuest = context.watch<AuthProvider>().isGuestMode;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pushReplacementNamed(context, '/dashboard'),
        ),
        title: const Text('Produits'),
        actions: [
          if (isGuest)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Chip(
                avatar: const Icon(Icons.visibility, size: 16),
                label:
                    const Text('Mode lecture', style: TextStyle(fontSize: 12)),
                backgroundColor: AppTheme.warning.withOpacity(0.2),
              ),
            ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _handleRefresh,
          ),
        ],
      ),
      drawer: const AppDrawer(currentRoute: 'products'),
      body: RefreshIndicator(
        onRefresh: _handleRefresh,
        child: Consumer<ProductsProvider>(
          builder: (context, provider, child) {
            if (provider.isLoading && provider.products.isEmpty) {
              return const Center(
                  child: CircularProgressIndicator(color: AppTheme.primary));
            }

            if (provider.error != null && provider.products.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline,
                        size: 64, color: AppTheme.danger),
                    const SizedBox(height: 16),
                    Text('Erreur de connexion',
                        style: Theme.of(context).textTheme.headlineSmall),
                    const SizedBox(height: 8),
                    Text(provider.error!, textAlign: TextAlign.center),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: _handleRefresh,
                      child: const Text('Réessayer'),
                    ),
                  ],
                ),
              );
            }

            if (provider.products.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.inventory_2_outlined,
                        size: 64, color: AppTheme.textSecondary),
                    const SizedBox(height: 16),
                    Text('Aucun produit',
                        style: Theme.of(context).textTheme.headlineSmall),
                    const SizedBox(height: 8),
                    const Text('Ajoutez votre premier produit'),
                  ],
                ),
              );
            }

            return ProductGrid(
              products: provider.products,
              isGuest: isGuest,
              onProductTap: _handleProductTap,
              onMenuAction: _handleMenuAction,
            );
          },
        ),
      ),
      floatingActionButton: isGuest
          ? FloatingActionButton.extended(
              onPressed: () {
                Navigator.pushNamed(context, '/login');
              },
              icon: const Icon(Icons.login),
              label: const Text('Se connecter'),
              backgroundColor: AppTheme.primary,
            )
          : Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                FloatingActionButton(
                  heroTag: 'scanner',
                  backgroundColor: AppTheme.success,
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const ScannerScreen()),
                    );
                  },
                  child: const Icon(Icons.qr_code_scanner),
                ),
                const SizedBox(height: 16),
                FloatingActionButton(
                  heroTag: 'add',
                  backgroundColor: AppTheme.primary,
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const AddProductScreen()),
                    );
                  },
                  child: const Icon(Icons.add),
                ),
              ],
            ),
    );
  }
}
