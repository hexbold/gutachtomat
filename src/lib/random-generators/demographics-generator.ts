/**
 * Demographics Test Data Generator
 *
 * Generates random patient demographics including:
 * - Basic info (gender, age, patient ID)
 * - Educational background (Bildungsweg)
 * - Occupation (Beruf)
 * - Family status
 * - Living situation
 * - Financial situation
 * - Sick leave status
 * - Therapy details
 *
 * IMPORTANT: Follows principles from docs/GENERATION-PRINCIPLES.md
 * - Tests ALL possible form states (including "illogical" combinations)
 * - No artificial constraints between independent fields
 * - Comprehensive edge case coverage for logic-affecting fields
 */

import * as FormConfig from '@/lib/core/form-config';
import * as FormTypes from '../core/form-types';

export interface DemographicsData {
  geschlecht: FormTypes.Geschlecht;
  alter: FormTypes.Alter;
  patientenchiffre: FormTypes.Patientenchiffre;
  datumBerichterstellung: FormTypes.DatumBerichterstellung;
  bildungsweg: FormTypes.Bildungsweg;
  beruf: FormTypes.BerufStatus;
  familienstand: FormTypes.Familienstand;
  kinder: FormTypes.Kinder;
  wohnsituation: FormTypes.WohnsituationField;
  finanzielleSituation: FormTypes.FinanzielleSituationField;
  krankschreibung: FormTypes.Krankschreibung;
  therapieform: string;
  behandlungsform: string;
  antragsart: string;
}

/**
 * Generates random wohnsituation (living situation)
 * Uses discriminated union type with product type for "with others" case
 *
 * Valid states:
 * - null: not answered
 * - { lebtAllein: true }: lives alone
 * - { lebtAllein: false, ... }: lives with others (at least one field must be true)
 */
function generateWohnsituation(): FormTypes.WohnsituationField {
  const random = Math.random();

  // 10% chance: null (not answered)
  if (random < 0.1) {
    return null;
  }

  // 20% chance: lives alone
  if (random < 0.3) {
    return { lebtAllein: true };
  }

  // 70% chance: lives with others
  // Use explicit construction to satisfy the discriminated union type
  // Each branch must have exactly one field as literal `true`

  const choices: FormTypes.WohnsituationData[] = [
    // Single selections
    { lebtAllein: false, mitPartner: true, mitKindern: false, beiEltern: false, inWG: false },
    { lebtAllein: false, mitPartner: false, mitKindern: true, beiEltern: false, inWG: false },
    { lebtAllein: false, mitPartner: false, mitKindern: false, beiEltern: true, inWG: false },
    { lebtAllein: false, mitPartner: false, mitKindern: false, beiEltern: false, inWG: true },
    // Common combinations
    { lebtAllein: false, mitPartner: true, mitKindern: true, beiEltern: false, inWG: false },
    { lebtAllein: false, mitPartner: true, mitKindern: false, beiEltern: true, inWG: false },
    { lebtAllein: false, mitPartner: true, mitKindern: true, beiEltern: true, inWG: false },
    { lebtAllein: false, mitPartner: false, mitKindern: true, beiEltern: true, inWG: false },
    { lebtAllein: false, mitPartner: true, mitKindern: false, beiEltern: false, inWG: true },
    { lebtAllein: false, mitPartner: false, mitKindern: false, beiEltern: true, inWG: true },
    // All options
    { lebtAllein: false, mitPartner: true, mitKindern: true, beiEltern: true, inWG: true },
  ];

  return choices[Math.floor(Math.random() * choices.length)];
}

/**
 * Generates random finanzielle Situation (financial situation)
 * Tests ALL possible states: null or one of the 3 enum values
 */
function generateFinanzielleSituation(): FormTypes.FinanzielleSituationField {
  const allOptions = Object.values(FormTypes.FinanzielleSituation);

  // 20% chance: null (not selected)
  if (Math.random() < 0.2) {
    return null;
  }

  // 80% chance: one of the 3 options
  return allOptions[Math.floor(Math.random() * allOptions.length)];
}

/**
 * Generates random Krankschreibung (sick leave status)
 * Uses discriminated union type:
 * - { krankgeschrieben: false } - not on sick leave
 * - { krankgeschrieben: true, details: null } - on sick leave, no details
 * - { krankgeschrieben: true, details: { durch: ... } } - on sick leave with details
 */
