import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../providers/products_provider.dart';
import '../providers/auth_provider.dart';
import '../widgets/app_drawer.dart';
import '../theme/app_theme.dart';
import 'product_detail_screen.dart';
import 'scanner_screen.dart';
import 'add_product_screen.dart';
import '../utils/product_icon_helper.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
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
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ProductDetailScreen(product: product),
      ),
    );
  }

  void _navigateToProducts() {
    Navigator.pushNamed(context, '/products');
  }

  void _navigateToPOS() {
    Navigator.pushNamed(context, '/pos');
  }

  void _navigateToSalesHistory() {
    Navigator.pushNamed(context, '/sales-history');
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
        // TODO: Naviguer vers écran d'édition
        break;
      case 'adjust':
        _showAdjustDialog(product);
        break;
      case 'delete':
        _showDeleteDialog(product);
        break;
    }
  }

  void _showAdjustDialog(product) {
    final adjustmentController = TextEditingController();
    final reasonController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Ajuster stock - ${product.name}'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: adjustmentController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Quantité (+ ou -)',
                border: OutlineInputBorder(),
                hintText: '+10 ou -5',
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: reasonController,
              decoration: const InputDecoration(
                labelText: 'Raison',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () async {
              final adjustment = int.tryParse(adjustmentController.text);
              if (adjustment == null) return;

              final success =
                  await context.read<ProductsProvider>().adjustStock(
                        id: product.id,
                        adjustment: adjustment,
                        reason: reasonController.text.isEmpty
                            ? 'Ajustement manuel'
                            : reasonController.text,
                      );

              if (context.mounted) {
                Navigator.pop(context);
                if (success) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('✓ Stock ajusté avec succès'),
                      backgroundColor: AppTheme.success,
                    ),
                  );
                }
              }
            },
            child: const Text('Ajuster'),
          ),
        ],
      ),
    );
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
        title: Text(
          'Gestion de Stock',
          style:
              Theme.of(context).textTheme.headlineLarge?.copyWith(fontSize: 24),
        ),
        actions: [
          if (isGuest)
            IconButton(
              icon: const Icon(Icons.person),
              onPressed: () {
                Navigator.pushNamed(context, '/login');
              },
              tooltip: 'Se connecter / S\'inscrire',
            ),
        ],
      ),
      drawer: const AppDrawer(currentRoute: 'dashboard'),
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

            // Calcul des statistiques
            final totalProducts = provider.products.length;
            final lowStock =
                provider.products.where((p) => p.quantity < 10).length;
            final totalQuantity =
                provider.products.fold<int>(0, (sum, p) => sum + p.quantity);
            final criticalStock =
                provider.products.where((p) => p.quantity < 5).length;
            final totalPrice = provider.products
                .fold<double>(0.0, (sum, p) => sum + p.totalValue);

            return CustomScrollView(
              slivers: [
                // Section de navigation principale
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Navigation',
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: _buildDashboardButton(
                                context,
                                icon: Icons.inventory_2,
                                label: 'Produits',
                                color: AppTheme.primary,
                                onTap: _navigateToProducts,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: _buildDashboardButton(
                                context,
                                icon: Icons.point_of_sale,
                                label: 'Point de Vente',
                                color: AppTheme.success,
                                onTap: _navigateToPOS,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: _buildDashboardButton(
                                context,
                                icon: Icons.history,
                                label: 'Historique',
                                color: Colors.orange,
                                onTap: _navigateToSalesHistory,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: _buildDashboardButton(
                                context,
                                icon: Icons.settings,
                                label: 'Paramètres',
                                color: Colors.grey,
                                onTap: () => Navigator.pushNamed(context, '/settings'),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                // Statistiques
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        // Première ligne : 4 cartes
                        Row(
                          children: [
                            Expanded(
                              child: _StatCard(
                                title: 'Produits',
                                value: '$totalProducts',
                                icon: Icons.inventory_2,
                                color: AppTheme.primary,
                              )
                                  .animate()
                                  .fadeIn(delay: 100.ms)
                                  .scale(delay: 100.ms),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _StatCard(
                                title: 'Stock Bas',
                                value: '$lowStock',
                                icon: Icons.trending_down,
                                color: AppTheme.danger,
                              )
                                  .animate()
                                  .fadeIn(delay: 200.ms)
                                  .scale(delay: 200.ms),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _StatCard(
                                title: 'Quantité',
                                value: '$totalQuantity',
                                icon: Icons.shopping_cart,
                                color: AppTheme.success,
                              )
                                  .animate()
                                  .fadeIn(delay: 300.ms)
                                  .scale(delay: 300.ms),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _StatCard(
                                title: 'Critiques',
                                value: '$criticalStock',
                                icon: Icons.warning_amber_rounded,
                                color: AppTheme.warning,
                              )
                                  .animate()
                                  .fadeIn(delay: 400.ms)
                                  .scale(delay: 400.ms),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        // Deuxième ligne : 1 carte pour le prix total
                        Row(
                          children: [
                            Expanded(
                              child: _StatCard(
                                title: 'Valeur Totale',
                                value: '${totalPrice.toStringAsFixed(2)} €',
                                icon: Icons.euro,
                                color: Colors.purple,
                              )
                                  .animate()
                                  .fadeIn(delay: 500.ms)
                                  .scale(delay: 500.ms),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                // Titre section produits
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                    child: Text(
                      'Produits',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                  ),
                ),

                // Grille de produits
                if (provider.products.isEmpty)
                  SliverFillRemaining(
                    child: Center(
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
                    ),
                  )
                else
                  SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    sliver: SliverGrid(
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.85,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                      ),
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          final product = provider.products[index];
                          return _ProductCardDashboard(
                            product: product,
                            isGuest: isGuest,
                            onTap: () => _handleProductTap(product),
                            onMenuAction: (action) =>
                                _handleMenuAction(product, action),
                          )
                              .animate()
                              .fadeIn(
                                  delay: Duration(
                                      milliseconds: 500 + (50 * index)))
                              .slideY(
                                  begin: 0.2,
                                  end: 0,
                                  delay: Duration(
                                      milliseconds: 500 + (50 * index)));
                        },
                        childCount: provider.products.length,
                      ),
                    ),
                  ),
                const SliverToBoxAdapter(child: SizedBox(height: 100)),
              ],
            );
          },
        ),
      ),
      floatingActionButton: isGuest
          ? null
          : Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                FloatingActionButton(
                  heroTag: 'scanner',
                  backgroundColor: AppTheme.success,
                  onPressed: isGuest
                      ? () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text(
                                  'Connectez-vous pour utiliser le scanner'),
                              backgroundColor: AppTheme.warning,
                            ),
                          );
                        }
                      : () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const ScannerScreen()),
                          );
                        },
                  child: const Icon(Icons.qr_code_scanner),
                ).animate().scale(delay: 600.ms),
                const SizedBox(height: 16),
                FloatingActionButton(
                  heroTag: 'add',
                  backgroundColor: AppTheme.primary,
                  onPressed: isGuest
                      ? () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text(
                                  'Connectez-vous pour ajouter des produits'),
                              backgroundColor: AppTheme.warning,
                            ),
                          );
                        }
                      : () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const AddProductScreen()),
                          );
                        },
                  child: const Icon(Icons.add),
                ).animate().scale(delay: 700.ms),
              ],
            ),
    );
  }
}

