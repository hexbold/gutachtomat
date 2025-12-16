// --- Shared Types for Symptom Selections ---

export type Selected = 'selected';

/** Generic multi-select: Partial<Record<Enum, 'selected'>> */
export type SymptomSelection<E extends string> = Partial<Record<E, Selected>>;

/**
 * Card selection entry with optional details (brackets/text).
 * brackets: short addition in parentheses
 * text: full sentence insertion
 */
export interface CardSelectionEntry {
  selected: true;
  details: {
    brackets?: string;
    text?: string;
  };
}

/** Card-based multi-select with detail fields */
export type CardSelection<E extends string> = Partial<Record<E, CardSelectionEntry>>;

/** @deprecated Use CardSelectionEntry instead */
export type SelectionWithTextEntry = CardSelectionEntry;

/** @deprecated Use CardSelection instead */
export type SelectionWithText<E extends string> = CardSelection<E>;

// --- Basic Types ---

export enum Geschlecht {
  M = 'm',
  W = 'w',
  D = 'd'
}

export type GeschlechtField = Geschlecht | null;

export type Alter = number | null;


export type Patientenchiffre = string | null;


export interface Dauer {
  jahre: number;
  monate: number;
  wochen: number;
  tage: number;
}


export enum Anstellungsart {
  Vollzeit = 'vollzeit',
  Teilzeit = 'teilzeit',
  MiniJob = 'minijob'
}


export enum Schulabschluss {
  Hauptschule = 'hauptschule',
  MittlereReife = 'mittlereReife',
  Abitur = 'abitur',
  KeinAbschluss = 'keinAbschluss'
}

export type SchulabschlussField = Schulabschluss | null;


// --- Bildungsweg Types ---

/** Status shared by Berufsausbildung, Studium, Promotion */
export enum AusbildungStatus {
  Laufend = 'laufend',
  Abgeschlossen = 'abgeschlossen',
  Abgebrochen = 'abgebrochen'
}

export type Berufsbezeichnung = string;
export type Studienfach = string;


/** Berufsausbildung: null = not active, object = active */
export type Berufsausbildung = null | {
  als: Berufsbezeichnung;
  status: AusbildungStatus;
};


export enum StudiumStatus {
  Laufend = 'laufend',
  Abgeschlossen = 'abgeschlossen',
  Abgebrochen = 'abgebrochen'
}

/** Studium: null = not active, object = active */
export type Studium = null | {
  fach: Studienfach;
  status: StudiumStatus;
};


export enum PromotionStatus {
  Laufend = 'laufend',
  Abgeschlossen = 'abgeschlossen',
  Abgebrochen = 'abgebrochen'
}

/** Promotion: null = not active, object = active */
export type Promotion = null | {
  fach: Studienfach;
  status: PromotionStatus;
};

export type DatumBerichterstellung = string | null;

export enum Familienstand {
  Ledig = 'familienstand_ledig',
  Partnerschaft = 'familienstand_partnerschaft',
  Verheiratet = 'familienstand_verheiratet',
  Geschieden = 'familienstand_geschieden',
  Getrennt = 'familienstand_getrennt',
  Verwitwet = 'familienstand_verwitwet'
}
export type FamilienstandField = Familienstand | null;


export enum FinanzielleSituation {
  Angespannt = 'angespannt',
  Ausreichend = 'ausreichend',
  Stabil = 'stabil'
}
export type FinanzielleSituationField = FinanzielleSituation | null;

// --- Wohnsituation ---
export enum Wohnsituation {
  Allein = 'allein',
  Partner = 'partner',
  Eltern = 'eltern',
  Kinder = 'kinder',
  WG = 'wg'
}

/** Mitbewohner details - at least one must be true (enforced by union) */
export type MitbewohnerDetails =
  | { mitPartner: true;    mitKindern: boolean; beiEltern: boolean; inWG: boolean }
  | { mitPartner: boolean; mitKindern: true;    beiEltern: boolean; inWG: boolean }
  | { mitPartner: boolean; mitKindern: boolean; beiEltern: true;    inWG: boolean }
  | { mitPartner: boolean; mitKindern: boolean; beiEltern: boolean; inWG: true };

/** Wohnsituation: null | lives alone | lives with others (at least one) */
export type WohnsituationData =
  | null
  | { lebtAllein: true }
  | { lebtAllein: false } & MitbewohnerDetails;

export type WohnsituationField = WohnsituationData;

// --- Kinder ---

/** Single child data (both fields nullable) */
export interface KindDetails {
  alter: Alter;
  geschlecht: GeschlechtField;
}

/** Kinder: null | none | 1-10 with exact detail slots (tuples) */
export type Kinder =
  | null
  | { anzahl: 0 }
  | { anzahl: 1; details: [KindDetails] }
  | { anzahl: 2; details: [KindDetails, KindDetails] }
  | { anzahl: 3; details: [KindDetails, KindDetails, KindDetails] }
  | { anzahl: 4; details: [KindDetails, KindDetails, KindDetails, KindDetails] }
  | { anzahl: 5; details: [KindDetails, KindDetails, KindDetails, KindDetails, KindDetails] }
  | { anzahl: 6; details: [KindDetails, KindDetails, KindDetails, KindDetails, KindDetails, KindDetails] }
  | { anzahl: 7; details: [KindDetails, KindDetails, KindDetails, KindDetails, KindDetails, KindDetails, KindDetails] }
  | { anzahl: 8; details: [KindDetails, KindDetails, KindDetails, KindDetails, KindDetails, KindDetails, KindDetails, KindDetails] }
  | { anzahl: 9; details: [KindDetails, KindDetails, KindDetails, KindDetails, KindDetails, KindDetails, KindDetails, KindDetails, KindDetails] }
  | { anzahl: 10; details: [KindDetails, KindDetails, KindDetails, KindDetails, KindDetails, KindDetails, KindDetails, KindDetails, KindDetails, KindDetails] };

// --- UI State ---
export interface SectionExpansionState {
  patientenInformationen: boolean;
  allgemeineAntragsdaten: boolean;
  soziodemographischeDaten: boolean;
  bildungsweg: boolean;
  bildungswegSchulabschluss: boolean;
  bildungswegBerufsausbildung: boolean;
  bildungswegStudium: boolean;
  bildungswegPromotion: boolean;
  kapitel3: boolean;
  kapitel4: boolean;
  kapitel2: boolean;
  symptomatik: boolean;
  symptomatikA1: boolean;
  manischeSymptomatik: boolean;
  manischeStimmungEmotional: boolean;
  manischeAntriebEnergie: boolean;
  manischeSprachKognition: boolean;
  manischeVegetativ: boolean;
  manischeSelbsterleben: boolean;
  manischeVerhalten: boolean;
  manischePsychotisch: boolean;
  manischeDissociativ: boolean;
  depressiveSymptomatik: boolean;
  depressiveStimmungEmotional: boolean;
  depressiveAntriebEnergie: boolean;
  depressiveSelbsterleben: boolean;
  depressiveVegetativ: boolean;
  depressivePsychomotorik: boolean;
  depressiveKognition: boolean;
  depressiveVerhalten: boolean;
  depressivePsychotisch: boolean;
  depressiveDissociativ: boolean;
  angstsymptomatik: boolean;
  angstEmotionalesErleben: boolean;
  angstKognition: boolean;
  zwangssymptomatik: boolean;
  zwangssymptomatikZwangsgedanken: boolean;
  zwangssymptomatikWiederkehrendeZwangsgedanken: boolean;
  zwangssymptomatikZwangshandlungen: boolean;
  symptomatikA2: boolean;
  symptomatikA3: boolean;
  symptomatikA4: boolean;
  symptomatikA5: boolean;
  psychischerBefund: boolean;
  erscheinungsbildAllgemein: boolean;
  kontaktverhalten: boolean;
  sprache: boolean;
  bewusstsein: boolean;
  orientierung: boolean;
  mnestik: boolean;
  konzentration: boolean;
  formalesDenken: boolean;
  wahrnehmung: boolean;
  inhaltlichesDenken: boolean;
  ichStorungen: boolean;
  angste: boolean;
  zwange: boolean;
  stimmungUndAffekt: boolean;
  antriebInteresseFreude: boolean;
  psychomotorik: boolean;
  suizidalitat: boolean;
  krankheitseinstellung: boolean;
  testdiagnostischeErgebnisse: boolean;
  kapitel5: boolean;
  kapitel6: boolean;
}

// --- Manische Symptomatik Enums ---
export enum ManischeStimmungSymptom {
  AffektiveLabilitat = 'affektive_labilitat',
  DysphorischGereizteStimmung = 'dysphorisch_gereizte_stimmung',
  EuphorischeStimmung = 'euphorische_stimmung',
  GehobeneStimmung = 'gehobene_stimmung',
  SorgloseHeiterkeit = 'sorglose_heiterkeit',
  UbermassigOptimistischeStimmung = 'ubermassig_optimistische_stimmung',
  UbersteigerteWohlbefinden = 'ubersteigertes_wohlbefinden',
  UbertriebenerOptimismus = 'ubertriebener_optimismus'
}

// --- Antrieb, Energie und Psychomotorik ---
export enum ManischeAntriebSymptom {
  GesteigerterAntrieb = 'gesteigerter_antrieb',
  GesteigertesEnergieniveau = 'gesteigertes_energieniveau',
  Hyperaktivitat = 'hyperaktivitat',
  PsychomotorischeUnruhe = 'psychomotorische_unruhe',
  Ruhelosigkeit = 'ruhelosigkeit'
}

