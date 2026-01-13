import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import MonthManager from '../utils/MonthManager';
import { Button } from './ui/Card';

// Sélecteur de mois actif - Design moderne et élégant
const MonthSelector = ({ onMonthChange = null, showLabel = true, currentMonth = null, disabled = false }) => {
  const [activeMonth, setActiveMonth] = useState(currentMonth || MonthManager.getActiveMonth());
  const monthName = MonthManager.getMonthName(activeMonth);

  React.useEffect(() => {
    if (currentMonth) {
      setActiveMonth(currentMonth);
    }
  }, [currentMonth]);

  const handlePreviousMonth = () => {
    if (disabled) return;
    const newMonth = MonthManager.getPreviousMonth(activeMonth);
    setActiveMonth(newMonth);
    MonthManager.setActiveMonth(newMonth);
    if (onMonthChange) onMonthChange(newMonth);
  };

  const handleNextMonth = () => {
    if (disabled) return;
    const newMonth = MonthManager.getNextMonth(activeMonth);
    setActiveMonth(newMonth);
    MonthManager.setActiveMonth(newMonth);
    if (onMonthChange) onMonthChange(newMonth);
  };

  const handleResetToNow = () => {
    if (disabled) return;
    const current = MonthManager.resetToCurrentMonth();
    setActiveMonth(current);
    if (onMonthChange) onMonthChange(current);
  };

  return (
    <div className={`flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-lg ${
      disabled ? 'opacity-60 cursor-not-allowed' : ''
    }`}>
      <Button 
        icon={ChevronLeft}
        variant="outline"
        size="sm"
        onClick={handlePreviousMonth}
        disabled={disabled}
        title="Mois précédent"
      />
      
      <div className="flex items-center gap-2 min-w-[160px] sm:min-w-[200px] justify-center">
        <Calendar className="h-4 w-4 text-blue-600 flex-shrink-0" />
        <div className="text-center">
          {showLabel && (
            <div className="text-xs font-medium text-gray-600">Mois actif</div>
          )}
          <div className="text-sm sm:text-base font-bold text-blue-900 capitalize">
            {monthName}
          </div>
        </div>
      </div>

      <Button 
        icon={ChevronRight}
        variant="outline"
        size="sm"
        onClick={handleNextMonth}
        disabled={disabled}
        title="Mois suivant"
      />

      {!MonthManager.isCurrentMonth(activeMonth) && !disabled && (
        <Button
          onClick={handleResetToNow}
          variant="primary"
          size="sm"
          title="Revenir au mois courant"
        >
          Aujourd'hui
        </Button>
      )}
    </div>
  );
};

export default MonthSelector;