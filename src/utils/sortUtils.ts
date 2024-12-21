import type { Database } from '../types/supabase';

type RacerStanding = Database['public']['Views']['racer_standings']['Row'];
export type SortField = 'time' | 'sprint' | 'kom';

export function getLatestDayResult(racer: RacerStanding, latestDay: number): number {
  return racer.daily_results?.find(dr => dr.day === latestDay)?.time ?? 0;
}

export function getLatestActiveDay(racers: RacerStanding[]): number {
  return Math.max(...racers.flatMap(r => 
    (r.daily_results ?? [])
      .filter(dr => dr.time > 0)
      .map(dr => dr.day)
  ), 0);
}

export function hasCompletedAllDaysUpTo(racer: RacerStanding, day: number): boolean {
  const completedDays = new Set(racer.daily_results?.filter(dr => dr.time > 0).map(dr => dr.day));
  for (let i = 1; i <= day; i++) {
    if (!completedDays.has(i)) return false;
  }
  return true;
}

function compareByTime(a: RacerStanding, b: RacerStanding, latestDay: number): number {
  const aComplete = hasCompletedAllDaysUpTo(a, latestDay);
  const bComplete = hasCompletedAllDaysUpTo(b, latestDay);

  if (aComplete && !bComplete) return -1;
  if (!aComplete && bComplete) return 1;

  if (a.total_time === 0 && b.total_time > 0) return 1;
  if (b.total_time === 0 && a.total_time > 0) return -1;
  return a.total_time - b.total_time;
}

function compareByPoints(a: RacerStanding, b: RacerStanding, getValue: (r: RacerStanding) => number): number {
  const aValue = getValue(a);
  const bValue = getValue(b);
  return bValue - aValue;
}

export function sortRacers(racers: RacerStanding[], sortField: SortField): RacerStanding[] {
  const latestDay = getLatestActiveDay(racers);
  
  return [...racers].sort((a, b) => {
    switch (sortField) {
      case 'time':
        return compareByTime(a, b, latestDay);
      case 'sprint':
        return compareByPoints(a, b, r => r.total_sprint_points);
      case 'kom':
        return compareByPoints(a, b, r => r.total_kom_points);
      default:
        return 0;
    }
  });
}