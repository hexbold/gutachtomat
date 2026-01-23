/**
 * Utility to count and format selected Behandlungsplan interventions
 * Used by both the modal footer and the main section preview
 */

import * as FormTypes from '../core/form-types';
import * as Labels from '../core/form-labels';

type CardSelectionEntry = { selected: true; details: { brackets?: string; text?: string } };

/**
 * Generic helper to count items in a CardSelection object
 */
function countCardSelection(selection: Record<string, CardSelectionEntry | undefined>): number {
  return Object.values(selection).filter(entry => entry?.selected).length;
}

/**
 * Generic helper to format items from a CardSelection object
 */
function formatCardSelection(
  selection: Record<string, CardSelectionEntry | undefined>,
  labels: Record<string, string>
): string[] {
  const items: string[] = [];
  for (const [key, entry] of Object.entries(selection)) {
    if (entry?.selected) {
      const label = labels[key] || key;
      const brackets = entry.details?.brackets?.trim();
      items.push(brackets ? `${label} (${brackets})` : label);
    }
  }
  return items;
}

// ============================================================================
// INDIVIDUAL INTERVENTION CATEGORIES
// ============================================================================

export function countAllgemeineInterventionen(data: FormTypes.AllgemeineInterventionSelection): number {
  return countCardSelection(data);
}

export function getFormattedAllgemeineInterventionen(data: FormTypes.AllgemeineInterventionSelection): string[] {
  return formatCardSelection(data, Labels.ALLGEMEINE_INTERVENTION_LABELS);
}

export function countDepressionInterventionen(data: FormTypes.DepressionInterventionSelection): number {
  return countCardSelection(data);
}

export function getFormattedDepressionInterventionen(data: FormTypes.DepressionInterventionSelection): string[] {
  return formatCardSelection(data, Labels.DEPRESSION_INTERVENTION_LABELS);
}

export function countBipolareInterventionen(data: FormTypes.BipolareInterventionSelection): number {
  return countCardSelection(data);
}

export function getFormattedBipolareInterventionen(data: FormTypes.BipolareInterventionSelection): string[] {
  return formatCardSelection(data, Labels.BIPOLARE_INTERVENTION_LABELS);
}

export function countAngstInterventionen(data: FormTypes.AngstInterventionSelection): number {
  return countCardSelection(data);
}

export function getFormattedAngstInterventionen(data: FormTypes.AngstInterventionSelection): string[] {
  return formatCardSelection(data, Labels.ANGST_INTERVENTION_LABELS);
}

export function countBorderlineInterventionen(data: FormTypes.BorderlineInterventionSelection): number {
  return countCardSelection(data);
}

export function getFormattedBorderlineInterventionen(data: FormTypes.BorderlineInterventionSelection): string[] {
  return formatCardSelection(data, Labels.BORDERLINE_INTERVENTION_LABELS);
}

export function countPTBSInterventionen(data: FormTypes.PTBSInterventionSelection): number {
  return countCardSelection(data);
}

export function getFormattedPTBSInterventionen(data: FormTypes.PTBSInterventionSelection): string[] {
  return formatCardSelection(data, Labels.PTBS_INTERVENTION_LABELS);
}

export function countZwangInterventionen(data: FormTypes.ZwangInterventionSelection): number {
  return countCardSelection(data);
}

export function getFormattedZwangInterventionen(data: FormTypes.ZwangInterventionSelection): string[] {
  return formatCardSelection(data, Labels.ZWANG_INTERVENTION_LABELS);
}

export function countSomatoformeInterventionen(data: FormTypes.SomatoformeInterventionSelection): number {
  return countCardSelection(data);
}

export function getFormattedSomatoformeInterventionen(data: FormTypes.SomatoformeInterventionSelection): string[] {
  return formatCardSelection(data, Labels.SOMATOFORME_INTERVENTION_LABELS);
}

export function countAnorexieInterventionen(data: FormTypes.AnorexieInterventionSelection): number {
  return countCardSelection(data);
}

export function getFormattedAnorexieInterventionen(data: FormTypes.AnorexieInterventionSelection): string[] {
  return formatCardSelection(data, Labels.ANOREXIE_INTERVENTION_LABELS);
}

export function countBulimieInterventionen(data: FormTypes.BulimieInterventionSelection): number {
  return countCardSelection(data);
}

export function getFormattedBulimieInterventionen(data: FormTypes.BulimieInterventionSelection): string[] {
  return formatCardSelection(data, Labels.BULIMIE_INTERVENTION_LABELS);
}

export function countPsychoseInterventionen(data: FormTypes.PsychoseInterventionSelection): number {
  return countCardSelection(data);
}

export function getFormattedPsychoseInterventionen(data: FormTypes.PsychoseInterventionSelection): string[] {
  return formatCardSelection(data, Labels.PSYCHOSE_INTERVENTION_LABELS);
}

// ============================================================================
// TOTAL BEHANDLUNGSPLAN
// ============================================================================

export function countAllBehandlungsplan(data: FormTypes.BehandlungsplanData): number {
  return (
    countAllgemeineInterventionen(data.allgemeine) +
    countDepressionInterventionen(data.depression) +
    countBipolareInterventionen(data.bipolare) +
    countAngstInterventionen(data.angst) +
    countBorderlineInterventionen(data.borderline) +
    countPTBSInterventionen(data.ptbs) +
    countZwangInterventionen(data.zwang) +
    countSomatoformeInterventionen(data.somatoforme) +
    countAnorexieInterventionen(data.anorexie) +
    countBulimieInterventionen(data.bulimie) +
    countPsychoseInterventionen(data.psychose)
  );
}

export function getFormattedAllBehandlungsplan(data: FormTypes.BehandlungsplanData): string[] {
  return [
    ...getFormattedAllgemeineInterventionen(data.allgemeine),
    ...getFormattedDepressionInterventionen(data.depression),
    ...getFormattedBipolareInterventionen(data.bipolare),
    ...getFormattedAngstInterventionen(data.angst),
    ...getFormattedBorderlineInterventionen(data.borderline),
    ...getFormattedPTBSInterventionen(data.ptbs),
    ...getFormattedZwangInterventionen(data.zwang),
    ...getFormattedSomatoformeInterventionen(data.somatoforme),
    ...getFormattedAnorexieInterventionen(data.anorexie),
    ...getFormattedBulimieInterventionen(data.bulimie),
    ...getFormattedPsychoseInterventionen(data.psychose),
  ];
}

/**
 * Returns counts per category for display in the UI
 */
export function getBehandlungsplanCategoryCounts(data: FormTypes.BehandlungsplanData): Record<string, number> {
  return {
    allgemeine: countAllgemeineInterventionen(data.allgemeine),
    depression: countDepressionInterventionen(data.depression),
    bipolare: countBipolareInterventionen(data.bipolare),
    angst: countAngstInterventionen(data.angst),
    borderline: countBorderlineInterventionen(data.borderline),
    ptbs: countPTBSInterventionen(data.ptbs),
    zwang: countZwangInterventionen(data.zwang),
    somatoforme: countSomatoformeInterventionen(data.somatoforme),
    anorexie: countAnorexieInterventionen(data.anorexie),
    bulimie: countBulimieInterventionen(data.bulimie),
    psychose: countPsychoseInterventionen(data.psychose),
  };
}
