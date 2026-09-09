import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../models/product.dart';
import '../utils/product_icon_helper.dart';
import '../theme/app_theme.dart';

class ProductGrid extends StatelessWidget {
  final List<Product> products;
  final bool isGuest;
  final Function(Product) onProductTap;
  final Function(Product, String) onMenuAction;

  const ProductGrid({
    super.key,
    required this.products,
    required this.isGuest,
    required this.onProductTap,
    required this.onMenuAction,
  });

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.85,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: products.length,
      itemBuilder: (context, index) {
        final product = products[index];
        return ProductCard(
          product: product,
          isGuest: isGuest,
          onTap: () => onProductTap(product),
          onMenuAction: (action) => onMenuAction(product, action),
        )
            .animate()
            .fadeIn(delay: Duration(milliseconds: 50 * index))
            .slideY(begin: 0.2, end: 0, delay: Duration(milliseconds: 50 * index));
      },
    );
  }
}

class ProductCard extends StatelessWidget {
  final Product product;
  final bool isGuest;
  final VoidCallback onTap;
  final Function(String) onMenuAction;

  const ProductCard({
    super.key,
    required this.product,
    required this.isGuest,
    required this.onTap,
    required this.onMenuAction,
  });

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final icon = ProductIconHelper.getIconForProduct(product.name);
    final iconColor = ProductIconHelper.getIconColor(product.quantity, isDarkMode);

    // Couleur et texte du badge de stock
    Color badgeColor;
    String badgeText;

    if (product.quantity < 10) {
      badgeColor = AppTheme.danger;
      badgeText = 'Stock: ${product.quantity}';
    } else if (product.quantity < 30) {
      badgeColor = AppTheme.warning;
      badgeText = 'Stock: ${product.quantity}';
    } else {
      badgeColor = AppTheme.success;
      badgeText = 'Stock: ${product.quantity}';
    }

    return Card(
      elevation: 0,
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
                  // Icône du produit
                  Expanded(
                    child: Center(
                      child: Hero(
                        tag: 'product_${product.id}',
                        child: Icon(
                          icon,
                          size: 64,
                          color: iconColor,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  
                  // Nom du produit
                  Text(
                    product.name,
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  
                  // SKU
                  Text(
                    'SKU: ${product.sku}',
                    style: Theme.of(context).textTheme.bodySmall,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  
                  // Category (if available)
                  if (product.categoryName != null) ...[
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.blue.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        product.categoryName!,
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue,
                        ),
                      ),
                    ),
                    const SizedBox(height: 4),
                  ],
                  
                  const SizedBox(height: 4),
                  
                  // Badge de stock (SANS animation problématique)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: badgeColor.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      badgeText,
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
            
            // Menu contextuel (⋮)
            Positioned(
              top: 8,
              right: 8,
              child: PopupMenuButton<String>(
                icon: const Icon(
                  Icons.more_vert,
                  color: AppTheme.textSecondary,
                  size: 20,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                itemBuilder: (context) => [
                  const PopupMenuItem(
                    value: 'view',
                    child: Row(
                      children: [
                        Icon(Icons.visibility_outlined, size: 20, color: AppTheme.textPrimary),
                        SizedBox(width: 12),
                        Text('Voir détails'),
                      ],
                    ),
                  ),
                  if (!isGuest) ...[
                    const PopupMenuItem(
                      value: 'edit',
                      child: Row(
                        children: [
                          Icon(Icons.edit_outlined, size: 20, color: AppTheme.textPrimary),
                          SizedBox(width: 12),
                          Text('Modifier'),
                        ],
                      ),
                    ),
                    const PopupMenuItem(
                      value: 'adjust',
                      child: Row(
                        children: [
                          Icon(Icons.inventory_outlined, size: 20, color: AppTheme.warning),
                          SizedBox(width: 12),
                          Text('Ajuster stock'),
                        ],
                      ),
                    ),
                    const PopupMenuItem(
                      value: 'delete',
                      child: Row(
                        children: [
                          Icon(Icons.delete_outline, size: 20, color: AppTheme.danger),
                          SizedBox(width: 12),
                          Text('Supprimer'),
                        ],
                      ),
                    ),
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