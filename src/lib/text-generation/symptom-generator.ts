/**
 * Symptom Utility Functions
 *
 * This file provides utility functions to construct human-readable text from symptom data.
 * Each function takes structured symptom data and converts it into formatted German text
 * suitable for psychological assessment reports (Gutachten).
 *
 * Main function groups:
 * - F30/F31 to F41.1: ICD-10 diagnosis-specific symptoms
 * - A2-A5: Behavioral patterns and symptom progression
 * - B1-B18: Psychopathological findings (Befund)
 */

import { A2Data, A3Data, A4Data, A5Data, B1Data, B2Data, B3Data, B4Data, B5Data, B6Data, B7Data, B8Data, B9Data, B10Data, B11Data, B12Data, B13Data, B14Data, B15Data, B16Data, B17Data, B18Data, Somato1Data, Somato2Data, Somato3Data, Somato4Data, Somato5Data, LebensgAData, LebensgBData, LebensgCData, Kap5DiagnosenData, ParagraphNode, ListNode } from '../core/form-types';
import * as FormConfig from '@/lib/core/form-config';

// ============================================================
// LEGACY TYPE ALIASES (for old F-code functions - to be removed)
// ============================================================
type F30F31Data = { symptoms: string[]; andereSymptome: string };
type F32F33Data = { symptoms: string[]; andereSymptome: string };
type F40F41Data = { symptoms: string[]; andereSymptome: string };
type F400Data = { symptoms: string[]; andereSymptome: string };
type F401Data = { symptoms: string[]; andereSymptome: string };
type F402Data = { symptoms: string[]; andereSymptome: string };
type F410Data = { symptoms: string[]; andereSymptome: string };
type F411Data = { symptoms: string[]; andereSymptome: string };

// ============================================================
// ICD-10 DIAGNOSIS SYMPTOMS - F30/F31 (BIPOLAR DISORDERS)
// ============================================================

/**
 * Constructs structured content for F30/F31 symptoms (NEW - comma-separated)
 * This is the new approach using structured data
 */
export function constructF30F31Content(f30f31Data: F30F31Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // Handle selected F30/F31 symptoms as comma-separated text
  if (f30f31Data.symptoms && f30f31Data.symptoms.length > 0) {
    const symptomsText = f30f31Data.symptoms.join(', ');
    content.push({
      type: 'paragraph',
      text: `Folgende F30/F31 Symptome wurden festgestellt: ${symptomsText}.`,
      id: 'f30f31'
    });
  }

  // Handle additional symptoms
  if (f30f31Data.andereSymptome && f30f31Data.andereSymptome.trim()) {
    content.push({
      type: 'paragraph',
      text: `Andere Symptome sind: ${f30f31Data.andereSymptome.trim()}.`,
      id: 'f30f31-andere'
    });
  }

  return content;
}

/**
 * Constructs sentences for F30/F31 symptoms (OLD - kept for backward compatibility)
 * @deprecated Use constructF30F31Content instead for structured output
 */
export function constructF30F31SymptomsText(f30f31Data: F30F31Data): string {
  let symptomsText = '';

  // Handle selected F30/F31 symptoms
  if (f30f31Data.symptoms && f30f31Data.symptoms.length > 0) {
    const symptomsString = f30f31Data.symptoms.join(', ');
    symptomsText += `Folgende F30/F31 Symptome wurden festgestellt: ${symptomsString}.`;
  }

  // Handle additional symptoms
  if (f30f31Data.andereSymptome && f30f31Data.andereSymptome.trim()) {
    if (symptomsText) {
      symptomsText += ' ';
    }
    symptomsText += `Andere Symptome sind: ${f30f31Data.andereSymptome.trim()}.`;
  }

  return symptomsText;
}

// ============================================================
// ICD-10 DIAGNOSIS SYMPTOMS - F32/F33 (DEPRESSIVE DISORDERS)
// ============================================================

/**
 * Constructs structured content for F32/F33 symptoms (NEW - comma-separated)
 */
export function constructF32F33Content(f32f33Data: F32F33Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // Handle selected F32/F33 symptoms as comma-separated text
  if (f32f33Data.symptoms && f32f33Data.symptoms.length > 0) {
    const symptomsText = f32f33Data.symptoms.join(', ');
    content.push({
      type: 'paragraph',
      text: `Folgende F32/F33 Symptome wurden festgestellt: ${symptomsText}.`,
      id: 'f32f33'
    });
  }

  // Handle additional symptoms
  if (f32f33Data.andereSymptome && f32f33Data.andereSymptome.trim()) {
    content.push({
      type: 'paragraph',
      text: `Andere Symptome sind: ${f32f33Data.andereSymptome.trim()}.`,
      id: 'f32f33-andere'
    });
  }

  return content;
}

/**
 * Constructs sentences for F32/F33 symptoms (OLD - kept for backward compatibility)
 * @deprecated Use constructF32F33Content instead for structured output
 */
export function constructF32F33SymptomsText(f32f33Data: F32F33Data): string {
  let symptomsText = '';

  // Handle selected F32/F33 symptoms
  if (f32f33Data.symptoms && f32f33Data.symptoms.length > 0) {
    const symptomsString = f32f33Data.symptoms.join(', ');
    symptomsText += `Folgende F32/F33 Symptome wurden festgestellt: ${symptomsString}.`;
  }

  // Handle additional symptoms
  if (f32f33Data.andereSymptome && f32f33Data.andereSymptome.trim()) {
    if (symptomsText) {
      symptomsText += ' ';
    }
    symptomsText += `Andere Symptome sind: ${f32f33Data.andereSymptome.trim()}.`;
  }

  return symptomsText;
}

// ============================================================
// ICD-10 DIAGNOSIS SYMPTOMS - F40/F41 (ANXIETY DISORDERS)
// ============================================================

/**
 * Constructs structured content for F40/F41 symptoms (NEW - comma-separated)
 */
export function constructF40F41Content(f40f41Data: F40F41Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // Handle selected F40/F41 symptoms as comma-separated text
  if (f40f41Data.symptoms && f40f41Data.symptoms.length > 0) {
    const symptomsText = f40f41Data.symptoms.join(', ');
    content.push({
      type: 'paragraph',
      text: `Folgende F40/F41 Symptome wurden festgestellt: ${symptomsText}.`,
      id: 'f40f41'
    });
  }

  // Handle additional symptoms
  if (f40f41Data.andereSymptome && f40f41Data.andereSymptome.trim()) {
    content.push({
      type: 'paragraph',
      text: `Andere Symptome sind: ${f40f41Data.andereSymptome.trim()}.`,
      id: 'f40f41-andere'
    });
  }

  return content;
}

/**
 * Constructs sentences for F40/F41 symptoms (OLD - kept for backward compatibility)
 * @deprecated Use constructF40F41Content instead for structured output
 */
export function constructF40F41SymptomsText(f40f41Data: F40F41Data): string {
  let symptomsText = '';

  // Handle selected F40/F41 symptoms
  if (f40f41Data.symptoms && f40f41Data.symptoms.length > 0) {
    const symptomsString = f40f41Data.symptoms.join(', ');
    symptomsText += `Folgende F40/F41 Symptome wurden festgestellt: ${symptomsString}.`;
  }

  // Handle additional symptoms
  if (f40f41Data.andereSymptome && f40f41Data.andereSymptome.trim()) {
    if (symptomsText) {
      symptomsText += ' ';
    }
    symptomsText += `Andere Symptome sind: ${f40f41Data.andereSymptome.trim()}.`;
  }

  return symptomsText;
}

// ============================================================
// ICD-10 DIAGNOSIS SYMPTOMS - F40.0 (AGORAPHOBIA)
// ============================================================

/**
 * Constructs structured content for F40.0 symptoms (Agoraphobie) (NEW - with lists!)
 */
export function constructF400Content(f400Data: F400Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // Handle selected F400 symptoms as comma-separated text
  if (f400Data.symptoms && f400Data.symptoms.length > 0) {
    const symptomsText = f400Data.symptoms.join(', ');
    content.push({
      type: 'paragraph',
      text: `Folgende F400 Symptome wurden festgestellt: ${symptomsText}.`,
      id: 'f400'
    });
  }

  // Handle additional symptoms
  if (f400Data.andereSymptome && f400Data.andereSymptome.trim()) {
    content.push({
      type: 'paragraph',
      text: `Andere Symptome sind: ${f400Data.andereSymptome.trim()}.`,
      id: 'f400-andere'
    });
  }

  return content;
}

/**
 * Constructs sentences for F40.0 symptoms (Agoraphobie) (OLD - kept for backward compatibility)
 * @deprecated Use constructF400Content instead for structured output
 */
export function constructF400SymptomsText(f400Data: F400Data): string {
  let symptomsText = '';

  // Handle selected F40.0 symptoms
  if (f400Data.symptoms && f400Data.symptoms.length > 0) {
    const symptomsString = f400Data.symptoms.join(', ');
    symptomsText += `Folgende F40.0 Symptome wurden festgestellt: ${symptomsString}.`;
  }

  // Handle additional symptoms
  if (f400Data.andereSymptome && f400Data.andereSymptome.trim()) {
    if (symptomsText) {
      symptomsText += ' ';
    }
    symptomsText += `Andere Symptome sind: ${f400Data.andereSymptome.trim()}.`;
  }

  return symptomsText;
}

// ============================================================
// ICD-10 DIAGNOSIS SYMPTOMS - F40.1 (SOCIAL PHOBIA)
// ============================================================

/**
 * Constructs structured content for F40.1 symptoms (Soziale Phobie) (NEW - with lists!)
 */
export function constructF401Content(f401Data: F401Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // Handle selected F401 symptoms as comma-separated text
  if (f401Data.symptoms && f401Data.symptoms.length > 0) {
    const symptomsText = f401Data.symptoms.join(', ');
    content.push({
      type: 'paragraph',
      text: `Folgende F401 Symptome wurden festgestellt: ${symptomsText}.`,
      id: 'f401'
    });
  }

  // Handle additional symptoms
  if (f401Data.andereSymptome && f401Data.andereSymptome.trim()) {
    content.push({
      type: 'paragraph',
      text: `Andere Symptome sind: ${f401Data.andereSymptome.trim()}.`,
      id: 'f401-andere'
    });
  }

  return content;
}

/**
 * Constructs sentences for F40.1 symptoms (Soziale Phobie) (OLD - kept for backward compatibility)
 * @deprecated Use constructF401Content instead for structured output
 */
export function constructF401SymptomsText(f401Data: F401Data): string {
  let symptomsText = '';

  // Handle selected F40.1 symptoms
  if (f401Data.symptoms && f401Data.symptoms.length > 0) {
    const symptomsString = f401Data.symptoms.join(', ');
    symptomsText += `Folgende F40.1 Symptome wurden festgestellt: ${symptomsString}.`;
  }

  // Handle additional symptoms
  if (f401Data.andereSymptome && f401Data.andereSymptome.trim()) {
    if (symptomsText) {
      symptomsText += ' ';
    }
    symptomsText += `Andere Symptome sind: ${f401Data.andereSymptome.trim()}.`;
  }

  return symptomsText;
}

