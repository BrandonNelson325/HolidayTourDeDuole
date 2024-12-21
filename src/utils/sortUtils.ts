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

export function sortRacers(racers: RacerStanding[], sortField: SortField): RacerStanding[] {
  const latestDay = getLatestActiveDay(racers);
  
  return [...racers].sort((a, b) => {
    // First, check if both racers have completed all days up to the latest
    const aComplete = hasCompletedAllDaysUpTo(a, latestDay);
    const bComplete = hasCompletedAllDaysUpTo(b, latestDay);

    // If one has completed all days and the other hasn't, prioritize the complete one
    if (aComplete && !bComplete) return -1;
    if (!aComplete && bComplete) return 1;

    // If both are complete or both incomplete, sort by the specified field
    switch (sortField) {
      case 'time':
        if (a.total_time === 0 && b.total_time > 0) return 1;
        if (b.total_time === 0 && a.total_time > 0) return -1;
        return a.total_time - b.total_time;
      
      case 'sprint':
        return b.total_sprint_points - a.total_sprint_points;
      
      case 'kom':
        return b.total_kom_points - a.total_kom_points;
      
      default:
        return 0;
    }
  });
}