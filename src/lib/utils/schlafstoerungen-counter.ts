/**
 * Counter utility for NichtorganischeSchlafstoerungen modal
 * Provides formatted symptom list for modal footer and section preview
 */

import * as FormTypes from '@/lib/core/form-types';
import {
  SCHLAF_INSOMNIE_LABELS,
  SCHLAF_HYPERSOMNIE_LABELS,
  SCHLAF_RHYTHMUS_LABELS,
  SCHLAF_PARASOMNIE_LABELS,
} from '@/lib/core/form-labels';

/**
 * Formats a CardSelection entry with optional brackets text
 */
function formatWithBrackets(label: string, brackets?: string): string {
  const trimmed = brackets?.trim();
  return trimmed ? `${label} (${trimmed})` : label;
}

/**
 * Returns formatted list of selected sleep disorder symptoms for display
 */
export function getFormattedSchlafstoerungen(ss: FormTypes.NichtorganischeSchlafstoerungen): string[] {
  const symptoms: string[] = [];

  // Insomnie
  for (const [key, entry] of Object.entries(ss.insomnie)) {
    if (entry?.selected) {
      const label = SCHLAF_INSOMNIE_LABELS[key as FormTypes.SchlafInsomniesymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Hypersomnie
  for (const [key, entry] of Object.entries(ss.hypersomnie)) {
    if (entry?.selected) {
      const label = SCHLAF_HYPERSOMNIE_LABELS[key as FormTypes.SchlafHypersomniesymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Rhythmusstörungen
  for (const [key, entry] of Object.entries(ss.rhythmus)) {
    if (entry?.selected) {
      const label = SCHLAF_RHYTHMUS_LABELS[key as FormTypes.SchlafRhythmusStoerung];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Parasomnien
  for (const [key, entry] of Object.entries(ss.parasomnie)) {
    if (entry?.selected) {
      const label = SCHLAF_PARASOMNIE_LABELS[key as FormTypes.SchlafParasomniesymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Andere
  if (ss.andereSymptome?.trim()) {
    symptoms.push(ss.andereSymptome.trim());
  }

  return symptoms;
}

/**
 * Returns the count of selected sleep disorder symptoms
 */
export function getSchlafstoerungsCount(ss: FormTypes.NichtorganischeSchlafstoerungen): number {
  return getFormattedSchlafstoerungen(ss).length;
}
