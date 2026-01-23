/**
 * Funktionales Bedingungsmodell Text Generator
 *
 * Generates SORKC behavioral analysis and related content for Kapitel 4.
 * Output format follows the specified markdown structure for horizontal behavioral analysis.
 */

import * as FormTypes from '../../core/form-types';
import {
  GRAWE_GRUNDBEDUERFNIS_LABELS,
  BINDUNGSMUSTER_LABELS,
  FRUEHKINDLICHE_ERFAHRUNG_LABELS,
  BIOLOGISCHE_VULNERABILITAET_LABELS,
  SOZIALE_VULNERABILITAET_LABELS,
  AUSLOESENDE_BEDINGUNG_LABELS,
  DENKFEHLER_LABELS,
  DYSFUNKTIONALE_EMOTIONSREGULATION_LABELS,
  VERHALTENSBEZOGENE_FAKTOREN_LABELS,
  SELBSTWERTBEZOGENE_FAKTOREN_LABELS,
  KOMPETENZDEFIZIT_LABELS,
  SOZIALES_INTERAKTIONSDEFIZIT_LABELS,
  SUBSTANZABHAENGIGKEIT_FAKTOR_LABELS,
  PRIMAERER_KRANKHEITSGEWINN_LABELS,
  SEKUNDAERER_KRANKHEITSGEWINN_LABELS,
  STOERUNGSMODELL_TYP_LABELS,
} from '../../core/form-labels';

// Helper: Format list with "und" for last item
function formatListWithUnd(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} und ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} und ${items[items.length - 1]}`;
}

// Helper: Get selected labels from CardSelection
function getCardSelectionLabels<E extends string>(
  selection: FormTypes.CardSelection<E>,
  labels: Record<E, string>
): string[] {
  return (Object.keys(selection) as E[])
    .filter(key => selection[key]?.selected)
    .map(key => labels[key])
    .filter(Boolean);
}

/**
 * Checks if any Makroanalyse section has content
 */
function hasMakroanalyseContent(data: FormTypes.FunktionalesBedingungsmodellData): boolean {
  // Check makroanalyseIntro
  const hasIntro = !!(data.makroanalyseIntro?.headingExtension || data.makroanalyseIntro?.content);

  // Check prädisponierende Faktoren
  const hasPraedispo = data.praedisponierendeFaktoren ? checkPraedisponierendHasContent(data.praedisponierendeFaktoren) : false;

  // Check auslösende Bedingungen
  const hasAusloesende = data.ausloesendeBedingungen ?
    (data.ausloesendeBedingungen.nichtEruiert ||
     Object.values(data.ausloesendeBedingungen.bedingungen).some(v => v?.selected) ||
     !!data.ausloesendeBedingungen.andere) : false;

  // Check aufrechterhaltende Bedingungen (simplified check)
  const hasAufrecht = data.aufrechterhaltendeBedingungen ? checkAufrechterhaltendHasContent(data.aufrechterhaltendeBedingungen) : false;

  return hasIntro || hasPraedispo || hasAusloesende || hasAufrecht;
}

/**
 * Constructs content for Makroanalyse intro section
 */
function constructMakroanalyseIntroContent(data: FormTypes.MakroanalyseIntro): FormTypes.ParagraphNode[] {
  if (!data.content) return [];

  return [{
    type: 'paragraph',
    text: data.content,
    id: 'makroanalyse-intro-content',
  }];
}

/**
 * Constructs structured content for FunktionalesBedingungsmodell data
 * Generates text for SORKC entries and Makroanalyse sections
 * Each section is followed by its associated Störungsmodelle
 */
export function constructFunktionalesBedingungsmodellContent(
  data: FormTypes.FunktionalesBedingungsmodellData
): FormTypes.ParagraphNode[] {
  const content: FormTypes.ParagraphNode[] = [];

  // 1. Generate content for each SORKC entry
  for (let i = 0; i < data.sorkcEntries.length; i++) {
    const entry = data.sorkcEntries[i];
    const entryContent = constructSorkcEntryContent(entry, i);
    content.push(...entryContent);
  }

  // 2. Generate Makroanalyse content - check if any section has content
  const hasMakro = hasMakroanalyseContent(data);

  if (hasMakro) {
    // Add Makroanalyse heading
    const headingExtension = data.makroanalyseIntro?.headingExtension;
    const headingText = headingExtension
      ? `**Makroanalyse ${headingExtension}:**`
      : '**Makroanalyse:**';

    content.push({
      type: 'paragraph',
      text: headingText,
      id: 'makroanalyse-heading',
    });

    // Add Makroanalyse intro content if present
    if (data.makroanalyseIntro) {
      content.push(...constructMakroanalyseIntroContent(data.makroanalyseIntro));
    }
  }

  // 3. Generate individual sections (with Störungsmodelle appended inline)
  if (data.praedisponierendeFaktoren) {
    content.push(...constructPraedisponierendeFaktorenContent(
      data.praedisponierendeFaktoren,
      data.praedisponierendeFaktoren.stoerungsmodelle
    ));
  }
  if (data.ausloesendeBedingungen) {
    content.push(...constructAusloesendeBedingungContent(
      data.ausloesendeBedingungen,
      data.ausloesendeBedingungen.stoerungsmodelle
    ));
  }
  if (data.aufrechterhaltendeBedingungen) {
    content.push(...constructAufrechterhaltendeBedingungContent(
      data.aufrechterhaltendeBedingungen,
      data.aufrechterhaltendeBedingungen.stoerungsmodelle
    ));
  }

  return content;
}

/**
 * Constructs content for a single SORKC entry
 * All sections are combined into a single paragraph with \n between lines
 */
function constructSorkcEntryContent(
  entry: FormTypes.SorkcEntry,
  index: number
): FormTypes.ParagraphNode[] {
  const lines: string[] = [];
  const idPrefix = `sorkc-${index}`;

  // Skip empty entries
  if (!hasContent(entry)) {
    return [];
  }

  // Title: **Horizontale Verhaltensanalyse/SORKC zur [titel]:**
  if (entry.titel) {
    lines.push(`**Horizontale Verhaltensanalyse/SORKC zur ${entry.titel}:**`);
  }

  // Typische Stimuli
  if (entry.typischeStimuli) {
    lines.push(`**Typische Stimuli sind:** ${entry.typischeStimuli}.`);
  }

  // S: Situation (combined extern + intern)
  const situationParts: string[] = [];
  if (entry.situationExtern) {
    situationParts.push(entry.situationExtern);
  }
  if (entry.situationIntern) {
    situationParts.push(entry.situationIntern);
  }
  if (situationParts.length > 0) {
    lines.push(`**S:** ${situationParts.join(', ')}`);
  }

  // O: Organismus
  if (entry.organismus) {
    lines.push(`**O:** „${entry.organismus}"`);
  }

  // R: Reaktion - first part on R: line, rest on separate lines
  if (entry.reaktionKognitiv) {
    lines.push(`**R:** **Kognitiv:** „${entry.reaktionKognitiv}"`);
  }
  if (entry.reaktionEmotional) {
    lines.push(`**Emotional:** ${entry.reaktionEmotional}`);
  }
  if (entry.reaktionPhysiologisch) {
    lines.push(`**Physiologisch:** ${entry.reaktionPhysiologisch}`);
  }
  if (entry.reaktionBehavioral) {
    lines.push(`**Behavioral:** ${entry.reaktionBehavioral}`);
  }

  // C: Konsequenz
  const konsequenzText = buildKonsequenzText(entry);
  if (konsequenzText) {
    lines.push(`**C:** ${konsequenzText}`);
  }

  // Return single paragraph with all lines joined by markdown soft line breaks (two spaces + \n)
  return lines.length > 0 ? [{
    type: 'paragraph',
    text: lines.join('  \n'),
    id: `${idPrefix}-content`,
  }] : [];
}

