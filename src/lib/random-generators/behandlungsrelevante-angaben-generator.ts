/**
 * Behandlungsrelevante Angaben Test Data Generator
 *
 * Generates random data for Wizard Step 5 / Kapitel 4:
 * - LebensgA (Lebensgeschichte)
 * - Krankheitsanamnese
 * - FunktionalesBedingungsmodell (SORKC, Vulnerabilitäten, Auslösende/Aufrechterhaltende Bedingungen)
 */

import * as FormTypes from '../core/form-types';

export interface BehandlungsrelevanteAngabenData {
  lebensgA: FormTypes.LebensgAData;
  krankheitsanamnese: FormTypes.Krankheitsanamnese;
  funktionalesBedingungsmodell: FormTypes.FunktionalesBedingungsmodellData;
}

// Helper to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Helper to pick a random item from an array
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to shuffle an array
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Helper for random CardSelection generation
function generateRandomCardSelection<E extends string>(
  enumObj: { [key: string]: E },
  minItems: number,
  maxItems: number
): FormTypes.CardSelection<E> {
  const values = Object.values(enumObj);
  const count = minItems + Math.floor(Math.random() * (maxItems - minItems + 1));
  const selected = shuffleArray(values).slice(0, count);

  const result: FormTypes.CardSelection<E> = {};
  for (const key of selected) {
    result[key as keyof typeof result] = { selected: true, details: {} };
  }
  return result;
}

// Helper to generate random Elternteil
function generateRandomElternteil(vorhanden: boolean): FormTypes.Elternteil {
  if (!vorhanden) return { vorhanden: false };

  const berufe = ['Lehrer', 'Kaufmann', 'Arzt', 'Handwerker', 'Ingenieur', 'Sekretärin', 'Krankenschwester', 'Hausfrau', 'Beamter'];

  return {
    vorhanden: true,
    data: {
      geburtsjahr: String(1940 + Math.floor(Math.random() * 30)),
      beruf: pickRandom(berufe),
      beziehungsEigenschaften: generateRandomCardSelection(FormTypes.BeziehungsEigenschaft, 2, 5),
      beziehungsEigenschaftenAndere: '',
      kritischeVerhaltensweisen: Math.random() < 0.3 ? generateRandomCardSelection(FormTypes.KritischeVerhaltensweise, 0, 2) : {},
      kritischeVerhaltensweiseAndere: '',
      verletzteGrundbeduerfnisse: Math.random() < 0.3 ? generateRandomCardSelection(FormTypes.VerletztesGrundbeduerfnis, 0, 3) : {},
      verletzteGrundbeduerfnisseAndere: '',
    },
  };
}

// Helper to generate random Geschwister entries
function generateRandomGeschwister(min: number, max: number): FormTypes.GeschwisterEntry[] {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const result: FormTypes.GeschwisterEntry[] = [];

  const beziehungen = ['eng', 'distanziert', 'ambivalent', 'konfliktreich', 'unterstützend'];

  for (let i = 0; i < count; i++) {
    result.push({
      id: generateId(),
      geburtsjahr: String(1970 + Math.floor(Math.random() * 30)),
      geschlecht: Math.random() < 0.5 ? FormTypes.Geschlecht.M : FormTypes.Geschlecht.W,
      beziehung: pickRandom(beziehungen),
    });
  }

  return result;
}

// Helper to generate random Bezugspersonen
function generateRandomBezugspersonen(min: number, max: number): FormTypes.AndereBezugspersonEntry[] {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const result: FormTypes.AndereBezugspersonEntry[] = [];

  const wer = ['Großmutter', 'Großvater', 'Onkel', 'Tante', 'Nachbar', 'Lehrer'];
  const beziehungen = ['eng', 'fürsorglich', 'unterstützend', 'prägend'];

  for (let i = 0; i < count; i++) {
    result.push({
      id: generateId(),
      wer: pickRandom(wer),
      geburtsjahr: String(1930 + Math.floor(Math.random() * 30)),
      geschlecht: Math.random() < 0.5 ? FormTypes.Geschlecht.M : FormTypes.Geschlecht.W,
      beziehung: pickRandom(beziehungen),
    });
  }

  return result;
}

// Helper to pick N random items without replacement
function pickRandomN<T>(arr: T[], count: number): T[] {
  const shuffled = shuffleArray(arr);
  return shuffled.slice(0, Math.min(count, arr.length));
}

// ============================================================================
// STÖRUNGSMODELL DATA GENERATORS
// ============================================================================

