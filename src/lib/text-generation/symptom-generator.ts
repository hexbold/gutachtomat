/**
 * Symptom Utility Functions
 *
 * This file provides utility functions to construct human-readable text from symptom data.
 * Each function takes structured symptom data and converts it into formatted German text
 * suitable for psychological assessment reports (Gutachten).
 *
 * Main function groups:
 * - A2-A3: Behavioral patterns (Verhaltensauffaelligkeiten)
 * - Testbefunde: Diagnostic test results
 * - Kapitel 4: Lebensgeschichte (LebensgA, LebensgB, LebensgC)
 * - Kapitel 5: Diagnosen
 *
 * Note: B1-B18 (Psychischer Befund) has been moved to psychischer-befund-generator.ts
 * Note: Kapitel 3 (Somatischer Befund) has been moved to sections/somatischer-befund-generator.ts
 * Note: Krankheitsanamnese has been moved to sections/krankheitsanamnese-generator.ts
 */

import {
  LebensgAData,
  Kap5DiagnosenData,
  ParagraphNode,
  TestdiagnostikData,
  Verhaltensauffaelligkeiten,
  VerhaltensexzessSymptom,
  VerhaltensdefizitSymptom,
  Geschlecht,
} from '../core/form-types';
import {
  VERHALTENSEXZESS_SYMPTOM_LABELS,
  VERHALTENSDEFIZIT_SYMPTOM_LABELS,
} from '../core/form-labels';
import { generateLebensgeschichteParagraphs } from './sections/lebensgeschichte-generator';
import { getPronounsForGender } from './pronoun-utils';
import { ensurePunctuation } from './text-utils';

// ============================================================
// SECTION VERHALTENSAUFFAELLIGKEITEN - BEHAVIORAL PATTERNS
// ============================================================

/**
 * Strips parenthetical explanations from labels
 * e.g., "Dysfunktionale Kognitionen (Denkfehler...)" → "Dysfunktionale Kognitionen"
 */
function getShortLabel(fullLabel: string): string {
  const parenIndex = fullLabel.indexOf('(');
  return parenIndex > 0 ? fullLabel.substring(0, parenIndex).trim() : fullLabel;
}

/**
 * Constructs structured content for Verhaltensexzesse (Behavioral Excesses)
 * Format: **Verhaltensexzesse:** item1, item2, item3
 */
export function constructVerhaltensexzesseContent(data: Verhaltensauffaelligkeiten): ParagraphNode[] {
  const content: ParagraphNode[] = [];
  const listItems: string[] = [];

  // Collect selected exzesse
  for (const symptom of Object.values(VerhaltensexzessSymptom)) {
    const entry = data.exzesse[symptom];
    if (entry?.selected) {
      let item = getShortLabel(VERHALTENSEXZESS_SYMPTOM_LABELS[symptom]);
      // Append user's brackets if provided
      if (entry.details?.brackets?.trim()) {
        item += ` (${entry.details.brackets.trim()})`;
      }
      listItems.push(item);
    }
  }

  // Add "andere" to the list if provided
  if (data.andereExzesse?.trim()) {
    listItems.push(data.andereExzesse.trim());
  }

  // Build the paragraph with bold heading and comma-separated list
  if (listItems.length > 0) {
    const text = `**Verhaltensexzesse:**  \n${listItems.join(', ')}`;
    content.push({
      type: 'paragraph',
      text,
      id: 'verhaltensexzesse'
    });
  }

  return content;
}

/**
 * Constructs structured content for Verhaltensdefizite (Behavioral Deficits)
 * Format: **Verhaltensdefizite:** item1, item2, item3
 */
export function constructVerhaltensdefiziteContent(data: Verhaltensauffaelligkeiten): ParagraphNode[] {
  const content: ParagraphNode[] = [];
  const listItems: string[] = [];

  // Collect selected defizite
  for (const symptom of Object.values(VerhaltensdefizitSymptom)) {
    const entry = data.defizite[symptom];
    if (entry?.selected) {
      let item = getShortLabel(VERHALTENSDEFIZIT_SYMPTOM_LABELS[symptom]);
      // Append user's brackets if provided
      if (entry.details?.brackets?.trim()) {
        item += ` (${entry.details.brackets.trim()})`;
      }
      listItems.push(item);
    }
  }

  // Add "andere" to the list if provided
  if (data.andereDefizite?.trim()) {
    listItems.push(data.andereDefizite.trim());
  }

  // Build the paragraph with bold heading and comma-separated list
  if (listItems.length > 0) {
    const text = `**Verhaltensdefizite:**  \n${listItems.join(', ')}`;
    content.push({
      type: 'paragraph',
      text,
      id: 'verhaltensdefizite'
    });
  }

  return content;
}

/**
 * Constructs structured content for all Verhaltensauffaelligkeiten
 */
export function constructVerhaltensauffaelligkeitenContent(data: Verhaltensauffaelligkeiten): ParagraphNode[] {
  return [
    ...constructVerhaltensexzesseContent(data),
    ...constructVerhaltensdefiziteContent(data)
  ];
}

// ============================================================
// TESTBEFUNDE - DIAGNOSTIC TEST RESULTS
// ============================================================

/**
 * Formats a date string from YYYY-MM-DD to DD.MM.YYYY
 */
function formatDateGerman(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }
  return dateStr;
}

/**
 * Constructs structured content for Testbefunde (Diagnostic Test Results)
 * Format: **Testbefunde:**
 *         Am [date] wurde der [abbreviation] ([name]) durchgeführt. Der erzielte Score betrug [score]. [notizen].
 */
