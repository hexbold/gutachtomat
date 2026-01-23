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
  clearTraumafolgesymptomatik: () => void;
  clearPsychotischeSymptomatik: () => void;
  clearOrganischeSymptomatik: () => void;
  clearSomatoformeSymptomatik: () => void;
  clearNichtorganischeSchlafstoerungen: () => void;
  clearEssstoerungen: () => void;
  clearSubstanzbezogeneSymptomatik: () => void;
  clearDissociativeSymptomatik: () => void;
  clearPersoenlichkeitsstoerungen: () => void;
  clearImpulskontrollstoerungen: () => void;
  clearSexuellbezogeneSymptome: () => void;
  clearGeschlechtsidentitaet: () => void;
  clearHyperkinetischeStoerungen: () => void;
  clearTicStoerungen: () => void;
  clearSuizidalitaetSymptomatik: () => void;
  clearSonstigeSymptomatik: () => void;
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

// ============================================================================
// SOMATISCHER BEFUND HANDLERS
// ============================================================================

export interface Somato1Handlers {
  setSomatischeVorerkrankungen: (value: FormTypes.SomatischeVorerkrankungen | null) => void;
  setKonsiliarbericht: (vorhanden: boolean, text?: string) => void;
}

export interface Somato2Handlers {
  setKeineMedikation: (value: boolean) => void;
  addMedikament: () => void;
  removeMedikament: (id: string) => void;
  updateMedikament: (id: string, updates: Partial<Omit<FormTypes.MedikamentEntry, 'id'>>) => void;
}

export interface Somato3Handlers {
  setKeineVorbehandlung: (value: boolean) => void;
  addVorbehandlung: () => void;
  removeVorbehandlung: (id: string) => void;
  updateVorbehandlung: (id: string, updates: Partial<Omit<FormTypes.VorbehandlungEntry, 'id'>>) => void;
  setAktuelleBehandlung: (value: boolean | null) => void;
  setZusatztext: (value: string) => void;
}

export interface Somato4Handlers {
  setFamilienanamnese: (value: FormTypes.Familienanamnese | null) => void;
}

export interface Somato5Handlers {
  setSuchtanamnese: (value: FormTypes.Suchtanamnese | null) => void;
  setKeineSucht: (value: boolean) => void;
  // Alkohol
  setAlkoholData: (value: FormTypes.AlkoholData | null) => void;
  setAlkoholHaeufigkeit: (value: FormTypes.Haeufigkeit) => void;
  addAlkoholKonsum: (art: FormTypes.AlkoholArt) => void;
  removeAlkoholKonsum: (art: FormTypes.AlkoholArt) => void;
  updateAlkoholKonsum: (art: FormTypes.AlkoholArt, updates: Partial<Omit<FormTypes.AlkoholKonsumEntry, 'art'>>) => void;
  // Nikotin
  addNikotinKonsum: (konsum: FormTypes.NikotinKonsum) => void;
  removeNikotinKonsum: (form: FormTypes.NikotinForm) => void;
  updateNikotinKonsum: (konsum: FormTypes.NikotinKonsum) => void;
  // THC
  setTHCData: (value: FormTypes.THCData | null) => void;
  // Illegale Drogen
  addIllegaleDroge: () => void;
  removeIllegaleDroge: (id: string) => void;
  updateIllegaleDroge: (id: string, updates: Partial<Omit<FormTypes.IllegaleDrogenEntry, 'id'>>) => void;
  // Medikamenten-Missbrauch
  addMedikamentenMissbrauch: () => void;
  removeMedikamentenMissbrauch: (id: string) => void;
  updateMedikamentenMissbrauch: (id: string, updates: Partial<Omit<FormTypes.MedikamentenMissbrauchEntry, 'id'>>) => void;
  // Other
  setAndereSuchtform: (value: string) => void;
  setZusatztext: (value: string) => void;
}

export interface SomatischerBefundHandlers {
  somato1: Somato1Handlers;
  somato2: Somato2Handlers;
  somato3: Somato3Handlers;
  somato4: Somato4Handlers;
  somato5: Somato5Handlers;
}

// ============================================================================
// LEBENSGESCHICHTE HANDLERS
// ============================================================================

export interface GeschwisterHandlers {
  setKeineGeschwister: (value: boolean) => void;
  add: () => void;
  remove: (id: string) => void;
  update: (id: string, updates: Partial<Omit<FormTypes.GeschwisterEntry, 'id'>>) => void;
}

export interface AndereBezugspersonenHandlers {
  add: () => void;
  remove: (id: string) => void;
  update: (id: string, updates: Partial<Omit<FormTypes.AndereBezugspersonEntry, 'id'>>) => void;
}

export interface LebensgeschichteHandlers {
  geschwister: GeschwisterHandlers;
  andereBezugspersonen: AndereBezugspersonenHandlers;
}

