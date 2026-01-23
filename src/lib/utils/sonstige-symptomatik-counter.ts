import * as FormTypes from '@/lib/core/form-types';
import { KRANKHEITSEINSICHT_COMPLIANCE_LABELS } from '@/lib/core/form-labels';

/**
 * Gets all selected sonstige symptomatik symptoms as formatted strings
 * Used for modal footer display
 */
export function getFormattedSonstigeSymptomatik(data: FormTypes.SonstigeSymptomatik): string[] {
  const symptoms: string[] = [];

  // Krankheitseinsicht und Compliance
  for (const [key, entry] of Object.entries(data.krankheitseinsichtCompliance)) {
    if (entry?.selected) {
      const label = KRANKHEITSEINSICHT_COMPLIANCE_LABELS[key as FormTypes.KrankheitseinsichtComplianceSymptom];
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
export function getSonstigeSymptomatikCount(data: FormTypes.SonstigeSymptomatik): number {
  return getFormattedSonstigeSymptomatik(data).length;
}
