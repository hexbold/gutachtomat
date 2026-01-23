import * as FormTypes from '@/lib/core/form-types';
import { SUIZIDALITAET_SYMPTOMATIK_LABELS } from '@/lib/core/form-labels';

/**
 * Gets all selected suizidalität symptoms as formatted strings
 * Used for modal footer display
 */
export function getFormattedSuizidalitaetSymptomatik(data: FormTypes.SuizidalitaetSymptomatik): string[] {
  const symptoms: string[] = [];

  // Symptome
  for (const [key, entry] of Object.entries(data.symptome)) {
    if (entry?.selected) {
      const label = SUIZIDALITAET_SYMPTOMATIK_LABELS[key as FormTypes.SuizidalitaetSymptomatikSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Andere Symptome
  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms;
}

/**
 * Counts total selected symptoms
 */
export function getSuizidalitaetSymptomatikCount(data: FormTypes.SuizidalitaetSymptomatik): number {
  return getFormattedSuizidalitaetSymptomatik(data).length;
}
