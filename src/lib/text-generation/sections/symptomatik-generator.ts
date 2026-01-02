// Generates German clinical prose for the Symptomatik section (Konjunktiv I style)

import * as FormTypes from '../../core/form-types';
import { getPronounsForGender, GenderPronouns } from '../pronoun-utils';

// Import all label maps needed for symptom collection
import {
  // Manische Symptomatik labels
  MANISCHE_STIMMUNG_SYMPTOM_LABELS,
  MANISCHE_ANTRIEB_SYMPTOM_LABELS,
  MANISCHE_SPRACHE_KOGNITION_SYMPTOM_LABELS,
  MANISCHE_VEGETATIV_SYMPTOM_LABELS,
  MANISCHE_SELBSTERLEBEN_SYMPTOM_LABELS,
  MANISCHES_VERHALTEN_SYMPTOM_LABELS,
  IMPULSIVES_VERHALTEN_DETAIL_LABELS,
  MANISCHE_PSYCHOTISCH_SYMPTOM_LABELS,
  MANISCHE_DISSOCIATIV_SYMPTOM_LABELS,
  IMPULSIVES_VERHALTEN_LABEL,
  // Depressive Symptomatik labels
  DEPRESSIVE_STIMMUNG_SYMPTOM_LABELS,
  DEPRESSIVE_ANTRIEB_SYMPTOM_LABELS,
  DEPRESSIVE_SELBSTERLEBEN_SYMPTOM_LABELS,
  DEPRESSIVE_VEGETATIV_SYMPTOM_LABELS,
  DEPRESSIVE_PSYCHOMOTORIK_SYMPTOM_LABELS,
  DEPRESSIVE_KOGNITION_SYMPTOM_LABELS,
  DEPRESSIVES_VERHALTEN_SYMPTOM_LABELS,
  DEPRESSIVE_PSYCHOTISCH_SYMPTOM_LABELS,
  DEPRESSIVE_DISSOCIATIV_SYMPTOM_LABELS,
  // Angstsymptomatik labels
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
  // Zwangssymptomatik labels
  ZWANGSGEDANKEN_WIEDERKEHREND_FELD_LABELS,
  ZWANGSGEDANKEN_FIELD_LABELS,
  ZWANGSHANDLUNG_TYP_LABELS,
  ZWANGSHANDLUNGEN_LABEL,
  ZWANGSBEZOGENE_KOGNITION_SYMPTOM_LABELS,
  ZWANGSSYMPTOMATIK_SECTION_LABELS,
} from '../../core/form-labels';

// ---
// Shared utilities
// ---