/**
 * Builds the Konsequenz text with kurzfristig and langfristig parts
 */
function buildKonsequenzText(entry: FormTypes.SorkcEntry): string {
  const parts: string[] = [];

  // Kurzfristig
  const kurzfristigParts: string[] = [];
  if (entry.konsequenzKurzfristigPositiveVerstaerkung) {
    kurzfristigParts.push(`C+ ${entry.konsequenzKurzfristigPositiveVerstaerkung}`);
  }
  if (entry.konsequenzKurzfristigNegativeVerstaerkung) {
    kurzfristigParts.push(`C-/ ${entry.konsequenzKurzfristigNegativeVerstaerkung}`);
  }
  if (entry.konsequenzKurzfristigPositiveBestrafung) {
    kurzfristigParts.push(`C- ${entry.konsequenzKurzfristigPositiveBestrafung}`);
  }
  if (entry.konsequenzKurzfristigNegativeBestrafung) {
    kurzfristigParts.push(`C+/ ${entry.konsequenzKurzfristigNegativeBestrafung}`);
  }
  if (kurzfristigParts.length > 0) {
    parts.push(`**Kurzfristig:** ${kurzfristigParts.join('; ')}.`);
  }

  // Langfristig
  const langfristigParts: string[] = [];
  if (entry.konsequenzLangfristigPositiveVerstaerkung) {
    langfristigParts.push(`C+ ${entry.konsequenzLangfristigPositiveVerstaerkung}`);
  }
  if (entry.konsequenzLangfristigNegativeVerstaerkung) {
    langfristigParts.push(`C-/ ${entry.konsequenzLangfristigNegativeVerstaerkung}`);
  }
  if (entry.konsequenzLangfristigPositiveBestrafung) {
    langfristigParts.push(`C- ${entry.konsequenzLangfristigPositiveBestrafung}`);
  }
  if (entry.konsequenzLangfristigNegativeBestrafung) {
    langfristigParts.push(`C+/ ${entry.konsequenzLangfristigNegativeBestrafung}`);
  }
  if (langfristigParts.length > 0) {
    parts.push(`**Langfristig:** ${langfristigParts.join('; ')}.`);
  }

  return parts.join(' ');
}

/**
 * Checks if a SORKC entry has any content
 */
function hasContent(entry: FormTypes.SorkcEntry): boolean {
  return !!(
    entry.titel ||
    entry.typischeStimuli ||
    entry.situationExtern ||
    entry.situationIntern ||
    entry.organismus ||
    entry.reaktionKognitiv ||
    entry.reaktionEmotional ||
    entry.reaktionPhysiologisch ||
    entry.reaktionBehavioral ||
    entry.konsequenzKurzfristigPositiveVerstaerkung ||
    entry.konsequenzKurzfristigNegativeVerstaerkung ||
    entry.konsequenzKurzfristigPositiveBestrafung ||
    entry.konsequenzKurzfristigNegativeBestrafung ||
    entry.konsequenzLangfristigPositiveVerstaerkung ||
    entry.konsequenzLangfristigNegativeVerstaerkung ||
    entry.konsequenzLangfristigPositiveBestrafung ||
    entry.konsequenzLangfristigNegativeBestrafung
  );
}

// ============================================================================
// MAKROANALYSE TEXT GENERATION
// ============================================================================

/**
 * Constructs content for Prädisponierende Faktoren section
 * Generates clinical German prose following Vulnerabilitäts-Stress-Modell framework
 */
