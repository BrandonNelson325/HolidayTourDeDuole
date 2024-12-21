import React from 'react';
import { Trophy } from 'lucide-react';

interface LeaderProps {
  position: number;
  name: string | undefined;
  value: string | number | undefined;
}

export function Leader({ position, name, value }: LeaderProps) {
  if (!name) return null;
  
  return (
    <div className="flex items-center gap-2 pl-8 sm:pl-10">
      <div className="flex-shrink-0 w-5">
        <Trophy className={`h-5 w-5 ${
          position === 1 ? 'text-yellow-500' :
          position === 2 ? 'text-gray-400' :
          'text-amber-600'
        }`} />
      </div>
      <span className="font-medium min-w-0 truncate">{name}</span>
      <span className="text-gray-500 flex-shrink-0">({value})</span>
    </div>
  );
}