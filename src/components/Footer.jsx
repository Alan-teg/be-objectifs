import React from 'react';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.png';

/**
 * Composant Footer global
 * - Positionné en bas de toutes les pages
 * - Contient copyright et informations légales
 * - Support du dark mode
 * - Design sobre et professionnel
 */

const Footer = () => {
  const { isDark } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`mt-auto transition-colors duration-300 ${
      isDark
        ? 'bg-gray-900 border-t border-gray-800'
        : 'bg-white border-t border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contenu principal du footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Section Logo et description */}
          <div className="flex flex-col items-start space-y-3">
            <div className="flex items-center space-x-2 group">
              <img
                src={logo}
                alt="Be-Objectifs"
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
              />
              <span className={`font-semibold text-lg ${
                isDark ? 'text-gray-100' : 'text-blue-900'
              }`}>
                Be-Objectifs
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Plateforme de gestion d'objectifs. Organise, suis et valide les buts avec efficacité.
            </p>
          </div>
        </div>

        {/* Séparateur */}
        <div className={`my-8 ${
          isDark ? 'border-gray-800' : 'border-gray-200'
        } border-t`}></div>

        {/* Pied de page */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Copyright */}
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
             <p className={`text-sm ${
            isDark ? 'text-gray-500' : 'text-gray-600'
          }`}>
            © {currentYear} <span className="font-semibold text-orange-600 dark:text-orange-400">BETOGETHERS</span>. Tous droits réservés.
          </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;