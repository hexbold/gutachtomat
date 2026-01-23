/**
 * ============================================================================
 * DEVELOPMENT ONLY - DO NOT USE IN PRODUCTION
 * ============================================================================
 *
 * Unencrypted localStorage adapter for local development without authentication.
 * This adapter stores data WITHOUT encryption and should NEVER be used in production.
 *
 * Use case: "Anmelden (Dev Mode)" button in development environment
 * when user is NOT logged in via Clerk.
 *
 * Architecture: Single key per gutachten with status as a field (matches Supabase).
 * Key format: gutachten-dev-{id}
 * Index is derived by scanning localStorage keys.
 *
 * See: docs/important-infos/security/storage-auth-modes.md
 * ============================================================================
 */

// ============================================================================
// RUNTIME GUARD: Prevent import in production
// ============================================================================
if (process.env.NODE_ENV === 'production') {
  throw new Error(
    'UnencryptedDevAdapter cannot be imported in production! ' +
    'This adapter is for development use only.'
  );
}

import type { Form, AssessmentStructure } from '@/lib/core/form-types';
import { initialFormState } from '@/lib/core/form-types';
import type { StorageAdapter, StorageMode, WizardStateForSave } from '../storage-interface';
import {
  StoredGutachtenDraft,
  StoredGutachtenCompleted,
  StoredGutachtenMeta,
  GutachtenIndex,
  GutachtenStatus,
  UUID,
  createUUID,
} from '../storage-types';

/**
 * localStorage key prefix for DEV storage.
 * Single prefix - status is stored inside the data, not in the key.
 */
const DEV_STORAGE_KEYS = {
  PREFIX: 'gutachten-dev-',
} as const;

/**
 * Unified storage format matching Supabase schema.
 * Single object per gutachten with status as a field.
 *
 * Design (Phase 7):
 * - aiImprovedMarkdown is the current AI suggestion (can be edited)
 * - originalAiMarkdown preserves original AI output for revert
 * - aiEdited tracks if user has edited the AI text
 */
interface LocalGutachtenRecord {
  id: string;
  status: 'draft' | 'completed';
  wizard_step: number;
  created_at: number;
  updated_at: number;
  patientenchiffre: string | null;
  data: {
    formData: Form;
    wizardState: WizardStateForSave;
    generatedText?: {
      originalStructure?: AssessmentStructure;
      currentMarkdown?: string | null;
      aiImproved?: boolean;
      aiImprovedMarkdown?: string | null;
      originalAiMarkdown?: string | null;
      aiEdited?: boolean;
    };
  };
}

/**
 * Check if localStorage is available
 */
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

/**
 * ============================================================================
 * UnencryptedDevAdapter
 * ============================================================================
 *
 * DEVELOPMENT ONLY adapter that stores data in localStorage WITHOUT encryption.
 * Used only when:
 * - NODE_ENV === 'development'
 * - User is NOT authenticated via Clerk
 * - User clicked "Anmelden (Dev Mode)" button
 */
export class UnencryptedDevAdapter implements StorageAdapter {
  private ready = false;

  // ==========================================================================
  // Lifecycle
  // ==========================================================================

  async initialize(): Promise<void> {
    // No encryption key needed - just mark as ready
    this.ready = true;
  }

  isReady(): boolean {
    return this.ready;
  }

  getType(): StorageMode {
    return 'local';
  }

  // ==========================================================================
  // Helper Methods
  // ==========================================================================

  private ensureReady(): void {
    if (!this.isReady()) {
      throw new Error('UnencryptedDevAdapter not initialized. Call initialize() first.');
    }
  }

  private store<T>(key: string, data: T): void {
    if (!isLocalStorageAvailable()) return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  private load<T>(key: string): T | null {
    if (!isLocalStorageAvailable()) return null;
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      return JSON.parse(stored) as T;
    } catch (error) {
      console.error(`[DEV] Failed to load ${key}:`, error);
      return null;
    }
  }