// A: Verstärker-Verlust Modell der Depression
function generateVerstaerkerVerlustData(): FormTypes.VerstaerkerVerlustModellData {
  const texts = {
    verlustPositiverVerstaerker: [
      'Verlust des Partners nach Trennung',
      'Tod eines nahestehenden Menschen',
      'Verlust des Arbeitsplatzes',
    ],
    mangelErreichbarkeitVerstaerker: [
      'Soziale Kontakte sind schwer erreichbar',
      'Interessante Aktivitäten sind nicht zugänglich',
    ],
    mangelPositiveErlebnisse: [
      'Kaum positive Alltagserlebnisse',
      'Fehlende Erfolgserlebnisse im Beruf',
    ],
    mangelFertigkeiten: [
      'Defizite in sozialen Fertigkeiten',
      'Schwierigkeiten bei Selbstfürsorge',
    ],
    reduzierteAktivitaet: [
      'Starker Rückgang sozialer Aktivitäten',
      'Vernachlässigung von Hobbies',
    ],
    sozialeVerstaerkung: [
      'Zuwendung durch Angehörige bei Klagen',
      'Entlastung durch Krankschreibung',
    ],
    sozialeIsolation: [
      'Zunehmender Rückzug aus sozialen Kontakten',
      'Vermeidung von Treffen mit Freunden',
    ],
  };

  const generateOption = (key: keyof typeof texts): { selected: boolean; text: string } => {
    const selected = Math.random() < 0.4;
    return { selected, text: selected ? pickRandom(texts[key]) : '' };
  };

  return {
    verlustPositiverVerstaerker: generateOption('verlustPositiverVerstaerker'),
    mangelErreichbarkeitVerstaerker: generateOption('mangelErreichbarkeitVerstaerker'),
    mangelPositiveErlebnisse: generateOption('mangelPositiveErlebnisse'),
    mangelFertigkeiten: generateOption('mangelFertigkeiten'),
    reduzierteAktivitaet: generateOption('reduzierteAktivitaet'),
    sozialeVerstaerkung: generateOption('sozialeVerstaerkung'),
    sozialeIsolation: generateOption('sozialeIsolation'),
  };
}

// B: Modell der erlernten Hilflosigkeit
function generateErlernteHilflosigkeitData(): FormTypes.ErlernteHilflosigkeitModellData {
  return {
    negativesErleben: pickRandom([
      'Wiederholte Ablehnung bei Bewerbungen',
      'Anhaltende Beziehungskonflikte ohne Lösung',
      'Chronische Überforderung am Arbeitsplatz',
    ]),
    wahrnehmungUnkontrollierbarkeit: pickRandom([
      'Egal was ich tue, es ändert sich nichts',
      'Ich habe keinen Einfluss auf die Situation',
      'Die Umstände sind stärker als ich',
    ]),
    depressiverAttributionsstil: pickRandom([
      'Internal, global, stabil',
      'Misserfolge werden auf eigene Unfähigkeit zurückgeführt',
      'Negative Ereignisse als unveränderlich wahrgenommen',
    ]),
    erlernteHilflosigkeitEmotional: pickRandom([
      'Resignation und Hoffnungslosigkeit',
      'Passivität und Gleichgültigkeit',
      'Traurigkeit und Hilflosigkeit',
    ]),
    erlernteHilflosigkeitMotivational: pickRandom([
      'Keine Motivation, Neues zu versuchen',
      'Aufgeben bei ersten Schwierigkeiten',
      'Reduzierte Anstrengungsbereitschaft',
    ]),
    erlernteHilflosigkeitKognitiv: pickRandom([
      'Übergeneralisierung von Misserfolgen',
      'Schwierigkeiten, Lösungen zu erkennen',
      'Negative Erwartungshaltung',
    ]),
  };
}

// C: Kognitionstheoretisches Modell der Depression
function generateKognitionstheoretischData(): FormTypes.KognitionstheoretischModellData {
  return {
    externeInterneAusloeser: pickRandom([
      'Kritik durch Vorgesetzten',
      'Trennung vom Partner',
      'Beruflicher Misserfolg',
    ]),
    automatischeNegativeGedanken: pickRandom([
      'Ich bin ein Versager',
      'Niemand mag mich',
      'Ich werde nie erfolgreich sein',
    ]),
    dysfunktionaleGrundannahmen: pickRandom([
      'Ich muss perfekt sein, um geliebt zu werden',
      'Wenn ich Fehler mache, bin ich wertlos',
      'Andere Menschen sind mir überlegen',
    ]),
    depressiveSymptomatik: pickRandom([
      'Anhaltende Niedergeschlagenheit und Antriebslosigkeit',
      'Sozialer Rückzug und Interessenverlust',
      'Grübeln und Schlafstörungen',
    ]),
  };
}

// D: Teufelskreismodell der Angst
function generateTeufelskreisAngstData(): FormTypes.TeufelskreisAngstModellData {
  return {
    ausloesendeSituation: pickRandom([
      'Aufenthalt in engem Raum (Aufzug)',
      'Öffentliches Sprechen vor Publikum',
      'Menschenmenge im Kaufhaus',
    ]),
    wahrnehmungKoerperlich: pickRandom([
      'Herzrasen, Schwitzen, Enge im Brustbereich',
      'Schwindel und Benommenheit',
      'Zittern und Atemnot',
    ]),
    dysfunktionaleBewertung: pickRandom([
      'Ich werde einen Herzinfarkt bekommen',
      'Ich werde ohnmächtig und blamiere mich',
      'Ich verliere die Kontrolle',
    ]),
    gefuehlAngst: pickRandom([
      'Intensive Panik und Todesangst',
      'Starke Angst vor Kontrollverlust',
      'Überwältigende Furcht',
    ]),
    physiologischeAktivierung: pickRandom([
      'Verstärktes Herzrasen, Hyperventilation',
      'Zunehmende körperliche Anspannung',
      'Schweißausbrüche und Zittern',
    ]),
    verstaerkungKoerperlich: pickRandom([
      'Körperliche Symptome bestätigen die Befürchtung',
      'Aufschaukeln der Symptome',
      'Verstärkung durch Fokussierung auf Körper',
    ]),
    vermeidungsverhalten: pickRandom([
      'Vermeidung von Aufzügen und engen Räumen',
      'Meiden von öffentlichen Verkehrsmitteln',
      'Flucht aus angstauslösenden Situationen',
    ]),
  };
}