// Formats list with commas and "und": ["A", "B", "C"] -> "A, B und C"
function formatListWithUnd(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} und ${items[1]}`;

  const allButLast = items.slice(0, -1).join(', ');
  const last = items[items.length - 1];
  return `${allButLast} und ${last}`;
}

// Extracts selected labels from SymptomSelection (consistent enum order)
function getSelectedLabels<E extends string>(
  selection: FormTypes.SymptomSelection<E>,
  labels: Record<E, string>
): string[] {
  const result: string[] = [];
  for (const key of Object.keys(labels) as E[]) {
    if (selection[key] === 'selected') {
      result.push(labels[key]);
    }
  }
  return result;
}

// Formats CardSelection items: brackets in parentheses, text as inline sentences
function formatCardSelection<E extends string>(
  selection: FormTypes.CardSelection<E> | undefined,
  labels: Record<E, string>
): string[] {
  if (!selection) return [];

  const result: string[] = [];
  for (const key of Object.keys(labels) as E[]) {
    const entry = selection[key];
    if (entry?.selected) {
      const label = labels[key];
      const brackets = entry.details?.brackets?.trim();
      let text = entry.details?.text?.trim();

      // Build label with optional brackets
      const labelPart = brackets ? `${label} (${brackets})` : label;

      if (text) {
        // Ensure text ends with a period (or other sentence-ending punctuation)
        if (!/[.!?]$/.test(text)) {
          text = `${text}.`;
        }
        // Item with full sentence - include inline with ". " separator
        // generateSymptomProse will detect this and break sentences appropriately
        result.push(`${labelPart}. ${text}`);
      } else {
        result.push(labelPart);
      }
    }
  }
  return result;
}

// Chunks array into groups
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Gets sentence connector based on index
function getConnector(index: number): string {
  const connectors = ['Zudem', 'Desweiteren', 'Darüber hinaus', 'Ferner'];
  return connectors[Math.min(index - 1, connectors.length - 1)];
}

// Lowercases only the first character (preserves German noun capitalization)
// "Mit Panikattacken" -> "mit Panikattacken"
function lowercaseFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
}

// ---
// Symptom collectors
// ---

// Collects symptoms from Manische Symptomatik
function collectManischeSymptoms(data: FormTypes.ManischeSymptomatik, p: GenderPronouns): string[] {
  if (!data) return [];
  const symptoms: string[] = [];

  // Add symptoms from each category (with null safety)
  if (data.stimmungEmotionalesErleben) {
    symptoms.push(...formatCardSelection(data.stimmungEmotionalesErleben, MANISCHE_STIMMUNG_SYMPTOM_LABELS));
  }
  if (data.antriebEnergiePsychomotorik) {
    symptoms.push(...formatCardSelection(data.antriebEnergiePsychomotorik, MANISCHE_ANTRIEB_SYMPTOM_LABELS));
  }
  if (data.spracheKognition) {
    symptoms.push(...formatCardSelection(data.spracheKognition, MANISCHE_SPRACHE_KOGNITION_SYMPTOM_LABELS));
  }
  if (data.vegetativeSymptome) {
    symptoms.push(...formatCardSelection(data.vegetativeSymptome, MANISCHE_VEGETATIV_SYMPTOM_LABELS));
  }
  if (data.selbsterleben) {
    symptoms.push(...formatCardSelection(data.selbsterleben, MANISCHE_SELBSTERLEBEN_SYMPTOM_LABELS));
  }
  if (data.verhalten?.selection) {
    symptoms.push(...formatCardSelection(data.verhalten.selection, MANISCHES_VERHALTEN_SYMPTOM_LABELS));
  }

  // Handle Impulsives Verhalten with sub-items - each item becomes its own sentence
  if (data.verhalten?.impulsivesVerhalten?.details) {
    const details = data.verhalten.impulsivesVerhalten.details;
    const hasAnySelected = Object.values(details).some(entry => entry?.selected);
    const andereText = data.verhalten.impulsivesVerhalten.andere?.trim() || '';

    if (hasAnySelected || andereText) {
      // Build complete sentence block for impulsives Verhalten
      const sentenceParts: string[] = [];

      // Intro sentence
      sentenceParts.push(`${p.er} berichte von impulsivem und selbstschädigendem Verhalten.`);

      // Add each detail item as separate sentence with transitions
      const transitions = ['Dazu gehöre', 'Desweiteren bestehe', 'Ferner zeige sich', 'Darüber hinaus bestehe'];
      let transitionIndex = 0;

      for (const key of Object.keys(IMPULSIVES_VERHALTEN_DETAIL_LABELS) as FormTypes.ImpulsivesVerhaltenDetail[]) {
        const entry = details[key];
        if (entry?.selected) {
          const label = IMPULSIVES_VERHALTEN_DETAIL_LABELS[key];
          const brackets = entry.details?.brackets?.trim();
          const text = entry.details?.text?.trim();

          const transition = transitions[Math.min(transitionIndex, transitions.length - 1)];
          const labelPart = brackets ? `${label} (${brackets})` : label;

          if (text) {
            // Item with full sentence - add text after
            const textWithPeriod = /[.!?]$/.test(text) ? text : `${text}.`;
            sentenceParts.push(`${transition} ${labelPart}. ${textWithPeriod}`);
          } else {
            sentenceParts.push(`${transition} ${labelPart}.`);
          }
          transitionIndex++;
        }
      }

      // Handle "andere" as its own sentence
      if (andereText) {
        const transition = transitions[Math.min(transitionIndex, transitions.length - 1)];
        const textWithPeriod = /[.!?]$/.test(andereText) ? andereText : `${andereText}.`;
        sentenceParts.push(`${transition} ${textWithPeriod}`);
      }

      // Push as single combined string - the ". " pattern signals generateSymptomProse()
      // to treat this as pre-formatted prose
      symptoms.push(sentenceParts.join(' '));
    }
  }

  if (data.psychotischeSymptome) {
    symptoms.push(...formatCardSelection(data.psychotischeSymptome, MANISCHE_PSYCHOTISCH_SYMPTOM_LABELS));
  }
  if (data.dissoziativeSymptome) {
    symptoms.push(...formatCardSelection(data.dissoziativeSymptome, MANISCHE_DISSOCIATIV_SYMPTOM_LABELS));
  }

  // Add "andere" symptoms if present
  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms;
}

// Collects symptoms from Depressive Symptomatik
function collectDepressiveSymptoms(data: FormTypes.DepressiveSymptomatik): string[] {
  if (!data) return [];
  const symptoms: string[] = [];

  if (data.stimmungEmotionalesErleben) {
    symptoms.push(...formatCardSelection(data.stimmungEmotionalesErleben, DEPRESSIVE_STIMMUNG_SYMPTOM_LABELS));
  }
  if (data.antriebEnergiePsychomotorik) {
    symptoms.push(...formatCardSelection(data.antriebEnergiePsychomotorik, DEPRESSIVE_ANTRIEB_SYMPTOM_LABELS));
  }
  if (data.selbsterleben) {
    symptoms.push(...formatCardSelection(data.selbsterleben, DEPRESSIVE_SELBSTERLEBEN_SYMPTOM_LABELS));
  }
  if (data.vegetativeSomatischeSymptome) {
    symptoms.push(...formatCardSelection(data.vegetativeSomatischeSymptome, DEPRESSIVE_VEGETATIV_SYMPTOM_LABELS));
  }
  if (data.psychomotorischeSymptome) {
    symptoms.push(...formatCardSelection(data.psychomotorischeSymptome, DEPRESSIVE_PSYCHOMOTORIK_SYMPTOM_LABELS));
  }
  if (data.kognition) {
    symptoms.push(...formatCardSelection(data.kognition, DEPRESSIVE_KOGNITION_SYMPTOM_LABELS));
  }
  if (data.verhalten) {
    symptoms.push(...formatCardSelection(data.verhalten, DEPRESSIVES_VERHALTEN_SYMPTOM_LABELS));
  }
  if (data.psychotischeSymptome) {
    symptoms.push(...formatCardSelection(data.psychotischeSymptome, DEPRESSIVE_PSYCHOTISCH_SYMPTOM_LABELS));
  }
  if (data.dissoziativeSymptome) {
    symptoms.push(...formatCardSelection(data.dissoziativeSymptome, DEPRESSIVE_DISSOCIATIV_SYMPTOM_LABELS));
  }

  // Add "andere" symptoms if present
  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms;
}

// Gets Kognition CardSelection items (excluding 'sorgen')
function getKognitionCardSelection(kognition: FormTypes.AngstKognition): FormTypes.CardSelection<FormTypes.AngstKognitionSymptom> {
  const result: FormTypes.CardSelection<FormTypes.AngstKognitionSymptom> = {};
  for (const [key, val] of Object.entries(kognition)) {
    if (key !== 'sorgen' && val && typeof val === 'object' && 'selected' in val) {
      result[key as FormTypes.AngstKognitionSymptom] = val as FormTypes.CardSelectionEntry;
    }
  }
  return result;
}

// Formats Sorgen with optional brackets and text details
// Returns array of strings for proper sentence handling
function formatSorgen(sorgen: FormTypes.AngstSorgenData | undefined): string[] {
  if (!sorgen) return [];

  const result: string[] = [];

  // 1. Handle top-level "Sorgen" with its own brackets/text
  const topBrackets = sorgen.brackets?.trim();
  const topText = sorgen.text?.trim();
  const topLabel = topBrackets ? `${ANGST_SORGEN_LABEL} (${topBrackets})` : ANGST_SORGEN_LABEL;

  // Count sub-items to decide whether to include bare "Sorgen"
  const hasSubItems = Object.values(sorgen.details).some(entry => entry?.selected);

  if (topText) {
    // Has top-level text - add as its own sentence
    const textWithPeriod = /[.!?]$/.test(topText) ? topText : `${topText}.`;
    result.push(`${topLabel}. ${textWithPeriod}`);
  } else if (topBrackets || !hasSubItems) {
    // Only add bare "Sorgen" if:
    // - It has brackets (user added details)
    // - OR there are no sub-items selected (otherwise sub-items describe the Sorgen)
    result.push(topLabel);
  }

  // 2. Handle sub-items (each as separate array element)
  for (const key of Object.keys(ANGST_SORGEN_TYP_LABELS) as FormTypes.AngstSorgenTyp[]) {
    const entry = sorgen.details[key];
    if (entry?.selected) {
      const label = ANGST_SORGEN_TYP_LABELS[key];
      const brackets = entry.details?.brackets?.trim();
      let text = entry.details?.text?.trim();

      // Build label with optional brackets
      const labelPart = brackets ? `${label} (${brackets})` : label;

      if (text) {
        // Ensure text ends with punctuation
        if (!/[.!?]$/.test(text)) {
          text = `${text}.`;
        }
        // Format as "label. Text sentence." - each item becomes separate sentence
        result.push(`${labelPart}. ${text}`);
      } else {
        result.push(labelPart);
      }
    }
  }

  // 3. Handle "andere" free text (always as new sentence, appended to last item)
  let andereText = sorgen.andere?.trim();
  if (andereText) {
    if (!/[.!?]$/.test(andereText)) {
      andereText = `${andereText}.`;
    }
    if (result.length > 0) {
      // Append to last item as separate sentence (avoids "und" joining)
      result[result.length - 1] = `${result[result.length - 1]}. ${andereText}`;
    } else {
      result.push(andereText);
    }
  }

  return result;
}

// Formats Agoraphobie as proper Konjunktiv I sentences
function formatAgoraphobie(
  data: FormTypes.Agoraphobie | undefined,
  p: GenderPronouns
): string[] {
  if (!data) return [];

  const sentences: string[] = [];

  // 1. Paniksymptomatik - main Agoraphobie sentence
  const selectedPaniksymptomatik = Object.entries(data.paniksymptomatik || {})
    .find(([, entry]) => entry?.selected);
  if (selectedPaniksymptomatik) {
    const [key, entry] = selectedPaniksymptomatik;
    let label = lowercaseFirst(AGORAPHOBIE_PANIKSYMPTOMATIK_LABELS[key as FormTypes.AgoraphobiePaniksymptomatik]);
    if (entry?.details?.brackets?.trim()) {
      label += ` (${entry.details.brackets.trim()})`;
    }
    sentences.push(`${p.derDie} zeige Agoraphobie ${label}.`);

    // Optional text field - output as-is (NO "Zudem bestünde" prefix)
    if (entry?.details?.text?.trim()) {
      sentences.push(entry.details.text.trim());
    }
  }

  // 2. Bereiche - each as separate sentence
  for (const key of Object.keys(AGORAPHOBIE_BEREICH_LABELS) as FormTypes.AgoraphobieBereich[]) {
    const entry = data.bereiche?.[key];
    if (entry?.selected) {
      let label = AGORAPHOBIE_BEREICH_LABELS[key];
      if (entry.details?.brackets?.trim()) {
        label += ` (${entry.details.brackets.trim()})`;
      }
      sentences.push(`${p.er} zeige ${label}.`);

      // Optional text field - output as-is
      if (entry.details?.text?.trim()) {
        sentences.push(entry.details.text.trim());
      }
    }
  }
  if (data.bereicheAndere?.trim()) {
    sentences.push(data.bereicheAndere.trim());
  }

  // 3. Fluchtmöglichkeiten - each as separate sentence
  for (const key of Object.keys(AGORAPHOBIE_FLUCHT_LABELS) as FormTypes.AgoraphobieFlucht[]) {
    const entry = data.fluchtmoeglichkeiten?.[key];
    if (entry?.selected) {
      let label = AGORAPHOBIE_FLUCHT_LABELS[key];
      if (entry.details?.brackets?.trim()) {
        label += ` (${entry.details.brackets.trim()})`;
      }
      sentences.push(`${p.er} zeige Sorge bezüglich ${label}.`);

      // Optional text field - output as-is
      if (entry.details?.text?.trim()) {
        sentences.push(entry.details.text.trim());
      }
    }
  }
  if (data.fluchtmoeglichkeitenAndere?.trim()) {
    sentences.push(data.fluchtmoeglichkeitenAndere.trim());
  }

  return sentences;
}

// Formats Soziale Phobie as proper Konjunktiv I sentences
function formatSozialePhobie(
  data: FormTypes.SozialePhobie | undefined,
  p: GenderPronouns
): string[] {
  if (!data || !('hauptsymptome' in data)) return [];

  const sozialePhobie = data as FormTypes.SozialePhobieSelected;
  const sentences: string[] = [];

  // 1. Hauptsymptome - "Er berichte über [label]."
  for (const key of Object.keys(SOZIALE_PHOBIE_HAUPTSYMPTOM_LABELS) as FormTypes.SozialePhobieHauptsymptom[]) {
    const entry = sozialePhobie.hauptsymptome?.[key];
    if (entry?.selected) {
      let label = SOZIALE_PHOBIE_HAUPTSYMPTOM_LABELS[key];
      if (entry.details?.brackets?.trim()) {
        label += ` (${entry.details.brackets.trim()})`;
      }
      sentences.push(`${p.er} berichte über ${label}.`);

      // Optional text field - output as-is
      if (entry.details?.text?.trim()) {
        sentences.push(entry.details.text.trim());
      }
    }
  }

  // 2. Bereich sozialer Ängste - "Er zeige [label]."
  for (const key of Object.keys(SOZIALE_PHOBIE_BEREICH_LABELS) as FormTypes.SozialePhobieBereichSymptom[]) {
    const entry = sozialePhobie.bereichSozialerAengste?.selection?.[key];
    if (entry?.selected) {
      let label = SOZIALE_PHOBIE_BEREICH_LABELS[key];
      if (entry.details?.brackets?.trim()) {
        label += ` (${entry.details.brackets.trim()})`;
      }
      sentences.push(`${p.er} zeige ${label}.`);

      // Optional text field - output as-is
      if (entry.details?.text?.trim()) {
        sentences.push(entry.details.text.trim());
      }
    }
  }
  if (sozialePhobie.bereichSozialerAengste?.andere?.trim()) {
    sentences.push(sozialePhobie.bereichSozialerAengste.andere.trim());
  }

  // 3. Vegetative Symptome - "Er berichte über [label]."
  for (const key of Object.keys(SOZIALE_PHOBIE_VEGETATIV_LABELS) as FormTypes.SozialePhobieVegetativSymptom[]) {
    const entry = sozialePhobie.vegetativeSymptome?.selection?.[key];
    if (entry?.selected) {
      let label = SOZIALE_PHOBIE_VEGETATIV_LABELS[key];
      if (entry.details?.brackets?.trim()) {
        label += ` (${entry.details.brackets.trim()})`;
      }
      sentences.push(`${p.er} berichte über ${label}.`);

      // Optional text field - output as-is
      if (entry.details?.text?.trim()) {
        sentences.push(entry.details.text.trim());
      }
    }
  }
  if (sozialePhobie.vegetativeSymptome?.andere?.trim()) {
    sentences.push(sozialePhobie.vegetativeSymptome.andere.trim());
  }

  return sentences;
}

// Collects symptoms from Angstsymptomatik
function collectAngstSymptoms(data: FormTypes.Angstsymptomatik): string[] {
  if (!data) return [];
  const symptoms: string[] = [];

  // Emotionales Erleben (CardSelection pattern)
  if (data.emotionalesErleben) {
    symptoms.push(...formatCardSelection(data.emotionalesErleben, ANGST_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS));
  }

  // Kognition (CardSelection pattern, excluding sorgen)
  if (data.kognition) {
    const kognitionWithoutSorgen = getKognitionCardSelection(data.kognition);
    symptoms.push(...formatCardSelection(kognitionWithoutSorgen, ANGST_KOGNITION_SYMPTOM_LABELS));
    // Sorgen if selected
    symptoms.push(...formatSorgen(data.kognition.sorgen));
  }

  // Somatovegetative Symptome
  if (data.somatovegetativeSymptome) {
    symptoms.push(...formatCardSelection(data.somatovegetativeSymptome, ANGST_SOMATOVEGETATIV_SYMPTOM_LABELS));
  }

  // Verhalten
  if (data.verhalten) {
    symptoms.push(...formatCardSelection(data.verhalten, ANGST_VERHALTEN_FELD_LABELS));
  }

  // Dissoziative Symptome
  if (data.dissoziativeSymptome) {
    symptoms.push(...formatCardSelection(data.dissoziativeSymptome, ANGST_DISSOCIATIV_SYMPTOM_LABELS));
  }

  // Panikstörung
  if (data.panikstoerung) {
    symptoms.push(...formatCardSelection(data.panikstoerung, ANGST_PANIKSTOERUNG_SYMPTOM_LABELS));
  }

  // Agoraphobie - handled separately with formatAgoraphobie() for proper Konjunktiv I sentences

  // Soziale Phobie - handled separately with formatSozialePhobie() for proper Konjunktiv I sentences

  // Spezifische Phobien (CardSelection pattern)
  if (data.spezifischePhobien) {
    symptoms.push(...formatCardSelection(data.spezifischePhobien, SPEZIFISCHE_PHOBIE_LABELS));
  }

  // Generalisierte Angststörung (CardSelection pattern)
  if (data.generalisierteAngst && 'hauptsymptome' in data.generalisierteAngst) {
    const genAngst = data.generalisierteAngst as FormTypes.GeneralisierteAngstSelected;

    // Hauptsymptome
    symptoms.push(...formatCardSelection(genAngst.hauptsymptome, GENERALISIERTE_ANGST_HAUPTSYMPTOM_LABELS));

    // Sorgen symptoms
    symptoms.push(...formatCardSelection(genAngst.sorgen.selection, GENERALISIERTE_ANGST_SORGEN_LABELS));

    // Andere text field
    if (genAngst.sorgen.andere?.trim()) {
      symptoms.push(genAngst.sorgen.andere.trim());
    }
  }

  // Add "andere" symptoms if present
  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms;
}

// Collects symptoms from Zwangssymptomatik
function collectZwangSymptoms(data: FormTypes.Zwangssymptomatik): string[] {
  if (!data) return [];
  const symptoms: string[] = [];

  // Zwangsgedanken
  if (data.zwangsgedanken && 'wiederkehrendeZwangsgedanken' in data.zwangsgedanken) {
    const zwangsgedanken = data.zwangsgedanken as FormTypes.ZwangsgedankenSelected;

    // Wiederkehrende Zwangsgedanken
    if (zwangsgedanken.wiederkehrendeZwangsgedanken) {
      const wiederkehrendItems: string[] = [];
      for (const [key, val] of Object.entries(zwangsgedanken.wiederkehrendeZwangsgedanken)) {
        if (val && val.trim()) {
          const label = ZWANGSGEDANKEN_WIEDERKEHREND_FELD_LABELS[key as FormTypes.ZwangsgedankenWiederkehrendFeld];
          wiederkehrendItems.push(`${label} (${val.trim()})`);
        }
      }
      if (wiederkehrendItems.length > 0) {
        symptoms.push(`${ZWANGSGEDANKEN_FIELD_LABELS.wiederkehrendeZwangsgedanken} ${wiederkehrendItems.join(', ')}`);
      }
    }

    // Zwanghafte Ideen
    if (zwangsgedanken.zwanghafteIdeen?.trim()) {
      symptoms.push(`${ZWANGSGEDANKEN_FIELD_LABELS.zwanghafteIdeen} (${zwangsgedanken.zwanghafteIdeen.trim()})`);
    }

    // Zwangsimpulse
    if (zwangsgedanken.zwangsimpulse?.trim()) {
      symptoms.push(`${ZWANGSGEDANKEN_FIELD_LABELS.zwangsimpulse} (${zwangsgedanken.zwangsimpulse.trim()})`);
    }
  }

  // Zwangshandlungen
  if (data.zwangshandlungen && 'selected' in data.zwangshandlungen && data.zwangshandlungen.selected === true) {
    const zwangshandlungen = data.zwangshandlungen as FormTypes.ZwangshandlungenSelected;

    if (zwangshandlungen.details) {
      const zwangshandlungItems: string[] = [];
      for (const [key, entry] of Object.entries(zwangshandlungen.details)) {
        if (entry?.selected) {
          const label = ZWANGSHANDLUNG_TYP_LABELS[key as FormTypes.ZwangshandlungTyp];
          const text = entry.details?.text?.trim();
          zwangshandlungItems.push(text ? `${label} (${text})` : label);
        }
      }

      if (zwangshandlungItems.length > 0) {
        symptoms.push(`${ZWANGSHANDLUNGEN_LABEL} ${zwangshandlungItems.join(', ')}`);
      }
    }

    // Andere Zwangshandlungen
    if (zwangshandlungen.andere?.trim()) {
      symptoms.push(`andere Zwangshandlungen (${zwangshandlungen.andere.trim()})`);
    }
  }

  // Zwangsbezogene Kognitionen
  if (data.zwangsbezogeneKognitionen) {
    const kognitionItems: string[] = [];
    for (const [key, val] of Object.entries(data.zwangsbezogeneKognitionen)) {
      if (val === 'selected') {
        kognitionItems.push(ZWANGSBEZOGENE_KOGNITION_SYMPTOM_LABELS[key as FormTypes.ZwangsbezogeneKognitionSymptom]);
      }
    }
    if (kognitionItems.length > 0) {
      symptoms.push(`${ZWANGSSYMPTOMATIK_SECTION_LABELS.zwangsbezogeneKognitionen} (${kognitionItems.join(', ')})`);
    }
  }

  // Add "andere" symptoms if present
  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms;
}

// ---
// Prose generation
// ---

// Generates unified clinical prose from collected symptoms
function generateSymptomProse(
  symptoms: string[],
  p: GenderPronouns
): FormTypes.ParagraphNode[] {
  if (symptoms.length === 0) return [];

  const sentences: string[] = [];
  let pendingSymptoms: string[] = [];
  let connectorIndex = 1;  // 1-based index for getConnector()

  // Helper to flush pending symptoms into a sentence
  const flushPending = () => {
    if (pendingSymptoms.length === 0) return;

    const symptomList = formatListWithUnd(pendingSymptoms);
    let sentence: string;

    if (sentences.length === 0) {
      // First sentence: introduce with patient pronoun
      sentence = `${p.derDie} zeige ${symptomList}.`;
    } else {
      // Subsequent sentences: use connectors
      const connector = getConnector(connectorIndex++);
      sentence = `${connector} bestünden ${symptomList}.`;
    }

    sentences.push(sentence);
    pendingSymptoms = [];
  };

  for (const symptom of symptoms) {
    // Check if symptom contains inline sentence (has ". " pattern from CardSelection text field)
    if (symptom.includes('. ')) {
      // Flush any pending symptoms first
      flushPending();

      // Add this item with its inline sentence
      let sentence: string;
      if (sentences.length === 0) {
        sentence = `${p.derDie} zeige ${symptom}`;
      } else {
        const connector = getConnector(connectorIndex++);
        sentence = `${connector} bestünden ${symptom}`;
      }
      sentences.push(sentence);
    } else {
      // Regular symptom - add to pending list
      pendingSymptoms.push(symptom);

      // Flush if we have 4 pending (for readable sentence length)
      if (pendingSymptoms.length >= 4) {
        flushPending();
      }
    }
  }

  // Flush remaining pending symptoms
  flushPending();

  // Return as a single paragraph
  return [{
    type: 'paragraph',
    text: sentences.join(' '),
    id: 'symptomatik'
  }];
}

// ---
// Main export
// ---

// Constructs unified content for all Symptomatik categories
export function constructSymptomatikContent(formData: FormTypes.Form): FormTypes.ParagraphNode[] {
  const p = getPronounsForGender(formData.geschlecht);

  // Collect ALL symptoms from ALL categories
  const allSymptoms: string[] = [];

  // 1. Manische Symptomatik
  allSymptoms.push(...collectManischeSymptoms(formData.manischeSymptomatik, p));

  // 2. Depressive Symptomatik
  allSymptoms.push(...collectDepressiveSymptoms(formData.depressiveSymptomatik));

  // 3. Angstsymptomatik (excluding Agoraphobie and Soziale Phobie which are handled separately)
  allSymptoms.push(...collectAngstSymptoms(formData.angstsymptomatik));

  // 4. Zwangssymptomatik
  allSymptoms.push(...collectZwangSymptoms(formData.zwangssymptomatik));

  // 5-20. Future categories would be added here...

  // Generate unified prose for standard symptoms
  const paragraphs = generateSymptomProse(allSymptoms, p);

  // Agoraphobie: handled separately with proper Konjunktiv I sentences
  const agoraphobieSentences = formatAgoraphobie(formData.angstsymptomatik?.agoraphobie, p);
  if (agoraphobieSentences.length > 0) {
    const agoraphobieText = agoraphobieSentences.join(' ');
    if (paragraphs.length > 0 && paragraphs[0].text) {
      // Append to existing paragraph
      paragraphs[0].text = `${paragraphs[0].text} ${agoraphobieText}`;
    } else {
      // Create new paragraph if none exists
      paragraphs.push({
        type: 'paragraph',
        text: agoraphobieText,
        id: 'symptomatik'
      });
    }
  }

  // Soziale Phobie: handled separately with proper Konjunktiv I sentences
  const sozialePhobieSentences = formatSozialePhobie(formData.angstsymptomatik?.sozialePhobie, p);
  if (sozialePhobieSentences.length > 0) {
    const sozialephobieText = sozialePhobieSentences.join(' ');
    if (paragraphs.length > 0 && paragraphs[0].text) {
      // Append to existing paragraph
      paragraphs[0].text = `${paragraphs[0].text} ${sozialephobieText}`;
    } else {
      // Create new paragraph if none exists
      paragraphs.push({
        type: 'paragraph',
        text: sozialephobieText,
        id: 'symptomatik'
      });
    }
  }

  // SymptomatikKontext: Append duration, course, and trigger information directly
  const kontextTexts: string[] = [];
  if (formData.symptomatikKontext?.beginnUndDauer?.trim()) {
    kontextTexts.push(formData.symptomatikKontext.beginnUndDauer.trim());
  }
  if (formData.symptomatikKontext?.verlauf?.trim()) {
    kontextTexts.push(formData.symptomatikKontext.verlauf.trim());
  }
  if (formData.symptomatikKontext?.ausloeser?.trim()) {
    kontextTexts.push(formData.symptomatikKontext.ausloeser.trim());
  }
  if (kontextTexts.length > 0) {
    const kontextText = kontextTexts.join(' ');
    if (paragraphs.length > 0 && paragraphs[0].text) {
      // Append to existing paragraph (no separator, just space)
      paragraphs[0].text = `${paragraphs[0].text} ${kontextText}`;
    } else {
      // Create new paragraph if none exists
      paragraphs.push({
        type: 'paragraph',
        text: kontextText,
        id: 'symptomatik'
      });
    }
  }

  return paragraphs;
}
