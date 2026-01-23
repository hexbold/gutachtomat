// Generates German clinical prose for the Symptomatik section (Konjunktiv I style)

import * as FormTypes from '../../core/form-types';
import { getPronounsForGender, GenderPronouns } from '../pronoun-utils';
import { ensurePunctuation } from '../text-utils';

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
  // Traumafolgesymptomatik labels
  TRAUMA_WIEDERERLEBEN_SYMPTOM_LABELS,
  TRAUMA_VERMEIDUNG_SYMPTOM_LABELS,
  TRAUMA_VERHALTEN_SYMPTOM_LABELS,
  TRAUMA_UEBERERREGUNG_SYMPTOM_LABELS,
  TRAUMA_SOMATOVEGETATIV_SYMPTOM_LABELS,
  TRAUMA_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS,
  TRAUMA_DISSOCIATIV_SYMPTOM_LABELS,
  TRAUMA_KOGNITION_SYMPTOM_LABELS,
  ANPASSUNGSSTOERUNG_SYMPTOM_LABELS,
  // Psychotische Symptomatik labels
  FORMALE_WAHNMERKMALE_LABELS,
  INHALTLICHE_WAHNMERKMALE_LABELS,
  STIMMEN_HOEREN_TYP_LABELS,
  ANDERE_HALLUZINATION_TYP_LABELS,
  ICH_HAFTIGKEIT_SYMPTOM_LABELS,
  ICH_STOERUNG_ANDERE_SYMPTOM_LABELS,
  FORMALE_DENKSTOERUNG_SYMPTOM_LABELS,
  PSYCHOTISCH_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS,
  PSYCHOTISCH_VERHALTEN_SYMPTOM_LABELS,
  PSYCHOTISCH_KOGNITION_SYMPTOM_LABELS,
  KATATONE_SYMPTOM_LABELS,
  // Organische Symptomatik labels
  QUANTITATIVE_BEWUSSTSEINSSTOERUNG_LABELS,
  QUALITATIVE_BEWUSSTSEINSSTOERUNG_LABELS,
  ORGANISCH_ATTENTIONAL_LABELS,
  ORGANISCH_MNESTISCH_LABELS,
  ORGANISCH_EXEKUTIV_LABELS,
  ORGANISCH_SPRACHLICH_LABELS,
  ORGANISCH_DENKSTOERUNG_LABELS,
  ORGANISCH_ORIENTIERUNG_LABELS,
  ORGANISCH_EMOTION_LABELS,
  ORGANISCH_AMNESTISCH_LABELS,
  ALLTAGSKOMPETENZ_STATUS_LABELS,
  BASALE_ALLTAGSKOMPETENZ_LABELS,
  INSTRUMENTELLE_ALLTAGSKOMPETENZ_LABELS,
  // Somatoforme Symptomatik labels
  SOMATOFORM_KOERPERLICH_LABELS,
  SOMATOFORM_AUTONOM_LABELS,
  SOMATOFORM_HYPOCHONDRISCH_LABELS,
  SOMATOFORM_SCHMERZ_LABELS,
  SOMATOFORM_KONVERSION_LABELS,
  // Schlafstörungen labels
  SCHLAF_INSOMNIE_LABELS,
  SCHLAF_HYPERSOMNIE_LABELS,
  SCHLAF_RHYTHMUS_LABELS,
  SCHLAF_PARASOMNIE_LABELS,
  // Essstörungen labels
  ESSSTOERUNG_KOGNITIV_LABELS,
  ESSSTOERUNG_EMOTIONAL_LABELS,
  GEWICHTSREGULIERENDE_MASSNAHME_LABELS,
  ANOREXIE_SPEZIFISCH_LABELS,
  BULIMIE_SPEZIFISCH_LABELS,
  BINGE_EATING_SPEZIFISCH_LABELS,
  // Substanzbezogene Symptomatik labels
  SUBSTANZ_ABHAENGIGKEIT_LABELS,
  SUBSTANZ_SOMATOVEGETATIV_LABELS,
  SUBSTANZ_PSYCHOMOTORIK_LABELS,
  SUBSTANZ_VERHALTEN_LABELS,
  SUBSTANZ_EMOTIONAL_LABELS,
  SUBSTANZ_SCHLAF_LABELS,
  SUBSTANZ_NEUROLOGISCH_LABELS,
  SUBSTANZ_KOGNITIV_LABELS,
  SUBSTANZ_PSYCHOTISCH_LABELS,
  SUBSTANZ_DISSOCIATIV_LABELS,
  // Dissoziative Symptomatik labels
  DISSOCIATIVE_AMNESIE_LABELS,
  DISSOCIATIVE_FUGUE_LABELS,
  DISSOCIATIVER_STUPOR_LABELS,
  DISSOCIATIVE_BEWEGUNGSSTOERUNG_LABELS,
  DISSOCIATIVE_KRAMPFANFAELLE_LABELS,
  DISSOCIATIVE_SENSIBILITAET_LABELS,
  DISSOCIATIVE_IDENTITAET_LABELS,
  DEPERSONALISATION_DEREALISATION_LABELS,
  // Persönlichkeitsstörungen labels
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
  // Impulskontrollstörungen labels
  PATHOLOGISCHES_SPIELEN_LABELS,
  PYROMANIE_LABELS,
  KLEPTOMANIE_LABELS,
  TRICHOTILLOMANIE_LABELS,
  // Sexuellbezogene Symptome labels
  SEXUELLE_FUNKTIONSSTOERUNG_LABELS,
  SEXUALPRAEFERENZSTOERUNG_LABELS,
  // Geschlechtsidentität labels
  GESCHLECHTSIDENTITAET_LABELS,
  // Hyperkinetische Störungen labels
  HYPERKINETISCH_ATTENTIONAL_LABELS,
  HYPERKINETISCH_HYPERAKTIV_LABELS,
  HYPERKINETISCH_IMPULSIV_LABELS,
  // Tic-Störungen labels
  MOTORISCHE_TICS_LABELS,
  VOKALE_TICS_LABELS,
  // Suizidalität labels
  SUIZIDALITAET_SYMPTOMATIK_LABELS,
  // Sonstige Symptomatik labels
  KRANKHEITSEINSICHT_COMPLIANCE_LABELS,
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
      const text = entry.details?.text?.trim();

      // Build label with optional brackets
      const labelPart = brackets ? `${label} (${brackets})` : label;

      if (text) {
        // Item with full sentence - include inline with ". " separator
        // generateSymptomProse will detect this and break sentences appropriately
        result.push(`${labelPart}. ${ensurePunctuation(text)}`);
      } else {
        result.push(labelPart);
      }
    }
  }
  return result;
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
// SymptomGroup type for two-level separation
// ---

