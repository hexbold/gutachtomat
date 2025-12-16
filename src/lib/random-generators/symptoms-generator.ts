// Generates random symptom data with realistic clinical distribution

import * as FormTypes from '../core/form-types';

const MAX_TOTAL_SYMPTOMS = 7;
const MIN_TOTAL_SYMPTOMS = 3;
const MAX_ACTIVE_CATEGORIES = 3;

type SymptomCategory = 'manisch' | 'depressiv' | 'angst' | 'zwang';

// Distributes a symptom budget across active categories (ensures each gets at least 1)
function distributeSymptoms(
  totalBudget: number,
  activeCategories: SymptomCategory[]
): Record<SymptomCategory, number> {
  const result: Partial<Record<SymptomCategory, number>> = {};
  let remaining = totalBudget;

  // Ensure each category gets at least 1 symptom
  for (const cat of activeCategories) {
    result[cat] = 1;
    remaining--;
  }

  // Distribute remaining randomly
  while (remaining > 0) {
    const randomCat = activeCategories[Math.floor(Math.random() * activeCategories.length)];
    result[randomCat] = (result[randomCat] || 0) + 1;
    remaining--;
  }

  return result as Record<SymptomCategory, number>;
}

// Generates realistic symptom distribution: 3-7 total symptoms across 1-3 active categories
function generateRealisticSymptomDistribution(): {
  activeCategories: SymptomCategory[];
  symptomsPerCategory: Record<SymptomCategory, number>;
  totalBudget: number;
} {
  // 1. Determine total symptom budget (3-7)
  const totalBudget = Math.floor(Math.random() * (MAX_TOTAL_SYMPTOMS - MIN_TOTAL_SYMPTOMS + 1)) + MIN_TOTAL_SYMPTOMS;

  // 2. Determine number of active categories (1-3)
  const numActiveCategories = Math.floor(Math.random() * MAX_ACTIVE_CATEGORIES) + 1;

  // 3. Randomly select which categories are active
  const allCategories: SymptomCategory[] = ['manisch', 'depressiv', 'angst', 'zwang'];
  const shuffled = [...allCategories].sort(() => Math.random() - 0.5);
  const activeCategories = shuffled.slice(0, numActiveCategories);

  // 4. Distribute budget across active categories
  const symptomsPerCategory = distributeSymptoms(totalBudget, activeCategories);

  return { activeCategories, symptomsPerCategory, totalBudget };
}

export interface SymptomsData {
  manischeSymptomatik: FormTypes.ManischeSymptomatik;
  depressiveSymptomatik: FormTypes.DepressiveSymptomatik;
  angstsymptomatik: FormTypes.Angstsymptomatik;
  zwangssymptomatik: FormTypes.Zwangssymptomatik;
}

// Randomly selects N enum values from an enum
function selectRandomEnumValues<E extends string>(
  enumObj: Record<string, E>,
  min: number,
  max: number
): FormTypes.SymptomSelection<E> {
  const values = Object.values(enumObj) as E[];
  const numItems = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...values].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, numItems);

  const result: FormTypes.SymptomSelection<E> = {};
  for (const value of selected) {
    result[value] = 'selected';
  }
  return result;
}