function generateKrankschreibung(): FormTypes.Krankschreibung {
  // 50% chance: not on sick leave
  if (Math.random() < 0.5) {
    return { krankgeschrieben: false };
  }

  // 50% chance: on sick leave
  // 20% of sick leave cases: no details (details: null)
  if (Math.random() < 0.2) {
    return { krankgeschrieben: true, details: null };
  }

  // 80% of sick leave cases: with details
  const durchOptions = Object.values(FormTypes.KrankschreibungDurch);
  const durch = durchOptions[Math.floor(Math.random() * durchOptions.length)];

  if (durch === FormTypes.KrankschreibungDurch.Andere) {
    // Expanded variety for value-injection field
    const andereOptionen = [
      'den behandelnden Neurologen',
      'die behandelnde Psychotherapeutin',
      'den Facharzt für Psychosomatik',
      'die Betriebsärztin',
      'den Notarzt',
      'die Fachärztin für Psychiatrie und Psychotherapie',
      'den behandelnden Allgemeinmediziner',
      'die Ärztin im Krankenhaus',
      'den Facharzt für Innere Medizin',
      'die niedergelassene Psychiaterin'
    ];
    const durchAndere = andereOptionen[Math.floor(Math.random() * andereOptionen.length)];
    return {
      krankgeschrieben: true,
      details: { durch: FormTypes.KrankschreibungDurch.Andere, durchAndere }
    };
  }

  return {
    krankgeschrieben: true,
    details: { durch }
  };
}

/**
 * Generates random date within the last 2 years
 * Always returns a valid ISO date string (YYYY-MM-DD), never null
 * Report creation date should always be present
 */
function generateRandomDateLastTwoYears(): string {
  const today = new Date();
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(today.getFullYear() - 2);

  // Random timestamp between two years ago and today
  const randomTimestamp = twoYearsAgo.getTime() +
    Math.random() * (today.getTime() - twoYearsAgo.getTime());

  const randomDate = new Date(randomTimestamp);

  // Format as ISO date string (YYYY-MM-DD)
  return randomDate.toISOString().split('T')[0];
}

/**
 * Education → Job mappings for realistic test data
 * These are VALUE-INJECTION fields, so matching them is fine!
 */
const EDUCATION_JOB_MAPPINGS = {
  berufsausbildung: {
    'Kaufmann/-frau': 'Bürokaufmann/-frau',
    'Schreiner/in': 'Schreiner/in',
    'Elektriker/in': 'Elektriker/in',
    'Koch/Köchin': 'Koch/Köchin',
    'Krankenpfleger/in': 'Krankenpfleger/in',
    'KFZ-Mechatroniker/in': 'Mechaniker/in',
    'Friseur/in': 'Friseur/in',
    'Industriemechaniker/in': 'Mechaniker/in',
    'Bankkaufmann/-frau': 'Bankkaufmann/-frau',
    'Einzelhandelskaufmann/-frau': 'Verkäufer/in',
    'Maurer/in': 'Maurer/in',
    'Zimmerer/Zimmerin': 'Handwerker/in',
    'Fachinformatiker/in': 'Softwareentwickler/in',
    'Medizinische/r Fachangestellte/r': 'Medizinische/r Fachangestellte/r'
  },
  studium: {
    'Psychologie': 'Psychologe/Psychologin',
    'Medizin': 'Arzt/Ärztin',
    'Informatik': 'Softwareentwickler/in',
    'Betriebswirtschaftslehre': 'Betriebswirt/in',
    'Pädagogik': 'Lehrer/in',
    'Soziologie': 'Sozialarbeiter/in',
    'Jura': 'Rechtsanwalt/-anwältin',
    'Architektur': 'Architekt/in',
    'Biologie': 'Biologe/Biologin',
    'Chemie': 'Chemiker/in',
    'Physik': 'Physiker/in',
    'Germanistik': 'Lehrer/in',
    'Maschinenbau': 'Ingenieur/in',
    'Soziale Arbeit': 'Sozialarbeiter/in'
  }
};

/**
 * Generates random educational background (Bildungsweg)
 * Tests ALL possible combinations independently (no artificial constraints)
 */
