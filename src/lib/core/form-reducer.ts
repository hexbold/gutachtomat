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

    case 'ADD_ILLEGALE_DROGE':
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            ...state.formData.somato5,
            illegaleDrogen: [
              ...state.formData.somato5.illegaleDrogen,
              {
                id: `droge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                suchtmittel: '',
                menge: '',
                mengeEinheit: '',
                haeufigkeit: '',
              },
            ],
          },
        },
        submission: {
          ...state.submission,
          error: null,
        },
      };

    case 'REMOVE_ILLEGALE_DROGE':
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            ...state.formData.somato5,
            illegaleDrogen: state.formData.somato5.illegaleDrogen.filter(
              (droge) => droge.id !== action.id
            ),
          },
        },
        submission: {
          ...state.submission,
          error: null,
        },
      };

    case 'UPDATE_ILLEGALE_DROGE':
      return {
        ...state,
        formData: {
          ...state.formData,
          somato5: {
            ...state.formData.somato5,
            illegaleDrogen: state.formData.somato5.illegaleDrogen.map((droge) =>
              droge.id === action.id
                ? { ...droge, [action.field]: action.value }
                : droge
            ),
          },
        },
        submission: {
          ...state.submission,
          error: null,
        },
      };

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

    case 'RESTORE_STATE':
      return {
        ...state,
        formData: deepMerge(state.formData, action.payload) as typeof state.formData,
      };

    default:
      return state;
  }
}
