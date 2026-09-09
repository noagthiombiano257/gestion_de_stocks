class Product {
  final int id;
  final String name;
  final String sku;
  final int quantity;
  final double? price; // Prix en euros
  final int? categoryId;
  final String? categoryName;
  final String? supplier;
  final int lowStockThreshold;
  final DateTime? updatedAt;
  final DateTime? createdAt;

  Product({
    required this.id,
    required this.name,
    required this.sku,
    required this.quantity,
    this.price,
    this.categoryId,
    this.categoryName,
    this.supplier,
    this.lowStockThreshold = 10,
    this.updatedAt,
    this.createdAt,
  });

  // Créer un Product depuis JSON
  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] as int,
      name: json['name'] as String,
      sku: json['sku'] as String,
      quantity: json['quantity'] as int,
      price: json['price'] != null ? (json['price'] as num).toDouble() / 100 : null,
      categoryId: json['category_id'] as int?,
      categoryName: json['category_name'] as String?,
      supplier: json['supplier'] as String?,
      lowStockThreshold: json['low_stock_threshold'] as int? ?? 10,
      // ✅ CORRECTION : Utiliser snake_case (updated_at, created_at)
      updatedAt: json['updated_at'] != null 
          ? DateTime.parse(json['updated_at'] as String)
          : null,
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at'] as String)
          : null,
    );
  }

  // Convertir un Product en JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'sku': sku,
      'quantity': quantity,
      'price': price != null ? (price! * 100).round() : null,
      'category_id': categoryId,
      'supplier': supplier,
      'low_stock_threshold': lowStockThreshold,
      'updated_at': updatedAt?.toIso8601String(),
      'created_at': createdAt?.toIso8601String(),
    };
  }

  // Créer une copie avec modifications
  Product copyWith({
    int? id,
    String? name,
    String? sku,
    int? quantity,
    double? price,
    int? categoryId,
    String? categoryName,
    String? supplier,
    int? lowStockThreshold,
    DateTime? updatedAt,
    DateTime? createdAt,
  }) {
    return Product(
      id: id ?? this.id,
      name: name ?? this.name,
      sku: sku ?? this.sku,
      quantity: quantity ?? this.quantity,
      price: price ?? this.price,
      categoryId: categoryId ?? this.categoryId,
      categoryName: categoryName ?? this.categoryName,
      supplier: supplier ?? this.supplier,
      lowStockThreshold: lowStockThreshold ?? this.lowStockThreshold,
      updatedAt: updatedAt ?? this.updatedAt,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  // Méthode utilitaire pour afficher le prix formaté
  String get formattedPrice {
    if (price == null) return 'N/A';
    return '${price!.toStringAsFixed(2)} €';
  }

  // Vérifier si le stock est bas
  bool get isLowStock => quantity < lowStockThreshold;

  // Calculer la valeur totale du stock pour ce produit
  double get totalValue => price != null ? price! * quantity : 0.0;
}