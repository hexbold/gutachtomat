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

/** AngstVegetativSymptom labels */
export const ANGST_VEGETATIV_SYMPTOM_LABELS = {
  [FormTypes.AngstVegetativSymptom.Herzklopfen]: 'Herzklopfen',
  [FormTypes.AngstVegetativSymptom.Herzrasen]: 'Herzrasen',
  [FormTypes.AngstVegetativSymptom.Schweissausbrueche]: 'Schweißausbrüche',
  [FormTypes.AngstVegetativSymptom.Schwitzen]: 'Schwitzen',
  [FormTypes.AngstVegetativSymptom.Zittern]: 'Zittern',
  [FormTypes.AngstVegetativSymptom.Mundtrockenheit]: 'Mundtrockenheit',
  [FormTypes.AngstVegetativSymptom.Atemnot]: 'Atemnot',
  [FormTypes.AngstVegetativSymptom.Dyspnoe]: 'Dyspnoe',
  [FormTypes.AngstVegetativSymptom.Hyperventilation]: 'Hyperventilation',
  [FormTypes.AngstVegetativSymptom.Erstickungsgefuehl]: 'Erstickungsgefühl',
  [FormTypes.AngstVegetativSymptom.Beklemmungsgefuehl]: 'Beklemmungsgefühl',
  [FormTypes.AngstVegetativSymptom.EngeInDerBrust]: 'Engegefühl in der Brust',
  [FormTypes.AngstVegetativSymptom.Brustschmerzen]: 'Brustschmerzen',
  [FormTypes.AngstVegetativSymptom.Uebelkeit]: 'Übelkeit',
  [FormTypes.AngstVegetativSymptom.Magenbeschwerden]: 'Magenbeschwerden',
  [FormTypes.AngstVegetativSymptom.Bauchschmerzen]: 'Bauchschmerzen',
  [FormTypes.AngstVegetativSymptom.Durchfall]: 'Durchfall',
  [FormTypes.AngstVegetativSymptom.Stuhldrang]: 'Stuhldrang',
  [FormTypes.AngstVegetativSymptom.Miktionsdrang]: 'Miktionsdrang',
  [FormTypes.AngstVegetativSymptom.Schwindel]: 'Schwindel',
  [FormTypes.AngstVegetativSymptom.Benommenheit]: 'Benommenheit',
  [FormTypes.AngstVegetativSymptom.Unsicherheit]: 'Unsicherheit',
  [FormTypes.AngstVegetativSymptom.Schwaeche]: 'Schwäche',
  [FormTypes.AngstVegetativSymptom.Erroeten]: 'Erröten',
  [FormTypes.AngstVegetativSymptom.Hitzewallungen]: 'Hitzewallungen',
  [FormTypes.AngstVegetativSymptom.Kaelteschauer]: 'Kälteschauer',
  [FormTypes.AngstVegetativSymptom.Kribbelgefuehle]: 'Kribbelgefühle',
  [FormTypes.AngstVegetativSymptom.Taubheitsgefuehle]: 'Taubheitsgefühle',
  [FormTypes.AngstVegetativSymptom.InnereAnspannung]: 'Innere Anspannung',
  [FormTypes.AngstVegetativSymptom.Muskelverspannung]: 'Muskelverspannung',
  [FormTypes.AngstVegetativSymptom.LeereImKopf]: 'Leere im Kopf',
  [FormTypes.AngstVegetativSymptom.NervositaetUndRuhelosigkeit]: 'Nervosität und Ruhelosigkeit',
  [FormTypes.AngstVegetativSymptom.AnhaltendeReizbarkeit]: 'Anhaltende Reizbarkeit',
  [FormTypes.AngstVegetativSymptom.UebertriebeneSchreckhaftigkeit]: 'Übertriebene Schreckhaftigkeit',
  [FormTypes.AngstVegetativSymptom.Schlafstoerungen]: 'Schlafstörungen (Einschlaf- und Durchschlafstörungen)'
} as const satisfies Record<FormTypes.AngstVegetativSymptom, string>;

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
  [FormTypes.AgoraphobieBereich.OeffentlichePlaetze]: 'Öffentliche Plätze',
  [FormTypes.AgoraphobieBereich.AlleinReisen]: 'Allein reisen',
  [FormTypes.AgoraphobieBereich.ReisenMitWeiterEntfernungVonZuhause]: 'Reisen mit weiter Entfernung von Zuhause',
  [FormTypes.AgoraphobieBereich.OeffentlicheVerkehrsmittel]: 'Öffentliche Verkehrsmittel',
  [FormTypes.AgoraphobieBereich.SchlangeStehen]: 'Schlange stehen'
} as const satisfies Record<FormTypes.AgoraphobieBereich, string>;

/** AgoraphobieFlucht labels */
export const AGORAPHOBIE_FLUCHT_LABELS = {
  [FormTypes.AgoraphobieFlucht.BeeintraechtigteHandlungsFaehigkeit]: 'Beeinträchtigte Handlungsfähigkeit',
  [FormTypes.AgoraphobieFlucht.FehlendeFluchtmoeglichkeiten]: 'Fehlende Fluchtmöglichkeiten'
} as const satisfies Record<FormTypes.AgoraphobieFlucht, string>;