// E: Teufelskreismodell der Zwangserkrankung
function generateTeufelskreisZwangserkrankungData(): FormTypes.TeufelskreisZwangserkrankungModellData {
  return {
    aufdringlicherGedanke: pickRandom([
      'Angst vor Kontamination durch Bakterien',
      'Zweifel, ob Herd ausgeschaltet wurde',
      'Aggressive Impulse gegenüber Nahestehenden',
    ]),
    fehlbewertung: pickRandom([
      'Gedanken bedeuten, dass ich gefährlich bin',
      'Ich bin für mögliche Schäden verantwortlich',
      'Der Gedanke zeigt meinen wahren Charakter',
    ]),
    emotionaleReaktion: pickRandom([
      'Intensive Angst und Unbehagen',
      'Starke Anspannung und Unruhe',
      'Ekel und Abscheu',
    ]),
    offeneZwangshandlung: pickRandom([
      'Wiederholtes Händewaschen',
      'Mehrfaches Kontrollieren von Türschlössern',
      'Ordnen und Arrangieren von Gegenständen',
    ]),
    verdeckteZwangshandlung: pickRandom([
      'Gedankliches Durchgehen von Kontrollritualen',
      'Mentales Zählen oder Beten',
      'Innerliches Wiederholen von Sätzen',
    ]),
    gedankenunterdrueckung: pickRandom([
      'Versuch, Gedanken zu unterdrücken',
      'Ablenkung von aufdringlichen Gedanken',
      'Gedankenstopp-Versuche',
    ]),
    vermeidung: pickRandom([
      'Vermeidung von potenziell kontaminierten Orten',
      'Meiden von Situationen mit Kontrollbedarf',
      'Delegation von Aufgaben an andere',
    ]),
    rueckversicherung: pickRandom([
      'Häufiges Nachfragen bei Angehörigen',
      'Suche nach Bestätigung im Internet',
      'Wiederholtes Einholen von Zusicherungen',
    ]),
    neutralisierendeZwangshandlungen: pickRandom([
      'Rituale zur Neutralisierung böser Gedanken',
      'Wiederholung von Handlungen bis es sich richtig anfühlt',
      'Gegensätzliche Gedanken zur Neutralisierung',
    ]),
  };
}

// F: Teufelskreismodell der Zwangshandlungen
function generateTeufelskreisZwangshandlungenData(): FormTypes.TeufelskreisZwangshandlungenModellData {
  return {
    externeInterneAusloeser: pickRandom([
      'Berühren einer Türklinke',
      'Verlassen des Hauses',
      'Unsicherheit über abgeschlossene Handlung',
    ]),
    dysfunktionaleGrundannahmen: pickRandom([
      'Ich bin für alles verantwortlich',
      'Fehler sind nicht tolerierbar',
      'Wenn ich nicht kontrolliere, passiert etwas Schlimmes',
    ]),
    zwangsbefuerchtung: pickRandom([
      'Angst vor Krankheit und Ansteckung',
      'Befürchtung eines Einbruchs',
      'Sorge vor Feuer durch nicht ausgeschalteten Herd',
    ]),
    zwangshandlung: pickRandom([
      'Ausgiebiges Waschen und Desinfizieren',
      'Mehrfaches Überprüfen der Türschlösser',
      'Wiederholtes Kontrollieren des Herdes',
    ]),
    zwangshandlungAufrechterhaltung: pickRandom([
      'Kurzfristige Erleichterung verstärkt das Verhalten',
      'Negative Verstärkung durch Angstreduktion',
      'Ausbleiben befürchteter Konsequenzen bestätigt Ritual',
    ]),
  };
}

