import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface RacerDayProgressProps {
  currentDay: number;
}

export function RacerDayProgress({ currentDay }: RacerDayProgressProps) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((day) => (
        <div
          key={day}
          className={`flex items-center justify-center w-6 h-6 rounded-full ${
            day === currentDay
              ? 'bg-blue-100 text-blue-600'
              : day < currentDay
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          {day < currentDay ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Circle className="w-4 h-4" />
          )}
        </div>
      ))}
    </div>
  );
}