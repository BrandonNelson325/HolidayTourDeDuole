import type { Database } from '../types/supabase';
import { hasCompletedAllDaysUpTo, getLatestActiveDay } from './sortUtils';

type RacerStanding = Database['public']['Views']['racer_standings']['Row'];

function compareByTime(a: RacerStanding, b: RacerStanding, latestDay: number): number {
  const aComplete = hasCompletedAllDaysUpTo(a, latestDay);
  const bComplete = hasCompletedAllDaysUpTo(b, latestDay);

  if (aComplete && !bComplete) return -1;
  if (!aComplete && bComplete) return 1;

  return a.total_time - b.total_time;
}

function compareByPoints(a: RacerStanding, b: RacerStanding, getValue: (r: RacerStanding) => number): number {
  const aValue = getValue(a);
  const bValue = getValue(b);
  return bValue - aValue;
}

export function getLeaders(
  racers: RacerStanding[],
  getValue: (r: RacerStanding) => number,
  sortDirection: 'asc' | 'desc' = 'desc'
): RacerStanding[] {
  const latestDay = getLatestActiveDay(racers);
  
  return [...racers]
    .filter(r => getValue(r) > 0)
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return compareByTime(a, b, latestDay);
      }
      return compareByPoints(a, b, getValue);
    })
    .slice(0, 3);
}