// Represents a group of symptoms that can be combined within the same sentence
// Different groups are NEVER combined across boundaries
interface SymptomGroup {
  symptoms: string[];
  contextPrefix?: string;  // Optional context like "motorische Tics" or "paranoide PS"
}

// Generates sentences for a single symptom group
// existingSentenceCount is used to determine connector (first sentence vs subsequent)
// contextPrefix is used to add context like "motorische Tics in Form von"
function generateGroupSentences(
  group: SymptomGroup,
  p: GenderPronouns,
  existingSentenceCount: number
): string[] {
  const { symptoms, contextPrefix } = group;
  if (symptoms.length === 0) return [];

  const sentences: string[] = [];
  let pendingSymptoms: string[] = [];
  let connectorIndex = existingSentenceCount;

  // Helper to flush pending symptoms into a sentence
  const flushPending = () => {
    if (pendingSymptoms.length === 0) return;

    const symptomList = formatListWithUnd(pendingSymptoms);
    // Add context prefix if provided (e.g., "motorische Tics in Form von")
    const symptomPart = contextPrefix ? `${contextPrefix} ${symptomList}` : symptomList;
    let sentence: string;

    if (connectorIndex === 0) {
      // First sentence overall: introduce with patient pronoun
      sentence = `${p.derDie} zeige ${symptomPart}.`;
    } else {
      // Subsequent sentences: use connectors
      const connector = getConnector(connectorIndex);
      sentence = `${connector} bestünden ${symptomPart}.`;
    }

    sentences.push(sentence);
    pendingSymptoms = [];
    connectorIndex++;
  };

  for (const symptom of symptoms) {
    // Check if symptom contains inline sentence (has ". " pattern from CardSelection text field)
    if (symptom.includes('. ')) {
      // Flush any pending symptoms first
      flushPending();

      // Add this item with its inline sentence (context prefix applies here too)
      const symptomPart = contextPrefix ? `${contextPrefix} ${symptom}` : symptom;
      let sentence: string;
      if (connectorIndex === 0) {
        sentence = `${p.derDie} zeige ${symptomPart}`;
      } else {
        const connector = getConnector(connectorIndex);
        sentence = `${connector} bestünden ${symptomPart}`;
      }
      sentences.push(sentence);
      connectorIndex++;
    } else {
      // Regular symptom - add to pending list
      pendingSymptoms.push(symptom);

      // Flush if we have 4 pending (for readable sentence length)
      if (pendingSymptoms.length >= 4) {
        flushPending();
      }
    }
  }

  // Flush any remaining pending symptoms
  flushPending();

  return sentences;
}

// ---
// Symptom collectors (return SymptomGroup[])
// ---

// Collects symptoms from Manische Symptomatik
// Returns single group (all symptoms of mania can be combined)
function collectManischeSymptoms(data: FormTypes.ManischeSymptomatik, p: GenderPronouns): SymptomGroup[] {
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

  return symptoms.length > 0 ? [{ symptoms }] : [];
}

