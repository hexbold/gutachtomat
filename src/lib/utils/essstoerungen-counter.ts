/**
 * Counter utility for Essstoerungen modal
 * Provides formatted symptom list for modal footer and section preview
 */

import * as FormTypes from '@/lib/core/form-types';
import {
  ESSSTOERUNG_KOGNITIV_LABELS,
  ESSSTOERUNG_EMOTIONAL_LABELS,
  GEWICHTSREGULIERENDE_MASSNAHME_LABELS,
  ANOREXIE_SPEZIFISCH_LABELS,
  BULIMIE_SPEZIFISCH_LABELS,
  BINGE_EATING_SPEZIFISCH_LABELS,
} from '@/lib/core/form-labels';

/**
 * Formats a CardSelection entry with optional brackets text
 */
function formatWithBrackets(label: string, brackets?: string): string {
  const trimmed = brackets?.trim();
  return trimmed ? `${label} (${trimmed})` : label;
}

/**
 * Returns formatted list of selected eating disorder symptoms for display
 */
export function getFormattedEssstoerungen(es: FormTypes.Essstoerungen): string[] {
  const symptoms: string[] = [];

  // Kognitive Symptome
  for (const [key, entry] of Object.entries(es.kognitiveSymptome)) {
    if (entry?.selected) {
      const label = ESSSTOERUNG_KOGNITIV_LABELS[key as FormTypes.EssstoerungKognitivSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Emotionale Symptome
  for (const [key, entry] of Object.entries(es.emotionaleSymptome)) {
    if (entry?.selected) {
      const label = ESSSTOERUNG_EMOTIONAL_LABELS[key as FormTypes.EssstoerungEmotionalSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Gewichtsregulierende Maßnahmen
  for (const [key, entry] of Object.entries(es.gewichtsregulierendeMassnahmen)) {
    if (entry?.selected) {
      const label = GEWICHTSREGULIERENDE_MASSNAHME_LABELS[key as FormTypes.GewichtsregulierendeMassnahme];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Anorexie-spezifisch
  for (const [key, entry] of Object.entries(es.anorexieSpezifisch)) {
    if (entry?.selected) {
      const label = ANOREXIE_SPEZIFISCH_LABELS[key as FormTypes.AnorexieSpezifischSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Bulimie-spezifisch
  for (const [key, entry] of Object.entries(es.bulimieSpezifisch)) {
    if (entry?.selected) {
      const label = BULIMIE_SPEZIFISCH_LABELS[key as FormTypes.BulimieSpezifischSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Binge-Eating-spezifisch
  for (const [key, entry] of Object.entries(es.bingeEatingSpezifisch)) {
    if (entry?.selected) {
      const label = BINGE_EATING_SPEZIFISCH_LABELS[key as FormTypes.BingeEatingSpezifischSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Andere
  if (es.andereSymptome?.trim()) {
    symptoms.push(es.andereSymptome.trim());
  }

  return symptoms;
}

/**
 * Returns the count of selected eating disorder symptoms
 */
export function getEssstoerungenCount(es: FormTypes.Essstoerungen): number {
  return getFormattedEssstoerungen(es).length;
}
