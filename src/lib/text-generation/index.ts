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
import {
  constructA2Content,
  constructA3Content,
  constructA4Content,
  constructA5Content,
  constructB10Content,
  constructB11Content,
  constructB12Content,
  constructB13Content,
  constructB14Content,
  constructB15Content,
  constructB16Content,
  constructB17Content,
  constructB18Content,
  constructB1Content,
  constructB2Content,
  constructB3Content,
  constructB4Content,
  constructB5Content,
  constructB6Content,
  constructB7Content,
  constructB8Content,
  constructB9Content,
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
  const a2 = formData.a2 || { symptoms: [], andereSymptome: '' };
  const a3 = formData.a3 || { symptoms: [], andereSymptome: '' };
  const a4 = formData.a4 || { seitWann: [], seitWannAndere: '', verstaerkung: [], verstaerkungAndere: '' };
  const a5 = formData.a5 || { stressfaktoren: [], andereStressfaktoren: '' };
  const b1 = formData.b1 || { pflegezustand: [], koerpergeruch: [], kleidungsstil: [], kleidungszustand: [] };
  const b2 = formData.b2 || { ersterEindruck: [], kontaktverhalten: [] };
  const b3 = formData.b3 || { sprache: [] };
  const b4 = formData.b4 || { quantitativesBewusstsein: [], qualitativesBewusstsein: [] };
  const b5 = formData.b5 || { orientierung: [] };
  const b6 = formData.b6 || { mnestik: [] };
  const b7 = formData.b7 || { konzentration: [] };
  const b8 = formData.b8 || { denkstruktur: [], denkgeschwindigkeit: [] };
  const b9 = formData.b9 || { halluzinationen: [] };
  const b10 = formData.b10 || { inhaltlichesDenken: [] };
  const b11 = formData.b11 || { keineIchStorungen: [], psychotischeIchStorungen: [], nichtPsychotischeIchStorungen: [] };
  const b12 = formData.b12 || { artenVonAngsten: [], symptomeKompensation: [] };
  const b13 = formData.b13 || { zwange: [] };
  const b14 = formData.b14 || { stimmung: [], affekt: [] };
  const b15 = formData.b15 || { antrieb: [] };
  const b16 = formData.b16 || { psychomotorik: [] };
  const b17 = formData.b17 || { gradDerSuizidalitat: [], paktAbspracheFahigkeit: [], abklarungVonSuizidalitat: [] };
  const b18 = formData.b18 || { krankheitseinsicht: [], behandlungsbereitschaft: [] };
  const c = formData.c || '';
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
  const a2Content = constructA2Content(a2);
  const a3Content = constructA3Content(a3);
  const a4Content = constructA4Content(a4);
  const a5Content = constructA5Content(a5);

  // Combine all symptom content nodes
  const symptomsContent: FormTypes.ContentNode[] = [
    ...symptomatikContent,
    ...a2Content, ...a3Content, ...a4Content, ...a5Content
  ];

  // Build B subsections (using new structured content)
  const b1Content = constructB1Content(b1);
  const b2Content = constructB2Content(b2);
  const b3Content = constructB3Content(b3);
  const b4Content = constructB4Content(b4);
  const b5Content = constructB5Content(b5);
  const b6Content = constructB6Content(b6);
  const b7Content = constructB7Content(b7);
  const b8Content = constructB8Content(b8);
  const b9Content = constructB9Content(b9);
  const b10Content = constructB10Content(b10);
  const b11Content = constructB11Content(b11);
  const b12Content = constructB12Content(b12);
  const b13Content = constructB13Content(b13);
  const b14Content = constructB14Content(b14);
  const b15Content = constructB15Content(b15);
  const b16Content = constructB16Content(b16);
  const b17Content = constructB17Content(b17);
  const b18Content = constructB18Content(b18);

  const bSubsections: FormTypes.SubsectionNode[] = [];
  if (b1Content.length > 0) bSubsections.push({ type: 'subsection', title: '1. Erscheinungsbild', content: b1Content });
  if (b2Content.length > 0) bSubsections.push({ type: 'subsection', title: '2. Kontaktverhalten', content: b2Content });
  if (b3Content.length > 0) bSubsections.push({ type: 'subsection', title: '3. Sprache', content: b3Content });
  if (b4Content.length > 0) bSubsections.push({ type: 'subsection', title: '4. Bewusstsein', content: b4Content });
  if (b5Content.length > 0) bSubsections.push({ type: 'subsection', title: '5. Orientierung', content: b5Content });
  if (b6Content.length > 0) bSubsections.push({ type: 'subsection', title: '6. Mnestik (Gedächtnis)', content: b6Content });
  if (b7Content.length > 0) bSubsections.push({ type: 'subsection', title: '7. Konzentration und Auffassung', content: b7Content });
  if (b8Content.length > 0) bSubsections.push({ type: 'subsection', title: '8. Formales Denken', content: b8Content });
  if (b9Content.length > 0) bSubsections.push({ type: 'subsection', title: '9. Wahrnehmung', content: b9Content });
  if (b10Content.length > 0) bSubsections.push({ type: 'subsection', title: '10. Inhaltliches Denken', content: b10Content });
  if (b11Content.length > 0) bSubsections.push({ type: 'subsection', title: '11. Ich-Störungen', content: b11Content });
  if (b12Content.length > 0) bSubsections.push({ type: 'subsection', title: '12. Ängste', content: b12Content });
  if (b13Content.length > 0) bSubsections.push({ type: 'subsection', title: '13. Zwänge', content: b13Content });
  if (b14Content.length > 0) bSubsections.push({ type: 'subsection', title: '14. Stimmung und Affekt', content: b14Content });
  if (b15Content.length > 0) bSubsections.push({ type: 'subsection', title: '15. Antrieb, Interesse und Freudeempfinden', content: b15Content });
  if (b16Content.length > 0) bSubsections.push({ type: 'subsection', title: '16. Psychomotorik', content: b16Content });
  if (b17Content.length > 0) bSubsections.push({ type: 'subsection', title: '17. Suizidalität', content: b17Content });
  if (b18Content.length > 0) bSubsections.push({ type: 'subsection', title: '18. Krankheitseinstellung', content: b18Content });

  // Build Kapitel 2 structure
  const kapitel2Content: FormTypes.ContentNode[] = [];
  if (symptomsContent.length > 0) {
    kapitel2Content.push({
      type: 'section',
      title: 'Symptomatik:',
      content: symptomsContent
    });
  }
  if (bSubsections.length > 0) {
    kapitel2Content.push({
      type: 'section',
      title: 'B Psychopathologischer Befund / Psychischer Befund (AMDP)',
      content: bSubsections
    });
  }
  if (c) {
    kapitel2Content.push({
      type: 'section',
      title: 'C Testdiagnostische Ergebnisse',
      content: [{ type: 'paragraph', text: c }]
    });
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
