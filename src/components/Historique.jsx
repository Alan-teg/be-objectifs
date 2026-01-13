import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, History, FileText, TrendingUp } from 'lucide-react';
import MonthManager from '../utils/MonthManager';
import StorageManager from './StorageManage';
import Card, { CardContent, Badge } from './ui/Card';

// Composant Badge pour afficher le statut de performance
const PerformanceBadge = ({ rate }) => {
  if (rate >= 80) {
    return <Badge variant="success">Excellent</Badge>;
  } else if (rate >= 60) {
    return <Badge variant="primary">Bon</Badge>;
  } else if (rate > 0) {
    return <Badge variant="warning">À améliorer</Badge>;
  }
  return <Badge variant="default">Non évalué</Badge>;
};

// Page Historique
const HistoriquePage = () => {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const allMonths = StorageManager.getAllMonths();
      setMonths(allMonths);
      
      if (allMonths.length > 0) {
        const lastMonth = allMonths[allMonths.length - 1];
        setSelectedMonth(lastMonth);
        setObjectives(StorageManager.getObjectives(lastMonth));
      }
      
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleMonthSelect = (month) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedMonth(month);
      setObjectives(StorageManager.getObjectives(month));
      MonthManager.setActiveMonth(month);
      setIsLoading(false);
    }, 300);
  };
  
  const getStats = (objs) => {
    const validated = objs.filter(o => o.status === 'validated').length;
    const achieved = objs.filter(o => o.status === 'validated' && o.validationType === 'success').length;
    const total = objs.length;
    
    return { 
      achieved, 
      total, 
      validated,
      rate: validated > 0 ? Math.round((achieved / validated) * 100) : 0,
      hasData: objs.length > 0
    };
  };
  
  const stats = selectedMonth ? getStats(objectives) : null;
  
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Historique des Performances
              </h1>
              <p className="text-gray-600">
                Consultez et analysez vos performances passées
              </p>
            </div>
            {selectedMonth && stats && stats.hasData && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-gray-600 mb-1">Taux de réussite</div>
                  <div className="text-3xl font-bold text-orange-600">{stats.rate}%</div>
                </div>
                <PerformanceBadge rate={stats.rate} />
              </div>
            )}
          </div>
          
          {/* Bannière d'information */}
          <Card className="border-l-4 border-blue-600">
            <CardContent className="p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <History className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-semibold text-blue-900">Espace d'analyse rétrospective</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>
                      Cette section vous permet d'analyser vos performances passées. 
                      Sélectionnez un mois pour afficher le détail des objectifs et des résultats.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des mois */}
          <div>
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-blue-900">Mois archivés</h2>
                  <Badge variant="primary">{months.length} {months.length > 1 ? 'mois' : 'mois'}</Badge>
                </div>
                
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-20"></div>
                    ))}
                  </div>
                ) : months.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Aucun historique disponible</h3>
                    <p className="text-xs text-gray-400">Les mois clôturés apparaîtront ici</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {months.map(month => {
                      const objs = StorageManager.getObjectives(month);
                      const monthStats = getStats(objs);
                      const monthName = MonthManager.getMonthName(month);
                      const isSelected = selectedMonth === month;
                      const isCurrentMonth = MonthManager.isCurrentMonth(month);
                      
                      return (
                        <div
                          key={month}
                          onClick={() => handleMonthSelect(month)}
                          className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md'
                          }`}
                        >
                          {/* Indicateur de sélection */}
                          {isSelected && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-xl"></div>
                          )}
                          
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className={`font-semibold text-base capitalize ${
                                isSelected ? 'text-white' : 'text-blue-900'
                              }`}>
                                {monthName} {month.split('-')[0]}
                              </div>
                              {isCurrentMonth && (
                                <Badge variant="primary" className="mt-1">
                                  En cours
                                </Badge>
                              )}
                            </div>
                            
                            <PerformanceBadge rate={monthStats.rate} />
                          </div>
                          
                          {/* Barre de progression */}
                          <div className="mt-4">
                            <div className="flex justify-between text-xs mb-2">
                              <span className={isSelected ? 'text-blue-100' : 'text-gray-600'}>
                                {monthStats.validated} objectif{monthStats.validated > 1 ? 's' : ''}
                              </span>
                              <span className={isSelected ? 'text-white font-semibold' : 'text-blue-900 font-semibold'}>
                                {monthStats.rate}% de réussite
                              </span>
                            </div>
                            <div className={`w-full rounded-full h-2 ${
                              isSelected ? 'bg-blue-500/30' : 'bg-gray-200'
                            }`}>
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  monthStats.rate >= 80 ? 'bg-green-500' : 
                                  monthStats.rate >= 60 ? 'bg-blue-500' : 'bg-orange-500'
                                }`}
                                style={{ width: `${monthStats.rate}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Détails du mois sélectionné */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </Card>
              </div>
            ) : selectedMonth ? (
              <div className="space-y-6">
                {/* En-tête du mois */}
                <Card className="overflow-hidden">
                  <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">
                          {MonthManager.getMonthName(selectedMonth)} {selectedMonth.split('-')[0]}
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">
                          {objectives.length} objectif{objectives.length !== 1 ? 's' : ''} • 
                          {getStats(objectives).validated} validé{getStats(objectives).validated !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="mt-3 sm:mt-0">
                        <PerformanceBadge rate={getStats(objectives).rate} />
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    {objectives.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-base font-medium text-gray-500 mb-2">Aucun objectif pour ce mois</h3>
                        <p className="text-sm text-gray-400">Créez des objectifs dans l'onglet "Objectifs"</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {objectives.map((obj) => {
                          const isSuccess = obj.status === 'validated' && obj.validationType === 'success';
                          const isFailure = obj.status === 'validated' && obj.validationType === 'failure';
                          const percentage = obj.percentage || (obj.evaluatedValue && obj.targetValue 
                            ? Math.round((obj.evaluatedValue / obj.targetValue) * 100) 
                            : 0);
                          
                          return (
                            <Card
                              key={obj.id}
                              className={`${
                                isSuccess 
                                  ? 'border-l-4 border-green-500 bg-green-50/50' 
                                  : isFailure 
                                    ? 'border-l-4 border-red-500 bg-red-50/50' 
                                    : 'border-l-4 border-gray-300'
                              } hover:shadow-md transition-all duration-300`}
                            >
                              <CardContent className="p-5">
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 pt-1">
                                    {isSuccess ? (
                                      <CheckCircle className="h-6 w-6 text-green-600" />
                                    ) : isFailure ? (
                                      <XCircle className="h-6 w-6 text-red-600" />
                                    ) : (
                                      <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>
                                    )}
                                  </div>
                                  <div className="ml-4 flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                      <h3 className={`text-base font-semibold ${
                                        isSuccess ? 'text-green-900' : 
                                        isFailure ? 'text-red-900' : 'text-blue-900'
                                      }`}>
                                        {obj.text || obj.title}
                                      </h3>
                                      <div className="ml-4 flex-shrink-0">
                                        {obj.status === 'validated' ? (
                                          <Badge variant={isSuccess ? 'success' : 'danger'}>
                                            {isSuccess ? 'Atteint' : 'Non atteint'}
                                          </Badge>
                                        ) : (
                                          <Badge variant="warning">En attente</Badge>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                                      {obj.name && (
                                        <span className="font-medium text-blue-900">{obj.name}</span>
                                      )}
                                      {obj.type && (
                                        <>
                                          <span>•</span>
                                          <Badge variant="primary">
                                            {obj.type === 'developer' ? 'Développeur' : 
                                             obj.type === 'studio' ? 'Studio' : 'Chef'}
                                          </Badge>
                                        </>
                                      )}
                                      {obj.targetValue && (
                                        <>
                                          <span>•</span>
                                          <span>Objectif: <strong className="text-orange-600">{obj.targetValue}</strong></span>
                                        </>
                                      )}
                                      {obj.evaluatedValue !== null && (
                                        <>
                                          <span>•</span>
                                          <span>Atteint: <strong className="text-orange-600">{obj.evaluatedValue}</strong></span>
                                        </>
                                      )}
                                    </div>

                                    {/* Barre de progression */}
                                    {obj.evaluatedValue !== null && obj.targetValue && (
                                      <div className="mt-3">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-xs text-gray-600">Progression</span>
                                          <span className={`text-sm font-bold ${
                                            percentage >= 60 ? 'text-green-600' : 'text-orange-600'
                                          }`}>
                                            {percentage}%
                                          </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                          <div 
                                            className={`h-2 rounded-full transition-all duration-500 ${
                                              percentage >= 60 ? 'bg-green-500' : 'bg-orange-500'
                                            }`}
                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                    
                                    {obj.comments && (
                                      <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="text-xs font-medium text-gray-700 mb-1">Commentaire :</p>
                                        <p className="text-sm text-gray-600">{obj.comments}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Résumé statistique */}
                {stats && stats.hasData && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-blue-900 mb-6">Résumé du mois</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600 mb-1">{stats.total}</div>
                          <div className="text-xs text-gray-600">Total</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-1">{stats.achieved}</div>
                          <div className="text-xs text-gray-600">Réussis</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600 mb-1">{stats.validated - stats.achieved}</div>
                          <div className="text-xs text-gray-600">Non réussis</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 mb-1">{stats.rate}%</div>
                          <div className="text-xs text-gray-600">Taux réussite</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="p-8">
                <div className="text-center py-12 text-gray-500">
                  <History className="mx-auto h-16 w-16 mb-4 opacity-50" />
                  <p className="text-base">Sélectionnez un mois pour voir les détails</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoriquePage;