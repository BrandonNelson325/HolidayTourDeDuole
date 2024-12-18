export interface RacerResult {
  name: string;
  time: number; // Time in milliseconds
  sprintPoints?: number;
  komPoints?: number;
}

export interface DatabaseRacer {
  id: string;
  name: string;
}

export interface DailyResult {
  racer_id: string;
  day: number;
  time: number;
  sprint_points: number;
  kom_points: number;
}