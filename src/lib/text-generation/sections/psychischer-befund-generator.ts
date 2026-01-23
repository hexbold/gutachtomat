/**
 * Psychischer Befund Text Generation
 *
 * Generates German clinical prose for the Psychischer Befund (AMDP) sections.
 * Following the same pattern as symptomatik-generator.ts - using collectors + unified prose generation.
 */

import * as FormTypes from '../../core/form-types';
import {
  Kontaktverhalten,
  Sprache,
  Bewusstsein,
  Orientierung,
  Mnestik,
  KonzentrationUndAuffassung,
  FormalesDenken,
  Wahrnehmung,
  InhaltlichesDenken,
  IchStoerungen,
  Aengste,
  Zwaenge,
  StimmungUndAffekt,
  AntriebInteresseFreude,
  Psychomotorik,
  Suizidalitaet,
  Krankheitseinstellung,
} from '../../core/form-types';
import { getPronounsForGender, GenderPronouns } from '../pronoun-utils';
import {
  ERSCHEINUNGSBILD_PFLEGEZUSTAND_LABELS,
  ERSCHEINUNGSBILD_KOERPERGERUCH_LABELS,
  ERSCHEINUNGSBILD_KLEIDUNGSSTIL_LABELS,
  ERSCHEINUNGSBILD_KLEIDUNGSZUSTAND_LABELS,
  ERSCHEINUNGSBILD_KLEIDUNGSANGEMESSENHEIT_LABELS,
} from '../../core/form-labels';

// Type for paragraph nodes (matches existing pattern)
interface ParagraphNode {
  type: 'paragraph';
  text: string;
  id: string;
}

// ===========================================
// SHARED UTILITIES
// ===========================================

/**
 * Formats list with commas and "und": ["A", "B", "C"] -> "A, B und C"
 */
