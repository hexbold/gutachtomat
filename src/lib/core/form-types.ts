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

/**
 * List card selection entry with only brackets (no text).
 * Used for simple lists like Verhaltensauffälligkeiten.
 */
export interface ListCardSelectionEntry {
  selected: true;
  details: {
    brackets?: string;
  };
}

/** List-based multi-select with only brackets field */
export type ListCardSelection<E extends string> = Partial<Record<E, ListCardSelectionEntry>>;

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
  | { mitPartner: true; mitKindern: boolean; beiEltern: boolean; inWG: boolean }
  | { mitPartner: boolean; mitKindern: true; beiEltern: boolean; inWG: boolean }
  | { mitPartner: boolean; mitKindern: boolean; beiEltern: true; inWG: boolean }
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
  dauerVerlaufAusloeser: boolean;
  verhaltensauffaelligkeiten: boolean;
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

export enum AngstSomatovegetativSymptom {
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
  Einschlafstoerungen = 'einschlafstoerungen',
  Durchschlafstoerungen = 'durchschlafstoerungen'
}

// ============================================================================
// ANGSTSYMPTOMATIK - SELECTION TYPES
// ============================================================================

export type AngstEmotionalesErlebenSelection = CardSelection<AngstEmotionalesErlebenSymptom>;
export type AngstKognitionSelection = CardSelection<AngstKognitionSymptom>;
export type AngstSomatovegetativSelection = CardSelection<AngstSomatovegetativSymptom>;

// --- Sorgen nested type ---

export type AngstSorgenDetails = CardSelection<AngstSorgenTyp>;

/**
 * AngstSorgenData - when present, Sorgen is selected
 * - selected: true is the discriminant (required when sorgen key exists)
 * - brackets/text: optional top-level details for "Sorgen" itself
 * - details: can be {} (Sorgen alone) or have specific worries with nested text
 *
 * Note: sorgen key absent = not selected, sorgen key present = selected
 */
export interface AngstSorgenData {
  selected: true;
  brackets?: string;  // Top-level brackets for "Sorgen" itself
  text?: string;      // Top-level text for "Sorgen" itself
  details: AngstSorgenDetails;
  andere?: string;    // Free text for other worries
}

/**
 * AngstKognition - combines CardSelection symptoms with optional sorgen
 * - Simple symptoms (Grübeln, etc.) use CardSelection pattern with brackets/text
 * - Sorgen uses nested structure with discriminant
 *
 * Initial state: {}
 * With Grübeln: { gruebeln: { selected: true, details: {} } }
 * With Sorgen alone: { sorgen: { selected: true, details: {} } }
 * Combined: { gruebeln: { selected: true, details: { brackets: 'info' } }, sorgen: { ... } }
 */
export type AngstKognition = AngstKognitionSelection & {
  sorgen?: AngstSorgenData;
};

// ============================================================================
// ANGSTSYMPTOMATIK - VERHALTEN (CARDSELECTION)
// ============================================================================

/**
 * AngstVerhaltenFeld - enum for Verhalten card selection options
 */
export enum AngstVerhaltenFeld {
  Vermeidungsverhalten = 'vermeidungsverhalten',
  Sicherheitsverhalten = 'sicherheitsverhalten',
  Rueckversicherungsverhalten = 'rueckversicherungsverhalten',
  BodyChecking = 'body_checking'
}

/**
 * AngstVerhalten - behavioral patterns associated with anxiety
 * Uses CardSelection pattern for selecting behaviors with optional details
 */
export type AngstVerhalten = CardSelection<AngstVerhaltenFeld>;

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

export type AngstDissociativSelection = CardSelection<AngstDissociativSymptom>;

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

export type AngstPanikstoerungSelection = CardSelection<AngstPanikstoerungSymptom>;

// ============================================================================
// ANGSTSYMPTOMATIK - AGORAPHOBIE (DISCRIMINATED UNION)
// ============================================================================

/**
 * AgoraphobieBereich - areas/situations triggering agoraphobic anxiety
 */
