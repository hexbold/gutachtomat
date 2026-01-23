'use client';

/**
 * Storage Mode Toggle Component
 *
 * Allows users to switch between local (localStorage) and cloud (Supabase) storage.
 * Both modes use encrypted storage - data is separate per mode.
 */

import { useStorage } from '@/contexts/StorageContext';
import { useUser } from '@clerk/nextjs';
import {
  CloudIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';

export function StorageModeToggle() {
  const { storageMode, switchStorageMode, isInitializing } = useStorage();
  const { user } = useUser();

  // In dev mode without auth, Cloud storage is not available
  const isDev = process.env.NODE_ENV === 'development';
  const canUseCloud = !isDev || !!user;

  const handleToggle = (newMode: 'local' | 'supabase') => {
    if (newMode !== storageMode && !isInitializing) {
      switchStorageMode(newMode);
    }
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <button
        onClick={() => handleToggle('local')}
        disabled={isInitializing}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
          ${storageMode === 'local'
            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }
          ${isInitializing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title="Lokale Speicherung (nur in diesem Browser)"
      >
        <ComputerDesktopIcon className="w-4 h-4" />
        <span>Lokal</span>
      </button>
      <button
        onClick={() => handleToggle('supabase')}
        disabled={isInitializing || !canUseCloud}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
          ${storageMode === 'supabase'
            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }
          ${isInitializing || !canUseCloud ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title={canUseCloud ? "Cloud-Speicherung (verschluesselt)" : "Anmeldung erforderlich für Cloud-Speicherung"}
      >
        <CloudIcon className="w-4 h-4" />
        <span>Cloud</span>
      </button>
    </div>
  );
}
