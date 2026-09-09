import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/product.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:3000/api';

  // ============================================
  // PRODUITS
  // ============================================

  // GET - Récupérer tous les produits
  Future<List<Product>> getProducts() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/products'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final List<dynamic> productsJson = data['data'];
        return productsJson.map((json) => Product.fromJson(json)).toList();
      } else {
        throw Exception('Erreur lors de la récupération des produits');
      }
    } catch (e) {
      throw Exception('Erreur de connexion : $e');
    }
  }

  // GET - Récupérer un produit par ID
  Future<Product> getProduct(int id) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/products/$id'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return Product.fromJson(data['data']);
      } else {
        throw Exception('Produit non trouvé');
      }
    } catch (e) {
      throw Exception('Erreur de connexion : $e');
    }
  }

  // POST - Créer un nouveau produit
  Future<Product> createProduct({
    required String name,
    required String sku,
    required int quantity,
    double? price,
    int? categoryId,
    String? supplier,
    int? lowStockThreshold,
  }) async {
    try {
      final requestBody = {
        'name': name,
        'sku': sku,
        'quantity': quantity,
      };

      // Ajouter les champs optionnels seulement s'ils ne sont pas null
      if (price != null) requestBody['price'] = price;
      if (categoryId != null) requestBody['categoryId'] = categoryId;
      if (supplier != null) requestBody['supplier'] = supplier;
      if (lowStockThreshold != null)
        requestBody['lowStockThreshold'] = lowStockThreshold;

      final response = await http.post(
        Uri.parse('$baseUrl/products'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(requestBody),
      );

      print('📥 Status: ${response.statusCode}');
      print('📥 Body: ${response.body}');

      // ✅ CORRECTION : Accepter 200 ET 201
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = json.decode(response.body);
        if (data['success'] == true && data['data'] != null) {
          return Product.fromJson(data['data']);
        } else {
          throw Exception(data['error'] ?? 'Erreur inconnue');
        }
      } else if (response.statusCode == 409) {
        // SKU dupliqué
        final data = json.decode(response.body);
        throw Exception(data['error'] ?? 'Ce SKU existe déjà');
      } else {
        final data = json.decode(response.body);
        throw Exception(data['error'] ?? 'Erreur lors de la création');
      }
    } catch (e) {
      print('❌ Error: $e');
      throw Exception('Erreur de connexion : $e');
    }
  }

  // PUT - Modifier un produit
  Future<Product> updateProduct({
    required int id,
    required String name,
    required String sku,
  }) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/products/$id'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'name': name,
          'sku': sku,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return Product.fromJson(data['data']);
      } else {
        final data = json.decode(response.body);
        throw Exception(data['error'] ?? 'Erreur lors de la modification');
      }
    } catch (e) {
      throw Exception('Erreur de connexion : $e');
    }
  }

  // DELETE - Supprimer un produit
  Future<void> deleteProduct(int id) async {
    try {
      final response = await http.delete(Uri.parse('$baseUrl/products/$id'));

      if (response.statusCode != 200) {
        throw Exception('Erreur lors de la suppression');
      }
    } catch (e) {
      throw Exception('Erreur de connexion : $e');
    }
  }

  // POST - Ajuster le stock
  Future<Product> adjustStock({
    required int id,
    required int adjustment,
    required String reason,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/products/$id/adjust'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'adjustment': adjustment,
          'type': reason, //  CORRECTION : 'type' au lieu de 'reason'
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return Product.fromJson(data['data']);
      } else {
        final data = json.decode(response.body);
        throw Exception(data['error'] ?? 'Erreur lors de l\'ajustement');
      }
    } catch (e) {
      throw Exception('Erreur de connexion : $e');
    }
  }

  // GET - Scanner un code-barres
  Future<Product?> scanBarcode(String code) async {
    try {
      //  CORRECTION : Le paramètre est 'sku', pas 'code'
      final response = await http.get(
        Uri.parse('$baseUrl/barcode?sku=$code'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true && data['data'] != null) {
          return Product.fromJson(data['data']);
        }
        return null; // Produit non trouvé
      } else {
        return null;
      }
    } catch (e) {
      throw Exception('Erreur de connexion : $e');
    }
  }

  // ============================================
  // AUTHENTIFICATION
  // ============================================

  // POST - Inscription
  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'name': name,
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = json.decode(response.body);
        return {
          'success': true,
          'user': data['data']['user'],
          'token': data['data']['token'],
        };
      } else {
        final data = json.decode(response.body);
        throw Exception(data['error'] ?? 'Erreur lors de l\'inscription');
      }
    } catch (e) {
      throw Exception('Erreur de connexion : $e');
    }
  }

  // POST - Connexion
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return {
          'success': true,
          'user': data['data']['user'],
          'token': data['data']['token'],
        };
      } else {
        final data = json.decode(response.body);
        throw Exception(data['error'] ?? 'Email ou mot de passe incorrect');
      }
    } catch (e) {
      throw Exception('Erreur de connexion : $e');
    }
  }

  // GET - Récupérer le profil avec token
  Future<Map<String, dynamic>> getProfile(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/me'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return {
          'success': true,
          'user': data['data'],
        };
      } else {
        throw Exception('Token invalide');
      }
    } catch (e) {
      throw Exception('Erreur de connexion : $e');
    }
  }

  // POST - Enregistrer une vente
  Future<Map<String, dynamic>> createSale({
    required List<dynamic> items,
    required double total,
    required String paymentMethod,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/sales'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'items': items,
          'total': total,
          'paymentMethod': paymentMethod,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = json.decode(response.body);
        return {
          'success': true,
          'data': data['data'],
        };
      } else {
        final data = json.decode(response.body);
        throw Exception(data['error'] ?? 'Erreur lors de l\'enregistrement de la vente');
      }
    } catch (e) {
      throw Exception('Erreur de connexion : $e');
    }
  }

  // GET - Récupérer l'historique des ventes
  Future<List<dynamic>> getSalesHistory() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/sales'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['data'];
      } else {
        throw Exception('Erreur lors de la récupération des ventes');
      }
    } catch (e) {
      throw Exception('Erreur de connexion : $e');
    }
  }
}