// Generates Manische Symptomatik with realistic clinical patterns (prioritizes core symptoms)
function generateManischeSymptomatik(maxSymptoms: number = 4): FormTypes.ManischeSymptomatik {
  // All possible symptoms pooled together with their categories and priority
  type SymptomEntry = {
    category: 'stimmung' | 'antrieb' | 'sprache' | 'vegetativ' | 'selbsterleben' | 'verhalten' | 'impulsives' | 'psychotisch' | 'dissoziativ';
    value: string;
    priority: number;
  };

  const symptomPool: SymptomEntry[] = [
    // Priority 1: Core symptoms (very likely)
    { category: 'stimmung', value: FormTypes.ManischeStimmungSymptom.GehobeneStimmung, priority: 1 },
    { category: 'stimmung', value: FormTypes.ManischeStimmungSymptom.EuphorischeStimmung, priority: 1 },
    { category: 'antrieb', value: FormTypes.ManischeAntriebSymptom.GesteigertesEnergieniveau, priority: 1 },
    { category: 'vegetativ', value: FormTypes.ManischeVegetativSymptom.VermindertesSchlafbeduerfnis, priority: 1 },

    // Priority 2: Common symptoms (likely)
    { category: 'sprache', value: FormTypes.ManischeSpracheKognitionSymptom.Gedankenrasen, priority: 2 },
    { category: 'sprache', value: FormTypes.ManischeSpracheKognitionSymptom.GesteigerterRededrang, priority: 2 },
    { category: 'selbsterleben', value: FormTypes.ManischeSelbsterlebenSymptom.Groessenideen, priority: 2 },
    { category: 'stimmung', value: FormTypes.ManischeStimmungSymptom.DysphorischGereizteStimmung, priority: 2 },

    // Priority 3: Less common symptoms (possible)
    { category: 'antrieb', value: FormTypes.ManischeAntriebSymptom.Hyperaktivitat, priority: 3 },
    { category: 'sprache', value: FormTypes.ManischeSpracheKognitionSymptom.Ideenflucht, priority: 3 },
    { category: 'sprache', value: FormTypes.ManischeSpracheKognitionSymptom.Konzentrationsstoerungen, priority: 3 },
    { category: 'selbsterleben', value: FormTypes.ManischeSelbsterlebenSymptom.GesteigertesSelbstwertgefuehl, priority: 3 },
    { category: 'verhalten', value: FormTypes.ManischesVerhaltenSymptom.LeichtsinnigRuecksichtlosesVerhalten, priority: 3 },
    { category: 'vegetativ', value: FormTypes.ManischeVegetativSymptom.GesteigertLibido, priority: 3 },

    // Priority 4: Rare symptoms
    { category: 'impulsives', value: FormTypes.ImpulsivesVerhaltenDetail.Kaufsucht, priority: 4 },
    { category: 'psychotisch', value: FormTypes.ManischePsychotischSymptom.Wahn, priority: 4 },
    { category: 'sprache', value: FormTypes.ManischeSpracheKognitionSymptom.GeschaerftesOderUngewoehnlichKreativesDenken, priority: 4 },
    { category: 'selbsterleben', value: FormTypes.ManischeSelbsterlebenSymptom.UeberoptimismusOderUebertreibungFruehererErfolge, priority: 3 },
    { category: 'verhalten', value: FormTypes.ManischesVerhaltenSymptom.GesteigerteGeselligkeit, priority: 3 },
    { category: 'verhalten', value: FormTypes.ManischesVerhaltenSymptom.AndauerndeWechselVonAktivitaetenOderPlaenen, priority: 3 },
    { category: 'verhalten', value: FormTypes.ManischesVerhaltenSymptom.GesteigertesInteresseAnSexuellenUndAnderenAngenehmeTaetigkeiten, priority: 4 },
  ];

  // Select symptoms up to maxSymptoms with weighted probability
  // At least 1, at most maxSymptoms
  const totalSymptoms = Math.min(maxSymptoms, Math.floor(Math.random() * maxSymptoms) + 1);
  const selectedSymptoms: SymptomEntry[] = [];

  // Create weighted pool (priority 1 symptoms appear 4x, priority 2 appear 3x, etc.)
  const weightedPool = symptomPool.flatMap(item =>
    Array(5 - item.priority).fill(item)
  );

  // Select random symptoms
  const shuffled = [...weightedPool].sort(() => Math.random() - 0.5);
  const seen = new Set<string>();

  for (const item of shuffled) {
    if (selectedSymptoms.length >= totalSymptoms) break;
    if (!seen.has(item.value)) {
      selectedSymptoms.push(item);
      seen.add(item.value);
    }
  }

  // Initialize result with empty selections
  const result: FormTypes.ManischeSymptomatik = {
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
  };

  // Distribute symptoms into their categories
  for (const item of selectedSymptoms) {
    switch (item.category) {
      case 'stimmung':
        result.stimmungEmotionalesErleben[item.value as FormTypes.ManischeStimmungSymptom] = { selected: true, details: {} };
        break;
      case 'antrieb':
        result.antriebEnergiePsychomotorik[item.value as FormTypes.ManischeAntriebSymptom] = { selected: true, details: {} };
        break;
      case 'sprache':
        result.spracheKognition[item.value as FormTypes.ManischeSpracheKognitionSymptom] = { selected: true, details: {} };
        break;
      case 'vegetativ':
        result.vegetativeSymptome[item.value as FormTypes.ManischeVegetativSymptom] = { selected: true, details: {} };
        break;
      case 'selbsterleben':
        result.selbsterleben[item.value as FormTypes.ManischeSelbsterlebenSymptom] = { selected: true, details: {} };
        break;
      case 'verhalten':
        result.verhalten.selection[item.value as FormTypes.ManischesVerhaltenSymptom] = { selected: true, details: {} };
        break;
      case 'impulsives':
        result.verhalten.impulsivesVerhalten.details[item.value as FormTypes.ImpulsivesVerhaltenDetail] = { selected: true, details: {} };
        break;
      case 'psychotisch':
        result.psychotischeSymptome[item.value as FormTypes.ManischePsychotischSymptom] = { selected: true, details: {} };
        break;
      case 'dissoziativ':
        result.dissoziativeSymptome[item.value as FormTypes.ManischeDissociativSymptom] = { selected: true, details: {} };
        break;
    }
  }

  return result;
}

