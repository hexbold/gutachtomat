/**
 * Utility to count and format selected ManischeSymptomatik symptoms
 * Used by both the modal footer and the main section preview
 */

import * as FormTypes from '../core/form-types';
import {
  MANISCHE_STIMMUNG_SYMPTOM_LABELS,
  MANISCHE_ANTRIEB_SYMPTOM_LABELS,
  MANISCHE_SPRACHE_KOGNITION_SYMPTOM_LABELS,
  MANISCHE_VEGETATIV_SYMPTOM_LABELS,
  MANISCHE_SELBSTERLEBEN_SYMPTOM_LABELS,
  MANISCHES_VERHALTEN_SYMPTOM_LABELS,
  IMPULSIVES_VERHALTEN_DETAIL_LABELS,
  MANISCHE_PSYCHOTISCH_SYMPTOM_LABELS,
  MANISCHE_DISSOCIATIV_SYMPTOM_LABELS,
  IMPULSIVES_VERHALTEN_LABEL,
} from '../core/form-labels';

/**
 * Returns an array of formatted symptom strings for ManischeSymptomatik
 * This is the single source of truth for counting - used by both modal footer and main section
 */
export function getFormattedManischeSymptoms(ms: FormTypes.ManischeSymptomatik): string[] {
  const symptoms: string[] = [];

  // Stimmung und emotionales Erleben (CardSelection pattern)
  for (const [key, entry] of Object.entries(ms.stimmungEmotionalesErleben)) {
    if (entry?.selected) {
      const label = MANISCHE_STIMMUNG_SYMPTOM_LABELS[key as FormTypes.ManischeStimmungSymptom];
      const brackets = entry.details?.brackets?.trim();
      if (brackets) {
        symptoms.push(`${label} (${brackets})`);
      } else {
        symptoms.push(label);
      }
    }
  }

  // Antrieb, Energie und Psychomotorik (CardSelection pattern)
  for (const [key, entry] of Object.entries(ms.antriebEnergiePsychomotorik)) {
    if (entry?.selected) {
      const label = MANISCHE_ANTRIEB_SYMPTOM_LABELS[key as FormTypes.ManischeAntriebSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Sprache und Kognition (CardSelection pattern)
  for (const [key, entry] of Object.entries(ms.spracheKognition)) {
    if (entry?.selected) {
      const label = MANISCHE_SPRACHE_KOGNITION_SYMPTOM_LABELS[key as FormTypes.ManischeSpracheKognitionSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Vegetative Symptome (CardSelection pattern)
  for (const [key, entry] of Object.entries(ms.vegetativeSymptome)) {
    if (entry?.selected) {
      const label = MANISCHE_VEGETATIV_SYMPTOM_LABELS[key as FormTypes.ManischeVegetativSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Selbsterleben (CardSelection pattern)
  for (const [key, entry] of Object.entries(ms.selbsterleben)) {
    if (entry?.selected) {
      const label = MANISCHE_SELBSTERLEBEN_SYMPTOM_LABELS[key as FormTypes.ManischeSelbsterlebenSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Verhalten (main selection) (CardSelection pattern)
  for (const [key, entry] of Object.entries(ms.verhalten.selection)) {
    if (entry?.selected) {
      const label = MANISCHES_VERHALTEN_SYMPTOM_LABELS[key as FormTypes.ManischesVerhaltenSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Impulsives Verhalten (CardSelection pattern)
  const impulsivesDetails: string[] = [];
  for (const [key, entry] of Object.entries(ms.verhalten.impulsivesVerhalten.details)) {
    if (entry?.selected) {
      const label = IMPULSIVES_VERHALTEN_DETAIL_LABELS[key as FormTypes.ImpulsivesVerhaltenDetail];
      const brackets = entry.details?.brackets?.trim();
      impulsivesDetails.push(brackets ? `${label} (${brackets})` : label);
    }
  }
  // Include "andere" text in the bracket if filled
  const andereImpulsivesText = ms.verhalten.impulsivesVerhalten.andere.trim();
  if (andereImpulsivesText) {
    impulsivesDetails.push(andereImpulsivesText);
  }
  if (impulsivesDetails.length > 0) {
    symptoms.push(`${IMPULSIVES_VERHALTEN_LABEL} (${impulsivesDetails.sort((a, b) => a.localeCompare(b)).join(', ')})`);
  }

  // Psychotische Symptome (CardSelection pattern)
  for (const [key, entry] of Object.entries(ms.psychotischeSymptome)) {
    if (entry?.selected) {
      const label = MANISCHE_PSYCHOTISCH_SYMPTOM_LABELS[key as FormTypes.ManischePsychotischSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Dissoziative Symptome (CardSelection pattern)
  for (const [key, entry] of Object.entries(ms.dissoziativeSymptome)) {
    if (entry?.selected) {
      const label = MANISCHE_DISSOCIATIV_SYMPTOM_LABELS[key as FormTypes.ManischeDissociativSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Andere Symptome (free text)
  if (ms.andereSymptome && ms.andereSymptome.trim()) {
    symptoms.push(`Andere: ${ms.andereSymptome.trim()}`);
  }

  return symptoms;
}

/**
 * Counts the total number of selected symptoms in ManischeSymptomatik
 * Uses getFormattedManischeSymptoms to ensure consistent counting
 */
export function countManischeSymptoms(ms: FormTypes.ManischeSymptomatik): number {
  return getFormattedManischeSymptoms(ms).length;
}
