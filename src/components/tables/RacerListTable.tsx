import React from 'react';
import { Clock, Award, Mountain, ChevronDown, ChevronRight } from 'lucide-react';
import { millisecondsToTime } from '../../utils/timeUtils';
import type { Database } from '../../types/supabase';

type RacerStanding = Database['public']['Views']['racer_standings']['Row'];

interface RacerListTableProps {
  racers: RacerStanding[];
  expandedRacers: Set<string>;
  onToggleExpand: (racerId: string) => void;
}

function DailyResultsRow({ result }: { result: Database['public']['Tables']['daily_results']['Row'] }) {
  return (
    <tr className="bg-gray-50/50">
      <td className="px-6 py-2 text-sm text-gray-900">Day {result.day}</td>
      <td className="px-6 py-2"></td>
      <td className="px-6 py-2"></td>
      <td className="px-6 py-2 text-sm text-gray-900">{millisecondsToTime(result.time)}</td>
      <td className="px-6 py-2 text-sm text-gray-900">{result.sprint_points}</td>
      <td className="px-6 py-2 text-sm text-gray-900">{result.kom_points}</td>
      <td className="px-6 py-2"></td>
    </tr>
  );
}

export function RacerListTable({ racers, expandedRacers, onToggleExpand }: RacerListTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[88px]">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              Gender
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Total Time
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                Sprint Points
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              <div className="flex items-center">
                <Mountain className="h-4 w-4 mr-1" />
                KOM Points
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {racers.map((racer, index) => (
            <React.Fragment key={racer.id}>
              <tr>
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
                <td className="px-6 py-4 whitespace-nowrap">
                  {racer.completed_stages > 0 && (
                    <button
                      onClick={() => onToggleExpand(racer.id)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-700 focus:outline-none"
                    >
                      {expandedRacers.has(racer.id) ? (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          Hide Daily Results
                        </>
                      ) : (
                        <>
                          <ChevronRight className="h-4 w-4 mr-1" />
                          Show Daily Results
                        </>
                      )}
                    </button>
                  )}
                </td>
              </tr>
              {expandedRacers.has(racer.id) && racer.daily_results?.map((result) => (
                <DailyResultsRow key={result.id} result={result} />
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}