function formatListWithUnd(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} und ${items[1]}`;

  const allButLast = items.slice(0, -1).join(', ');
  const last = items[items.length - 1];
  return `${allButLast} und ${last}`;
}

/**
 * Formats Pflegezustand items, highlighting contradiction between "gepflegt" and "ungepflegt".
 * When both are present: "gepflegt, vernachlässigt, aber dennoch ungepflegt"
 * Otherwise: normal "und" formatting
 */
function formatPflegezustandWithContradiction(items: string[]): string {
  const lowered = items.map(i => i.toLowerCase());
  const hasGepflegt = lowered.includes('gepflegt');
  const hasUngepflegt = lowered.includes('ungepflegt');

  if (hasGepflegt && hasUngepflegt && items.length >= 2) {
    const withoutUngepflegt = items.filter(i => i.toLowerCase() !== 'ungepflegt');
    const prefix = formatListWithUnd(withoutUngepflegt.map(s => s.toLowerCase()));
    return `${prefix}, aber dennoch ungepflegt`;
  }

  return formatListWithUnd(items.map(s => s.toLowerCase()));
}

/**
 * Lowercases only the first character (preserves German noun capitalization)
 * "Mit Panikattacken" -> "mit Panikattacken"
 */
function lowercaseFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * Formats CardSelection items: brackets in parentheses, text as inline sentences.
 * Iterates over enumValues (not labels keys) to ensure consistent enum-defined order.
 */
function formatCardSelection<E extends string>(
  selection: FormTypes.CardSelection<E> | undefined,
  labels: Record<E, string>,
  enumValues: E[]
): string[] {
  if (!selection) return [];

  const result: string[] = [];
  for (const key of enumValues) {
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
        result.push(`${labelPart}. ${text}`);
      } else {
        result.push(labelPart);
      }
    }
  }
  return result;
}

// ===========================================
// B1: ERSCHEINUNGSBILD COLLECTOR
// ===========================================

interface ErscheinungsbildItems {
  pflegezustand: string[];
  kleidungsstil: string[];
  kleidungszustand: string[];
  kleidungsangemessenheit: string[];
  koerpergeruch: string[];
}

/**
 * Collects formatted items from Erscheinungsbild data
 * Uses Object.values(Enum) to ensure consistent enum-defined order (matches modal rendering)
 */
function collectErscheinungsbildItems(data: FormTypes.Erscheinungsbild): ErscheinungsbildItems {
  return {
    pflegezustand: formatCardSelection(
      data.pflegezustand,
      ERSCHEINUNGSBILD_PFLEGEZUSTAND_LABELS,
      Object.values(FormTypes.ErscheinungsbildPflegezustand)
    ),
    kleidungsstil: formatCardSelection(
      data.kleidungsstil,
      ERSCHEINUNGSBILD_KLEIDUNGSSTIL_LABELS,
      Object.values(FormTypes.ErscheinungsbildKleidungsstil)
    ),
    kleidungszustand: formatCardSelection(
      data.kleidungszustand,
      ERSCHEINUNGSBILD_KLEIDUNGSZUSTAND_LABELS,
      Object.values(FormTypes.ErscheinungsbildKleidungszustand)
    ),
    kleidungsangemessenheit: formatCardSelection(
      data.kleidungsangemessenheit,
      ERSCHEINUNGSBILD_KLEIDUNGSANGEMESSENHEIT_LABELS,
      Object.values(FormTypes.ErscheinungsbildKleidungsangemessenheit)
    ),
    koerpergeruch: formatCardSelection(
      data.koerpergeruch,
      ERSCHEINUNGSBILD_KOERPERGERUCH_LABELS,
      Object.values(FormTypes.ErscheinungsbildKoerpergeruch)
    ),
  };
}

// ===========================================
// B1: PROSE GENERATOR
// ===========================================

/**
 * Processes an item that may contain inline extra text (". " pattern).
 * Returns the main label and any extra text sentences as separate array entries.
 */
function processItemWithExtraText(item: string, sentencePrefix: string): string[] {
  const result: string[] = [];

  if (item.includes('. ')) {
    // Has inline extra text: "Gepflegt (sauber). Extra text here."
    const [labelPart, ...rest] = item.split('. ');
    result.push(`${sentencePrefix}${labelPart.toLowerCase()}`);
    // Add the extra text as a separate sentence
    const extraText = rest.join('. ').replace(/\.$/, '');
    if (extraText.trim()) {
      result.push(extraText);
    }
  } else {
    result.push(`${sentencePrefix}${item.toLowerCase()}`);
  }

  return result;
}

/**
 * Generates prose sentences for Erscheinungsbild section.
 * Items without extra text can be combined; items with extra text get separate sentences.
 */
function generateErscheinungsbildProse(
  items: ErscheinungsbildItems,
  pronouns: GenderPronouns
): ParagraphNode[] {
  const sentences: string[] = [];
  const p = pronouns;

  // Pflegezustand: "Die Patientin wirkte gepflegt (sauber). Extra text."
  // Contradiction handling: "gepflegt, aber dennoch ungepflegt"
  if (items.pflegezustand.length > 0) {
    let pending: string[] = [];
    for (const item of items.pflegezustand) {
      if (item.includes('. ')) {
        if (pending.length > 0) {
          sentences.push(`${p.derDie} wirkte ${formatPflegezustandWithContradiction(pending)}`);
          pending = [];
        }
        sentences.push(...processItemWithExtraText(item, `${p.derDie} wirkte `));
      } else {
        pending.push(item);
      }
    }
    if (pending.length > 0) {
      sentences.push(`${p.derDie} wirkte ${formatPflegezustandWithContradiction(pending)}`);
    }
  }

  // Kleidungsstil: "Die Kleidung war modisch und klassisch."
  if (items.kleidungsstil.length > 0) {
    let pending: string[] = [];
    for (const item of items.kleidungsstil) {
      if (item.includes('. ')) {
        if (pending.length > 0) {
          sentences.push(`Die Kleidung war ${formatListWithUnd(pending.map(s => s.toLowerCase()))}`);
          pending = [];
        }
        sentences.push(...processItemWithExtraText(item, 'Die Kleidung war '));
      } else {
        pending.push(item);
      }
    }
    if (pending.length > 0) {
      sentences.push(`Die Kleidung war ${formatListWithUnd(pending.map(s => s.toLowerCase()))}`);
    }
  }

  // Kleidungszustand: "Der Kleidungszustand war sauber."
  if (items.kleidungszustand.length > 0) {
    let pending: string[] = [];
    for (const item of items.kleidungszustand) {
      if (item.includes('. ')) {
        if (pending.length > 0) {
          sentences.push(`Der Kleidungszustand war ${formatListWithUnd(pending.map(s => s.toLowerCase()))}`);
          pending = [];
        }
        sentences.push(...processItemWithExtraText(item, 'Der Kleidungszustand war '));
      } else {
        pending.push(item);
      }
    }
    if (pending.length > 0) {
      sentences.push(`Der Kleidungszustand war ${formatListWithUnd(pending.map(s => s.toLowerCase()))}`);
    }
  }

  // Kleidungsangemessenheit: "Die Kleidung war zur Umgebungstemperatur angemessen."
  if (items.kleidungsangemessenheit.length > 0) {
    let pending: string[] = [];
    for (const item of items.kleidungsangemessenheit) {
      if (item.includes('. ')) {
        if (pending.length > 0) {
          sentences.push(`Die Kleidung war ${formatListWithUnd(pending.map(s => s.toLowerCase()))}`);
          pending = [];
        }
        sentences.push(...processItemWithExtraText(item, 'Die Kleidung war '));
      } else {
        pending.push(item);
      }
    }
    if (pending.length > 0) {
      sentences.push(`Die Kleidung war ${formatListWithUnd(pending.map(s => s.toLowerCase()))}`);
    }
  }

  // Körpergeruch: Special handling for "Unauffällig"
  if (items.koerpergeruch.length > 0) {
    const hasUnauffaellig = items.koerpergeruch.some(i => i.toLowerCase().startsWith('unauffällig'));

    if (hasUnauffaellig && items.koerpergeruch.length === 1) {
      // Only "Unauffällig" selected - use negative formulation
      const item = items.koerpergeruch[0];
      if (item.includes('. ')) {
        // Has extra text
        const [, ...rest] = item.split('. ');
        sentences.push('Ein auffälliger Körpergeruch war nicht feststellbar');
        const extraText = rest.join('. ').replace(/\.$/, '');
        if (extraText.trim()) {
          sentences.push(extraText);
        }
      } else {
        sentences.push('Ein auffälliger Körpergeruch war nicht feststellbar');
      }
    } else {
      // Other geruch items selected - process in order (no lowercasing for nouns)
      const other = items.koerpergeruch.filter(i => !i.toLowerCase().startsWith('unauffällig'));
      if (other.length > 0) {
        let pendingSimple: string[] = [];

        for (const item of other) {
          if (item.includes('. ')) {
            // Flush pending simple items first (preserves order)
            if (pendingSimple.length > 0) {
              sentences.push(`Es bestand ${formatListWithUnd(pendingSimple)}`);
              pendingSimple = [];
            }
            // Then add this detailed item
            sentences.push(...processItemWithExtraText(item, 'Es bestand '));
          } else {
            pendingSimple.push(item);
          }
        }
        // Flush remaining simple items
        if (pendingSimple.length > 0) {
          sentences.push(`Es bestand ${formatListWithUnd(pendingSimple)}`);
        }
      }
    }
  }

  // If no selections, return empty
  if (sentences.length === 0) {
    return [];
  }

  // Combine all sentences into one paragraph
  const fullText = sentences.join('. ') + '.';

  return [{
    type: 'paragraph',
    text: fullText,
    id: 'b1-erscheinungsbild'
  }];
}

// ===========================================
// MAIN EXPORT: Construct B1 Content
// ===========================================

/**
 * Constructs structured content for B1 (Erscheinungsbild) section.
 * Returns ParagraphNode array for use by the text generation pipeline.
 */
export function constructErscheinungsbildContent(
  data: FormTypes.Erscheinungsbild,
  gender: FormTypes.Geschlecht | null
): ParagraphNode[] {
  const pronouns = getPronounsForGender(gender);
  const items = collectErscheinungsbildItems(data);
  return generateErscheinungsbildProse(items, pronouns);
}

// ===========================================
// SECTIONS 2-18: SENTENCE GENERATORS
// ===========================================
// Each section gets its own sentence generator with proper German grammar.
// Returns null if no data, returns properly formatted sentence otherwise.

/**
 * Section 2: Kontaktverhalten
 * "Der Patient zeigte sich freundlich und offen im Kontakt."
 */
function generateKontaktverhaltenSentence(data: Kontaktverhalten | undefined, p: GenderPronouns): string | null {
  if (!data) return null;
  const items: string[] = [];
  if (data.ersterEindruck?.length > 0) items.push(...data.ersterEindruck);
  if (data.kontaktverhalten?.length > 0) items.push(...data.kontaktverhalten);
  if (items.length === 0) return null;

  // Separate "wirkend" items (e.g., "Jünger wirkend") from regular items
  const wirkendItems = items.filter(i => i.toLowerCase().endsWith('wirkend'));
  const otherItems = items.filter(i => !i.toLowerCase().endsWith('wirkend'));

  const sentences: string[] = [];

  if (wirkendItems.length > 0) {
    // "Die Patientin wirkte jünger." (strip "wirkend")
    const adjectives = wirkendItems.map(i => i.replace(/\s*wirkend$/i, '').toLowerCase());
    sentences.push(`${p.derDie} wirkte ${formatListWithUnd(adjectives)}.`);
  }

  if (otherItems.length > 0) {
    // "Die Patientin zeigte sich freundlich im Kontakt."
    sentences.push(`${p.derDie} zeigte sich ${formatListWithUnd(otherItems.map(lowercaseFirst))} im Kontakt.`);
  }

  return sentences.join(' ');
}

/**
 * Section 3: Sprache
 * "Die Sprache war moduliert und flüssig."
 */
function generateSpracheSentence(data: Sprache | undefined): string | null {
  if (!data?.sprache?.length) return null;
  return `Die Sprache war ${formatListWithUnd(data.sprache.map(lowercaseFirst))}.`;
}

/**
 * Section 4: Bewusstsein
 * "Das Bewusstsein war wach und klar."
 */
function generateBewusstseinSentence(data: Bewusstsein | undefined): string | null {
  if (!data) return null;
  const items: string[] = [];
  if (data.quantitativesBewusstsein?.length > 0) items.push(...data.quantitativesBewusstsein);
  if (data.qualitativesBewusstsein?.length > 0) items.push(...data.qualitativesBewusstsein);
  if (items.length === 0) return null;

  return `Das Bewusstsein war ${formatListWithUnd(items.map(lowercaseFirst))}.`;
}

/**
 * Section 5: Orientierung
 * Values: "Vollständig orientiert", "Unscharf orientiert", "Nicht orientiert"
 * Uses patient as subject: "Der Patient war vollständig orientiert."
 */
function generateOrientierungSentence(data: Orientierung | undefined, p: GenderPronouns): string | null {
  if (!data?.orientierung?.length) return null;
  // p.derDie already contains "Der Patient" / "Die Patientin"
  return `${p.derDie} war ${formatListWithUnd(data.orientierung.map(lowercaseFirst))}.`;
}

/**
 * Section 6: Mnestik
 * "Merkfähigkeit und Gedächtnis waren unbeeinträchtigt."
 */
function generateMnestikSentence(data: Mnestik | undefined): string | null {
  if (!data?.mnestik?.length) return null;
  return `Merkfähigkeit und Gedächtnis waren ${formatListWithUnd(data.mnestik.map(lowercaseFirst))}.`;
}

/**
 * Section 7: Konzentration und Auffassung
 * "Konzentration und Auffassung zeigten sich unauffällig."
 */
function generateKonzentrationSentence(data: KonzentrationUndAuffassung | undefined): string | null {
  if (!data?.konzentration?.length) return null;
  return `Konzentration und Auffassung zeigten sich ${formatListWithUnd(data.konzentration.map(lowercaseFirst))}.`;
}

// Section 8: Formales Denken - Item classification by sentence template
const FORMALES_DENKEN_ADJECTIVES = ['geordnet', 'gehemmt', 'eingeengt', 'perseverierend', 'weitschweifig', 'sprunghaft'];
const FORMALES_DENKEN_ES_BESTAND = ['Grübeln', 'Gedankenabreißen', 'Gedankendrängen'];
const FORMALES_DENKEN_ES_ZEIGTE_SICH = ['Fehlendes Fortkommen', 'Verbigerationen'];

/**
 * Section 8: Formales Denken
 * Groups items by sentence template:
 * - Adjectives: "Das formale Denken war geordnet und gehemmt."
 * - "Es bestand" nouns: "Es bestand Grübeln und Gedankendrängen."
 * - "Es zeigte sich" nouns: "Es zeigte sich fehlendes Fortkommen."
 */
function generateFormalesDenkenSentence(data: FormalesDenken | undefined): string | null {
  if (!data) return null;
  const sentences: string[] = [];

  // Process denkstruktur - group by template
  if (data.denkstruktur?.length > 0) {
    const adjectives = data.denkstruktur.filter(i =>
      FORMALES_DENKEN_ADJECTIVES.includes(i.toLowerCase())
    );
    const esBestandNouns = data.denkstruktur.filter(i =>
      FORMALES_DENKEN_ES_BESTAND.includes(i)
    );
    const esZeigteSichNouns = data.denkstruktur.filter(i =>
      FORMALES_DENKEN_ES_ZEIGTE_SICH.includes(i)
    );

    // Adjectives can be combined (same template: "X war Y")
    if (adjectives.length > 0) {
      sentences.push(`Das formale Denken war ${formatListWithUnd(adjectives.map(lowercaseFirst))}.`);
    }
    // "Es bestand" nouns can be combined
    if (esBestandNouns.length > 0) {
      sentences.push(`Es bestand ${formatListWithUnd(esBestandNouns)}.`);
    }
    // "Es zeigte sich" nouns can be combined
    if (esZeigteSichNouns.length > 0) {
      sentences.push(`Es zeigte sich ${formatListWithUnd(esZeigteSichNouns.map(lowercaseFirst))}.`);
    }
  }

  // Process denkgeschwindigkeit (all adjectives - can be combined)
  if (data.denkgeschwindigkeit?.length > 0) {
    sentences.push(`Die Denkgeschwindigkeit war ${formatListWithUnd(data.denkgeschwindigkeit.map(lowercaseFirst))}.`);
  }

  if (sentences.length === 0) return null;
  return sentences.join(' ');
}

/**
 * Section 9: Wahrnehmung
 * Values: "akustisch", "visuell", "taktil / olfaktorisch / gustatorisch", "sonstige Sinneswahrnehmungen"
 * One sentence per item, transforms adjectives to noun phrases.
 */
function generateWahrnehmungSentence(data: Wahrnehmung | undefined, p: GenderPronouns): string | null {
  if (!data?.halluzinationen?.length) return null;

  const hallucinationAdjectives: string[] = [];
  const otherPerceptions: string[] = [];

  for (const item of data.halluzinationen) {
    // Handle compound items like "taktil / olfaktorisch / gustatorisch"
    if (item.includes('/')) {
      const parts = item.split('/').map(part => part.trim().toLowerCase());
      hallucinationAdjectives.push(...parts.map(part => `${part}en`));
    } else if (['akustisch', 'visuell', 'taktil', 'olfaktorisch', 'gustatorisch'].includes(item.toLowerCase())) {
      // Single adjective: add -en ending (Dativ)
      hallucinationAdjectives.push(`${item.toLowerCase()}en`);
    } else {
      // "sonstige Sinneswahrnehmungen" - needs dative: "sonstigen Sinneswahrnehmungen"
      const dativeForm = item.replace('sonstige ', 'sonstigen ');
      otherPerceptions.push(dativeForm);
    }
  }

  const sentences: string[] = [];
  if (hallucinationAdjectives.length > 0) {
    sentences.push(`${p.derDie} berichtete von ${formatListWithUnd(hallucinationAdjectives)} Halluzinationen`);
  }
  if (otherPerceptions.length > 0) {
    sentences.push(`${p.derDie} berichtete von ${formatListWithUnd(otherPerceptions)}`);
  }

  return sentences.join('. ') + '.';
}

/**
 * Section 10: Inhaltliches Denken
 * "Inhaltliche Denkstörungen bestanden nicht." or "Inhaltlich bestanden Wahnideen."
 */
function generateInhaltlichesDenkenSentence(data: InhaltlichesDenken | undefined): string | null {
  if (!data?.inhaltlichesDenken?.length) return null;
  const items = data.inhaltlichesDenken;
  if (items.some(i => i.toLowerCase().includes('keine'))) {
    return `Inhaltliche Denkstörungen bestanden nicht.`;
  }
  return `Inhaltlich bestanden ${formatListWithUnd(items)}.`;
}

/**
 * Section 11: Ich-Störungen
 * "Ich-Störungen lagen nicht vor." or "Es bestanden Depersonalisation als Ich-Störungen."
 */
function generateIchStoerungenSentence(data: IchStoerungen | undefined): string | null {
  if (!data) return null;
  if (data.keineIchStorungen?.length > 0) {
    return `Ich-Störungen lagen nicht vor.`;
  }
  const items: string[] = [];
  if (data.psychotischeIchStorungen?.length > 0) items.push(...data.psychotischeIchStorungen);
  if (data.nichtPsychotischeIchStorungen?.length > 0) items.push(...data.nichtPsychotischeIchStorungen);
  if (items.length === 0) return null;
  return `Es bestanden ${formatListWithUnd(items)} als Ich-Störungen.`;
}

/**
 * Section 12: Ängste
 * "Ängste bestanden in Form von Panikattacken und sozialer Phobie."
 */
function generateAengsteSentence(data: Aengste | undefined): string | null {
  if (!data) return null;
  const items: string[] = [];
  if (data.artenVonAngsten?.length > 0) items.push(...data.artenVonAngsten);
  if (data.symptomeKompensation?.length > 0) items.push(...data.symptomeKompensation);
  if (items.length === 0) return null;
  if (items.some(i => i.toLowerCase().includes('keine'))) {
    return `Ängste wurden verneint.`;
  }
  return `Ängste bestanden in Form von ${formatListWithUnd(items)}.`;
}

/**
 * Section 13: Zwänge
 * "Zwänge wurden verneint." or "Es bestanden Waschzwänge und Kontrollzwänge."
 */
function generateZwaengeSentence(data: Zwaenge | undefined): string | null {
  if (!data?.zwange?.length) return null;
  const items = data.zwange;
  if (items.some(i => i.toLowerCase().includes('keine'))) {
    return `Zwänge wurden verneint.`;
  }
  return `Es bestanden ${formatListWithUnd(items)} als Zwänge.`;
}

// Section 14: Stimmung und Affekt - Item classification by sentence template
// Stimmung adjectives (fit "Die Stimmung war X")
const STIMMUNG_ADJECTIVES = ['Euthym', 'Gedrückt', 'Traurig', 'Verzweifelt', 'Niedergeschlagen',
  'Hoffnungsvoll', 'Optimistisch', 'Heiter', 'Ratlos', 'Indifferent', 'Fassadär', 'Ambivalent',
  'Situationsinadäquat gehoben', 'Gereizt'];
// Affekt groupings by template
const AFFEKT_ES_BESTAND = ['Gute affektive Schwingungsfähigkeit', 'Affektlabilität',
  'Dysfunktionale Affektregulation (selbstverletzendes Verhalten)'];
const AFFEKT_ES_ZEIGTEN_SICH = ['Affektdurchbrüche / Affektinkontinenz', 'inadäquate Affekte'];

/**
 * Section 14: Stimmung und Affekt
 * Groups items by sentence template:
 * - Stimmung adjectives: "Die Stimmung war gedrückt und traurig."
 * - "Gefühl innerer Leere": "Es bestand ein Gefühl innerer Leere."
 * - Affekt "Es bestand" nouns: "Es bestand Affektlabilität."
 * - Affekt "Es zeigten sich" nouns: "Es zeigten sich Affektdurchbrüche und inadäquate Affekte."
 * - Reduzierte Schwingungsfähigkeit: "Die affektive Schwingungsfähigkeit war reduziert."
 */
function generateStimmungUndAffektSentence(data: StimmungUndAffekt | undefined): string | null {
  if (!data) return null;
  const sentences: string[] = [];

  // Process stimmung - separate adjectives from noun phrase
  if (data.stimmung?.length > 0) {
    const adjectives = data.stimmung.filter(i =>
      STIMMUNG_ADJECTIVES.some(adj => adj.toLowerCase() === i.toLowerCase())
    );
    const hasGefuehlInnereLere = data.stimmung.some(i =>
      i.toLowerCase().includes('gefühl innerer leere')
    );

    // Adjectives can be combined
    if (adjectives.length > 0) {
      sentences.push(`Die Stimmung war ${formatListWithUnd(adjectives.map(lowercaseFirst))}.`);
    }
    // Noun phrase gets its own sentence
    if (hasGefuehlInnereLere) {
      sentences.push(`Es bestand ein Gefühl innerer Leere.`);
    }
  }

  // Process affekt - group by template
  if (data.affekt?.length > 0) {
    const esBestandNouns = data.affekt.filter(i =>
      AFFEKT_ES_BESTAND.some(a => i.toLowerCase().includes(a.toLowerCase()))
    );
    const esZeigtenSichNouns = data.affekt.filter(i =>
      AFFEKT_ES_ZEIGTEN_SICH.some(a => i.toLowerCase().includes(a.toLowerCase()))
    );
    const hasReduziert = data.affekt.some(i =>
      i.toLowerCase().includes('reduzierte affektive schwingungsfähigkeit')
    );

    // "Es bestand" nouns can be combined
    if (esBestandNouns.length > 0) {
      // Add article where needed
      const formatted = esBestandNouns.map(i => {
        if (i.toLowerCase().includes('gute affektive')) {
          return 'eine gute affektive Schwingungsfähigkeit';
        }
        if (i.toLowerCase().includes('dysfunktionale affektregulation')) {
          return 'eine dysfunktionale Affektregulation';
        }
        return i;
      });
      sentences.push(`Es bestand ${formatListWithUnd(formatted)}.`);
    }
    // "Es zeigten sich" nouns can be combined
    if (esZeigtenSichNouns.length > 0) {
      const formatted = esZeigtenSichNouns.map(i => {
        if (i.toLowerCase().includes('affektdurchbrüche')) {
          return 'Affektdurchbrüche';
        }
        return i;
      });
      sentences.push(`Es zeigten sich ${formatListWithUnd(formatted)}.`);
    }
    // Reduzierte Schwingungsfähigkeit - special template
    if (hasReduziert) {
      sentences.push(`Die affektive Schwingungsfähigkeit war reduziert.`);
    }
  }

  if (sentences.length === 0) return null;
  return sentences.join(' ');
}

// Section 15: Antrieb - Item classification by sentence template
const ANTRIEB_ADJECTIVES = ['Normal', 'Reduziert', 'Gesteigert', 'Ungerichtet gesteigert'];
const ANTRIEB_ES_BESTAND = ['Anhedonie', 'Antriebsarmut', 'Antriebshemmung'];

/**
 * Section 15: Antrieb, Interesse, Freudeempfinden
 * Groups items by sentence template:
 * - Adjectives: "Antrieb, Interesse und Freudeempfinden waren reduziert."
 * - "Es bestand" nouns: "Es bestand Antriebsarmut und Antriebshemmung."
 */
function generateAntriebSentence(data: AntriebInteresseFreude | undefined): string | null {
  if (!data?.antrieb?.length) return null;
  const sentences: string[] = [];

  const adjectives = data.antrieb.filter(i =>
    ANTRIEB_ADJECTIVES.some(adj => adj.toLowerCase() === i.toLowerCase())
  );
  const esBestandNouns = data.antrieb.filter(i =>
    ANTRIEB_ES_BESTAND.includes(i)
  );

  // Adjectives can be combined
  if (adjectives.length > 0) {
    sentences.push(`Antrieb, Interesse und Freudeempfinden waren ${formatListWithUnd(adjectives.map(lowercaseFirst))}.`);
  }
  // "Es bestand" nouns can be combined
  if (esBestandNouns.length > 0) {
    sentences.push(`Es bestand ${formatListWithUnd(esBestandNouns)}.`);
  }

  if (sentences.length === 0) return null;
  return sentences.join(' ');
}

/**
 * Section 16: Psychomotorik
 * "Die Psychomotorik war verlangsamt."
 */
function generatePsychomotorikSentence(data: Psychomotorik | undefined): string | null {
  if (!data?.psychomotorik?.length) return null;
  return `Die Psychomotorik war ${formatListWithUnd(data.psychomotorik.map(lowercaseFirst))}.`;
}

/**
 * Section 17: Suizidalität
 * Handles complex phrases as separate sentences with proper structure.
 * gradDerSuizidalitat: "keine Suizidgedanken...", "passive Todeswünsche", etc.
 * paktAbspracheFahigkeit: "Absprachefähig", "Distanzierung von Suizidalität wirkt...", etc.
 */
function generateSuizidalitaetSentence(data: Suizidalitaet | undefined, p: GenderPronouns): string | null {
  if (!data) return null;
  const sentences: string[] = [];

  // Handle gradDerSuizidalitat - these are noun phrases describing the severity
  if (data.gradDerSuizidalitat?.length > 0) {
    for (const item of data.gradDerSuizidalitat) {
      if (item.toLowerCase().includes('keine suizidgedanken')) {
        // p.derDie already contains "Der Patient" / "Die Patientin"
        sentences.push(`${p.derDie} äußerte keine Suizidgedanken oder -intentionen`);
      } else if (item.toLowerCase().includes('lebensüberdruss')) {
        sentences.push(`${p.derDie} berichtete von Lebensüberdruss ohne Suizidgedanken`);
      } else if (item.toLowerCase().includes('passive todeswünsche')) {
        sentences.push(`${p.derDie} berichtete von passiven Todeswünschen`);
      } else if (item.toLowerCase().includes('suizidgedanken ohne suizidpläne')) {
        sentences.push(`${p.derDie} berichtete von Suizidgedanken ohne Suizidpläne`);
      } else if (item.toLowerCase().includes('konkrete suizidpläne')) {
        sentences.push(`${p.derDie} berichtete von konkreten Suizidplänen`);
      } else if (item.toLowerCase().includes('suizidversuche')) {
        sentences.push(`${p.derDie} berichtete von Suizidversuchen`);
      } else if (item.toLowerCase().includes('chronische suizidalität')) {
        sentences.push(`Es bestand chronische Suizidalität`);
      } else {
        // Fallback for any other items
        sentences.push(`${p.derDie} berichtete von ${lowercaseFirst(item)}`);
      }
    }
  }

  // Handle paktAbspracheFahigkeit - these are assessment statements
  if (data.paktAbspracheFahigkeit?.length > 0) {
    for (const item of data.paktAbspracheFahigkeit) {
      // Match specific phrases and create proper sentences
      if (item.toLowerCase().includes('glaubhaft distanziert')) {
        sentences.push(`${p.derDie} war gegenwärtig von akuter Suizidalität glaubhaft distanziert`);
      } else if (item.toLowerCase().includes('lebenspakt') || item.toLowerCase().includes('anti-suizidpakt')) {
        sentences.push(`Ein Anti-Suizidpakt wurde geschlossen`);
      } else if (item.toLowerCase() === 'absprachefähig') {
        sentences.push(`${p.derDie} war absprachefähig`);
      } else if (item.toLowerCase().includes('nicht ausreichend glaubhaft')) {
        sentences.push(`Die Distanzierung von Suizidalität wirkte insgesamt nicht ausreichend glaubhaft`);
      }
    }
  }

  if (sentences.length === 0) return null;
  return sentences.join('. ') + '.';
}

/**
 * Section 18: Krankheitseinstellung
 * "Die Krankheitseinsicht war vorhanden, die Behandlungsbereitschaft gegeben."
 */
function generateKrankheitseinstellungSentence(data: Krankheitseinstellung | undefined): string | null {
  if (!data) return null;
  const parts: string[] = [];
  if (data.krankheitseinsicht?.length > 0) {
    parts.push(`Die Krankheitseinsicht war ${formatListWithUnd(data.krankheitseinsicht.map(lowercaseFirst))}`);
  }
  if (data.behandlungsbereitschaft?.length > 0) {
    parts.push(`die Behandlungsbereitschaft ${formatListWithUnd(data.behandlungsbereitschaft.map(lowercaseFirst))}`);
  }
  if (parts.length === 0) return null;
  return parts.join(', ') + '.';
}

// ===========================================
// MAIN EXPORT: Construct Psychischer Befund Content
// ===========================================

/**
 * Constructs unified content for entire Psychischer Befund section.
 * Combines Erscheinungsbild (Section 1) with all other sections (2-18) into flowing prose.
 * Each section generates its own properly formatted German sentence.
 */
export function constructPsychischerBefundContent(
  formData: FormTypes.Form
): ParagraphNode[] {
  const pronouns = getPronounsForGender(formData.geschlecht);
  const sentences: string[] = [];

  // Section 1: Erscheinungsbild (already generates prose)
  const erscheinungsbildContent = constructErscheinungsbildContent(
    formData.erscheinungsbild || {},
    formData.geschlecht
  );
  if (erscheinungsbildContent.length > 0) {
    sentences.push(erscheinungsbildContent[0].text);
  }

  // Sections 2-18: Each with its own sentence template
  const kontaktverhalten = generateKontaktverhaltenSentence(formData.kontaktverhalten, pronouns);
  if (kontaktverhalten) sentences.push(kontaktverhalten);

  const sprache = generateSpracheSentence(formData.sprache);
  if (sprache) sentences.push(sprache);

  const bewusstsein = generateBewusstseinSentence(formData.bewusstsein);
  if (bewusstsein) sentences.push(bewusstsein);

  const orientierung = generateOrientierungSentence(formData.orientierung, pronouns);
  if (orientierung) sentences.push(orientierung);

  const mnestik = generateMnestikSentence(formData.mnestik);
  if (mnestik) sentences.push(mnestik);

  const konzentration = generateKonzentrationSentence(formData.konzentrationUndAuffassung);
  if (konzentration) sentences.push(konzentration);

  const formalesDenken = generateFormalesDenkenSentence(formData.formalesDenken);
  if (formalesDenken) sentences.push(formalesDenken);

  const wahrnehmung = generateWahrnehmungSentence(formData.wahrnehmung, pronouns);
  if (wahrnehmung) sentences.push(wahrnehmung);

  const inhaltlichesDenken = generateInhaltlichesDenkenSentence(formData.inhaltlichesDenken);
  if (inhaltlichesDenken) sentences.push(inhaltlichesDenken);

  const ichStoerungen = generateIchStoerungenSentence(formData.ichStoerungen);
  if (ichStoerungen) sentences.push(ichStoerungen);

  const aengste = generateAengsteSentence(formData.aengste);
  if (aengste) sentences.push(aengste);

  const zwaenge = generateZwaengeSentence(formData.zwaenge);
  if (zwaenge) sentences.push(zwaenge);

  const stimmungUndAffekt = generateStimmungUndAffektSentence(formData.stimmungUndAffekt);
  if (stimmungUndAffekt) sentences.push(stimmungUndAffekt);

  const antrieb = generateAntriebSentence(formData.antriebInteresseFreude);
  if (antrieb) sentences.push(antrieb);

  const psychomotorik = generatePsychomotorikSentence(formData.psychomotorik);
  if (psychomotorik) sentences.push(psychomotorik);

  const suizidalitaet = generateSuizidalitaetSentence(formData.suizidalitaet, pronouns);
  if (suizidalitaet) sentences.push(suizidalitaet);

  const krankheitseinstellung = generateKrankheitseinstellungSentence(formData.krankheitseinstellung);
  if (krankheitseinstellung) sentences.push(krankheitseinstellung);

  // No content - return empty array
  if (sentences.length === 0) return [];

  // Combine all sentences into one flowing paragraph
  return [{
    type: 'paragraph',
    text: sentences.join(' '),
    id: 'psychischer-befund'
  }];
}
