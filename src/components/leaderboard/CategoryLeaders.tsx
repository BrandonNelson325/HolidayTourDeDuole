import React from 'react';
import { Leader } from './Leader';
import { getLeaders } from '../../utils/leaderboardUtils';
import type { Database } from '../../types/supabase';

type RacerStanding = Database['public']['Views']['racer_standings']['Row'];

interface CategoryLeadersProps {
  title: string;
  icon: React.ElementType;
  racers: RacerStanding[];
  getValue: (r: RacerStanding) => number;
  formatValue?: (value: any) => string;
  sortDirection?: 'asc' | 'desc';
}

export function CategoryLeaders({ 
  title, 
  icon: Icon,
  racers,
  getValue,
  formatValue = (v: any) => v?.toString() ?? '',
  sortDirection = 'desc'
}: CategoryLeadersProps) {
  const sortedRacers = getLeaders(racers, getValue, sortDirection);

  if (sortedRacers.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 border-b-2 border-gray-300 pb-2">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-gray-800" />
        </div>
        <h4 className="font-bold text-gray-900 tracking-wide uppercase text-base">{title}</h4>
      </div>
      <div className="space-y-2">
        {sortedRacers.map((racer, index) => (
          <Leader
            key={racer.id}
            position={index + 1}
            name={racer.name}
            value={formatValue(getValue(racer))}
          />
        ))}
      </div>
    </div>
  );
}