/**
 * Supabase Storage Adapter
 *
 * Implements StorageAdapter for Supabase with client-side encryption.
 * Uses Clerk session tokens for RLS authentication.
 *
 * All sensitive data (form data, generated text, patient chiffre) is
 * encrypted client-side using AES-256-GCM before being stored in Supabase.
 */

import type { Form, AssessmentStructure } from '@/lib/core/form-types';
import { initialFormState } from '@/lib/core/form-types';
import type { StorageAdapter, StorageMode, WizardStateForSave } from '../storage-interface';
import type {
  UUID,
  GutachtenIndex,
  StoredGutachtenDraft,
  StoredGutachtenCompleted,
  StoredGutachtenMeta,
} from '../storage-types';
import { createUUID, GutachtenStatus } from '../storage-types';
import type { Database, GutachtenRow } from '@/lib/supabase/database.types';
import {
  encrypt,
  decrypt,
  encryptJson,
  decryptJson,
  type EncryptedPayload,
} from '../encryption/crypto';
import { getEncryptionKey } from '../encryption/key-manager';
import { createClerkSupabaseClient } from '@/lib/supabase/client';

/**
 * Clerk session interface for token generation.
 */
interface ClerkSession {
  getToken(options?: { template?: string }): Promise<string | null>;
}

/**
 * Data structure stored in encrypted_data field.
 * Contains all sensitive information about a Gutachten.
 *
 * Design (Phase 7):
 * - aiImprovedMarkdown is the current AI suggestion (can be edited)
 * - originalAiMarkdown preserves original AI output for revert
 * - aiEdited tracks if user has edited the AI text
 */
interface EncryptedGutachtenData {
  formData: Form;
  wizardState: WizardStateForSave;
  // For completed gutachten
  generatedText?: {
    originalStructure?: AssessmentStructure;
    currentMarkdown?: string | null;
    aiImproved?: boolean;
    aiImprovedMarkdown?: string | null;
    originalAiMarkdown?: string | null;
    aiEdited?: boolean;
  };
}

/**
 * Supabase adapter for storage operations.
 *
 * Requires initialization before use:
 * 1. Set Clerk session via setSession()
 * 2. Call initialize() to fetch encryption key
 *
 * The adapter creates a fresh Supabase client for each operation to ensure
 * the JWT token is always valid (Clerk tokens expire after ~60 seconds).
 *
 * Usage:
 * ```typescript
 * const adapter = new SupabaseAdapter();
 * adapter.setSession(clerkSession);
 * adapter.setUserId(userId);
 * await adapter.initialize();
 * const drafts = await adapter.loadIndex();
 * ```
 */
export class SupabaseAdapter implements StorageAdapter {
  private session: ClerkSession | null = null;
  private encryptionKey: CryptoKey | null = null;
  private ready = false;
  private userId: string | null = null;

  /**
   * Set the Clerk session (must be called before initialize).
   * The session is used to get fresh tokens for each operation.
   */
  setSession(session: ClerkSession): void {
    this.session = session;
  }

  /**
   * Set the user ID (from Clerk session).
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Initialize the adapter by fetching the encryption key.
   */
  async initialize(): Promise<void> {
    if (!this.session) {
      throw new Error('Clerk session not set. Call setSession() first.');
    }

    // Fetch encryption key from API
    this.encryptionKey = await getEncryptionKey();
    this.ready = true;
  }

  /**
   * Check if adapter is ready to use.
   */
  isReady(): boolean {
    return this.ready && this.session !== null && this.encryptionKey !== null;
  }

  /**
   * Get the adapter type.
   */
  getType(): StorageMode {
    return 'supabase';
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private ensureReady(): void {
    if (!this.isReady()) {
      throw new Error('SupabaseAdapter not initialized. Call initialize() first.');
    }
  }

  /**
   * Get a fresh Supabase client with a fresh JWT token.
   * This ensures the token is always valid, even after long operations.
   */
  private async getClient() {
    if (!this.session) {
      throw new Error('Clerk session not set.');
    }
    return createClerkSupabaseClient(this.session);
  }

  private getKey(): CryptoKey {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not loaded.');
    }
    return this.encryptionKey;
  }

