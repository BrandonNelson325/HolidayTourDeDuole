import { createClient } from '@supabase/supabase-js';
import type { DatabaseRacer, DailyResult } from '../types';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchRacers(): Promise<DatabaseRacer[]> {
  const { data, error } = await supabase
    .from('racers')
    .select('id, name')
    .eq('is_active', true);

  if (error) throw error;
  return data || [];
}

export async function insertDailyResult(result: DailyResult): Promise<void> {
  const { error } = await supabase
    .from('daily_results')
    .insert(result);

  if (error) throw error;

  // Update racer totals
  const { error: updateError } = await supabase
    .rpc('update_racer_totals', { racer_uuid: result.racer_id });

  if (updateError) throw updateError;
}