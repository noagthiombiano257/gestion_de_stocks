import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../theme/app_theme.dart';

class AppDrawer extends StatelessWidget {
  final String currentRoute;

  const AppDrawer({super.key, required this.currentRoute});

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.user;
    final isGuest = authProvider.isGuestMode;

    // Récupérer les initiales
    String initials = 'G';
    String userName = 'Invité';
    String userEmail = 'Mode lecture seule';

    if (!isGuest && user != null) {
      final nameParts = user.name.split(' ');
      if (nameParts.length >= 2) {
        initials =
            nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase();
      } else {
        initials = user.name.substring(0, 2).toUpperCase();
      }
      userName = user.name;
      userEmail = user.email;
    }

    return Drawer(
      child: Column(
        children: [
          // Header avec avatar
          Container(
            width: double.infinity,
            padding: const EdgeInsets.fromLTRB(24, 60, 24, 24),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              border: Border(
                bottom: BorderSide(
                  color: AppTheme.textSecondary.withOpacity(0.1),
                  width: 1,
                ),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Avatar avec initiales
                CircleAvatar(
                  radius: 32,
                  backgroundColor: AppTheme.primary,
                  child: Text(
                    initials,
                    style: TextStyle(
                      color: Theme.of(context).scaffoldBackgroundColor,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                // Nom
                Text(
                  userName,
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
                const SizedBox(height: 4),
                // Email
                Text(
                  userEmail,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                // Badge mode invité
                if (isGuest) ...[
                  const SizedBox(height: 8),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.warning.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      'Mode Invité',
                      style: TextStyle(
                        color: AppTheme.warning,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),

          // Menu items
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: 8),
              children: [
                _DrawerItem(
                  icon: Icons.dashboard_outlined,
                  selectedIcon: Icons.dashboard,
                  title: 'Dashboard',
                  route: 'dashboard',
                  currentRoute: currentRoute,
                  isEnabled: !isGuest,
                  onTap: () {
                    if (!isGuest) {
                      Navigator.pop(context);
                      Navigator.pushReplacementNamed(context, '/dashboard');
                    } else {
                      _showGuestRestriction(context);
                    }
                  },
                ),
                _DrawerItem(
                  icon: Icons.inventory_2_outlined,
                  selectedIcon: Icons.inventory_2,
                  title: 'Produits',
                  route: 'products',
                  currentRoute: currentRoute,
                  isEnabled: true,
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushReplacementNamed(context, '/products');
                  },
                ),
                _DrawerItem(
                  icon: Icons.point_of_sale_outlined,
                  selectedIcon: Icons.point_of_sale,
                  title: 'Point de Vente',
                  route: 'pos',
                  currentRoute: currentRoute,
                  isEnabled: !isGuest,
                  onTap: () {
                    if (!isGuest) {
                      Navigator.pop(context);
                      Navigator.pushReplacementNamed(context, '/pos');
                    } else {
                      _showGuestRestriction(context);
                    }
                  },
                ),
                _DrawerItem(
                  icon: Icons.history_outlined,
                  selectedIcon: Icons.history,
                  title: 'Historique Ventes',
                  route: 'sales-history',
                  currentRoute: currentRoute,
                  isEnabled: !isGuest,
                  onTap: () {
                    if (!isGuest) {
                      Navigator.pop(context);
                      Navigator.pushReplacementNamed(context, '/sales-history');
                    } else {
                      _showGuestRestriction(context);
                    }
                  },
                ),
                _DrawerItem(
                  icon: Icons.edit_note_outlined,
                  selectedIcon: Icons.edit_note,
                  title: 'Ajustements',
                  route: 'adjustments',
                  currentRoute: currentRoute,
                  isEnabled: !isGuest,
                  onTap: () {
                    if (!isGuest) {
                      Navigator.pop(context);
                      Navigator.pushReplacementNamed(context, '/adjustments');
                    } else {
                      _showGuestRestriction(context);
                    }
                  },
                ),
                _DrawerItem(
                  icon: Icons.settings_outlined,
                  selectedIcon: Icons.settings,
                  title: 'Paramètres',
                  route: 'settings',
                  currentRoute: currentRoute,
                  isEnabled: true,
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushReplacementNamed(context, '/settings');
                  },
                ),
              ],
            ),
          ),

          // Footer avec déconnexion
          Container(
            decoration: BoxDecoration(
              border: Border(
                top: BorderSide(
                  color: AppTheme.textSecondary.withOpacity(0.1),
                  width: 1,
                ),
              ),
            ),
            child: _DrawerItem(
              icon: isGuest ? Icons.login_outlined : Icons.logout_outlined,
              selectedIcon: isGuest ? Icons.login : Icons.logout,
              title: isGuest ? 'Se connecter' : 'Déconnexion',
              route: '',
              currentRoute: currentRoute,
              isEnabled: true,
              textColor: isGuest ? AppTheme.success : AppTheme.danger,
              onTap: () async {
                Navigator.pop(context); // Close drawer first

                if (isGuest) {
                  // Mode invité : aller à la page de connexion
                  Navigator.pushNamedAndRemoveUntil(
                      context, '/login', (route) => false);
                } else {
                  // Déconnexion
                  final confirm = await showDialog<bool>(
                    context: context,
                    barrierDismissible: false,
                    builder: (context) => AlertDialog(
                      title: const Text('Déconnexion'),
                      content:
                          const Text('Voulez-vous vraiment vous déconnecter ?'),
                      actions: [
                        TextButton(
                          onPressed: () {
                            Navigator.pop(context, false);
                          },
                          child: const Text('Annuler'),
                        ),
                        ElevatedButton(
                          onPressed: () {
                            Navigator.pop(context, true);
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.danger,
                          ),
                          child: const Text('Déconnexion'),
                        ),
                      ],
                    ),
                  );

                  if (confirm == true) {
                    await authProvider.logout();

                    // Force navigation to login screen
                    Future.delayed(const Duration(milliseconds: 100), () {
                      if (Navigator.canPop(context)) {
                        Navigator.pushNamedAndRemoveUntil(
                            context, '/login', (route) => false);
                      }
                    });
                  }
                }
              },
            ),
          ),
        ],
      ),
    );
  }

  void _showGuestRestriction(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Connectez-vous pour accéder à cette fonctionnalité'),
        backgroundColor: AppTheme.warning,
      ),
    );
  }
}

