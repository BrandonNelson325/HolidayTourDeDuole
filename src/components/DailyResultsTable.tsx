import React, { useEffect } from 'react';
import { Clock, Award, Mountain } from 'lucide-react';
import { useRaceStore } from '../stores/useRaceStore';
import { timeToMilliseconds, millisecondsToTime } from '../utils/timeUtils';
import { DaySelector } from './DaySelector';
import { TimeInput } from './TimeInput';

export function DailyResultsTable() {
  const { 
    dailyRacers,
    fetchDailyRacers,
    addDailyResult, 
    selectDay,
    selectedDay,
    selectedRacerId,
    currentDailyResult,
    isLoading 
  } = useRaceStore();

  useEffect(() => {
    fetchDailyRacers();
  }, [fetchDailyRacers]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, racerId: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const timeString = formData.get('time') as string;
    
    await addDailyResult(racerId, {
      time: timeToMilliseconds(timeString),
      sprintPoints: parseInt(formData.get('sprintPoints') as string || '0'),
      komPoints: parseInt(formData.get('komPoints') as string || '0'),
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
              Name
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
          {dailyRacers.map((racer) => {
            const isEditing = selectedDay !== null && currentDailyResult?.racer_id === racer.id;
            const completedStages = racer.daily_results?.length ?? 0;
            
            return (
              <tr key={racer.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {racer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <DaySelector
                    currentDay={racer.current_day}
                    completedDays={completedStages}
                    selectedDay={selectedDay ?? racer.current_day}
                    onDaySelect={(day) => selectDay(racer.id, day)}
                    racerId={racer.id}
                    selectedRacerId={selectedRacerId}
                  />
                </td>
                {racer.current_day <= 5 ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TimeInput
                        name="time"
                        form={`result-form-${racer.id}`}
                        value={isEditing && currentDailyResult?.time ? millisecondsToTime(currentDailyResult.time) : '00:00:00.000'}
                        onChange={() => {}} // Form will handle the final value
                        disabled={isLoading}
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        name="sprintPoints"
                        form={`result-form-${racer.id}`}
                        placeholder="0"
                        defaultValue={isEditing ? currentDailyResult?.sprint_points ?? 0 : 0}
                        key={`${racer.id}-${selectedDay}-sprint`}
                        min="0"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        disabled={isLoading}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        name="komPoints"
                        form={`result-form-${racer.id}`}
                        placeholder="0"
                        defaultValue={isEditing ? currentDailyResult?.kom_points ?? 0 : 0}
                        key={`${racer.id}-${selectedDay}-kom`}
                        min="0"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        disabled={isLoading}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <form
                        id={`result-form-${racer.id}`}
                        onSubmit={(e) => handleSubmit(e, racer.id)}
                        className="flex items-center space-x-4"
                      >
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save Day {selectedDay ?? racer.current_day}
                        </button>
                      </form>
                    </td>
                  </>
                ) : (
                  <td colSpan={4} className="px-6 py-4 text-sm text-gray-500">
                    All days completed
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}