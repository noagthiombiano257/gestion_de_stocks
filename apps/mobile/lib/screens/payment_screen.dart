import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter/foundation.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'dart:io';
import 'package:path_provider/path_provider.dart';
import '../providers/cart_provider.dart';
import '../providers/products_provider.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';

enum PaymentMethod { cash, mobileMoney, card }

class PaymentScreen extends StatefulWidget {
  const PaymentScreen({super.key});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  PaymentMethod _selectedMethod = PaymentMethod.cash;
  double _cashReceived = 0.0;
  final TextEditingController _cashController = TextEditingController();
  final TextEditingController _discountController = TextEditingController();
  bool _isProcessing = false;

  @override
  void dispose() {
    _cashController.dispose();
    _discountController.dispose();
    super.dispose();
  }

  double get change => _cashReceived - context.read<CartProvider>().total;

  Future<void> _processPayment() async {
    setState(() => _isProcessing = true);

    try {
      final cartProvider = context.read<CartProvider>();
      final productsProvider = context.read<ProductsProvider>();
      final apiService = ApiService();

      // Préparer les articles pour l'API
      final items = cartProvider.items.map((item) => {
        'name': item.name,
        'sku': item.sku,
        'quantity': item.quantity,
        'price': item.price,
        'subtotal': item.subtotal,
      }).toList();

      // Appeler l'API pour enregistrer la vente
      final result = await apiService.createSale(
        items: items,
        total: cartProvider.total,
        paymentMethod: _getPaymentMethodName(_selectedMethod),
      );

      if (result['success']) {
        // Mettre à jour les produits localement en rechargeant la liste
        await productsProvider.fetchProducts();

        // Générer le reçu PDF
        await _generateReceipt(cartProvider);

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('✓ Paiement effectué avec succès!'),
              backgroundColor: AppTheme.success,
              duration: Duration(seconds: 3),
            ),
          );

          // Vider le panier et revenir à l'écran dashboard
          cartProvider.clearCart();
          Navigator.of(context).pushNamedAndRemoveUntil(
            '/dashboard',
            (route) => false,
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur lors du paiement: $e'),
            backgroundColor: AppTheme.danger,
          ),
        );
      }
    } finally {
      setState(() => _isProcessing = false);
    }
  }

  String _getPaymentMethodName(PaymentMethod method) {
    switch (method) {
      case PaymentMethod.cash:
        return 'Espèces';
      case PaymentMethod.mobileMoney:
        return 'Mobile Money';
      case PaymentMethod.card:
        return 'Carte';
    }
  }

  Future<void> _generateReceipt(cartProvider) async {
    try {
      // Pour le web, générer un PDF téléchargeable
      if (kIsWeb) {
        _generateWebReceipt(cartProvider);
        return;
      }

      final pdf = pw.Document();

      pdf.addPage(
        pw.Page(
          pageFormat: PdfPageFormat.roll80,
          build: (pw.Context context) {
            return pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.center,
              children: [
                pw.Text(
                  'SHOPFLOW',
                  style: pw.TextStyle(
                      fontSize: 20, fontWeight: pw.FontWeight.bold),
                ),
                pw.SizedBox(height: 8),
                pw.Text('Reçu de vente'),
                pw.SizedBox(height: 4),
                pw.Text(
                    'Date: ${DateTime.now().day}/${DateTime.now().month}/${DateTime.now().year} ${DateTime.now().hour}:${DateTime.now().minute.toString().padLeft(2, '0')}'),
                pw.Divider(),
                pw.SizedBox(height: 8),

                // Détails des articles
                ...cartProvider.items.map((item) => pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.start,
                      children: [
                        pw.Row(
                          mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                          children: [
                            pw.Expanded(child: pw.Text(item.name)),
                            pw.Text('${item.quantity}x'),
                          ],
                        ),
                        pw.SizedBox(height: 2),
                        pw.Row(
                          mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                          children: [
                            pw.Text('  ${item.price.toStringAsFixed(2)}€'),
                            pw.Text('${item.subtotal.toStringAsFixed(2)}€'),
                          ],
                        ),
                        pw.SizedBox(height: 8),
                      ],
                    )),

                pw.Divider(),
                pw.SizedBox(height: 8),

                // Totaux
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.Text('Sous-total:'),
                    pw.Text('${cartProvider.subtotal.toStringAsFixed(2)}€'),
                  ],
                ),
                if (cartProvider.discountAmount > 0) ...[
                  pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    children: [
                      pw.Text('Remise (${cartProvider.discount}%):'),
                      pw.Text(
                          '-${cartProvider.discountAmount.toStringAsFixed(2)}€'),
                    ],
                  ),
                ],
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.Text('TVA:'),
                    pw.Text('${cartProvider.taxAmount.toStringAsFixed(2)}€'),
                  ],
                ),
                pw.Divider(),
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.Text(
                      'TOTAL:',
                      style: pw.TextStyle(fontWeight: pw.FontWeight.bold),
                    ),
                    pw.Text(
                      '${cartProvider.total.toStringAsFixed(2)}€',
                      style: pw.TextStyle(fontWeight: pw.FontWeight.bold),
                    ),
                  ],
                ),

                if (_selectedMethod == PaymentMethod.cash &&
                    _cashReceived > 0) ...[
                  pw.SizedBox(height: 8),
                  pw.Divider(),
                  pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    children: [
                      pw.Text('Espèces reçues:'),
                      pw.Text('${_cashReceived.toStringAsFixed(2)}€'),
                    ],
                  ),
                  pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    children: [
                      pw.Text('Monnaie:'),
                      pw.Text('${change.toStringAsFixed(2)}€'),
                    ],
                  ),
                ],

                pw.SizedBox(height: 16),
                pw.Text('Merci de votre visite!'),
                pw.Text('Au plaisir de vous revoir'),
              ],
            );
          },
        ),
      );

      // Sauvegarder le reçu
      final directory = await getApplicationDocumentsDirectory();
      final fileName = 'recu_${DateTime.now().millisecondsSinceEpoch}.pdf';
      final file = File('${directory.path}/$fileName');
      await file.writeAsBytes(await pdf.save());
    } catch (e) {
      // Continuer même si le PDF échoue
    }
  }

  void _generateWebReceipt(cartProvider) {
    // Pour le web, afficher un résumé dans une boîte de dialogue
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Reçu de vente'),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('SHOPFLOW',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
              const Text('Reçu de vente'),
              Text(
                  'Date: ${DateTime.now().day}/${DateTime.now().month}/${DateTime.now().year} ${DateTime.now().hour}:${DateTime.now().minute.toString().padLeft(2, '0')}'),
              const Divider(),
              const SizedBox(height: 8),
              ...cartProvider.items.map((item) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(child: Text(item.name)),
                            Text('${item.quantity}x'),
                          ],
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('  ${item.price.toStringAsFixed(2)}€'),
                            Text('${item.subtotal.toStringAsFixed(2)}€'),
                          ],
                        ),
                      ],
                    ),
                  )),
              const Divider(),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Sous-total:'),
                  Text('${cartProvider.subtotal.toStringAsFixed(2)} €'),
                ],
              ),
              if (cartProvider.discountAmount > 0) ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Remise (${cartProvider.discount}%):'),
                    Text(
                        '-${cartProvider.discountAmount.toStringAsFixed(2)} €'),
                  ],
                ),
              ],
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('TVA:'),
                  Text('${cartProvider.taxAmount.toStringAsFixed(2)} €'),
                ],
              ),
              const Divider(),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'TOTAL:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text(
                    '${cartProvider.total.toStringAsFixed(2)} €',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              if (_selectedMethod == PaymentMethod.cash &&
                  _cashReceived > 0) ...[
                const SizedBox(height: 8),
                const Divider(),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Espèces reçues:'),
                    Text('${_cashReceived.toStringAsFixed(2)} €'),
                  ],
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Monnaie:'),
                    Text('${change.toStringAsFixed(2)} €'),
                  ],
                ),
              ],
              const SizedBox(height: 16),
              const Center(
                child: Column(
                  children: [
                    Text('Merci de votre visite!'),
                    Text('Au plaisir de vous revoir'),
                  ],
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Fermer'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cartProvider = context.watch<CartProvider>();
    final total = cartProvider.total;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Paiement'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pushNamedAndRemoveUntil(
            context,
            '/dashboard',
            (route) => false,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Résumé de la commande
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Résumé de la commande',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 16),
                    ...cartProvider.items.map((item) => Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  '${item.quantity}x ${item.name}',
                                  style: const TextStyle(fontSize: 14),
                                ),
                              ),
                              Text(
                                '${item.subtotal.toStringAsFixed(2)} €',
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        )),
                    const Divider(),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Sous-total:'),
                        Text('${cartProvider.subtotal.toStringAsFixed(2)} €'),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Remise:'),
                        Text(
                            '-${cartProvider.discountAmount.toStringAsFixed(2)} €'),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('TVA:'),
                        Text('${cartProvider.taxAmount.toStringAsFixed(2)} €'),
                      ],
                    ),
                    const Divider(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'TOTAL:',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          '${total.toStringAsFixed(2)} €',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.primary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ).animate().fadeIn(),

            const SizedBox(height: 16),

            // Remise
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Remise',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _discountController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Pourcentage de remise',
                        suffixText: '%',
                        border: OutlineInputBorder(),
                      ),
                      onChanged: (value) {
                        final discount = double.tryParse(value) ?? 0.0;
                        cartProvider.setDiscount(discount);
                      },
                    ),
                  ],
                ),
              ),
            ).animate().fadeIn(delay: 100.ms),

            const SizedBox(height: 16),

            // Méthode de paiement
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Méthode de paiement',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    RadioListTile<PaymentMethod>(
                      title: const Text('Espèces'),
                      subtitle: const Text('Paiement en espèces'),
                      value: PaymentMethod.cash,
                      groupValue: _selectedMethod,
                      onChanged: (value) {
                        setState(() {
                          _selectedMethod = value!;
                          _cashController.text = total.toStringAsFixed(2);
                          _cashReceived = total;
                        });
                      },
                    ),
                    RadioListTile<PaymentMethod>(
                      title: const Text('Mobile Money'),
                      subtitle:
                          const Text('Orange Money, MTN Mobile Money, etc.'),
                      value: PaymentMethod.mobileMoney,
                      groupValue: _selectedMethod,
                      onChanged: (value) =>
                          setState(() => _selectedMethod = value!),
                    ),
                    RadioListTile<PaymentMethod>(
                      title: const Text('Carte bancaire'),
                      subtitle: const Text('Visa, Mastercard, etc.'),
                      value: PaymentMethod.card,
                      groupValue: _selectedMethod,
                      onChanged: (value) =>
                          setState(() => _selectedMethod = value!),
                    ),
                  ],
                ),
              ),
            ).animate().fadeIn(delay: 200.ms),

            const SizedBox(height: 16),

            // Espèces reçues (uniquement pour le paiement en espèces)
            if (_selectedMethod == PaymentMethod.cash)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Espèces reçues',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: _cashController,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(
                          labelText: 'Montant reçu',
                          prefixText: '€ ',
                          border: OutlineInputBorder(),
                        ),
                        onChanged: (value) {
                          _cashReceived = double.tryParse(value) ?? 0.0;
                          setState(() {});
                        },
                      ),
                      const SizedBox(height: 8),
                      if (_cashReceived >= total)
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppTheme.success.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppTheme.success),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Monnaie à rendre:',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                              Text(
                                '${change.toStringAsFixed(2)} €',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.success,
                                  fontSize: 18,
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
              ).animate().fadeIn(delay: 300.ms),

            const SizedBox(height: 24),

            // Bouton de paiement
            ElevatedButton(
              onPressed: (_selectedMethod == PaymentMethod.cash &&
                          _cashReceived < total) ||
                      _isProcessing
                  ? null
                  : _processPayment,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.success,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: _isProcessing
                  ? const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(color: Colors.white),
                        SizedBox(width: 16),
                        Text('Traitement...'),
                      ],
                    )
                  : Text(
                      _selectedMethod == PaymentMethod.cash
                          ? 'Confirmer le paiement'
                          : 'Procéder au paiement',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
            ).animate().fadeIn(delay: 400.ms),
          ],
        ),
      ),
    );
  }
}
