/**
 * Utility to count and format selected Traumafolgesymptomatik symptoms
 * Used by both the modal footer and the main section preview
 */

import * as FormTypes from '../core/form-types';
import {
  TRAUMA_WIEDERERLEBEN_SYMPTOM_LABELS,
  TRAUMA_VERMEIDUNG_SYMPTOM_LABELS,
  TRAUMA_VERHALTEN_SYMPTOM_LABELS,
  TRAUMA_UEBERERREGUNG_SYMPTOM_LABELS,
  TRAUMA_SOMATOVEGETATIV_SYMPTOM_LABELS,
  TRAUMA_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS,
  TRAUMA_DISSOCIATIV_SYMPTOM_LABELS,
  TRAUMA_KOGNITION_SYMPTOM_LABELS,
  ANPASSUNGSSTOERUNG_SYMPTOM_LABELS,
} from '../core/form-labels';

/**
 * Returns an array of formatted symptom strings for Traumafolgesymptomatik
 * This is the single source of truth for counting - used by both modal footer and main section
 */
export function getFormattedTraumaSymptoms(ts: FormTypes.Traumafolgesymptomatik): string[] {
  const symptoms: string[] = [];

  // Wiedererleben des Traumas (CardSelection pattern)
  for (const [key, entry] of Object.entries(ts.wiedererleben)) {
    if (entry?.selected) {
      const label = TRAUMA_WIEDERERLEBEN_SYMPTOM_LABELS[key as FormTypes.TraumaWiederErlebenSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Vermeidungsverhalten (CardSelection pattern)
  for (const [key, entry] of Object.entries(ts.vermeidungsverhalten)) {
    if (entry?.selected) {
      const label = TRAUMA_VERMEIDUNG_SYMPTOM_LABELS[key as FormTypes.TraumaVermeidungSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Verhalten (CardSelection pattern)
  for (const [key, entry] of Object.entries(ts.verhalten)) {
    if (entry?.selected) {
      const label = TRAUMA_VERHALTEN_SYMPTOM_LABELS[key as FormTypes.TraumaVerhaltenSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Übererregung (CardSelection pattern)
  for (const [key, entry] of Object.entries(ts.uebererregung)) {
    if (entry?.selected) {
      const label = TRAUMA_UEBERERREGUNG_SYMPTOM_LABELS[key as FormTypes.TraumaUebererregungSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Somatovegetative Symptome (CardSelection pattern)
  for (const [key, entry] of Object.entries(ts.somatovegetativ)) {
    if (entry?.selected) {
      const label = TRAUMA_SOMATOVEGETATIV_SYMPTOM_LABELS[key as FormTypes.TraumaSomatovegetativSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Emotionales Erleben (CardSelection pattern)
  for (const [key, entry] of Object.entries(ts.emotionalesErleben)) {
    if (entry?.selected) {
      const label = TRAUMA_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS[key as FormTypes.TraumaEmotionalesErlebenSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Dissoziative Symptome (CardSelection pattern)
  for (const [key, entry] of Object.entries(ts.dissoziativ)) {
    if (entry?.selected) {
      const label = TRAUMA_DISSOCIATIV_SYMPTOM_LABELS[key as FormTypes.TraumaDissociativSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Kognition (CardSelection pattern)
  for (const [key, entry] of Object.entries(ts.kognition)) {
    if (entry?.selected) {
      const label = TRAUMA_KOGNITION_SYMPTOM_LABELS[key as FormTypes.TraumaKognitionSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Anpassungsstörungspezifische Symptome (CardSelection pattern)
  for (const [key, entry] of Object.entries(ts.anpassungsstoerung)) {
    if (entry?.selected) {
      const label = ANPASSUNGSSTOERUNG_SYMPTOM_LABELS[key as FormTypes.AnpassungsstoerungSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Andere Symptome (free text)
  if (ts.andereSymptome && ts.andereSymptome.trim()) {
    symptoms.push(`Andere: ${ts.andereSymptome.trim()}`);
  }

  return symptoms;
}

/**
 * Counts the total number of selected symptoms in Traumafolgesymptomatik
 * Uses getFormattedTraumaSymptoms to ensure consistent counting
 */
export function countTraumaSymptoms(ts: FormTypes.Traumafolgesymptomatik): number {
  return getFormattedTraumaSymptoms(ts).length;
}
