// Utilitaire pour gérer le mois actif de l'application
const MonthManager = {
  // Obtenir le mois courant au format YYYY-MM
  getCurrentMonth: () => {
    return new Date().toISOString().slice(0, 7);
  },

  // Obtenir le mois actif stocké ou le mois courant par défaut
  getActiveMonth: () => {
    const stored = localStorage.getItem('activeMonth');
    if (stored) {
      return stored;
    }
    const current = MonthManager.getCurrentMonth();
    localStorage.setItem('activeMonth', current);
    return current;
  },

  // Définir le mois actif
  setActiveMonth: (month) => {
    if (!/^\d{4}-\d{2}$/.test(month)) {
      console.error('Format de mois invalide. Utilisez YYYY-MM');
      return false;
    }
    localStorage.setItem('activeMonth', month);
    return true;
  },

  // Réinitialiser le mois actif au mois courant
  resetToCurrentMonth: () => {
    const current = MonthManager.getCurrentMonth();
    localStorage.setItem('activeMonth', current);
    return current;
  },

  // Obtenir les infos du mois (année et mois)
  getMonthInfo: (month = null) => {
    const monthStr = month || MonthManager.getActiveMonth();
    const [year, monthNum] = monthStr.split('-').map(Number);
    return { year, month: monthNum, monthStr };
  },

  // Obtenir le mois précédent
  getPreviousMonth: (month = null) => {
    const monthStr = month || MonthManager.getActiveMonth();
    const date = new Date(monthStr + '-01');
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().slice(0, 7);
  },

  // Obtenir le mois suivant
  getNextMonth: (month = null) => {
    const monthStr = month || MonthManager.getActiveMonth();
    const date = new Date(monthStr + '-01');
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().slice(0, 7);
  },

  // Obtenir le nom du mois en français
  getMonthName: (month = null) => {
    const monthStr = month || MonthManager.getActiveMonth();
    return new Date(monthStr + '-01').toLocaleDateString('fr-FR', { 
      month: 'long', 
      year: 'numeric' 
    });
  },

  // Obtenir le nom court du mois (ex: "Jan 2026")
  getMonthNameShort: (month = null) => {
    const monthStr = month || MonthManager.getActiveMonth();
    return new Date(monthStr + '-01').toLocaleDateString('fr-FR', { 
      month: 'short', 
      year: 'numeric' 
    });
  },

  // Vérifier si deux mois sont identiques
  isSameMonth: (month1, month2) => {
    return month1 === month2;
  },

  // Vérifier si le mois est le mois courant
  isCurrentMonth: (month) => {
    return month === MonthManager.getCurrentMonth();
  },
  
  // Vérifier si un mois est passé par rapport au mois actuel
  isPastMonth: (month) => {
    if (!month) return false;
    const current = MonthManager.getCurrentMonth();
    return month < current;
  }
};

export default MonthManager;
