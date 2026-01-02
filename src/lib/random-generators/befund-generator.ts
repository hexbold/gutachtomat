/**
 * Befund (AMDP) Test Data Generator
 *
 * Generates random psychopathological findings data for psychischer Befund sections.
 * Uses a realistic distribution where:
 * - Normal subsections get 1-2 items, critical subsections get 1-3 items
 * - Maximum 5 subsections show critical/abnormal findings
 * - Remaining subsections show normal/healthy findings
 */

import {
  kontaktverhaltenErsterEindruckOptions,
  spracheSpracheOptions,
  bewusstseinQuantitativOptions,
  bewusstseinQualitativOptions,
  orientierungOrientierungOptions,
  formalesDenkenDenkstrukturOptions,
  formalesDenkenDenkgeschwindigkeitOptions,
  wahrnehmungHalluzinationenOptions,
  inhaltlichesDenkenInhaltlichesDenkenOptions,
  ichStoerungenKeineOptions,
  ichStoerungenPsychotischOptions,
  ichStoerungenNichtPsychotischOptions,
  aengsteArtenOptions,
  aengsteSymptomeKompensationOptions,
  zwaengeZwaengeOptions,
  stimmungUndAffektAffektOptions,
  antriebInteresseFreudeAntriebOptions,
  psychomotorikPsychomotorikOptions,
  suizidalitaetGradOptions,
  suizidalitaetPaktAbspracheOptions,
  suizidalitaetAbklaerungOptions,
  krankheitseinstellungEinsichtOptions,
  krankheitseinstellungBehandlungsbereitschaftOptions,
} from '../core/options/befund-sections';
import * as FormTypes from '../core/form-types';

// Constants for critical section distribution
const MIN_CRITICAL_SECTIONS = 3;
const MAX_CRITICAL_SECTIONS = 5;

// All 18 section names
type SectionName =
  | 'erscheinungsbild'
  | 'kontaktverhalten'
  | 'sprache'
  | 'bewusstsein'
  | 'orientierung'
  | 'mnestik'
  | 'konzentrationUndAuffassung'
  | 'formalesDenken'
  | 'wahrnehmung'
  | 'inhaltlichesDenken'
  | 'ichStoerungen'
  | 'aengste'
  | 'zwaenge'
  | 'stimmungUndAffekt'
  | 'antriebInteresseFreude'
  | 'psychomotorik'
  | 'suizidalitaet'
  | 'krankheitseinstellung';

const ALL_SECTIONS: SectionName[] = [
  'erscheinungsbild',
  'kontaktverhalten',
  'sprache',
  'bewusstsein',
  'orientierung',
  'mnestik',
  'konzentrationUndAuffassung',
  'formalesDenken',
  'wahrnehmung',
  'inhaltlichesDenken',
  'ichStoerungen',
  'aengste',
  'zwaenge',
  'stimmungUndAffekt',
  'antriebInteresseFreude',
  'psychomotorik',
  'suizidalitaet',
  'krankheitseinstellung',
];

// ============================================================================
// NORMAL vs ABNORMAL Item Classification
// ============================================================================

// Kontaktverhalten - Positive vs Negative traits
const NORMAL_KONTAKTVERHALTEN = [
  'Freundlich',
  'Mitteilungsbereit',
  'Zugewandt',
  'Angepasst',
  'Offen',
  'Warmherzig',
  'Lebhaft',
];
const ABNORMAL_KONTAKTVERHALTEN = [
  'Schüchtern',
  'Unsicher',
  'Blickvermeidend',
  'Teilnahmslos',
  'Zurückhaltend',
  'Misstrauisch',
  'Klagsam',
  'Weinerlich',
  'Theatralisch / übertrieben',
  'Feindselig',
];

// Stimmung - normal includes euthym and positive moods
const NORMAL_STIMMUNG = ['Euthym', 'Hoffnungsvoll', 'Optimistisch', 'Heiter'];
const ABNORMAL_STIMMUNG = [
  'Gedrückt',
  'Traurig',
  'Verzweifelt',
  'Niedergeschlagen',
  'Gefühl innerer Leere',
  'Ratlos',
  'Indifferent',
  'Fassadär',
  'Ambivalent',
  'Situationsinadäquat gehoben',
  'Gereizt',
];

