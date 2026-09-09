'use client';

import { Users, UserPlus, Search, Filter, MoreVertical, Mail, Shield, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import CreateUserModal from './create-user-modal';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  last_login: string | null;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchUsers = () => {
    fetch('/api/auth/users')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsers(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const adminUsers = users.filter(u => u.role === 'admin').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestion des Utilisateurs</h1>
          <p className="text-gray-400">Gérez les comptes utilisateurs et leurs permissions</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#8b5cf6] text-white rounded-lg font-semibold hover:bg-[#7c3aed] transition-colors"
        >
          <UserPlus size={20} />
          Nouvel utilisateur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Utilisateurs</p>
              <p className="text-3xl font-bold text-white">{totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="text-blue-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Utilisateurs Actifs</p>
              <p className="text-3xl font-bold text-white">{activeUsers}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <Users className="text-emerald-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Administrateurs</p>
              <p className="text-3xl font-bold text-white">{adminUsers}</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Users className="text-purple-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recherche */}
      <div className="bg-[#252836] rounded-xl p-4 border border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              className="w-full bg-[#1a1d29] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-[#8b5cf6]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1d29] border border-gray-700 rounded-lg text-white hover:bg-gray-800 transition-colors">
            <Filter size={18} />
            Filtrer
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-[#252836] rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1a1d29] border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Utilisateur</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Rôle</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Dernière connexion</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de création d'utilisateur */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchUsers}
      />
    </div>
  );
}

function UserRow({ user }: { user: User }) {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `il y a ${diffMins} min`;
    if (diffMins < 1440) return `il y a ${Math.floor(diffMins / 60)} h`;
    return `il y a ${Math.floor(diffMins / 1440)} j`;
  };

  return (
    <tr className="hover:bg-[#1a1d29] transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#8b5cf6] flex items-center justify-center text-white font-semibold">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Mail size={12} />
              {user.email}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
          user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
        }`}>
          <Shield size={12} />
          {user.role === 'admin' ? 'Admin' : 'User'}
        </span>
      </td>

      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          user.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'
        }`}>
          {user.status === 'active' ? 'Actif' : 'Inactif'}
        </span>
      </td>

      <td className="px-6 py-4">
        <p className="text-sm text-gray-400 flex items-center gap-1.5">
          <Clock size={14} />
          {formatDate(user.last_login)}
        </p>
      </td>

      <td className="px-6 py-4 relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <MoreVertical className="text-gray-400" size={18} />
        </button>

        {showMenu && (
          <div className="absolute right-8 top-12 w-48 bg-[#1a1d29] border border-gray-700 rounded-lg shadow-xl z-10">
            <button className="w-full px-4 py-2.5 text-left text-white hover:bg-gray-800 text-sm">Voir profil</button>
            <button className="w-full px-4 py-2.5 text-left text-white hover:bg-gray-800 text-sm">Modifier</button>
            <div className="border-t border-gray-700"></div>
            <button className="w-full px-4 py-2.5 text-left text-red-500 hover:bg-gray-800 text-sm">Désactiver</button>
          </div>
        )}
      </td>
    </tr>
  );
}