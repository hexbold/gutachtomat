import * as FormTypes from '@/lib/core/form-types';
import {
  HYPERKINETISCH_ATTENTIONAL_LABELS,
  HYPERKINETISCH_HYPERAKTIV_LABELS,
  HYPERKINETISCH_IMPULSIV_LABELS,
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

// Returns formatted list of all selected HyperkinetischeStoerungen symptoms
export function getFormattedHyperkinetischeStoerungen(data: FormTypes.HyperkinetischeStoerungen): string[] {
  const symptoms: string[] = [];

  symptoms.push(...getSelectedLabels(data.attentional, HYPERKINETISCH_ATTENTIONAL_LABELS));
  symptoms.push(...getSelectedLabels(data.hyperaktiv, HYPERKINETISCH_HYPERAKTIV_LABELS));
  symptoms.push(...getSelectedLabels(data.impulsiv, HYPERKINETISCH_IMPULSIV_LABELS));

  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms;
}

// Returns total count of selected symptoms
export function getHyperkinetischeStoerungCount(data: FormTypes.HyperkinetischeStoerungen): number {
  return getFormattedHyperkinetischeStoerungen(data).length;
}
