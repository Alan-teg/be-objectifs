import React from 'react';
import logo from '../assets/logo.png';

const Footer = () => (
  <footer className="border-t border-gray-200 bg-white mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Be-Objectifs" className="h-8 w-8" />
          <div>
            <div className="font-semibold text-blue-900">Be-Objectifs</div>
            <div className="text-xs text-gray-500">Pilotage des objectifs du mois</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span className="font-medium text-gray-700">Contact</span>
          <a className="hover:text-blue-600 transition-colors" href="mailto:contact@beobjectifs.app">
            contact@beobjectifs.app
          </a>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  </footer>
);