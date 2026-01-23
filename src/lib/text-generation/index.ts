/**
 * Frontend Text Generator
 *
 * This file contains the text generation logic that runs in the browser
 * to provide real-time preview as the user fills out the wizard.
 */

import * as FormTypes from '../core/form-types';
import { findNewSentences } from '../utils/highlight-utils';
import { generateImprovedKapitel1 } from './kapitel1-improver';
import { formatToMarkdown } from './markdown-formatter';
import { generateKapitel6Content } from './sections/kapitel6-generator';
import { constructSymptomatikContent } from './sections/symptomatik-generator';
import { constructPatientInfoContent } from './sections/patient-info-generator';
import { constructPsychischerBefundContent } from './sections/psychischer-befund-generator';
import {
  constructVerhaltensauffaelligkeitenContent,
  constructTestbefundeContent,
  constructKap5DiagnosenContent,
  // New Lebensg structured content functions
  constructLebensgAContent,
} from './symptom-generator';
import { constructKrankheitsanamneseContent } from './sections/krankheitsanamnese-generator';
import { constructFunktionalesBedingungsmodellContent } from './sections/funktionales-bedingungsmodell-generator';
import { constructSomatischerBefundContent } from './sections/somatischer-befund-generator';

// Smart structure building functions
function buildPatientInfoStructure(
  geschlechtId: FormTypes.Geschlecht | null,
  alter: FormTypes.Alter,
  patientenchiffre: FormTypes.Patientenchiffre,
  datumBerichterstellung: FormTypes.DatumBerichterstellung
): FormTypes.ChapterNode | null {
  const content = constructPatientInfoContent(geschlechtId, alter, patientenchiffre, datumBerichterstellung);

  if (content.length === 0) return null;

  return {
    type: 'chapter',
    title: 'Basisdaten',
    content,
    id: 'patient-info-chapter'
  };
}

function buildSociodemographicStructure(
  formData: FormTypes.Form
): FormTypes.ChapterNode | null {
  // Use smart sentence combiner for improved text flow
  const improvedText = generateImprovedKapitel1(formData);

  // If no content generated, return null
  if (!improvedText || improvedText.trim().length === 0) {
    return null;
  }

  return {
    type: 'chapter',
    title: '1) Relevante soziodemographische Daten:',
    content: [{ type: 'paragraph', text: improvedText, id: 'sociodemographic-combined' }]
  };
}

/**
 * Main function to generate assessment text from form data
 * This runs entirely in the browser for real-time preview
 *
 * @param formData The form data to generate text from
 * @param previousText Optional previous text for change detection
 */
