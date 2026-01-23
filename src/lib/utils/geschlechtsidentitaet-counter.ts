import * as FormTypes from '@/lib/core/form-types';
import { GESCHLECHTSIDENTITAET_LABELS } from '@/lib/core/form-labels';

// Helper to get selected labels from CardSelection
function getSelectedLabels<E extends string>(
  selection: FormTypes.CardSelection<E> | undefined,
  labels: Record<E, string>
): string[] {
  if (!selection) return [];
  return Object.keys(selection)
    .filter(key => selection[key as E]?.selected)
    .map(key => labels[key as E]);
}

// Returns formatted list of all selected Geschlechtsidentitaet symptoms
export function getFormattedGeschlechtsidentitaet(data: FormTypes.GeschlechtsidentitaetSymptomatik): string[] {
  const symptoms: string[] = [];

  symptoms.push(...getSelectedLabels(data.symptome, GESCHLECHTSIDENTITAET_LABELS));

  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms;
}

// Returns total count of selected symptoms
export function getGeschlechtsidentitaetCount(data: FormTypes.GeschlechtsidentitaetSymptomatik): number {
  return getFormattedGeschlechtsidentitaet(data).length;
}