// Generates Depressive Symptomatik with realistic clinical patterns (prioritizes core symptoms)
function generateDepressiveSymptomatik(maxSymptoms: number = 4): FormTypes.DepressiveSymptomatik {
  type SymptomEntry = {
    category: 'stimmung' | 'antrieb' | 'selbsterleben' | 'vegetativ' | 'psychomotorik' | 'kognition' | 'verhalten' | 'psychotisch' | 'dissoziativ' | 'suizidalitaet';
    value: string;
    priority: number;
  };

  const symptomPool: SymptomEntry[] = [
    // Priority 1: Core symptoms (very likely)
    { category: 'stimmung', value: FormTypes.DepressiveStimmungSymptom.GedrueckteStimmung, priority: 1 },
    { category: 'stimmung', value: FormTypes.DepressiveStimmungSymptom.Anhedonie, priority: 1 },
    { category: 'antrieb', value: FormTypes.DepressiveAntriebSymptom.Antriebslosigkeit, priority: 1 },
    { category: 'vegetativ', value: FormTypes.DepressiveVegetativSymptom.Einschlafstoerungen, priority: 1 },
    { category: 'vegetativ', value: FormTypes.DepressiveVegetativSymptom.Durchschlafstoerungen, priority: 1 },

    // Priority 2: Common symptoms (likely)
    { category: 'stimmung', value: FormTypes.DepressiveStimmungSymptom.Hoffnungslosigkeit, priority: 2 },
    { category: 'stimmung', value: FormTypes.DepressiveStimmungSymptom.Interesselosigkeit, priority: 2 },
    { category: 'antrieb', value: FormTypes.DepressiveAntriebSymptom.Energielosigkeit, priority: 2 },
    { category: 'kognition', value: FormTypes.DepressiveKognitionSymptom.KonzentrationsUndAufmerksamkeitsstoerungen, priority: 2 },
    { category: 'selbsterleben', value: FormTypes.DepressiveSelbsterlebenSymptom.ReduzierteSelbstwertgefuehl, priority: 2 },

    // Priority 3: Less common symptoms (possible)
    { category: 'stimmung', value: FormTypes.DepressiveStimmungSymptom.GefuehlVonInnererLeere, priority: 3 },
    { category: 'vegetativ', value: FormTypes.DepressiveVegetativSymptom.AppetitminderungAppetitlosigkeit, priority: 3 },
    { category: 'kognition', value: FormTypes.DepressiveKognitionSymptom.Gruebeln, priority: 3 },
    { category: 'verhalten', value: FormTypes.DepressivesVerhaltenSymptom.SozialerRueckzug, priority: 3 },
    { category: 'selbsterleben', value: FormTypes.DepressiveSelbsterlebenSymptom.Schuldgefuehle, priority: 3 },

    // Priority 4: Rare symptoms
    { category: 'psychotisch', value: FormTypes.DepressivePsychotischSymptom.Schuldwahn, priority: 4 },
    { category: 'psychomotorik', value: FormTypes.DepressivePsychomotorikSymptom.PsychomotorischeHemmungPsychomotorik, priority: 4 },
    { category: 'stimmung', value: FormTypes.DepressiveStimmungSymptom.Pessimismus, priority: 3 },
  ];

  // Select symptoms up to maxSymptoms with weighted probability
  const totalSymptoms = Math.min(maxSymptoms, Math.floor(Math.random() * maxSymptoms) + 1);
  const selectedSymptoms: SymptomEntry[] = [];

  // Create weighted pool (priority 1 symptoms appear 4x, priority 2 appear 3x, etc.)
  const weightedPool = symptomPool.flatMap(item =>
    Array(5 - item.priority).fill(item)
  );

  // Select random symptoms
  const shuffled = [...weightedPool].sort(() => Math.random() - 0.5);
  const seen = new Set<string>();

  for (const item of shuffled) {
    if (selectedSymptoms.length >= totalSymptoms) break;
    if (!seen.has(item.value)) {
      selectedSymptoms.push(item);
      seen.add(item.value);
    }
  }

  // Initialize result with empty selections
  const result: FormTypes.DepressiveSymptomatik = {
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
  };

  // Distribute symptoms into their categories (CardSelection pattern)
  for (const item of selectedSymptoms) {
    switch (item.category) {
      case 'stimmung':
        result.stimmungEmotionalesErleben[item.value as FormTypes.DepressiveStimmungSymptom] = { selected: true, details: {} };
        break;
      case 'antrieb':
        result.antriebEnergiePsychomotorik[item.value as FormTypes.DepressiveAntriebSymptom] = { selected: true, details: {} };
        break;
      case 'selbsterleben':
        result.selbsterleben[item.value as FormTypes.DepressiveSelbsterlebenSymptom] = { selected: true, details: {} };
        break;
      case 'vegetativ':
        result.vegetativeSomatischeSymptome[item.value as FormTypes.DepressiveVegetativSymptom] = { selected: true, details: {} };
        break;
      case 'psychomotorik':
        result.psychomotorischeSymptome[item.value as FormTypes.DepressivePsychomotorikSymptom] = { selected: true, details: {} };
        break;
      case 'kognition':
        result.kognition[item.value as FormTypes.DepressiveKognitionSymptom] = { selected: true, details: {} };
        break;
      case 'verhalten':
        result.verhalten[item.value as FormTypes.DepressivesVerhaltenSymptom] = { selected: true, details: {} };
        break;
      case 'psychotisch':
        result.psychotischeSymptome[item.value as FormTypes.DepressivePsychotischSymptom] = { selected: true, details: {} };
        break;
      case 'dissoziativ':
        result.dissoziativeSymptome[item.value as FormTypes.DepressiveDissociativSymptom] = { selected: true, details: {} };
        break;
    }
  }

  return result;
}

