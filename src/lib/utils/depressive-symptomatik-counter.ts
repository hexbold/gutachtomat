/**
 * Utility to count and format selected DepressiveSymptomatik symptoms
 * Used by both the modal footer and the main section preview
 */

import * as FormTypes from '../core/form-types';
import {
  DEPRESSIVE_STIMMUNG_SYMPTOM_LABELS,
  DEPRESSIVE_ANTRIEB_SYMPTOM_LABELS,
  DEPRESSIVE_SELBSTERLEBEN_SYMPTOM_LABELS,
  DEPRESSIVE_VEGETATIV_SYMPTOM_LABELS,
  DEPRESSIVE_PSYCHOMOTORIK_SYMPTOM_LABELS,
  DEPRESSIVE_KOGNITION_SYMPTOM_LABELS,
  DEPRESSIVES_VERHALTEN_SYMPTOM_LABELS,
  DEPRESSIVE_PSYCHOTISCH_SYMPTOM_LABELS,
  DEPRESSIVE_DISSOCIATIV_SYMPTOM_LABELS,
} from '../core/form-labels';

/**
 * Returns an array of formatted symptom strings for DepressiveSymptomatik
 * This is the single source of truth for counting - used by both modal footer and main section
 */
export function getFormattedDepressiveSymptoms(ds: FormTypes.DepressiveSymptomatik): string[] {
  const symptoms: string[] = [];

  // Stimmung und emotionales Erleben (CardSelection pattern)
  for (const [key, entry] of Object.entries(ds.stimmungEmotionalesErleben)) {
    if (entry?.selected) {
      const label = DEPRESSIVE_STIMMUNG_SYMPTOM_LABELS[key as FormTypes.DepressiveStimmungSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Antrieb, Energie und Psychomotorik (CardSelection pattern)
  for (const [key, entry] of Object.entries(ds.antriebEnergiePsychomotorik)) {
    if (entry?.selected) {
      const label = DEPRESSIVE_ANTRIEB_SYMPTOM_LABELS[key as FormTypes.DepressiveAntriebSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Selbsterleben (CardSelection pattern)
  for (const [key, entry] of Object.entries(ds.selbsterleben)) {
    if (entry?.selected) {
      const label = DEPRESSIVE_SELBSTERLEBEN_SYMPTOM_LABELS[key as FormTypes.DepressiveSelbsterlebenSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Somatovegetative Symptome (CardSelection pattern)
  for (const [key, entry] of Object.entries(ds.vegetativeSomatischeSymptome)) {
    if (entry?.selected) {
      const label = DEPRESSIVE_VEGETATIV_SYMPTOM_LABELS[key as FormTypes.DepressiveVegetativSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Psychomotorik (CardSelection pattern)
  for (const [key, entry] of Object.entries(ds.psychomotorischeSymptome)) {
    if (entry?.selected) {
      const label = DEPRESSIVE_PSYCHOMOTORIK_SYMPTOM_LABELS[key as FormTypes.DepressivePsychomotorikSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Kognition (CardSelection pattern)
  for (const [key, entry] of Object.entries(ds.kognition)) {
    if (entry?.selected) {
      const label = DEPRESSIVE_KOGNITION_SYMPTOM_LABELS[key as FormTypes.DepressiveKognitionSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Verhalten (CardSelection pattern)
  for (const [key, entry] of Object.entries(ds.verhalten)) {
    if (entry?.selected) {
      const label = DEPRESSIVES_VERHALTEN_SYMPTOM_LABELS[key as FormTypes.DepressivesVerhaltenSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Psychotische Symptome (CardSelection pattern)
  for (const [key, entry] of Object.entries(ds.psychotischeSymptome)) {
    if (entry?.selected) {
      const label = DEPRESSIVE_PSYCHOTISCH_SYMPTOM_LABELS[key as FormTypes.DepressivePsychotischSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Dissoziative Symptome (CardSelection pattern)
  for (const [key, entry] of Object.entries(ds.dissoziativeSymptome)) {
    if (entry?.selected) {
      const label = DEPRESSIVE_DISSOCIATIV_SYMPTOM_LABELS[key as FormTypes.DepressiveDissociativSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Andere Symptome (free text)
  if (ds.andereSymptome && ds.andereSymptome.trim()) {
    symptoms.push(`Andere: ${ds.andereSymptome.trim()}`);
  }

  return symptoms;
}

/**
 * Counts the total number of selected symptoms in DepressiveSymptomatik
 * Uses getFormattedDepressiveSymptoms to ensure consistent counting
 */
export function countDepressiveSymptoms(ds: FormTypes.DepressiveSymptomatik): number {
  return getFormattedDepressiveSymptoms(ds).length;
}