// G: Teufelskreismodell der Bulimie
function generateTeufelskreisBulimieData(): FormTypes.TeufelskreisBulimieModellData {
  return {
    fixierungKoerpergewicht: pickRandom([
      'Übermäßige Beschäftigung mit Gewicht und Figur',
      'Ständiges Wiegen und Körperkontrolle',
      'Selbstwert abhängig von Gewicht',
    ]),
    nahrungsrestriktion: pickRandom([
      'Strenge Diätregeln und verbotene Lebensmittel',
      'Kalorienrestriktion unter Grundumsatz',
      'Auslassen von Mahlzeiten',
    ]),
    unterzuckerung: pickRandom([
      'Starke Hungergefühle und Heißhunger',
      'Körperliche Schwäche und Konzentrationsprobleme',
      'Erhöhte Reizbarkeit durch Nahrungsmangel',
    ]),
    heisshungeranfall: pickRandom([
      'Unkontrolliertes Essen großer Nahrungsmengen',
      'Kontrollverlust beim Essen',
      'Hastiges Verschlingen von Nahrung',
    ]),
    ekelSchamAngst: pickRandom([
      'Intensive Scham- und Schuldgefühle nach Essanfall',
      'Ekel vor sich selbst',
      'Angst vor Gewichtszunahme',
    ]),
    erbrechen: pickRandom([
      'Selbstinduziertes Erbrechen zur Gewichtskontrolle',
      'Kompensatorisches Erbrechen nach Essanfall',
      'Purging-Verhalten als Bewältigungsstrategie',
    ]),
  };
}

// H: Zwei-Faktoren Modell der Zwangserkrankung
function generateZweiFaktorenZwangData(): FormTypes.ZweiFaktorenZwangModellData {
  return {
    klassischeKonditionierung: pickRandom([
      'Angst wurde mit neutralem Stimulus (z.B. Türklinke) verknüpft',
      'Traumatisches Erlebnis führte zur Angstreaktion auf bestimmte Objekte',
      'Generalisierung der Angst auf ähnliche Situationen',
    ]),
    operanteKonditionierung: pickRandom([
      'Zwangshandlung führt zu kurzfristiger Angstreduktion (negative Verstärkung)',
      'Vermeidungsverhalten wird durch Erleichterung verstärkt',
      'Rituale werden durch Wegfall der Angst aufrechterhalten',
    ]),
  };
}

// I: Drei-Faktoren-Modell der Generalisierten Angststörung
function generateDreiFaktorenGASData(): FormTypes.DreiFaktorenGASModellData {
  const praedisponierende = ['Veranlagung', 'Lernerfahrungen', 'Selbstwirksamkeit', 'Problemloesung', 'Grundannahmen'];
  const ausloesende = ['Anforderungen', 'Belastungen', 'MehrereFaktoren'];
  const aufrechterhaltende = [
    'Gruebeln', 'Gedankenstopp', 'Ablenkung', 'KognitiveVermeidung',
    'Sorgenketten', 'GedankenStattBilder', 'OffeneVermeidung',
    'AufmerksamkeitBedrohlich', 'GefahrenbezogeneInterpretation',
    'Konzentrationsprobleme', 'VerringerungLeistung'
  ];

  const selectedPraed = pickRandomN(praedisponierende, 1 + Math.floor(Math.random() * 3));
  const selectedAusl = pickRandomN(ausloesende, 1 + Math.floor(Math.random() * 2));
  const selectedAufr = pickRandomN(aufrechterhaltende, 2 + Math.floor(Math.random() * 5));

  return {
    praedisponierendVeranlagung: selectedPraed.includes('Veranlagung'),
    praedisponierendLernerfahrungen: selectedPraed.includes('Lernerfahrungen'),
    praedisponierendSelbstwirksamkeit: selectedPraed.includes('Selbstwirksamkeit'),
    praedisponierendProblemloesung: selectedPraed.includes('Problemloesung'),
    praedisponierendGrundannahmen: selectedPraed.includes('Grundannahmen'),
    ausloesendAnforderungen: selectedAusl.includes('Anforderungen'),
    ausloesendBelastungen: selectedAusl.includes('Belastungen'),
    ausloesendMehrereFaktoren: selectedAusl.includes('MehrereFaktoren'),
    aufrechterhaltendGruebeln: selectedAufr.includes('Gruebeln'),
    aufrechterhaltendGedankenstopp: selectedAufr.includes('Gedankenstopp'),
    aufrechterhaltendAblenkung: selectedAufr.includes('Ablenkung'),
    aufrechterhaltendKognitiveVermeidung: selectedAufr.includes('KognitiveVermeidung'),
    aufrechterhaltendSorgenketten: selectedAufr.includes('Sorgenketten'),
    aufrechterhaltendGedankenStattBilder: selectedAufr.includes('GedankenStattBilder'),
    aufrechterhaltendOffeneVermeidung: selectedAufr.includes('OffeneVermeidung'),
    aufrechterhaltendAufmerksamkeitBedrohlich: selectedAufr.includes('AufmerksamkeitBedrohlich'),
    aufrechterhaltendGefahrenbezogeneInterpretation: selectedAufr.includes('GefahrenbezogeneInterpretation'),
    aufrechterhaltendKonzentrationsprobleme: selectedAufr.includes('Konzentrationsprobleme'),
    aufrechterhaltendVerringerungLeistung: selectedAufr.includes('VerringerungLeistung'),
  };
}