// ============================================================================
// FUNKTIONALES BEDINGUNGSMODELL HANDLERS
// ============================================================================

export interface FunktionalesBedingungsmodellHandlers {
  addSorkcEntry: () => void;
  removeSorkcEntry: (id: string) => void;
  updateSorkcEntry: (id: string, updates: Partial<Omit<FormTypes.SorkcEntry, 'id'>>) => void;
}

// ============================================================================
// MAKROANALYSE HANDLERS
// ============================================================================

export interface MakroanalyseHandlers {
  // Makroanalyse Intro
  updateMakroanalyseIntro: (updates: Partial<FormTypes.MakroanalyseIntro>) => void;

  // Prädisponierende Faktoren
  updatePraedisponierendeFaktoren: (updates: Partial<FormTypes.PraedisponierendeFaktoren>) => void;
  addGrundannahme: (text: string) => void;
  removeGrundannahme: (index: number) => void;

  // Auslösende Bedingungen
  updateAusloesendeBedingungen: (updates: Partial<FormTypes.AusloesendeBedingungen>) => void;
  setNichtEruiert: (value: boolean) => void;

  // Aufrechterhaltende Bedingungen (7 sections)
  updateKognitiveFaktoren: (updates: Partial<FormTypes.KognitiveFaktorenData>) => void;
  updateEmotionaleFaktoren: (updates: Partial<FormTypes.EmotionaleFaktorenData>) => void;
  updateVerhaltensbezogeneFaktoren: (updates: Partial<FormTypes.VerhaltensbezogeneFaktorenData>) => void;
  updateSelbstwertbezogeneFaktoren: (updates: Partial<FormTypes.SelbstwertbezogeneFaktorenData>) => void;
  updateKompetenzdefizite: (updates: Partial<FormTypes.KompetenzdefiziteData>) => void;
  updateSubstanzabhaengigkeit: (updates: Partial<FormTypes.SubstanzabhaengigkeitData>) => void;
  updateWeitereFaktoren: (updates: Partial<FormTypes.WeitereAufrechterhaltendeFaktoren>) => void;

  // Störungsspezifische Modelle
  addStoerungsmodell: (zuordnung: FormTypes.StoerungsmodellZuordnung, typ: FormTypes.StoerungsmodellTyp) => void;
  removeStoerungsmodell: (id: string) => void;
  updateStoerungsmodell: (id: string, updates: Partial<FormTypes.StoerungsmodellData>) => void;
}

// ============================================================================
// KAPITEL 6: BEHANDLUNGSPLAN UND PROGNOSE HANDLERS
// ============================================================================

export interface Kapitel6Handlers {
  // Therapieziele handlers (4 categories: problemBewaeltigung, zwischenmenschlich, wohlbefinden, selbstbezogen)
  toggleTherapieziel: (category: string, subcategory: string, item: string) => void;
  setTherapiezielDetails: (category: string, subcategory: string, item: string, details: { brackets?: string; text?: string }) => void;
  clearTherapiezieleCategory: (category: string) => void;

  // Behandlungsplan handlers (11 disorder-specific intervention sets)
  toggleIntervention: (disorderType: string, item: string) => void;
  setInterventionDetails: (disorderType: string, item: string, details: { brackets?: string; text?: string }) => void;
  clearInterventionCategory: (disorderType: string) => void;

  // Begründung handlers (inline selections)
  setTherapieform: (value: FormTypes.TherapieformSetting | null) => void;
  setAnzahlSitzungen: (value: FormTypes.AnzahlSitzungen | null, andere?: number | null) => void;
  setSetting: (value: FormTypes.TherapieSetting | null) => void;
  toggleMitbehandler: (item: string) => void;
  setMitbehandlerAndere: (value: string) => void;
  setBegruendungstext: (value: string) => void;

  // Prognose handlers
  toggleGuenstigerFaktor: (item: string) => void;
  setGuenstigerFaktorDetails: (item: string, details: { brackets?: string; text?: string }) => void;
  setGuenstigeFaktorenAndere: (value: string) => void;
  toggleUnguenstigerFaktor: (item: string) => void;
  setUnguenstigerFaktorDetails: (item: string, details: { brackets?: string; text?: string }) => void;
  setUnguenstigeFaktorenAndere: (value: string) => void;
  setEingeschaetztePrognose: (value: FormTypes.EingeschaetztePrognose | null) => void;
  setPrognosetextFrei: (value: string) => void;

  // Clear all
  clearAllTherapieziele: () => void;
  clearAllBehandlungsplan: () => void;
  clearAllPrognose: () => void;
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

  // ============================================================================
  // SOMATISCHER BEFUND HANDLERS
  // ============================================================================

