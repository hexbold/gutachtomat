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

// Gets selected Kognition labels (excluding 'sorgen')
function getKognitionSelectedLabels(kognition: FormTypes.AngstKognition): string[] {
  const result: string[] = [];
  for (const [key, val] of Object.entries(kognition)) {
    if (key !== 'sorgen' && val === 'selected') {
      result.push(ANGST_KOGNITION_SYMPTOM_LABELS[key as FormTypes.AngstKognitionSymptom]);
    }
  }
  return result;
}

// Formats Sorgen with optional text details (in parentheses)
function formatSorgen(sorgen: FormTypes.AngstSorgenData | undefined): string | null {
  if (!sorgen) return null;

  const filledDetails: string[] = [];
  // Iterate in enum order for consistent output
  for (const key of Object.keys(ANGST_SORGEN_TYP_LABELS) as FormTypes.AngstSorgenTyp[]) {
    const entry = sorgen.details[key];
    if (entry?.selected) {
      const label = ANGST_SORGEN_TYP_LABELS[key];
      const specificPart = label.replace('Sorgen ', '');
      const text = entry.details?.text?.trim();

      if (text) {
        filledDetails.push(`${specificPart} (${text})`);
      } else {
        filledDetails.push(specificPart);
      }
    }
  }

  if (filledDetails.length > 0) {
    return `${ANGST_SORGEN_LABEL} ${filledDetails.join(', ')}`;
  }

  return null;
}