export function generateAssessmentText(formData: FormTypes.Form, previousText?: string): FormTypes.GeneratedTextResult {
  // Extract patient information
  const geschlechtId = formData.geschlecht;
  const alter = formData.alter;
  const patientenchiffre = formData.patientenchiffre;
  const datumBerichterstellung = formData.datumBerichterstellung;

  // Extract sociodemographic information
  const bildungsweg = formData.bildungsweg || null;
  const beruf = formData.beruf;
  const familienstandId = formData.familienstand;
  // Extract kinder data from discriminated union
  const kinderData = formData.kinder;
  const anzahlKinder = kinderData?.anzahl ?? 0;
  const kinder: FormTypes.KindDetails[] = (kinderData && kinderData.anzahl > 0 && 'details' in kinderData)
    ? [...kinderData.details]
    : [];
  const wohnsituation = formData.wohnsituation || [];
  const finanzielleSituation = formData.finanzielleSituation || [];

  // Extract A-section symptom information (symptom categories now handled by unified generator)
  const verhaltensauffaelligkeiten = formData.verhaltensauffaelligkeiten || { exzesse: {}, defizite: {}, andereExzesse: '', andereDefizite: '' };
  // Note: B-section data (erscheinungsbild through krankheitseinstellung) is now accessed directly
  // via formData in constructPsychischerBefundContent()
  // Somato1-5 are now passed directly to constructSomatischerBefundContent
  const lebensgA = formData.lebensgA || { a1BiographischeEinordnung: '', a2Entwicklung: '' };
  const krankheitsanamnese = formData.krankheitsanamnese || {
    anhaltendeBelastungssituation: '',
    akuteBelastungssituation: '',
    krisensituation: '',
    situationAndere: '',
    erstauftretenSymptome: '',
    beginnAktuelleSymptome: '',
    dauerAktuelleSymptome: '',
    verlaufAktuelleSymptome: '',
    ausloeserVergangenheit: '',
    ausloeserAktuell: '',
  };
  const funktionalesBedingungsmodell = formData.funktionalesBedingungsmodell;
  const kap5Diagnosen = formData.kap5Diagnosen || { selectedDiagnoses: [] };

  // Handle both single values and arrays for future expansion
  const therapieformIds = Array.isArray(formData.therapieform) ? formData.therapieform : (formData.therapieform ? [formData.therapieform] : []);
  const behandlungsformIds = Array.isArray(formData.behandlungsform) ? formData.behandlungsform : (formData.behandlungsform ? [formData.behandlungsform] : []);
  const antragsartId = formData.antragsart;

  // Build the assessment structure (no validation - show whatever is available)
  const patientInfoStructure = buildPatientInfoStructure(geschlechtId, alter, patientenchiffre, datumBerichterstellung);
  const sociodemographicStructure = buildSociodemographicStructure(formData);

  // NOTE: "Allgemeine Antragsdaten" has been moved to Kapitel 6 (see kapitel6Structure below)

  // Build Kapitel 2 - Symptomatik structure (unified generator for all symptom categories)
  const symptomatikContent = constructSymptomatikContent(formData);
  const verhaltensauffaelligkeitenContent = constructVerhaltensauffaelligkeitenContent(verhaltensauffaelligkeiten);
  const testbefundeContent = constructTestbefundeContent(formData.testdiagnostik);

  // Combine symptomatik content (excluding Verhaltensauffaelligkeiten which is handled separately)
  const symptomsContent: FormTypes.ContentNode[] = [
    ...symptomatikContent
  ];

  // Build unified Psychischer Befund content (all sections 1-18 as flowing prose)
  const psychischerBefundContent = constructPsychischerBefundContent(formData);

  // Build Kapitel 2 structure
  const kapitel2Content: FormTypes.ContentNode[] = [];

  // Only show "Symptomatik:" when actual symptomatik content exists
  // Use inline bold heading (like Verhaltensexzesse) instead of section heading to avoid extra line spacing
  if (symptomatikContent.length > 0) {
    // Prepend "**Symptomatik:**  \n" to first content item
    if (symptomsContent.length > 0 && symptomsContent[0].type === 'paragraph') {
      (symptomsContent[0] as FormTypes.ParagraphNode).text = `**Symptomatik:**  \n${(symptomsContent[0] as FormTypes.ParagraphNode).text}`;
    }
    kapitel2Content.push(...symptomsContent);
  }

  // Add Verhaltensauffaelligkeiten as separate paragraphs (not under Symptomatik section)
  if (verhaltensauffaelligkeitenContent.length > 0) {
    kapitel2Content.push(...verhaltensauffaelligkeitenContent);
  }

  // Add Psychischer Befund as flowing prose with inline heading
  if (psychischerBefundContent.length > 0) {
    const befundParagraph = psychischerBefundContent[0] as FormTypes.ParagraphNode;
    befundParagraph.text = `**Psychischer Befund:**  \n${befundParagraph.text}`;
    kapitel2Content.push(...psychischerBefundContent);
  }

  // Add Testbefunde as separate paragraphs
  if (testbefundeContent.length > 0) {
    kapitel2Content.push(...testbefundeContent);
  }

  const kapitel2Structure: FormTypes.ChapterNode | null = kapitel2Content.length > 0 ? {
    type: 'chapter',
    title: '2) Symptomatik und psychischer Befund:',
    content: kapitel2Content
  } : null;

  // Build Kapitel 3 structure (using new type-safe generator)
  const kapitel3Subsections = constructSomatischerBefundContent({
    somato1: formData.somato1,
    somato2: formData.somato2,
    somato3: formData.somato3,
    somato4: formData.somato4,
    somato5: formData.somato5,
    geschlecht: geschlechtId,
  });

  const kapitel3Structure: FormTypes.ChapterNode | null = kapitel3Subsections.length > 0 ? {
    type: 'chapter',
    title: '3) Somatischer Befund / Konsiliarbericht:',
    content: kapitel3Subsections
  } : null;

  // Build Kapitel 4 structure - use inline bold headings like Kapitel 2
  const lebensgAContent = constructLebensgAContent(lebensgA, geschlechtId);
  const krankheitsanamneseContent = constructKrankheitsanamneseContent(krankheitsanamnese);
  const funktionalesBedingungsmodellContent = constructFunktionalesBedingungsmodellContent(funktionalesBedingungsmodell);

  const kapitel4Content: FormTypes.ContentNode[] = [];

  // Lebensgeschichte with inline bold heading
  if (lebensgAContent.length > 0) {
    const lebensgAParagraph = lebensgAContent[0] as FormTypes.ParagraphNode;
    lebensgAParagraph.text = `**Lebensgeschichte:**  \n${lebensgAParagraph.text}`;
    kapitel4Content.push(...lebensgAContent);
  }

  // Krankheitsanamnese with inline bold heading
  if (krankheitsanamneseContent.length > 0) {
    const krankheitsanamneseParagraph = krankheitsanamneseContent[0] as FormTypes.ParagraphNode;
    krankheitsanamneseParagraph.text = `**Krankheitsanamnese:**  \n${krankheitsanamneseParagraph.text}`;
    kapitel4Content.push(...krankheitsanamneseContent);
  }

  // Funktionales Bedingungsmodell with inline bold heading
  if (funktionalesBedingungsmodellContent.length > 0) {
    const funktionalesBedingungsmodellParagraph = funktionalesBedingungsmodellContent[0] as FormTypes.ParagraphNode;
    funktionalesBedingungsmodellParagraph.text = `**Funktionales Bedingungsmodell:**  \n${funktionalesBedingungsmodellParagraph.text}`;
    kapitel4Content.push(...funktionalesBedingungsmodellContent);
  }

  const kapitel4Structure: FormTypes.ChapterNode | null = kapitel4Content.length > 0 ? {
    type: 'chapter',
    title: '4) Behandlungsrelevante Angaben:',
    content: kapitel4Content
  } : null;

  // Build Kapitel 5 structure (using new structured content)
  const kap5DiagnosenContent = constructKap5DiagnosenContent(kap5Diagnosen);
  const kapitel5Structure: FormTypes.ChapterNode | null = kap5DiagnosenContent.length > 0 ? {
    type: 'chapter',
    title: '5) Diagnosen:',
    content: kap5DiagnosenContent
  } : null;

  // Build Kapitel 6: Behandlungsplan und Prognose
  const kapitel6Content = generateKapitel6Content(formData);
  const kapitel6Structure: FormTypes.ChapterNode | null = kapitel6Content.length > 0 ? {
    type: 'chapter',
    title: '6) Behandlungsplan und Prognose:',
    content: kapitel6Content
  } : null;

  // Combine all structures
  const allStructures: FormTypes.ContentNode[] = [];
  // Patient info removed from text - now shown in preview header
  // if (patientInfoStructure) allStructures.push(patientInfoStructure);
  if (sociodemographicStructure) allStructures.push(sociodemographicStructure);
  if (kapitel2Structure) allStructures.push(kapitel2Structure);
  if (kapitel3Structure) allStructures.push(kapitel3Structure);
  if (kapitel4Structure) allStructures.push(kapitel4Structure);
  if (kapitel5Structure) allStructures.push(kapitel5Structure);
  if (kapitel6Structure) allStructures.push(kapitel6Structure);

  const structure: FormTypes.AssessmentStructure = {
    content: allStructures
  };

  // Convert structure to markdown for backward compatibility and highlighting
  const finalText = formatToMarkdown(structure);

  // Detect ALL newly added sentences by comparing with previous text
  const highlightedSentences = previousText ? findNewSentences(previousText, finalText) : [];
  const highlightTimestamp = highlightedSentences.length > 0 ? Date.now() : null;

  return {
    structure,
    text: finalText,
    highlightedSentences,
    highlightTimestamp
  };
}