export function constructPraedisponierendeFaktorenContent(
  data: FormTypes.PraedisponierendeFaktoren,
  stoerungsmodelle: FormTypes.StoerungsmodellEntry[] = []
): FormTypes.ParagraphNode[] {
  const sentences: string[] = [];

  // Opening sentence (always include when there's content)
  const hasAnyContent = checkPraedisponierendHasContent(data);
  if (!hasAnyContent) return [];

  sentences.push('Hinsichtlich der Entwicklung der Symptomatik ist von einem Vulnerabilitäts-Stress-Modell auszugehen.');

  // Kognitiv-emotional: Plananalyse
  const grundbeduerfnisse = getCardSelectionLabels(
    data.kognitivEmotional.plananalyse.grundbeduerfnisse,
    GRAWE_GRUNDBEDUERFNIS_LABELS
  );
  if (grundbeduerfnisse.length > 0) {
    const beduerfnisText = grundbeduerfnisse.length === 1
      ? `das Grundbedürfnis nach ${grundbeduerfnisse[0]}`
      : `die Grundbedürfnisse nach ${formatListWithUnd(grundbeduerfnisse)}`;
    sentences.push(`Prädisponierend ist anzunehmen, dass ${beduerfnisText} in der Kindheit unzureichend befriedigt wurde${grundbeduerfnisse.length > 1 ? 'n' : ''}.`);
  }

  // Bindungsmuster
  const { fruehkindlicheErfahrungen } = data.kognitivEmotional;
  if (fruehkindlicheErfahrungen.bindungsmuster) {
    const bindungsLabel = BINDUNGSMUSTER_LABELS[fruehkindlicheErfahrungen.bindungsmuster].toLowerCase();
    sentences.push(`Es wird von einem ${bindungsLabel}en Bindungsmuster ausgegangen.`);
  }

  // Frühkindliche Erfahrungen
  const erfahrungen = getCardSelectionLabels(fruehkindlicheErfahrungen.erfahrungen, FRUEHKINDLICHE_ERFAHRUNG_LABELS);
  if (erfahrungen.length > 0) {
    sentences.push(`Als belastende frühkindliche Erfahrungen sind ${formatListWithUnd(erfahrungen)} zu nennen.`);
  }

  // Grundannahmen
  if (data.kognitivEmotional.plananalyse.grundannahmen.length > 0) {
    const annahmenText = data.kognitivEmotional.plananalyse.grundannahmen.map(a => `„${a}"`).join(', ');
    sentences.push(`Im Rahmen der Plananalyse wurden folgende dysfunktionale Grundannahmen identifiziert: ${annahmenText}.`);
  }

  // Annäherungs-/Vermeidungspläne
  if (data.kognitivEmotional.plananalyse.annaeherungsplaene || data.kognitivEmotional.plananalyse.vermeidungsplaene) {
    const plaeneParts: string[] = [];
    if (data.kognitivEmotional.plananalyse.annaeherungsplaene) {
      plaeneParts.push(`Annäherungspläne: ${data.kognitivEmotional.plananalyse.annaeherungsplaene}`);
    }
    if (data.kognitivEmotional.plananalyse.vermeidungsplaene) {
      plaeneParts.push(`Vermeidungspläne: ${data.kognitivEmotional.plananalyse.vermeidungsplaene}`);
    }
    sentences.push(`Hieraus resultieren ${plaeneParts.join('; ')}.`);
  }

  // Persönlichkeit/Temperament
  if (data.kognitivEmotional.persoenlichkeitTemperament) {
    sentences.push(`Hinsichtlich der Persönlichkeit und des Temperaments ist anzumerken: ${data.kognitivEmotional.persoenlichkeitTemperament}.`);
  }

  // Biologisch-genetisch
  const biologisch = getCardSelectionLabels(data.biologischGenetisch, BIOLOGISCHE_VULNERABILITAET_LABELS);
  if (biologisch.length > 0) {
    sentences.push(`Als biologisch-genetische Vulnerabilitätsfaktoren sind ${formatListWithUnd(biologisch)} zu berücksichtigen.`);
  }

  // Sozial
  const sozial = getCardSelectionLabels(data.sozial, SOZIALE_VULNERABILITAET_LABELS);
  if (sozial.length > 0) {
    sentences.push(`Soziale Vulnerabilitätsfaktoren umfassen ${formatListWithUnd(sozial)}.`);
  }

  let sectionText = `**Prädisponierende Faktoren:**  \n${sentences.join(' ')}`;

  // Append Störungsmodelle text with markdown line break (two spaces + newline)
  const stoerungsmodelleTexts = getStoerungsmodelleTexts(stoerungsmodelle);
  if (stoerungsmodelleTexts.length > 0) {
    sectionText += '  \n' + stoerungsmodelleTexts.join('  \n');
  }

  return [{
    type: 'paragraph',
    text: sectionText,
    id: 'praedisponierende-faktoren',
  }];
}

/**
 * Helper to check if prädisponierende Faktoren section has any content
 */
function checkPraedisponierendHasContent(data: FormTypes.PraedisponierendeFaktoren): boolean {
  const { kognitivEmotional, biologischGenetisch, sozial } = data;
  const { plananalyse, fruehkindlicheErfahrungen, persoenlichkeitTemperament } = kognitivEmotional;

  return !!(
    Object.values(plananalyse.grundbeduerfnisse).some(v => v?.selected) ||
    plananalyse.grundannahmen.length > 0 ||
    plananalyse.annaeherungsplaene ||
    plananalyse.vermeidungsplaene ||
    fruehkindlicheErfahrungen.bindungsmuster ||
    Object.values(fruehkindlicheErfahrungen.erfahrungen).some(v => v?.selected) ||
    persoenlichkeitTemperament ||
    Object.values(biologischGenetisch).some(v => v?.selected) ||
    Object.values(sozial).some(v => v?.selected)
  );
}

/**
 * Constructs content for Auslösende Bedingungen section
 * Generates clinical German prose for acute stressors
 */
export function constructAusloesendeBedingungContent(
  data: FormTypes.AusloesendeBedingungen,
  stoerungsmodelle: FormTypes.StoerungsmodellEntry[] = []
): FormTypes.ParagraphNode[] {
  if (data.nichtEruiert) {
    let sectionText = '**Auslösende Bedingungen:**  \nEine spezifische auslösende Bedingung konnte nicht eruiert werden.';
    const stoerungsmodelleTexts = getStoerungsmodelleTexts(stoerungsmodelle);
    if (stoerungsmodelleTexts.length > 0) {
      sectionText += '  \n' + stoerungsmodelleTexts.join('  \n');
    }
    return [{
      type: 'paragraph',
      text: sectionText,
      id: 'ausloesende-bedingungen',
    }];
  }

  const bedingungen = getCardSelectionLabels(data.bedingungen, AUSLOESENDE_BEDINGUNG_LABELS);
  const hasContent = bedingungen.length > 0 || data.andere;

  if (!hasContent) return [];

  const sentences: string[] = [];

  if (bedingungen.length === 1) {
    sentences.push(`Auslösende Bedingung bzw. akute Belastung war ${bedingungen[0]}.`);
  } else if (bedingungen.length > 1) {
    sentences.push(`Als auslösende Bedingungen bzw. akute Belastungen sind ${formatListWithUnd(bedingungen)} zu identifizieren.`);
  }

  if (data.andere) {
    if (sentences.length > 0) {
      sentences.push(`Darüber hinaus: ${data.andere}.`);
    } else {
      sentences.push(`Auslösende Bedingung bzw. akute Belastung war ${data.andere}.`);
    }
  }

  let sectionText = `**Auslösende Bedingungen:**  \n${sentences.join(' ')}`;

  // Append Störungsmodelle text with markdown line break (two spaces + newline)
  const stoerungsmodelleTexts = getStoerungsmodelleTexts(stoerungsmodelle);
  if (stoerungsmodelleTexts.length > 0) {
    sectionText += '  \n' + stoerungsmodelleTexts.join('  \n');
  }

  return [{
    type: 'paragraph',
    text: sectionText,
    id: 'ausloesende-bedingungen',
  }];
}

/**
 * Constructs content for Aufrechterhaltende Bedingungen section
 * Generates clinical German prose for maintaining factors
 */