  const somatischerBefundHandlers: SomatischerBefundHandlers = useMemo(() => ({
    // Somato1: Somatische Vorerkrankungen + Konsiliarbericht
    somato1: {
      setSomatischeVorerkrankungen: (value: FormTypes.SomatischeVorerkrankungen | null) => {
        dispatch({ type: 'SET_SOMATISCHE_VORERKRANKUNGEN', value });
      },
      setKonsiliarbericht: (vorhanden: boolean, text?: string) => {
        dispatch({ type: 'SET_KONSILIARBERICHT', vorhanden, text });
      },
    },

    // Somato2: Medications
    somato2: {
      setKeineMedikation: (value: boolean) => {
        dispatch({ type: 'SET_KEINE_MEDIKATION', value });
      },
      addMedikament: () => {
        dispatch({ type: 'ADD_MEDIKAMENT' });
      },
      removeMedikament: (id: string) => {
        dispatch({ type: 'REMOVE_MEDIKAMENT', id });
      },
      updateMedikament: (id: string, updates: Partial<Omit<FormTypes.MedikamentEntry, 'id'>>) => {
        dispatch({ type: 'UPDATE_MEDIKAMENT', id, updates });
      },
    },

    // Somato3: Vorbehandlungen
    somato3: {
      setKeineVorbehandlung: (value: boolean) => {
        dispatch({ type: 'SET_KEINE_VORBEHANDLUNG', value });
      },
      addVorbehandlung: () => {
        dispatch({ type: 'ADD_VORBEHANDLUNG' });
      },
      removeVorbehandlung: (id: string) => {
        dispatch({ type: 'REMOVE_VORBEHANDLUNG', id });
      },
      updateVorbehandlung: (id: string, updates: Partial<Omit<FormTypes.VorbehandlungEntry, 'id'>>) => {
        dispatch({ type: 'UPDATE_VORBEHANDLUNG', id, updates });
      },
      setAktuelleBehandlung: (value: boolean | null) => {
        dispatch({ type: 'SET_AKTUELLE_BEHANDLUNG', value });
      },
      setZusatztext: (value: string) => {
        dispatch({ type: 'SET_SOMATO3_ZUSATZTEXT', value });
      },
    },

    // Somato4: Familienanamnese
    somato4: {
      setFamilienanamnese: (value: FormTypes.Familienanamnese | null) => {
        dispatch({ type: 'SET_FAMILIENANAMNESE', value });
      },
    },

    // Somato5: Suchtanamnese
    somato5: {
      setSuchtanamnese: (value: FormTypes.Suchtanamnese | null) => {
        dispatch({ type: 'SET_SUCHTANAMNESE', value });
      },
      setKeineSucht: (value: boolean) => {
        dispatch({ type: 'SET_KEINE_SUCHT', value });
      },
      // Alkohol
      setAlkoholData: (value: FormTypes.AlkoholData | null) => {
        dispatch({ type: 'SET_ALKOHOL_DATA', value });
      },
      setAlkoholHaeufigkeit: (value: FormTypes.Haeufigkeit) => {
        dispatch({ type: 'SET_ALKOHOL_HAEUFIGKEIT', value });
      },
      addAlkoholKonsum: (art: FormTypes.AlkoholArt) => {
        dispatch({ type: 'ADD_ALKOHOL_KONSUM', art });
      },
      removeAlkoholKonsum: (art: FormTypes.AlkoholArt) => {
        dispatch({ type: 'REMOVE_ALKOHOL_KONSUM', art });
      },
      updateAlkoholKonsum: (art: FormTypes.AlkoholArt, updates: Partial<Omit<FormTypes.AlkoholKonsumEntry, 'art'>>) => {
        dispatch({ type: 'UPDATE_ALKOHOL_KONSUM', art, updates });
      },
      // Nikotin
      addNikotinKonsum: (konsum: FormTypes.NikotinKonsum) => {
        dispatch({ type: 'ADD_NIKOTIN_KONSUM', konsum });
      },
      removeNikotinKonsum: (form: FormTypes.NikotinForm) => {
        dispatch({ type: 'REMOVE_NIKOTIN_KONSUM', form });
      },
      updateNikotinKonsum: (konsum: FormTypes.NikotinKonsum) => {
        dispatch({ type: 'UPDATE_NIKOTIN_KONSUM', konsum });
      },
      // THC
      setTHCData: (value: FormTypes.THCData | null) => {
        dispatch({ type: 'SET_THC_DATA', value });
      },
      // Illegale Drogen
      addIllegaleDroge: () => {
        dispatch({ type: 'ADD_ILLEGALE_DROGE' });
      },
      removeIllegaleDroge: (id: string) => {
        dispatch({ type: 'REMOVE_ILLEGALE_DROGE', id });
      },
      updateIllegaleDroge: (id: string, updates: Partial<Omit<FormTypes.IllegaleDrogenEntry, 'id'>>) => {
        dispatch({ type: 'UPDATE_ILLEGALE_DROGE', id, updates });
      },
      // Medikamenten-Missbrauch
      addMedikamentenMissbrauch: () => {
        dispatch({ type: 'ADD_MEDIKAMENTEN_MISSBRAUCH' });
      },
      removeMedikamentenMissbrauch: (id: string) => {
        dispatch({ type: 'REMOVE_MEDIKAMENTEN_MISSBRAUCH', id });
      },
      updateMedikamentenMissbrauch: (id: string, updates: Partial<Omit<FormTypes.MedikamentenMissbrauchEntry, 'id'>>) => {
        dispatch({ type: 'UPDATE_MEDIKAMENTEN_MISSBRAUCH', id, updates });
      },
      // Other
      setAndereSuchtform: (value: string) => {
        dispatch({ type: 'SET_ANDERE_SUCHTFORM', value });
      },
      setZusatztext: (value: string) => {
        dispatch({ type: 'SET_SOMATO5_ZUSATZTEXT', value });
      },
    },
  }), []);

