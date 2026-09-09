import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/products_provider.dart';
import '../providers/auth_provider.dart';
import '../providers/categories_provider.dart';
import '../models/category.dart';

class AddProductScreen extends StatefulWidget {
  const AddProductScreen({super.key});

  @override
  State<AddProductScreen> createState() => _AddProductScreenState();
}

class _AddProductScreenState extends State<AddProductScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _skuController = TextEditingController();
  final _quantityController = TextEditingController(text: '0');
  final _priceController = TextEditingController();
  final _supplierController = TextEditingController();
  final _lowStockThresholdController = TextEditingController(text: '10');
  
  Category? _selectedCategory;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    // Charger les catégories au démarrage
    Future.microtask(
      () => context.read<CategoriesProvider>().fetchCategories(),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _skuController.dispose();
    _quantityController.dispose();
    _priceController.dispose();
    _supplierController.dispose();
    _lowStockThresholdController.dispose();
    super.dispose();
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final success = await context.read<ProductsProvider>().addProduct(
      name: _nameController.text,
      sku: _skuController.text,
      quantity: int.parse(_quantityController.text),
      price: _priceController.text.isNotEmpty 
          ? double.parse(_priceController.text) 
          : null,
      categoryId: _selectedCategory?.id,
      supplier: _supplierController.text.isNotEmpty 
          ? _supplierController.text 
          : null,
      lowStockThreshold: int.parse(_lowStockThresholdController.text),
    );

    setState(() => _isLoading = false);

    if (!mounted) return;

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✓ Produit ajouté avec succès'),
          backgroundColor: Colors.green,
        ),
      );
      _resetForm();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(context.read<ProductsProvider>().error ?? 'Erreur'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _resetForm() {
    _nameController.clear();
    _skuController.clear();
    _quantityController.text = '0';
    _priceController.clear();
    _supplierController.clear();
    _lowStockThresholdController.text = '10';
    setState(() {
      _selectedCategory = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isGuest = context.watch<AuthProvider>().isGuestMode;
    final categoriesProvider = context.watch<CategoriesProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Ajouter un produit'),
      ),
      body: isGuest
          ? _buildGuestView()
          : _buildFormView(categoriesProvider),
    );
  }

  Widget _buildGuestView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.lock_outline,
              size: 80,
              color: Colors.grey,
            ),
            const SizedBox(height: 24),
            Text(
              'Fonctionnalité réservée',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Connectez-vous pour ajouter des produits',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 32),
            ElevatedButton.icon(
              onPressed: () {
                context.read<AuthProvider>().logout();
              },
              icon: const Icon(Icons.login),
              label: const Text('Se connecter'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFormView(CategoriesProvider categoriesProvider) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Icon(Icons.add_box_outlined, size: 80, color: Colors.blue),
            const SizedBox(height: 24),
            
            // Nom du produit
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Nom du produit *',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.shopping_bag),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Veuillez entrer un nom';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            
            // SKU
            TextFormField(
              controller: _skuController,
              decoration: const InputDecoration(
                labelText: 'SKU / Code-barres *',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.qr_code),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Veuillez entrer un SKU';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            
            // Quantité
            TextFormField(
              controller: _quantityController,
              decoration: const InputDecoration(
                labelText: 'Quantité *',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.numbers),
              ),
              keyboardType: TextInputType.number,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Veuillez entrer une quantité';
                }
                if (int.tryParse(value) == null) {
                  return 'Quantité invalide';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            
            // Prix
            TextFormField(
              controller: _priceController,
              decoration: const InputDecoration(
                labelText: 'Prix unitaire (€)',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.euro),
              ),
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              validator: (value) {
                if (value != null && value.isNotEmpty) {
                  if (double.tryParse(value) == null) {
                    return 'Prix invalide';
                  }
                  if (double.parse(value) < 0) {
                    return 'Le prix doit être positif';
                  }
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            
            // Catégorie
            InputDecorator(
              decoration: const InputDecoration(
                labelText: 'Catégorie',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.category),
              ),
              child: categoriesProvider.isLoading
                  ? const CircularProgressIndicator()
                  : DropdownButton<Category>(
                      value: _selectedCategory,
                      hint: const Text('Sélectionnez une catégorie'),
                      isExpanded: true,
                      items: categoriesProvider.categories.map((category) {
                        return DropdownMenuItem<Category>(
                          value: category,
                          child: Text(category.name),
                        );
                      }).toList(),
                      onChanged: (Category? newValue) {
                        setState(() {
                          _selectedCategory = newValue;
                        });
                      },
                    ),
            ),
            const SizedBox(height: 16),
            
            // Fournisseur
            TextFormField(
              controller: _supplierController,
              decoration: const InputDecoration(
                labelText: 'Fournisseur',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.business),
              ),
            ),
            const SizedBox(height: 16),
            
            // Seuil d'alerte
            TextFormField(
              controller: _lowStockThresholdController,
              decoration: const InputDecoration(
                labelText: 'Seuil d\'alerte de stock',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.warning),
              ),
              keyboardType: TextInputType.number,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Veuillez entrer un seuil';
                }
                if (int.tryParse(value) == null) {
                  return 'Seuil invalide';
                }
                if (int.parse(value) < 0) {
                  return 'Le seuil doit être positif';
                }
                return null;
              },
            ),
            const SizedBox(height: 24),
            
            ElevatedButton(
              onPressed: _isLoading ? null : _submitForm,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.all(16),
              ),
              child: _isLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Ajouter le produit', style: TextStyle(fontSize: 16)),
            ),
          ],
        ),
      ),
    );
  }
}