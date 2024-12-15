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
          gender: 'male' | 'female'
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
          gender: 'male' | 'female'
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
          gender?: 'male' | 'female'
          total_time?: number
          total_sprint_points?: number
          total_kom_points?: number
          current_day?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // ... rest of the types remain the same
    }
    Views: {
      racer_standings: {
        Row: {
          id: string
          name: string
          gender: 'male' | 'female'
          total_time: number
          total_sprint_points: number
          total_kom_points: number
          current_day: number
          completed_stages: number
        }
      }
    }
    // ... rest of the types remain the same
  }
}