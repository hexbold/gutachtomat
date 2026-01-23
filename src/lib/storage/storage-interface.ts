import type { Form, AssessmentStructure } from '@/lib/core/form-types';
import type {
  UUID,
  GutachtenIndex,
  StoredGutachtenDraft,
  StoredGutachtenCompleted,
} from './storage-types';

/**
 * Wizard state required for saving draft progress.
 * Exported from here for use by adapters and consumers.
 */
export interface WizardStateForSave {
  currentStep: number;
  step3CurrentSubStep: number;
  step4CurrentSubStep: number;
  step5CurrentSubStep: number;
  step7CurrentSubStep: number;
}

/**
 * Storage adapter interface - implemented by localStorage and Supabase adapters.
 *
 * All methods are async for consistency:
 * - LocalStorageAdapter wraps sync calls in Promise.resolve()
 * - SupabaseAdapter makes async network calls
 *
 * Consumers should use the StorageContext/useStorage hook to access the adapter.
 */
export interface StorageAdapter {
  // ============================================================================
  // Lifecycle
  // ============================================================================

  /**
   * Initialize the adapter (e.g., fetch encryption key for Supabase).
   * Must be called before other methods.
   */
  initialize(): Promise<void>;

  /**
   * Check if the adapter is ready to use.
   */
  isReady(): boolean;

  /**
   * Get the adapter type for debugging/display purposes.
   */
  getType(): StorageMode;

  // ============================================================================
  // Index Operations
  // ============================================================================

  /**
   * Load the index of all Gutachten (drafts and completed).
   * Used for dashboard listing.
   */
  loadIndex(): Promise<GutachtenIndex>;

  // ============================================================================
  // Draft Operations
  // ============================================================================

  /**
   * Create a new draft Gutachten.
   * @returns The UUID of the newly created draft.
   */
  createDraft(): Promise<UUID>;

  /**
   * Load a draft by ID.
   * @returns The draft, or null if not found.
   */
  loadDraft(id: UUID): Promise<StoredGutachtenDraft | null>;

  /**
   * Save/update a draft with current form data and wizard state.
   */
  saveDraft(id: UUID, formData: Form, wizardState: WizardStateForSave): Promise<void>;

  /**
   * Delete a draft permanently.
   */
  deleteDraft(id: UUID): Promise<void>;

  // ============================================================================
  // Completion Operations
  // ============================================================================

  /**
   * Complete a draft - moves it to completed status with generated text.
   * @param id The draft ID to complete.
   * @param originalStructure The generated assessment structure (JSON).
   */
  completeDraft(id: UUID, originalStructure: AssessmentStructure): Promise<void>;

  /**
   * Load a completed Gutachten by ID.
   * @returns The completed Gutachten, or null if not found.
   */
  loadCompleted(id: UUID): Promise<StoredGutachtenCompleted | null>;

  /**
   * Update the Markdown content after user edits in MDXEditor.
   * @param id The completed Gutachten ID.
   * @param currentMarkdown The updated Markdown content.
   * @param aiImproved Optional flag indicating if AI improvement was applied.
   */
  updateCompletedMarkdown(
    id: UUID,
    currentMarkdown: string,
    aiImproved?: boolean
  ): Promise<void>;

  /**
   * Revert a completed Gutachten to its original generated state.
   * Clears user edits and AI improvements.
   */
  revertCompletedToOriginal(id: UUID): Promise<void>;

  /**
   * Save AI-improved Markdown (temporary, for side-by-side comparison view).
   * This is cleared when user accepts or rejects the AI suggestion.
   */
  saveAiImprovedMarkdown(id: UUID, aiImprovedMarkdown: string): Promise<void>;

  /**
   * Accept AI improvement - copies aiImprovedMarkdown to currentMarkdown,
   * then clears aiImprovedMarkdown.
   */
  acceptAiImprovement(id: UUID): Promise<void>;

  /**
   * Reject AI improvement - clears aiImprovedMarkdown only.
   */
  rejectAiImprovement(id: UUID): Promise<void>;

  /**
   * Revert AI-improved text to its original AI-generated state.
   * Restores aiImprovedMarkdown from originalAiMarkdown.
   * Only applicable when aiEdited = true.
   */
  revertToOriginalAiMarkdown(id: UUID): Promise<void>;

  /**
   * Update the AI-improved markdown after user edits.
   * Sets aiEdited = true to track that user has modified the AI text.
   * @param id The completed Gutachten ID.
   * @param aiImprovedMarkdown The edited AI markdown content.
   */
  updateAiImprovedMarkdown(id: UUID, aiImprovedMarkdown: string): Promise<void>;

  /**
   * Delete a completed Gutachten permanently.
   */
  deleteCompleted(id: UUID): Promise<void>;
}

/**
 * Storage mode - determines which adapter to use.
 */
export type StorageMode = 'local' | 'supabase';
