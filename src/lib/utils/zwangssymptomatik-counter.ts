/**
 * Zwangssymptomatik Counter Utility
 *
 * Counts and formats selected symptoms for display in the UI.
 * Single source of truth for counting logic.
 */

import * as FormTypes from '../core/form-types';
import {
  ZWANGSGEDANKEN_WIEDERKEHREND_FELD_LABELS,
  ZWANGSHANDLUNG_TYP_LABELS,
  ZWANGSBEZOGENE_KOGNITION_SYMPTOM_LABELS
} from '../core/form-labels';

/**
 * Returns an array of formatted symptom strings for Zwangssymptomatik
 * Used for both counting and display purposes
 */
export function getFormattedZwangSymptoms(zwang: FormTypes.Zwangssymptomatik): string[] {
  const symptoms: string[] = [];

  // Check if zwangsgedanken has data (discriminated union check)
  if ('wiederkehrendeZwangsgedanken' in zwang.zwangsgedanken) {
    const zwangsgedanken = zwang.zwangsgedanken as FormTypes.ZwangsgedankenSelected;

    // Add wiederkehrende fields with values
    for (const [key, val] of Object.entries(zwangsgedanken.wiederkehrendeZwangsgedanken)) {
      if (val && val.trim()) {
        const label = ZWANGSGEDANKEN_WIEDERKEHREND_FELD_LABELS[key as FormTypes.ZwangsgedankenWiederkehrendFeld];
        symptoms.push(`${label}: ${val.trim()}`);
      }
    }

    // Add direct fields
    if (zwangsgedanken.zwanghafteIdeen.trim()) {
      symptoms.push(`Zwanghafte Ideen: ${zwangsgedanken.zwanghafteIdeen.trim()}`);
    }
    if (zwangsgedanken.zwangsimpulse.trim()) {
      symptoms.push(`Zwangsimpulse: ${zwangsgedanken.zwangsimpulse.trim()}`);
    }
  }

  // Check if zwangshandlungen has data (discriminated union check)
  if ('selected' in zwang.zwangshandlungen && zwang.zwangshandlungen.selected === true) {
    const zwangshandlungen = zwang.zwangshandlungen as FormTypes.ZwangshandlungenSelected;

    // Add selected Zwangshandlungen items
    for (const [key, entry] of Object.entries(zwangshandlungen.details)) {
      if (entry?.selected) {
        const label = ZWANGSHANDLUNG_TYP_LABELS[key as FormTypes.ZwangshandlungTyp];
        const text = entry.details?.text?.trim();
        symptoms.push(text ? `${label}: ${text}` : label);
      }
    }

    // Add "andere" Zwangshandlungen if present
    if (zwangshandlungen.andere.trim()) {
      symptoms.push(`Andere Zwangshandlungen: ${zwangshandlungen.andere.trim()}`);
    }
  }

  // Add zwangsbezogene Kognitionen
  for (const [key, val] of Object.entries(zwang.zwangsbezogeneKognitionen)) {
    if (val === 'selected') {
      symptoms.push(ZWANGSBEZOGENE_KOGNITION_SYMPTOM_LABELS[key as FormTypes.ZwangsbezogeneKognitionSymptom]);
    }
  }

  // Add other symptoms
  if (zwang.andereSymptome.trim()) {
    symptoms.push(`Andere: ${zwang.andereSymptome.trim()}`);
  }

  return symptoms;
}
