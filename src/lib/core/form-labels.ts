import * as FormTypes from './form-types';

/**
 * Form field labels for text generation and UI display.
 * Uses `satisfies` for type-safe enum-to-label mappings.
 */

// --- Option Labels (enum values) ---

/** Geschlecht enum labels */
export const GESCHLECHT_LABELS = {
  [FormTypes.Geschlecht.M]: 'männlich',
  [FormTypes.Geschlecht.W]: 'weiblich',
  [FormTypes.Geschlecht.D]: 'divers'
} as const satisfies Record<FormTypes.Geschlecht, string>;

export const SCHULABSCHLUSS_LABELS = {
  [FormTypes.Schulabschluss.Hauptschule]: 'Hauptschulabschluss',
  [FormTypes.Schulabschluss.MittlereReife]: 'Mittlere Reife',
  [FormTypes.Schulabschluss.Abitur]: 'Abitur',
  [FormTypes.Schulabschluss.KeinAbschluss]: 'Kein Schulabschluss'
} as const satisfies Record<FormTypes.Schulabschluss, string>;

/** AusbildungStatus labels (shared by Berufsausbildung, Studium, Promotion) */
export const AUSBILDUNG_STATUS_LABELS = {
  [FormTypes.AusbildungStatus.Laufend]: 'Laufend',
  [FormTypes.AusbildungStatus.Abgeschlossen]: 'Abgeschlossen',
  [FormTypes.AusbildungStatus.Abgebrochen]: 'Abgebrochen'
} as const satisfies Record<FormTypes.AusbildungStatus, string>;


/** StudiumStatus labels */
export const STUDIUM_STATUS_LABELS = {
  [FormTypes.StudiumStatus.Laufend]: 'Laufend',
  [FormTypes.StudiumStatus.Abgeschlossen]: 'Abgeschlossen',
  [FormTypes.StudiumStatus.Abgebrochen]: 'Abgebrochen'
} as const satisfies Record<FormTypes.StudiumStatus, string>;

/** Studium field labels */
export const STUDIUM_FIELD_LABELS = {
  fach: 'Studienfach',
  status: 'Status'
} as const satisfies Record<keyof NonNullable<FormTypes.Studium>, string>;

/** PromotionStatus labels */
export const PROMOTION_STATUS_LABELS = {
  [FormTypes.PromotionStatus.Laufend]: 'Laufend',
  [FormTypes.PromotionStatus.Abgeschlossen]: 'Abgeschlossen',
  [FormTypes.PromotionStatus.Abgebrochen]: 'Abgebrochen'
} as const satisfies Record<FormTypes.PromotionStatus, string>;

/** Promotion field labels */
export const PROMOTION_FIELD_LABELS = {
  fach: 'Promotionsfach',
  status: 'Status'
} as const satisfies Record<keyof NonNullable<FormTypes.Promotion>, string>;

/** Bildungsweg field labels */
export const BILDUNGSWEG_FIELD_LABELS = {
  schulabschluss: 'Höchster Schulabschluss',
  berufsausbildung: 'Berufsausbildung',
  studium: 'Studium',
  promotion: 'Promotion'
} as const satisfies Record<keyof FormTypes.Bildungsweg, string>;

/** Anstellungsart labels */
export const ANSTELLUNGSART_LABELS = {
  [FormTypes.Anstellungsart.Vollzeit]: 'Vollzeit',
  [FormTypes.Anstellungsart.Teilzeit]: 'Teilzeit',
  [FormTypes.Anstellungsart.MiniJob]: 'Mini-Job'
} as const satisfies Record<FormTypes.Anstellungsart, string>;

export const FAMILIENSTAND_LABELS = {
  [FormTypes.Familienstand.Ledig]: 'Ledig',
  [FormTypes.Familienstand.Partnerschaft]: 'In fester Partnerschaft',
  [FormTypes.Familienstand.Verheiratet]: 'Verheiratet',
  [FormTypes.Familienstand.Geschieden]: 'Geschieden',
  [FormTypes.Familienstand.Getrennt]: 'Getrennt',
  [FormTypes.Familienstand.Verwitwet]: 'Verwitwet'
} as const satisfies Record<FormTypes.Familienstand, string>;

export const FINANZIELLE_SITUATION_LABELS = {
  [FormTypes.FinanzielleSituation.Angespannt]: 'Angespannt',
  [FormTypes.FinanzielleSituation.Ausreichend]: 'Ausreichend',
  [FormTypes.FinanzielleSituation.Stabil]: 'Stabil'
} as const satisfies Record<FormTypes.FinanzielleSituation, string>;

/** KrankschreibungDurch labels */
export const KRANKSCHREIBUNG_DURCH_LABELS = {
  [FormTypes.KrankschreibungDurch.Hausarzt]: 'Hausarzt/Hausärztin',
  [FormTypes.KrankschreibungDurch.Psychiater]: 'Psychiater/in',
  [FormTypes.KrankschreibungDurch.Andere]: 'Andere'
} as const satisfies Record<FormTypes.KrankschreibungDurch, string>;

/**
 * @deprecated Use WOHNSITUATION_UI_LABELS instead.
 * Kept for backward compatibility during migration.
 */
export const WOHNSITUATION_LABELS = {
  [FormTypes.Wohnsituation.Allein]: 'Allein',
  [FormTypes.Wohnsituation.Partner]: 'Mit Partner/in',
  [FormTypes.Wohnsituation.Eltern]: 'Bei Eltern',
  [FormTypes.Wohnsituation.Kinder]: 'Mit Kindern',
  [FormTypes.Wohnsituation.WG]: 'In WG'
} as const satisfies Record<FormTypes.Wohnsituation, string>;

/** Wohnsituation UI labels (checkboxes) */
export const WOHNSITUATION_UI_LABELS = {
  lebtAllein: 'Alleine',
  mitPartner: 'Mit Partner/in',
  mitKindern: 'Mit Kind/ern',
  beiEltern: 'Bei Eltern',
  inWG: 'In WG'
} as const;

/** Wohnsituation text generation labels */
export const WOHNSITUATION_TEXT_LABELS = {
  lebtAllein: 'allein',
  mitPartner: 'Partner*in',
  mitKindern: 'Kindern',
  beiEltern: 'bei den Eltern',
  inWG: 'in einer Wohngemeinschaft'
} as const;

/** BerufStatus field labels */
export const BERUF_STATUS_FIELD_LABELS = {
  beschaeftigung: 'Aktuell beschäftigt',
  arbeitslosigkeit: 'Arbeitslosigkeit',
  rente: 'Rente'
} as const satisfies Record<keyof FormTypes.BerufStatus, string>;

/** Beschaeftigung field labels */
export const BESCHAEFTIGUNG_FIELD_LABELS = {
  berufsbezeichnung: 'Berufsbezeichnung',
  anstellungsart: 'Anstellungsart'
} as const satisfies Record<keyof NonNullable<FormTypes.Beschaeftigung>, string>;

/** Arbeitslosigkeit field labels */
export const ARBEITSLOSIGKEIT_FIELD_LABELS = {
  arbeitslos: 'Arbeitslos',
  dauer: 'Dauer'
} as const;

/** Rente field labels */
export const RENTE_FIELD_LABELS = {
  berentet: 'Berentet',
  dauer: 'Dauer'
} as const;

/** Dauer field labels */
export const DAUER_FIELD_LABELS = {
  jahre: 'Jahre',
  monate: 'Monate',
  wochen: 'Wochen',
  tage: 'Tage'
} as const satisfies Record<keyof FormTypes.Dauer, string>;

/** KindDetails field labels */
export const KIND_DETAILS_FIELD_LABELS = {
  alter: 'Alter',
  geschlecht: 'Geschlecht'
} as const satisfies Record<keyof FormTypes.KindDetails, string>;

/** Kinder UI labels */
export const KINDER_UI_LABELS = {
  sectionHeading: 'Alter und Geschlecht der Kinder',
  selectPlaceholder: 'Anzahl auswählen',
  childPrefix: 'Kind',
  getChildLabel: (index: number) => `Kind ${index + 1}`,
  alterPlaceholder: 'Alter',
  keineKinder: 'Keine Kinder',
} as const;

/** @deprecated Use KIND_DETAILS_FIELD_LABELS instead */
export const CHILD_DATA_FIELD_LABELS = KIND_DETAILS_FIELD_LABELS;

/** Compact Geschlecht labels for children (m/w/d) */
export const CHILD_GESCHLECHT_COMPACT_LABELS = {
  [FormTypes.Geschlecht.M]: 'm',
  [FormTypes.Geschlecht.W]: 'w',
  [FormTypes.Geschlecht.D]: 'd'
} as const satisfies Record<FormTypes.Geschlecht, string>;

// --- Field Labels (form headings) ---
export const FIELD_LABELS = {
  geschlecht: 'Geschlecht',
  alter: 'Alter',
  patientenchiffre: 'Patientenchiffre',
  datumBerichterstellung: 'Datum der Berichterstellung',
  bildungsweg: 'Bildungsweg',
  beruf: 'Beruflicher Status',
  familienstand: 'Familienstand',
  kinder: 'Kinder',
  wohnsituation: 'Wohnsituation',
  finanzielleSituation: 'Finanzielle Situation',
  krankschreibung: 'Aktuell krankgeschrieben',
} as const satisfies Partial<Record<keyof FormTypes.Form, string>>;

// --- Manische Symptomatik ---

/** ManischeStimmungSymptom labels */
export const MANISCHE_STIMMUNG_SYMPTOM_LABELS = {
  [FormTypes.ManischeStimmungSymptom.AffektiveLabilitat]: 'Affektive Labilität',
  [FormTypes.ManischeStimmungSymptom.DysphorischGereizteStimmung]: 'Dysphorisch-gereizte Stimmung',
  [FormTypes.ManischeStimmungSymptom.EuphorischeStimmung]: 'Euphorische Stimmung',
  [FormTypes.ManischeStimmungSymptom.GehobeneStimmung]: 'Gehobene Stimmung',
  [FormTypes.ManischeStimmungSymptom.SorgloseHeiterkeit]: 'Sorglose Heiterkeit',
  [FormTypes.ManischeStimmungSymptom.UbermassigOptimistischeStimmung]: 'Übermäßig optimistische Stimmung',
  [FormTypes.ManischeStimmungSymptom.UbersteigerteWohlbefinden]: 'Übersteigertes Gefühl von Wohlbefinden',
  [FormTypes.ManischeStimmungSymptom.UbertriebenerOptimismus]: 'Übertriebener Optimismus'
} as const satisfies Record<FormTypes.ManischeStimmungSymptom, string>;

/** ManischeAntriebSymptom labels */
export const MANISCHE_ANTRIEB_SYMPTOM_LABELS = {
  [FormTypes.ManischeAntriebSymptom.GesteigerterAntrieb]: 'Gesteigerter Antrieb',
  [FormTypes.ManischeAntriebSymptom.GesteigertesEnergieniveau]: 'Gesteigertes Energieniveau',
  [FormTypes.ManischeAntriebSymptom.Hyperaktivitat]: 'Hyperaktivität',
  [FormTypes.ManischeAntriebSymptom.PsychomotorischeUnruhe]: 'Psychomotorische Unruhe',
  [FormTypes.ManischeAntriebSymptom.Ruhelosigkeit]: 'Ruhelosigkeit'
} as const satisfies Record<FormTypes.ManischeAntriebSymptom, string>;

/** ManischeSpracheKognitionSymptom labels */
export const MANISCHE_SPRACHE_KOGNITION_SYMPTOM_LABELS = {
  [FormTypes.ManischeSpracheKognitionSymptom.Gedankendraengen]: 'Gedankendrängen',
  [FormTypes.ManischeSpracheKognitionSymptom.Gedankenrasen]: 'Gedankenrasen',
  [FormTypes.ManischeSpracheKognitionSymptom.GeschaerftesOderUngewoehnlichKreativesDenken]: 'Geschärftes oder ungewöhnlich kreatives Denken',
  [FormTypes.ManischeSpracheKognitionSymptom.GesteigerterRededrang]: 'Gesteigerter Rededrang',
  [FormTypes.ManischeSpracheKognitionSymptom.HaeufigeThemenwechsel]: 'Häufige Themenwechsel',
  [FormTypes.ManischeSpracheKognitionSymptom.HoheAblenkbarkeit]: 'Hohe Ablenkbarkeit',
  [FormTypes.ManischeSpracheKognitionSymptom.Ideenflucht]: 'Ideenflucht',
  [FormTypes.ManischeSpracheKognitionSymptom.Konzentrationsstoerungen]: 'Konzentrationsstörungen',
  [FormTypes.ManischeSpracheKognitionSymptom.Logorrhoe]: 'Logorrhö',
  [FormTypes.ManischeSpracheKognitionSymptom.SprunghafteGedanken]: 'Sprunghafte Gedanken'
} as const satisfies Record<FormTypes.ManischeSpracheKognitionSymptom, string>;

/** ManischeVegetativSymptom labels */
export const MANISCHE_VEGETATIV_SYMPTOM_LABELS = {
  [FormTypes.ManischeVegetativSymptom.GesteigerterAppetit]: 'Gesteigerter Appetit',
  [FormTypes.ManischeVegetativSymptom.GesteigertLibido]: 'Gesteigerte Libido',
  [FormTypes.ManischeVegetativSymptom.VermindertesSchlafbeduerfnis]: 'Vermindertes Schlafbedürfnis'
} as const satisfies Record<FormTypes.ManischeVegetativSymptom, string>;

/** ManischeSelbsterlebenSymptom labels */
export const MANISCHE_SELBSTERLEBEN_SYMPTOM_LABELS = {
  [FormTypes.ManischeSelbsterlebenSymptom.GesteigertesSelbstwertgefuehl]: 'Gesteigertes Selbstwertgefühl',
  [FormTypes.ManischeSelbsterlebenSymptom.Groessenideen]: 'Größenideen',
  [FormTypes.ManischeSelbsterlebenSymptom.Selbstueberschaetzung]: 'Selbstüberschätzung',
  [FormTypes.ManischeSelbsterlebenSymptom.UeberoptimismusOderUebertreibungFruehererErfolge]: 'Überoptimismus oder Übertreibung früherer Erfolge'
} as const satisfies Record<FormTypes.ManischeSelbsterlebenSymptom, string>;

/** ManischesVerhaltenSymptom labels */
export const MANISCHES_VERHALTEN_SYMPTOM_LABELS = {
  [FormTypes.ManischesVerhaltenSymptom.AndauerndeWechselVonAktivitaetenOderPlaenen]: 'Andauernde Wechsel von Aktivitäten oder Plänen',
  [FormTypes.ManischesVerhaltenSymptom.Distanzlosigkeit]: 'Distanzlosigkeit',
  [FormTypes.ManischesVerhaltenSymptom.GesteigerteGeselligkeit]: 'Gesteigerte Geselligkeit',
  [FormTypes.ManischesVerhaltenSymptom.GesteigertesInteresseAnSexuellenUndAnderenAngenehmeTaetigkeiten]: 'Gesteigertes Interesse und Sicheinlassen in sexuelle und andere angenehme Tätigkeiten',
  [FormTypes.ManischesVerhaltenSymptom.Kritiklosigkeit]: 'Kritiklosigkeit',
  [FormTypes.ManischesVerhaltenSymptom.LeichtsinnigRuecksichtlosesVerhalten]: 'Leichtsinniges, rücksichtsloses Verhalten',
  [FormTypes.ManischesVerhaltenSymptom.VerlustSozialerHemmungen]: 'Verlust sozialer Hemmungen'
} as const satisfies Record<FormTypes.ManischesVerhaltenSymptom, string>;

/** ImpulsivesVerhaltenDetail labels */
export const IMPULSIVES_VERHALTEN_DETAIL_LABELS = {
  [FormTypes.ImpulsivesVerhaltenDetail.ErhohteRisikobereitschaft]: 'Erhöhte Risikobereitschaft',
  [FormTypes.ImpulsivesVerhaltenDetail.Kaufsucht]: 'Kaufsucht / übertriebene Geldausgaben',
  [FormTypes.ImpulsivesVerhaltenDetail.RiskantesFahrverhalten]: 'Riskantes Fahrverhalten',
  [FormTypes.ImpulsivesVerhaltenDetail.RiskantesSexualverhalten]: 'Riskantes Sexualverhalten',
  [FormTypes.ImpulsivesVerhaltenDetail.Substanzmissbrauch]: 'Substanzmissbrauch'
} as const satisfies Record<FormTypes.ImpulsivesVerhaltenDetail, string>;

/** ManischePsychotischSymptom labels */
export const MANISCHE_PSYCHOTISCH_SYMPTOM_LABELS = {
  [FormTypes.ManischePsychotischSymptom.Halluzinationen]: 'Halluzinationen',
  [FormTypes.ManischePsychotischSymptom.Wahn]: 'Wahn'
} as const satisfies Record<FormTypes.ManischePsychotischSymptom, string>;

/** ManischeDissociativSymptom labels */
export const MANISCHE_DISSOCIATIV_SYMPTOM_LABELS = {
  [FormTypes.ManischeDissociativSymptom.Depersonalisation]: 'Depersonalisation',
  [FormTypes.ManischeDissociativSymptom.Derealisation]: 'Derealisation'
} as const satisfies Record<FormTypes.ManischeDissociativSymptom, string>;

/** ManischeSymptomatik section labels */
export const MANISCHE_SYMPTOMATIK_SECTION_LABELS = {
  stimmungEmotionalesErleben: 'Stimmung und emotionales Erleben',
  antriebEnergiePsychomotorik: 'Antrieb, Energie und Psychomotorik',
  spracheKognition: 'Sprache und Kognition',
  vegetativeSymptome: 'Vegetative Symptome',
  selbsterleben: 'Selbsterleben',
  verhalten: 'Verhalten',
  psychotischeSymptome: 'Psychotische Symptome',
  dissoziativeSymptome: 'Dissoziative Symptome',
  andereSymptome: 'Andere Symptome'
} as const satisfies Record<keyof FormTypes.ManischeSymptomatik, string>;

/** "Impulsives Verhalten" parent label */
export const IMPULSIVES_VERHALTEN_LABEL = 'Impulsives Verhalten und selbstschädigendes Verhalten';

// --- Depressive Symptomatik ---

/** DepressiveStimmungSymptom labels */
export const DEPRESSIVE_STIMMUNG_SYMPTOM_LABELS = {
  [FormTypes.DepressiveStimmungSymptom.GedrueckteStimmung]: 'Gedrückte Stimmung',
  [FormTypes.DepressiveStimmungSymptom.Traurigkeit]: 'Traurigkeit',
  [FormTypes.DepressiveStimmungSymptom.Niedergeschlagenheit]: 'Niedergeschlagenheit',
  [FormTypes.DepressiveStimmungSymptom.Interesselosigkeit]: 'Interesselosigkeit',
  [FormTypes.DepressiveStimmungSymptom.Anhedonie]: 'Anhedonie',
  [FormTypes.DepressiveStimmungSymptom.MorgentiefDerStimmung]: 'Morgentief der Stimmung',
  [FormTypes.DepressiveStimmungSymptom.Hoffnungslosigkeit]: 'Hoffnungslosigkeit',
  [FormTypes.DepressiveStimmungSymptom.Perspektivelosigkeit]: 'Perspektivelosigkeit',
  [FormTypes.DepressiveStimmungSymptom.Pessimismus]: 'Pessimismus',
  [FormTypes.DepressiveStimmungSymptom.Verzweiflung]: 'Verzweiflung',
  [FormTypes.DepressiveStimmungSymptom.GefuehlVonInnererLeere]: 'Gefühl von innerer Leere',
  [FormTypes.DepressiveStimmungSymptom.GefuehlDerGefuehllosigkeit]: 'Gefühl der Gefühllosigkeit',
  [FormTypes.DepressiveStimmungSymptom.EmotionaleTaubheit]: 'Emotionale Taubheit',
  [FormTypes.DepressiveStimmungSymptom.Insuffizienzgefuehle]: 'Insuffizienzgefühle',
  [FormTypes.DepressiveStimmungSymptom.Versagensaengste]: 'Versagensängste',
  [FormTypes.DepressiveStimmungSymptom.Zukunftsaengste]: 'Zukunftsängste',
  [FormTypes.DepressiveStimmungSymptom.Ueberforderungsgefuehle]: 'Überforderungsgefühle',
  [FormTypes.DepressiveStimmungSymptom.Einsamkeitsgefuehle]: 'Einsamkeitsgefühle'
} as const satisfies Record<FormTypes.DepressiveStimmungSymptom, string>;

/** DepressiveAntriebSymptom labels */
export const DEPRESSIVE_ANTRIEB_SYMPTOM_LABELS = {
  [FormTypes.DepressiveAntriebSymptom.ReduzierterAntrieb]: 'Reduzierter Antrieb',
  [FormTypes.DepressiveAntriebSymptom.Antriebslosigkeit]: 'Antriebslosigkeit',
  [FormTypes.DepressiveAntriebSymptom.Energielosigkeit]: 'Energielosigkeit',
  [FormTypes.DepressiveAntriebSymptom.ErhoehtErmuedbarkeit]: 'Erhöhte Ermüdbarkeit',
  [FormTypes.DepressiveAntriebSymptom.KoerperlicheErschoepfung]: 'Körperliche Erschöpfung',
  [FormTypes.DepressiveAntriebSymptom.PsychomotorischeHemmung]: 'Psychomotorische Hemmung',
  [FormTypes.DepressiveAntriebSymptom.PsychomotorischeVerlangsamung]: 'Psychomotorische Verlangsamung',
  [FormTypes.DepressiveAntriebSymptom.Agitiertheit]: 'Agitiertheit',
  [FormTypes.DepressiveAntriebSymptom.Reizbarkeit]: 'Reizbarkeit'
} as const satisfies Record<FormTypes.DepressiveAntriebSymptom, string>;

/** DepressiveSelbsterlebenSymptom labels */
export const DEPRESSIVE_SELBSTERLEBEN_SYMPTOM_LABELS = {
  [FormTypes.DepressiveSelbsterlebenSymptom.NegativesSelbstbild]: 'Negatives Selbstbild',
  [FormTypes.DepressiveSelbsterlebenSymptom.ReduzierteSelbstwertgefuehl]: 'Reduziertes Selbstwertgefühl',
  [FormTypes.DepressiveSelbsterlebenSymptom.Minderwertigkeitsgefuehle]: 'Minderwertigkeitsgefühle',
  [FormTypes.DepressiveSelbsterlebenSymptom.Schuldgefuehle]: 'Schuldgefühle',
  [FormTypes.DepressiveSelbsterlebenSymptom.Selbstvorwuerfe]: 'Selbstvorwürfe',
  [FormTypes.DepressiveSelbsterlebenSymptom.VerlustDesSelbstvertrauens]: 'Verlust des Selbstvertrauens'
} as const satisfies Record<FormTypes.DepressiveSelbsterlebenSymptom, string>;

/** DepressiveVegetativSymptom labels */
export const DEPRESSIVE_VEGETATIV_SYMPTOM_LABELS = {
  [FormTypes.DepressiveVegetativSymptom.Einschlafstoerungen]: 'Einschlafstörungen',
  [FormTypes.DepressiveVegetativSymptom.Durchschlafstoerungen]: 'Durchschlafstörungen',
  [FormTypes.DepressiveVegetativSymptom.FruehmorgenlichesErwachen]: 'Frühmorgendliches Erwachen',
  [FormTypes.DepressiveVegetativSymptom.Hypersomnie]: 'Hypersomnie',
  [FormTypes.DepressiveVegetativSymptom.Muedigkeit]: 'Müdigkeit',
  [FormTypes.DepressiveVegetativSymptom.KoerperlicheErschoepfungVegetativ]: 'Körperliche Erschöpfung',
  [FormTypes.DepressiveVegetativSymptom.AppetitminderungAppetitlosigkeit]: 'Appetitminderung / Appetitlosigkeit',
  [FormTypes.DepressiveVegetativSymptom.GesteigerterAppetit]: 'Gesteigerter Appetit',
  [FormTypes.DepressiveVegetativSymptom.Gewichtsverlust]: 'Gewichtsverlust',
  [FormTypes.DepressiveVegetativSymptom.Gewichtszunahme]: 'Gewichtszunahme',
  [FormTypes.DepressiveVegetativSymptom.Libidoverlust]: 'Libidoverlust',
  [FormTypes.DepressiveVegetativSymptom.SexuelleFunktionsstoerungen]: 'Sexuelle Funktionsstörungen'
} as const satisfies Record<FormTypes.DepressiveVegetativSymptom, string>;

/** DepressivePsychomotorikSymptom labels */
export const DEPRESSIVE_PSYCHOMOTORIK_SYMPTOM_LABELS = {
  [FormTypes.DepressivePsychomotorikSymptom.PsychomotorischeAgitiertheit]: 'Psychomotorische Agitiertheit',
  [FormTypes.DepressivePsychomotorikSymptom.PsychomotorischeHemmungPsychomotorik]: 'Psychomotorische Hemmung'
} as const satisfies Record<FormTypes.DepressivePsychomotorikSymptom, string>;

/** DepressiveKognitionSymptom labels */
export const DEPRESSIVE_KOGNITION_SYMPTOM_LABELS = {
  [FormTypes.DepressiveKognitionSymptom.DepressiveKognitiveVerzerrungen]: 'Depressive kognitive Verzerrungen',
  [FormTypes.DepressiveKognitionSymptom.KonzentrationsUndAufmerksamkeitsstoerungen]: 'Konzentrations- und Aufmerksamkeitsstörungen',
  [FormTypes.DepressiveKognitionSymptom.Gedaechtnisstoerungen]: 'Gedächtnisstörungen',
  [FormTypes.DepressiveKognitionSymptom.Gruebeln]: 'Grübeln',
  [FormTypes.DepressiveKognitionSymptom.Gedankenkreisen]: 'Gedankenkreisen',
  [FormTypes.DepressiveKognitionSymptom.VerlangsamtesDenken]: 'Verlangsamtes Denken',
  [FormTypes.DepressiveKognitionSymptom.Entscheidungsschwierigkeiten]: 'Entscheidungsschwierigkeiten'
} as const satisfies Record<FormTypes.DepressiveKognitionSymptom, string>;

/** DepressivesVerhaltenSymptom labels */
export const DEPRESSIVES_VERHALTEN_SYMPTOM_LABELS = {
  [FormTypes.DepressivesVerhaltenSymptom.SozialerRueckzug]: 'Sozialer Rückzug',
  [FormTypes.DepressivesVerhaltenSymptom.IsolationUndRueckzugstendenz]: 'Isolation und Rückzugstendenz',
  [FormTypes.DepressivesVerhaltenSymptom.Prokrastinationsverhalten]: 'Prokrastinationsverhalten',
  [FormTypes.DepressivesVerhaltenSymptom.VernachlaessigungVonPflichten]: 'Vernachlässigung von Pflichten',
  [FormTypes.DepressivesVerhaltenSymptom.VernachlaessigungVonSelbstfuersorge]: 'Vernachlässigung von Selbstfürsorge'
} as const satisfies Record<FormTypes.DepressivesVerhaltenSymptom, string>;

/** DepressivePsychotischSymptom labels */
export const DEPRESSIVE_PSYCHOTISCH_SYMPTOM_LABELS = {
  [FormTypes.DepressivePsychotischSymptom.Verarmungswahn]: 'Verarmungswahn',
  [FormTypes.DepressivePsychotischSymptom.Versuendigungswahn]: 'Versündigungswahn',
  [FormTypes.DepressivePsychotischSymptom.Schuldwahn]: 'Schuldwahn',
  [FormTypes.DepressivePsychotischSymptom.HypochondrischerWahn]: 'Hypochondrischer Wahn',
  [FormTypes.DepressivePsychotischSymptom.NihilistischerWahn]: 'Nihilistischer Wahn',
  [FormTypes.DepressivePsychotischSymptom.Halluzinationen]: 'Halluzinationen'
} as const satisfies Record<FormTypes.DepressivePsychotischSymptom, string>;

/** DepressiveDissociativSymptom labels */
export const DEPRESSIVE_DISSOCIATIV_SYMPTOM_LABELS = {
  [FormTypes.DepressiveDissociativSymptom.Derealisation]: 'Derealisation',
  [FormTypes.DepressiveDissociativSymptom.Depersonalisation]: 'Depersonalisation'
} as const satisfies Record<FormTypes.DepressiveDissociativSymptom, string>;

/** DepressiveSymptomatik section labels */
export const DEPRESSIVE_SYMPTOMATIK_SECTION_LABELS = {
  stimmungEmotionalesErleben: 'Stimmung und emotionales Erleben',
  antriebEnergiePsychomotorik: 'Antrieb, Energie und Psychomotorik',
  selbsterleben: 'Selbsterleben',
  vegetativeSomatischeSymptome: 'Somatovegetative Symptome',
  psychomotorischeSymptome: 'Psychomotorik',
  kognition: 'Kognition',
  verhalten: 'Verhalten',
  psychotischeSymptome: 'Psychotische Symptome',
  dissoziativeSymptome: 'Dissoziative Symptome',
  andereSymptome: 'Andere'
} as const satisfies Record<keyof FormTypes.DepressiveSymptomatik, string>;

// --- Angstsymptomatik ---

/** AngstEmotionalesErlebenSymptom labels */
export const ANGST_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS = {
  [FormTypes.AngstEmotionalesErlebenSymptom.SituationsinadaequateAngst]: 'Situationsinadäquate und ausgeprägte Angst',
  [FormTypes.AngstEmotionalesErlebenSymptom.Todesangst]: 'Todesangst',
  [FormTypes.AngstEmotionalesErlebenSymptom.AngstVorKontrollverlust]: 'Angst vor Kontrollverlust',
  [FormTypes.AngstEmotionalesErlebenSymptom.AngstVerruecktZuWerden]: 'Angst "verrückt zu werden"',
  [FormTypes.AngstEmotionalesErlebenSymptom.GefuehlVonUnkontrollierbarkeit]: 'Gefühl von Unkontrollierbarkeit',
  [FormTypes.AngstEmotionalesErlebenSymptom.Ohnmachtsgefuehl]: 'Ohnmachtsgefühl',
  [FormTypes.AngstEmotionalesErlebenSymptom.Zukunftsaengste]: 'Zukunftsängste',
  [FormTypes.AngstEmotionalesErlebenSymptom.Erwartungsangst]: 'Erwartungsangst',
  [FormTypes.AngstEmotionalesErlebenSymptom.AngstVorDerAngst]: 'Angst vor der Angst',
  [FormTypes.AngstEmotionalesErlebenSymptom.ErhoehtSchreckhaftigkeit]: 'Erhöhte Schreckhaftigkeit',
  [FormTypes.AngstEmotionalesErlebenSymptom.Reizbarkeit]: 'Reizbarkeit',
  [FormTypes.AngstEmotionalesErlebenSymptom.Schamgefuehl]: 'Schamgefühl',
  [FormTypes.AngstEmotionalesErlebenSymptom.GefuehlDerUnsicherheit]: 'Gefühl der Unsicherheit',
  [FormTypes.AngstEmotionalesErlebenSymptom.Besorgtheit]: 'Besorgtheit'
} as const satisfies Record<FormTypes.AngstEmotionalesErlebenSymptom, string>;

/** AngstKognitionSymptom labels */
export const ANGST_KOGNITION_SYMPTOM_LABELS = {
  [FormTypes.AngstKognitionSymptom.Gruebeln]: 'Grübeln',
  [FormTypes.AngstKognitionSymptom.Gedankenkreisen]: 'Gedankenkreisen',
  [FormTypes.AngstKognitionSymptom.Konzentrationsschwierigkeiten]: 'Konzentrationsschwierigkeiten',
  [FormTypes.AngstKognitionSymptom.KatastrophisierendesDenken]: 'Katastrophisierendes Denken',
  [FormTypes.AngstKognitionSymptom.FormalgedanklicheEinengung]: 'Formalgedankliche Einengung'
} as const satisfies Record<FormTypes.AngstKognitionSymptom, string>;

/** AngstSorgenTyp labels */
export const ANGST_SORGEN_TYP_LABELS = {
  [FormTypes.AngstSorgenTyp.UeberAlltag]: 'Sorgen über Alltag',
  [FormTypes.AngstSorgenTyp.UeberEigeneGesundheit]: 'Sorgen über eigene Gesundheit',
  [FormTypes.AngstSorgenTyp.UeberGesundheitVonAngehoerigen]: 'Sorgen über Gesundheit von Angehörigen',
  [FormTypes.AngstSorgenTyp.UeberZukunft]: 'Sorgen über Zukunft',
  [FormTypes.AngstSorgenTyp.UeberFinanzen]: 'Sorgen über Finanzen',
  [FormTypes.AngstSorgenTyp.UeberFamilie]: 'Sorgen über Familie'
} as const satisfies Record<FormTypes.AngstSorgenTyp, string>;

/** "Sorgen" parent label */
export const ANGST_SORGEN_LABEL = 'Sorgen';

