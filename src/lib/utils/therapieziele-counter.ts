/**
 * Utility to count and format selected Therapieziele
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
// THERAPIEZIELE PROBLEM BEWÄLTIGUNG (12 subcategories)
// ============================================================================

export function countProblemBewaeltigung(data: FormTypes.TherapiezieleProblemBewaeltigung): number {
  return (
    countCardSelection(data.depressivesErleben) +
    countCardSelection(data.selbstverletzen) +
    countCardSelection(data.aengste) +
    countCardSelection(data.zwaenge) +
    countCardSelection(data.trauma) +
    countCardSelection(data.sucht) +
    countCardSelection(data.essverhalten) +
    countCardSelection(data.schlaf) +
    countCardSelection(data.sexualitaet) +
    countCardSelection(data.koerperlich) +
    countCardSelection(data.lebensbereiche) +
    countCardSelection(data.stress)
  );
}

export function getFormattedProblemBewaeltigung(data: FormTypes.TherapiezieleProblemBewaeltigung): string[] {
  return [
    ...formatCardSelection(data.depressivesErleben, Labels.THERAPIEZIEL_DEPRESSIVES_ERLEBEN_LABELS),
    ...formatCardSelection(data.selbstverletzen, Labels.THERAPIEZIEL_SELBSTVERLETZEN_LABELS),
    ...formatCardSelection(data.aengste, Labels.THERAPIEZIEL_AENGSTE_LABELS),
    ...formatCardSelection(data.zwaenge, Labels.THERAPIEZIEL_ZWAENGE_LABELS),
    ...formatCardSelection(data.trauma, Labels.THERAPIEZIEL_TRAUMA_LABELS),
    ...formatCardSelection(data.sucht, Labels.THERAPIEZIEL_SUCHT_LABELS),
    ...formatCardSelection(data.essverhalten, Labels.THERAPIEZIEL_ESSVERHALTEN_LABELS),
    ...formatCardSelection(data.schlaf, Labels.THERAPIEZIEL_SCHLAF_LABELS),
    ...formatCardSelection(data.sexualitaet, Labels.THERAPIEZIEL_SEXUALITAET_LABELS),
    ...formatCardSelection(data.koerperlich, Labels.THERAPIEZIEL_KOERPERLICH_LABELS),
    ...formatCardSelection(data.lebensbereiche, Labels.THERAPIEZIEL_LEBENSBEREICHE_LABELS),
    ...formatCardSelection(data.stress, Labels.THERAPIEZIEL_STRESS_LABELS),
  ];
}

// ============================================================================
// THERAPIEZIELE ZWISCHENMENSCHLICH (5 subcategories)
// ============================================================================

export function countZwischenmenschlich(data: FormTypes.TherapiezieleZwischenmenschlich): number {
  return (
    countCardSelection(data.partnerschaft) +
    countCardSelection(data.elternschaft) +
    countCardSelection(data.alleinsein) +
    countCardSelection(data.selbstbehauptung) +
    countCardSelection(data.kontaktNaehe)
  );
}

export function getFormattedZwischenmenschlich(data: FormTypes.TherapiezieleZwischenmenschlich): string[] {
  return [
    ...formatCardSelection(data.partnerschaft, Labels.THERAPIEZIEL_PARTNERSCHAFT_LABELS),
    ...formatCardSelection(data.elternschaft, Labels.THERAPIEZIEL_ELTERNSCHAFT_LABELS),
    ...formatCardSelection(data.alleinsein, Labels.THERAPIEZIEL_ALLEINSEIN_LABELS),
    ...formatCardSelection(data.selbstbehauptung, Labels.THERAPIEZIEL_SELBSTBEHAUPTUNG_LABELS),
    ...formatCardSelection(data.kontaktNaehe, Labels.THERAPIEZIEL_KONTAKT_NAEHE_LABELS),
  ];
}

// ============================================================================
// THERAPIEZIELE WOHLBEFINDEN (5 subcategories)
// ============================================================================

export function countWohlbefinden(data: FormTypes.TherapiezieleWohlbefinden): number {
  return (
    countCardSelection(data.bewegung) +
    countCardSelection(data.entspannung) +
    countCardSelection(data.wohlbefinden) +
    countCardSelection(data.zeitperspektive) +
    countCardSelection(data.sinnfindung)
  );
}

export function getFormattedWohlbefinden(data: FormTypes.TherapiezieleWohlbefinden): string[] {
  return [
    ...formatCardSelection(data.bewegung, Labels.THERAPIEZIEL_BEWEGUNG_LABELS),
    ...formatCardSelection(data.entspannung, Labels.THERAPIEZIEL_ENTSPANNUNG_LABELS),
    ...formatCardSelection(data.wohlbefinden, Labels.THERAPIEZIEL_WOHLBEFINDEN_LABELS),
    ...formatCardSelection(data.zeitperspektive, Labels.THERAPIEZIEL_ZEITPERSPEKTIVE_LABELS),
    ...formatCardSelection(data.sinnfindung, Labels.THERAPIEZIEL_SINNFINDUNG_LABELS),
  ];
}

// ============================================================================
// THERAPIEZIELE SELBSTBEZOGEN (4 subcategories)
// ============================================================================

export function countSelbstbezogen(data: FormTypes.TherapiezieleSelbstbezogen): number {
  return (
    countCardSelection(data.selbsteinstellung) +
    countCardSelection(data.beduerfnisse) +
    countCardSelection(data.leistung) +
    countCardSelection(data.gefuehle)
  );
}

export function getFormattedSelbstbezogen(data: FormTypes.TherapiezieleSelbstbezogen): string[] {
  return [
    ...formatCardSelection(data.selbsteinstellung, Labels.THERAPIEZIEL_SELBSTEINSTELLUNG_LABELS),
    ...formatCardSelection(data.beduerfnisse, Labels.THERAPIEZIEL_BEDUERFNISSE_LABELS),
    ...formatCardSelection(data.leistung, Labels.THERAPIEZIEL_LEISTUNG_LABELS),
    ...formatCardSelection(data.gefuehle, Labels.THERAPIEZIEL_GEFUEHLE_LABELS),
  ];
}

// ============================================================================
// TOTAL THERAPIEZIELE
// ============================================================================

export function countAllTherapieziele(data: FormTypes.TherapiezieleData): number {
  return (
    countProblemBewaeltigung(data.problemBewaeltigung) +
    countZwischenmenschlich(data.zwischenmenschlich) +
    countWohlbefinden(data.wohlbefinden) +
    countSelbstbezogen(data.selbstbezogen)
  );
}

export function getFormattedAllTherapieziele(data: FormTypes.TherapiezieleData): string[] {
  return [
    ...getFormattedProblemBewaeltigung(data.problemBewaeltigung),
    ...getFormattedZwischenmenschlich(data.zwischenmenschlich),
    ...getFormattedWohlbefinden(data.wohlbefinden),
    ...getFormattedSelbstbezogen(data.selbstbezogen),
  ];
}
