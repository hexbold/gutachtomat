/**
 * Counter utility for DissociativeSymptomatik modal
 * Provides formatted symptom list for modal footer and section preview
 */

import * as FormTypes from '@/lib/core/form-types';
import {
  DISSOCIATIVE_AMNESIE_LABELS,
  DISSOCIATIVE_FUGUE_LABELS,
  DISSOCIATIVER_STUPOR_LABELS,
  DISSOCIATIVE_BEWEGUNGSSTOERUNG_LABELS,
  DISSOCIATIVE_KRAMPFANFAELLE_LABELS,
  DISSOCIATIVE_SENSIBILITAET_LABELS,
  DISSOCIATIVE_IDENTITAET_LABELS,
  DEPERSONALISATION_DEREALISATION_LABELS,
} from '@/lib/core/form-labels';

/**
 * Formats a CardSelection entry with optional brackets text
 */
function formatWithBrackets(label: string, brackets?: string): string {
  const trimmed = brackets?.trim();
  return trimmed ? `${label} (${trimmed})` : label;
}

/**
 * Returns formatted list of selected dissociative symptoms for display
 */
export function getFormattedDissociative(data: FormTypes.DissociativeSymptomatik): string[] {
  const symptoms: string[] = [];

  // Amnesie
  for (const [key, entry] of Object.entries(data.amnesie)) {
    if (entry?.selected) {
      const label = DISSOCIATIVE_AMNESIE_LABELS[key as FormTypes.DissociativeAmnesieSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Fugue
  for (const [key, entry] of Object.entries(data.fugue)) {
    if (entry?.selected) {
      const label = DISSOCIATIVE_FUGUE_LABELS[key as FormTypes.DissociativeFugueSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Stupor
  for (const [key, entry] of Object.entries(data.stupor)) {
    if (entry?.selected) {
      const label = DISSOCIATIVER_STUPOR_LABELS[key as FormTypes.DissociativerStuporSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Bewegungsstörungen
  for (const [key, entry] of Object.entries(data.bewegungsstoerungen)) {
    if (entry?.selected) {
      const label = DISSOCIATIVE_BEWEGUNGSSTOERUNG_LABELS[key as FormTypes.DissociativeBewegungsstoerungSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Krampfanfälle
  for (const [key, entry] of Object.entries(data.krampfanfaelle)) {
    if (entry?.selected) {
      const label = DISSOCIATIVE_KRAMPFANFAELLE_LABELS[key as FormTypes.DissociativeKrampfanfaelleSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Sensibilitätsstörungen
  for (const [key, entry] of Object.entries(data.sensibilitaetsstoerungen)) {
    if (entry?.selected) {
      const label = DISSOCIATIVE_SENSIBILITAET_LABELS[key as FormTypes.DissociativeSensibilitaetsstoerungSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Identitätsstörung
  for (const [key, entry] of Object.entries(data.identitaetsstoerung)) {
    if (entry?.selected) {
      const label = DISSOCIATIVE_IDENTITAET_LABELS[key as FormTypes.DissociativeIdentitaetsstoerungSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Depersonalisation/Derealisation
  for (const [key, entry] of Object.entries(data.depersonalisationDerealisation)) {
    if (entry?.selected) {
      const label = DEPERSONALISATION_DEREALISATION_LABELS[key as FormTypes.DepersonalisationDerealisationSymptom];
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
 * Returns the count of selected dissociative symptoms
 */
export function getDissociativeCount(data: FormTypes.DissociativeSymptomatik): number {
  return getFormattedDissociative(data).length;
}