// ============================================================
// ICD-10 DIAGNOSIS SYMPTOMS - F40.2 (SPECIFIC PHOBIAS)
// ============================================================

/**
 * Constructs structured content for F40.2 symptoms (Spezifische Phobien) (NEW - with lists!)
 */
export function constructF402Content(f402Data: F402Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // Handle selected F402 symptoms as comma-separated text
  if (f402Data.symptoms && f402Data.symptoms.length > 0) {
    const symptomsText = f402Data.symptoms.join(', ');
    content.push({
      type: 'paragraph',
      text: `Folgende F402 Symptome wurden festgestellt: ${symptomsText}.`,
      id: 'f402'
    });
  }

  // Handle additional symptoms
  if (f402Data.andereSymptome && f402Data.andereSymptome.trim()) {
    content.push({
      type: 'paragraph',
      text: `Andere Symptome sind: ${f402Data.andereSymptome.trim()}.`,
      id: 'f402-andere'
    });
  }

  return content;
}

/**
 * Constructs sentences for F40.2 symptoms (Spezifische Phobien) (OLD - kept for backward compatibility)
 * @deprecated Use constructF402Content instead for structured output
 */
export function constructF402SymptomsText(f402Data: F402Data): string {
  let symptomsText = '';

  // Handle selected F40.2 symptoms
  if (f402Data.symptoms && f402Data.symptoms.length > 0) {
    const symptomsString = f402Data.symptoms.join(', ');
    symptomsText += `Folgende F40.2 Symptome wurden festgestellt: ${symptomsString}.`;
  }

  // Handle additional symptoms
  if (f402Data.andereSymptome && f402Data.andereSymptome.trim()) {
    if (symptomsText) {
      symptomsText += ' ';
    }
    symptomsText += `Andere Symptome sind: ${f402Data.andereSymptome.trim()}.`;
  }

  return symptomsText;
}

// ============================================================
// ICD-10 DIAGNOSIS SYMPTOMS - F41.0 (PANIC DISORDER)
// ============================================================

/**
 * Constructs structured content for F41.0 symptoms (Panikstörung) (NEW - with lists!)
 */
export function constructF410Content(f410Data: F410Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // Handle selected F410 symptoms as comma-separated text
  if (f410Data.symptoms && f410Data.symptoms.length > 0) {
    const symptomsText = f410Data.symptoms.join(', ');
    content.push({
      type: 'paragraph',
      text: `Folgende F410 Symptome wurden festgestellt: ${symptomsText}.`,
      id: 'f410'
    });
  }

  // Handle additional symptoms
  if (f410Data.andereSymptome && f410Data.andereSymptome.trim()) {
    content.push({
      type: 'paragraph',
      text: `Andere Symptome sind: ${f410Data.andereSymptome.trim()}.`,
      id: 'f410-andere'
    });
  }

  return content;
}

/**
 * Constructs sentences for F41.0 symptoms (Panikstörung) (OLD - kept for backward compatibility)
 * @deprecated Use constructF410Content instead for structured output
 */
export function constructF410SymptomsText(f410Data: F410Data): string {
  let symptomsText = '';

  // Handle selected F41.0 symptoms
  if (f410Data.symptoms && f410Data.symptoms.length > 0) {
    const symptomsString = f410Data.symptoms.join(', ');
    symptomsText += `Folgende F41.0 Symptome wurden festgestellt: ${symptomsString}.`;
  }

  // Handle additional symptoms
  if (f410Data.andereSymptome && f410Data.andereSymptome.trim()) {
    if (symptomsText) {
      symptomsText += ' ';
    }
    symptomsText += `Andere Symptome sind: ${f410Data.andereSymptome.trim()}.`;
  }

  return symptomsText;
}

// ============================================================
// ICD-10 DIAGNOSIS SYMPTOMS - F41.1 (GENERALIZED ANXIETY DISORDER)
// ============================================================

/**
 * Constructs structured content for F41.1 symptoms (Generalisierte Angststörung) (NEW - with lists!)
 */
export function constructF411Content(f411Data: F411Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // Handle selected F411 symptoms as comma-separated text
  if (f411Data.symptoms && f411Data.symptoms.length > 0) {
    const symptomsText = f411Data.symptoms.join(', ');
    content.push({
      type: 'paragraph',
      text: `Folgende F411 Symptome wurden festgestellt: ${symptomsText}.`,
      id: 'f411'
    });
  }

  // Handle additional symptoms
  if (f411Data.andereSymptome && f411Data.andereSymptome.trim()) {
    content.push({
      type: 'paragraph',
      text: `Andere Symptome sind: ${f411Data.andereSymptome.trim()}.`,
      id: 'f411-andere'
    });
  }

  return content;
}

/**
 * Constructs sentences for F41.1 symptoms (Generalisierte Angststörung) (OLD - kept for backward compatibility)
 * @deprecated Use constructF411Content instead for structured output
 */
export function constructF411SymptomsText(f411Data: F411Data): string {
  let symptomsText = '';

  // Handle selected F41.1 symptoms
  if (f411Data.symptoms && f411Data.symptoms.length > 0) {
    const symptomsString = f411Data.symptoms.join(', ');
    symptomsText += `Folgende F41.1 Symptome wurden festgestellt: ${symptomsString}.`;
  }

  // Handle additional symptoms
  if (f411Data.andereSymptome && f411Data.andereSymptome.trim()) {
    if (symptomsText) {
      symptomsText += ' ';
    }
    symptomsText += `Andere Symptome sind: ${f411Data.andereSymptome.trim()}.`;
  }

  return symptomsText;
}

// ============================================================
// SECTION A2 - VERHALTENSDEFIZITE (BEHAVIORAL DEFICITS)
// ============================================================

/**
 * Constructs structured content for A2 symptoms (Verhaltensdefizite) (NEW - with lists!)
 */
export function constructA2Content(a2Data: A2Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // Handle selected A2 symptoms as comma-separated text
  if (a2Data.symptoms && a2Data.symptoms.length > 0) {
    const symptomsText = a2Data.symptoms.join(', ');
    content.push({
      type: 'paragraph',
      text: `Folgende A2 Symptome wurden festgestellt: ${symptomsText}.`,
      id: 'a2'
    });
  }

  // Handle additional symptoms
  if (a2Data.andereSymptome && a2Data.andereSymptome.trim()) {
    content.push({
      type: 'paragraph',
      text: `Andere Symptome sind: ${a2Data.andereSymptome.trim()}.`,
      id: 'a2-andere'
    });
  }

  return content;
}

/**
 * Constructs sentences for A2 symptoms (Verhaltensdefizite) (OLD - kept for backward compatibility)
 * @deprecated Use constructA2Content instead for structured output
 */
export function constructA2SymptomsText(a2Data: A2Data): string {
  let symptomsText = '';

  // Handle selected A2 symptoms
  if (a2Data.symptoms && a2Data.symptoms.length > 0) {
    const symptomsString = a2Data.symptoms.join(', ');
    symptomsText += `Folgende Verhaltensdefizite wurden festgestellt: ${symptomsString}.`;
  }

  // Handle additional symptoms
  if (a2Data.andereSymptome && a2Data.andereSymptome.trim()) {
    if (symptomsText) {
      symptomsText += ' ';
    }
    symptomsText += `Andere Verhaltensdefizite sind: ${a2Data.andereSymptome.trim()}.`;
  }

  return symptomsText;
}

// ============================================================
// SECTION A3 - VERHALTENSEXZESSE (BEHAVIORAL EXCESSES)
// ============================================================

/**
 * Constructs structured content for A3 symptoms (Verhaltensexzesse) (NEW - with lists!)
 */
export function constructA3Content(a3Data: A3Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // Handle selected A3 symptoms as comma-separated text
  if (a3Data.symptoms && a3Data.symptoms.length > 0) {
    const symptomsText = a3Data.symptoms.join(', ');
    content.push({
      type: 'paragraph',
      text: `Folgende A3 Symptome wurden festgestellt: ${symptomsText}.`,
      id: 'a3'
    });
  }

  // Handle additional symptoms
  if (a3Data.andereSymptome && a3Data.andereSymptome.trim()) {
    content.push({
      type: 'paragraph',
      text: `Andere Symptome sind: ${a3Data.andereSymptome.trim()}.`,
      id: 'a3-andere'
    });
  }

  return content;
}

/**
 * Constructs sentences for A3 symptoms (Verhaltensexzesse) (OLD - kept for backward compatibility)
 * @deprecated Use constructA3Content instead for structured output
 */
export function constructA3SymptomsText(a3Data: A3Data): string {
  let symptomsText = '';

  // Handle selected A3 symptoms
  if (a3Data.symptoms && a3Data.symptoms.length > 0) {
    const symptomsString = a3Data.symptoms.join(', ');
    symptomsText += `Folgende Verhaltensexzesse wurden festgestellt: ${symptomsString}.`;
  }

  // Handle additional symptoms
  if (a3Data.andereSymptome && a3Data.andereSymptome.trim()) {
    if (symptomsText) {
      symptomsText += ' ';
    }
    symptomsText += `Andere Verhaltensexzesse sind: ${a3Data.andereSymptome.trim()}.`;
  }

  return symptomsText;
}

// ============================================================
// SECTION A4 - VERLAUF UND DAUER (COURSE AND DURATION)
// ============================================================

/**
 * Constructs structured content for A4 data (Verlauf und Dauer Symptomatik) (NEW - with lists!)
 */
export function constructA4Content(a4Data: A4Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // Handle seit wann
  if (a4Data.seitWann && a4Data.seitWann.length > 0) {
    const seitWannString = a4Data.seitWann.join(', ');
    content.push({
      type: 'paragraph',
      text: `Die Symptomatik besteht seit: ${seitWannString}.`,
      id: 'a4-seitwann'
    });
  }

  // Handle seit wann andere
  if (a4Data.seitWannAndere && a4Data.seitWannAndere.trim()) {
    content.push({
      type: 'paragraph',
      text: `Andere Zeiträume: ${a4Data.seitWannAndere.trim()}.`,
      id: 'a4-seitwann-andere'
    });
  }

  // Handle verstaerkung
  if (a4Data.verstaerkung && a4Data.verstaerkung.length > 0) {
    const verstaerkungString = a4Data.verstaerkung.join(', ');
    content.push({
      type: 'paragraph',
      text: `Die Symptomatik hat sich verstärkt: ${verstaerkungString}.`,
      id: 'a4-verstaerkung'
    });
  }

  // Handle verstaerkung andere
  if (a4Data.verstaerkungAndere && a4Data.verstaerkungAndere.trim()) {
    content.push({
      type: 'paragraph',
      text: `Andere Verstärkungszeiträume: ${a4Data.verstaerkungAndere.trim()}.`,
      id: 'a4-verstaerkung-andere'
    });
  }

  return content;
}

/**
 * Constructs sentences for A4 data (Verlauf und Dauer Symptomatik) (OLD - kept for backward compatibility)
 * @deprecated Use constructA4Content instead for structured output
 */