// Widget pour un item du drawer
class _DrawerItem extends StatelessWidget {
  final IconData icon;
  final IconData selectedIcon;
  final String title;
  final String route;
  final String currentRoute;
  final bool isEnabled;
  final Color? textColor;
  final VoidCallback onTap;

  const _DrawerItem({
    required this.icon,
    required this.selectedIcon,
    required this.title,
    required this.route,
    required this.currentRoute,
    required this.isEnabled,
    this.textColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isSelected = currentRoute == route;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      child: ListTile(
        leading: Icon(
          isSelected ? selectedIcon : icon,
          color: !isEnabled
              ? AppTheme.textSecondary.withOpacity(0.5)
              : isSelected
                  ? AppTheme.primary
                  : textColor ?? AppTheme.textSecondary,
        ),
        title: Text(
          title,
          style: TextStyle(
            color: !isEnabled
                ? AppTheme.textSecondary.withOpacity(0.5)
                : isSelected
                    ? AppTheme.primary
                    : textColor ?? AppTheme.textPrimary,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
        selected: isSelected,
        selectedTileColor: AppTheme.primary.withOpacity(0.1),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        onTap: isEnabled ? onTap : null,
        trailing: !isEnabled
            ? Icon(
                Icons.lock_outline,
                size: 16,
                color: AppTheme.textSecondary.withOpacity(0.5),
              )
            : null,
      ),
    );
  }
}