// Collects symptoms from Depressive Symptomatik
// Returns single group (all symptoms of depression can be combined)
function collectDepressiveSymptoms(data: FormTypes.DepressiveSymptomatik): SymptomGroup[] {
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

  return symptoms.length > 0 ? [{ symptoms }] : [];
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
// Returns single group (anxiety symptoms can be combined)
function collectAngstSymptoms(data: FormTypes.Angstsymptomatik): SymptomGroup[] {
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

  return symptoms.length > 0 ? [{ symptoms }] : [];
}

// Collects symptoms from Zwangssymptomatik
// Returns single group (OCD symptoms can be combined)
function collectZwangSymptoms(data: FormTypes.Zwangssymptomatik): SymptomGroup[] {
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

    // Bildhafte Zwangsvorstellungen
    if (zwangsgedanken.bildhafteZwangsvorstellungen?.trim()) {
      symptoms.push(`${ZWANGSGEDANKEN_FIELD_LABELS.bildhafteZwangsvorstellungen} (${zwangsgedanken.bildhafteZwangsvorstellungen.trim()})`);
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

  return symptoms.length > 0 ? [{ symptoms }] : [];
}

// Collects symptoms from Traumafolgesymptomatik into unified list
// Returns single group (PTSD symptoms can be combined)
function collectTraumaSymptoms(data: FormTypes.Traumafolgesymptomatik): SymptomGroup[] {
  if (!data) return [];
  const symptoms: string[] = [];

  // Wiedererleben des Traumas
  symptoms.push(...formatCardSelection(data.wiedererleben, TRAUMA_WIEDERERLEBEN_SYMPTOM_LABELS));

  // Vermeidungsverhalten
  symptoms.push(...formatCardSelection(data.vermeidungsverhalten, TRAUMA_VERMEIDUNG_SYMPTOM_LABELS));

  // Verhalten
  symptoms.push(...formatCardSelection(data.verhalten, TRAUMA_VERHALTEN_SYMPTOM_LABELS));

  // Übererregung
  symptoms.push(...formatCardSelection(data.uebererregung, TRAUMA_UEBERERREGUNG_SYMPTOM_LABELS));

  // Somatovegetative Symptome
  symptoms.push(...formatCardSelection(data.somatovegetativ, TRAUMA_SOMATOVEGETATIV_SYMPTOM_LABELS));

  // Emotionales Erleben
  symptoms.push(...formatCardSelection(data.emotionalesErleben, TRAUMA_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS));

  // Dissoziative Symptome
  symptoms.push(...formatCardSelection(data.dissoziativ, TRAUMA_DISSOCIATIV_SYMPTOM_LABELS));

  // Kognition
  symptoms.push(...formatCardSelection(data.kognition, TRAUMA_KOGNITION_SYMPTOM_LABELS));

  // Anpassungsstörungspezifische Symptome
  symptoms.push(...formatCardSelection(data.anpassungsstoerung, ANPASSUNGSSTOERUNG_SYMPTOM_LABELS));

  // Add "andere" symptoms if present
  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms.length > 0 ? [{ symptoms }] : [];
}

// Collects symptoms from PsychotischeSymptomatik into unified list
// Returns single group (psychotic symptoms can be combined)
function collectPsychotischeSymptoms(data: FormTypes.PsychotischeSymptomatik): SymptomGroup[] {
  if (!data) return [];
  const symptoms: string[] = [];

  // Formale Wahnmerkmale
  symptoms.push(...formatCardSelection(data.formaleWahnmerkmale, FORMALE_WAHNMERKMALE_LABELS));

  // Inhaltliche Wahnmerkmale
  symptoms.push(...formatCardSelection(data.inhaltlicheWahnmerkmale, INHALTLICHE_WAHNMERKMALE_LABELS));

  // Akustische Halluzinationen (discriminated union)
  if (data.akustischeHalluzination.type === 'stimmenhoeren') {
    symptoms.push(...formatCardSelection(data.akustischeHalluzination.subtypes, STIMMEN_HOEREN_TYP_LABELS));
  } else if (data.akustischeHalluzination.type === 'akoasmen') {
    symptoms.push('Akoasmen');
  }

  // Andere Halluzinationen
  symptoms.push(...formatCardSelection(data.andereHalluzinationen, ANDERE_HALLUZINATION_TYP_LABELS));

  // Störungen der Ich-Haftigkeit
  symptoms.push(...formatCardSelection(data.ichHaftigkeit, ICH_HAFTIGKEIT_SYMPTOM_LABELS));

  // Andere Ich-Störungen
  symptoms.push(...formatCardSelection(data.ichStoerungAndere, ICH_STOERUNG_ANDERE_SYMPTOM_LABELS));

  // Formale Denkstörungen
  symptoms.push(...formatCardSelection(data.formaleDenkstoerungen, FORMALE_DENKSTOERUNG_SYMPTOM_LABELS));

  // Emotionales Erleben
  symptoms.push(...formatCardSelection(data.emotionalesErleben, PSYCHOTISCH_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS));

  // Verhalten
  symptoms.push(...formatCardSelection(data.verhalten, PSYCHOTISCH_VERHALTEN_SYMPTOM_LABELS));

  // Kognition
  symptoms.push(...formatCardSelection(data.kognition, PSYCHOTISCH_KOGNITION_SYMPTOM_LABELS));

  // Katatone Symptome
  symptoms.push(...formatCardSelection(data.katatoneSymptome, KATATONE_SYMPTOM_LABELS));

  // Add "andere" symptoms if present
  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms.length > 0 ? [{ symptoms }] : [];
}

/**
 * Collects organische symptoms for text generation
 * Category 7: Organische Symptomatik
 * Returns single group (organic symptoms can be combined)
 */
function collectOrganischeSymptoms(data: FormTypes.OrganischeSymptomatik): SymptomGroup[] {
  if (!data) return [];
  const symptoms: string[] = [];

  // Quantitative Bewusstseinsstörungen (single-select)
  if (data.quantitativeBewusstsein) {
    symptoms.push(QUANTITATIVE_BEWUSSTSEINSSTOERUNG_LABELS[data.quantitativeBewusstsein]);
  }

  // Qualitative Bewusstseinsstörungen (single-select)
  if (data.qualitativeBewusstsein) {
    symptoms.push(QUALITATIVE_BEWUSSTSEINSSTOERUNG_LABELS[data.qualitativeBewusstsein]);
  }

  // Attentionale Symptome
  symptoms.push(...formatCardSelection(data.attentional, ORGANISCH_ATTENTIONAL_LABELS));

  // Mnestische Symptome
  symptoms.push(...formatCardSelection(data.mnestisch, ORGANISCH_MNESTISCH_LABELS));

  // Exekutiv-funktionale Symptome
  symptoms.push(...formatCardSelection(data.exekutiv, ORGANISCH_EXEKUTIV_LABELS));

  // Sprachliche Symptome
  symptoms.push(...formatCardSelection(data.sprachlich, ORGANISCH_SPRACHLICH_LABELS));

  // Denkstörungen
  symptoms.push(...formatCardSelection(data.denkstoerungen, ORGANISCH_DENKSTOERUNG_LABELS));

  // Orientierungsstörungen
  symptoms.push(...formatCardSelection(data.orientierung, ORGANISCH_ORIENTIERUNG_LABELS));

  // Emotionsbezogene Symptome
  symptoms.push(...formatCardSelection(data.emotionsbezogen, ORGANISCH_EMOTION_LABELS));

  // Amnestische Symptome
  symptoms.push(...formatCardSelection(data.amnestisch, ORGANISCH_AMNESTISCH_LABELS));

  // Basale Alltagskompetenzen (tri-state)
  for (const [key, status] of Object.entries(data.basaleAlltagskompetenzen)) {
    if (status) {
      const itemLabel = BASALE_ALLTAGSKOMPETENZ_LABELS[key as FormTypes.BasaleAlltagskompetenz];
      const statusLabel = ALLTAGSKOMPETENZ_STATUS_LABELS[status];
      symptoms.push(`${itemLabel}: ${statusLabel}`);
    }
  }

  // Instrumentelle Alltagskompetenzen (tri-state)
  for (const [key, status] of Object.entries(data.instrumentelleAlltagskompetenzen)) {
    if (status) {
      const itemLabel = INSTRUMENTELLE_ALLTAGSKOMPETENZ_LABELS[key as FormTypes.InstrumentelleAlltagskompetenz];
      const statusLabel = ALLTAGSKOMPETENZ_STATUS_LABELS[status];
      symptoms.push(`${itemLabel}: ${statusLabel}`);
    }
  }

  // Add "andere" symptoms if present
  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms.length > 0 ? [{ symptoms }] : [];
}

/**
 * Collects somatoforme symptoms for text generation
 * Category 8: Somatoforme Symptomatik
 * Returns separate groups for different somatoform subtypes
 */
function collectSomatoformeSymptoms(data: FormTypes.SomatoformeSymptomatik): SymptomGroup[] {
  if (!data) return [];
  const groups: SymptomGroup[] = [];

  // Each somatoform subtype gets its own group with context
  const koerperlich = formatCardSelection(data.koerperlicheSymptome, SOMATOFORM_KOERPERLICH_LABELS);
  if (koerperlich.length > 0) groups.push({ symptoms: koerperlich, contextPrefix: 'somatoforme körperliche Symptome mit' });

  const autonom = formatCardSelection(data.autonomeSymptome, SOMATOFORM_AUTONOM_LABELS);
  if (autonom.length > 0) groups.push({ symptoms: autonom, contextPrefix: 'somatoforme autonome Symptome mit' });

  const hypochondrisch = formatCardSelection(data.hypochondrischeSymptome, SOMATOFORM_HYPOCHONDRISCH_LABELS);
  if (hypochondrisch.length > 0) groups.push({ symptoms: hypochondrisch, contextPrefix: 'hypochondrische Symptome mit' });

  const schmerz = formatCardSelection(data.schmerzSymptome, SOMATOFORM_SCHMERZ_LABELS);
  if (schmerz.length > 0) groups.push({ symptoms: schmerz, contextPrefix: 'somatoforme Schmerzsymptome mit' });

  const konversion = formatCardSelection(data.konversionSymptome, SOMATOFORM_KONVERSION_LABELS);
  if (konversion.length > 0) groups.push({ symptoms: konversion, contextPrefix: 'Konversionssymptome mit' });

  // Add "andere" symptoms as separate group if present
  if (data.andereSymptome?.trim()) {
    groups.push({ symptoms: [data.andereSymptome.trim()] });
  }

  return groups;
}

/**
 * Collects sleep disorder symptoms for text generation
 * Category 9: Nichtorganische Schlafstörungen
 * Returns separate groups for different sleep disorder types
 */
function collectSchlafstoerungsSymptoms(data: FormTypes.NichtorganischeSchlafstoerungen): SymptomGroup[] {
  if (!data) return [];
  const groups: SymptomGroup[] = [];

  // Each sleep disorder type gets its own group with context
  const insomnie = formatCardSelection(data.insomnie, SCHLAF_INSOMNIE_LABELS);
  if (insomnie.length > 0) groups.push({ symptoms: insomnie, contextPrefix: 'Insomnie mit' });

  const hypersomnie = formatCardSelection(data.hypersomnie, SCHLAF_HYPERSOMNIE_LABELS);
  if (hypersomnie.length > 0) groups.push({ symptoms: hypersomnie, contextPrefix: 'Hypersomnie mit' });

  const rhythmus = formatCardSelection(data.rhythmus, SCHLAF_RHYTHMUS_LABELS);
  if (rhythmus.length > 0) groups.push({ symptoms: rhythmus, contextPrefix: 'Schlaf-Wach-Rhythmusstörung mit' });

  const parasomnie = formatCardSelection(data.parasomnie, SCHLAF_PARASOMNIE_LABELS);
  if (parasomnie.length > 0) groups.push({ symptoms: parasomnie, contextPrefix: 'Parasomnie mit' });

  // Add "andere" symptoms as separate group if present
  if (data.andereSymptome?.trim()) {
    groups.push({ symptoms: [data.andereSymptome.trim()] });
  }

  return groups;
}

/**
 * Collects eating disorder symptoms for text generation
 * Category 10: Essstörungen
 * Returns separate groups for disorder-specific symptoms (Anorexie, Bulimie, Binge-Eating)
 * General symptoms (kognitiv, emotional, Maßnahmen) can be combined
 */
function collectEssstoerungsSymptoms(data: FormTypes.Essstoerungen): SymptomGroup[] {
  if (!data) return [];
  const groups: SymptomGroup[] = [];

  // General symptoms can be combined (not disorder-specific)
  const generalSymptoms: string[] = [];
  generalSymptoms.push(...formatCardSelection(data.kognitiveSymptome, ESSSTOERUNG_KOGNITIV_LABELS));
  generalSymptoms.push(...formatCardSelection(data.emotionaleSymptome, ESSSTOERUNG_EMOTIONAL_LABELS));
  generalSymptoms.push(...formatCardSelection(data.gewichtsregulierendeMassnahmen, GEWICHTSREGULIERENDE_MASSNAHME_LABELS));
  if (generalSymptoms.length > 0) groups.push({ symptoms: generalSymptoms, contextPrefix: 'essstörungsspezifische Symptome mit' });

  // Each eating disorder type gets its own group
  const anorexie = formatCardSelection(data.anorexieSpezifisch, ANOREXIE_SPEZIFISCH_LABELS);
  if (anorexie.length > 0) groups.push({ symptoms: anorexie, contextPrefix: 'Anorexia nervosa mit' });

  const bulimie = formatCardSelection(data.bulimieSpezifisch, BULIMIE_SPEZIFISCH_LABELS);
  if (bulimie.length > 0) groups.push({ symptoms: bulimie, contextPrefix: 'Bulimia nervosa mit' });

  const bingeEating = formatCardSelection(data.bingeEatingSpezifisch, BINGE_EATING_SPEZIFISCH_LABELS);
  if (bingeEating.length > 0) groups.push({ symptoms: bingeEating, contextPrefix: 'Binge-Eating-Störung mit' });

  // Add "andere" symptoms as separate group if present
  if (data.andereSymptome?.trim()) {
    groups.push({ symptoms: [data.andereSymptome.trim()] });
  }

  return groups;
}

/**
 * Collects substance-related symptoms for text generation
 * Category 11: Substanzbezogene Symptomatik
 * Returns single group (substance-related symptoms can be combined)
 */
function collectSubstanzbezogeneSymptoms(data: FormTypes.SubstanzbezogeneSymptomatik): SymptomGroup[] {
  if (!data) return [];
  const symptoms: string[] = [];

  // Abhängigkeitssymptome
  symptoms.push(...formatCardSelection(data.abhaengigkeit, SUBSTANZ_ABHAENGIGKEIT_LABELS));

  // Somatovegetative Symptome
  symptoms.push(...formatCardSelection(data.somatovegetativ, SUBSTANZ_SOMATOVEGETATIV_LABELS));

  // Psychomotorik
  symptoms.push(...formatCardSelection(data.psychomotorik, SUBSTANZ_PSYCHOMOTORIK_LABELS));

  // Verhalten
  symptoms.push(...formatCardSelection(data.verhalten, SUBSTANZ_VERHALTEN_LABELS));

  // Emotionales Erleben
  symptoms.push(...formatCardSelection(data.emotionalesErleben, SUBSTANZ_EMOTIONAL_LABELS));

  // Schlaf
  symptoms.push(...formatCardSelection(data.schlaf, SUBSTANZ_SCHLAF_LABELS));

  // Neurologische Symptome
  symptoms.push(...formatCardSelection(data.neurologisch, SUBSTANZ_NEUROLOGISCH_LABELS));

  // Kognition
  symptoms.push(...formatCardSelection(data.kognition, SUBSTANZ_KOGNITIV_LABELS));

  // Psychotische Symptome
  symptoms.push(...formatCardSelection(data.psychotisch, SUBSTANZ_PSYCHOTISCH_LABELS));

  // Dissoziative Symptome
  symptoms.push(...formatCardSelection(data.dissociativ, SUBSTANZ_DISSOCIATIV_LABELS));

  // Add "andere" symptoms if present
  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms.length > 0 ? [{ symptoms }] : [];
}

// Collects all selected dissoziative symptoms
// Returns separate groups for each disorder type (different ICD diagnoses)
function collectDissociativeSymptoms(data: FormTypes.DissociativeSymptomatik): SymptomGroup[] {
  const groups: SymptomGroup[] = [];

  // Each disorder type gets its own group with context
  const amnesie = formatCardSelection(data.amnesie, DISSOCIATIVE_AMNESIE_LABELS);
  if (amnesie.length > 0) groups.push({ symptoms: amnesie, contextPrefix: 'dissoziative Amnesie mit' });

  const fugue = formatCardSelection(data.fugue, DISSOCIATIVE_FUGUE_LABELS);
  if (fugue.length > 0) groups.push({ symptoms: fugue, contextPrefix: 'dissoziative Fugue mit' });

  const stupor = formatCardSelection(data.stupor, DISSOCIATIVER_STUPOR_LABELS);
  if (stupor.length > 0) groups.push({ symptoms: stupor, contextPrefix: 'dissoziativen Stupor mit' });

  const bewegung = formatCardSelection(data.bewegungsstoerungen, DISSOCIATIVE_BEWEGUNGSSTOERUNG_LABELS);
  if (bewegung.length > 0) groups.push({ symptoms: bewegung, contextPrefix: 'dissoziative Bewegungsstörungen mit' });

  const krampf = formatCardSelection(data.krampfanfaelle, DISSOCIATIVE_KRAMPFANFAELLE_LABELS);
  if (krampf.length > 0) groups.push({ symptoms: krampf, contextPrefix: 'dissoziative Krampfanfälle mit' });

  const sensibilitaet = formatCardSelection(data.sensibilitaetsstoerungen, DISSOCIATIVE_SENSIBILITAET_LABELS);
  if (sensibilitaet.length > 0) groups.push({ symptoms: sensibilitaet, contextPrefix: 'dissoziative Sensibilitätsstörungen mit' });

  const identitaet = formatCardSelection(data.identitaetsstoerung, DISSOCIATIVE_IDENTITAET_LABELS);
  if (identitaet.length > 0) groups.push({ symptoms: identitaet, contextPrefix: 'dissoziative Identitätsstörung mit' });

  const depersonalisation = formatCardSelection(data.depersonalisationDerealisation, DEPERSONALISATION_DEREALISATION_LABELS);
  if (depersonalisation.length > 0) groups.push({ symptoms: depersonalisation, contextPrefix: 'Depersonalisation/Derealisation mit' });

  // Add "andere" symptoms as separate group if present
  if (data.andereSymptome?.trim()) {
    groups.push({ symptoms: [data.andereSymptome.trim()] });
  }

  return groups;
}

// Collects all selected persoenlichkeitsstoerungen symptoms
// Returns separate groups for each PS type (different ICD diagnoses)
function collectPersoenlichkeitsstoerungenSymptoms(data: FormTypes.Persoenlichkeitsstoerungen): SymptomGroup[] {
  const groups: SymptomGroup[] = [];

  // Each PS type gets its own group with context
  const paranoide = formatCardSelection(data.paranoide, PARANOIDE_PS_LABELS);
  if (paranoide.length > 0) groups.push({ symptoms: paranoide, contextPrefix: 'paranoide PS-Züge mit' });

  const schizoide = formatCardSelection(data.schizoide, SCHIZOIDE_PS_LABELS);
  if (schizoide.length > 0) groups.push({ symptoms: schizoide, contextPrefix: 'schizoide PS-Züge mit' });

  const schizotype = formatCardSelection(data.schizotype, SCHIZOTYPE_PS_LABELS);
  if (schizotype.length > 0) groups.push({ symptoms: schizotype, contextPrefix: 'schizotype PS-Züge mit' });

  const antisoziale = formatCardSelection(data.antisoziale, ANTISOZIALE_PS_LABELS);
  if (antisoziale.length > 0) groups.push({ symptoms: antisoziale, contextPrefix: 'antisoziale PS-Züge mit' });

  const impulsiver = formatCardSelection(data.impulsiverTyp, IMPULSIVER_TYP_LABELS);
  if (impulsiver.length > 0) groups.push({ symptoms: impulsiver, contextPrefix: 'impulsive PS-Züge mit' });

  const borderline = formatCardSelection(data.borderline, BORDERLINE_PS_LABELS);
  if (borderline.length > 0) groups.push({ symptoms: borderline, contextPrefix: 'Borderline-PS-Züge mit' });

  const histrionische = formatCardSelection(data.histrionische, HISTRIONISCHE_PS_LABELS);
  if (histrionische.length > 0) groups.push({ symptoms: histrionische, contextPrefix: 'histrionische PS-Züge mit' });

  const narzisstische = formatCardSelection(data.narzisstische, NARZISSTISCHE_PS_LABELS);
  if (narzisstische.length > 0) groups.push({ symptoms: narzisstische, contextPrefix: 'narzisstische PS-Züge mit' });

  const vermeidend = formatCardSelection(data.vermeidend, VERMEIDEND_PS_LABELS);
  if (vermeidend.length > 0) groups.push({ symptoms: vermeidend, contextPrefix: 'vermeidend-selbstunsichere PS-Züge mit' });

  const dependente = formatCardSelection(data.dependente, DEPENDENTE_PS_LABELS);
  if (dependente.length > 0) groups.push({ symptoms: dependente, contextPrefix: 'dependente PS-Züge mit' });

  const zwanghafte = formatCardSelection(data.zwanghafte, ZWANGHAFTE_PS_LABELS);
  if (zwanghafte.length > 0) groups.push({ symptoms: zwanghafte, contextPrefix: 'zwanghafte PS-Züge mit' });

  const passivAggressiv = formatCardSelection(data.passivAggressiv, PASSIV_AGGRESSIV_PS_LABELS);
  if (passivAggressiv.length > 0) groups.push({ symptoms: passivAggressiv, contextPrefix: 'passiv-aggressive PS-Züge mit' });

  const extrembelastung = formatCardSelection(data.aenderungExtrembelastung, AENDERUNG_EXTREMBELASTUNG_LABELS);
  if (extrembelastung.length > 0) groups.push({ symptoms: extrembelastung, contextPrefix: 'Persönlichkeitsänderung nach Extrembelastung mit' });

  const psychKrankheit = formatCardSelection(data.aenderungPsychKrankheit, AENDERUNG_PSYCH_KRANKHEIT_LABELS);
  if (psychKrankheit.length > 0) groups.push({ symptoms: psychKrankheit, contextPrefix: 'Persönlichkeitsänderung nach psychischer Krankheit mit' });

  // Add "andere" symptoms as separate group if present
  if (data.andereSymptome?.trim()) {
    groups.push({ symptoms: [data.andereSymptome.trim()] });
  }

  return groups;
}

// Collects all selected impulskontrollstoerungen symptoms
// Returns separate groups for each disorder type (different ICD diagnoses)
function collectImpulskontrollstoerungenSymptoms(data: FormTypes.Impulskontrollstoerungen): SymptomGroup[] {
  const groups: SymptomGroup[] = [];

  // Each disorder type gets its own group (different ICD diagnoses)
  const spielen = formatCardSelection(data.pathologischesSpielen, PATHOLOGISCHES_SPIELEN_LABELS);
  if (spielen.length > 0) groups.push({ symptoms: spielen });

  const pyromanie = formatCardSelection(data.pyromanie, PYROMANIE_LABELS);
  if (pyromanie.length > 0) groups.push({ symptoms: pyromanie });

  const kleptomanie = formatCardSelection(data.kleptomanie, KLEPTOMANIE_LABELS);
  if (kleptomanie.length > 0) groups.push({ symptoms: kleptomanie });

  const trichotillomanie = formatCardSelection(data.trichotillomanie, TRICHOTILLOMANIE_LABELS);
  if (trichotillomanie.length > 0) groups.push({ symptoms: trichotillomanie });

  // Add "andere" symptoms as separate group if present
  if (data.andereSymptome?.trim()) {
    groups.push({ symptoms: [data.andereSymptome.trim()] });
  }

  return groups;
}

// Collects all selected sexuellbezogene symptoms
// Returns separate groups for different diagnostic categories
function collectSexuellbezogeneSymptoms(data: FormTypes.SexuellbezogeneSymptome): SymptomGroup[] {
  const groups: SymptomGroup[] = [];

  // Different diagnostic categories get separate groups
  const funktions = formatCardSelection(data.funktionsstoerungen, SEXUELLE_FUNKTIONSSTOERUNG_LABELS);
  if (funktions.length > 0) groups.push({ symptoms: funktions });

  const praeferenz = formatCardSelection(data.praeferenzstoerungen, SEXUALPRAEFERENZSTOERUNG_LABELS);
  if (praeferenz.length > 0) groups.push({ symptoms: praeferenz });

  // Add "andere" symptoms as separate group if present
  if (data.andereSymptome?.trim()) {
    groups.push({ symptoms: [data.andereSymptome.trim()] });
  }

  return groups;
}

// Collects all selected geschlechtsidentitaet symptoms
// Returns single group (same syndrome)
function collectGeschlechtsidentitaetSymptoms(data: FormTypes.GeschlechtsidentitaetSymptomatik): SymptomGroup[] {
  const symptoms: string[] = [];

  // All combined because they're all related to gender identity
  symptoms.push(...formatCardSelection(data.symptome, GESCHLECHTSIDENTITAET_LABELS));

  // Add "andere" symptoms if present
  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms.length > 0 ? [{ symptoms }] : [];
}

// Collects all selected hyperkinetische störungen symptoms
// Returns single group (all ADHD symptoms)
function collectHyperkinetischeStoerungsSymptoms(data: FormTypes.HyperkinetischeStoerungen): SymptomGroup[] {
  const symptoms: string[] = [];

  // All combined because they're all ADHD symptoms
  symptoms.push(...formatCardSelection(data.attentional, HYPERKINETISCH_ATTENTIONAL_LABELS));
  symptoms.push(...formatCardSelection(data.hyperaktiv, HYPERKINETISCH_HYPERAKTIV_LABELS));
  symptoms.push(...formatCardSelection(data.impulsiv, HYPERKINETISCH_IMPULSIV_LABELS));

  // Add "andere" symptoms if present
  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms.length > 0 ? [{ symptoms }] : [];
}

// Collects all selected tic-störungen symptoms
// Returns separate groups for motorische and vokale Tics with context
function collectTicStoerungenSymptoms(data: FormTypes.TicStoerungen): SymptomGroup[] {
  const groups: SymptomGroup[] = [];

  // Motorische Tics get their own group with context
  const motorisch = formatCardSelection(data.motorischeTics, MOTORISCHE_TICS_LABELS);
  if (motorisch.length > 0) groups.push({ symptoms: motorisch, contextPrefix: 'motorische Tics in Form von' });

  // Vokale Tics get their own group with context
  const vokal = formatCardSelection(data.vokaleTics, VOKALE_TICS_LABELS);
  if (vokal.length > 0) groups.push({ symptoms: vokal, contextPrefix: 'vokale Tics in Form von' });

  // Tourette-Syndrom as its own group (no context needed, already descriptive)
  if (data.touretteSyndrom) {
    groups.push({ symptoms: ['Tourette-Syndrom'] });
  }

  // Add "andere" symptoms as separate group if present
  if (data.andereSymptome?.trim()) {
    groups.push({ symptoms: [data.andereSymptome.trim()] });
  }

  return groups;
}

// Collects all selected suizidalitaet symptoms
// Returns single group (same risk domain)
function collectSuizidalitaetSymptoms(data: FormTypes.SuizidalitaetSymptomatik): SymptomGroup[] {
  const symptoms: string[] = [];

  // All combined because they're all suicidality symptoms
  symptoms.push(...formatCardSelection(data.symptome, SUIZIDALITAET_SYMPTOMATIK_LABELS));

  // Add "andere" symptoms if present
  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms.length > 0 ? [{ symptoms }] : [];
}

// Collects all selected sonstige symptomatik symptoms
// Returns single group
function collectSonstigeSymptoms(data: FormTypes.SonstigeSymptomatik): SymptomGroup[] {
  const symptoms: string[] = [];

  // All combined
  symptoms.push(...formatCardSelection(data.krankheitseinsichtCompliance, KRANKHEITSEINSICHT_COMPLIANCE_LABELS));

  // Add "andere" symptoms if present
  if (data.andereSymptome?.trim()) {
    symptoms.push(data.andereSymptome.trim());
  }

  return symptoms.length > 0 ? [{ symptoms }] : [];
}

// ---
// Main export
// ---

// Helper to collect all groups and generate sentences
function processAllGroups(
  groups: SymptomGroup[],
  p: GenderPronouns,
  existingSentences: string[]
): void {
  for (const group of groups) {
    const newSentences = generateGroupSentences(group, p, existingSentences.length);
    existingSentences.push(...newSentences);
  }
}

// Constructs unified content for all Symptomatik categories
// Groups are processed separately - symptoms from different categories/subsections
// are NEVER combined into the same sentence
export function constructSymptomatikContent(formData: FormTypes.Form): FormTypes.ParagraphNode[] {
  const p = getPronounsForGender(formData.geschlecht);

  // Collect all sentences - each category/group generates its own sentences
  const allSentences: string[] = [];

  // 1. Manische Symptomatik (same syndrome - single group)
  processAllGroups(collectManischeSymptoms(formData.manischeSymptomatik, p), p, allSentences);

  // 2. Depressive Symptomatik (same syndrome - single group)
  processAllGroups(collectDepressiveSymptoms(formData.depressiveSymptomatik), p, allSentences);

  // 3. Angstsymptomatik (same syndrome - single group, excluding Agoraphobie/Soziale Phobie)
  processAllGroups(collectAngstSymptoms(formData.angstsymptomatik), p, allSentences);

  // 4. Zwangssymptomatik (same syndrome - single group)
  processAllGroups(collectZwangSymptoms(formData.zwangssymptomatik), p, allSentences);

  // 5. Traumafolgesymptomatik (same syndrome - single group)
  processAllGroups(collectTraumaSymptoms(formData.traumafolgesymptomatik), p, allSentences);

  // 6. Psychotische Symptomatik (same syndrome - single group)
  processAllGroups(collectPsychotischeSymptoms(formData.psychotischeSymptomatik), p, allSentences);

  // 7. Organische Symptomatik (same syndrome - single group)
  processAllGroups(collectOrganischeSymptoms(formData.organischeSymptomatik), p, allSentences);

  // 8. Somatoforme Symptomatik (different disorders - separate groups)
  processAllGroups(collectSomatoformeSymptoms(formData.somatoformeSymptomatik), p, allSentences);

  // 9. Nichtorganische Schlafstörungen (different disorders - separate groups)
  processAllGroups(collectSchlafstoerungsSymptoms(formData.nichtorganischeSchlafstoerungen), p, allSentences);

  // 10. Essstörungen (different disorders - separate groups)
  processAllGroups(collectEssstoerungsSymptoms(formData.essstoerungen), p, allSentences);

  // 11. Substanzbezogene Symptomatik (same syndrome - single group)
  processAllGroups(collectSubstanzbezogeneSymptoms(formData.substanzbezogeneSymptomatik), p, allSentences);

  // 12. Dissoziative Symptomatik (different disorders - separate groups)
  processAllGroups(collectDissociativeSymptoms(formData.dissociativeSymptomatik), p, allSentences);

  // 13. Persönlichkeitsstörungen (different disorders - separate groups)
  processAllGroups(collectPersoenlichkeitsstoerungenSymptoms(formData.persoenlichkeitsstoerungen), p, allSentences);

  // 14. Impulskontrollstörungen (different disorders - separate groups)
  processAllGroups(collectImpulskontrollstoerungenSymptoms(formData.impulskontrollstoerungen), p, allSentences);

  // 15. Sexuellbezogene Symptome (different disorders - separate groups)
  processAllGroups(collectSexuellbezogeneSymptoms(formData.sexuellbezogeneSymptome), p, allSentences);

  // 16. Geschlechtsidentität (same syndrome - single group)
  processAllGroups(collectGeschlechtsidentitaetSymptoms(formData.geschlechtsidentitaet), p, allSentences);

  // 17. Hyperkinetische Störungen (same syndrome - single group)
  processAllGroups(collectHyperkinetischeStoerungsSymptoms(formData.hyperkinetischeStoerungen), p, allSentences);

  // 18. Tic-Störungen (separate groups for motorische/vokale with context)
  processAllGroups(collectTicStoerungenSymptoms(formData.ticStoerungen), p, allSentences);

  // 19. Suizidalität (same syndrome - single group)
  processAllGroups(collectSuizidalitaetSymptoms(formData.suizidalitaetSymptomatik), p, allSentences);

  // 20. Sonstige Symptomatik (same syndrome - single group)
  processAllGroups(collectSonstigeSymptoms(formData.sonstigeSymptomatik), p, allSentences);

  // Build paragraphs from collected sentences
  const paragraphs: FormTypes.ParagraphNode[] = [];
  if (allSentences.length > 0) {
    paragraphs.push({
      type: 'paragraph',
      text: allSentences.join(' '),
      id: 'symptomatik'
    });
  }

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
