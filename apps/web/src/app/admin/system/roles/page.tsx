'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Shield, Users, Key, Eye, Save, X, Calendar, User as UserIcon, Settings, Package, FileText, Lock } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
}

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const availablePermissions = [
    { id: 'users.manage', label: 'Gérer les utilisateurs', icon: UserIcon, color: 'text-blue-400' },
    { id: 'products.edit', label: 'Modifier les produits', icon: Package, color: 'text-green-400' },
    { id: 'orders.manage', label: 'Gérer les commandes', icon: FileText, color: 'text-yellow-400' },
    { id: 'reports.view', label: 'Voir les rapports', icon: Eye, color: 'text-purple-400' },
    { id: 'settings.modify', label: 'Modifier les paramètres', icon: Settings, color: 'text-red-400' },
    { id: 'categories.manage', label: 'Gérer les catégories', icon: Package, color: 'text-orange-400' },
    { id: 'stock.manage', label: 'Gérer le stock', icon: Package, color: 'text-cyan-400' },
    { id: 'customers.view', label: 'Voir les clients', icon: UserIcon, color: 'text-pink-400' }
  ];

  useEffect(() => {
    // Load roles from localStorage on mount
    const savedRoles = localStorage.getItem('roles');
    if (savedRoles) {
      try {
        setRoles(JSON.parse(savedRoles));
      } catch (error) {
        console.error('Error parsing saved roles:', error);
      }
    } else {
      // Initialize with default roles if none exist
      const defaultRoles: Role[] = [
        {
          id: '1',
          name: 'Administrateur',
          description: 'Accès complet à toutes les fonctionnalités',
          permissions: ['users.manage', 'products.edit', 'orders.manage', 'reports.view', 'settings.modify', 'categories.manage', 'stock.manage', 'customers.view'],
          userCount: 3,
          createdAt: '2024-01-01'
        },
        {
          id: '2',
          name: 'Gestionnaire',
          description: 'Gestion des produits et commandes',
          permissions: ['products.edit', 'orders.manage', 'reports.view', 'categories.manage', 'stock.manage'],
          userCount: 8,
          createdAt: '2024-01-01'
        },
        {
          id: '3',
          name: 'Lecteur',
          description: 'Accès en lecture seule',
          permissions: ['reports.view', 'customers.view'],
          userCount: 12,
          createdAt: '2024-01-01'
        }
      ];
      setRoles(defaultRoles);
      localStorage.setItem('roles', JSON.stringify(defaultRoles));
    }
    setLoading(false);
  }, []);

  const permissionLabels: Record<string, string> = {
    'users.manage': 'Gérer les utilisateurs',
    'products.edit': 'Modifier les produits',
    'orders.manage': 'Gérer les commandes',
    'reports.view': 'Voir les rapports',
    'settings.modify': 'Modifier les paramètres',
    'categories.manage': 'Gérer les catégories',
    'stock.manage': 'Gérer le stock',
    'customers.view': 'Voir les clients'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus({ type: null, message: '' });
    
    try {
      if (editingRole) {
        // Update existing role
        const updatedRoles = roles.map(role => 
          role.id === editingRole.id 
            ? { ...role, ...formData }
            : role
        );
        setRoles(updatedRoles);
        localStorage.setItem('roles', JSON.stringify(updatedRoles));
        setSaveStatus({ type: 'success', message: 'Rôle mis à jour avec succès!' });
      } else {
        // Add new role
        const newRole: Role = {
          id: `role-${Date.now()}`,
          ...formData,
          userCount: 0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        const updatedRoles = [newRole, ...roles];
        setRoles(updatedRoles);
        localStorage.setItem('roles', JSON.stringify(updatedRoles));
        setSaveStatus({ type: 'success', message: 'Rôle créé avec succès!' });
      }
      
      setShowAddModal(false);
      setEditingRole(null);
      setFormData({ name: '', description: '', permissions: [] });
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Erreur lors de l\'opération' });
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setShowAddModal(true);
  };

  const handleDelete = (roleId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) {
      try {
        const updatedRoles = roles.filter(role => role.id !== roleId);
        setRoles(updatedRoles);
        localStorage.setItem('roles', JSON.stringify(updatedRoles));
        setSaveStatus({ type: 'success', message: 'Rôle supprimé avec succès!' });
      } catch (error) {
        setSaveStatus({ type: 'error', message: 'Erreur lors de la suppression' });
      }
    }
  };

  const handleView = (role: Role) => {
    setSelectedRole(role);
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Rôles & Permissions</h1>
          <p className="text-gray-400 mt-1">
            Gérez les rôles et permissions des utilisateurs
          </p>
        </div>
        <button 
          onClick={() => {
            setEditingRole(null);
            setFormData({ name: '', description: '', permissions: [] });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
        >
          <Plus size={20} />
          Nouveau rôle
        </button>
      </div>

      {/* Status Messages */}
      {saveStatus.type && (
        <div className={`p-4 rounded-lg border ${
          saveStatus.type === 'success' 
            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border-red-500/30'
        }`}>
          {saveStatus.message}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher un rôle..."
          className="w-full pl-10 pr-4 py-3 bg-[#252836] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Shield className="text-blue-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Rôles totaux</p>
              <p className="text-2xl font-bold text-white">{roles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500/20">
              <Users className="text-green-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Utilisateurs</p>
              <p className="text-2xl font-bold text-white">
                {roles.reduce((sum, role) => sum + role.userCount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <Key className="text-purple-500" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Permissions</p>
              <p className="text-2xl font-bold text-white">
                {new Set(roles.flatMap(r => r.permissions)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Roles List */}
      <div className="bg-[#252836] rounded-xl border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Rôles disponibles</h2>
        </div>
        
        <div className="divide-y divide-gray-800">
          {filteredRoles.length === 0 ? (
            <div className="p-12 text-center">
              <Shield className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <p className="text-gray-400">Aucun rôle trouvé</p>
            </div>
          ) : (
            filteredRoles.map((role) => (
              <div key={role.id} className="p-6 hover:bg-gray-800/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gray-700">
                      <Shield className="text-gray-300" size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-white text-lg">{role.name}</h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                          {role.userCount} utilisateurs
                        </span>
                      </div>
                      
                      <p className="text-gray-300 mb-4">{role.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Permissions :</h4>
                        <div className="flex flex-wrap gap-2">
                          {role.permissions.map((permission) => (
                            <span 
                              key={permission}
                              className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-medium"
                            >
                              {permissionLabels[permission] || permission}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-400">
                        Créé le {new Date(role.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleView(role)}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleEdit(role)}
                      className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(role.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1d29] rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  {editingRole ? 'Modifier le rôle' : 'Nouveau rôle'}
                </h2>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingRole(null);
                    setFormData({ name: '', description: '', permissions: [] });
                  }}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom du rôle *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-[#252836] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Administrateur"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#252836] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Description du rôle..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Permissions
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availablePermissions.map((permission) => {
                    const Icon = permission.icon;
                    return (
                      <label 
                        key={permission.id}
                        className="flex items-center gap-3 p-3 bg-[#252836] border border-gray-800 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                        />
                        <Icon className={permission.color} size={16} />
                        <span className="text-gray-300">{permission.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingRole(null);
                    setFormData({ name: '', description: '', permissions: [] });
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
                >
                  <Save size={20} />
                  {editingRole ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Details Modal */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1d29] rounded-xl border border-gray-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-purple-500/20">
                    <Shield className="text-purple-500" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">
                      Détails du rôle
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                        {selectedRole.userCount} utilisateurs
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedRole(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Role Information */}
              <div className="bg-[#252836] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield size={20} className="text-purple-400" />
                  Informations du rôle
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Nom du rôle</p>
                    <p className="text-white font-medium text-lg">{selectedRole.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">ID du rôle</p>
                    <p className="text-white font-medium">{selectedRole.id}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-400 mb-1">Description</p>
                    <p className="text-white font-medium">{selectedRole.description}</p>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="bg-[#252836] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Key size={20} className="text-yellow-400" />
                  Permissions accordées
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedRole.permissions.map((permissionId) => {
                    const permission = availablePermissions.find(p => p.id === permissionId);
                    if (!permission) return null;
                    const Icon = permission.icon;
                    return (
                      <div key={permissionId} className="flex items-center gap-3 p-3 bg-[#1a1d29] rounded-lg border border-gray-700">
                        <Icon className={permission.color} size={20} />
                        <div>
                          <p className="text-white font-medium">{permission.label}</p>
                          <p className="text-xs text-gray-400">{permissionId}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* User Statistics */}
              <div className="bg-[#252836] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users size={20} className="text-green-400" />
                  Statistiques des utilisateurs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Utilisateurs actifs</p>
                    <p className="text-2xl font-bold text-white">{selectedRole.userCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Permissions</p>
                    <p className="text-2xl font-bold text-purple-400">{selectedRole.permissions.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Niveau d'accès</p>
                    <p className="text-2xl font-bold text-green-400">
                      {selectedRole.permissions.length >= 6 ? 'Élevé' : 
                       selectedRole.permissions.length >= 3 ? 'Moyen' : 'Bas'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timestamp Information */}
              <div className="bg-[#252836] rounded-lg p-4 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-blue-400" />
                  Informations temporelles
                </h3>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Date de création</p>
                  <p className="text-white font-medium">
                    {new Date(selectedRole.createdAt).toLocaleString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  onClick={() => setSelectedRole(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                >
                  Fermer
                </button>
                <button 
                  onClick={() => {
                    handleEdit(selectedRole);
                    setSelectedRole(null);
                  }}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                >
                  <Edit size={18} />
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}