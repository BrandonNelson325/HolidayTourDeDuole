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

export function sortRacers(racers: RacerStanding[], sortField: SortField): RacerStanding[] {
  const latestDay = getLatestActiveDay(racers);
  
  return [...racers].sort((a, b) => {
    // Get times for the latest day
    const aLatestTime = getLatestDayResult(a, latestDay);
    const bLatestTime = getLatestDayResult(b, latestDay);

    // If comparing times and we have a latest day with results
    if (sortField === 'time' && latestDay > 0) {
      // If one has a time for latest day and other doesn't, prioritize the one with time
      if (aLatestTime > 0 && bLatestTime === 0) return -1;
      if (aLatestTime === 0 && bLatestTime > 0) return 1;
    }

    // If both have or don't have latest times, sort by the specified field
    switch (sortField) {
      case 'time':
        // Move racers with no total time to the bottom
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