/** AngstSomatovegetativSymptom labels */
export const ANGST_SOMATOVEGETATIV_SYMPTOM_LABELS = {
  [FormTypes.AngstSomatovegetativSymptom.Herzklopfen]: 'Herzklopfen',
  [FormTypes.AngstSomatovegetativSymptom.Herzrasen]: 'Herzrasen',
  [FormTypes.AngstSomatovegetativSymptom.Schweissausbrueche]: 'Schweißausbrüche',
  [FormTypes.AngstSomatovegetativSymptom.Schwitzen]: 'Schwitzen',
  [FormTypes.AngstSomatovegetativSymptom.Zittern]: 'Zittern',
  [FormTypes.AngstSomatovegetativSymptom.Mundtrockenheit]: 'Mundtrockenheit',
  [FormTypes.AngstSomatovegetativSymptom.Atemnot]: 'Atemnot',
  [FormTypes.AngstSomatovegetativSymptom.Dyspnoe]: 'Dyspnoe',
  [FormTypes.AngstSomatovegetativSymptom.Hyperventilation]: 'Hyperventilation',
  [FormTypes.AngstSomatovegetativSymptom.Erstickungsgefuehl]: 'Erstickungsgefühl',
  [FormTypes.AngstSomatovegetativSymptom.Beklemmungsgefuehl]: 'Beklemmungsgefühl',
  [FormTypes.AngstSomatovegetativSymptom.EngeInDerBrust]: 'Engegefühl in der Brust',
  [FormTypes.AngstSomatovegetativSymptom.Brustschmerzen]: 'Brustschmerzen',
  [FormTypes.AngstSomatovegetativSymptom.Uebelkeit]: 'Übelkeit',
  [FormTypes.AngstSomatovegetativSymptom.Magenbeschwerden]: 'Magenbeschwerden',
  [FormTypes.AngstSomatovegetativSymptom.Bauchschmerzen]: 'Bauchschmerzen',
  [FormTypes.AngstSomatovegetativSymptom.Durchfall]: 'Durchfall',
  [FormTypes.AngstSomatovegetativSymptom.Stuhldrang]: 'Stuhldrang',
  [FormTypes.AngstSomatovegetativSymptom.Miktionsdrang]: 'Miktionsdrang',
  [FormTypes.AngstSomatovegetativSymptom.Schwindel]: 'Schwindel',
  [FormTypes.AngstSomatovegetativSymptom.Benommenheit]: 'Benommenheit',
  [FormTypes.AngstSomatovegetativSymptom.Unsicherheit]: 'Unsicherheit',
  [FormTypes.AngstSomatovegetativSymptom.Schwaeche]: 'Schwäche',
  [FormTypes.AngstSomatovegetativSymptom.Erroeten]: 'Erröten',
  [FormTypes.AngstSomatovegetativSymptom.Hitzewallungen]: 'Hitzewallungen',
  [FormTypes.AngstSomatovegetativSymptom.Kaelteschauer]: 'Kälteschauer',
  [FormTypes.AngstSomatovegetativSymptom.Kribbelgefuehle]: 'Kribbelgefühle',
  [FormTypes.AngstSomatovegetativSymptom.Taubheitsgefuehle]: 'Taubheitsgefühle',
  [FormTypes.AngstSomatovegetativSymptom.InnereAnspannung]: 'Innere Anspannung',
  [FormTypes.AngstSomatovegetativSymptom.Muskelverspannung]: 'Muskelverspannung',
  [FormTypes.AngstSomatovegetativSymptom.LeereImKopf]: 'Leere im Kopf',
  [FormTypes.AngstSomatovegetativSymptom.NervositaetUndRuhelosigkeit]: 'Nervosität und Ruhelosigkeit',
  [FormTypes.AngstSomatovegetativSymptom.AnhaltendeReizbarkeit]: 'Anhaltende Reizbarkeit',
  [FormTypes.AngstSomatovegetativSymptom.UebertriebeneSchreckhaftigkeit]: 'Übertriebene Schreckhaftigkeit',
  [FormTypes.AngstSomatovegetativSymptom.Einschlafstoerungen]: 'Einschlafstörungen',
  [FormTypes.AngstSomatovegetativSymptom.Durchschlafstoerungen]: 'Durchschlafstörungen'
} as const satisfies Record<FormTypes.AngstSomatovegetativSymptom, string>;

/** AngstVerhaltenFeld labels */
export const ANGST_VERHALTEN_FELD_LABELS = {
  [FormTypes.AngstVerhaltenFeld.Vermeidungsverhalten]: 'Vermeidungsverhalten',
  [FormTypes.AngstVerhaltenFeld.Sicherheitsverhalten]: 'Sicherheitsverhalten',
  [FormTypes.AngstVerhaltenFeld.Rueckversicherungsverhalten]: 'Rückversicherungsverhalten',
  [FormTypes.AngstVerhaltenFeld.BodyChecking]: 'Body Checking'
} as const satisfies Record<FormTypes.AngstVerhaltenFeld, string>;

/** AngstDissociativSymptom labels */
export const ANGST_DISSOCIATIV_SYMPTOM_LABELS = {
  [FormTypes.AngstDissociativSymptom.Derealisation]: 'Derealisation',
  [FormTypes.AngstDissociativSymptom.Depersonalisation]: 'Depersonalisation'
} as const satisfies Record<FormTypes.AngstDissociativSymptom, string>;

/** AngstPanikstoerungSymptom labels */
export const ANGST_PANIKSTOERUNG_SYMPTOM_LABELS = {
  [FormTypes.AngstPanikstoerungSymptom.PanikattackeMitKlassischenVegetativenSymptomen]: 'Panikattacke mit klassischen vegetativen Symptomen',
  [FormTypes.AngstPanikstoerungSymptom.WiederkehrendeUnvorhersehbarePanikattacken]: 'Wiederkehrende, unvorhersehbare Panikattacken mit plötzlichem Beginn',
  [FormTypes.AngstPanikstoerungSymptom.NichtSituationsgebundenePanikattacken]: 'Nicht situationsgebundene Panikattacken',
  [FormTypes.AngstPanikstoerungSymptom.PanikattackenMitRaschemHoehepunkt]: 'Panikattacken mit raschem Höhepunkt'
} as const satisfies Record<FormTypes.AngstPanikstoerungSymptom, string>;

/** AgoraphobieBereich labels */
export const AGORAPHOBIE_BEREICH_LABELS = {
  [FormTypes.AgoraphobieBereich.AngstVorMenschenmengen]: 'Angst vor Menschenmengen',
  [FormTypes.AgoraphobieBereich.AngstVorOeffentlichenPlaetzen]: 'Angst vor öffentlichen Plätzen',
  [FormTypes.AgoraphobieBereich.AngstVorAlleinReisen]: 'Angst vor allein Reisen',
  [FormTypes.AgoraphobieBereich.AngstVorWeitenEntfernungenVonZuhause]: 'Angst vor weiten Entfernungen von Zuhause',
  [FormTypes.AgoraphobieBereich.AngstVorGeschlossenenRaeumen]: 'Angst vor geschlossenen Räumen',
  [FormTypes.AgoraphobieBereich.AngstDasHausZuVerlassen]: 'Angst, das Haus zu verlassen'
} as const satisfies Record<FormTypes.AgoraphobieBereich, string>;

/** AgoraphobieFlucht labels */
export const AGORAPHOBIE_FLUCHT_LABELS = {
  [FormTypes.AgoraphobieFlucht.FehlenEinesFluchtweges]: 'Fehlen eines Fluchtweges',
  [FormTypes.AgoraphobieFlucht.FluchtAlsPeinlichOderSchwierigBewertet]: 'Flucht als peinlich oder schwierig bewertet'
} as const satisfies Record<FormTypes.AgoraphobieFlucht, string>;

/** Agoraphobie Paniksymptomatik labels */
export const AGORAPHOBIE_PANIKSYMPTOMATIK_LABELS = {
  [FormTypes.AgoraphobiePaniksymptomatik.Mit]: 'Mit Panikattacken',
  [FormTypes.AgoraphobiePaniksymptomatik.Ohne]: 'Ohne Panikattacken'
} as const satisfies Record<FormTypes.AgoraphobiePaniksymptomatik, string>;

/** SozialePhobieHauptsymptom labels */
export const SOZIALE_PHOBIE_HAUPTSYMPTOM_LABELS = {
  [FormTypes.SozialePhobieHauptsymptom.AngstImZentrumDerAufmerksamkeit]: 'Angst im Zentrum der Aufmerksamkeit zu stehen',
  [FormTypes.SozialePhobieHauptsymptom.AngstSichPeinlichZuVerhalten]: 'Angst sich peinlich zu verhalten',
  [FormTypes.SozialePhobieHauptsymptom.VermeidungSozialerSituationen]: 'Vermeidung sozialer Situationen',
  [FormTypes.SozialePhobieHauptsymptom.VermeidungImZentrumDerAufmerksamkeit]: 'Vermeidung im Zentrum der Aufmerksamkeit zu stehen'
} as const satisfies Record<FormTypes.SozialePhobieHauptsymptom, string>;

/** SozialePhobieBereichSymptom labels */
export const SOZIALE_PHOBIE_BEREICH_LABELS = {
  [FormTypes.SozialePhobieBereichSymptom.SprechenGruppen]: 'Angst vor Sprechen in Gruppen',
  [FormTypes.SozialePhobieBereichSymptom.EssenOeffentlich]: 'Angst vor Essen in der Öffentlichkeit',
  [FormTypes.SozialePhobieBereichSymptom.SchreibenAnderen]: 'Angst vor Schreiben vor anderen',
  [FormTypes.SozialePhobieBereichSymptom.Vortraege]: 'Angst vor Vorträgen',
  [FormTypes.SozialePhobieBereichSymptom.NegativeBewertung]: 'Angst vor negativer Bewertung / Kritik',
  [FormTypes.SozialePhobieBereichSymptom.Blamage]: 'Angst vor Blamage'
} as const satisfies Record<FormTypes.SozialePhobieBereichSymptom, string>;

/** SozialePhobieVegetativSymptom labels */
export const SOZIALE_PHOBIE_VEGETATIV_LABELS = {
  [FormTypes.SozialePhobieVegetativSymptom.Erroeten]: 'Erröten',
  [FormTypes.SozialePhobieVegetativSymptom.Zittern]: 'Zittern',
  [FormTypes.SozialePhobieVegetativSymptom.AngstErbrechen]: 'Angst zu erbrechen',
  [FormTypes.SozialePhobieVegetativSymptom.MiktionsDefaekation]: 'Miktions- oder Defäkationsdrang oder Angst davor'
} as const satisfies Record<FormTypes.SozialePhobieVegetativSymptom, string>;

/** SpezifischePhobieSymptom labels */
export const SPEZIFISCHE_PHOBIE_LABELS = {
  [FormTypes.SpezifischePhobieSymptom.Arachnophobie]: 'Angst vor Spinnen (Arachnophobie)',
  [FormTypes.SpezifischePhobieSymptom.Hundephobie]: 'Angst vor Hunden (Hundephobie)',
  [FormTypes.SpezifischePhobieSymptom.Spritzenphobie]: 'Angst vor Spritzen',
  [FormTypes.SpezifischePhobieSymptom.Hoehenangst]: 'Angst vor Höhe (Höhenangst)',
  [FormTypes.SpezifischePhobieSymptom.Flugangst]: 'Angst vor Fliegen (Flugangst)',
  [FormTypes.SpezifischePhobieSymptom.Klaustrophobie]: 'Angst vor engen Räumen (Klaustrophobie)'
} as const satisfies Record<FormTypes.SpezifischePhobieSymptom, string>;

/** GeneralisierteAngstHauptsymptom labels (main symptoms) */
export const GENERALISIERTE_ANGST_HAUPTSYMPTOM_LABELS = {
  [FormTypes.GeneralisierteAngstHauptsymptom.ChronischeAengste]: 'Chronische, anhaltende und diffuse Ängste',
  [FormTypes.GeneralisierteAngstHauptsymptom.AengstlicheErwartungen]: 'Ängstliche Erwartungen',
  [FormTypes.GeneralisierteAngstHauptsymptom.VermeidungAuseinandersetzung]: 'Vermeidung von emotionaler Auseinandersetzung mit der Angst'
} as const satisfies Record<FormTypes.GeneralisierteAngstHauptsymptom, string>;

/** GeneralisierteAngstSorgenSymptom labels (worry-related symptoms) */
export const GENERALISIERTE_ANGST_SORGEN_LABELS = {
  [FormTypes.GeneralisierteAngstSorgenSymptom.UnkontrollierbareeSorgen]: 'Unkontrollierbare Sorgen',
  [FormTypes.GeneralisierteAngstSorgenSymptom.UebermaessigeSorgen]: 'Übermäßige und unbegründete Sorgen',
  [FormTypes.GeneralisierteAngstSorgenSymptom.Kontrollversuche]: 'Kontrollversuche im Umgang mit Sorgen',
  [FormTypes.GeneralisierteAngstSorgenSymptom.SichSorgenMachen]: 'Sich-Sorgen-Machen',
  [FormTypes.GeneralisierteAngstSorgenSymptom.Sorgenketten]: 'Sorgenketten',
  [FormTypes.GeneralisierteAngstSorgenSymptom.SorgenLebensbereiche]: 'Sorgen beziehen sich auf verschiedene realitätsbezogene Lebensbereiche'
} as const satisfies Record<FormTypes.GeneralisierteAngstSorgenSymptom, string>;

/** Angstsymptomatik section labels */
export const ANGSTSYMPTOMATIK_SECTION_LABELS = {
  emotionalesErleben: 'Emotionales Erleben',
  kognition: 'Kognition',
  somatovegetativeSymptome: 'Somatovegetative Symptome',
  verhalten: 'Verhalten',
  dissoziativeSymptome: 'Dissoziative Symptome',
  panikstoerung: 'Panikstörung',
  agoraphobie: 'Agoraphobie',
  sozialePhobie: 'Soziale Phobie',
  spezifischePhobien: 'Spezifische (isolierte) Phobien',
  generalisierteAngst: 'Generalisierte Angststörung',
  andereSymptome: 'Andere'
} as const satisfies Record<keyof FormTypes.Angstsymptomatik, string>;

// --- Zwangssymptomatik ---

/** ZwangsgedankenWiederkehrendFeld labels */
export const ZWANGSGEDANKEN_WIEDERKEHREND_FELD_LABELS = {
  [FormTypes.ZwangsgedankenWiederkehrendFeld.AufdringlicheGedanken]: 'Aufdringliche Gedanken',
  [FormTypes.ZwangsgedankenWiederkehrendFeld.AggressiveZwangsgedanken]: 'Aggressive Zwangsgedanken',
  [FormTypes.ZwangsgedankenWiederkehrendFeld.SexuelleZwangsgedanken]: 'Sexuelle Zwangsgedanken',
  [FormTypes.ZwangsgedankenWiederkehrendFeld.ReligioeseBlasFhemischeZwangsgedanken]: 'Religiöse oder blasphemische Zwangsgedanken',
  [FormTypes.ZwangsgedankenWiederkehrendFeld.Kontaminationsgedanken]: 'Kontaminationsgedanken',
  [FormTypes.ZwangsgedankenWiederkehrendFeld.MagischesDenken]: 'Magisches Denken',
  [FormTypes.ZwangsgedankenWiederkehrendFeld.Gruebelzwang]: 'Grübelzwang',
  [FormTypes.ZwangsgedankenWiederkehrendFeld.Andere]: 'Andere'
} as const satisfies Record<FormTypes.ZwangsgedankenWiederkehrendFeld, string>;

/** "Zwangsgedanken" parent label */
export const ZWANGSGEDANKEN_WIEDERKEHREND_LABEL = 'Quälende und wiederkehrende Zwangsgedanken';

/** Zwangsgedanken field labels */
export const ZWANGSGEDANKEN_FIELD_LABELS = {
  wiederkehrendeZwangsgedanken: 'Quälende und wiederkehrende Zwangsgedanken',
  zwanghafteIdeen: 'Zwanghafte Ideen',
  bildhafteZwangsvorstellungen: 'Bildhafte Zwangsvorstellungen',
  zwangsimpulse: 'Zwangsimpulse'
} as const satisfies Record<keyof FormTypes.ZwangsgedankenSelected, string>;

/** ZwangshandlungTyp labels */
export const ZWANGSHANDLUNG_TYP_LABELS = {
  [FormTypes.ZwangshandlungTyp.Kontrollzwang]: 'Kontrollzwang',
  [FormTypes.ZwangshandlungTyp.Waschzwang]: 'Waschzwang',
  [FormTypes.ZwangshandlungTyp.Ordnungszwang]: 'Ordnungszwang',
  [FormTypes.ZwangshandlungTyp.Wiederholungszwang]: 'Wiederholungszwang',
  [FormTypes.ZwangshandlungTyp.Zaehlzwang]: 'Zählzwang',
  [FormTypes.ZwangshandlungTyp.Symmetriezwang]: 'Symmetriezwang',
  [FormTypes.ZwangshandlungTyp.Sammelzwang]: 'Sammelzwang',
  [FormTypes.ZwangshandlungTyp.MentaleZwangsrituale]: 'Mentale Zwangsrituale',
  [FormTypes.ZwangshandlungTyp.Andere]: 'Andere'
} as const satisfies Record<FormTypes.ZwangshandlungTyp, string>;

/** "Zwangshandlungen" parent label */
export const ZWANGSHANDLUNGEN_LABEL = 'Quälende und wiederholende Zwangshandlungen oder Zwangsrituale';

/** ZwangsbezogeneKognitionSymptom labels */
export const ZWANGSBEZOGENE_KOGNITION_SYMPTOM_LABELS = {
  [FormTypes.ZwangsbezogeneKognitionSymptom.KognitiveFusion]:
    'Zwangsgedanken werden als eigene Gedanken erlebt (kognitive Fusion)',
  [FormTypes.ZwangsbezogeneKognitionSymptom.UnwillkuerlichAbstossend]:
    'Zwangsgedanken werden als unwillkürlich und häufig abstoßend empfunden',
  [FormTypes.ZwangsbezogeneKognitionSymptom.ZwangshandlungenSinnlos]:
    'Zwangshandlungen werden als sinnlos und ineffektiv erlebt',
  [FormTypes.ZwangsbezogeneKognitionSymptom.VersuchWiderstand]:
    'Versuch von Widerstand gegen Zwänge',
  [FormTypes.ZwangsbezogeneKognitionSymptom.VersuchUnterdrueckung]:
    'Versuch von Unterdrückung von Zwänge mit Angst verbunden',
  [FormTypes.ZwangsbezogeneKognitionSymptom.AngstVorSchadenUnheil]:
    'Angst vor Schaden oder Unheil',
  [FormTypes.ZwangsbezogeneKognitionSymptom.AnspannungErleichterung]:
    'Anspannung vor Zwangsausführung und kurzfristige Erleichterung nach Zwangsausführung'
} as const satisfies Record<FormTypes.ZwangsbezogeneKognitionSymptom, string>;

/** Zwangssymptomatik section labels */
export const ZWANGSSYMPTOMATIK_SECTION_LABELS = {
  zwangsgedanken: 'Zwangsgedanken',
  zwangshandlungen: 'Zwangshandlungen und Zwangsrituale',
  zwangsbezogeneKognitionen: 'Zwangsbezogene Kognitionen und Emotionen',
  andereSymptome: 'Andere'
} as const satisfies Record<keyof FormTypes.Zwangssymptomatik, string>;

// ============================================================================
// TRAUMAFOLGESYMPTOMATIK - TRAUMA-RELATED SYMPTOM LABELS (CATEGORY 5)
// ============================================================================

/** TraumaWiederErlebenSymptom labels */
export const TRAUMA_WIEDERERLEBEN_SYMPTOM_LABELS = {
  [FormTypes.TraumaWiederErlebenSymptom.Intrusionen]: 'Intrusionen (aufdrängende Erinnerungen)',
  [FormTypes.TraumaWiederErlebenSymptom.Flashbacks]: 'Flashbacks',
  [FormTypes.TraumaWiederErlebenSymptom.Albtraeume]: 'Albträume'
} as const satisfies Record<FormTypes.TraumaWiederErlebenSymptom, string>;

/** TraumaVermeidungSymptom labels */
export const TRAUMA_VERMEIDUNG_SYMPTOM_LABELS = {
  [FormTypes.TraumaVermeidungSymptom.VermeidungReizeSituationen]: 'Vermeidung von traumabezogenen Reizen oder Situationen',
  [FormTypes.TraumaVermeidungSymptom.VermeidungGedankenErinnerungen]: 'Vermeidung von traumabezogenen Gedanken oder Erinnerungen',
  [FormTypes.TraumaVermeidungSymptom.VermeidungAktivitaeten]: 'Vermeidung von Aktivitäten'
} as const satisfies Record<FormTypes.TraumaVermeidungSymptom, string>;

/** TraumaVerhaltenSymptom labels */
export const TRAUMA_VERHALTEN_SYMPTOM_LABELS = {
  [FormTypes.TraumaVerhaltenSymptom.GleichgueltigkeitGegenueberAnderen]: 'Gleichgültigkeit gegenüber anderen',
  [FormTypes.TraumaVerhaltenSymptom.SozialerRueckzug]: 'Sozialer Rückzug'
} as const satisfies Record<FormTypes.TraumaVerhaltenSymptom, string>;

/** TraumaUebererregungSymptom labels */
export const TRAUMA_UEBERERREGUNG_SYMPTOM_LABELS = {
  [FormTypes.TraumaUebererregungSymptom.VegetativeUebererregung]: 'Vegetative Übererregung (Hyperarousal)',
  [FormTypes.TraumaUebererregungSymptom.Hypervigilanz]: 'Hypervigilanz',
  [FormTypes.TraumaUebererregungSymptom.ErhoehteSchreckhaftigkeit]: 'Erhöhte Schreckhaftigkeit',
  [FormTypes.TraumaUebererregungSymptom.Schlafstoerungen]: 'Schlafstörungen',
  [FormTypes.TraumaUebererregungSymptom.Reizbarkeit]: 'Reizbarkeit',
  [FormTypes.TraumaUebererregungSymptom.Unruhe]: 'Unruhe',
  [FormTypes.TraumaUebererregungSymptom.Ueberaktivitaet]: 'Überaktivität'
} as const satisfies Record<FormTypes.TraumaUebererregungSymptom, string>;

/** TraumaSomatovegetativSymptom labels */
export const TRAUMA_SOMATOVEGETATIV_SYMPTOM_LABELS = {
  [FormTypes.TraumaSomatovegetativSymptom.Herzklopfen]: 'Herzklopfen',
  [FormTypes.TraumaSomatovegetativSymptom.Herzrasen]: 'Herzrasen',
  [FormTypes.TraumaSomatovegetativSymptom.Schweissausbrueche]: 'Schweißausbrüche',
  [FormTypes.TraumaSomatovegetativSymptom.Schwitzen]: 'Schwitzen',
  [FormTypes.TraumaSomatovegetativSymptom.Zittern]: 'Zittern',
  [FormTypes.TraumaSomatovegetativSymptom.Mundtrockenheit]: 'Mundtrockenheit',
  [FormTypes.TraumaSomatovegetativSymptom.Atemnot]: 'Atemnot',
  [FormTypes.TraumaSomatovegetativSymptom.Dyspnoe]: 'Dyspnoe',
  [FormTypes.TraumaSomatovegetativSymptom.Hyperventilation]: 'Hyperventilation',
  [FormTypes.TraumaSomatovegetativSymptom.Erstickungsgefuehl]: 'Erstickungsgefühl',
  [FormTypes.TraumaSomatovegetativSymptom.Beklemmungsgefuehl]: 'Beklemmungsgefühl',
  [FormTypes.TraumaSomatovegetativSymptom.EngeInDerBrust]: 'Engegefühl in der Brust',
  [FormTypes.TraumaSomatovegetativSymptom.Brustschmerzen]: 'Brustschmerzen',
  [FormTypes.TraumaSomatovegetativSymptom.Uebelkeit]: 'Übelkeit',
  [FormTypes.TraumaSomatovegetativSymptom.Magenbeschwerden]: 'Magenbeschwerden',
  [FormTypes.TraumaSomatovegetativSymptom.Bauchschmerzen]: 'Bauchschmerzen',
  [FormTypes.TraumaSomatovegetativSymptom.Durchfall]: 'Durchfall',
  [FormTypes.TraumaSomatovegetativSymptom.Stuhldrang]: 'Stuhldrang',
  [FormTypes.TraumaSomatovegetativSymptom.Miktionsdrang]: 'Miktionsdrang',
  [FormTypes.TraumaSomatovegetativSymptom.Schwindel]: 'Schwindel',
  [FormTypes.TraumaSomatovegetativSymptom.Benommenheit]: 'Benommenheit',
  [FormTypes.TraumaSomatovegetativSymptom.Unsicherheit]: 'Unsicherheit',
  [FormTypes.TraumaSomatovegetativSymptom.Schwaeche]: 'Schwäche',
  [FormTypes.TraumaSomatovegetativSymptom.Erroeten]: 'Erröten',
  [FormTypes.TraumaSomatovegetativSymptom.Hitzewallungen]: 'Hitzewallungen',
  [FormTypes.TraumaSomatovegetativSymptom.Kaelteschauer]: 'Kälteschauer',
  [FormTypes.TraumaSomatovegetativSymptom.Kribbelgefuehle]: 'Kribbelgefühle',
  [FormTypes.TraumaSomatovegetativSymptom.Taubheitsgefuehle]: 'Taubheitsgefühle',
  [FormTypes.TraumaSomatovegetativSymptom.InnereAnspannung]: 'Innere Anspannung',
  [FormTypes.TraumaSomatovegetativSymptom.Nervositaet]: 'Nervosität',
  [FormTypes.TraumaSomatovegetativSymptom.Ruhelosigkeit]: 'Ruhelosigkeit'
} as const satisfies Record<FormTypes.TraumaSomatovegetativSymptom, string>;

/** TraumaEmotionalesErlebenSymptom labels */
export const TRAUMA_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS = {
  [FormTypes.TraumaEmotionalesErlebenSymptom.Angst]: 'Angst',
  [FormTypes.TraumaEmotionalesErlebenSymptom.Verzweiflung]: 'Verzweiflung',
  [FormTypes.TraumaEmotionalesErlebenSymptom.EmotionaleTaubheit]: 'Emotionale Taubheit',
  [FormTypes.TraumaEmotionalesErlebenSymptom.Anhedonie]: 'Anhedonie'
} as const satisfies Record<FormTypes.TraumaEmotionalesErlebenSymptom, string>;

/** TraumaDissociativSymptom labels */
export const TRAUMA_DISSOCIATIV_SYMPTOM_LABELS = {
  [FormTypes.TraumaDissociativSymptom.Derealisation]: 'Derealisation',
  [FormTypes.TraumaDissociativSymptom.Depersonalisation]: 'Depersonalisation',
  [FormTypes.TraumaDissociativSymptom.Entfremdungsgefuehle]: 'Entfremdungsgefühle'
} as const satisfies Record<FormTypes.TraumaDissociativSymptom, string>;

/** TraumaKognitionSymptom labels */
export const TRAUMA_KOGNITION_SYMPTOM_LABELS = {
  [FormTypes.TraumaKognitionSymptom.Bewusstseinseinengung]: 'Bewusstseinseinengung',
  [FormTypes.TraumaKognitionSymptom.Konzentrationsstoerungen]: 'Konzentrationsstörungen',
  [FormTypes.TraumaKognitionSymptom.Desorientierung]: 'Desorientierung',
  [FormTypes.TraumaKognitionSymptom.UnfaehigkeitReizverarbeitung]: 'Unfähigkeit von Reizverarbeitung',
  [FormTypes.TraumaKognitionSymptom.Gruebeln]: 'Grübeln'
} as const satisfies Record<FormTypes.TraumaKognitionSymptom, string>;

/** AnpassungsstoerungSymptom labels */
export const ANPASSUNGSSTOERUNG_SYMPTOM_LABELS = {
  [FormTypes.AnpassungsstoerungSymptom.SubjektiveBedrängnis]: 'Zustand subjektiver Bedrängnis und emotionaler Beeinträchtigung',
  [FormTypes.AnpassungsstoerungSymptom.BehinderungSozialerFunktionen]: 'Behinderung sozialer Funktionen und Leistungsfähigkeit',
  [FormTypes.AnpassungsstoerungSymptom.DepressiveReaktion]: 'Depressive Reaktion',
  [FormTypes.AnpassungsstoerungSymptom.DepressiveUndAengstlicheReaktion]: 'Depressive und ängstliche Reaktion',
  [FormTypes.AnpassungsstoerungSymptom.StoerungenImSozialverhalten]: 'Störungen im Sozialverhalten',
  [FormTypes.AnpassungsstoerungSymptom.GefuehlImAlltagNichtZurechtzukommen]: 'Gefühl im Alltag nicht zurechtzukommen'
} as const satisfies Record<FormTypes.AnpassungsstoerungSymptom, string>;

/** Traumafolgesymptomatik section labels */
export const TRAUMAFOLGESYMPTOMATIK_SECTION_LABELS = {
  wiedererleben: 'Wiedererleben des Traumas',
  vermeidungsverhalten: 'Vermeidungsverhalten',
  verhalten: 'Verhalten',
  uebererregung: 'Übererregung',
  somatovegetativ: 'Somatovegetative Symptome',
  emotionalesErleben: 'Emotionales Erleben',
  dissoziativ: 'Dissoziative Symptome',
  kognition: 'Kognition',
  anpassungsstoerung: 'Anpassungsstörungspezifische Symptome',
  andereSymptome: 'Andere'
} as const satisfies Record<keyof FormTypes.Traumafolgesymptomatik, string>;

// ============================================================================
// PSYCHOTISCHE SYMPTOMATIK - PSYCHOTIC SYMPTOM LABELS (CATEGORY 6)
// ============================================================================

/** FormaleWahnmerkmale labels */
export const FORMALE_WAHNMERKMALE_LABELS = {
  [FormTypes.FormaleWahnmerkmale.Wahneinfall]: 'Wahneinfall',
  [FormTypes.FormaleWahnmerkmale.WahnhafteUeberzeugungen]: 'Wahnhafte Überzeugungen',
  [FormTypes.FormaleWahnmerkmale.Wahnwahrnehmung]: 'Wahnwahrnehmung',
  [FormTypes.FormaleWahnmerkmale.Wahnstimmung]: 'Wahnstimmung',
  [FormTypes.FormaleWahnmerkmale.Wahndynamik]: 'Wahndynamik',
  [FormTypes.FormaleWahnmerkmale.SystematisierterWahn]: 'Systematisierter Wahn'
} as const satisfies Record<FormTypes.FormaleWahnmerkmale, string>;

/** InhaltlicheWahnmerkmale labels */
export const INHALTLICHE_WAHNMERKMALE_LABELS = {
  [FormTypes.InhaltlicheWahnmerkmale.Verfolgungswahn]: 'Verfolgungswahn',
  [FormTypes.InhaltlicheWahnmerkmale.Bedeutungswahn]: 'Bedeutungswahn',
  [FormTypes.InhaltlicheWahnmerkmale.Beziehungswahn]: 'Beziehungswahn',
  [FormTypes.InhaltlicheWahnmerkmale.Beeintraechtigungswahn]: 'Beeinträchtigungswahn',
  [FormTypes.InhaltlicheWahnmerkmale.Beeinflussungswahn]: 'Beeinflussungswahn',
  [FormTypes.InhaltlicheWahnmerkmale.Groessenwahn]: 'Größenwahn',
  [FormTypes.InhaltlicheWahnmerkmale.Verarmungswahn]: 'Verarmungswahn',
  [FormTypes.InhaltlicheWahnmerkmale.Versuendigungswahn]: 'Versündigungswahn',
  [FormTypes.InhaltlicheWahnmerkmale.Schuldwahn]: 'Schuldwahn',
  [FormTypes.InhaltlicheWahnmerkmale.HypochondrischerWahn]: 'Hypochondrischer Wahn',
  [FormTypes.InhaltlicheWahnmerkmale.Eifersuchtswahn]: 'Eifersuchtswahn',
  [FormTypes.InhaltlicheWahnmerkmale.Liebeswahn]: 'Liebeswahn',
  [FormTypes.InhaltlicheWahnmerkmale.Kontrollwahn]: 'Kontrollwahn',
  [FormTypes.InhaltlicheWahnmerkmale.ReligioeserWahn]: 'Religiöser Wahn',
  [FormTypes.InhaltlicheWahnmerkmale.Vergiftungswahn]: 'Vergiftungswahn',
  [FormTypes.InhaltlicheWahnmerkmale.Bestehlungswahn]: 'Bestehlungswahn'
} as const satisfies Record<FormTypes.InhaltlicheWahnmerkmale, string>;