// J: Kognitives Modell der sozialen Phobie
function generateKognitivSozialePhobieData(): FormTypes.KognitivSozialePhobieModellData {
  return {
    negativesSelbst: pickRandom([
      'Ich bin langweilig und uninteressant',
      'Andere bemerken meine Unsicherheit sofort',
      'Ich wirke inkompetent auf andere',
    ]),
    erhoehtesSelbstaufmerksamkeit: pickRandom([
      'Übermäßige Fokussierung auf eigenes Verhalten',
      'Ständige Selbstbeobachtung in sozialen Situationen',
      'Monitoring der eigenen Körperreaktionen',
    ]),
    fehlattribution: pickRandom([
      'Neutrale Reaktionen werden negativ interpretiert',
      'Kurzer Blickkontakt als Ablehnung gedeutet',
      'Normale Gesprächspausen als eigenes Versagen',
    ]),
    sicherheitsverhalten: pickRandom([
      'Vermeiden von Blickkontakt',
      'Kurze Antworten um Fehler zu minimieren',
      'Festhalten an Getränk zur Selbstberuhigung',
    ]),
    uebermaessigeVorbereitung: pickRandom([
      'Langes Einüben von Gesprächsbeiträgen',
      'Detaillierte Planung aller möglichen Fragen',
      'Auswendiglernen von Smalltalk-Themen',
    ]),
    antizipatorischeVerhinderung: pickRandom([
      'Absagen von Verabredungen aus Angst',
      'Vermeiden von Situationen mit Präsentationsbedarf',
      'Ausreden erfinden um nicht teilnehmen zu müssen',
    ]),
    antizipatorischeVorbeugung: pickRandom([
      'Übermäßiger Alkoholkonsum vor sozialen Anlässen',
      'Einnahme von Beruhigungsmitteln',
      'Frühe Anreise um Situation zu sondieren',
    ]),
    versucheWirkungKontrollieren: pickRandom([
      'Unterdrücken von Zittern oder Erröten',
      'Kontrolliertes Sprechen und Atmen',
      'Verstecken von Angstsymptomen',
    ]),
  };
}

// K: Biopsychosoziales Modell der Borderline-Persönlichkeitsstörung
function generateBiopsychosozialBorderlineData(): FormTypes.BiopsychosozialBorderlineModellData {
  const soziale = ['ChronischeInvalidierung', 'Missbrauch', 'Traumata', 'UngueinstigeBedingungen'];
  const biologische = ['ErhohtesErregungsniveau', 'ErhoehteImpulsivitaet'];
  const stoerung = ['Intensiv', 'Unkontrollierbar', 'Emotionsphobie', 'Dysfunktional'];

  const selectedSoz = pickRandomN(soziale, 1 + Math.floor(Math.random() * 3));
  const selectedBio = pickRandomN(biologische, 1 + Math.floor(Math.random() * 2));
  const selectedStoer = pickRandomN(stoerung, 2 + Math.floor(Math.random() * 3));

  return {
    sozialChronischeInvalidierung: selectedSoz.includes('ChronischeInvalidierung'),
    sozialMissbrauch: selectedSoz.includes('Missbrauch'),
    sozialTraumata: selectedSoz.includes('Traumata'),
    sozialUngueinstigeBedingungen: selectedSoz.includes('UngueinstigeBedingungen'),
    biologischErhohtesErregungsniveau: selectedBio.includes('ErhohtesErregungsniveau'),
    biologischErhoehteImpulsivitaet: selectedBio.includes('ErhoehteImpulsivitaet'),
    stoerungEmotionsregulationIntensiv: selectedStoer.includes('Intensiv'),
    stoerungEmotionsregulationUnkontrollierbar: selectedStoer.includes('Unkontrollierbar'),
    stoerungEmotionsregulationEmotionsphobie: selectedStoer.includes('Emotionsphobie'),
    stoerungEmotionsregulationDysfunktional: selectedStoer.includes('Dysfunktional'),
  };
}

// Dispatcher: Generate data for any Störungsmodell type
function generateStoerungsmodellData(typ: FormTypes.StoerungsmodellTyp): FormTypes.StoerungsmodellData {
  switch (typ) {
    case FormTypes.StoerungsmodellTyp.VerstaerkerVerlustDepression:
      return { typ, data: generateVerstaerkerVerlustData() };
    case FormTypes.StoerungsmodellTyp.ErlernteHilflosigkeit:
      return { typ, data: generateErlernteHilflosigkeitData() };
    case FormTypes.StoerungsmodellTyp.KognitionstheoretischDepression:
      return { typ, data: generateKognitionstheoretischData() };
    case FormTypes.StoerungsmodellTyp.TeufelskreisAngst:
      return { typ, data: generateTeufelskreisAngstData() };
    case FormTypes.StoerungsmodellTyp.TeufelskreisZwangserkrankung:
      return { typ, data: generateTeufelskreisZwangserkrankungData() };
    case FormTypes.StoerungsmodellTyp.TeufelskreisZwangshandlungen:
      return { typ, data: generateTeufelskreisZwangshandlungenData() };
    case FormTypes.StoerungsmodellTyp.TeufelskreisBulimie:
      return { typ, data: generateTeufelskreisBulimieData() };
    case FormTypes.StoerungsmodellTyp.ZweiFaktorenZwang:
      return { typ, data: generateZweiFaktorenZwangData() };
    case FormTypes.StoerungsmodellTyp.DreiFaktorenGAS:
      return { typ, data: generateDreiFaktorenGASData() };
    case FormTypes.StoerungsmodellTyp.KognitivSozialePhobie:
      return { typ, data: generateKognitivSozialePhobieData() };
    case FormTypes.StoerungsmodellTyp.BiopsychosozialBorderline:
      return { typ, data: generateBiopsychosozialBorderlineData() };
    default:
      // FreitextModell should not be randomly generated
      throw new Error(`Unsupported Störungsmodell type for random generation: ${typ}`);
  }
}

