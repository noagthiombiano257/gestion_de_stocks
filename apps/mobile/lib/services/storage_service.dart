import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static const String _guestModeKey = 'guest_mode';
  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'user_data';

  // Sauvegarder le token
  Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  // Récupérer le token
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  // Supprimer le token (déconnexion)
  Future<void> deleteToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
  }

  // Sauvegarder les données utilisateur
  Future<void> saveUser(Map<String, dynamic> user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userKey, user.toString());
  }

  // Supprimer les données utilisateur
  Future<void> deleteUser() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_userKey);
  }

  // Tout supprimer (déconnexion complète)
  Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }

  // Vérifier si l'utilisateur est connecté
  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  // Activer le mode invité
  Future<void> setGuestMode(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_guestModeKey, value);
  }

  // Vérifier si en mode invité
  Future<bool> isGuestMode() async {
    final prefs = await SharedPreferences.getInstance();
    final guestMode = prefs.getBool(_guestModeKey) ?? false;
    return guestMode;
  }
}
