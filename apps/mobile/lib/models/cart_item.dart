class CartItem {
  final int id;
  final String name;
  final String sku;
  final double price;
  int quantity;
  final String? categoryName;

  CartItem({
    required this.id,
    required this.name,
    required this.sku,
    required this.price,
    required this.quantity,
    this.categoryName,
  });

  double get subtotal => price * quantity;

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'sku': sku,
      'price': price,
      'quantity': quantity,
      'categoryName': categoryName,
    };
  }

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      id: json['id'],
      name: json['name'],
      sku: json['sku'],
      price: json['price'].toDouble(),
      quantity: json['quantity'],
      categoryName: json['categoryName'],
    );
  }

  CartItem copyWith({
    int? id,
    String? name,
    String? sku,
    double? price,
    int? quantity,
    String? categoryName,
  }) {
    return CartItem(
      id: id ?? this.id,
      name: name ?? this.name,
      sku: sku ?? this.sku,
      price: price ?? this.price,
      quantity: quantity ?? this.quantity,
      categoryName: categoryName ?? this.categoryName,
    );
  }
}