// Widget pour les boutons de navigation du dashboard
Widget _buildDashboardButton(
  BuildContext context, {
  required IconData icon,
  required String label,
  required Color color,
  required VoidCallback onTap,
}) {
  return Card(
    elevation: 2,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
    child: InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 32,
              color: color,
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    ),
  );
}

// Widget pour les cartes de statistiques (format compact)
class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                color: color,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

// ProductCard simplifié pour le Dashboard
class _ProductCardDashboard extends StatelessWidget {
  final dynamic product;
  final bool isGuest;
  final VoidCallback onTap;
  final Function(String) onMenuAction;

  const _ProductCardDashboard({
    required this.product,
    required this.isGuest,
    required this.onTap,
    required this.onMenuAction,
  });

  @override
  Widget build(BuildContext context) {
    Color badgeColor;
    if (product.quantity < 10) {
      badgeColor = AppTheme.danger;
    } else if (product.quantity < 30) {
      badgeColor = AppTheme.warning;
    } else {
      badgeColor = AppTheme.success;
    }

    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Stack(
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Center(
                      child: Hero(
                        tag: 'product_${product.id}',
                        child: Icon(
                          ProductIconHelper.getIconForProduct(product.name),
                          size: 64,
                          color: ProductIconHelper.getIconColor(
                              product.quantity,
                              Theme.of(context).brightness == Brightness.dark),
                        ),
                      ),
                    ),
                  ),
                  Text(
                    product.name,
                    style: Theme.of(context)
                        .textTheme
                        .bodyLarge
                        ?.copyWith(fontWeight: FontWeight.w600),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'SKU: ${product.sku}',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: badgeColor.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'Stock: ${product.quantity}',
                      style: TextStyle(
                        color: badgeColor,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Positioned(
              top: 8,
              right: 8,
              child: PopupMenuButton<String>(
                icon: const Icon(Icons.more_vert,
                    size: 20, color: AppTheme.textSecondary),
                itemBuilder: (context) => [
                  const PopupMenuItem(
                      value: 'view', child: Text('Voir détails')),
                  if (!isGuest) ...[
                    const PopupMenuItem(value: 'edit', child: Text('Modifier')),
                    const PopupMenuItem(
                        value: 'delete', child: Text('Supprimer')),
                  ],
                ],
                onSelected: onMenuAction,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
