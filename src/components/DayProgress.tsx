import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface DayProgressProps {
  currentDay: number;
}

export function DayProgress({ currentDay }: DayProgressProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">Progress:</span>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((day) => (
          <div
            key={day}
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              day === currentDay
                ? 'bg-blue-100 text-blue-600'
                : day < currentDay
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {day < currentDay ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}