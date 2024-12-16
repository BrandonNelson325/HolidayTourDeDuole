import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { millisecondsToTime } from '../utils/timeUtils';
import type { Database } from '../types/supabase';

type DailyResult = Database['public']['Tables']['daily_results']['Row'];

interface RacerDailyResultsProps {
  dailyResults: DailyResult[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function RacerDailyResults({ dailyResults, isExpanded, onToggle }: RacerDailyResultsProps) {
  const sortedResults = [...dailyResults].sort((a, b) => a.day - b.day);

  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center text-sm text-blue-600 hover:text-blue-700 focus:outline-none"
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 mr-1" />
        ) : (
          <ChevronRight className="h-4 w-4 mr-1" />
        )}
        {isExpanded ? 'Hide' : 'Show'} Daily Results
      </button>

      {isExpanded && dailyResults.length > 0 && (
        <div className="mt-2">
          {sortedResults.map((result) => (
            <div 
              key={result.id} 
              className="grid grid-cols-7 bg-gray-50/50 border-t border-gray-100 text-sm"
              style={{
                gridTemplateColumns: '88px 192px 96px 160px 128px 128px 1fr'
              }}
            >
              <div className="px-6 py-2 text-gray-900">Day {result.day}</div>
              <div className="px-6 py-2"></div>
              <div className="px-6 py-2"></div>
              <div className="px-6 py-2 text-gray-900">{millisecondsToTime(result.time)}</div>
              <div className="px-6 py-2 text-gray-900">{result.sprint_points}</div>
              <div className="px-6 py-2 text-gray-900">{result.kom_points}</div>
              <div className="px-6 py-2"></div>
            </div>
          ))}
        </div>
      )}

      {isExpanded && dailyResults.length === 0 && (
        <div className="mt-2 text-sm text-gray-500">No results yet</div>
      )}
    </div>
  );
}