// --- Sprache und Kognition ---
export enum ManischeSpracheKognitionSymptom {
  Gedankendraengen = 'gedankendraengen',
  Gedankenrasen = 'gedankenrasen',
  GeschaerftesOderUngewoehnlichKreativesDenken = 'geschaerftes_oder_ungewoehnlich_kreatives_denken',
  GesteigerterRededrang = 'gesteigerter_rededrang',
  HaeufigeThemenwechsel = 'haeufige_themenwechsel',
  HoheAblenkbarkeit = 'hohe_ablenkbarkeit',
  Ideenflucht = 'ideenflucht',
  Konzentrationsstoerungen = 'konzentrationsstoerungen',
  Logorrhoe = 'logorrhoe',
  SprunghafteGedanken = 'sprunghafte_gedanken'
}

// --- Vegetative Symptome ---
export enum ManischeVegetativSymptom {
  GesteigerterAppetit = 'gesteigerter_appetit',
  GesteigertLibido = 'gesteigerte_libido',
  VermindertesSchlafbeduerfnis = 'vermindertes_schlafbeduerfnis'
}

// --- Selbsterleben ---
export enum ManischeSelbsterlebenSymptom {
  GesteigertesSelbstwertgefuehl = 'gesteigertes_selbstwertgefuehl',
  Groessenideen = 'groessenideen',
  Selbstueberschaetzung = 'selbstueberschaetzung',
  UeberoptimismusOderUebertreibungFruehererErfolge = 'ueberoptimismus_oder_uebertreibung_frueherer_erfolge'
}

export enum ManischesVerhaltenSymptom {
  AndauerndeWechselVonAktivitaetenOderPlaenen = 'andauernde_wechsel_von_aktivitaeten_oder_plaenen',
  Distanzlosigkeit = 'distanzlosigkeit',
  GesteigerteGeselligkeit = 'gesteigerte_geselligkeit',
  GesteigertesInteresseAnSexuellenUndAnderenAngenehmeTaetigkeiten = 'gesteigertes_interesse_an_sexuellen_und_anderen_angenehme_taetigkeiten',
  Kritiklosigkeit = 'kritiklosigkeit',
  LeichtsinnigRuecksichtlosesVerhalten = 'leichtsinnig_ruecksichtsloses_verhalten',
  VerlustSozialerHemmungen = 'verlust_sozialer_hemmungen'
}

export enum ImpulsivesVerhaltenDetail {
  ErhohteRisikobereitschaft = 'erhohte_risikobereitschaft',
  Kaufsucht = 'kaufsucht',
  RiskantesFahrverhalten = 'riskantes_fahrverhalten',
  RiskantesSexualverhalten = 'riskantes_sexualverhalten',
  Substanzmissbrauch = 'substanzmissbrauch'
}

// --- Psychotische Symptome ---
export enum ManischePsychotischSymptom {
  Halluzinationen = 'halluzinationen',
  Wahn = 'wahn'
}

// --- Dissoziative Symptome ---
export enum ManischeDissociativSymptom {
  Depersonalisation = 'depersonalisation',
  Derealisation = 'derealisation'
}


export type ManischeStimmungSelection = CardSelection<ManischeStimmungSymptom>;
export type ManischeAntriebSelection = CardSelection<ManischeAntriebSymptom>;
export type ManischeSpracheKognitionSelection = CardSelection<ManischeSpracheKognitionSymptom>;
export type ManischeVegetativSelection = CardSelection<ManischeVegetativSymptom>;
export type ManischeSelbsterlebenSelection = CardSelection<ManischeSelbsterlebenSymptom>;
export type ManischesVerhaltenSelection = CardSelection<ManischesVerhaltenSymptom>;
export type ImpulsivesVerhaltenDetailSelection = CardSelection<ImpulsivesVerhaltenDetail>;
export type ManischePsychotischSelection = SymptomSelection<ManischePsychotischSymptom>;
export type ManischePsychotischDetails = CardSelection<ManischePsychotischSymptom>;
export type ManischeDissociativSelection = CardSelection<ManischeDissociativSymptom>;

/** Impulsives Verhalten nested structure (sub-items + andere text) */
export interface ImpulsivesVerhalten {
  details: ImpulsivesVerhaltenDetailSelection;
  andere: string;
}

/** Manisches Verhalten (selection + nested impulsives) */
export interface ManischesVerhalten {
  selection: ManischesVerhaltenSelection;
  impulsivesVerhalten: ImpulsivesVerhalten;
}

export interface ManischeSymptomatik {
  stimmungEmotionalesErleben: ManischeStimmungSelection;
  antriebEnergiePsychomotorik: ManischeAntriebSelection;
  spracheKognition: ManischeSpracheKognitionSelection;
  vegetativeSymptome: ManischeVegetativSelection;
  selbsterleben: ManischeSelbsterlebenSelection;
  verhalten: ManischesVerhalten;
  psychotischeSymptome: ManischePsychotischDetails;
  dissoziativeSymptome: ManischeDissociativSelection;
  andereSymptome: string;
}

// --- Depressive Symptomatik Enums ---
export enum DepressiveStimmungSymptom {
  GedrueckteStimmung = 'gedrueckte_stimmung',
  Traurigkeit = 'traurigkeit',
  Niedergeschlagenheit = 'niedergeschlagenheit',
  Interesselosigkeit = 'interesselosigkeit',
  Anhedonie = 'anhedonie',
  MorgentiefDerStimmung = 'morgentief_der_stimmung',
  Hoffnungslosigkeit = 'hoffnungslosigkeit',
  Perspektivelosigkeit = 'perspektivelosigkeit',
  Pessimismus = 'pessimismus',
  Verzweiflung = 'verzweiflung',
  GefuehlVonInnererLeere = 'gefuehl_von_innerer_leere',
  GefuehlDerGefuehllosigkeit = 'gefuehl_der_gefuehllosigkeit',
  EmotionaleTaubheit = 'emotionale_taubheit',
  Insuffizienzgefuehle = 'insuffizienzgefuehle',
  Versagensaengste = 'versagensaengste',
  Zukunftsaengste = 'zukunftsaengste',
  Ueberforderungsgefuehle = 'ueberforderungsgefuehle',
  Einsamkeitsgefuehle = 'einsamkeitsgefuehle'
}

// --- Antrieb, Energie und Psychomotorik ---
export enum DepressiveAntriebSymptom {
  ReduzierterAntrieb = 'reduzierter_antrieb',
  Antriebslosigkeit = 'antriebslosigkeit',
  Energielosigkeit = 'energielosigkeit',
  ErhoehtErmuedbarkeit = 'erhoehte_ermuedbarkeit',
  KoerperlicheErschoepfung = 'koerperliche_erschoepfung',
  PsychomotorischeHemmung = 'psychomotorische_hemmung',
  PsychomotorischeVerlangsamung = 'psychomotorische_verlangsamung',
  Agitiertheit = 'agitiertheit',
  Reizbarkeit = 'reizbarkeit'
}

// --- Selbsterleben ---
export enum DepressiveSelbsterlebenSymptom {
  NegativesSelbstbild = 'negatives_selbstbild',
  ReduzierteSelbstwertgefuehl = 'reduziertes_selbstwertgefuehl',
  Minderwertigkeitsgefuehle = 'minderwertigkeitsgefuehle',
  Schuldgefuehle = 'schuldgefuehle',
  Selbstvorwuerfe = 'selbstvorwuerfe',
  VerlustDesSelbstvertrauens = 'verlust_des_selbstvertrauens'
}

// --- Somatovegetative Symptome ---
export enum DepressiveVegetativSymptom {
  Einschlafstoerungen = 'einschlafstoerungen',
  Durchschlafstoerungen = 'durchschlafstoerungen',
  FruehmorgenlichesErwachen = 'fruehmorgenliches_erwachen',
  Hypersomnie = 'hypersomnie',
  Muedigkeit = 'muedigkeit',
  KoerperlicheErschoepfungVegetativ = 'koerperliche_erschoepfung_vegetativ',
  AppetitminderungAppetitlosigkeit = 'appetitminderung_appetitlosigkeit',
  GesteigerterAppetit = 'gesteigerter_appetit',
  Gewichtsverlust = 'gewichtsverlust',
  Gewichtszunahme = 'gewichtszunahme',
  Libidoverlust = 'libidoverlust',
  SexuelleFunktionsstoerungen = 'sexuelle_funktionsstoerungen'
}

export enum DepressivePsychomotorikSymptom {
  PsychomotorischeAgitiertheit = 'psychomotorische_agitiertheit',
  PsychomotorischeHemmungPsychomotorik = 'psychomotorische_hemmung_psychomotorik'
}

export enum DepressiveKognitionSymptom {
  DepressiveKognitiveVerzerrungen = 'depressive_kognitive_verzerrungen',
  KonzentrationsUndAufmerksamkeitsstoerungen = 'konzentrations_und_aufmerksamkeitsstoerungen',
  Gedaechtnisstoerungen = 'gedaechtnisstoerungen',
  Gruebeln = 'gruebeln',
  Gedankenkreisen = 'gedankenkreisen',
  VerlangsamtesDenken = 'verlangsamtes_denken',
  Entscheidungsschwierigkeiten = 'entscheidungsschwierigkeiten'
}

export enum DepressivesVerhaltenSymptom {
  SozialerRueckzug = 'sozialer_rueckzug',
  IsolationUndRueckzugstendenz = 'isolation_und_rueckzugstendenz',
  Prokrastinationsverhalten = 'prokrastinationsverhalten',
  VernachlaessigungVonPflichten = 'vernachlaessigung_von_pflichten',
  VernachlaessigungVonSelbstfuersorge = 'vernachlaessigung_von_selbstfuersorge'
}

