export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      racers: {
        Row: {
          id: string
          name: string
          total_time: number
          total_sprint_points: number
          total_kom_points: number
          current_day: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          total_time?: number
          total_sprint_points?: number
          total_kom_points?: number
          current_day?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          total_time?: number
          total_sprint_points?: number
          total_kom_points?: number
          current_day?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      daily_results: {
        Row: {
          id: string
          racer_id: string
          day: number
          time: number
          sprint_points: number
          kom_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          racer_id: string
          day: number
          time: number
          sprint_points?: number
          kom_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          racer_id?: string
          day?: number
          time?: number
          sprint_points?: number
          kom_points?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      racer_standings: {
        Row: {
          id: string
          name: string
          total_time: number
          total_sprint_points: number
          total_kom_points: number
          current_day: number
          completed_stages: number
        }
      }
    }
    Functions: {
      update_racer_totals: {
        Args: { racer_uuid: string }
        Returns: void
      }
    }
  }
}