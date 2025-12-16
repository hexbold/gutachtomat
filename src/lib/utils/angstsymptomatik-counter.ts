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
  ANGST_VEGETATIV_SYMPTOM_LABELS,
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
  GENERALISIERTE_ANGST_SYMPTOM_LABELS,
} from '../core/form-labels';

/**
 * Returns an array of formatted symptom strings for Angstsymptomatik
 * This is the single source of truth for counting - used by both modal footer and main section
 */
export function getFormattedAngstSymptoms(angst: FormTypes.Angstsymptomatik): string[] {
  const symptoms: string[] = [];

  // Emotionales Erleben
  for (const [key, val] of Object.entries(angst.emotionalesErleben)) {
    if (val === 'selected') {
      symptoms.push(ANGST_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS[key as FormTypes.AngstEmotionalesErlebenSymptom]);
    }
  }

  // Kognition - simple symptoms
  for (const [key, val] of Object.entries(angst.kognition)) {
    if (key !== 'sorgen' && val === 'selected') {
      symptoms.push(ANGST_KOGNITION_SYMPTOM_LABELS[key as FormTypes.AngstKognitionSymptom]);
    }
  }

  // Kognition - Sorgen (if selected, add sub-items or just "Sorgen" if no sub-items)
  if (angst.kognition.sorgen?.selected) {
    const subItems: string[] = [];
    for (const [key, entry] of Object.entries(angst.kognition.sorgen.details)) {
      if (entry && entry.selected) {
        const label = ANGST_SORGEN_TYP_LABELS[key as FormTypes.AngstSorgenTyp];
        if (entry.details?.text?.trim()) {
          subItems.push(`${label}: ${entry.details.text.trim()}`);
        } else {
          subItems.push(label);
        }
      }
    }
    // If sub-items selected, add them; otherwise just add "Sorgen"
    if (subItems.length > 0) {
      symptoms.push(...subItems);
    } else {
      symptoms.push(ANGST_SORGEN_LABEL);
    }
  }

  // Vegetative und somatische Symptome
  for (const [key, val] of Object.entries(angst.vegetativeSymptome)) {
    if (val === 'selected') {
      symptoms.push(ANGST_VEGETATIV_SYMPTOM_LABELS[key as FormTypes.AngstVegetativSymptom]);
    }
  }

  // Verhalten (text fields - show label + text if filled)
  for (const [key, val] of Object.entries(angst.verhalten)) {
    if (val && val.trim()) {
      const label = ANGST_VERHALTEN_FELD_LABELS[key as FormTypes.AngstVerhaltenFeld];
      symptoms.push(`${label}: ${val.trim()}`);
    }
  }

  // Dissoziative Symptome
  for (const [key, val] of Object.entries(angst.dissoziativeSymptome)) {
    if (val === 'selected') {
      symptoms.push(ANGST_DISSOCIATIV_SYMPTOM_LABELS[key as FormTypes.AngstDissociativSymptom]);
    }
  }

  // Panikstörung
  for (const [key, val] of Object.entries(angst.panikstoerung)) {
    if (val === 'selected') {
      symptoms.push(ANGST_PANIKSTOERUNG_SYMPTOM_LABELS[key as FormTypes.AngstPanikstoerungSymptom]);
    }
  }

  // Agoraphobie
  if ('paniksymptomatik' in angst.agoraphobie) {
    const agoraphobie = angst.agoraphobie as FormTypes.AgoraphobieMit | FormTypes.AgoraphobieOhne;
    symptoms.push(`Agoraphobie (${AGORAPHOBIE_PANIKSYMPTOMATIK_LABELS[agoraphobie.paniksymptomatik]})`);

    // Bereiche
    for (const [key, val] of Object.entries(agoraphobie.bereiche)) {
      if (val === 'selected') {
        symptoms.push(AGORAPHOBIE_BEREICH_LABELS[key as FormTypes.AgoraphobieBereich]);
      }
    }
    if (agoraphobie.bereicheAndere.trim()) {
      symptoms.push(`Andere Bereiche: ${agoraphobie.bereicheAndere.trim()}`);
    }

    // Fluchtmöglichkeiten
    for (const [key, val] of Object.entries(agoraphobie.fluchtmoeglichkeiten)) {
      if (val === 'selected') {
        symptoms.push(AGORAPHOBIE_FLUCHT_LABELS[key as FormTypes.AgoraphobieFlucht]);
      }
    }
    if (agoraphobie.fluchtmoeglichkeitenAndere.trim()) {
      symptoms.push(`Andere Fluchtmöglichkeiten: ${agoraphobie.fluchtmoeglichkeitenAndere.trim()}`);
    }
  }

  // Soziale Phobie - only count actual selected items, not the existence of the structure
  // (Structure may exist just because user expanded "Bereich sozialer Ängste" or "Vegetative Symptome")
  if ('hauptsymptome' in angst.sozialePhobie) {
    const sozialePhobie = angst.sozialePhobie as FormTypes.SozialePhobieSelected;

    // Hauptsymptome
    for (const [key, val] of Object.entries(sozialePhobie.hauptsymptome)) {
      if (val === 'selected') {
        symptoms.push(SOZIALE_PHOBIE_HAUPTSYMPTOM_LABELS[key as FormTypes.SozialePhobieHauptsymptom]);
      }
    }

    // Bereich sozialer Ängste - only count actual sub-items
    for (const [key, val] of Object.entries(sozialePhobie.bereichSozialerAengste.selection)) {
      if (val === 'selected') {
        symptoms.push(SOZIALE_PHOBIE_BEREICH_LABELS[key as FormTypes.SozialePhobieBereichSymptom]);
      }
    }
    if (sozialePhobie.bereichSozialerAengste.andere.trim()) {
      symptoms.push(`Andere Bereiche: ${sozialePhobie.bereichSozialerAengste.andere.trim()}`);
    }

    // Vegetative Symptome - only count actual sub-items
    for (const [key, val] of Object.entries(sozialePhobie.vegetativeSymptome.selection)) {
      if (val === 'selected') {
        symptoms.push(SOZIALE_PHOBIE_VEGETATIV_LABELS[key as FormTypes.SozialePhobieVegetativSymptom]);
      }
    }
    if (sozialePhobie.vegetativeSymptome.andere.trim()) {
      symptoms.push(`Andere vegetative Symptome: ${sozialePhobie.vegetativeSymptome.andere.trim()}`);
    }
  }

  // Spezifische Phobien
  for (const [key, val] of Object.entries(angst.spezifischePhobien)) {
    if (val === 'selected') {
      symptoms.push(SPEZIFISCHE_PHOBIE_LABELS[key as FormTypes.SpezifischePhobieSymptom]);
    }
  }

  // Generalisierte Angststörung
  for (const [key, val] of Object.entries(angst.generalisierteAngst.selection)) {
    if (val === 'selected') {
      symptoms.push(GENERALISIERTE_ANGST_SYMPTOM_LABELS[key as FormTypes.GeneralisierteAngstSymptom]);
    }
  }
  if (angst.generalisierteAngst.sorgenLebensbereiche.trim()) {
    symptoms.push(`Sorgen beziehen sich auf: ${angst.generalisierteAngst.sorgenLebensbereiche.trim()}`);
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