  /**
   * Encrypt the patient chiffre separately for fast list display.
   */
  private async encryptChiffre(chiffre: string | null): Promise<{ encrypted: string | null; iv: string | null }> {
    if (!chiffre) return { encrypted: null, iv: null };
    const payload = await encrypt(chiffre, this.getKey());
    return { encrypted: payload.ciphertext, iv: payload.iv };
  }

  /**
   * Decrypt the patient chiffre.
   */
  private async decryptChiffre(encrypted: string | null, iv: string | null): Promise<string | null> {
    if (!encrypted || !iv) return null;
    const payload: EncryptedPayload = { ciphertext: encrypted, iv };
    return decrypt(payload, this.getKey());
  }

  /**
   * Encrypt the full gutachten data.
   */
  private async encryptData(data: EncryptedGutachtenData): Promise<{ encrypted: string; iv: string }> {
    const payload = await encryptJson(data, this.getKey());
    return { encrypted: payload.ciphertext, iv: payload.iv };
  }

  /**
   * Decrypt the full gutachten data.
   */
  private async decryptData(encrypted: string, iv: string): Promise<EncryptedGutachtenData> {
    const payload: EncryptedPayload = { ciphertext: encrypted, iv };
    return decryptJson<EncryptedGutachtenData>(payload, this.getKey());
  }

  /**
   * Convert a database row to StoredGutachtenMeta.
   */
  private async rowToMeta(row: GutachtenRow): Promise<StoredGutachtenMeta> {
    const chiffre = await this.decryptChiffre(row.encrypted_chiffre, row.encrypted_chiffre_iv);
    return {
      id: createUUID(row.id),
      status: row.status === 'completed' ? GutachtenStatus.Completed : GutachtenStatus.Draft,
      patientenchiffre: chiffre,
      createdAt: new Date(row.created_at).getTime(),
      updatedAt: new Date(row.updated_at).getTime(),
      wizardStep: row.wizard_step,
      // These will be updated when loading full data
      step3SubStep: 0,
      step4SubStep: 0,
      step5SubStep: 0,
      step7SubStep: 0,
    };
  }

  // ============================================================================
  // Index Operations
  // ============================================================================

  async loadIndex(): Promise<GutachtenIndex> {
    this.ensureReady();

    const client = await this.getClient();
    const { data, error } = await client
      .from('gutachten')
      .select('id, user_id, status, wizard_step, created_at, updated_at, encrypted_chiffre, encrypted_chiffre_iv')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading gutachten index:', error);
      throw new Error(`Failed to load index: ${error.message}`);
    }

    const drafts: StoredGutachtenMeta[] = [];
    const completed: StoredGutachtenMeta[] = [];

    for (const row of data || []) {
      const meta = await this.rowToMeta(row as GutachtenRow);
      if (meta.status === GutachtenStatus.Draft) {
        drafts.push(meta);
      } else {
        completed.push(meta);
      }
    }

