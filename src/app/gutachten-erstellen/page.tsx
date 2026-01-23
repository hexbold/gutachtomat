'use client';

import { useGutachtenForm } from '@/hooks/useGutachtenForm';
import { useAutoSave } from '@/hooks/useAutoSave';
import { WizardContainer } from './_components/wizard/WizardContainer';
import { FormContainer } from './_components/form/FormContainer';
import { DevToolsMenu } from './_components/shared/DevToolsMenu';
import { useEffect, useState, useRef, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStorage } from '@/contexts/StorageContext';
import { createUUID } from '@/lib/storage/storage-types';
import { generateAssessmentText } from '@/lib/text-generation';
import { CloudIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

function GutachtenErstellenContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { adapter, isReady, isInitializing, storageMode } = useStorage();
  const [gutachtenId, setGutachtenId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<Error | null>(null);
  const [showNoChanges, setShowNoChanges] = useState(false);
  const [canUseDebugMode, setCanUseDebugMode] = useState(false);
  const hasInitialized = useRef(false);
  const saveStartTimeRef = useRef<number>(0);

  const {
    formData,
    submission,
    expansionState,
    wizardState,
    liveGeneratedText,
    updateField,
    updateAlter,
    setKinder,
    setWohnsituation,
    setNestedField,
    setNestedBoolean,
    symptomHandlers,
    befundHandlers,
    arrayHandlers,
    diagnosisHandlers,
    testdiagnostikHandlers,
    somatischerBefundHandlers,
    lebensgeschichteHandlers,
    funktionalesBedingungsmodellHandlers,
    makroanalyseHandlers,
    kapitel6Handlers,
    toggleSectionExpansion,
    generateRandomData,
    submitForm,
    setWizardStep,
    nextStep,
    previousStep,
    setViewMode,
    setStep3SubStep,
    setStep4SubStep,
    setStep5SubStep,
    setStep7SubStep,
    dispatch,
  } = useGutachtenForm();

  // Auto-save with mode-specific intervals (Local: 5s, Cloud: 60s)
  const { save, hasUnsavedChanges } = useAutoSave({
    adapter,
    gutachtenId,
    formData,
    wizardState: {
      currentStep: wizardState.currentStep,
      step3CurrentSubStep: wizardState.step3CurrentSubStep,
      step4CurrentSubStep: wizardState.step4CurrentSubStep,
      step5CurrentSubStep: wizardState.step5CurrentSubStep,
      step7CurrentSubStep: wizardState.step7CurrentSubStep,
    },
    storageMode,
    isReady,
    isLoading,
    onSaveStart: () => {
      saveStartTimeRef.current = Date.now();
      setIsSaving(true);
    },
    onSaveComplete: () => {
      // Ensure "Wird gespeichert..." shows for at least 500ms
      const elapsed = Date.now() - saveStartTimeRef.current;
      const remaining = Math.max(0, 500 - elapsed);
      setTimeout(() => {
        setIsSaving(false);
        setLastSavedAt(Date.now());
        setSaveError(null);
      }, remaining);
    },
    onSaveError: (error) => {
      setIsSaving(false);
      setSaveError(error);
      console.error('Auto-save failed:', error);
    },
  });

  // Manual save - uses the same save() from useAutoSave to keep hash in sync
  const handleManualSave = useCallback(() => {
    if (!hasUnsavedChanges()) {
      // No changes - show brief feedback
      setShowNoChanges(true);
      setTimeout(() => setShowNoChanges(false), 1500);
      return;
    }
    save();
  }, [save, hasUnsavedChanges]);

  // Keyboard shortcut for save (Ctrl+S / Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleManualSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleManualSave]);

  // Wrapper for submitForm that uses completeDraft when we have a gutachtenId
  const handleSubmitForm = async () => {
    if (!adapter || !gutachtenId) return;

    // Mark steps as completed
    dispatch({ type: 'MARK_STEP_COMPLETED', step: 7 });
    dispatch({ type: 'MARK_STEP_COMPLETED', step: 8 });
    dispatch({ type: 'SET_LOADING', isLoading: true });

    try {
      // Ensure current form data is saved before completing (prevents race condition
      // where completeDraft loads stale data if auto-save hasn't fired yet)
      await save();

      const result = generateAssessmentText(formData);

      // Complete the draft with JSON structure (V2 storage format)
      await adapter.completeDraft(createUUID(gutachtenId), result.structure);

      // Navigate to result page with ID (use router.push for SPA navigation - avoids beforeunload)
      router.push(`/gutachten-erstellen/ergebnis?id=${gutachtenId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten';
      dispatch({ type: 'SET_ERROR', error: errorMessage });
    }
  };

  // Initialize: read URL param, create or load draft
  useEffect(() => {
    if (hasInitialized.current || !isReady || !adapter) return;
    hasInitialized.current = true;

    const initializeDraft = async () => {
      const urlId = searchParams.get('id');

      if (urlId) {
        // Try to load existing draft
        const draft = await adapter.loadDraft(createUUID(urlId));
        if (draft) {
          // Load the draft data into the form
          dispatch({
            type: 'LOAD_FORM_DATA',
            formData: draft.formData,
            wizardStep: draft.meta.wizardStep,
            step3SubStep: draft.meta.step3SubStep,
            step4SubStep: draft.meta.step4SubStep,
            step5SubStep: draft.meta.step5SubStep,
            step7SubStep: draft.meta.step7SubStep,
          });
          setGutachtenId(urlId);
        } else {
          // Draft not found, create a new one
          const newId = await adapter.createDraft();
          setGutachtenId(newId);
          router.replace(`/gutachten-erstellen?id=${newId}`);
        }
      } else {
        // No ID in URL, create a new draft
        const newId = await adapter.createDraft();
        setGutachtenId(newId);
        router.replace(`/gutachten-erstellen?id=${newId}`);
      }

      setIsLoading(false);
    };

    initializeDraft();
  }, [searchParams, router, dispatch, isReady, adapter]);

  // Load view mode from localStorage on mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('gutachten-view-mode');
      if (savedMode === 'wizard' || savedMode === 'form') {
        setViewMode(savedMode);
      }
    } catch (error) {
      console.error('Failed to load view mode:', error);
    }
  }, [setViewMode]);

  // Fetch debug mode permission for production use
  useEffect(() => {
    async function fetchPermissions() {
      try {
        const response = await fetch('/api/user-permissions');
        if (response.ok) {
          const data = await response.json();
          setCanUseDebugMode(data.canUseDebugMode === true);
        }
      } catch (error) {
        console.error('Failed to fetch user permissions:', error);
      }
    }
    fetchPermissions();
  }, []);

  // Format the last saved time
  const formatLastSaved = (timestamp: number | null) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading || isInitializing || !isReady) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center">
        <p className="text-foreground/60">Laden...</p>
      </div>
    );
  }

  return (
    <>
      {/* Fixed Dev Tools Button - In development or for users with debug permission */}
      {(process.env.NODE_ENV !== 'production' || canUseDebugMode) && (
        <div className="fixed top-20 right-8 z-[70]">
          <DevToolsMenu
            formData={formData}
            viewMode={wizardState.viewMode}
            generateRandomData={generateRandomData}
            setViewMode={setViewMode}
            dispatch={dispatch}
          />
        </div>
      )}

      {/* Manual Save Button */}
      {gutachtenId && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          {/* Storage mode indicator */}
          <div className="flex items-center gap-1.5 text-sm text-foreground/60">
            {storageMode === 'local' ? (
              <>
                <ComputerDesktopIcon className="w-4 h-4" />
                <span>Lokal</span>
              </>
            ) : (
              <>
                <CloudIcon className="w-4 h-4" />
                <span>Cloud</span>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-600" />

          {/* Save status */}
          <div className="text-sm">
            {saveError ? (
              <span className="text-red-600 dark:text-red-400">Speichern fehlgeschlagen!</span>
            ) : isSaving ? (
              <span className="text-amber-600 dark:text-amber-400">Wird gespeichert...</span>
            ) : showNoChanges ? (
              <span className="text-green-600 dark:text-green-400">Keine Änderungen</span>
            ) : hasUnsavedChanges() ? (
              <span className="text-amber-600 dark:text-amber-400">Neue Änderungen</span>
            ) : lastSavedAt ? (
              <span className="text-green-600 dark:text-green-400">{`Gespeichert ${formatLastSaved(lastSavedAt)}`}</span>
            ) : (
              <span className="text-green-600 dark:text-green-400">Gespeichert</span>
            )}
          </div>

          {/* Save button */}
          <button
            onClick={handleManualSave}
            disabled={isSaving}
            className={`
              px-4 py-1.5 rounded-md text-sm font-medium transition-colors
              ${isSaving
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            `}
          >
            Speichern
          </button>
        </div>
      )}

      {/* Wizard mode */}
      {wizardState.viewMode === 'wizard' ? (
        <div className="min-h-screen bg-surface-secondary">
          <WizardContainer
            formData={formData}
            submission={submission}
            wizardState={wizardState}
            expansionState={expansionState}
            liveGeneratedText={liveGeneratedText}
            updateField={updateField}
            updateAlter={updateAlter}
            setKinder={setKinder}
            setWohnsituation={setWohnsituation}
            setNestedField={setNestedField}
            setNestedBoolean={setNestedBoolean}
            symptomHandlers={symptomHandlers}
            befundHandlers={befundHandlers}
            arrayHandlers={arrayHandlers}
            diagnosisHandlers={diagnosisHandlers}
            testdiagnostikHandlers={testdiagnostikHandlers}
            somatischerBefundHandlers={somatischerBefundHandlers}
            lebensgeschichteHandlers={lebensgeschichteHandlers}
            funktionalesBedingungsmodellHandlers={funktionalesBedingungsmodellHandlers}
            makroanalyseHandlers={makroanalyseHandlers}
            kapitel6Handlers={kapitel6Handlers}
            toggleSectionExpansion={toggleSectionExpansion}
            onStepChange={setWizardStep}
            onNextStep={nextStep}
            onPreviousStep={previousStep}
            submitForm={handleSubmitForm}
            setStep3SubStep={setStep3SubStep}
            setStep4SubStep={setStep4SubStep}
            setStep5SubStep={setStep5SubStep}
            setStep7SubStep={setStep7SubStep}
          />
        </div>
      ) : (
        // Form mode (direct form layout)
        <div className="min-h-screen bg-surface-secondary">
          <FormContainer
            formData={formData}
            expansionState={expansionState}
            liveGeneratedText={liveGeneratedText}
            updateField={updateField}
            updateAlter={updateAlter}
            setKinder={setKinder}
            setWohnsituation={setWohnsituation}
            setNestedField={setNestedField}
            setNestedBoolean={setNestedBoolean}
            symptomHandlers={symptomHandlers}
            befundHandlers={befundHandlers}
            testdiagnostikHandlers={testdiagnostikHandlers}
            arrayHandlers={arrayHandlers}
            diagnosisHandlers={diagnosisHandlers}
            somatischerBefundHandlers={somatischerBefundHandlers}
            toggleSectionExpansion={toggleSectionExpansion}
            submitForm={handleSubmitForm}
          />
        </div>
      )}
    </>
  );
}

export default function GutachtenErstellen() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface-secondary flex items-center justify-center">
          <p className="text-foreground/60">Laden...</p>
        </div>
      }
    >
      <GutachtenErstellenContent />
    </Suspense>
  );
}