// --- Psychotische Symptome ---
export enum DepressivePsychotischSymptom {
  Verarmungswahn = 'verarmungswahn',
  Versuendigungswahn = 'versuendigungswahn',
  Schuldwahn = 'schuldwahn',
  HypochondrischerWahn = 'hypochondrischer_wahn',
  NihilistischerWahn = 'nihilistischer_wahn',
  Halluzinationen = 'halluzinationen'
}

// --- Dissoziative Symptome ---
export enum DepressiveDissociativSymptom {
  Derealisation = 'derealisation',
  Depersonalisation = 'depersonalisation'
}

// ============================================================================
// DEPRESSIVE SYMPTOMATIK - SELECTION TYPES
// ============================================================================

export type DepressiveStimmungSelection = CardSelection<DepressiveStimmungSymptom>;
export type DepressiveAntriebSelection = CardSelection<DepressiveAntriebSymptom>;
export type DepressiveSelbsterlebenSelection = CardSelection<DepressiveSelbsterlebenSymptom>;
export type DepressiveVegetativSelection = CardSelection<DepressiveVegetativSymptom>;
export type DepressivePsychomotorikSelection = CardSelection<DepressivePsychomotorikSymptom>;
export type DepressiveKognitionSelection = CardSelection<DepressiveKognitionSymptom>;
export type DepressivesVerhaltenSelection = CardSelection<DepressivesVerhaltenSymptom>;
export type DepressivePsychotischSelection = CardSelection<DepressivePsychotischSymptom>;
export type DepressiveDissociativSelection = CardSelection<DepressiveDissociativSymptom>;

// ============================================================================
// DEPRESSIVE SYMPTOMATIK - MAIN TYPE
// ============================================================================

/**
 * DepressiveSymptomatik - type-safe symptom selection using CardSelection pattern
 *
 * Benefits:
 * - Type-safe: Only valid enum values as keys
 * - No duplicates: Object keys are unique
 * - Supports details: brackets (parentheses) and text (full sentences)
 * - Performant: Only copies selected items on toggle (sparse storage)
 */
export interface DepressiveSymptomatik {
  stimmungEmotionalesErleben: DepressiveStimmungSelection;
  antriebEnergiePsychomotorik: DepressiveAntriebSelection;
  selbsterleben: DepressiveSelbsterlebenSelection;
  vegetativeSomatischeSymptome: DepressiveVegetativSelection;
  psychomotorischeSymptome: DepressivePsychomotorikSelection;
  kognition: DepressiveKognitionSelection;
  verhalten: DepressivesVerhaltenSelection;
  psychotischeSymptome: DepressivePsychotischSelection;
  dissoziativeSymptome: DepressiveDissociativSelection;
  andereSymptome: string;
}

// ============================================================================
// ANGSTSYMPTOMATIK - TYPE-SAFE ENUMS AND SELECTION TYPES
// ============================================================================

// --- Emotionales Erleben ---
export enum AngstEmotionalesErlebenSymptom {
  SituationsinadaequateAngst = 'situationsinadaequate_angst',
  Todesangst = 'todesangst',
  AngstVorKontrollverlust = 'angst_vor_kontrollverlust',
  AngstVerruecktZuWerden = 'angst_verrueckt_zu_werden',
  GefuehlVonUnkontrollierbarkeit = 'gefuehl_von_unkontrollierbarkeit',
  Ohnmachtsgefuehl = 'ohnmachtsgefuehl',
  Zukunftsaengste = 'zukunftsaengste',
  Erwartungsangst = 'erwartungsangst',
  AngstVorDerAngst = 'angst_vor_der_angst',
  ErhoehtSchreckhaftigkeit = 'erhoehte_schreckhaftigkeit',
  Reizbarkeit = 'reizbarkeit',
  Schamgefuehl = 'schamgefuehl',
  GefuehlDerUnsicherheit = 'gefuehl_der_unsicherheit',
  Besorgtheit = 'besorgtheit'
}

// --- Kognition: Sorgen sub-types (nested with text fields) ---
export enum AngstSorgenTyp {
  UeberAlltag = 'ueber_alltag',
  UeberEigeneGesundheit = 'ueber_eigene_gesundheit',
  UeberGesundheitVonAngehoerigen = 'ueber_gesundheit_von_angehoerigen',
  UeberZukunft = 'ueber_zukunft',
  UeberFinanzen = 'ueber_finanzen',
  UeberFamilie = 'ueber_familie'
}

// --- Kognition: Other symptoms (simple selection) ---
export enum AngstKognitionSymptom {
  Gruebeln = 'gruebeln',
  Gedankenkreisen = 'gedankenkreisen',
  Konzentrationsschwierigkeiten = 'konzentrationsschwierigkeiten',
  KatastrophisierendesDenken = 'katastrophisierendes_denken',
  FormalgedanklicheEinengung = 'formalgedankliche_einengung'
}

export enum AngstVegetativSymptom {
  Herzklopfen = 'herzklopfen',
  Herzrasen = 'herzrasen',
  Schweissausbrueche = 'schweissausbrueche',
  Schwitzen = 'schwitzen',
  Zittern = 'zittern',
  Mundtrockenheit = 'mundtrockenheit',
  Atemnot = 'atemnot',
  Dyspnoe = 'dyspnoe',
  Hyperventilation = 'hyperventilation',
  Erstickungsgefuehl = 'erstickungsgefuehl',
  Beklemmungsgefuehl = 'beklemmungsgefuehl',
  EngeInDerBrust = 'enge_in_der_brust',
  Brustschmerzen = 'brustschmerzen',
  Uebelkeit = 'uebelkeit',
  Magenbeschwerden = 'magenbeschwerden',
  Bauchschmerzen = 'bauchschmerzen',
  Durchfall = 'durchfall',
  Stuhldrang = 'stuhldrang',
  Miktionsdrang = 'miktionsdrang',
  Schwindel = 'schwindel',
  Benommenheit = 'benommenheit',
  Unsicherheit = 'unsicherheit',
  Schwaeche = 'schwaeche',
  Erroeten = 'erroeten',
  Hitzewallungen = 'hitzewallungen',
  Kaelteschauer = 'kaelteschauer',
  Kribbelgefuehle = 'kribbelgefuehle',
  Taubheitsgefuehle = 'taubheitsgefuehle',
  InnereAnspannung = 'innere_anspannung',
  Muskelverspannung = 'muskelverspannung',
  LeereImKopf = 'leere_im_kopf',
  NervositaetUndRuhelosigkeit = 'nervositaet_und_ruhelosigkeit',
  AnhaltendeReizbarkeit = 'anhaltende_reizbarkeit',
  UebertriebeneSchreckhaftigkeit = 'uebertriebene_schreckhaftigkeit',
  Schlafstoerungen = 'schlafstoerungen'
}

// ============================================================================
// ANGSTSYMPTOMATIK - SELECTION TYPES
// ============================================================================

export type AngstEmotionalesErlebenSelection = SymptomSelection<AngstEmotionalesErlebenSymptom>;
export type AngstKognitionSelection = SymptomSelection<AngstKognitionSymptom>;
export type AngstVegetativSelection = SymptomSelection<AngstVegetativSymptom>;

// --- Sorgen nested type ---

/** @deprecated Use SelectionWithTextEntry instead */
export type SorgenDetailEntry = SelectionWithTextEntry;

export type AngstSorgenDetails = SelectionWithText<AngstSorgenTyp>;

/**
 * AngstSorgenData - when present, Sorgen is selected
 * - selected: true is the discriminant (required when sorgen key exists)
 * - details: can be {} (Sorgen alone) or have specific worries with nested text
 *
 * Note: sorgen key absent = not selected, sorgen key present = selected
 */
export interface AngstSorgenData {
  selected: true;
  details: AngstSorgenDetails;
}

/**
 * AngstKognition - combines partial record of symptoms with optional sorgen
 * - Simple symptoms (Grübeln, etc.) use standard Partial<Record<Enum, 'selected'>>
 * - Sorgen uses nested structure with discriminant
 *
 * Initial state: {}
 * With Grübeln: { gruebeln: 'selected' }
 * With Sorgen alone: { sorgen: { selected: true, details: {} } }
 * Combined: { gruebeln: 'selected', sorgen: { selected: true, details: { ueber_alltag: 'text' } } }
 */
export type AngstKognition = AngstKognitionSelection & {
  sorgen?: AngstSorgenData;
};

// ============================================================================
// ANGSTSYMPTOMATIK - VERHALTEN (STRING FIELDS)
// ============================================================================

/**
 * AngstVerhaltenFeld - enum for Verhalten text field keys
 * Used to ensure type-safe access to the verhalten text fields
 */
export enum AngstVerhaltenFeld {
  Vermeidungsverhalten = 'vermeidungsverhalten',
  Sicherheitsverhalten = 'sicherheitsverhalten',
  Rueckversicherungsverhalten = 'rueckversicherungsverhalten',
  BodyChecking = 'body_checking'
}

/**
 * AngstVerhalten - behavioral patterns associated with anxiety
 * Contains 4 optional string fields for describing anxiety-related behaviors:
 * - vermeidungsverhalten: avoidance behavior
 * - sicherheitsverhalten: safety behavior
 * - rueckversicherungsverhalten: reassurance-seeking behavior
 * - bodyChecking: body checking behavior
 *
 * Uses Partial<Record<...>> pattern to allow empty initial state `{}`
 * and sparse storage (only non-empty fields are stored)
 */
export type AngstVerhalten = Partial<Record<AngstVerhaltenFeld, string>>;

// ============================================================================
// ANGSTSYMPTOMATIK - DISSOZIATIVE SYMPTOME
// ============================================================================

