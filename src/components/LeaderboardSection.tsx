import React from 'react';
import { Trophy, Clock, Award, Mountain } from 'lucide-react';
import type { Database } from '../types/supabase';
import { millisecondsToTime } from '../utils/timeUtils';
import { getLeaders } from '../utils/leaderboardUtils';

type RacerStanding = Database['public']['Views']['racer_standings']['Row'];

interface LeaderboardSectionProps {
  racers: RacerStanding[];
}

interface LeaderProps {
  position: number;
  name: string | undefined;
  value: string | number | undefined;
}

function Leader({ position, name, value }: LeaderProps) {
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

function CategoryLeaders({ 
  title, 
  icon: Icon,
  racers,
  getValue,
  formatValue = (v: any) => v?.toString() ?? '',
  sortDirection = 'asc'
}: {
  title: string;
  icon: React.ElementType;
  racers: RacerStanding[];
  getValue: (r: RacerStanding) => number;
  formatValue?: (value: any) => string;
  sortDirection?: 'asc' | 'desc';
}) {
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

export function LeaderboardSection({ racers }: LeaderboardSectionProps) {
  const maleRacers = racers.filter(r => r.gender === 'male');
  const femaleRacers = racers.filter(r => r.gender === 'female');

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-2">
          Men's Leaders
        </h3>
        <div className="grid grid-cols-1 gap-8 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <CategoryLeaders
            title="General Classification"
            icon={Clock}
            racers={maleRacers}
            getValue={r => r.total_time}
            formatValue={millisecondsToTime}
            sortDirection="asc"
          />
          <CategoryLeaders
            title="Sprint Competition"
            icon={Award}
            racers={maleRacers}
            getValue={r => r.total_sprint_points}
          />
          <CategoryLeaders
            title="King of the Mountains"
            icon={Mountain}
            racers={maleRacers}
            getValue={r => r.total_kom_points}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-2">
          Women's Leaders
        </h3>
        <div className="grid grid-cols-1 gap-8 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <CategoryLeaders
            title="General Classification"
            icon={Clock}
            racers={femaleRacers}
            getValue={r => r.total_time}
            formatValue={millisecondsToTime}
            sortDirection="asc"
          />
          <CategoryLeaders
            title="Sprint Competition"
            icon={Award}
            racers={femaleRacers}
            getValue={r => r.total_sprint_points}
          />
          <CategoryLeaders
            title="Queen of the Mountains"
            icon={Mountain}
            racers={femaleRacers}
            getValue={r => r.total_kom_points}
          />
        </div>
      </div>
    </div>
  );
}