import type { StorageAdapter, StorageMode } from '../storage-interface';
import { LocalStorageAdapter } from './local-storage-adapter';
import { SupabaseAdapter } from './supabase-adapter';

/**
 * Get the current storage mode from environment or runtime override.
 *
 * Priority:
 * 1. Runtime override in localStorage (for development toggle)
 * 2. Environment variable NEXT_PUBLIC_STORAGE_MODE
 * 3. Default to 'local'
 */
export function getStorageMode(): StorageMode {
  // Check for runtime override (only in browser)
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('storage-mode-override');
    if (override === 'local' || override === 'supabase') {
      return override;
    }
  }

  // Check environment variable
  const envMode = process.env.NEXT_PUBLIC_STORAGE_MODE;
  if (envMode === 'supabase') {
    return 'supabase';
  }

  // Default to local storage
  return 'local';
}

/**
 * Set the storage mode override (for development toggle in settings).
 * Pass null to clear the override and use environment default.
 */
export function setStorageModeOverride(mode: StorageMode | null): void {
  if (typeof window === 'undefined') return;

  if (mode === null) {
    localStorage.removeItem('storage-mode-override');
  } else {
    localStorage.setItem('storage-mode-override', mode);
  }
}

/**
 * Create a storage adapter based on the current mode.
 *
 * For local mode, returns a ready-to-use LocalStorageAdapter.
 * For Supabase mode, returns an uninitialized SupabaseAdapter that needs
 * setClient(), setUserId(), and initialize() to be called.
 *
 * @param mode Optional mode override. If not provided, uses getStorageMode().
 * @returns A storage adapter instance.
 */
export function createStorageAdapter(mode?: StorageMode): StorageAdapter {
  const effectiveMode = mode ?? getStorageMode();

  if (effectiveMode === 'supabase') {
    // Return uninitialized SupabaseAdapter
    // The StorageContext will handle initialization
    return new SupabaseAdapter();
  }

  return new LocalStorageAdapter();
}

/**
 * Create and initialize a Supabase storage adapter.
 * Convenience function that sets up the adapter with client and user ID.
 *
 * @param supabaseClient The Supabase client (with Clerk token).
 * @param userId The Clerk user ID.
 * @returns An initialized Supabase storage adapter.
 */
export async function createInitializedSupabaseAdapter(
  supabaseClient: Parameters<SupabaseAdapter['setSession']>[0],
  userId: string
): Promise<SupabaseAdapter> {
  const adapter = new SupabaseAdapter();
  adapter.setSession(supabaseClient);
  adapter.setUserId(userId);
  await adapter.initialize();
  return adapter;
}

// Re-export adapter classes for direct use if needed
export { LocalStorageAdapter } from './local-storage-adapter';
export { SupabaseAdapter } from './supabase-adapter';
