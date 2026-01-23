'use client';

/**
 * Storage Context
 *
 * Provides storage adapter access throughout the application.
 * Handles initialization of the appropriate adapter based on storage mode.
 *
 * Usage:
 * ```tsx
 * // In layout.tsx or protected layout
 * <StorageProvider>
 *   <YourApp />
 * </StorageProvider>
 *
 * // In components
 * const { adapter, isReady, storageMode, error } = useStorage();
 * if (!isReady) return <Loading />;
 * const drafts = await adapter.loadIndex();
 * ```
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useSession, useUser } from '@clerk/nextjs';
import type { StorageAdapter, StorageMode } from '@/lib/storage/storage-interface';
import {
  getStorageMode,
  setStorageModeOverride,
  LocalStorageAdapter,
  SupabaseAdapter,
} from '@/lib/storage/adapters';
import { clearCachedKey } from '@/lib/storage/encryption/key-manager';

interface StorageContextValue {
  /** The initialized storage adapter */
  adapter: StorageAdapter | null;
  /** Whether the adapter is ready to use */
  isReady: boolean;
  /** Whether the adapter is currently initializing */
  isInitializing: boolean;
  /** Current storage mode */
  storageMode: StorageMode;
  /** Error that occurred during initialization */
  error: Error | null;
  /** Switch storage mode (causes re-initialization) */
  switchStorageMode: (mode: StorageMode) => void;
  /** Reinitialize the adapter (useful after errors) */
  reinitialize: () => Promise<void>;
}

const StorageContext = createContext<StorageContextValue | null>(null);

interface StorageProviderProps {
  children: React.ReactNode;
  /** Optional initial mode override */
  initialMode?: StorageMode;
}

/**
 * Storage Provider Component
 *
 * Wrap your application with this provider to enable storage access.
 * For Supabase mode, must be inside ClerkProvider.
 */
export function StorageProvider({ children, initialMode }: StorageProviderProps) {
  const { session } = useSession();
  const { user } = useUser();

  const [adapter, setAdapter] = useState<StorageAdapter | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [storageMode, setStorageMode] = useState<StorageMode>(initialMode ?? getStorageMode());
  const [error, setError] = useState<Error | null>(null);

  /**
   * Initialize the storage adapter based on current mode.
   */
  const initializeAdapter = useCallback(async () => {
    setIsInitializing(true);
    setIsReady(false);
    setError(null);

    try {
      // ════════════════════════════════════════════════════════════════
      // DEV MODE ONLY: Use unencrypted storage when not authenticated
      // This check must happen FIRST because BOTH 'local' and 'supabase'
      // modes require authentication for encryption keys.
      // See: docs/important-infos/security/storage-auth-modes.md
      // ════════════════════════════════════════════════════════════════
      if (process.env.NODE_ENV === 'development' && !session && !user) {
        // Dynamic import to prevent bundling in production
        const { UnencryptedDevAdapter } = await import(
          '@/lib/storage/adapters/unencrypted-dev-adapter'
        );
        const devAdapter = new UnencryptedDevAdapter();
        await devAdapter.initialize();
        setAdapter(devAdapter);
        setIsReady(true);
        setIsInitializing(false);
        return;
      }
      // ════════════════════════════════════════════════════════════════
      // PRODUCTION / AUTHENTICATED: Normal storage with encryption
      // ════════════════════════════════════════════════════════════════

      if (storageMode === 'local') {
        // Local storage with encryption (requires auth for encryption key)
        const localAdapter = new LocalStorageAdapter();
        await localAdapter.initialize();
        setAdapter(localAdapter);
        setIsReady(true);
      } else if (storageMode === 'supabase') {
        // Supabase requires authentication
        if (!session || !user) {
          // In production without auth, wait for authentication
          setIsInitializing(false);
          return;
        }

        // Create and initialize Supabase adapter
        // Pass the session so the adapter can get fresh tokens for each operation
        const supabaseAdapter = new SupabaseAdapter();
        supabaseAdapter.setSession(session);
        supabaseAdapter.setUserId(user.id);
        await supabaseAdapter.initialize();

        setAdapter(supabaseAdapter);
        setIsReady(true);
      }
    } catch (err) {
      console.error('Failed to initialize storage adapter:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));

      // Fall back to localStorage if Supabase fails
      if (storageMode === 'supabase') {
        console.warn('Falling back to localStorage due to Supabase initialization failure');
        try {
          const localAdapter = new LocalStorageAdapter();
          await localAdapter.initialize();
          setAdapter(localAdapter);
          setIsReady(true);
          setError(new Error('Using localStorage (Supabase unavailable)'));
        } catch (fallbackErr) {
          console.error('Fallback to localStorage also failed:', fallbackErr);
        }
      }
    } finally {
      setIsInitializing(false);
    }
  }, [storageMode, session, user]);

  /**
   * Switch storage mode and reinitialize.
   */
  const switchStorageMode = useCallback((newMode: StorageMode) => {
    // Clear cached encryption key when switching modes
    if (storageMode === 'supabase' && newMode === 'local') {
      clearCachedKey();
    }

    // Update the override in localStorage
    setStorageModeOverride(newMode);
    setStorageMode(newMode);
    setAdapter(null);
    setIsReady(false);
  }, [storageMode]);

  /**
   * Reinitialize the adapter (useful after errors).
   */
  const reinitialize = useCallback(async () => {
    await initializeAdapter();
  }, [initializeAdapter]);

  // Initialize on mount and when dependencies change
  useEffect(() => {
    initializeAdapter();
  }, [initializeAdapter]);

  // Re-initialize when session changes (login/logout)
  useEffect(() => {
    if (storageMode === 'supabase') {
      // Session changed - need to reinitialize with new token
      initializeAdapter();
    }
  }, [session?.id, storageMode, initializeAdapter]);

  const value = useMemo<StorageContextValue>(
    () => ({
      adapter,
      isReady,
      isInitializing,
      storageMode,
      error,
      switchStorageMode,
      reinitialize,
    }),
    [adapter, isReady, isInitializing, storageMode, error, switchStorageMode, reinitialize]
  );

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
}

/**
 * Hook to access the storage context.
 *
 * @throws Error if used outside of StorageProvider
 */
export function useStorage(): StorageContextValue {
  const context = useContext(StorageContext);

  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }

  return context;
}

/**
 * Hook to get the storage adapter only when it's ready.
 * Returns null while initializing.
 *
 * Usage:
 * ```tsx
 * const adapter = useStorageAdapter();
 * if (!adapter) return <Loading />;
 * ```
 */
export function useStorageAdapter(): StorageAdapter | null {
  const { adapter, isReady } = useStorage();
  return isReady ? adapter : null;
}
