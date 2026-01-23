import * as FormTypes from '@/lib/core/form-types';
import {
  SEXUELLE_FUNKTIONSSTOERUNG_LABELS,
  SEXUALPRAEFERENZSTOERUNG_LABELS,
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

// Returns formatted list of all selected SexuellbezogeneSymptome
export function getFormattedSexuellbezogeneSymptome(data: FormTypes.SexuellbezogeneSymptome): string[] {
  const symptoms: string[] = [];

  symptoms.push(...getSelectedLabels(data.funktionsstoerungen, SEXUELLE_FUNKTIONSSTOERUNG_LABELS));
  symptoms.push(...getSelectedLabels(data.praeferenzstoerungen, SEXUALPRAEFERENZSTOERUNG_LABELS));

  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms;
}

// Returns total count of selected symptoms
export function getSexuellbezogeneSymptomeCount(data: FormTypes.SexuellbezogeneSymptome): number {
  return getFormattedSexuellbezogeneSymptome(data).length;
}
