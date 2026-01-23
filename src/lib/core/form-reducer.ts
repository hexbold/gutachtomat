import * as FormTypes from './form-types';

/**
 * Form Reducer using generic field path handling.
 * Uses 12 action types instead of 70+ through dot notation paths.
 */

// --- Field Path Helpers ---

/** Get nested value using dot notation (e.g. 'f30f31.symptoms') */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj as unknown);
}

/** Set nested value immutably using dot notation */
function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split('.');
  if (keys.length === 1) {
    return { ...obj, [keys[0]]: value };
  }

  const [first, ...rest] = keys;
  const nested = obj[first];
  return {
    ...obj,
    [first]: setNestedValue(
      (nested && typeof nested === 'object' ? nested : {}) as Record<string, unknown>,
      rest.join('.'),
      value
    ),
  };
}

/** Toggle value in array at nested path (immutably) */
function toggleArrayValue(obj: Record<string, unknown>, path: string, value: string): Record<string, unknown> {
  const current = getNestedValue(obj, path);
  const currentArray = Array.isArray(current) ? current : [];
  const newArray = currentArray.includes(value)
    ? currentArray.filter((v: string) => v !== value)
    : [...currentArray, value];

  return setNestedValue(obj, path, newArray);
}

/** Toggle value in CardSelection (immutably) */
function toggleSelectionValue(obj: Record<string, unknown>, path: string, value: string): Record<string, unknown> {
  const current = getNestedValue(obj, path);
  const currentSelection = (current && typeof current === 'object' && !Array.isArray(current))
    ? current as Record<string, unknown>
    : {};

  // Check if value exists and has selected property (CardSelectionEntry pattern)
  const entry = currentSelection[value];
  if (entry && typeof entry === 'object' && (entry as Record<string, unknown>).selected) {
    const { [value]: _, ...rest } = currentSelection;
    return setNestedValue(obj, path, rest);
  } else {
    return setNestedValue(obj, path, { ...currentSelection, [value]: { selected: true, details: {} } });
  }
}

/** Check if value is empty (for merge operations) */
function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (value === '') return true;
  if (value === false) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  // Empty object check
  if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return true;
  return false;
}

/** Deep merge - only fills empty fields, never overwrites existing values */
function deepMerge(target: unknown, source: unknown): unknown {
  // If source is not an object, only use it if target is empty
  if (source === null || typeof source !== 'object') {
    return isEmptyValue(target) ? source : target;
  }

  // If source is an array, only replace if target array is empty
  if (Array.isArray(source)) {
    return (Array.isArray(target) && target.length > 0) ? target : source;
  }

  // If target is not an object, use source
  if (target === null || typeof target !== 'object' || Array.isArray(target)) {
    return source;
  }

  // Merge object properties recursively
  const result: Record<string, unknown> = { ...target as Record<string, unknown> };
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      result[key] = deepMerge((target as Record<string, unknown>)[key], (source as Record<string, unknown>)[key]);
    }
  }
  return result;
}

// --- Störungsmodell Data Factory ---