export function constructA4Text(a4Data: A4Data): string {
  let a4Text = '';

  // Handle seit wann
  if (a4Data.seitWann && a4Data.seitWann.length > 0) {
    const seitWannString = a4Data.seitWann.join(', ');
    a4Text += `Die Symptomatik besteht seit: ${seitWannString}.`;
  }

  // Handle seit wann andere
  if (a4Data.seitWannAndere && a4Data.seitWannAndere.trim()) {
    if (a4Text) {
      a4Text += ' ';
    }
    a4Text += `Andere Zeiträume: ${a4Data.seitWannAndere.trim()}.`;
  }

  // Handle verstaerkung
  if (a4Data.verstaerkung && a4Data.verstaerkung.length > 0) {
    if (a4Text) {
      a4Text += ' ';
    }
    const verstaerkungString = a4Data.verstaerkung.join(', ');
    a4Text += `Die Symptomatik hat sich verstärkt: ${verstaerkungString}.`;
  }

  // Handle verstaerkung andere
  if (a4Data.verstaerkungAndere && a4Data.verstaerkungAndere.trim()) {
    if (a4Text) {
      a4Text += ' ';
    }
    a4Text += `Andere Verstärkungszeiträume: ${a4Data.verstaerkungAndere.trim()}.`;
  }

  return a4Text;
}

// ============================================================
// SECTION A5 - STRESSFAKTOREN (STRESS FACTORS)
// ============================================================

/**
 * Constructs structured content for A5 data (Aktuelle Stressfaktoren) (NEW - with lists!)
 */
export function constructA5Content(a5Data: A5Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // Handle stressfaktoren as comma-separated text
  if (a5Data.stressfaktoren && a5Data.stressfaktoren.length > 0) {
    const stressfaktorenText = a5Data.stressfaktoren.join(', ');
    content.push({
      type: 'paragraph',
      text: `Folgende aktuelle Stressfaktoren/Auslöser wurden identifiziert: ${stressfaktorenText}.`,
      id: 'a5'
    });
  }

  // Handle andere stressfaktoren
  if (a5Data.andereStressfaktoren && a5Data.andereStressfaktoren.trim()) {
    content.push({
      type: 'paragraph',
      text: `Andere Stressfaktoren: ${a5Data.andereStressfaktoren.trim()}.`,
      id: 'a5-andere'
    });
  }

  return content;
}

/**
 * Constructs sentences for A5 data (Aktuelle Stressfaktoren) (OLD - kept for backward compatibility)
 * @deprecated Use constructA5Content instead for structured output
 */
export function constructA5Text(a5Data: A5Data): string {
  let a5Text = '';

  // Handle stressfaktoren
  if (a5Data.stressfaktoren && a5Data.stressfaktoren.length > 0) {
    const stressfaktorenString = a5Data.stressfaktoren.join(', ');
    a5Text += `Folgende aktuelle Stressfaktoren/Auslöser wurden identifiziert: ${stressfaktorenString}.`;
  }

  // Handle andere stressfaktoren
  if (a5Data.andereStressfaktoren && a5Data.andereStressfaktoren.trim()) {
    if (a5Text) {
      a5Text += ' ';
    }
    a5Text += `Andere Stressfaktoren: ${a5Data.andereStressfaktoren.trim()}.`;
  }

  return a5Text;
}

// ============================================================
// BEFUND SECTION B1 - ERSCHEINUNGSBILD (APPEARANCE)
// ============================================================

/**
 * Constructs structured content for B1 data (Erscheinungsbild) (NEW - with lists!)
 */
export function constructB1Content(b1Data: B1Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // Handle pflegezustand
  if (b1Data.pflegezustand && b1Data.pflegezustand.length > 0) {
    const items = b1Data.pflegezustand.join(', ');
    content.push({
      type: 'paragraph',
      text: `Pflegezustand: ${items}.`,
      id: 'b1-pflegezustand'
    });
  }

  // Handle koerpergeruch
  if (b1Data.koerpergeruch && b1Data.koerpergeruch.length > 0) {
    const items = b1Data.koerpergeruch.join(', ');
    content.push({
      type: 'paragraph',
      text: `Körpergeruch: ${items}.`,
      id: 'b1-koerpergeruch'
    });
  }

  // Handle kleidungsstil
  if (b1Data.kleidungsstil && b1Data.kleidungsstil.length > 0) {
    const items = b1Data.kleidungsstil.join(', ');
    content.push({
      type: 'paragraph',
      text: `Kleidungsstil: ${items}.`,
      id: 'b1-kleidungsstil'
    });
  }

  // Handle kleidungszustand
  if (b1Data.kleidungszustand && b1Data.kleidungszustand.length > 0) {
    const items = b1Data.kleidungszustand.join(', ');
    content.push({
      type: 'paragraph',
      text: `Kleidungszustand: ${items}.`,
      id: 'b1-kleidungszustand'
    });
  }

  return content;
}

/**
 * Constructs sentences for B1 data (Erscheinungsbild) (OLD - kept for backward compatibility)
 * @deprecated Use constructB1Content instead for structured output
 */
export function constructB1Text(b1Data: B1Data): string {
  let b1Text = '';

  // Handle pflegezustand
  if (b1Data.pflegezustand && b1Data.pflegezustand.length > 0) {
    const pflegezustandString = b1Data.pflegezustand.join(', ');
    b1Text += `Pflegezustand: ${pflegezustandString}.`;
  }

  // Handle koerpergeruch
  if (b1Data.koerpergeruch && b1Data.koerpergeruch.length > 0) {
    if (b1Text) {
      b1Text += ' ';
    }
    const koerpergeruchString = b1Data.koerpergeruch.join(', ');
    b1Text += `Körpergeruch: ${koerpergeruchString}.`;
  }

  // Handle kleidungsstil
  if (b1Data.kleidungsstil && b1Data.kleidungsstil.length > 0) {
    if (b1Text) {
      b1Text += ' ';
    }
    const kleidungsstilString = b1Data.kleidungsstil.join(', ');
    b1Text += `Kleidungsstil: ${kleidungsstilString}.`;
  }

  // Handle kleidungszustand
  if (b1Data.kleidungszustand && b1Data.kleidungszustand.length > 0) {
    if (b1Text) {
      b1Text += ' ';
    }
    const kleidungszustandString = b1Data.kleidungszustand.join(', ');
    b1Text += `Kleidungszustand: ${kleidungszustandString}.`;
  }

  return b1Text;
}

// ============================================================
// BEFUND SECTION B2 - KONTAKTVERHALTEN (CONTACT BEHAVIOR)
// ============================================================

/**
 * Constructs structured content for B2 data (Kontaktverhalten) (NEW - with lists!)
 */
export function constructB2Content(b2Data: B2Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (b2Data.kontaktverhalten && b2Data.kontaktverhalten.length > 0) {
    const items = b2Data.kontaktverhalten.join(', ');
    content.push({
      type: 'paragraph',
      text: `Kontaktverhalten: ${items}.`,
      id: 'b2-kontaktverhalten'
    });
  }

  return content;
}

/**
 * Constructs sentences for B2 data (Kontaktverhalten) (OLD - kept for backward compatibility)
 * @deprecated Use constructB2Content instead for structured output
 */
export function constructB2Text(b2Data: B2Data): string {
  let b2Text = '';

  // Handle ersterEindruck
  if (b2Data.ersterEindruck && b2Data.ersterEindruck.length > 0) {
    const ersterEindruckString = b2Data.ersterEindruck.join(', ');
    b2Text += `Erster Eindruck: ${ersterEindruckString}.`;
  }

  // Handle kontaktverhalten
  if (b2Data.kontaktverhalten && b2Data.kontaktverhalten.length > 0) {
    if (b2Text) {
      b2Text += ' ';
    }
    const kontaktverhaltenString = b2Data.kontaktverhalten.join(', ');
    b2Text += `Kontaktverhalten: ${kontaktverhaltenString}.`;
  }

  return b2Text;
}

// ============================================================
// BEFUND SECTION B3 - SPRACHE (SPEECH)
// ============================================================

/**
 * Constructs structured content for B3 data (Sprache) (NEW - with lists!)
 */
export function constructB3Content(b3Data: B3Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (b3Data.sprache && b3Data.sprache.length > 0) {
    const items = b3Data.sprache.join(', ');
    content.push({
      type: 'paragraph',
      text: `Sprache: ${items}.`,
      id: 'b3-sprache'
    });
  }

  return content;
}

/**
 * Constructs sentences for B3 data (Sprache) (OLD - kept for backward compatibility)
 * @deprecated Use constructB3Content instead for structured output
 */
export function constructB3Text(b3Data: B3Data): string {
  if (b3Data.sprache && b3Data.sprache.length > 0) {
    const spracheString = b3Data.sprache.join(', ');
    return `Sprache: ${spracheString}.`;
  }
  return '';
}

// ============================================================
// BEFUND SECTION B4 - BEWUSSTSEIN (CONSCIOUSNESS)
// ============================================================

/**
 * Constructs structured content for B4 data (Bewusstsein) (NEW - with lists!)
 */
export function constructB4Content(b4Data: B4Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (b4Data.quantitativesBewusstsein && b4Data.quantitativesBewusstsein.length > 0) {
    const items = b4Data.quantitativesBewusstsein.join(', ');
    content.push({
      type: 'paragraph',
      text: `Quantitatives Bewusstsein: ${items}.`,
      id: 'b4-quantitatives'
    });
  }

  if (b4Data.qualitativesBewusstsein && b4Data.qualitativesBewusstsein.length > 0) {
    const items = b4Data.qualitativesBewusstsein.join(', ');
    content.push({
      type: 'paragraph',
      text: `Qualitatives Bewusstsein: ${items}.`,
      id: 'b4-qualitatives'
    });
  }

  return content;
}

/**
 * Constructs sentences for B4 data (Bewusstsein) (OLD - kept for backward compatibility)
 * @deprecated Use constructB4Content instead for structured output
 */
export function constructB4Text(b4Data: B4Data): string {
  let b4Text = '';

  // Handle quantitativesBewusstsein
  if (b4Data.quantitativesBewusstsein && b4Data.quantitativesBewusstsein.length > 0) {
    const quantitativesBewusstseinString = b4Data.quantitativesBewusstsein.join(', ');
    b4Text += `Quantitatives Bewusstsein: ${quantitativesBewusstseinString}.`;
  }

  // Handle qualitativesBewusstsein
  if (b4Data.qualitativesBewusstsein && b4Data.qualitativesBewusstsein.length > 0) {
    if (b4Text) {
      b4Text += ' ';
    }
    const qualitativesBewusstseinString = b4Data.qualitativesBewusstsein.join(', ');
    b4Text += `Qualitatives Bewusstsein: ${qualitativesBewusstseinString}.`;
  }

  return b4Text;
}

// ============================================================
// BEFUND SECTION B5 - ORIENTIERUNG (ORIENTATION)
// ============================================================

/**
 * Constructs structured content for B5 data (Orientierung) (NEW - with lists!)
 */
export function constructB5Content(b5Data: B5Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (b5Data.orientierung && b5Data.orientierung.length > 0) {
    const items = b5Data.orientierung.join(', ');
    content.push({
      type: 'paragraph',
      text: `Orientierung: ${items}.`,
      id: 'b5-orientierung'
    });
  }

  return content;
}

/**
 * Constructs sentences for B5 data (Orientierung) (OLD - kept for backward compatibility)
 * @deprecated Use constructB5Content instead for structured output
 */
