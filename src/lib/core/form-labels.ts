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