// Erscheinungsbild - Classification per field
const NORMAL_ERSCHEINUNGSBILD = {
  pflegezustand: [FormTypes.ErscheinungsbildPflegezustand.Gepflegt],
  koerpergeruch: [FormTypes.ErscheinungsbildKoerpergeruch.Unauffaellig],
  kleidungsstil: [
    FormTypes.ErscheinungsbildKleidungsstil.Sauber,
    FormTypes.ErscheinungsbildKleidungsstil.Ordentlich,
    FormTypes.ErscheinungsbildKleidungsstil.Modisch,
    FormTypes.ErscheinungsbildKleidungsstil.Klassisch,
    FormTypes.ErscheinungsbildKleidungsstil.Sportlich,
    FormTypes.ErscheinungsbildKleidungsstil.Einfach,
  ],
  kleidungszustand: [FormTypes.ErscheinungsbildKleidungszustand.Sauber],
  kleidungsangemessenheit: [FormTypes.ErscheinungsbildKleidungsangemessenheit.Angemessen],
};

const ABNORMAL_ERSCHEINUNGSBILD = {
  pflegezustand: [
    FormTypes.ErscheinungsbildPflegezustand.Vernachlaessigt,
    FormTypes.ErscheinungsbildPflegezustand.Verwahrlost,
    FormTypes.ErscheinungsbildPflegezustand.Ungepflegt,
  ],
  koerpergeruch: [
    FormTypes.ErscheinungsbildKoerpergeruch.Unangenehm,
    FormTypes.ErscheinungsbildKoerpergeruch.Schweissgeruch,
    FormTypes.ErscheinungsbildKoerpergeruch.Alkoholgeruch,
    FormTypes.ErscheinungsbildKoerpergeruch.THCGeruch,
  ],
  kleidungsstil: [
    FormTypes.ErscheinungsbildKleidungsstil.Extravagant,
    FormTypes.ErscheinungsbildKleidungsstil.Bizarr,
    FormTypes.ErscheinungsbildKleidungsstil.NichtAltersgemaess,
  ],
  kleidungszustand: [FormTypes.ErscheinungsbildKleidungszustand.Fleckig],
  kleidungsangemessenheit: [FormTypes.ErscheinungsbildKleidungsangemessenheit.Unangemessen],
};

