import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';

class Sale {
  final String id;
  final DateTime date;
  final double total;
  final int itemCount;
  final String paymentMethod;
  final List<SaleItem> items;

  Sale({
    required this.id,
    required this.date,
    required this.total,
    required this.itemCount,
    required this.paymentMethod,
    required this.items,
  });
}

class SaleItem {
  final String name;
  final int quantity;
  final double price;
  final double subtotal;

  SaleItem({
    required this.name,
    required this.quantity,
    required this.price,
    required this.subtotal,
  });
}

class SalesHistoryScreen extends StatefulWidget {
  const SalesHistoryScreen({super.key});

  @override
  State<SalesHistoryScreen> createState() => _SalesHistoryScreenState();
}

class _SalesHistoryScreenState extends State<SalesHistoryScreen> {
  List<Sale> _sales = [];
  bool _isLoading = true;
  String _selectedFilter = 'all';
  final ApiService _apiService = ApiService();

  @override
  void initState() {
    super.initState();
    _loadSalesHistory();
  }

  Future<void> _loadSalesHistory() async {
    setState(() => _isLoading = true);
    
    try {
      final salesData = await _apiService.getSalesHistory();
      
      setState(() {
        _sales = salesData.map((saleData) => Sale(
          id: saleData['id'],
          date: DateTime.parse(saleData['date']),
          total: saleData['total'],
          itemCount: saleData['itemCount'],
          paymentMethod: saleData['paymentMethod'],
          items: (saleData['items'] as List).map((item) => SaleItem(
            name: item['name'],
            quantity: item['quantity'],
            price: item['price'],
            subtotal: item['subtotal'],
          )).toList(),
        )).toList();
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur lors du chargement des ventes: $e'),
            backgroundColor: AppTheme.danger,
          ),
        );
      }
    }
  }

  List<Sale> get _filteredSales {
    switch (_selectedFilter) {
      case 'today':
        final now = DateTime.now();
        return _sales.where((sale) => 
          sale.date.day == now.day &&
          sale.date.month == now.month &&
          sale.date.year == now.year
        ).toList();
      case 'week':
        final now = DateTime.now();
        final weekAgo = now.subtract(const Duration(days: 7));
        return _sales.where((sale) => sale.date.isAfter(weekAgo)).toList();
      case 'month':
        final now = DateTime.now();
        final monthAgo = now.subtract(const Duration(days: 30));
        return _sales.where((sale) => sale.date.isAfter(monthAgo)).toList();
      default:
        return _sales;
    }
  }

  double get _totalSales {
    return _filteredSales.fold(0.0, (sum, sale) => sum + sale.total);
  }

  @override
  Widget build(BuildContext context) {
    final isGuest = context.watch<AuthProvider>().isGuestMode;

    if (isGuest) {
      return Scaffold(
        appBar: AppBar(title: const Text('Historique des ventes')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.history, size: 80, color: Colors.grey),
                const SizedBox(height: 24),
                Text(
                  'Fonctionnalité réservée',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Connectez-vous pour voir l\'historique des ventes',
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
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pushReplacementNamed(context, '/dashboard'),
        ),
        title: const Text('Historique des ventes'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadSalesHistory,
          ),
        ],
      ),
      body: Column(
        children: [
          // Filtres
          Container(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _FilterChip(
                          label: 'Tout',
                          value: 'all',
                          selected: _selectedFilter == 'all',
                          onSelected: (value) => setState(() => _selectedFilter = value),
                        ),
                        const SizedBox(width: 8),
                        _FilterChip(
                          label: 'Aujourd\'hui',
                          value: 'today',
                          selected: _selectedFilter == 'today',
                          onSelected: (value) => setState(() => _selectedFilter = value),
                        ),
                        const SizedBox(width: 8),
                        _FilterChip(
                          label: 'Cette semaine',
                          value: 'week',
                          selected: _selectedFilter == 'week',
                          onSelected: (value) => setState(() => _selectedFilter = value),
                        ),
                        const SizedBox(width: 8),
                        _FilterChip(
                          label: 'Ce mois',
                          value: 'month',
                          selected: _selectedFilter == 'month',
                          onSelected: (value) => setState(() => _selectedFilter = value),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Statistiques
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppTheme.primary.withOpacity(0.3)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Total des ventes',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey,
                      ),
                    ),
                    Text(
                      '${_totalSales.toStringAsFixed(2)} €',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.primary,
                      ),
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    const Text(
                      'Nombre de ventes',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey,
                      ),
                    ),
                    Text(
                      '${_filteredSales.length}',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.primary,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ).animate().fadeIn(),

          const SizedBox(height: 16),

          // Liste des ventes
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _filteredSales.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.receipt_long, size: 64, color: Colors.grey),
                            const SizedBox(height: 16),
                            Text(
                              'Aucune vente trouvée',
                              style: Theme.of(context).textTheme.headlineSmall,
                            ),
                            const Text('Essayez de modifier le filtre'),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: _filteredSales.length,
                        itemBuilder: (context, index) {
                          final sale = _filteredSales[index];
                          return _SaleCard(sale: sale)
                              .animate()
                              .fadeIn(delay: Duration(milliseconds: 50 * index))
                              .slideY(begin: 0.2, end: 0);
                        },
                      ),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final String value;
  final bool selected;
  final Function(String) onSelected;

  const _FilterChip({
    required this.label,
    required this.value,
    required this.selected,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    return FilterChip(
      label: Text(label),
      selected: selected,
      onSelected: (bool selected) => onSelected(value),
      backgroundColor: Colors.grey[200],
      selectedColor: AppTheme.primary.withOpacity(0.3),
      checkmarkColor: AppTheme.primary,
    );
  }
}

class _SaleCard extends StatelessWidget {
  final Sale sale;

  const _SaleCard({required this.sale});

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inHours < 1) {
      return 'il y a ${difference.inMinutes} min';
    } else if (difference.inHours < 24) {
      return 'il y a ${difference.inHours} h';
    } else if (difference.inDays < 7) {
      return 'il y a ${difference.inDays} jours';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }

  String _getPaymentMethodIcon(String method) {
    switch (method.toLowerCase()) {
      case 'espèces':
      case 'cash':
        return '💵';
      case 'mobile money':
        return '📱';
      case 'carte':
      case 'card':
        return '💳';
      default:
        return '💰';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ExpansionTile(
        leading: CircleAvatar(
          backgroundColor: AppTheme.primary.withOpacity(0.1),
          child: Text(
            _getPaymentMethodIcon(sale.paymentMethod),
            style: const TextStyle(fontSize: 20),
          ),
        ),
        title: Text(
          'Vente ${sale.id}',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(_formatDate(sale.date)),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              '${sale.total.toStringAsFixed(2)} €',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: AppTheme.primary,
              ),
            ),
            Text(
              '${sale.itemCount} article${sale.itemCount > 1 ? 's' : ''}',
              style: const TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ],
        ),
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Méthode de paiement:',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    Text(sale.paymentMethod),
                  ],
                ),
                const SizedBox(height: 12),
                const Text(
                  'Articles achetés:',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                ...sale.items.map((item) => Padding(
                  padding: const EdgeInsets.only(bottom: 4),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text('${item.quantity}x ${item.name}'),
                      ),
                      Text('${item.subtotal.toStringAsFixed(2)} €'),
                    ],
                  ),
                )),
                const Divider(),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Total:',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    Text(
                      '${sale.total.toStringAsFixed(2)} €',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppTheme.primary,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
