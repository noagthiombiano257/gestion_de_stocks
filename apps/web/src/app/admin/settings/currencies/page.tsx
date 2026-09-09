'use client';

import { useState, useContext, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Globe, Save, Plus, Edit, Trash2 } from 'lucide-react';
import { useCurrency } from '../../providers/CurrencyProvider';

interface ExchangeRate {
  id: string;
  currency: string;
  code: string;
  rate: number;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
  flag: string;
}

interface ManualRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  createdAt: string;
  createdBy: string;
}

export default function CurrenciesPage() {
  const { currency, setCurrency, formatAmount } = useCurrency();
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [manualRates, setManualRates] = useState<ManualRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('XOF');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [newRate, setNewRate] = useState({ from: 'EUR', to: 'USD', rate: 1.1 });
  const [editingRate, setEditingRate] = useState<string | null>(null);
  const [editRateData, setEditRateData] = useState({ from: '', to: '', rate: 0 });
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  useEffect(() => {
    // Load data from localStorage on mount
    const savedManualRates = localStorage.getItem('manualRates');
    if (savedManualRates) {
      try {
        setManualRates(JSON.parse(savedManualRates));
      } catch (error) {
        console.error('Error parsing saved manual rates:', error);
      }
    }
    
    // Simulate loading exchange rates
    setTimeout(() => {
      const mockRates: ExchangeRate[] = [
        {
          id: '1',
          currency: 'Euro',
          code: 'EUR',
          rate: 1,
          lastUpdated: '2024-01-15T10:30:00Z',
          trend: 'stable',
          flag: '🇪🇺'
        },
        {
          id: '2',
          currency: 'Franc CFA',
          code: 'XOF',
          rate: 655.957,
          lastUpdated: '2024-01-15T10:30:00Z',
          trend: 'up',
          flag: '🇨🇮'
        },
        {
          id: '3',
          currency: 'Dollar US',
          code: 'USD',
          rate: 1.08,
          lastUpdated: '2024-01-15T10:30:00Z',
          trend: 'down',
          flag: '🇺🇸'
        },
        {
          id: '4',
          currency: 'Livre Sterling',
          code: 'GBP',
          rate: 0.85,
          lastUpdated: '2024-01-15T10:30:00Z',
          trend: 'up',
          flag: '🇬🇧'
        },
        {
          id: '5',
          currency: 'Yen Japonais',
          code: 'JPY',
          rate: 162.5,
          lastUpdated: '2024-01-15T10:30:00Z',
          trend: 'stable',
          flag: '🇯🇵'
        }
      ];
      
      setExchangeRates(mockRates);
      setLastUpdate(new Date().toLocaleString('fr-FR'));
      setLoading(false);
    }, 800);
  }, []);

  const handleRefreshRates = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLastUpdate(new Date().toLocaleString('fr-FR'));
      setLoading(false);
    }, 1500);
  };

  const handleAddManualRate = () => {
    try {
      const newManualRate: ManualRate = {
        id: `manual-${Date.now()}`,
        fromCurrency: newRate.from,
        toCurrency: newRate.to,
        rate: newRate.rate,
        createdAt: new Date().toISOString(),
        createdBy: 'current-user@shopflow.fr'
      };
      
      setManualRates([...manualRates, newManualRate]);
      setNewRate({ from: 'EUR', to: 'USD', rate: 1.1 });
      setSaveStatus({ type: 'success', message: 'Taux personnalisé ajouté avec succès!' });
      
      // Save to localStorage for persistence
      localStorage.setItem('manualRates', JSON.stringify([...manualRates, newManualRate]));
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Erreur lors de l\'ajout du taux' });
    }
  };

  const handleConvert = () => {
    const amt = parseFloat(amount) || 0;
    let result = 0;
    
    // Find exchange rates
    const fromRate = exchangeRates.find(r => r.code === fromCurrency)?.rate || 1;
    const toRate = exchangeRates.find(r => r.code === toCurrency)?.rate || 1;
    
    // Convert: amount in EUR -> amount in fromCurrency -> amount in toCurrency
    const amountInEUR = fromCurrency === 'EUR' ? amt : amt / fromRate;
    result = toCurrency === 'EUR' ? amountInEUR : amountInEUR * toRate;
    
    setConvertedAmount(result.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }));
  };

  const handleDeleteRate = (id: string) => {
    try {
      const updatedRates = manualRates.filter(rate => rate.id !== id);
      setManualRates(updatedRates);
      setSaveStatus({ type: 'success', message: 'Taux supprimé avec succès!' });
      
      // Update localStorage
      localStorage.setItem('manualRates', JSON.stringify(updatedRates));
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Erreur lors de la suppression du taux' });
    }
  };

  const handleEditRate = (id: string) => {
    const rate = manualRates.find(r => r.id === id);
    if (rate) {
      setEditingRate(id);
      setEditRateData({
        from: rate.fromCurrency,
        to: rate.toCurrency,
        rate: rate.rate
      });
    }
  };

  const handleSaveEditRate = () => {
    if (!editingRate) return;
    
    try {
      const updatedRates = manualRates.map(rate => 
        rate.id === editingRate 
          ? { ...rate, ...editRateData }
          : rate
      );
      setManualRates(updatedRates);
      setEditingRate(null);
      setEditRateData({ from: '', to: '', rate: 0 });
      setSaveStatus({ type: 'success', message: 'Taux mis à jour avec succès!' });
      
      // Update localStorage
      localStorage.setItem('manualRates', JSON.stringify(updatedRates));
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Erreur lors de la mise à jour du taux' });
    }
  };

  const handleCancelEdit = () => {
    setEditingRate(null);
    setEditRateData({ from: '', to: '', rate: 0 });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="text-green-400" size={16} />;
      case 'down': return <TrendingDown className="text-red-400" size={16} />;
      default: return <div className="w-4 h-4 rounded-full bg-gray-400"></div>;
    }
  };

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
          <h1 className="text-2xl font-bold text-white">Multi-devises</h1>
          <p className="text-gray-400 mt-1">
            Gérez les devises et taux de change de votre application
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg">
          <Globe size={20} className="text-white" />
          <span className="text-white font-medium">Devise actuelle: {currency}</span>
        </div>
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

      {/* Currency Converter Demo */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-500/30 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Convertisseur de devises</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Montant</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1d29] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">De</label>
            <select 
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1d29] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="XOF">XOF</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Vers</label>
            <select 
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1d29] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="XOF">XOF</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleConvert}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
            >
              Convertir
            </button>
          </div>
        </div>
        <div className="mt-4 p-4 bg-[#1a1d29] rounded-lg">
          <p className="text-center text-white font-medium break-words">
            {amount} {fromCurrency} = {convertedAmount || '0,00'} {toCurrency}
          </p>
        </div>
      </div>

      {/* Exchange Rates */}
      <div className="bg-[#252836] rounded-xl border border-gray-800">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Taux de change actuels</h2>
          <div className="text-sm text-gray-400">
            Dernière mise à jour: {lastUpdate}
          </div>
        </div>
        
        <div className="divide-y divide-gray-800">
          {exchangeRates.map((rate) => (
            <div key={rate.id} className="p-6 hover:bg-gray-800/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{rate.flag}</div>
                  <div>
                    <h3 className="font-semibold text-white">{rate.currency}</h3>
                    <p className="text-gray-400">{rate.code}</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    1 EUR = {rate.rate.toLocaleString('fr-FR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 5
                    })} {rate.code}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    {getTrendIcon(rate.trend)}
                    <span className="text-sm text-gray-400">
                      {rate.trend === 'up' ? 'En hausse' : 
                       rate.trend === 'down' ? 'En baisse' : 'Stable'}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <button 
                    onClick={() => setCurrency(rate.code as 'FCFA' | 'EUR')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currency === rate.code
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    }`}
                  >
                    {currency === rate.code ? 'Actif' : 'Utiliser'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Exchange Rates */}
      <div className="bg-[#252836] rounded-xl border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Taux personnalisés</h2>
          
          {/* Add new rate form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-800/30 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Devise source</label>
              <select 
                value={newRate.from}
                onChange={(e) => setNewRate({...newRate, from: e.target.value})}
                className="w-full px-3 py-2 bg-[#1a1d29] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="XOF">XOF</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Devise cible</label>
              <select 
                value={newRate.to}
                onChange={(e) => setNewRate({...newRate, to: e.target.value})}
                className="w-full px-3 py-2 bg-[#1a1d29] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                <option value="LTC">LTC</option>
                <option value="XRP">XRP</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Taux</label>
              <input
                type="number"
                step="0.000001"
                value={newRate.rate}
                onChange={(e) => setNewRate({...newRate, rate: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 bg-[#1a1d29] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleAddManualRate}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Ajouter
              </button>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-800">
          {manualRates.length === 0 ? (
            <div className="p-12 text-center">
              <Globe className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <p className="text-gray-400">Aucun taux personnalisé configuré</p>
            </div>
          ) : (
            manualRates.map((rate) => (
              <div key={rate.id} className="p-6 hover:bg-gray-800/30 transition-colors">
                {editingRate === rate.id ? (
                  // Edit mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Devise source</label>
                        <select 
                          value={editRateData.from}
                          onChange={(e) => setEditRateData({...editRateData, from: e.target.value})}
                          className="w-full px-3 py-2 bg-[#1a1d29] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="EUR">EUR</option>
                          <option value="USD">USD</option>
                          <option value="XOF">XOF</option>
                          <option value="GBP">GBP</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Devise cible</label>
                        <select 
                          value={editRateData.to}
                          onChange={(e) => setEditRateData({...editRateData, to: e.target.value})}
                          className="w-full px-3 py-2 bg-[#1a1d29] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="BTC">BTC</option>
                          <option value="ETH">ETH</option>
                          <option value="LTC">LTC</option>
                          <option value="XRP">XRP</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Taux</label>
                        <input
                          type="number"
                          step="0.000001"
                          value={editRateData.rate}
                          onChange={(e) => setEditRateData({...editRateData, rate: parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 bg-[#1a1d29] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSaveEditRate}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">
                        {rate.fromCurrency} → {rate.toCurrency}
                      </h3>
                      <p className="text-gray-400 mt-1">
                        Taux: 1 {rate.fromCurrency} = {rate.rate} {rate.toCurrency}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
                        <span>Créé par: {rate.createdBy}</span>
                        <span>•</span>
                        <span>{new Date(rate.createdAt).toLocaleString('fr-FR')}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditRate(rate.id)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteRate(rate.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}