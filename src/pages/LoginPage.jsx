import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Card';
import logo from '../assets/logo.png';

/**
 * Page de connexion (Login)
 * - Formulaire simple et intuitif
 * - Validation locale uniquement
 * - Design cohérent avec l'app
 * - Aucun impact sur la logique métier
 */

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation locale simple
    if (!username.trim()) {
      setError('Veuillez entrer un identifiant');
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Veuillez entrer un mot de passe');
      setIsLoading(false);
      return;
    }

    if (password.length < 3) {
      setError('Le mot de passe doit contenir au moins 3 caractères');
      setIsLoading(false);
      return;
    }

    // Simuler un délai réseau (environ 500ms)
    setTimeout(() => {
      const success = login(username, password);
      
      if (success) {
        // Redirection vers l'accueil
        navigate('/accueil');
      } else {
        setError('Erreur lors de la connexion. Veuillez réessayer.');
      }
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50/30 flex items-center justify-center px-4 py-12">
      {/* Dégradés de fond animés */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Conteneur du formulaire */}
      <div className="relative w-full max-w-md">
        {/* Carte de connexion */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-blue-500/10 overflow-hidden animate-fadeIn">
          
          {/* En-tête avec dégradé */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 p-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img
                  src={logo}
                  alt="Be-Objectifs"
                  className="h-16 w-auto drop-shadow-lg"
                />
              </div>
            </div>
            <h1 className="text-white text-3xl font-bold text-center">Be-Objectifs</h1>
            <p className="text-blue-100 text-center text-sm mt-2">
              Gestion d'objectifs professionnels
            </p>
          </div>

          {/* Contenu du formulaire */}
          <div className="p-8">
            {/* Message d'erreur */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 animate-fadeIn">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Champ Identifiant */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Identifiant
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Entrez votre identifiant"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 outline-none"
                  disabled={isLoading}
                />
              </div>

              {/* Champ Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 outline-none"
                  disabled={isLoading}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit(e);
                    }
                  }}
                />
              </div>

              {/* Bouton de connexion */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                className="mt-6"
                disabled={isLoading}
                icon={LogIn}
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </form>

            {/* Info utilisateur */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600 mb-2">
                <span className="font-semibold text-blue-900">💡 Accès test :</span>
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• <span className="font-mono text-blue-700">Identifiant</span> : n'importe quel texte</li>
                <li>• <span className="font-mono text-blue-700">Mot de passe</span> : minimum 3 caractères</li>
              </ul>
            </div>
          </div>

          {/* Pied de formulaire */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <p className="text-xs text-center text-gray-500">
              © 2026 Be-Objectifs. Plateforme de gestion d'objectifs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