export function constructB5Text(b5Data: B5Data): string {
  if (b5Data.orientierung && b5Data.orientierung.length > 0) {
    const orientierungString = b5Data.orientierung.join(', ');
    return `Orientierung: ${orientierungString}.`;
  }
  return '';
}

// ============================================================
// BEFUND SECTION B6 - MNESTIK (MEMORY)
// ============================================================

/**
 * Constructs structured content for B6 data (Mnestik) (NEW - with lists!)
 */
export function constructB6Content(b6Data: B6Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (b6Data.mnestik && b6Data.mnestik.length > 0) {
    const items = b6Data.mnestik.join(', ');
    content.push({
      type: 'paragraph',
      text: `Mnestik: ${items}.`,
      id: 'b6-mnestik'
    });
  }

  return content;
}

/**
 * Constructs sentences for B6 data (Mnestik) (OLD - kept for backward compatibility)
 * @deprecated Use constructB6Content instead for structured output
 */
export function constructB6Text(b6Data: B6Data): string {
  if (b6Data.mnestik && b6Data.mnestik.length > 0) {
    const mnestikString = b6Data.mnestik.join(', ');
    return `Mnestik (Gedächtnis): ${mnestikString}.`;
  }
  return '';
}

// ============================================================
// BEFUND SECTION B7 - KONZENTRATION (CONCENTRATION)
// ============================================================

/**
 * Constructs structured content for B7 data (Konzentration und Auffassung) (NEW - with lists!)
 */
export function constructB7Content(b7Data: B7Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (b7Data.konzentration && b7Data.konzentration.length > 0) {
    const items = b7Data.konzentration.join(', ');
    content.push({
      type: 'paragraph',
      text: `Konzentration und Auffassung: ${items}.`,
      id: 'b7-konzentration'
    });
  }

  return content;
}

/**
 * Constructs sentences for B7 data (Konzentration und Auffassung) (OLD - kept for backward compatibility)
 * @deprecated Use constructB7Content instead for structured output
 */
export function constructB7Text(b7Data: B7Data): string {
  if (b7Data.konzentration && b7Data.konzentration.length > 0) {
    const konzentrationString = b7Data.konzentration.join(', ');
    return `Konzentration und Auffassung: ${konzentrationString}.`;
  }
  return '';
}

// ============================================================
// BEFUND SECTION B8 - FORMALES DENKEN (FORMAL THOUGHT)
// ============================================================

/**
 * Constructs structured content for B8 data (Formales Denken) (NEW - with lists!)
 */
export function constructB8Content(b8Data: B8Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (b8Data.denkstruktur && b8Data.denkstruktur.length > 0) {
    const items = b8Data.denkstruktur.join(', ');
    content.push({
      type: 'paragraph',
      text: `Denkstruktur: ${items}.`,
      id: 'b8-denkstruktur'
    });
  }

  if (b8Data.denkgeschwindigkeit && b8Data.denkgeschwindigkeit.length > 0) {
    const items = b8Data.denkgeschwindigkeit.join(', ');
    content.push({
      type: 'paragraph',
      text: `Denkgeschwindigkeit: ${items}.`,
      id: 'b8-denkgeschwindigkeit'
    });
  }

  return content;
}

/**
 * Constructs sentences for B8 data (Formales Denken) (OLD - kept for backward compatibility)
 * @deprecated Use constructB8Content instead for structured output
 */
export function constructB8Text(b8Data: B8Data): string {
  let b8Text = '';

  // Handle denkstruktur
  if (b8Data.denkstruktur && b8Data.denkstruktur.length > 0) {
    const denkstrukturString = b8Data.denkstruktur.join(', ');
    b8Text += `Denkstruktur: ${denkstrukturString}.`;
  }

  // Handle denkgeschwindigkeit
  if (b8Data.denkgeschwindigkeit && b8Data.denkgeschwindigkeit.length > 0) {
    if (b8Text) {
      b8Text += ' ';
    }
    const denkgeschwindigkeitString = b8Data.denkgeschwindigkeit.join(', ');
    b8Text += `Denkgeschwindigkeit: ${denkgeschwindigkeitString}.`;
  }

  return b8Text;
}

// ============================================================
// BEFUND SECTION B9 - WAHRNEHMUNG (PERCEPTION)
// ============================================================

/**
 * Constructs structured content for B9 data (Wahrnehmung) (NEW - with lists!)
 */
export function constructB9Content(b9Data: B9Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (b9Data.halluzinationen && b9Data.halluzinationen.length > 0) {
    const items = b9Data.halluzinationen.join(', ');
    content.push({
      type: 'paragraph',
      text: `Halluzinationen: ${items}.`,
      id: 'b9-halluzinationen'
    });
  }

  return content;
}

/**
 * Constructs sentences for B9 data (Wahrnehmung) (OLD - kept for backward compatibility)
 * @deprecated Use constructB9Content instead for structured output
 */
export function constructB9Text(b9Data: B9Data): string {
  if (b9Data.halluzinationen && b9Data.halluzinationen.length > 0) {
    const halluzinationenString = b9Data.halluzinationen.join(', ');
    return `Halluzinationen: ${halluzinationenString}.`;
  }
  return '';
}

// ============================================================
// BEFUND SECTION B10 - INHALTLICHES DENKEN (THOUGHT CONTENT)
// ============================================================

/**
 * Constructs structured content for B10 data (Inhaltliches Denken) (NEW - with lists!)
 */
export function constructB10Content(b10Data: B10Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (b10Data.inhaltlichesDenken && b10Data.inhaltlichesDenken.length > 0) {
    const items = b10Data.inhaltlichesDenken.join(', ');
    content.push({
      type: 'paragraph',
      text: `Inhaltliches Denken: ${items}.`,
      id: 'b10-inhaltliches-denken'
    });
  }

  return content;
}

/**
 * Constructs sentences for B10 data (Inhaltliches Denken) (OLD - kept for backward compatibility)
 * @deprecated Use constructB10Content instead for structured output
 */
export function constructB10Text(b10Data: B10Data): string {
  if (b10Data.inhaltlichesDenken && b10Data.inhaltlichesDenken.length > 0) {
    const inhaltlichesDenkenString = b10Data.inhaltlichesDenken.join(', ');
    return `Inhaltliches Denken: ${inhaltlichesDenkenString}.`;
  }
  return '';
}

// ============================================================
// BEFUND SECTION B11 - ICH-STÖRUNGEN (EGO DISTURBANCES)
// ============================================================

/**
 * Constructs structured content for B11 data (Ich-Störungen) (NEW - with lists!)
 */
export function constructB11Content(b11Data: B11Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (b11Data.keineIchStorungen && b11Data.keineIchStorungen.length > 0) {
    const items = b11Data.keineIchStorungen.join(', ');
    content.push({
      type: 'paragraph',
      text: `Keine Ich-Störungen: ${items}.`,
      id: 'b11-keine'
    });
  }

  if (b11Data.psychotischeIchStorungen && b11Data.psychotischeIchStorungen.length > 0) {
    const items = b11Data.psychotischeIchStorungen.join(', ');
    content.push({
      type: 'paragraph',
      text: `Psychotische Ich-Störungen: ${items}.`,
      id: 'b11-psychotische'
    });
  }

  if (b11Data.nichtPsychotischeIchStorungen && b11Data.nichtPsychotischeIchStorungen.length > 0) {
    const items = b11Data.nichtPsychotischeIchStorungen.join(', ');
    content.push({
      type: 'paragraph',
      text: `Nicht-psychotische Ich-Störungen: ${items}.`,
      id: 'b11-nicht-psychotische'
    });
  }

  return content;
}

/**
 * Constructs sentences for B11 data (Ich-Störungen) (OLD - kept for backward compatibility)
 * @deprecated Use constructB11Content instead for structured output
 */
export function constructB11Text(b11Data: B11Data): string {
  let b11Text = '';

  // Handle keineIchStorungen
  if (b11Data.keineIchStorungen && b11Data.keineIchStorungen.length > 0) {
    const keineIchStorungenString = b11Data.keineIchStorungen.join(', ');
    b11Text += `${keineIchStorungenString}.`;
  }

  // Handle psychotischeIchStorungen
  if (b11Data.psychotischeIchStorungen && b11Data.psychotischeIchStorungen.length > 0) {
    if (b11Text) {
      b11Text += ' ';
    }
    const psychotischeIchStorungenString = b11Data.psychotischeIchStorungen.join(', ');
    b11Text += `Psychotische Ich-Störungen: ${psychotischeIchStorungenString}.`;
  }

  // Handle nichtPsychotischeIchStorungen
  if (b11Data.nichtPsychotischeIchStorungen && b11Data.nichtPsychotischeIchStorungen.length > 0) {
    if (b11Text) {
      b11Text += ' ';
    }
    const nichtPsychotischeIchStorungenString = b11Data.nichtPsychotischeIchStorungen.join(', ');
    b11Text += `Nicht-psychotische Ich-Störungen: ${nichtPsychotischeIchStorungenString}.`;
  }

  return b11Text;
}

// ============================================================
// BEFUND SECTION B12 - ÄNGSTE (ANXIETIES)
// ============================================================

/**
 * Constructs structured content for B12 data (Ängste) (NEW - with lists!)
 */
export function constructB12Content(b12Data: B12Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (b12Data.artenVonAngsten && b12Data.artenVonAngsten.length > 0) {
    const items = b12Data.artenVonAngsten.join(', ');
    content.push({
      type: 'paragraph',
      text: `Arten von Ängsten: ${items}.`,
      id: 'b12-arten'
    });
  }

  if (b12Data.symptomeKompensation && b12Data.symptomeKompensation.length > 0) {
    const items = b12Data.symptomeKompensation.join(', ');
    content.push({
      type: 'paragraph',
      text: `Symptome und Kompensation: ${items}.`,
      id: 'b12-symptome'
    });
  }

  return content;
}

/**
 * Constructs sentences for B12 data (Ängste) (OLD - kept for backward compatibility)
 * @deprecated Use constructB12Content instead for structured output
 */
export function constructB12Text(b12Data: B12Data): string {
  let b12Text = '';

  // Handle artenVonAngsten
  if (b12Data.artenVonAngsten && b12Data.artenVonAngsten.length > 0) {
    const artenVonAngstenString = b12Data.artenVonAngsten.join(', ');
    b12Text += `Arten von Ängsten: ${artenVonAngstenString}.`;
  }

  // Handle symptomeKompensation
  if (b12Data.symptomeKompensation && b12Data.symptomeKompensation.length > 0) {
    if (b12Text) {
      b12Text += ' ';
    }
    const symptomeKompensationString = b12Data.symptomeKompensation.join(', ');
    b12Text += `Symptome & Kompensation: ${symptomeKompensationString}.`;
  }

  return b12Text;
}

// ============================================================
// BEFUND SECTION B13 - ZWÄNGE (COMPULSIONS)
// ============================================================

/**
 * Constructs structured content for B13 data (Zwänge) (NEW - with lists!)
 */
export function constructB13Content(b13Data: B13Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (b13Data.zwange && b13Data.zwange.length > 0) {
    const items = b13Data.zwange.join(', ');
    content.push({
      type: 'paragraph',
      text: `Zwänge: ${items}.`,
      id: 'b13-zwange'
    });
  }

  return content;
}

