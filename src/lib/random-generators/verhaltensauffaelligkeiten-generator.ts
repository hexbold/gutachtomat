/**
 * Verhaltensauffaelligkeiten Test Data Generator
 *
 * Generates random data for Verhaltensexzesse and Verhaltensdefizite
 */

import * as FormTypes from '../core/form-types';

export interface VerhaltensauffaelligkeitenData {
  verhaltensauffaelligkeiten: FormTypes.Verhaltensauffaelligkeiten;
}

/**
 * Helper: Randomly selects N items from an array
 */
function selectRandomItems<T>(array: T[], min: number, max: number): T[] {
  const numItems = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numItems);
}

/**
 * Generates Verhaltensexzesse (Behavioral Excesses) CardSelection
 */
function generateVerhaltensexzesse(): FormTypes.VerhaltensexzessSelection {
  const allSymptoms = Object.values(FormTypes.VerhaltensexzessSymptom);
  const selectedSymptoms = selectRandomItems(allSymptoms, 0, 3);

  const selection: FormTypes.VerhaltensexzessSelection = {};
  for (const symptom of selectedSymptoms) {
    selection[symptom] = {
      selected: true,
      details: {}
    };
  }

  return selection;
}

/**
 * Generates Verhaltensdefizite (Behavioral Deficits) CardSelection
 */
function generateVerhaltensdefizite(): FormTypes.VerhaltensdefizitSelection {
  const allSymptoms = Object.values(FormTypes.VerhaltensdefizitSymptom);
  const selectedSymptoms = selectRandomItems(allSymptoms, 0, 3);

  const selection: FormTypes.VerhaltensdefizitSelection = {};
  for (const symptom of selectedSymptoms) {
    selection[symptom] = {
      selected: true,
      details: {}
    };
  }

  return selection;
}

/**
 * Main function: Generates Verhaltensauffaelligkeiten data
 */
export function generateVerhaltensauffaelligkeiten(): VerhaltensauffaelligkeitenData {
  return {
    verhaltensauffaelligkeiten: {
      exzesse: generateVerhaltensexzesse(),
      defizite: generateVerhaltensdefizite(),
      andereExzesse: '',
      andereDefizite: '',
    },
  };
}
