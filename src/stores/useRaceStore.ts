import { create } from 'zustand';
import { racerService } from '../services/racerService';
import type { Database } from '../types/supabase';

type RacerStanding = Database['public']['Views']['racer_standings']['Row'];

interface RaceStore {
  racers: RacerStanding[];
  isLoading: boolean;
  error: string | null;
  fetchRacers: () => Promise<void>;
  addRacer: (data: { name: string; gender: 'male' | 'female' }) => Promise<void>;
  addDailyResult: (racerId: string, data: { time: number; sprintPoints: number; komPoints: number }) => Promise<void>;
}

export const useRaceStore = create<RaceStore>((set, get) => ({
  racers: [],
  isLoading: false,
  error: null,

  fetchRacers: async () => {
    set({ isLoading: true, error: null });
    try {
      const racers = await racerService.getRacers();
      set({ racers, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addRacer: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await racerService.addRacer(data);
      await get().fetchRacers();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addDailyResult: async (racerId: string, data: { time: number; sprintPoints: number; komPoints: number }) => {
    set({ isLoading: true, error: null });
    try {
      const racer = get().racers.find(r => r.id === racerId);
      if (!racer) throw new Error('Racer not found');

      await racerService.addDailyResult({
        racer_id: racerId,
        day: racer.current_day,
        time: data.time,
        sprint_points: data.sprintPoints,
        kom_points: data.komPoints
      });

      await get().fetchRacers();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
}));