export enum AgoraphobieBereich {
  AngstVorMenschenmengen = 'angst_vor_menschenmengen',
  AngstVorOeffentlichenPlaetzen = 'angst_vor_oeffentlichen_plaetzen',
  AngstVorAlleinReisen = 'angst_vor_allein_reisen',
  AngstVorWeitenEntfernungenVonZuhause = 'angst_vor_weiten_entfernungen_von_zuhause',
  AngstVorGeschlossenenRaeumen = 'angst_vor_geschlossenen_raeumen',
  AngstDasHausZuVerlassen = 'angst_das_haus_zu_verlassen'
}

/**
 * AgoraphobieFlucht - concerns about escape possibilities
 */
export enum AgoraphobieFlucht {
  FehlenEinesFluchtweges = 'fehlen_eines_fluchtweges',
  FluchtAlsPeinlichOderSchwierigBewertet = 'flucht_als_peinlich_oder_schwierig_bewertet'
}

/**
 * AgoraphobiePaniksymptomatik - with or without panic attacks
 */
export enum AgoraphobiePaniksymptomatik {
  Mit = 'mit',
  Ohne = 'ohne'
}

export type AgoraphobieBereiche = CardSelection<AgoraphobieBereich>;
export type AgoraphobieFluchtSelection = CardSelection<AgoraphobieFlucht>;
export type AgoraphobiePaniksymptomatikSelection = CardSelection<AgoraphobiePaniksymptomatik>;

/**
 * Agoraphobie - uses CardSelection pattern for paniksymptomatik
 *
 * Note: paniksymptomatik is mutually exclusive (only one can be selected at a time)
 * The UI enforces this by deselecting the other option when one is selected.
 */
export interface Agoraphobie {
  paniksymptomatik: AgoraphobiePaniksymptomatikSelection;
  bereiche: AgoraphobieBereiche;
  bereicheAndere: string;
  fluchtmoeglichkeiten: AgoraphobieFluchtSelection;
  fluchtmoeglichkeitenAndere: string;
}

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
  SprechenGruppen = 'sprechen_gruppen',
  EssenOeffentlich = 'essen_oeffentlich',
  SchreibenAnderen = 'schreiben_anderen',
  Vortraege = 'vortraege',
  NegativeBewertung = 'negative_bewertung',
  Blamage = 'blamage'
}

/**
 * SozialePhobieVegetativSymptom - vegetative symptoms in social phobia context
 */
export enum SozialePhobieVegetativSymptom {
  Erroeten = 'erroeten',
  Zittern = 'zittern',
  AngstErbrechen = 'angst_erbrechen',
  MiktionsDefaekation = 'miktions_defaekation'
}

export type SozialePhobieHauptsymptomSelection = CardSelection<SozialePhobieHauptsymptom>;
export type SozialePhobieBereichSelection = CardSelection<SozialePhobieBereichSymptom>;
export type SozialePhobieVegetativSelection = CardSelection<SozialePhobieVegetativSymptom>;

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

export type SpezifischePhobieSelection = CardSelection<SpezifischePhobieSymptom>;

// ============================================================================
// ANGSTSYMPTOMATIK - GENERALISIERTE ANGSTSTÖRUNG
// ============================================================================

/**
 * GeneralisierteAngstHauptsymptom - main symptoms of generalized anxiety disorder (top-level)
 */
export enum GeneralisierteAngstHauptsymptom {
  ChronischeAengste = 'chronische_aengste',
  AengstlicheErwartungen = 'aengstliche_erwartungen',
  VermeidungAuseinandersetzung = 'vermeidung_auseinandersetzung'
}

/**
 * GeneralisierteAngstSorgenSymptom - worry-related symptoms (collapsible sub-section)
 */
export enum GeneralisierteAngstSorgenSymptom {
  UnkontrollierbareeSorgen = 'unkontrollierbare_sorgen',
  UebermaessigeSorgen = 'uebermaessige_sorgen',
  Kontrollversuche = 'kontrollversuche',
  SichSorgenMachen = 'sich_sorgen_machen',
  Sorgenketten = 'sorgenketten',
  SorgenLebensbereiche = 'sorgen_lebensbereiche'
}

