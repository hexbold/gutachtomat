import * as FormTypes from '@/lib/core/form-types';
import {
  PATHOLOGISCHES_SPIELEN_LABELS,
  PYROMANIE_LABELS,
  KLEPTOMANIE_LABELS,
  TRICHOTILLOMANIE_LABELS,
} from '@/lib/core/form-labels';

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

// Returns formatted list of all selected Impulskontrollstoerungen symptoms
export function getFormattedImpulskontrollstoerungen(data: FormTypes.Impulskontrollstoerungen): string[] {
  const symptoms: string[] = [];

  symptoms.push(...getSelectedLabels(data.pathologischesSpielen, PATHOLOGISCHES_SPIELEN_LABELS));
  symptoms.push(...getSelectedLabels(data.pyromanie, PYROMANIE_LABELS));
  symptoms.push(...getSelectedLabels(data.kleptomanie, KLEPTOMANIE_LABELS));
  symptoms.push(...getSelectedLabels(data.trichotillomanie, TRICHOTILLOMANIE_LABELS));

  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms;
}

// Returns total count of selected symptoms
export function getImpulskontrollstoerungenCount(data: FormTypes.Impulskontrollstoerungen): number {
  return getFormattedImpulskontrollstoerungen(data).length;
}
