import React, { useState } from 'react';
import { Clock, Award, Mountain, Users } from 'lucide-react';
import { useRaceStore } from '../stores/useRaceStore';
import { millisecondsToTime } from '../utils/timeUtils';
import { SortControls } from './SortControls';
import { sortRacers, type SortField } from '../utils/sortUtils';

type GenderFilter = 'all' | 'male' | 'female';

export function RacerList() {
  const { racers } = useRaceStore();
  const [sortField, setSortField] = useState<SortField>('time');
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');

  const filteredRacers = racers.filter(racer => 
    genderFilter === 'all' || racer.gender === genderFilter
  );
  
  const sortedRacers = sortRacers(filteredRacers, sortField);

  // Find leaders for each category by gender
  const maleTimeLeader = racers
    .filter(r => r.gender === 'male' && r.total_time > 0)
    .reduce((min, r) => (!min || r.total_time < min.total_time ? r : min), null);

  const femaleTimeLeader = racers
    .filter(r => r.gender === 'female' && r.total_time > 0)
    .reduce((min, r) => (!min || r.total_time < min.total_time ? r : min), null);

  const maleSprintLeader = racers
    .filter(r => r.gender === 'male' && r.total_sprint_points > 0)
    .reduce((max, r) => (!max || r.total_sprint_points > max.total_sprint_points ? r : max), null);

  const femaleSprintLeader = racers
    .filter(r => r.gender === 'female' && r.total_sprint_points > 0)
    .reduce((max, r) => (!max || r.total_sprint_points > max.total_sprint_points ? r : max), null);

  const maleKomLeader = racers
    .filter(r => r.gender === 'male' && r.total_kom_points > 0)
    .reduce((max, r) => (!max || r.total_kom_points > max.total_kom_points ? r : max), null);

  const femaleKomLeader = racers
    .filter(r => r.gender === 'female' && r.total_kom_points > 0)
    .reduce((max, r) => (!max || r.total_kom_points > max.total_kom_points ? r : max), null);

  if (racers.length === 0) {
    return null;
  }

  const getRowClassName = (racer: typeof sortedRacers[0]) => {
    const classes = [];

    // Yellow jersey (time leaders)
    if (
      (racer.gender === 'male' && maleTimeLeader?.id === racer.id) ||
      (racer.gender === 'female' && femaleTimeLeader?.id === racer.id)
    ) {
      classes.push('bg-yellow-50');
    }

    // Green jersey (sprint leaders)
    if (
      (racer.gender === 'male' && maleSprintLeader?.id === racer.id) ||
      (racer.gender === 'female' && femaleSprintLeader?.id === racer.id)
    ) {
      classes.push('bg-green-50');
    }

    // Polka dot jersey (KOM leaders)
    if (
      (racer.gender === 'male' && maleKomLeader?.id === racer.id) ||
      (racer.gender === 'female' && femaleKomLeader?.id === racer.id)
    ) {
      classes.push('bg-red-50');
    }

    return classes.join(' ');
  };

  return (
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

      <div className="overflow-x-auto">
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-sm space-y-2">
            <h3 className="font-semibold text-gray-700">Men's Leaders</h3>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-50 rounded"></div>
              <span>GC: {maleTimeLeader?.name || 'None'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-50 rounded"></div>
              <span>Sprint: {maleSprintLeader?.name || 'None'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-50 rounded"></div>
              <span>KOM: {maleKomLeader?.name || 'None'}</span>
            </div>
          </div>
          
          <div className="text-sm space-y-2">
            <h3 className="font-semibold text-gray-700">Women's Leaders</h3>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-50 rounded"></div>
              <span>GC: {femaleTimeLeader?.name || 'None'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-50 rounded"></div>
              <span>Sprint: {femaleSprintLeader?.name || 'None'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-50 rounded"></div>
              <span>KOM: {femaleKomLeader?.name || 'None'}</span>
            </div>
          </div>
        </div>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Total Time
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  Sprint Points
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Mountain className="h-4 w-4 mr-1" />
                  KOM Points
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRacers.map((racer, index) => (
              <tr key={racer.id} className={getRowClassName(racer)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {racer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {racer.gender}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {millisecondsToTime(racer.total_time)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {racer.total_sprint_points}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {racer.total_kom_points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}