export function constructAufrechterhaltendeBedingungContent(
  data: FormTypes.AufrechterhaltendeBedingungen,
  stoerungsmodelle: FormTypes.StoerungsmodellEntry[] = []
): FormTypes.ParagraphNode[] {
  const sentences: string[] = [];

  // Check if there's any content
  const hasContent = checkAufrechterhaltendHasContent(data);
  if (!hasContent) return [];

  // Opening sentence
  sentences.push('Die Aufrechterhaltung der Symptomatik wird durch folgende Faktoren begünstigt:');

  // 1. Kognitive Faktoren
  const { kognitiveFaktoren } = data;
  const kognitiveSentences: string[] = [];

  const denkfehler = getCardSelectionLabels(kognitiveFaktoren.denkfehler, DENKFEHLER_LABELS);
  if (denkfehler.length > 0) {
    kognitiveSentences.push(`typische Denkfehler wie ${formatListWithUnd(denkfehler)}`);
  }
  if (kognitiveFaktoren.grundannahmen.length > 0) {
    const annahmenText = kognitiveFaktoren.grundannahmen.map(a => `„${a}"`).join(', ');
    kognitiveSentences.push(`dysfunktionale Grundannahmen (${annahmenText})`);
  }
  if (kognitiveFaktoren.automatischeGedanken.length > 0) {
    const gedankenText = kognitiveFaktoren.automatischeGedanken.map(a => `„${a}"`).join(', ');
    kognitiveSentences.push(`automatische Gedanken wie ${gedankenText}`);
  }
  if (kognitiveFaktoren.gruebeln) {
    kognitiveSentences.push(`Grübeln (${kognitiveFaktoren.gruebeln})`);
  }
  if (kognitiveFaktoren.sichSorgenMachen) {
    kognitiveSentences.push(`sich Sorgen machen (${kognitiveFaktoren.sichSorgenMachen})`);
  }

  if (kognitiveSentences.length > 0) {
    sentences.push(`Auf kognitiver Ebene finden sich ${formatListWithUnd(kognitiveSentences)}.`);
  }

  // 2. Emotionale Faktoren
  const { emotionaleFaktoren } = data;
  const emotionsregulation = getCardSelectionLabels(emotionaleFaktoren.emotionsregulation, DYSFUNKTIONALE_EMOTIONSREGULATION_LABELS);
  if (emotionsregulation.length > 0) {
    sentences.push(`Hinsichtlich der Emotionsregulation zeigt sich ${formatListWithUnd(emotionsregulation)}.`);
  }

  // 3. Verhaltensbezogene Faktoren
  const { verhaltensbezogeneFaktoren } = data;
  const verhaltensItems = getCardSelectionLabels(verhaltensbezogeneFaktoren.faktoren, VERHALTENSBEZOGENE_FAKTOREN_LABELS);
  if (verhaltensItems.length > 0) {
    sentences.push(`Auf Verhaltensebene sind ${formatListWithUnd(verhaltensItems)} als aufrechterhaltend anzusehen.`);
  }

  // 4. Selbstwertbezogene Faktoren
  const { selbstwertbezogeneFaktoren } = data;
  const selbstwertItems = getCardSelectionLabels(selbstwertbezogeneFaktoren.faktoren, SELBSTWERTBEZOGENE_FAKTOREN_LABELS);
  if (selbstwertItems.length > 0) {
    sentences.push(`Im Bereich des Selbstwerts zeigen sich ${formatListWithUnd(selbstwertItems)}.`);
  }

  // 5. Kompetenzdefizite
  const { kompetenzdefizite } = data;
  const defiziteItems = getCardSelectionLabels(kompetenzdefizite.defizite, KOMPETENZDEFIZIT_LABELS);
  const interaktionItems = getCardSelectionLabels(kompetenzdefizite.sozialeInteraktionsdefizite, SOZIALES_INTERAKTIONSDEFIZIT_LABELS);
  if (defiziteItems.length > 0 || interaktionItems.length > 0) {
    const allDefizite = [...defiziteItems, ...interaktionItems];
    sentences.push(`Als Kompetenzdefizite sind ${formatListWithUnd(allDefizite)} zu nennen.`);
  }

  // 6. Substanzabhängigkeit
  const { substanzabhaengigkeit } = data;
  const substanzItems = getCardSelectionLabels(substanzabhaengigkeit.faktoren, SUBSTANZABHAENGIGKEIT_FAKTOR_LABELS);
  if (substanzItems.length > 0) {
    sentences.push(`Im Kontext der Substanzabhängigkeit zeigen sich ${formatListWithUnd(substanzItems)}.`);
  }

  // 7. Weitere Faktoren
  const { weitereFaktoren } = data;
  const weitereParts: string[] = [];

  if (weitereFaktoren.chronischeStressoren) {
    weitereParts.push(`chronische Stressoren (${weitereFaktoren.chronischeStressoren})`);
  }
  if (weitereFaktoren.hohesAnspannungsniveau) {
    weitereParts.push('ein hohes Anspannungsniveau');
  }
  if (weitereFaktoren.fehlendeSozialeUnterstuetzung) {
    weitereParts.push('fehlende soziale Unterstützung');
  }

  if (weitereParts.length > 0) {
    sentences.push(`Darüber hinaus sind ${formatListWithUnd(weitereParts)} zu berücksichtigen.`);
  }

  // Krankheitsgewinn
  const primaer = getCardSelectionLabels(weitereFaktoren.primaererKrankheitsgewinn, PRIMAERER_KRANKHEITSGEWINN_LABELS);
  const sekundaer = getCardSelectionLabels(weitereFaktoren.sekundaererKrankheitsgewinn, SEKUNDAERER_KRANKHEITSGEWINN_LABELS);

  if (primaer.length > 0 || sekundaer.length > 0) {
    const krankheitsgewinnParts: string[] = [];
    if (primaer.length > 0) {
      krankheitsgewinnParts.push(`primärer Krankheitsgewinn in Form von ${formatListWithUnd(primaer)}`);
    }
    if (sekundaer.length > 0) {
      krankheitsgewinnParts.push(`sekundärer Krankheitsgewinn durch ${formatListWithUnd(sekundaer)}`);
    }
    sentences.push(`Hinsichtlich des Krankheitsgewinns ist ${formatListWithUnd(krankheitsgewinnParts)} zu beobachten.`);
  }

  let sectionText = `**Aufrechterhaltende Bedingungen:**  \n${sentences.join(' ')}`;

  // Append Störungsmodelle text with markdown line break (two spaces + newline)
  const stoerungsmodelleTexts = getStoerungsmodelleTexts(stoerungsmodelle);
  if (stoerungsmodelleTexts.length > 0) {
    sectionText += '  \n' + stoerungsmodelleTexts.join('  \n');
  }

  return [{
    type: 'paragraph',
    text: sectionText,
    id: 'aufrechterhaltende-bedingungen',
  }];
}

/**
 * Helper to check if aufrechterhaltende Bedingungen section has any content
 */
function checkAufrechterhaltendHasContent(data: FormTypes.AufrechterhaltendeBedingungen): boolean {
  const { kognitiveFaktoren, emotionaleFaktoren, verhaltensbezogeneFaktoren,
          selbstwertbezogeneFaktoren, kompetenzdefizite, substanzabhaengigkeit, weitereFaktoren } = data;

  return !!(
    Object.values(kognitiveFaktoren.denkfehler).some(v => v?.selected) ||
    kognitiveFaktoren.grundannahmen.length > 0 ||
    kognitiveFaktoren.automatischeGedanken.length > 0 ||
    kognitiveFaktoren.gruebeln ||
    kognitiveFaktoren.sichSorgenMachen ||
    Object.values(emotionaleFaktoren.emotionsregulation).some(v => v?.selected) ||
    Object.values(verhaltensbezogeneFaktoren.faktoren).some(v => v?.selected) ||
    Object.values(selbstwertbezogeneFaktoren.faktoren).some(v => v?.selected) ||
    Object.values(kompetenzdefizite.defizite).some(v => v?.selected) ||
    Object.values(kompetenzdefizite.sozialeInteraktionsdefizite).some(v => v?.selected) ||
    Object.values(substanzabhaengigkeit.faktoren).some(v => v?.selected) ||
    weitereFaktoren.chronischeStressoren ||
    weitereFaktoren.hohesAnspannungsniveau ||
    weitereFaktoren.fehlendeSozialeUnterstuetzung ||
    Object.values(weitereFaktoren.primaererKrankheitsgewinn).some(v => v?.selected) ||
    Object.values(weitereFaktoren.sekundaererKrankheitsgewinn).some(v => v?.selected)
  );
}

/**
 * Constructs content for Störungsspezifische Modelle
 * Generates clinical narratives for each model type
 */
export function constructStoerungsmodelleContent(
  models: FormTypes.StoerungsmodellEntry[]
): FormTypes.ParagraphNode[] {
  if (models.length === 0) return [];

  const paragraphs: FormTypes.ParagraphNode[] = [];

  for (const entry of models) {
    const modelContent = constructSingleModelContent(entry);
    if (modelContent) {
      paragraphs.push(modelContent);
    }
  }

  return paragraphs;
}

/**
 * Extracts text from Störungsmodelle entries for appending to section text
 */
function getStoerungsmodelleTexts(models: FormTypes.StoerungsmodellEntry[]): string[] {
  return models
    .map(entry => {
      const node = constructSingleModelContent(entry);
      return node?.text || '';
    })
    .filter(text => text);
}

/**
 * Constructs content for a single Störungsmodell
 */
function constructSingleModelContent(entry: FormTypes.StoerungsmodellEntry): FormTypes.ParagraphNode | null {
  const { modell } = entry;
  const typLabel = STOERUNGSMODELL_TYP_LABELS[modell.typ];

  switch (modell.typ) {
    case FormTypes.StoerungsmodellTyp.VerstaerkerVerlustDepression:
      return constructVerstaerkerVerlustContent(modell.data, typLabel);
    case FormTypes.StoerungsmodellTyp.ErlernteHilflosigkeit:
      return constructErlernteHilflosigkeitContent(modell.data, typLabel);
    case FormTypes.StoerungsmodellTyp.KognitionstheoretischDepression:
      return constructKognitionstheoretischContent(modell.data, typLabel);
    case FormTypes.StoerungsmodellTyp.TeufelskreisAngst:
      return constructTeufelskreisAngstContent(modell.data, typLabel);
    case FormTypes.StoerungsmodellTyp.TeufelskreisZwangserkrankung:
      return constructTeufelskreisZwangserkrankungContent(modell.data, typLabel);
    case FormTypes.StoerungsmodellTyp.TeufelskreisZwangshandlungen:
      return constructTeufelskreisZwangshandlungenContent(modell.data, typLabel);
    case FormTypes.StoerungsmodellTyp.TeufelskreisBulimie:
      return constructTeufelskreisBulimieContent(modell.data, typLabel);
    case FormTypes.StoerungsmodellTyp.ZweiFaktorenZwang:
      return constructZweiFaktorenZwangContent(modell.data, typLabel);
    case FormTypes.StoerungsmodellTyp.DreiFaktorenGAS:
      return constructDreiFaktorenGASContent(modell.data, typLabel);
    case FormTypes.StoerungsmodellTyp.KognitivSozialePhobie:
      return constructKognitivSozialePhobieContent(modell.data, typLabel);
    case FormTypes.StoerungsmodellTyp.BiopsychosozialBorderline:
      return constructBiopsychosozialBorderlineContent(modell.data, typLabel);
    case FormTypes.StoerungsmodellTyp.FreitextModell:
      return constructFreitextModellContent(modell.data, typLabel);
    default:
      return null;
  }
}

// A: Verstärker-Verlust-Modell
function constructVerstaerkerVerlustContent(
  data: FormTypes.VerstaerkerVerlustModellData,
  typLabel: string
): FormTypes.ParagraphNode {
  const sentences: string[] = [];
  sentences.push(`Im Rahmen des ${typLabel}s wird angenommen, dass die depressive Symptomatik durch einen Mangel an positiver Verstärkung aufrechterhalten wird.`);

  const factors: string[] = [];
  if (data.verlustPositiverVerstaerker?.selected) {
    factors.push(data.verlustPositiverVerstaerker.text || 'Verlust positiver Verstärker');
  }
  if (data.mangelErreichbarkeitVerstaerker?.selected) {
    factors.push(data.mangelErreichbarkeitVerstaerker.text || 'mangelnde Erreichbarkeit von Verstärkern');
  }
  if (data.mangelPositiveErlebnisse?.selected) {
    factors.push(data.mangelPositiveErlebnisse.text || 'Mangel an positiven Erlebnissen');
  }
  if (data.mangelFertigkeiten?.selected) {
    factors.push(data.mangelFertigkeiten.text || 'Mangel an Fertigkeiten zur Verstärkergewinnung');
  }
  if (data.reduzierteAktivitaet?.selected) {
    factors.push(data.reduzierteAktivitaet.text || 'reduzierte Aktivität');
  }

  if (factors.length > 0) {
    sentences.push(`Konkret zeigt sich dies in ${formatListWithUnd(factors)}.`);
  }

  return {
    type: 'paragraph',
    text: sentences.join(' '),
    id: `stoerungsmodell-verstaerkerverlust`,
  };
}