// Generates Angstsymptomatik with realistic clinical patterns (prioritizes core symptoms)
function generateAngstsymptomatik(maxSymptoms: number = 3): FormTypes.Angstsymptomatik {
  type SymptomEntry = {
    category: 'emotionalesErleben' | 'kognition' | 'sorgen' | 'vegetativ' | 'dissoziativ' | 'panikstoerung';
    value: string;
    priority: number;
  };

  const symptomPool: SymptomEntry[] = [
    // Priority 1: Core symptoms (very likely)
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.SituationsinadaequateAngst, priority: 1 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.Erwartungsangst, priority: 1 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.Besorgtheit, priority: 1 },
    { category: 'vegetativ', value: FormTypes.AngstVegetativSymptom.Herzrasen, priority: 1 },
    { category: 'vegetativ', value: FormTypes.AngstVegetativSymptom.InnereAnspannung, priority: 1 },

    // Priority 2: Common symptoms (likely)
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.AngstVorKontrollverlust, priority: 2 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.GefuehlVonUnkontrollierbarkeit, priority: 2 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.Zukunftsaengste, priority: 2 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.GefuehlDerUnsicherheit, priority: 2 },
    { category: 'kognition', value: FormTypes.AngstKognitionSymptom.Gruebeln, priority: 2 },
    { category: 'kognition', value: FormTypes.AngstKognitionSymptom.Gedankenkreisen, priority: 2 },
    { category: 'sorgen', value: FormTypes.AngstSorgenTyp.UeberZukunft, priority: 2 },
    { category: 'sorgen', value: FormTypes.AngstSorgenTyp.UeberEigeneGesundheit, priority: 2 },
    { category: 'vegetativ', value: FormTypes.AngstVegetativSymptom.Schweissausbrueche, priority: 2 },
    { category: 'vegetativ', value: FormTypes.AngstVegetativSymptom.Zittern, priority: 2 },
    { category: 'vegetativ', value: FormTypes.AngstVegetativSymptom.Schwindel, priority: 2 },
    { category: 'vegetativ', value: FormTypes.AngstVegetativSymptom.Schlafstoerungen, priority: 2 },

    // Priority 3: Less common symptoms (possible)
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.AngstVorDerAngst, priority: 3 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.ErhoehtSchreckhaftigkeit, priority: 3 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.Reizbarkeit, priority: 3 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.Ohnmachtsgefuehl, priority: 3 },
    { category: 'kognition', value: FormTypes.AngstKognitionSymptom.KatastrophisierendesDenken, priority: 3 },
    { category: 'sorgen', value: FormTypes.AngstSorgenTyp.UeberFinanzen, priority: 3 },
    { category: 'sorgen', value: FormTypes.AngstSorgenTyp.UeberFamilie, priority: 3 },
    { category: 'vegetativ', value: FormTypes.AngstVegetativSymptom.Atemnot, priority: 3 },
    { category: 'vegetativ', value: FormTypes.AngstVegetativSymptom.Uebelkeit, priority: 3 },
    { category: 'vegetativ', value: FormTypes.AngstVegetativSymptom.Muskelverspannung, priority: 3 },
    { category: 'vegetativ', value: FormTypes.AngstVegetativSymptom.NervositaetUndRuhelosigkeit, priority: 3 },

    // Priority 4: Rare symptoms
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.Todesangst, priority: 4 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.AngstVerruecktZuWerden, priority: 4 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.Schamgefuehl, priority: 4 },
    { category: 'kognition', value: FormTypes.AngstKognitionSymptom.FormalgedanklicheEinengung, priority: 4 },
    { category: 'sorgen', value: FormTypes.AngstSorgenTyp.UeberAlltag, priority: 4 },
    { category: 'vegetativ', value: FormTypes.AngstVegetativSymptom.Erstickungsgefuehl, priority: 4 },
    { category: 'vegetativ', value: FormTypes.AngstVegetativSymptom.Brustschmerzen, priority: 4 },
    { category: 'vegetativ', value: FormTypes.AngstVegetativSymptom.Taubheitsgefuehle, priority: 4 },

    // Dissoziative Symptome (Priority 3-4: less common)
    { category: 'dissoziativ', value: FormTypes.AngstDissociativSymptom.Derealisation, priority: 3 },
    { category: 'dissoziativ', value: FormTypes.AngstDissociativSymptom.Depersonalisation, priority: 3 },

    // Panikstörung (Priority 2-3: common with panic disorder)
    { category: 'panikstoerung', value: FormTypes.AngstPanikstoerungSymptom.PanikattackeMitKlassischenVegetativenSymptomen, priority: 2 },
    { category: 'panikstoerung', value: FormTypes.AngstPanikstoerungSymptom.WiederkehrendeUnvorhersehbarePanikattacken, priority: 3 },
    { category: 'panikstoerung', value: FormTypes.AngstPanikstoerungSymptom.NichtSituationsgebundenePanikattacken, priority: 3 },
    { category: 'panikstoerung', value: FormTypes.AngstPanikstoerungSymptom.PanikattackenMitRaschemHoehepunkt, priority: 3 },
  ];

  // Select symptoms up to maxSymptoms with weighted probability
  const totalSymptoms = Math.min(maxSymptoms, Math.floor(Math.random() * maxSymptoms) + 1);
  const selectedSymptoms: SymptomEntry[] = [];

  // Create weighted pool (priority 1 symptoms appear 4x, priority 2 appear 3x, etc.)
  const weightedPool = symptomPool.flatMap(item =>
    Array(5 - item.priority).fill(item)
  );

  // Select random symptoms
  const shuffled = [...weightedPool].sort(() => Math.random() - 0.5);
  const seen = new Set<string>();

  for (const item of shuffled) {
    if (selectedSymptoms.length >= totalSymptoms) break;
    if (!seen.has(item.value)) {
      selectedSymptoms.push(item);
      seen.add(item.value);
    }
  }

  // Initialize result with empty selections
  const result: FormTypes.Angstsymptomatik = {
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
  };

  // Track if we need sorgen structure
  let hasSorgen = false;
  const sorgenDetails: FormTypes.AngstSorgenDetails = {};

  // Distribute symptoms into their categories
  for (const item of selectedSymptoms) {
    switch (item.category) {
      case 'emotionalesErleben':
        result.emotionalesErleben[item.value as FormTypes.AngstEmotionalesErlebenSymptom] = 'selected';
        break;
      case 'kognition':
        result.kognition[item.value as FormTypes.AngstKognitionSymptom] = 'selected';
        break;
      case 'sorgen':
        hasSorgen = true;
        // New structure: { selected: true, details: { text?: string } }
        sorgenDetails[item.value as FormTypes.AngstSorgenTyp] = {
          selected: true,
          details: {} // No text for random generation
        };
        break;
      case 'vegetativ':
        result.vegetativeSymptome[item.value as FormTypes.AngstVegetativSymptom] = 'selected';
        break;
      case 'dissoziativ':
        result.dissoziativeSymptome[item.value as FormTypes.AngstDissociativSymptom] = 'selected';
        break;
      case 'panikstoerung':
        result.panikstoerung[item.value as FormTypes.AngstPanikstoerungSymptom] = 'selected';
        break;
    }
  }

  // Add sorgen to kognition if any were selected
  if (hasSorgen) {
    result.kognition.sorgen = {
      selected: true,
      details: sorgenDetails
    };
  }

  // Track total symptoms generated for budget enforcement
  let symptomsGenerated = selectedSymptoms.length;

  // Verhalten text field examples
  const verhaltenExamples: Record<FormTypes.AngstVerhaltenFeld, string[]> = {
    [FormTypes.AngstVerhaltenFeld.Vermeidungsverhalten]: [
      'Meidung öffentlicher Verkehrsmittel',
      'Vermeidung von Menschenmengen',
      'Vermeidung sozialer Situationen',
      'Meidung von Aufzügen und engen Räumen',
      'Vermeidung von Autofahrten auf der Autobahn',
    ],
    [FormTypes.AngstVerhaltenFeld.Sicherheitsverhalten]: [
      'ständiges Mitführen von Medikamenten',
      'Begleitung durch Angehörige bei Außer-Haus-Aktivitäten',
      'Sitzen in der Nähe des Ausgangs',
      'Vermeidung von Situationen ohne Fluchtmöglichkeit',
      'ständige Erreichbarkeit von Vertrauenspersonen',
    ],
    [FormTypes.AngstVerhaltenFeld.Rueckversicherungsverhalten]: [
      'häufiges Nachfragen bei Angehörigen bezüglich Gesundheitszustand',
      'wiederholte Arztbesuche zur Ausschlussdiagnostik',
      'exzessives Googeln von Symptomen',
      'mehrmaliges tägliches Überprüfen von Körpersymptomen',
      'wiederholtes Suchen nach Bestätigung bei Partner*in',
    ],
    [FormTypes.AngstVerhaltenFeld.BodyChecking]: [
      'mehrmaliges tägliches Messen von Puls und Blutdruck',
      'ständiges Abtasten des Körpers nach Veränderungen',
      'häufige Selbstuntersuchung der Haut',
      'regelmäßiges Überprüfen der Atmung',
      'wiederholtes Kontrollieren des Herzschlags',
    ],
  };

  // Randomly generate verhalten text fields (30% chance each, respecting budget)
  for (const feld of Object.values(FormTypes.AngstVerhaltenFeld)) {
    if (symptomsGenerated >= maxSymptoms) break;
    if (Math.random() < 0.3) {
      const examples = verhaltenExamples[feld];
      result.verhalten[feld] = examples[Math.floor(Math.random() * examples.length)];
      symptomsGenerated++;
    }
  }

  // Randomly generate agoraphobie (20% chance, only if budget allows)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.2) {
    const paniksymptomatik = Math.random() < 0.5 ? 'mit' : 'ohne';
    const bereiche: FormTypes.AgoraphobieBereiche = {};
    const fluchtmoeglichkeiten: FormTypes.AgoraphobieFluchtSelection = {};

    // Randomly select 1-3 bereiche
    const bereichePool = Object.values(FormTypes.AgoraphobieBereich);
    const numBereiche = Math.floor(Math.random() * 3) + 1;
    const shuffledBereiche = [...bereichePool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(numBereiche, shuffledBereiche.length); i++) {
      bereiche[shuffledBereiche[i]] = 'selected';
    }

    // Randomly select 0-2 fluchtmoeglichkeiten
    const fluchtPool = Object.values(FormTypes.AgoraphobieFlucht);
    const numFlucht = Math.floor(Math.random() * 3); // 0, 1, or 2
    const shuffledFlucht = [...fluchtPool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(numFlucht, shuffledFlucht.length); i++) {
      fluchtmoeglichkeiten[shuffledFlucht[i]] = 'selected';
    }

    result.agoraphobie = {
      paniksymptomatik,
      bereiche,
      bereicheAndere: '',
      fluchtmoeglichkeiten,
      fluchtmoeglichkeitenAndere: ''
    };
    symptomsGenerated++;
  }

  // Randomly generate sozialePhobie (15% chance, only if budget allows)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.15) {
    const hauptsymptome: FormTypes.SozialePhobieHauptsymptomSelection = {};
    const bereichSelection: FormTypes.SozialePhobieBereichSelection = {};
    const vegetativSelection: FormTypes.SozialePhobieVegetativSelection = {};

    // Randomly select 1-2 hauptsymptome
    const hauptsymptomePool = Object.values(FormTypes.SozialePhobieHauptsymptom);
    const numHaupt = Math.floor(Math.random() * 2) + 1;
    const shuffledHaupt = [...hauptsymptomePool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(numHaupt, shuffledHaupt.length); i++) {
      hauptsymptome[shuffledHaupt[i]] = 'selected';
    }

    // Randomly select 1-3 bereiche
    const bereichePool = Object.values(FormTypes.SozialePhobieBereichSymptom);
    const numBereiche = Math.floor(Math.random() * 3) + 1;
    const shuffledBereiche = [...bereichePool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(numBereiche, shuffledBereiche.length); i++) {
      bereichSelection[shuffledBereiche[i]] = 'selected';
    }

    // Randomly select 0-2 vegetative symptome
    const vegetativPool = Object.values(FormTypes.SozialePhobieVegetativSymptom);
    const numVeg = Math.floor(Math.random() * 3); // 0, 1, or 2
    const shuffledVeg = [...vegetativPool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(numVeg, shuffledVeg.length); i++) {
      vegetativSelection[shuffledVeg[i]] = 'selected';
    }

    result.sozialePhobie = {
      hauptsymptome,
      bereichSozialerAengste: {
        selection: bereichSelection,
        andere: ''
      },
      vegetativeSymptome: {
        selection: vegetativSelection,
        andere: ''
      }
    };
    symptomsGenerated++;
  }

  // Randomly generate spezifischePhobien (10% chance, only if budget allows)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.1) {
    const phobiePool = Object.values(FormTypes.SpezifischePhobieSymptom);
    // Only add 1 phobia to respect budget
    const shuffledPhobien = [...phobiePool].sort(() => Math.random() - 0.5);
    result.spezifischePhobien[shuffledPhobien[0]] = 'selected';
    symptomsGenerated++;
  }

  // Randomly generate generalisierteAngst (15% chance, only if budget allows)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.15) {
    const symptomPool = Object.values(FormTypes.GeneralisierteAngstSymptom);
    // Only add 1 symptom to respect budget
    const shuffledSymptoms = [...symptomPool].sort(() => Math.random() - 0.5);
    result.generalisierteAngst.selection[shuffledSymptoms[0]] = 'selected';

    // 40% chance to add text for sorgenLebensbereiche
    if (Math.random() < 0.4) {
      const lebensbereicheExamples = [
        'Arbeit, Familie, Finanzen',
        'berufliche Leistung, Gesundheit der Angehörigen',
        'Zukunft der Kinder, finanzielle Sicherheit',
        'Gesundheit, Beziehungen, berufliche Situation',
        'alltägliche Verpflichtungen, soziale Beziehungen',
      ];
      result.generalisierteAngst.sorgenLebensbereiche =
        lebensbereicheExamples[Math.floor(Math.random() * lebensbereicheExamples.length)];
    }
    symptomsGenerated++;
  }

  return result;
}

