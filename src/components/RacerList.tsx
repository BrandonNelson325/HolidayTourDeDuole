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

  if (racers.length === 0) {
    return null;
  }

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
              <tr key={racer.id} className={index === 0 ? 'bg-yellow-50' : ''}>
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