function generateBildungsweg(): FormTypes.Bildungsweg {
  const schulabschlussOptions: FormTypes.SchulabschlussField[] = [
    FormTypes.Schulabschluss.Hauptschule,
    FormTypes.Schulabschluss.MittlereReife,
    FormTypes.Schulabschluss.Abitur,
    FormTypes.Schulabschluss.KeinAbschluss,
    null
  ];
  const ausbildungStatusOptions: FormTypes.AusbildungStatus[] = [
    FormTypes.AusbildungStatus.Laufend,
    FormTypes.AusbildungStatus.Abgebrochen,
    FormTypes.AusbildungStatus.Abgeschlossen,
  ];

  // Expanded examples for value-injection fields (variety for realism)
  const berufsausbildungBeispiele = Object.keys(EDUCATION_JOB_MAPPINGS.berufsausbildung);
  const studiumBeispiele = Object.keys(EDUCATION_JOB_MAPPINGS.studium);

  const promotionBeispiele = [
    'Klinische Psychologie',
    'Neurowissenschaften',
    'Psychiatrie',
    'Sozialpsychologie',
    'Entwicklungspsychologie',
    'Neuropsychologie',
    'Medizinische Psychologie',
    'Differentielle Psychologie',
    'Arbeits- und Organisationspsychologie'
  ];

  // Include empty state (10% chance)
  const schulabschluss = schulabschlussOptions[Math.floor(Math.random() * schulabschlussOptions.length)];

  // Berufsausbildung: null (50%) or object with data (50%)
  const berufsausbildung: FormTypes.Berufsausbildung = Math.random() < 0.5
    ? null
    : {
        als: berufsausbildungBeispiele[Math.floor(Math.random() * berufsausbildungBeispiele.length)],
        status: ausbildungStatusOptions[Math.floor(Math.random() * ausbildungStatusOptions.length)]
      };

  // Studium status options using enum (always required when active)
  const studiumStatusOptions: FormTypes.StudiumStatus[] = [
    FormTypes.StudiumStatus.Laufend,
    FormTypes.StudiumStatus.Abgebrochen,
    FormTypes.StudiumStatus.Abgeschlossen,
  ];

  // Promotion status options using enum (always required when active)
  const promotionStatusOptions: FormTypes.PromotionStatus[] = [
    FormTypes.PromotionStatus.Laufend,
    FormTypes.PromotionStatus.Abgebrochen,
    FormTypes.PromotionStatus.Abgeschlossen,
  ];

  // Studium: null-based pattern - 50/50 chance of being active
  const studium: FormTypes.Studium = Math.random() < 0.5
    ? {
        fach: studiumBeispiele[Math.floor(Math.random() * studiumBeispiele.length)],
        status: studiumStatusOptions[Math.floor(Math.random() * studiumStatusOptions.length)]
      }
    : null;

  // Promotion: null-based pattern - 15% chance of being active (CAN be active even without studium - tests edge case)
  const promotion: FormTypes.Promotion = Math.random() < 0.15
    ? {
        fach: promotionBeispiele[Math.floor(Math.random() * promotionBeispiele.length)],
        status: promotionStatusOptions[Math.floor(Math.random() * promotionStatusOptions.length)]
      }
    : null;

  return {
    schulabschluss,
    berufsausbildung,
    studium,
    promotion,
  };
}

/**
 * Generates random occupation data (Beruf)
 * All LOGIC fields are independent - tests "contradictory" states (e.g., job title + arbeitslos checkbox)
 * But CAN match job title to education for realism (both are value-injection)
 */
