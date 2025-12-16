import { useReducer, useCallback, useMemo, useRef } from 'react';
import { formReducer } from '@/lib/core/form-reducer';
import * as FormTypes from '@/lib/core/form-types';
import { generateRandomFormData } from '@/lib/random-generators';
import { generateAssessmentText } from '@/lib/text-generation';

// Grouped handler types - replaces 70+ individual handlers

export interface SymptomHandlers {
  toggleSymptom: (section: string, value: string) => void;
  setAndereSymptome: (section: string, value: string) => void;
  toggleNestedArrayField: (fieldPath: string, value: string) => void;
  setNestedTextField: (fieldPath: string, value: string) => void;
  toggleSelectionField: (fieldPath: string, value: string) => void;
}

export interface BefundHandlers {
  toggle: (section: string, field: string, value: string) => void;
}

export interface A4Handlers {
  toggleSeitWann: (value: string) => void;
  setSeitWannAndere: (value: string) => void;
  toggleVerstaerkung: (value: string) => void;
  setVerstaerkungAndere: (value: string) => void;
}

export interface A5Handlers {
  toggleStressfaktor: (value: string) => void;
  setAndereStressfaktoren: (value: string) => void;
}

export interface ArrayHandlers {
  toggle: (fieldPath: string, value: string) => void;
}

export interface DiagnosisHandlers {
  addDiagnosis: (code: string, name: string) => void;
  removeDiagnosis: (code: string) => void;
  setSicherheit: (code: string, sicherheit: 'G' | 'V') => void;
}

