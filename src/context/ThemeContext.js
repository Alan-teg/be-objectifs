import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Context de gestion du thème (clair/sombre)
 * - Gestion d'état indépendante
 * - Persistance en localStorage séparé
 * - Aucune modification des composants existants
 */

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé dans un ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger le thème depuis localStorage au montage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('appTheme');
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved);
      } else {
        // Déterminer le thème préféré du système
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du thème:', error);
      setTheme('light');
    }
    setIsLoaded(true);
  }, []);

  // Sauvegarder le thème dans localStorage quand il change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('appTheme', theme);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du thème:', error);
      }
    }
  }, [theme, isLoaded]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const isDark = theme === 'dark';

  // Valeur du contexte
  const value = {
    theme,
    isDark,
    toggleTheme,
    isLoaded
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
