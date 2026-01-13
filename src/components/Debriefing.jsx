import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, BarChart3, Download, FileText, TrendingUp, Target } from 'lucide-react';
import MonthManager from '../utils/MonthManager';
import StorageManager from './StorageManage.jsx';
import MonthSelector from './MonthSelector';
import Card, { CardHeader, CardTitle, CardContent, Button, Badge } from './ui/Card';

// Page Debriefing - Affichage des résultats validés (lecture seule)
const DebriefingPage = () => {
  const [objectives, setObjectives] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(MonthManager.getActiveMonth());
  const [copied, setCopied] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const monthName = MonthManager.getMonthName(currentMonth);
  const navigate = useNavigate();

  useEffect(() => {
    loadValidatedObjectives();
  }, [currentMonth]);

  const handleMonthChange = (newMonth) => {
    setCurrentMonth(newMonth);
  };

  const loadValidatedObjectives = () => {
    const allObjectives = StorageManager.getObjectives(currentMonth);
    const validatedObjectives = allObjectives.filter(obj => 
      obj.status === 'validated' && 
      obj.month === currentMonth
    );
    setObjectives(validatedObjectives);
  };
  
  const total = objectives.length;
  const success = objectives.filter(o => o.validationType === 'success').length;
  const failure = objectives.filter(o => o.validationType === 'failure').length;
  
  // Calcul du pourcentage global basé sur la MOYENNE des pourcentages validés du mois
  const globalPercentage = total > 0 ? Math.round(
    objectives.reduce((sum, obj) => sum + (obj.percentage || 0), 0) / total
  ) : 0;

  // Générer le résumé texte simple basé sur les résultats validés du mois
  const generateSummary = () => {
    const performanceEmoji = globalPercentage >= 60 ? '✅' : '⚠️';
    
    let summary = `${'═'.repeat(60)}\n`;
    summary += `📊 DÉBRIEFING MENSUEL - ${monthName.toUpperCase()}\n`;
    summary += `${'═'.repeat(60)}\n\n`;
    
    summary += `${performanceEmoji} PERFORMANCE DU MOIS\n`;
    summary += `${'─'.repeat(60)}\n`;
    summary += `Mois: ${monthName}\n`;
    summary += `Pourcentage moyen: ${globalPercentage}%\n`;
    summary += `Statut: ${globalPercentage >= 60 ? 'BON MOIS ✅' : 'MAUVAIS MOIS ⚠️'}\n\n`;
    
    summary += `📋 RÉCAPITULATIF DES OBJECTIFS\n`;
    summary += `${'─'.repeat(60)}\n`;
    summary += `Total des objectifs validés: ${total}\n`;
    summary += `• Objectifs réussis (≥60%): ${success} (${total > 0 ? Math.round((success / total) * 100) : 0}%)\n`;
    summary += `• Objectifs échoués (<60%): ${failure} (${total > 0 ? Math.round((failure / total) * 100) : 0}%)\n\n`;
    
    if (success > 0) {
      summary += `✅ OBJECTIFS RÉUSSIS (≥60%)\n`;
      summary += `${'─'.repeat(60)}\n`;
      objectives
        .filter(o => o.validationType === 'success' && o.month === currentMonth)
        .forEach((obj, index) => {
          const percentage = obj.percentage || Math.round((obj.evaluatedValue / obj.targetValue) * 100);
          summary += `${index + 1}. ${obj.text}\n`;
          summary += `   👤 ${obj.name} | ${obj.evaluatedValue}/${obj.targetValue} | ${percentage}%\n`;
          if (obj.comments) {
            summary += `   💬 ${obj.comments}\n`;
          }
          summary += '\n';
        });
    }
    
    if (failure > 0) {
      summary += `❌ OBJECTIFS NON RÉUSSIS (<60%)\n`;
      summary += `${'─'.repeat(60)}\n`;
      objectives
        .filter(o => o.validationType === 'failure' && o.month === currentMonth)
        .forEach((obj, index) => {
          const percentage = obj.percentage || Math.round((obj.evaluatedValue / obj.targetValue) * 100);
          summary += `${index + 1}. ${obj.text}\n`;
          summary += `   👤 ${obj.name} | ${obj.evaluatedValue}/${obj.targetValue} | ${percentage}%\n`;
          if (obj.comments) {
            summary += `   💬 ${obj.comments}\n`;
          }
          summary += '\n';
        });
    }
    
    summary += `${'═'.repeat(60)}\n`;
    if (globalPercentage >= 60) {
      summary += `✨ BILAN DU MOIS: Excellent travail! La moyenne des objectifs a atteint ${globalPercentage}% ce mois-ci.\n`;
    } else {
      summary += `💪 BILAN DU MOIS: Avec une moyenne de ${globalPercentage}%, des efforts restent à fournir.\n`;
    }
    summary += `${'═'.repeat(60)}\n`;
    
    return summary;
  };
  
  const handleCopySummary = async () => {
    const summary = generateSummary();
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const isMonthClosed = () => {
    const closedMonths = StorageManager.getClosedMonths();
    return closedMonths.includes(currentMonth);
  };

  const generateHandwrittenReport = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    let report = `Rapport Mensuel - ${monthName}\n`;
    report += `Généré le: ${formattedDate}\n\n`;
    report += `📊 Synthèse du Mois\n`;
    report += `• Objectifs: ${objectives.length}\n`;
    report += `• Objectifs atteints: ${objectives.filter(o => o.validationType === 'success').length}\n`;
    report += `• Objectifs non atteints: ${objectives.filter(o => o.validationType === 'failure').length}\n\n`;
    
    report += `📋 Détail des Objectifs\n`;
    objectives.forEach((obj, index) => {
      const status = obj.validationType === 'success' ? '✅' : '❌';
      report += `${index + 1}. ${status} ${obj.text}\n`;
      report += `   - Type: ${obj.type === 'developer' ? 'Développeur' : obj.type === 'studio' ? 'Studio' : 'Chef'}\n`;
      report += `   - Objectif: ${obj.targetValue} ${obj.unit || ''}\n`;
      report += `   - Atteint: ${obj.evaluatedValue} (${Math.round((obj.evaluatedValue / obj.targetValue) * 100)}%)\n\n`;
    });

    const element = document.createElement('a');
    const file = new Blob([report], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = `rapport-${currentMonth}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCloseMonth = async () => {
    if (isMonthClosed()) {
      alert('Ce mois est déjà clôturé.');
      return;
    }

    if (!window.confirm(`Êtes-vous sûr de vouloir clôturer le mois de ${monthName} ? Cette action est irréversible.`)) {
      return;
    }

    setIsClosing(true);

    try {
      const allObjectives = StorageManager.getObjectives(currentMonth);
      const updatedObjectives = allObjectives.map(obj => ({
        ...obj,
        status: 'validated',
        validatedAt: new Date().toISOString()
      }));
      
      StorageManager.saveObjectives(updatedObjectives, currentMonth);
      
      const closedMonths = new Set(StorageManager.getClosedMonths());
      closedMonths.add(currentMonth);
      localStorage.setItem('closedMonths', JSON.stringify(Array.from(closedMonths)));
      
      loadValidatedObjectives();
      
      alert(`Le mois de ${monthName} a été clôturé avec succès.`);
    } catch (error) {
      console.error('Erreur lors de la clôture du mois:', error);
      alert('Une erreur est survenue lors de la clôture du mois.');
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Debriefing Mensuel</h1>
              <p className="text-gray-600">
                Consultez les résultats et analyses de vos objectifs pour {monthName}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <MonthSelector 
                currentMonth={currentMonth}
                onMonthChange={handleMonthChange}
                showLabel={false}
              />
              
              {isMonthClosed() && (
                <Button 
                  onClick={generateHandwrittenReport}
                  variant="outline"
                  size="sm"
                  icon={Download}
                >
                  Télécharger
                </Button>
              )}
              
              {!isMonthClosed() && (
                <Button 
                  onClick={handleCloseMonth}
                  variant="accent"
                  size="sm"
                  disabled={isClosing}
                >
                  {isClosing ? 'Clôture...' : 'Clôturer le mois'}
                </Button>
              )}
            </div>
          </div>

          {/* Carte de synthèse globale avec dégradé */}
          <Card className="mb-6 border-l-4 border-blue-600 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-orange-500/10 rounded-full blur-3xl -z-0"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                    Synthèse du mois de {monthName}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Performance globale basée sur la moyenne des objectifs validés
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                  <div className="bg-gradient-to-br from-blue-50 to-orange-50/50 p-4 rounded-xl text-center border border-blue-200/50 hover:shadow-md transition-all duration-300 hover:scale-105">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mb-1">
                      {globalPercentage}%
                    </div>
                    <div className="text-xs text-blue-600 font-medium">Performance</div>
                  </div>
                  
                  <div className="bg-white border-2 border-blue-200 p-4 rounded-xl text-center hover:border-blue-400 hover:shadow-md transition-all duration-300 hover:scale-105">
                    <div className="text-2xl font-bold text-blue-900 mb-1">
                      {total}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">Total</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-4 rounded-xl text-center border border-green-200/50 hover:shadow-md transition-all duration-300 hover:scale-105">
                    <div className="text-2xl font-bold text-green-700 mb-1">
                      {success}
                    </div>
                    <div className="text-xs text-green-600 font-medium">Réussis</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-50 to-orange-50/50 p-4 rounded-xl text-center border border-red-200/50 hover:shadow-md transition-all duration-300 hover:scale-105">
                    <div className="text-2xl font-bold text-red-700 mb-1">
                      {failure}
                    </div>
                    <div className="text-xs text-red-600 font-medium">Échoués</div>
                  </div>
                </div>
              </div>

              {/* Indicateur de performance globale avec dégradé */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Performance globale</span>
                  <span className={`text-lg font-bold ${
                    globalPercentage >= 60 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {globalPercentage >= 60 ? '✓ Bon mois' : '⚠ À améliorer'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-3 rounded-full transition-all duration-700 ${
                      globalPercentage >= 60 
                        ? 'bg-gradient-to-r from-green-500 to-green-400' 
                        : 'bg-gradient-to-r from-orange-500 to-orange-400'
                    }`}
                    style={{ width: `${Math.min(globalPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Liste des objectifs réussis */}
        {success > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-blue-900 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                Objectifs Réussis ({success})
              </h2>
            </div>
            <div className="space-y-4">
              {objectives.filter(o => o.validationType === 'success').map(obj => {
                const percentage = obj.percentage || Math.round((obj.evaluatedValue / obj.targetValue) * 100);
                return (
                  <Card key={obj.id} className="border-l-4 border-green-500 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge variant="success">Atteint</Badge>
                            <Badge variant="primary">
                              {obj.type === 'developer' ? 'Développeur' : obj.type === 'studio' ? 'Studio' : 'Chef'}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-blue-900 mb-2">{obj.text}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                            <span><strong>{obj.name}</strong></span>
                            <span>•</span>
                            <span>Objectif: {obj.targetValue}</span>
                            <span>•</span>
                            <span>Atteint: {obj.evaluatedValue}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-600">Progression</span>
                                <span className="text-lg font-bold text-green-600">{percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full bg-green-500 transition-all duration-500"
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Liste des objectifs échoués */}
        {failure > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-blue-900 flex items-center">
                <XCircle className="h-6 w-6 text-red-600 mr-2" />
                Objectifs Non Réussis ({failure})
              </h2>
            </div>
            <div className="space-y-4">
              {objectives.filter(o => o.validationType === 'failure').map(obj => {
                const percentage = obj.percentage || Math.round((obj.evaluatedValue / obj.targetValue) * 100);
                return (
                  <Card key={obj.id} className="border-l-4 border-red-500 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge variant="danger">Non atteint</Badge>
                            <Badge variant="primary">
                              {obj.type === 'developer' ? 'Développeur' : obj.type === 'studio' ? 'Studio' : 'Chef'}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-blue-900 mb-2">{obj.text}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                            <span><strong>{obj.name}</strong></span>
                            <span>•</span>
                            <span>Objectif: {obj.targetValue}</span>
                            <span>•</span>
                            <span>Atteint: {obj.evaluatedValue}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-600">Progression</span>
                                <span className="text-lg font-bold text-orange-600">{percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full bg-orange-500 transition-all duration-500"
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <XCircle className="h-8 w-8 text-red-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Message si aucun objectif */}
        {objectives.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun objectif validé</h3>
              <p className="text-sm text-gray-500 mb-6">
                Aucun objectif n'a été validé pour ce mois. Évaluez vos objectifs dans l'onglet "Objectifs".
              </p>
              <Button
                onClick={() => navigate('/objectifs')}
                variant="primary"
                icon={Target}
              >
                Aller aux objectifs
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {objectives.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleCopySummary}
              variant="outline"
              icon={Download}
            >
              {copied ? 'Copié !' : 'Copier le résumé'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebriefingPage;