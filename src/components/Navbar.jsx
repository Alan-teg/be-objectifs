import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Target, BarChart3, History } from 'lucide-react';
import logo from '../assets/logo.png';

const navItems = [
  { key: 'accueil', label: 'Accueil', icon: Home, path: '/accueil' },
  { key: 'objectifs', label: 'Objectifs', icon: Target, path: '/objectifs' },
  { key: 'debriefing', label: 'Debriefing', icon: BarChart3, path: '/debriefing' },
  { key: 'historique', label: 'Historique', icon: History, path: '/historique' }
];

const Navbar = () => {
  const location = useLocation();

  // Vérifie si l'onglet est actif
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et nom de l'application avec effet hover */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <img
                className="h-14 w-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                src={logo}
                alt="Be-Objectifs"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-500 opacity-0 group-hover:opacity-20 rounded-lg blur-sm transition-opacity duration-300"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent hidden sm:block transition-all duration-300 group-hover:scale-105">
              Be-Objectifs
            </span>
          </div>
          
          {/* Navigation desktop - Barre d'onglets fixe avec effets fluides */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <NavLink
                  key={item.key}
                  to={item.path}
                  className={`group flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 relative overflow-hidden ${
                    active
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-orange-50/30'
                  }`}
                >
                  {/* Effet de brillance au survol */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  <item.icon className={`mr-2 h-5 w-5 transition-all duration-300 relative z-10 ${
                    active 
                      ? 'text-blue-600 scale-110' 
                      : 'text-gray-500 group-hover:text-blue-600 group-hover:scale-110 group-hover:rotate-12'
                  }`} />
                  <span className="relative z-10">{item.label}</span>
                  
                  {/* Indicateur visuel pour l'onglet actif avec dégradé */}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 rounded-full animate-pulse-glow"></span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Mobile menu button avec effets améliorés */}
          <div className="flex items-center md:hidden">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <NavLink
                    key={item.key}
                    to={item.path}
                    className={`p-2 rounded-lg transition-all duration-300 relative ${
                      active
                        ? 'bg-gradient-to-br from-blue-50 to-orange-50 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50/50'
                    }`}
                    title={item.label}
                  >
                    <item.icon className={`h-5 w-5 transition-all duration-300 ${
                      active ? 'text-blue-600 scale-110' : 'text-gray-500'
                    }`} />
                    {active && (
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full"></span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;