/**
 * Constructs sentences for B13 data (Zwänge) (OLD - kept for backward compatibility)
 * @deprecated Use constructB13Content instead for structured output
 */
export function constructB13Text(b13Data: B13Data): string {
  if (b13Data.zwange && b13Data.zwange.length > 0) {
    const zwangeString = b13Data.zwange.join(', ');
    return `Zwänge: ${zwangeString}.`;
  }
  return '';
}

// ============================================================
// BEFUND SECTION B14 - STIMMUNG UND AFFEKT (MOOD AND AFFECT)
// ============================================================

/**
 * Constructs structured content for B14 data (Stimmung und Affekt) (NEW - with lists!)
 */
export function constructB14Content(b14Data: B14Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (b14Data.stimmung && b14Data.stimmung.length > 0) {
    const items = b14Data.stimmung.join(', ');
    content.push({
      type: 'paragraph',
      text: `Stimmung: ${items}.`,
      id: 'b14-stimmung'
    });
  }

  if (b14Data.affekt && b14Data.affekt.length > 0) {
    const items = b14Data.affekt.join(', ');
    content.push({
      type: 'paragraph',
      text: `Affekt: ${items}.`,
      id: 'b14-affekt'
    });
  }

  return content;
}

/**
 * Constructs sentences for B14 data (Stimmung und Affekt) (OLD - kept for backward compatibility)
 * @deprecated Use constructB14Content instead for structured output
 */
export function constructB14Text(b14Data: B14Data): string {
  let b14Text = '';

  // Handle stimmung
  if (b14Data.stimmung && b14Data.stimmung.length > 0) {
    const stimmungString = b14Data.stimmung.join(', ');
    b14Text += `Stimmung: ${stimmungString}.`;
  }

  // Handle affekt
  if (b14Data.affekt && b14Data.affekt.length > 0) {
    if (b14Text) {
      b14Text += ' ';
    }
    const affektString = b14Data.affekt.join(', ');
    b14Text += `Affekt: ${affektString}.`;
  }

  return b14Text;
}

// ============================================================
// BEFUND SECTION B15 - ANTRIEB (DRIVE)
// ============================================================

/**
 * Constructs structured content for B15 data (Antrieb, Interesse und Freudeempfinden) (NEW - with lists!)
 */
export function constructB15Content(b15Data: B15Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (b15Data.antrieb && b15Data.antrieb.length > 0) {
    const items = b15Data.antrieb.join(', ');
    content.push({
      type: 'paragraph',
      text: `Antrieb, Interesse und Freudeempfinden: ${items}.`,
      id: 'b15-antrieb'
    });
  }

  return content;
}

/**
 * Constructs sentences for B15 data (Antrieb, Interesse und Freudeempfinden) (OLD - kept for backward compatibility)
 * @deprecated Use constructB15Content instead for structured output
 */
export function constructB15Text(b15Data: B15Data): string {
  if (b15Data.antrieb && b15Data.antrieb.length > 0) {
    const antriebString = b15Data.antrieb.join(', ');
    return `Antrieb, Interesse und Freudeempfinden: ${antriebString}.`;
  }
  return '';
}

// ============================================================
// BEFUND SECTION B16 - PSYCHOMOTORIK (PSYCHOMOTOR FUNCTION)
// ============================================================

/**
 * Constructs structured content for B16 data (Psychomotorik) (NEW - with lists!)
 */
export function constructB16Content(b16Data: B16Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (b16Data.psychomotorik && b16Data.psychomotorik.length > 0) {
    const items = b16Data.psychomotorik.join(', ');
    content.push({
      type: 'paragraph',
      text: `Psychomotorik: ${items}.`,
      id: 'b16-psychomotorik'
    });
  }

  return content;
}

/**
 * Constructs sentences for B16 data (Psychomotorik) (OLD - kept for backward compatibility)
 * @deprecated Use constructB16Content instead for structured output
 */
export function constructB16Text(b16Data: B16Data): string {
  if (b16Data.psychomotorik && b16Data.psychomotorik.length > 0) {
    const psychomotorikString = b16Data.psychomotorik.join(', ');
    return `Psychomotorik: ${psychomotorikString}.`;
  }
  return '';
}

// ============================================================
// BEFUND SECTION B17 - SUIZIDALITÄT (SUICIDALITY)
// ============================================================

/**
 * Constructs structured content for B17 data (Suizidalität) (NEW - with lists!)
 */
export function constructB17Content(b17Data: B17Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (b17Data.gradDerSuizidalitat && b17Data.gradDerSuizidalitat.length > 0) {
    const items = b17Data.gradDerSuizidalitat.join(', ');
    content.push({
      type: 'paragraph',
      text: `Grad der Suizidalität: ${items}.`,
      id: 'b17-grad'
    });
  }

  if (b17Data.paktAbspracheFahigkeit && b17Data.paktAbspracheFahigkeit.length > 0) {
    const items = b17Data.paktAbspracheFahigkeit.join(', ');
    content.push({
      type: 'paragraph',
      text: `Pakt/Absprachefähigkeit: ${items}.`,
      id: 'b17-pakt'
    });
  }

  if (b17Data.abklarungVonSuizidalitat && b17Data.abklarungVonSuizidalitat.length > 0) {
    const items = b17Data.abklarungVonSuizidalitat.join(', ');
    content.push({
      type: 'paragraph',
      text: `Abklärung von Suizidalität: ${items}.`,
      id: 'b17-abklarung'
    });
  }

  return content;
}

/**
 * Constructs sentences for B17 data (Suizidalität) (OLD - kept for backward compatibility)
 * @deprecated Use constructB17Content instead for structured output
 */
export function constructB17Text(b17Data: B17Data): string {
  let b17Text = '';

  // Handle gradDerSuizidalitat
  if (b17Data.gradDerSuizidalitat && b17Data.gradDerSuizidalitat.length > 0) {
    const gradDerSuizidalitatString = b17Data.gradDerSuizidalitat.join(', ');
    b17Text += `Grad der Suizidalität: ${gradDerSuizidalitatString}.`;
  }

  // Handle paktAbspracheFahigkeit
  if (b17Data.paktAbspracheFahigkeit && b17Data.paktAbspracheFahigkeit.length > 0) {
    if (b17Text) {
      b17Text += ' ';
    }
    const paktAbspracheFahigkeitString = b17Data.paktAbspracheFahigkeit.join(', ');
    b17Text += `Pakt- & Absprachefähigkeit: ${paktAbspracheFahigkeitString}.`;
  }

  // Handle abklarungVonSuizidalitat
  if (b17Data.abklarungVonSuizidalitat && b17Data.abklarungVonSuizidalitat.length > 0) {
    if (b17Text) {
      b17Text += ' ';
    }
    const abklarungVonSuizidalitatString = b17Data.abklarungVonSuizidalitat.join(', ');
    b17Text += `Abklärung von Suizidalität: ${abklarungVonSuizidalitatString}.`;
  }

  return b17Text;
}

// ============================================================
// BEFUND SECTION B18 - KRANKHEITSEINSTELLUNG (ILLNESS ATTITUDE)
// ============================================================

/**
 * Constructs structured content for B18 data (Krankheitseinstellung) (NEW - with lists!)
 */
export function constructB18Content(b18Data: B18Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (b18Data.krankheitseinsicht && b18Data.krankheitseinsicht.length > 0) {
    const items = b18Data.krankheitseinsicht.join(', ');
    content.push({
      type: 'paragraph',
      text: `Krankheitseinsicht: ${items}.`,
      id: 'b18-krankheitseinsicht'
    });
  }

  if (b18Data.behandlungsbereitschaft && b18Data.behandlungsbereitschaft.length > 0) {
    const items = b18Data.behandlungsbereitschaft.join(', ');
    content.push({
      type: 'paragraph',
      text: `Behandlungsbereitschaft: ${items}.`,
      id: 'b18-behandlungsbereitschaft'
    });
  }

  return content;
}

/**
 * Constructs sentences for B18 data (Krankheitseinstellung) (OLD - kept for backward compatibility)
 * @deprecated Use constructB18Content instead for structured output
 */
