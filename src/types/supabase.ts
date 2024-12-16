import type { Database as DatabaseGenerated } from './supabase-types';

export interface Database extends DatabaseGenerated {
  public: {
    Tables: DatabaseGenerated['public']['Tables'] & {
      racers: {
        Row: DatabaseGenerated['public']['Tables']['racers']['Row'] & {
          daily_results?: Array<DatabaseGenerated['public']['Tables']['daily_results']['Row']>;
        };
      };
    };
    Views: DatabaseGenerated['public']['Views'] & {
      racer_standings: {
        Row: DatabaseGenerated['public']['Views']['racer_standings']['Row'] & {
          daily_results?: Array<DatabaseGenerated['public']['Tables']['daily_results']['Row']>;
        };
      };
    };
  };
}