  // ============================================================================
  // LEBENSGESCHICHTE HANDLERS
  // ============================================================================

  const lebensgeschichteHandlers: LebensgeschichteHandlers = useMemo(() => ({
    geschwister: {
      setKeineGeschwister: (value: boolean) => {
        dispatch({ type: 'SET_KEINE_GESCHWISTER', value });
      },
      add: () => {
        dispatch({ type: 'ADD_GESCHWISTER' });
      },
      remove: (id: string) => {
        dispatch({ type: 'REMOVE_GESCHWISTER', id });
      },
      update: (id: string, updates: Partial<Omit<FormTypes.GeschwisterEntry, 'id'>>) => {
        dispatch({ type: 'UPDATE_GESCHWISTER', id, updates });
      },
    },
    andereBezugspersonen: {
      add: () => {
        dispatch({ type: 'ADD_ANDERE_BEZUGSPERSON' });
      },
      remove: (id: string) => {
        dispatch({ type: 'REMOVE_ANDERE_BEZUGSPERSON', id });
      },
      update: (id: string, updates: Partial<Omit<FormTypes.AndereBezugspersonEntry, 'id'>>) => {
        dispatch({ type: 'UPDATE_ANDERE_BEZUGSPERSON', id, updates });
      },
    },
  }), []);

  // ============================================================================
  // FUNKTIONALES BEDINGUNGSMODELL HANDLERS
  // ============================================================================

  const funktionalesBedingungsmodellHandlers: FunktionalesBedingungsmodellHandlers = useMemo(() => ({
    addSorkcEntry: () => {
      dispatch({ type: 'ADD_SORKC_ENTRY' });
    },
    removeSorkcEntry: (id: string) => {
      dispatch({ type: 'REMOVE_SORKC_ENTRY', id });
    },
    updateSorkcEntry: (id: string, updates: Partial<Omit<FormTypes.SorkcEntry, 'id'>>) => {
      dispatch({ type: 'UPDATE_SORKC_ENTRY', id, updates });
    },
  }), []);

  // ============================================================================
  // MAKROANALYSE HANDLERS
  // ============================================================================

  const makroanalyseHandlers: MakroanalyseHandlers = useMemo(() => ({
    // Makroanalyse Intro
    updateMakroanalyseIntro: (updates: Partial<FormTypes.MakroanalyseIntro>) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'funktionalesBedingungsmodell.makroanalyseIntro',
        value: {
          ...state.formData.funktionalesBedingungsmodell.makroanalyseIntro,
          ...updates,
        },
      });
    },