function generateBeruf(bildungsweg?: FormTypes.Bildungsweg): FormTypes.BerufStatus {
  // Base job titles (variety)
  const baseBerufsbezeichnungen = [
    'Softwareentwickler/in',
    'Lehrer/in',
    'Krankenpfleger/in',
    'Verkäufer/in',
    'Bürokaufmann/-frau',
    'Ingenieur/in',
    'Sozialarbeiter/in',
    'Handwerker/in',
    'Koch/Köchin',
    'Arzt/Ärztin',
    'Erzieher/in',
    'Grafiker/in',
    'Journalist/in',
    'Mechaniker/in',
    'Elektriker/in',
    'Physiotherapeut/in',
    'Rechtsanwalt/-anwältin',
    // Status terms (might contradict checkboxes - but that's okay!)
    'arbeitslos',
    'arbeitssuchend',
    'in Elternzeit',
    'Rentner/in',
    'Student/in',
    'in Ausbildung',
    ''
  ];

  const anstellungsarten: (FormTypes.Anstellungsart | null)[] = [
    FormTypes.Anstellungsart.Vollzeit,
    FormTypes.Anstellungsart.Teilzeit,
    FormTypes.Anstellungsart.MiniJob,
    null
  ];

  // First decide if currently employed
  const isEmployed = Math.random() < 0.5;

  // Generate beschaeftigung (null = not employed, object = employed)
  let beschaeftigung: FormTypes.Beschaeftigung = null;

  if (isEmployed) {
    let berufsbezeichnung = '';

    // Try to match job to education (50% of the time) for realism
    if (Math.random() < 0.5 && bildungsweg) {
      // Try to match to Studium first (null-based pattern)
      if (bildungsweg.studium !== null && bildungsweg.studium.fach && EDUCATION_JOB_MAPPINGS.studium[bildungsweg.studium.fach as keyof typeof EDUCATION_JOB_MAPPINGS.studium]) {
        berufsbezeichnung = EDUCATION_JOB_MAPPINGS.studium[bildungsweg.studium.fach as keyof typeof EDUCATION_JOB_MAPPINGS.studium];
      }
      // Then try Berufsausbildung
      else if (bildungsweg.berufsausbildung !== null && bildungsweg.berufsausbildung.als && EDUCATION_JOB_MAPPINGS.berufsausbildung[bildungsweg.berufsausbildung.als as keyof typeof EDUCATION_JOB_MAPPINGS.berufsausbildung]) {
        berufsbezeichnung = EDUCATION_JOB_MAPPINGS.berufsausbildung[bildungsweg.berufsausbildung.als as keyof typeof EDUCATION_JOB_MAPPINGS.berufsausbildung];
      }
    }

    // If no match from education, pick from base list
    if (!berufsbezeichnung) {
      berufsbezeichnung = baseBerufsbezeichnungen[Math.floor(Math.random() * baseBerufsbezeichnungen.length)];
    }

    // Set anstellungsart (exclude null when employed)
    const anstellungsart = anstellungsarten[Math.floor(Math.random() * (anstellungsarten.length - 1))] ?? FormTypes.Anstellungsart.Vollzeit;

    beschaeftigung = { berufsbezeichnung, anstellungsart };
  }

  // Arbeitslosigkeit: discriminated union - { arbeitslos: false } or { arbeitslos: true; dauer: Dauer | null }
  const isArbeitslos = Math.random() < 0.25;
  const arbeitslosigkeit: FormTypes.Arbeitslosigkeit = isArbeitslos
    ? {
        arbeitslos: true,
        // 70% chance to have dauer when arbeitslos is true (tests null dauer edge case)
        dauer: Math.random() < 0.7 ? {
          jahre: Math.random() < 0.7 ? Math.floor(Math.random() * 6) : 0,
          monate: Math.random() < 0.5 ? Math.floor(Math.random() * 12) : 0,
          wochen: Math.random() < 0.2 ? Math.floor(Math.random() * 4) : 0,
          tage: Math.random() < 0.1 ? Math.floor(Math.random() * 7) : 0,
        } : null,
      }
    : { arbeitslos: false };

  // Rente: discriminated union - { berentet: false } or { berentet: true; dauer: Dauer | null }
  const isBerentet = Math.random() < 0.15;
  const rente: FormTypes.Rente = isBerentet
    ? {
        berentet: true,
        // 70% chance to have dauer when berentet is true (tests null dauer edge case)
        dauer: Math.random() < 0.7 ? {
          jahre: Math.random() < 0.7 ? Math.floor(Math.random() * 20) : 0,
          monate: Math.random() < 0.5 ? Math.floor(Math.random() * 12) : 0,
          wochen: Math.random() < 0.2 ? Math.floor(Math.random() * 4) : 0,
          tage: Math.random() < 0.1 ? Math.floor(Math.random() * 7) : 0,
        } : null,
      }
    : { berentet: false };

  return {
    beschaeftigung,
    arbeitslosigkeit,
    rente,
  };
}

/**
 * Generates random Kinder data using the discriminated union type
 * Tests ALL possible states: null (not selected), { anzahl: 0 }, or { anzahl: N, details: [...] }
 * Each KindDetails can have partial data (alter only, geschlecht only, or neither)
 */