// B: Erlernte Hilflosigkeit
function constructErlernteHilflosigkeitContent(
  data: FormTypes.ErlernteHilflosigkeitModellData,
  typLabel: string
): FormTypes.ParagraphNode {
  const sentences: string[] = [];
  sentences.push(`Entsprechend dem ${typLabel} ist davon auszugehen, dass die Symptomatik durch die Wahrnehmung fehlender Kontrolle über negative Ereignisse mitbedingt wird.`);

  if (data.negativesErleben) {
    sentences.push(`Ausgangspunkt sind negative Erlebnisse: ${data.negativesErleben}.`);
  }
  if (data.wahrnehmungUnkontrollierbarkeit) {
    sentences.push(`Diese werden als unkontrollierbar wahrgenommen: ${data.wahrnehmungUnkontrollierbarkeit}.`);
  }
  if (data.depressiverAttributionsstil) {
    sentences.push(`Es zeigt sich ein depressiver Attributionsstil: ${data.depressiverAttributionsstil}.`);
  }

  const hilflosigkeitsaspekte: string[] = [];
  if (data.erlernteHilflosigkeitEmotional) {
    hilflosigkeitsaspekte.push(`emotional: ${data.erlernteHilflosigkeitEmotional}`);
  }
  if (data.erlernteHilflosigkeitMotivational) {
    hilflosigkeitsaspekte.push(`motivational: ${data.erlernteHilflosigkeitMotivational}`);
  }
  if (data.erlernteHilflosigkeitKognitiv) {
    hilflosigkeitsaspekte.push(`kognitiv: ${data.erlernteHilflosigkeitKognitiv}`);
  }
  if (hilflosigkeitsaspekte.length > 0) {
    sentences.push(`Die erlernte Hilflosigkeit manifestiert sich ${formatListWithUnd(hilflosigkeitsaspekte)}.`);
  }

  return {
    type: 'paragraph',
    text: sentences.join(' '),
    id: `stoerungsmodell-erlerntehilflosigkeit`,
  };
}

// C: Kognitionstheoretisches Modell
function constructKognitionstheoretischContent(
  data: FormTypes.KognitionstheoretischModellData,
  typLabel: string
): FormTypes.ParagraphNode {
  const sentences: string[] = [];
  sentences.push(`Im Sinne des ${typLabel}s nach Beck wird die depressive Symptomatik durch dysfunktionale kognitive Schemata aufrechterhalten.`);

  if (data.externeInterneAusloeser) {
    sentences.push(`Externe und/oder interne Auslöser: ${data.externeInterneAusloeser}.`);
  }
  if (data.dysfunktionaleGrundannahmen) {
    sentences.push(`Dysfunktionale Grundannahmen: ${data.dysfunktionaleGrundannahmen}.`);
  }
  if (data.automatischeNegativeGedanken) {
    sentences.push(`Automatische negative Gedanken: ${data.automatischeNegativeGedanken}.`);
  }
  if (data.depressiveSymptomatik) {
    sentences.push(`Die resultierende depressive Symptomatik umfasst: ${data.depressiveSymptomatik}.`);
  }

  return {
    type: 'paragraph',
    text: sentences.join(' '),
    id: `stoerungsmodell-kognitionstheoretisch`,
  };
}

// D: Teufelskreis der Angst
function constructTeufelskreisAngstContent(
  data: FormTypes.TeufelskreisAngstModellData,
  typLabel: string
): FormTypes.ParagraphNode {
  const sentences: string[] = [];
  sentences.push(`Entsprechend dem ${typLabel} wird die Angstsymptomatik durch einen sich selbst verstärkenden Kreislauf aufrechterhalten.`);

  if (data.ausloesendeSituation) {
    sentences.push(`Auslösende Situation: ${data.ausloesendeSituation}.`);
  }
  if (data.wahrnehmungKoerperlich) {
    sentences.push(`Körperliche Wahrnehmung: ${data.wahrnehmungKoerperlich}.`);
  }
  if (data.dysfunktionaleBewertung) {
    sentences.push(`Dysfunktionale Bewertung: ${data.dysfunktionaleBewertung}.`);
  }
  if (data.gefuehlAngst) {
    sentences.push(`Das Gefühl der Angst manifestiert sich als: ${data.gefuehlAngst}.`);
  }
  if (data.physiologischeAktivierung) {
    sentences.push(`Physiologische Aktivierung: ${data.physiologischeAktivierung}.`);
  }
  if (data.verstaerkungKoerperlich) {
    sentences.push(`Verstärkung der körperlichen Reaktion: ${data.verstaerkungKoerperlich}.`);
  }
  if (data.vermeidungsverhalten) {
    sentences.push(`Vermeidungsverhalten: ${data.vermeidungsverhalten}.`);
  }

  return {
    type: 'paragraph',
    text: sentences.join(' '),
    id: `stoerungsmodell-teufelskreisangst`,
  };
}

// E: Teufelskreis der Zwangserkrankung
function constructTeufelskreisZwangserkrankungContent(
  data: FormTypes.TeufelskreisZwangserkrankungModellData,
  typLabel: string
): FormTypes.ParagraphNode {
  const sentences: string[] = [];
  sentences.push(`Im Rahmen des ${typLabel}s wird die Zwangssymptomatik durch einen Kreislauf aus aufdringlichen Gedanken und neutralisierenden Handlungen aufrechterhalten.`);

  if (data.aufdringlicherGedanke) {
    sentences.push(`Aufdringlicher Gedanke: ${data.aufdringlicherGedanke}.`);
  }
  if (data.fehlbewertung) {
    sentences.push(`Fehlbewertung: ${data.fehlbewertung}.`);
  }
  if (data.emotionaleReaktion) {
    sentences.push(`Emotionale Reaktion: ${data.emotionaleReaktion}.`);
  }
  if (data.offeneZwangshandlung) {
    sentences.push(`Offene Zwangshandlung: ${data.offeneZwangshandlung}.`);
  }
  if (data.verdeckteZwangshandlung) {
    sentences.push(`Verdeckte Zwangshandlung: ${data.verdeckteZwangshandlung}.`);
  }
  if (data.gedankenunterdrueckung) {
    sentences.push(`Gedankenunterdrückung: ${data.gedankenunterdrueckung}.`);
  }
  if (data.vermeidung) {
    sentences.push(`Vermeidung: ${data.vermeidung}.`);
  }
  if (data.rueckversicherung) {
    sentences.push(`Rückversicherung: ${data.rueckversicherung}.`);
  }
  if (data.neutralisierendeZwangshandlungen) {
    sentences.push(`Neutralisierende Zwangshandlungen: ${data.neutralisierendeZwangshandlungen}.`);
  }

  return {
    type: 'paragraph',
    text: sentences.join(' '),
    id: `stoerungsmodell-teufelskreiszwang`,
  };
}