export function constructB18Text(b18Data: B18Data): string {
  let b18Text = '';

  // Handle krankheitseinsicht
  if (b18Data.krankheitseinsicht && b18Data.krankheitseinsicht.length > 0) {
    const krankheitseinsichtString = b18Data.krankheitseinsicht.join(', ');
    b18Text += `Krankheitseinsicht: ${krankheitseinsichtString}.`;
  }

  // Handle behandlungsbereitschaft
  if (b18Data.behandlungsbereitschaft && b18Data.behandlungsbereitschaft.length > 0) {
    if (b18Text) {
      b18Text += ' ';
    }
    const behandlungsbereitschaftString = b18Data.behandlungsbereitschaft.join(', ');
    b18Text += `Behandlungsbereitschaft: ${behandlungsbereitschaftString}.`;
  }

  return b18Text;
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
// KAPITEL 3 - SOMATISCHER BEFUND - SOMATO1
// ============================================================

/**
 * Constructs structured content for Somato1 data (Somatische Vorerkrankungen) (NEW)
 */
export function constructSomato1Content(somato1Data: Somato1Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (!somato1Data.somatischeVorerkrankungen) {
    return content;
  }

  // Find the label for the selected ID
  const selectedOption = FormConfig.FORM_OPTIONS.somatischeVorerkrankungen.find(
    option => option.id === somato1Data.somatischeVorerkrankungen
  );

  if (!selectedOption) {
    return content;
  }

  content.push({
    type: 'paragraph',
    text: `Somatische Vorerkrankungen: ${selectedOption.label}.`,
    id: 'somato1-vorerkrankungen'
  });

  return content;
}

/**
 * Constructs sentences for Somato1 data (Somatische Vorerkrankungen) (OLD - kept for backward compatibility)
 * @deprecated Use constructSomato1Content instead for structured output
 */
export function constructSomato1Text(somato1Data: Somato1Data): string {
  if (!somato1Data.somatischeVorerkrankungen) {
    return '';
  }

  // Find the label for the selected ID
  const selectedOption = FormConfig.FORM_OPTIONS.somatischeVorerkrankungen.find(
    option => option.id === somato1Data.somatischeVorerkrankungen
  );

  if (!selectedOption) {
    return '';
  }

  return `Somatische Vorerkrankungen: ${selectedOption.label}.`;
}

// ============================================================
// KAPITEL 3 - SOMATISCHER BEFUND - SOMATO2
// ============================================================

/**
 * Constructs structured content for Somato2 data (Psychopharmakologische Medikation) (NEW)
 */
export function constructSomato2Content(somato2Data: Somato2Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // If keine Medikation is checked, return that
  if (somato2Data.keineMedikation) {
    content.push({
      type: 'paragraph',
      text: 'Psychopharmakologische Medikation: Keine psychopharmakologische Medikation.',
      id: 'somato2-keine'
    });
    return content;
  }

  // Otherwise, construct detailed medication text
  const parts: string[] = [];

  if (somato2Data.praeparat) {
    parts.push(`Präparat: ${somato2Data.praeparat}`);
  }

  if (somato2Data.dosierung) {
    parts.push(`Dosierung: ${somato2Data.dosierung} mg`);
  }

  if (somato2Data.dauerEinheit && somato2Data.dauerWert) {
    const einheitOption = FormConfig.FORM_OPTIONS.dauerEinheit.find(
      opt => opt.id === somato2Data.dauerEinheit
    );
    if (einheitOption) {
      const einheit = einheitOption.id === 'dauer_wochen' ? 'Wochen' : 'Monaten';
      parts.push(`Dauer: seit ${somato2Data.dauerWert} ${einheit}`);
    }
  }

  if (somato2Data.verschriebenVon) {
    const verschrOption = FormConfig.FORM_OPTIONS.verschriebenVon.find(
      opt => opt.id === somato2Data.verschriebenVon
    );
    if (verschrOption) {
      if (somato2Data.verschriebenVon === 'verschr_andere' && somato2Data.verschriebenVonAndere) {
        parts.push(`Verschrieben von: ${somato2Data.verschriebenVonAndere}`);
      } else {
        parts.push(`Verschrieben von: ${verschrOption.label}`);
      }
    }
  }

  if (parts.length === 0) {
    return content;
  }

  content.push({
    type: 'paragraph',
    text: `Psychopharmakologische Medikation: ${parts.join(', ')}.`,
    id: 'somato2-medikation'
  });

  return content;
}

/**
 * Constructs sentences for Somato2 data (Psychopharmakologische Medikation) (OLD - kept for backward compatibility)
 * @deprecated Use constructSomato2Content instead for structured output
 */
export function constructSomato2Text(somato2Data: Somato2Data): string {
  // If keine Medikation is checked, return that
  if (somato2Data.keineMedikation) {
    return 'Psychopharmakologische Medikation: Keine psychopharmakologische Medikation.';
  }

  // Otherwise, construct detailed medication text
  const parts: string[] = [];

  if (somato2Data.praeparat) {
    parts.push(`Präparat: ${somato2Data.praeparat}`);
  }

  if (somato2Data.dosierung) {
    parts.push(`Dosierung: ${somato2Data.dosierung} mg`);
  }

  if (somato2Data.dauerEinheit && somato2Data.dauerWert) {
    const einheitOption = FormConfig.FORM_OPTIONS.dauerEinheit.find(
      opt => opt.id === somato2Data.dauerEinheit
    );
    if (einheitOption) {
      const einheit = einheitOption.id === 'dauer_wochen' ? 'Wochen' : 'Monaten';
      parts.push(`Dauer: seit ${somato2Data.dauerWert} ${einheit}`);
    }
  }

  if (somato2Data.verschriebenVon) {
    const verschrOption = FormConfig.FORM_OPTIONS.verschriebenVon.find(
      opt => opt.id === somato2Data.verschriebenVon
    );
    if (verschrOption) {
      if (somato2Data.verschriebenVon === 'verschr_andere' && somato2Data.verschriebenVonAndere) {
        parts.push(`Verschrieben von: ${somato2Data.verschriebenVonAndere}`);
      } else {
        parts.push(`Verschrieben von: ${verschrOption.label}`);
      }
    }
  }

  if (parts.length === 0) {
    return '';
  }

  return `Psychopharmakologische Medikation: ${parts.join(', ')}.`;
}

// ============================================================
// KAPITEL 3 - SOMATISCHER BEFUND - SOMATO3
// ============================================================

/**
 * Constructs structured content for Somato3 data (Psychotherapeutische/psychosomatische/psychiatrische Vorbehandlungen) (NEW)
 */
export function constructSomato3Content(somato3Data: Somato3Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // If keine Vorbehandlung is checked, return that
  if (somato3Data.keineVorbehandlung) {
    content.push({
      type: 'paragraph',
      text: 'Psychotherapeutische/psychosomatische/psychiatrische Vorbehandlungen: Keine vorherigen psychotherapeutischen/psychosomatischen/psychiatrischen Vorbehandlung.',
      id: 'somato3-keine'
    });
    return content;
  }

  // Otherwise, construct detailed Vorbehandlung text
  const parts: string[] = [];

  if (somato3Data.settingVorbehandlung) {
    const settingOption = FormConfig.FORM_OPTIONS.settingVorbehandlung.find(
      opt => opt.id === somato3Data.settingVorbehandlung
    );
    if (settingOption) {
      parts.push(`Setting: ${settingOption.label}`);
    }
  }

  if (somato3Data.behandlungszeitraumEinheit && somato3Data.behandlungszeitraumWert) {
    const einheitOption = FormConfig.FORM_OPTIONS.behandlungszeitraumEinheit.find(
      opt => opt.id === somato3Data.behandlungszeitraumEinheit
    );
    if (einheitOption) {
      const einheit = einheitOption.id === 'zeitraum_wochen' ? 'Wochen' : 'Monaten';
      parts.push(`Behandlungszeitraum: ${somato3Data.behandlungszeitraumWert} ${einheit}`);
    }
  }

  if (somato3Data.behandlungsort) {
    parts.push(`Behandlungsort: ${somato3Data.behandlungsort}`);
  }

  if (somato3Data.abschlussberichte) {
    const abschlussOption = FormConfig.FORM_OPTIONS.abschlussberichte.find(
      opt => opt.id === somato3Data.abschlussberichte
    );
    if (abschlussOption) {
      if (somato3Data.abschlussberichte === 'abschluss_andere' && somato3Data.abschlussberichteAndere) {
        parts.push(`Abschlussberichte: ${somato3Data.abschlussberichteAndere}`);
      } else {
        parts.push(`Abschlussberichte: ${abschlussOption.label}`);
      }
    }
  }

  if (parts.length === 0) {
    return content;
  }

  content.push({
    type: 'paragraph',
    text: `Psychotherapeutische/psychosomatische/psychiatrische Vorbehandlungen: ${parts.join(', ')}.`,
    id: 'somato3-vorbehandlung'
  });

  return content;
}

/**
 * Constructs sentences for Somato3 data (Psychotherapeutische/psychosomatische/psychiatrische Vorbehandlungen) (OLD - kept for backward compatibility)
 * @deprecated Use constructSomato3Content instead for structured output
 */
export function constructSomato3Text(somato3Data: Somato3Data): string {
  // If keine Vorbehandlung is checked, return that
  if (somato3Data.keineVorbehandlung) {
    return 'Psychotherapeutische/psychosomatische/psychiatrische Vorbehandlungen: Keine vorherigen psychotherapeutischen/psychosomatischen/psychiatrischen Vorbehandlung.';
  }

  // Otherwise, construct detailed Vorbehandlung text
  const parts: string[] = [];

  if (somato3Data.settingVorbehandlung) {
    const settingOption = FormConfig.FORM_OPTIONS.settingVorbehandlung.find(
      opt => opt.id === somato3Data.settingVorbehandlung
    );
    if (settingOption) {
      parts.push(`Setting: ${settingOption.label}`);
    }
  }

  if (somato3Data.behandlungszeitraumEinheit && somato3Data.behandlungszeitraumWert) {
    const einheitOption = FormConfig.FORM_OPTIONS.behandlungszeitraumEinheit.find(
      opt => opt.id === somato3Data.behandlungszeitraumEinheit
    );
    if (einheitOption) {
      const einheit = einheitOption.id === 'zeitraum_wochen' ? 'Wochen' : 'Monaten';
      parts.push(`Behandlungszeitraum: ${somato3Data.behandlungszeitraumWert} ${einheit}`);
    }
  }

  if (somato3Data.behandlungsort) {
    parts.push(`Behandlungsort: ${somato3Data.behandlungsort}`);
  }

  if (somato3Data.abschlussberichte) {
    const abschlussOption = FormConfig.FORM_OPTIONS.abschlussberichte.find(
      opt => opt.id === somato3Data.abschlussberichte
    );
    if (abschlussOption) {
      if (somato3Data.abschlussberichte === 'abschluss_andere' && somato3Data.abschlussberichteAndere) {
        parts.push(`Abschlussberichte: ${somato3Data.abschlussberichteAndere}`);
      } else {
        parts.push(`Abschlussberichte: ${abschlussOption.label}`);
      }
    }
  }

  if (parts.length === 0) {
    return '';
  }

  return `Psychotherapeutische/psychosomatische/psychiatrische Vorbehandlungen: ${parts.join(', ')}.`;
}

// ============================================================
// KAPITEL 3 - SOMATISCHER BEFUND - SOMATO4
// ============================================================

/**
 * Constructs structured content for Somato4 data (Familienanamnese) (NEW)
 */
export function constructSomato4Content(somato4Data: Somato4Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  if (!somato4Data.familienanamnese) {
    return content;
  }

  // Find the label for the selected ID
  const selectedOption = FormConfig.FORM_OPTIONS.familienanamnese.find(
    option => option.id === somato4Data.familienanamnese
  );

  if (!selectedOption) {
    return content;
  }

  // If "Unauffällig" is selected
  if (somato4Data.familienanamnese === 'familie_unauffaellig') {
    content.push({
      type: 'paragraph',
      text: 'Familienanamnese: Unauffällig.',
      id: 'somato4-unauffaellig'
    });
    return content;
  }

  // If "Familiäre Häufung" is selected
  if (somato4Data.familienanamnese === 'familie_haeufung') {
    if (somato4Data.familiaeHaeufungText) {
      content.push({
        type: 'paragraph',
        text: `Familienanamnese: Familiäre Häufung psychischer Erkrankungen (${somato4Data.familiaeHaeufungText}).`,
        id: 'somato4-haeufung'
      });
    } else {
      content.push({
        type: 'paragraph',
        text: 'Familienanamnese: Familiäre Häufung psychischer Erkrankungen.',
        id: 'somato4-haeufung'
      });
    }
    return content;
  }

  content.push({
    type: 'paragraph',
    text: `Familienanamnese: ${selectedOption.label}.`,
    id: 'somato4-familienanamnese'
  });

  return content;
}

/**
 * Constructs text for Somato4 data (Familienanamnese) (OLD - kept for backward compatibility)
 * @deprecated Use constructSomato4Content instead for structured output
 */
export function constructSomato4Text(somato4Data: Somato4Data): string {
  if (!somato4Data.familienanamnese) {
    return '';
  }

  // Find the label for the selected ID
  const selectedOption = FormConfig.FORM_OPTIONS.familienanamnese.find(
    option => option.id === somato4Data.familienanamnese
  );

  if (!selectedOption) {
    return '';
  }

  // If "Unauffällig" is selected
  if (somato4Data.familienanamnese === 'familie_unauffaellig') {
    return 'Familienanamnese: Unauffällig.';
  }

  // If "Familiäre Häufung" is selected
  if (somato4Data.familienanamnese === 'familie_haeufung') {
    if (somato4Data.familiaeHaeufungText) {
      return `Familienanamnese: Familiäre Häufung psychischer Erkrankungen (${somato4Data.familiaeHaeufungText}).`;
    }
    return 'Familienanamnese: Familiäre Häufung psychischer Erkrankungen.';
  }

  return `Familienanamnese: ${selectedOption.label}.`;
}

// ============================================================
// KAPITEL 3 - SOMATISCHER BEFUND - SOMATO5
// ============================================================

/**
 * Constructs structured content for Somato5 data (Suchtanamnese) (NEW)
 */
export function constructSomato5Content(somato5Data: Somato5Data): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // If keineSucht is checked, return that
  if (somato5Data.keineSucht) {
    content.push({
      type: 'paragraph',
      text: 'Suchtanamnese: Kein Hinweis auf Sucht oder schädlichen Gebrauch einer Substanz.',
      id: 'somato5-keine'
    });
    return content;
  }

  const parts: string[] = [];

  // Alkohol
  if (somato5Data.alkoholSuchtmittel.length > 0) {
    const alkoholDetails: string[] = [];

    // Bier
    if (somato5Data.alkoholSuchtmittel.includes('alkohol_bier')) {
      const bierParts: string[] = ['Bier'];
      if (somato5Data.bierMengeLiter) {
        bierParts.push(`${somato5Data.bierMengeLiter} Liter`);
      }
      if (somato5Data.bierMengeGlaeser) {
        bierParts.push(`${somato5Data.bierMengeGlaeser} Gläser`);
      }
      if (bierParts.length > 1) {
        alkoholDetails.push(bierParts.join(': '));
      } else {
        alkoholDetails.push('Bier');
      }
    }

    // Wein
    if (somato5Data.alkoholSuchtmittel.includes('alkohol_wein')) {
      const weinParts: string[] = ['Wein'];
      if (somato5Data.weinMengeLiter) {
        weinParts.push(`${somato5Data.weinMengeLiter} Liter`);
      }
      if (somato5Data.weinMengeGlaeser) {
        weinParts.push(`${somato5Data.weinMengeGlaeser} Gläser`);
      }
      if (weinParts.length > 1) {
        alkoholDetails.push(weinParts.join(': '));
      } else {
        alkoholDetails.push('Wein');
      }
    }

    // Schnaps
    if (somato5Data.alkoholSuchtmittel.includes('alkohol_schnaps')) {
      const schnapsParts: string[] = ['Schnaps'];
      if (somato5Data.schnapsMengeLiter) {
        schnapsParts.push(`${somato5Data.schnapsMengeLiter} Liter`);
      }
      if (somato5Data.schnapsMengeGlaeser) {
        schnapsParts.push(`${somato5Data.schnapsMengeGlaeser} Gläser`);
      }
      if (schnapsParts.length > 1) {
        alkoholDetails.push(schnapsParts.join(': '));
      } else {
        alkoholDetails.push('Schnaps');
      }
    }

    // Häufigkeit
    let haeufigkeitText = '';
    if (somato5Data.alkoholHaeufigkeit) {
      const haeufigkeitOption = FormConfig.FORM_OPTIONS.konsumHaeufigkeit.find(
        opt => opt.id === somato5Data.alkoholHaeufigkeit
      );
      if (haeufigkeitOption) {
        haeufigkeitText = haeufigkeitOption.label.toLowerCase();
      }
    }

    if (alkoholDetails.length > 0) {
      const alkoholText = haeufigkeitText
        ? `Alkohol (${alkoholDetails.join(', ')}), ${haeufigkeitText}`
        : `Alkohol (${alkoholDetails.join(', ')})`;
      parts.push(alkoholText);
    }
  }

  // Rauchen
  const rauchenParts: string[] = [];
  if (somato5Data.rauchenAnzahl) {
    rauchenParts.push(`${somato5Data.rauchenAnzahl} Zigaretten`);
  }
  if (somato5Data.rauchenHaeufigkeit) {
    const haeufigkeitOption = FormConfig.FORM_OPTIONS.konsumHaeufigkeit.find(
      opt => opt.id === somato5Data.rauchenHaeufigkeit
    );
    if (haeufigkeitOption) {
      rauchenParts.push(haeufigkeitOption.label.toLowerCase());
    }
  }

  if (rauchenParts.length > 0) {
    parts.push(`Rauchen (Tabak): ${rauchenParts.join(', ')}`);
  }

  // THC
  const thcParts: string[] = [];
  if (somato5Data.thcMenge) {
    thcParts.push(`${somato5Data.thcMenge}g`);
  }
  if (somato5Data.thcHaeufigkeit) {
    const haeufigkeitOption = FormConfig.FORM_OPTIONS.konsumHaeufigkeit.find(
      opt => opt.id === somato5Data.thcHaeufigkeit
    );
    if (haeufigkeitOption) {
      thcParts.push(haeufigkeitOption.label.toLowerCase());
    }
  }

  if (thcParts.length > 0) {
    parts.push(`THC-Konsum: ${thcParts.join(', ')}`);
  }

  // Illegale Drogen
  if (somato5Data.illegaleDrogen && somato5Data.illegaleDrogen.length > 0) {
    const drogen = somato5Data.illegaleDrogen.map(droge => {
      const drogeParts: string[] = [];

      if (droge.suchtmittel) {
        drogeParts.push(droge.suchtmittel);
      }

      if (droge.menge && droge.mengeEinheit) {
        const einheitOption = FormConfig.FORM_OPTIONS.mengeEinheit.find(
          opt => opt.id === droge.mengeEinheit
        );
        if (einheitOption) {
          drogeParts.push(`${droge.menge}${einheitOption.label}`);
        }
      }

      if (droge.haeufigkeit) {
        const haeufigkeitOption = FormConfig.FORM_OPTIONS.konsumHaeufigkeit.find(
          opt => opt.id === droge.haeufigkeit
        );
        if (haeufigkeitOption) {
          drogeParts.push(haeufigkeitOption.label.toLowerCase());
        }
      }

      return drogeParts.join(', ');
    }).filter(text => text.length > 0);

    if (drogen.length > 0) {
      parts.push(`Illegale Drogen: ${drogen.join('; ')}`);
    }
  }

  // Andere Suchtform
  if (somato5Data.andereSuchtform) {
    parts.push(`Andere Suchtform: ${somato5Data.andereSuchtform}`);
  }

  if (parts.length === 0) {
    return content;
  }

  content.push({
    type: 'paragraph',
    text: `Suchtanamnese: ${parts.join('; ')}.`,
    id: 'somato5-suchtanamnese'
  });

  return content;
}

