/**
 * Random Generator for Kapitel6 (Behandlungsplan, Therapieziele und Prognose)
 *
 * Generates realistic random data for:
 * - Therapieziele (2-3 goals total from all categories)
 * - Behandlungsplan (1-3 items total from all categories)
 * - Begründung (therapy form, sessions, setting)
 * - Prognose (2-4 günstige/ungünstige factors)
 */

import * as FormTypes from '../core/form-types';

// Helper to randomly select items from an enum
function selectRandomFromEnum<E extends string>(
  enumObj: Record<string, E>,
  min: number,
  max: number
): FormTypes.CardSelection<E> {
  const values = Object.values(enumObj) as E[];
  const numItems = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...values].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(numItems, values.length));

  const result: FormTypes.CardSelection<E> = {};
  for (const value of selected) {
    result[value] = {
      selected: true,
      details: {
        brackets: Math.random() > 0.7 ? generateBracketsText() : undefined,
      },
    };
  }
  return result;
}

// Generate random brackets text (optional detail)
function generateBracketsText(): string {
  const options = [
    'insbesondere im Alltag',
    'vor allem in Stresssituationen',
    'im beruflichen Kontext',
    'im privaten Bereich',
    'bei sozialen Kontakten',
    'im Familienkreis',
  ];
  return options[Math.floor(Math.random() * options.length)];
}

// ============================================================================
// THERAPIEZIELE GENERATORS
// ============================================================================

// All available Therapieziele options with their category/subcategory paths
type TherapiezielCategory = 'problemBewaeltigung' | 'zwischenmenschlich' | 'wohlbefinden' | 'selbstbezogen';

interface TherapiezielOption {
  category: TherapiezielCategory;
  subcategory: string;
  value: string;
}

// Build the pool of all available Therapieziele
function buildTherapiezielPool(): TherapiezielOption[] {
  const pool: TherapiezielOption[] = [];

  // Problem Bewältigung
  const problemBewaeltigungEnums: Array<{ subcategory: string; enumObj: Record<string, string> }> = [
    { subcategory: 'depressivesErleben', enumObj: FormTypes.TherapiezielDepressivesErleben },
    { subcategory: 'selbstverletzen', enumObj: FormTypes.TherapiezielSelbstverletzen },
    { subcategory: 'aengste', enumObj: FormTypes.TherapiezielAengste },
    { subcategory: 'zwaenge', enumObj: FormTypes.TherapiezielZwaenge },
    { subcategory: 'trauma', enumObj: FormTypes.TherapiezielTrauma },
    { subcategory: 'sucht', enumObj: FormTypes.TherapiezielSucht },
    { subcategory: 'essverhalten', enumObj: FormTypes.TherapiezielEssverhalten },
    { subcategory: 'schlaf', enumObj: FormTypes.TherapiezielSchlaf },
    { subcategory: 'sexualitaet', enumObj: FormTypes.TherapiezielSexualitaet },
    { subcategory: 'koerperlich', enumObj: FormTypes.TherapiezielKoerperlich },
    { subcategory: 'lebensbereiche', enumObj: FormTypes.TherapiezielLebensbereiche },
    { subcategory: 'stress', enumObj: FormTypes.TherapiezielStress },
  ];
  for (const { subcategory, enumObj } of problemBewaeltigungEnums) {
    for (const value of Object.values(enumObj)) {
      pool.push({ category: 'problemBewaeltigung', subcategory, value });
    }
  }

  // Zwischenmenschlich
  const zwischenmenschlichEnums: Array<{ subcategory: string; enumObj: Record<string, string> }> = [
    { subcategory: 'partnerschaft', enumObj: FormTypes.TherapiezielPartnerschaft },
    { subcategory: 'elternschaft', enumObj: FormTypes.TherapiezielElternschaft },
    { subcategory: 'alleinsein', enumObj: FormTypes.TherapiezielAlleinsein },
    { subcategory: 'selbstbehauptung', enumObj: FormTypes.TherapiezielSelbstbehauptung },
    { subcategory: 'kontaktNaehe', enumObj: FormTypes.TherapiezielKontaktNaehe },
  ];
  for (const { subcategory, enumObj } of zwischenmenschlichEnums) {
    for (const value of Object.values(enumObj)) {
      pool.push({ category: 'zwischenmenschlich', subcategory, value });
    }
  }

  // Wohlbefinden
  const wohlbefindenEnums: Array<{ subcategory: string; enumObj: Record<string, string> }> = [
    { subcategory: 'bewegung', enumObj: FormTypes.TherapiezielBewegung },
    { subcategory: 'entspannung', enumObj: FormTypes.TherapiezielEntspannung },
    { subcategory: 'wohlbefinden', enumObj: FormTypes.TherapiezielWohlbefinden },
    { subcategory: 'zeitperspektive', enumObj: FormTypes.TherapiezielZeitperspektive },
    { subcategory: 'sinnfindung', enumObj: FormTypes.TherapiezielSinnfindung },
  ];
  for (const { subcategory, enumObj } of wohlbefindenEnums) {
    for (const value of Object.values(enumObj)) {
      pool.push({ category: 'wohlbefinden', subcategory, value });
    }
  }

  // Selbstbezogen
  const selbstbezogenEnums: Array<{ subcategory: string; enumObj: Record<string, string> }> = [
    { subcategory: 'selbsteinstellung', enumObj: FormTypes.TherapiezielSelbsteinstellung },
    { subcategory: 'beduerfnisse', enumObj: FormTypes.TherapiezielBeduerfnisse },
    { subcategory: 'leistung', enumObj: FormTypes.TherapiezielLeistung },
    { subcategory: 'gefuehle', enumObj: FormTypes.TherapiezielGefuehle },
  ];
  for (const { subcategory, enumObj } of selbstbezogenEnums) {
    for (const value of Object.values(enumObj)) {
      pool.push({ category: 'selbstbezogen', subcategory, value });
    }
  }

  return pool;
}

