/**
 * localStorage-based Storage Adapter with Encryption
 *
 * Implements StorageAdapter for localStorage with client-side encryption.
 * All sensitive data is encrypted using AES-256-GCM before being stored.
 *
 * Architecture: Single key per gutachten with status as a field (matches Supabase).
 * Key format: gutachten-enc-{id}
 * Index is derived by scanning localStorage keys.
 *
 * Requires user to be logged in to fetch the encryption key from Clerk.
 */

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
import {
  encryptJson,
  decryptJson,
  type EncryptedPayload,
} from '../encryption/crypto';
import { getEncryptionKey } from '../encryption/key-manager';

/**
 * localStorage key prefix for local storage.
 * Single prefix - status is stored inside the data, not in the key.
 * Named 'local' to match the storage mode (not 'enc' which describes implementation).
 */
const STORAGE_KEYS = {
  PREFIX: 'gutachten-local-',
} as const;

/**
 * Unified storage format matching Supabase schema.
 * Single object per gutachten with status as a field.
 * This is the structure BEFORE encryption.
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
 * Check if localStorage is available in the current environment.
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
 * localStorage adapter with encryption.
 *
 * Usage:
 * ```typescript
 * const adapter = new LocalStorageAdapter();
 * await adapter.initialize(); // Fetches encryption key
 * const drafts = await adapter.loadIndex();
 * ```
 */
export class LocalStorageAdapter implements StorageAdapter {
  private encryptionKey: CryptoKey | null = null;
  private ready = false;

  // ============================================================================
  // Lifecycle
  // ============================================================================

  /**
   * Initialize the adapter by fetching the encryption key.
   * Must be called before any storage operations.
   */
  async initialize(): Promise<void> {
    // Fetch encryption key from API (requires user to be logged in)
    this.encryptionKey = await getEncryptionKey();
    this.ready = true;
  }

  isReady(): boolean {
    return this.ready && this.encryptionKey !== null;
  }

  getType(): StorageMode {
    return 'local';
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private ensureReady(): void {
    if (!this.isReady()) {
      throw new Error('LocalStorageAdapter not initialized. Call initialize() first.');
    }
  }

  private getKey(): CryptoKey {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available');
    }
    return this.encryptionKey;
  }

  /**
   * Encrypt and store data in localStorage.
   */
  private async encryptAndStore(key: string, data: LocalGutachtenRecord): Promise<void> {
    if (!isLocalStorageAvailable()) return;

    const encrypted = await encryptJson(data, this.getKey());
    localStorage.setItem(key, JSON.stringify(encrypted));
  }