/**
 * Constructs text for Somato5 data (Suchtanamnese) (OLD - kept for backward compatibility)
 * @deprecated Use constructSomato5Content instead for structured output
 */
export function constructSomato5Text(somato5Data: Somato5Data): string {
  // If keineSucht is checked, return that
  if (somato5Data.keineSucht) {
    return 'Suchtanamnese: Kein Hinweis auf Sucht oder schädlichen Gebrauch einer Substanz.';
  }

  const parts: string[] = [];

  // Alkohol
  if (somato5Data.alkoholSuchtmittel.length > 0) {
    const alkoholDetails: string[] = [];

    // Bier
    if (somato5Data.alkoholSuchtmittel.includes('alkohol_bier')) {
      const bierParts: string[] = ['Bier'];
      if (somato5Data.bierMengeLiter) {
        bierParts.push(`${somato5Data.bierMengeLiter} Liter`);
      }
      if (somato5Data.bierMengeGlaeser) {
        bierParts.push(`${somato5Data.bierMengeGlaeser} Gläser`);
      }
      if (bierParts.length > 1) {
        alkoholDetails.push(bierParts.join(': '));
      } else {
        alkoholDetails.push('Bier');
      }
    }

    // Wein
    if (somato5Data.alkoholSuchtmittel.includes('alkohol_wein')) {
      const weinParts: string[] = ['Wein'];
      if (somato5Data.weinMengeLiter) {
        weinParts.push(`${somato5Data.weinMengeLiter} Liter`);
      }
      if (somato5Data.weinMengeGlaeser) {
        weinParts.push(`${somato5Data.weinMengeGlaeser} Gläser`);
      }
      if (weinParts.length > 1) {
        alkoholDetails.push(weinParts.join(': '));
      } else {
        alkoholDetails.push('Wein');
      }
    }

    // Schnaps
    if (somato5Data.alkoholSuchtmittel.includes('alkohol_schnaps')) {
      const schnapsParts: string[] = ['Schnaps'];
      if (somato5Data.schnapsMengeLiter) {
        schnapsParts.push(`${somato5Data.schnapsMengeLiter} Liter`);
      }
      if (somato5Data.schnapsMengeGlaeser) {
        schnapsParts.push(`${somato5Data.schnapsMengeGlaeser} Gläser`);
      }
      if (schnapsParts.length > 1) {
        alkoholDetails.push(schnapsParts.join(': '));
      } else {
        alkoholDetails.push('Schnaps');
      }
    }

    // Häufigkeit
    let haeufigkeitText = '';
    if (somato5Data.alkoholHaeufigkeit) {
      const haeufigkeitOption = FormConfig.FORM_OPTIONS.konsumHaeufigkeit.find(
        opt => opt.id === somato5Data.alkoholHaeufigkeit
      );
      if (haeufigkeitOption) {
        haeufigkeitText = haeufigkeitOption.label.toLowerCase();
      }
    }

    if (alkoholDetails.length > 0) {
      const alkoholText = haeufigkeitText
        ? `Alkohol (${alkoholDetails.join(', ')}), ${haeufigkeitText}`
        : `Alkohol (${alkoholDetails.join(', ')})`;
      parts.push(alkoholText);
    }
  }

  // Rauchen
  const rauchenParts: string[] = [];
  if (somato5Data.rauchenAnzahl) {
    rauchenParts.push(`${somato5Data.rauchenAnzahl} Zigaretten`);
  }
  if (somato5Data.rauchenHaeufigkeit) {
    const haeufigkeitOption = FormConfig.FORM_OPTIONS.konsumHaeufigkeit.find(
      opt => opt.id === somato5Data.rauchenHaeufigkeit
    );
    if (haeufigkeitOption) {
      rauchenParts.push(haeufigkeitOption.label.toLowerCase());
    }
  }

  if (rauchenParts.length > 0) {
    parts.push(`Rauchen (Tabak): ${rauchenParts.join(', ')}`);
  }

  // THC
  const thcParts: string[] = [];
  if (somato5Data.thcMenge) {
    thcParts.push(`${somato5Data.thcMenge}g`);
  }
  if (somato5Data.thcHaeufigkeit) {
    const haeufigkeitOption = FormConfig.FORM_OPTIONS.konsumHaeufigkeit.find(
      opt => opt.id === somato5Data.thcHaeufigkeit
    );
    if (haeufigkeitOption) {
      thcParts.push(haeufigkeitOption.label.toLowerCase());
    }
  }

  if (thcParts.length > 0) {
    parts.push(`THC-Konsum: ${thcParts.join(', ')}`);
  }

  // Illegale Drogen
  if (somato5Data.illegaleDrogen && somato5Data.illegaleDrogen.length > 0) {
    const drogen = somato5Data.illegaleDrogen.map(droge => {
      const drogeParts: string[] = [];

      if (droge.suchtmittel) {
        drogeParts.push(droge.suchtmittel);
      }

      if (droge.menge && droge.mengeEinheit) {
        const einheitOption = FormConfig.FORM_OPTIONS.mengeEinheit.find(
          opt => opt.id === droge.mengeEinheit
        );
        if (einheitOption) {
          drogeParts.push(`${droge.menge}${einheitOption.label}`);
        }
      }

      if (droge.haeufigkeit) {
        const haeufigkeitOption = FormConfig.FORM_OPTIONS.konsumHaeufigkeit.find(
          opt => opt.id === droge.haeufigkeit
        );
        if (haeufigkeitOption) {
          drogeParts.push(haeufigkeitOption.label.toLowerCase());
        }
      }

      return drogeParts.join(', ');
    }).filter(text => text.length > 0);

    if (drogen.length > 0) {
      parts.push(`Illegale Drogen: ${drogen.join('; ')}`);
    }
  }

  // Andere Suchtform
  if (somato5Data.andereSuchtform) {
    parts.push(`Andere Suchtform: ${somato5Data.andereSuchtform}`);
  }

  if (parts.length === 0) {
    return '';
  }

  return `Suchtanamnese: ${parts.join('; ')}.`;
}

