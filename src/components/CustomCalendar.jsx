
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/Card';

// Composant Calendrier personnalisé
const CustomCalendar = ({ selectedMonth, onMonthChange, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date(selectedMonth + '-01'));
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  
  const prevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
    onMonthChange(newDate.toISOString().slice(0, 7));
  };
  
  const nextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
    onMonthChange(newDate.toISOString().slice(0, 7));
  };
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2 sm:p-4"></div>);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const isObjectiveDay = day === 6; // Jour 6 pour la fixation des objectifs
    const bgColor = isObjectiveDay ? 'bg-orange-100 hover:bg-orange-200' : 'bg-gray-50 hover:bg-gray-100';
    
    days.push(
      <div
        key={day}
        onClick={() => onDateSelect(day)}
        className={`p-2 sm:p-4 rounded-lg cursor-pointer transition-all text-center text-xs sm:text-sm font-semibold ${bgColor}`}
      >
        {day}
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <Button variant="ghost" icon={ChevronLeft} onClick={prevMonth} className="text-xs sm:text-base" />
        <h3 className="text-base sm:text-xl font-bold capitalize">{monthName}</h3>
        <Button variant="ghost" icon={ChevronRight} onClick={nextMonth} className="text-xs sm:text-base" />
      </div>
      
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-2">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
          <div key={day} className="text-center text-xs sm:text-sm font-semibold text-gray-600 p-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days}
      </div>
    </div>
  );
};;
export default CustomCalendar;