export type GeneralisierteAngstHauptsymptomSelection = CardSelection<GeneralisierteAngstHauptsymptom>;
export type GeneralisierteAngstSorgenSelection = CardSelection<GeneralisierteAngstSorgenSymptom>;

/**
 * GeneralisierteAngstSorgen - worry-related symptoms with "Andere" text field
 */
export interface GeneralisierteAngstSorgen {
  selection: GeneralisierteAngstSorgenSelection;
  andere: string;
}

/**
 * GeneralisierteAngstSelected - selected state with all symptom data
 */
export interface GeneralisierteAngstSelected {
  hauptsymptome: GeneralisierteAngstHauptsymptomSelection;
  sorgen: GeneralisierteAngstSorgen;
}

/**
 * GeneralisierteAngst - discriminated union (empty or has data)
 * Discriminant: presence/absence of `hauptsymptome` property
 * Check with: 'hauptsymptome' in generalisierteAngst
 */
export type GeneralisierteAngst = Record<string, never> | GeneralisierteAngstSelected;

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
  somatovegetativeSymptome: AngstSomatovegetativSelection;
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

export type ZwangshandlungDetails = CardSelection<ZwangshandlungTyp>;

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

// ============================================================================
// VERHALTENSEXZESSE - BEHAVIORAL EXCESSES
// ============================================================================

export enum VerhaltensexzessSymptom {
  DysfunktionaleKognitionen = 'dysfunktionale_kognitionen',
  ErduldenBewältigung = 'erdulden_bewaeltigung',
  UeberkompensationBewältigung = 'ueberkompensation_bewaeltigung',
  Gruebeln = 'gruebeln',
  SichSorgenMachen = 'sich_sorgen_machen',
  SozialerRueckzug = 'sozialer_rueckzug',
  SelbstschaedigendesVerhalten = 'selbstschaedigendes_verhalten',
  Suchtverhalten = 'suchtverhalten',
  Substanzmissbrauch = 'substanzmissbrauch',
  Prokrastinationsverhalten = 'prokrastinationsverhalten',
  Vermeidungsverhalten = 'vermeidungsverhalten',
  Sicherheitsverhalten = 'sicherheitsverhalten',
  Rueckversicherungsverhalten = 'rueckversicherungsverhalten',
  BodyChecking = 'body_checking',
  Kontrollverhalten = 'kontrollverhalten',
  Hilfesuchverhalten = 'hilfesuchverhalten',
  ZwanghaftesVerhalten = 'zwanghaftes_verhalten',
  Hypervigilanz = 'hypervigilanz',
  Selbstueberforderung = 'selbstueberforderung',
  UebermaessigesRationalisieren = 'uebermaessiges_rationalisieren'
}

export type VerhaltensexzessSelection = ListCardSelection<VerhaltensexzessSymptom>;

// ============================================================================
// VERHALTENSDEFIZITE - BEHAVIORAL DEFICITS
// ============================================================================

export enum VerhaltensdefizitSymptom {
  DysfunktionaleErwartungen = 'dysfunktionale_erwartungen',
  NegativesSelbstkonzept = 'negatives_selbstkonzept',
  Selbstabwertung = 'selbstabwertung',
  DiskrepanzAnspruchLeistung = 'diskrepanz_anspruch_leistung',
  DefiziteSozialeKontakte = 'defizite_soziale_kontakte',
  DysfunktionaleBeziehungsgestaltung = 'dysfunktionale_beziehungsgestaltung',
  MangelndeAbgrenzung = 'mangelnde_abgrenzung',
  DefiziteSelbstregulation = 'defizite_selbstregulation',
  DefiziteGesundheitsverhalten = 'defizite_gesundheitsverhalten',
  DefiziteAchtsamkeit = 'defizite_achtsamkeit',
  DefiziteBeduerfniswahrnehmung = 'defizite_beduerfniswahrnehmung',
  DefiziteEmotionswahrnehmung = 'defizite_emotionswahrnehmung',
  Selbstwahrnehmungsdefizite = 'selbstwahrnehmungsdefizite',
  DefiziteProblemloesung = 'defizite_problemloesung',
  MangelndeSelbstverstaerkung = 'mangelnde_selbstverstaerkung',
  MangelndeFrustrationstoleranz = 'mangelnde_frustrationstoleranz',
  Distressintoleranz = 'distressintoleranz',
  DefiziteAutonomieentwicklung = 'defizite_autonomieentwicklung',
  Passivitaet = 'passivitaet'
}