// ============================================================
// KAPITEL 4 - RELEVANTE ANGABEN ZUR LEBENSGESCHICHTE
// ============================================================

/**
 * Constructs structured content for LebensgA data (NEW)
 */
export function constructLebensgAContent(lebensgAData: LebensgAData): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // A1: Kurze biographische Einordnung
  if (lebensgAData.a1BiographischeEinordnung) {
    content.push({
      type: 'paragraph',
      text: `Biographische Einordnung: ${lebensgAData.a1BiographischeEinordnung}`,
      id: 'lebensg-a1'
    });
  }

  // A2: Entwicklung
  if (lebensgAData.a2Entwicklung) {
    content.push({
      type: 'paragraph',
      text: `Entwicklung: ${lebensgAData.a2Entwicklung}`,
      id: 'lebensg-a2'
    });
  }

  return content;
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

/**
 * Constructs structured content for LebensgB data (NEW)
 */
export function constructLebensgBContent(lebensgBData: LebensgBData): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // B1: In welcher Situation kommt der Patient in Psychotherapie?
  if (lebensgBData.b1SituationPsychotherapie) {
    content.push({
      type: 'paragraph',
      text: `Situation bei Therapiebeginn: ${lebensgBData.b1SituationPsychotherapie}`,
      id: 'lebensg-b1'
    });
  }

  // B2: Beginn, Dauer und Verlauf der Symptomatik
  if (lebensgBData.b2BeginnDauerVerlauf) {
    content.push({
      type: 'paragraph',
      text: `Beginn, Dauer und Verlauf: ${lebensgBData.b2BeginnDauerVerlauf}`,
      id: 'lebensg-b2'
    });
  }

  // B3: Auslösende Faktoren
  if (lebensgBData.b3AusloesendeFaktoren) {
    content.push({
      type: 'paragraph',
      text: lebensgBData.b3AusloesendeFaktoren,
      id: 'lebensg-b3'
    });
  }

  return content;
}

/**
 * Constructs text for LebensgB data (OLD - kept for backward compatibility)
 * @deprecated Use constructLebensgBContent instead for structured output
 */
export function constructLebensgBText(lebensgBData: LebensgBData): string {
  const parts: string[] = [];

  // B1: In welcher Situation kommt der Patient in Psychotherapie?
  if (lebensgBData.b1SituationPsychotherapie) {
    parts.push(`Situation bei Therapiebeginn: ${lebensgBData.b1SituationPsychotherapie}`);
  }

  // B2: Beginn, Dauer und Verlauf der Symptomatik
  if (lebensgBData.b2BeginnDauerVerlauf) {
    parts.push(`Beginn, Dauer und Verlauf: ${lebensgBData.b2BeginnDauerVerlauf}`);
  }

  // B3: Auslösende Faktoren
  if (lebensgBData.b3AusloesendeFaktoren) {
    parts.push(`${lebensgBData.b3AusloesendeFaktoren}`);
  }

  if (parts.length === 0) {
    return '';
  }

  return parts.join('\n\n');
}

/**
 * Constructs structured content for LebensgC data (NEW - Clean JSON, no \n in text)
 */
export function constructLebensgCContent(lebensgCData: LebensgCData): ParagraphNode[] {
  const content: ParagraphNode[] = [];

  // C1: Funktionales Bedingungsmodell
  let hasC1Content = false;

  // C1 Header
  content.push({
    type: 'paragraph',
    text: 'C1: Mikroanalyse – Vertikale Verhaltensanalyse (SORKC nach Kanfer)',
    id: 'lebensg-c1-header'
  });

  // 1. Situation
  if (lebensgCData.c1SituationExtern || lebensgCData.c1SituationIntern) {
    hasC1Content = true;
    content.push({ type: 'paragraph', text: 'Situation:', id: 'lebensg-c1-situation' });
    if (lebensgCData.c1SituationExtern) {
      content.push({ type: 'paragraph', text: `Extern: ${lebensgCData.c1SituationExtern}`, id: 'lebensg-c1-situation-extern' });
    }
    if (lebensgCData.c1SituationIntern) {
      content.push({ type: 'paragraph', text: `Intern: ${lebensgCData.c1SituationIntern}`, id: 'lebensg-c1-situation-intern' });
    }
  }

  // 2. Organismus
  if (lebensgCData.c1Organismus) {
    hasC1Content = true;
    content.push({ type: 'paragraph', text: `Organismus: ${lebensgCData.c1Organismus}`, id: 'lebensg-c1-organismus' });
  }

  // 3. Reaktion
  if (lebensgCData.c1ReaktionKognitiv || lebensgCData.c1ReaktionEmotional ||
      lebensgCData.c1ReaktionPhysiologisch || lebensgCData.c1ReaktionBehavioral) {
    hasC1Content = true;
    content.push({ type: 'paragraph', text: 'Reaktion:', id: 'lebensg-c1-reaktion' });
    if (lebensgCData.c1ReaktionKognitiv) {
      content.push({ type: 'paragraph', text: `Kognitiv: ${lebensgCData.c1ReaktionKognitiv}`, id: 'lebensg-c1-reaktion-kognitiv' });
    }
    if (lebensgCData.c1ReaktionEmotional) {
      content.push({ type: 'paragraph', text: `Emotional: ${lebensgCData.c1ReaktionEmotional}`, id: 'lebensg-c1-reaktion-emotional' });
    }
    if (lebensgCData.c1ReaktionPhysiologisch) {
      content.push({ type: 'paragraph', text: `Physiologisch: ${lebensgCData.c1ReaktionPhysiologisch}`, id: 'lebensg-c1-reaktion-physiologisch' });
    }
    if (lebensgCData.c1ReaktionBehavioral) {
      content.push({ type: 'paragraph', text: `Behavioral: ${lebensgCData.c1ReaktionBehavioral}`, id: 'lebensg-c1-reaktion-behavioral' });
    }
  }

  // 4. Konsequenz
  const hasKurzfristig = lebensgCData.c1KonsequenzKurzfristigCPlus || lebensgCData.c1KonsequenzKurzfristigCMinus ||
      lebensgCData.c1KonsequenzKurzfristigCPlusSlash || lebensgCData.c1KonsequenzKurzfristigCMinusSlash;
  const hasLangfristig = lebensgCData.c1KonsequenzLangfristigCPlus || lebensgCData.c1KonsequenzLangfristigCMinus ||
      lebensgCData.c1KonsequenzLangfristigCPlusSlash || lebensgCData.c1KonsequenzLangfristigCMinusSlash;

  if (hasKurzfristig || hasLangfristig) {
    hasC1Content = true;
    content.push({ type: 'paragraph', text: 'Konsequenz:', id: 'lebensg-c1-konsequenz' });

    // 4.1 Kurzfristig
    if (hasKurzfristig) {
      content.push({ type: 'paragraph', text: 'Kurzfristig:', id: 'lebensg-c1-konsequenz-kurzfristig' });
      if (lebensgCData.c1KonsequenzKurzfristigCPlus) {
        content.push({ type: 'paragraph', text: `C+: ${lebensgCData.c1KonsequenzKurzfristigCPlus}`, id: 'lebensg-c1-konsequenz-kurzfristig-cplus' });
      }
      if (lebensgCData.c1KonsequenzKurzfristigCMinus) {
        content.push({ type: 'paragraph', text: `C-: ${lebensgCData.c1KonsequenzKurzfristigCMinus}`, id: 'lebensg-c1-konsequenz-kurzfristig-cminus' });
      }
      if (lebensgCData.c1KonsequenzKurzfristigCPlusSlash) {
        content.push({ type: 'paragraph', text: `C+/: ${lebensgCData.c1KonsequenzKurzfristigCPlusSlash}`, id: 'lebensg-c1-konsequenz-kurzfristig-cplusslash' });
      }
      if (lebensgCData.c1KonsequenzKurzfristigCMinusSlash) {
        content.push({ type: 'paragraph', text: `C-/: ${lebensgCData.c1KonsequenzKurzfristigCMinusSlash}`, id: 'lebensg-c1-konsequenz-kurzfristig-cminusslash' });
      }
    }

    // 4.2 Langfristig
    if (hasLangfristig) {
      content.push({ type: 'paragraph', text: 'Langfristig:', id: 'lebensg-c1-konsequenz-langfristig' });
      if (lebensgCData.c1KonsequenzLangfristigCPlus) {
        content.push({ type: 'paragraph', text: `C+: ${lebensgCData.c1KonsequenzLangfristigCPlus}`, id: 'lebensg-c1-konsequenz-langfristig-cplus' });
      }
      if (lebensgCData.c1KonsequenzLangfristigCMinus) {
        content.push({ type: 'paragraph', text: `C-: ${lebensgCData.c1KonsequenzLangfristigCMinus}`, id: 'lebensg-c1-konsequenz-langfristig-cminus' });
      }
      if (lebensgCData.c1KonsequenzLangfristigCPlusSlash) {
        content.push({ type: 'paragraph', text: `C+/: ${lebensgCData.c1KonsequenzLangfristigCPlusSlash}`, id: 'lebensg-c1-konsequenz-langfristig-cplusslash' });
      }
      if (lebensgCData.c1KonsequenzLangfristigCMinusSlash) {
        content.push({ type: 'paragraph', text: `C-/: ${lebensgCData.c1KonsequenzLangfristigCMinusSlash}`, id: 'lebensg-c1-konsequenz-langfristig-cminusslash' });
      }
    }
  }

  // Remove C1 header if there's no actual C1 content
  if (!hasC1Content) {
    content.shift(); // Remove the C1 header
  }

  // TODO: C2 sections need to be properly converted to structured content
  // For now, only C1 is returned as structured content
  // The C2, C2.1, C2.2, C2.3 sections (Makroanalyse) would go here
  // but need proper conversion to ParagraphNode[] format

  return content;
}

/**
 * Constructs text for LebensgC data (OLD - kept for backward compatibility)
 * @deprecated Use constructLebensgCContent instead for structured output
 */
export function constructLebensgCText(lebensgCData: LebensgCData): string {
  // Reuse the new structured function and join the paragraphs
  const structuredContent = constructLebensgCContent(lebensgCData);
  if (structuredContent.length === 0) {
    return '';
  }
  return structuredContent.map(node => node.text).join('\n\n');
}