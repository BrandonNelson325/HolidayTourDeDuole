import React from 'react';
import { Clock, Award, Mountain } from 'lucide-react';
import { useRaceStore } from '../stores/useRaceStore';
import { millisecondsToTime } from '../utils/timeUtils';
import { SortControls } from './SortControls';
import { sortRacers, type SortField } from '../utils/sortUtils';

export function RacerList() {
  const { racers } = useRaceStore();
  const [sortField, setSortField] = React.useState<SortField>('time');
  const sortedRacers = sortRacers(racers, sortField);

  return (
    <div className="space-y-4">
      <SortControls currentSort={sortField} onSortChange={setSortField} />
      
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