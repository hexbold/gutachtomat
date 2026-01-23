/**
 * Counter utility for OrganischeSymptomatik modal
 * Provides formatted symptom list for modal footer and section preview
 */

import * as FormTypes from '@/lib/core/form-types';
import {
  QUANTITATIVE_BEWUSSTSEINSSTOERUNG_LABELS,
  QUALITATIVE_BEWUSSTSEINSSTOERUNG_LABELS,
  ORGANISCH_ATTENTIONAL_LABELS,
  ORGANISCH_MNESTISCH_LABELS,
  ORGANISCH_EXEKUTIV_LABELS,
  ORGANISCH_SPRACHLICH_LABELS,
  ORGANISCH_DENKSTOERUNG_LABELS,
  ORGANISCH_ORIENTIERUNG_LABELS,
  ORGANISCH_EMOTION_LABELS,
  ORGANISCH_AMNESTISCH_LABELS,
  ALLTAGSKOMPETENZ_STATUS_LABELS,
  BASALE_ALLTAGSKOMPETENZ_LABELS,
  INSTRUMENTELLE_ALLTAGSKOMPETENZ_LABELS,
} from '@/lib/core/form-labels';

/**
 * Formats a CardSelection entry with optional brackets text
 */
function formatWithBrackets(label: string, brackets?: string): string {
  const trimmed = brackets?.trim();
  return trimmed ? `${label} (${trimmed})` : label;
}

/**
 * Returns formatted list of selected organic symptoms for display
 */
export function getFormattedOrganischeSymptoms(os: FormTypes.OrganischeSymptomatik): string[] {
  const symptoms: string[] = [];

  // Quantitative Bewusstseinsstörung (single-select)
  if (os.quantitativeBewusstsein) {
    symptoms.push(QUANTITATIVE_BEWUSSTSEINSSTOERUNG_LABELS[os.quantitativeBewusstsein]);
  }

  // Qualitative Bewusstseinsstörung (single-select)
  if (os.qualitativeBewusstsein) {
    symptoms.push(QUALITATIVE_BEWUSSTSEINSSTOERUNG_LABELS[os.qualitativeBewusstsein]);
  }

  // Attentionale Symptome
  for (const [key, entry] of Object.entries(os.attentional)) {
    if (entry?.selected) {
      const label = ORGANISCH_ATTENTIONAL_LABELS[key as FormTypes.OrganischAttentionalSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Mnestische Symptome
  for (const [key, entry] of Object.entries(os.mnestisch)) {
    if (entry?.selected) {
      const label = ORGANISCH_MNESTISCH_LABELS[key as FormTypes.OrganischMnestischSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Exekutiv-funktionale Symptome
  for (const [key, entry] of Object.entries(os.exekutiv)) {
    if (entry?.selected) {
      const label = ORGANISCH_EXEKUTIV_LABELS[key as FormTypes.OrganischExekutivSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Sprachliche Symptome
  for (const [key, entry] of Object.entries(os.sprachlich)) {
    if (entry?.selected) {
      const label = ORGANISCH_SPRACHLICH_LABELS[key as FormTypes.OrganischSprachlichSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Denkstörungen
  for (const [key, entry] of Object.entries(os.denkstoerungen)) {
    if (entry?.selected) {
      const label = ORGANISCH_DENKSTOERUNG_LABELS[key as FormTypes.OrganischDenkstoerungSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Orientierungsstörungen
  for (const [key, entry] of Object.entries(os.orientierung)) {
    if (entry?.selected) {
      const label = ORGANISCH_ORIENTIERUNG_LABELS[key as FormTypes.OrganischOrientierungSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Emotionsbezogene Symptome
  for (const [key, entry] of Object.entries(os.emotionsbezogen)) {
    if (entry?.selected) {
      const label = ORGANISCH_EMOTION_LABELS[key as FormTypes.OrganischEmotionSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Amnestische Symptome
  for (const [key, entry] of Object.entries(os.amnestisch)) {
    if (entry?.selected) {
      const label = ORGANISCH_AMNESTISCH_LABELS[key as FormTypes.OrganischAmnestischSymptom];
      symptoms.push(formatWithBrackets(label, entry.details?.brackets));
    }
  }

  // Basale Alltagskompetenzen (tri-state)
  for (const [key, status] of Object.entries(os.basaleAlltagskompetenzen)) {
    if (status) {
      const itemLabel = BASALE_ALLTAGSKOMPETENZ_LABELS[key as FormTypes.BasaleAlltagskompetenz];
      const statusLabel = ALLTAGSKOMPETENZ_STATUS_LABELS[status];
      symptoms.push(`${itemLabel}: ${statusLabel}`);
    }
  }

  // Instrumentelle Alltagskompetenzen (tri-state)
  for (const [key, status] of Object.entries(os.instrumentelleAlltagskompetenzen)) {
    if (status) {
      const itemLabel = INSTRUMENTELLE_ALLTAGSKOMPETENZ_LABELS[key as FormTypes.InstrumentelleAlltagskompetenz];
      const statusLabel = ALLTAGSKOMPETENZ_STATUS_LABELS[status];
      symptoms.push(`${itemLabel}: ${statusLabel}`);
    }
  }

  // Andere
  if (os.andereSymptome?.trim()) {
    symptoms.push(os.andereSymptome.trim());
  }

  return symptoms;
}

/**
 * Returns the count of selected organic symptoms
 */
export function getOrganischeSymptomsCount(os: FormTypes.OrganischeSymptomatik): number {
  return getFormattedOrganischeSymptoms(os).length;
}
