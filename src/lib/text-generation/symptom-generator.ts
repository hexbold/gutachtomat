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
 * - Kapitel 3: Somatischer Befund
 * - Kapitel 4: Lebensgeschichte
 * - Kapitel 5: Diagnosen
 *
 * Note: B1-B18 (Psychischer Befund) has been moved to psychischer-befund-generator.ts
 */

import {
  Somato1Data,
  Somato2Data,
  Somato3Data,
  Somato4Data,
  Somato5Data,
  LebensgAData,
  LebensgBData,
  LebensgCData,
  Kap5DiagnosenData,
  ParagraphNode,
  TestdiagnostikData,
  Verhaltensauffaelligkeiten,
  VerhaltensexzessSymptom,
  VerhaltensdefizitSymptom,
} from '../core/form-types';
import * as FormConfig from '@/lib/core/form-config';
import {
  VERHALTENSEXZESS_SYMPTOM_LABELS,
  VERHALTENSDEFIZIT_SYMPTOM_LABELS,
} from '../core/form-labels';

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
      sentence += ` ${test.notizen.trim()}`;
      // Ensure notes end with a period
      if (!sentence.endsWith('.')) {
        sentence += '.';
      }
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