    return {
      drafts,
      completed,
    };
  }

  // ============================================================================
  // Draft Operations
  // ============================================================================

  async createDraft(): Promise<UUID> {
    this.ensureReady();

    if (!this.userId) {
      throw new Error('User ID not set. Call setUserId() first.');
    }

    const client = await this.getClient();
    const { data, error } = await client
      .from('gutachten')
      .insert({
        user_id: this.userId,
        status: 'draft',
        wizard_step: 1,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating draft:', error);
      throw new Error(`Failed to create draft: ${error.message}`);
    }

    return createUUID(data.id);
  }

  async loadDraft(id: UUID): Promise<StoredGutachtenDraft | null> {
    this.ensureReady();

    const client = await this.getClient();
    const { data, error } = await client
      .from('gutachten')
      .select('*')
      .eq('id', id)
      .eq('status', 'draft')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error loading draft:', error);
      throw new Error(`Failed to load draft: ${error.message}`);
    }

    if (!data.encrypted_data || !data.encrypted_data_iv) {
      // New draft with no data yet - return with initial form state
      const meta = await this.rowToMeta(data as GutachtenRow);
      return {
        meta,
        formData: initialFormState.formData,
      };
    }

    const encryptedData = await this.decryptData(data.encrypted_data, data.encrypted_data_iv);
    const meta = await this.rowToMeta(data as GutachtenRow);

    // Update meta with wizard state from encrypted data
    meta.step3SubStep = encryptedData.wizardState?.step3CurrentSubStep ?? 0;
    meta.step4SubStep = encryptedData.wizardState?.step4CurrentSubStep ?? 0;
    meta.step5SubStep = encryptedData.wizardState?.step5CurrentSubStep ?? 0;
    meta.step7SubStep = encryptedData.wizardState?.step7CurrentSubStep ?? 0;

    return {
      meta,
      formData: encryptedData.formData,
    };
  }

  async saveDraft(id: UUID, formData: Form, wizardState: WizardStateForSave): Promise<void> {
    this.ensureReady();

    // Encrypt the patient chiffre separately for list display
    const chiffreEncrypted = await this.encryptChiffre(formData.patientenchiffre || null);

    // Encrypt the full data
    const dataToEncrypt: EncryptedGutachtenData = {
      formData,
      wizardState,
    };
    const dataEncrypted = await this.encryptData(dataToEncrypt);

    const client = await this.getClient();
    const { error } = await client
      .from('gutachten')
      .update({
        wizard_step: wizardState.currentStep,
        encrypted_chiffre: chiffreEncrypted.encrypted,
        encrypted_chiffre_iv: chiffreEncrypted.iv,
        encrypted_data: dataEncrypted.encrypted,
        encrypted_data_iv: dataEncrypted.iv,
      })
      .eq('id', id)
      .eq('status', 'draft');

    if (error) {
      console.error('Error saving draft:', error);
      throw new Error(`Failed to save draft: ${error.message}`);
    }
  }

  async deleteDraft(id: UUID): Promise<void> {
    this.ensureReady();

    const client = await this.getClient();
    const { error } = await client
      .from('gutachten')
      .delete()
      .eq('id', id)
      .eq('status', 'draft');

    if (error) {
      console.error('Error deleting draft:', error);
      throw new Error(`Failed to delete draft: ${error.message}`);
    }
  }

  // ============================================================================
  // Completion Operations
  // ============================================================================

  async completeDraft(id: UUID, originalStructure: AssessmentStructure): Promise<void> {
    this.ensureReady();

    // First, load the current draft data
    const draft = await this.loadDraft(id);
    if (!draft) {
      throw new Error(`Draft ${id} not found.`);
    }

    // Create the completed data structure
    const dataToEncrypt: EncryptedGutachtenData = {
      formData: draft.formData,
      wizardState: {
        currentStep: draft.meta.wizardStep,
        step3CurrentSubStep: draft.meta.step3SubStep,
        step4CurrentSubStep: draft.meta.step4SubStep,
        step5CurrentSubStep: draft.meta.step5SubStep,
        step7CurrentSubStep: draft.meta.step7SubStep,
      },
      generatedText: {
        originalStructure,
        currentMarkdown: null,
        aiImproved: false,
        aiImprovedMarkdown: null,
      },
    };

    const dataEncrypted = await this.encryptData(dataToEncrypt);

    // Encrypt the patient chiffre separately for list display
    const chiffreEncrypted = await this.encryptChiffre(draft.formData.patientenchiffre || null);

    const client = await this.getClient();
    const { error } = await client
      .from('gutachten')
      .update({
        status: 'completed',
        encrypted_chiffre: chiffreEncrypted.encrypted,
        encrypted_chiffre_iv: chiffreEncrypted.iv,
        encrypted_data: dataEncrypted.encrypted,
        encrypted_data_iv: dataEncrypted.iv,
      })
      .eq('id', id);

    if (error) {
      console.error('Error completing draft:', error);
      throw new Error(`Failed to complete draft: ${error.message}`);
    }
  }

  async loadCompleted(id: UUID): Promise<StoredGutachtenCompleted | null> {
    this.ensureReady();

    const client = await this.getClient();
    const { data, error } = await client
      .from('gutachten')
      .select('*')
      .eq('id', id)
      .eq('status', 'completed')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error loading completed gutachten:', error);
      throw new Error(`Failed to load completed: ${error.message}`);
    }

    if (!data.encrypted_data || !data.encrypted_data_iv) {
      console.error('Completed gutachten has no encrypted data');
      return null;
    }

    const encryptedData = await this.decryptData(data.encrypted_data, data.encrypted_data_iv);
    const meta = await this.rowToMeta(data as GutachtenRow);

    return {
      meta,
      formData: encryptedData.formData,
      generatedText: encryptedData.generatedText || {},
    };
  }

  async updateCompletedMarkdown(id: UUID, currentMarkdown: string, aiImproved = false): Promise<void> {
    this.ensureReady();

    const completed = await this.loadCompleted(id);
    if (!completed) {
      throw new Error(`Completed gutachten ${id} not found.`);
    }

    const dataToEncrypt: EncryptedGutachtenData = {
      formData: completed.formData,
      wizardState: {
        currentStep: completed.meta.wizardStep,
        step3CurrentSubStep: completed.meta.step3SubStep,
        step4CurrentSubStep: completed.meta.step4SubStep,
        step5CurrentSubStep: completed.meta.step5SubStep,
        step7CurrentSubStep: completed.meta.step7SubStep,
      },
      generatedText: {
        ...completed.generatedText,
        currentMarkdown,
        aiImproved,
      },
    };

    const dataEncrypted = await this.encryptData(dataToEncrypt);

    // Encrypt the patient chiffre separately for list display
    const chiffreEncrypted = await this.encryptChiffre(completed.formData.patientenchiffre || null);

    const client = await this.getClient();
    const { error } = await client
      .from('gutachten')
      .update({
        encrypted_chiffre: chiffreEncrypted.encrypted,
        encrypted_chiffre_iv: chiffreEncrypted.iv,
        encrypted_data: dataEncrypted.encrypted,
        encrypted_data_iv: dataEncrypted.iv,
      })
      .eq('id', id)
      .eq('status', 'completed');

    if (error) {
      console.error('Error updating completed markdown:', error);
      throw new Error(`Failed to update markdown: ${error.message}`);
    }
  }

  async revertCompletedToOriginal(id: UUID): Promise<void> {
    this.ensureReady();

    const completed = await this.loadCompleted(id);
    if (!completed) {
      throw new Error(`Completed gutachten ${id} not found.`);
    }

    const dataToEncrypt: EncryptedGutachtenData = {
      formData: completed.formData,
      wizardState: {
        currentStep: completed.meta.wizardStep,
        step3CurrentSubStep: completed.meta.step3SubStep,
        step4CurrentSubStep: completed.meta.step4SubStep,
        step5CurrentSubStep: completed.meta.step5SubStep,
        step7CurrentSubStep: completed.meta.step7SubStep,
      },
      generatedText: {
        originalStructure: completed.generatedText.originalStructure,
        currentMarkdown: null,
        aiImproved: false,
        aiImprovedMarkdown: null,
        originalAiMarkdown: null,
        aiEdited: false,
      },
    };

    const dataEncrypted = await this.encryptData(dataToEncrypt);

    // Encrypt the patient chiffre separately for list display
    const chiffreEncrypted = await this.encryptChiffre(completed.formData.patientenchiffre || null);

    const client = await this.getClient();
    const { error } = await client
      .from('gutachten')
      .update({
        encrypted_chiffre: chiffreEncrypted.encrypted,
        encrypted_chiffre_iv: chiffreEncrypted.iv,
        encrypted_data: dataEncrypted.encrypted,
        encrypted_data_iv: dataEncrypted.iv,
      })
      .eq('id', id)
      .eq('status', 'completed');

    if (error) {
      console.error('Error reverting to original:', error);
      throw new Error(`Failed to revert: ${error.message}`);
    }
  }

  async saveAiImprovedMarkdown(id: UUID, aiImprovedMarkdown: string): Promise<void> {
    this.ensureReady();

    const completed = await this.loadCompleted(id);
    if (!completed) {
      throw new Error(`Completed gutachten ${id} not found.`);
    }

    const dataToEncrypt: EncryptedGutachtenData = {
      formData: completed.formData,
      wizardState: {
        currentStep: completed.meta.wizardStep,
        step3CurrentSubStep: completed.meta.step3SubStep,
        step4CurrentSubStep: completed.meta.step4SubStep,
        step5CurrentSubStep: completed.meta.step5SubStep,
        step7CurrentSubStep: completed.meta.step7SubStep,
      },
      generatedText: {
        ...completed.generatedText,
        aiImprovedMarkdown,
        aiImproved: true,
        // Track original AI output on first save (for revert functionality)
        originalAiMarkdown: completed.generatedText.originalAiMarkdown ?? aiImprovedMarkdown,
        aiEdited: false,  // Reset when new AI is generated
      },
    };

    const dataEncrypted = await this.encryptData(dataToEncrypt);

    // Encrypt the patient chiffre separately for list display
    const chiffreEncrypted = await this.encryptChiffre(completed.formData.patientenchiffre || null);

    const client = await this.getClient();
    const { error } = await client
      .from('gutachten')
      .update({
        encrypted_chiffre: chiffreEncrypted.encrypted,
        encrypted_chiffre_iv: chiffreEncrypted.iv,
        encrypted_data: dataEncrypted.encrypted,
        encrypted_data_iv: dataEncrypted.iv,
      })
      .eq('id', id)
      .eq('status', 'completed');

    if (error) {
      console.error('Error saving AI improved markdown:', error);
      throw new Error(`Failed to save AI markdown: ${error.message}`);
    }
  }

  async acceptAiImprovement(id: UUID): Promise<void> {
    this.ensureReady();

    const completed = await this.loadCompleted(id);
    if (!completed) {
      throw new Error(`Completed gutachten ${id} not found.`);
    }

    if (!completed.generatedText.aiImprovedMarkdown) {
      throw new Error('No AI improved markdown to accept.');
    }

    const dataToEncrypt: EncryptedGutachtenData = {
      formData: completed.formData,
      wizardState: {
        currentStep: completed.meta.wizardStep,
        step3CurrentSubStep: completed.meta.step3SubStep,
        step4CurrentSubStep: completed.meta.step4SubStep,
        step5CurrentSubStep: completed.meta.step5SubStep,
        step7CurrentSubStep: completed.meta.step7SubStep,
      },
      generatedText: {
        originalStructure: completed.generatedText.originalStructure,
        currentMarkdown: completed.generatedText.aiImprovedMarkdown,
        aiImproved: true,
        aiImprovedMarkdown: null,
        // Clear tracking fields after accepting
        originalAiMarkdown: null,
        aiEdited: false,
      },
    };

    const dataEncrypted = await this.encryptData(dataToEncrypt);

    // Encrypt the patient chiffre separately for list display
    const chiffreEncrypted = await this.encryptChiffre(completed.formData.patientenchiffre || null);

    const client = await this.getClient();
    const { error } = await client
      .from('gutachten')
      .update({
        encrypted_chiffre: chiffreEncrypted.encrypted,
        encrypted_chiffre_iv: chiffreEncrypted.iv,
        encrypted_data: dataEncrypted.encrypted,
        encrypted_data_iv: dataEncrypted.iv,
      })
      .eq('id', id)
      .eq('status', 'completed');

    if (error) {
      console.error('Error accepting AI improvement:', error);
      throw new Error(`Failed to accept AI improvement: ${error.message}`);
    }
  }

  async rejectAiImprovement(id: UUID): Promise<void> {
    this.ensureReady();

    const completed = await this.loadCompleted(id);
    if (!completed) {
      throw new Error(`Completed gutachten ${id} not found.`);
    }

    const dataToEncrypt: EncryptedGutachtenData = {
      formData: completed.formData,
      wizardState: {
        currentStep: completed.meta.wizardStep,
        step3CurrentSubStep: completed.meta.step3SubStep,
        step4CurrentSubStep: completed.meta.step4SubStep,
        step5CurrentSubStep: completed.meta.step5SubStep,
        step7CurrentSubStep: completed.meta.step7SubStep,
      },
      generatedText: {
        ...completed.generatedText,
        aiImprovedMarkdown: null,
        // Clear tracking fields after rejecting
        originalAiMarkdown: null,
        aiEdited: false,
      },
    };

    const dataEncrypted = await this.encryptData(dataToEncrypt);

    // Encrypt the patient chiffre separately for list display
    const chiffreEncrypted = await this.encryptChiffre(completed.formData.patientenchiffre || null);

    const client = await this.getClient();
    const { error } = await client
      .from('gutachten')
      .update({
        encrypted_chiffre: chiffreEncrypted.encrypted,
        encrypted_chiffre_iv: chiffreEncrypted.iv,
        encrypted_data: dataEncrypted.encrypted,
        encrypted_data_iv: dataEncrypted.iv,
      })
      .eq('id', id)
      .eq('status', 'completed');

    if (error) {
      console.error('Error rejecting AI improvement:', error);
      throw new Error(`Failed to reject AI improvement: ${error.message}`);
    }
  }

  async revertToOriginalAiMarkdown(id: UUID): Promise<void> {
    this.ensureReady();

    const completed = await this.loadCompleted(id);
    if (!completed) {
      throw new Error(`Completed gutachten ${id} not found.`);
    }

    if (!completed.generatedText.originalAiMarkdown) {
      throw new Error('No original AI markdown to revert to.');
    }

    const dataToEncrypt: EncryptedGutachtenData = {
      formData: completed.formData,
      wizardState: {
        currentStep: completed.meta.wizardStep,
        step3CurrentSubStep: completed.meta.step3SubStep,
        step4CurrentSubStep: completed.meta.step4SubStep,
        step5CurrentSubStep: completed.meta.step5SubStep,
        step7CurrentSubStep: completed.meta.step7SubStep,
      },
      generatedText: {
        ...completed.generatedText,
        aiImprovedMarkdown: completed.generatedText.originalAiMarkdown,
        aiEdited: false,
      },
    };

    const dataEncrypted = await this.encryptData(dataToEncrypt);

    // Encrypt the patient chiffre separately for list display
    const chiffreEncrypted = await this.encryptChiffre(completed.formData.patientenchiffre || null);

    const client = await this.getClient();
    const { error } = await client
      .from('gutachten')
      .update({
        encrypted_chiffre: chiffreEncrypted.encrypted,
        encrypted_chiffre_iv: chiffreEncrypted.iv,
        encrypted_data: dataEncrypted.encrypted,
        encrypted_data_iv: dataEncrypted.iv,
      })
      .eq('id', id)
      .eq('status', 'completed');

    if (error) {
      console.error('Error reverting to original AI markdown:', error);
      throw new Error(`Failed to revert to original AI: ${error.message}`);
    }
  }

  async updateAiImprovedMarkdown(id: UUID, aiImprovedMarkdown: string): Promise<void> {
    this.ensureReady();

    const completed = await this.loadCompleted(id);
    if (!completed) {
      throw new Error(`Completed gutachten ${id} not found.`);
    }

    const dataToEncrypt: EncryptedGutachtenData = {
      formData: completed.formData,
      wizardState: {
        currentStep: completed.meta.wizardStep,
        step3CurrentSubStep: completed.meta.step3SubStep,
        step4CurrentSubStep: completed.meta.step4SubStep,
        step5CurrentSubStep: completed.meta.step5SubStep,
        step7CurrentSubStep: completed.meta.step7SubStep,
      },
      generatedText: {
        ...completed.generatedText,
        aiImprovedMarkdown,
        aiEdited: true,  // Mark as edited by user
      },
    };

    const dataEncrypted = await this.encryptData(dataToEncrypt);

    // Encrypt the patient chiffre separately for list display
    const chiffreEncrypted = await this.encryptChiffre(completed.formData.patientenchiffre || null);

    const client = await this.getClient();
    const { error } = await client
      .from('gutachten')
      .update({
        encrypted_chiffre: chiffreEncrypted.encrypted,
        encrypted_chiffre_iv: chiffreEncrypted.iv,
        encrypted_data: dataEncrypted.encrypted,
        encrypted_data_iv: dataEncrypted.iv,
      })
      .eq('id', id)
      .eq('status', 'completed');

    if (error) {
      console.error('Error updating AI improved markdown:', error);
      throw new Error(`Failed to update AI markdown: ${error.message}`);
    }
  }

  async deleteCompleted(id: UUID): Promise<void> {
    this.ensureReady();

    const client = await this.getClient();
    const { error } = await client
      .from('gutachten')
      .delete()
      .eq('id', id)
      .eq('status', 'completed');

    if (error) {
      console.error('Error deleting completed gutachten:', error);
      throw new Error(`Failed to delete completed: ${error.message}`);
    }
  }
}
