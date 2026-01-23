import { useEffect, useRef, useCallback } from 'react';
import type { Form } from '@/lib/core/form-types';
import type { WizardStateForSave, StorageMode } from '@/lib/storage/storage-interface';
import type { StorageAdapter } from '@/lib/storage/storage-interface';
import { createUUID } from '@/lib/storage/storage-types';

interface UseAutoSaveOptions {
  adapter: StorageAdapter | null;
  gutachtenId: string | null;
  formData: Form;
  wizardState: WizardStateForSave;
  storageMode: StorageMode;
  isReady: boolean;
  isLoading: boolean;
  onSaveStart?: () => void;
  onSaveComplete?: () => void;
  onSaveError?: (error: Error) => void;
}

// Fixed intervals per storage mode (checks for changes, saves if needed)
const AUTO_SAVE_INTERVALS = {
  local: 5000, // 5 seconds for localStorage
  supabase: 60000, // 60 seconds for cloud
} as const;

export function useAutoSave({
  adapter,
  gutachtenId,
  formData,
  wizardState,
  storageMode,
  isReady,
  isLoading,
  onSaveStart,
  onSaveComplete,
  onSaveError,
}: UseAutoSaveOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');
  const lastSavedFormDataRef = useRef<string>(''); // Form-only hash for UI change detection
  const isSavingRef = useRef(false);
  const wasLoadingRef = useRef(true);

  // Refs to hold latest function references (prevents interval restart on every formData change)
  const saveRef = useRef<() => Promise<void>>(() => Promise.resolve());
  const hasUnsavedChangesRef = useRef<() => boolean>(() => false);

  // Initialize hash when draft finishes loading (prevents unnecessary save on open)
  useEffect(() => {
    if (wasLoadingRef.current && !isLoading && gutachtenId) {
      // Draft just finished loading - set hash to current data
      lastSavedDataRef.current = JSON.stringify({ formData, wizardState });
      lastSavedFormDataRef.current = JSON.stringify(formData); // Form-only for UI
    }
    wasLoadingRef.current = isLoading;
  }, [isLoading, gutachtenId, formData, wizardState]);

  // Check for unsaved changes (only compares formData, not wizardState)
  // wizardState changes (step navigation) should not trigger "Neue Änderungen" indicator
  const hasUnsavedChanges = useCallback(() => {
    // Hash not yet initialized (draft just loaded, effect hasn't run yet)
    if (!lastSavedFormDataRef.current) return false;

    const currentFormHash = JSON.stringify(formData);
    return currentFormHash !== lastSavedFormDataRef.current;
  }, [formData]);

  // Save function - calls adapter directly (browser to Supabase REST API)
  const save = useCallback(async () => {
    if (!adapter || !gutachtenId || !isReady || isLoading || isSavingRef.current) return;

    // Create hash of current data to detect changes
    const currentDataHash = JSON.stringify({ formData, wizardState });
    if (currentDataHash === lastSavedDataRef.current) return; // No changes

    isSavingRef.current = true;

    try {
      onSaveStart?.();
      await adapter.saveDraft(createUUID(gutachtenId), formData, wizardState);
      lastSavedDataRef.current = currentDataHash;
      lastSavedFormDataRef.current = JSON.stringify(formData); // Form-only for UI
      onSaveComplete?.();
    } catch (error) {
      onSaveError?.(error as Error);
    } finally {
      isSavingRef.current = false;
    }
  }, [adapter, gutachtenId, formData, wizardState, isReady, isLoading, onSaveStart, onSaveComplete, onSaveError]);

  // Keep refs updated with latest function references
  // This effect is fine to re-run on every change - it just updates refs
  useEffect(() => {
    saveRef.current = save;
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [save, hasUnsavedChanges]);

  // Auto-save with fixed interval - checks for changes and saves if needed
  // Uses refs so the interval doesn't restart on every formData change
  useEffect(() => {
    if (!adapter || !gutachtenId || !isReady || isLoading) return;

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const interval = AUTO_SAVE_INTERVALS[storageMode];

    // Fixed interval - check for changes and save if needed
    // Read from refs to always get latest functions without restarting interval
    intervalRef.current = setInterval(() => {
      if (hasUnsavedChangesRef.current()) {
        saveRef.current();
      }
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [adapter, gutachtenId, isReady, isLoading, storageMode]);
  // ↑ REMOVED: save, hasUnsavedChanges - using refs instead

  // Show warning dialog on tab close / page refresh (beforeunload)
  // User can "Stay" and save manually, or "Leave" and lose changes
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        // Standard way to show browser's "Leave page?" dialog
        event.preventDefault();
        // Some browsers require returnValue to be set
        event.returnValue = 'Du hast ungespeicherte Änderungen. Möchtest du die Seite wirklich verlassen?';
        return event.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Save on in-app navigation (custom event from Navigation component)
  // This works because during SPA navigation, JS context persists and async operations complete
  useEffect(() => {
    const handleNavigationSave = () => {
      console.log('[useAutoSave] Navigation event received, saving via adapter...');
      save(); // Direct browser-to-Supabase REST API call with Clerk token
    };

    window.addEventListener('gutachten:save-before-navigate', handleNavigationSave);
    return () => window.removeEventListener('gutachten:save-before-navigate', handleNavigationSave);
  }, [save]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { save, hasUnsavedChanges };
}