  /**
   * Load and decrypt data from localStorage.
   */
  private async loadAndDecrypt(key: string): Promise<LocalGutachtenRecord | null> {
    if (!isLocalStorageAvailable()) return null;

    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const encrypted = JSON.parse(stored) as EncryptedPayload;
      return await decryptJson<LocalGutachtenRecord>(encrypted, this.getKey());
    } catch (error) {
      console.error(`Failed to load and decrypt ${key}:`, error);
      return null;
    }
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
      step3SubStep: record.data.wizardState?.step3CurrentSubStep ?? 1,
      step4SubStep: record.data.wizardState?.step4CurrentSubStep ?? 1,
      step5SubStep: record.data.wizardState?.step5CurrentSubStep ?? 1,
      step7SubStep: record.data.wizardState?.step7CurrentSubStep ?? 1,
    };
  }

  // ============================================================================
  // Index Operations - Derived from scanning localStorage keys
  // ============================================================================

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
      if (!key?.startsWith(STORAGE_KEYS.PREFIX)) continue;

      try {
        const record = await this.loadAndDecrypt(key);
        if (!record) continue;

        const meta = this.recordToMeta(record);
        if (record.status === 'draft') {
          drafts.push(meta);
        } else {
          completed.push(meta);
        }
      } catch (error) {
        console.error(`Failed to parse ${key}:`, error);
      }
    }

    // Sort by updated_at descending (most recent first)
    drafts.sort((a, b) => b.updatedAt - a.updatedAt);
    completed.sort((a, b) => b.updatedAt - a.updatedAt);

    return { drafts, completed };
  }

  // ============================================================================
  // Draft Operations
  // ============================================================================

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

    await this.encryptAndStore(`${STORAGE_KEYS.PREFIX}${id}`, record);

    return id;
  }

  async loadDraft(id: UUID): Promise<StoredGutachtenDraft | null> {
    this.ensureReady();

    const record = await this.loadAndDecrypt(`${STORAGE_KEYS.PREFIX}${id}`);
    if (!record || record.status !== 'draft') return null;

    return {
      meta: this.recordToMeta(record),
      formData: record.data.formData,
    };
  }

  async saveDraft(id: UUID, formData: Form, wizardState: WizardStateForSave): Promise<void> {
    this.ensureReady();

    const existing = await this.loadAndDecrypt(`${STORAGE_KEYS.PREFIX}${id}`);

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

    await this.encryptAndStore(`${STORAGE_KEYS.PREFIX}${id}`, record);
  }

  async deleteDraft(id: UUID): Promise<void> {
    this.ensureReady();

    if (!isLocalStorageAvailable()) return;

    localStorage.removeItem(`${STORAGE_KEYS.PREFIX}${id}`);
  }

  // ============================================================================
  // Completion Operations
  // ============================================================================

  async completeDraft(id: UUID, originalStructure: AssessmentStructure): Promise<void> {
    this.ensureReady();

    const existing = await this.loadAndDecrypt(`${STORAGE_KEYS.PREFIX}${id}`);
    if (!existing || existing.status !== 'draft') {
      console.error(`Cannot complete draft ${id}: not found or not a draft`);
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
    await this.encryptAndStore(`${STORAGE_KEYS.PREFIX}${id}`, record);
  }

  async loadCompleted(id: UUID): Promise<StoredGutachtenCompleted | null> {
    this.ensureReady();

    const record = await this.loadAndDecrypt(`${STORAGE_KEYS.PREFIX}${id}`);
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

    const record = await this.loadAndDecrypt(`${STORAGE_KEYS.PREFIX}${id}`);
    if (!record || record.status !== 'completed') {
      console.error(`Cannot update completed ${id}: not found`);
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

    await this.encryptAndStore(`${STORAGE_KEYS.PREFIX}${id}`, updatedRecord);
  }

  async revertCompletedToOriginal(id: UUID): Promise<void> {
    this.ensureReady();

    const record = await this.loadAndDecrypt(`${STORAGE_KEYS.PREFIX}${id}`);
    if (!record || record.status !== 'completed') {
      console.error(`Cannot revert completed ${id}: not found`);
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

    await this.encryptAndStore(`${STORAGE_KEYS.PREFIX}${id}`, updatedRecord);
  }

  async saveAiImprovedMarkdown(id: UUID, aiImprovedMarkdown: string): Promise<void> {
    this.ensureReady();

    const record = await this.loadAndDecrypt(`${STORAGE_KEYS.PREFIX}${id}`);
    if (!record || record.status !== 'completed') {
      console.error(`Cannot save AI Markdown for ${id}: not found`);
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

    await this.encryptAndStore(`${STORAGE_KEYS.PREFIX}${id}`, updatedRecord);
  }

  async acceptAiImprovement(id: UUID): Promise<void> {
    this.ensureReady();

    const record = await this.loadAndDecrypt(`${STORAGE_KEYS.PREFIX}${id}`);
    if (!record || record.status !== 'completed') {
      console.error(`Cannot accept AI for ${id}: not found`);
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

      await this.encryptAndStore(`${STORAGE_KEYS.PREFIX}${id}`, updatedRecord);
    }
  }

  async rejectAiImprovement(id: UUID): Promise<void> {
    this.ensureReady();

    const record = await this.loadAndDecrypt(`${STORAGE_KEYS.PREFIX}${id}`);
    if (!record || record.status !== 'completed') {
      console.error(`Cannot reject AI for ${id}: not found`);
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

    await this.encryptAndStore(`${STORAGE_KEYS.PREFIX}${id}`, updatedRecord);
  }

  async revertToOriginalAiMarkdown(id: UUID): Promise<void> {
    this.ensureReady();

    const record = await this.loadAndDecrypt(`${STORAGE_KEYS.PREFIX}${id}`);
    if (!record || record.status !== 'completed') {
      console.error(`Cannot revert AI for ${id}: not found`);
      return;
    }

    if (!record.data.generatedText?.originalAiMarkdown) {
      console.error(`Cannot revert AI for ${id}: no original AI markdown`);
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

    await this.encryptAndStore(`${STORAGE_KEYS.PREFIX}${id}`, updatedRecord);
  }

  async updateAiImprovedMarkdown(id: UUID, aiImprovedMarkdown: string): Promise<void> {
    this.ensureReady();

    const record = await this.loadAndDecrypt(`${STORAGE_KEYS.PREFIX}${id}`);
    if (!record || record.status !== 'completed') {
      console.error(`Cannot update AI Markdown for ${id}: not found`);
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

    await this.encryptAndStore(`${STORAGE_KEYS.PREFIX}${id}`, updatedRecord);
  }

  async deleteCompleted(id: UUID): Promise<void> {
    this.ensureReady();

    if (!isLocalStorageAvailable()) return;

    localStorage.removeItem(`${STORAGE_KEYS.PREFIX}${id}`);
  }
}
