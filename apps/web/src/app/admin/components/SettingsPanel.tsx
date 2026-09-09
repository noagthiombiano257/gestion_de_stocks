'use client';

import { useState } from 'react';
import { Sun, Moon, Euro, CircleDollarSign } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';
import { useCurrency } from '../providers/CurrencyProvider';

export default function SettingsPanel() {
  const { theme, toggleTheme, setTheme } = useTheme();
  const { currency, toggleCurrency, setCurrency, formatAmount } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions = [
    { id: 'dark', label: 'Sombre', icon: Moon },
    { id: 'light', label: 'Clair', icon: Sun }
  ];

  const currencyOptions = [
    { id: 'FCFA', label: 'Franc CFA (XOF)', icon: CircleDollarSign },
    { id: 'EUR', label: 'Euro (€)', icon: Euro }
  ];

  return (
    <div className="relative">
      {/* Bouton pour ouvrir le panneau */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-[#252836] hover:bg-[#2d3142] text-white px-4 py-2 rounded-lg transition-colors"
      >
        <Sun className="w-4 h-4" />
        <span>Paramètres</span>
      </button>

      {/* Panneau de paramètres */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1a1d29] border border-gray-700 rounded-lg shadow-xl z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Paramètres</h3>
            <p className="text-sm text-gray-400">Personnalisez votre expérience</p>
          </div>

          {/* Contenu */}
          <div className="p-4 space-y-6">
            {/* Thème */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Thème</h4>
              <div className="space-y-2">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = theme === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => setTheme(option.id as any)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isSelected 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{option.label}</span>
                      {isSelected && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Devise */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Devise</h4>
              <div className="space-y-2">
                {currencyOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = currency === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => setCurrency(option.id as any)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isSelected 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{option.label}</span>
                      {isSelected && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Exemple de conversion */}
              <div className="mt-3 p-3 bg-gray-800/30 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Exemple de conversion :</p>
                <p className="text-sm text-white">
                  100 € = {formatAmount(100)}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 flex justify-between items-center">
            <button
              onClick={() => {
                setTheme('dark');
                setCurrency('FCFA');
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Réinitialiser
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Overlay pour fermer quand on clique à l'extérieur */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}