// Orchestrator: Generate 1-3 random Störungsmodelle distributed across sections
function generateRandomStoerungsmodelle(): {
  praedisponierend: FormTypes.StoerungsmodellEntry[];
  ausloesend: FormTypes.StoerungsmodellEntry[];
  aufrechterhaltend: FormTypes.StoerungsmodellEntry[];
} {
  // Available model types (excluding FreitextModell)
  const availableTypes = [
    FormTypes.StoerungsmodellTyp.VerstaerkerVerlustDepression,
    FormTypes.StoerungsmodellTyp.ErlernteHilflosigkeit,
    FormTypes.StoerungsmodellTyp.KognitionstheoretischDepression,
    FormTypes.StoerungsmodellTyp.TeufelskreisAngst,
    FormTypes.StoerungsmodellTyp.TeufelskreisZwangserkrankung,
    FormTypes.StoerungsmodellTyp.TeufelskreisZwangshandlungen,
    FormTypes.StoerungsmodellTyp.TeufelskreisBulimie,
    FormTypes.StoerungsmodellTyp.ZweiFaktorenZwang,
    FormTypes.StoerungsmodellTyp.DreiFaktorenGAS,
    FormTypes.StoerungsmodellTyp.KognitivSozialePhobie,
    FormTypes.StoerungsmodellTyp.BiopsychosozialBorderline,
  ];

  // Select 1-3 model types randomly
  const count = 1 + Math.floor(Math.random() * 3);
  const selectedTypes = pickRandomN(availableTypes, count);

  // Available sections
  const sections = [
    FormTypes.StoerungsmodellZuordnung.Praedisponierend,
    FormTypes.StoerungsmodellZuordnung.Ausloesend,
    FormTypes.StoerungsmodellZuordnung.Aufrechterhaltend,
  ];

  // Result containers
  const result: {
    praedisponierend: FormTypes.StoerungsmodellEntry[];
    ausloesend: FormTypes.StoerungsmodellEntry[];
    aufrechterhaltend: FormTypes.StoerungsmodellEntry[];
  } = {
    praedisponierend: [],
    ausloesend: [],
    aufrechterhaltend: [],
  };

  // Distribute each selected model to a random section
  for (const typ of selectedTypes) {
    const section = pickRandom(sections);
    const entry: FormTypes.StoerungsmodellEntry = {
      id: generateId(),
      modell: generateStoerungsmodellData(typ),
    };

    switch (section) {
      case FormTypes.StoerungsmodellZuordnung.Praedisponierend:
        result.praedisponierend.push(entry);
        break;
      case FormTypes.StoerungsmodellZuordnung.Ausloesend:
        result.ausloesend.push(entry);
        break;
      case FormTypes.StoerungsmodellZuordnung.Aufrechterhaltend:
        result.aufrechterhaltend.push(entry);
        break;
    }
  }

  return result;
}

/**
 * Main function: Generates behandlungsrelevante angaben data
 */
