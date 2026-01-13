import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import Accueil from './components/Accueil';
import ObjectifsPage from './components/Objectifs';
import DebriefingPage from './components/Debriefing';
import HistoriquePage from './components/Historique';

function App() {
  const { isDark } = useTheme();
  const { isAuthenticated, isLoaded } = useAuth();

  // Pendant le chargement de l'authentification
  if (!isLoaded) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'dark' : ''}`}>
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className={`flex flex-col min-h-screen ${isDark ? 'dark' : ''}`}>
        {/* Navbar visible uniquement si authentifié */}
        {isAuthenticated && <Navbar />}
        
        <main className={isAuthenticated ? 'flex-1 pt-16' : 'flex-1'}>
          <Routes>
            {/* Route de login (publique) */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Routes protégées */}
            <Route 
              path="/accueil" 
              element={
                <ProtectedRoute>
                  <Accueil />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/objectifs" 
              element={
                <ProtectedRoute>
                  <ObjectifsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/debriefing" 
              element={
                <ProtectedRoute>
                  <DebriefingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/historique" 
              element={
                <ProtectedRoute>
                  <HistoriquePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirection par défaut */}
            <Route path="/" element={<Navigate to={isAuthenticated ? '/accueil' : '/login'} replace />} />
            <Route path="*" element={<Navigate to={isAuthenticated ? '/accueil' : '/login'} replace />} />
          </Routes>
        </main>

        {/* Footer visible uniquement si authentifié */}
        {isAuthenticated && <Footer />}
      </div>
    </Router>
  );
}

export default App;