/**
 * Test Data Orchestrator
 *
 * Main entry point for generating random test data for the Gutachten form.
 * This module combines all specialized generators to create complete form data.
 */

import { generateDemographics, DemographicsData } from './demographics-generator';
import { generateSymptoms, SymptomsData } from './symptoms-generator';
import { generateAnamnese, AnamneseData } from './anamnese-generator';
import { generateBefund, BefundData } from './befund-generator';
import { generateSomatoLebensg, SomatoLebensgData } from './somato-lebensg-generator';

/**
 * Complete random form data structure
 * Combines all generator outputs
 */
export type RandomFormData = DemographicsData & SymptomsData & AnamneseData & BefundData & SomatoLebensgData;

/**
 * Generates complete random test data for the Gutachten form
 *
 * This function orchestrates all specialized generators to create
 * a complete, realistic psychological assessment form with random data.
 *
 * @returns Complete random form data
 *
 * @example
 * ```ts
 * import { generateRandomFormData } from '@/lib/random-generators';
 *
 * const testData = generateRandomFormData();
 * console.log(testData.geschlecht); // "M001" (random gender)
 * console.log(testData.f32f33.symptoms); // ["Depressive Verstimmung", ...]
 * ```
 */
export function generateRandomFormData(): RandomFormData {
  return {
    ...generateDemographics(),
    ...generateSymptoms(),
    ...generateAnamnese(),
    ...generateBefund(),
    ...generateSomatoLebensg(),
  };
}

// Re-export individual generators for granular control
export { generateDemographics } from './demographics-generator';
export { generateSymptoms } from './symptoms-generator';
export { generateAnamnese } from './anamnese-generator';
export { generateBefund } from './befund-generator';
export { generateSomatoLebensg } from './somato-lebensg-generator';
