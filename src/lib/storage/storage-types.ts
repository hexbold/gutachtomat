import type { Form, AssessmentStructure } from '@/lib/core/form-types';

/** Schema version for migration handling - increment when storage structure changes */
export const STORAGE_SCHEMA_VERSION = 3;

/** Branded type for UUID - provides compile-time safety */
export type UUID = string & { readonly __brand: 'UUID' };

/** Helper to create UUID from uuidv4() result */
export function createUUID(value: string): UUID {
  return value as UUID;
}

/** Status of a Gutachten */
export enum GutachtenStatus {
  Draft = 'draft',
  Completed = 'completed',
}

/** Metadata for a stored Gutachten (used in index for list display) */
export interface StoredGutachtenMeta {
  id: UUID;
  status: GutachtenStatus;
  patientenchiffre: string | null;
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
  wizardStep: number;
  step3SubStep: number;
  step4SubStep: number;
  step5SubStep: number;
  step7SubStep: number;
}

/** Complete stored Gutachten draft (schemaVersion is stored in DB, not here) */
export interface StoredGutachtenDraft {
  meta: StoredGutachtenMeta;
  formData: Form;
}

/**
 * Completed Gutachten with generated text.
 * schemaVersion is stored in DB, not here.
 *
 * Design (Phase 7):
 * - aiImprovedMarkdown is the current AI suggestion (can be edited)
 * - originalAiMarkdown preserves original AI output for revert
 * - aiEdited tracks if user has edited the AI text
 */
export interface StoredGutachtenCompleted {
  meta: StoredGutachtenMeta;
  formData: Form;
  generatedText: {
    /** JSON structure from text generation (immutable) */
    originalStructure?: AssessmentStructure;
    /** Markdown after user edits in MDXEditor (null = not edited yet) */
    currentMarkdown?: string | null;
    /** Flag indicating AI improvement has been applied */
    aiImproved?: boolean;
    /** AI-generated Markdown - current AI suggestion in comparison view */
    aiImprovedMarkdown?: string | null;
    /** Original AI output preserved for revert functionality */
    originalAiMarkdown?: string | null;
    /** Flag indicating user has edited the AI text */
    aiEdited?: boolean;
  };
}

/** Index of all stored Gutachten (lightweight for list display) */
export interface GutachtenIndex {
  drafts: StoredGutachtenMeta[];
  completed: StoredGutachtenMeta[];
}

/** localStorage key constants */
export const STORAGE_KEYS = {
  INDEX: 'gutachten-index',
  DRAFT_PREFIX: 'gutachten-draft-',
  COMPLETED_PREFIX: 'gutachten-completed-',
} as const;
