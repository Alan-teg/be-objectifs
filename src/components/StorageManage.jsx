




// Vérifier si un mois est clôturé
const isMonthClosed = (month) => {
  const closedMonths = JSON.parse(localStorage.getItem('closedMonths') || '[]');
  return closedMonths.includes(month);
};

// Vérifier si une opération est autorisée sur un mois
const checkMonthOperation = (month, operation = 'read') => {
  if (isMonthClosed(month) && operation !== 'read') {
    throw new Error(`Le mois ${month} est clôturé et ne peut plus être modifié.`);
  }
  return true;
};

// Utilitaires de stockage
const StorageManager = {
  // Obtenir les objectifs d'un mois (format YYYY-MM)
  getObjectives: (month = new Date().toISOString().slice(0, 7)) => {
    checkMonthOperation(month, 'read');
    const data = localStorage.getItem(`objectives_${month}`);
    return data ? JSON.parse(data) : [];
  },
  
  // Sauvegarder les objectifs d'un mois
  saveObjectives: (objectives, month = new Date().toISOString().slice(0, 7)) => {
    checkMonthOperation(month, 'write');
    localStorage.setItem(`objectives_${month}`, JSON.stringify(objectives));
  },
  
  // Obtenir tous les mois avec objectifs
  getAllMonths: () => {
    const months = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('objectives_')) {
        months.push(key.replace('objectives_', ''));
      }
    }
    return months.sort().reverse();
  },

  // Obtenir les objectifs d'une date spécifique dans un mois
  getObjectivesByDate: (date, month) => {
    const allObjectives = this.getObjectives(month);
    return allObjectives.filter(obj => obj.date === date);
  },

  // Ajouter un objectif au mois spécifié
  addObjective: (objective, month = new Date().toISOString().slice(0, 7)) => {
    const objectives = this.getObjectives(month);
    const newObjective = {
      ...objective,
      id: objective.id || Date.now(),
      month: month,
      year: parseInt(month.split('-')[0]),
      createdAt: objective.createdAt || new Date().toISOString()
    };
    objectives.push(newObjective);
    this.saveObjectives(objectives, month);
    return newObjective;
  },

  // Mettre à jour un objectif
  updateObjective: (objectiveId, updates, month = new Date().toISOString().slice(0, 7)) => {
    checkMonthOperation(month, 'write');
    const objectives = this.getObjectives(month);
    const index = objectives.findIndex(o => o.id === objectiveId);
    if (index !== -1) {
      objectives[index] = {
        ...objectives[index],
        ...updates,
        month: month,
        year: parseInt(month.split('-')[0]),
        updatedAt: new Date().toISOString()
      };
      this.saveObjectives(objectives, month);
      return objectives[index];
    }
    return null;
  },

  // Supprimer un objectif
  deleteObjective: (objectiveId, month = new Date().toISOString().slice(0, 7)) => {
    checkMonthOperation(month, 'write');
    const objectives = this.getObjectives(month);
    const filtered = objectives.filter(o => o.id !== objectiveId);
    this.saveObjectives(filtered, month);
    return filtered.length < objectives.length;
  },

  // Obtenir un objectif spécifique
  getObjective: (objectiveId, month = new Date().toISOString().slice(0, 7)) => {
    const objectives = this.getObjectives(month);
    return objectives.find(o => o.id === objectiveId);
  },

  // Obtenir les objectifs filtrés par statut
  getObjectivesByStatus: (status, month = new Date().toISOString().slice(0, 7)) => {
    const objectives = this.getObjectives(month);
    return objectives.filter(o => o.status === status);
  },
  
  // Vérifier si un mois est clôturé
  isMonthClosed: (month) => {
    return isMonthClosed(month);
  },
  
  // Récupérer tous les mois clôturés
  getClosedMonths: () => {
    return JSON.parse(localStorage.getItem('closedMonths') || '[]');
  },
  
  // Enregistrer un rapport mensuel
  saveMonthlyReport: (month, report) => {
    const reports = JSON.parse(localStorage.getItem('monthlyReports') || '{}');
    reports[month] = report;
    localStorage.setItem('monthlyReports', JSON.stringify(reports));
  },
  
  // Récupérer un rapport mensuel
  getMonthlyReport: (month) => {
    const reports = JSON.parse(localStorage.getItem('monthlyReports') || '{}');
    return reports[month] || null;
  },
  
  // Vérifier si un mois a un rapport
  hasMonthlyReport: (month) => {
    const reports = JSON.parse(localStorage.getItem('monthlyReports') || '{}');
    return month in reports;
  },

  // Obtenir les objectifs filtrés par type
  getObjectivesByType: (type, month = new Date().toISOString().slice(0, 7)) => {
    const objectives = this.getObjectives(month);
    return objectives.filter(o => o.type === type);
  }
};

export default StorageManager;