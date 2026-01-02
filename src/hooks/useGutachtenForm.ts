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
  // Clear functions for each symptom category
  clearManischeSymptomatik: () => void;
  clearDepressiveSymptomatik: () => void;
  clearAngstsymptomatik: () => void;
  clearZwangssymptomatik: () => void;
  clearVerhaltensauffaelligkeiten: () => void;
  clearVerhaltensexzesse: () => void;
  clearVerhaltensdefizite: () => void;
}

export interface BefundHandlers {
  toggle: (section: string, field: string, value: string) => void;
  toggleErscheinungsbildSelection: (field: string, value: string) => void;
  clearErscheinungsbild: () => void;
  clearKontaktverhalten: () => void;
  clearSprache: () => void;
  clearBewusstsein: () => void;
  clearOrientierung: () => void;
  clearMnestik: () => void;
  clearKonzentrationUndAuffassung: () => void;
  clearFormalesDenken: () => void;
  clearWahrnehmung: () => void;
  clearInhaltlichesDenken: () => void;
  clearIchStoerungen: () => void;
  clearAengste: () => void;
  clearZwaenge: () => void;
  clearStimmungUndAffekt: () => void;
  clearAntriebInteresseFreude: () => void;
  clearPsychomotorik: () => void;
  clearSuizidalitaet: () => void;
  clearKrankheitseinstellung: () => void;
}

export interface ArrayHandlers {
  toggle: (fieldPath: string, value: string) => void;
}

export interface DiagnosisHandlers {
  addDiagnosis: (code: string, name: string) => void;
  removeDiagnosis: (code: string) => void;
  setSicherheit: (code: string, sicherheit: 'G' | 'V') => void;
}