/**
 * AngstDissociativSymptom - dissociative symptoms in anxiety context
 */
export enum AngstDissociativSymptom {
  Derealisation = 'derealisation',
  Depersonalisation = 'depersonalisation'
}

export type AngstDissociativSelection = SymptomSelection<AngstDissociativSymptom>;

// ============================================================================
// ANGSTSYMPTOMATIK - PANIKSTÖRUNG
// ============================================================================

/**
 * AngstPanikstoerungSymptom - panic disorder symptoms
 */
export enum AngstPanikstoerungSymptom {
  PanikattackeMitKlassischenVegetativenSymptomen = 'panikattacke_mit_klassischen_vegetativen_symptomen',
  WiederkehrendeUnvorhersehbarePanikattacken = 'wiederkehrende_unvorhersehbare_panikattacken',
  NichtSituationsgebundenePanikattacken = 'nicht_situationsgebundene_panikattacken',
  PanikattackenMitRaschemHoehepunkt = 'panikattacken_mit_raschem_hoehepunkt'
}

export type AngstPanikstoerungSelection = SymptomSelection<AngstPanikstoerungSymptom>;

// ============================================================================
// ANGSTSYMPTOMATIK - AGORAPHOBIE (DISCRIMINATED UNION)
// ============================================================================

/**
 * AgoraphobieBereich - areas/situations triggering agoraphobic anxiety
 */
export enum AgoraphobieBereich {
  AngstVorMenschenmengen = 'angst_vor_menschenmengen',
  OeffentlichePlaetze = 'oeffentliche_plaetze',
  AlleinReisen = 'allein_reisen',
  ReisenMitWeiterEntfernungVonZuhause = 'reisen_mit_weiter_entfernung_von_zuhause',
  OeffentlicheVerkehrsmittel = 'oeffentliche_verkehrsmittel',
  SchlangeStehen = 'schlange_stehen'
}

/**
 * AgoraphobieFlucht - concerns about escape possibilities
 */
export enum AgoraphobieFlucht {
  BeeintraechtigteHandlungsFaehigkeit = 'beeintraechtigte_handlungs_faehigkeit',
  FehlendeFluchtmoeglichkeiten = 'fehlende_fluchtmoeglichkeiten'
}

export type AgoraphobieBereiche = SymptomSelection<AgoraphobieBereich>;
export type AgoraphobieFluchtSelection = SymptomSelection<AgoraphobieFlucht>;

/**
 * Agoraphobie - discriminated union that makes invalid states impossible
 *
 * - {} (empty object) = not selected (initial state)
 * - AgoraphobieMit = "mit Panikattacken" selected, with required fields
 * - AgoraphobieOhne = "ohne Panikattacken" selected, with required fields
 *
 * Discriminant: presence/absence of `paniksymptomatik` property
 * Check with: 'paniksymptomatik' in agoraphobie
 */
export interface AgoraphobieMit {
  paniksymptomatik: 'mit';
  bereiche: AgoraphobieBereiche;
  bereicheAndere: string;
  fluchtmoeglichkeiten: AgoraphobieFluchtSelection;
  fluchtmoeglichkeitenAndere: string;
}

export interface AgoraphobieOhne {
  paniksymptomatik: 'ohne';
  bereiche: AgoraphobieBereiche;
  bereicheAndere: string;
  fluchtmoeglichkeiten: AgoraphobieFluchtSelection;
  fluchtmoeglichkeitenAndere: string;
}

export type Agoraphobie = Record<string, never> | AgoraphobieMit | AgoraphobieOhne;

// ============================================================================
// ANGSTSYMPTOMATIK - SOZIALE PHOBIE
// ============================================================================

/**
 * SozialePhobieHauptsymptom - main symptoms of social phobia
 */
export enum SozialePhobieHauptsymptom {
  AngstImZentrumDerAufmerksamkeit = 'angst_im_zentrum_der_aufmerksamkeit',
  AngstSichPeinlichZuVerhalten = 'angst_sich_peinlich_zu_verhalten',
  VermeidungSozialerSituationen = 'vermeidung_sozialer_situationen',
  VermeidungImZentrumDerAufmerksamkeit = 'vermeidung_im_zentrum_der_aufmerksamkeit'
}

/**
 * SozialePhobieBereichSymptom - areas/situations triggering social anxiety
 */
export enum SozialePhobieBereichSymptom {
  OeffentlichesReden = 'oeffentliches_reden',
  SozialeInteraktion = 'soziale_interaktion',
  BeobachtetWerden = 'beobachtet_werden',
  Leistungssituationen = 'leistungssituationen',
  Autoritaetspersonen = 'autoritaetspersonen',
  Partys = 'partys'
}

/**
 * SozialePhobieVegetativSymptom - vegetative symptoms in social phobia context
 */
export enum SozialePhobieVegetativSymptom {
  Erroeten = 'erroeten',
  Zittern = 'zittern',
  Schwitzen = 'schwitzen',
  Uebelkeit = 'uebelkeit'
}

export type SozialePhobieHauptsymptomSelection = SymptomSelection<SozialePhobieHauptsymptom>;
export type SozialePhobieBereichSelection = SymptomSelection<SozialePhobieBereichSymptom>;
export type SozialePhobieVegetativSelection = SymptomSelection<SozialePhobieVegetativSymptom>;

/**
 * SozialePhobieBereich - areas of social anxiety with selection and andere text
 */
export interface SozialePhobieBereich {
  selection: SozialePhobieBereichSelection;
  andere: string;
}

/**
 * SozialePhobieVegetativ - vegetative symptoms with selection and andere text
 */
export interface SozialePhobieVegetativ {
  selection: SozialePhobieVegetativSelection;
  andere: string;
}

/**
 * SozialePhobieSelected - social phobia data when selected
 */
export interface SozialePhobieSelected {
  hauptsymptome: SozialePhobieHauptsymptomSelection;
  bereichSozialerAengste: SozialePhobieBereich;
  vegetativeSymptome: SozialePhobieVegetativ;
}

/**
 * SozialePhobie - discriminated union that makes invalid states impossible
 *
 * - {} (empty object) = not selected (initial state)
 * - SozialePhobieSelected = has symptom data
 *
 * Discriminant: presence/absence of `hauptsymptome` property
 * Check with: 'hauptsymptome' in sozialePhobie
 */
export type SozialePhobie = Record<string, never> | SozialePhobieSelected;

// ============================================================================
// ANGSTSYMPTOMATIK - SPEZIFISCHE PHOBIEN
// ============================================================================

/**
 * SpezifischePhobieSymptom - specific isolated phobias
 */
export enum SpezifischePhobieSymptom {
  Arachnophobie = 'arachnophobie',
  Hundephobie = 'hundephobie',
  Spritzenphobie = 'spritzenphobie',
  Hoehenangst = 'hoehenangst',
  Flugangst = 'flugangst',
  Klaustrophobie = 'klaustrophobie'
}

export type SpezifischePhobieSelection = SymptomSelection<SpezifischePhobieSymptom>;

// ============================================================================
// ANGSTSYMPTOMATIK - GENERALISIERTE ANGSTSTÖRUNG
// ============================================================================

/**
 * GeneralisierteAngstSymptom - symptoms of generalized anxiety disorder
 */
export enum GeneralisierteAngstSymptom {
  ChronischeAengste = 'chronischeAengste',
  UnkontrollierbareeSorgen = 'unkontrollierbareeSorgen',
  UebermaessigeSorgen = 'uebermaessigeSorgen',
  Kontrollversuche = 'kontrollversuche',
  SichSorgenMachen = 'sichSorgenMachen',
  Sorgenketten = 'sorgenketten',
  AengstlicheErwartungen = 'aengstlicheErwartungen',
  VermeidungAuseinandersetzung = 'vermeidungAuseinandersetzung'
}

export type GeneralisierteAngstSelection = SymptomSelection<GeneralisierteAngstSymptom>;

/**
 * GeneralisierteAngst - generalized anxiety disorder data with selection and text field
 */
export interface GeneralisierteAngst {
  selection: GeneralisierteAngstSelection;
  sorgenLebensbereiche: string;  // "Sorgen beziehen sich auf verschiedene realitätsbezogene Lebensbereiche"
}

// ============================================================================
// ANGSTSYMPTOMATIK - MAIN TYPE
// ============================================================================

/**
 * Angstsymptomatik - type-safe symptom selection using Partial<Record<Enum, 'selected'>>
 *
 * Benefits:
 * - Type-safe: Only valid enum values as keys
 * - No duplicates: Object keys are unique
 * - Self-documenting: 'selected' is clearer than true
 * - Performant: Only copies selected items on toggle (sparse storage)
 */
export interface Angstsymptomatik {
  emotionalesErleben: AngstEmotionalesErlebenSelection;
  kognition: AngstKognition;
  vegetativeSymptome: AngstVegetativSelection;
  verhalten: AngstVerhalten;
  dissoziativeSymptome: AngstDissociativSelection;
  panikstoerung: AngstPanikstoerungSelection;
  agoraphobie: Agoraphobie;
  sozialePhobie: SozialePhobie;
  spezifischePhobien: SpezifischePhobieSelection;
  generalisierteAngst: GeneralisierteAngst;
  andereSymptome: string;
}

// ============================================================================
// ZWANGSSYMPTOMATIK - TYPE-SAFE ENUMS AND SELECTION TYPES
// ============================================================================

// --- Zwangsgedanken: Quälende und wiederkehrende Zwangsgedanken (nested text fields) ---

/**
 * ZwangsgedankenWiederkehrendFeld - enum for the nested text fields under
 * "Quälende und wiederkehrende Zwangsgedanken" (expandable section)
 */
