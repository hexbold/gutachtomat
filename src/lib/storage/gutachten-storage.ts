import type { Form, AssessmentStructure } from '@/lib/core/form-types';
import { initialFormState } from '@/lib/core/form-types';
import {
  StoredGutachtenDraft,
  StoredGutachtenCompleted,
  StoredGutachtenMeta,
  GutachtenIndex,
  GutachtenStatus,
  STORAGE_KEYS,
  UUID,
  createUUID,
} from './storage-types';

// Re-export interface types for convenience
export type { StorageAdapter, StorageMode } from './storage-interface';
// Import WizardStateForSave for use in this file, and re-export it
import type { WizardStateForSave } from './storage-interface';
export type { WizardStateForSave };

// Re-export adapter factory functions
export {
  getStorageMode,
  setStorageModeOverride,
  createStorageAdapter,
  LocalStorageAdapter,
} from './adapters';

// ============================================================================
// HELPER: Check if localStorage is available
// ============================================================================

function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// INDEX OPERATIONS
// ============================================================================

/** Load the Gutachten index (list of all drafts/completed) */
export function loadGutachtenIndex(): GutachtenIndex {
  if (!isLocalStorageAvailable()) {
    return { drafts: [], completed: [] };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.INDEX);
    if (!stored) {
      return { drafts: [], completed: [] };
    }
    const parsed = JSON.parse(stored) as GutachtenIndex;

    // TODO: Future database migration
    // Replace with: const response = await fetch('/api/gutachten'); return response.json();

    // TODO: Add migration logic here when schema version changes
    // if (parsed.schemaVersion < STORAGE_SCHEMA_VERSION) {
    //   return migrateIndex(parsed);
    // }

    // Deduplicate arrays by ID (cleanup for any existing duplicates)
    const seenDraftIds = new Set<string>();
    const seenCompletedIds = new Set<string>();
    parsed.drafts = parsed.drafts.filter((d) => {
      if (seenDraftIds.has(d.id)) return false;
      seenDraftIds.add(d.id);
      return true;
    });
    parsed.completed = parsed.completed.filter((c) => {
      if (seenCompletedIds.has(c.id)) return false;
      seenCompletedIds.add(c.id);
      return true;
    });

    return parsed;
  } catch (error) {
    console.error('Failed to load Gutachten index:', error);
    return { drafts: [], completed: [] };
  }
}

/** Save the Gutachten index */
function saveGutachtenIndex(index: GutachtenIndex): void {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.setItem(STORAGE_KEYS.INDEX, JSON.stringify(index));
  } catch (error) {
    console.error('Failed to save Gutachten index:', error);
    // TODO: Handle quota exceeded error - notify user
  }
}

// ============================================================================
// DRAFT OPERATIONS
// ============================================================================

/** Create a new draft Gutachten and return its ID */
export function createDraft(): UUID {
  const id = createUUID(crypto.randomUUID());
  const now = Date.now();

  // TODO: Future database migration
  // Replace with: const response = await fetch('/api/gutachten', { method: 'POST' });
  // const { id } = await response.json(); return id;

  const meta: StoredGutachtenMeta = {
    id,
    status: GutachtenStatus.Draft,
    patientenchiffre: null,
    createdAt: now,
    updatedAt: now,
    wizardStep: 1,
    step3SubStep: 1,
    step4SubStep: 1,
    step5SubStep: 1,
    step7SubStep: 1,
  };

  const draft: StoredGutachtenDraft = {
    meta,
    formData: initialFormState.formData,
  };

  // Save the draft
  if (isLocalStorageAvailable()) {
    localStorage.setItem(`${STORAGE_KEYS.DRAFT_PREFIX}${id}`, JSON.stringify(draft));
  }

  // Update index
  const index = loadGutachtenIndex();
  index.drafts.push(meta);
  saveGutachtenIndex(index);

  return id;
}

