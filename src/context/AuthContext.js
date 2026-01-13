import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Context d'authentification
 * - Gestion de l'état de connexion
 * - Persistance en localStorage séparé
 * - Aucun impact sur la logique métier existante
 */

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger l'état d'authentification depuis localStorage au montage
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('auth_state');
      if (savedAuth) {
        const auth = JSON.parse(savedAuth);
        setUser(auth.user);
        setIsAuthenticated(auth.isAuthenticated);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'authentification:', error);
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoaded(true);
  }, []);

  // Fonction de connexion (validation locale uniquement)
  const login = (username, password) => {
    // Validation simple (pas de backend)
    if (username && password && username.length > 0 && password.length > 0) {
      const authData = {
        isAuthenticated: true,
        user: {
          username: username,
          loginTime: new Date().toISOString()
        }
      };
      
      setIsAuthenticated(true);
      setUser(authData.user);
      
      // Sauvegarder dans localStorage
      try {
        localStorage.setItem('auth_state', JSON.stringify(authData));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'authentification:', error);
      }
      
      return true;
    }
    return false;
  };

  // Fonction de déconnexion
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    
    try {
      localStorage.removeItem('auth_state');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'authentification:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    isLoaded
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
