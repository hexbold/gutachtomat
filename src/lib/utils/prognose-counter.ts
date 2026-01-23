/**
 * Utility to count and format selected Prognose factors
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
// GÜNSTIGE FAKTOREN
// ============================================================================

export function countGuenstigeFaktoren(data: FormTypes.PrognostischGuenstigSelection): number {
  return countCardSelection(data);
}

export function getFormattedGuenstigeFaktoren(data: FormTypes.PrognostischGuenstigSelection): string[] {
  return formatCardSelection(data, Labels.PROGNOSTISCH_GUENSTIG_LABELS);
}

// ============================================================================
// UNGÜNSTIGE FAKTOREN
// ============================================================================

export function countUnguenstigeFaktoren(data: FormTypes.PrognostischUnguenstigSelection): number {
  return countCardSelection(data);
}

export function getFormattedUnguenstigeFaktoren(data: FormTypes.PrognostischUnguenstigSelection): string[] {
  return formatCardSelection(data, Labels.PROGNOSTISCH_UNGUENSTIG_LABELS);
}

// ============================================================================
// TOTAL PROGNOSE
// ============================================================================

export function countAllPrognose(data: FormTypes.PrognoseData): number {
  let count = countGuenstigeFaktoren(data.guenstigeFaktoren);
  count += countUnguenstigeFaktoren(data.unguenstigeFaktoren);

  // Count "andere" fields if filled
  if (data.guenstigeFaktorenAndere?.trim()) count += 1;
  if (data.unguenstigeFaktorenAndere?.trim()) count += 1;

  // Count eingeschaetztePrognose if selected
  if (data.eingeschaetztePrognose) count += 1;

  return count;
}

export function getFormattedAllPrognose(data: FormTypes.PrognoseData): {
  guenstige: string[];
  unguenstige: string[];
  einschaetzung: string | null;
} {
  const guenstige = getFormattedGuenstigeFaktoren(data.guenstigeFaktoren);
  if (data.guenstigeFaktorenAndere?.trim()) {
    guenstige.push(`Andere: ${data.guenstigeFaktorenAndere.trim()}`);
  }

  const unguenstige = getFormattedUnguenstigeFaktoren(data.unguenstigeFaktoren);
  if (data.unguenstigeFaktorenAndere?.trim()) {
    unguenstige.push(`Andere: ${data.unguenstigeFaktorenAndere.trim()}`);
  }

  const einschaetzung = data.eingeschaetztePrognose
    ? Labels.EINGESCHAETZTE_PROGNOSE_LABELS[data.eingeschaetztePrognose]
    : null;

  return { guenstige, unguenstige, einschaetzung };
}