export enum ZwangsgedankenWiederkehrendFeld {
  AufdringlicheGedanken = 'aufdringliche_gedanken',
  AggressiveZwangsgedanken = 'aggressive_zwangsgedanken',
  SexuelleZwangsgedanken = 'sexuelle_zwangsgedanken',
  ReligioeseBlasFhemischeZwangsgedanken = 'religioese_blasphemische_zwangsgedanken',
  Kontaminationsgedanken = 'kontaminationsgedanken',
  MagischesDenken = 'magisches_denken',
  Andere = 'andere'
}

/**
 * ZwangsgedankenWiederkehrend - nested text fields for the expandable section
 * Uses Partial<Record<...>> for sparse storage (only non-empty fields stored)
 */
export type ZwangsgedankenWiederkehrend = Partial<Record<ZwangsgedankenWiederkehrendFeld, string>>;

// --- Zwangsgedanken (complete section) ---

/**
 * ZwangsgedankenSelected - data when Zwangsgedanken section has content
 */
export interface ZwangsgedankenSelected {
  wiederkehrendeZwangsgedanken: ZwangsgedankenWiederkehrend;
  zwanghafteIdeen: string;
  zwangsimpulse: string;
}

/**
 * Zwangsgedanken - discriminated union that allows empty initial state
 * - {} (empty object) = not selected (initial state)
 * - ZwangsgedankenSelected = has data
 *
 * Check with: 'wiederkehrendeZwangsgedanken' in zwangsgedanken
 */
export type Zwangsgedanken = Record<string, never> | ZwangsgedankenSelected;

// --- Zwangshandlungen und Zwangsrituale ---

/**
 * ZwangshandlungTyp - enum for compulsive behavior types
 * (nested selectable items under "Quälende und wiederholende Zwangshandlungen oder Zwangsrituale")
 */
export enum ZwangshandlungTyp {
  Kontrollzwang = 'kontrollzwang',
  Waschzwang = 'waschzwang',
  Ordnungszwang = 'ordnungszwang',
  Wiederholungszwang = 'wiederholungszwang',
  Zaehlzwang = 'zaehlzwang',
  Symmetriezwang = 'symmetriezwang',
  Sammelzwang = 'sammelzwang',
  MentaleZwangsrituale = 'mentale_zwangsrituale'
}

/** @deprecated Use SelectionWithTextEntry instead */
export type ZwangshandlungDetailEntry = SelectionWithTextEntry;

export type ZwangshandlungDetails = SelectionWithText<ZwangshandlungTyp>;

/**
 * ZwangshandlungenSelected - when Zwangshandlungen section has content
 * - selected: true is the discriminant
 * - details: specific compulsion types with nested text
 * - andere: free text field for other compulsions
 */
export interface ZwangshandlungenSelected {
  selected: true;
  details: ZwangshandlungDetails;
  andere: string;
}

/**
 * Zwangshandlungen - discriminated union that allows empty initial state
 * - {} (empty object) = not selected (initial state)
 * - ZwangshandlungenSelected = has data
 *
 * Check with: 'selected' in zwangshandlungen
 */
export type Zwangshandlungen = Record<string, never> | ZwangshandlungenSelected;

// --- Zwangsbezogene Kognitionen und Emotionen (simple checkbox pattern) ---

/**
 * ZwangsbezogeneKognitionSymptom - enum for obsession-related cognitions and emotions
 * Uses simple checkbox pattern like emotionalesErleben in Angstsymptomatik
 */
export enum ZwangsbezogeneKognitionSymptom {
  KognitiveFusion = 'kognitive_fusion',
  UnwillkuerlichAbstossend = 'unwillkuerlich_abstossend',
  ZwangshandlungenSinnlos = 'zwangshandlungen_sinnlos',
  VersuchWiderstand = 'versuch_widerstand',
  VersuchUnterdrueckung = 'versuch_unterdrueckung',
  AngstVorSchadenUnheil = 'angst_vor_schaden_unheil',
  AnspannungErleichterung = 'anspannung_erleichterung'
}

/**
 * ZwangsbezogeneKognitionSelection - simple checkbox selection
 */
export type ZwangsbezogeneKognitionSelection = SymptomSelection<ZwangsbezogeneKognitionSymptom>;

// ============================================================================
// ZWANGSSYMPTOMATIK - MAIN TYPE
// ============================================================================

/**
 * Zwangssymptomatik - type-safe symptom structure for obsessive-compulsive symptoms
 * Contains:
 * - zwangsgedanken: obsessive thoughts section
 * - zwangshandlungen: compulsive behaviors section
 * - zwangsbezogeneKognitionen: obsession-related cognitions and emotions
 */
export interface Zwangssymptomatik {
  zwangsgedanken: Zwangsgedanken;
  zwangshandlungen: Zwangshandlungen;
  zwangsbezogeneKognitionen: ZwangsbezogeneKognitionSelection;
  andereSymptome: string;
}

// A2 Verhaltensdefizite data structure
export interface A2Data {
  symptoms: string[];
  andereSymptome: string;
}

// A3 Verhaltensexzesse data structure
export interface A3Data {
  symptoms: string[];
  andereSymptome: string;
}

// A4 Verlauf und Dauer Symptomatik data structure
export interface A4Data {
  seitWann: string[];
  seitWannAndere: string;
  verstaerkung: string[];
  verstaerkungAndere: string;
}

// A5 Aktuelle Stressfaktoren data structure
export interface A5Data {
  stressfaktoren: string[];
  andereStressfaktoren: string;
}

// B1 Erscheinungsbild - Allgemein data structure
export interface B1Data {
  pflegezustand: string[];
  koerpergeruch: string[];
  kleidungsstil: string[];
  kleidungszustand: string[];
}

// B2 Kontaktverhalten data structure
export interface B2Data {
  ersterEindruck: string[];
  kontaktverhalten: string[];
}

// B3 Sprache data structure
export interface B3Data {
  sprache: string[];
}

// B4 Bewusstsein data structure
export interface B4Data {
  quantitativesBewusstsein: string[];
  qualitativesBewusstsein: string[];
}

// B5 Orientierung data structure
export interface B5Data {
  orientierung: string[];
}

// B6 Mnestik data structure
export interface B6Data {
  mnestik: string[];
}

// B7 Konzentration und Auffassung data structure
export interface B7Data {
  konzentration: string[];
}

// B8 Formales Denken data structure
export interface B8Data {
  denkstruktur: string[];
  denkgeschwindigkeit: string[];
}

// B9 Wahrnehmung data structure
export interface B9Data {
  halluzinationen: string[];
}

// B10 Inhaltliches Denken data structure
export interface B10Data {
  inhaltlichesDenken: string[];
}

// B11 Ich-Störungen data structure
export interface B11Data {
  keineIchStorungen: string[];
  psychotischeIchStorungen: string[];
  nichtPsychotischeIchStorungen: string[];
}

// B12 Ängste data structure
export interface B12Data {
  artenVonAngsten: string[];
  symptomeKompensation: string[];
}

// B13 Zwänge data structure
export interface B13Data {
  zwange: string[];
}

// B14 Stimmung und Affekt data structure
export interface B14Data {
  stimmung: string[];
  affekt: string[];
}

// B15 Antrieb, Interesse und Freudeempfinden data structure
export interface B15Data {
  antrieb: string[];
}

// B16 Psychomotorik data structure
export interface B16Data {
  psychomotorik: string[];
}

// B17 Suizidalität data structure
export interface B17Data {
  gradDerSuizidalitat: string[];
  paktAbspracheFahigkeit: string[];
  abklarungVonSuizidalitat: string[];
}

// B18 Krankheitseinstellung data structure
export interface B18Data {
  krankheitseinsicht: string[];
  behandlungsbereitschaft: string[];
}

// Kapitel 3: Somatischer Befund - Subsection 1
export interface Somato1Data {
  somatischeVorerkrankungen: string; // Radio selection
}

// Kapitel 3: Somatischer Befund - Subsection 2
export interface Somato2Data {
  keineMedikation: boolean;
  praeparat: string;
  dosierung: string; // float as string
  dauerEinheit: string; // 'wochen' or 'monate' radio
  dauerWert: string; // the number value
  verschriebenVon: string; // radio ID
  verschriebenVonAndere: string; // for "Andere"
}

// Kapitel 3: Somatischer Befund - Subsection 3
export interface Somato3Data {
  keineVorbehandlung: boolean;
  settingVorbehandlung: string; // radio ID
  behandlungszeitraumEinheit: string; // 'wochen' or 'monate' radio
  behandlungszeitraumWert: string; // the number value
  behandlungsort: string;
  abschlussberichte: string; // radio ID
  abschlussberichteAndere: string; // for "Andere"
}

// Kapitel 3: Somatischer Befund - Subsection 4
export interface Somato4Data {
  familienanamnese: string; // radio ID
  familiaeHaeufungText: string; // text for "Familiäre Häufung psychischer Erkrankungen"
}

// Illegale Drogen Entry
export interface IllegaleDrogenEntry {
  id: string; // unique identifier
  suchtmittel: string; // text
  menge: string; // float
  mengeEinheit: string; // dropdown: g, mg, ml, l
  haeufigkeit: string; // radio
}

// Kapitel 3: Somatischer Befund - Subsection 5
export interface Somato5Data {
  keineSucht: boolean; // checkbox

