/**
 * Counter utility for PsychotischeSymptomatik modal
 * Provides formatted symptom list for modal footer and section preview
 */

import * as FormTypes from '@/lib/core/form-types';
import {
  FORMALE_WAHNMERKMALE_LABELS,
  INHALTLICHE_WAHNMERKMALE_LABELS,
  STIMMEN_HOEREN_TYP_LABELS,
  ANDERE_HALLUZINATION_TYP_LABELS,
  ICH_HAFTIGKEIT_SYMPTOM_LABELS,
  ICH_STOERUNG_ANDERE_SYMPTOM_LABELS,
  FORMALE_DENKSTOERUNG_SYMPTOM_LABELS,
  PSYCHOTISCH_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS,
  PSYCHOTISCH_VERHALTEN_SYMPTOM_LABELS,
  PSYCHOTISCH_KOGNITION_SYMPTOM_LABELS,
  KATATONE_SYMPTOM_LABELS,
} from '@/lib/core/form-labels';

/**
 * Formats a CardSelection entry with optional brackets text
 */
function formatWithBrackets(label: string, brackets?: string): string {
  const trimmed = brackets?.trim();
  return trimmed ? `${label} (${trimmed})` : label;
}

/**
 * Returns formatted list of selected psychotic symptoms for display
 */
export function getFormattedPsychotischeSymptoms(ps: FormTypes.PsychotischeSymptomatik): string[] {
  const symptoms: string[] = [];

  // Formale Wahnmerkmale
  for (const [key, entry] of Object.entries(ps.formaleWahnmerkmale)) {
    if (entry?.selected) {
      const label = FORMALE_WAHNMERKMALE_LABELS[key as FormTypes.FormaleWahnmerkmale];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Inhaltliche Wahnmerkmale
  for (const [key, entry] of Object.entries(ps.inhaltlicheWahnmerkmale)) {
    if (entry?.selected) {
      const label = INHALTLICHE_WAHNMERKMALE_LABELS[key as FormTypes.InhaltlicheWahnmerkmale];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Akustische Halluzination
  if (ps.akustischeHalluzination.type === 'stimmenhoeren') {
    for (const [key, entry] of Object.entries(ps.akustischeHalluzination.subtypes)) {
      if (entry?.selected) {
        const label = STIMMEN_HOEREN_TYP_LABELS[key as FormTypes.StimmenHoerenTyp];
        symptoms.push(formatWithBrackets(label, entry.details?.brackets));
      }
    }
  } else if (ps.akustischeHalluzination.type === 'akoasmen') {
    symptoms.push('Akoasmen');
  }

  // Andere Halluzinationen
  for (const [key, entry] of Object.entries(ps.andereHalluzinationen)) {
    if (entry?.selected) {
      const label = ANDERE_HALLUZINATION_TYP_LABELS[key as FormTypes.AndereHalluzinationTyp];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Ich-Haftigkeit
  for (const [key, entry] of Object.entries(ps.ichHaftigkeit)) {
    if (entry?.selected) {
      const label = ICH_HAFTIGKEIT_SYMPTOM_LABELS[key as FormTypes.IchHaftigkeitSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Ich-Störung Andere
  for (const [key, entry] of Object.entries(ps.ichStoerungAndere)) {
    if (entry?.selected) {
      const label = ICH_STOERUNG_ANDERE_SYMPTOM_LABELS[key as FormTypes.IchStoerungAndereSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Formale Denkstörungen
  for (const [key, entry] of Object.entries(ps.formaleDenkstoerungen)) {
    if (entry?.selected) {
      const label = FORMALE_DENKSTOERUNG_SYMPTOM_LABELS[key as FormTypes.FormaleDenkstoerungSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Emotionales Erleben
  for (const [key, entry] of Object.entries(ps.emotionalesErleben)) {
    if (entry?.selected) {
      const label = PSYCHOTISCH_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS[key as FormTypes.PsychotischEmotionalesErlebenSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Verhalten
  for (const [key, entry] of Object.entries(ps.verhalten)) {
    if (entry?.selected) {
      const label = PSYCHOTISCH_VERHALTEN_SYMPTOM_LABELS[key as FormTypes.PsychotischVerhaltenSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Kognition
  for (const [key, entry] of Object.entries(ps.kognition)) {
    if (entry?.selected) {
      const label = PSYCHOTISCH_KOGNITION_SYMPTOM_LABELS[key as FormTypes.PsychotischKognitionSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Katatone Symptome
  for (const [key, entry] of Object.entries(ps.katatoneSymptome)) {
    if (entry?.selected) {
      const label = KATATONE_SYMPTOM_LABELS[key as FormTypes.KatatoneSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Andere
  if (ps.andereSymptome?.trim()) {
    symptoms.push(ps.andereSymptome.trim());
  }

  return symptoms;
}

/**
 * Returns the count of selected psychotic symptoms
 */
export function getPsychotischeSymptomsCount(ps: FormTypes.PsychotischeSymptomatik): number {
  return getFormattedPsychotischeSymptoms(ps).length;
}