export interface BefundData {
  erscheinungsbild: FormTypes.Erscheinungsbild;
  kontaktverhalten: FormTypes.Kontaktverhalten;
  sprache: FormTypes.Sprache;
  bewusstsein: FormTypes.Bewusstsein;
  orientierung: FormTypes.Orientierung;
  mnestik: FormTypes.Mnestik;
  konzentrationUndAuffassung: FormTypes.KonzentrationUndAuffassung;
  formalesDenken: FormTypes.FormalesDenken;
  wahrnehmung: FormTypes.Wahrnehmung;
  inhaltlichesDenken: FormTypes.InhaltlichesDenken;
  ichStoerungen: FormTypes.IchStoerungen;
  aengste: FormTypes.Aengste;
  zwaenge: FormTypes.Zwaenge;
  stimmungUndAffekt: FormTypes.StimmungUndAffekt;
  antriebInteresseFreude: FormTypes.AntriebInteresseFreude;
  psychomotorik: FormTypes.Psychomotorik;
  suizidalitaet: FormTypes.Suizidalitaet;
  krankheitseinstellung: FormTypes.Krankheitseinstellung;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Shuffles array in place using Fisher-Yates algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Randomly selects 1-3 items from an array
 */
function selectItems<T>(array: T[], min = 1, max = 3): T[] {
  if (array.length === 0) return [];
  const numItems = Math.floor(Math.random() * (Math.min(max, array.length) - min + 1)) + min;
  return shuffle(array).slice(0, Math.min(numItems, array.length));
}

/**
 * Picks exactly one item from an array
 */
function pickOne<T>(array: T[]): T[] {
  if (array.length === 0) return [];
  return [array[Math.floor(Math.random() * array.length)]];
}

/**
 * Creates a CardSelection from enum values
 */
function createCardSelection<E extends string>(values: E[]): FormTypes.CardSelection<E> {
  const result: FormTypes.CardSelection<E> = {};
  for (const value of values) {
    result[value] = { selected: true, details: {} };
  }
  return result;
}

/**
 * Selects 3-5 random sections to be critical (abnormal)
 */
function selectCriticalSections(): Set<SectionName> {
  const count =
    Math.floor(Math.random() * (MAX_CRITICAL_SECTIONS - MIN_CRITICAL_SECTIONS + 1)) +
    MIN_CRITICAL_SECTIONS;
  const shuffled = shuffle(ALL_SECTIONS);
  return new Set(shuffled.slice(0, count));
}

// ============================================================================
// Section Generators - Normal vs Critical
// ============================================================================

function generateErscheinungsbild(isCritical: boolean): FormTypes.Erscheinungsbild {
  const source = isCritical ? ABNORMAL_ERSCHEINUNGSBILD : NORMAL_ERSCHEINUNGSBILD;
  // Normal: 1-2 items, Critical: 1-3 items for kleidungsstil
  const kleidungsstilMax = isCritical ? 3 : 2;
  return {
    pflegezustand: createCardSelection(pickOne(source.pflegezustand)),
    koerpergeruch: createCardSelection(selectItems(source.koerpergeruch, 1, 2)),
    kleidungsstil: createCardSelection(selectItems(source.kleidungsstil, 1, kleidungsstilMax)),
    kleidungszustand: createCardSelection(pickOne(source.kleidungszustand)),
    kleidungsangemessenheit: createCardSelection(pickOne(source.kleidungsangemessenheit)),
  };
}

function generateKontaktverhalten(isCritical: boolean): FormTypes.Kontaktverhalten {
  if (isCritical) {
    return {
      ersterEindruck: selectItems(kontaktverhaltenErsterEindruckOptions, 1, 2),
      kontaktverhalten: selectItems(ABNORMAL_KONTAKTVERHALTEN, 1, 3),
    };
  }
  return {
    ersterEindruck: [], // Normal: no remarkable first impression
    kontaktverhalten: selectItems(NORMAL_KONTAKTVERHALTEN, 1, 2),
  };
}

function generateSprache(isCritical: boolean): FormTypes.Sprache {
  if (isCritical) {
    // Abnormal: select from options excluding 'Unauffällig'
    const abnormalOptions = spracheSpracheOptions.filter((o) => o !== 'Unauffällig');
    return { sprache: selectItems(abnormalOptions, 1, 3) };
  }
  return { sprache: ['Unauffällig'] };
}

function generateBewusstsein(isCritical: boolean): FormTypes.Bewusstsein {
  if (isCritical) {
    // Abnormal: müde or impaired consciousness
    const abnormalQuantitativ = bewusstseinQuantitativOptions.filter((o) => o !== 'wach');
    const abnormalQualitativ = bewusstseinQualitativOptions.filter((o) => o !== 'Klar');
    return {
      quantitativesBewusstsein: pickOne(
        abnormalQuantitativ.length > 0 ? abnormalQuantitativ : ['müde']
      ),
      qualitativesBewusstsein: pickOne(abnormalQualitativ),
    };
  }
  return {
    quantitativesBewusstsein: ['wach'],
    qualitativesBewusstsein: ['Klar'],
  };
}

function generateOrientierung(isCritical: boolean): FormTypes.Orientierung {
  if (isCritical) {
    const abnormalOptions = orientierungOrientierungOptions.filter(
      (o) => o !== 'Vollständig orientiert'
    );
    return { orientierung: pickOne(abnormalOptions) };
  }
  return { orientierung: ['Vollständig orientiert'] };
}

function generateMnestik(isCritical: boolean): FormTypes.Mnestik {
  if (isCritical) {
    return { mnestik: ['Beeinträchtigt'] };
  }
  return { mnestik: ['Unauffällig'] };
}

function generateKonzentrationUndAuffassung(
  isCritical: boolean
): FormTypes.KonzentrationUndAuffassung {
  if (isCritical) {
    return { konzentration: ['Beeinträchtigt'] };
  }
  return { konzentration: ['Unauffällig'] };
}

function generateFormalesDenken(isCritical: boolean): FormTypes.FormalesDenken {
  if (isCritical) {
    const abnormalStruktur = formalesDenkenDenkstrukturOptions.filter((o) => o !== 'geordnet');
    const abnormalGeschwindigkeit = formalesDenkenDenkgeschwindigkeitOptions.filter(
      (o) => o !== 'unauffällig'
    );
    return {
      denkstruktur: selectItems(abnormalStruktur, 1, 3),
      denkgeschwindigkeit: pickOne(abnormalGeschwindigkeit),
    };
  }
  return {
    denkstruktur: ['geordnet'],
    denkgeschwindigkeit: ['unauffällig'],
  };
}

function generateWahrnehmung(isCritical: boolean): FormTypes.Wahrnehmung {
  if (isCritical) {
    const abnormalOptions = wahrnehmungHalluzinationenOptions.filter(
      (o) => o !== 'Keine Halluzinationen'
    );
    return { halluzinationen: selectItems(abnormalOptions, 1, 3) };
  }
  return { halluzinationen: ['Keine Halluzinationen'] };
}

function generateInhaltlichesDenken(isCritical: boolean): FormTypes.InhaltlichesDenken {
  if (isCritical) {
    const abnormalOptions = inhaltlichesDenkenInhaltlichesDenkenOptions.filter(
      (o) => o !== 'Kein Wahn / keine inhaltlichen Denkstörungen'
    );
    return { inhaltlichesDenken: selectItems(abnormalOptions, 1, 3) };
  }
  return { inhaltlichesDenken: ['Kein Wahn / keine inhaltlichen Denkstörungen'] };
}

function generateIchStoerungen(isCritical: boolean): FormTypes.IchStoerungen {
  if (isCritical) {
    // Critical: either psychotic or non-psychotic disturbances
    const hasPsychotic = Math.random() < 0.4;
    const hasNonPsychotic = Math.random() < 0.6;
    return {
      keineIchStorungen: [],
      psychotischeIchStorungen: hasPsychotic
        ? selectItems(ichStoerungenPsychotischOptions, 1, 2)
        : [],
      nichtPsychotischeIchStorungen: hasNonPsychotic
        ? selectItems(ichStoerungenNichtPsychotischOptions, 1, 2)
        : [],
    };
  }
  return {
    keineIchStorungen: ichStoerungenKeineOptions,
    psychotischeIchStorungen: [],
    nichtPsychotischeIchStorungen: [],
  };
}

function generateAengste(isCritical: boolean): FormTypes.Aengste {
  if (isCritical) {
    const abnormalArten = aengsteArtenOptions.filter((o) => o !== 'Keine Ängste');
    return {
      artenVonAngsten: selectItems(abnormalArten, 1, 3),
      symptomeKompensation: selectItems(aengsteSymptomeKompensationOptions, 1, 2),
    };
  }
  return {
    artenVonAngsten: ['Keine Ängste'],
    symptomeKompensation: [],
  };
}

function generateZwaenge(isCritical: boolean): FormTypes.Zwaenge {
  if (isCritical) {
    const abnormalOptions = zwaengeZwaengeOptions.filter((o) => o !== 'Keine Zwänge');
    return { zwange: selectItems(abnormalOptions, 1, 3) };
  }
  return { zwange: ['Keine Zwänge'] };
}

function generateStimmungUndAffekt(isCritical: boolean): FormTypes.StimmungUndAffekt {
  if (isCritical) {
    const abnormalAffekt = stimmungUndAffektAffektOptions.filter(
      (o) => o !== 'Gute affektive Schwingungsfähigkeit'
    );
    return {
      stimmung: selectItems(ABNORMAL_STIMMUNG, 1, 3),
      affekt: selectItems(abnormalAffekt, 1, 2),
    };
  }
  return {
    stimmung: selectItems(NORMAL_STIMMUNG, 1, 2),
    affekt: ['Gute affektive Schwingungsfähigkeit'],
  };
}

function generateAntriebInteresseFreude(isCritical: boolean): FormTypes.AntriebInteresseFreude {
  if (isCritical) {
    const abnormalOptions = antriebInteresseFreudeAntriebOptions.filter((o) => o !== 'Normal');
    return { antrieb: selectItems(abnormalOptions, 1, 3) };
  }
  return { antrieb: ['Normal'] };
}

function generatePsychomotorik(isCritical: boolean): FormTypes.Psychomotorik {
  if (isCritical) {
    const abnormalOptions = psychomotorikPsychomotorikOptions.filter((o) => o !== 'Unauffällig');
    return { psychomotorik: pickOne(abnormalOptions) };
  }
  return { psychomotorik: ['Unauffällig'] };
}

function generateSuizidalitaet(isCritical: boolean): FormTypes.Suizidalitaet {
  if (isCritical) {
    const abnormalGrad = suizidalitaetGradOptions.filter(
      (o) => o !== 'keine Suizidgedanken und -intentionen'
    );
    return {
      gradDerSuizidalitat: selectItems(abnormalGrad, 1, 2),
      paktAbspracheFahigkeit: selectItems(suizidalitaetPaktAbspracheOptions, 1, 2),
      abklarungVonSuizidalitat: Math.random() < 0.5 ? suizidalitaetAbklaerungOptions : [],
    };
  }
  return {
    gradDerSuizidalitat: ['keine Suizidgedanken und -intentionen'],
    paktAbspracheFahigkeit: [],
    abklarungVonSuizidalitat: [],
  };
}

function generateKrankheitseinstellung(isCritical: boolean): FormTypes.Krankheitseinstellung {
  if (isCritical) {
    const abnormalEinsicht = krankheitseinstellungEinsichtOptions.filter((o) => o !== 'Gegeben');
    const abnormalBereitschaft = krankheitseinstellungBehandlungsbereitschaftOptions.filter(
      (o) => o !== 'Gegeben'
    );
    return {
      krankheitseinsicht: pickOne(abnormalEinsicht),
      behandlungsbereitschaft: pickOne(abnormalBereitschaft),
    };
  }
  return {
    krankheitseinsicht: ['Gegeben'],
    behandlungsbereitschaft: ['Gegeben'],
  };
}

// ============================================================================
// Main Generator Function
// ============================================================================

/**
 * Main function: Generates all befund (AMDP) data
 *
 * Uses a realistic distribution where:
 * - All 18 subsections have content (1-3 items)
 * - 3-5 subsections show critical/abnormal findings
 * - Remaining subsections show normal/healthy findings
 */
export function generateBefund(): BefundData {
  const criticalSections = selectCriticalSections();

  return {
    erscheinungsbild: generateErscheinungsbild(criticalSections.has('erscheinungsbild')),
    kontaktverhalten: generateKontaktverhalten(criticalSections.has('kontaktverhalten')),
    sprache: generateSprache(criticalSections.has('sprache')),
    bewusstsein: generateBewusstsein(criticalSections.has('bewusstsein')),
    orientierung: generateOrientierung(criticalSections.has('orientierung')),
    mnestik: generateMnestik(criticalSections.has('mnestik')),
    konzentrationUndAuffassung: generateKonzentrationUndAuffassung(
      criticalSections.has('konzentrationUndAuffassung')
    ),
    formalesDenken: generateFormalesDenken(criticalSections.has('formalesDenken')),
    wahrnehmung: generateWahrnehmung(criticalSections.has('wahrnehmung')),
    inhaltlichesDenken: generateInhaltlichesDenken(criticalSections.has('inhaltlichesDenken')),
    ichStoerungen: generateIchStoerungen(criticalSections.has('ichStoerungen')),
    aengste: generateAengste(criticalSections.has('aengste')),
    zwaenge: generateZwaenge(criticalSections.has('zwaenge')),
    stimmungUndAffekt: generateStimmungUndAffekt(criticalSections.has('stimmungUndAffekt')),
    antriebInteresseFreude: generateAntriebInteresseFreude(
      criticalSections.has('antriebInteresseFreude')
    ),
    psychomotorik: generatePsychomotorik(criticalSections.has('psychomotorik')),
    suizidalitaet: generateSuizidalitaet(criticalSections.has('suizidalitaet')),
    krankheitseinstellung: generateKrankheitseinstellung(
      criticalSections.has('krankheitseinstellung')
    ),
  };
}
