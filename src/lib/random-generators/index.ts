/**
 * Test Data Orchestrator
 *
 * Main entry point for generating random test data for the Gutachten form.
 * This module combines all specialized generators to create complete form data.
 */

import { generateDemographics, DemographicsData } from './demographics-generator';
import { generateSymptoms, SymptomsData } from './symptoms-generator';
import { generateVerhaltensauffaelligkeiten, VerhaltensauffaelligkeitenData } from './verhaltensauffaelligkeiten-generator';
import { generateBefund, BefundData } from './befund-generator';
import { generateSomatoDiagnosen, SomatoDiagnosenData } from './somato-lebensg-generator';
import { generateBehandlungsrelevanteAngaben, BehandlungsrelevanteAngabenData } from './behandlungsrelevante-angaben-generator';
import { generateTestdiagnostik, TestdiagnostikData } from './testdiagnostik-generator';
import { generateKapitel6, Kapitel6Data } from './kapitel6-generator';

/**
 * Complete random form data structure
 * Combines all generator outputs
 */
export type RandomFormData = DemographicsData & SymptomsData & VerhaltensauffaelligkeitenData & BefundData & SomatoDiagnosenData & BehandlungsrelevanteAngabenData & TestdiagnostikData & Kapitel6Data;

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
    ...generateVerhaltensauffaelligkeiten(),
    ...generateBefund(),
    ...generateSomatoDiagnosen(),
    ...generateBehandlungsrelevanteAngaben(),
    ...generateTestdiagnostik(),
    ...generateKapitel6(),
  };
}

// Re-export individual generators for granular control
export { generateDemographics } from './demographics-generator';
export { generateSymptoms } from './symptoms-generator';
export { generateVerhaltensauffaelligkeiten } from './verhaltensauffaelligkeiten-generator';
export { generateBefund } from './befund-generator';
export { generateSomatoDiagnosen } from './somato-lebensg-generator';
export { generateBehandlungsrelevanteAngaben } from './behandlungsrelevante-angaben-generator';
export { generateTestdiagnostik } from './testdiagnostik-generator';
export { generateKapitel6 } from './kapitel6-generator';
