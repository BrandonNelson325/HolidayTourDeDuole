import React from 'react';
import { Clock, Award, Mountain } from 'lucide-react';
import { millisecondsToTime } from '../../utils/timeUtils';
import type { Database } from '../../types/supabase';

type DailyResult = Database['public']['Tables']['daily_results']['Row'];

interface DailyResultsTableProps {
  dailyResults: DailyResult[];
}

export function DailyResultsTable({ dailyResults }: DailyResultsTableProps) {
  const sortedResults = [...dailyResults].sort((a, b) => a.day - b.day);

  return (
    <div className="w-full">
      <table className="min-w-full">
        <tbody className="divide-y divide-gray-200">
          {sortedResults.map((result) => (
            <tr key={result.id} className="bg-gray-50/50">
              <td className="px-6 py-2 w-[88px] text-sm text-gray-900">
                Day {result.day}
              </td>
              <td className="px-6 py-2 w-48"></td>
              <td className="px-6 py-2 w-24"></td>
              <td className="px-6 py-2 w-40 text-sm text-gray-900">
                {millisecondsToTime(result.time)}
              </td>
              <td className="px-6 py-2 w-32 text-sm text-gray-900">
                {result.sprint_points}
              </td>
              <td className="px-6 py-2 w-32 text-sm text-gray-900">
                {result.kom_points}
              </td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}