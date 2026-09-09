import 'package:flutter/material.dart';

class ProductIconHelper {
  // Obtenir une icône basée sur le nom du produit
  static IconData getIconForProduct(String productName) {
    final name = productName.toLowerCase();

    // Téléphones & Smartphones
    if (name.contains('iphone') ||
        name.contains('phone') ||
        name.contains('smartphone') ||
        name.contains('mobile')) {
      return Icons.smartphone;
    }

    // Ordinateurs portables
    if (name.contains('macbook') ||
        name.contains('laptop') ||
        name.contains('notebook') ||
        name.contains('ordinateur portable')) {
      return Icons.laptop_mac;
    }

    // Ordinateurs de bureau
    if (name.contains('imac') ||
        name.contains('desktop') ||
        name.contains('pc') ||
        name.contains('ordinateur')) {
      return Icons.computer;
    }

    // Montres
    if (name.contains('watch') ||
        name.contains('montre') ||
        name.contains('smartwatch')) {
      return Icons.watch;
    }

    // Écouteurs / Audio
    if (name.contains('airpods') ||
        name.contains('headphone') ||
        name.contains('écouteur') ||
        name.contains('casque') ||
        name.contains('audio')) {
      return Icons.headphones;
    }

    // Claviers
    if (name.contains('keyboard') ||
        name.contains('clavier')) {
      return Icons.keyboard;
    }

    // Souris
    if (name.contains('mouse') ||
        name.contains('souris')) {
      return Icons.mouse;
    }

    // Tablettes
    if (name.contains('ipad') ||
        name.contains('tablet') ||
        name.contains('tablette')) {
      return Icons.tablet;
    }

    // Caméras
    if (name.contains('camera') ||
        name.contains('caméra') ||
        name.contains('appareil photo')) {
      return Icons.camera_alt;
    }

    // Imprimantes
    if (name.contains('printer') ||
        name.contains('imprimante')) {
      return Icons.print;
    }

    // Écrans / Moniteurs
    if (name.contains('monitor') ||
        name.contains('écran') ||
        name.contains('display')) {
      return Icons.monitor;
    }

    // Lampes / Éclairage
    if (name.contains('lamp') ||
        name.contains('lampe') ||
        name.contains('light') ||
        name.contains('éclairage')) {
      return Icons.lightbulb;
    }

    // Chargeurs / Câbles
    if (name.contains('charger') ||
        name.contains('chargeur') ||
        name.contains('cable') ||
        name.contains('câble')) {
      return Icons.cable;
    }

    // Batteries
    if (name.contains('battery') ||
        name.contains('batterie') ||
        name.contains('pile')) {
      return Icons.battery_full;
    }

    // Stockage / Disques
    if (name.contains('disk') ||
        name.contains('disque') ||
        name.contains('storage') ||
        name.contains('ssd') ||
        name.contains('hdd')) {
      return Icons.storage;
    }

    // Router / Réseau
    if (name.contains('router') ||
        name.contains('routeur') ||
        name.contains('wifi') ||
        name.contains('réseau')) {
      return Icons.router;
    }

    // Par défaut
    return Icons.inventory_2;
  }

  // Obtenir une couleur d'icône basée sur le stock
  static Color getIconColor(int quantity, bool isDarkMode) {
    if (quantity > 50) {
      return const Color(0xFF00D4AA); // Vert
    } else if (quantity > 10) {
      return const Color(0xFFFFB800); // Orange
    } else {
      return const Color(0xFFFF6B6B); // Rouge
    }
  }
}