export interface TestdiagnostikHandlers {
  addTest: (abbreviation: string, name: string) => void;
  removeTest: (index: number) => void;
  updateTest: (index: number, field: keyof FormTypes.SelectedTestVerfahren, value: string | number | null) => void;
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
    // Clear functions - reset entire symptom category to initial state
    clearManischeSymptomatik: () => {
      setNestedField('manischeSymptomatik', {
        stimmungEmotionalesErleben: {},
        antriebEnergiePsychomotorik: {},
        spracheKognition: {},
        vegetativeSymptome: {},
        selbsterleben: {},
        verhalten: {
          selection: {},
          impulsivesVerhalten: {
            details: {},
            andere: '',
          },
        },
        psychotischeSymptome: {},
        dissoziativeSymptome: {},
        andereSymptome: '',
      });
    },
    clearDepressiveSymptomatik: () => {
      setNestedField('depressiveSymptomatik', {
        stimmungEmotionalesErleben: {},
        antriebEnergiePsychomotorik: {},
        selbsterleben: {},
        vegetativeSomatischeSymptome: {},
        psychomotorischeSymptome: {},
        kognition: {},
        verhalten: {},
        psychotischeSymptome: {},
        dissoziativeSymptome: {},
        andereSymptome: '',
      });
    },
    clearAngstsymptomatik: () => {
      setNestedField('angstsymptomatik', {
        emotionalesErleben: {},
        kognition: {},
        somatovegetativeSymptome: {},
        verhalten: {},
        dissoziativeSymptome: {},
        panikstoerung: {},
        agoraphobie: {
          paniksymptomatik: {},
          bereiche: {},
          bereicheAndere: '',
          fluchtmoeglichkeiten: {},
          fluchtmoeglichkeitenAndere: '',
        },
        sozialePhobie: {},
        spezifischePhobien: {},
        generalisierteAngst: {},
        andereSymptome: '',
      });
    },
    clearZwangssymptomatik: () => {
      setNestedField('zwangssymptomatik', {
        zwangsgedanken: {},
        zwangshandlungen: {},
        zwangsbezogeneKognitionen: {},
        andereSymptome: '',
      });
    },
    clearVerhaltensauffaelligkeiten: () => {
      setNestedField('verhaltensauffaelligkeiten', {
        exzesse: {},
        defizite: {},
        andereExzesse: '',
        andereDefizite: '',
      });
    },
    clearVerhaltensexzesse: () => {
      setNestedField('verhaltensauffaelligkeiten.exzesse', {});
      setNestedField('verhaltensauffaelligkeiten.andereExzesse', '');
    },
    clearVerhaltensdefizite: () => {
      setNestedField('verhaltensauffaelligkeiten.defizite', {});
      setNestedField('verhaltensauffaelligkeiten.andereDefizite', '');
    },
  }), [toggleArrayField, setNestedField, toggleSelectionField]);

  // Grouped handlers - Befund sections

  const befundHandlers: BefundHandlers = useMemo(() => ({
    toggle: (section: string, field: string, value: string) => {
      toggleArrayField(`${section}.${field}`, value);
    },
    toggleErscheinungsbildSelection: (field: string, value: string) => {
      toggleSelectionField(`erscheinungsbild.${field}`, value);
    },
    clearErscheinungsbild: () => {
      setNestedField('erscheinungsbild', {});
    },
    clearKontaktverhalten: () => {
      setNestedField('kontaktverhalten', { ersterEindruck: [], kontaktverhalten: [] });
    },
    clearSprache: () => {
      setNestedField('sprache', { sprache: [] });
    },
    clearBewusstsein: () => {
      setNestedField('bewusstsein', { quantitativesBewusstsein: [], qualitativesBewusstsein: [] });
    },
    clearOrientierung: () => {
      setNestedField('orientierung', { orientierung: [] });
    },
    clearMnestik: () => {
      setNestedField('mnestik', { mnestik: [] });
    },
    clearKonzentrationUndAuffassung: () => {
      setNestedField('konzentrationUndAuffassung', { konzentration: [] });
    },
    clearFormalesDenken: () => {
      setNestedField('formalesDenken', { denkstruktur: [], denkgeschwindigkeit: [] });
    },
    clearWahrnehmung: () => {
      setNestedField('wahrnehmung', { halluzinationen: [] });
    },
    clearInhaltlichesDenken: () => {
      setNestedField('inhaltlichesDenken', { inhaltlichesDenken: [] });
    },
    clearIchStoerungen: () => {
      setNestedField('ichStoerungen', { keineIchStorungen: [], psychotischeIchStorungen: [], nichtPsychotischeIchStorungen: [] });
    },
    clearAengste: () => {
      setNestedField('aengste', { artenVonAngsten: [], symptomeKompensation: [] });
    },
    clearZwaenge: () => {
      setNestedField('zwaenge', { zwange: [] });
    },
    clearStimmungUndAffekt: () => {
      setNestedField('stimmungUndAffekt', { stimmung: [], affekt: [] });
    },
    clearAntriebInteresseFreude: () => {
      setNestedField('antriebInteresseFreude', { antrieb: [] });
    },
    clearPsychomotorik: () => {
      setNestedField('psychomotorik', { psychomotorik: [] });
    },
    clearSuizidalitaet: () => {
      setNestedField('suizidalitaet', { gradDerSuizidalitat: [], paktAbspracheFahigkeit: [], abklarungVonSuizidalitat: [] });
    },
    clearKrankheitseinstellung: () => {
      setNestedField('krankheitseinstellung', { krankheitseinsicht: [], behandlungsbereitschaft: [] });
    },
  }), [toggleArrayField, setNestedField, toggleSelectionField]);

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

  // Grouped handlers - Testdiagnostik section

  const testdiagnostikHandlers: TestdiagnostikHandlers = useMemo(() => ({
    addTest: (abbreviation: string, name: string) => {
      dispatch({ type: 'ADD_TEST_VERFAHREN', abbreviation, name });
    },
    removeTest: (index: number) => {
      dispatch({ type: 'REMOVE_TEST_VERFAHREN', index });
    },
    updateTest: (index: number, field: keyof FormTypes.SelectedTestVerfahren, value: string | number | null) => {
      dispatch({ type: 'UPDATE_TEST_VERFAHREN', index, field, value });
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

  const setStep3SubStep = useCallback((substep: number) => {
    dispatch({ type: 'SET_STEP3_SUBSTEP', substep });
  }, []);

  const setStep4SubStep = useCallback((substep: number) => {
    dispatch({ type: 'SET_STEP4_SUBSTEP', substep });
  }, []);

  const setStep5SubStep = useCallback((substep: number) => {
    dispatch({ type: 'SET_STEP5_SUBSTEP', substep });
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
      verhaltensauffaelligkeiten: formData.verhaltensauffaelligkeiten,
      erscheinungsbild: formData.erscheinungsbild,
      kontaktverhalten: formData.kontaktverhalten,
      sprache: formData.sprache,
      bewusstsein: formData.bewusstsein,
      orientierung: formData.orientierung,
      mnestik: formData.mnestik,
      konzentrationUndAuffassung: formData.konzentrationUndAuffassung,
      formalesDenken: formData.formalesDenken,
      wahrnehmung: formData.wahrnehmung,
      inhaltlichesDenken: formData.inhaltlichesDenken,
      ichStoerungen: formData.ichStoerungen,
      aengste: formData.aengste,
      zwaenge: formData.zwaenge,
      stimmungUndAffekt: formData.stimmungUndAffekt,
      antriebInteresseFreude: formData.antriebInteresseFreude,
      psychomotorik: formData.psychomotorik,
      suizidalitaet: formData.suizidalitaet,
      krankheitseinstellung: formData.krankheitseinstellung,
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
    befundHandlers,
    arrayHandlers,
    diagnosisHandlers,
    testdiagnostikHandlers,

    // UI state
    toggleSectionExpansion,
    expandAllSections,

    // Wizard state
    setWizardStep,
    nextStep,
    previousStep,
    setViewMode,
    markStepCompleted,
    setStep3SubStep,
    setStep4SubStep,
    setStep5SubStep,

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
