/**
 * Supabase Client with Clerk Integration
 *
 * Creates a Supabase client that uses Clerk session tokens for RLS authentication.
 * Uses the modern Clerk-Supabase integration (no JWT template required).
 * The token is passed in the Authorization header, allowing Supabase RLS policies
 * to use auth.jwt() to verify the user.
 *
 * Setup:
 * 1. Enable Supabase integration in Clerk dashboard
 * 2. Add Clerk as third-party auth provider in Supabase (paste Clerk domain)
 * 3. Supabase automatically fetches Clerk's JWKS for token verification
 *
 * Usage:
 * ```typescript
 * import { useSession } from '@clerk/nextjs';
 * import { createClerkSupabaseClient } from '@/lib/supabase/client';
 *
 * const { session } = useSession();
 * const supabase = await createClerkSupabaseClient(session);
 * const { data } = await supabase.from('gutachten').select('*');
 * ```
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// These will need to be set in environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Session interface matching Clerk's useSession() return type.
 */
interface ClerkSession {
  getToken(options?: { template?: string }): Promise<string | null>;
}

/**
 * Create a Supabase client with Clerk JWT authentication.
 *
 * @param session - Clerk session object from useSession()
 * @returns Supabase client configured with Clerk token
 * @throws Error if session is not available or token fetch fails
 */
export async function createClerkSupabaseClient(
  session: ClerkSession | null | undefined
): Promise<SupabaseClient<Database>> {
  if (!session) {
    throw new Error('No session available. User must be authenticated.');
  }

  // Get the session token from Clerk
  // With modern Clerk-Supabase integration, no template needed - uses native session token
  const supabaseToken = await session.getToken();

  if (!supabaseToken) {
    throw new Error('Failed to get session token from Clerk.');
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${supabaseToken}`,
      },
    },
  });
}

/**
 * Create a Supabase client for server-side use with a pre-obtained token.
 *
 * @param token - JWT token from Clerk
 * @returns Supabase client configured with the token
 */
export function createSupabaseClientWithToken(
  token: string
): SupabaseClient<Database> {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

/**
 * Create a Supabase client without authentication (for public data only).
 * Should only be used for data that doesn't require RLS.
 */
export function createPublicSupabaseClient(): SupabaseClient<Database> {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
