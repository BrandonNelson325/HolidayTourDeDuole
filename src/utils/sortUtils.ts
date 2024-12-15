import type { Database } from '../types/supabase';

type RacerStanding = Database['public']['Views']['racer_standings']['Row'];
export type SortField = 'time' | 'sprint' | 'kom';

export function sortRacers(racers: RacerStanding[], sortField: SortField): RacerStanding[] {
  return [...racers].sort((a, b) => {
    // Always move racers with no time to the bottom
    if (a.total_time === 0 && b.total_time > 0) return 1;
    if (b.total_time === 0 && a.total_time > 0) return -1;

    switch (sortField) {
      case 'time':
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