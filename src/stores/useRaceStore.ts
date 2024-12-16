import { create } from 'zustand';
import { racerService } from '../services/racerService';
import type { Database } from '../types/supabase';

type RacerStanding = Database['public']['Views']['racer_standings']['Row'];
type Racer = Database['public']['Tables']['racers']['Row'];
type DailyResult = Database['public']['Tables']['daily_results']['Row'];

interface RaceStore {
  racers: RacerStanding[];
  dailyRacers: Racer[];
  isLoading: boolean;
  error: string | null;
  selectedDay: number | null;
  currentDailyResult: DailyResult | null;
  fetchRacers: () => Promise<void>;
  fetchDailyRacers: () => Promise<void>;
  addRacer: (data: { name: string; gender: 'male' | 'female' }) => Promise<void>;
  addDailyResult: (racerId: string, data: { time: number; sprintPoints: number; komPoints: number }) => Promise<void>;
  selectDay: (racerId: string, day: number) => Promise<void>;
}

export const useRaceStore = create<RaceStore>((set, get) => ({
  racers: [],
  dailyRacers: [],
  isLoading: false,
  error: null,
  selectedDay: null,
  currentDailyResult: null,

  fetchRacers: async () => {
    set({ isLoading: true, error: null });
    try {
      const racers = await racerService.getRacers();
      set({ racers, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchDailyRacers: async () => {
    set({ isLoading: true, error: null });
    try {
      const racers = await racerService.getRacersInOriginalOrder();
      set({ dailyRacers: racers, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addRacer: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await racerService.addRacer(data);
      await get().fetchRacers();
      await get().fetchDailyRacers();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  selectDay: async (racerId: string, day: number) => {
    set({ isLoading: true, error: null });
    try {
      const result = await racerService.getDailyResult(racerId, day);
      set({ 
        selectedDay: day,
        currentDailyResult: result,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: (error as Error).message,
        isLoading: false,
        selectedDay: day,
        currentDailyResult: null
      });
    }
  },

  addDailyResult: async (racerId: string, data: { time: number; sprintPoints: number; komPoints: number }) => {
    set({ isLoading: true, error: null });
    try {
      const selectedDay = get().selectedDay ?? get().dailyRacers.find(r => r.id === racerId)?.current_day ?? 1;

      await racerService.addDailyResult({
        racer_id: racerId,
        day: selectedDay,
        time: data.time,
        sprint_points: data.sprintPoints,
        kom_points: data.komPoints
      });

      await get().fetchRacers();
      await get().fetchDailyRacers();
      set({ selectedDay: null, currentDailyResult: null });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
}));