// F: Teufelskreis der Zwangshandlungen
function constructTeufelskreisZwangshandlungenContent(
  data: FormTypes.TeufelskreisZwangshandlungenModellData,
  typLabel: string
): FormTypes.ParagraphNode {
  const sentences: string[] = [];
  sentences.push(`Das ${typLabel} beschreibt die Aufrechterhaltung der Zwangssymptomatik durch einen Kreislauf von Befürchtung und Vermeidung.`);

  if (data.externeInterneAusloeser) {
    sentences.push(`Externe/interne Auslöser: ${data.externeInterneAusloeser}.`);
  }
  if (data.dysfunktionaleGrundannahmen) {
    sentences.push(`Dysfunktionale Grundannahmen: ${data.dysfunktionaleGrundannahmen}.`);
  }
  if (data.zwangsbefuerchtung) {
    sentences.push(`Zwangsbefürchtung: ${data.zwangsbefuerchtung}.`);
  }
  if (data.zwangshandlung) {
    sentences.push(`Zwangshandlung: ${data.zwangshandlung}.`);
  }
  if (data.zwangshandlungAufrechterhaltung) {
    sentences.push(`Aufrechterhaltung durch: ${data.zwangshandlungAufrechterhaltung}.`);
  }

  return {
    type: 'paragraph',
    text: sentences.join(' '),
    id: `stoerungsmodell-teufelskreiszwangshandlungen`,
  };
}

// G: Teufelskreis der Bulimie
function constructTeufelskreisBulimieContent(
  data: FormTypes.TeufelskreisBulimieModellData,
  typLabel: string
): FormTypes.ParagraphNode {
  const sentences: string[] = [];
  sentences.push(`Entsprechend dem ${typLabel} wird die bulimische Symptomatik durch einen Kreislauf aus Restriktion und Essanfällen aufrechterhalten.`);

  if (data.fixierungKoerpergewicht) {
    sentences.push(`Fixierung auf Körpergewicht: ${data.fixierungKoerpergewicht}.`);
  }
  if (data.nahrungsrestriktion) {
    sentences.push(`Nahrungsrestriktion: ${data.nahrungsrestriktion}.`);
  }
  if (data.unterzuckerung) {
    sentences.push(`Unterzuckerung: ${data.unterzuckerung}.`);
  }
  if (data.heisshungeranfall) {
    sentences.push(`Heißhungeranfall: ${data.heisshungeranfall}.`);
  }
  if (data.ekelSchamAngst) {
    sentences.push(`Ekel, Scham und Angst: ${data.ekelSchamAngst}.`);
  }
  if (data.erbrechen) {
    sentences.push(`Erbrechen/Gegenregulation: ${data.erbrechen}.`);
  }

  return {
    type: 'paragraph',
    text: sentences.join(' '),
    id: `stoerungsmodell-teufelskreisbulimie`,
  };
}

// H: Zwei-Faktoren-Modell
function constructZweiFaktorenZwangContent(
  data: FormTypes.ZweiFaktorenZwangModellData,
  typLabel: string
): FormTypes.ParagraphNode {
  const sentences: string[] = [];
  sentences.push(`Im Rahmen des ${typLabel}s nach Mowrer wird die Zwangssymptomatik durch klassische und operante Konditionierung erklärt.`);

  if (data.klassischeKonditionierung) {
    sentences.push(`Klassische Konditionierung (Erwerb der Angst): ${data.klassischeKonditionierung}.`);
  }
  if (data.operanteKonditionierung) {
    sentences.push(`Operante Konditionierung (Aufrechterhaltung durch Vermeidung): ${data.operanteKonditionierung}.`);
  }

  return {
    type: 'paragraph',
    text: sentences.join(' '),
    id: `stoerungsmodell-zweifaktoren`,
  };
}

// I: Drei-Faktoren-Modell GAS
function constructDreiFaktorenGASContent(
  data: FormTypes.DreiFaktorenGASModellData,
  typLabel: string
): FormTypes.ParagraphNode {
  const sentences: string[] = [];
  sentences.push(`Entsprechend dem ${typLabel} wird die generalisierte Angstsymptomatik durch prädisponierende, auslösende und aufrechterhaltende Faktoren erklärt.`);

  // Prädisponierende Faktoren
  const praedisponierend: string[] = [];
  if (data.praedisponierendVeranlagung) praedisponierend.push('genetische Veranlagung');
  if (data.praedisponierendLernerfahrungen) praedisponierend.push('Lernerfahrungen');
  if (data.praedisponierendSelbstwirksamkeit) praedisponierend.push('geringe Selbstwirksamkeitserwartung');
  if (data.praedisponierendProblemloesung) praedisponierend.push('Problemlösedefizite');
  if (data.praedisponierendGrundannahmen) praedisponierend.push('dysfunktionale Grundannahmen');
  if (praedisponierend.length > 0) {
    sentences.push(`Prädisponierende Faktoren: ${formatListWithUnd(praedisponierend)}.`);
  }

  // Auslösende Faktoren
  const ausloesend: string[] = [];
  if (data.ausloesendAnforderungen) ausloesend.push('erhöhte Anforderungen');
  if (data.ausloesendBelastungen) ausloesend.push('chronische Belastungen');
  if (data.ausloesendMehrereFaktoren) ausloesend.push('Kumulation mehrerer Faktoren');
  if (ausloesend.length > 0) {
    sentences.push(`Auslösende Faktoren: ${formatListWithUnd(ausloesend)}.`);
  }

  // Aufrechterhaltende Faktoren
  const aufrechterhaltend: string[] = [];
  if (data.aufrechterhaltendGruebeln) aufrechterhaltend.push('Grübeln');
  if (data.aufrechterhaltendGedankenstopp) aufrechterhaltend.push('Gedankenstopp');
  if (data.aufrechterhaltendAblenkung) aufrechterhaltend.push('Ablenkung');
  if (data.aufrechterhaltendKognitiveVermeidung) aufrechterhaltend.push('kognitive Vermeidung');
  if (data.aufrechterhaltendSorgenketten) aufrechterhaltend.push('Sorgenketten');
  if (data.aufrechterhaltendGedankenStattBilder) aufrechterhaltend.push('Gedanken statt Bilder');
  if (data.aufrechterhaltendOffeneVermeidung) aufrechterhaltend.push('offene Vermeidung');
  if (data.aufrechterhaltendAufmerksamkeitBedrohlich) aufrechterhaltend.push('Aufmerksamkeit auf Bedrohliches');
  if (data.aufrechterhaltendGefahrenbezogeneInterpretation) aufrechterhaltend.push('gefahrenbezogene Interpretation');
  if (data.aufrechterhaltendKonzentrationsprobleme) aufrechterhaltend.push('Konzentrationsprobleme');
  if (data.aufrechterhaltendVerringerungLeistung) aufrechterhaltend.push('Verringerung der Leistungsfähigkeit');
  if (aufrechterhaltend.length > 0) {
    sentences.push(`Aufrechterhaltende Faktoren: ${formatListWithUnd(aufrechterhaltend)}.`);
  }

  return {
    type: 'paragraph',
    text: sentences.join(' '),
    id: `stoerungsmodell-dreifaktorengas`,
  };
}