/** Creates initial data for a Störungsmodell based on its type */
function createInitialStoerungsmodellData(typ: FormTypes.StoerungsmodellTyp): FormTypes.StoerungsmodellData {
  switch (typ) {
    case FormTypes.StoerungsmodellTyp.VerstaerkerVerlustDepression:
      return {
        typ,
        data: {
          verlustPositiverVerstaerker: { selected: false, text: '' },
          mangelErreichbarkeitVerstaerker: { selected: false, text: '' },
          mangelPositiveErlebnisse: { selected: false, text: '' },
          mangelFertigkeiten: { selected: false, text: '' },
          reduzierteAktivitaet: { selected: false, text: '' },
          sozialeVerstaerkung: { selected: false, text: '' },
          sozialeIsolation: { selected: false, text: '' },
        },
      };
    case FormTypes.StoerungsmodellTyp.ErlernteHilflosigkeit:
      return {
        typ,
        data: {
          negativesErleben: '',
          wahrnehmungUnkontrollierbarkeit: '',
          depressiverAttributionsstil: '',
          erlernteHilflosigkeitEmotional: '',
          erlernteHilflosigkeitMotivational: '',
          erlernteHilflosigkeitKognitiv: '',
        },
      };
    case FormTypes.StoerungsmodellTyp.KognitionstheoretischDepression:
      return {
        typ,
        data: {
          externeInterneAusloeser: '',
          automatischeNegativeGedanken: '',
          dysfunktionaleGrundannahmen: '',
          depressiveSymptomatik: '',
        },
      };
    case FormTypes.StoerungsmodellTyp.TeufelskreisAngst:
      return {
        typ,
        data: {
          ausloesendeSituation: '',
          wahrnehmungKoerperlich: '',
          dysfunktionaleBewertung: '',
          gefuehlAngst: '',
          physiologischeAktivierung: '',
          verstaerkungKoerperlich: '',
          vermeidungsverhalten: '',
        },
      };
    case FormTypes.StoerungsmodellTyp.TeufelskreisZwangserkrankung:
      return {
        typ,
        data: {
          aufdringlicherGedanke: '',
          fehlbewertung: '',
          emotionaleReaktion: '',
          offeneZwangshandlung: '',
          verdeckteZwangshandlung: '',
          gedankenunterdrueckung: '',
          vermeidung: '',
          rueckversicherung: '',
          neutralisierendeZwangshandlungen: '',
        },
      };
    case FormTypes.StoerungsmodellTyp.TeufelskreisZwangshandlungen:
      return {
        typ,
        data: {
          externeInterneAusloeser: '',
          dysfunktionaleGrundannahmen: '',
          zwangsbefuerchtung: '',
          zwangshandlung: '',
          zwangshandlungAufrechterhaltung: '',
        },
      };
    case FormTypes.StoerungsmodellTyp.TeufelskreisBulimie:
      return {
        typ,
        data: {
          fixierungKoerpergewicht: '',
          nahrungsrestriktion: '',
          unterzuckerung: '',
          heisshungeranfall: '',
          ekelSchamAngst: '',
          erbrechen: '',
        },
      };
    case FormTypes.StoerungsmodellTyp.ZweiFaktorenZwang:
      return {
        typ,
        data: {
          klassischeKonditionierung: '',
          operanteKonditionierung: '',
        },
      };
    case FormTypes.StoerungsmodellTyp.DreiFaktorenGAS:
      return {
        typ,
        data: {
          praedisponierendVeranlagung: false,
          praedisponierendLernerfahrungen: false,
          praedisponierendSelbstwirksamkeit: false,
          praedisponierendProblemloesung: false,
          praedisponierendGrundannahmen: false,
          ausloesendAnforderungen: false,
          ausloesendBelastungen: false,
          ausloesendMehrereFaktoren: false,
          aufrechterhaltendGruebeln: false,
          aufrechterhaltendGedankenstopp: false,
          aufrechterhaltendAblenkung: false,
          aufrechterhaltendKognitiveVermeidung: false,
          aufrechterhaltendSorgenketten: false,
          aufrechterhaltendGedankenStattBilder: false,
          aufrechterhaltendOffeneVermeidung: false,
          aufrechterhaltendAufmerksamkeitBedrohlich: false,
          aufrechterhaltendGefahrenbezogeneInterpretation: false,
          aufrechterhaltendKonzentrationsprobleme: false,
          aufrechterhaltendVerringerungLeistung: false,
        },
      };
    case FormTypes.StoerungsmodellTyp.KognitivSozialePhobie:
      return {
        typ,
        data: {
          negativesSelbst: '',
          erhoehtesSelbstaufmerksamkeit: '',
          fehlattribution: '',
          sicherheitsverhalten: '',
          uebermaessigeVorbereitung: '',
          antizipatorischeVerhinderung: '',
          antizipatorischeVorbeugung: '',
          versucheWirkungKontrollieren: '',
        },
      };
    case FormTypes.StoerungsmodellTyp.BiopsychosozialBorderline:
      return {
        typ,
        data: {
          sozialChronischeInvalidierung: false,
          sozialMissbrauch: false,
          sozialTraumata: false,
          sozialUngueinstigeBedingungen: false,
          biologischErhohtesErregungsniveau: false,
          biologischErhoehteImpulsivitaet: false,
          stoerungEmotionsregulationIntensiv: false,
          stoerungEmotionsregulationUnkontrollierbar: false,
          stoerungEmotionsregulationEmotionsphobie: false,
          stoerungEmotionsregulationDysfunktional: false,
        },
      };
    case FormTypes.StoerungsmodellTyp.FreitextModell:
      return {
        typ,
        data: {
          inhalt: '',
        },
      };
  }
}

// --- Main Reducer ---

