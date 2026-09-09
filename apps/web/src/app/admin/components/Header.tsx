'use client';

import { LogOut, User, Settings, Shield, X, Save, Phone, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import NotificationBell from './NotificationBell';
import SettingsPanel from './SettingsPanel';

export default function Header() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Administration',
    bio: ''
  });
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('admin_user') || '{}');
    if (user.name && user.email) {
      setProfileData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        department: user.department || 'Administration',
        bio: user.bio || ''
      }));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/login');
  };

  const handleSaveProfile = () => {
    try {
      // Update localStorage with new profile data
      const currentUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
      const updatedUser = { ...currentUser, ...profileData };
      localStorage.setItem('admin_user', JSON.stringify(updatedUser));
      
      setSaveStatus({ type: 'success', message: 'Profil mis à jour avec succès!' });
      
      // Update the user object for display
      setTimeout(() => {
        setSaveStatus({ type: null, message: '' });
        setShowProfileModal(false);
      }, 2000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Erreur lors de la mise à jour du profil' });
    }
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const user = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('admin_user') || '{"name":"Admin","email":"admin@shopflow.com","role":"Administrateur"}')
    : { name: 'Admin', email: 'admin@shopflow.com', role: 'Administrateur' };

  return (
    <header className="bg-secondary border-b border-primary px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Espace vide à gauche pour équilibrer le design */}
        <div className="flex-1"></div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Paramètres */}
          <SettingsPanel />

          {/* Notifications */}
          <NotificationBell />

          {/* Profil utilisateur amélioré */}
          <div className="relative">
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-3 hover:bg-tertiary rounded-lg p-2 transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-primary">{user.name}</p>
                <p className="text-xs text-secondary">{user.role}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center text-primary font-semibold shadow-lg">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            </button>

            {/* Modal de profil professionnel */}
            {showProfileModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-[#1a1d29] rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-800">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <User className="text-purple-500" size={24} />
                        Profil Utilisateur
                      </h2>
                      <button 
                        onClick={() => setShowProfileModal(false)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <X size={20} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Avatar et informations de base */}
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                        {profileData.name ? profileData.name[0].toUpperCase() : 'U'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white">{profileData.name || 'Nom non défini'}</h3>
                        <p className="text-gray-400">{profileData.email || 'Email non défini'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                            {user.role}
                          </span>
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                            Actif
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Formulaire de profil */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => handleProfileChange('name', e.target.value)}
                          className="w-full px-4 py-3 bg-[#252836] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Votre nom"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          className="w-full px-4 py-3 bg-[#252836] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="email@exemple.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Téléphone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => handleProfileChange('phone', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-[#252836] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="+226 XX XX XX XX"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Département
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <select
                            value={profileData.department}
                            onChange={(e) => handleProfileChange('department', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-[#252836] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                          >
                            <option value="Administration">Administration</option>
                            <option value="Ventes">Ventes</option>
                            <option value="Support">Support</option>
                            <option value="Technique">Technique</option>
                            <option value="Marketing">Marketing</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Biographie
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => handleProfileChange('bio', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-[#252836] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        placeholder="Parlez-nous de vous..."
                      />
                    </div>
                  </div>

                  {/* Message de statut */}
                  {saveStatus.type && (
                    <div className={`mb-6 p-4 rounded-lg border ${
                      saveStatus.type === 'success' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {saveStatus.message}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                    <button
                      onClick={() => setShowProfileModal(false)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                    >
                      <Save size={18} />
                      Enregistrer les modifications
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}