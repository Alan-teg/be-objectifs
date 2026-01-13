import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Composant de protection des routes
 * - Redirige vers /login si non authentifié
 * - Laisse passer si authentifié
 * - Affiche un chargement pendant que l'auth se charge
 */

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoaded } = useAuth();

  // Pendant le chargement de l'état d'authentification
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Si non authentifié, rediriger vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si authentifié, afficher le contenu
  return children;
};

export default ProtectedRoute;
