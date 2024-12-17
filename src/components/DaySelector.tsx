import React from 'react';
import { Circle, CheckCircle2 } from 'lucide-react';
import { TOTAL_DAYS } from '../config/constants';

interface DaySelectorProps {
  currentDay: number;
  completedDays: number;
  onDaySelect: (day: number) => void;
  selectedDay: number;
  racerId: string;
  selectedRacerId: string | null;
}

export function DaySelector({ 
  currentDay, 
  completedDays, 
  onDaySelect, 
  selectedDay,
  racerId,
  selectedRacerId
}: DaySelectorProps) {
  return (
    <div className="flex space-x-2">
      {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => {
        const isCompleted = day <= completedDays;
        const isSelected = day === selectedDay && racerId === selectedRacerId;
        const isClickable = day <= currentDay;

        return (
          <button
            key={day}
            onClick={() => isClickable && onDaySelect(day)}
            disabled={!isClickable}
            className={`
              flex items-center justify-center w-8 h-8 rounded-full transition-colors
              ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
              ${isCompleted
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : day === currentDay
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-400'
              }
              ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
            `}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
        );
      })}
    </div>
  );
}