/** StimmenHoerenTyp labels */
export const STIMMEN_HOEREN_TYP_LABELS = {
  [FormTypes.StimmenHoerenTyp.KommentierendeStimmen]: 'Kommentierende Stimmen',
  [FormTypes.StimmenHoerenTyp.DialogischeStimmen]: 'Dialogische Stimmen',
  [FormTypes.StimmenHoerenTyp.ImperativeStimmen]: 'Imperative Stimmen'
} as const satisfies Record<FormTypes.StimmenHoerenTyp, string>;

/** AndereHalluzinationTyp labels */
export const ANDERE_HALLUZINATION_TYP_LABELS = {
  [FormTypes.AndereHalluzinationTyp.OptischeHalluzinationen]: 'Optische Halluzinationen',
  [FormTypes.AndereHalluzinationTyp.VisuelleHalluzinationen]: 'Visuelle Halluzinationen',
  [FormTypes.AndereHalluzinationTyp.OlfaktorischeGustatorische]: 'Olfaktorische/Gustatorische Halluzinationen',
  [FormTypes.AndereHalluzinationTyp.TaktileHalluzinationen]: 'Taktile Halluzinationen',
  [FormTypes.AndereHalluzinationTyp.Zoenaesthesien]: 'Zönästhesien',
  [FormTypes.AndereHalluzinationTyp.Illusionen]: 'Illusionen',
  [FormTypes.AndereHalluzinationTyp.Pseudohalluzinationen]: 'Pseudohalluzinationen'
} as const satisfies Record<FormTypes.AndereHalluzinationTyp, string>;

/** IchHaftigkeitSymptom labels */
export const ICH_HAFTIGKEIT_SYMPTOM_LABELS = {
  [FormTypes.IchHaftigkeitSymptom.Gedankenlautwerden]: 'Gedankenlautwerden',
  [FormTypes.IchHaftigkeitSymptom.Gedankeneingebung]: 'Gedankeneingebung',
  [FormTypes.IchHaftigkeitSymptom.Gedankenentzug]: 'Gedankenentzug',
  [FormTypes.IchHaftigkeitSymptom.Gedankenausbreitung]: 'Gedankenausbreitung'
} as const satisfies Record<FormTypes.IchHaftigkeitSymptom, string>;

/** IchStoerungAndereSymptom labels */
export const ICH_STOERUNG_ANDERE_SYMPTOM_LABELS = {
  [FormTypes.IchStoerungAndereSymptom.Fremdbeeinflussungserleben]: 'Fremdbeeinflussungserleben',
  [FormTypes.IchStoerungAndereSymptom.GefuehlDesGemachten]: 'Gefühl des Gemachten',
  [FormTypes.IchStoerungAndereSymptom.Derealisation]: 'Derealisation',
  [FormTypes.IchStoerungAndereSymptom.Depersonalisation]: 'Depersonalisation'
} as const satisfies Record<FormTypes.IchStoerungAndereSymptom, string>;

/** FormaleDenkstoerungSymptom labels */
export const FORMALE_DENKSTOERUNG_SYMPTOM_LABELS = {
  [FormTypes.FormaleDenkstoerungSymptom.Gedankenabreissen]: 'Gedankenabreißen',
  [FormTypes.FormaleDenkstoerungSymptom.Gedankensperrung]: 'Gedankensperrung',
  [FormTypes.FormaleDenkstoerungSymptom.Zerfahrenheit]: 'Zerfahrenheit',
  [FormTypes.FormaleDenkstoerungSymptom.Perseverationen]: 'Perseverationen',
  [FormTypes.FormaleDenkstoerungSymptom.UmstaendlicheWeitschweifigeSprache]: 'Umständliche, weitschweifige Sprache',
  [FormTypes.FormaleDenkstoerungSymptom.Danebenreden]: 'Danebenreden',
  [FormTypes.FormaleDenkstoerungSymptom.Vorbeireden]: 'Vorbeireden',
  [FormTypes.FormaleDenkstoerungSymptom.Neologismen]: 'Neologismen',
  [FormTypes.FormaleDenkstoerungSymptom.Inkohaerenz]: 'Inkohärenz',
  [FormTypes.FormaleDenkstoerungSymptom.Assoziationslockerung]: 'Assoziationslockerung',
  [FormTypes.FormaleDenkstoerungSymptom.Ideenflucht]: 'Ideenflucht'
} as const satisfies Record<FormTypes.FormaleDenkstoerungSymptom, string>;

/** PsychotischEmotionalesErlebenSymptom labels */
export const PSYCHOTISCH_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS = {
  [FormTypes.PsychotischEmotionalesErlebenSymptom.EmotionaleAufgewuehltheit]: 'Emotionale Aufgewühltheit',
  [FormTypes.PsychotischEmotionalesErlebenSymptom.Reizbarkeit]: 'Reizbarkeit',
  [FormTypes.PsychotischEmotionalesErlebenSymptom.Euphorie]: 'Euphorie',
  [FormTypes.PsychotischEmotionalesErlebenSymptom.Affektverflachung]: 'Affektverflachung',
  [FormTypes.PsychotischEmotionalesErlebenSymptom.Affektverarmung]: 'Affektverarmung',
  [FormTypes.PsychotischEmotionalesErlebenSymptom.Affektstarrheit]: 'Affektstarrheit',
  [FormTypes.PsychotischEmotionalesErlebenSymptom.Parathymie]: 'Parathymie',
  [FormTypes.PsychotischEmotionalesErlebenSymptom.Anhedonie]: 'Anhedonie',
  [FormTypes.PsychotischEmotionalesErlebenSymptom.Apathie]: 'Apathie'
} as const satisfies Record<FormTypes.PsychotischEmotionalesErlebenSymptom, string>;

/** PsychotischVerhaltenSymptom labels */
export const PSYCHOTISCH_VERHALTEN_SYMPTOM_LABELS = {
  [FormTypes.PsychotischVerhaltenSymptom.SozialerRueckzug]: 'Sozialer Rückzug',
  [FormTypes.PsychotischVerhaltenSymptom.WenigeSozialeBezuege]: 'Wenige soziale Bezüge',
  [FormTypes.PsychotischVerhaltenSymptom.Antriebsmangel]: 'Antriebsmangel',
  [FormTypes.PsychotischVerhaltenSymptom.Passivitaet]: 'Passivität',
  [FormTypes.PsychotischVerhaltenSymptom.Initiativmangel]: 'Initiativmangel',
  [FormTypes.PsychotischVerhaltenSymptom.Interesselosigkeit]: 'Interesselosigkeit',
  [FormTypes.PsychotischVerhaltenSymptom.Sprachverarmung]: 'Sprachverarmung',
  [FormTypes.PsychotischVerhaltenSymptom.Kaelte]: 'Kälte',
  [FormTypes.PsychotischVerhaltenSymptom.Unnahbarkeit]: 'Unnahbarkeit',
  [FormTypes.PsychotischVerhaltenSymptom.SeltsamesVerhalten]: 'Seltsames Verhalten'
} as const satisfies Record<FormTypes.PsychotischVerhaltenSymptom, string>;

/** PsychotischKognitionSymptom labels */
export const PSYCHOTISCH_KOGNITION_SYMPTOM_LABELS = {
  [FormTypes.PsychotischKognitionSymptom.Aufmerksamkeitsstoerungen]: 'Aufmerksamkeitsstörungen',
  [FormTypes.PsychotischKognitionSymptom.UmstaendlichesDenken]: 'Umständliches Denken',
  [FormTypes.PsychotischKognitionSymptom.GruebelnOhneWiderstand]: 'Grübeln ohne Widerstand',
  [FormTypes.PsychotischKognitionSymptom.StereotypesDenken]: 'Stereotypes Denken',
  [FormTypes.PsychotischKognitionSymptom.RatlosigkeitVerkennung]: 'Ratlosigkeit/Verkennung'
} as const satisfies Record<FormTypes.PsychotischKognitionSymptom, string>;

/** KatatoneSymptom labels */
export const KATATONE_SYMPTOM_LABELS = {
  [FormTypes.KatatoneSymptom.Stupor]: 'Stupor',
  [FormTypes.KatatoneSymptom.Katalepsie]: 'Katalepsie',
  [FormTypes.KatatoneSymptom.FlexibilitasCerea]: 'Flexibilitas Cerea',
  [FormTypes.KatatoneSymptom.Stereotypien]: 'Stereotypien',
  [FormTypes.KatatoneSymptom.Agitation]: 'Agitation',
  [FormTypes.KatatoneSymptom.Negativismus]: 'Negativismus',
  [FormTypes.KatatoneSymptom.Mutismus]: 'Mutismus',
  [FormTypes.KatatoneSymptom.Echolalie]: 'Echolalie',
  [FormTypes.KatatoneSymptom.Manierismen]: 'Manierismen'
} as const satisfies Record<FormTypes.KatatoneSymptom, string>;

/** PsychotischeSymptomatik section labels */
export const PSYCHOTISCHE_SYMPTOMATIK_SECTION_LABELS = {
  formaleWahnmerkmale: 'Formale Wahnmerkmale',
  inhaltlicheWahnmerkmale: 'Inhaltliche Wahnmerkmale',
  akustischeHalluzination: 'Akustische Halluzinationen',
  andereHalluzinationen: 'Andere Halluzinationen',
  ichHaftigkeit: 'Störungen der Ich-Haftigkeit',
  ichStoerungAndere: 'Andere Ich-Störungen',
  formaleDenkstoerungen: 'Formale Denkstörungen',
  emotionalesErleben: 'Emotionales Erleben',
  verhalten: 'Verhalten',
  kognition: 'Kognition',
  katatoneSymptome: 'Katatone Symptome',
  andereSymptome: 'Andere'
} as const satisfies Record<keyof FormTypes.PsychotischeSymptomatik, string>;

// ============================================================================
// ORGANISCHE SYMPTOMATIK - ORGANIC SYMPTOM LABELS
// ============================================================================

/** Quantitative Bewusstseinsstörungen (single-select radio) */
export const QUANTITATIVE_BEWUSSTSEINSSTOERUNG_LABELS = {
  [FormTypes.QuantitativeBewusstseinsstoerung.Bewusstseinsminderung]: 'Bewusstseinsminderung',
  [FormTypes.QuantitativeBewusstseinsstoerung.Benommenheit]: 'Benommenheit',
  [FormTypes.QuantitativeBewusstseinsstoerung.Somnolenz]: 'Somnolenz',
  [FormTypes.QuantitativeBewusstseinsstoerung.Sopor]: 'Sopor',
  [FormTypes.QuantitativeBewusstseinsstoerung.Koma]: 'Koma'
} as const satisfies Record<FormTypes.QuantitativeBewusstseinsstoerung, string>;

/** Qualitative Bewusstseinsstörungen (single-select radio) */
export const QUALITATIVE_BEWUSSTSEINSSTOERUNG_LABELS = {
  [FormTypes.QualitativeBewusstseinsstoerung.Bewusstseinseinengung]: 'Bewusstseinseinengung',
  [FormTypes.QualitativeBewusstseinsstoerung.Bewusstseinstruebung]: 'Bewusstseinstrübung',
  [FormTypes.QualitativeBewusstseinsstoerung.Bewusstseinsverschiebung]: 'Bewusstseinsverschiebung'
} as const satisfies Record<FormTypes.QualitativeBewusstseinsstoerung, string>;

/** Attentionale Symptome */
export const ORGANISCH_ATTENTIONAL_LABELS = {
  [FormTypes.OrganischAttentionalSymptom.Aufmerksamkeitsstoerung]: 'Aufmerksamkeitsstörung',
  [FormTypes.OrganischAttentionalSymptom.ErhoehteAblenkbarkeit]: 'Erhöhte Ablenkbarkeit',
  [FormTypes.OrganischAttentionalSymptom.Konzentrationsstoerung]: 'Konzentrationsstörung'
} as const satisfies Record<FormTypes.OrganischAttentionalSymptom, string>;

/** Mnestische Symptome */
export const ORGANISCH_MNESTISCH_LABELS = {
  [FormTypes.OrganischMnestischSymptom.Kurzzeitgedaechtnisstoerung]: 'Kurzzeitgedächtnisstörung',
  [FormTypes.OrganischMnestischSymptom.Langzeitgedaechtnisstoerung]: 'Langzeitgedächtnisstörung',
  [FormTypes.OrganischMnestischSymptom.Merkfaehigkeitsstoerung]: 'Merkfähigkeitsstörung',
  [FormTypes.OrganischMnestischSymptom.Amnesie]: 'Amnesie',
  [FormTypes.OrganischMnestischSymptom.Konfabulation]: 'Konfabulation',
  [FormTypes.OrganischMnestischSymptom.Paramnesie]: 'Paramnesie'
} as const satisfies Record<FormTypes.OrganischMnestischSymptom, string>;

/** Exekutiv-funktionale Symptome */
export const ORGANISCH_EXEKUTIV_LABELS = {
  [FormTypes.OrganischExekutivSymptom.Planungsstoerung]: 'Planungsstörung',
  [FormTypes.OrganischExekutivSymptom.Handlungsorganisationsstoerung]: 'Handlungsorganisationsstörung',
  [FormTypes.OrganischExekutivSymptom.FlexibilitaetsstoerungKognitiv]: 'Kognitive Flexibilitätsstörung'
} as const satisfies Record<FormTypes.OrganischExekutivSymptom, string>;

/** Sprachliche Symptome */
export const ORGANISCH_SPRACHLICH_LABELS = {
  [FormTypes.OrganischSprachlichSymptom.Wortfindungsstoerungen]: 'Wortfindungsstörungen',
  [FormTypes.OrganischSprachlichSymptom.Paraphasien]: 'Paraphasien',
  [FormTypes.OrganischSprachlichSymptom.Sprachverstaendnisstoerung]: 'Sprachverständnisstörung',
  [FormTypes.OrganischSprachlichSymptom.Dyslexie]: 'Dyslexie',
  [FormTypes.OrganischSprachlichSymptom.Dysgraphie]: 'Dysgraphie',
  [FormTypes.OrganischSprachlichSymptom.Aphasie]: 'Aphasie'
} as const satisfies Record<FormTypes.OrganischSprachlichSymptom, string>;

/** Denkstörungen */
export const ORGANISCH_DENKSTOERUNG_LABELS = {
  [FormTypes.OrganischDenkstoerungSymptom.VerlangsamptesDenken]: 'Verlangsamtes Denken',
  [FormTypes.OrganischDenkstoerungSymptom.EingeengtesDenken]: 'Eingeengtes Denken',
  [FormTypes.OrganischDenkstoerungSymptom.PerseverierendesDenken]: 'Perseverierendes Denken',
  [FormTypes.OrganischDenkstoerungSymptom.UmstaendlichesDenken]: 'Umständliches Denken',
  [FormTypes.OrganischDenkstoerungSymptom.Ideenflucht]: 'Ideenflucht',
  [FormTypes.OrganischDenkstoerungSymptom.Inkohaerenz]: 'Inkohärenz'
} as const satisfies Record<FormTypes.OrganischDenkstoerungSymptom, string>;

/** Orientierungsstörungen */
export const ORGANISCH_ORIENTIERUNG_LABELS = {
  [FormTypes.OrganischOrientierungSymptom.ZeitlicheDesorientierung]: 'Zeitliche Desorientierung',
  [FormTypes.OrganischOrientierungSymptom.OertlicheDesorientierung]: 'Örtliche Desorientierung',
  [FormTypes.OrganischOrientierungSymptom.PersonelleDesorientierung]: 'Personelle Desorientierung',
  [FormTypes.OrganischOrientierungSymptom.SituativeDesorientierung]: 'Situative Desorientierung'
} as const satisfies Record<FormTypes.OrganischOrientierungSymptom, string>;

/** Emotionsbezogene Symptome */
export const ORGANISCH_EMOTION_LABELS = {
  [FormTypes.OrganischEmotionSymptom.AffektiveLabilität]: 'Affektive Labilität',
  [FormTypes.OrganischEmotionSymptom.Reizbarkeit]: 'Reizbarkeit',
  [FormTypes.OrganischEmotionSymptom.Apathie]: 'Apathie',
  [FormTypes.OrganischEmotionSymptom.Depression]: 'Depression',
  [FormTypes.OrganischEmotionSymptom.Angst]: 'Angst',
  [FormTypes.OrganischEmotionSymptom.Enthemmung]: 'Enthemmung',
  [FormTypes.OrganischEmotionSymptom.Euphorie]: 'Euphorie'
} as const satisfies Record<FormTypes.OrganischEmotionSymptom, string>;

/** Amnestische Symptome */
export const ORGANISCH_AMNESTISCH_LABELS = {
  [FormTypes.OrganischAmnestischSymptom.AnterogradeAmnesie]: 'Anterograde Amnesie',
  [FormTypes.OrganischAmnestischSymptom.RetrogradeAmnesie]: 'Retrograde Amnesie'
} as const satisfies Record<FormTypes.OrganischAmnestischSymptom, string>;

/** Alltagskompetenz Status (tri-state) */
export const ALLTAGSKOMPETENZ_STATUS_LABELS = {
  [FormTypes.AlltagskompetenzStatus.Selbststaendig]: 'Selbstständig',
  [FormTypes.AlltagskompetenzStatus.MitUnterstuetzung]: 'Mit Unterstützung möglich',
  [FormTypes.AlltagskompetenzStatus.NichtMoeglich]: 'Nicht möglich'
} as const satisfies Record<FormTypes.AlltagskompetenzStatus, string>;

/** Basale Alltagskompetenzen (ADL) */
export const BASALE_ALLTAGSKOMPETENZ_LABELS = {
  [FormTypes.BasaleAlltagskompetenz.Essen]: 'Essen',
  [FormTypes.BasaleAlltagskompetenz.Baden]: 'Baden',
  [FormTypes.BasaleAlltagskompetenz.Koerperpflege]: 'Körperpflege',
  [FormTypes.BasaleAlltagskompetenz.Anziehen]: 'Anziehen',
  [FormTypes.BasaleAlltagskompetenz.Toilettenbenutzung]: 'Toilettenbenutzung',
  [FormTypes.BasaleAlltagskompetenz.StuhlHarnkontrolle]: 'Stuhl-/Harnkontrolle',
  [FormTypes.BasaleAlltagskompetenz.Mobilitaet]: 'Mobilität',
  [FormTypes.BasaleAlltagskompetenz.Treppensteigen]: 'Treppensteigen'
} as const satisfies Record<FormTypes.BasaleAlltagskompetenz, string>;

/** Instrumentelle Alltagskompetenzen (IADL) */
export const INSTRUMENTELLE_ALLTAGSKOMPETENZ_LABELS = {
  [FormTypes.InstrumentelleAlltagskompetenz.UmgangHandy]: 'Umgang mit Handy/Telefon',
  [FormTypes.InstrumentelleAlltagskompetenz.Einkaufen]: 'Einkaufen',
  [FormTypes.InstrumentelleAlltagskompetenz.Kochen]: 'Kochen',
  [FormTypes.InstrumentelleAlltagskompetenz.Haushaltsarbeiten]: 'Haushaltsarbeiten',
  [FormTypes.InstrumentelleAlltagskompetenz.Waeschepflege]: 'Wäschepflege',
  [FormTypes.InstrumentelleAlltagskompetenz.TransportNutzung]: 'Nutzung von Transportmitteln',
  [FormTypes.InstrumentelleAlltagskompetenz.Medikamentenmanagement]: 'Medikamentenmanagement',
  [FormTypes.InstrumentelleAlltagskompetenz.Finanzmanagement]: 'Finanzmanagement',
  [FormTypes.InstrumentelleAlltagskompetenz.NutzungOeffentlicherEinrichtungen]: 'Nutzung öffentlicher Einrichtungen'
} as const satisfies Record<FormTypes.InstrumentelleAlltagskompetenz, string>;

/** OrganischeSymptomatik section labels */
export const ORGANISCHE_SYMPTOMATIK_SECTION_LABELS = {
  quantitativeBewusstsein: 'Quantitative Bewusstseinsstörungen',
  qualitativeBewusstsein: 'Qualitative Bewusstseinsstörungen',
  attentional: 'Attentionale Symptome',
  mnestisch: 'Mnestische Symptome',
  exekutiv: 'Exekutiv-funktionale Symptome',
  sprachlich: 'Sprachliche Symptome',
  denkstoerungen: 'Denkstörungen',
  orientierung: 'Orientierungsstörungen',
  emotionsbezogen: 'Emotionsbezogene Symptome',
  amnestisch: 'Amnestische Symptome',
  basaleAlltagskompetenzen: 'Basale Alltagskompetenzen',
  instrumentelleAlltagskompetenzen: 'Instrumentelle Alltagskompetenzen',
  andereSymptome: 'Andere'
} as const satisfies Record<keyof FormTypes.OrganischeSymptomatik, string>;

// ============================================================================
// SOMATOFORME SYMPTOMATIK - CATEGORY 8 LABELS
// ============================================================================

/** Körperliche Symptome */
export const SOMATOFORM_KOERPERLICH_LABELS = {
  [FormTypes.SomatoformKoerperlichSymptom.Bauchschmerzen]: 'Bauchschmerzen',
  [FormTypes.SomatoformKoerperlichSymptom.Uebelkeit]: 'Übelkeit',
  [FormTypes.SomatoformKoerperlichSymptom.Voellegefuehl]: 'Völlegefühl',
  [FormTypes.SomatoformKoerperlichSymptom.Blaehungen]: 'Blähungen',
  [FormTypes.SomatoformKoerperlichSymptom.Durchfall]: 'Durchfall',
  [FormTypes.SomatoformKoerperlichSymptom.Nahrungsunvertraeglichkeit]: 'Nahrungsunverträglichkeit',
  [FormTypes.SomatoformKoerperlichSymptom.Herzrasen]: 'Herzrasen',
  [FormTypes.SomatoformKoerperlichSymptom.Brustschmerzen]: 'Brustschmerzen',
  [FormTypes.SomatoformKoerperlichSymptom.Atemnot]: 'Atemnot',
  [FormTypes.SomatoformKoerperlichSymptom.Druckgefuehl]: 'Druckgefühl in der Brust',
  [FormTypes.SomatoformKoerperlichSymptom.Miktionsbeschwerden]: 'Miktionsbeschwerden',
  [FormTypes.SomatoformKoerperlichSymptom.Genitalbeschwerden]: 'Genitalbeschwerden',
  [FormTypes.SomatoformKoerperlichSymptom.Kopfschmerzen]: 'Kopfschmerzen',
  [FormTypes.SomatoformKoerperlichSymptom.Schwindel]: 'Schwindel',
  [FormTypes.SomatoformKoerperlichSymptom.Taubheitsgefuehle]: 'Taubheitsgefühle',
  [FormTypes.SomatoformKoerperlichSymptom.Kribbeln]: 'Kribbeln/Parästhesien',
  [FormTypes.SomatoformKoerperlichSymptom.Muskelschwaeche]: 'Muskelschwäche',
  [FormTypes.SomatoformKoerperlichSymptom.Rueckenschmerzen]: 'Rückenschmerzen',
  [FormTypes.SomatoformKoerperlichSymptom.Gelenkschmerzen]: 'Gelenkschmerzen',
  [FormTypes.SomatoformKoerperlichSymptom.Gliederschmerzen]: 'Gliederschmerzen'
} as const satisfies Record<FormTypes.SomatoformKoerperlichSymptom, string>;

/** Autonome Symptome */
export const SOMATOFORM_AUTONOM_LABELS = {
  [FormTypes.SomatoformAutonomSymptom.Schwitzen]: 'Übermäßiges Schwitzen',
  [FormTypes.SomatoformAutonomSymptom.Herzstolpern]: 'Herzstolpern/Palpitationen',
  [FormTypes.SomatoformAutonomSymptom.Mundtrockenheit]: 'Mundtrockenheit',
  [FormTypes.SomatoformAutonomSymptom.Zittern]: 'Zittern',
  [FormTypes.SomatoformAutonomSymptom.Erroeten]: 'Erröten',
  [FormTypes.SomatoformAutonomSymptom.Hitzewallungen]: 'Hitzewallungen',
  [FormTypes.SomatoformAutonomSymptom.Kaeltegefuehl]: 'Kältegefühl',
  [FormTypes.SomatoformAutonomSymptom.HaeufigesWasserlassen]: 'Häufiges Wasserlassen',
  [FormTypes.SomatoformAutonomSymptom.Schluckbeschwerden]: 'Schluckbeschwerden',
  [FormTypes.SomatoformAutonomSymptom.Klossgefuehl]: 'Kloßgefühl im Hals'
} as const satisfies Record<FormTypes.SomatoformAutonomSymptom, string>;

/** Hypochondrische Symptome */
export const SOMATOFORM_HYPOCHONDRISCH_LABELS = {
  [FormTypes.SomatoformHypochondrischSymptom.UebertriebeneSorgen]: 'Übertriebene Sorgen über körperliche Beschwerden',
  [FormTypes.SomatoformHypochondrischSymptom.KrankheitsueberzeugungTrotzBeruehigung]: 'Krankheitsüberzeugung trotz ärztlicher Beruhigung',
  [FormTypes.SomatoformHypochondrischSymptom.HaeufigeArztkonsultationen]: 'Häufige Arztkonsultationen (Doctor Shopping)',
  [FormTypes.SomatoformHypochondrischSymptom.SelbstuntersuchungenBodychecking]: 'Selbstuntersuchungen/Body-Checking',
  [FormTypes.SomatoformHypochondrischSymptom.VermeidungKoerplicherAktivitaet]: 'Vermeidung körperlicher Aktivität',
  [FormTypes.SomatoformHypochondrischSymptom.SuchenNachInformationen]: 'Übermäßiges Suchen nach Gesundheitsinformationen',
  [FormTypes.SomatoformHypochondrischSymptom.BefuerchtungSchwererKrankheit]: 'Befürchtung einer schweren Krankheit',
  [FormTypes.SomatoformHypochondrischSymptom.MissinterpretationKoerpersignale]: 'Missinterpretation normaler Körpersignale'
} as const satisfies Record<FormTypes.SomatoformHypochondrischSymptom, string>;

/** Schmerz-Symptome */
export const SOMATOFORM_SCHMERZ_LABELS = {
  [FormTypes.SomatoformSchmerzSymptom.AnhaltenderSchmerz]: 'Anhaltender Schmerz',
  [FormTypes.SomatoformSchmerzSymptom.WechselndeSchmerzlokalisation]: 'Wechselnde Schmerzlokalisation',
  [FormTypes.SomatoformSchmerzSymptom.SchmerzOhneBefund]: 'Schmerz ohne ausreichenden organischen Befund',
  [FormTypes.SomatoformSchmerzSymptom.UebermaessigeSchmerzfokussierung]: 'Übermäßige Fokussierung auf Schmerz',
  [FormTypes.SomatoformSchmerzSymptom.BeeintraechtigungDurchSchmerz]: 'Beeinträchtigung des Alltags durch Schmerz',
  [FormTypes.SomatoformSchmerzSymptom.SchmerzverstaerkungBeiStress]: 'Schmerzverstärkung bei emotionalem Stress'
} as const satisfies Record<FormTypes.SomatoformSchmerzSymptom, string>;

/** Konversions-Symptome */
export const SOMATOFORM_KONVERSION_LABELS = {
  [FormTypes.SomatoformKonversionSymptom.Laehmungserscheinungen]: 'Lähmungserscheinungen',
  [FormTypes.SomatoformKonversionSymptom.Bewegungsstoerungen]: 'Bewegungsstörungen',
  [FormTypes.SomatoformKonversionSymptom.Koordinationsstoerungen]: 'Koordinationsstörungen',
  [FormTypes.SomatoformKonversionSymptom.Sehstoerungen]: 'Sehstörungen',
  [FormTypes.SomatoformKonversionSymptom.Hoerstoerungen]: 'Hörstörungen',
  [FormTypes.SomatoformKonversionSymptom.Sensibilitaetsstoerungen]: 'Sensibilitätsstörungen',
  [FormTypes.SomatoformKonversionSymptom.Sprachstoerungen]: 'Sprachstörungen (Aphonie/Dysphonie)',
  [FormTypes.SomatoformKonversionSymptom.KrampfaehnlicheAnfaelle]: 'Krampfähnliche Anfälle'
} as const satisfies Record<FormTypes.SomatoformKonversionSymptom, string>;

/** SomatoformeSymptomatik section labels */
export const SOMATOFORME_SYMPTOMATIK_SECTION_LABELS = {
  koerperlicheSymptome: 'Körperliche Symptome',
  autonomeSymptome: 'Autonome Symptome',
  hypochondrischeSymptome: 'Hypochondrische Symptome',
  schmerzSymptome: 'Schmerz-Symptome',
  konversionSymptome: 'Konversions-Symptome',
  andereSymptome: 'Andere'
} as const satisfies Record<keyof FormTypes.SomatoformeSymptomatik, string>;

// ============================================================================
// CATEGORY 9: NICHTORGANISCHE SCHLAFSTÖRUNGEN LABELS
// ============================================================================

/** SchlafInsomniesymptom labels */
export const SCHLAF_INSOMNIE_LABELS = {
  [FormTypes.SchlafInsomniesymptom.Einschlafstoerung]: 'Einschlafstörung',
  [FormTypes.SchlafInsomniesymptom.Durchschlafstoerung]: 'Durchschlafstörung',
  [FormTypes.SchlafInsomniesymptom.Frueherwachen]: 'Früherwachen',
  [FormTypes.SchlafInsomniesymptom.NichtErholsamerSchlaf]: 'Nicht erholsamer Schlaf',
  [FormTypes.SchlafInsomniesymptom.Tagmuedigkeit]: 'Tagesmüdigkeit',
  [FormTypes.SchlafInsomniesymptom.KonzentrationsschwierigkeitenTag]: 'Konzentrationsschwierigkeiten tagsüber',
  [FormTypes.SchlafInsomniesymptom.Reizbarkeit]: 'Reizbarkeit',
  [FormTypes.SchlafInsomniesymptom.SorgenUmSchlaf]: 'Sorgen um den Schlaf'
} as const satisfies Record<FormTypes.SchlafInsomniesymptom, string>;

/** SchlafHypersomniesymptom labels */
export const SCHLAF_HYPERSOMNIE_LABELS = {
  [FormTypes.SchlafHypersomniesymptom.UebermaessigeSchlafdauer]: 'Übermäßige Schlafdauer',
  [FormTypes.SchlafHypersomniesymptom.TagesschlaefrigkeitTrotzSchlaf]: 'Tagesschläfrigkeit trotz ausreichendem Schlaf',
  [FormTypes.SchlafHypersomniesymptom.VerlaengerteUebergangszeit]: 'Verlängerte Übergangszeit zum Wachzustand',
  [FormTypes.SchlafHypersomniesymptom.Schlaftrunkenheit]: 'Schlaftrunkenheit',
  [FormTypes.SchlafHypersomniesymptom.AutomatischesVerhalten]: 'Automatisches Verhalten'
} as const satisfies Record<FormTypes.SchlafHypersomniesymptom, string>;

/** SchlafRhythmusStoerung labels */
export const SCHLAF_RHYTHMUS_LABELS = {
  [FormTypes.SchlafRhythmusStoerung.VerzoegerteSchlafphase]: 'Verzögerte Schlafphase',
  [FormTypes.SchlafRhythmusStoerung.VorverlagertSchlafphase]: 'Vorverlagerte Schlafphase',
  [FormTypes.SchlafRhythmusStoerung.UnregelmaessigerRhythmus]: 'Unregelmäßiger Schlaf-Wach-Rhythmus'
} as const satisfies Record<FormTypes.SchlafRhythmusStoerung, string>;

/** SchlafParasomniesymptom labels */
export const SCHLAF_PARASOMNIE_LABELS = {
  [FormTypes.SchlafParasomniesymptom.Schlafwandeln]: 'Schlafwandeln (Somnambulismus)',
  [FormTypes.SchlafParasomniesymptom.PavorNocturnus]: 'Pavor nocturnus (Nachtschreck)',
  [FormTypes.SchlafParasomniesymptom.Albtraeume]: 'Albträume',
  [FormTypes.SchlafParasomniesymptom.SchlafbezogeneEssstoerung]: 'Schlafbezogene Essstörung',
  [FormTypes.SchlafParasomniesymptom.REMSchlafVerhaltensstoerung]: 'REM-Schlaf-Verhaltensstörung',
  [FormTypes.SchlafParasomniesymptom.Schlafparalyse]: 'Schlafparalyse',
  [FormTypes.SchlafParasomniesymptom.SchlafbezogeneHalluzinationen]: 'Schlafbezogene Halluzinationen'
} as const satisfies Record<FormTypes.SchlafParasomniesymptom, string>;

/** NichtorganischeSchlafstoerungen section labels */
export const SCHLAFSTOERUNGEN_SECTION_LABELS = {
  insomnie: 'Insomnie',
  hypersomnie: 'Hypersomnie',
  rhythmus: 'Schlaf-Wach-Rhythmusstörungen',
  parasomnie: 'Parasomnien',
  andereSymptome: 'Andere Schlafstörungen'
} as const satisfies Record<keyof FormTypes.NichtorganischeSchlafstoerungen, string>;