export function useGutachtenForm() {
  const [state, dispatch] = useReducer(formReducer, FormTypes.initialFormState);

  // Basic field operations

  const updateField = useCallback((field: keyof FormTypes.Form, value: string | FormTypes.Patientenchiffre | FormTypes.DatumBerichterstellung) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const updateAlter = useCallback((value: FormTypes.Alter) => {
    dispatch({ type: 'SET_FIELD', field: 'alter', value });
  }, []);

  const setKinder = useCallback((value: FormTypes.Kinder) => {
    dispatch({ type: 'SET_KINDER', value });
  }, []);

  const setWohnsituation = useCallback((value: FormTypes.WohnsituationField) => {
    dispatch({ type: 'SET_WOHNSITUATION', value });
  }, []);

  // Illegale Drogen operations

  const addIllegaleDroge = useCallback(() => {
    dispatch({ type: 'ADD_ILLEGALE_DROGE' });
  }, []);

  const removeIllegaleDroge = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ILLEGALE_DROGE', id });
  }, []);

  const updateIllegaleDroge = useCallback((id: string, field: 'suchtmittel' | 'menge' | 'mengeEinheit' | 'haeufigkeit', value: string) => {
    dispatch({ type: 'UPDATE_ILLEGALE_DROGE', id, field, value });
  }, []);

  // Generic array operations

  const toggleArrayField = useCallback((fieldPath: string, value: string) => {
    dispatch({ type: 'TOGGLE_ARRAY_FIELD', fieldPath, value });
  }, []);

  const setNestedField = useCallback((fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => {
    dispatch({ type: 'SET_NESTED_FIELD', fieldPath, value });
  }, []);

  const setNestedBoolean = useCallback((fieldPath: string, value: boolean) => {
    dispatch({ type: 'SET_NESTED_BOOLEAN', fieldPath, value });
  }, []);

  // Grouped handlers - Symptom sections

  const toggleSelectionField = useCallback((fieldPath: string, value: string) => {
    dispatch({ type: 'TOGGLE_SELECTION_FIELD', fieldPath, value });
  }, []);

  const symptomHandlers: SymptomHandlers = useMemo(() => ({
    toggleSymptom: (section: string, value: string) => {
      toggleArrayField(`${section}.symptoms`, value);
    },
    setAndereSymptome: (section: string, value: string) => {
      setNestedField(`${section}.andereSymptome`, value);
    },
    toggleNestedArrayField: (fieldPath: string, value: string) => {
      toggleArrayField(fieldPath, value);
    },
    setNestedTextField: (fieldPath: string, value: string) => {
      setNestedField(fieldPath, value);
    },
    toggleSelectionField: (fieldPath: string, value: string) => {
      toggleSelectionField(fieldPath, value);
    },
  }), [toggleArrayField, setNestedField, toggleSelectionField]);

  // Grouped handlers - A4 section

  const a4Handlers: A4Handlers = useMemo(() => ({
    toggleSeitWann: (value: string) => toggleArrayField('a4.seitWann', value),
    setSeitWannAndere: (value: string) => setNestedField('a4.seitWannAndere', value),
    toggleVerstaerkung: (value: string) => toggleArrayField('a4.verstaerkung', value),
    setVerstaerkungAndere: (value: string) => setNestedField('a4.verstaerkungAndere', value),
  }), [toggleArrayField, setNestedField]);

  // Grouped handlers - A5 section

  const a5Handlers: A5Handlers = useMemo(() => ({
    toggleStressfaktor: (value: string) => toggleArrayField('a5.stressfaktoren', value),
    setAndereStressfaktoren: (value: string) => setNestedField('a5.andereStressfaktoren', value),
  }), [toggleArrayField, setNestedField]);

  // Grouped handlers - Befund sections

  const befundHandlers: BefundHandlers = useMemo(() => ({
    toggle: (section: string, field: string, value: string) => {
      toggleArrayField(`${section}.${field}`, value);
    },
  }), [toggleArrayField]);

  // Grouped handlers - Simple array fields

  const arrayHandlers: ArrayHandlers = useMemo(() => ({
    toggle: (fieldPath: string, value: string) => toggleArrayField(fieldPath, value),
  }), [toggleArrayField]);

  // Grouped handlers - Diagnosis section

  const diagnosisHandlers: DiagnosisHandlers = useMemo(() => ({
    addDiagnosis: (code: string, name: string) => {
      dispatch({ type: 'ADD_DIAGNOSIS', code, name });
    },
    removeDiagnosis: (code: string) => {
      dispatch({ type: 'REMOVE_DIAGNOSIS', code });
    },
    setSicherheit: (code: string, sicherheit: 'G' | 'V') => {
      dispatch({ type: 'SET_DIAGNOSIS_SICHERHEIT', code, sicherheit });
    },
  }), []);

  // UI state management

  const toggleSectionExpansion = useCallback((section: keyof FormTypes.SectionExpansionState) => {
    dispatch({ type: 'TOGGLE_SECTION_EXPANSION', section });
  }, []);

  const expandAllSections = useCallback(() => {
    dispatch({ type: 'EXPAND_ALL_SECTIONS' });
  }, []);

  // Wizard state management

  const setWizardStep = useCallback((step: number) => {
    dispatch({ type: 'SET_WIZARD_STEP', step });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: 'WIZARD_NEXT_STEP' });
  }, []);

  const previousStep = useCallback(() => {
    dispatch({ type: 'WIZARD_PREVIOUS_STEP' });
  }, []);

  const setViewMode = useCallback((mode: FormTypes.ViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', mode });
    // Persist to localStorage
    try {
      localStorage.setItem('gutachten-view-mode', mode);
    } catch (error) {
      console.error('Failed to save view mode:', error);
    }
  }, []);

  const markStepCompleted = useCallback((step: number) => {
    dispatch({ type: 'MARK_STEP_COMPLETED', step });
  }, []);

  const confirmStep3Substep = useCallback((substep: number) => {
    dispatch({ type: 'CONFIRM_STEP3_SUBSTEP', substep });
  }, []);

  const completeStep3Substep = useCallback((substep: number) => {
    dispatch({ type: 'COMPLETE_STEP3_SUBSTEP', substep });
  }, []);

  const confirmAmdpPage = useCallback((page: number) => {
    dispatch({ type: 'CONFIRM_AMDP_PAGE', page });
  }, []);

  const completeAmdpPage = useCallback((page: number) => {
    dispatch({ type: 'COMPLETE_AMDP_PAGE', page });
  }, []);

  const confirmStep4Substep = useCallback((substep: number) => {
    dispatch({ type: 'CONFIRM_STEP4_SUBSTEP', substep });
  }, []);

  const completeStep4Substep = useCallback((substep: number) => {
    dispatch({ type: 'COMPLETE_STEP4_SUBSTEP', substep });
  }, []);

  const confirmStep5Substep = useCallback((substep: number) => {
    dispatch({ type: 'CONFIRM_STEP5_SUBSTEP', substep });
  }, []);

  const completeStep5Substep = useCallback((substep: number) => {
    dispatch({ type: 'COMPLETE_STEP5_SUBSTEP', substep });
  }, []);

  // Form utilities

  const generateRandomData = useCallback(() => {
    const randomData = generateRandomFormData();
    dispatch({ type: 'SET_MULTIPLE_FIELDS', data: randomData });
    dispatch({ type: 'EXPAND_ALL_SECTIONS' });

    // Kinder is now handled as part of randomData.kinder (Kinder type)
    // No separate handling needed - it's set via SET_MULTIPLE_FIELDS
  }, []);

  const validateForm = useCallback(() => {
    const { formData } = state;
    const requiredFields: (keyof FormTypes.Form)[] = [
      'geschlecht', 'alter', 'patientenchiffre',
      'beruf', 'familienstand',
      'therapieform', 'behandlungsform', 'antragsart'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return false;
      }
    }

    // Kinder: must be selected (not null)
    if (formData.kinder === null) {
      return false;
    }

    // Wohnsituation: must be selected (not null)
    if (formData.wohnsituation === null) {
      return false;
    }

    // Finanzielle Situation: must be selected (not null)
    if (formData.finanzielleSituation === null) {
      return false;
    }

    // If children exist, validate each child has required data
    if (formData.kinder.anzahl > 0 && 'details' in formData.kinder) {
      for (const child of formData.kinder.details) {
        if (child.alter === null || child.geschlecht === null) {
          return false;
        }
      }
    }

    return true;
  }, [state]);

  const getApiPayload = useCallback((): FormTypes.GutachtenApiPayload => {
    const { formData } = state;
    return {
      geschlechtId: formData.geschlecht || null,
      alter: formData.alter,
      patientenchiffre: formData.patientenchiffre,
      datumBerichterstellung: formData.datumBerichterstellung,
      bildungsweg: formData.bildungsweg,
      beruf: formData.beruf || null,
      familienstandId: formData.familienstand || null,
      kinder: formData.kinder,
      wohnsituation: formData.wohnsituation,
      finanzielleSituation: formData.finanzielleSituation,
      krankschreibung: formData.krankschreibung,
      therapieformId: formData.therapieform || null,
      behandlungsformId: formData.behandlungsform || null,
      antragsartId: formData.antragsart || null,
      manischeSymptomatik: formData.manischeSymptomatik,
      a2: formData.a2,
      a3: formData.a3,
      a4: formData.a4,
      a5: formData.a5,
      b1: formData.b1,
      b2: formData.b2,
      b3: formData.b3,
      b4: formData.b4,
      b5: formData.b5,
      b6: formData.b6,
      b7: formData.b7,
      b8: formData.b8,
      b9: formData.b9,
      b10: formData.b10,
      b11: formData.b11,
      b12: formData.b12,
      b13: formData.b13,
      b14: formData.b14,
      b15: formData.b15,
      b16: formData.b16,
      b17: formData.b17,
      b18: formData.b18,
      c: formData.c,
      somato1: formData.somato1,
      somato2: formData.somato2,
      somato3: formData.somato3,
      somato4: formData.somato4,
      somato5: formData.somato5,
      lebensgA: formData.lebensgA,
      lebensgB: formData.lebensgB,
      lebensgC: formData.lebensgC,
      kap5Diagnosen: formData.kap5Diagnosen,
    };
  }, [state]);

  const submitForm = useCallback(async () => {
    // Mark the final step as completed to turn the entire progress bar green
    dispatch({ type: 'MARK_STEP_COMPLETED', step: 7 });

    if (!validateForm()) {
      dispatch({ type: 'SET_ERROR', error: 'Bitte füllen Sie alle Felder aus.' });
      return;
    }

    dispatch({ type: 'SET_LOADING', isLoading: true });

    try {
      // Use the already-generated preview text from the frontend
      // This avoids calling the backend API and uses the same text generation
      // that's shown in the live preview
      // Note: We use generateAssessmentText directly here to ensure we get the latest text
      const result = generateAssessmentText(state.formData);
      const assessmentText = result.text;

      // Simulate a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 300));

      dispatch({ type: 'SET_RESULT', result: assessmentText });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten';
      dispatch({ type: 'SET_ERROR', error: errorMessage });
    }
  }, [validateForm, state.formData]);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  const clearSubmissionState = useCallback(() => {
    dispatch({ type: 'CLEAR_SUBMISSION_STATE' });
  }, []);

  // Real-time text generation

  const previousTextRef = useRef<string>('');

  const liveGeneratedText: FormTypes.GeneratedTextResult = useMemo(() => {
    const result = generateAssessmentText(state.formData, previousTextRef.current);
    previousTextRef.current = result.text;
    return result;
  }, [state.formData]);

  return {
    // State
    formData: state.formData,
    submission: state.submission,
    expansionState: state.expansionState,
    wizardState: state.wizardState,
    liveGeneratedText,

    // Basic actions
    updateField,
    updateAlter,
    setKinder,
    setWohnsituation,
    setNestedField,
    setNestedBoolean,

    // Illegale Drogen operations
    addIllegaleDroge,
    removeIllegaleDroge,
    updateIllegaleDroge,

    // Grouped handlers
    symptomHandlers,
    a4Handlers,
    a5Handlers,
    befundHandlers,
    arrayHandlers,
    diagnosisHandlers,

    // UI state
    toggleSectionExpansion,
    expandAllSections,

    // Wizard state
    setWizardStep,
    nextStep,
    previousStep,
    setViewMode,
    markStepCompleted,
    confirmStep3Substep,
    completeStep3Substep,
    confirmAmdpPage,
    completeAmdpPage,
    confirmStep4Substep,
    completeStep4Substep,
    confirmStep5Substep,
    completeStep5Substep,

    // Form operations
    generateRandomData,
    submitForm,
    resetForm,
    clearSubmissionState,

    // Utilities
    validateForm,
    isFormValid: validateForm(),

    dispatch,
  };
}
