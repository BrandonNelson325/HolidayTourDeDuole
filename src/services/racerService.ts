import { supabase } from '../config/supabase';
import type { Database } from '../types/supabase';

type Racer = Database['public']['Tables']['racers']['Row'];
type RacerInsert = Database['public']['Tables']['racers']['Insert'];
type DailyResult = Database['public']['Tables']['daily_results']['Insert'];

export const racerService = {
  async getRacers() {
    const { data, error } = await supabase
      .from('racers')
      .select(`
        id,
        name,
        gender,
        total_time,
        total_sprint_points,
        total_kom_points,
        current_day,
        daily_results (count)
      `)
      .eq('is_active', true)
      .order('total_time', { ascending: true, nullsLast: true });
    
    if (error) throw error;
    
    return data.map(racer => ({
      ...racer,
      completed_stages: racer.daily_results[0].count
    }));
  },

  async addRacer(racer: RacerInsert) {
    const { data, error } = await supabase
      .from('racers')
      .insert(racer)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async addDailyResult(result: DailyResult) {
    const { error: resultError } = await supabase
      .from('daily_results')
      .insert(result);
    
    if (resultError) throw resultError;

    const { error: updateError } = await supabase
      .rpc('update_racer_totals', { racer_uuid: result.racer_id });
    
    if (updateError) throw updateError;
  }
};