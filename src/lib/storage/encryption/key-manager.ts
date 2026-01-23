/**
 * Encryption Key Manager
 *
 * Handles fetching and caching the user's encryption key from the server.
 * The key is stored in Clerk's privateMetadata and fetched via an API endpoint.
 *
 * Key lifecycle:
 * 1. On user signup: Generate key in Clerk webhook, store in privateMetadata
 * 2. On login/session: Fetch key from /api/encryption-key, cache in memory
 * 3. On use: Return cached CryptoKey for encrypt/decrypt operations
 */

import { importKeyFromBase64 } from './crypto';

/**
 * Cached encryption key - stored in memory only (never localStorage).
 * Cleared on page refresh (user must re-authenticate).
 */
let cachedKey: CryptoKey | null = null;

/**
 * Promise for in-flight key fetch (prevents duplicate requests).
 */
let fetchPromise: Promise<CryptoKey> | null = null;

/**
 * Error that occurred during last key fetch attempt.
 */
let lastError: Error | null = null;

/**
 * Fetch the encryption key from the server API.
 * The key is stored in Clerk's privateMetadata and only accessible server-side.
 *
 * @returns The user's CryptoKey for encryption/decryption
 * @throws Error if user is not authenticated or key not found
 */
async function fetchKeyFromServer(): Promise<CryptoKey> {
  const response = await fetch('/api/encryption-key', {
    method: 'GET',
    credentials: 'include', // Include auth cookies
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Not authenticated. Please log in.');
    }
    if (response.status === 404) {
      throw new Error('Encryption key not found. Please contact support.');
    }
    throw new Error(`Failed to fetch encryption key: ${response.statusText}`);
  }

  const data = await response.json() as { key: string };

  if (!data.key) {
    throw new Error('Invalid response: missing encryption key');
  }

  return importKeyFromBase64(data.key);
}

/**
 * Get the encryption key, fetching from server if not cached.
 *
 * Uses singleton pattern - only one fetch request at a time,
 * and the result is cached for subsequent calls.
 *
 * @returns The user's CryptoKey for encryption/decryption
 * @throws Error if fetch fails or user is not authenticated
 */
export async function getEncryptionKey(): Promise<CryptoKey> {
  // Return cached key if available
  if (cachedKey) {
    return cachedKey;
  }

  // If a fetch is already in progress, wait for it
  if (fetchPromise) {
    return fetchPromise;
  }

  // Start new fetch
  fetchPromise = fetchKeyFromServer()
    .then((key) => {
      cachedKey = key;
      lastError = null;
      fetchPromise = null;
      return key;
    })
    .catch((error) => {
      lastError = error;
      fetchPromise = null;
      throw error;
    });

  return fetchPromise;
}

/**
 * Check if the encryption key is already cached.
 * Useful for checking if initialization is needed before showing UI.
 */
export function isKeyLoaded(): boolean {
  return cachedKey !== null;
}

/**
 * Get the last error that occurred during key fetch.
 * Useful for displaying error messages to the user.
 */
export function getLastKeyError(): Error | null {
  return lastError;
}

/**
 * Clear the cached key (e.g., on logout).
 * The key will be re-fetched on next getEncryptionKey() call.
 */
export function clearCachedKey(): void {
  cachedKey = null;
  fetchPromise = null;
  lastError = null;
}

/**
 * Pre-load the encryption key.
 * Call this on app initialization to start fetching early.
 * Errors are caught and stored in lastError.
 */
export async function preloadKey(): Promise<void> {
  try {
    await getEncryptionKey();
  } catch {
    // Error is stored in lastError, caller can check with getLastKeyError()
  }
}