// J: Kognitives Modell der sozialen Phobie
function constructKognitivSozialePhobieContent(
  data: FormTypes.KognitivSozialePhobieModellData,
  typLabel: string
): FormTypes.ParagraphNode {
  const sentences: string[] = [];
  sentences.push(`Im Rahmen des ${typLabel}s nach Clark und Wells wird die soziale Angst durch dysfunktionale Selbstwahrnehmung und Sicherheitsverhalten aufrechterhalten.`);

  if (data.negativesSelbst) {
    sentences.push(`Negatives Selbstbild in sozialen Situationen: ${data.negativesSelbst}.`);
  }
  if (data.erhoehtesSelbstaufmerksamkeit) {
    sentences.push(`Erhöhte Selbstaufmerksamkeit: ${data.erhoehtesSelbstaufmerksamkeit}.`);
  }
  if (data.fehlattribution) {
    sentences.push(`Fehlattribution körperlicher Symptome: ${data.fehlattribution}.`);
  }
  if (data.sicherheitsverhalten) {
    sentences.push(`Sicherheitsverhalten: ${data.sicherheitsverhalten}.`);
  }
  if (data.uebermaessigeVorbereitung) {
    sentences.push(`Übermäßige Vorbereitung: ${data.uebermaessigeVorbereitung}.`);
  }
  if (data.antizipatorischeVerhinderung) {
    sentences.push(`Antizipatorische Verhinderung: ${data.antizipatorischeVerhinderung}.`);
  }
  if (data.antizipatorischeVorbeugung) {
    sentences.push(`Antizipatorische Vorbeugung: ${data.antizipatorischeVorbeugung}.`);
  }
  if (data.versucheWirkungKontrollieren) {
    sentences.push(`Versuche, die Wirkung auf andere zu kontrollieren: ${data.versucheWirkungKontrollieren}.`);
  }

  return {
    type: 'paragraph',
    text: sentences.join(' '),
    id: `stoerungsmodell-kognitivsozialephobie`,
  };
}

// K: Biopsychosoziales Modell Borderline
function constructBiopsychosozialBorderlineContent(
  data: FormTypes.BiopsychosozialBorderlineModellData,
  typLabel: string
): FormTypes.ParagraphNode {
  const sentences: string[] = [];
  sentences.push(`Im Rahmen des ${typLabel}s nach Linehan wird die Borderline-Symptomatik durch ein Zusammenspiel biologischer, psychologischer und sozialer Faktoren erklärt.`);

  // Soziale Faktoren
  const sozial: string[] = [];
  if (data.sozialChronischeInvalidierung) sozial.push('chronische Invalidierung');
  if (data.sozialMissbrauch) sozial.push('Missbrauch');
  if (data.sozialTraumata) sozial.push('Traumata');
  if (data.sozialUngueinstigeBedingungen) sozial.push('ungünstige Entwicklungsbedingungen');
  if (sozial.length > 0) {
    sentences.push(`Soziale Faktoren: ${formatListWithUnd(sozial)}.`);
  }

  // Biologische Faktoren
  const biologisch: string[] = [];
  if (data.biologischErhohtesErregungsniveau) biologisch.push('erhöhtes Erregungsniveau');
  if (data.biologischErhoehteImpulsivitaet) biologisch.push('erhöhte Impulsivität');
  if (biologisch.length > 0) {
    sentences.push(`Biologische Faktoren: ${formatListWithUnd(biologisch)}.`);
  }

  // Störung der Emotionsregulation
  const emotionsregulation: string[] = [];
  if (data.stoerungEmotionsregulationIntensiv) emotionsregulation.push('intensive Emotionen');
  if (data.stoerungEmotionsregulationUnkontrollierbar) emotionsregulation.push('als unkontrollierbar erlebte Emotionen');
  if (data.stoerungEmotionsregulationEmotionsphobie) emotionsregulation.push('Emotionsphobie');
  if (data.stoerungEmotionsregulationDysfunktional) emotionsregulation.push('dysfunktionale Regulationsstrategien');
  if (emotionsregulation.length > 0) {
    sentences.push(`Störung der Emotionsregulation: ${formatListWithUnd(emotionsregulation)}.`);
  }

  return {
    type: 'paragraph',
    text: sentences.join(' '),
    id: `stoerungsmodell-biopsychosozialborderline`,
  };
}

// Freitext-Modell
function constructFreitextModellContent(
  data: FormTypes.FreitextModellData,
  _typLabel: string
): FormTypes.ParagraphNode {
  return {
    type: 'paragraph',
    text: data.inhalt || '',
    id: `stoerungsmodell-freitext`,
  };
}

/**
 * Constructs the complete Makroanalyse content
 * Each section includes its associated Störungsmodelle appended inline
 */
export function constructMakroanalyseContent(
  data: FormTypes.FunktionalesBedingungsmodellData
): FormTypes.ParagraphNode[] {
  return [
    ...constructPraedisponierendeFaktorenContent(
      data.praedisponierendeFaktoren,
      data.praedisponierendeFaktoren.stoerungsmodelle
    ),
    ...constructAusloesendeBedingungContent(
      data.ausloesendeBedingungen,
      data.ausloesendeBedingungen.stoerungsmodelle
    ),
    ...constructAufrechterhaltendeBedingungContent(
      data.aufrechterhaltendeBedingungen,
      data.aufrechterhaltendeBedingungen.stoerungsmodelle
    ),
  ];
}
