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
  constructLebensgBContent,
  constructLebensgCContent,
  // New Somato structured content functions
  constructSomato1Content,
  constructSomato2Content,
  constructSomato3Content,
  constructSomato4Content,
  constructSomato5Content
} from './symptom-generator';

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
    title: '1) Relevante soziodemographische Daten',
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
  const somato1 = formData.somato1 || { somatischeVorerkrankungen: '' };
  const somato2 = formData.somato2 || { keineMedikation: false, praeparat: '', dosierung: '', dauerEinheit: '', dauerWert: '', verschriebenVon: '', verschriebenVonAndere: '' };
  const somato3 = formData.somato3 || { keineVorbehandlung: false, settingVorbehandlung: '', behandlungszeitraumEinheit: '', behandlungszeitraumWert: '', behandlungsort: '', abschlussberichte: '', abschlussberichteAndere: '' };
  const somato4 = formData.somato4 || { familienanamnese: '', familiaeHaeufungText: '' };
  const somato5 = formData.somato5 || { keineSucht: false, alkoholSuchtmittel: [], bierMengeLiter: '', bierMengeGlaeser: '', weinMengeLiter: '', weinMengeGlaeser: '', schnapsMengeLiter: '', schnapsMengeGlaeser: '', alkoholHaeufigkeit: '', rauchenAnzahl: '', rauchenHaeufigkeit: '', thcMenge: '', thcHaeufigkeit: '', illegaleSuchtmittel: '', illegaleMenge: '', illegaleHaeufigkeit: '', andereSuchtform: '' };
  const lebensgA = formData.lebensgA || { a1BiographischeEinordnung: '', a2Entwicklung: '' };
  const lebensgB = formData.lebensgB || { b1SituationPsychotherapie: '', b2BeginnDauerVerlauf: '', b3AusloesendeFaktoren: '' };
  const lebensgC = formData.lebensgC || {
    c1SituationExtern: '', c1SituationIntern: '', c1Organismus: '', c1ReaktionKognitiv: '', c1ReaktionEmotional: '', c1ReaktionPhysiologisch: '', c1ReaktionBehavioral: '',
    c1KonsequenzKurzfristigCPlus: '', c1KonsequenzKurzfristigCMinus: '', c1KonsequenzKurzfristigCPlusSlash: '', c1KonsequenzKurzfristigCMinusSlash: '',
    c1KonsequenzLangfristigCPlus: '', c1KonsequenzLangfristigCMinus: '', c1KonsequenzLangfristigCPlusSlash: '', c1KonsequenzLangfristigCMinusSlash: '',
    c21KognitivGrundbeduerfnisse: [], c21KognitivGrundbeduerfnisseAndere: '', c21KognitivGrundannahmen: '',
    c21KognitivPlaeneAnnaehrung: '', c21KognitivPlaeneVermeidung: '', c21KognitivPlaeneAndere: '', c21KognitivPersoenlichkeit: '',
    c21KognitivFruehkindlich: [], c21KognitivFruehkindlichAndere: '',
    c21BiologischGenetisch: [], c21BiologischGenetischAndere: '',
    c21SozialeVulnerabilitaet: [], c21SozialeVulnerabilitaetAndere: ''
  };
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
    title: '2) Symptomatik und psychischer Befund',
    content: kapitel2Content
  } : null;

  // Build Kapitel 3 structure (using new structured content)
  const somato1Content = constructSomato1Content(somato1);
  const somato2Content = constructSomato2Content(somato2);
  const somato3Content = constructSomato3Content(somato3);
  const somato4Content = constructSomato4Content(somato4);
  const somato5Content = constructSomato5Content(somato5);

  const kapitel3Subsections: FormTypes.SubsectionNode[] = [];
  if (somato1Content.length > 0) kapitel3Subsections.push({ type: 'subsection', title: '1. Somatische Vorerkrankungen', content: somato1Content });
  if (somato2Content.length > 0) kapitel3Subsections.push({ type: 'subsection', title: '2. Psychopharmakologische Medikation zu Behandlungsbeginn (und -ende)', content: somato2Content });
  if (somato3Content.length > 0) kapitel3Subsections.push({ type: 'subsection', title: '3. Psychotherapeutische/psychosomatische/psychiatrische Vorbehandlungen', content: somato3Content });
  if (somato4Content.length > 0) kapitel3Subsections.push({ type: 'subsection', title: '4. Familienanamnese', content: somato4Content });
  if (somato5Content.length > 0) kapitel3Subsections.push({ type: 'subsection', title: '5. Suchtanamnese', content: somato5Content });

  const kapitel3Structure: FormTypes.ChapterNode | null = kapitel3Subsections.length > 0 ? {
    type: 'chapter',
    title: 'Kapitel 3: Somatischer Befund',
    content: kapitel3Subsections
  } : null;

  // Build Kapitel 4 structure (using new structured content)
  const lebensgAContent = constructLebensgAContent(lebensgA);
  const lebensgBContent = constructLebensgBContent(lebensgB);
  const lebensgCContent = constructLebensgCContent(lebensgC);

  const kapitel4Sections: FormTypes.SectionNode[] = [];
  if (lebensgAContent.length > 0) kapitel4Sections.push({ type: 'section', title: 'A. Relevante Angaben zur Lebensgeschichte', content: lebensgAContent });
  if (lebensgBContent.length > 0) kapitel4Sections.push({ type: 'section', title: 'B. Relevante Angaben zur Krankheitsanamnese', content: lebensgBContent });
  if (lebensgCContent.length > 0) kapitel4Sections.push({ type: 'section', title: 'C. Funktionales Bedingungsmodell', content: lebensgCContent });

  const kapitel4Structure: FormTypes.ChapterNode | null = kapitel4Sections.length > 0 ? {
    type: 'chapter',
    title: 'Kapitel 4: Relevante Angaben zur Lebensgeschichte',
    content: kapitel4Sections
  } : null;

  // Build Kapitel 5 structure (using new structured content)
  const kap5DiagnosenContent = constructKap5DiagnosenContent(kap5Diagnosen);
  const kapitel5Structure: FormTypes.ChapterNode | null = kap5DiagnosenContent.length > 0 ? {
    type: 'chapter',
    title: 'Kapitel 5: Diagnosen',
    content: kap5DiagnosenContent
  } : null;

  // Build Kapitel 6: Behandlungsplan und Prognose
  const kapitel6Content = generateKapitel6Content(formData);
  const kapitel6Structure: FormTypes.ChapterNode | null = kapitel6Content.length > 0 ? {
    type: 'chapter',
    title: 'Kapitel 6: Behandlungsplan und Prognose',
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
