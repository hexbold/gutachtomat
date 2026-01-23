/**
 * Supabase Database Types
 *
 * This file defines TypeScript types for the Supabase database schema.
 * Can be auto-generated using `supabase gen types typescript` once the
 * database is set up.
 *
 * For now, manually defined based on the planned schema.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type GutachtenStatus = 'draft' | 'completed';

export interface Database {
  public: {
    Tables: {
      gutachten: {
        Row: {
          id: string;
          user_id: string;
          status: GutachtenStatus;
          wizard_step: number;
          created_at: string;
          updated_at: string;
          save_version: number;
          schema_version: number;
          // Encrypted fields - stored as base64 strings
          encrypted_chiffre: string | null;
          encrypted_chiffre_iv: string | null;
          encrypted_data: string | null;
          encrypted_data_iv: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: GutachtenStatus;
          wizard_step?: number;
          created_at?: string;
          updated_at?: string;
          save_version?: number;
          schema_version?: number;
          encrypted_chiffre?: string | null;
          encrypted_chiffre_iv?: string | null;
          encrypted_data?: string | null;
          encrypted_data_iv?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: GutachtenStatus;
          wizard_step?: number;
          created_at?: string;
          updated_at?: string;
          save_version?: number;
          schema_version?: number;
          encrypted_chiffre?: string | null;
          encrypted_chiffre_iv?: string | null;
          encrypted_data?: string | null;
          encrypted_data_iv?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      gutachten_status: GutachtenStatus;
    };
  };
}

/**
 * Helper type for gutachten table row
 */
export type GutachtenRow = Database['public']['Tables']['gutachten']['Row'];
export type GutachtenInsert = Database['public']['Tables']['gutachten']['Insert'];
export type GutachtenUpdate = Database['public']['Tables']['gutachten']['Update'];