  // Alkohol
  alkoholSuchtmittel: string[]; // multiple selection: Bier, Wein, Schnaps
  bierMengeLiter: string; // float
  bierMengeGlaeser: string; // int
  weinMengeLiter: string; // float
  weinMengeGlaeser: string; // int
  schnapsMengeLiter: string; // float
  schnapsMengeGlaeser: string; // int
  alkoholHaeufigkeit: string; // radio: Täglich, Wöchentlich, Gelegentlich

  // Rauchen (Tabak)
  rauchenAnzahl: string; // int
  rauchenHaeufigkeit: string; // radio

  // THC
  thcMenge: string; // float (gramm)
  thcHaeufigkeit: string; // radio

  // Illegale Drogen
  illegaleDrogen: IllegaleDrogenEntry[]; // array of entries

  // Andere
  andereSuchtform: string; // text
}

// Bildungsweg data structure
export interface Bildungsweg {
  // Schulabschluss - radio selection
  schulabschluss: SchulabschlussField;

  // Berufsausbildung - nested type
  berufsausbildung: Berufsausbildung;

  // Studium - nested type
  studium: Studium;

  // Promotion - nested type
  promotion: Promotion;
}

// Arbeitslosigkeit: discriminated union - prevents invalid states
export type Arbeitslosigkeit =
  | { arbeitslos: false }
  | { arbeitslos: true; dauer: Dauer | null };

// Rente: discriminated union - prevents invalid states
export type Rente =
  | { berentet: false }
  | { berentet: true; dauer: Dauer | null };

// ============================================================================
// KRANKSCHREIBUNG - Nested Discriminated Union
// ============================================================================

/**
 * Who issued the sick leave certificate
 */
export enum KrankschreibungDurch {
  Hausarzt = 'hausarzt',
  Psychiater = 'psychiater',
  Andere = 'andere'
}

/**
 * Details about who issued the sick leave
 * - Hausarzt or Psychiater: no additional fields needed
 * - Andere: requires durchAndere text field
 */
export type KrankschreibungDetails =
  | { durch: KrankschreibungDurch.Hausarzt }
  | { durch: KrankschreibungDurch.Psychiater }
  | { durch: KrankschreibungDurch.Andere; durchAndere: string };

/**
 * Krankschreibung: nested discriminated union
 * - krankgeschrieben: false → not on sick leave
 * - krankgeschrieben: true → on sick leave, details optional (null = not specified)
 */
export type Krankschreibung =
  | { krankgeschrieben: false }
  | { krankgeschrieben: true; details: KrankschreibungDetails | null };

// Beschaeftigung: null = not employed, object = employed with details
export type Beschaeftigung = null | {
  berufsbezeichnung: string;
  anstellungsart: Anstellungsart;
};

// Beruf data structure
export interface BerufStatus {
  // Employment (null = not employed, object = employed with berufsbezeichnung and anstellungsart)
  beschaeftigung: Beschaeftigung;

  // Unemployment status
  arbeitslosigkeit: Arbeitslosigkeit;

  // Retirement status
  rente: Rente;
}

// Kapitel 4: Relevante Angaben zur Lebensgeschichte - Subsection A
export interface LebensgAData {
  a1BiographischeEinordnung: string; // text field
  a2Entwicklung: string; // text field
}

// Kapitel 4: Relevante Angaben zur Krankheitsanamnese - Subsection B
export interface LebensgBData {
  b1SituationPsychotherapie: string; // text field
  b2BeginnDauerVerlauf: string; // text field
  b3AusloesendeFaktoren: string; // text field
}

// Kapitel 5: Diagnosen - Selected diagnosis with certainty
export interface SelectedDiagnosisData {
  code: string; // ICD-10 code (e.g., "F32.1")
  name: string; // Diagnosis name
  sicherheit: 'G' | 'V' | null; // (G)esichert or (V)erdacht
}

// Kapitel 5: Diagnosen data structure
export interface Kap5DiagnosenData {
  selectedDiagnoses: SelectedDiagnosisData[];
}

// Kapitel 4: Funktionales Bedingungsmodell - Subsection C
export interface LebensgCData {
  // C1 fields
  c1SituationExtern: string;
  c1SituationIntern: string;
  c1Organismus: string;
  c1ReaktionKognitiv: string;
  c1ReaktionEmotional: string;
  c1ReaktionPhysiologisch: string;
  c1ReaktionBehavioral: string;
  c1KonsequenzKurzfristigCPlus: string;
  c1KonsequenzKurzfristigCMinus: string;
  c1KonsequenzKurzfristigCPlusSlash: string;
  c1KonsequenzKurzfristigCMinusSlash: string;
  c1KonsequenzLangfristigCPlus: string;
  c1KonsequenzLangfristigCMinus: string;
  c1KonsequenzLangfristigCPlusSlash: string;
  c1KonsequenzLangfristigCMinusSlash: string;

  // C2.1 fields
  // 1. Kognitiv-emotionale Vulnerabilität
  // 1.1 Elemente aus Plananalyse und Kognitionsanalyse
  c21KognitivGrundbeduerfnisse: string[]; // Bindung, Autonomie/Kontrolle, etc.
  c21KognitivGrundbeduerfnisseAndere: string;
  c21KognitivGrundannahmen: string;
  c21KognitivPlaeneAnnaehrung: string;
  c21KognitivPlaeneVermeidung: string;
  c21KognitivPlaeneAndere: string;
  // 1.2 Persönlichkeit und Temperament
  c21KognitivPersoenlichkeit: string;
  // 1.3 Frühkindliche Erfahrungen
  c21KognitivFruehkindlich: string[];
  c21KognitivFruehkindlichAndere: string;
  // 2. Biologische / genetische Vulnerabilität
  c21BiologischGenetisch: string[];
  c21BiologischGenetischAndere: string;
  // 3. Soziale Vulnerabilität
  c21SozialeVulnerabilitaet: string[];
  c21SozialeVulnerabilitaetAndere: string;

  // C2.2 fields
  c22BelastendeLebensereignisse: string;
  c22KumulationVonBelastungen: string;
  c22TraumatischeEreignisse: string;
  c22Andere: string;

  // C2.3 fields - Aufrechterhaltende Bedingungen
  // 1. Dysfunktionale Kognitionen
  c23DysfunktionaleKognitionen: string[]; // sub-items: Denkfehler, Negative automatische Gedanken, etc.
  c23DenkfehlerText: string;
  c23AutomatischeGedankenText: string;
  c23MisserfolgsattributionenText: string;

  // 2. Grübeln
  c23Gruebeln: string[]; // ['Grübeln'] when checked

  // 3. Dysfunktionale Emotionsregulationsstrategien
  c23Emotionsregulationsstrategien: string[]; // sub-items
  c23EmotionsregulationsstrategienAndere: string;

  // 4. Dysfunktionale Situations- und Selbstwirksamkeitserwartungen
  c23Selbstwirksamkeitserwartungen: string[]; // sub-items
  c23SituationsKompetenzText: string;
  c23SituationsReaktionText: string;
  c23SituationsErgebnisText: string;

  // 5. Dysfunktionale Bewältigungsstile
  c23Bewaeltigungsstile: string[]; // sub-items

  // 6. Selbstwertproblematik
  c23Selbstwertproblematik: string[]; // sub-items
  c23SelbstwertproblematikAndere: string;

  // 7. Kompetenzdefizite
  c23Kompetenzdefizite: string[]; // sub-items
  c23KompetenzdefiziteAndere: string;

  // 8. Sozialer Rückzug
  c23SozialerRueckzug: string[]; // ['Sozialer Rückzug'] when checked

  // 9. Operante Verstärkung
  c23OperanteVerstaerkung: string[]; // ['Operante Verstärkung'] when checked

  // 10. Teufelskreismodelle
  c23Teufelskreismodelle: string[]; // sub-items

  // 11. Gelernte Hilflosigkeit
  c23GelernteHilflosigkeit: string[]; // ['Gelernte Hilflosigkeit'] when checked

  // 12. Chronische Stressoren
  c23ChronischeStressoren: string[]; // ['Chronische Stressoren'] when checked

  // 13. Abhängigkeiten
  c23Abhaengigkeiten: string[]; // ['Abhängigkeiten'] when checked

  // 14. Krankheitsgewinn
  c23KrankheitsgewinnInternale: string[]; // internale sub-items
  c23KrankheitsgewinnExternale: string[]; // externale sub-items

  // 15. Andere
  c23Andere: string;
}

// Form structure
export interface Form {
  geschlecht: GeschlechtField;
  alter: Alter;
  patientenchiffre: Patientenchiffre;
  datumBerichterstellung: DatumBerichterstellung;
  bildungsweg: Bildungsweg;
  beruf: BerufStatus;
  familienstand: FamilienstandField;
  kinder: Kinder;
  wohnsituation: WohnsituationField;
  finanzielleSituation: FinanzielleSituationField;
  krankschreibung: Krankschreibung;
  manischeSymptomatik: ManischeSymptomatik;
  depressiveSymptomatik: DepressiveSymptomatik;
  angstsymptomatik: Angstsymptomatik;
  zwangssymptomatik: Zwangssymptomatik;
  a2: A2Data;
  a3: A3Data;
  a4: A4Data;
  a5: A5Data;
  b1: B1Data;
  b2: B2Data;
  b3: B3Data;
  b4: B4Data;
  b5: B5Data;
  b6: B6Data;
  b7: B7Data;
  b8: B8Data;
  b9: B9Data;
  b10: B10Data;
  b11: B11Data;
  b12: B12Data;
  b13: B13Data;
  b14: B14Data;
  b15: B15Data;
  b16: B16Data;
  b17: B17Data;
  b18: B18Data;
  c: string;
  somato1: Somato1Data;
  somato2: Somato2Data;
  somato3: Somato3Data;
  somato4: Somato4Data;
  somato5: Somato5Data;
  lebensgA: LebensgAData;
  lebensgB: LebensgBData;
  lebensgC: LebensgCData;
  therapieform: string;
  behandlungsform: string;
  antragsart: string;
  kap5Diagnosen: Kap5DiagnosenData;
}

