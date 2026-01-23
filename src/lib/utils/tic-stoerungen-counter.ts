import * as FormTypes from '@/lib/core/form-types';
import {
  MOTORISCHE_TICS_LABELS,
  VOKALE_TICS_LABELS,
} from '@/lib/core/form-labels';

/**
 * Gets all selected tic-störungen symptoms as formatted strings
 * Used for modal footer display
 */
export function getFormattedTicStoerungen(data: FormTypes.TicStoerungen): string[] {
  const symptoms: string[] = [];

  // Motorische Tics
  for (const [key, entry] of Object.entries(data.motorischeTics)) {
    if (entry?.selected) {
      const label = MOTORISCHE_TICS_LABELS[key as FormTypes.MotorischeTicsSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Vokale Tics
  for (const [key, entry] of Object.entries(data.vokaleTics)) {
    if (entry?.selected) {
      const label = VOKALE_TICS_LABELS[key as FormTypes.VokaleTicsSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Tourette-Syndrom
  if (data.touretteSyndrom) {
    symptoms.push('Tourette-Syndrom');
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
export function getTicStoerungenCount(data: FormTypes.TicStoerungen): number {
  return getFormattedTicStoerungen(data).length;
}
