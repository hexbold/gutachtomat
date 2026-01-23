/**
 * Counter utility for SubstanzbezogeneSymptomatik modal
 * Provides formatted symptom list for modal footer and section preview
 */

import * as FormTypes from '@/lib/core/form-types';
import {
  SUBSTANZ_ABHAENGIGKEIT_LABELS,
  SUBSTANZ_SOMATOVEGETATIV_LABELS,
  SUBSTANZ_PSYCHOMOTORIK_LABELS,
  SUBSTANZ_VERHALTEN_LABELS,
  SUBSTANZ_EMOTIONAL_LABELS,
  SUBSTANZ_SCHLAF_LABELS,
  SUBSTANZ_NEUROLOGISCH_LABELS,
  SUBSTANZ_KOGNITIV_LABELS,
  SUBSTANZ_PSYCHOTISCH_LABELS,
  SUBSTANZ_DISSOCIATIV_LABELS,
} from '@/lib/core/form-labels';

/**
 * Formats a CardSelection entry with optional brackets text
 */
function formatWithBrackets(label: string, brackets?: string): string {
  const trimmed = brackets?.trim();
  return trimmed ? `${label} (${trimmed})` : label;
}

/**
 * Returns formatted list of selected substance-related symptoms for display
 */
export function getFormattedSubstanzbezogene(data: FormTypes.SubstanzbezogeneSymptomatik): string[] {
  const symptoms: string[] = [];

  // Abhängigkeitssymptome
  for (const [key, entry] of Object.entries(data.abhaengigkeit)) {
    if (entry?.selected) {
      const label = SUBSTANZ_ABHAENGIGKEIT_LABELS[key as FormTypes.SubstanzAbhaengigkeitSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Somatovegetative Symptome
  for (const [key, entry] of Object.entries(data.somatovegetativ)) {
    if (entry?.selected) {
      const label = SUBSTANZ_SOMATOVEGETATIV_LABELS[key as FormTypes.SubstanzSomatovegetativSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Psychomotorik
  for (const [key, entry] of Object.entries(data.psychomotorik)) {
    if (entry?.selected) {
      const label = SUBSTANZ_PSYCHOMOTORIK_LABELS[key as FormTypes.SubstanzPsychomotorikSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Verhalten
  for (const [key, entry] of Object.entries(data.verhalten)) {
    if (entry?.selected) {
      const label = SUBSTANZ_VERHALTEN_LABELS[key as FormTypes.SubstanzVerhaltenSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Emotionales Erleben
  for (const [key, entry] of Object.entries(data.emotionalesErleben)) {
    if (entry?.selected) {
      const label = SUBSTANZ_EMOTIONAL_LABELS[key as FormTypes.SubstanzEmotionalSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Schlaf
  for (const [key, entry] of Object.entries(data.schlaf)) {
    if (entry?.selected) {
      const label = SUBSTANZ_SCHLAF_LABELS[key as FormTypes.SubstanzSchlafSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Neurologische Symptome
  for (const [key, entry] of Object.entries(data.neurologisch)) {
    if (entry?.selected) {
      const label = SUBSTANZ_NEUROLOGISCH_LABELS[key as FormTypes.SubstanzNeurologischSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Kognition
  for (const [key, entry] of Object.entries(data.kognition)) {
    if (entry?.selected) {
      const label = SUBSTANZ_KOGNITIV_LABELS[key as FormTypes.SubstanzKognitivSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Psychotische Symptome
  for (const [key, entry] of Object.entries(data.psychotisch)) {
    if (entry?.selected) {
      const label = SUBSTANZ_PSYCHOTISCH_LABELS[key as FormTypes.SubstanzPsychotischSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Dissoziative Symptome
  for (const [key, entry] of Object.entries(data.dissociativ)) {
    if (entry?.selected) {
      const label = SUBSTANZ_DISSOCIATIV_LABELS[key as FormTypes.SubstanzDissociativSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Andere
  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms;
}

/**
 * Returns the count of selected substance-related symptoms
 */
export function getSubstanzbezogeneCount(data: FormTypes.SubstanzbezogeneSymptomatik): number {
  return getFormattedSubstanzbezogene(data).length;
}
