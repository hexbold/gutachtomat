'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useStorage } from '@/contexts/StorageContext';
import { StorageModeToggle } from '@/components/StorageModeToggle';
import type { StoredGutachtenMeta } from '@/lib/storage/storage-types';
import { createUUID } from '@/lib/storage/storage-types';
import {
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';

function GutachtenDashboard() {
  const router = useRouter();
  const { adapter, isReady, isInitializing, storageMode, error } = useStorage();
  const [drafts, setDrafts] = useState<StoredGutachtenMeta[]>([]);
  const [completed, setCompleted] = useState<StoredGutachtenMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Multi-select state
  const [draftSelectionMode, setDraftSelectionMode] = useState(false);
  const [completedSelectionMode, setCompletedSelectionMode] = useState(false);
  const [selectedDrafts, setSelectedDrafts] = useState<Set<string>>(new Set());
  const [selectedCompleted, setSelectedCompleted] = useState<Set<string>>(new Set());
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load index when adapter is ready
  const loadData = useCallback(async () => {
    if (!adapter || !isReady) return;

    setIsLoading(true);
    try {
      const index = await adapter.loadIndex();
      // Sort by updatedAt descending (most recent first)
      setDrafts([...index.drafts].sort((a, b) => b.updatedAt - a.updatedAt));
      setCompleted([...index.completed].sort((a, b) => b.updatedAt - a.updatedAt));
    } catch (err) {
      console.error('Failed to load gutachten index:', err);
    } finally {
      setIsLoading(false);
    }
  }, [adapter, isReady]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateNew = async () => {
    if (!adapter) return;
    const id = await adapter.createDraft();
    router.push(`/gutachten-erstellen?id=${id}`);
  };

  const handleResumeDraft = (id: string) => {
    router.push(`/gutachten-erstellen?id=${id}`);
  };

  const handleViewCompleted = (id: string) => {
    router.push(`/gutachten-erstellen/ergebnis?id=${id}`);
  };

  const handleDeleteDraft = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!adapter) return;
    if (confirm('Entwurf wirklich loeschen?')) {
      await adapter.deleteDraft(createUUID(id));
      setDrafts(drafts.filter((d) => d.id !== id));
    }
  };

  const handleDeleteCompleted = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!adapter) return;
    if (confirm('Gutachten wirklich loeschen?')) {
      await adapter.deleteCompleted(createUUID(id));
      setCompleted(completed.filter((c) => c.id !== id));
    }
  };

  // Selection mode toggle handlers
  const toggleDraftSelectionMode = () => {
    if (draftSelectionMode) {
      setSelectedDrafts(new Set());
    }
    setDraftSelectionMode(!draftSelectionMode);
  };

  const toggleCompletedSelectionMode = () => {
    if (completedSelectionMode) {
      setSelectedCompleted(new Set());
    }
    setCompletedSelectionMode(!completedSelectionMode);
  };

  // Selection handlers
  const toggleDraftSelection = (id: string) => {
    const newSelection = new Set(selectedDrafts);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedDrafts(newSelection);
  };

  const toggleCompletedSelection = (id: string) => {
    const newSelection = new Set(selectedCompleted);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedCompleted(newSelection);
  };

  // Bulk delete handlers
  const handleBulkDeleteDrafts = async () => {
    if (!adapter || selectedDrafts.size === 0) return;
    if (confirm(`${selectedDrafts.size} Entwuerfe wirklich loeschen?`)) {
      const count = selectedDrafts.size;
      const deletePromises = Array.from(selectedDrafts).map((id) =>
        adapter.deleteDraft(createUUID(id))
      );
      await Promise.all(deletePromises);
      setDrafts(drafts.filter((d) => !selectedDrafts.has(d.id)));
      setSelectedDrafts(new Set());
      setDraftSelectionMode(false);
      setSuccessMessage(`${count} Entwürfe erfolgreich gelöscht.`);
      setShowSuccessDialog(true);
    }
  };

  const handleBulkDeleteCompleted = async () => {
    if (!adapter || selectedCompleted.size === 0) return;
    if (confirm(`${selectedCompleted.size} Gutachten wirklich loeschen?`)) {
      const count = selectedCompleted.size;
      const deletePromises = Array.from(selectedCompleted).map((id) =>
        adapter.deleteCompleted(createUUID(id))
      );
      await Promise.all(deletePromises);
      setCompleted(completed.filter((c) => !selectedCompleted.has(c.id)));
      setSelectedCompleted(new Set());
      setCompletedSelectionMode(false);
      setSuccessMessage(`${count} Gutachten erfolgreich gelöscht.`);
      setShowSuccessDialog(true);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading || isInitializing || !isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 flex items-center justify-center">
        <p className="text-foreground/60">Laden...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Meine Gutachten</h1>
              <p className="text-foreground/60 mt-2">
                Verwalten Sie Ihre Gutachten-Entwuerfe und abgeschlossenen Gutachten.
              </p>
            </div>
            <StorageModeToggle />
          </div>
          {error && (
            <p className="text-amber-600 dark:text-amber-400 text-sm mt-2">
              {error.message}
            </p>
          )}
        </div>

        {/* Create New Button */}
        <button
          onClick={handleCreateNew}
          className="w-full mb-12 p-8 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-2xl
                     hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50
                     transition-all cursor-pointer flex flex-col items-center justify-center gap-3"
        >
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
            <PlusIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">
            Neues Gutachten erstellen
          </span>
        </button>

        {/* Drafts Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <DocumentTextIcon className="w-6 h-6 text-amber-500" />
              Entwuerfe ({drafts.length})
            </h2>
            {drafts.length > 0 && (
              <div className="flex items-center gap-2">
                {draftSelectionMode && selectedDrafts.size > 0 && (
                  <button
                    onClick={handleBulkDeleteDrafts}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Löschen ({selectedDrafts.size})
                  </button>
                )}
                <button
                  onClick={toggleDraftSelectionMode}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    draftSelectionMode
                      ? 'bg-slate-200 dark:bg-slate-700 text-foreground'
                      : 'bg-slate-100 dark:bg-slate-800 text-foreground/70 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {draftSelectionMode ? 'Abbrechen' : 'Auswählen'}
                </button>
              </div>
            )}
          </div>
          {drafts.length === 0 ? (
            <p className="text-foreground/60 py-4 bg-white dark:bg-slate-800/50 rounded-xl px-4 border border-slate-200 dark:border-slate-700">
              Keine Entwuerfe vorhanden.
            </p>
          ) : (
            <div className="space-y-3">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  onClick={() => draftSelectionMode ? toggleDraftSelection(draft.id) : handleResumeDraft(draft.id)}
                  className={`bg-white dark:bg-slate-800/50 border rounded-xl p-4 flex items-center justify-between
                             hover:shadow-lg transition-all cursor-pointer ${
                               draftSelectionMode && selectedDrafts.has(draft.id)
                                 ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20'
                                 : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                             }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {draftSelectionMode && (
                      <input
                        type="checkbox"
                        checked={selectedDrafts.has(draft.id)}
                        onChange={() => toggleDraftSelection(draft.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {draft.patientenchiffre || 'Ohne Chiffre'}
                      </p>
                      <p className="text-sm text-foreground/60">
                        Zuletzt bearbeitet: {formatDate(draft.updatedAt)}
                      </p>
                      <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                        Schritt {draft.wizardStep} von 8
                      </p>
                    </div>
                  </div>
                  {!draftSelectionMode && (
                    <button
                      onClick={(e) => handleDeleteDraft(e, draft.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                      title="Loeschen"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Completed Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
              Abgeschlossen ({completed.length})
            </h2>
            {completed.length > 0 && (
              <div className="flex items-center gap-2">
                {completedSelectionMode && selectedCompleted.size > 0 && (
                  <button
                    onClick={handleBulkDeleteCompleted}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Löschen ({selectedCompleted.size})
                  </button>
                )}
                <button
                  onClick={toggleCompletedSelectionMode}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    completedSelectionMode
                      ? 'bg-slate-200 dark:bg-slate-700 text-foreground'
                      : 'bg-slate-100 dark:bg-slate-800 text-foreground/70 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {completedSelectionMode ? 'Abbrechen' : 'Auswählen'}
                </button>
              </div>
            )}
          </div>
          {completed.length === 0 ? (
            <p className="text-foreground/60 py-4 bg-white dark:bg-slate-800/50 rounded-xl px-4 border border-slate-200 dark:border-slate-700">
              Keine abgeschlossenen Gutachten.
            </p>
          ) : (
            <div className="space-y-3">
              {completed.map((item) => (
                <div
                  key={item.id}
                  onClick={() => completedSelectionMode ? toggleCompletedSelection(item.id) : handleViewCompleted(item.id)}
                  className={`bg-white dark:bg-slate-800/50 border rounded-xl p-4 flex items-center justify-between
                             hover:shadow-lg transition-all cursor-pointer ${
                               completedSelectionMode && selectedCompleted.has(item.id)
                                 ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20'
                                 : 'border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600'
                             }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {completedSelectionMode && (
                      <input
                        type="checkbox"
                        checked={selectedCompleted.has(item.id)}
                        onChange={() => toggleCompletedSelection(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {item.patientenchiffre || 'Ohne Chiffre'}
                      </p>
                      <p className="text-sm text-foreground/60">
                        Erstellt: {formatDate(item.createdAt)}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Abgeschlossen
                      </p>
                    </div>
                  </div>
                  {!completedSelectionMode && (
                    <button
                      onClick={(e) => handleDeleteCompleted(e, item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                      title="Loeschen"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Success Dialog */}
        <ConfirmationDialog
          isOpen={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          title="Erfolgreich gelöscht"
          message={successMessage}
          type="success"
        />
      </div>
    </div>
  );
}

// Landing view for unauthenticated users
function GutachtenLanding({ onDevBypass }: { onDevBypass?: () => void }) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900">
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Gutachten erstellen
        </h1>
        <p className="text-lg text-foreground/70 mb-8">
          Melden Sie sich an, um psychiatrische Gutachten zu erstellen und zu verwalten.
        </p>

        {isDev ? (
          <button
            onClick={onDevBypass}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            Anmelden (Dev Mode)
          </button>
        ) : (
          <SignInButton mode="modal">
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
              Anmelden
            </button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}

// Main export with conditional rendering
export default function GutachtenPage() {
  const [devBypass, setDevBypass] = useState(false);
  const isDev = process.env.NODE_ENV === 'development';

  // Dev mode bypass: show dashboard directly after clicking "Anmelden"
  if (isDev && devBypass) {
    return <GutachtenDashboard />;
  }

  return (
    <>
      <SignedOut>
        <GutachtenLanding onDevBypass={() => setDevBypass(true)} />
      </SignedOut>
      <SignedIn>
        <GutachtenDashboard />
      </SignedIn>
    </>
  );
}