// Form submission state
export interface SubmissionState {
  isLoading: boolean;
  result: string | null;
  error: string | null;
}

// Wizard state
export type ViewMode = 'wizard' | 'form';

export interface WizardState {
  currentStep: number; // 1-7
  completedSteps: Set<number>; // Steps that have been completed
  viewMode: ViewMode; // 'wizard' or 'form'
  visitedSteps: Set<number>; // Steps that have been visited (for validation)
  step3ConfirmedSubSteps: Set<number>; // Substeps in step 3 that are accessible
  step3CompletedSubSteps: Set<number>; // Substeps in step 3 that have been actually confirmed/completed
  amdpConfirmedPages: Set<number>; // AMDP pages (B1-B18) that are accessible
  amdpCompletedPages: Set<number>; // AMDP pages that have been confirmed/completed
  step4ConfirmedSubSteps: Set<number>; // Substeps in step 4 that are accessible
  step4CompletedSubSteps: Set<number>; // Substeps in step 4 that have been actually confirmed/completed
  step5ConfirmedSubSteps: Set<number>; // Substeps in step 5 that are accessible
  step5CompletedSubSteps: Set<number>; // Substeps in step 5 that have been actually confirmed/completed
}

// Complete form state
export interface GutachtenFormState {
  formData: Form;
  submission: SubmissionState;
  expansionState: SectionExpansionState;
  wizardState: WizardState;
}

// Generic action types - replaces 70+ specific actions
export type FormAction =
  // Basic field operations
  | { type: 'SET_FIELD'; field: keyof Form; value: string | Alter | Patientenchiffre | DatumBerichterstellung }
  | { type: 'SET_MULTIPLE_FIELDS'; data: Partial<Form> }

  // Nested field operations (e.g., 'f30f31.andereSymptome', 'bildungsweg.berufsausbildung')
  // Value can be primitives or objects (for discriminated unions like Berufsausbildung)
  | { type: 'SET_NESTED_FIELD'; fieldPath: string; value: string | number | boolean | null | Record<string, unknown> }
  | { type: 'SET_NESTED_BOOLEAN'; fieldPath: string; value: boolean }

  // Array operations (e.g., 'wohnsituation', 'f30f31.symptoms', 'b1.pflegezustand')
  | { type: 'TOGGLE_ARRAY_FIELD'; fieldPath: string; value: string }

  // Selection object operations (e.g., Partial<Record<Enum, 'selected'>>)
  | { type: 'TOGGLE_SELECTION_FIELD'; fieldPath: string; value: string }

  // Kinder operations (uses discriminated union type)
  | { type: 'SET_KINDER'; value: Kinder }

  // Wohnsituation operations (uses discriminated union type)
  | { type: 'SET_WOHNSITUATION'; value: WohnsituationField }

  // Illegale Drogen operations
  | { type: 'ADD_ILLEGALE_DROGE' }
  | { type: 'REMOVE_ILLEGALE_DROGE'; id: string }
  | { type: 'UPDATE_ILLEGALE_DROGE'; id: string; field: keyof IllegaleDrogenEntry; value: string }

  // Diagnosis operations
  | { type: 'ADD_DIAGNOSIS'; code: string; name: string }
  | { type: 'REMOVE_DIAGNOSIS'; code: string }
  | { type: 'SET_DIAGNOSIS_SICHERHEIT'; code: string; sicherheit: 'G' | 'V' }

  // UI state
  | { type: 'TOGGLE_SECTION_EXPANSION'; section: keyof SectionExpansionState }
  | { type: 'EXPAND_ALL_SECTIONS' }

  // Wizard state
  | { type: 'SET_WIZARD_STEP'; step: number }
  | { type: 'WIZARD_NEXT_STEP' }
  | { type: 'WIZARD_PREVIOUS_STEP' }
  | { type: 'SET_VIEW_MODE'; mode: ViewMode }
  | { type: 'MARK_STEP_COMPLETED'; step: number }
  | { type: 'MARK_STEP_VISITED'; step: number }
  | { type: 'CONFIRM_STEP3_SUBSTEP'; substep: number }
  | { type: 'COMPLETE_STEP3_SUBSTEP'; substep: number }
  | { type: 'CONFIRM_AMDP_PAGE'; page: number }
  | { type: 'COMPLETE_AMDP_PAGE'; page: number }
  | { type: 'CONFIRM_STEP4_SUBSTEP'; substep: number }
  | { type: 'COMPLETE_STEP4_SUBSTEP'; substep: number }
  | { type: 'CONFIRM_STEP5_SUBSTEP'; substep: number }
  | { type: 'COMPLETE_STEP5_SUBSTEP'; substep: number }

  // Form state
  | { type: 'RESET_FORM' }
  | { type: 'RESTORE_STATE'; payload: Partial<Form> }

  // Submission state
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_RESULT'; result: string }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'CLEAR_SUBMISSION_STATE' };