export type VerhaltensdefizitSelection = ListCardSelection<VerhaltensdefizitSymptom>;

// ============================================================================
// VERHALTENSAUFFAELLIGKEITEN - COMBINED DATA STRUCTURE
// ============================================================================

export interface Verhaltensauffaelligkeiten {
  exzesse: VerhaltensexzessSelection;
  defizite: VerhaltensdefizitSelection;
  andereExzesse: string;
  andereDefizite: string;
}

// ============================================================================
// SYMPTOMATIK KONTEXT - Duration, Course, and Triggers
// ============================================================================

/**
 * SymptomatikKontext - contextual information about symptoms
 * - beginnUndDauer: When symptoms started and how long
 * - verlauf: How symptoms have progressed
 * - ausloeser: What triggered the symptoms
 */
export interface SymptomatikKontext {
  beginnUndDauer: string;
  verlauf: string;
  ausloeser: string;
}

// ============================================================================
// PSYCHISCHER BEFUND - ERSCHEINUNGSBILD
// ============================================================================

export enum ErscheinungsbildPflegezustand {
  Gepflegt = 'gepflegt',
  Vernachlaessigt = 'vernachlaessigt',
  Verwahrlost = 'verwahrlost',
  Ungepflegt = 'ungepflegt',
}

export enum ErscheinungsbildKoerpergeruch {
  Unauffaellig = 'unauffaellig',
  Unangenehm = 'unangenehm',
  Schweissgeruch = 'schweissgeruch',
  Alkoholgeruch = 'alkoholgeruch',
  Tabakgeruch = 'tabakgeruch',
  THCGeruch = 'thc_geruch',
  Parfuemgeruch = 'parfuemgeruch',
}

export enum ErscheinungsbildKleidungsstil {
  Sauber = 'sauber',
  Ordentlich = 'ordentlich',
  Modisch = 'modisch',
  Klassisch = 'klassisch',
  Sportlich = 'sportlich',
  Einfach = 'einfach',
  Extravagant = 'extravagant',
  Bizarr = 'bizarr',
  NichtAltersgemaess = 'nicht_altersgemaess',
}

export enum ErscheinungsbildKleidungszustand {
  Sauber = 'sauber',
  Fleckig = 'fleckig',
}

export enum ErscheinungsbildKleidungsangemessenheit {
  Angemessen = 'angemessen',
  Unangemessen = 'unangemessen',
}

export interface Erscheinungsbild {
  pflegezustand?: CardSelection<ErscheinungsbildPflegezustand>;
  koerpergeruch?: CardSelection<ErscheinungsbildKoerpergeruch>;
  kleidungsstil?: CardSelection<ErscheinungsbildKleidungsstil>;
  kleidungszustand?: CardSelection<ErscheinungsbildKleidungszustand>;
  kleidungsangemessenheit?: CardSelection<ErscheinungsbildKleidungsangemessenheit>;
}

// Psychischer Befund - Kontaktverhalten
export interface Kontaktverhalten {
  ersterEindruck: string[];
  kontaktverhalten: string[];
}

// Psychischer Befund - Sprache
export interface Sprache {
  sprache: string[];
}

// Psychischer Befund - Bewusstsein
export interface Bewusstsein {
  quantitativesBewusstsein: string[];
  qualitativesBewusstsein: string[];
}

// Psychischer Befund - Orientierung
export interface Orientierung {
  orientierung: string[];
}

// Psychischer Befund - Mnestik
export interface Mnestik {
  mnestik: string[];
}

// Psychischer Befund - Konzentration und Auffassung
export interface KonzentrationUndAuffassung {
  konzentration: string[];
}