export function formReducer(state: FormTypes.GutachtenFormState, action: FormTypes.FormAction): FormTypes.GutachtenFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
        submission: {
          ...state.submission,
          error: null,
        },
      };

    case 'SET_MULTIPLE_FIELDS':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.data,
        },
        submission: {
          ...state.submission,
          error: null,
        },
      };

    case 'SET_NESTED_FIELD':
      return {
        ...state,
        formData: setNestedValue(state.formData as unknown as Record<string, unknown>, action.fieldPath, action.value) as unknown as typeof state.formData,
        submission: {
          ...state.submission,
          error: null,
        },
      };

    case 'SET_NESTED_BOOLEAN':
      return {
        ...state,
        formData: setNestedValue(state.formData as unknown as Record<string, unknown>, action.fieldPath, action.value) as unknown as typeof state.formData,
        submission: {
          ...state.submission,
          error: null,
        },
      };

    case 'TOGGLE_ARRAY_FIELD':
      return {
        ...state,
        formData: toggleArrayValue(state.formData as unknown as Record<string, unknown>, action.fieldPath, action.value) as unknown as typeof state.formData,
        submission: {
          ...state.submission,
          error: null,
        },
      };

    case 'TOGGLE_SELECTION_FIELD':
      return {
        ...state,
        formData: toggleSelectionValue(state.formData as unknown as Record<string, unknown>, action.fieldPath, action.value) as unknown as typeof state.formData,
        submission: {
          ...state.submission,
          error: null,
        },
      };

    case 'SET_KINDER':
      return {
        ...state,
        formData: {
          ...state.formData,
          kinder: action.value,
        },
        submission: {
          ...state.submission,
          error: null,
        },
      };

    case 'SET_WOHNSITUATION':
      return {
        ...state,
        formData: {
          ...state.formData,
          wohnsituation: action.value,
        },
        submission: {
          ...state.submission,
          error: null,
        },
      };

    // ============================================================================
    // SOMATO1: Somatische Vorerkrankungen + Konsiliarbericht
    // ============================================================================

    case 'SET_SOMATISCHE_VORERKRANKUNGEN':
      return {
        ...state,
        formData: {
          ...state.formData,
          somato1: {
            ...state.formData.somato1,
            somatischeVorerkrankungen: action.value,
          },
        },
        submission: { ...state.submission, error: null },
      };

    case 'SET_KONSILIARBERICHT':
      return {
        ...state,
        formData: {
          ...state.formData,
          somato1: {
            ...state.formData.somato1,
            konsiliarberichtVorhanden: action.vorhanden,
            konsiliarberichtText: action.text ?? state.formData.somato1.konsiliarberichtText,
          },
        },
        submission: { ...state.submission, error: null },
      };

    // ============================================================================
    // SOMATO2: Medications Array
    // ============================================================================

    case 'SET_KEINE_MEDIKATION':
      return {
        ...state,
        formData: {
          ...state.formData,
          somato2: {
            ...state.formData.somato2,
            keineMedikation: action.value,
            // Clear medications when "keine Medikation" is selected
            medikamente: action.value ? [] : state.formData.somato2.medikamente,
          },
        },
        submission: { ...state.submission, error: null },
      };

    case 'ADD_MEDIKAMENT':
      return {
        ...state,
        formData: {
          ...state.formData,
          somato2: {
            ...state.formData.somato2,
            keineMedikation: false, // Adding medication clears "keine" flag
            medikamente: [
              ...state.formData.somato2.medikamente,
              {
                id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                praeparat: '',
                kategorie: null,
                subkategorie: null,
                dosierung: null,
                einnahmeSeit: null,
                verordnung: null,
              },
            ],
          },
        },
        submission: { ...state.submission, error: null },
      };

    case 'REMOVE_MEDIKAMENT':
      return {
        ...state,
        formData: {
          ...state.formData,
          somato2: {
            ...state.formData.somato2,
            medikamente: state.formData.somato2.medikamente.filter(
              (med) => med.id !== action.id
            ),
          },
        },
        submission: { ...state.submission, error: null },
      };

    case 'UPDATE_MEDIKAMENT':
      return {
        ...state,
        formData: {
          ...state.formData,
          somato2: {
            ...state.formData.somato2,
            medikamente: state.formData.somato2.medikamente.map((med) =>
              med.id === action.id
                ? { ...med, ...action.updates }
                : med
            ),
          },
        },
        submission: { ...state.submission, error: null },
      };

    // ============================================================================
    // SOMATO3: Vorbehandlungen Array
    // ============================================================================

    case 'SET_KEINE_VORBEHANDLUNG':
      return {
        ...state,
        formData: {
          ...state.formData,
          somato3: {
            ...state.formData.somato3,
            keineVorbehandlung: action.value,
            // Clear treatments when "keine Vorbehandlung" is selected
            vorbehandlungen: action.value ? [] : state.formData.somato3.vorbehandlungen,
          },
        },
        submission: { ...state.submission, error: null },
      };

    case 'ADD_VORBEHANDLUNG':
      return {
        ...state,
        formData: {
          ...state.formData,
          somato3: {
            ...state.formData.somato3,
            keineVorbehandlung: false, // Adding treatment clears "keine" flag
            vorbehandlungen: [
              ...state.formData.somato3.vorbehandlungen,
              {
                id: `vorb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                art: null,
                setting: null,
                zeitraum: { von: null, bis: null, textBeschreibung: '' },
                ort: '',
                abschlussberichte: null,
              },
            ],
          },
        },
        submission: { ...state.submission, error: null },
      };

    case 'REMOVE_VORBEHANDLUNG':
      return {
        ...state,
        formData: {
          ...state.formData,
          somato3: {
            ...state.formData.somato3,
            vorbehandlungen: state.formData.somato3.vorbehandlungen.filter(
              (vorb) => vorb.id !== action.id
            ),
          },
        },
        submission: { ...state.submission, error: null },
      };

    case 'UPDATE_VORBEHANDLUNG':
      return {
        ...state,
        formData: {
          ...state.formData,
          somato3: {
            ...state.formData.somato3,
            vorbehandlungen: state.formData.somato3.vorbehandlungen.map((vorb) =>
              vorb.id === action.id
                ? { ...vorb, ...action.updates }
                : vorb
            ),
          },
        },
        submission: { ...state.submission, error: null },
      };

    case 'SET_AKTUELLE_BEHANDLUNG':
      return {
        ...state,
        formData: {
          ...state.formData,
          somato3: {
            ...state.formData.somato3,
            aktuelleBehandlung: action.value,
          },
        },
        submission: { ...state.submission, error: null },
      };

    case 'SET_SOMATO3_ZUSATZTEXT':
      return {
        ...state,
        formData: {
          ...state.formData,
          somato3: {
            ...state.formData.somato3,
            zusatztext: action.value,
          },
        },
        submission: { ...state.submission, error: null },
      };

    // ============================================================================
    // SOMATO4: Familienanamnese
    // ============================================================================

    case 'SET_FAMILIENANAMNESE':
      return {
        ...state,
        formData: {
          ...state.formData,
          somato4: {
            familienanamnese: action.value,
          },
        },
        submission: { ...state.submission, error: null },
      };

    // ============================================================================
    // SOMATO5: Suchtanamnese
    // ============================================================================

    case 'SET_SUCHTANAMNESE':
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            suchtanamnese: action.value,
          },
        },
        submission: { ...state.submission, error: null },
      };

    case 'SET_KEINE_SUCHT': {
      if (action.value) {
        // Set to "keine Sucht" - discriminated union
        return {
          ...state,
          formData: {
            ...state.formData,
            somato5: {
              suchtanamnese: { keineSucht: true },
            },
          },
          submission: { ...state.submission, error: null },
        };
      } else {
        // Initialize with empty consumption data
        return {
          ...state,
          formData: {
            ...state.formData,
            somato5: {
              suchtanamnese: {
                keineSucht: false,
                konsum: {
                  alkohol: null,
                  nikotin: null,
                  thc: null,
                  illegaleDrogen: [],
                  medikamentenMissbrauch: [],
                  andereSuchtform: '',
                  zusatztext: '',
                },
              },
            },
          },
          submission: { ...state.submission, error: null },
        };
      }
    }

    case 'SET_ALKOHOL_DATA': {
      const currentSucht = state.formData.somato5.suchtanamnese;
      if (!currentSucht || currentSucht.keineSucht) return state; // Guard: don't modify if null or keineSucht
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            suchtanamnese: {
              ...currentSucht,
              konsum: {
                ...currentSucht.konsum,
                alkohol: action.value,
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'SET_ALKOHOL_HAEUFIGKEIT': {
      const currentSucht = state.formData.somato5.suchtanamnese;
      if (!currentSucht || currentSucht.keineSucht || !currentSucht.konsum.alkohol) return state;
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            suchtanamnese: {
              ...currentSucht,
              konsum: {
                ...currentSucht.konsum,
                alkohol: {
                  ...currentSucht.konsum.alkohol,
                  haeufigkeit: action.value,
                },
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'ADD_ALKOHOL_KONSUM': {
      const currentSucht = state.formData.somato5.suchtanamnese;
      if (!currentSucht || currentSucht.keineSucht) return state;
      const currentAlkohol = currentSucht.konsum.alkohol;
      const newEntry: FormTypes.AlkoholKonsumEntry = {
        art: action.art,
        mengeLiter: null,
        mengeGlaeser: null,
      };
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            suchtanamnese: {
              ...currentSucht,
              konsum: {
                ...currentSucht.konsum,
                alkohol: currentAlkohol
                  ? { ...currentAlkohol, konsumArten: [...currentAlkohol.konsumArten, newEntry] }
                  : { konsumArten: [newEntry], haeufigkeit: { typ: FormTypes.KonsumHaeufigkeit.Gelegentlich } },
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'REMOVE_ALKOHOL_KONSUM': {
      const currentSucht = state.formData.somato5.suchtanamnese;
      if (!currentSucht || currentSucht.keineSucht || !currentSucht.konsum.alkohol) return state;
      const filteredKonsum = currentSucht.konsum.alkohol.konsumArten.filter(k => k.art !== action.art);
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            suchtanamnese: {
              ...currentSucht,
              konsum: {
                ...currentSucht.konsum,
                alkohol: filteredKonsum.length > 0
                  ? { ...currentSucht.konsum.alkohol, konsumArten: filteredKonsum }
                  : null,
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'UPDATE_ALKOHOL_KONSUM': {
      const currentSucht = state.formData.somato5.suchtanamnese;
      if (!currentSucht || currentSucht.keineSucht || !currentSucht.konsum.alkohol) return state;
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            suchtanamnese: {
              ...currentSucht,
              konsum: {
                ...currentSucht.konsum,
                alkohol: {
                  ...currentSucht.konsum.alkohol,
                  konsumArten: currentSucht.konsum.alkohol.konsumArten.map(k =>
                    k.art === action.art ? { ...k, ...action.updates } : k
                  ),
                },
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'ADD_NIKOTIN_KONSUM': {
      const currentSucht = state.formData.somato5.suchtanamnese;
      if (!currentSucht || currentSucht.keineSucht) return state;
      const currentNikotin = currentSucht.konsum.nikotin ?? [];
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            suchtanamnese: {
              ...currentSucht,
              konsum: {
                ...currentSucht.konsum,
                nikotin: [...currentNikotin, action.konsum],
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'REMOVE_NIKOTIN_KONSUM': {
      const currentSucht = state.formData.somato5.suchtanamnese;
      if (!currentSucht || currentSucht.keineSucht || !currentSucht.konsum.nikotin) return state;
      const filteredNikotin = currentSucht.konsum.nikotin.filter(n => n.form !== action.form);
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            suchtanamnese: {
              ...currentSucht,
              konsum: {
                ...currentSucht.konsum,
                nikotin: filteredNikotin.length > 0 ? filteredNikotin : null,
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'UPDATE_NIKOTIN_KONSUM': {
      const currentSucht = state.formData.somato5.suchtanamnese;
      if (!currentSucht || currentSucht.keineSucht || !currentSucht.konsum.nikotin) return state;
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            suchtanamnese: {
              ...currentSucht,
              konsum: {
                ...currentSucht.konsum,
                nikotin: currentSucht.konsum.nikotin.map(n =>
                  n.form === action.konsum.form ? action.konsum : n
                ),
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'SET_THC_DATA': {
      const currentSucht = state.formData.somato5.suchtanamnese;
      if (!currentSucht || currentSucht.keineSucht) return state;
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            suchtanamnese: {
              ...currentSucht,
              konsum: {
                ...currentSucht.konsum,
                thc: action.value,
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'ADD_ILLEGALE_DROGE': {
      const currentSucht = state.formData.somato5.suchtanamnese;
      if (!currentSucht || currentSucht.keineSucht) return state;
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            suchtanamnese: {
              ...currentSucht,
              konsum: {
                ...currentSucht.konsum,
                illegaleDrogen: [
                  ...currentSucht.konsum.illegaleDrogen,
                  {
                    id: `droge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    suchtmittel: '',
                    menge: null,
                    mengeEinheit: FormTypes.MengeEinheit.Gramm,
                    haeufigkeit: { typ: FormTypes.KonsumHaeufigkeit.Gelegentlich },
                  },
                ],
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'REMOVE_ILLEGALE_DROGE': {
      const currentSucht = state.formData.somato5.suchtanamnese;
      if (!currentSucht || currentSucht.keineSucht) return state;
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            suchtanamnese: {
              ...currentSucht,
              konsum: {
                ...currentSucht.konsum,
                illegaleDrogen: currentSucht.konsum.illegaleDrogen.filter(
                  (droge) => droge.id !== action.id
                ),
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'UPDATE_ILLEGALE_DROGE': {
      const currentSucht = state.formData.somato5.suchtanamnese;
      if (!currentSucht || currentSucht.keineSucht) return state;
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            suchtanamnese: {
              ...currentSucht,
              konsum: {
                ...currentSucht.konsum,
                illegaleDrogen: currentSucht.konsum.illegaleDrogen.map((droge) =>
                  droge.id === action.id
                    ? { ...droge, ...action.updates }
                    : droge
                ),
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'ADD_MEDIKAMENTEN_MISSBRAUCH': {
      const currentSucht = state.formData.somato5.suchtanamnese;
      if (!currentSucht || currentSucht.keineSucht) return state;
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            suchtanamnese: {
              ...currentSucht,
              konsum: {
                ...currentSucht.konsum,
                medikamentenMissbrauch: [
                  ...currentSucht.konsum.medikamentenMissbrauch,
                  {
                    id: `medmiss-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    substanz: '',
                    menge: null,
                    mengeEinheit: FormTypes.MengeEinheit.Milligramm,
                    haeufigkeit: { typ: FormTypes.KonsumHaeufigkeit.Gelegentlich },
                  },
                ],
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'REMOVE_MEDIKAMENTEN_MISSBRAUCH': {
      const currentSucht = state.formData.somato5.suchtanamnese;
      if (!currentSucht || currentSucht.keineSucht) return state;
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            suchtanamnese: {
              ...currentSucht,
              konsum: {
                ...currentSucht.konsum,
                medikamentenMissbrauch: currentSucht.konsum.medikamentenMissbrauch.filter(
                  (entry) => entry.id !== action.id
                ),
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'UPDATE_MEDIKAMENTEN_MISSBRAUCH': {
      const currentSucht = state.formData.somato5.suchtanamnese;
      if (!currentSucht || currentSucht.keineSucht) return state;
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            suchtanamnese: {
              ...currentSucht,
              konsum: {
                ...currentSucht.konsum,
                medikamentenMissbrauch: currentSucht.konsum.medikamentenMissbrauch.map((entry) =>
                  entry.id === action.id
                    ? { ...entry, ...action.updates }
                    : entry
                ),
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'SET_ANDERE_SUCHTFORM': {
      const currentSucht = state.formData.somato5.suchtanamnese;
      if (!currentSucht || currentSucht.keineSucht) return state;
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            suchtanamnese: {
              ...currentSucht,
              konsum: {
                ...currentSucht.konsum,
                andereSuchtform: action.value,
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'SET_SOMATO5_ZUSATZTEXT': {
      const currentSucht = state.formData.somato5.suchtanamnese;
      if (!currentSucht || currentSucht.keineSucht) return state;
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            suchtanamnese: {
              ...currentSucht,
              konsum: {
                ...currentSucht.konsum,
                zusatztext: action.value,
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    // ============================================================================
    // LEBENSGESCHICHTE: Geschwister Operations
    // ============================================================================

    case 'SET_KEINE_GESCHWISTER': {
      return {
        ...state,
        formData: {
          ...state.formData,
          lebensgA: {
            ...state.formData.lebensgA,
            kurzeBiographischeEinordnung: {
              ...state.formData.lebensgA.kurzeBiographischeEinordnung,
              geschwister: action.value
                ? { keineGeschwister: true }
                : { keineGeschwister: false, liste: [] },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'ADD_GESCHWISTER': {
      const currentGeschwister = state.formData.lebensgA.kurzeBiographischeEinordnung.geschwister;
      if (currentGeschwister.keineGeschwister) {
        // Switch to having siblings
        return {
          ...state,
          formData: {
            ...state.formData,
            lebensgA: {
              ...state.formData.lebensgA,
              kurzeBiographischeEinordnung: {
                ...state.formData.lebensgA.kurzeBiographischeEinordnung,
                geschwister: {
                  keineGeschwister: false,
                  liste: [{
                    id: `ges-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    geburtsjahr: '',
                    geschlecht: null,
                    beziehung: '',
                  }],
                },
              },
            },
          },
          submission: { ...state.submission, error: null },
        };
      }
      return {
        ...state,
        formData: {
          ...state.formData,
          lebensgA: {
            ...state.formData.lebensgA,
            kurzeBiographischeEinordnung: {
              ...state.formData.lebensgA.kurzeBiographischeEinordnung,
              geschwister: {
                keineGeschwister: false,
                liste: [
                  ...currentGeschwister.liste,
                  {
                    id: `ges-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    geburtsjahr: '',
                    geschlecht: null,
                    beziehung: '',
                  },
                ],
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'REMOVE_GESCHWISTER': {
      const currentGeschwister = state.formData.lebensgA.kurzeBiographischeEinordnung.geschwister;
      if (currentGeschwister.keineGeschwister) return state;
      return {
        ...state,
        formData: {
          ...state.formData,
          lebensgA: {
            ...state.formData.lebensgA,
            kurzeBiographischeEinordnung: {
              ...state.formData.lebensgA.kurzeBiographischeEinordnung,
              geschwister: {
                keineGeschwister: false,
                liste: currentGeschwister.liste.filter(g => g.id !== action.id),
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'UPDATE_GESCHWISTER': {
      const currentGeschwister = state.formData.lebensgA.kurzeBiographischeEinordnung.geschwister;
      if (currentGeschwister.keineGeschwister) return state;
      return {
        ...state,
        formData: {
          ...state.formData,
          lebensgA: {
            ...state.formData.lebensgA,
            kurzeBiographischeEinordnung: {
              ...state.formData.lebensgA.kurzeBiographischeEinordnung,
              geschwister: {
                keineGeschwister: false,
                liste: currentGeschwister.liste.map(g =>
                  g.id === action.id ? { ...g, ...action.updates } : g
                ),
              },
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    // ============================================================================
    // LEBENSGESCHICHTE: Andere Bezugspersonen Operations
    // ============================================================================

    case 'ADD_ANDERE_BEZUGSPERSON': {
      return {
        ...state,
        formData: {
          ...state.formData,
          lebensgA: {
            ...state.formData.lebensgA,
            kurzeBiographischeEinordnung: {
              ...state.formData.lebensgA.kurzeBiographischeEinordnung,
              andereBezugspersonen: [
                ...state.formData.lebensgA.kurzeBiographischeEinordnung.andereBezugspersonen,
                {
                  id: `bezug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  wer: '',
                  geburtsjahr: '',
                  geschlecht: null,
                  beziehung: '',
                },
              ],
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'REMOVE_ANDERE_BEZUGSPERSON': {
      return {
        ...state,
        formData: {
          ...state.formData,
          lebensgA: {
            ...state.formData.lebensgA,
            kurzeBiographischeEinordnung: {
              ...state.formData.lebensgA.kurzeBiographischeEinordnung,
              andereBezugspersonen: state.formData.lebensgA.kurzeBiographischeEinordnung.andereBezugspersonen.filter(
                b => b.id !== action.id
              ),
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'UPDATE_ANDERE_BEZUGSPERSON': {
      return {
        ...state,
        formData: {
          ...state.formData,
          lebensgA: {
            ...state.formData.lebensgA,
            kurzeBiographischeEinordnung: {
              ...state.formData.lebensgA.kurzeBiographischeEinordnung,
              andereBezugspersonen: state.formData.lebensgA.kurzeBiographischeEinordnung.andereBezugspersonen.map(
                b => b.id === action.id ? { ...b, ...action.updates } : b
              ),
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    // ============================================================================
    // FUNKTIONALES BEDINGUNGSMODELL: SORKC Operations
    // ============================================================================

    case 'ADD_SORKC_ENTRY': {
      const newEntry: FormTypes.SorkcEntry = {
        id: `sorkc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        titel: '',
        typischeStimuli: '',
        situationExtern: '',
        situationIntern: '',
        organismus: '',
        reaktionKognitiv: '',
        reaktionEmotional: '',
        reaktionPhysiologisch: '',
        reaktionBehavioral: '',
        konsequenzKurzfristigPositiveVerstaerkung: '',
        konsequenzKurzfristigNegativeVerstaerkung: '',
        konsequenzKurzfristigPositiveBestrafung: '',
        konsequenzKurzfristigNegativeBestrafung: '',
        konsequenzLangfristigPositiveVerstaerkung: '',
        konsequenzLangfristigNegativeVerstaerkung: '',
        konsequenzLangfristigPositiveBestrafung: '',
        konsequenzLangfristigNegativeBestrafung: '',
      };
      return {
        ...state,
        formData: {
          ...state.formData,
          funktionalesBedingungsmodell: {
            ...state.formData.funktionalesBedingungsmodell,
            sorkcEntries: [
              ...state.formData.funktionalesBedingungsmodell.sorkcEntries,
              newEntry,
            ],
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'REMOVE_SORKC_ENTRY': {
      return {
        ...state,
        formData: {
          ...state.formData,
          funktionalesBedingungsmodell: {
            ...state.formData.funktionalesBedingungsmodell,
            sorkcEntries: state.formData.funktionalesBedingungsmodell.sorkcEntries.filter(
              entry => entry.id !== action.id
            ),
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'UPDATE_SORKC_ENTRY': {
      return {
        ...state,
        formData: {
          ...state.formData,
          funktionalesBedingungsmodell: {
            ...state.formData.funktionalesBedingungsmodell,
            sorkcEntries: state.formData.funktionalesBedingungsmodell.sorkcEntries.map(
              entry => entry.id === action.id ? { ...entry, ...action.updates } : entry
            ),
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    // ============================================================================
    // STÖRUNGSSPEZIFISCHE MODELLE
    // ============================================================================

    case 'ADD_STOERUNGSMODELL': {
      const newEntry: FormTypes.StoerungsmodellEntry = {
        id: `modell-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        modell: createInitialStoerungsmodellData(action.typ),
      };
      const fbm = state.formData.funktionalesBedingungsmodell;

      // Add to the correct section based on zuordnung
      switch (action.zuordnung) {
        case FormTypes.StoerungsmodellZuordnung.Praedisponierend:
          return {
            ...state,
            formData: {
              ...state.formData,
              funktionalesBedingungsmodell: {
                ...fbm,
                praedisponierendeFaktoren: {
                  ...fbm.praedisponierendeFaktoren,
                  stoerungsmodelle: [...fbm.praedisponierendeFaktoren.stoerungsmodelle, newEntry],
                },
              },
            },
            submission: { ...state.submission, error: null },
          };
        case FormTypes.StoerungsmodellZuordnung.Ausloesend:
          return {
            ...state,
            formData: {
              ...state.formData,
              funktionalesBedingungsmodell: {
                ...fbm,
                ausloesendeBedingungen: {
                  ...fbm.ausloesendeBedingungen,
                  stoerungsmodelle: [...fbm.ausloesendeBedingungen.stoerungsmodelle, newEntry],
                },
              },
            },
            submission: { ...state.submission, error: null },
          };
        case FormTypes.StoerungsmodellZuordnung.Aufrechterhaltend:
          return {
            ...state,
            formData: {
              ...state.formData,
              funktionalesBedingungsmodell: {
                ...fbm,
                aufrechterhaltendeBedingungen: {
                  ...fbm.aufrechterhaltendeBedingungen,
                  stoerungsmodelle: [...fbm.aufrechterhaltendeBedingungen.stoerungsmodelle, newEntry],
                },
              },
            },
            submission: { ...state.submission, error: null },
          };
        default:
          return state;
      }
    }

    case 'REMOVE_STOERUNGSMODELL': {
      const fbm = state.formData.funktionalesBedingungsmodell;
      return {
        ...state,
        formData: {
          ...state.formData,
          funktionalesBedingungsmodell: {
            ...fbm,
            praedisponierendeFaktoren: {
              ...fbm.praedisponierendeFaktoren,
              stoerungsmodelle: fbm.praedisponierendeFaktoren.stoerungsmodelle.filter(
                entry => entry.id !== action.id
              ),
            },
            ausloesendeBedingungen: {
              ...fbm.ausloesendeBedingungen,
              stoerungsmodelle: fbm.ausloesendeBedingungen.stoerungsmodelle.filter(
                entry => entry.id !== action.id
              ),
            },
            aufrechterhaltendeBedingungen: {
              ...fbm.aufrechterhaltendeBedingungen,
              stoerungsmodelle: fbm.aufrechterhaltendeBedingungen.stoerungsmodelle.filter(
                entry => entry.id !== action.id
              ),
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'UPDATE_STOERUNGSMODELL': {
      const fbm = state.formData.funktionalesBedingungsmodell;
      const updateEntry = (entry: FormTypes.StoerungsmodellEntry) =>
        entry.id === action.id
          ? { ...entry, modell: { ...entry.modell, ...action.updates } as FormTypes.StoerungsmodellData }
          : entry;

      return {
        ...state,
        formData: {
          ...state.formData,
          funktionalesBedingungsmodell: {
            ...fbm,
            praedisponierendeFaktoren: {
              ...fbm.praedisponierendeFaktoren,
              stoerungsmodelle: fbm.praedisponierendeFaktoren.stoerungsmodelle.map(updateEntry),
            },
            ausloesendeBedingungen: {
              ...fbm.ausloesendeBedingungen,
              stoerungsmodelle: fbm.ausloesendeBedingungen.stoerungsmodelle.map(updateEntry),
            },
            aufrechterhaltendeBedingungen: {
              ...fbm.aufrechterhaltendeBedingungen,
              stoerungsmodelle: fbm.aufrechterhaltendeBedingungen.stoerungsmodelle.map(updateEntry),
            },
          },
        },
        submission: { ...state.submission, error: null },
      };
    }

    case 'ADD_DIAGNOSIS':
      return {
        ...state,
        formData: {
          ...state.formData,
          kap5Diagnosen: {
            selectedDiagnoses: [
              ...state.formData.kap5Diagnosen.selectedDiagnoses,
              {
                code: action.code,
                name: action.name,
                sicherheit: null,
              },
            ],
          },
        },
        submission: {
          ...state.submission,
          error: null,
        },
      };

    case 'REMOVE_DIAGNOSIS':
      return {
        ...state,
        formData: {
          ...state.formData,
          kap5Diagnosen: {
            selectedDiagnoses: state.formData.kap5Diagnosen.selectedDiagnoses.filter(
              (d) => d.code !== action.code
            ),
          },
        },
        submission: {
          ...state.submission,
          error: null,
        },
      };

    case 'SET_DIAGNOSIS_SICHERHEIT':
      return {
        ...state,
        formData: {
          ...state.formData,
          kap5Diagnosen: {
            selectedDiagnoses: state.formData.kap5Diagnosen.selectedDiagnoses.map((d) =>
              d.code === action.code
                ? { ...d, sicherheit: action.sicherheit }
                : d
            ),
          },
        },
        submission: {
          ...state.submission,
          error: null,
        },
      };

    case 'ADD_TEST_VERFAHREN':
      return {
        ...state,
        formData: {
          ...state.formData,
          testdiagnostik: {
            selectedTests: [
              ...state.formData.testdiagnostik.selectedTests,
              {
                abbreviation: action.abbreviation,
                name: action.name,
                durchfuehrungsdatum: null,
                score: null,
                notizen: null,
              },
            ],
          },
        },
        submission: {
          ...state.submission,
          error: null,
        },
      };

    case 'REMOVE_TEST_VERFAHREN':
      return {
        ...state,
        formData: {
          ...state.formData,
          testdiagnostik: {
            selectedTests: state.formData.testdiagnostik.selectedTests.filter(
              (_, i) => i !== action.index
            ),
          },
        },
        submission: {
          ...state.submission,
          error: null,
        },
      };

    case 'UPDATE_TEST_VERFAHREN':
      return {
        ...state,
        formData: {
          ...state.formData,
          testdiagnostik: {
            selectedTests: state.formData.testdiagnostik.selectedTests.map((test, i) =>
              i === action.index
                ? { ...test, [action.field]: action.value }
                : test
            ),
          },
        },
        submission: {
          ...state.submission,
          error: null,
        },
      };

    case 'TOGGLE_SECTION_EXPANSION':
      return {
        ...state,
        expansionState: {
          ...state.expansionState,
          [action.section]: !state.expansionState[action.section],
        },
      };

    case 'EXPAND_ALL_SECTIONS':
      return {
        ...state,
        expansionState: Object.keys(state.expansionState).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {} as typeof state.expansionState
        ),
      };

    case 'RESET_FORM':
      return FormTypes.initialFormState;

    case 'SET_LOADING':
      return {
        ...state,
        submission: {
          ...state.submission,
          isLoading: action.isLoading,
          error: action.isLoading ? null : state.submission.error,
          result: action.isLoading ? null : state.submission.result,
        },
      };

    case 'SET_RESULT':
      return {
        ...state,
        submission: {
          isLoading: false,
          result: action.result,
          error: null,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        submission: {
          isLoading: false,
          result: null,
          error: action.error,
        },
      };

    case 'CLEAR_SUBMISSION_STATE':
      return {
        ...state,
        submission: {
          isLoading: false,
          result: null,
          error: null,
        },
      };

    case 'SET_WIZARD_STEP':
      return {
        ...state,
        wizardState: {
          ...state.wizardState,
          currentStep: action.step,
          visitedSteps: new Set([...state.wizardState.visitedSteps, action.step]),
        },
      };

    case 'WIZARD_NEXT_STEP':
      const nextStep = Math.min(state.wizardState.currentStep + 1, 8);
      const currentStep = state.wizardState.currentStep;
      return {
        ...state,
        wizardState: {
          ...state.wizardState,
          currentStep: nextStep,
          visitedSteps: new Set([...state.wizardState.visitedSteps, nextStep]),
          completedSteps: new Set([...state.wizardState.completedSteps, currentStep]),
        },
      };

    case 'WIZARD_PREVIOUS_STEP':
      return {
        ...state,
        wizardState: {
          ...state.wizardState,
          currentStep: Math.max(state.wizardState.currentStep - 1, 1),
        },
      };

    case 'SET_VIEW_MODE':
      return {
        ...state,
        wizardState: {
          ...state.wizardState,
          viewMode: action.mode,
        },
      };

    case 'MARK_STEP_COMPLETED':
      return {
        ...state,
        wizardState: {
          ...state.wizardState,
          completedSteps: new Set([...state.wizardState.completedSteps, action.step]),
        },
      };

    case 'MARK_STEP_VISITED':
      return {
        ...state,
        wizardState: {
          ...state.wizardState,
          visitedSteps: new Set([...state.wizardState.visitedSteps, action.step]),
        },
      };

    case 'SET_STEP3_SUBSTEP':
      return {
        ...state,
        wizardState: {
          ...state.wizardState,
          step3CurrentSubStep: action.substep,
        },
      };

    case 'SET_STEP4_SUBSTEP':
      return {
        ...state,
        wizardState: {
          ...state.wizardState,
          step4CurrentSubStep: action.substep,
        },
      };

    case 'SET_STEP5_SUBSTEP':
      return {
        ...state,
        wizardState: {
          ...state.wizardState,
          step5CurrentSubStep: action.substep,
        },
      };

    case 'SET_STEP7_SUBSTEP':
      return {
        ...state,
        wizardState: {
          ...state.wizardState,
          step7CurrentSubStep: action.substep,
        },
      };

    case 'RESTORE_STATE':
      return {
        ...state,
        formData: deepMerge(state.formData, action.payload) as typeof state.formData,
      };

    case 'LOAD_FORM_DATA':
      return {
        ...state,
        formData: action.formData,
        wizardState: {
          ...state.wizardState,
          currentStep: action.wizardStep,
          step3CurrentSubStep: action.step3SubStep,
          step4CurrentSubStep: action.step4SubStep,
          step5CurrentSubStep: action.step5SubStep,
          step7CurrentSubStep: action.step7SubStep,
          visitedSteps: new Set([...Array(action.wizardStep).keys()].map(i => i + 1)),
          completedSteps: new Set([...Array(action.wizardStep - 1).keys()].map(i => i + 1)),
        },
        submission: {
          isLoading: false,
          result: null,
          error: null,
        },
      };

    default:
      return state;
  }
}