// ============================================================================
// CATEGORY 10: ESSSTÖRUNGEN LABELS
// ============================================================================

/** EssstoerungKognitivSymptom labels */
export const ESSSTOERUNG_KOGNITIV_LABELS = {
  [FormTypes.EssstoerungKognitivSymptom.AngstVorGewichtszunahme]: 'Angst vor Gewichtszunahme',
  [FormTypes.EssstoerungKognitivSymptom.KoerperbildStoerung]: 'Körperbildstörung',
  [FormTypes.EssstoerungKognitivSymptom.UebermaessigerEinflussGewicht]: 'Übermäßiger Einfluss von Gewicht/Figur auf Selbstwert',
  [FormTypes.EssstoerungKognitivSymptom.StaendigesWiegen]: 'Ständiges Wiegen',
  [FormTypes.EssstoerungKognitivSymptom.KalorienzaehlenObsessiv]: 'Obsessives Kalorienzählen',
  [FormTypes.EssstoerungKognitivSymptom.EssensritualePlanung]: 'Rigide Essensrituale und Planung',
  [FormTypes.EssstoerungKognitivSymptom.VermeidungBestimmterNahrungsmittel]: 'Vermeidung bestimmter Nahrungsmittel',
  [FormTypes.EssstoerungKognitivSymptom.LeugnenDerErkrankung]: 'Leugnen der Erkrankung'
} as const satisfies Record<FormTypes.EssstoerungKognitivSymptom, string>;

/** EssstoerungEmotionalSymptom labels */
export const ESSSTOERUNG_EMOTIONAL_LABELS = {
  [FormTypes.EssstoerungEmotionalSymptom.SchamUeberEssverhalten]: 'Scham über Essverhalten',
  [FormTypes.EssstoerungEmotionalSymptom.SchuldgefuehleNachEssen]: 'Schuldgefühle nach dem Essen',
  [FormTypes.EssstoerungEmotionalSymptom.Stimmungsschwankungen]: 'Stimmungsschwankungen',
  [FormTypes.EssstoerungEmotionalSymptom.AngstzustaendeUmEssen]: 'Angstzustände um das Essen',
  [FormTypes.EssstoerungEmotionalSymptom.Depressivitaet]: 'Depressivität',
  [FormTypes.EssstoerungEmotionalSymptom.GeringesSelbstwertgefuehl]: 'Geringes Selbstwertgefühl',
  [FormTypes.EssstoerungEmotionalSymptom.SozialerRueckzug]: 'Sozialer Rückzug',
  [FormTypes.EssstoerungEmotionalSymptom.Reizbarkeit]: 'Reizbarkeit'
} as const satisfies Record<FormTypes.EssstoerungEmotionalSymptom, string>;

/** GewichtsregulierendeMassnahme labels */
export const GEWICHTSREGULIERENDE_MASSNAHME_LABELS = {
  [FormTypes.GewichtsregulierendeMassnahme.RestriktivesEssverhalten]: 'Restriktives Essverhalten',
  [FormTypes.GewichtsregulierendeMassnahme.Fasten]: 'Fasten',
  [FormTypes.GewichtsregulierendeMassnahme.UebermaessigeKoerperlicheAktivitaet]: 'Übermäßige körperliche Aktivität',
  [FormTypes.GewichtsregulierendeMassnahme.SelbstinduzierteErbrechen]: 'Selbstinduziertes Erbrechen',
  [FormTypes.GewichtsregulierendeMassnahme.MissbrauchLaxantien]: 'Missbrauch von Laxantien',
  [FormTypes.GewichtsregulierendeMassnahme.MissbrauchDiuretika]: 'Missbrauch von Diuretika',
  [FormTypes.GewichtsregulierendeMassnahme.MissbrauchAppetitzuegler]: 'Missbrauch von Appetitzüglern',
  [FormTypes.GewichtsregulierendeMassnahme.EssensmengenKontrolle]: 'Strikte Essensmengen-Kontrolle'
} as const satisfies Record<FormTypes.GewichtsregulierendeMassnahme, string>;

/** AnorexieSpezifischSymptom labels */
export const ANOREXIE_SPEZIFISCH_LABELS = {
  [FormTypes.AnorexieSpezifischSymptom.SignifikanterGewichtsverlust]: 'Signifikanter Gewichtsverlust',
  [FormTypes.AnorexieSpezifischSymptom.Untergewicht]: 'Untergewicht (BMI < 17,5)',
  [FormTypes.AnorexieSpezifischSymptom.Amenorrhoe]: 'Amenorrhoe',
  [FormTypes.AnorexieSpezifischSymptom.KaelteempfindlichkeitLanugo]: 'Kälteempfindlichkeit/Lanugo',
  [FormTypes.AnorexieSpezifischSymptom.Bradykardie]: 'Bradykardie',
  [FormTypes.AnorexieSpezifischSymptom.Hypotonie]: 'Hypotonie',
  [FormTypes.AnorexieSpezifischSymptom.Muedigkeit]: 'Müdigkeit/Schwäche',
  [FormTypes.AnorexieSpezifischSymptom.Haarausfall]: 'Haarausfall'
} as const satisfies Record<FormTypes.AnorexieSpezifischSymptom, string>;

/** BulimieSpezifischSymptom labels */
export const BULIMIE_SPEZIFISCH_LABELS = {
  [FormTypes.BulimieSpezifischSymptom.WiederholteFressattacken]: 'Wiederholte Fressattacken',
  [FormTypes.BulimieSpezifischSymptom.KontrollverlustBeimEssen]: 'Kontrollverlust beim Essen',
  [FormTypes.BulimieSpezifischSymptom.KompensatorischesMassnahmen]: 'Kompensatorische Maßnahmen',
  [FormTypes.BulimieSpezifischSymptom.HaeufigkeitMindestensWoechentlich]: 'Häufigkeit mind. wöchentlich über 3 Monate',
  [FormTypes.BulimieSpezifischSymptom.ZahnerosionKaries]: 'Zahnerosion/Karies',
  [FormTypes.BulimieSpezifischSymptom.SpeicheldruesenschwellungParotis]: 'Speicheldrüsenschwellung (Parotis)',
  [FormTypes.BulimieSpezifischSymptom.Elektrolytstoerungen]: 'Elektrolytstörungen',
  [FormTypes.BulimieSpezifischSymptom.RussellZeichen]: 'Russell-Zeichen (Schwielen an Fingern)'
} as const satisfies Record<FormTypes.BulimieSpezifischSymptom, string>;

/** BingeEatingSpezifischSymptom labels */
export const BINGE_EATING_SPEZIFISCH_LABELS = {
  [FormTypes.BingeEatingSpezifischSymptom.SchnellesEssen]: 'Schnelles Essen',
  [FormTypes.BingeEatingSpezifischSymptom.EssenBisUnangenehmesSaettigungsgefuehl]: 'Essen bis zu unangenehm vollem Gefühl',
  [FormTypes.BingeEatingSpezifischSymptom.GrosseNahrungsmengenOhneHunger]: 'Große Nahrungsmengen ohne Hunger',
  [FormTypes.BingeEatingSpezifischSymptom.AlleinEssenAusScham]: 'Allein essen aus Scham',
  [FormTypes.BingeEatingSpezifischSymptom.EkelSelbstvorwuerfeDepression]: 'Ekel/Selbstvorwürfe/Depression nach Essen',
  [FormTypes.BingeEatingSpezifischSymptom.LeidensdruckDurchEssanfaelle]: 'Deutlicher Leidensdruck durch Essanfälle',
  [FormTypes.BingeEatingSpezifischSymptom.KeineKompensatorischenMassnahmen]: 'Keine kompensatorischen Maßnahmen',
  [FormTypes.BingeEatingSpezifischSymptom.Uebergewicht]: 'Übergewicht'
} as const satisfies Record<FormTypes.BingeEatingSpezifischSymptom, string>;

/** Essstoerungen section labels */
export const ESSSTOERUNGEN_SECTION_LABELS = {
  kognitiveSymptome: 'Kognitive Symptome',
  emotionaleSymptome: 'Emotionale Symptome',
  gewichtsregulierendeMassnahmen: 'Gewichtsregulierende Maßnahmen',
  anorexieSpezifisch: 'Anorexia nervosa spezifisch',
  bulimieSpezifisch: 'Bulimia nervosa spezifisch',
  bingeEatingSpezifisch: 'Binge-Eating-Störung spezifisch',
  andereSymptome: 'Andere Symptome'
} as const satisfies Record<keyof FormTypes.Essstoerungen, string>;

// ============================================================================
// CATEGORY 11: SUBSTANZBEZOGENE SYMPTOMATIK LABELS
// ============================================================================

/** SubstanzAbhaengigkeitSymptom labels */
export const SUBSTANZ_ABHAENGIGKEIT_LABELS = {
  [FormTypes.SubstanzAbhaengigkeitSymptom.Craving]: 'Craving',
  [FormTypes.SubstanzAbhaengigkeitSymptom.KontrollverlustUeberKonsum]: 'Kontrollverlust über Substanzkonsum',
  [FormTypes.SubstanzAbhaengigkeitSymptom.Toleranzentwicklung]: 'Toleranzentwicklung',
  [FormTypes.SubstanzAbhaengigkeitSymptom.FortgesetzterKonsumTrotzKonsequenzen]: 'Fortgesetzter Konsum trotz negativer Konsequenzen',
  [FormTypes.SubstanzAbhaengigkeitSymptom.VernachlaessigungAndererInteressen]: 'Vernachlässigung anderer Interessen und Aktivitäten',
  [FormTypes.SubstanzAbhaengigkeitSymptom.EinengungAufSubstanzbezogenesVerhalten]: 'Einengung auf substanzbezogenes Verhalten'
} as const satisfies Record<FormTypes.SubstanzAbhaengigkeitSymptom, string>;

/** SubstanzSomatovegetativSymptom labels */
export const SUBSTANZ_SOMATOVEGETATIV_LABELS = {
  [FormTypes.SubstanzSomatovegetativSymptom.Atembeschwerden]: 'Atembeschwerden',
  [FormTypes.SubstanzSomatovegetativSymptom.Atemnot]: 'Atemnot',
  [FormTypes.SubstanzSomatovegetativSymptom.Tremor]: 'Tremor',
  [FormTypes.SubstanzSomatovegetativSymptom.Schwitzen]: 'Schwitzen',
  [FormTypes.SubstanzSomatovegetativSymptom.Schweissausbrueche]: 'Schweißausbrüche',
  [FormTypes.SubstanzSomatovegetativSymptom.Kaelteschauer]: 'Kälteschauer',
  [FormTypes.SubstanzSomatovegetativSymptom.Piloarreaktion]: 'Piloarreaktion',
  [FormTypes.SubstanzSomatovegetativSymptom.WiederholteSchauer]: 'Wiederholte Schauer',
  [FormTypes.SubstanzSomatovegetativSymptom.Schwindel]: 'Schwindel',
  [FormTypes.SubstanzSomatovegetativSymptom.Uebelkeit]: 'Übelkeit',
  [FormTypes.SubstanzSomatovegetativSymptom.Erbrechen]: 'Erbrechen',
  [FormTypes.SubstanzSomatovegetativSymptom.Durchfall]: 'Durchfall',
  [FormTypes.SubstanzSomatovegetativSymptom.KrampfartigeBauchschmerzen]: 'Krampfartige Bauchschmerzen',
  [FormTypes.SubstanzSomatovegetativSymptom.Gewichtsverlust]: 'Gewichtsverlust',
  [FormTypes.SubstanzSomatovegetativSymptom.Appetitsteigerung]: 'Appetitsteigerung',
  [FormTypes.SubstanzSomatovegetativSymptom.Appetitminderung]: 'Appetitminderung',
  [FormTypes.SubstanzSomatovegetativSymptom.Tachykardie]: 'Tachykardie',
  [FormTypes.SubstanzSomatovegetativSymptom.Bradykardie]: 'Bradykardie',
  [FormTypes.SubstanzSomatovegetativSymptom.KardialeArrhythmie]: 'Kardiale Arrhythmie',
  [FormTypes.SubstanzSomatovegetativSymptom.Hypertonie]: 'Hypertonie',
  [FormTypes.SubstanzSomatovegetativSymptom.Herzpalpitationen]: 'Herzpalpitationen',
  [FormTypes.SubstanzSomatovegetativSymptom.Gesichtsroete]: 'Gesichtsröte',
  [FormTypes.SubstanzSomatovegetativSymptom.GeroeteteHaut]: 'Gerötete Haut',
  [FormTypes.SubstanzSomatovegetativSymptom.Blaesse]: 'Blässe',
  [FormTypes.SubstanzSomatovegetativSymptom.Hautausschlag]: 'Hautausschlag',
  [FormTypes.SubstanzSomatovegetativSymptom.Pupillenerweiterung]: 'Pupillenerweiterung',
  [FormTypes.SubstanzSomatovegetativSymptom.Traenenfluss]: 'Tränenfluss',
  [FormTypes.SubstanzSomatovegetativSymptom.Muskelschwaeche]: 'Muskelschwäche',
  [FormTypes.SubstanzSomatovegetativSymptom.Muskelschmerzen]: 'Muskelschmerzen',
  [FormTypes.SubstanzSomatovegetativSymptom.Muskelkraempfe]: 'Muskelkrämpfe',
  [FormTypes.SubstanzSomatovegetativSymptom.SchmerzenInDerBrust]: 'Schmerzen in der Brust',
  [FormTypes.SubstanzSomatovegetativSymptom.Kopfschmerzen]: 'Kopfschmerzen'
} as const satisfies Record<FormTypes.SubstanzSomatovegetativSymptom, string>;

/** SubstanzPsychomotorikSymptom labels */
export const SUBSTANZ_PSYCHOMOTORIK_LABELS = {
  [FormTypes.SubstanzPsychomotorikSymptom.Hyperaktivitaet]: 'Hyperaktivität',
  [FormTypes.SubstanzPsychomotorikSymptom.PsychomotorischeUnruhe]: 'Psychomotorische Unruhe',
  [FormTypes.SubstanzPsychomotorikSymptom.PsychomotorischeVerlangsamung]: 'Psychomotorische Verlangsamung',
  [FormTypes.SubstanzPsychomotorikSymptom.Gangunsicherheit]: 'Gangunsicherheit',
  [FormTypes.SubstanzPsychomotorikSymptom.Standunsicherheit]: 'Standunsicherheit'
} as const satisfies Record<FormTypes.SubstanzPsychomotorikSymptom, string>;

/** SubstanzVerhaltenSymptom labels */
export const SUBSTANZ_VERHALTEN_LABELS = {
  [FormTypes.SubstanzVerhaltenSymptom.Enthemmung]: 'Enthemmung',
  [FormTypes.SubstanzVerhaltenSymptom.Distanzminderung]: 'Distanzminderung',
  [FormTypes.SubstanzVerhaltenSymptom.Streitlust]: 'Streitlust',
  [FormTypes.SubstanzVerhaltenSymptom.Aggressivitaet]: 'Aggressivität',
  [FormTypes.SubstanzVerhaltenSymptom.BeleidigendesVerhalten]: 'Beleidigendes Verhalten',
  [FormTypes.SubstanzVerhaltenSymptom.Apathie]: 'Apathie',
  [FormTypes.SubstanzVerhaltenSymptom.Sedierung]: 'Sedierung',
  [FormTypes.SubstanzVerhaltenSymptom.Lethargie]: 'Lethargie',
  [FormTypes.SubstanzVerhaltenSymptom.BeeintraechtigungLeistungsfaehigkeit]: 'Beeinträchtigung der persönlichen Leistungsfähigkeit',
  [FormTypes.SubstanzVerhaltenSymptom.BeeintraechtigungReaktionszeit]: 'Beeinträchtigung der Reaktionszeit',
  [FormTypes.SubstanzVerhaltenSymptom.RepetitivesStereotypesVerhalten]: 'Repetitives, stereotypes Verhalten',
  [FormTypes.SubstanzVerhaltenSymptom.Impulshandlungen]: 'Impulshandlungen'
} as const satisfies Record<FormTypes.SubstanzVerhaltenSymptom, string>;

/** SubstanzEmotionalSymptom labels */
export const SUBSTANZ_EMOTIONAL_LABELS = {
  [FormTypes.SubstanzEmotionalSymptom.Affektlabilitaet]: 'Affektlabilität',
  [FormTypes.SubstanzEmotionalSymptom.Reizbarkeit]: 'Reizbarkeit',
  [FormTypes.SubstanzEmotionalSymptom.Ruhelosigkeit]: 'Ruhelosigkeit',
  [FormTypes.SubstanzEmotionalSymptom.Euphorie]: 'Euphorie',
  [FormTypes.SubstanzEmotionalSymptom.Angst]: 'Angst',
  [FormTypes.SubstanzEmotionalSymptom.Agitiertheit]: 'Agitiertheit',
  [FormTypes.SubstanzEmotionalSymptom.Misstrauen]: 'Misstrauen',
  [FormTypes.SubstanzEmotionalSymptom.DysphorischeStimmung]: 'Dysphorische Stimmung',
  [FormTypes.SubstanzEmotionalSymptom.Traurigkeit]: 'Traurigkeit',
  [FormTypes.SubstanzEmotionalSymptom.Anhedonie]: 'Anhedonie'
} as const satisfies Record<FormTypes.SubstanzEmotionalSymptom, string>;

/** SubstanzSchlafSymptom labels */
export const SUBSTANZ_SCHLAF_LABELS = {
  [FormTypes.SubstanzSchlafSymptom.Einschlafstoerungen]: 'Einschlafstörungen',
  [FormTypes.SubstanzSchlafSymptom.Durchschlafstoerungen]: 'Durchschlafstörungen',
  [FormTypes.SubstanzSchlafSymptom.Insomnie]: 'Insomnie',
  [FormTypes.SubstanzSchlafSymptom.Hypersomnie]: 'Hypersomnie',
  [FormTypes.SubstanzSchlafSymptom.BizarreTraeume]: 'Bizarre Träume',
  [FormTypes.SubstanzSchlafSymptom.UnruhigerSchlaf]: 'Unruhiger Schlaf'
} as const satisfies Record<FormTypes.SubstanzSchlafSymptom, string>;

/** SubstanzNeurologischSymptom labels */
export const SUBSTANZ_NEUROLOGISCH_LABELS = {
  [FormTypes.SubstanzNeurologischSymptom.Krampfanfaelle]: 'Krampfanfälle',
  [FormTypes.SubstanzNeurologischSymptom.TonischKlonischeAnfaelle]: 'Tonisch-klonische Anfälle (Grand-mal-Anfälle)',
  [FormTypes.SubstanzNeurologischSymptom.Bewusstseinstoerungen]: 'Bewusstseinsstörungen',
  [FormTypes.SubstanzNeurologischSymptom.Nystagmus]: 'Nystagmus'
} as const satisfies Record<FormTypes.SubstanzNeurologischSymptom, string>;

/** SubstanzKognitivSymptom labels */
export const SUBSTANZ_KOGNITIV_LABELS = {
  [FormTypes.SubstanzKognitivSymptom.AnterogradeAmnesie]: 'Anterograde Amnesie',
  [FormTypes.SubstanzKognitivSymptom.Wahrnehmungsstoerung]: 'Wahrnehmungsstörung',
  [FormTypes.SubstanzKognitivSymptom.Gedaechtnisstoerung]: 'Gedächtnisstörung',
  [FormTypes.SubstanzKognitivSymptom.Aufmerksamkeitsstoerung]: 'Aufmerksamkeitsstörung',
  [FormTypes.SubstanzKognitivSymptom.ErhoehtVigilanz]: 'Erhöhte Vigilanz',
  [FormTypes.SubstanzKognitivSymptom.BeeintraechtigungUrteilsfaehigkeit]: 'Beeinträchtigung der Urteilsfähigkeit',
  [FormTypes.SubstanzKognitivSymptom.BeeintraechtigungEntscheidungsfaehigkeit]: 'Beeinträchtigung der Entscheidungsfähigkeit',
  [FormTypes.SubstanzKognitivSymptom.VerwaschenesSprechen]: 'Verwaschene Sprache',
  [FormTypes.SubstanzKognitivSymptom.VerlangsamtesZeiterleben]: 'Verlangsamtes Zeiterleben'
} as const satisfies Record<FormTypes.SubstanzKognitivSymptom, string>;

/** SubstanzPsychotischSymptom labels */
export const SUBSTANZ_PSYCHOTISCH_LABELS = {
  [FormTypes.SubstanzPsychotischSymptom.Verwirrtheit]: 'Verwirrtheit',
  [FormTypes.SubstanzPsychotischSymptom.ParanoideVorstellungen]: 'Paranoide Vorstellungen',
  [FormTypes.SubstanzPsychotischSymptom.GrandioseUeberzeugungen]: 'Grandiose Überzeugungen oder Aktionen',
  [FormTypes.SubstanzPsychotischSymptom.Beziehungsideen]: 'Beziehungsideen',
  [FormTypes.SubstanzPsychotischSymptom.AkustischeHalluzinationen]: 'Akustische Halluzinationen',
  [FormTypes.SubstanzPsychotischSymptom.OptischeHalluzinationen]: 'Optische Halluzinationen',
  [FormTypes.SubstanzPsychotischSymptom.TaktileHalluzinationen]: 'Taktile Halluzinationen',
  [FormTypes.SubstanzPsychotischSymptom.DeliriumTremens]: 'Delirium tremens'
} as const satisfies Record<FormTypes.SubstanzPsychotischSymptom, string>;

/** SubstanzDissociativSymptom labels */
export const SUBSTANZ_DISSOCIATIV_LABELS = {
  [FormTypes.SubstanzDissociativSymptom.Depersonalisation]: 'Depersonalisation',
  [FormTypes.SubstanzDissociativSymptom.Derealisation]: 'Derealisation'
} as const satisfies Record<FormTypes.SubstanzDissociativSymptom, string>;

/** SubstanzbezogeneSymptomatik section labels */
export const SUBSTANZBEZOGENE_SECTION_LABELS = {
  abhaengigkeit: 'Abhängigkeitssymptome',
  somatovegetativ: 'Somatovegetative Symptome',
  psychomotorik: 'Psychomotorik',
  verhalten: 'Verhalten',
  emotionalesErleben: 'Emotionales Erleben',
  schlaf: 'Schlaf',
  neurologisch: 'Neurologische Symptome',
  kognition: 'Kognition',
  psychotisch: 'Psychotische Symptome',
  dissociativ: 'Dissoziative Symptome',
  andereSymptome: 'Andere Symptome'
} as const satisfies Record<keyof FormTypes.SubstanzbezogeneSymptomatik, string>;

// ============================================================================
// CATEGORY 12: DISSOZIATIVE SYMPTOMATIK LABELS
// ============================================================================

/** DissociativeAmnesieSymptom labels */
export const DISSOCIATIVE_AMNESIE_LABELS = {
  [FormTypes.DissociativeAmnesieSymptom.GedaechtnisverlusrBelastend]: 'Gedächtnisverlust von belastenden Ereignissen',
  [FormTypes.DissociativeAmnesieSymptom.GeneralisierteAmnesie]: 'Generalisierte Amnesie',
  [FormTypes.DissociativeAmnesieSymptom.SelektiveAmnesie]: 'Selektive Amnesie'
} as const satisfies Record<FormTypes.DissociativeAmnesieSymptom, string>;

/** DissociativeFugueSymptom labels */
export const DISSOCIATIVE_FUGUE_LABELS = {
  [FormTypes.DissociativeFugueSymptom.DissociativeFugue]: 'Dissoziative Fugue'
} as const satisfies Record<FormTypes.DissociativeFugueSymptom, string>;

/** DissociativerStuporSymptom labels */
export const DISSOCIATIVER_STUPOR_LABELS = {
  [FormTypes.DissociativerStuporSymptom.VerringerungBewegungenReaktionen]: 'Verringerung oder Fehlen von willkürlichen Bewegungen und Reaktionen',
  [FormTypes.DissociativerStuporSymptom.PsychogenerStupor]: 'Psychogener Stupor nach belastenden Ereignissen'
} as const satisfies Record<FormTypes.DissociativerStuporSymptom, string>;

/** DissociativeBewegungsstoerungSymptom labels */
export const DISSOCIATIVE_BEWEGUNGSSTOERUNG_LABELS = {
  [FormTypes.DissociativeBewegungsstoerungSymptom.VerlustBewegungsfaehigkeit]: 'Verlust der Bewegungsfähigkeit eines oder mehrerer Körperglieder',
  [FormTypes.DissociativeBewegungsstoerungSymptom.PsychogeneLaehmungen]: 'Psychogene Lähmungen',
  [FormTypes.DissociativeBewegungsstoerungSymptom.Gangstoerungen]: 'Gangstörungen',
  [FormTypes.DissociativeBewegungsstoerungSymptom.Ataxie]: 'Ataxie',
  [FormTypes.DissociativeBewegungsstoerungSymptom.Astasie]: 'Astasie',
  [FormTypes.DissociativeBewegungsstoerungSymptom.Abasie]: 'Abasie',
  [FormTypes.DissociativeBewegungsstoerungSymptom.Tremor]: 'Tremor',
  [FormTypes.DissociativeBewegungsstoerungSymptom.Zittern]: 'Zittern',
  [FormTypes.DissociativeBewegungsstoerungSymptom.UnfaehigkeitZuStehen]: 'Unfähigkeit zu stehen'
} as const satisfies Record<FormTypes.DissociativeBewegungsstoerungSymptom, string>;

/** DissociativeKrampfanfaelleSymptom labels */
export const DISSOCIATIVE_KRAMPFANFAELLE_LABELS = {
  [FormTypes.DissociativeKrampfanfaelleSymptom.AehnlichkeitEpileptisch]: 'Starke Ähnlichkeit zu epileptischen Anfällen',
  [FormTypes.DissociativeKrampfanfaelleSymptom.KeinZungenbissVerletzung]: 'Kein Zungenbiss, Verletzungen beim Sturz oder Urininkontinenz',
  [FormTypes.DissociativeKrampfanfaelleSymptom.KeinBewusstseinsverlust]: 'Kein Bewusstseinsverlust',
  [FormTypes.DissociativeKrampfanfaelleSymptom.StuporTrancezustand]: 'Stupor- oder tranceähnlicher Zustand'
} as const satisfies Record<FormTypes.DissociativeKrampfanfaelleSymptom, string>;

/** DissociativeSensibilitaetsstoerungSymptom labels */
export const DISSOCIATIVE_SENSIBILITAET_LABELS = {
  [FormTypes.DissociativeSensibilitaetsstoerungSymptom.SensibilitaetsEmpfindungsstoerungen]: 'Dissoziative Sensibilitäts- und Empfindungsstörungen',
  [FormTypes.DissociativeSensibilitaetsstoerungSymptom.PsychogeneSehstoerungen]: 'Psychogene Sehstörungen',
  [FormTypes.DissociativeSensibilitaetsstoerungSymptom.PsychogeneTaubheit]: 'Psychogene Taubheit',
  [FormTypes.DissociativeSensibilitaetsstoerungSymptom.PsychogeneHoerstoerungen]: 'Psychogene Hörstörungen',
  [FormTypes.DissociativeSensibilitaetsstoerungSymptom.PsychogenerGeruchsverlust]: 'Psychogener Geruchsverlust (Anosmie)'
} as const satisfies Record<FormTypes.DissociativeSensibilitaetsstoerungSymptom, string>;

/** DissociativeIdentitaetsstoerungSymptom labels */
export const DISSOCIATIVE_IDENTITAET_LABELS = {
  [FormTypes.DissociativeIdentitaetsstoerungSymptom.DissociativeIdentitaetsstoerung]: 'Dissoziative Identitätsstörung'
} as const satisfies Record<FormTypes.DissociativeIdentitaetsstoerungSymptom, string>;

/** DepersonalisationDerealisationSymptom labels */
export const DEPERSONALISATION_DEREALISATION_LABELS = {
  [FormTypes.DepersonalisationDerealisationSymptom.Depersonalisationserfahrungen]: 'Depersonalisationserfahrungen',
  [FormTypes.DepersonalisationDerealisationSymptom.Derealisationserfahrungen]: 'Derealisationserfahrungen',
  [FormTypes.DepersonalisationDerealisationSymptom.Entfremdungsgefuehle]: 'Entfremdungsgefühle',
  [FormTypes.DepersonalisationDerealisationSymptom.GefuehlDerEntfremdung]: 'Gefühl der Entfremdung',
  [FormTypes.DepersonalisationDerealisationSymptom.GefuehlDerUnwirklichkeit]: 'Gefühl der Unwirklichkeit',
  [FormTypes.DepersonalisationDerealisationSymptom.GefuehlAlsAussenstehender]: 'Gefühl als Außenstehender',
  [FormTypes.DepersonalisationDerealisationSymptom.EmotionaleTaubheit]: 'Emotionale Taubheit'
} as const satisfies Record<FormTypes.DepersonalisationDerealisationSymptom, string>;

/** DissociativeSymptomatik section labels */
export const DISSOCIATIVE_SECTION_LABELS = {
  amnesie: 'Dissoziative Amnesie',
  fugue: 'Dissoziative Fugue',
  stupor: 'Dissoziativer Stupor',
  bewegungsstoerungen: 'Dissoziative Bewegungsstörungen',
  krampfanfaelle: 'Dissoziative Krampfanfälle',
  sensibilitaetsstoerungen: 'Dissoziative Sensibilitätsstörungen',
  identitaetsstoerung: 'Dissoziative Identitätsstörung',
  depersonalisationDerealisation: 'Depersonalisation und Derealisation',
  andereSymptome: 'Andere Symptome'
} as const satisfies Record<keyof FormTypes.DissociativeSymptomatik, string>;

// ============================================================================
// CATEGORY 13: PERSÖNLICHKEITSSTÖRUNGEN LABELS
// ============================================================================

/** Paranoide Persönlichkeitsstörung labels */
export const PARANOIDE_PS_LABELS = {
  [FormTypes.ParanoidePSSymptom.UebertriebeneEmpfindlichkeit]: 'Übertriebene Empfindlichkeit bei Rückschlägen',
  [FormTypes.ParanoidePSSymptom.Nachtragen]: 'Dauerhaftes Nachtragen von Kränkungen',
  [FormTypes.ParanoidePSSymptom.Misstrauen]: 'Misstrauen und Tendenz, Erlebtes zu verdrehen',
  [FormTypes.ParanoidePSSymptom.Beharren]: 'Beharren auf eigenen Rechten',
  [FormTypes.ParanoidePSSymptom.Streitbarkeit]: 'Streitsucht und Beharrlichkeit',
  [FormTypes.ParanoidePSSymptom.Eifersucht]: 'Übertriebene Eifersucht',
  [FormTypes.ParanoidePSSymptom.Verschwoerungsdenken]: 'Verschwörungsdenken',
  [FormTypes.ParanoidePSSymptom.Selbstbezogenheit]: 'Übertriebene Selbstbezogenheit'
} as const satisfies Record<FormTypes.ParanoidePSSymptom, string>;

/** Schizoide Persönlichkeitsstörung labels */
export const SCHIZOIDE_PS_LABELS = {
  [FormTypes.SchizoidePSSymptom.WenigeAktivitaetenFreude]: 'Wenige Aktivitäten bereiten Freude',
  [FormTypes.SchizoidePSSymptom.EmotionaleKuehle]: 'Emotionale Kühle und Distanziertheit',
  [FormTypes.SchizoidePSSymptom.BegrenzteWaerme]: 'Begrenzte Fähigkeit, Wärme zu zeigen',
  [FormTypes.SchizoidePSSymptom.GleichgueltigkeitLobKritik]: 'Gleichgültigkeit gegenüber Lob und Kritik',
  [FormTypes.SchizoidePSSymptom.WenigInteresseSex]: 'Wenig Interesse an sexuellen Erfahrungen',
  [FormTypes.SchizoidePSSymptom.EinzelneTaetigkeiten]: 'Bevorzugung einzelner Tätigkeiten',
  [FormTypes.SchizoidePSSymptom.PhantasieUndIntrospektion]: 'Übermäßige Beschäftigung mit Phantasie',
  [FormTypes.SchizoidePSSymptom.KeineEngenFreunde]: 'Keine engen Freunde oder Vertrauenspersonen',
  [FormTypes.SchizoidePSSymptom.UnempfindlichkeitNormen]: 'Unempfindlichkeit gegenüber sozialen Normen'
} as const satisfies Record<FormTypes.SchizoidePSSymptom, string>;

/** Schizotype Persönlichkeitsstörung labels */
export const SCHIZOTYPE_PS_LABELS = {
  [FormTypes.SchizotypePSSymptom.UnangemessenerAffekt]: 'Unangemessener oder eingeschränkter Affekt',
  [FormTypes.SchizotypePSSymptom.SeltsamEigentuerlich]: 'Seltsames oder eigentümliches Verhalten',
  [FormTypes.SchizotypePSSymptom.SozialerRueckzug]: 'Sozialer Rückzug',
  [FormTypes.SchizotypePSSymptom.MagischesDenken]: 'Magisches Denken',
  [FormTypes.SchizotypePSSymptom.Misstrauen]: 'Misstrauen oder paranoide Ideen',
  [FormTypes.SchizotypePSSymptom.Beziehungsideen]: 'Beziehungsideen',
  [FormTypes.SchizotypePSSymptom.KoerperlicheIllusionen]: 'Körperliche Illusionen',
  [FormTypes.SchizotypePSSymptom.VagesUmstaendlichesDenken]: 'Vages, umständliches Denken',
  [FormTypes.SchizotypePSSymptom.GelegentlichPsychotischeEpisoden]: 'Gelegentlich psychotische Episoden'
} as const satisfies Record<FormTypes.SchizotypePSSymptom, string>;

/** Antisoziale Persönlichkeitsstörung labels */
export const ANTISOZIALE_PS_LABELS = {
  [FormTypes.AntisozialePSSymptom.GleichgueltigkeitGefuehleAnderer]: 'Gleichgültigkeit gegenüber Gefühlen anderer',
  [FormTypes.AntisozialePSSymptom.VerantwortungslosigkeitNormen]: 'Grobe Verantwortungslosigkeit gegenüber Normen',
  [FormTypes.AntisozialePSSymptom.UnfaehigkeitBeziehungen]: 'Unfähigkeit zur Aufrechterhaltung von Beziehungen',
  [FormTypes.AntisozialePSSymptom.NiedrigeFrustrationstoleranz]: 'Niedrige Frustrationstoleranz und Aggressivität',
  [FormTypes.AntisozialePSSymptom.SchuldzuweisungAndere]: 'Schuldzuweisung an andere',
  [FormTypes.AntisozialePSSymptom.KeinSchuldgefuehl]: 'Fehlendes Schuldbewusstsein',
  [FormTypes.AntisozialePSSymptom.LeichteReizbarkeit]: 'Leichte Reizbarkeit',
  [FormTypes.AntisozialePSSymptom.AnhaltendeAggressivitaet]: 'Anhaltende Aggressivität',
  [FormTypes.AntisozialePSSymptom.Betrugsverhalten]: 'Betrugs- und Täuschungsverhalten'
} as const satisfies Record<FormTypes.AntisozialePSSymptom, string>;

/** Impulsiver Typ labels */
export const IMPULSIVER_TYP_LABELS = {
  [FormTypes.ImpulsiverTypSymptom.UnvorhersehbaresHandeln]: 'Unvorhersehbares Handeln ohne Konsequenzbedenken',
  [FormTypes.ImpulsiverTypSymptom.Streitsucht]: 'Streitsucht mit schneller Eskalation',
  [FormTypes.ImpulsiverTypSymptom.Wutausbrueche]: 'Wutausbrüche mit Gewalttätigkeit',
  [FormTypes.ImpulsiverTypSymptom.UnfaehigkeitDurchhalten]: 'Unfähigkeit, Handlungen durchzuhalten',
  [FormTypes.ImpulsiverTypSymptom.UnsteteStimmung]: 'Unstete und launenhafte Stimmung'
} as const satisfies Record<FormTypes.ImpulsiverTypSymptom, string>;

/** Borderline Persönlichkeitsstörung labels */
export const BORDERLINE_PS_LABELS = {
  [FormTypes.BorderlinePSSymptom.StoerungSelbstbild]: 'Störung des Selbstbilds und der Ziele',
  [FormTypes.BorderlinePSSymptom.ChronischeLeeregefuehle]: 'Chronische Leeregefühle',
  [FormTypes.BorderlinePSSymptom.IntensiveBeziehungen]: 'Intensive, aber instabile Beziehungen',
  [FormTypes.BorderlinePSSymptom.VermeidungVerlassenwerden]: 'Verzweifelte Bemühungen, Verlassenwerden zu vermeiden',
  [FormTypes.BorderlinePSSymptom.Selbstverletzung]: 'Selbstverletzendes Verhalten',
  [FormTypes.BorderlinePSSymptom.SuizidaleHandlungen]: 'Suizidale Handlungen oder Drohungen',
  [FormTypes.BorderlinePSSymptom.AffektiveInstabilitaet]: 'Affektive Instabilität',
  [FormTypes.BorderlinePSSymptom.IntensiveWut]: 'Intensive Wut und Schwierigkeiten bei der Kontrolle',
  [FormTypes.BorderlinePSSymptom.Impulsivitaet]: 'Impulsivität in potenziell schädlichen Bereichen',
  [FormTypes.BorderlinePSSymptom.StressbedingteDissoziation]: 'Stressbedingte Dissoziation',
  [FormTypes.BorderlinePSSymptom.ParanoideVorstellungen]: 'Vorübergehende paranoide Vorstellungen',
  [FormTypes.BorderlinePSSymptom.Identitaetsstoerung]: 'Ausgeprägte Identitätsstörung'
} as const satisfies Record<FormTypes.BorderlinePSSymptom, string>;

/** Histrionische Persönlichkeitsstörung labels */
export const HISTRIONISCHE_PS_LABELS = {
  [FormTypes.HistrionischePSSymptom.Dramatisierung]: 'Dramatisierung und Theatralik',
  [FormTypes.HistrionischePSSymptom.Suggestibilitaet]: 'Erhöhte Suggestibilität',
  [FormTypes.HistrionischePSSymptom.OberflachlicherAffekt]: 'Oberflächlicher und labiler Affekt',
  [FormTypes.HistrionischePSSymptom.Aufmerksamkeitssuche]: 'Dauernde Aufmerksamkeitssuche',
  [FormTypes.HistrionischePSSymptom.VerfuehrerischesVerhalten]: 'Verführerisches Verhalten',
  [FormTypes.HistrionischePSSymptom.UebermaeessigeAttraktivitaet]: 'Übermäßige Beschäftigung mit Attraktivität',
  [FormTypes.HistrionischePSSymptom.Egozentrik]: 'Egozentrik und Selbstbezogenheit',
  [FormTypes.HistrionischePSSymptom.LeichtVerletzbar]: 'Leicht verletzbar und kränkbar'
} as const satisfies Record<FormTypes.HistrionischePSSymptom, string>;

/** Narzisstische Persönlichkeitsstörung labels */
export const NARZISSTISCHE_PS_LABELS = {
  [FormTypes.NarzisstischePSSymptom.Groessenideen]: 'Größenideen und übertriebenes Selbstwertgefühl',
  [FormTypes.NarzisstischePSSymptom.ErfolgPhantasien]: 'Phantasien von grenzenlosem Erfolg',
  [FormTypes.NarzisstischePSSymptom.EinzigartigUndBesonders]: 'Überzeugung, einzigartig zu sein',
  [FormTypes.NarzisstischePSSymptom.UebermaessigeBewunderung]: 'Bedürfnis nach übermäßiger Bewunderung',
  [FormTypes.NarzisstischePSSymptom.Anspruchshaltung]: 'Übertriebene Anspruchshaltung',
  [FormTypes.NarzisstischePSSymptom.AusnuetzenBeziehungen]: 'Ausnutzen von Beziehungen',
  [FormTypes.NarzisstischePSSymptom.MangelEmpathie]: 'Mangel an Empathie',
  [FormTypes.NarzisstischePSSymptom.Neid]: 'Neid auf andere oder Überzeugung, beneidet zu werden',
  [FormTypes.NarzisstischePSSymptom.ArrogantesVerhalten]: 'Arrogantes Verhalten'
} as const satisfies Record<FormTypes.NarzisstischePSSymptom, string>;

/** Vermeidend-selbstunsichere Persönlichkeitsstörung labels */
export const VERMEIDEND_PS_LABELS = {
  [FormTypes.VermeidendPSSymptom.SpannungUndFurcht]: 'Anhaltendes Gefühl von Spannung und Furcht',
  [FormTypes.VermeidendPSSymptom.Unterlegenheitsgefuehle]: 'Überzeugung von Unterlegenheit',
  [FormTypes.VermeidendPSSymptom.FurchtKritik]: 'Übermäßige Furcht vor Kritik und Ablehnung',
  [FormTypes.VermeidendPSSymptom.KeinEngagement]: 'Kein Engagement ohne Akzeptanzgarantie',
  [FormTypes.VermeidendPSSymptom.EingeschraenktesLeben]: 'Eingeschränktes Leben wegen Sicherheitsbedürfnis',
  [FormTypes.VermeidendPSSymptom.VermeidungBeruflich]: 'Vermeidung beruflicher Aktivitäten mit Kontakt',
  [FormTypes.VermeidendPSSymptom.VermeidungSozial]: 'Vermeidung sozialer Aktivitäten'
} as const satisfies Record<FormTypes.VermeidendPSSymptom, string>;

/** Dependente Persönlichkeitsstörung labels */
export const DEPENDENTE_PS_LABELS = {
  [FormTypes.DependentePSSymptom.UeberlassenEntscheidungen]: 'Überlassen von Entscheidungen an andere',
  [FormTypes.DependentePSSymptom.UnterordnungBeduerfnisse]: 'Unterordnung eigener Bedürfnisse',
  [FormTypes.DependentePSSymptom.WiderstandUnmoeglich]: 'Unfähigkeit zu Widerstand gegen andere',
  [FormTypes.DependentePSSymptom.AlleinHilflos]: 'Gefühl der Hilflosigkeit beim Alleinsein',
  [FormTypes.DependentePSSymptom.Verlassenwerdenangst]: 'Angst vor dem Verlassenwerden',
  [FormTypes.DependentePSSymptom.BenoetigtVielRat]: 'Benötigt viel Rat und Bestätigung',
  [FormTypes.DependentePSSymptom.UnwohlseinAlleinsein]: 'Unwohlsein und Hilflosigkeit beim Alleinsein',
  [FormTypes.DependentePSSymptom.SchnelleNeueBeziehung]: 'Sucht schnell neue Beziehung nach Ende'
} as const satisfies Record<FormTypes.DependentePSSymptom, string>;

/** Zwanghafte Persönlichkeitsstörung labels */
export const ZWANGHAFTE_PS_LABELS = {
  [FormTypes.ZwanghaftePSSymptom.UebermaessigeZweifel]: 'Übermäßige Zweifel und Vorsicht',
  [FormTypes.ZwanghaftePSSymptom.Perfektionismus]: 'Perfektionismus, der Aufgaben behindert',
  [FormTypes.ZwanghaftePSSymptom.UebergewissenhaftPedanterie]: 'Übergewissenhaftigkeit und Pedanterie',
  [FormTypes.ZwanghaftePSSymptom.UebermaessigeLeistung]: 'Übermäßige Leistungsorientierung',
  [FormTypes.ZwanghaftePSSymptom.UebertriebeneGenauigkeit]: 'Übertriebene Genauigkeit bei Details',
  [FormTypes.ZwanghaftePSSymptom.Rigidität]: 'Rigidität und Sturheit',
  [FormTypes.ZwanghaftePSSymptom.UnfaehigkeitDelegieren]: 'Unfähigkeit zu delegieren',
  [FormTypes.ZwanghaftePSSymptom.Hartnäckigkeit]: 'Hartnäckiges Beharren auf Regeln'
} as const satisfies Record<FormTypes.ZwanghaftePSSymptom, string>;

/** Passiv-aggressive Persönlichkeitsstörung labels */
export const PASSIV_AGGRESSIV_PS_LABELS = {
  [FormTypes.PassivAggressivePSSymptom.PassiverWiderstand]: 'Passiver Widerstand gegen Anforderungen',
  [FormTypes.PassivAggressivePSSymptom.Aufschieben]: 'Aufschieben und Verzögern',
  [FormTypes.PassivAggressivePSSymptom.AbsichtlichesFehler]: 'Absichtliche Ineffizienz und Fehler',
  [FormTypes.PassivAggressivePSSymptom.Vergesslichkeit]: '"Vergessen" von Verpflichtungen',
  [FormTypes.PassivAggressivePSSymptom.Trotzverhalten]: 'Trotziges und widerspenstiges Verhalten',
  [FormTypes.PassivAggressivePSSymptom.GrollGegenAutoritaet]: 'Groll gegen Autoritätspersonen',
  [FormTypes.PassivAggressivePSSymptom.NeidAufErfolgreiche]: 'Neid und Missgunst gegenüber Erfolgreicheren'
} as const satisfies Record<FormTypes.PassivAggressivePSSymptom, string>;

/** Andauernde Persönlichkeitsänderung nach Extrembelastung labels */
export const AENDERUNG_EXTREMBELASTUNG_LABELS = {
  [FormTypes.PersoenlichkeitsaenderungExtrembelastungSymptom.FeindlicheMisstrauischeHaltung]: 'Feindliche und misstrauische Haltung',
  [FormTypes.PersoenlichkeitsaenderungExtrembelastungSymptom.SozialerRueckzug]: 'Sozialer Rückzug',
  [FormTypes.PersoenlichkeitsaenderungExtrembelastungSymptom.Leeregefuehl]: 'Chronisches Leeregefühl',
  [FormTypes.PersoenlichkeitsaenderungExtrembelastungSymptom.ChronischeNervositaet]: 'Chronische Nervosität und Anspannung',
  [FormTypes.PersoenlichkeitsaenderungExtrembelastungSymptom.Entfremdungsgefuehl]: 'Entfremdungsgefühl',
  [FormTypes.PersoenlichkeitsaenderungExtrembelastungSymptom.DauerndeBedrohung]: 'Gefühl dauernder Bedrohung',
  [FormTypes.PersoenlichkeitsaenderungExtrembelastungSymptom.Hoffnungslosigkeit]: 'Hoffnungslosigkeit'
} as const satisfies Record<FormTypes.PersoenlichkeitsaenderungExtrembelastungSymptom, string>;

/** Andauernde Persönlichkeitsänderung nach psychischer Krankheit labels */
export const AENDERUNG_PSYCH_KRANKHEIT_LABELS = {
  [FormTypes.PersoenlichkeitsaenderungPsychKrankheitSymptom.AbhaengigkeitVonAnderen]: 'Abhängigkeit von anderen',
  [FormTypes.PersoenlichkeitsaenderungPsychKrankheitSymptom.VermindertesInteresse]: 'Vermindertes Interesse',
  [FormTypes.PersoenlichkeitsaenderungPsychKrankheitSymptom.SozialeIsolation]: 'Soziale Isolation',
  [FormTypes.PersoenlichkeitsaenderungPsychKrankheitSymptom.Passivitaet]: 'Passivität',
  [FormTypes.PersoenlichkeitsaenderungPsychKrankheitSymptom.VeraenderteStimmung]: 'Veränderte Stimmung',
  [FormTypes.PersoenlichkeitsaenderungPsychKrankheitSymptom.LeistungsminderungBeruflich]: 'Leistungsminderung im Beruf'
} as const satisfies Record<FormTypes.PersoenlichkeitsaenderungPsychKrankheitSymptom, string>;

/** Persoenlichkeitsstoerungen section labels */
export const PERSOENLICHKEITSSTOERUNGEN_SECTION_LABELS = {
  paranoide: 'Paranoide Persönlichkeitsstörung',
  schizoide: 'Schizoide Persönlichkeitsstörung',
  schizotype: 'Schizotype Persönlichkeitsstörung',
  antisoziale: 'Antisoziale Persönlichkeitsstörung',
  impulsiverTyp: 'Emotional-instabile PS - Impulsiver Typ',
  borderline: 'Emotional-instabile PS - Borderline',
  histrionische: 'Histrionische Persönlichkeitsstörung',
  narzisstische: 'Narzisstische Persönlichkeitsstörung',
  vermeidend: 'Vermeidend-selbstunsichere PS',
  dependente: 'Dependente Persönlichkeitsstörung',
  zwanghafte: 'Zwanghafte Persönlichkeitsstörung',
  passivAggressiv: 'Passiv-aggressive PS',
  aenderungExtrembelastung: 'Persönlichkeitsänderung nach Extrembelastung',
  aenderungPsychKrankheit: 'Persönlichkeitsänderung nach psych. Krankheit',
  andereSymptome: 'Andere Symptome'
} as const satisfies Record<keyof FormTypes.Persoenlichkeitsstoerungen, string>;

// ============================================================================
// CATEGORY 14: IMPULSKONTROLLSTÖRUNGEN LABELS
// ============================================================================

/** Pathologisches Spielen labels */
export const PATHOLOGISCHES_SPIELEN_LABELS = {
  [FormTypes.PathologischesSpielenSymptom.Kontrollverlust]: 'Kontrollverlust über das Spielverhalten',
  [FormTypes.PathologischesSpielenSymptom.Steigerung]: 'Steigerung der Einsätze',
  [FormTypes.PathologischesSpielenSymptom.Entzugserscheinungen]: 'Entzugserscheinungen bei Spielpausen',
  [FormTypes.PathologischesSpielenSymptom.VernachlaessigungPflichten]: 'Vernachlässigung von Pflichten',
  [FormTypes.PathologischesSpielenSymptom.Luegen]: 'Lügen über Spielverhalten'
} as const satisfies Record<FormTypes.PathologischesSpielenSymptom, string>;

/** Pyromanie labels */
export const PYROMANIE_LABELS = {
  [FormTypes.PyromanieSymptom.FaszinationFeuer]: 'Faszination für Feuer',
  [FormTypes.PyromanieSymptom.SpannungVorher]: 'Spannung vor der Handlung',
  [FormTypes.PyromanieSymptom.ErleichterungNachher]: 'Erleichterung nach der Handlung',
  [FormTypes.PyromanieSymptom.WiederholtesBrandstiften]: 'Wiederholtes Brandstiften'
} as const satisfies Record<FormTypes.PyromanieSymptom, string>;

/** Kleptomanie labels */
export const KLEPTOMANIE_LABELS = {
  [FormTypes.KleptomanieSymptom.DrangZuStehlen]: 'Drang zu stehlen',
  [FormTypes.KleptomanieSymptom.SpannungVorDiebstahl]: 'Spannung vor dem Diebstahl',
  [FormTypes.KleptomanieSymptom.BefriedigungNachher]: 'Befriedigung nach dem Diebstahl',
  [FormTypes.KleptomanieSymptom.KeinPersoenlichesMotiv]: 'Kein persönliches Motiv für Diebstahl'
} as const satisfies Record<FormTypes.KleptomanieSymptom, string>;

/** Trichotillomanie labels */
export const TRICHOTILLOMANIE_LABELS = {
  [FormTypes.TrichotillomanieSymptom.HaareAusreissen]: 'Wiederholtes Ausreißen von Haaren',
  [FormTypes.TrichotillomanieSymptom.SichtbarerHaarverlust]: 'Sichtbarer Haarverlust',
  [FormTypes.TrichotillomanieSymptom.SpannungVorher]: 'Spannung vor dem Ausreißen',
  [FormTypes.TrichotillomanieSymptom.ErleichterungNachher]: 'Erleichterung nach dem Ausreißen'
} as const satisfies Record<FormTypes.TrichotillomanieSymptom, string>;

/** Impulskontrollstoerungen section labels */
export const IMPULSKONTROLLSTOERUNGEN_SECTION_LABELS = {
  pathologischesSpielen: 'Pathologisches Spielen',
  pyromanie: 'Pyromanie',
  kleptomanie: 'Kleptomanie',
  trichotillomanie: 'Trichotillomanie',
  andereSymptome: 'Andere Symptome'
} as const satisfies Record<keyof FormTypes.Impulskontrollstoerungen, string>;

// ============================================================================
// CATEGORY 15: SEXUELLBEZOGENE SYMPTOME LABELS
// ============================================================================

/** Sexuelle Funktionsstörungen labels */
export const SEXUELLE_FUNKTIONSSTOERUNG_LABELS = {
  [FormTypes.SexuelleFunktionsstoerungSymptom.MangelSexuellesVerlangen]: 'Mangel an sexuellem Verlangen',
  [FormTypes.SexuelleFunktionsstoerungSymptom.SexuelleAversion]: 'Sexuelle Aversion',
  [FormTypes.SexuelleFunktionsstoerungSymptom.ErregungsstoerungMann]: 'Erregungsstörung (Mann)',
  [FormTypes.SexuelleFunktionsstoerungSymptom.ErregungsstoerungFrau]: 'Erregungsstörung (Frau)',
  [FormTypes.SexuelleFunktionsstoerungSymptom.Orgasmusstoerung]: 'Orgasmusstörung',
  [FormTypes.SexuelleFunktionsstoerungSymptom.VorzeitigerOrgasmus]: 'Vorzeitiger Orgasmus',
  [FormTypes.SexuelleFunktionsstoerungSymptom.Dyspareunie]: 'Dyspareunie',
  [FormTypes.SexuelleFunktionsstoerungSymptom.Vaginismus]: 'Vaginismus'
} as const satisfies Record<FormTypes.SexuelleFunktionsstoerungSymptom, string>;

/** Störungen der Sexualpräferenz labels */
export const SEXUALPRAEFERENZSTOERUNG_LABELS = {
  [FormTypes.SexualpraeferenzstoerungSymptom.Fetischismus]: 'Fetischismus',
  [FormTypes.SexualpraeferenzstoerungSymptom.Transvestitismus]: 'Fetischistischer Transvestitismus',
  [FormTypes.SexualpraeferenzstoerungSymptom.Exhibitionismus]: 'Exhibitionismus',
  [FormTypes.SexualpraeferenzstoerungSymptom.Voyeurismus]: 'Voyeurismus',
  [FormTypes.SexualpraeferenzstoerungSymptom.Paedophilie]: 'Pädophilie',
  [FormTypes.SexualpraeferenzstoerungSymptom.Sadomasochismus]: 'Sadomasochismus'
} as const satisfies Record<FormTypes.SexualpraeferenzstoerungSymptom, string>;

/** SexuellbezogeneSymptome section labels */
export const SEXUELLBEZOGENE_SYMPTOME_SECTION_LABELS = {
  funktionsstoerungen: 'Sexuelle Funktionsstörungen',
  praeferenzstoerungen: 'Störungen der Sexualpräferenz',
  andereSymptome: 'Andere Symptome'
} as const satisfies Record<keyof FormTypes.SexuellbezogeneSymptome, string>;

// ============================================================================
// CATEGORY 16: GESCHLECHTSIDENTITÄTSBEZOGENE SYMPTOMATIK LABELS
// ============================================================================

/** Geschlechtsidentität labels */
export const GESCHLECHTSIDENTITAET_LABELS = {
  [FormTypes.GeschlechtsidentitaetSymptom.PersistierendesUnbehagen]: 'Persistierendes Unbehagen mit dem Geschlecht',
  [FormTypes.GeschlechtsidentitaetSymptom.WunschAnderesGeschlecht]: 'Wunsch, dem anderen Geschlecht anzugehören',
  [FormTypes.GeschlechtsidentitaetSymptom.AblehnungEigenerGeschlecht]: 'Ablehnung des eigenen Geschlechts',
  [FormTypes.GeschlechtsidentitaetSymptom.WunschPhysischeVeraenderung]: 'Wunsch nach körperlicher Veränderung',
  [FormTypes.GeschlechtsidentitaetSymptom.SozialeRolleAnderesGeschlecht]: 'Leben in sozialer Rolle des anderen Geschlechts',
  [FormTypes.GeschlechtsidentitaetSymptom.KlinischBedeutsameLeidensdruck]: 'Klinisch bedeutsamer Leidensdruck'
} as const satisfies Record<FormTypes.GeschlechtsidentitaetSymptom, string>;

/** GeschlechtsidentitaetSymptomatik section labels */
export const GESCHLECHTSIDENTITAET_SECTION_LABELS = {
  symptome: 'Symptome',
  andereSymptome: 'Andere Symptome'
} as const satisfies Record<keyof FormTypes.GeschlechtsidentitaetSymptomatik, string>;

// ============================================================================
// CATEGORY 17: HYPERKINETISCHE STÖRUNGEN LABELS
// ============================================================================

/** Attentionale Symptomatik labels */
export const HYPERKINETISCH_ATTENTIONAL_LABELS = {
  [FormTypes.HyperkinetischAttentionalSymptom.Unaufmerksamkeit]: 'Unaufmerksamkeit',
  [FormTypes.HyperkinetischAttentionalSymptom.Konzentrationsschwaeche]: 'Konzentrationsschwäche',
  [FormTypes.HyperkinetischAttentionalSymptom.Vergesslichkeit]: 'Vergesslichkeit',
  [FormTypes.HyperkinetischAttentionalSymptom.Ablenkbarkeit]: 'Ablenkbarkeit',
  [FormTypes.HyperkinetischAttentionalSymptom.NichtZuhoeren]: 'Scheint nicht zuzuhören',
  [FormTypes.HyperkinetischAttentionalSymptom.SchwierigkeitenOrganisation]: 'Schwierigkeiten bei Organisation',
  [FormTypes.HyperkinetischAttentionalSymptom.VermeidungAnstrengenderAufgaben]: 'Vermeidung anstrengender Aufgaben',
  [FormTypes.HyperkinetischAttentionalSymptom.VerlierenVonGegenstaenden]: 'Häufiges Verlieren von Gegenständen'
} as const satisfies Record<FormTypes.HyperkinetischAttentionalSymptom, string>;

/** Hyperaktive Symptomatik labels */
export const HYPERKINETISCH_HYPERAKTIV_LABELS = {
  [FormTypes.HyperkinetischHyperaktivSymptom.MotorisacheUnruhe]: 'Motorische Unruhe',
  [FormTypes.HyperkinetischHyperaktivSymptom.ZappelnFidgeting]: 'Zappeln und Fidgeting',
  [FormTypes.HyperkinetischHyperaktivSymptom.Aufstehen]: 'Häufiges Aufstehen',
  [FormTypes.HyperkinetischHyperaktivSymptom.UebermaessigesReden]: 'Übermäßiges Reden'
} as const satisfies Record<FormTypes.HyperkinetischHyperaktivSymptom, string>;

/** Impulsive Symptomatik labels */
export const HYPERKINETISCH_IMPULSIV_LABELS = {
  [FormTypes.HyperkinetischImpulsivSymptom.Herausplatzen]: 'Herausplatzen mit Antworten',
  [FormTypes.HyperkinetischImpulsivSymptom.NichtWartenKoennen]: 'Nicht warten können',
  [FormTypes.HyperkinetischImpulsivSymptom.AndereUnterbrechen]: 'Andere unterbrechen',
  [FormTypes.HyperkinetischImpulsivSymptom.Ungeduld]: 'Ungeduld',
  [FormTypes.HyperkinetischImpulsivSymptom.HandelnOhneNachdenken]: 'Handeln ohne Nachdenken'
} as const satisfies Record<FormTypes.HyperkinetischImpulsivSymptom, string>;

/** HyperkinetischeStoerungen section labels */
export const HYPERKINETISCHE_STOERUNGEN_SECTION_LABELS = {
  attentional: 'Attentionale Symptomatik',
  hyperaktiv: 'Hyperaktive Symptomatik',
  impulsiv: 'Impulsive Symptomatik',
  andereSymptome: 'Andere Symptome'
} as const satisfies Record<keyof FormTypes.HyperkinetischeStoerungen, string>;

// ============================================================================
// CATEGORY 18: TIC-STÖRUNGEN LABELS
// ============================================================================

/** Motorische Tics labels */
export const MOTORISCHE_TICS_LABELS = {
  [FormTypes.MotorischeTicsSymptom.EinfacheMotorischeTics]: 'Einfache motorische Tics',
  [FormTypes.MotorischeTicsSymptom.KomplexeMotorischeTics]: 'Komplexe motorische Tics',
  [FormTypes.MotorischeTicsSymptom.Augenblinzeln]: 'Augenblinzeln',
  [FormTypes.MotorischeTicsSymptom.Kopfbewegungen]: 'Kopfbewegungen',
  [FormTypes.MotorischeTicsSymptom.Schulterzucken]: 'Schulterzucken'
} as const satisfies Record<FormTypes.MotorischeTicsSymptom, string>;

/** Vokale Tics labels */
export const VOKALE_TICS_LABELS = {
  [FormTypes.VokaleTicsSymptom.EinfacheVokaleTics]: 'Einfache vokale Tics',
  [FormTypes.VokaleTicsSymptom.KomplexeVokaleTics]: 'Komplexe vokale Tics',
  [FormTypes.VokaleTicsSymptom.RaeuspernHusten]: 'Räuspern/Husten',
  [FormTypes.VokaleTicsSymptom.Schniefen]: 'Schniefen',
  [FormTypes.VokaleTicsSymptom.Koprolalie]: 'Koprolalie'
} as const satisfies Record<FormTypes.VokaleTicsSymptom, string>;

/** TicStoerungen section labels */
export const TIC_STOERUNGEN_SECTION_LABELS = {
  motorischeTics: 'Motorische Tics',
  vokaleTics: 'Vokale Tics',
  touretteSyndrom: 'Tourette-Syndrom',
  andereSymptome: 'Andere Symptome'
} as const;

// ============================================================================
// CATEGORY 19: SUIZIDALITÄT (SYMPTOMATIK) LABELS
// ============================================================================

/** Suizidalität Symptomatik labels */
export const SUIZIDALITAET_SYMPTOMATIK_LABELS = {
  [FormTypes.SuizidalitaetSymptomatikSymptom.Suizidgedanken]: 'Suizidgedanken',
  [FormTypes.SuizidalitaetSymptomatikSymptom.Suizidplaene]: 'Suizidpläne',
  [FormTypes.SuizidalitaetSymptomatikSymptom.Suizidabsichten]: 'Suizidabsichten',
  [FormTypes.SuizidalitaetSymptomatikSymptom.Suizidversuche]: 'Suizidversuche',
  [FormTypes.SuizidalitaetSymptomatikSymptom.Selbstverletzung]: 'Selbstverletzung',
  [FormTypes.SuizidalitaetSymptomatikSymptom.Hoffnungslosigkeit]: 'Hoffnungslosigkeit',
  [FormTypes.SuizidalitaetSymptomatikSymptom.Todessehnsucht]: 'Todessehnsucht'
} as const satisfies Record<FormTypes.SuizidalitaetSymptomatikSymptom, string>;

/** SuizidalitaetSymptomatik section labels */
export const SUIZIDALITAET_SYMPTOMATIK_SECTION_LABELS = {
  symptome: 'Symptome',
  andereSymptome: 'Andere Symptome'
} as const satisfies Record<keyof FormTypes.SuizidalitaetSymptomatik, string>;

// ============================================================================
// CATEGORY 20: SONSTIGE SYMPTOMATIK LABELS
// ============================================================================

/** Krankheitseinsicht und Compliance labels */
export const KRANKHEITSEINSICHT_COMPLIANCE_LABELS = {
  [FormTypes.KrankheitseinsichtComplianceSymptom.MangelndeKrankheitseinsicht]: 'Mangelnde Krankheitseinsicht',
  [FormTypes.KrankheitseinsichtComplianceSymptom.AmbivalenteKrankheitseinsicht]: 'Ambivalente Krankheitseinsicht',
  [FormTypes.KrankheitseinsichtComplianceSymptom.EingeschraenkteCompliance]: 'Eingeschränkte Compliance',
  [FormTypes.KrankheitseinsichtComplianceSymptom.MangelndeTherapiemotivation]: 'Mangelnde Therapiemotivation'
} as const satisfies Record<FormTypes.KrankheitseinsichtComplianceSymptom, string>;

/** SonstigeSymptomatik section labels */
export const SONSTIGE_SYMPTOMATIK_SECTION_LABELS = {
  krankheitseinsichtCompliance: 'Krankheitseinsicht und Compliance',
  andereSymptome: 'Andere Symptome'
} as const satisfies Record<keyof FormTypes.SonstigeSymptomatik, string>;

// ============================================================================
// VERHALTENSEXZESSE - BEHAVIORAL EXCESSES LABELS
// ============================================================================

export const VERHALTENSEXZESS_SYMPTOM_LABELS = {
  [FormTypes.VerhaltensexzessSymptom.DysfunktionaleKognitionen]: 'Dysfunktionale Kognitionen (Denkfehler, automatische negative Gedanken)',
  [FormTypes.VerhaltensexzessSymptom.ErduldenBewältigung]: 'Erdulden als dysfunktionaler Bewältigungsstil',
  [FormTypes.VerhaltensexzessSymptom.UeberkompensationBewältigung]: 'Überkompensation als dysfunktionaler Bewältigungsstil',
  [FormTypes.VerhaltensexzessSymptom.Gruebeln]: 'Grübeln',
  [FormTypes.VerhaltensexzessSymptom.SichSorgenMachen]: 'Sich-Sorgen-Machen',
  [FormTypes.VerhaltensexzessSymptom.SozialerRueckzug]: 'Sozialer Rückzug',
  [FormTypes.VerhaltensexzessSymptom.SelbstschaedigendesVerhalten]: 'Selbstschädigendes und impulsives Verhalten',
  [FormTypes.VerhaltensexzessSymptom.Suchtverhalten]: 'Suchtverhalten',
  [FormTypes.VerhaltensexzessSymptom.Substanzmissbrauch]: 'Substanzmissbrauch',
  [FormTypes.VerhaltensexzessSymptom.Prokrastinationsverhalten]: 'Prokrastinationsverhalten',
  [FormTypes.VerhaltensexzessSymptom.Vermeidungsverhalten]: 'Vermeidungsverhalten',
  [FormTypes.VerhaltensexzessSymptom.Sicherheitsverhalten]: 'Sicherheitsverhalten',
  [FormTypes.VerhaltensexzessSymptom.Rueckversicherungsverhalten]: 'Rückversicherungsverhalten',
  [FormTypes.VerhaltensexzessSymptom.BodyChecking]: 'Body-Checking',
  [FormTypes.VerhaltensexzessSymptom.Kontrollverhalten]: 'Kontrollverhalten',
  [FormTypes.VerhaltensexzessSymptom.Hilfesuchverhalten]: 'Hilfesuchverhalten',
  [FormTypes.VerhaltensexzessSymptom.ZwanghaftesVerhalten]: 'Zwanghaftes Verhalten (Rituale)',
  [FormTypes.VerhaltensexzessSymptom.Hypervigilanz]: 'Hypervigilanz',
  [FormTypes.VerhaltensexzessSymptom.Selbstueberforderung]: 'Selbstüberforderung',
  [FormTypes.VerhaltensexzessSymptom.UebermaessigesRationalisieren]: 'Übermäßiges Rationalisieren'
} as const satisfies Record<FormTypes.VerhaltensexzessSymptom, string>;

// ============================================================================
// VERHALTENSDEFIZITE - BEHAVIORAL DEFICITS LABELS
// ============================================================================

export const VERHALTENSDEFIZIT_SYMPTOM_LABELS = {
  [FormTypes.VerhaltensdefizitSymptom.DysfunktionaleErwartungen]: 'Dysfunktionale Situations- und Selbstwirksamkeitserwartungen',
  [FormTypes.VerhaltensdefizitSymptom.NegativesSelbstkonzept]: 'Negatives Selbstkonzept oder niedriges Selbstwertgefühl',
  [FormTypes.VerhaltensdefizitSymptom.Selbstabwertung]: 'Selbstabwertung oder Selbsthass',
  [FormTypes.VerhaltensdefizitSymptom.DiskrepanzAnspruchLeistung]: 'Diskrepanz zwischen Anspruchsniveau und Leistungsvermögen (fehlende realistische Selbsteinschätzung)',
  [FormTypes.VerhaltensdefizitSymptom.DefiziteSozialeKontakte]: 'Defizite in der Aufnahme und Aufrechterhaltung sozialer Kontakte',
  [FormTypes.VerhaltensdefizitSymptom.DysfunktionaleBeziehungsgestaltung]: 'Dysfunktionale Beziehungsgestaltung und intime Beziehungsfähigkeit',
  [FormTypes.VerhaltensdefizitSymptom.MangelndeAbgrenzung]: 'Mangelnde Abgrenzungsfähigkeiten',
  [FormTypes.VerhaltensdefizitSymptom.DefiziteSelbstregulation]: 'Defizite in der Selbstregulation',
  [FormTypes.VerhaltensdefizitSymptom.DefiziteGesundheitsverhalten]: 'Defizite im Gesundheits- und Entspannungsverhalten',
  [FormTypes.VerhaltensdefizitSymptom.DefiziteAchtsamkeit]: 'Defizite im Achtsamkeitsverhalten und in der Gegenwartsorientierung',
  [FormTypes.VerhaltensdefizitSymptom.DefiziteBeduerfniswahrnehmung]: 'Defizite in der Bedürfniswahrnehmung und -kommunikation',
  [FormTypes.VerhaltensdefizitSymptom.DefiziteEmotionswahrnehmung]: 'Defizite in der Emotionswahrnehmung und im Emotionsausdruck',
  [FormTypes.VerhaltensdefizitSymptom.Selbstwahrnehmungsdefizite]: 'Selbstwahrnehmungsdefizite',
  [FormTypes.VerhaltensdefizitSymptom.DefiziteProblemloesung]: 'Defizite in der Problemlösefähigkeit',
  [FormTypes.VerhaltensdefizitSymptom.MangelndeSelbstverstaerkung]: 'Mangelnde Fähigkeit zur Selbstverstärkung',
  [FormTypes.VerhaltensdefizitSymptom.MangelndeFrustrationstoleranz]: 'Mangelnde Frustrationstoleranz',
  [FormTypes.VerhaltensdefizitSymptom.Distressintoleranz]: 'Distressintoleranz',
  [FormTypes.VerhaltensdefizitSymptom.DefiziteAutonomieentwicklung]: 'Defizite in der Autonomieentwicklung',
  [FormTypes.VerhaltensdefizitSymptom.Passivitaet]: 'Passivität'
} as const satisfies Record<FormTypes.VerhaltensdefizitSymptom, string>;

// ============================================================================
// PSYCHISCHER BEFUND - ERSCHEINUNGSBILD LABELS
// ============================================================================

export const ERSCHEINUNGSBILD_PFLEGEZUSTAND_LABELS = {
  [FormTypes.ErscheinungsbildPflegezustand.Gepflegt]: 'Gepflegt',
  [FormTypes.ErscheinungsbildPflegezustand.Vernachlaessigt]: 'Vernachlässigt',
  [FormTypes.ErscheinungsbildPflegezustand.Verwahrlost]: 'Verwahrlost',
  [FormTypes.ErscheinungsbildPflegezustand.Ungepflegt]: 'Ungepflegt',
} as const satisfies Record<FormTypes.ErscheinungsbildPflegezustand, string>;

export const ERSCHEINUNGSBILD_KOERPERGERUCH_LABELS = {
  [FormTypes.ErscheinungsbildKoerpergeruch.Unauffaellig]: 'Unauffällig',
  [FormTypes.ErscheinungsbildKoerpergeruch.Unangenehm]: 'Unangenehm',
  [FormTypes.ErscheinungsbildKoerpergeruch.Schweissgeruch]: 'Schweißgeruch',
  [FormTypes.ErscheinungsbildKoerpergeruch.Alkoholgeruch]: 'Alkoholgeruch',
  [FormTypes.ErscheinungsbildKoerpergeruch.Tabakgeruch]: 'Tabakgeruch',
  [FormTypes.ErscheinungsbildKoerpergeruch.THCGeruch]: 'THC-Geruch',
  [FormTypes.ErscheinungsbildKoerpergeruch.Parfuemgeruch]: 'Parfümgeruch',
} as const satisfies Record<FormTypes.ErscheinungsbildKoerpergeruch, string>;

export const ERSCHEINUNGSBILD_KLEIDUNGSSTIL_LABELS = {
  [FormTypes.ErscheinungsbildKleidungsstil.Sauber]: 'Sauber',
  [FormTypes.ErscheinungsbildKleidungsstil.Ordentlich]: 'Ordentlich',
  [FormTypes.ErscheinungsbildKleidungsstil.Modisch]: 'Modisch',
  [FormTypes.ErscheinungsbildKleidungsstil.Klassisch]: 'Klassisch',
  [FormTypes.ErscheinungsbildKleidungsstil.Sportlich]: 'Sportlich',
  [FormTypes.ErscheinungsbildKleidungsstil.Einfach]: 'Einfach',
  [FormTypes.ErscheinungsbildKleidungsstil.Extravagant]: 'Extravagant',
  [FormTypes.ErscheinungsbildKleidungsstil.Bizarr]: 'Bizarr',
  [FormTypes.ErscheinungsbildKleidungsstil.NichtAltersgemaess]: 'Nicht altersgemäß',
} as const satisfies Record<FormTypes.ErscheinungsbildKleidungsstil, string>;

export const ERSCHEINUNGSBILD_KLEIDUNGSZUSTAND_LABELS = {
  [FormTypes.ErscheinungsbildKleidungszustand.Sauber]: 'Sauber',
  [FormTypes.ErscheinungsbildKleidungszustand.Fleckig]: 'Fleckig',
} as const satisfies Record<FormTypes.ErscheinungsbildKleidungszustand, string>;

export const ERSCHEINUNGSBILD_KLEIDUNGSANGEMESSENHEIT_LABELS = {
  [FormTypes.ErscheinungsbildKleidungsangemessenheit.Angemessen]: 'Zur Umgebungstemperatur angemessen',
  [FormTypes.ErscheinungsbildKleidungsangemessenheit.Unangemessen]: 'Zur Umgebungstemperatur unangemessen',
} as const satisfies Record<FormTypes.ErscheinungsbildKleidungsangemessenheit, string>;

// ============================================================================
// KAPITEL 3: SOMATISCHER BEFUND - LABELS
// ============================================================================

/** MedikamentKategorie labels (A-M from reference doc) */
export const MEDIKAMENT_KATEGORIE_LABELS = {
  [FormTypes.MedikamentKategorie.SelektiveAntidepressiva]: 'Selektive Antidepressiva',
  [FormTypes.MedikamentKategorie.Antipsychotika]: 'Antipsychotika',
  [FormTypes.MedikamentKategorie.Anxiolytika]: 'Anxiolytika',
  [FormTypes.MedikamentKategorie.Stimmungsstabilisierer]: 'Stimmungsstabilisierer',
  [FormTypes.MedikamentKategorie.Hypnotika]: 'Hypnotika',
  [FormTypes.MedikamentKategorie.ADHSMedikation]: 'ADHS-Medikation',
  [FormTypes.MedikamentKategorie.SpezielleMedikation]: 'Spezielle Medikation',
  [FormTypes.MedikamentKategorie.Schilddruesenmedikation]: 'Schilddrüsenmedikation',
  [FormTypes.MedikamentKategorie.Schmerzmedikation]: 'Schmerzmedikation',
  [FormTypes.MedikamentKategorie.HerzKreislaufMedikation]: 'Herz-Kreislauf-Medikation',
  [FormTypes.MedikamentKategorie.DiabetesMedikation]: 'Diabetes-Medikation',
  [FormTypes.MedikamentKategorie.Substitutionsbehandlungen]: 'Substitutionsbehandlungen',
  [FormTypes.MedikamentKategorie.HormonellePraeparate]: 'Hormonelle Präparate',
} as const satisfies Record<FormTypes.MedikamentKategorie, string>;

/** AntidepressivaSubkategorie labels */
export const ANTIDEPRESSIVA_SUBKATEGORIE_LABELS = {
  [FormTypes.AntidepressivaSubkategorie.SSRI]: 'SSRI',
  [FormTypes.AntidepressivaSubkategorie.SNRI]: 'SNRI',
  [FormTypes.AntidepressivaSubkategorie.NDRI]: 'NDRI',
  [FormTypes.AntidepressivaSubkategorie.Tetrazyklische]: 'Tetrazyklische Antidepressiva',
  [FormTypes.AntidepressivaSubkategorie.Trizyklische]: 'Trizyklische Antidepressiva',
  [FormTypes.AntidepressivaSubkategorie.MAOHemmer]: 'MAO-Hemmer',
  [FormTypes.AntidepressivaSubkategorie.Andere]: 'Andere Antidepressiva',
} as const satisfies Record<FormTypes.AntidepressivaSubkategorie, string>;

/** AntipsychotikaSubkategorie labels */
export const ANTIPSYCHOTIKA_SUBKATEGORIE_LABELS = {
  [FormTypes.AntipsychotikaSubkategorie.Typische]: 'Typische Antipsychotika',
  [FormTypes.AntipsychotikaSubkategorie.Atypische]: 'Atypische Antipsychotika',
} as const satisfies Record<FormTypes.AntipsychotikaSubkategorie, string>;

/** Verordnung labels */
export const VERORDNUNG_LABELS = {
  [FormTypes.Verordnung.Hausarzt]: 'Hausarzt/Hausärztin',
  [FormTypes.Verordnung.Psychiater]: 'Psychiater/Psychiaterin',
  [FormTypes.Verordnung.Sonstige]: 'Sonstige',
} as const satisfies Record<FormTypes.Verordnung, string>;

/** VorbehandlungArt labels */
export const VORBEHANDLUNG_ART_LABELS = {
  [FormTypes.VorbehandlungArt.Psychotherapeutisch]: 'Psychotherapeutisch',
  [FormTypes.VorbehandlungArt.Psychosomatisch]: 'Psychosomatisch',
  [FormTypes.VorbehandlungArt.Psychiatrisch]: 'Psychiatrisch',
} as const satisfies Record<FormTypes.VorbehandlungArt, string>;

/** VorbehandlungSetting labels */
export const VORBEHANDLUNG_SETTING_LABELS = {
  [FormTypes.VorbehandlungSetting.Ambulant]: 'Ambulant',
  [FormTypes.VorbehandlungSetting.Tagklinisch]: 'Tagklinisch',
  [FormTypes.VorbehandlungSetting.Stationaer]: 'Stationär',
} as const satisfies Record<FormTypes.VorbehandlungSetting, string>;

/** AbschlussberichteStatus labels */
export const ABSCHLUSSBERICHTE_STATUS_LABELS = {
  [FormTypes.AbschlussberichteStatus.Vorhanden]: 'Vorhanden',
  [FormTypes.AbschlussberichteStatus.VorhandenNichtEingefordert]: 'Vorhanden, aber nicht eingefordert',
  [FormTypes.AbschlussberichteStatus.NichtVorhanden]: 'Nicht vorhanden',
} as const satisfies Record<FormTypes.AbschlussberichteStatus, string>;

/** NikotinForm labels */
export const NIKOTIN_FORM_LABELS = {
  [FormTypes.NikotinForm.Zigaretten]: 'Zigaretten',
  [FormTypes.NikotinForm.Snus]: 'Snus',
  [FormTypes.NikotinForm.Schnupftabak]: 'Schnupftabak',
  [FormTypes.NikotinForm.Vape]: 'Vape',
} as const satisfies Record<FormTypes.NikotinForm, string>;

/** KonsumHaeufigkeit labels */
export const KONSUM_HAEUFIGKEIT_LABELS = {
  [FormTypes.KonsumHaeufigkeit.Taeglich]: 'Täglich',
  [FormTypes.KonsumHaeufigkeit.Woechentlich]: 'Wöchentlich',
  [FormTypes.KonsumHaeufigkeit.Gelegentlich]: 'Gelegentlich',
  [FormTypes.KonsumHaeufigkeit.Andere]: 'Andere',
} as const satisfies Record<FormTypes.KonsumHaeufigkeit, string>;

/** AlkoholArt labels */
export const ALKOHOL_ART_LABELS = {
  [FormTypes.AlkoholArt.Bier]: 'Bier',
  [FormTypes.AlkoholArt.Wein]: 'Wein',
  [FormTypes.AlkoholArt.Schnaps]: 'Schnaps',
} as const satisfies Record<FormTypes.AlkoholArt, string>;

/** MengeEinheit labels */
export const MENGE_EINHEIT_LABELS = {
  [FormTypes.MengeEinheit.Gramm]: 'g',
  [FormTypes.MengeEinheit.Milligramm]: 'mg',
  [FormTypes.MengeEinheit.Milliliter]: 'ml',
  [FormTypes.MengeEinheit.Stueck]: 'Stück',
} as const satisfies Record<FormTypes.MengeEinheit, string>;

/** EinnahmeEinheit labels (for medication duration) */
export const EINNAHME_EINHEIT_LABELS = {
  [FormTypes.EinnahmeEinheit.Wochen]: 'Wochen',
  [FormTypes.EinnahmeEinheit.Monate]: 'Monaten',
  [FormTypes.EinnahmeEinheit.Jahre]: 'Jahren',
} as const satisfies Record<FormTypes.EinnahmeEinheit, string>;

// ===== LEBENSGESCHICHTE LABELS =====

/** BeziehungsEigenschaft labels */
export const BEZIEHUNGS_EIGENSCHAFT_LABELS = {
  [FormTypes.BeziehungsEigenschaft.Liebevoll]: 'Liebevoll',
  [FormTypes.BeziehungsEigenschaft.Zugewandt]: 'Zugewandt',
  [FormTypes.BeziehungsEigenschaft.Freundlich]: 'Freundlich',
  [FormTypes.BeziehungsEigenschaft.Fuersorglich]: 'Fürsorglich',
  [FormTypes.BeziehungsEigenschaft.Unterstuetzend]: 'Unterstützend',
  [FormTypes.BeziehungsEigenschaft.Empathisch]: 'Empathisch',
  [FormTypes.BeziehungsEigenschaft.Rueckhaltgebend]: 'Rückhaltgebend',
  [FormTypes.BeziehungsEigenschaft.Beschuetzerisch]: 'Beschützerisch',
  [FormTypes.BeziehungsEigenschaft.Aufopferungsvoll]: 'Aufopferungsvoll',
  [FormTypes.BeziehungsEigenschaft.Zuverlaessig]: 'Zuverlässig',
  [FormTypes.BeziehungsEigenschaft.Ueberfuersorglich]: 'Überfürsorglich',
  [FormTypes.BeziehungsEigenschaft.Sensibel]: 'Sensibel',
  [FormTypes.BeziehungsEigenschaft.Perfektionistisch]: 'Perfektionistisch',
  [FormTypes.BeziehungsEigenschaft.Launisch]: 'Launisch',
  [FormTypes.BeziehungsEigenschaft.Ambivalent]: 'Ambivalent',
  [FormTypes.BeziehungsEigenschaft.Kalt]: 'Kalt',
  [FormTypes.BeziehungsEigenschaft.Distanziert]: 'Distanziert',
  [FormTypes.BeziehungsEigenschaft.Unberechenbar]: 'Unberechenbar',
  [FormTypes.BeziehungsEigenschaft.Impulsiv]: 'Impulsiv',
  [FormTypes.BeziehungsEigenschaft.Misstrauisch]: 'Misstrauisch',
  [FormTypes.BeziehungsEigenschaft.Aengstlich]: 'Ängstlich',
  [FormTypes.BeziehungsEigenschaft.Kritisch]: 'Kritisch',
  [FormTypes.BeziehungsEigenschaft.Fordernd]: 'Fordernd',
  [FormTypes.BeziehungsEigenschaft.Abwertend]: 'Abwertend',
  [FormTypes.BeziehungsEigenschaft.Streng]: 'Streng',
  [FormTypes.BeziehungsEigenschaft.Dominant]: 'Dominant',
  [FormTypes.BeziehungsEigenschaft.Abwesend]: 'Abwesend',
  [FormTypes.BeziehungsEigenschaft.Nervoes]: 'Nervös',
  [FormTypes.BeziehungsEigenschaft.EmotionalInstabil]: 'Emotional instabil',
  [FormTypes.BeziehungsEigenschaft.Vernachlaessigend]: 'Vernachlässigend',
  [FormTypes.BeziehungsEigenschaft.Unsicher]: 'Unsicher',
} as const satisfies Record<FormTypes.BeziehungsEigenschaft, string>;

/** KritischeVerhaltensweise labels */
export const KRITISCHE_VERHALTENSWEISE_LABELS = {
  [FormTypes.KritischeVerhaltensweise.SexuellerMissbrauch]: 'Sexueller Missbrauch',
  [FormTypes.KritischeVerhaltensweise.PhysischeGewalt]: 'Physische Gewalt',
  [FormTypes.KritischeVerhaltensweise.PsychischEmotionaleGewalt]: 'Psychisch-emotionale Gewalt',
  [FormTypes.KritischeVerhaltensweise.StaendigeKritik]: 'Ständige Kritik',
  [FormTypes.KritischeVerhaltensweise.HaeufigeAbwesenheit]: 'Häufige Abwesenheit',
  [FormTypes.KritischeVerhaltensweise.Vernachlaessigung]: 'Vernachlässigung',
  [FormTypes.KritischeVerhaltensweise.BevorzugungVonGeschwistern]: 'Bevorzugung von Geschwistern',
  [FormTypes.KritischeVerhaltensweise.AlkoholDrogenmissbrauch]: 'Alkohol-/Drogenmissbrauch',
  [FormTypes.KritischeVerhaltensweise.KeineKlarenGrenzen]: 'Keine klaren Grenzen',
  [FormTypes.KritischeVerhaltensweise.UebermaessigeKontrolle]: 'Übermäßige Kontrolle',
} as const satisfies Record<FormTypes.KritischeVerhaltensweise, string>;

/** VerletztesGrundbeduerfnis labels */
export const VERLETZTES_GRUNDBEDUERFNIS_LABELS = {
  [FormTypes.VerletztesGrundbeduerfnis.Anerkennung]: 'Anerkennung',
  [FormTypes.VerletztesGrundbeduerfnis.BindungVerlaesslicheBeziehung]: 'Bindung/verlässliche Beziehung',
  [FormTypes.VerletztesGrundbeduerfnis.ZuwendungUndLiebe]: 'Zuwendung und Liebe',
  [FormTypes.VerletztesGrundbeduerfnis.Solidaritaet]: 'Solidarität',
  [FormTypes.VerletztesGrundbeduerfnis.Selbstschutz]: 'Selbstschutz',
  [FormTypes.VerletztesGrundbeduerfnis.Autonomie]: 'Autonomie',
  [FormTypes.VerletztesGrundbeduerfnis.Kontrolle]: 'Kontrolle',
  [FormTypes.VerletztesGrundbeduerfnis.Grenzen]: 'Grenzen',
} as const satisfies Record<FormTypes.VerletztesGrundbeduerfnis, string>;

/** Lebensgeschichte UI labels */
export const LEBENSGESCHICHTE_UI_LABELS = {
  // Section titles
  teil1Titel: 'Kurze biographische Einordnung',
  teil2Titel: 'Lebensgeschichtliche Entwicklung',

  // Part 1 fields
  geburtsjahrLabel: 'Geburtsjahr',
  geburtsortLabel: 'Geburtsort',
  familieLabel: 'Familie und wichtige Bezugspersonen',
  vaterLabel: 'Vater',
  mutterLabel: 'Mutter',
  geschwisterLabel: 'Geschwister',
  andereBezugspersonenLabel: 'Andere Bezugspersonen',

  // Elternteil fields
  nichtZutreffendLabel: 'Nicht zutreffend / unbekannt',
  geburtsjahrElternteilLabel: 'Geburtsjahr',
  berufLabel: 'Beruf',
  beziehungsEigenschaftenLabel: 'Beziehungseigenschaften',
  kritischeVerhaltensweiseLabel: 'Kritische Verhaltensweisen',
  verletzteGrundbeduerfnisseLabel: 'Verletzte Grundbedürfnisse',

  // Geschwister fields
  keineGeschwisterLabel: 'Keine Geschwister',
  geschwisterHinzufuegenLabel: 'Geschwister hinzufügen',
  geschlechtLabel: 'Geschlecht',
  beziehungLabel: 'Beziehung',

  // Andere Bezugspersonen fields
  bezugspersonHinzufuegenLabel: 'Bezugsperson hinzufügen',
  werIstDieBezugspersonLabel: 'Wer ist die Bezugsperson?',

  // Part 2 fields
  kindheitUndErziehungLabel: 'Kindheit und Erziehung',
  jugendLabel: 'Jugend',
  schulischerBeruflichWerdegangLabel: 'Schulischer und beruflicher Werdegang',
  finanziellesFamiliaresUmfeldLabel: 'Finanzielles/familiäres/häusliches Umfeld',
  beziehungenLabel: 'Beziehungen (Freundschaften/Partnerschaften/Sexualität)',
  interessenHobbiesLabel: 'Interessen/Hobbies',
  praegendeTraumatischeEreignisseLabel: 'Prägende/traumatische Lebensereignisse',
  andereLabel: 'Andere',

  // Common
  weitereAngabenLabel: 'Weitere Angaben',
} as const;

// ============================================================================
// MAKROANALYSE - PRÄDISPONIERENDE FAKTOREN LABELS
// ============================================================================

/** Grundbedürfnisse nach Grawe */
export const GRAWE_GRUNDBEDUERFNIS_LABELS = {
  [FormTypes.GraweGrundbeduerfnis.Bindung]: 'Bindung',
  [FormTypes.GraweGrundbeduerfnis.AutonomiKontrolle]: 'Autonomie/Kontrolle',
  [FormTypes.GraweGrundbeduerfnis.Selbstwerterhoehung]: 'Selbstwerterhöhung',
  [FormTypes.GraweGrundbeduerfnis.LustgewinnUnlustvermeidung]: 'Lustgewinn/Unlustvermeidung',
  [FormTypes.GraweGrundbeduerfnis.InnereKonsistenz]: 'Innere Konsistenz',
} as const satisfies Record<FormTypes.GraweGrundbeduerfnis, string>;

/** Bindungsmuster */
export const BINDUNGSMUSTER_LABELS = {
  [FormTypes.Bindungsmuster.Sicher]: 'Sicher',
  [FormTypes.Bindungsmuster.UnsicherVermeidend]: 'Unsicher-vermeidend',
  [FormTypes.Bindungsmuster.UnsicherAmbivalent]: 'Unsicher-ambivalent',
  [FormTypes.Bindungsmuster.Desorganisiert]: 'Desorganisiert',
} as const satisfies Record<FormTypes.Bindungsmuster, string>;

/** Frühkindliche Erfahrungen */
export const FRUEHKINDLICHE_ERFAHRUNG_LABELS = {
  [FormTypes.FruehkindlicheErfahrung.TrennungsVerlusterfahrungen]: 'Frühkindliche Trennungs- oder Verlusterfahrungen',
  [FormTypes.FruehkindlicheErfahrung.WechselndeLebenumstaende]: 'Häufig wechselnde Lebensumstände im frühkindlichen Alter',
  [FormTypes.FruehkindlicheErfahrung.TrennungEltern]: 'Trennung der Eltern im frühkindlichen Alter',
  [FormTypes.FruehkindlicheErfahrung.AlleinerziehendesElternteil]: 'Alleinerziehendes Elternteil',
} as const satisfies Record<FormTypes.FruehkindlicheErfahrung, string>;

/** Biologisch/genetische Vulnerabilität */
export const BIOLOGISCHE_VULNERABILITAET_LABELS = {
  [FormTypes.BiologischeVulnerabilitaet.PsychischeErkrankungenFamilie]: 'Psychische oder somatische Erkrankungen in der Familie',
  [FormTypes.BiologischeVulnerabilitaet.SomatischeVorerkrankungen]: 'Somatische (Vor-)Erkrankungen',
} as const satisfies Record<FormTypes.BiologischeVulnerabilitaet, string>;

/** Soziale Vulnerabilität */
export const SOZIALE_VULNERABILITAET_LABELS = {
  [FormTypes.SozialeVulnerabilitaet.NiedrigerSoziooekonomischerStatus]: 'Niedriger sozioökonomischer Status',
  [FormTypes.SozialeVulnerabilitaet.FinanzielleSchwierigkeiten]: 'Finanzielle Schwierigkeiten / Not',
  [FormTypes.SozialeVulnerabilitaet.KonfliktreicheFamilienverhaeltnisse]: 'Konfliktreiche oder instabile Familienverhältnisse',
  [FormTypes.SozialeVulnerabilitaet.ChronischeFamilienkonflikte]: 'Chronische Familienkonflikte',
  [FormTypes.SozialeVulnerabilitaet.FehlendeSozialeUnterstuetzung]: 'Fehlende soziale Unterstützung',
  [FormTypes.SozialeVulnerabilitaet.SchlechtePeerBeziehungen]: 'Schlechte Peer-Beziehungen',
  [FormTypes.SozialeVulnerabilitaet.LerndefiziteModelllernen]: 'Lerndefizite und ungünstiges Modelllernen',
  [FormTypes.SozialeVulnerabilitaet.KriminalitaetElternteil]: 'Kriminalität und Dissozialität eines Elternteils',
} as const satisfies Record<FormTypes.SozialeVulnerabilitaet, string>;

// ============================================================================
// MAKROANALYSE - AUSLÖSENDE BEDINGUNGEN LABELS
// ============================================================================

/** Auslösende Bedingungen */
export const AUSLOESENDE_BEDINGUNG_LABELS = {
  [FormTypes.AusloesendeBedingung.NichtEruiert]: 'Auslöser konnten nicht eruiert werden',
  [FormTypes.AusloesendeBedingung.VerlustTodBezugsperson]: 'Verlust oder Tod einer wichtigen Bezugsperson',
  [FormTypes.AusloesendeBedingung.TrennungScheidung]: 'Trennung / Scheidung',
  [FormTypes.AusloesendeBedingung.KonflikteBeziehungen]: 'Konflikte in Beziehungen',
  [FormTypes.AusloesendeBedingung.Partnerlosigkeit]: 'Partnerlosigkeit',
  [FormTypes.AusloesendeBedingung.Arbeitsplatzverlust]: 'Arbeitsplatzverlust',
  [FormTypes.AusloesendeBedingung.StressArbeitsplatz]: 'Stress am Arbeitsplatz',
  [FormTypes.AusloesendeBedingung.StressStudium]: 'Stress im Studium',
  [FormTypes.AusloesendeBedingung.FinanzielleKrise]: 'Finanzielle Krise / Sorgen',
  [FormTypes.AusloesendeBedingung.TraumatischeEreignisse]: 'Traumatische Ereignisse (Unfall, Missbrauch etc.)',
  [FormTypes.AusloesendeBedingung.Rollenverlust]: 'Rollenverlust oder -veränderung (z.B. Elternrolle)',
  [FormTypes.AusloesendeBedingung.GeburtKind]: 'Geburt eines Kindes',
  [FormTypes.AusloesendeBedingung.Fehlgeburt]: 'Fehlgeburt',
  [FormTypes.AusloesendeBedingung.UmzugNeueStadt]: 'Umzug in neue Stadt',
  [FormTypes.AusloesendeBedingung.BedrohlicheLebenssituationen]: 'Neue oder bedrohliche Lebenssituationen',
  [FormTypes.AusloesendeBedingung.ChronischeUeberforderung]: 'Chronische Überforderung',
  [FormTypes.AusloesendeBedingung.Gesundheitsprobleme]: 'Gesundheitsprobleme',
  [FormTypes.AusloesendeBedingung.KrankheitBezugsperson]: 'Krankheit von wichtiger Bezugsperson',
  [FormTypes.AusloesendeBedingung.EinsamkeitIsolation]: 'Einsamkeit und soziale Isolation',
  [FormTypes.AusloesendeBedingung.UngewissheitKontrollverlust]: 'Ungewissheit, Kontrollverlust',
  [FormTypes.AusloesendeBedingung.KritikVonAnderen]: 'Kritik von anderen',
} as const satisfies Record<FormTypes.AusloesendeBedingung, string>;

// ============================================================================
// MAKROANALYSE - AUFRECHTERHALTENDE BEDINGUNGEN LABELS
// ============================================================================

/** 1. Kognitive Faktoren - Denkfehler */
export const DENKFEHLER_LABELS = {
  [FormTypes.Denkfehler.SchwarzWeissDenken]: 'Schwarz-Weiß-Denken',
  [FormTypes.Denkfehler.Uebergeneralisierung]: 'Übergeneralisierung',
  [FormTypes.Denkfehler.SelektiveWahrnehmung]: 'Selektive Wahrnehmung und Informationsverarbeitung',
  [FormTypes.Denkfehler.VoreiligeSchlussfolgerungen]: 'Voreilige Schlussfolgerungen',
  [FormTypes.Denkfehler.UeberUnterschaetzung]: 'Über- oder Untertreibungen',
  [FormTypes.Denkfehler.UebertriebenesVerantwortungsgefuehl]: 'Übertriebenes Verantwortungsgefühl',
  [FormTypes.Denkfehler.EmotionaleBeweisfuehrung]: 'Emotionale Beweisführung',
  [FormTypes.Denkfehler.Katastrophisieren]: 'Katastrophisieren',
  [FormTypes.Denkfehler.Personalisieren]: 'Personalisieren',
  [FormTypes.Denkfehler.Gedankenlesen]: 'Gedankenlesen',
  [FormTypes.Denkfehler.Hypermentalisieren]: 'Hypermentalisieren',
  [FormTypes.Denkfehler.Etikettieren]: 'Etikettieren',
  [FormTypes.Denkfehler.UebermaessigesRationalisieren]: 'Übermäßiges Rationalisieren',
  [FormTypes.Denkfehler.Wunschdenken]: 'Wunschdenken',
  [FormTypes.Denkfehler.UeberschaetzungVerantwortung]: 'Überschätzung der persönlichen Verantwortung',
  [FormTypes.Denkfehler.UeberschaetzungGefahren]: 'Überschätzung von Gefahren und Risiken',
  [FormTypes.Denkfehler.UeberbewertungGedanken]: 'Überbewertung von Gedanken',
  [FormTypes.Denkfehler.GedankenHandlungsFusion]: 'Verschmelzung von Gedanken und Handlungen (Fusion)',
  [FormTypes.Denkfehler.MagischesDenken]: 'Magisches Denken',
} as const satisfies Record<FormTypes.Denkfehler, string>;

/** 2. Emotionale Faktoren - Dysfunktionale Emotionsregulation */
export const DYSFUNKTIONALE_EMOTIONSREGULATION_LABELS = {
  [FormTypes.DysfunktionaleEmotionsregulation.SelbstverletzendesVerhalten]: 'Selbstverletzendes Verhalten',
  [FormTypes.DysfunktionaleEmotionsregulation.BulimischesErbrechen]: 'Bulimisches Erbrechen',
  [FormTypes.DysfunktionaleEmotionsregulation.RiskantesSexualverhalten]: 'Riskantes Sexualverhalten',
  [FormTypes.DysfunktionaleEmotionsregulation.RiskantesFahrverhalten]: 'Riskantes Fahrverhalten',
  [FormTypes.DysfunktionaleEmotionsregulation.ImpulsiveGeldausgaben]: 'Impulsive Geldausgaben / Kaufsucht',
  [FormTypes.DysfunktionaleEmotionsregulation.Substanzmissbrauch]: 'Substanzmissbrauch',
} as const satisfies Record<FormTypes.DysfunktionaleEmotionsregulation, string>;

/** 3. Verhaltensbezogene Faktoren */
export const VERHALTENSBEZOGENE_FAKTOREN_LABELS = {
  [FormTypes.VerhaltensbezogeneFaktoren.Vermeidungsverhalten]: 'Vermeidungsverhalten',
  [FormTypes.VerhaltensbezogeneFaktoren.Sicherheitsverhalten]: 'Sicherheitsverhalten',
  [FormTypes.VerhaltensbezogeneFaktoren.BodyChecking]: 'Body-Checking',
  [FormTypes.VerhaltensbezogeneFaktoren.Rueckversicherungsverhalten]: 'Rückversicherungsverhalten',
  [FormTypes.VerhaltensbezogeneFaktoren.Kontrollverhalten]: 'Kontrollverhalten',
  [FormTypes.VerhaltensbezogeneFaktoren.Hilfesuchverhalten]: 'Hilfesuchverhalten',
  [FormTypes.VerhaltensbezogeneFaktoren.ZwanghaftesVerhalten]: 'Zwanghaftes Verhalten',
  [FormTypes.VerhaltensbezogeneFaktoren.Passivitaet]: 'Passivität',
  [FormTypes.VerhaltensbezogeneFaktoren.Inaktivitaet]: 'Inaktivität',
  [FormTypes.VerhaltensbezogeneFaktoren.Ueberkompensation]: 'Überkompensation',
  [FormTypes.VerhaltensbezogeneFaktoren.Erdulden]: 'Erdulden',
  [FormTypes.VerhaltensbezogeneFaktoren.SozialerRueckzug]: 'Sozialer Rückzug',
  [FormTypes.VerhaltensbezogeneFaktoren.AggressivesVerhalten]: 'Aggressives Verhalten',
  [FormTypes.VerhaltensbezogeneFaktoren.SozialInadaequatesVerhalten]: 'Sozial inadäquates Verhalten',
  [FormTypes.VerhaltensbezogeneFaktoren.Reaktanzverhalten]: 'Generalisiertes Reaktanzverhalten',
  [FormTypes.VerhaltensbezogeneFaktoren.Substanzkonsum]: 'Substanzkonsum',
} as const satisfies Record<FormTypes.VerhaltensbezogeneFaktoren, string>;

/** 4. Selbstwertbezogene Faktoren */
export const SELBSTWERTBEZOGENE_FAKTOREN_LABELS = {
  [FormTypes.SelbstwertbezogeneFaktoren.NegativesSelbstkonzept]: 'Negatives Selbstkonzept und Selbstwertgefühl',
  [FormTypes.SelbstwertbezogeneFaktoren.Selbstabwertung]: 'Selbstabwertung',
  [FormTypes.SelbstwertbezogeneFaktoren.Selbsthass]: 'Selbsthass',
  [FormTypes.SelbstwertbezogeneFaktoren.Selbstkritik]: 'Selbstkritik',
  [FormTypes.SelbstwertbezogeneFaktoren.UebermaessigeSelbstaufmerksamkeit]: 'Übermäßige Selbstaufmerksamkeit und Selbstbeobachtung',
  [FormTypes.SelbstwertbezogeneFaktoren.Selbstwahrnehmungsdefizite]: 'Selbstwahrnehmungsdefizite',
} as const satisfies Record<FormTypes.SelbstwertbezogeneFaktoren, string>;

/** 5. Kompetenzdefizite */
export const KOMPETENZDEFIZIT_LABELS = {
  [FormTypes.Kompetenzdefizit.DefiziteSozialeKontakte]: 'Defizite in der Aufnahme und Aufrechterhaltung sozialer Kontakte',
  [FormTypes.Kompetenzdefizit.DysfunktionaleBeziehungsgestaltung]: 'Dysfunktionale Beziehungsgestaltung und intime Beziehungsfähigkeit',
  [FormTypes.Kompetenzdefizit.DefiziteSozialesInteraktionsverhalten]: 'Defizite im sozialen Interaktionsverhalten',
  [FormTypes.Kompetenzdefizit.DefiziteSelbstregulation]: 'Defizite in der Selbstregulation / Selbstberuhigung',
  [FormTypes.Kompetenzdefizit.DefiziteGesundheitsverhalten]: 'Defizite im Gesundheits- und Entspannungsverhalten',
  [FormTypes.Kompetenzdefizit.DefiziteAchtsamkeit]: 'Defizite im Achtsamkeitsverhalten und in der Gegenwartsorientierung',
  [FormTypes.Kompetenzdefizit.MangelndeSelbstverstaerkung]: 'Mangelnde Fähigkeit zur Selbstverstärkung',
  [FormTypes.Kompetenzdefizit.MangelndeFrustrationstoleranz]: 'Mangelnde Frustrationstoleranz',
  [FormTypes.Kompetenzdefizit.Distressintoleranz]: 'Distressintoleranz',
  [FormTypes.Kompetenzdefizit.Selbstueberforderung]: 'Selbstüberforderung',
  [FormTypes.Kompetenzdefizit.DefiziteProblemloesung]: 'Defizite in der Problemlösefähigkeit',
  [FormTypes.Kompetenzdefizit.DefiziteAutonomieentwicklung]: 'Defizite in der Autonomieentwicklung',
  [FormTypes.Kompetenzdefizit.DiskrepanzAnspruchLeistung]: 'Diskrepanz zwischen Anspruchsniveau und Leistungsvermögen',
  [FormTypes.Kompetenzdefizit.Perfektionismus]: 'Perfektionismus',
  [FormTypes.Kompetenzdefizit.HoheLeistungsansprueche]: 'Hohe Leistungsansprüche',
} as const satisfies Record<FormTypes.Kompetenzdefizit, string>;

/** 5a. Defizite im sozialen Interaktionsverhalten (sub-items) */
export const SOZIALES_INTERAKTIONSDEFIZIT_LABELS = {
  [FormTypes.SozialesInteraktionsdefizit.BeduerfnisseWahrnehmenAeussern]: 'Bedürfnisse wahrnehmen und äußern',
  [FormTypes.SozialesInteraktionsdefizit.SympathieWerben]: 'Um Sympathie werben',
  [FormTypes.SozialesInteraktionsdefizit.RechtDurchsetzen]: 'Recht durchsetzen',
  [FormTypes.SozialesInteraktionsdefizit.NeinSagen]: 'Nein sagen',
  [FormTypes.SozialesInteraktionsdefizit.KontakteAufbauen]: 'Kontakte aufbauen',
  [FormTypes.SozialesInteraktionsdefizit.ForderungenStellen]: 'Forderungen stellen',
  [FormTypes.SozialesInteraktionsdefizit.SichAbgrenzen]: 'Sich gegenüber unangemessenen Forderungen anderer abgrenzen',
  [FormTypes.SozialesInteraktionsdefizit.AndereKritisieren]: 'Andere kritisieren',
  [FormTypes.SozialesInteraktionsdefizit.VerhaltensaenderungAuffordern]: 'Andere zu einer Verhaltensänderung auffordern',
  [FormTypes.SozialesInteraktionsdefizit.KritikAnnehmen]: 'Kritik annehmen',
  [FormTypes.SozialesInteraktionsdefizit.LobenKomplimente]: 'Loben und Komplimente machen',
  [FormTypes.SozialesInteraktionsdefizit.LobKomplimenteAnnehmen]: 'Lob und Komplimente annehmen',
} as const satisfies Record<FormTypes.SozialesInteraktionsdefizit, string>;

/** 6. Substanzabhängigkeit-Faktoren */
export const SUBSTANZABHAENGIGKEIT_FAKTOR_LABELS = {
  [FormTypes.SubstanzabhaengigkeitFaktor.Craving]: 'Craving',
  [FormTypes.SubstanzabhaengigkeitFaktor.Toleranzentwicklung]: 'Toleranzentwicklung',
  [FormTypes.SubstanzabhaengigkeitFaktor.Entzugssymptome]: 'Entzugssymptome',
  [FormTypes.SubstanzabhaengigkeitFaktor.KonditionierteAusloeser]: 'Konditionierte Auslöser durch Substanz',
  [FormTypes.SubstanzabhaengigkeitFaktor.PositiveVerstaerkungSubstanz]: 'Positive Verstärkung durch Substanz (z.B. Rauschgefühl)',
  [FormTypes.SubstanzabhaengigkeitFaktor.NegativeVerstaerkungSubstanz]: 'Negative Verstärkung durch Substanz (z.B. Symptomlinderung, Stressbewältigung)',
  [FormTypes.SubstanzabhaengigkeitFaktor.SozialeVerstaerkung]: 'Soziale Verstärkung (Gruppenzugehörigkeit, sozialer Druck)',
} as const satisfies Record<FormTypes.SubstanzabhaengigkeitFaktor, string>;

/** 7. Krankheitsgewinn - Primär (Internale Funktionalität) */
export const PRIMAERER_KRANKHEITSGEWINN_LABELS = {
  [FormTypes.PrimaererKrankheitsgewinn.StabilisierungSelbstwertgefuehl]: 'Stabilisierung des Selbstwertgefühls',
  [FormTypes.PrimaererKrankheitsgewinn.Identitaetssicherung]: 'Identitätssicherung / Aufrechterhaltung eines Selbstbildes',
  [FormTypes.PrimaererKrankheitsgewinn.Unlustvermeidung]: 'Unlustvermeidung (Abwehr von Affekten und Stimmungen wie Scham, Trauer, Wut)',
  [FormTypes.PrimaererKrankheitsgewinn.Selbststimulation]: 'Selbststimulation',
} as const satisfies Record<FormTypes.PrimaererKrankheitsgewinn, string>;

/** 7. Krankheitsgewinn - Sekundär (Externale Funktionalität) */
export const SEKUNDAERER_KRANKHEITSGEWINN_LABELS = {
  [FormTypes.SekundaererKrankheitsgewinn.ZuwendungAufmerksamkeit]: 'Zuwendung und Aufmerksamkeit',
  [FormTypes.SekundaererKrankheitsgewinn.Bindungsabsicherung]: 'Bindungsabsicherung',
  [FormTypes.SekundaererKrankheitsgewinn.Abgrenzung]: 'Abgrenzung',
  [FormTypes.SekundaererKrankheitsgewinn.KontrolleSozialesUmfeld]: 'Kontrolle über soziales Umfeld (z.B. Partner, Familie, Freunde)',
  [FormTypes.SekundaererKrankheitsgewinn.Anstrengungsvermeidung]: 'Anstrengungsvermeidung und Aufgabenentlastung',
  [FormTypes.SekundaererKrankheitsgewinn.SozialeVorteile]: 'Erreichen von sozialen Vorteilen (Rente und Versicherung)',
} as const satisfies Record<FormTypes.SekundaererKrankheitsgewinn, string>;

// ============================================================================
// STÖRUNGSSPEZIFISCHE MODELLE LABELS
// ============================================================================

/** Störungsmodell Typ Labels */
export const STOERUNGSMODELL_TYP_LABELS = {
  [FormTypes.StoerungsmodellTyp.VerstaerkerVerlustDepression]: 'Verstärker-Verlust Modell der Depression (Lewinson, 1974)',
  [FormTypes.StoerungsmodellTyp.ErlernteHilflosigkeit]: 'Modell der erlernten Hilflosigkeit bei chronischer Depression (Seligman, 1975)',
  [FormTypes.StoerungsmodellTyp.KognitionstheoretischDepression]: 'Kognitionstheoretisches Erklärungsmodell der Depression (Beck, 1976)',
  [FormTypes.StoerungsmodellTyp.TeufelskreisAngst]: 'Kognitiv-behaviorales Teufelskreismodell der Angst (Margraf & Schneider, 2008)',
  [FormTypes.StoerungsmodellTyp.TeufelskreisZwangserkrankung]: 'Kognitiv-behaviorales Teufelskreismodell der Zwangserkrankung (Lakatos & Reinecker, 2016)',
  [FormTypes.StoerungsmodellTyp.TeufelskreisZwangshandlungen]: 'Kognitiv-behaviorales Teufelskreismodell der Zwangshandlungen',
  [FormTypes.StoerungsmodellTyp.TeufelskreisBulimie]: 'Kognitiv-behaviorales Teufelskreismodell der Bulimie',
  [FormTypes.StoerungsmodellTyp.ZweiFaktorenZwang]: 'Zwei-Faktoren Modell der Zwangserkrankung (Mowrer)',
  [FormTypes.StoerungsmodellTyp.DreiFaktorenGAS]: 'Drei-Faktoren-Modell der Generalisierten Angststörung',
  [FormTypes.StoerungsmodellTyp.KognitivSozialePhobie]: 'Kognitives Modell der sozialen Phobie (Clark & Wells, 1995)',
  [FormTypes.StoerungsmodellTyp.BiopsychosozialBorderline]: 'Biopsychosoziales Modell der Borderline-Persönlichkeitsstörung',
  [FormTypes.StoerungsmodellTyp.FreitextModell]: 'Eigenes Modell (Freitext)',
} as const satisfies Record<FormTypes.StoerungsmodellTyp, string>;

/** Störungsmodell Zuordnung Labels */
export const STOERUNGSMODELL_ZUORDNUNG_LABELS = {
  [FormTypes.StoerungsmodellZuordnung.Praedisponierend]: 'Prädisponierende Faktoren',
  [FormTypes.StoerungsmodellZuordnung.Ausloesend]: 'Auslösende Bedingungen',
  [FormTypes.StoerungsmodellZuordnung.Aufrechterhaltend]: 'Aufrechterhaltende Bedingungen',
} as const satisfies Record<FormTypes.StoerungsmodellZuordnung, string>;

// ============================================================================
// KAPITEL 6: BEHANDLUNGSPLAN UND PROGNOSE LABELS
// ============================================================================

// ----------------------------------------------------------------------------
// A. THERAPIEZIELE (Berner Inventar für Therapieziele)
// ----------------------------------------------------------------------------

/** Depressives Erleben - Therapieziele */
export const THERAPIEZIEL_DEPRESSIVES_ERLEBEN_LABELS = {
  [FormTypes.TherapiezielDepressivesErleben.NegativeGedanken]: 'Besserer Umgang mit negativen Gedanken',
  [FormTypes.TherapiezielDepressivesErleben.Gruebeln]: 'Besserer Umgang mit kreisenden Gedanken/Grübeln',
  [FormTypes.TherapiezielDepressivesErleben.Schuldgefuehle]: 'Überwindung und Verarbeitung von Schuldgefühlen',
  [FormTypes.TherapiezielDepressivesErleben.EmotionaleStabilitaet]: 'Förderung der emotionalen Stabilität durch Reduktion von depressiver Stimmung, Traurigkeit und Gefühlen innerer Leere',
  [FormTypes.TherapiezielDepressivesErleben.PositiveAffekte]: 'Stärkung positiver Affekte und innerer Ausgeglichenheit',
  [FormTypes.TherapiezielDepressivesErleben.GruebelReduktion]: 'Reduktion von Grübeln',
  [FormTypes.TherapiezielDepressivesErleben.Emotionsregulation]: 'Verbesserung der Emotionsregulation, um Stimmungsschwankungen angemessen zu bewältigen',
  [FormTypes.TherapiezielDepressivesErleben.AntriebEnergie]: 'Steigerung von Antrieb und Energie zur Wiederherstellung einer stabilen Handlungsfähigkeit',
  [FormTypes.TherapiezielDepressivesErleben.Selbstwert]: 'Strategien zur Förderung des Selbstwertes und -gefühls',
} as const satisfies Record<FormTypes.TherapiezielDepressivesErleben, string>;

/** Selbstverletzendes Verhalten und Suizidalität */
export const THERAPIEZIEL_SELBSTVERLETZEN_LABELS = {
  [FormTypes.TherapiezielSelbstverletzen.ReduktionSelbstschaedigung]: 'Reduktion selbstschädigender Handlungen (z.B. Schneiden, Brennen, Ritzen)',
  [FormTypes.TherapiezielSelbstverletzen.AlternativeBewaeltigungsstrategien]: 'Aufbau von alternativen funktionalen Bewältigungsstrategien im Umgang mit Anspannung',
  [FormTypes.TherapiezielSelbstverletzen.UeberwindungSuizidaleGedanken]: 'Überwindung suizidaler Gedanken und Stärkung des Lebenswillens',
  [FormTypes.TherapiezielSelbstverletzen.ChronischeSuizidalitaet]: 'Umgang mit chronischer Suizidalität',
} as const satisfies Record<FormTypes.TherapiezielSelbstverletzen, string>;

/** Ängste */
export const THERAPIEZIEL_AENGSTE_LABELS = {
  [FormTypes.TherapiezielAengste.BewaeltigungSpezifischeAengste]: 'Bewältigung spezifischer Ängste',
  [FormTypes.TherapiezielAengste.EmotionaleKognitiveBehaviorale]: 'Verbesserung der emotionalen/kognitiven/behavioralen Strategien im Umgang mit Ängsten',
  [FormTypes.TherapiezielAengste.ReduktionPanikattacken]: 'Reduktion von Panikattacken',
  [FormTypes.TherapiezielAengste.SozialeKompetenz]: 'Förderung von Sicherheit und sozialer Kompetenz im Umgang mit anderen Menschen',
  [FormTypes.TherapiezielAengste.WiederaufnahmeAktivitaeten]: 'Wiederaufnahme von Aktivitäten, die aufgrund von Ängsten vermieden werden',
  [FormTypes.TherapiezielAengste.DiffuseAengste]: 'Umgang mit diffusen Ängsten und Reduktion von dysfunktionalem Sich-Sorgen-machen',
  [FormTypes.TherapiezielAengste.AbbauVermeidungsverhalten]: 'Abbau von Vermeidungsverhalten',
} as const satisfies Record<FormTypes.TherapiezielAengste, string>;

/** Zwanghafte Gedanken und Handlungen */
export const THERAPIEZIEL_ZWAENGE_LABELS = {
  [FormTypes.TherapiezielZwaenge.KontrolleIntrusiveGedanken]: 'Verbesserung der Kontrolle über quälende/intrusive Gedanken und Impulse',
  [FormTypes.TherapiezielZwaenge.EinschraenkungZwangshandlungen]: 'Einschränkung wiederholter, nicht zielführender und zeitraubender Handlungen (z.B. übermäßiges Händewaschen, Ordnen, Kontrollieren, Zählen)',
} as const satisfies Record<FormTypes.TherapiezielZwaenge, string>;

/** Traumatische oder belastende Lebensereignisse */
export const THERAPIEZIEL_TRAUMA_LABELS = {
  [FormTypes.TherapiezielTrauma.VerarbeitungTraumatischeErlebnisse]: 'Verarbeitung traumatischer Erlebnisse',
  [FormTypes.TherapiezielTrauma.VerarbeitungBelastendeEreignisse]: 'Verarbeitung belastender Lebensereignisse',
} as const satisfies Record<FormTypes.TherapiezielTrauma, string>;

/** Suchtverhalten */
export const THERAPIEZIEL_SUCHT_LABELS = {
  [FormTypes.TherapiezielSucht.SuchtmittelfreiesLeben]: 'Erlernen eines suchtmittelfreien Lebens',
  [FormTypes.TherapiezielSucht.KontrolleSubstanzkonsum]: 'Verbesserung der Kontrolle über den Substanzkonsum',
  [FormTypes.TherapiezielSucht.AlternativeBewaeltigung]: 'Entwicklung alternativer funktionaler Bewältigungsstrategien in belastenden Situationen',
} as const satisfies Record<FormTypes.TherapiezielSucht, string>;

/** Essverhalten */
export const THERAPIEZIEL_ESSVERHALTEN_LABELS = {
  [FormTypes.TherapiezielEssverhalten.BewaeltigungDysfunktional]: 'Bewältigung von dysfunktionalem Essverhalten',
  [FormTypes.TherapiezielEssverhalten.UmgangGewicht]: 'Verbesserung des Umgangs mit dem eigenen Gewicht',
  [FormTypes.TherapiezielEssverhalten.AkzeptanzSelbstwertStrategien]: 'Erlernen von akzeptanzbasierten und selbstwertaufbauenden Strategien',
} as const satisfies Record<FormTypes.TherapiezielEssverhalten, string>;

/** Schlaf */
export const THERAPIEZIEL_SCHLAF_LABELS = {
  [FormTypes.TherapiezielSchlaf.ReduktionSchlafstoerungen]: 'Reduktion von Schlafstörungen (Ein- und Durchschlafstörungen, frühes Erwachen)',
  [FormTypes.TherapiezielSchlaf.SchlafhygieneGewohnheiten]: 'Verbesserte Schlafhygiene und -gewohnheiten',
} as const satisfies Record<FormTypes.TherapiezielSchlaf, string>;

/** Sexualität */
export const THERAPIEZIEL_SEXUALITAET_LABELS = {
  [FormTypes.TherapiezielSexualitaet.BewaeltigungSexuelleFunktionsstoerungen]: 'Bewältigung sexueller Funktionsstörungen oder Probleme',
} as const satisfies Record<FormTypes.TherapiezielSexualitaet, string>;

/** Körperliche Schmerzen und Krankheiten */
export const THERAPIEZIEL_KOERPERLICH_LABELS = {
  [FormTypes.TherapiezielKoerperlich.UmgangSchmerzen]: 'Verbesserung des Umgangs mit körperlichen Schmerzen oder Reduktion dieser',
  [FormTypes.TherapiezielKoerperlich.Krankheitsverarbeitung]: 'Förderung der Krankheitsverarbeitung/Krankheitsbewältigung/Krankheitsakzeptanz bei chronischen oder akuten Erkrankungen',
} as const satisfies Record<FormTypes.TherapiezielKoerperlich, string>;

/** Schwierigkeiten in bestimmten Lebensbereichen */
export const THERAPIEZIEL_LEBENSBEREICHE_LABELS = {
  [FormTypes.TherapiezielLebensbereiche.KlaerungWohnsituation]: 'Klärung von Wohnsituation',
  [FormTypes.TherapiezielLebensbereiche.BewaeltigungArbeitStudium]: 'Bewältigung von Problemen im Arbeits-, Studiums- oder Ausbildungsumfeld',
  [FormTypes.TherapiezielLebensbereiche.Alltagsorganisation]: 'Verbesserung der Alltagsorganisation',
  [FormTypes.TherapiezielLebensbereiche.ReduktionProkrastination]: 'Reduktion von Prokrastination',
} as const satisfies Record<FormTypes.TherapiezielLebensbereiche, string>;

/** Stress */
export const THERAPIEZIEL_STRESS_LABELS = {
  [FormTypes.TherapiezielStress.Stressbewaeltigung]: 'Verbesserung der Stressbewältigung',
  [FormTypes.TherapiezielStress.CopingstrategienStress]: 'Entwicklung angemessener Copingstrategien bei Stress',
} as const satisfies Record<FormTypes.TherapiezielStress, string>;

/** Partnerschaft */
export const THERAPIEZIEL_PARTNERSCHAFT_LABELS = {
  [FormTypes.TherapiezielPartnerschaft.VerbesserungPaarbeziehung]: 'Verbesserung der bestehenden Paarbeziehung',
  [FormTypes.TherapiezielPartnerschaft.SexuelleBeziehungsgestaltung]: 'Verbesserung der sexuellen Beziehungsgestaltung mit eigenem Partner/eigener Partnerin',
  [FormTypes.TherapiezielPartnerschaft.KlaerungErwartungenGefuehle]: 'Klärung von eigenen Erwartungen und Gefühlen in der Partnerschaft',
} as const satisfies Record<FormTypes.TherapiezielPartnerschaft, string>;

/** Elternschaft und aktuelle Familie */
export const THERAPIEZIEL_ELTERNSCHAFT_LABELS = {
  [FormTypes.TherapiezielElternschaft.ZutrauenElternrolle]: 'Fähigkeiten erlernen, um mehr Zutrauen in der eigenen Mutterrolle/Vaterrolle zu gewinnen',
  [FormTypes.TherapiezielElternschaft.BeziehungKinder]: 'Verbesserung der Beziehung zu eigenem Kind/eigenen Kindern',
  [FormTypes.TherapiezielElternschaft.FamiliaereSituation]: 'Förderung einer positiven Veränderung in der familiären Situation',
  [FormTypes.TherapiezielElternschaft.AbloeseEltern]: 'Förderung von Ablöseprozess von Eltern',
  [FormTypes.TherapiezielElternschaft.SchuldgefuehleElternKinder]: 'Verarbeitung von Schuldgefühlen gegenüber eigenen Eltern/Kindern',
  [FormTypes.TherapiezielElternschaft.KonflikteArbeitAusbildung]: 'Erlernen von Fähigkeiten im Umgang mit Konflikten im Bereich der eigenen Arbeit/der eigenen Ausbildung/des eigenen Studiums',
} as const satisfies Record<FormTypes.TherapiezielElternschaft, string>;

/** Alleinsein und Trauer */
export const THERAPIEZIEL_ALLEINSEIN_LABELS = {
  [FormTypes.TherapiezielAlleinsein.UmgangAlleinsein]: 'Verbesserung von Umgang mit Alleinsein',
  [FormTypes.TherapiezielAlleinsein.VerarbeitungTrennungVerlust]: 'Verarbeitung von Trennung/Scheidung/Verlust von Partner/Partnerin',
} as const satisfies Record<FormTypes.TherapiezielAlleinsein, string>;

/** Selbstbehauptung und Abgrenzung */
export const THERAPIEZIEL_SELBSTBEHAUPTUNG_LABELS = {
  [FormTypes.TherapiezielSelbstbehauptung.Durchsetzungsvermoegen]: 'Verbesserung des eigenen Durchsetzungsvermögens',
  [FormTypes.TherapiezielSelbstbehauptung.AbgrenzungProblematischeBeziehungen]: 'Erlernen von Fähigkeiten zur Abgrenzung von problematischen Beziehungen/Situationen',
  [FormTypes.TherapiezielSelbstbehauptung.UmgangReaktionenAnderer]: 'Verbesserung von Umgang mit Reaktionen anderer (Kritik, Ablehnung, Lob, etc.)',
  [FormTypes.TherapiezielSelbstbehauptung.AbbruchDysfunktionaleKontakte]: 'Erlernen von Fähigkeiten zum Abbruch von dysfunktionalen sozialen Kontakten',
} as const satisfies Record<FormTypes.TherapiezielSelbstbehauptung, string>;

/** Kontakt und Nähe */
export const THERAPIEZIEL_KONTAKT_NAEHE_LABELS = {
  [FormTypes.TherapiezielKontaktNaehe.AufnahmeAufrechterhaltungKontakte]: 'Erlernen von Fähigkeiten zur Aufnahme, Pflege und Aufrechterhaltung von sozialen Kontakten',
  [FormTypes.TherapiezielKontaktNaehe.NaeheVertrauen]: 'Erlernen von Fähigkeiten, um Nähe zuzulassen und Vertrauen zu anderen Menschen aufbauen zu können',
  [FormTypes.TherapiezielKontaktNaehe.VorbereitungPartnerschaft]: 'Vorbereitung auf eine neue Partnerschaft',
} as const satisfies Record<FormTypes.TherapiezielKontaktNaehe, string>;

/** Bewegung und Aktivität */
export const THERAPIEZIEL_BEWEGUNG_LABELS = {
  [FormTypes.TherapiezielBewegung.MehrSportKoerperlich]: 'Mehr Sport und andere körperliche Aktivitäten betreiben',
  [FormTypes.TherapiezielBewegung.AktivereFreizeitgestaltung]: 'Aktivere Freizeitgestaltung (Hobbies, kulturelle Aktivitäten)',
} as const satisfies Record<FormTypes.TherapiezielBewegung, string>;

/** Entspannung und Gelassenheit */
export const THERAPIEZIEL_ENTSPANNUNG_LABELS = {
  [FormTypes.TherapiezielEntspannung.AnspannungsreduktionAchtsamkeit]: 'Erlernen von Fähigkeiten zur Anspannungsreduktion und achtsamer Grundhaltung',
  [FormTypes.TherapiezielEntspannung.Gelassenheit]: 'Erlernen von Fähigkeiten, um Dinge und Situationen mit mehr Gelassenheit zu begegnen',
} as const satisfies Record<FormTypes.TherapiezielEntspannung, string>;

/** Wohlbefinden */
export const THERAPIEZIEL_WOHLBEFINDEN_LABELS = {
  [FormTypes.TherapiezielWohlbefinden.MehrLebensfreude]: 'Entwicklung von mehr Lebensfreude',
  [FormTypes.TherapiezielWohlbefinden.WohlerImKoerper]: 'Erlernen von Fähigkeiten, sich im eigenen Körper wohler zu fühlen',
} as const satisfies Record<FormTypes.TherapiezielWohlbefinden, string>;

/** Vergangenheit, Gegenwart und Zukunft */
export const THERAPIEZIEL_ZEITPERSPEKTIVE_LABELS = {
  [FormTypes.TherapiezielZeitperspektive.UmgangVergangenheit]: 'Verbesserung von Umgang mit Teilen der eigenen Vergangenheit',
  [FormTypes.TherapiezielZeitperspektive.AkzeptanzVergangenheit]: 'Erlernen von Akzeptanzstrategien bezogen auf die eigene Vergangenheit',
  [FormTypes.TherapiezielZeitperspektive.NeueZukunftsperspektiven]: 'Erarbeiten von neuen Zukunftsperspektiven (private oder berufliche)',
} as const satisfies Record<FormTypes.TherapiezielZeitperspektive, string>;

/** Sinnfindung und Identitätsfindung */
export const THERAPIEZIEL_SINNFINDUNG_LABELS = {
  [FormTypes.TherapiezielSinnfindung.KlaerungSinnfragen]: 'Klärung von Sinnfragen im eigenen Leben',
  [FormTypes.TherapiezielSinnfindung.Identitaetsfindung]: 'Arbeit an der eigenen Identitätsfindung: Identitätsfragen (Wer bin ich?), eigene Wünsche, Lebensziele, Perspektiven',
} as const satisfies Record<FormTypes.TherapiezielSinnfindung, string>;

/** Einstellung zum Selbst */
export const THERAPIEZIEL_SELBSTEINSTELLUNG_LABELS = {
  [FormTypes.TherapiezielSelbsteinstellung.SelbstvertrauenSelbstsicherheit]: 'Entwicklung von mehr Selbstvertrauen und Selbstsicherheit',
  [FormTypes.TherapiezielSelbsteinstellung.AkzeptanzEigenePerson]: 'Akzeptanz der eigenen Person als Ganzes',
} as const satisfies Record<FormTypes.TherapiezielSelbsteinstellung, string>;

/** Bedürfnisse und Wünsche */
export const THERAPIEZIEL_BEDUERFNISSE_LABELS = {
  [FormTypes.TherapiezielBeduerfnisse.WahrnehmungAusdruckBeduerfnisse]: 'Wahrnehmung und Ausdruck eigener Bedürfnisse',
  [FormTypes.TherapiezielBeduerfnisse.ErkennenEigenerGrenzen]: 'Erkennen eigener Grenzen und eigenes Handeln danach ausrichten',
  [FormTypes.TherapiezielBeduerfnisse.VerwirklichungWuenschePlaene]: 'Erlernen von Fähigkeiten, eigene Wünsche und Pläne besser verwirklichen zu können',
} as const satisfies Record<FormTypes.TherapiezielBeduerfnisse, string>;

/** Leistung, Kontrolle und Verantwortung */
export const THERAPIEZIEL_LEISTUNG_LABELS = {
  [FormTypes.TherapiezielLeistung.SelbstaendigerEntscheidungen]: 'Lernen, Entscheidungen selbstständiger zu treffen',
  [FormTypes.TherapiezielLeistung.AngefangenesBeenden]: 'Lernen, Angefangenes zu Ende zu führen',
  [FormTypes.TherapiezielLeistung.AnsprueheHerabsetzen]: 'Eigene hohe Ansprüche an sich selbst oder an andere herabsetzen',
  [FormTypes.TherapiezielLeistung.VerantwortungKontrolleAbgeben]: 'Verantwortung und Kontrolle abgeben lernen',
  [FormTypes.TherapiezielLeistung.ReduktionPerfektionismus]: 'Reduktion von Perfektionismus',
} as const satisfies Record<FormTypes.TherapiezielLeistung, string>;

/** Umgang mit Gefühlen */
export const THERAPIEZIEL_GEFUEHLE_LABELS = {
  [FormTypes.TherapiezielGefuehle.GefuehleZulassenAeussern]: 'Eigene Gefühle zulassen und äußern lernen',
  [FormTypes.TherapiezielGefuehle.UmgangNegativeGefuehle]: 'Umgang mit starken negativen Gefühlen (z.B. Ärger, Wutausbrüchen)',
} as const satisfies Record<FormTypes.TherapiezielGefuehle, string>;

// ----------------------------------------------------------------------------
// B. BEHANDLUNGSPLAN MIT BEHANDLUNGSTECHNIKEN
// ----------------------------------------------------------------------------

/** 1. Allgemeine und störungsspezifische Interventionen */
export const ALLGEMEINE_INTERVENTION_LABELS = {
  [FormTypes.AllgemeineIntervention.MotivoriertBeziehungsgestaltung]: 'Aufbau einer vertrauensvollen und sicheren Beziehung mit Methoden der motivorientierten Beziehungsgestaltung',
  [FormTypes.AllgemeineIntervention.VerhaltenstherapeutischesGenesemodell]: 'Entwicklung eines verhaltenstherapeutischen Genesemodells/Störungsmodells unter Einbezug wesentlicher lebensgeschichtlicher Bedingungen und aktueller Belastungsfaktoren',
  [FormTypes.AllgemeineIntervention.KognitivesBelastungsreduktion]: 'Im Sinne der Belastungsreduktion: kognitives und klärungsorientiertes Vorgehen in Bezug auf die zugrunde liegenden Konflikte bzw. aufrechterhaltenden Bedingungen',
  [FormTypes.AllgemeineIntervention.Problemloesen]: 'Vermittlung von Strategien zum Problemlösen (Problemlösetraining) in Bezug auf die problematischen Lebenssituationen und Erarbeitung funktionaler Verhaltensweisen',
  [FormTypes.AllgemeineIntervention.AkzeptanzAchtsamkeitsstrategien]: 'Vermittlung von Akzeptanz- und Achtsamkeitsstrategien in Bezug auf nicht (ausreichend) veränderbare Bereiche',
  [FormTypes.AllgemeineIntervention.KlaerungsorientierteBiografisch]: 'Klärungsorientierte Bearbeitung von belastenden biografischen Erfahrungen mithilfe von narrativen, emotionsaktivierenden und imaginativen Methoden; Bearbeitung daraus resultierender Annahmen',
  [FormTypes.AllgemeineIntervention.SozialeFertigkeitenTraining]: 'Konkrete Überprüfung des Ausmaßes der sozialen Fertigkeiten und Training gezielter Fähigkeiten anhand von Psychoedukation und Rollenspielen mit Videofeedback',
  [FormTypes.AllgemeineIntervention.SelbstwertSelbstakzeptanz]: 'Verbesserung des Selbstwertgefühls und der Selbstakzeptanz durch Übungen zum Aufbau selbstfürsorglichen Verhaltens und Bearbeitung selbstwertschädlicher Grundannahmen',
  [FormTypes.AllgemeineIntervention.ProgressiveMuskelentspannung]: 'Unterstützung beim selbstständigen Einüben von Progressiver Muskelentspannung im Sinne einer angewandten Entspannung zur Reduktion vegetativer Anspannung',
  [FormTypes.AllgemeineIntervention.RueckfallplanRezidivprophylaxe]: 'Erarbeitung eines multimodalen Rückfallplans und von Strategien zur Rezidivprophylaxe',
  [FormTypes.AllgemeineIntervention.LebenszielZielWertKlaerung]: 'Entwicklung von Lebenszielen und Lebensperspektiven mit Methoden der Ziel-Wert-Klärung',
} as const satisfies Record<FormTypes.AllgemeineIntervention, string>;

/** 2. Affektive Störungen: Unipolare Depression */
export const DEPRESSION_INTERVENTION_LABELS = {
  [FormTypes.DepressionIntervention.PsychoedukationDepression]: 'Psychoedukation bezüglich der depressiven Symptomatik (u.a. Zusammenhang zwischen Aktivitäten und Stimmung, Depressionsspirale, kognitive Verzerrungen sensu Beck etc.)',
  [FormTypes.DepressionIntervention.StoerungsverlaufAnalyse]: 'Analyse des bisherigen Störungsverlaufs; Erarbeitung kritischer Situationen bzw. Auslöser im Sinne retrospektiver Verhaltensanalysen',
  [FormTypes.DepressionIntervention.NonSuizidVertragNotfallplan]: 'Abschluss eines Non-Suizid-Vertrages und Entwicklung eines Notfallplans hinsichtlich akuter Suizidalität',
  [FormTypes.DepressionIntervention.MotivationAntidepressiva]: 'Motivation zur Einnahme einer antidepressiven Medikation und Zusammenarbeit mit dem Hausarzt/Psychiater',
  [FormTypes.DepressionIntervention.KognitivesModellDepression]: 'Vermittlung des kognitiven Störungsmodells der Depression (u.a. Zusammenhang Denken, Fühlen, Verhalten; automatische Gedanken, Denkfehler)',
  [FormTypes.DepressionIntervention.DysfunktionaleUmstrukturierung]: 'Identifikation, Bearbeitung und Umstrukturierung der zugrunde liegenden dysfunktionalen Annahmen und Grundüberzeugungen mittels klärungsorientierter Verfahren, Selbstbeobachtung, sokratischer Gesprächsführung und kognitiver Techniken',
  [FormTypes.DepressionIntervention.CBASPBezugspersonen]: 'Erarbeitung einer Liste prägender Bezugspersonen und Ableitung von Prägungen und Übertragungshypothesen im Sinne des CBASP; Durchführung eines interpersonellen Diskriminationstrainings',
  [FormTypes.DepressionIntervention.CBASPSituationsanalysen]: 'Vermittlung interpersoneller Grundlagen (Kiesler-Kreis, Stimulus-Charakter) und Durchführung von Situationsanalysen im Sinne des CBASP',
  [FormTypes.DepressionIntervention.PositiveAktivitaetenWochenplaene]: 'Entwicklung und Erprobung individueller positiver Aktivitäten mittels standardisierter Listen und Wochenplänen; Aufnahme von Aktivitäten, die bisher noch nie gemacht oder vermieden wurden; Aufbau einer Tages- und Wochenstruktur',
  [FormTypes.DepressionIntervention.SchlafinterventionenSchlafhygiene]: 'Durchführung von Interventionen zur Verbesserung des Schlafs (u.a. Psychoedukation zur Schlafhygiene, Schlafrestriktion)',
} as const satisfies Record<FormTypes.DepressionIntervention, string>;

/** 3. Affektive Störungen: Bipolare Störung */
export const BIPOLARE_INTERVENTION_LABELS = {
  [FormTypes.BipolareIntervention.DepressiveVerhaltensaktivierung]: 'Behandlung der depressiven Symptomatik mit Schwerpunkt auf behaviorale Methoden: werteorientierte Verhaltensaktivierung, metakognitive Therapie des Grübelns, Einüben von Situationsanalysen und Ableiten günstiger Strategien',
  [FormTypes.BipolareIntervention.PsychoedukationBipolar]: 'Psychoedukation zur bipolaren Störung',
  [FormTypes.BipolareIntervention.MotivationalInterviewing]: 'Bearbeitung der Behandlungsmotivation durch Methoden des Motivational Interviewing',
  [FormTypes.BipolareIntervention.Stimmungstagebuch]: 'Etablierung eines Stimmungstagebuchs',
  [FormTypes.BipolareIntervention.Fruehwarnzeichen]: 'Erarbeitung von Frühwarnzeichen und günstigen Strategien',
  [FormTypes.BipolareIntervention.KognitiveTherapieDepressivManisch]: 'Kognitive Therapie der dysfunktionalen Kognitionen in depressiven und manischen Phasen: Erkennen von kognitiven Verzerrungen, empirische/pragmatische Analyse',
  [FormTypes.BipolareIntervention.AusgewogenerLebensstil]: 'Etablierung eines ausgewogenen Lebensstils',
  [FormTypes.BipolareIntervention.ProblemloeseTrainingBipolar]: 'Umgang mit schwierigen Situationen, Problemlösetraining',
  [FormTypes.BipolareIntervention.AchtsamkeitsuebungenBipolar]: 'Steigerung der Wahrnehmung eigener Emotionen und des eigenen Befindens durch Achtsamkeitsübungen',
  [FormTypes.BipolareIntervention.Emotionsregulationsstrategien]: 'Entwicklung von Strategien zur Emotionsregulation',
} as const satisfies Record<FormTypes.BipolareIntervention, string>;

/** 4. Angststörungen */
export const ANGST_INTERVENTION_LABELS = {
  [FormTypes.AngstIntervention.PsychoedukationAngst]: 'Psychoedukation bezüglich der Angstsymptomatik (u.a. psychophysiologische Grundlagen; die drei Komponenten der Angst; Stressmodell)',
  [FormTypes.AngstIntervention.StoerungsverlaufAngst]: 'Analyse des bisherigen Störungsverlaufs; Erarbeitung kritischer Situationen bzw. Auslöser im Sinne retrospektiver Verhaltensanalysen',
  [FormTypes.AngstIntervention.StoerungsmodellSozialeAengste]: 'Erarbeitung eines Störungsmodells der sozialen Ängste und Vermittlung eines kognitiven Störungsmodells (nach Clark); Vermittlung grundlegender Konzepte (Selbstaufmerksamkeit, Sicherheitsverhalten)',
  [FormTypes.AngstIntervention.KognitiveUmstrukturierungAngst]: 'Identifikation, Bearbeitung und Umstrukturierung der beschriebenen angstverstärkenden, dysfunktionalen Annahmen und Grundüberzeugungen mittels klärungsorientierter Verfahren, Selbstbeobachtung, sokratischer Gesprächsführung und kognitiver Techniken',
  [FormTypes.AngstIntervention.InterozeptiveExposition]: 'Interozeptive Exposition (z.B. Hyperventilationstest) und Vermittlung von bewältigungsorientierten Interventionen (u.a. Atemtechniken, Panikregeln)',
  [FormTypes.AngstIntervention.ExpositionsrationalAngsthierarchie]: 'Vermittlung des Expositionsrationals, Erstellung einer Angsthierarchie und Ausarbeitung von Plänen zur (gestuften oder massierten) Reizkonfrontation; Durchführung von In-vivo-Expositionen mit angstauslösenden Situationen',
  [FormTypes.AngstIntervention.AbbauSicherheitsverhalten]: 'Planung und Durchführung von Übungen zum Abbau von Sicherheitsverhaltensweisen im Sinne von Expositionsübungen mit Realitätsüberprüfung',
  [FormTypes.AngstIntervention.AngewandteEntspannungAngst]: 'Unterstützung beim selbstständigen Einüben von Progressiver Muskelentspannung im Sinne einer angewandten Entspannung zur Reduktion vegetativer Anspannung',
} as const satisfies Record<FormTypes.AngstIntervention, string>;

/** 5. Borderline Persönlichkeitsstörung */
export const BORDERLINE_INTERVENTION_LABELS = {
  [FormTypes.BorderlineIntervention.DiagnoseDBTPrinzipien]: 'Ermittlung der Diagnose Borderline-Persönlichkeitsstörung und Grundprinzipien der Dialektisch-Behavioralen Therapie',
  [FormTypes.BorderlineIntervention.DiaryCard]: 'Selbstbeobachtung hinsichtlich emotionaler Anspannung und dysfunktionaler Verhaltensweisen mittels Tagebuch (Diary-Card)',
  [FormTypes.BorderlineIntervention.EmotionsregulationSkills]: 'Vermittlung von Fertigkeiten zur Emotionsregulation, insbesondere Spannungsregulation und Stresstoleranz, mittels individuell angepasstem Skillstraining',
  [FormTypes.BorderlineIntervention.UmgangGefuehleZwischenmenschlich]: 'Vermittlung von Fertigkeiten im Zusammenhang mit dem Umgang mit Gefühlen und zwischenmenschlichen Fertigkeiten (z.B. Umgang mit Konflikten, Umgang mit Wut)',
  [FormTypes.BorderlineIntervention.SpannungsregulationStresstoleranz]: 'Vermittlung von Fertigkeiten zur Spannungsregulation und Stresstoleranz (insbesondere zur Vorbeugung dysfunktionaler Verhaltensweisen)',
  [FormTypes.BorderlineIntervention.AchtsamkeitstechnikenDBT]: 'Vermittlung von Techniken der Achtsamkeit',
  [FormTypes.BorderlineIntervention.VerhaltensanalysenProblemloesung]: 'Einführung in und Durchführung von Verhaltensanalysen in Bezug auf das Problemverhalten; Erarbeitung alternativer Problemlösungen und Anleitung zum Einsatz von Skills im alltäglichen Leben',
  [FormTypes.BorderlineIntervention.KognitiveVerfahrenBPD]: 'Erarbeitung und Umstrukturierung problemrelevanter Kognitionen mittels kognitiver Verfahren',
  [FormTypes.BorderlineIntervention.LebensperspektivenAufbau]: 'Bearbeitung von Problembereichen und Konflikten, die die Lebensqualität beeinträchtigen; Erarbeitung von Lebensperspektiven (z.B. berufliche Perspektiven, Aufbau sozialer Kontakte)',
} as const satisfies Record<FormTypes.BorderlineIntervention, string>;

/** 6. PTBS */
export const PTBS_INTERVENTION_LABELS = {
  [FormTypes.PTBSIntervention.PsychoedukationPTBS]: 'Psychoedukation zur Posttraumatischen Belastungsstörung und Vermittlung der Diagnose; Normalisierung der beschriebenen Symptome',
  [FormTypes.PTBSIntervention.KlaerungsorientierteBiografischPTBS]: 'Klärungsorientierte Bearbeitung belastender biografischer Erfahrungen mithilfe narrativer, emotionsaktivierender und imaginativer Methoden; Bearbeitung daraus resultierender Annahmen',
  [FormTypes.PTBSIntervention.FertigkeitenEmotionsregulationPTBS]: 'Vermittlung von Fertigkeiten zur Emotionsregulation, insbesondere Spannungsregulation und Stresstoleranz, mittels individuell angepasstem Skillstraining; Vermittlung von Techniken der Achtsamkeit',
  [FormTypes.PTBSIntervention.KognitiveVerfahrenPTBS]: 'Erarbeitung und Umstrukturierung problemrelevanter Kognitionen und Annahmen mittels kognitiver Verfahren',
  [FormTypes.PTBSIntervention.JuristischeAuseinandersetzungen]: 'Ermutigung zur und Begleitung bei juristischen Auseinandersetzungen',
  [FormTypes.PTBSIntervention.DifferenzierungBedrohung]: 'Differenzierung zwischen „realen Anteilen" und „übertriebenen Anteilen" der Bedrohung; Abbau von „übertriebenen" Vorsichtsmaßnahmen und Befürchtungen durch sokratische Gesprächsführung und Verhaltensexperimente',
  [FormTypes.PTBSIntervention.InVivoExpositionPTBS]: 'Durchführung von In-vivo-Expositionen mit vermiedenen bzw. traumaassoziierten Situationen',
  [FormTypes.PTBSIntervention.BeziehungsKlaerungPTBS]: 'Klärung von Beziehungen zu Verwandten und Bekannten',
  [FormTypes.PTBSIntervention.BiografischeAufarbeitung]: 'Biografische Aufarbeitung problematischer Lebensbedingungen mittels narrativer Techniken (Narrative Exposition bzw. informelle Exposition)',
  [FormTypes.PTBSIntervention.TraumatherapieBeginn]: 'Bei ausreichender Stabilität: Beginn der Traumatherapie; Bearbeitung mittels imaginativer und narrativer Exposition',
  [FormTypes.PTBSIntervention.EMDR]: 'Durchführung von EMDR in Bezug auf die auslösende Situation',
} as const satisfies Record<FormTypes.PTBSIntervention, string>;

/** 7. Zwangssymptomatik */
export const ZWANG_INTERVENTION_LABELS = {
  [FormTypes.ZwangIntervention.PsychoedukationZwang]: 'Psychoedukation bezüglich der Zwangssymptomatik (Salkovskis Modell, allgemeine Natur von intrusiven Gedanken, neurobiologische Grundlagen etc.)',
  [FormTypes.ZwangIntervention.KognitiveUmstrukturierungZwang]: 'Identifikation, Bearbeitung und Umstrukturierung dysfunktionaler Kognitionen im Sinne der Bedeutungszuschreibung mittels kognitiver Verfahren',
  [FormTypes.ZwangIntervention.AbbauSicherheitsverhaltensZwang]: 'Identifikation und Abbau übertriebener Sicherheitsverhaltensweisen',
  [FormTypes.ZwangIntervention.PartnereinbezugZwang]: 'Einbezug des Partners hinsichtlich Psychoedukation und Vermittlung angemessener Verhaltensweisen (Partner ist stark in das Zwangssystem eingebunden)',
  [FormTypes.ZwangIntervention.ExpositionReaktionsverhinderung]: 'Vermittlung des Expositionsrationals mit Reaktionsverhinderung in vivo; Erstellen einer Zwangshierarchie und Ausarbeitung von Plänen zur (gestuften oder massierten) Reizkonfrontation',
  [FormTypes.ZwangIntervention.ExpositionsuebungenZwang]: 'Durchführung von Übungen zur Exposition mit Reaktionsverhinderung',
  [FormTypes.ZwangIntervention.AbbauRueckversicherungNeutralisierung]: 'Abbau von Rückversicherungsverhalten und Neutralisierungen in Form eines „Verbots" zum Nachfragen (hier Einbezug des Partners)',
  [FormTypes.ZwangIntervention.ExpositionInSensuZwang]: 'Exposition in sensu mit den Zwangsgedanken (z.B. Audiotapes)',
} as const satisfies Record<FormTypes.ZwangIntervention, string>;

/** 8. Somatoforme Störung */
export const SOMATOFORME_INTERVENTION_LABELS = {
  [FormTypes.SomatoformeIntervention.TherapeutischeBeziehungMotivational]: 'Etablierung einer stabilen therapeutischen Beziehung durch motivorientierte Beziehungsgestaltung',
  [FormTypes.SomatoformeIntervention.MotivationalInterviewingSomatoform]: 'Bearbeitung der Behandlungsmotivation durch Methoden des Motivational Interviewing',
  [FormTypes.SomatoformeIntervention.PsychoedukationStress]: 'Psychoedukation zu Stress und Stressbewältigung; Führen von Stressprotokollen',
  [FormTypes.SomatoformeIntervention.PMR]: 'Unterstützung beim eigenständigen Einüben der Progressiven Muskelentspannung',
  [FormTypes.SomatoformeIntervention.AufmerksamkeitsmodulenStrategien]: 'Behandlungsmodul zu Aufmerksamkeit: Erkennen des Einflusses der Aufmerksamkeit, Strategien zur Aufmerksamkeitslenkung',
  [FormTypes.SomatoformeIntervention.AchtsamkeitGenusstraining]: 'Achtsamkeitsübungen, z.B. „Genusstraining"',
  [FormTypes.SomatoformeIntervention.KognitiveTherapieSomatoform]: 'Bearbeitung ungünstiger Kognitionen mit Interventionen der kognitiven Therapie (ABC-Schema, Erarbeiten günstiger Alternativkognitionen)',
  [FormTypes.SomatoformeIntervention.ReduktionKrankheitsverhaltens]: 'Reduktion von Krankheitsverhalten, v.a. Schonverhalten, durch Aktivitätenaufbau',
  [FormTypes.SomatoformeIntervention.FunktionalitaetWerteorientierung]: 'Bearbeitung der Funktionalität der Problematik, Werteorientierung',
  [FormTypes.SomatoformeIntervention.Stressbewaeltigungsstrategien]: 'Stärkung günstiger Strategien zur Stressbewältigung (soziale Unterstützung, Problemlösetraining, Zeitmanagement)',
  [FormTypes.SomatoformeIntervention.RueckfallprophylaxeSomatoform]: 'Rückfallprophylaxe: Strategien bei schwierigen Situationen oder Frühwarnzeichen („Therapy Blueprint")',
} as const satisfies Record<FormTypes.SomatoformeIntervention, string>;

/** 9. Essstörungen: Anorexia Nervosa */
export const ANOREXIE_INTERVENTION_LABELS = {
  [FormTypes.AnorexieIntervention.PsychoedukationEssstoerungen]: 'Psychoedukation (Genese von Essstörungen, Set-Point-Theorie, medizinische Komplikationen und Folgeschäden)',
  [FormTypes.AnorexieIntervention.SelbstbeobachtungEssprotokolle]: 'Einsatz von Selbstbeobachtungs-/Essprotokollen',
  [FormTypes.AnorexieIntervention.AnamnetischeGewichtskurve]: 'Erstellung einer anamnestischen Gewichtskurve zur Analyse des Störungsverlaufs und retrospektiven Verhaltensanalyse',
  [FormTypes.AnorexieIntervention.GewichtskontrolleGewichtskurve]: 'Führen einer Gewichtskurve zur regelmäßigen Gewichtskontrolle',
  [FormTypes.AnorexieIntervention.ZielgewichtVerstaerkerplan]: 'Vereinbarung eines Zielgewichts und Etablierung eines Verstärkerplans zur Unterstützung der Gewichtszunahme',
  [FormTypes.AnorexieIntervention.ZielverhaltenEssensplan]: 'Zielverhalten zur Gewichtszunahme etablieren (Essensplan, Essensregeln, Abbau der „schwarzen Liste", Belohnungen)',
  [FormTypes.AnorexieIntervention.KognitiveTherapieAN]: 'Bearbeitung zugrunde liegender dysfunktionaler Kognitionen mittels kognitiver Therapie (pragmatische/empirische Analyse, ABC-Schema, Einüben hilfreicher Kognitionen)',
  [FormTypes.AnorexieIntervention.KoerperbildstoerungBehandlung]: 'Behandlung der Körperschemastörung durch körperbezogene Übungen',
  [FormTypes.AnorexieIntervention.RueckfallprophylaxeAN]: 'Rückfallprophylaxe (Analyse schwieriger Situationen, Erarbeiten günstiger Strategien, „Therapy Blueprint")',
} as const satisfies Record<FormTypes.AnorexieIntervention, string>;

/** 10. Essstörungen: Bulimia Nervosa */
export const BULIMIE_INTERVENTION_LABELS = {
  [FormTypes.BulimieIntervention.PsychoedukationHeisshunger]: 'Psychoedukation bezüglich Heißhungerattacken (u.a. Zusammenhang zwischen Essverhalten und Heißhungerattacken, Set-Point-Theorie)',
  [FormTypes.BulimieIntervention.VerhaltenstherapeutischesModellBN]: 'Entwicklung eines verhaltenstherapeutischen Genesemodells/Störungsmodells unter Einbezug biografischer und aktueller Faktoren',
  [FormTypes.BulimieIntervention.NormalisierungEssverhalten]: 'Normalisierung des Essverhaltens mithilfe von Nahrungsprotokollen; Aufbau regelmäßiger, ausgewogener und ausreichender Mahlzeiten; Abbau bisher vermiedener Nahrungsmittel („schwarze Liste"); ggf. Vermittlung und Zusammenarbeit mit einer professionellen Ernährungsberatung',
  [FormTypes.BulimieIntervention.SportlicheAktivitaeten]: 'Aufbau von sportlichen Aktivitäten zur Ergänzung der Gewichtsstabilisierung',
  [FormTypes.BulimieIntervention.KorrekturDysfunktionaleBN]: 'Korrektur dysfunktionaler Überzeugungen hinsichtlich des Essens und der Einstellung zu sich selbst',
  [FormTypes.BulimieIntervention.VerhaltensanalysenHeisshunger]: 'Durchführung von Verhaltensanalysen mittels Protokollen von Heißhungerattacken zur Identifikation von Auslösern und Vulnerabilitätsfaktoren',
  [FormTypes.BulimieIntervention.Stimuluskontrolle]: 'Anleitung zur Stimuluskontrolle; Besprechung entsprechender Regeln',
  [FormTypes.BulimieIntervention.FertigkeitenSkillstrainingBN]: 'Vermittlung von Fertigkeiten zur Emotionsregulation, insbesondere Spannungsregulation und Stresstoleranz (insbesondere zur Vorbeugung von Heißhungeranfällen) mittels individuell angepasstem Skillstraining; Vermittlung von Techniken der Achtsamkeit',
  [FormTypes.BulimieIntervention.AlternativeVerhaltensweisenBN]: 'Implementierung alternativer Verhaltensweisen zur Reduktion von Heißhungerattacken; Aktivitätenplanung mittels Aktivitätenliste',
} as const satisfies Record<FormTypes.BulimieIntervention, string>;

/** 11. Psychosen und Wahnsymptomatik */
export const PSYCHOSE_INTERVENTION_LABELS = {
  [FormTypes.PsychoseIntervention.TherapeutischeBeziehungPsychose]: 'Aufbau einer tragfähigen therapeutischen Beziehung durch motivorientierte Beziehungsgestaltung',
  [FormTypes.PsychoseIntervention.IndividuellesErklaerungsmodell]: 'Gemeinsame Erarbeitung eines individuellen Erklärungsmodells',
  [FormTypes.PsychoseIntervention.EntpathologisierenHalluzinationen]: 'Entpathologisieren der Halluzinationen durch Psychoedukation',
  [FormTypes.PsychoseIntervention.OptimierungCopingstrategien]: 'Optimierung der Copingstrategien',
  [FormTypes.PsychoseIntervention.MetakognitivesTraining]: 'Bearbeitung negativer Metakognitionen und wahnhafter Gedanken mithilfe eines metakognitiven Trainings (Uff+)',
  [FormTypes.PsychoseIntervention.KognitiveTherapiePsychose]: 'Vorsichtiges Infragestellen dysfunktionaler Kognitionen durch Methoden der kognitiven Therapie (ABC-Schema, „zu-Ende-Denken", Erkennen von Inkonsistenzen)',
  [FormTypes.PsychoseIntervention.VerhaltensexperimentePsychose]: 'Verhaltensexperimente zum Bearbeiten ungünstiger Annahmen (z.B. Unkontrollierbarkeit der Stimmen)',
  [FormTypes.PsychoseIntervention.KognitiveBearbeitungWahn]: 'Kognitive Bearbeitung der Wahnsymptomatik (Einflussbildung, pragmatische Analyse der Konsequenzen, Erarbeiten alternativer Erklärungen)',
  [FormTypes.PsychoseIntervention.ReduktionSozialerRueckzug]: 'Reduktion des sozialen Rückzugs durch werteorientierten Aktivitätenaufbau und Vermittlung sozialer Fertigkeiten (soziales Kompetenztraining)',
  [FormTypes.PsychoseIntervention.IPTKommunikativ]: 'Aufbau kommunikativer und sozialer Fertigkeiten sowie interpersoneller Problemlösefertigkeiten auf Grundlage des Integrierten psychologischen Therapieprogramms (IPT)',
  [FormTypes.PsychoseIntervention.KognitiveUmstrukturierungBeck]: 'Kognitive Umstrukturierung dysfunktionaler Grundannahmen sensu J. Beck (2013)',
  [FormTypes.PsychoseIntervention.RueckfallprophylaxePsychose]: 'Rückfallprophylaxe (Psychoedukation, Erkennen von Warnsignalen)',
} as const satisfies Record<FormTypes.PsychoseIntervention, string>;

// ----------------------------------------------------------------------------
// C. BEGRÜNDUNG DES SETTINGS
// ----------------------------------------------------------------------------

/** Therapieform Setting */
export const THERAPIEFORM_SETTING_LABELS = {
  [FormTypes.TherapieformSetting.Kurzzeittherapie]: 'Kurzzeittherapie',
  [FormTypes.TherapieformSetting.Langzeittherapie]: 'Langzeittherapie',
} as const satisfies Record<FormTypes.TherapieformSetting, string>;

/** Anzahl Sitzungen */
export const ANZAHL_SITZUNGEN_LABELS = {
  [FormTypes.AnzahlSitzungen.Sitzungen12]: '12 Sitzungen',
  [FormTypes.AnzahlSitzungen.Sitzungen24]: '24 Sitzungen',
  [FormTypes.AnzahlSitzungen.Andere]: 'Andere',
} as const satisfies Record<FormTypes.AnzahlSitzungen, string>;

/** Therapie-Setting */
export const THERAPIE_SETTING_LABELS = {
  [FormTypes.TherapieSetting.Einzeltherapie]: 'Einzeltherapie',
  [FormTypes.TherapieSetting.Gruppentherapie]: 'Gruppentherapie',
  [FormTypes.TherapieSetting.Kombination]: 'Kombination aus Einzeltherapie und Gruppentherapie',
} as const satisfies Record<FormTypes.TherapieSetting, string>;

/** Mitbehandler */
export const MITBEHANDLER_LABELS = {
  [FormTypes.Mitbehandler.Psychiater]: 'Psychiater/Psychiaterin',
  [FormTypes.Mitbehandler.Neurologe]: 'Neurologe/Neurologin',
  [FormTypes.Mitbehandler.Hausarzt]: 'Hausarzt/Hausärztin',
  [FormTypes.Mitbehandler.Andere]: 'Andere',
} as const satisfies Record<FormTypes.Mitbehandler, string>;

// ----------------------------------------------------------------------------
// D. PROGNOSE
// ----------------------------------------------------------------------------

/** Prognostisch günstige Faktoren */
export const PROGNOSTISCH_GUENSTIG_LABELS = {
  [FormTypes.PrognostischGuenstig.HoheTherapiemotivation]: 'Hohe Therapiemotivation und Veränderungsbereitschaft',
  [FormTypes.PrognostischGuenstig.BisherigesEngagement]: 'Bisher gezeigtes Engagement',
  [FormTypes.PrognostischGuenstig.PositiverBehandlungsverlauf]: 'Bisher positiver Behandlungsverlauf',
  [FormTypes.PrognostischGuenstig.TragfaehigeBeziehung]: 'Tragfähige therapeutische Beziehung',
  [FormTypes.PrognostischGuenstig.StabileRahmenbedingungen]: 'Stabile und unterstützende soziale Rahmenbedingungen',
  [FormTypes.PrognostischGuenstig.VorhandeneRessourcen]: 'Vorhandene (finanzielle, soziale, personale) Ressourcen',
  [FormTypes.PrognostischGuenstig.EinsichtIntrospektionsfaehigkeit]: 'Vorhandene Einsichtsfähigkeit und Introspektionsfähigkeit',
  [FormTypes.PrognostischGuenstig.Problembewusstsein]: 'Vorhandenes Problembewusstsein',
  [FormTypes.PrognostischGuenstig.IntelektuelleFaehigkeiten]: 'Gute intellektuelle Fähigkeiten',
  [FormTypes.PrognostischGuenstig.ZuverlaessigesEinlassen]: 'Zuverlässiges Einlassen auf das therapeutische Beziehungsangebot',
  [FormTypes.PrognostischGuenstig.NeueGuenstigeLebensumstaende]: 'Neue prognostisch günstige Lebensumstände',
} as const satisfies Record<FormTypes.PrognostischGuenstig, string>;

/** Prognostisch ungünstige Faktoren */
export const PROGNOSTISCH_UNGUENSTIG_LABELS = {
  [FormTypes.PrognostischUnguenstig.HoheChronifizierung]: 'Hohe Chronifizierung der psychischen Symptome',
  [FormTypes.PrognostischUnguenstig.AbgebrocheneVorbehandlungen]: 'Abgebrochene/erfolglose Vorbehandlungen',
  [FormTypes.PrognostischUnguenstig.UnguenstigeLebensumstaende]: 'Ungünstige Lebensumstände (z.B. körperliche/chronische Erkrankungen)',
  [FormTypes.PrognostischUnguenstig.SozialeIsolation]: 'Soziale Isolation',
  [FormTypes.PrognostischUnguenstig.TherapiehemmendesUmfeld]: 'Therapiehemmendes Umfeld',
  [FormTypes.PrognostischUnguenstig.Veraenderungshindernisse]: 'Veränderungshindernisse (z.B. Krankengeld, Berentung, sekundärer Krankheitsgewinn)',
  [FormTypes.PrognostischUnguenstig.LangandauerndeStressoren]: 'Lang andauernde Stressfaktoren',
} as const satisfies Record<FormTypes.PrognostischUnguenstig, string>;

/** Eingeschätzte Prognose */
export const EINGESCHAETZTE_PROGNOSE_LABELS = {
  [FormTypes.EingeschaetztePrognose.Gut]: 'Gut',
  [FormTypes.EingeschaetztePrognose.AusreichendGut]: 'Ausreichend gut',
  [FormTypes.EingeschaetztePrognose.Ausreichend]: 'Ausreichend',
} as const satisfies Record<FormTypes.EingeschaetztePrognose, string>;
