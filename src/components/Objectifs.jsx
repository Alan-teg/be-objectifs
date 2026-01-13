import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, CheckCircle, Target, User, Calendar, TrendingUp } from 'lucide-react';
import MonthManager from '../utils/MonthManager';
import StorageManager from './StorageManage.jsx';
import MonthSelector from './MonthSelector';
import Card, { 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Button, 
  Badge,
  Input,
  Select
} from './ui/Card';

// Composant Badge pour afficher l'état
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { label: 'En attente', color: 'bg-orange-100 text-orange-800' },
    evaluated: { label: 'Évalué', color: 'bg-blue-100 text-blue-800' },
    validated: { label: 'Validé', color: 'bg-green-100 text-green-800' },
    closed: { label: 'Clôturé', color: 'bg-gray-100 text-gray-800' }
  };

  return (
    <Badge variant={status === 'pending' ? 'warning' : status === 'validated' ? 'success' : 'primary'}>
      {statusConfig[status]?.label || status}
    </Badge>
  );
};

// Page Objectifs - Saisie et évaluation des objectifs
const ObjectifsPage = () => {
  const [allObjectives, setAllObjectives] = useState([]);
  const [activeMonth, setActiveMonth] = useState(MonthManager.getActiveMonth());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [evaluatingId, setEvaluatingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    text: '',
    type: '',
    status: 'pending',
    date: '',
    targetValue: ''
  });
  const [evaluationData, setEvaluationData] = useState({
    evaluatedValue: ''
  });
  
  useEffect(() => {
    loadAllObjectives();
  }, [activeMonth]);
  
  const loadAllObjectives = () => {
    const objectives = StorageManager.getObjectives(activeMonth);
    setAllObjectives(objectives);
  };
  
  const handleMonthChange = (newMonth) => {
    setActiveMonth(newMonth);
    setEditingId(null);
    setEvaluatingId(null);
    setShowForm(false);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      const updated = allObjectives.map(obj => 
        obj.id === editingId ? { 
          ...formData, 
          id: editingId,
          month: activeMonth,
          year: parseInt(activeMonth.split('-')[0])
        } : obj
      );
      StorageManager.saveObjectives(updated, activeMonth);
      setEditingId(null);
    } else {
      const newObj = { 
        ...formData, 
        id: Date.now(), 
        date: formData.date || new Date().toISOString().split('T')[0],
        month: activeMonth,
        year: parseInt(activeMonth.split('-')[0]),
        status: 'pending',
        evaluatedValue: null,
        createdAt: new Date().toISOString()
      };
      const monthObjectives = StorageManager.getObjectives(activeMonth);
      StorageManager.saveObjectives([...monthObjectives, newObj], activeMonth);
    }
    loadAllObjectives();
    setFormData({ name: '', text: '', type: '', status: 'pending', date: '', targetValue: '' });
    setShowForm(false);
  };
  
  const handleEdit = (obj) => {
    setFormData(obj);
    setEditingId(obj.id);
    setShowForm(true);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      const updated = allObjectives.filter(obj => obj.id !== id);
      StorageManager.saveObjectives(updated, activeMonth);
      loadAllObjectives();
    }
  };
  
  const handleEvaluate = (obj) => {
    setEvaluatingId(obj.id);
    setEvaluationData({ evaluatedValue: obj.evaluatedValue || '' });
  };

  const handleSaveEvaluation = (objectiveId) => {
    const evaluatedValue = evaluationData.evaluatedValue;
    
    if (evaluatedValue === '' || evaluatedValue === null) {
      alert('Veuillez entrer une valeur d\'évaluation');
      return;
    }

    const value = parseFloat(evaluatedValue);
    const obj = allObjectives.find(o => o.id === objectiveId);
    const percentage = Math.round((value / obj.targetValue) * 100);
    const isSuccess = percentage >= 60;

    const updated = allObjectives.map(obj => 
      obj.id === objectiveId ? { 
        ...obj, 
        evaluatedValue: value, 
        status: 'validated',
        validationType: isSuccess ? 'success' : 'failure',
        percentage: percentage,
        achievedAt: new Date().toISOString().split('T')[0],
        month: activeMonth,
        year: parseInt(activeMonth.split('-')[0]),
        updatedAt: new Date().toISOString()
      } : obj
    );

    StorageManager.saveObjectives(updated, activeMonth);
    loadAllObjectives();
    setEvaluatingId(null);
    setEvaluationData({ evaluatedValue: '' });
  };

  const handleCancelEvaluation = () => {
    setEvaluatingId(null);
    setEvaluationData({ evaluatedValue: '' });
  };
  
  const userTypes = [
    { value: 'studio', label: 'Studio' },
    { value: 'developer', label: 'Développeur' },
    { value: 'chef', label: 'Chef' }
  ];
  
  const filteredObjectives = allObjectives.filter(obj => {
    const typeMatch = filterType === 'all' || obj.type === filterType;
    return typeMatch;
  });
  
  const stats = {
    total: allObjectives.length,
    pending: allObjectives.filter(o => o.status === 'pending').length,
    validated: allObjectives.filter(o => o.status === 'validated').length
  };

  // Déterminer le statut global du mois
  const getMonthStatus = () => {
    const closedMonths = StorageManager.getClosedMonths();
    return closedMonths.includes(activeMonth) ? 'closed' : 'open';
  };

  const isMonthClosed = getMonthStatus() === 'closed';
  const monthName = MonthManager.getMonthName(activeMonth);

  // Calculer le pourcentage pour l'objectif en cours d'évaluation
  const getEvaluationPercentage = (objectiveId) => {
    if (!evaluatingId || evaluatingId !== objectiveId) return null;
    const obj = allObjectives.find(o => o.id === objectiveId);
    if (!obj || !evaluationData.evaluatedValue) return null;
    const value = parseFloat(evaluationData.evaluatedValue);
    if (isNaN(value)) return null;
    return Math.round((value / obj.targetValue) * 100);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Gestion des Objectifs</h1>
              <p className="text-gray-600">
                Définissez et gérez vos objectifs pour {monthName}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <MonthSelector
                currentMonth={activeMonth}
                onMonthChange={handleMonthChange}
                disabled={isMonthClosed}
              />

              {!isMonthClosed && (
                <Button
                  onClick={() => {
                    setShowForm(true);
                    setEditingId(null);
                    setFormData({ name: '', text: '', type: '', status: 'pending', date: '', targetValue: '' });
                  }}
                  variant="primary"
                  icon={Plus}
                >
                  Ajouter un objectif
                </Button>
              )}
            </div>
          </div>

          {/* Statistiques avec dégradés */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-blue-500">
              <CardContent className="p-5 bg-gradient-to-br from-blue-50/50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">{stats.total}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-orange-500">
              <CardContent className="p-5 bg-gradient-to-br from-orange-50/50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">En attente</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">{stats.pending}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50">
                    <TrendingUp className="h-8 w-8 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-green-500">
              <CardContent className="p-5 bg-gradient-to-br from-green-50/50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Validés</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">{stats.validated}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-100 to-green-50">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres */}
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-sm font-medium text-gray-700">Filtrer par type :</span>
            <div className="flex space-x-2">
              <Button
                variant={filterType === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                Tous
              </Button>
              {userTypes.map(type => (
                <Button
                  key={type.value}
                  variant={filterType === type.value ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(type.value)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Bannière mois clôturé */}
        {isMonthClosed && (
          <Card className="mb-6 border-l-4 border-blue-600">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-900">
                    Ce mois est clôturé. Vous ne pouvez plus modifier les objectifs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulaire d'ajout/édition */}
        {showForm && (
          <Card className="mb-6 animate-fadeIn">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle level={3}>
                  {editingId ? 'Modifier l\'objectif' : 'Nouvel objectif'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={X}
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: '', text: '', type: '', status: 'pending', date: '', targetValue: '' });
                  }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Nom de la personne"
                    value={formData.name}
                    onChange={(value) => setFormData({ ...formData, name: value })}
                    placeholder="Ex: Jean Dupont"
                    required
                  />
                  <Select
                    label="Type"
                    value={formData.type}
                    onChange={(value) => setFormData({ ...formData, type: value })}
                    options={userTypes}
                    required
                  />
                  <Input
                    label="Description de l'objectif"
                    value={formData.text}
                    onChange={(value) => setFormData({ ...formData, text: value })}
                    placeholder="Décrivez l'objectif à atteindre"
                    required
                  />
                  <Input
                    label="Valeur cible"
                    type="number"
                    value={formData.targetValue}
                    onChange={(value) => setFormData({ ...formData, targetValue: value })}
                    placeholder="Ex: 100"
                    required
                  />
                  <Input
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={(value) => setFormData({ ...formData, date: value })}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({ name: '', text: '', type: '', status: 'pending', date: '', targetValue: '' });
                    }}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" variant="primary">
                    {editingId ? 'Enregistrer les modifications' : 'Créer l\'objectif'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Liste des objectifs */}
        {filteredObjectives.length > 0 ? (
          <div className="space-y-4">
            {filteredObjectives.map((objective) => (
              <Card key={objective.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <StatusBadge status={objective.status} />
                        <Badge variant="primary">{objective.type === 'studio' ? 'Studio' : objective.type === 'developer' ? 'Développeur' : 'Chef'}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">{objective.text}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {objective.name}
                        </div>
                        {objective.date && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(objective.date).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                        {objective.targetValue && (
                          <div className="flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            Cible: {objective.targetValue}
                          </div>
                        )}
                        {objective.evaluatedValue !== null && (
                          <div className="flex items-center">
                            <span className="font-semibold text-orange-600">
                              Atteint: {objective.evaluatedValue} ({objective.percentage}%)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {!isMonthClosed && objective.status === 'pending' && (
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit}
                          onClick={() => handleEdit(objective)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDelete(objective.id)}
                        />
                        <Button
                          variant="accent"
                          size="sm"
                          onClick={() => handleEvaluate(objective)}
                        >
                          Évaluer
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Formulaire d'évaluation inline */}
                  {evaluatingId === objective.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-end space-x-3">
                        <div className="flex-1">
                          <Input
                            label="Valeur évaluée"
                            type="number"
                            value={evaluationData.evaluatedValue}
                            onChange={(value) => setEvaluationData({ evaluatedValue: value })}
                            placeholder="Entrez la valeur atteinte"
                          />
                          {getEvaluationPercentage(objective.id) !== null && (
                            <p className="text-sm mt-2">
                              <span className="font-semibold text-orange-600">
                                {getEvaluationPercentage(objective.id)}% 
                              </span>
                              {' '}
                              {getEvaluationPercentage(objective.id) >= 60 ? (
                                <span className="text-green-600">✓ Atteint</span>
                              ) : (
                                <span className="text-red-600">✗ Non atteint</span>
                              )}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            onClick={handleCancelEvaluation}
                          >
                            Annuler
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => handleSaveEvaluation(objective.id)}
                          >
                            Enregistrer
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun objectif</h3>
              <p className="text-sm text-gray-500 mb-6">
                {filterType !== 'all' 
                  ? `Aucun objectif de type "${userTypes.find(t => t.value === filterType)?.label}" pour ce mois.`
                  : 'Commencez par créer votre premier objectif pour ce mois.'}
              </p>
              {!isMonthClosed && (
                <Button
                  variant="primary"
                  icon={Plus}
                  onClick={() => {
                    setShowForm(true);
                    setEditingId(null);
                  }}
                >
                  Ajouter un objectif
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ObjectifsPage;