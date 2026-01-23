/**
 * Counter utility for SomatoformeSymptomatik modal
 * Provides formatted symptom list for modal footer and section preview
 */

import * as FormTypes from '@/lib/core/form-types';
import {
  SOMATOFORM_KOERPERLICH_LABELS,
  SOMATOFORM_AUTONOM_LABELS,
  SOMATOFORM_HYPOCHONDRISCH_LABELS,
  SOMATOFORM_SCHMERZ_LABELS,
  SOMATOFORM_KONVERSION_LABELS,
} from '@/lib/core/form-labels';

/**
 * Formats a CardSelection entry with optional brackets text
 */
function formatWithBrackets(label: string, brackets?: string): string {
  const trimmed = brackets?.trim();
  return trimmed ? `${label} (${trimmed})` : label;
}

/**
 * Returns formatted list of selected somatoforme symptoms for display
 */
export function getFormattedSomatoformeSymptoms(ss: FormTypes.SomatoformeSymptomatik): string[] {
  const symptoms: string[] = [];

  // Körperliche Symptome
  for (const [key, entry] of Object.entries(ss.koerperlicheSymptome)) {
    if (entry?.selected) {
      const label = SOMATOFORM_KOERPERLICH_LABELS[key as FormTypes.SomatoformKoerperlichSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Autonome Symptome
  for (const [key, entry] of Object.entries(ss.autonomeSymptome)) {
    if (entry?.selected) {
      const label = SOMATOFORM_AUTONOM_LABELS[key as FormTypes.SomatoformAutonomSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Hypochondrische Symptome
  for (const [key, entry] of Object.entries(ss.hypochondrischeSymptome)) {
    if (entry?.selected) {
      const label = SOMATOFORM_HYPOCHONDRISCH_LABELS[key as FormTypes.SomatoformHypochondrischSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Schmerz-Symptome
  for (const [key, entry] of Object.entries(ss.schmerzSymptome)) {
    if (entry?.selected) {
      const label = SOMATOFORM_SCHMERZ_LABELS[key as FormTypes.SomatoformSchmerzSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Konversions-Symptome
  for (const [key, entry] of Object.entries(ss.konversionSymptome)) {
    if (entry?.selected) {
      const label = SOMATOFORM_KONVERSION_LABELS[key as FormTypes.SomatoformKonversionSymptom];
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
 * Returns the count of selected somatoforme symptoms
 */
export function getSomatoformeSymptomsCount(ss: FormTypes.SomatoformeSymptomatik): number {
  return getFormattedSomatoformeSymptoms(ss).length;
}
