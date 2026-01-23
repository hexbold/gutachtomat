/**
 * Utility to count and format selected Verhaltensauffaelligkeiten symptoms
 * Used by both the modal footer and the main section preview
 */

import * as FormTypes from '../core/form-types';
import {
  VERHALTENSEXZESS_SYMPTOM_LABELS,
  VERHALTENSDEFIZIT_SYMPTOM_LABELS,
} from '../core/form-labels';

/**
 * Returns an array of formatted symptom strings for Verhaltensexzesse
 */
export function getFormattedVerhaltensexzesse(va: FormTypes.Verhaltensauffaelligkeiten): string[] {
  const symptoms: string[] = [];

  // Verhaltensexzesse (CardSelection pattern)
  for (const [key, entry] of Object.entries(va.exzesse)) {
    if (entry?.selected) {
      const label = VERHALTENSEXZESS_SYMPTOM_LABELS[key as FormTypes.VerhaltensexzessSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Andere Exzesse (free text)
  if (va.andereExzesse && va.andereExzesse.trim()) {
    symptoms.push(`Andere: ${va.andereExzesse.trim()}`);
  }

  return symptoms;
}

/**
 * Returns an array of formatted symptom strings for Verhaltensdefizite
 */
export function getFormattedVerhaltensdefizite(va: FormTypes.Verhaltensauffaelligkeiten): string[] {
  const symptoms: string[] = [];

  // Verhaltensdefizite (CardSelection pattern)
  for (const [key, entry] of Object.entries(va.defizite)) {
    if (entry?.selected) {
      const label = VERHALTENSDEFIZIT_SYMPTOM_LABELS[key as FormTypes.VerhaltensdefizitSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Andere Defizite (free text)
  if (va.andereDefizite && va.andereDefizite.trim()) {
    symptoms.push(`Andere: ${va.andereDefizite.trim()}`);
  }

  return symptoms;
}

/**
 * Returns an array of all formatted Verhaltensauffaelligkeiten (both exzesse and defizite)
 */
export function getFormattedVerhaltensauffaelligkeiten(va: FormTypes.Verhaltensauffaelligkeiten): string[] {
  return [...getFormattedVerhaltensexzesse(va), ...getFormattedVerhaltensdefizite(va)];
}