// Initial state
export const initialFormState: GutachtenFormState = {
  formData: {
    geschlecht: null,
    alter: null,
    patientenchiffre: null,
    datumBerichterstellung: null,
    bildungsweg: {
      schulabschluss: null,
      berufsausbildung: null,
      studium: null,
      promotion: null,
    },
    beruf: {
      beschaeftigung: null,
      arbeitslosigkeit: {
        arbeitslos: false,
      },
      rente: {
        berentet: false,
      },
    },
    familienstand: null,
    kinder: null,  // "Anzahl auswählen" - not selected
    wohnsituation: null,  // Not answered
    finanzielleSituation: null,  // Not selected
    krankschreibung: { krankgeschrieben: false },  // Not on sick leave
    manischeSymptomatik: {
      stimmungEmotionalesErleben: {},
      antriebEnergiePsychomotorik: {},
      spracheKognition: {},
      vegetativeSymptome: {},
      selbsterleben: {},
      verhalten: {
        selection: {},
        impulsivesVerhalten: {
          details: {},
          andere: '',
        },
      },
      psychotischeSymptome: {},
      dissoziativeSymptome: {},
      andereSymptome: '',
    },
    depressiveSymptomatik: {
      stimmungEmotionalesErleben: {},
      antriebEnergiePsychomotorik: {},
      selbsterleben: {},
      vegetativeSomatischeSymptome: {},
      psychomotorischeSymptome: {},
      kognition: {},
      verhalten: {},
      psychotischeSymptome: {},
      dissoziativeSymptome: {},
      andereSymptome: '',
    },
    angstsymptomatik: {
      emotionalesErleben: {},
      kognition: {},
      vegetativeSymptome: {},
      verhalten: {},
      dissoziativeSymptome: {},
      panikstoerung: {},
      agoraphobie: {},
      sozialePhobie: {},
      spezifischePhobien: {},
      generalisierteAngst: {
        selection: {},
        sorgenLebensbereiche: '',
      },
      andereSymptome: '',
    },
    zwangssymptomatik: {
      zwangsgedanken: {},
      zwangshandlungen: {},
      zwangsbezogeneKognitionen: {},
      andereSymptome: '',
    },
    a2: {
      symptoms: [],
      andereSymptome: '',
    },
    a3: {
      symptoms: [],
      andereSymptome: '',
    },
    a4: {
      seitWann: [],
      seitWannAndere: '',
      verstaerkung: [],
      verstaerkungAndere: '',
    },
    a5: {
      stressfaktoren: [],
      andereStressfaktoren: '',
    },
    b1: {
      pflegezustand: [],
      koerpergeruch: [],
      kleidungsstil: [],
      kleidungszustand: [],
    },
    b2: {
      ersterEindruck: [],
      kontaktverhalten: [],
    },
    b3: {
      sprache: [],
    },
    b4: {
      quantitativesBewusstsein: [],
      qualitativesBewusstsein: [],
    },
    b5: {
      orientierung: [],
    },
    b6: {
      mnestik: [],
    },
    b7: {
      konzentration: [],
    },
    b8: {
      denkstruktur: [],
      denkgeschwindigkeit: [],
    },
    b9: {
      halluzinationen: [],
    },
    b10: {
      inhaltlichesDenken: [],
    },
    b11: {
      keineIchStorungen: [],
      psychotischeIchStorungen: [],
      nichtPsychotischeIchStorungen: [],
    },
    b12: {
      artenVonAngsten: [],
      symptomeKompensation: [],
    },
    b13: {
      zwange: [],
    },
    b14: {
      stimmung: [],
      affekt: [],
    },
    b15: {
      antrieb: [],
    },
    b16: {
      psychomotorik: [],
    },
    b17: {
      gradDerSuizidalitat: [],
      paktAbspracheFahigkeit: [],
      abklarungVonSuizidalitat: [],
    },
    b18: {
      krankheitseinsicht: [],
      behandlungsbereitschaft: [],
    },
    c: '',
    somato1: {
      somatischeVorerkrankungen: '',
    },
    somato2: {
      keineMedikation: false,
      praeparat: '',
      dosierung: '',
      dauerEinheit: '',
      dauerWert: '',
      verschriebenVon: '',
      verschriebenVonAndere: '',
    },
    somato3: {
      keineVorbehandlung: false,
      settingVorbehandlung: '',
      behandlungszeitraumEinheit: '',
      behandlungszeitraumWert: '',
      behandlungsort: '',
      abschlussberichte: '',
      abschlussberichteAndere: '',
    },
    somato4: {
      familienanamnese: '',
      familiaeHaeufungText: '',
    },
    somato5: {
      keineSucht: false,
      alkoholSuchtmittel: [],
      bierMengeLiter: '',
      bierMengeGlaeser: '',
      weinMengeLiter: '',
      weinMengeGlaeser: '',
      schnapsMengeLiter: '',
      schnapsMengeGlaeser: '',
      alkoholHaeufigkeit: '',
      rauchenAnzahl: '',
      rauchenHaeufigkeit: '',
      thcMenge: '',
      thcHaeufigkeit: '',
      illegaleDrogen: [],
      andereSuchtform: '',
    },
    lebensgA: {
      a1BiographischeEinordnung: '',
      a2Entwicklung: '',
    },
    lebensgB: {
      b1SituationPsychotherapie: '',
      b2BeginnDauerVerlauf: '',
      b3AusloesendeFaktoren: '',
    },
    lebensgC: {
      c1SituationExtern: '',
      c1SituationIntern: '',
      c1Organismus: '',
      c1ReaktionKognitiv: '',
      c1ReaktionEmotional: '',
      c1ReaktionPhysiologisch: '',
      c1ReaktionBehavioral: '',
      c1KonsequenzKurzfristigCPlus: '',
      c1KonsequenzKurzfristigCMinus: '',
      c1KonsequenzKurzfristigCPlusSlash: '',
      c1KonsequenzKurzfristigCMinusSlash: '',
      c1KonsequenzLangfristigCPlus: '',
      c1KonsequenzLangfristigCMinus: '',
      c1KonsequenzLangfristigCPlusSlash: '',
      c1KonsequenzLangfristigCMinusSlash: '',
      c21KognitivGrundbeduerfnisse: [],
      c21KognitivGrundbeduerfnisseAndere: '',
      c21KognitivGrundannahmen: '',
      c21KognitivPlaeneAnnaehrung: '',
      c21KognitivPlaeneVermeidung: '',
      c21KognitivPlaeneAndere: '',
      c21KognitivPersoenlichkeit: '',
      c21KognitivFruehkindlich: [],
      c21KognitivFruehkindlichAndere: '',
      c21BiologischGenetisch: [],
      c21BiologischGenetischAndere: '',
      c21SozialeVulnerabilitaet: [],
      c21SozialeVulnerabilitaetAndere: '',
      c22BelastendeLebensereignisse: '',
      c22KumulationVonBelastungen: '',
      c22TraumatischeEreignisse: '',
      c22Andere: '',
      c23DysfunktionaleKognitionen: [],
      c23DenkfehlerText: '',
      c23AutomatischeGedankenText: '',
      c23MisserfolgsattributionenText: '',
      c23Gruebeln: [],
      c23Emotionsregulationsstrategien: [],
      c23EmotionsregulationsstrategienAndere: '',
      c23Selbstwirksamkeitserwartungen: [],
      c23SituationsKompetenzText: '',
      c23SituationsReaktionText: '',
      c23SituationsErgebnisText: '',
      c23Bewaeltigungsstile: [],
      c23Selbstwertproblematik: [],
      c23SelbstwertproblematikAndere: '',
      c23Kompetenzdefizite: [],
      c23KompetenzdefiziteAndere: '',
      c23SozialerRueckzug: [],
      c23OperanteVerstaerkung: [],
      c23Teufelskreismodelle: [],
      c23GelernteHilflosigkeit: [],
      c23ChronischeStressoren: [],
      c23Abhaengigkeiten: [],
      c23KrankheitsgewinnInternale: [],
      c23KrankheitsgewinnExternale: [],
      c23Andere: '',
    },
    therapieform: '',
    behandlungsform: '',
    antragsart: '',
    kap5Diagnosen: {
      selectedDiagnoses: [],
    },
  },
  submission: {
    isLoading: false,
    result: null,
    error: null,
  },
  expansionState: {
    patientenInformationen: false,
    allgemeineAntragsdaten: false,
    soziodemographischeDaten: false,
    bildungsweg: false,
    bildungswegSchulabschluss: false,
    bildungswegBerufsausbildung: false,
    bildungswegStudium: false,
    bildungswegPromotion: false,
    kapitel3: false,
    kapitel4: false,
    kapitel2: false,
    symptomatik: false,
    symptomatikA1: false,
    manischeSymptomatik: false,
    manischeStimmungEmotional: false,
    manischeAntriebEnergie: false,
    manischeSprachKognition: false,
    manischeVegetativ: false,
    manischeSelbsterleben: false,
    manischeVerhalten: false,
    manischePsychotisch: false,
    manischeDissociativ: false,
    depressiveSymptomatik: false,
    depressiveStimmungEmotional: false,
    depressiveAntriebEnergie: false,
    depressiveSelbsterleben: false,
    depressiveVegetativ: false,
    depressivePsychomotorik: false,
    depressiveKognition: false,
    depressiveVerhalten: false,
    depressivePsychotisch: false,
    depressiveDissociativ: false,
    angstsymptomatik: false,
    angstEmotionalesErleben: false,
    angstKognition: false,
    zwangssymptomatik: false,
    zwangssymptomatikZwangsgedanken: false,
    zwangssymptomatikWiederkehrendeZwangsgedanken: false,
    zwangssymptomatikZwangshandlungen: false,
    symptomatikA2: false,
    symptomatikA3: false,
    symptomatikA4: false,
    symptomatikA5: false,
    psychischerBefund: false,
    erscheinungsbildAllgemein: false,
    kontaktverhalten: false,
    sprache: false,
    bewusstsein: false,
    orientierung: false,
    mnestik: false,
    konzentration: false,
    formalesDenken: false,
    wahrnehmung: false,
    inhaltlichesDenken: false,
    ichStorungen: false,
    angste: false,
    zwange: false,
    stimmungUndAffekt: false,
    antriebInteresseFreude: false,
    psychomotorik: false,
    suizidalitat: false,
    krankheitseinstellung: false,
    testdiagnostischeErgebnisse: false,
    kapitel5: false,
    kapitel6: false,
  },
  wizardState: {
    currentStep: 1,
    completedSteps: new Set<number>(),
    viewMode: 'wizard',
    visitedSteps: new Set<number>([1]), // Start with step 1 visited
    step3ConfirmedSubSteps: new Set<number>([1]), // Start with substep 1 accessible
    step3CompletedSubSteps: new Set<number>(), // No substeps completed initially
    amdpConfirmedPages: new Set<number>([1]), // Start with AMDP page 1 accessible
    amdpCompletedPages: new Set<number>(), // No AMDP pages completed initially
    step4ConfirmedSubSteps: new Set<number>([1]), // Start with substep 1 accessible
    step4CompletedSubSteps: new Set<number>(), // No substeps completed initially
    step5ConfirmedSubSteps: new Set<number>([1]), // Start with substep 1 accessible
    step5CompletedSubSteps: new Set<number>(), // No substeps completed initially
  },
};

// API payload format
export interface GutachtenApiPayload {
  geschlechtId: string | null;
  alter: Alter;
  patientenchiffre: Patientenchiffre;
  datumBerichterstellung: DatumBerichterstellung;
  bildungsweg: Bildungsweg;
  beruf: BerufStatus;
  familienstandId: string | null;
  kinder: Kinder;
  wohnsituation: WohnsituationField;
  finanzielleSituation: FinanzielleSituationField;
  krankschreibung: Krankschreibung;
  therapieformId: string | null;
  behandlungsformId: string | null;
  antragsartId: string | null;
  manischeSymptomatik: ManischeSymptomatik;
  a2: A2Data;
  a3: A3Data;
  a4: A4Data;
  a5: A5Data;
  b1: B1Data;
  b2: B2Data;
  b3: B3Data;
  b4: B4Data;
  b5: B5Data;
  b6: B6Data;
  b7: B7Data;
  b8: B8Data;
  b9: B9Data;
  b10: B10Data;
  b11: B11Data;
  b12: B12Data;
  b13: B13Data;
  b14: B14Data;
  b15: B15Data;
  b16: B16Data;
  b17: B17Data;
  b18: B18Data;
  c: string;
  somato1: Somato1Data;
  somato2: Somato2Data;
  somato3: Somato3Data;
  somato4: Somato4Data;
  somato5: Somato5Data;
  lebensgA: LebensgAData;
  lebensgB: LebensgBData;
  lebensgC: LebensgCData;
  kap5Diagnosen: Kap5DiagnosenData;
}
// Structured content types for text generation
export type ContentNode = ParagraphNode | ChapterNode | SectionNode | SubsectionNode | ListNode | LineBreakNode;

export interface ParagraphNode {
  type: 'paragraph';
  text: string;
  id?: string; // Optional ID for highlighting
}

export interface ChapterNode {
  type: 'chapter';
  title: string;
  content: ContentNode[];
  id?: string;
}

export interface SectionNode {
  type: 'section';
  title: string;
  content: ContentNode[];
  id?: string;
}

export interface SubsectionNode {
  type: 'subsection';
  title: string;
  content: ContentNode[];
  id?: string;
}

export interface ListNode {
  type: 'list';
  ordered: boolean; // true = numbered list, false = bullet list
  items: string[];
  id?: string;
}

export interface LineBreakNode {
  type: 'break';
  id?: string;
}

export interface AssessmentStructure {
  content: ContentNode[];
}

// Text generation result with highlight information
export interface GeneratedTextResult {
  structure: AssessmentStructure; // Structured content
  text: string; // Markdown text (for backward compatibility during migration)
  highlightedSentences: string[]; // All sentences to highlight (empty array if none)
  highlightTimestamp: number | null;  // Timestamp when highlight was created
}
