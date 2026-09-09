'use client';

import { useState, useEffect } from 'react';
import { Save, Settings, Globe, Bell, Lock, Database } from 'lucide-react';

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState({
    companyName: 'ShopFlow SARL',
    companyEmail: 'contact@shopflow.fr',
    timezone: 'Africa/Ouagadougou',
    language: 'fr',
    dateFormat: 'DD/MM/YYYY',
    currency: 'XOF'
  });
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus({ type: null, message: '' });
    
    try {
      // Apply language change immediately
      if (settings.language === 'en') {
        document.documentElement.lang = 'en';
      } else if (settings.language === 'es') {
        document.documentElement.lang = 'es';
      } else {
        document.documentElement.lang = 'fr';
      }
      
      const response = await fetch('/api/settings/general', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSaveStatus({ type: 'success', message: 'Paramètres enregistrés avec succès!' });
        // Save to localStorage for persistence
        localStorage.setItem('generalSettings', JSON.stringify(settings));
      } else {
        setSaveStatus({ type: 'error', message: result.error || 'Erreur lors de l\'enregistrement' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus({ type: 'error', message: 'Erreur de connexion au serveur' });
      // Fallback to localStorage
      localStorage.setItem('generalSettings', JSON.stringify(settings));
      setSaveStatus({ type: 'success', message: 'Paramètres enregistrés localement!' });
    }
  };

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem('generalSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        // Apply language setting immediately
        if (parsed.language) {
          document.documentElement.lang = parsed.language;
        }
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    } else {
      // Load from API on first load
      loadSettingsFromAPI();
    }
  }, []);

  const loadSettingsFromAPI = async () => {
    try {
      const response = await fetch('/api/settings/general');
      const result = await response.json();
      
      if (result.success && result.data) {
        setSettings(result.data);
        // Apply language setting immediately
        if (result.data.language) {
          document.documentElement.lang = result.data.language;
        }
      }
    } catch (error) {
      console.error('Error loading settings from API:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Paramètres généraux</h1>
        <p className="text-gray-400 mt-1">
          Configurez les paramètres de base de votre application
        </p>
      </div>

      {/* Settings Form */}
      <div className="bg-[#252836] rounded-xl border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="text-purple-500" size={24} />
            Configuration de l'entreprise
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom de l'entreprise
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                className="w-full px-4 py-3 bg-[#1a1d29] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email de contact
              </label>
              <input
                type="email"
                value={settings.companyEmail}
                onChange={(e) => setSettings({...settings, companyEmail: e.target.value})}
                className="w-full px-4 py-3 bg-[#1a1d29] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fuseau horaire
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                className="w-full px-4 py-3 bg-[#1a1d29] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Africa/Ouagadougou">Burkina Faso (Ouagadougou)</option>
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="America/New_York">New York</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Africa/Lagos">Lagos</option>
                <option value="Africa/Cairo">Le Caire</option>
                <option value="Africa/Johannesburg">Johannesbourg</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Langue
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({...settings, language: e.target.value})}
                className="w-full px-4 py-3 bg-[#1a1d29] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            {saveStatus.type && (
              <div className={`flex-1 p-3 rounded-lg text-sm ${
                saveStatus.type === 'success' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {saveStatus.message}
              </div>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
            >
              <Save size={20} />
              Enregistrer les paramètres
            </button>
          </div>
        </form>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Globe className="text-blue-500" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Apparence</h3>
              <p className="text-sm text-gray-400">Thème et design</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <Bell className="text-yellow-500" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Notifications</h3>
              <p className="text-sm text-gray-400">Alertes et rappels</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-red-500/20">
              <Lock className="text-red-500" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Sécurité</h3>
              <p className="text-sm text-gray-400">Protection des données</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#252836] rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-500/20">
              <Database className="text-green-500" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Sauvegarde</h3>
              <p className="text-sm text-gray-400">Données et exports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}