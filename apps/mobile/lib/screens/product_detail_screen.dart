import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../providers/products_provider.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product product;

  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  final _nameController = TextEditingController();
  final _skuController = TextEditingController();
  final _adjustmentController = TextEditingController();
  String _selectedReason = 'Réception';

  final List<String> _reasons = [
    'Réception',
    'Vente',
    'Retour',
    'Perte/Casse',
    'Inventaire',
    'Autre',
  ];

  @override
  void initState() {
    super.initState();
    _nameController.text = widget.product.name;
    _skuController.text = widget.product.sku;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _skuController.dispose();
    _adjustmentController.dispose();
    super.dispose();
  }

  Future<void> _showEditDialog() async {
    return showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Modifier le produit'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Nom',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _skuController,
              decoration: const InputDecoration(
                labelText: 'SKU',
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
              final success = await context.read<ProductsProvider>().updateProduct(
                id: widget.product.id,
                name: _nameController.text,
                sku: _skuController.text,
              );

              if (context.mounted) {
                Navigator.pop(context);
                if (success) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('✓ Produit modifié'),
                      backgroundColor: Colors.green,
                    ),
                  );
                  setState(() {});
                }
              }
            },
            child: const Text('Modifier'),
          ),
        ],
      ),
    );
  }

  Future<void> _showAdjustDialog() async {
    return showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Ajuster le stock'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _adjustmentController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Quantité (+ ou -)',
                border: OutlineInputBorder(),
                hintText: '+10 ou -5',
              ),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              initialValue: _selectedReason,
              decoration: const InputDecoration(
                labelText: 'Raison',
                border: OutlineInputBorder(),
              ),
              items: _reasons.map((reason) {
                return DropdownMenuItem(
                  value: reason,
                  child: Text(reason),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedReason = value!;
                });
              },
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
              final adjustment = int.tryParse(_adjustmentController.text);
              if (adjustment == null) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Quantité invalide'),
                    backgroundColor: Colors.red,
                  ),
                );
                return;
              }

              final success = await context.read<ProductsProvider>().adjustStock(
                id: widget.product.id,
                adjustment: adjustment,
                reason: _selectedReason,
              );

              if (context.mounted) {
                Navigator.pop(context);
                if (success) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('✓ Stock ajusté'),
                      backgroundColor: Colors.green,
                    ),
                  );
                  _adjustmentController.clear();
                  setState(() {});
                }
              }
            },
            child: const Text('Ajuster'),
          ),
        ],
      ),
    );
  }

  Future<void> _deleteProduct() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Supprimer le produit'),
        content: const Text('Êtes-vous sûr de vouloir supprimer ce produit ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Supprimer'),
          ),
        ],
      ),
    );

    if (confirm == true && context.mounted) {
      final success = await context.read<ProductsProvider>().deleteProduct(widget.product.id);
      if (context.mounted) {
        if (success) {
          Navigator.pop(context);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('✓ Produit supprimé'),
              backgroundColor: Colors.green,
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentProduct = context.watch<ProductsProvider>()
        .products
        .firstWhere((p) => p.id == widget.product.id, orElse: () => widget.product);

    return Scaffold(
      appBar: AppBar(
        title: Text(currentProduct.name),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pushReplacementNamed(context, '/dashboard'),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: _deleteProduct,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      currentProduct.name,
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'SKU: ${currentProduct.sku}',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Colors.grey,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        const Text('Stock actuel: ', style: TextStyle(fontSize: 18)),
                        Text(
                          '${currentProduct.quantity}',
                          style: TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            color: currentProduct.quantity > 10
                                ? Colors.green
                                : currentProduct.quantity > 0
                                    ? Colors.orange
                                    : Colors.red,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    // Nouvelles informations
                    if (currentProduct.price != null) ...[
                      Row(
                        children: [
                          const Text('Prix unitaire: ', style: TextStyle(fontSize: 16)),
                          Text(
                            currentProduct.formattedPrice,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.blue,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          const Text('Valeur totale: ', style: TextStyle(fontSize: 16)),
                          Text(
                            '${currentProduct.totalValue.toStringAsFixed(2)} €',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.purple,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                    ],
                    if (currentProduct.categoryName != null) ...[
                      Row(
                        children: [
                          const Text('Catégorie: ', style: TextStyle(fontSize: 16)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.blue.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Text(
                              currentProduct.categoryName!,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: Colors.blue,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                    ],
                    if (currentProduct.supplier != null) ...[
                      Row(
                        children: [
                          const Text('Fournisseur: ', style: TextStyle(fontSize: 16)),
                          Text(
                            currentProduct.supplier!,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                    ],
                    Row(
                      children: [
                        const Text('Seuil d\'alerte: ', style: TextStyle(fontSize: 16)),
                        Text(
                          '${currentProduct.lowStockThreshold}',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: currentProduct.isLowStock ? Colors.red : Colors.green,
                          ),
                        ),
                        const SizedBox(width: 8),
                        if (currentProduct.isLowStock)
                          const Icon(Icons.warning, color: Colors.red, size: 18),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: _showEditDialog,
              icon: const Icon(Icons.edit),
              label: const Text('Modifier'),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.all(16),
              ),
            ),
            const SizedBox(height: 8),
            ElevatedButton.icon(
              onPressed: _showAdjustDialog,
              icon: const Icon(Icons.inventory),
              label: const Text('Ajuster le stock'),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.all(16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}