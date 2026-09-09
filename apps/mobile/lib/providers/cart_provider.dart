import 'package:flutter/foundation.dart';
import '../models/cart_item.dart';

class CartProvider extends ChangeNotifier {
  final List<CartItem> _items = [];
  double _discount = 0.0;
  double _taxRate = 0.0; // Taux de TVA (ex: 0.2 pour 20%)

  List<CartItem> get items => List.unmodifiable(_items);
  
  double get subtotal {
    return _items.fold(0.0, (sum, item) => sum + item.subtotal);
  }
  
  double get discountAmount => subtotal * (_discount / 100);
  
  double get discountedSubtotal => subtotal - discountAmount;
  
  double get taxAmount => discountedSubtotal * _taxRate;
  
  double get total => discountedSubtotal + taxAmount;
  
  int get itemCount => _items.fold(0, (sum, item) => sum + item.quantity);

  void addItem(CartItem item) {
    final existingIndex = _items.indexWhere((existing) => existing.id == item.id);
    
    if (existingIndex != -1) {
      _items[existingIndex] = _items[existingIndex].copyWith(
        quantity: _items[existingIndex].quantity + item.quantity,
      );
    } else {
      _items.add(item);
    }
    
    notifyListeners();
  }

  void updateQuantity(int itemId, int quantity) {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    final index = _items.indexWhere((item) => item.id == itemId);
    if (index != -1) {
      _items[index] = _items[index].copyWith(quantity: quantity);
      notifyListeners();
    }
  }

  void removeItem(int itemId) {
    _items.removeWhere((item) => item.id == itemId);
    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    _discount = 0.0;
    notifyListeners();
  }

  void setDiscount(double discount) {
    _discount = discount.clamp(0.0, 100.0);
    notifyListeners();
  }

  void setTaxRate(double taxRate) {
    _taxRate = taxRate.clamp(0.0, 1.0);
    notifyListeners();
  }

  CartItem? getItemById(int id) {
    try {
      return _items.firstWhere((item) => item.id == id);
    } catch (e) {
      return null;
    }
  }

  Map<String, dynamic> getSaleSummary() {
    return {
      'items': _items.map((item) => item.toJson()).toList(),
      'subtotal': subtotal,
      'discount': _discount,
      'discountAmount': discountAmount,
      'discountedSubtotal': discountedSubtotal,
      'taxRate': _taxRate,
      'taxAmount': taxAmount,
      'total': total,
      'itemCount': itemCount,
      'timestamp': DateTime.now().toIso8601String(),
    };
  }
}
