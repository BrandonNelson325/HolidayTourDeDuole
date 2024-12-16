import { supabase } from '../config/supabase';
import type { Database } from '../types/supabase';

type Racer = Database['public']['Tables']['racers']['Row'];
type RacerInsert = Database['public']['Tables']['racers']['Insert'];
type DailyResult = Database['public']['Tables']['daily_results']['Insert'];

export const racerService = {
  async getRacers() {
    const { data, error } = await supabase
      .from('racer_standings')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  async getRacersInOriginalOrder() {
    const { data, error } = await supabase
      .from('racers')
      .select('*, daily_results(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getDailyResult(racerId: string, day: number) {
    const { data, error } = await supabase
      .from('daily_results')
      .select('*')
      .eq('racer_id', racerId)
      .eq('day', day)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return data;
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
    // First check if a result already exists for this day
    const { data: existing } = await supabase
      .from('daily_results')
      .select('id')
      .eq('racer_id', result.racer_id)
      .eq('day', result.day)
      .single();

    if (existing) {
      // Update existing result
      const { error: updateError } = await supabase
        .from('daily_results')
        .update({
          time: result.time,
          sprint_points: result.sprint_points,
          kom_points: result.kom_points,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (updateError) throw updateError;
    } else {
      // Insert new result
      const { error: insertError } = await supabase
        .from('daily_results')
        .insert(result);

      if (insertError) throw insertError;
    }

    // Update racer totals
    const { error: updateError } = await supabase
      .rpc('update_racer_totals', { racer_uuid: result.racer_id });
    
    if (updateError) throw updateError;
  }
};