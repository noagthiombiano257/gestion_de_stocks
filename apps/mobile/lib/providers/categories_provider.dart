import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../models/category.dart';

class CategoriesProvider extends ChangeNotifier {
  List<Category> _categories = [];
  bool _isLoading = false;
  String? _error;

  // Getters
  List<Category> get categories => _categories;
  bool get isLoading => _isLoading;
  String? get error => _error;
  int get categoriesCount => _categories.length;

  // Charger toutes les catégories
  Future<void> fetchCategories() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http.get(
        Uri.parse('http://localhost:3000/api/categories'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          _categories = (data['data'] as List)
              .map((json) => Category.fromJson(json))
              .toList();
        }
      } else {
        _error = 'Erreur lors du chargement des catégories';
      }
    } catch (e) {
      _error = 'Erreur réseau: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Ajouter une nouvelle catégorie
  Future<bool> addCategory({
    required String name,
    String? description,
    String? color,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('http://localhost:3000/api/categories'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'name': name,
          'description': description,
          'color': color ?? '#3b82f6',
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          // Ajouter la nouvelle catégorie à la liste
          _categories.add(Category.fromJson(data['data']));
          notifyListeners();
          return true;
        } else {
          _error = data['error'] ?? 'Erreur lors de la création';
          return false;
        }
      } else {
        _error = 'Erreur serveur: ${response.statusCode}';
        return false;
      }
    } catch (e) {
      _error = 'Erreur réseau: $e';
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Obtenir une catégorie par ID
  Category? getCategoryById(int id) {
    try {
      return _categories.firstWhere((category) => category.id == id);
    } catch (e) {
      return null;
    }
  }

  // Obtenir une catégorie par nom
  Category? getCategoryByName(String name) {
    try {
      return _categories.firstWhere((category) => category.name == name);
    } catch (e) {
      return null;
    }
  }

  // Nettoyer les erreurs
  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Recharger les catégories
  Future<void> refreshCategories() async {
    await fetchCategories();
  }
}