export function generateBehandlungsrelevanteAngaben(): BehandlungsrelevanteAngabenData {
  // Generate 1-3 random Störungsmodelle distributed across sections
  const stoerungsmodelle = generateRandomStoerungsmodelle();

  return {
    lebensgA: {
      kurzeBiographischeEinordnung: {
        geburtsjahr: String(1970 + Math.floor(Math.random() * 40)),
        geburtsort: pickRandom(['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt', 'Stuttgart', 'Leipzig', 'Dresden']),
        vater: generateRandomElternteil(Math.random() < 0.8),
        mutter: generateRandomElternteil(Math.random() < 0.9),
        geschwister: Math.random() < 0.3
          ? { keineGeschwister: true as const }
          : { keineGeschwister: false as const, liste: generateRandomGeschwister(1, 3) },
        andereBezugspersonen: Math.random() < 0.5 ? [] : generateRandomBezugspersonen(1, 2),
        weitereAngaben: '',
      },
      lebensgeschichtlicheEntwicklung: {
        kindheitUndErziehung: pickRandom(['', 'unauffällige Kindheit', 'schwierige Familienverhältnisse', 'behütete Kindheit']),
        jugend: pickRandom(['', 'normale Jugendentwicklung', 'frühe Konflikte mit Eltern', 'zurückgezogene Jugend']),
        schulischerBeruflichWerdegang: pickRandom(['', 'erfolgreicher Schulabschluss und Berufsausbildung', 'mehrfacher Schulwechsel', 'gute schulische Leistungen']),
        finanziellesFamiliaresUmfeld: pickRandom(['', 'stabile finanzielle Verhältnisse', 'beengte Wohnverhältnisse', 'durchschnittliche finanzielle Situation']),
        beziehungen: pickRandom(['', 'stabile Partnerschaft seit mehreren Jahren', 'mehrere gescheiterte Beziehungen', 'aktuell alleinstehend']),
        interessenHobbies: pickRandom(['', 'Sport und Lesen', 'Musik und Gartenarbeit', 'wenig Freizeitaktivitäten']),
        praegendeTraumatischeEreignisse: pickRandom(['', 'keine besonderen traumatischen Ereignisse', 'Verlust eines nahen Angehörigen', 'schwere Erkrankung in der Kindheit']),
        andere: '',
        weitereAngaben: '',
      },
      a1BiographischeEinordnung: Math.random() < 0.3 ? '' : 'Schwierige Kindheit mit emotionaler Vernachlässigung',
      a2Entwicklung: Math.random() < 0.3 ? '' : 'Unauffällige körperliche und psychische Entwicklung',
    },

    krankheitsanamnese: {
      anhaltendeBelastungssituation: Math.random() < 0.5 ? '' : pickRandom([
        'Seit Jahren bestehende berufliche Überlastung',
        'Langanhaltender Partnerschaftskonflikt',
        'Chronische finanzielle Sorgen',
      ]),
      akuteBelastungssituation: Math.random() < 0.5 ? '' : pickRandom([
        'Kürzliche Trennung vom Partner',
        'Verlust des Arbeitsplatzes vor 3 Monaten',
        'Tod eines nahen Angehörigen',
      ]),
      krisensituation: Math.random() < 0.7 ? '' : pickRandom([
        'Akute suizidale Krise',
        'Dekompensation nach Arbeitsplatzverlust',
      ]),
      situationAndere: Math.random() < 0.8 ? '' : 'Überforderung durch Mehrfachbelastungen',
      erstauftretenSymptome: Math.random() < 0.3 ? '' : pickRandom([
        'Erstmals im Jugendalter',
        'Erstmaliges Auftreten im Alter von 25 Jahren',
        'Seit der frühen Kindheit bekannt',
      ]),
      beginnAktuelleSymptome: Math.random() < 0.3 ? '' : pickRandom([
        'Seit ca. 6 Monaten',
        'Seit etwa einem Jahr',
        'Vor ca. 2 Jahren',
      ]),
      dauerAktuelleSymptome: Math.random() < 0.3 ? '' : pickRandom([
        'Anhaltend seit einem halben Jahr',
        'Mit wechselnder Intensität seit ca. 1 Jahr',
        'Chronisch seit 2 Jahren',
      ]),
      verlaufAktuelleSymptome: Math.random() < 0.3 ? '' : pickRandom([
        'Chronisch-progredient mit Exazerbationen',
        'Fluktuierend mit symptomfreien Intervallen',
        'Kontinuierlich zunehmend',
      ]),
      ausloeserVergangenheit: Math.random() < 0.5 ? '' : pickRandom([
        'Frühere Trennungserfahrungen',
        'Berufliche Misserfolge',
        'Familiäre Konflikte in der Kindheit',
      ]),
      ausloeserAktuell: Math.random() < 0.3 ? '' : pickRandom([
        'Kündigung und Partnerschaftskonflikt',
        'Überlastung am Arbeitsplatz',
        'Soziale Isolation während der Pandemie',
      ]),
    },

    funktionalesBedingungsmodell: {
      // SORKC Entries - list of behavioral analyses
      sorkcEntries: [
        {
          id: generateId(),
          titel: 'depressiven Reaktion mit Rückzug',
          typischeStimuli: 'Alleine Zuhause nach der Arbeit, Gedanken an frühere Beziehungen',
          situationExtern: 'Alleine und erschöpft Zuhause nach der Arbeit',
          situationIntern: 'Gedanken an Versagen',
          organismus: 'Ich bin nicht liebenswert.',
          reaktionKognitiv: 'Ich schaffe nichts mehr.',
          reaktionEmotional: 'Traurigkeit, Verzweiflung',
          reaktionPhysiologisch: 'Anspannung, Müdigkeit',
          reaktionBehavioral: 'sitzt im Bett, Decke über den Kopf ziehen',
          konsequenzKurzfristigPositiveVerstaerkung: 'Trost und Wärmegefühl',
          konsequenzKurzfristigNegativeVerstaerkung: 'Anspannung nimmt ab',
          konsequenzKurzfristigPositiveBestrafung: '',
          konsequenzKurzfristigNegativeBestrafung: '',
          konsequenzLangfristigPositiveVerstaerkung: '',
          konsequenzLangfristigNegativeVerstaerkung: 'keine Enttäuschungen in sozialen Beziehungen',
          konsequenzLangfristigPositiveBestrafung: 'zunehmende Traurigkeit',
          konsequenzLangfristigNegativeBestrafung: 'Verstärkerverlust',
        },
      ],

      // Makroanalyse intro section
      makroanalyseIntro: {
        headingExtension: '',
        content: '',
      },

      // NEW: Refactored Makroanalyse structures
      praedisponierendeFaktoren: {
        kognitivEmotional: {
          plananalyse: {
            grundbeduerfnisse: generateRandomCardSelection(FormTypes.GraweGrundbeduerfnis, 1, 3),
            grundbeduerfnisseAndere: '',
            grundannahmen: Math.random() < 0.7 ? ['Ich bin nicht liebenswert', 'Ich muss perfekt sein'] : [],
            annaeherungsplaene: Math.random() < 0.5 ? 'Anerkennung durch Leistung erlangen' : '',
            vermeidungsplaene: Math.random() < 0.5 ? 'Vermeidung von Ablehnung und Kritik' : '',
          },
          persoenlichkeitTemperament: Math.random() < 0.5 ? 'introvertiert, ängstlich-vermeidend' : '',
          fruehkindlicheErfahrungen: {
            bindungsmuster: Math.random() < 0.7 ? pickRandom([FormTypes.Bindungsmuster.Sicher, FormTypes.Bindungsmuster.UnsicherVermeidend, FormTypes.Bindungsmuster.UnsicherAmbivalent]) : null,
            erfahrungen: generateRandomCardSelection(FormTypes.FruehkindlicheErfahrung, 0, 2),
            erfahrungenAndere: '',
          },
        },
        biologischGenetisch: generateRandomCardSelection(FormTypes.BiologischeVulnerabilitaet, 0, 1),
        biologischGenetischAndere: '',
        sozial: generateRandomCardSelection(FormTypes.SozialeVulnerabilitaet, 0, 3),
        sozialAndere: '',
        stoerungsmodelle: stoerungsmodelle.praedisponierend,
      },

      ausloesendeBedingungen: {
        nichtEruiert: Math.random() < 0.1,
        bedingungen: generateRandomCardSelection(FormTypes.AusloesendeBedingung, 1, 4),
        andere: '',
        stoerungsmodelle: stoerungsmodelle.ausloesend,
      },

      aufrechterhaltendeBedingungen: {
        kognitiveFaktoren: {
          grundannahmen: Math.random() < 0.7 ? ['Ich bin wertlos', 'Niemand mag mich'] : [],
          denkfehler: generateRandomCardSelection(FormTypes.Denkfehler, 2, 5),
          denkfehlerAndere: '',
          automatischeGedanken: Math.random() < 0.7 ? ['Das schaffe ich nie', 'Alle bemerken meine Unsicherheit'] : [],
          gruebeln: Math.random() < 0.5 ? 'Häufiges Grübeln über vergangene Fehler' : '',
          sichSorgenMachen: Math.random() < 0.5 ? 'Sorgen über zukünftige Probleme' : '',
          situationsKompetenzErwartungen: '',
          situationsReaktionErwartungen: '',
          situationsErgebnisErwartungen: '',
          attributionsstilInternal: Math.random() < 0.4 ? 'Misserfolge werden internal attribuiert' : '',
          attributionsstilGlobal: '',
          attributionsstilStabil: '',
          andere: '',
        },
        emotionaleFaktoren: {
          emotionsregulation: generateRandomCardSelection(FormTypes.DysfunktionaleEmotionsregulation, 0, 2),
          emotionsregulationAndere: '',
          wahrnehmungsabwehrEmotionen: Math.random() < 0.3,
          defiziteEmotionswahrnehmung: Math.random() < 0.3,
          andere: '',
        },
        verhaltensbezogeneFaktoren: {
          faktoren: generateRandomCardSelection(FormTypes.VerhaltensbezogeneFaktoren, 2, 5),
          andere: '',
        },
        selbstwertbezogeneFaktoren: {
          faktoren: generateRandomCardSelection(FormTypes.SelbstwertbezogeneFaktoren, 0, 3),
          andere: '',
        },
        kompetenzdefizite: {
          defizite: generateRandomCardSelection(FormTypes.Kompetenzdefizit, 0, 3),
          sozialeInteraktionsdefizite: generateRandomCardSelection(FormTypes.SozialesInteraktionsdefizit, 0, 2),
          andere: '',
        },
        substanzabhaengigkeit: {
          faktoren: Math.random() < 0.2 ? generateRandomCardSelection(FormTypes.SubstanzabhaengigkeitFaktor, 1, 3) : {},
        },
        weitereFaktoren: {
          chronischeStressoren: Math.random() < 0.5 ? 'Anhaltende berufliche Überlastung' : '',
          koerperlicheErschoepfung: Math.random() < 0.4 ? 'Chronische Müdigkeit und Schlafdefizit' : '',
          hohesAnspannungsniveau: Math.random() < 0.5,
          abhaengigkeit: '',
          primaererKrankheitsgewinn: generateRandomCardSelection(FormTypes.PrimaererKrankheitsgewinn, 0, 2),
          sekundaererKrankheitsgewinn: generateRandomCardSelection(FormTypes.SekundaererKrankheitsgewinn, 0, 2),
          fehlendeSozialeUnterstuetzung: Math.random() < 0.4,
          andere: '',
        },
        stoerungsmodelle: stoerungsmodelle.aufrechterhaltend,
      },
    },
  };
}
