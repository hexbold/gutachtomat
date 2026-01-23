/**
 * Lebensgeschichte Text Generator
 *
 * Generates German "Fließtext" in Konjunktiv I for the Lebensgeschichte section.
 */

import * as FormTypes from '@/lib/core/form-types';
import { GenderPronouns } from '@/lib/text-generation/pronoun-utils';
import { ensurePunctuation } from '@/lib/text-generation/text-utils';
import {
  BEZIEHUNGS_EIGENSCHAFT_LABELS,
  KRITISCHE_VERHALTENSWEISE_LABELS,
  VERLETZTES_GRUNDBEDUERFNIS_LABELS,
} from '@/lib/core/form-labels';

interface ParagraphNode {
  type: 'paragraph';
  text: string;
  id: string;
}

/**
 * Formats selected CardSelection items into a comma-separated list with "und"
 */
function formatCardSelectionLabels<E extends string>(
  selection: FormTypes.CardSelection<E> | undefined,
  labels: Record<E, string>
): string {
  if (!selection) return '';

  const items: string[] = [];
  for (const key of Object.keys(selection) as E[]) {
    const entry = selection[key];
    if (entry?.selected) {
      let label = labels[key] || key;
      if (entry.details?.brackets) {
        label += ` (${entry.details.brackets})`;
      }
      items.push(label.toLowerCase());
    }
  }

  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return items.slice(0, -1).join(', ') + ' und ' + items[items.length - 1];
}

/**
 * Generates prose for a single parent (Vater/Mutter)
 */
function generateElternteilProse(
  elternteil: FormTypes.Elternteil,
  role: 'Vater' | 'Mutter'
): string[] {
  if (!elternteil.vorhanden) return [];

  const data = elternteil.data;
  const sentences: string[] = [];

  // Use correct article and pronoun based on role
  const artikel = role === 'Vater' ? 'Der' : 'Die';
  const pronoun = role === 'Vater' ? 'Er' : 'Sie';

  // Basic info
  let baseSentence = `${artikel} ${role}`;
  if (data.geburtsjahr) {
    baseSentence += ` (*${data.geburtsjahr})`;
  }
  if (data.beruf) {
    baseSentence += ` sei ${data.beruf} gewesen`;
  }
  baseSentence += '.';
  sentences.push(baseSentence);

  // Beziehungseigenschaften
  const eigenschaften = formatCardSelectionLabels(data.beziehungsEigenschaften, BEZIEHUNGS_EIGENSCHAFT_LABELS);
  if (eigenschaften) {
    sentences.push(`${pronoun} sei ${eigenschaften} gewesen.`);
  }
  if (data.beziehungsEigenschaftenAndere) {
    sentences.push(ensurePunctuation(data.beziehungsEigenschaftenAndere));
  }

  // Kritische Verhaltensweisen
  const verhaltensweisen = formatCardSelectionLabels(data.kritischeVerhaltensweisen, KRITISCHE_VERHALTENSWEISE_LABELS);
  if (verhaltensweisen) {
    sentences.push(`Es habe ${verhaltensweisen} gegeben.`);
  }
  if (data.kritischeVerhaltensweiseAndere) {
    sentences.push(ensurePunctuation(data.kritischeVerhaltensweiseAndere));
  }

  // Verletzte Grundbedürfnisse
  const grundbeduerfnisse = formatCardSelectionLabels(data.verletzteGrundbeduerfnisse, VERLETZTES_GRUNDBEDUERFNIS_LABELS);
  if (grundbeduerfnisse) {
    sentences.push(`Dadurch seien die Grundbedürfnisse nach ${grundbeduerfnisse} verletzt worden.`);
  }
  if (data.verletzteGrundbeduerfnisseAndere) {
    sentences.push(ensurePunctuation(data.verletzteGrundbeduerfnisseAndere));
  }

  return sentences;
}

/**
 * Generates prose for siblings
 */
function generateGeschwisterProse(geschwister: FormTypes.Geschwister, pronouns: GenderPronouns): string[] {
  if (geschwister.keineGeschwister) {
    return [`${pronouns.derDie} habe keine Geschwister.`];
  }

  const liste = geschwister.liste;
  if (liste.length === 0) return [];

  const sentences: string[] = [];
  sentences.push(`${pronouns.derDie} habe ${liste.length} Geschwister.`);

  for (const g of liste) {
    const geschlechtLabel = g.geschlecht ? (g.geschlecht === FormTypes.Geschlecht.M ? 'Bruder' : 'Schwester') : 'Geschwister';
    let sentence = geschlechtLabel;
    if (g.geburtsjahr) {
      sentence += ` (*${g.geburtsjahr})`;
    }
    if (g.beziehung) {
      sentence += ` - ${g.beziehung}`;
    }
    sentence += '.';
    sentences.push(sentence);
  }

  return sentences;
}

/**
 * Generates prose for other reference persons
 * Creates proper German sentences like "Ein Lehrer (*1947) sei fürsorglich gewesen."
 */