/** Load a draft by ID (returns null if not found or parsing fails) */
export function loadDraft(id: UUID): StoredGutachtenDraft | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.DRAFT_PREFIX}${id}`);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as StoredGutachtenDraft;

    // TODO: Future database migration
    // Replace with: const response = await fetch(`/api/gutachten/${id}`);
    // if (!response.ok) return null; return response.json();

    // TODO: Add migration logic when schema changes
    // if (parsed.schemaVersion < STORAGE_SCHEMA_VERSION) {
    //   return migrateDraft(parsed);
    // }

    return parsed;
  } catch (error) {
    console.error(`Failed to load draft ${id}:`, error);
    return null;
  }
}

/** Save/update a draft */
export function saveDraft(id: UUID, formData: Form, wizardState: WizardStateForSave): void {
  if (!isLocalStorageAvailable()) return;

  // Don't recreate a draft if it's already been completed
  const index = loadGutachtenIndex();
  if (index.completed.some((c) => c.id === id)) {
    return;
  }

  // TODO: Future database migration
  // Replace with: await fetch(`/api/gutachten/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ formData, wizardState }),
  // });

  const now = Date.now();
  const existingDraft = loadDraft(id);

  const meta: StoredGutachtenMeta = {
    id,
    status: GutachtenStatus.Draft,
    patientenchiffre: formData.patientenchiffre,
    createdAt: existingDraft?.meta.createdAt ?? now,
    updatedAt: now,
    wizardStep: wizardState.currentStep,
    step3SubStep: wizardState.step3CurrentSubStep,
    step4SubStep: wizardState.step4CurrentSubStep,
    step5SubStep: wizardState.step5CurrentSubStep,
    step7SubStep: wizardState.step7CurrentSubStep,
  };

  const draft: StoredGutachtenDraft = {
    meta,
    formData,
  };

  localStorage.setItem(`${STORAGE_KEYS.DRAFT_PREFIX}${id}`, JSON.stringify(draft));

  // Update index (reuse index loaded earlier for completion check)
  const draftIndex = index.drafts.findIndex((d) => d.id === id);
  if (draftIndex >= 0) {
    index.drafts[draftIndex] = meta;
  } else {
    index.drafts.push(meta);
  }
  saveGutachtenIndex(index);
}

/** Delete a draft */
export function deleteDraft(id: UUID): void {
  if (!isLocalStorageAvailable()) return;

  // TODO: Future database migration
  // Replace with: await fetch(`/api/gutachten/${id}`, { method: 'DELETE' });

  localStorage.removeItem(`${STORAGE_KEYS.DRAFT_PREFIX}${id}`);

  const index = loadGutachtenIndex();
  index.drafts = index.drafts.filter((d) => d.id !== id);
  saveGutachtenIndex(index);
}

// ============================================================================
// COMPLETION OPERATIONS
// ============================================================================

/** Complete a draft (moves to completed status) - V2: stores JSON structure */
export function completeDraft(
  id: UUID,
  originalStructure: AssessmentStructure
): void {
  if (!isLocalStorageAvailable()) return;

  const draft = loadDraft(id);
  if (!draft) {
    console.error(`Cannot complete draft ${id}: not found`);
    return;
  }

  // TODO: Future database migration
  // Replace with: await fetch(`/api/gutachten/${id}/complete`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ originalStructure }),
  // });

  const now = Date.now();
  const meta: StoredGutachtenMeta = {
    ...draft.meta,
    status: GutachtenStatus.Completed,
    updatedAt: now,
  };

  const completed: StoredGutachtenCompleted = {
    meta,
    formData: draft.formData,
    generatedText: {
      originalStructure,
      currentMarkdown: null, // No edits yet
    },
  };

  // Save as completed
  localStorage.setItem(`${STORAGE_KEYS.COMPLETED_PREFIX}${id}`, JSON.stringify(completed));

  // Remove draft
  localStorage.removeItem(`${STORAGE_KEYS.DRAFT_PREFIX}${id}`);

  // Update index
  const index = loadGutachtenIndex();
  index.drafts = index.drafts.filter((d) => d.id !== id);
  // Only add to completed if not already there (prevents duplicates)
  if (!index.completed.some((c) => c.id === id)) {
    index.completed.push(meta);
  }
  saveGutachtenIndex(index);
}

