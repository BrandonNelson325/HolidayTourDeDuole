export interface Racer {
  id: string;
  name: string;
  totalTime: number;
  totalSprintPoints: number;
  totalKomPoints: number;
  currentDay: number;
}

export interface DailyResult {
  id: string;
  racerId: string;
  day: number;
  time: number;
  sprintPoints: number;
  komPoints: number;
  createdAt: string;
}