/** Agoraphobie Paniksymptomatik labels */
export const AGORAPHOBIE_PANIKSYMPTOMATIK_LABELS = {
  mit: 'Mit Panikattacken',
  ohne: 'Ohne Panikattacken'
} as const;

/** SozialePhobieHauptsymptom labels */
export const SOZIALE_PHOBIE_HAUPTSYMPTOM_LABELS = {
  [FormTypes.SozialePhobieHauptsymptom.AngstImZentrumDerAufmerksamkeit]: 'Angst im Zentrum der Aufmerksamkeit zu stehen',
  [FormTypes.SozialePhobieHauptsymptom.AngstSichPeinlichZuVerhalten]: 'Angst sich peinlich zu verhalten',
  [FormTypes.SozialePhobieHauptsymptom.VermeidungSozialerSituationen]: 'Vermeidung sozialer Situationen',
  [FormTypes.SozialePhobieHauptsymptom.VermeidungImZentrumDerAufmerksamkeit]: 'Vermeidung im Zentrum der Aufmerksamkeit zu stehen'
} as const satisfies Record<FormTypes.SozialePhobieHauptsymptom, string>;

/** SozialePhobieBereichSymptom labels */
export const SOZIALE_PHOBIE_BEREICH_LABELS = {
  [FormTypes.SozialePhobieBereichSymptom.OeffentlichesReden]: 'Öffentliches Reden',
  [FormTypes.SozialePhobieBereichSymptom.SozialeInteraktion]: 'Soziale Interaktion',
  [FormTypes.SozialePhobieBereichSymptom.BeobachtetWerden]: 'Beobachtet werden',
  [FormTypes.SozialePhobieBereichSymptom.Leistungssituationen]: 'Leistungssituationen',
  [FormTypes.SozialePhobieBereichSymptom.Autoritaetspersonen]: 'Autoritätspersonen',
  [FormTypes.SozialePhobieBereichSymptom.Partys]: 'Partys und gesellschaftliche Anlässe'
} as const satisfies Record<FormTypes.SozialePhobieBereichSymptom, string>;

/** SozialePhobieVegetativSymptom labels */
export const SOZIALE_PHOBIE_VEGETATIV_LABELS = {
  [FormTypes.SozialePhobieVegetativSymptom.Erroeten]: 'Erröten',
  [FormTypes.SozialePhobieVegetativSymptom.Zittern]: 'Zittern',
  [FormTypes.SozialePhobieVegetativSymptom.Schwitzen]: 'Schwitzen',
  [FormTypes.SozialePhobieVegetativSymptom.Uebelkeit]: 'Übelkeit'
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

/** GeneralisierteAngstSymptom labels */
export const GENERALISIERTE_ANGST_SYMPTOM_LABELS = {
  [FormTypes.GeneralisierteAngstSymptom.ChronischeAengste]: 'Chronische, anhaltende und diffuse Ängste',
  [FormTypes.GeneralisierteAngstSymptom.UnkontrollierbareeSorgen]: 'Unkontrollierbare Sorgen',
  [FormTypes.GeneralisierteAngstSymptom.UebermaessigeSorgen]: 'Übermäßige und unbegründete Sorgen',
  [FormTypes.GeneralisierteAngstSymptom.Kontrollversuche]: 'Kontrollversuche im Umgang mit Sorgen',
  [FormTypes.GeneralisierteAngstSymptom.SichSorgenMachen]: 'Sich-Sorgen-Machen',
  [FormTypes.GeneralisierteAngstSymptom.Sorgenketten]: 'Sorgenketten',
  [FormTypes.GeneralisierteAngstSymptom.AengstlicheErwartungen]: 'Ängstliche Erwartungen',
  [FormTypes.GeneralisierteAngstSymptom.VermeidungAuseinandersetzung]: 'Vermeidung von emotionaler Auseinandersetzung mit der Angst'
} as const satisfies Record<FormTypes.GeneralisierteAngstSymptom, string>;

/** Angstsymptomatik section labels */
export const ANGSTSYMPTOMATIK_SECTION_LABELS = {
  emotionalesErleben: 'Emotionales Erleben',
  kognition: 'Kognition',
  vegetativeSymptome: 'Vegetative und somatische Symptome',
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
  [FormTypes.ZwangsgedankenWiederkehrendFeld.Andere]: 'Andere'
} as const satisfies Record<FormTypes.ZwangsgedankenWiederkehrendFeld, string>;

/** "Zwangsgedanken" parent label */
export const ZWANGSGEDANKEN_WIEDERKEHREND_LABEL = 'Quälende und wiederkehrende Zwangsgedanken';

/** Zwangsgedanken field labels */
export const ZWANGSGEDANKEN_FIELD_LABELS = {
  wiederkehrendeZwangsgedanken: 'Quälende und wiederkehrende Zwangsgedanken',
  zwanghafteIdeen: 'Quälende und wiederkehrende zwanghafte Ideen oder bildhafte Zwangsvorstellungen',
  zwangsimpulse: 'Quälende und wiederkehrende Zwangsimpulse'
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
  [FormTypes.ZwangshandlungTyp.MentaleZwangsrituale]: 'Mentale Zwangsrituale'
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