function generateKinder(maxChildren: number): FormTypes.Kinder {
  // 10% chance of null (not selected yet - edge case)
  if (Math.random() < 0.1) {
    return null;
  }

  // Random number of children: 0 to maxChildren
  const anzahl = Math.floor(Math.random() * (maxChildren + 1));

  if (anzahl === 0) {
    return { anzahl: 0 };
  }

  // Generate KindDetails for each child
  const geschlechtValues = Object.values(FormTypes.Geschlecht);
  const details: FormTypes.KindDetails[] = [];

  for (let i = 0; i < anzahl; i++) {
    // Each child can have partial data (test edge cases)
    const hasAlter = Math.random() < 0.85; // 85% have age
    const hasGeschlecht = Math.random() < 0.85; // 85% have gender

    details.push({
      alter: hasAlter ? Math.floor(Math.random() * 40) + 1 : null,
      geschlecht: hasGeschlecht
        ? geschlechtValues[Math.floor(Math.random() * geschlechtValues.length)]
        : null,
    });
  }

  // Return with proper tuple type based on anzahl
  return { anzahl, details } as FormTypes.Kinder;
}

/**
 * Generates random Kapitel 6 data (Allgemeine Antragsdaten)
 * Tests ALL therapy, treatment, and application type options
 */
export function generateKapitel6Data(): {
  therapieform: string;
  behandlungsform: string;
  antragsart: string;
} {
  // Logic-affecting fields: Must test ALL therapy options
  const randomTherapie = FormConfig.FORM_OPTIONS.therapieform[
    Math.floor(Math.random() * FormConfig.FORM_OPTIONS.therapieform.length)
  ];
  const randomBehandlung = FormConfig.FORM_OPTIONS.behandlungsform[
    Math.floor(Math.random() * FormConfig.FORM_OPTIONS.behandlungsform.length)
  ];
  const randomAntrag = FormConfig.FORM_OPTIONS.antragsart[
    Math.floor(Math.random() * FormConfig.FORM_OPTIONS.antragsart.length)
  ];

  return {
    therapieform: randomTherapie.id,
    behandlungsform: randomBehandlung.id,
    antragsart: randomAntrag.id,
  };
}

/**
 * Main function: Generates complete demographics data
 * Applies all principles from docs/GENERATION-PRINCIPLES.md
 */
export function generateDemographics(): DemographicsData {
  // Logic-affecting field: Must test ALL gender options (affects pronouns)
  const geschlechtValues = Object.values(FormTypes.Geschlecht);
  const randomGender = geschlechtValues[
    Math.floor(Math.random() * geschlechtValues.length)
  ];

  // Value-injection field: Random range is sufficient
  const randomAge = Math.floor(Math.random() * (99 - 21 + 1)) + 21;

  // Value-injection field: Make kinder count age-appropriate for realism
  // Young age (21-30): 0-2 children more likely
  // Middle age (31-50): 0-3 children
  // Older (51+): 0-4 children
  const maxChildren = randomAge < 30 ? 3 : randomAge < 50 ? 4 : 5;
  const kinder = generateKinder(maxChildren);

  // Value-injection field: Variety for realism
  const randomDigits = Math.floor(Math.random() * 10000000000)
    .toString()
    .padStart(10, '0');
  const patientCipher = `P-Chiffre${randomDigits}`;

  // Generate education first, then pass to Beruf for realistic matching
  const bildungsweg = generateBildungsweg();
  const beruf = generateBeruf(bildungsweg);

  // Logic-affecting field: Must test ALL familienstand options
  const familienstandValues = Object.values(FormTypes.Familienstand);
  const randomFamilienstand = familienstandValues[
    Math.floor(Math.random() * familienstandValues.length)
  ];

  // Living and financial situation
  const wohnsituation = generateWohnsituation();
  const finanzielleSituation = generateFinanzielleSituation();

  // Sick leave status (discriminated union type)
  const krankschreibung = generateKrankschreibung();

  // Generate Kapitel 6 data (Allgemeine Antragsdaten)
  const kapitel6Data = generateKapitel6Data();

  return {
    geschlecht: randomGender,
    alter: randomAge,
    patientenchiffre: patientCipher,
    datumBerichterstellung: generateRandomDateLastTwoYears(),
    bildungsweg,
    beruf,
    familienstand: randomFamilienstand,
    kinder,
    wohnsituation,
    finanzielleSituation,
    krankschreibung,
    ...kapitel6Data,
  };
}