// Psychischer Befund - Formales Denken
export interface FormalesDenken {
  denkstruktur: string[];
  denkgeschwindigkeit: string[];
}

// Psychischer Befund - Wahrnehmung
export interface Wahrnehmung {
  halluzinationen: string[];
}

// Psychischer Befund - Inhaltliches Denken
export interface InhaltlichesDenken {
  inhaltlichesDenken: string[];
}

// Psychischer Befund - Ich-Störungen
export interface IchStoerungen {
  keineIchStorungen: string[];
  psychotischeIchStorungen: string[];
  nichtPsychotischeIchStorungen: string[];
}

// Psychischer Befund - Ängste
export interface Aengste {
  artenVonAngsten: string[];
  symptomeKompensation: string[];
}

// Psychischer Befund - Zwänge
export interface Zwaenge {
  zwange: string[];
}

// Psychischer Befund - Stimmung und Affekt
export interface StimmungUndAffekt {
  stimmung: string[];
  affekt: string[];
}

// Psychischer Befund - Antrieb, Interesse und Freudeempfinden
export interface AntriebInteresseFreude {
  antrieb: string[];
}

// Psychischer Befund - Psychomotorik
export interface Psychomotorik {
  psychomotorik: string[];
}

// Psychischer Befund - Suizidalität
export interface Suizidalitaet {
  gradDerSuizidalitat: string[];
  paktAbspracheFahigkeit: string[];
  abklarungVonSuizidalitat: string[];
}

// Psychischer Befund - Krankheitseinstellung
export interface Krankheitseinstellung {
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

// Kapitel 2: Testdiagnostik - Selected test with metadata
export interface SelectedTestVerfahren {
  abbreviation: string; // Test abbreviation (e.g., "BDI-II")
  name: string; // Full test name
  durchfuehrungsdatum: string | null; // Date of test (DD.MM.YYYY format)
  score: number | null; // Numeric score
  notizen: string | null; // Additional notes
}

// Kapitel 2: Testdiagnostik data structure
export interface TestdiagnostikData {
  selectedTests: SelectedTestVerfahren[];
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
  symptomatikKontext: SymptomatikKontext;
  verhaltensauffaelligkeiten: Verhaltensauffaelligkeiten;
  erscheinungsbild: Erscheinungsbild;
  kontaktverhalten: Kontaktverhalten;
  sprache: Sprache;
  bewusstsein: Bewusstsein;
  orientierung: Orientierung;
  mnestik: Mnestik;
  konzentrationUndAuffassung: KonzentrationUndAuffassung;
  formalesDenken: FormalesDenken;
  wahrnehmung: Wahrnehmung;
  inhaltlichesDenken: InhaltlichesDenken;
  ichStoerungen: IchStoerungen;
  aengste: Aengste;
  zwaenge: Zwaenge;
  stimmungUndAffekt: StimmungUndAffekt;
  antriebInteresseFreude: AntriebInteresseFreude;
  psychomotorik: Psychomotorik;
  suizidalitaet: Suizidalitaet;
  krankheitseinstellung: Krankheitseinstellung;
  testdiagnostik: TestdiagnostikData;
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
  currentStep: number; // 1-8
  completedSteps: Set<number>; // Steps that have been completed
  viewMode: ViewMode; // 'wizard' or 'form'
  visitedSteps: Set<number>; // Steps that have been visited (for validation)
  step3CurrentSubStep: number; // Current substep in step 3 (1-5)
  step4CurrentSubStep: number; // Current substep in step 4 (1-5)
  step5CurrentSubStep: number; // Current substep in step 5 (1-5)
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

