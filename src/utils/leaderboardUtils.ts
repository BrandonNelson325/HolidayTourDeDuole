import type { Database } from '../types/supabase';
import { hasCompletedAllDaysUpTo, getLatestActiveDay } from './sortUtils';

type RacerStanding = Database['public']['Views']['racer_standings']['Row'];

export function getLeaders(
  racers: RacerStanding[],
  getValue: (r: RacerStanding) => number,
  sortDirection: 'asc' | 'desc' = 'desc'
): RacerStanding[] {
  const latestDay = getLatestActiveDay(racers);
  
  return [...racers]
    .filter(r => getValue(r) > 0)
    .sort((a, b) => {
      // First, check if both racers have completed all days up to the latest
      const aComplete = hasCompletedAllDaysUpTo(a, latestDay);
      const bComplete = hasCompletedAllDaysUpTo(b, latestDay);

      // If one has completed all days and the other hasn't, prioritize the complete one
      if (aComplete && !bComplete) return -1;
      if (!aComplete && bComplete) return 1;

      // If both are complete or both incomplete, sort by the value
      const aValue = getValue(a);
      const bValue = getValue(b);
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    })
    .slice(0, 3);
}