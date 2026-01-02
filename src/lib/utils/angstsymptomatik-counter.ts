/**
 * Utility to count and format selected Angstsymptomatik symptoms
 * Used by both the modal footer and the main section preview
 */

import * as FormTypes from '../core/form-types';
import {
  ANGST_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS,
  ANGST_KOGNITION_SYMPTOM_LABELS,
  ANGST_SORGEN_TYP_LABELS,
  ANGST_SORGEN_LABEL,
  ANGST_SOMATOVEGETATIV_SYMPTOM_LABELS,
  ANGST_VERHALTEN_FELD_LABELS,
  ANGST_DISSOCIATIV_SYMPTOM_LABELS,
  ANGST_PANIKSTOERUNG_SYMPTOM_LABELS,
  AGORAPHOBIE_BEREICH_LABELS,
  AGORAPHOBIE_FLUCHT_LABELS,
  AGORAPHOBIE_PANIKSYMPTOMATIK_LABELS,
  SOZIALE_PHOBIE_HAUPTSYMPTOM_LABELS,
  SOZIALE_PHOBIE_BEREICH_LABELS,
  SOZIALE_PHOBIE_VEGETATIV_LABELS,
  SPEZIFISCHE_PHOBIE_LABELS,
  GENERALISIERTE_ANGST_HAUPTSYMPTOM_LABELS,
  GENERALISIERTE_ANGST_SORGEN_LABELS,
} from '../core/form-labels';

/**
 * Returns an array of formatted symptom strings for Angstsymptomatik
 * This is the single source of truth for counting - used by both modal footer and main section
 */
