import React from 'react';

// Composant de base pour les cartes - Design moderne avec coins arrondis et ombre douce
const Card = ({ children, className = '', bordered = true, ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl overflow-hidden transition-all duration-300 group ${
        bordered ? 'border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// En-tête de carte avec bordure inférieure subtile
const CardHeader = ({ children, className = '', ...props }) => (
  <div 
    className={`px-6 py-5 border-b border-gray-100 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

// Titre de carte avec style cohérent - Hiérarchie visuelle claire
const CardTitle = ({ children, className = '', level = 3, ...props }) => {
  const baseStyles = 'font-semibold text-blue-900 leading-tight';
  const levelStyles = {
    1: 'text-2xl',
    2: 'text-xl',
    3: 'text-lg',
  };
  
  const Tag = `h${level}`;
  return React.createElement(
    Tag,
    { className: `${baseStyles} ${levelStyles[level] || levelStyles[3]} ${className}`, ...props },
    children
  );
};

// Sous-titre de carte avec style discret
const CardSubtitle = ({ children, className = '', ...props }) => (
  <p 
    className={`text-sm text-gray-500 ${className}`} 
    {...props}
  >
    {children}
  </p>
);

// Contenu principal de la carte avec espacement cohérent et respirant
const CardContent = ({ children, className = '', padded = true, ...props }) => (
  <div 
    className={`${padded ? 'p-6' : ''} ${className}`} 
    {...props}
  >
    {children}
  </div>
);

// Pied de carte avec fond légèrement grisé
const CardFooter = ({ children, className = '', ...props }) => (
  <div 
    className={`px-5 py-4 bg-gray-50 border-t border-gray-100 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Badge pour les statuts et indicateurs - Design moderne avec orange pour les accents
const Badge = ({ 
  children, 
  variant = 'default', 
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200',
    success: 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200',
    warning: 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-800 border border-orange-200',
    accent: 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-800 border border-orange-200',
    danger: 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200',
    info: 'bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 border border-blue-200',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 shadow-sm ${
        variants[variant] || variants.default
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Bouton personnalisé avec plusieurs variantes - Micro-animations et design moderne
const Button = ({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none hover:scale-105 active:scale-95 relative overflow-hidden group';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 text-white hover:from-blue-700 hover:via-blue-600 hover:to-orange-600 focus:ring-blue-500 shadow-md hover:shadow-lg hover:shadow-orange-500/30',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-orange-50/30 hover:border-blue-400 focus:ring-blue-500',
    accent: 'bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-orange-600 hover:to-orange-500 focus:ring-orange-500 shadow-md hover:shadow-lg hover:shadow-orange-500/40',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md',
    warning: 'bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-orange-600 hover:to-orange-500 focus:ring-orange-500 shadow-md hover:shadow-lg',
    outline: 'bg-transparent border-2 border-blue-400 text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-orange-50/30 hover:border-blue-500 focus:ring-blue-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-orange-50/30 focus:ring-blue-500',
    link: 'bg-transparent text-blue-600 hover:text-orange-600 hover:underline focus:ring-blue-500 transition-colors duration-300',
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {/* Effet de brillance pour les boutons avec dégradé */}
      {(variant === 'primary' || variant === 'accent' || variant === 'warning') && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      )}
      
      <span className="relative z-10 flex items-center">
        {Icon && iconPosition === 'left' && (
          <Icon className={`${children ? 'mr-2' : ''} h-4 w-4 transition-transform duration-300 group-hover:scale-110`} />
        )}
        {children}
        {Icon && iconPosition === 'right' && (
          <Icon className={`${children ? 'ml-2' : ''} h-4 w-4 transition-transform duration-300 group-hover:scale-110`} />
        )}
      </span>
    </button>
  );
};

const Input = ({ label, value, onChange, type = 'text', placeholder = '', required = false }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    />
  </div>
);

const Select = ({ label, value, onChange, options, required = false }) => (
  <div className="mb-5">
    {label && <label className="block text-sm font-semibold text-blue-900 mb-2">{label}</label>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
    >
      <option value="">Sélectionner...</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// Composant Modal de confirmation - Réutilisable pour toutes les confirmations
const ConfirmationModal = ({ 
  isOpen = false, 
  title = 'Confirmation', 
  message = '', 
  onConfirm = () => {}, 
  onCancel = () => {}, 
  confirmText = 'Confirmer', 
  cancelText = 'Annuler',
  isDangerous = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay semi-transparent */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Contenu de la modale */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 animate-fadeIn">
        <div className="p-6">
          {/* Titre */}
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {title}
          </h2>
          
          {/* Message */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {message}
          </p>
          
          {/* Boutons d'action */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              size="md"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
            <Button
              variant={isDangerous ? 'danger' : 'primary'}
              size="md"
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exportation de tous les composants
export {
  Card as default,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardContent,
  CardFooter,
  Badge,
  Button,
  Input,
  Select,
  ConfirmationModal
};