// Generates Zwangssymptomatik with realistic clinical patterns (prioritizes core symptoms)
function generateZwangssymptomatik(maxSymptoms: number = 3): FormTypes.Zwangssymptomatik {
  // If maxSymptoms is 0, return empty
  if (maxSymptoms <= 0) {
    return {
      zwangsgedanken: {},
      zwangshandlungen: {},
      zwangsbezogeneKognitionen: {},
      andereSymptome: ''
    };
  }

  // Example text content for each field
  const wiederkehrendExamples: Record<FormTypes.ZwangsgedankenWiederkehrendFeld, string[]> = {
    [FormTypes.ZwangsgedankenWiederkehrendFeld.AufdringlicheGedanken]: [
      'wiederkehrende Gedanken an vergangene Fehler',
      'aufdringliche Erinnerungen an peinliche Situationen',
      'sich wiederholende Gedanken über mögliche Katastrophen',
    ],
    [FormTypes.ZwangsgedankenWiederkehrendFeld.AggressiveZwangsgedanken]: [
      'Angst, anderen unbeabsichtigt Schaden zuzufügen',
      'beunruhigende Gedanken über Gewalt gegen nahestehende Personen',
      'Befürchtung, die Kontrolle zu verlieren und aggressiv zu werden',
    ],
    [FormTypes.ZwangsgedankenWiederkehrendFeld.SexuelleZwangsgedanken]: [
      'ungewollte Gedanken sexueller Natur',
      'beunruhigende Vorstellungen trotz Ablehnung',
    ],
    [FormTypes.ZwangsgedankenWiederkehrendFeld.ReligioeseBlasFhemischeZwangsgedanken]: [
      'quälende Gedanken über religiöse Verfehlungen',
      'blasphemische Gedanken trotz tiefer Religiosität',
      'Angst vor göttlicher Strafe für Gedanken',
    ],
    [FormTypes.ZwangsgedankenWiederkehrendFeld.Kontaminationsgedanken]: [
      'übermäßige Angst vor Keimen und Bakterien',
      'Befürchtung, durch Berührungen kontaminiert zu werden',
      'Sorge über Verunreinigung durch alltägliche Gegenstände',
    ],
    [FormTypes.ZwangsgedankenWiederkehrendFeld.MagischesDenken]: [
      'Überzeugung, durch Gedanken Ereignisse beeinflussen zu können',
      'Rituale zur Abwendung von Unglück',
      'Verbindung zwischen eigenen Gedanken und externen Ereignissen',
    ],
    [FormTypes.ZwangsgedankenWiederkehrendFeld.Andere]: [
      'Ordnungszwänge mit Symmetriebedürfnis',
      'Zweifel an korrekt ausgeführten Handlungen',
    ],
  };

  const zwanghafteIdeenExamples = [
    'bildhafte Vorstellungen von Unfällen oder Katastrophen',
    'lebhafte Vorstellungen von Krankheit bei Angehörigen',
    'intrusive Bilder von Verunreinigung',
  ];

  const zwangsimpulseExamples = [
    'Impuls, unangemessene Dinge zu sagen',
    'Drang, in gefährliche Situationen zu springen',
    'Impuls, wichtige Gegenstände zu zerstören',
  ];

  // Initialize with empty structure
  const zwangsgedanken: FormTypes.ZwangsgedankenSelected = {
    wiederkehrendeZwangsgedanken: {},
    zwanghafteIdeen: '',
    zwangsimpulse: ''
  };

  // Track symptom count to respect maxSymptoms budget
  let symptomsGenerated = 0;

  // Randomly select wiederkehrende fields (respecting maxSymptoms)
  const wiederkehrendFields = Object.values(FormTypes.ZwangsgedankenWiederkehrendFeld);
  const numWiederkehrend = Math.min(Math.floor(Math.random() * 3) + 1, maxSymptoms); // 1-3, capped
  const shuffledFields = [...wiederkehrendFields].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(numWiederkehrend, shuffledFields.length) && symptomsGenerated < maxSymptoms; i++) {
    const field = shuffledFields[i];
    const examples = wiederkehrendExamples[field];
    zwangsgedanken.wiederkehrendeZwangsgedanken[field] = examples[Math.floor(Math.random() * examples.length)];
    symptomsGenerated++;
  }

  // 30% chance to add zwanghafte Ideen (if budget allows)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.3) {
    zwangsgedanken.zwanghafteIdeen = zwanghafteIdeenExamples[Math.floor(Math.random() * zwanghafteIdeenExamples.length)];
    symptomsGenerated++;
  }

  // 20% chance to add Zwangsimpulse (if budget allows)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.2) {
    zwangsgedanken.zwangsimpulse = zwangsimpulseExamples[Math.floor(Math.random() * zwangsimpulseExamples.length)];
    symptomsGenerated++;
  }

  // Example text content for Zwangshandlungen
  const zwangshandlungExamples: Record<FormTypes.ZwangshandlungTyp, string[]> = {
    [FormTypes.ZwangshandlungTyp.Kontrollzwang]: [
      'wiederholtes Überprüfen von Türen und Fenstern',
      'mehrfaches Kontrollieren von Herd und elektrischen Geräten',
      'ständiges Überprüfen der Handtasche auf wichtige Gegenstände',
    ],
    [FormTypes.ZwangshandlungTyp.Waschzwang]: [
      'exzessives Händewaschen nach Berührung von Gegenständen',
      'stundenlange Duschroutinen mit festgelegter Abfolge',
      'rituelles Reinigen von Gegenständen vor Benutzung',
    ],
    [FormTypes.ZwangshandlungTyp.Ordnungszwang]: [
      'zwanghaftes Ausrichten von Gegenständen',
      'exaktes Sortieren nach Größe und Farbe',
      'Unbehagen bei kleinsten Abweichungen von der Ordnung',
    ],
    [FormTypes.ZwangshandlungTyp.Wiederholungszwang]: [
      'mehrfaches Wiederholen von Handlungen wie Türen öffnen',
      'wiederholtes Ein- und Aussteigen aus dem Auto',
      'rituelles Wiederholen von Alltagshandlungen',
    ],
    [FormTypes.ZwangshandlungTyp.Zaehlzwang]: [
      'zwanghaftes Zählen von Treppenstufen',
      'Zählen von Gegenständen in bestimmten Mustern',
      'Notwendigkeit, Handlungen in bestimmten Zahlen auszuführen',
    ],
    [FormTypes.ZwangshandlungTyp.Symmetriezwang]: [
      'Bedürfnis nach exakter Symmetrie bei der Anordnung',
      'beidseitiges Berühren von Gegenständen',
      'Ausbalancieren von Empfindungen auf beiden Körperseiten',
    ],
    [FormTypes.ZwangshandlungTyp.Sammelzwang]: [
      'zwanghaftes Aufbewahren nutzloser Gegenstände',
      'Unfähigkeit, alte Zeitungen oder Verpackungen wegzuwerfen',
      'Anhäufen von Gegenständen aus Angst, sie zu benötigen',
    ],
    [FormTypes.ZwangshandlungTyp.MentaleZwangsrituale]: [
      'stummes Wiederholen von Gebeten oder Formeln',
      'gedankliches Durchgehen von Sicherheits-Checklisten',
      'mentales Neutralisieren von "schlechten" Gedanken',
    ],
  };

  // 40% chance to have Zwangshandlungen (only if budget allows)
  let zwangshandlungen: FormTypes.Zwangshandlungen = {};

  if (symptomsGenerated < maxSymptoms && Math.random() < 0.4) {
    // Calculate remaining budget for Zwangshandlungen
    const remainingBudget = maxSymptoms - symptomsGenerated;
    const zwangshandlungTypes = Object.values(FormTypes.ZwangshandlungTyp);
    // Limit to remaining budget
    const numHandlungen = Math.min(remainingBudget, Math.floor(Math.random() * 3) + 1);
    const shuffledTypes = [...zwangshandlungTypes].sort(() => Math.random() - 0.5);

    const details: FormTypes.ZwangshandlungDetails = {};
    for (let i = 0; i < Math.min(numHandlungen, shuffledTypes.length); i++) {
      const typ = shuffledTypes[i];
      const examples = zwangshandlungExamples[typ];
      // 60% chance to add detail text
      const text = Math.random() < 0.6
        ? examples[Math.floor(Math.random() * examples.length)]
        : undefined;
      details[typ] = { selected: true, details: { text } };
      symptomsGenerated++;
    }

    zwangshandlungen = {
      selected: true,
      details,
      andere: ''
    };
  }

  // 50% chance to have zwangsbezogene Kognitionen (only if budget allows)
  const zwangsbezogeneKognitionen: FormTypes.ZwangsbezogeneKognitionSelection = {};
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.5) {
    // Calculate remaining budget for Kognitionen
    const remainingBudget = maxSymptoms - symptomsGenerated;
    const kognitionSymptoms = Object.values(FormTypes.ZwangsbezogeneKognitionSymptom);
    // Limit to remaining budget
    const numSymptoms = Math.min(remainingBudget, Math.floor(Math.random() * 4) + 1);
    const shuffledSymptoms = [...kognitionSymptoms].sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(numSymptoms, shuffledSymptoms.length); i++) {
      zwangsbezogeneKognitionen[shuffledSymptoms[i]] = 'selected';
      symptomsGenerated++;
    }
  }

  return {
    zwangsgedanken,
    zwangshandlungen,
    zwangsbezogeneKognitionen,
    andereSymptome: ''
  };
}