/** Load a completed Gutachten */
export function loadCompleted(id: UUID): StoredGutachtenCompleted | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.COMPLETED_PREFIX}${id}`);
    if (!stored) return null;

    // TODO: Future database migration
    // Replace with: const response = await fetch(`/api/gutachten/${id}`);
    // if (!response.ok) return null; return response.json();

    return JSON.parse(stored) as StoredGutachtenCompleted;
  } catch (error) {
    console.error(`Failed to load completed Gutachten ${id}:`, error);
    return null;
  }
}

/** Update the Markdown content of a completed Gutachten (after user edits in MDXEditor) */
export function updateCompletedMarkdown(id: UUID, currentMarkdown: string, aiImproved?: boolean): void {
  if (!isLocalStorageAvailable()) return;

  const completed = loadCompleted(id);
  if (!completed) {
    console.error(`Cannot update completed ${id}: not found`);
    return;
  }

  completed.generatedText.currentMarkdown = currentMarkdown;
  if (aiImproved !== undefined) {
    completed.generatedText.aiImproved = aiImproved;
  }
  completed.meta.updatedAt = Date.now();

  localStorage.setItem(`${STORAGE_KEYS.COMPLETED_PREFIX}${id}`, JSON.stringify(completed));

  // Update index timestamp
  const index = loadGutachtenIndex();
  const completedIndex = index.completed.findIndex((c) => c.id === id);
  if (completedIndex >= 0) {
    index.completed[completedIndex].updatedAt = completed.meta.updatedAt;
    saveGutachtenIndex(index);
  }
}

/** Revert a completed Gutachten to its original state (clear user edits and AI) */
export function revertCompletedToOriginal(id: UUID): void {
  if (!isLocalStorageAvailable()) return;

  const completed = loadCompleted(id);
  if (!completed) {
    console.error(`Cannot revert completed ${id}: not found`);
    return;
  }

  completed.generatedText.currentMarkdown = null;
  completed.generatedText.aiImproved = false;
  completed.generatedText.aiImprovedMarkdown = null;
  completed.meta.updatedAt = Date.now();

  localStorage.setItem(`${STORAGE_KEYS.COMPLETED_PREFIX}${id}`, JSON.stringify(completed));

  // Update index timestamp
  const index = loadGutachtenIndex();
  const completedIndex = index.completed.findIndex((c) => c.id === id);
  if (completedIndex >= 0) {
    index.completed[completedIndex].updatedAt = completed.meta.updatedAt;
    saveGutachtenIndex(index);
  }
}

/** Save AI-improved Markdown (separate from user's currentMarkdown for side-by-side view) */
export function saveAiImprovedMarkdown(id: UUID, aiImprovedMarkdown: string): void {
  if (!isLocalStorageAvailable()) return;

  const completed = loadCompleted(id);
  if (!completed) {
    console.error(`Cannot save AI Markdown for ${id}: not found`);
    return;
  }

  completed.generatedText.aiImprovedMarkdown = aiImprovedMarkdown;
  completed.generatedText.aiImproved = true;
  completed.meta.updatedAt = Date.now();

  localStorage.setItem(`${STORAGE_KEYS.COMPLETED_PREFIX}${id}`, JSON.stringify(completed));

  // Update index timestamp
  const index = loadGutachtenIndex();
  const completedIndex = index.completed.findIndex((c) => c.id === id);
  if (completedIndex >= 0) {
    index.completed[completedIndex].updatedAt = completed.meta.updatedAt;
    saveGutachtenIndex(index);
  }
}

/** Accept AI improvement - copies aiImprovedMarkdown to currentMarkdown, clears aiImprovedMarkdown */
export function acceptAiImprovement(id: UUID): void {
  if (!isLocalStorageAvailable()) return;

  const completed = loadCompleted(id);
  if (!completed) {
    console.error(`Cannot accept AI for ${id}: not found`);
    return;
  }

  if (completed.generatedText.aiImprovedMarkdown) {
    completed.generatedText.currentMarkdown = completed.generatedText.aiImprovedMarkdown;
    completed.generatedText.aiImprovedMarkdown = null;
    completed.meta.updatedAt = Date.now();

    localStorage.setItem(`${STORAGE_KEYS.COMPLETED_PREFIX}${id}`, JSON.stringify(completed));

    // Update index timestamp
    const index = loadGutachtenIndex();
    const completedIndex = index.completed.findIndex((c) => c.id === id);
    if (completedIndex >= 0) {
      index.completed[completedIndex].updatedAt = completed.meta.updatedAt;
      saveGutachtenIndex(index);
    }
  }
}

/** Reject AI improvement - clears aiImprovedMarkdown only, keeps currentMarkdown */
export function rejectAiImprovement(id: UUID): void {
  if (!isLocalStorageAvailable()) return;

  const completed = loadCompleted(id);
  if (!completed) {
    console.error(`Cannot reject AI for ${id}: not found`);
    return;
  }

  completed.generatedText.aiImprovedMarkdown = null;
  completed.generatedText.aiImproved = false;
  completed.meta.updatedAt = Date.now();

  localStorage.setItem(`${STORAGE_KEYS.COMPLETED_PREFIX}${id}`, JSON.stringify(completed));

  // Update index timestamp
  const index = loadGutachtenIndex();
  const completedIndex = index.completed.findIndex((c) => c.id === id);
  if (completedIndex >= 0) {
    index.completed[completedIndex].updatedAt = completed.meta.updatedAt;
    saveGutachtenIndex(index);
  }
}

/** Delete a completed Gutachten */
export function deleteCompleted(id: UUID): void {
  if (!isLocalStorageAvailable()) return;

  // TODO: Future database migration
  // Replace with: await fetch(`/api/gutachten/${id}`, { method: 'DELETE' });

  localStorage.removeItem(`${STORAGE_KEYS.COMPLETED_PREFIX}${id}`);

  const index = loadGutachtenIndex();
  index.completed = index.completed.filter((c) => c.id !== id);
  saveGutachtenIndex(index);
}
