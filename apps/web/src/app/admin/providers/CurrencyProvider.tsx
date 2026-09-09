'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Currency = 'FCFA' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('FCFA');

  // Charger la devise sauvegardée au démarrage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency') as Currency | null;
    if (savedCurrency) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  // Sauvegarder le choix dans localStorage
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const toggleCurrency = () => {
    setCurrencyState(prev => prev === 'FCFA' ? 'EUR' : 'FCFA');
  };

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  const formatAmount = (amount: number): string => {
    if (currency === 'FCFA') {
      // Conversion : 1 EUR = 655.957 FCFA (taux officiel CFA)
      const fcfaAmount = amount * 655.957;
      
      // Use compact notation for large numbers
      if (fcfaAmount >= 1000000) {
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XOF',
          notation: 'compact',
          compactDisplay: 'short',
          minimumFractionDigits: 0,
          maximumFractionDigits: 1
        }).format(fcfaAmount);
      }
      
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(fcfaAmount);
    } else {
      // Use compact notation for large numbers in EUR too
      if (amount >= 1000000) {
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
          notation: 'compact',
          compactDisplay: 'short',
          minimumFractionDigits: 0,
          maximumFractionDigits: 1
        }).format(amount);
      }
      
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount);
    }
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      toggleCurrency, 
      setCurrency,
      formatAmount 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}