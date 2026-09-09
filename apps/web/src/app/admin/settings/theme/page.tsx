'use client';

import { useState, useEffect } from 'react';
import { Palette, Sun, Moon, Monitor, Save } from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';

export default function ThemeSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [accentColor, setAccentColor] = useState('#8b5cf6');
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const themeOptions = [
    { id: 'light' as const, name: 'Clair', icon: Sun },
    { id: 'dark' as const, name: 'Sombre', icon: Moon },
    { id: 'system' as const, name: 'Système', icon: Monitor }
  ];

  const accentColors = [
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Pink', value: '#ec4899' }
  ];

  useEffect(() => {
    // Load saved theme preferences from localStorage
    const savedTheme = localStorage.getItem('theme');
    const savedAccentColor = localStorage.getItem('accentColor');
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    }
    
    if (savedAccentColor) {
      setAccentColor(savedAccentColor);
      // Apply accent color immediately
      document.documentElement.style.setProperty('--accent', savedAccentColor);
    }
  }, [setTheme]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSave = async () => {
    setSaveStatus({ type: null, message: '' });
    
    try {
      // Apply accent color immediately to the document
      document.documentElement.style.setProperty('--accent', accentColor);
      
      // Save theme preferences to localStorage
      localStorage.setItem('theme', theme);
      localStorage.setItem('accentColor', accentColor);
      
      // Try to save to API if available
      const response = await fetch('/api/settings/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme, accentColor }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSaveStatus({ type: 'success', message: 'Préférences enregistrées avec succès!' });
      } else {
        setSaveStatus({ type: 'success', message: 'Préférences enregistrées localement!' });
      }
    } catch (error) {
      console.error('Error saving theme settings:', error);
      // Fallback to localStorage only
      localStorage.setItem('theme', theme);
      localStorage.setItem('accentColor', accentColor);
      document.documentElement.style.setProperty('--accent', accentColor);
      setSaveStatus({ type: 'success', message: 'Préférences enregistrées localement!' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Apparence & Thème</h1>
        <p className="text-gray-400 mt-1">
          Personnalisez l'apparence de votre interface
        </p>
      </div>

      {/* Theme Mode Selection */}
      <div className="bg-[#252836] rounded-xl border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Palette className="text-purple-500" size={24} />
            Mode d'affichage
          </h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    if (option.id !== 'system') {
                      handleThemeChange(option.id);
                    } else {
                      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                      handleThemeChange(systemPrefersDark ? 'dark' : 'light');
                    }
                  }}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <Icon 
                      size={32} 
                      className={isSelected ? 'text-purple-500' : 'text-gray-400'} 
                    />
                    <span className={`mt-3 font-medium ${
                      isSelected ? 'text-white' : 'text-gray-300'
                    }`}>
                      {option.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Accent Color */}
      <div className="bg-[#252836] rounded-xl border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Couleur d'accentuation</h2>
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap gap-3">
            {accentColors.map((color) => (
              <button
                key={color.value}
                onClick={() => setAccentColor(color.value)}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  accentColor === color.value
                    ? 'border-white ring-2 ring-purple-500'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ou choisissez une couleur personnalisée
            </label>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-16 h-12 rounded-lg border border-gray-600 cursor-pointer"
            />
            <span className="ml-3 text-gray-300 font-mono">{accentColor}</span>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-[#252836] rounded-xl border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Aperçu</h2>
        </div>
        
        <div className="p-6">
          <div className="bg-[#1a1d29] rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Exemple d'interface</h3>
              <div 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                  border: `1px solid ${accentColor}30`
                }}
              >
                Étiquette
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{ 
                  backgroundColor: accentColor,
                  color: 'white'
                }}
              >
                Bouton principal
              </button>
              
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors">
                Bouton secondaire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-between items-center">
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
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
        >
          <Save size={20} />
          Enregistrer les préférences
        </button>
      </div>
    </div>
  );
}