export function constructTestbefundeContent(data: TestdiagnostikData): ParagraphNode[] {
  if (!data.selectedTests || data.selectedTests.length === 0) {
    return [];
  }

  const sentences: string[] = [];

  for (const test of data.selectedTests) {
    // Build the main sentence
    let sentence = '';

    if (test.durchfuehrungsdatum) {
      sentence = `Am ${formatDateGerman(test.durchfuehrungsdatum)} wurde der ${test.abbreviation} (${test.name}) durchgeführt.`;
    } else {
      sentence = `Es wurde der ${test.abbreviation} (${test.name}) durchgeführt.`;
    }

    // Add score if present
    if (test.score !== null) {
      sentence += ` Der erzielte Score betrug ${test.score}.`;
    }

    // Add notes if present
    if (test.notizen?.trim()) {
      sentence += ` ${ensurePunctuation(test.notizen.trim())}`;
    }

    sentences.push(sentence);
  }

  const text = `**Testbefunde:**  \n${sentences.join(' ')}`;

  return [{
    type: 'paragraph',
    text,
    id: 'testbefunde'
  }];
}

// ============================================================
// KAPITEL 5: DIAGNOSEN
// ============================================================

/**
 * Constructs structured content for Kapitel 5 diagnoses (NEW - with lists!)
 */
export function constructKap5DiagnosenContent(kap5DiagnosenData: Kap5DiagnosenData): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (!kap5DiagnosenData.selectedDiagnoses || kap5DiagnosenData.selectedDiagnoses.length === 0) {
    return content;
  }

  // Create diagnoses text with codes and certainty markers
  const diagnoseTexts = kap5DiagnosenData.selectedDiagnoses
    .map(d => `${d.code} (${d.sicherheit}) ${d.name}`);
  
  // Create intro and diagnoses as comma-separated text
  if (kap5DiagnosenData.selectedDiagnoses.length === 1) {
    content.push({
      type: 'paragraph',
      text: `Folgende Diagnose wurde gestellt: ${diagnoseTexts[0]}.`,
      id: 'kap5-diagnosen'
    });
  } else {
    const diagnoseList = diagnoseTexts.join(', ');
    content.push({
      type: 'paragraph',
      text: `Folgende Diagnosen wurden gestellt: ${diagnoseList}.`,
      id: 'kap5-diagnosen'
    });
  }

  return content;
}

/**
 * Constructs text for Kapitel 5 diagnoses (OLD - kept for backward compatibility)
 * @deprecated Use constructKap5DiagnosenContent instead for structured output
 */
export function constructKap5DiagnosenText(kap5DiagnosenData: Kap5DiagnosenData): string {
  if (!kap5DiagnosenData.selectedDiagnoses || kap5DiagnosenData.selectedDiagnoses.length === 0) {
    return '';
  }

  // Format all diagnoses with (G) or (V) markers
  const diagnoseList = kap5DiagnosenData.selectedDiagnoses
    .map(d => `${d.code} (${d.sicherheit}) ${d.name}`)
    .join(', ');

  if (kap5DiagnosenData.selectedDiagnoses.length === 1) {
    return `Folgende Diagnose wurde gestellt: ${diagnoseList}.`;
  } else {
    return `Folgende Diagnosen wurden gestellt: ${diagnoseList}.`;
  }
}

// ============================================================
// KAPITEL 3 - SOMATISCHER BEFUND (DEPRECATED)
// ============================================================
// NOTE: Somato1-5 functions have been moved to sections/somatischer-befund-generator.ts
// which uses the new type-safe discriminated unions and array-based structures.
// The old functions used string-based field types and have been removed.

// ============================================================
// KAPITEL 4 - RELEVANTE ANGABEN ZUR LEBENSGESCHICHTE
// ============================================================

/**
 * Constructs structured content for LebensgA data
 * Uses the lebensgeschichte-generator for structured fields (parents, siblings, etc.)
 * Returns a single paragraph with all text joined as continuous Fließtext
 */
export function constructLebensgAContent(
  lebensgAData: LebensgAData,
  geschlecht?: Geschlecht | null
): ParagraphNode[] {
  // Generate from structured fields using the lebensgeschichte-generator
  const pronouns = getPronounsForGender(geschlecht ?? null);
  const paragraphs = generateLebensgeschichteParagraphs(lebensgAData, pronouns);

  // Combine all paragraphs into one continuous Fließtext
  const allText = paragraphs.map(p => p.text).join(' ');

  if (allText.trim()) {
    return [{
      type: 'paragraph',
      text: allText,
      id: 'lebensgeschichte-content'
    }];
  }

  // Legacy fields as fallback (only if no structured content was generated)
  const legacyParts: string[] = [];
  if (lebensgAData.a1BiographischeEinordnung) {
    legacyParts.push(lebensgAData.a1BiographischeEinordnung);
  }
  if (lebensgAData.a2Entwicklung) {
    legacyParts.push(lebensgAData.a2Entwicklung);
  }

  if (legacyParts.length > 0) {
    return [{
      type: 'paragraph',
      text: legacyParts.join(' '),
      id: 'lebensgeschichte-content'
    }];
  }

  return [];
}

/**
 * Constructs text for LebensgA data (OLD - kept for backward compatibility)
 * @deprecated Use constructLebensgAContent instead for structured output
 */
export function constructLebensgAText(lebensgAData: LebensgAData): string {
  const parts: string[] = [];

  // A1: Kurze biographische Einordnung
  if (lebensgAData.a1BiographischeEinordnung) {
    parts.push(`Biographische Einordnung: ${lebensgAData.a1BiographischeEinordnung}`);
  }

  // A2: Entwicklung
  if (lebensgAData.a2Entwicklung) {
    parts.push(`Entwicklung: ${lebensgAData.a2Entwicklung}`);
  }

  if (parts.length === 0) {
    return '';
  }

  return parts.join('\n\n');
}