  /**
   * Check if a record matches the expected LocalGutachtenRecord format.
   * Returns false for legacy/invalid data that should be skipped.
   */
  private isValidRecord(record: unknown): record is LocalGutachtenRecord {
    if (!record || typeof record !== 'object') return false;
    const r = record as Record<string, unknown>;
    return (
      typeof r.id === 'string' &&
      (r.status === 'draft' || r.status === 'completed') &&
      typeof r.data === 'object' &&
      r.data !== null
    );
  }

  /**
   * Convert a LocalGutachtenRecord to StoredGutachtenMeta.
   */
  private recordToMeta(record: LocalGutachtenRecord): StoredGutachtenMeta {
    return {
      id: createUUID(record.id),
      status: record.status === 'completed' ? GutachtenStatus.Completed : GutachtenStatus.Draft,
      patientenchiffre: record.patientenchiffre,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      wizardStep: record.wizard_step,
      step3SubStep: record.data?.wizardState?.step3CurrentSubStep ?? 1,
      step4SubStep: record.data?.wizardState?.step4CurrentSubStep ?? 1,
      step5SubStep: record.data?.wizardState?.step5CurrentSubStep ?? 1,
      step7SubStep: record.data?.wizardState?.step7CurrentSubStep ?? 1,
    };
  }

  // ==========================================================================
  // Index Operations - Derived from scanning localStorage keys
  // ==========================================================================

  async loadIndex(): Promise<GutachtenIndex> {
    this.ensureReady();

    if (!isLocalStorageAvailable()) {
      return { drafts: [], completed: [] };
    }

    const drafts: StoredGutachtenMeta[] = [];
    const completed: StoredGutachtenMeta[] = [];

    // Scan all localStorage keys to build index
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(DEV_STORAGE_KEYS.PREFIX)) continue;