export function getFormattedAngstSymptoms(angst: FormTypes.Angstsymptomatik): string[] {
  const symptoms: string[] = [];

  // Emotionales Erleben (CardSelection pattern)
  for (const [key, entry] of Object.entries(angst.emotionalesErleben)) {
    if (entry?.selected) {
      const label = ANGST_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS[key as FormTypes.AngstEmotionalesErlebenSymptom];
      const brackets = entry.details?.brackets?.trim();
      if (brackets) {
        symptoms.push(`${label} (${brackets})`);
      } else {
        symptoms.push(label);
      }
    }
  }

  // Kognition - CardSelection symptoms (excluding sorgen)
  for (const [key, val] of Object.entries(angst.kognition)) {
    if (key !== 'sorgen' && val && typeof val === 'object' && 'selected' in val && val.selected) {
      const entry = val as FormTypes.CardSelectionEntry;
      const label = ANGST_KOGNITION_SYMPTOM_LABELS[key as FormTypes.AngstKognitionSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Kognition - Sorgen (if selected, add top-level + sub-items)
  if (angst.kognition.sorgen?.selected) {
    const sorgen = angst.kognition.sorgen;

    // Top-level Sorgen with optional brackets
    const topBrackets = sorgen.brackets?.trim();
    const topLabel = topBrackets ? `${ANGST_SORGEN_LABEL} (${topBrackets})` : ANGST_SORGEN_LABEL;

    // Check if there are any sub-items
    const subItems: string[] = [];
    for (const [key, entry] of Object.entries(sorgen.details)) {
      if (entry && entry.selected) {
        const label = ANGST_SORGEN_TYP_LABELS[key as FormTypes.AngstSorgenTyp];
        const brackets = entry.details?.brackets?.trim();
        const labelWithBrackets = brackets ? `${label} (${brackets})` : label;
        subItems.push(labelWithBrackets);
      }
    }

    // Add top-level if it has brackets/text OR no sub-items exist
    if (topBrackets || sorgen.text?.trim() || subItems.length === 0) {
      symptoms.push(topLabel);
    }

    // Add all sub-items
    symptoms.push(...subItems);
  }

  // Somatovegetative Symptome (CardSelection pattern)
  for (const [key, entry] of Object.entries(angst.somatovegetativeSymptome)) {
    if (entry?.selected) {
      const label = ANGST_SOMATOVEGETATIV_SYMPTOM_LABELS[key as FormTypes.AngstSomatovegetativSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Verhalten (CardSelection pattern)
  for (const [key, entry] of Object.entries(angst.verhalten)) {
    if (entry?.selected) {
      const label = ANGST_VERHALTEN_FELD_LABELS[key as FormTypes.AngstVerhaltenFeld];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Dissoziative Symptome (CardSelection pattern)
  for (const [key, entry] of Object.entries(angst.dissoziativeSymptome)) {
    if (entry?.selected) {
      const label = ANGST_DISSOCIATIV_SYMPTOM_LABELS[key as FormTypes.AngstDissociativSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Panikstörung (CardSelection pattern)
  for (const [key, entry] of Object.entries(angst.panikstoerung)) {
    if (entry?.selected) {
      const label = ANGST_PANIKSTOERUNG_SYMPTOM_LABELS[key as FormTypes.AngstPanikstoerungSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Agoraphobie
  const selectedPaniksymptomatik = Object.entries(angst.agoraphobie?.paniksymptomatik || {})
    .find(([, entry]) => entry?.selected);
  if (selectedPaniksymptomatik) {
    const [key, entry] = selectedPaniksymptomatik;
    let label = `Agoraphobie (${AGORAPHOBIE_PANIKSYMPTOMATIK_LABELS[key as FormTypes.AgoraphobiePaniksymptomatik]})`;
    if (entry?.details?.brackets?.trim()) {
      label += ` (${entry.details.brackets.trim()})`;
    }
    symptoms.push(label);

    // Bereiche (CardSelection pattern)
    for (const [bereichKey, entry] of Object.entries(angst.agoraphobie.bereiche)) {
      if (entry?.selected) {
        let bereichLabel = AGORAPHOBIE_BEREICH_LABELS[bereichKey as FormTypes.AgoraphobieBereich];
        if (entry.details?.brackets?.trim()) {
          bereichLabel += ` (${entry.details.brackets.trim()})`;
        }
        symptoms.push(bereichLabel);
      }
    }
    if (angst.agoraphobie.bereicheAndere.trim()) {
      symptoms.push(`Andere Bereiche: ${angst.agoraphobie.bereicheAndere.trim()}`);
    }

    // Fluchtmöglichkeiten (CardSelection pattern)
    for (const [fluchtKey, entry] of Object.entries(angst.agoraphobie.fluchtmoeglichkeiten)) {
      if (entry?.selected) {
        let fluchtLabel = AGORAPHOBIE_FLUCHT_LABELS[fluchtKey as FormTypes.AgoraphobieFlucht];
        if (entry.details?.brackets?.trim()) {
          fluchtLabel += ` (${entry.details.brackets.trim()})`;
        }
        symptoms.push(fluchtLabel);
      }
    }
    if (angst.agoraphobie.fluchtmoeglichkeitenAndere.trim()) {
      symptoms.push(`Andere Fluchtmöglichkeiten: ${angst.agoraphobie.fluchtmoeglichkeitenAndere.trim()}`);
    }
  }

  // Soziale Phobie - only count actual selected items, not the existence of the structure
  // (Structure may exist just because user expanded "Bereich sozialer Ängste" or "Vegetative Symptome")
  if ('hauptsymptome' in angst.sozialePhobie) {
    const sozialePhobie = angst.sozialePhobie as FormTypes.SozialePhobieSelected;

    // Hauptsymptome (CardSelection pattern)
    for (const [key, val] of Object.entries(sozialePhobie.hauptsymptome)) {
      if (val?.selected) {
        symptoms.push(SOZIALE_PHOBIE_HAUPTSYMPTOM_LABELS[key as FormTypes.SozialePhobieHauptsymptom]);
      }
    }

    // Bereich sozialer Ängste - only count actual sub-items (CardSelection pattern)
    for (const [key, val] of Object.entries(sozialePhobie.bereichSozialerAengste.selection)) {
      if (val?.selected) {
        symptoms.push(SOZIALE_PHOBIE_BEREICH_LABELS[key as FormTypes.SozialePhobieBereichSymptom]);
      }
    }
    if (sozialePhobie.bereichSozialerAengste.andere.trim()) {
      symptoms.push(`Andere Bereiche: ${sozialePhobie.bereichSozialerAengste.andere.trim()}`);
    }

    // Vegetative Symptome - only count actual sub-items (CardSelection pattern)
    for (const [key, val] of Object.entries(sozialePhobie.vegetativeSymptome.selection)) {
      if (val?.selected) {
        symptoms.push(SOZIALE_PHOBIE_VEGETATIV_LABELS[key as FormTypes.SozialePhobieVegetativSymptom]);
      }
    }
    if (sozialePhobie.vegetativeSymptome.andere.trim()) {
      symptoms.push(`Andere vegetative Symptome: ${sozialePhobie.vegetativeSymptome.andere.trim()}`);
    }
  }

  // Spezifische Phobien (CardSelection pattern)
  for (const [key, entry] of Object.entries(angst.spezifischePhobien)) {
    if (entry?.selected) {
      const label = SPEZIFISCHE_PHOBIE_LABELS[key as FormTypes.SpezifischePhobieSymptom];
      const brackets = entry.details?.brackets?.trim();
      symptoms.push(brackets ? `${label} (${brackets})` : label);
    }
  }

  // Generalisierte Angststörung (CardSelection pattern)
  if (angst.generalisierteAngst && 'hauptsymptome' in angst.generalisierteAngst) {
    const genAngst = angst.generalisierteAngst as FormTypes.GeneralisierteAngstSelected;

    // Count hauptsymptome
    for (const [key, entry] of Object.entries(genAngst.hauptsymptome)) {
      if (entry?.selected) {
        const label = GENERALISIERTE_ANGST_HAUPTSYMPTOM_LABELS[key as FormTypes.GeneralisierteAngstHauptsymptom];
        const brackets = entry.details?.brackets?.trim();
        symptoms.push(brackets ? `${label} (${brackets})` : label);
      }
    }

    // Count sorgen symptoms
    for (const [key, entry] of Object.entries(genAngst.sorgen.selection)) {
      if (entry?.selected) {
        const label = GENERALISIERTE_ANGST_SORGEN_LABELS[key as FormTypes.GeneralisierteAngstSorgenSymptom];
        const brackets = entry.details?.brackets?.trim();
        symptoms.push(brackets ? `${label} (${brackets})` : label);
      }
    }

    // Include andere text if provided
    if (genAngst.sorgen.andere?.trim()) {
      symptoms.push(genAngst.sorgen.andere.trim());
    }
  }

  // Andere Symptome (free text)
  if (angst.andereSymptome && angst.andereSymptome.trim()) {
    symptoms.push(`Andere: ${angst.andereSymptome.trim()}`);
  }

  return symptoms;
}

/**
 * Counts the total number of selected symptoms in Angstsymptomatik
 * Uses getFormattedAngstSymptoms to ensure consistent counting
 */
export function countAngstSymptoms(angst: FormTypes.Angstsymptomatik): number {
  return getFormattedAngstSymptoms(angst).length;
}