// Collects symptoms from Angstsymptomatik
function collectAngstSymptoms(data: FormTypes.Angstsymptomatik): string[] {
  if (!data) return [];
  const symptoms: string[] = [];

  // Emotionales Erleben
  if (data.emotionalesErleben) {
    symptoms.push(...getSelectedLabels(data.emotionalesErleben, ANGST_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS));
  }

  // Kognition (simple symptoms)
  if (data.kognition) {
    symptoms.push(...getKognitionSelectedLabels(data.kognition));
    // Sorgen if selected
    const sorgenText = formatSorgen(data.kognition.sorgen);
    if (sorgenText) {
      symptoms.push(sorgenText);
    }
  }

  // Vegetative Symptome
  if (data.vegetativeSymptome) {
    symptoms.push(...getSelectedLabels(data.vegetativeSymptome, ANGST_VEGETATIV_SYMPTOM_LABELS));
  }

  // Verhalten text fields - use parentheses instead of colons
  if (data.verhalten) {
    for (const [key, val] of Object.entries(data.verhalten)) {
      if (val && val.trim()) {
        const label = ANGST_VERHALTEN_FELD_LABELS[key as FormTypes.AngstVerhaltenFeld];
        symptoms.push(`${label} (${val.trim()})`);
      }
    }
  }

  // Dissoziative Symptome
  if (data.dissoziativeSymptome) {
    symptoms.push(...getSelectedLabels(data.dissoziativeSymptome, ANGST_DISSOCIATIV_SYMPTOM_LABELS));
  }

  // Panikstörung
  if (data.panikstoerung) {
    symptoms.push(...getSelectedLabels(data.panikstoerung, ANGST_PANIKSTOERUNG_SYMPTOM_LABELS));
  }

  // Agoraphobie if selected
  if (data.agoraphobie && 'paniksymptomatik' in data.agoraphobie) {
    const agoraphobie = data.agoraphobie as FormTypes.AgoraphobieMit | FormTypes.AgoraphobieOhne;
    const agoraphobieParts: string[] = [];

    agoraphobieParts.push(AGORAPHOBIE_PANIKSYMPTOMATIK_LABELS[agoraphobie.paniksymptomatik].toLowerCase());

    if (agoraphobie.bereiche) {
      const bereiche = getSelectedLabels(agoraphobie.bereiche, AGORAPHOBIE_BEREICH_LABELS);
      if (agoraphobie.bereicheAndere?.trim()) {
        bereiche.push(agoraphobie.bereicheAndere.trim());
      }
      if (bereiche.length > 0) {
        agoraphobieParts.push(`Bereiche ${formatListWithUnd(bereiche)}`);
      }
    }

    if (agoraphobie.fluchtmoeglichkeiten) {
      const flucht = getSelectedLabels(agoraphobie.fluchtmoeglichkeiten, AGORAPHOBIE_FLUCHT_LABELS);
      if (agoraphobie.fluchtmoeglichkeitenAndere?.trim()) {
        flucht.push(agoraphobie.fluchtmoeglichkeitenAndere.trim());
      }
      if (flucht.length > 0) {
        agoraphobieParts.push(`Fluchtmöglichkeiten ${formatListWithUnd(flucht)}`);
      }
    }

    symptoms.push(`Agoraphobie (${agoraphobieParts.join('; ')})`);
  }

  // Soziale Phobie if selected
  if (data.sozialePhobie && 'hauptsymptome' in data.sozialePhobie) {
    const sozialePhobie = data.sozialePhobie as FormTypes.SozialePhobieSelected;
    const sozialephobieParts: string[] = [];

    if (sozialePhobie.hauptsymptome) {
      const hauptsymptome = getSelectedLabels(sozialePhobie.hauptsymptome, SOZIALE_PHOBIE_HAUPTSYMPTOM_LABELS);
      if (hauptsymptome.length > 0) {
        sozialephobieParts.push(formatListWithUnd(hauptsymptome));
      }
    }

    if (sozialePhobie.bereichSozialerAengste?.selection) {
      const bereiche = getSelectedLabels(sozialePhobie.bereichSozialerAengste.selection, SOZIALE_PHOBIE_BEREICH_LABELS);
      if (sozialePhobie.bereichSozialerAengste.andere?.trim()) {
        bereiche.push(sozialePhobie.bereichSozialerAengste.andere.trim());
      }
      if (bereiche.length > 0) {
        sozialephobieParts.push(`Bereiche ${formatListWithUnd(bereiche)}`);
      }
    }

    if (sozialePhobie.vegetativeSymptome?.selection) {
      const vegetativ = getSelectedLabels(sozialePhobie.vegetativeSymptome.selection, SOZIALE_PHOBIE_VEGETATIV_LABELS);
      if (sozialePhobie.vegetativeSymptome.andere?.trim()) {
        vegetativ.push(sozialePhobie.vegetativeSymptome.andere.trim());
      }
      if (vegetativ.length > 0) {
        sozialephobieParts.push(`vegetativ ${formatListWithUnd(vegetativ)}`);
      }
    }

    if (sozialephobieParts.length > 0) {
      symptoms.push(`Soziale Phobie (${sozialephobieParts.join('; ')})`);
    }
  }

  // Spezifische Phobien
  if (data.spezifischePhobien) {
    symptoms.push(...getSelectedLabels(data.spezifischePhobien, SPEZIFISCHE_PHOBIE_LABELS));
  }

  // Generalisierte Angststörung
  if (data.generalisierteAngst?.selection) {
    const generalisierteAngstSymptoms = getSelectedLabels(data.generalisierteAngst.selection, GENERALISIERTE_ANGST_SYMPTOM_LABELS);
    if (generalisierteAngstSymptoms.length > 0 || data.generalisierteAngst.sorgenLebensbereiche?.trim()) {
      const parts: string[] = [];
      if (generalisierteAngstSymptoms.length > 0) {
        parts.push(formatListWithUnd(generalisierteAngstSymptoms));
      }
      if (data.generalisierteAngst.sorgenLebensbereiche?.trim()) {
        parts.push(`bezogen auf ${data.generalisierteAngst.sorgenLebensbereiche.trim()}`);
      }
      symptoms.push(`Generalisierte Angst (${parts.join('; ')})`);
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

  // 3. Angstsymptomatik
  allSymptoms.push(...collectAngstSymptoms(formData.angstsymptomatik));

  // 4. Zwangssymptomatik
  allSymptoms.push(...collectZwangSymptoms(formData.zwangssymptomatik));

  // 5-20. Future categories would be added here...

  // Generate unified prose
  return generateSymptomProse(allSymptoms, p);
}
