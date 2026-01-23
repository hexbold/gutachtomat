import * as FormTypes from '@/lib/core/form-types';
import {
  PARANOIDE_PS_LABELS,
  SCHIZOIDE_PS_LABELS,
  SCHIZOTYPE_PS_LABELS,
  ANTISOZIALE_PS_LABELS,
  IMPULSIVER_TYP_LABELS,
  BORDERLINE_PS_LABELS,
  HISTRIONISCHE_PS_LABELS,
  NARZISSTISCHE_PS_LABELS,
  VERMEIDEND_PS_LABELS,
  DEPENDENTE_PS_LABELS,
  ZWANGHAFTE_PS_LABELS,
  PASSIV_AGGRESSIV_PS_LABELS,
  AENDERUNG_EXTREMBELASTUNG_LABELS,
  AENDERUNG_PSYCH_KRANKHEIT_LABELS,
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

// Returns formatted list of all selected Persoenlichkeitsstoerungen symptoms
export function getFormattedPersoenlichkeitsstoerungen(data: FormTypes.Persoenlichkeitsstoerungen): string[] {
  const symptoms: string[] = [];

  symptoms.push(...getSelectedLabels(data.paranoide, PARANOIDE_PS_LABELS));
  symptoms.push(...getSelectedLabels(data.schizoide, SCHIZOIDE_PS_LABELS));
  symptoms.push(...getSelectedLabels(data.schizotype, SCHIZOTYPE_PS_LABELS));
  symptoms.push(...getSelectedLabels(data.antisoziale, ANTISOZIALE_PS_LABELS));
  symptoms.push(...getSelectedLabels(data.impulsiverTyp, IMPULSIVER_TYP_LABELS));
  symptoms.push(...getSelectedLabels(data.borderline, BORDERLINE_PS_LABELS));
  symptoms.push(...getSelectedLabels(data.histrionische, HISTRIONISCHE_PS_LABELS));
  symptoms.push(...getSelectedLabels(data.narzisstische, NARZISSTISCHE_PS_LABELS));
  symptoms.push(...getSelectedLabels(data.vermeidend, VERMEIDEND_PS_LABELS));
  symptoms.push(...getSelectedLabels(data.dependente, DEPENDENTE_PS_LABELS));
  symptoms.push(...getSelectedLabels(data.zwanghafte, ZWANGHAFTE_PS_LABELS));
  symptoms.push(...getSelectedLabels(data.passivAggressiv, PASSIV_AGGRESSIV_PS_LABELS));
  symptoms.push(...getSelectedLabels(data.aenderungExtrembelastung, AENDERUNG_EXTREMBELASTUNG_LABELS));
  symptoms.push(...getSelectedLabels(data.aenderungPsychKrankheit, AENDERUNG_PSYCH_KRANKHEIT_LABELS));

  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms;
}

// Returns total count of selected symptoms
export function getPersoenlichkeitsstoerungenCount(data: FormTypes.Persoenlichkeitsstoerungen): number {
  return getFormattedPersoenlichkeitsstoerungen(data).length;
}
