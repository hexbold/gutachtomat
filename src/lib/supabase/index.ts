/**
 * Supabase Module
 *
 * Exports Supabase client utilities and database types.
 */

export {
  createClerkSupabaseClient,
  createSupabaseClientWithToken,
  createPublicSupabaseClient,
} from './client';

export type {
  Database,
  GutachtenRow,
  GutachtenInsert,
  GutachtenUpdate,
  GutachtenStatus,
  Json,
} from './database.types';
