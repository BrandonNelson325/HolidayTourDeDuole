import React from 'react';
import { Clock, Award, Mountain } from 'lucide-react';
import { useRaceStore } from '../stores/useRaceStore';
import { timeToMilliseconds } from '../utils/timeUtils';
import { RacerDayProgress } from './RacerDayProgress';

export function DailyResultsTable() {
  const { racers, addDailyResult, isLoading } = useRaceStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, racerId: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const timeString = formData.get('time') as string;
    
    await addDailyResult(racerId, {
      time: timeToMilliseconds(timeString),
      sprintPoints: parseInt(formData.get('sprintPoints') as string || '0'),
      komPoints: parseInt(formData.get('komPoints') as string || '0'),
    });

    e.currentTarget.reset();
  };

  // Sort racers with times to the top
  const sortedRacers = [...racers].sort((a, b) => {
    if (a.total_time === 0 && b.total_time > 0) return 1;
    if (b.total_time === 0 && a.total_time > 0) return -1;
    return 0;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
              Racer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
              Progress
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Time
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                Sprint
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              <div className="flex items-center">
                <Mountain className="h-4 w-4 mr-1" />
                KOM
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedRacers.map((racer) => (
            <tr key={racer.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {racer.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <RacerDayProgress currentDay={racer.current_day} />
              </td>
              {racer.current_day <= 5 ? (
                <td colSpan={4}>
                  <form 
                    className="flex items-center space-x-4"
                    onSubmit={(e) => handleSubmit(e, racer.id)}
                  >
                    <div className="w-40 px-6">
                      <input
                        type="text"
                        name="time"
                        pattern="^(?:[0-9]{1,2}:)?[0-5]?[0-9]:[0-5][0-9](?:\.[0-9]{1,3})?$"
                        placeholder="HH:MM:SS.mmm"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="w-32 px-6">
                      <input
                        type="number"
                        name="sprintPoints"
                        placeholder="0"
                        defaultValue="0"
                        min="0"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="w-32 px-6">
                      <input
                        type="number"
                        name="komPoints"
                        placeholder="0"
                        defaultValue="0"
                        min="0"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="px-6">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save Day {racer.current_day}
                      </button>
                    </div>
                  </form>
                </td>
              ) : (
                <td colSpan={4} className="px-6 py-4 text-sm text-gray-500">
                  All days completed
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}