// Creates an empty ManischeSymptomatik structure
function createEmptyManischeSymptomatik(): FormTypes.ManischeSymptomatik {
  return {
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
  };
}

// Creates an empty DepressiveSymptomatik structure
function createEmptyDepressiveSymptomatik(): FormTypes.DepressiveSymptomatik {
  return {
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
  };
}

// Creates an empty Angstsymptomatik structure
function createEmptyAngstsymptomatik(): FormTypes.Angstsymptomatik {
  return {
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
  };
}

// Creates an empty Zwangssymptomatik structure
function createEmptyZwangssymptomatik(): FormTypes.Zwangssymptomatik {
  return {
    zwangsgedanken: {},
    zwangshandlungen: {},
    zwangsbezogeneKognitionen: {},
    andereSymptome: '',
  };
}

// Generates all symptom data with realistic distribution (max 7 symptoms, max 3 active categories)
export function generateSymptoms(): SymptomsData {
  // Get the realistic distribution
  const distribution = generateRealisticSymptomDistribution();

  // Initialize all categories as empty
  let manischeSymptomatik = createEmptyManischeSymptomatik();
  let depressiveSymptomatik = createEmptyDepressiveSymptomatik();
  let angstsymptomatik = createEmptyAngstsymptomatik();
  let zwangssymptomatik = createEmptyZwangssymptomatik();

  // Only generate for active categories with their allocated budget
  if (distribution.activeCategories.includes('manisch')) {
    manischeSymptomatik = generateManischeSymptomatik(distribution.symptomsPerCategory.manisch);
  }

  if (distribution.activeCategories.includes('depressiv')) {
    depressiveSymptomatik = generateDepressiveSymptomatik(distribution.symptomsPerCategory.depressiv);
  }

  if (distribution.activeCategories.includes('angst')) {
    angstsymptomatik = generateAngstsymptomatik(distribution.symptomsPerCategory.angst);
  }

  if (distribution.activeCategories.includes('zwang')) {
    zwangssymptomatik = generateZwangssymptomatik(distribution.symptomsPerCategory.zwang);
  }

  return {
    manischeSymptomatik,
    depressiveSymptomatik,
    angstsymptomatik,
    zwangssymptomatik,
  };
}