// Create an empty TherapiezieleData structure
function createEmptyTherapiezieleData(): FormTypes.TherapiezieleData {
  return {
    problemBewaeltigung: {
      depressivesErleben: {}, depressivesErlebenAndere: '',
      selbstverletzen: {}, selbstverletzenAndere: '',
      aengste: {}, aengsteAndere: '',
      zwaenge: {}, zwaengeAndere: '',
      trauma: {}, traumaAndere: '',
      sucht: {}, suchtAndere: '',
      essverhalten: {}, essverhaltenAndere: '',
      schlaf: {}, schlafAndere: '',
      sexualitaet: {}, sexualitaetAndere: '',
      koerperlich: {}, koerperlichAndere: '',
      lebensbereiche: {}, lebensbereicheAndere: '',
      stress: {}, stressAndere: '',
    },
    zwischenmenschlich: {
      partnerschaft: {}, partnerschaftAndere: '',
      elternschaft: {}, elternschaftAndere: '',
      alleinsein: {}, alleinseinAndere: '',
      selbstbehauptung: {}, selbstbehauptungAndere: '',
      kontaktNaehe: {}, kontaktNaeheAndere: '',
    },
    wohlbefinden: {
      bewegung: {}, bewegungAndere: '',
      entspannung: {}, entspannungAndere: '',
      wohlbefinden: {}, wohlbefindenAndere: '',
      zeitperspektive: {}, zeitperspektiveAndere: '',
      sinnfindung: {}, sinnfindungAndere: '',
    },
    selbstbezogen: {
      selbsteinstellung: {}, selbsteinstellungAndere: '',
      beduerfnisse: {}, beduerfnisseAndere: '',
      leistung: {}, leistungAndere: '',
      gefuehle: {}, gefuehleAndere: '',
    },
  };
}

function generateTherapieziele(): FormTypes.TherapiezieleData {
  // Build pool of all options
  const pool = buildTherapiezielPool();

  // Randomly select 2-3 items
  const numItems = Math.floor(Math.random() * 2) + 2; // 2-3
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, numItems);

  // Create empty structure and populate with selected items
  const result = createEmptyTherapiezieleData();

  for (const item of selected) {
    const categoryData = result[item.category] as unknown as Record<string, FormTypes.CardSelection<string>>;
    categoryData[item.subcategory][item.value] = {
      selected: true,
      details: {
        brackets: Math.random() > 0.93 ? generateBracketsText() : undefined,
      },
    };
  }

  return result;
}

// ============================================================================
// BEHANDLUNGSPLAN GENERATORS
// ============================================================================

type BehandlungsplanCategory = 'allgemeine' | 'depression' | 'bipolare' | 'angst' | 'borderline' | 'ptbs' | 'zwang' | 'somatoforme' | 'anorexie' | 'bulimie' | 'psychose';

interface BehandlungsplanOption {
  category: BehandlungsplanCategory;
  value: string;
}

// Build the pool of all available Behandlungsplan interventions
function buildBehandlungsplanPool(): BehandlungsplanOption[] {
  const pool: BehandlungsplanOption[] = [];

  const categoryEnums: Array<{ category: BehandlungsplanCategory; enumObj: Record<string, string> }> = [
    { category: 'allgemeine', enumObj: FormTypes.AllgemeineIntervention },
    { category: 'depression', enumObj: FormTypes.DepressionIntervention },
    { category: 'bipolare', enumObj: FormTypes.BipolareIntervention },
    { category: 'angst', enumObj: FormTypes.AngstIntervention },
    { category: 'borderline', enumObj: FormTypes.BorderlineIntervention },
    { category: 'ptbs', enumObj: FormTypes.PTBSIntervention },
    { category: 'zwang', enumObj: FormTypes.ZwangIntervention },
    { category: 'somatoforme', enumObj: FormTypes.SomatoformeIntervention },
    { category: 'anorexie', enumObj: FormTypes.AnorexieIntervention },
    { category: 'bulimie', enumObj: FormTypes.BulimieIntervention },
    { category: 'psychose', enumObj: FormTypes.PsychoseIntervention },
  ];

  for (const { category, enumObj } of categoryEnums) {
    for (const value of Object.values(enumObj)) {
      pool.push({ category, value });
    }
  }

  return pool;
}

