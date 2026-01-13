import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import MonthManager from '../utils/MonthManager';
import { Button } from './ui/Card';
import hero from '../assets/hero.png';

const Accueil = () => {
  const navigate = useNavigate();
  const [isMonthClosed, setIsMonthClosed] = useState(false);
  const [monthName, setMonthName] = useState('');
  
  useEffect(() => {
    try {
      const currentMonth = MonthManager.getActiveMonth();
      const closedMonths = JSON.parse(localStorage.getItem('closedMonths') || '[]');
      setIsMonthClosed(closedMonths.includes(currentMonth));
      setMonthName(MonthManager.getMonthName(currentMonth));
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  }, []);

  const handleResetApp = () => {
    if (window.confirm('Êtes-vous sûr de vouloir tout réinitialiser ? Cette action est irréversible et supprimera toutes vos données.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dégradé de fond animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50/40"></div>
      
      {/* Formes décoratives animées */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* En-tête avec effets visuels améliorés */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-50 to-orange-50 border border-blue-200/50 text-sm font-medium text-blue-700 mb-8 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <span className={`w-2.5 h-2.5 rounded-full ${isMonthClosed ? 'bg-orange-500' : 'bg-green-500'} mr-2.5 animate-pulse shadow-sm`}></span>
            {isMonthClosed ? 'Mois clôturé' : 'Mois en cours'} • {monthName}
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent animate-fadeIn">
            Bienvenue sur Be-Objectifs
          </h1>
          
          {/* Image hero avec effet */}
          <div className="mb-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="inline-block relative group">
              <img 
                src={hero} 
                alt="Illustration principale" 
                className="w-full max-w-2xl mx-auto hidden sm:block rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-blue-500/20" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            Suivez et atteignez vos objectifs professionnels avec un outil moderne et intuitif.
          </p>

          {/* Bouton avec effets améliorés */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <Button 
              onClick={() => navigate('/objectifs')}
              variant="primary"
              size="lg"
              className="mx-auto group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 hover:from-blue-700 hover:via-blue-600 hover:to-orange-600 shadow-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Button>
          </div>
          
          {/* Éléments décoratifs */}
          <div className="mt-16 flex justify-center items-center space-x-4 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
              <span>Interface intuitive</span>
            </div>
            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
              <span>Suivi en temps réel</span>
            </div>
          </div>
        </div>

        {/* Section de réinitialisation */}
        <div className="text-center mt-20 pb-8 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <Button 
            onClick={handleResetApp}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 hover:text-red-700"
            icon={RefreshCw}
          >
            Réinitialiser l'application
          </Button>
          <p className="text-xs text-gray-500 mt-3">
            Attention : cette action supprimera toutes vos données.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Accueil;