function generateAndereBezugspersonenProse(personen: FormTypes.AndereBezugspersonEntry[]): string[] {
  if (personen.length === 0) return [];

  const sentences: string[] = [];
  for (const p of personen) {
    // Determine article based on gender or use generic
    let artikel = 'Eine';
    if (p.geschlecht === FormTypes.Geschlecht.M) {
      artikel = 'Ein';
    } else if (p.geschlecht === FormTypes.Geschlecht.W) {
      artikel = 'Eine';
    }

    const wer = p.wer || 'Bezugsperson';
    let sentence = `${artikel} ${wer}`;
    if (p.geburtsjahr) {
      sentence += ` (*${p.geburtsjahr})`;
    }
    sentence += ' sei';
    if (p.beziehung) {
      sentence += ` ${p.beziehung}`;
    }
    sentence += ' gewesen.';
    sentences.push(sentence);
  }

  return sentences;
}

/**
 * Main generator function for Lebensgeschichte section
 */
export function generateLebensgeschichteParagraphs(
  data: FormTypes.LebensgAData,
  pronouns: GenderPronouns
): ParagraphNode[] {
  const paragraphs: ParagraphNode[] = [];
  let idCounter = 0;

  const addParagraph = (text: string) => {
    if (text.trim()) {
      paragraphs.push({
        type: 'paragraph',
        text: text.trim(),
        id: `lebensgeschichte-${idCounter++}`,
      });
    }
  };

  // Part 1: Kurze biographische Einordnung
  const bio = data.kurzeBiographischeEinordnung;

  // Birth info
  if (bio.geburtsjahr || bio.geburtsort) {
    let birthSentence = `${pronouns.derDie} ist`;
    if (bio.geburtsjahr) {
      birthSentence += ` ${bio.geburtsjahr} geboren worden`;
    }
    if (bio.geburtsort) {
      birthSentence += ` und sei in ${bio.geburtsort} aufgewachsen`;
    }
    birthSentence += '.';
    addParagraph(birthSentence);
  }

  // Parents
  const vaterProse = generateElternteilProse(bio.vater, 'Vater');
  if (vaterProse.length > 0) {
    addParagraph(vaterProse.join(' '));
  }

  const mutterProse = generateElternteilProse(bio.mutter, 'Mutter');
  if (mutterProse.length > 0) {
    addParagraph(mutterProse.join(' '));
  }

  // Geschwister
  const geschwisterProse = generateGeschwisterProse(bio.geschwister, pronouns);
  if (geschwisterProse.length > 0) {
    addParagraph(geschwisterProse.join(' '));
  }

  // Andere Bezugspersonen
  const bezugspersonenProse = generateAndereBezugspersonenProse(bio.andereBezugspersonen);
  if (bezugspersonenProse.length > 0) {
    addParagraph(bezugspersonenProse.join(' '));
  }

  // Weitere Angaben Part 1
  if (bio.weitereAngaben) {
    addParagraph(ensurePunctuation(bio.weitereAngaben));
  }

  // Part 2: Lebensgeschichtliche Entwicklung
  // Only output the user's text with proper punctuation, no structural prefixes
  const entwicklung = data.lebensgeschichtlicheEntwicklung;

  if (entwicklung.kindheitUndErziehung) {
    addParagraph(ensurePunctuation(entwicklung.kindheitUndErziehung));
  }

  if (entwicklung.jugend) {
    addParagraph(ensurePunctuation(entwicklung.jugend));
  }

  if (entwicklung.schulischerBeruflichWerdegang) {
    addParagraph(ensurePunctuation(entwicklung.schulischerBeruflichWerdegang));
  }

  if (entwicklung.finanziellesFamiliaresUmfeld) {
    addParagraph(ensurePunctuation(entwicklung.finanziellesFamiliaresUmfeld));
  }

  if (entwicklung.beziehungen) {
    addParagraph(ensurePunctuation(entwicklung.beziehungen));
  }

  if (entwicklung.interessenHobbies) {
    addParagraph(ensurePunctuation(entwicklung.interessenHobbies));
  }

  if (entwicklung.praegendeTraumatischeEreignisse) {
    addParagraph(ensurePunctuation(entwicklung.praegendeTraumatischeEreignisse));
  }

  if (entwicklung.andere) {
    addParagraph(ensurePunctuation(entwicklung.andere));
  }

  // Weitere Angaben Part 2
  if (entwicklung.weitereAngaben) {
    addParagraph(ensurePunctuation(entwicklung.weitereAngaben));
  }

  // Legacy fields
  if (data.a1BiographischeEinordnung) {
    addParagraph(ensurePunctuation(data.a1BiographischeEinordnung));
  }

  if (data.a2Entwicklung) {
    addParagraph(ensurePunctuation(data.a2Entwicklung));
  }

  return paragraphs;
}

/**
 * Generates a single text string from Lebensgeschichte data
 */
export function generateLebensgeschichteText(
  data: FormTypes.LebensgAData,
  pronouns: GenderPronouns
): string {
  const paragraphs = generateLebensgeschichteParagraphs(data, pronouns);
  return paragraphs.map(p => p.text).join('\n\n');
}
