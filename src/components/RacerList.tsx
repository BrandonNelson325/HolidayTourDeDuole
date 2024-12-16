import React, { useState } from 'react';
import { Clock, Award, Mountain, Users } from 'lucide-react';
import { useRaceStore } from '../stores/useRaceStore';
import { millisecondsToTime } from '../utils/timeUtils';
import { SortControls } from './SortControls';
import { LeaderboardSection } from './LeaderboardSection';
import { RacerDailyResults } from './RacerDailyResults';
import { sortRacers, type SortField } from '../utils/sortUtils';
import { RacerListTable } from './tables/RacerListTable';

type GenderFilter = 'all' | 'male' | 'female';

export function RacerList() {
  const { racers } = useRaceStore();
  const [sortField, setSortField] = useState<SortField>('time');
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [expandedRacers, setExpandedRacers] = useState<Set<string>>(new Set());

  const filteredRacers = racers.filter(racer => 
    genderFilter === 'all' || racer.gender === genderFilter
  );
  
  const sortedRacers = sortRacers(filteredRacers, sortField);

  const toggleRacerExpanded = (racerId: string) => {
    const newExpanded = new Set(expandedRacers);
    if (newExpanded.has(racerId)) {
      newExpanded.delete(racerId);
    } else {
      newExpanded.add(racerId);
    }
    setExpandedRacers(newExpanded);
  };

  if (racers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <LeaderboardSection racers={racers} />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <SortControls currentSort={sortField} onSortChange={setSortField} />
          
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-500" />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as GenderFilter)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Racers</option>
              <option value="male">Men Only</option>
              <option value="female">Women Only</option>
            </select>
          </div>
        </div>

        <RacerListTable 
          racers={sortedRacers}
          expandedRacers={expandedRacers}
          onToggleExpand={toggleRacerExpanded}
        />
      </div>
    </div>
  );
}