      try {
        const record = this.load<unknown>(key);

        // Skip invalid/legacy records that don't match expected format
        if (!this.isValidRecord(record)) {
          console.warn(`[DEV] Skipping invalid/legacy record: ${key}`);
          continue;
        }

        const meta = this.recordToMeta(record);
        if (record.status === 'draft') {
          drafts.push(meta);
        } else {
          completed.push(meta);
        }
      } catch (error) {
        console.error(`[DEV] Failed to parse ${key}:`, error);
      }
    }

    // Sort by updated_at descending (most recent first)
    drafts.sort((a, b) => b.updatedAt - a.updatedAt);
    completed.sort((a, b) => b.updatedAt - a.updatedAt);

    return { drafts, completed };
  }

  // ==========================================================================
  // Draft Operations
  // ==========================================================================

  async createDraft(): Promise<UUID> {
    this.ensureReady();

    const id = createUUID(crypto.randomUUID());
    const now = Date.now();

    const record: LocalGutachtenRecord = {
      id,
      status: 'draft',
      wizard_step: 1,
      created_at: now,
      updated_at: now,
      patientenchiffre: null,
      data: {
        formData: initialFormState.formData,
        wizardState: {
          currentStep: 1,
          step3CurrentSubStep: 1,
          step4CurrentSubStep: 1,
          step5CurrentSubStep: 1,
          step7CurrentSubStep: 1,
        },
      },
    };

    this.store(`${DEV_STORAGE_KEYS.PREFIX}${id}`, record);

    return id;
  }

  async loadDraft(id: UUID): Promise<StoredGutachtenDraft | null> {
    this.ensureReady();

    const record = this.load<LocalGutachtenRecord>(`${DEV_STORAGE_KEYS.PREFIX}${id}`);
    if (!record || record.status !== 'draft') return null;

    return {
      meta: this.recordToMeta(record),
      formData: record.data.formData,
    };
  }

  async saveDraft(id: UUID, formData: Form, wizardState: WizardStateForSave): Promise<void> {
    this.ensureReady();

    const existing = this.load<LocalGutachtenRecord>(`${DEV_STORAGE_KEYS.PREFIX}${id}`);

    // Don't save if it's already completed
    if (existing?.status === 'completed') return;

    const record: LocalGutachtenRecord = {
      id,
      status: 'draft',
      wizard_step: wizardState.currentStep,
      created_at: existing?.created_at ?? Date.now(),
      updated_at: Date.now(),
      patientenchiffre: formData.patientenchiffre,
      data: {
        formData,
        wizardState,
      },
    };

    this.store(`${DEV_STORAGE_KEYS.PREFIX}${id}`, record);
  }

  async deleteDraft(id: UUID): Promise<void> {
    this.ensureReady();

    if (!isLocalStorageAvailable()) return;

    localStorage.removeItem(`${DEV_STORAGE_KEYS.PREFIX}${id}`);
  }

  // ==========================================================================
  // Completion Operations
  // ==========================================================================

  async completeDraft(id: UUID, originalStructure: AssessmentStructure): Promise<void> {
    this.ensureReady();

    const existing = this.load<LocalGutachtenRecord>(`${DEV_STORAGE_KEYS.PREFIX}${id}`);
    if (!existing || existing.status !== 'draft') {
      console.error(`[DEV] Cannot complete draft ${id}: not found or not a draft`);
      return;
    }

    const record: LocalGutachtenRecord = {
      ...existing,
      status: 'completed',
      updated_at: Date.now(),
      data: {
        ...existing.data,
        generatedText: {
          originalStructure,
          currentMarkdown: null,
        },
      },
    };

    // Same key, just update the status field
    this.store(`${DEV_STORAGE_KEYS.PREFIX}${id}`, record);
  }

  async loadCompleted(id: UUID): Promise<StoredGutachtenCompleted | null> {
    this.ensureReady();

    const record = this.load<LocalGutachtenRecord>(`${DEV_STORAGE_KEYS.PREFIX}${id}`);
    if (!record || record.status !== 'completed') return null;

    return {
      meta: this.recordToMeta(record),
      formData: record.data.formData,
      generatedText: record.data.generatedText || {},
    };
  }

  async updateCompletedMarkdown(
    id: UUID,
    currentMarkdown: string,
    aiImproved?: boolean
  ): Promise<void> {
    this.ensureReady();

    const record = this.load<LocalGutachtenRecord>(`${DEV_STORAGE_KEYS.PREFIX}${id}`);
    if (!record || record.status !== 'completed') {
      console.error(`[DEV] Cannot update completed ${id}: not found`);
      return;
    }

    const updatedRecord: LocalGutachtenRecord = {
      ...record,
      updated_at: Date.now(),
      data: {
        ...record.data,
        generatedText: {
          ...record.data.generatedText,
          currentMarkdown,
          aiImproved: aiImproved ?? record.data.generatedText?.aiImproved,
        },
      },
    };

    this.store(`${DEV_STORAGE_KEYS.PREFIX}${id}`, updatedRecord);
  }

  async revertCompletedToOriginal(id: UUID): Promise<void> {
    this.ensureReady();

    const record = this.load<LocalGutachtenRecord>(`${DEV_STORAGE_KEYS.PREFIX}${id}`);
    if (!record || record.status !== 'completed') {
      console.error(`[DEV] Cannot revert completed ${id}: not found`);
      return;
    }

    const updatedRecord: LocalGutachtenRecord = {
      ...record,
      updated_at: Date.now(),
      data: {
        ...record.data,
        generatedText: {
          originalStructure: record.data.generatedText?.originalStructure,
          currentMarkdown: null,
          aiImproved: false,
          aiImprovedMarkdown: null,
          originalAiMarkdown: null,
          aiEdited: false,
        },
      },
    };

    this.store(`${DEV_STORAGE_KEYS.PREFIX}${id}`, updatedRecord);
  }

  async saveAiImprovedMarkdown(id: UUID, aiImprovedMarkdown: string): Promise<void> {
    this.ensureReady();

    const record = this.load<LocalGutachtenRecord>(`${DEV_STORAGE_KEYS.PREFIX}${id}`);
    if (!record || record.status !== 'completed') {
      console.error(`[DEV] Cannot save AI Markdown for ${id}: not found`);
      return;
    }

    const updatedRecord: LocalGutachtenRecord = {
      ...record,
      updated_at: Date.now(),
      data: {
        ...record.data,
        generatedText: {
          ...record.data.generatedText,
          aiImprovedMarkdown,
          aiImproved: true,
          // Track original AI output on first save (for revert functionality)
          originalAiMarkdown: record.data.generatedText?.originalAiMarkdown ?? aiImprovedMarkdown,
          aiEdited: false,  // Reset when new AI is generated
        },
      },
    };

    this.store(`${DEV_STORAGE_KEYS.PREFIX}${id}`, updatedRecord);
  }

  async acceptAiImprovement(id: UUID): Promise<void> {
    this.ensureReady();

    const record = this.load<LocalGutachtenRecord>(`${DEV_STORAGE_KEYS.PREFIX}${id}`);
    if (!record || record.status !== 'completed') {
      console.error(`[DEV] Cannot accept AI for ${id}: not found`);
      return;
    }

    if (record.data.generatedText?.aiImprovedMarkdown) {
      const updatedRecord: LocalGutachtenRecord = {
        ...record,
        updated_at: Date.now(),
        data: {
          ...record.data,
          generatedText: {
            ...record.data.generatedText,
            currentMarkdown: record.data.generatedText.aiImprovedMarkdown,
            aiImprovedMarkdown: null,
            // Clear tracking fields after accepting
            originalAiMarkdown: null,
            aiEdited: false,
          },
        },
      };

      this.store(`${DEV_STORAGE_KEYS.PREFIX}${id}`, updatedRecord);
    }
  }

  async rejectAiImprovement(id: UUID): Promise<void> {
    this.ensureReady();

    const record = this.load<LocalGutachtenRecord>(`${DEV_STORAGE_KEYS.PREFIX}${id}`);
    if (!record || record.status !== 'completed') {
      console.error(`[DEV] Cannot reject AI for ${id}: not found`);
      return;
    }

    const updatedRecord: LocalGutachtenRecord = {
      ...record,
      updated_at: Date.now(),
      data: {
        ...record.data,
        generatedText: {
          ...record.data.generatedText,
          aiImprovedMarkdown: null,
          aiImproved: false,
          // Clear tracking fields after rejecting
          originalAiMarkdown: null,
          aiEdited: false,
        },
      },
    };

    this.store(`${DEV_STORAGE_KEYS.PREFIX}${id}`, updatedRecord);
  }

  async revertToOriginalAiMarkdown(id: UUID): Promise<void> {
    this.ensureReady();

    const record = this.load<LocalGutachtenRecord>(`${DEV_STORAGE_KEYS.PREFIX}${id}`);
    if (!record || record.status !== 'completed') {
      console.error(`[DEV] Cannot revert AI for ${id}: not found`);
      return;
    }

    if (!record.data.generatedText?.originalAiMarkdown) {
      console.error(`[DEV] Cannot revert AI for ${id}: no original AI markdown`);
      return;
    }

    const updatedRecord: LocalGutachtenRecord = {
      ...record,
      updated_at: Date.now(),
      data: {
        ...record.data,
        generatedText: {
          ...record.data.generatedText,
          aiImprovedMarkdown: record.data.generatedText.originalAiMarkdown,
          aiEdited: false,
        },
      },
    };

    this.store(`${DEV_STORAGE_KEYS.PREFIX}${id}`, updatedRecord);
  }

  async updateAiImprovedMarkdown(id: UUID, aiImprovedMarkdown: string): Promise<void> {
    this.ensureReady();

    const record = this.load<LocalGutachtenRecord>(`${DEV_STORAGE_KEYS.PREFIX}${id}`);
    if (!record || record.status !== 'completed') {
      console.error(`[DEV] Cannot update AI Markdown for ${id}: not found`);
      return;
    }

    const updatedRecord: LocalGutachtenRecord = {
      ...record,
      updated_at: Date.now(),
      data: {
        ...record.data,
        generatedText: {
          ...record.data.generatedText,
          aiImprovedMarkdown,
          aiEdited: true,  // Mark as edited by user
        },
      },
    };

    this.store(`${DEV_STORAGE_KEYS.PREFIX}${id}`, updatedRecord);
  }

  async deleteCompleted(id: UUID): Promise<void> {
    this.ensureReady();

    if (!isLocalStorageAvailable()) return;

    localStorage.removeItem(`${DEV_STORAGE_KEYS.PREFIX}${id}`);
  }
}
