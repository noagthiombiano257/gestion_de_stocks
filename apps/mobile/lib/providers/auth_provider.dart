import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  final StorageService _storageService = StorageService();

  User? _user;
  String? _token;
  bool _isGuestMode = false;
  bool _isLoading = false;
  String? _error;
  bool _isAuthenticated = false;

  User? get user => _user;
  String? get token => _token;
  bool get isGuestMode => _isGuestMode;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _isAuthenticated;

  // Vérifier si l'utilisateur est déjà connecté au démarrage
  Future<void> checkAuth() async {
    _isLoading = true;
    notifyListeners();

    try {
      // Vérifier si mode invité
      final guestMode = await _storageService.isGuestMode();
      if (guestMode) {
        _isGuestMode = true;
        _isAuthenticated = true;
        _isLoading = false;
        notifyListeners();
        return;
      }

      // Vérifier le token
      final token = await _storageService.getToken();

      if (token != null && token.isNotEmpty) {
        final result = await _apiService.getProfile(token);

        if (result['success']) {
          _user = User.fromJson(result['user']);
          _token = token;
          _isAuthenticated = true;
          _isGuestMode = false;
        } else {
          await _storageService.clearAll();
        }
      }
    } catch (e) {
      // Token invalide ou expiré, on déconnecte
      await _storageService.clearAll();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Activer le mode invité
  void setGuestMode() {
    _isGuestMode = true;
    _isAuthenticated = true;
    _storageService.setGuestMode(true); // Pas besoin de await
    notifyListeners();
  }

  // Inscription
  Future<bool> register({
    required String name,
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _apiService.register(
        name: name,
        email: email,
        password: password,
      );

      if (result['success']) {
        _user = User.fromJson(result['user']);
        _token = result['token'];
        _isAuthenticated = true;
        _isGuestMode = false;

        // Sauvegarder le token et désactiver le mode invité
        await _storageService.saveToken(_token!);
        await _storageService.saveUser(result['user']);
        await _storageService.setGuestMode(false);

        _isLoading = false;
        notifyListeners();
        return true;
      }

      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Connexion
  Future<bool> login({
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await _apiService.login(
        email: email,
        password: password,
      );

      if (result['success']) {
        _user = User.fromJson(result['user']);
        _token = result['token'];
        _isAuthenticated = true;
        _isGuestMode = false;

        // Sauvegarder le token et désactiver le mode invité
        await _storageService.saveToken(_token!);
        await _storageService.saveUser(result['user']);
        await _storageService.setGuestMode(false);

        _isLoading = false;
        notifyListeners();
        return true;
      }

      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Déconnexion
  Future<void> logout() async {
    await _storageService.clearAll();
    _user = null;
    _token = null;
    _isAuthenticated = false; 
    _isGuestMode = false;
    _error = null;
    notifyListeners();
  }
}
