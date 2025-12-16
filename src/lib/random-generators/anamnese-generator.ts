/**
 * Anamnese Test Data Generator
 *
 * Generates random anamnese data for A2-A5 sections
 */

import {
  a2Symptoms,
  a3Symptoms,
  a4SeitWannOptions,
  a4VerstaerkungOptions,
  a5StressfaktorenOptions,
} from '../core/options/anamnese-sections';
import * as FormTypes from '../core/form-types';

export interface AnamneseData {
  a2: FormTypes.A2Data;
  a3: FormTypes.A3Data;
  a4: FormTypes.A4Data;
  a5: FormTypes.A5Data;
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
 * Generates A2 (Verhaltensdefizite/Behavioral Deficits) data
 */
function generateA2(): FormTypes.A2Data {
  return {
    symptoms: selectRandomItems(a2Symptoms, 1, 8),
    andereSymptome: '',
  };
}

/**
 * Generates A3 (Verhaltensexzesse/Behavioral Excesses) data
 */
function generateA3(): FormTypes.A3Data {
  return {
    symptoms: selectRandomItems(a3Symptoms, 1, 8),
    andereSymptome: '',
  };
}

/**
 * Generates A4 (Verlauf und Dauer/Course and Duration) data
 */
function generateA4(): FormTypes.A4Data {
  return {
    seitWann: selectRandomItems(a4SeitWannOptions, 1, 2),
    seitWannAndere: '',
    verstaerkung: selectRandomItems(a4VerstaerkungOptions, 1, 2),
    verstaerkungAndere: '',
  };
}

/**
 * Generates A5 (Stressfaktoren/Stress Factors) data
 */
function generateA5(): FormTypes.A5Data {
  return {
    stressfaktoren: selectRandomItems(a5StressfaktorenOptions, 1, 4),
    andereStressfaktoren: '',
  };
}

/**
 * Main function: Generates all anamnese data
 */
export function generateAnamnese(): AnamneseData {
  return {
    a2: generateA2(),
    a3: generateA3(),
    a4: generateA4(),
    a5: generateA5(),
  };
}