// Create an empty BehandlungsplanData structure
function createEmptyBehandlungsplanData(): FormTypes.BehandlungsplanData {
  return {
    allgemeine: {},
    depression: {},
    bipolare: {},
    angst: {},
    borderline: {},
    ptbs: {},
    zwang: {},
    somatoforme: {},
    anorexie: {},
    bulimie: {},
    psychose: {},
  };
}

function generateBehandlungsplan(): FormTypes.BehandlungsplanData {
  // Build pool of all options
  const pool = buildBehandlungsplanPool();

  // Randomly select 1-3 items
  const numItems = Math.floor(Math.random() * 3) + 1; // 1-3
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, numItems);

  // Create empty structure and populate with selected items
  const result = createEmptyBehandlungsplanData();

  for (const item of selected) {
    const categoryData = result[item.category] as FormTypes.CardSelection<string>;
    categoryData[item.value] = {
      selected: true,
      details: {
        brackets: Math.random() > 0.93 ? generateBracketsText() : undefined,
      },
    };
  }

  return result;
}

// ============================================================================
// BEGRÜNDUNG SETTING GENERATORS
// ============================================================================

function generateBegruendungSetting(): FormTypes.BegruendungSettingData {
  // Random therapy form
  const therapieformOptions = Object.values(FormTypes.TherapieformSetting);
  const therapieform = therapieformOptions[Math.floor(Math.random() * therapieformOptions.length)];

  // Random session count (prefer 12 or 24)
  const sitzungenOptions = [
    FormTypes.AnzahlSitzungen.Sitzungen12,
    FormTypes.AnzahlSitzungen.Sitzungen24,
  ];
  const anzahlSitzungen = sitzungenOptions[Math.floor(Math.random() * sitzungenOptions.length)];

  // Random setting (prefer Einzeltherapie)
  const settingOptions = Object.values(FormTypes.TherapieSetting);
  const setting = Math.random() < 0.7
    ? FormTypes.TherapieSetting.Einzeltherapie
    : settingOptions[Math.floor(Math.random() * settingOptions.length)];

  // Random Mitbehandler (30% chance each)
  const mitbehandler: FormTypes.MitbehandlerSelection = {};
  if (Math.random() < 0.4) {
    mitbehandler[FormTypes.Mitbehandler.Psychiater] = {
      selected: true,
      details: {},
    };
  }
  if (Math.random() < 0.3) {
    mitbehandler[FormTypes.Mitbehandler.Hausarzt] = {
      selected: true,
      details: {},
    };
  }

  return {
    therapieform,
    anzahlSitzungen,
    anzahlSitzungenAndere: null,
    setting,
    mitbehandler,
    mitbehandlerAndere: '',
    begruendungstext: '',
  };
}

// ============================================================================
// PROGNOSE GENERATORS
// ============================================================================

function generatePrognose(): FormTypes.PrognoseData {
  // Select 2-4 günstige Faktoren
  const guenstigeFaktoren = selectRandomFromEnum(FormTypes.PrognostischGuenstig, 2, 4);

  // Select 1-2 ungünstige Faktoren (or none)
  const unguenstigeFaktoren = Math.random() < 0.7
    ? selectRandomFromEnum(FormTypes.PrognostischUnguenstig, 1, 2)
    : {};

  // Random prognosis (prefer positive)
  const prognoseOptions = Object.values(FormTypes.EingeschaetztePrognose);
  const eingeschaetztePrognose = Math.random() < 0.6
    ? FormTypes.EingeschaetztePrognose.Gut
    : Math.random() < 0.7
      ? FormTypes.EingeschaetztePrognose.AusreichendGut
      : prognoseOptions[Math.floor(Math.random() * prognoseOptions.length)];

  return {
    guenstigeFaktoren,
    guenstigeFaktorenAndere: '',
    eingeschaetztePrognose,
    unguenstigeFaktoren,
    unguenstigeFaktorenAndere: '',
    prognosetextFrei: '',
  };
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

export interface Kapitel6Data {
  kapitel6: FormTypes.Kapitel6Data;
}

/**
 * Generates complete random Kapitel6 data
 * Includes therapieziele, behandlungsplan, begruendung, and prognose
 */
export function generateKapitel6(): Kapitel6Data {
  return {
    kapitel6: {
      therapieziele: generateTherapieziele(),
      behandlungsplan: generateBehandlungsplan(),
      begruendungSetting: generateBegruendungSetting(),
      prognose: generatePrognose(),
    },
  };
}
