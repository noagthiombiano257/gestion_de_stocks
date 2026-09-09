import 'package:flutter/material.dart';
import '../models/product.dart';
import '../services/api_service.dart';

class ProductsProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  List<Product> _products = [];
  bool _isLoading = false;
  String? _error;

  List<Product> get products => _products;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Récupérer tous les produits
  Future<void> fetchProducts() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _products = await _apiService.getProducts();
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  // Ajouter un produit
  Future<bool> addProduct({
    required String name,
    required String sku,
    required int quantity,
    double? price,
    int? categoryId,
    String? supplier,
    int? lowStockThreshold,
  }) async {
    try {
      final newProduct = await _apiService.createProduct(
        name: name,
        sku: sku,
        quantity: quantity,
        price: price,
        categoryId: categoryId,
        supplier: supplier,
        lowStockThreshold: lowStockThreshold,
      );
      _products.add(newProduct);
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // Modifier un produit
  Future<bool> updateProduct({
    required int id,
    required String name,
    required String sku,
  }) async {
    try {
      final updatedProduct = await _apiService.updateProduct(
        id: id,
        name: name,
        sku: sku,
      );
      
      final index = _products.indexWhere((p) => p.id == id);
      if (index != -1) {
        _products[index] = updatedProduct;
        notifyListeners();
      }
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // Supprimer un produit
  Future<bool> deleteProduct(int id) async {
    try {
      await _apiService.deleteProduct(id);
      _products.removeWhere((p) => p.id == id);
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // Ajuster le stock
  Future<bool> adjustStock({
    required int id,
    required int adjustment,
    required String reason,
  }) async {
    try {
      final updatedProduct = await _apiService.adjustStock(
        id: id,
        adjustment: adjustment,
        reason: reason,
      );
      
      final index = _products.indexWhere((p) => p.id == id);
      if (index != -1) {
        _products[index] = updatedProduct;
        notifyListeners();
      }
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // Scanner un code-barres
  Future<Product?> scanBarcode(String code) async {
    try {
      return await _apiService.scanBarcode(code);
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return null;
    }
  }
}