    // Prädisponierende Faktoren
    updatePraedisponierendeFaktoren: (updates: Partial<FormTypes.PraedisponierendeFaktoren>) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'funktionalesBedingungsmodell.praedisponierendeFaktoren',
        value: {
          ...state.formData.funktionalesBedingungsmodell.praedisponierendeFaktoren,
          ...updates,
        },
      });
    },
    addGrundannahme: (text: string) => {
      const current = state.formData.funktionalesBedingungsmodell.praedisponierendeFaktoren;
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.plananalyse.grundannahmen',
        value: [...current.kognitivEmotional.plananalyse.grundannahmen, text],
      });
    },
    removeGrundannahme: (index: number) => {
      const current = state.formData.funktionalesBedingungsmodell.praedisponierendeFaktoren;
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.plananalyse.grundannahmen',
        value: current.kognitivEmotional.plananalyse.grundannahmen.filter((_, i) => i !== index),
      });
    },

    // Auslösende Bedingungen
    updateAusloesendeBedingungen: (updates: Partial<FormTypes.AusloesendeBedingungen>) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'funktionalesBedingungsmodell.ausloesendeBedingungen',
        value: {
          ...state.formData.funktionalesBedingungsmodell.ausloesendeBedingungen,
          ...updates,
        },
      });
    },
    setNichtEruiert: (value: boolean) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'funktionalesBedingungsmodell.ausloesendeBedingungen.nichtEruiert',
        value,
      });
    },

    // Aufrechterhaltende Bedingungen (7 sections)
    updateKognitiveFaktoren: (updates: Partial<FormTypes.KognitiveFaktorenData>) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'funktionalesBedingungsmodell.aufrechterhaltendeBedingungen.kognitiveFaktoren',
        value: {
          ...state.formData.funktionalesBedingungsmodell.aufrechterhaltendeBedingungen.kognitiveFaktoren,
          ...updates,
        },
      });
    },
    updateEmotionaleFaktoren: (updates: Partial<FormTypes.EmotionaleFaktorenData>) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'funktionalesBedingungsmodell.aufrechterhaltendeBedingungen.emotionaleFaktoren',
        value: {
          ...state.formData.funktionalesBedingungsmodell.aufrechterhaltendeBedingungen.emotionaleFaktoren,
          ...updates,
        },
      });
    },
    updateVerhaltensbezogeneFaktoren: (updates: Partial<FormTypes.VerhaltensbezogeneFaktorenData>) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'funktionalesBedingungsmodell.aufrechterhaltendeBedingungen.verhaltensbezogeneFaktoren',
        value: {
          ...state.formData.funktionalesBedingungsmodell.aufrechterhaltendeBedingungen.verhaltensbezogeneFaktoren,
          ...updates,
        },
      });
    },
    updateSelbstwertbezogeneFaktoren: (updates: Partial<FormTypes.SelbstwertbezogeneFaktorenData>) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'funktionalesBedingungsmodell.aufrechterhaltendeBedingungen.selbstwertbezogeneFaktoren',
        value: {
          ...state.formData.funktionalesBedingungsmodell.aufrechterhaltendeBedingungen.selbstwertbezogeneFaktoren,
          ...updates,
        },
      });
    },
    updateKompetenzdefizite: (updates: Partial<FormTypes.KompetenzdefiziteData>) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'funktionalesBedingungsmodell.aufrechterhaltendeBedingungen.kompetenzdefizite',
        value: {
          ...state.formData.funktionalesBedingungsmodell.aufrechterhaltendeBedingungen.kompetenzdefizite,
          ...updates,
        },
      });
    },
    updateSubstanzabhaengigkeit: (updates: Partial<FormTypes.SubstanzabhaengigkeitData>) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'funktionalesBedingungsmodell.aufrechterhaltendeBedingungen.substanzabhaengigkeit',
        value: {
          ...state.formData.funktionalesBedingungsmodell.aufrechterhaltendeBedingungen.substanzabhaengigkeit,
          ...updates,
        },
      });
    },
    updateWeitereFaktoren: (updates: Partial<FormTypes.WeitereAufrechterhaltendeFaktoren>) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'funktionalesBedingungsmodell.aufrechterhaltendeBedingungen.weitereFaktoren',
        value: {
          ...state.formData.funktionalesBedingungsmodell.aufrechterhaltendeBedingungen.weitereFaktoren,
          ...updates,
        },
      });
    },

    // Störungsspezifische Modelle
    addStoerungsmodell: (zuordnung: FormTypes.StoerungsmodellZuordnung, typ: FormTypes.StoerungsmodellTyp) => {
      dispatch({ type: 'ADD_STOERUNGSMODELL', zuordnung, typ });
    },
    removeStoerungsmodell: (id: string) => {
      dispatch({ type: 'REMOVE_STOERUNGSMODELL', id });
    },
    updateStoerungsmodell: (id: string, updates: Partial<FormTypes.StoerungsmodellData>) => {
      dispatch({ type: 'UPDATE_STOERUNGSMODELL', id, updates });
    },
  }), [state.formData.funktionalesBedingungsmodell]);

  // ============================================================================
  // KAPITEL 6: BEHANDLUNGSPLAN UND PROGNOSE HANDLERS
  // ============================================================================

  const kapitel6Handlers: Kapitel6Handlers = useMemo(() => ({
    // Therapieziele handlers
    toggleTherapieziel: (category: string, subcategory: string, item: string) => {
      dispatch({
        type: 'TOGGLE_SELECTION_FIELD',
        fieldPath: `kapitel6.therapieziele.${category}.${subcategory}`,
        value: item,
      });
    },
    setTherapiezielDetails: (category: string, subcategory: string, item: string, details: { brackets?: string; text?: string }) => {
      const current = state.formData.kapitel6.therapieziele;
      const categoryData = current[category as keyof typeof current] as unknown as Record<string, Record<string, unknown>>;
      const subcategoryData = categoryData?.[subcategory] as Record<string, unknown> || {};
      const existingEntry = subcategoryData[item] as { selected: boolean; details: Record<string, string> } | undefined;

      if (existingEntry?.selected) {
        dispatch({
          type: 'SET_NESTED_FIELD',
          fieldPath: `kapitel6.therapieziele.${category}.${subcategory}.${item}.details`,
          value: { ...existingEntry.details, ...details },
        });
      }
    },
    clearTherapiezieleCategory: (category: string) => {
      const emptyCategory = category === 'problemBewaeltigung'
        ? {
            depressivesErleben: {},
            selbstverletzen: {},
            aengste: {},
            zwaenge: {},
            trauma: {},
            sucht: {},
            essverhalten: {},
            schlaf: {},
            sexualitaet: {},
            koerperlich: {},
            lebensbereiche: {},
            stress: {},
          }
        : category === 'zwischenmenschlich'
        ? {
            partnerschaft: {},
            elternschaft: {},
            alleinsein: {},
            selbstbehauptung: {},
            kontaktNaehe: {},
          }
        : category === 'wohlbefinden'
        ? {
            bewegung: {},
            entspannung: {},
            wohlbefinden: {},
            zeitperspektive: {},
            sinnfindung: {},
          }
        : {
            selbsteinstellung: {},
            beduerfnisse: {},
            leistung: {},
            gefuehle: {},
          };
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: `kapitel6.therapieziele.${category}`,
        value: emptyCategory,
      });
    },

    // Behandlungsplan handlers
    toggleIntervention: (disorderType: string, item: string) => {
      dispatch({
        type: 'TOGGLE_SELECTION_FIELD',
        fieldPath: `kapitel6.behandlungsplan.${disorderType}`,
        value: item,
      });
    },
    setInterventionDetails: (disorderType: string, item: string, details: { brackets?: string; text?: string }) => {
      const current = state.formData.kapitel6.behandlungsplan;
      const categoryData = current[disorderType as keyof typeof current] as Record<string, unknown>;
      const existingEntry = categoryData?.[item] as { selected: boolean; details: Record<string, string> } | undefined;

      if (existingEntry?.selected) {
        dispatch({
          type: 'SET_NESTED_FIELD',
          fieldPath: `kapitel6.behandlungsplan.${disorderType}.${item}.details`,
          value: { ...existingEntry.details, ...details },
        });
      }
    },
    clearInterventionCategory: (disorderType: string) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: `kapitel6.behandlungsplan.${disorderType}`,
        value: {},
      });
    },

    // Begründung handlers
    setTherapieform: (value: FormTypes.TherapieformSetting | null) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'kapitel6.begruendungSetting.therapieform',
        value,
      });
    },
    setAnzahlSitzungen: (value: FormTypes.AnzahlSitzungen | null, andere?: number | null) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'kapitel6.begruendungSetting.anzahlSitzungen',
        value,
      });
      if (andere !== undefined) {
        dispatch({
          type: 'SET_NESTED_FIELD',
          fieldPath: 'kapitel6.begruendungSetting.anzahlSitzungenAndere',
          value: andere,
        });
      }
    },
    setSetting: (value: FormTypes.TherapieSetting | null) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'kapitel6.begruendungSetting.setting',
        value,
      });
    },
    toggleMitbehandler: (item: string) => {
      dispatch({
        type: 'TOGGLE_SELECTION_FIELD',
        fieldPath: 'kapitel6.begruendungSetting.mitbehandler',
        value: item,
      });
    },
    setMitbehandlerAndere: (value: string) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'kapitel6.begruendungSetting.mitbehandlerAndere',
        value,
      });
    },
    setBegruendungstext: (value: string) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'kapitel6.begruendungSetting.begruendungstext',
        value,
      });
    },

    // Prognose handlers
    toggleGuenstigerFaktor: (item: string) => {
      dispatch({
        type: 'TOGGLE_SELECTION_FIELD',
        fieldPath: 'kapitel6.prognose.guenstigeFaktoren',
        value: item,
      });
    },
    setGuenstigerFaktorDetails: (item: string, details: { brackets?: string; text?: string }) => {
      const current = state.formData.kapitel6.prognose.guenstigeFaktoren;
      const existingEntry = current[item as keyof typeof current] as { selected: boolean; details: Record<string, string> } | undefined;

      if (existingEntry?.selected) {
        dispatch({
          type: 'SET_NESTED_FIELD',
          fieldPath: `kapitel6.prognose.guenstigeFaktoren.${item}.details`,
          value: { ...existingEntry.details, ...details },
        });
      }
    },
    setGuenstigeFaktorenAndere: (value: string) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'kapitel6.prognose.guenstigeFaktorenAndere',
        value,
      });
    },
    toggleUnguenstigerFaktor: (item: string) => {
      dispatch({
        type: 'TOGGLE_SELECTION_FIELD',
        fieldPath: 'kapitel6.prognose.unguenstigeFaktoren',
        value: item,
      });
    },
    setUnguenstigerFaktorDetails: (item: string, details: { brackets?: string; text?: string }) => {
      const current = state.formData.kapitel6.prognose.unguenstigeFaktoren;
      const existingEntry = current[item as keyof typeof current] as { selected: boolean; details: Record<string, string> } | undefined;

      if (existingEntry?.selected) {
        dispatch({
          type: 'SET_NESTED_FIELD',
          fieldPath: `kapitel6.prognose.unguenstigeFaktoren.${item}.details`,
          value: { ...existingEntry.details, ...details },
        });
      }
    },
    setUnguenstigeFaktorenAndere: (value: string) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'kapitel6.prognose.unguenstigeFaktorenAndere',
        value,
      });
    },
    setEingeschaetztePrognose: (value: FormTypes.EingeschaetztePrognose | null) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'kapitel6.prognose.eingeschaetztePrognose',
        value,
      });
    },
    setPrognosetextFrei: (value: string) => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'kapitel6.prognose.prognosetextFrei',
        value,
      });
    },

    // Clear all functions
    clearAllTherapieziele: () => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'kapitel6.therapieziele',
        value: FormTypes.initialFormState.formData.kapitel6.therapieziele as unknown as Record<string, unknown>,
      });
    },
    clearAllBehandlungsplan: () => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'kapitel6.behandlungsplan',
        value: FormTypes.initialFormState.formData.kapitel6.behandlungsplan as unknown as Record<string, unknown>,
      });
    },
    clearAllPrognose: () => {
      dispatch({
        type: 'SET_NESTED_FIELD',
        fieldPath: 'kapitel6.prognose',
        value: FormTypes.initialFormState.formData.kapitel6.prognose as unknown as Record<string, unknown>,
      });
    },
  }), [state.formData.kapitel6]);

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
    clearTraumafolgesymptomatik: () => {
      setNestedField('traumafolgesymptomatik', {
        wiedererleben: {},
        vermeidungsverhalten: {},
        verhalten: {},
        uebererregung: {},
        somatovegetativ: {},
        emotionalesErleben: {},
        dissoziativ: {},
        kognition: {},
        anpassungsstoerung: {},
        andereSymptome: '',
      });
    },
    clearPsychotischeSymptomatik: () => {
      setNestedField('psychotischeSymptomatik', {
        formaleWahnmerkmale: {},
        inhaltlicheWahnmerkmale: {},
        akustischeHalluzination: { type: 'none' },
        andereHalluzinationen: {},
        ichHaftigkeit: {},
        ichStoerungAndere: {},
        formaleDenkstoerungen: {},
        emotionalesErleben: {},
        verhalten: {},
        kognition: {},
        katatoneSymptome: {},
        andereSymptome: '',
      });
    },
    clearOrganischeSymptomatik: () => {
      setNestedField('organischeSymptomatik', {
        quantitativeBewusstsein: null,
        qualitativeBewusstsein: null,
        attentional: {},
        mnestisch: {},
        exekutiv: {},
        sprachlich: {},
        denkstoerungen: {},
        orientierung: {},
        emotionsbezogen: {},
        amnestisch: {},
        basaleAlltagskompetenzen: {},
        instrumentelleAlltagskompetenzen: {},
        andereSymptome: '',
      });
    },
    clearSomatoformeSymptomatik: () => {
      setNestedField('somatoformeSymptomatik', {
        koerperlicheSymptome: {},
        autonomeSymptome: {},
        hypochondrischeSymptome: {},
        schmerzSymptome: {},
        konversionSymptome: {},
        andereSymptome: '',
      });
    },
    clearNichtorganischeSchlafstoerungen: () => {
      setNestedField('nichtorganischeSchlafstoerungen', {
        insomnie: {},
        hypersomnie: {},
        rhythmus: {},
        parasomnie: {},
        andereSymptome: '',
      });
    },
    clearEssstoerungen: () => {
      setNestedField('essstoerungen', {
        kognitiveSymptome: {},
        emotionaleSymptome: {},
        gewichtsregulierendeMassnahmen: {},
        anorexieSpezifisch: {},
        bulimieSpezifisch: {},
        bingeEatingSpezifisch: {},
        andereSymptome: '',
      });
    },
    clearSubstanzbezogeneSymptomatik: () => {
      setNestedField('substanzbezogeneSymptomatik', {
        abhaengigkeit: {},
        somatovegetativ: {},
        psychomotorik: {},
        verhalten: {},
        emotionalesErleben: {},
        schlaf: {},
        neurologisch: {},
        kognition: {},
        psychotisch: {},
        dissociativ: {},
        andereSymptome: '',
      });
    },
    clearDissociativeSymptomatik: () => {
      setNestedField('dissociativeSymptomatik', {
        amnesie: {},
        fugue: {},
        stupor: {},
        bewegungsstoerungen: {},
        krampfanfaelle: {},
        sensibilitaetsstoerungen: {},
        identitaetsstoerung: {},
        depersonalisationDerealisation: {},
        andereSymptome: '',
      });
    },
    clearPersoenlichkeitsstoerungen: () => {
      setNestedField('persoenlichkeitsstoerungen', {
        paranoide: {},
        schizoide: {},
        schizotype: {},
        antisoziale: {},
        impulsiverTyp: {},
        borderline: {},
        histrionische: {},
        narzisstische: {},
        vermeidend: {},
        dependente: {},
        zwanghafte: {},
        passivAggressiv: {},
        aenderungExtrembelastung: {},
        aenderungPsychKrankheit: {},
        andereSymptome: '',
      });
    },
    clearImpulskontrollstoerungen: () => {
      setNestedField('impulskontrollstoerungen', {
        pathologischesSpielen: {},
        pyromanie: {},
        kleptomanie: {},
        trichotillomanie: {},
        andereSymptome: '',
      });
    },
    clearSexuellbezogeneSymptome: () => {
      setNestedField('sexuellbezogeneSymptome', {
        funktionsstoerungen: {},
        praeferenzstoerungen: {},
        andereSymptome: '',
      });
    },
    clearGeschlechtsidentitaet: () => {
      setNestedField('geschlechtsidentitaet', {
        symptome: {},
        andereSymptome: '',
      });
    },
    clearHyperkinetischeStoerungen: () => {
      setNestedField('hyperkinetischeStoerungen', {
        attentional: {},
        hyperaktiv: {},
        impulsiv: {},
        andereSymptome: '',
      });
    },
    clearTicStoerungen: () => {
      setNestedField('ticStoerungen', {
        motorischeTics: {},
        vokaleTics: {},
        touretteSyndrom: false,
        andereSymptome: '',
      });
    },
    clearSuizidalitaetSymptomatik: () => {
      setNestedField('suizidalitaetSymptomatik', {
        symptome: {},
        andereSymptome: '',
      });
    },
    clearSonstigeSymptomatik: () => {
      setNestedField('sonstigeSymptomatik', {
        krankheitseinsichtCompliance: {},
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

  const setStep7SubStep = useCallback((substep: number) => {
    dispatch({ type: 'SET_STEP7_SUBSTEP', substep });
  }, []);

  // Form utilities

  const generateRandomData = useCallback(() => {
    const randomData = generateRandomFormData();
    dispatch({ type: 'SET_MULTIPLE_FIELDS', data: randomData });
    dispatch({ type: 'EXPAND_ALL_SECTIONS' });

    // Kinder is now handled as part of randomData.kinder (Kinder type)
    // No separate handling needed - it's set via SET_MULTIPLE_FIELDS
  }, []);

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
      krankheitsanamnese: formData.krankheitsanamnese,
      funktionalesBedingungsmodell: formData.funktionalesBedingungsmodell,
      kap5Diagnosen: formData.kap5Diagnosen,
    };
  }, [state]);

  const submitForm = useCallback(async () => {
    // Mark the final steps as completed to turn the entire progress bar green
    dispatch({ type: 'MARK_STEP_COMPLETED', step: 7 });
    dispatch({ type: 'MARK_STEP_COMPLETED', step: 8 });

    dispatch({ type: 'SET_LOADING', isLoading: true });

    try {
      // Use the already-generated preview text from the frontend
      // This avoids calling the backend API and uses the same text generation
      // that's shown in the live preview
      const result = generateAssessmentText(state.formData);
      const assessmentText = result.text;

      // Store in sessionStorage for the result page
      // TODO: In the future, replace this with a backend API call:
      //   const response = await fetch('/api/gutachten', {
      //     method: 'POST',
      //     body: JSON.stringify({ text: assessmentText, formData: state.formData })
      //   });
      //   const { id } = await response.json();
      //   window.location.href = `/gutachten-erstellen/ergebnis?id=${id}`;
      const gutachtenResult = {
        originalText: assessmentText,  // Never changes after creation
        currentText: assessmentText,   // Can be modified by AI improvement
        createdAt: Date.now(),
      };
      sessionStorage.setItem('gutachten-ergebnis', JSON.stringify(gutachtenResult));

      // Navigate to result page
      window.location.href = '/gutachten-erstellen/ergebnis';

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten';
      dispatch({ type: 'SET_ERROR', error: errorMessage });
    }
  }, [state.formData]);

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

    // Grouped handlers
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
    setStep7SubStep,

    // Form operations
    generateRandomData,
    submitForm,
    resetForm,
    clearSubmissionState,

    dispatch,
  };
}