  // Testdiagnostik operations
  | { type: 'ADD_TEST_VERFAHREN'; abbreviation: string; name: string }
  | { type: 'REMOVE_TEST_VERFAHREN'; index: number }
  | { type: 'UPDATE_TEST_VERFAHREN'; index: number; field: keyof SelectedTestVerfahren; value: string | number | null }

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
  | { type: 'SET_STEP3_SUBSTEP'; substep: number }
  | { type: 'SET_STEP4_SUBSTEP'; substep: number }
  | { type: 'SET_STEP5_SUBSTEP'; substep: number }

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
      somatovegetativeSymptome: {},
      verhalten: {},
      dissoziativeSymptome: {},
      panikstoerung: {},
      agoraphobie: {
        paniksymptomatik: {},
        bereiche: {},
        bereicheAndere: '',
        fluchtmoeglichkeiten: {},
        fluchtmoeglichkeitenAndere: '',
      },
      sozialePhobie: {},
      spezifischePhobien: {},
      generalisierteAngst: {},
      andereSymptome: '',
    },
    zwangssymptomatik: {
      zwangsgedanken: {},
      zwangshandlungen: {},
      zwangsbezogeneKognitionen: {},
      andereSymptome: '',
    },
    verhaltensauffaelligkeiten: {
      exzesse: {},
      defizite: {},
      andereExzesse: '',
      andereDefizite: '',
    },
    symptomatikKontext: {
      beginnUndDauer: '',
      verlauf: '',
      ausloeser: '',
    },
    erscheinungsbild: {},
    kontaktverhalten: {
      ersterEindruck: [],
      kontaktverhalten: [],
    },
    sprache: {
      sprache: [],
    },
    bewusstsein: {
      quantitativesBewusstsein: [],
      qualitativesBewusstsein: [],
    },
    orientierung: {
      orientierung: [],
    },
    mnestik: {
      mnestik: [],
    },
    konzentrationUndAuffassung: {
      konzentration: [],
    },
    formalesDenken: {
      denkstruktur: [],
      denkgeschwindigkeit: [],
    },
    wahrnehmung: {
      halluzinationen: [],
    },
    inhaltlichesDenken: {
      inhaltlichesDenken: [],
    },
    ichStoerungen: {
      keineIchStorungen: [],
      psychotischeIchStorungen: [],
      nichtPsychotischeIchStorungen: [],
    },
    aengste: {
      artenVonAngsten: [],
      symptomeKompensation: [],
    },
    zwaenge: {
      zwange: [],
    },
    stimmungUndAffekt: {
      stimmung: [],
      affekt: [],
    },
    antriebInteresseFreude: {
      antrieb: [],
    },
    psychomotorik: {
      psychomotorik: [],
    },
    suizidalitaet: {
      gradDerSuizidalitat: [],
      paktAbspracheFahigkeit: [],
      abklarungVonSuizidalitat: [],
    },
    krankheitseinstellung: {
      krankheitseinsicht: [],
      behandlungsbereitschaft: [],
    },
    testdiagnostik: {
      selectedTests: [],
    },
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
    dauerVerlaufAusloeser: false,
    verhaltensauffaelligkeiten: false,
    kapitel5: false,
    kapitel6: false,
  },
  wizardState: {
    currentStep: 1,
    completedSteps: new Set<number>(),
    viewMode: 'wizard',
    visitedSteps: new Set<number>([1]), // Start with step 1 visited
    step3CurrentSubStep: 1,
    step4CurrentSubStep: 1,
    step5CurrentSubStep: 1,
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
  verhaltensauffaelligkeiten: Verhaltensauffaelligkeiten;
  erscheinungsbild: Erscheinungsbild;
  kontaktverhalten: Kontaktverhalten;
  sprache: Sprache;
  bewusstsein: Bewusstsein;
  orientierung: Orientierung;
  mnestik: Mnestik;
  konzentrationUndAuffassung: KonzentrationUndAuffassung;
  formalesDenken: FormalesDenken;
  wahrnehmung: Wahrnehmung;
  inhaltlichesDenken: InhaltlichesDenken;
  ichStoerungen: IchStoerungen;
  aengste: Aengste;
  zwaenge: Zwaenge;
  stimmungUndAffekt: StimmungUndAffekt;
  antriebInteresseFreude: AntriebInteresseFreude;
  psychomotorik: Psychomotorik;
  suizidalitaet: Suizidalitaet;
  krankheitseinstellung: Krankheitseinstellung;
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
