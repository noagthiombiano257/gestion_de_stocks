import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/theme_provider.dart';
import '../providers/auth_provider.dart';
import '../widgets/app_drawer.dart';
import '../theme/app_theme.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pushReplacementNamed(context, '/dashboard'),
        ),
        title: const Text('Paramètres'),
      ),
      drawer: const AppDrawer(currentRoute: 'settings'),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Section Apparence
          Text(
            'Apparence',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 16),

          Card(
            child: Consumer<ThemeProvider>(
              builder: (context, themeProvider, child) {
                return SwitchListTile(
                  secondary: Icon(
                    themeProvider.isDarkMode
                        ? Icons.dark_mode
                        : Icons.light_mode,
                    color: AppTheme.primary,
                  ),
                  title: const Text('Mode sombre'),
                  subtitle: Text(
                    themeProvider.isDarkMode ? 'Activé' : 'Désactivé',
                  ),
                  value: themeProvider.isDarkMode,
                  activeThumbColor: AppTheme.primary,
                  onChanged: (value) {
                    themeProvider.toggleTheme();
                  },
                );
              },
            ),
          ),

          const SizedBox(height: 32),

          // Section Compte
          Text(
            'Compte',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 16),

          Consumer<AuthProvider>(
            builder: (context, auth, child) {
              if (auth.isGuestMode) {
                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        const Icon(Icons.person_outline,
                            size: 48, color: AppTheme.textSecondary),
                        const SizedBox(height: 16),
                        const Text(
                          'Mode Invité',
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Connectez-vous pour accéder à toutes les fonctionnalités',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: AppTheme.textSecondary),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: () {
                            Navigator.pushNamed(context, '/login');
                          },
                          icon: const Icon(Icons.login),
                          label: const Text('Se connecter'),
                        ),
                      ],
                    ),
                  ),
                );
              }

              return Card(
                child: Column(
                  children: [
                    ListTile(
                      leading:
                          const Icon(Icons.person, color: AppTheme.primary),
                      title: Text(auth.user?.name ?? 'Utilisateur'),
                      subtitle: Text(auth.user?.email ?? ''),
                    ),
                    const Divider(),
                    ListTile(
                      leading: const Icon(Icons.logout, color: AppTheme.danger),
                      title: const Text('Déconnexion'),
                      onTap: () async {
                        final confirm = await showDialog<bool>(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: const Text('Déconnexion'),
                            content: const Text(
                                'Voulez-vous vraiment vous déconnecter ?'),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context, false),
                                child: const Text('Annuler'),
                              ),
                              ElevatedButton(
                                onPressed: () => Navigator.pop(context, true),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppTheme.danger,
                                ),
                                child: const Text('Déconnexion'),
                              ),
                            ],
                          ),
                        );

                        if (confirm == true && context.mounted) {
                          await auth.logout();
                        }
                      },
                    ),
                  ],
                ),
              );
            },
          ),

          const SizedBox(height: 32),

          // Section À propos
          Text(
            'À propos',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 16),

          Card(
            child: Column(
              children: [
                const ListTile(
                  leading: Icon(Icons.info_outline, color: AppTheme.primary),
                  title: Text('Version'),
                  subtitle: Text('1.0.0'),
                ),
                const Divider(),
                ListTile(
                  leading: const Icon(Icons.code, color: AppTheme.primary),
                  title: const Text('ShopFlow'),
                  subtitle: const Text('Gestion de stocks intelligente'),
                  onTap: () {},
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
