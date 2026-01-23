// Generates random symptom data with realistic clinical distribution

import * as FormTypes from '../core/form-types';

const MAX_TOTAL_SYMPTOMS = 7;
const MIN_TOTAL_SYMPTOMS = 3;
const MAX_ACTIVE_CATEGORIES = 3;

type SymptomCategory = 'manisch' | 'depressiv' | 'angst' | 'zwang' | 'trauma' | 'psychose' | 'organic' | 'somatoform' | 'schlaf' | 'essstoerung' | 'substanz' | 'dissociativ' | 'persoenlichkeit' | 'impulskontroll' | 'sexuell' | 'geschlecht' | 'hyperkinetisch' | 'tic' | 'suizidalitaet' | 'sonstige';

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
  const allCategories: SymptomCategory[] = ['manisch', 'depressiv', 'angst', 'zwang', 'trauma', 'psychose', 'organic', 'somatoform', 'schlaf', 'essstoerung', 'substanz', 'dissociativ', 'persoenlichkeit', 'impulskontroll', 'sexuell', 'geschlecht', 'hyperkinetisch', 'tic', 'suizidalitaet', 'sonstige'];
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
  traumafolgesymptomatik: FormTypes.Traumafolgesymptomatik;
  psychotischeSymptomatik: FormTypes.PsychotischeSymptomatik;
  organischeSymptomatik: FormTypes.OrganischeSymptomatik;
  somatoformeSymptomatik: FormTypes.SomatoformeSymptomatik;
  nichtorganischeSchlafstoerungen: FormTypes.NichtorganischeSchlafstoerungen;
  essstoerungen: FormTypes.Essstoerungen;
  substanzbezogeneSymptomatik: FormTypes.SubstanzbezogeneSymptomatik;
  dissociativeSymptomatik: FormTypes.DissociativeSymptomatik;
  persoenlichkeitsstoerungen: FormTypes.Persoenlichkeitsstoerungen;
  impulskontrollstoerungen: FormTypes.Impulskontrollstoerungen;
  sexuellbezogeneSymptome: FormTypes.SexuellbezogeneSymptome;
  geschlechtsidentitaet: FormTypes.GeschlechtsidentitaetSymptomatik;
  hyperkinetischeStoerungen: FormTypes.HyperkinetischeStoerungen;
  ticStoerungen: FormTypes.TicStoerungen;
  suizidalitaetSymptomatik: FormTypes.SuizidalitaetSymptomatik;
  sonstigeSymptomatik: FormTypes.SonstigeSymptomatik;
  symptomatikKontext: FormTypes.SymptomatikKontext;
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
    category: 'emotionalesErleben' | 'kognition' | 'sorgen' | 'somatovegetativ' | 'dissoziativ' | 'panikstoerung';
    value: string;
    priority: number;
  };

  const symptomPool: SymptomEntry[] = [
    // Priority 1: Core symptoms (very likely)
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.SituationsinadaequateAngst, priority: 1 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.Erwartungsangst, priority: 1 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.Besorgtheit, priority: 1 },
    { category: 'somatovegetativ', value: FormTypes.AngstSomatovegetativSymptom.Herzrasen, priority: 1 },
    { category: 'somatovegetativ', value: FormTypes.AngstSomatovegetativSymptom.InnereAnspannung, priority: 1 },

    // Priority 2: Common symptoms (likely)
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.AngstVorKontrollverlust, priority: 2 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.GefuehlVonUnkontrollierbarkeit, priority: 2 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.Zukunftsaengste, priority: 2 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.GefuehlDerUnsicherheit, priority: 2 },
    { category: 'kognition', value: FormTypes.AngstKognitionSymptom.Gruebeln, priority: 2 },
    { category: 'kognition', value: FormTypes.AngstKognitionSymptom.Gedankenkreisen, priority: 2 },
    { category: 'sorgen', value: FormTypes.AngstSorgenTyp.UeberZukunft, priority: 2 },
    { category: 'sorgen', value: FormTypes.AngstSorgenTyp.UeberEigeneGesundheit, priority: 2 },
    { category: 'somatovegetativ', value: FormTypes.AngstSomatovegetativSymptom.Schweissausbrueche, priority: 2 },
    { category: 'somatovegetativ', value: FormTypes.AngstSomatovegetativSymptom.Zittern, priority: 2 },
    { category: 'somatovegetativ', value: FormTypes.AngstSomatovegetativSymptom.Schwindel, priority: 2 },
    { category: 'somatovegetativ', value: FormTypes.AngstSomatovegetativSymptom.Einschlafstoerungen, priority: 2 },
    { category: 'somatovegetativ', value: FormTypes.AngstSomatovegetativSymptom.Durchschlafstoerungen, priority: 2 },

    // Priority 3: Less common symptoms (possible)
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.AngstVorDerAngst, priority: 3 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.ErhoehtSchreckhaftigkeit, priority: 3 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.Reizbarkeit, priority: 3 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.Ohnmachtsgefuehl, priority: 3 },
    { category: 'kognition', value: FormTypes.AngstKognitionSymptom.KatastrophisierendesDenken, priority: 3 },
    { category: 'sorgen', value: FormTypes.AngstSorgenTyp.UeberFinanzen, priority: 3 },
    { category: 'sorgen', value: FormTypes.AngstSorgenTyp.UeberFamilie, priority: 3 },
    { category: 'somatovegetativ', value: FormTypes.AngstSomatovegetativSymptom.Atemnot, priority: 3 },
    { category: 'somatovegetativ', value: FormTypes.AngstSomatovegetativSymptom.Uebelkeit, priority: 3 },
    { category: 'somatovegetativ', value: FormTypes.AngstSomatovegetativSymptom.Muskelverspannung, priority: 3 },
    { category: 'somatovegetativ', value: FormTypes.AngstSomatovegetativSymptom.NervositaetUndRuhelosigkeit, priority: 3 },

    // Priority 4: Rare symptoms
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.Todesangst, priority: 4 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.AngstVerruecktZuWerden, priority: 4 },
    { category: 'emotionalesErleben', value: FormTypes.AngstEmotionalesErlebenSymptom.Schamgefuehl, priority: 4 },
    { category: 'kognition', value: FormTypes.AngstKognitionSymptom.FormalgedanklicheEinengung, priority: 4 },
    { category: 'sorgen', value: FormTypes.AngstSorgenTyp.UeberAlltag, priority: 4 },
    { category: 'somatovegetativ', value: FormTypes.AngstSomatovegetativSymptom.Erstickungsgefuehl, priority: 4 },
    { category: 'somatovegetativ', value: FormTypes.AngstSomatovegetativSymptom.Brustschmerzen, priority: 4 },
    { category: 'somatovegetativ', value: FormTypes.AngstSomatovegetativSymptom.Taubheitsgefuehle, priority: 4 },

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
  };

  // Track if we need sorgen structure
  let hasSorgen = false;
  const sorgenDetails: FormTypes.AngstSorgenDetails = {};

  // Distribute symptoms into their categories
  for (const item of selectedSymptoms) {
    switch (item.category) {
      case 'emotionalesErleben':
        result.emotionalesErleben[item.value as FormTypes.AngstEmotionalesErlebenSymptom] = { selected: true, details: {} };
        break;
      case 'kognition':
        result.kognition[item.value as FormTypes.AngstKognitionSymptom] = { selected: true, details: {} };
        break;
      case 'sorgen':
        hasSorgen = true;
        // New structure: { selected: true, details: { text?: string } }
        sorgenDetails[item.value as FormTypes.AngstSorgenTyp] = {
          selected: true,
          details: {} // No text for random generation
        };
        break;
      case 'somatovegetativ':
        result.somatovegetativeSymptome[item.value as FormTypes.AngstSomatovegetativSymptom] = { selected: true, details: {} };
        break;
      case 'dissoziativ':
        result.dissoziativeSymptome[item.value as FormTypes.AngstDissociativSymptom] = { selected: true, details: {} };
        break;
      case 'panikstoerung':
        result.panikstoerung[item.value as FormTypes.AngstPanikstoerungSymptom] = { selected: true, details: {} };
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

  // Randomly generate verhalten CardSelection (30% chance each, respecting budget)
  for (const feld of Object.values(FormTypes.AngstVerhaltenFeld)) {
    if (symptomsGenerated >= maxSymptoms) break;
    if (Math.random() < 0.3) {
      const examples = verhaltenExamples[feld];
      result.verhalten[feld] = {
        selected: true,
        details: { brackets: examples[Math.floor(Math.random() * examples.length)] }
      };
      symptomsGenerated++;
    }
  }

  // Randomly generate agoraphobie (20% chance, only if budget allows)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.2) {
    const selectedOption = Math.random() < 0.5
      ? FormTypes.AgoraphobiePaniksymptomatik.Mit
      : FormTypes.AgoraphobiePaniksymptomatik.Ohne;
    const paniksymptomatik: FormTypes.AgoraphobiePaniksymptomatikSelection = {
      [selectedOption]: { selected: true, details: {} }
    };
    const bereiche: FormTypes.AgoraphobieBereiche = {};
    const fluchtmoeglichkeiten: FormTypes.AgoraphobieFluchtSelection = {};

    // Randomly select 1-3 bereiche (CardSelection pattern)
    const bereichePool = Object.values(FormTypes.AgoraphobieBereich);
    const numBereiche = Math.floor(Math.random() * 3) + 1;
    const shuffledBereiche = [...bereichePool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(numBereiche, shuffledBereiche.length); i++) {
      bereiche[shuffledBereiche[i]] = { selected: true, details: {} };
    }

    // Randomly select 0-2 fluchtmoeglichkeiten (CardSelection pattern)
    const fluchtPool = Object.values(FormTypes.AgoraphobieFlucht);
    const numFlucht = Math.floor(Math.random() * 3); // 0, 1, or 2
    const shuffledFlucht = [...fluchtPool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(numFlucht, shuffledFlucht.length); i++) {
      fluchtmoeglichkeiten[shuffledFlucht[i]] = { selected: true, details: {} };
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

    // Randomly select 1-2 hauptsymptome (CardSelection pattern)
    const hauptsymptomePool = Object.values(FormTypes.SozialePhobieHauptsymptom);
    const numHaupt = Math.floor(Math.random() * 2) + 1;
    const shuffledHaupt = [...hauptsymptomePool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(numHaupt, shuffledHaupt.length); i++) {
      hauptsymptome[shuffledHaupt[i]] = { selected: true, details: {} };
    }

    // Randomly select 1-3 bereiche (CardSelection pattern)
    const bereichePool = Object.values(FormTypes.SozialePhobieBereichSymptom);
    const numBereiche = Math.floor(Math.random() * 3) + 1;
    const shuffledBereiche = [...bereichePool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(numBereiche, shuffledBereiche.length); i++) {
      bereichSelection[shuffledBereiche[i]] = { selected: true, details: {} };
    }

    // Randomly select 0-2 vegetative symptome (CardSelection pattern)
    const vegetativPool = Object.values(FormTypes.SozialePhobieVegetativSymptom);
    const numVeg = Math.floor(Math.random() * 3); // 0, 1, or 2
    const shuffledVeg = [...vegetativPool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(numVeg, shuffledVeg.length); i++) {
      vegetativSelection[shuffledVeg[i]] = { selected: true, details: {} };
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

  // Randomly generate spezifischePhobien (10% chance, only if budget allows) - CardSelection pattern
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.1) {
    const phobiePool = Object.values(FormTypes.SpezifischePhobieSymptom);
    // Only add 1 phobia to respect budget
    const shuffledPhobien = [...phobiePool].sort(() => Math.random() - 0.5);
    result.spezifischePhobien[shuffledPhobien[0]] = { selected: true, details: {} };
    symptomsGenerated++;
  }

  // Randomly generate generalisierteAngst (15% chance, only if budget allows) - CardSelection pattern
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.15) {
    const hauptsymptome: FormTypes.GeneralisierteAngstHauptsymptomSelection = {};
    const sorgenSelection: FormTypes.GeneralisierteAngstSorgenSelection = {};

    // Randomly select 1-2 hauptsymptome
    const hauptPool = Object.values(FormTypes.GeneralisierteAngstHauptsymptom);
    const numHaupt = Math.floor(Math.random() * 2) + 1;
    const shuffledHaupt = [...hauptPool].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(numHaupt, shuffledHaupt.length); i++) {
      hauptsymptome[shuffledHaupt[i]] = { selected: true, details: {} };
    }

    // 50% chance to add sorgen symptoms
    if (Math.random() < 0.5) {
      const sorgenPool = Object.values(FormTypes.GeneralisierteAngstSorgenSymptom);
      const numSorgen = Math.floor(Math.random() * 3) + 1;
      const shuffledSorgen = [...sorgenPool].sort(() => Math.random() - 0.5);
      for (let i = 0; i < Math.min(numSorgen, shuffledSorgen.length); i++) {
        sorgenSelection[shuffledSorgen[i]] = { selected: true, details: {} };
      }
    }

    result.generalisierteAngst = {
      hauptsymptome,
      sorgen: {
        selection: sorgenSelection,
        andere: ''
      }
    };
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
    [FormTypes.ZwangsgedankenWiederkehrendFeld.Gruebelzwang]: [
      'zwanghaftes Grübeln über vergangene Entscheidungen',
      'ständiges Hinterfragen eigener Handlungen',
      'endloses Nachdenken über mögliche Fehler',
    ],
    [FormTypes.ZwangsgedankenWiederkehrendFeld.Andere]: [
      'Ordnungszwänge mit Symmetriebedürfnis',
      'Zweifel an korrekt ausgeführten Handlungen',
    ],
  };

  const zwanghafteIdeenExamples = [
    'wiederkehrende Idee, etwas Wichtiges vergessen zu haben',
    'quälende Idee, anderen geschadet zu haben',
    'zwanghafte Idee über mögliche Versäumnisse',
  ];

  const bildhafteZwangsvorstellungenExamples = [
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
    bildhafteZwangsvorstellungen: '',
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

  // 25% chance to add zwanghafte Ideen (if budget allows)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.25) {
    zwangsgedanken.zwanghafteIdeen = zwanghafteIdeenExamples[Math.floor(Math.random() * zwanghafteIdeenExamples.length)];
    symptomsGenerated++;
  }

  // 25% chance to add bildhafte Zwangsvorstellungen (if budget allows)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.25) {
    zwangsgedanken.bildhafteZwangsvorstellungen = bildhafteZwangsvorstellungenExamples[Math.floor(Math.random() * bildhafteZwangsvorstellungenExamples.length)];
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
    [FormTypes.ZwangshandlungTyp.Andere]: [
      'andere zwanghafte Verhaltensweisen',
      'sonstige ritualisierte Handlungen',
      'weitere Zwangshandlungen',
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

// Generates Traumafolgesymptomatik with realistic clinical patterns
function generateTraumafolgesymptomatik(maxSymptoms: number = 3): FormTypes.Traumafolgesymptomatik {
  // If maxSymptoms is 0, return empty
  if (maxSymptoms <= 0) {
    return createEmptyTraumafolgesymptomatik();
  }

  const result: FormTypes.Traumafolgesymptomatik = {
    wiedererleben: {},
    vermeidungsverhalten: {},
    verhalten: {},
    uebererregung: {},
    somatovegetativ: {},
    emotionalesErleben: {},
    dissoziativ: {},
    kognition: {},
    anpassungsstoerung: {},
    andereSymptome: '',
  };

  let symptomsGenerated = 0;

  // Example texts for wiedererleben
  const wiedererlebenExamples: Record<FormTypes.TraumaWiederErlebenSymptom, string[]> = {
    [FormTypes.TraumaWiederErlebenSymptom.Intrusionen]: [
      'wiederkehrende belastende Erinnerungen an das Trauma',
      'ungewollte Bilder des traumatischen Ereignisses',
      'plötzlich auftretende Erinnerungsfragmente',
    ],
    [FormTypes.TraumaWiederErlebenSymptom.Flashbacks]: [
      'das Gefühl, das traumatische Ereignis erneut zu erleben',
      'dissoziative Flashbacks mit Verlust des Gegenwartsbezugs',
      'intensive Rückerinnerungen mit körperlichen Reaktionen',
    ],
    [FormTypes.TraumaWiederErlebenSymptom.Albtraeume]: [
      'wiederkehrende Albträume mit traumabezogenem Inhalt',
      'belastende Träume, die den Schlaf stören',
      'nächtliches Erwachen durch traumabezogene Träume',
    ],
  };

  // Example texts for vermeidungsverhalten
  const vermeidungExamples: Record<FormTypes.TraumaVermeidungSymptom, string[]> = {
    [FormTypes.TraumaVermeidungSymptom.VermeidungReizeSituationen]: [
      'konsequentes Meiden von Orten, die an das Trauma erinnern',
      'Vermeidung bestimmter Situationen oder Aktivitäten',
      'Ausweichen vor traumabezogenen Auslösern',
    ],
    [FormTypes.TraumaVermeidungSymptom.VermeidungGedankenErinnerungen]: [
      'Vermeidung von Gesprächen über das Trauma',
      'Unterdrückung traumabezogener Gedanken',
      'Ablenkungsstrategien zur Vermeidung von Erinnerungen',
    ],
    [FormTypes.TraumaVermeidungSymptom.VermeidungAktivitaeten]: [
      'Rückzug von alltäglichen Aktivitäten',
      'Vermeidung sozialer Situationen',
      'Einschränkung des Bewegungsradius',
    ],
  };

  // Priority: wiedererleben and vermeidung are core symptoms
  // Generate 1-2 wiedererleben symptoms (high priority)
  const wiedererlebenSymptoms = Object.values(FormTypes.TraumaWiederErlebenSymptom);
  const numWiedererleben = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms);
  const shuffledWiedererleben = [...wiedererlebenSymptoms].sort(() => Math.random() - 0.5);

  for (let i = 0; i < numWiedererleben && symptomsGenerated < maxSymptoms; i++) {
    const symptom = shuffledWiedererleben[i];
    const examples = wiedererlebenExamples[symptom];
    const text = Math.random() < 0.7 ? examples[Math.floor(Math.random() * examples.length)] : undefined;
    result.wiedererleben[symptom] = { selected: true, details: { text } };
    symptomsGenerated++;
  }

  // 70% chance to have vermeidungsverhalten (if budget allows)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.7) {
    const vermeidungSymptoms = Object.values(FormTypes.TraumaVermeidungSymptom);
    const numVermeidung = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
    const shuffledVermeidung = [...vermeidungSymptoms].sort(() => Math.random() - 0.5);

    for (let i = 0; i < numVermeidung && symptomsGenerated < maxSymptoms; i++) {
      const symptom = shuffledVermeidung[i];
      const examples = vermeidungExamples[symptom];
      const text = Math.random() < 0.6 ? examples[Math.floor(Math.random() * examples.length)] : undefined;
      result.vermeidungsverhalten[symptom] = { selected: true, details: { text } };
      symptomsGenerated++;
    }
  }

  // 50% chance to have übererregung symptoms (if budget allows)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.5) {
    const uebererregungSymptoms = Object.values(FormTypes.TraumaUebererregungSymptom);
    const numUebererregung = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
    const shuffledUebererregung = [...uebererregungSymptoms].sort(() => Math.random() - 0.5);

    for (let i = 0; i < numUebererregung && symptomsGenerated < maxSymptoms; i++) {
      const symptom = shuffledUebererregung[i];
      result.uebererregung[symptom] = { selected: true, details: {} };
      symptomsGenerated++;
    }
  }

  // 40% chance to have emotionales erleben (if budget allows)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.4) {
    const emotionaleSymptoms = Object.values(FormTypes.TraumaEmotionalesErlebenSymptom);
    const numEmotionale = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
    const shuffledEmotionale = [...emotionaleSymptoms].sort(() => Math.random() - 0.5);

    for (let i = 0; i < numEmotionale && symptomsGenerated < maxSymptoms; i++) {
      const symptom = shuffledEmotionale[i];
      result.emotionalesErleben[symptom] = { selected: true, details: {} };
      symptomsGenerated++;
    }
  }

  // 30% chance to have dissoziativ symptoms (if budget allows)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.3) {
    const dissociativSymptoms = Object.values(FormTypes.TraumaDissociativSymptom);
    const numDissociativ = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
    const shuffledDissociativ = [...dissociativSymptoms].sort(() => Math.random() - 0.5);

    for (let i = 0; i < numDissociativ && symptomsGenerated < maxSymptoms; i++) {
      const symptom = shuffledDissociativ[i];
      result.dissoziativ[symptom] = { selected: true, details: {} };
      symptomsGenerated++;
    }
  }

  return result;
}

// Creates empty PsychotischeSymptomatik (no symptoms selected)
function createEmptyPsychotischeSymptomatik(): FormTypes.PsychotischeSymptomatik {
  return {
    formaleWahnmerkmale: {},
    inhaltlicheWahnmerkmale: {},
    akustischeHalluzination: { type: 'none' },
    andereHalluzinationen: {},
    ichHaftigkeit: {},
    ichStoerungAndere: {},
    formaleDenkstoerungen: {},
    emotionalesErleben: {},
    verhalten: {},
    kognition: {},
    katatoneSymptome: {},
    andereSymptome: ''
  };
}

// Generates PsychotischeSymptomatik with realistic clinical patterns
function generatePsychotischeSymptomatik(maxSymptoms: number = 3): FormTypes.PsychotischeSymptomatik {
  // If maxSymptoms is 0, return empty
  if (maxSymptoms <= 0) {
    return createEmptyPsychotischeSymptomatik();
  }

  const result: FormTypes.PsychotischeSymptomatik = {
    formaleWahnmerkmale: {},
    inhaltlicheWahnmerkmale: {},
    akustischeHalluzination: { type: 'none' },
    andereHalluzinationen: {},
    ichHaftigkeit: {},
    ichStoerungAndere: {},
    formaleDenkstoerungen: {},
    emotionalesErleben: {},
    verhalten: {},
    kognition: {},
    katatoneSymptome: {},
    andereSymptome: '',
  };

  let symptomsGenerated = 0;

  // Priority pattern: Wahn OR Halluzinationen as core symptom (60% wahn, 40% halluz)
  const hasWahn = Math.random() < 0.6;

  if (hasWahn) {
    // Generate 1-2 Wahnmerkmale
    // First: formale Wahnmerkmale (foundation)
    if (symptomsGenerated < maxSymptoms && Math.random() < 0.7) {
      const formaleSymptoms = Object.values(FormTypes.FormaleWahnmerkmale);
      const shuffled = [...formaleSymptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.formaleWahnmerkmale[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }

    // Second: inhaltliche Wahnmerkmale (content)
    if (symptomsGenerated < maxSymptoms) {
      const inhaltlicheSymptoms = Object.values(FormTypes.InhaltlicheWahnmerkmale);
      const shuffled = [...inhaltlicheSymptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.inhaltlicheWahnmerkmale[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }
  } else {
    // Generate hallucinations
    // 70% Stimmenhören, 30% Akoasmen or other
    if (symptomsGenerated < maxSymptoms) {
      const halluzType = Math.random();
      if (halluzType < 0.7) {
        // Stimmenhören with subtypes
        const stimmenSubtypes: FormTypes.StimmenHoerenSelection = {};
        const stimmenTypes = Object.values(FormTypes.StimmenHoerenTyp);
        const shuffled = [...stimmenTypes].sort(() => Math.random() - 0.5);
        const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
        for (let i = 0; i < numToSelect; i++) {
          stimmenSubtypes[shuffled[i]] = { selected: true, details: {} };
          symptomsGenerated++;
        }
        result.akustischeHalluzination = { type: 'stimmenhoeren', subtypes: stimmenSubtypes };
      } else if (halluzType < 0.85) {
        // Akoasmen
        result.akustischeHalluzination = { type: 'akoasmen' };
        symptomsGenerated++;
      } else {
        // Other hallucinations
        const andereTypes = Object.values(FormTypes.AndereHalluzinationTyp);
        const shuffled = [...andereTypes].sort(() => Math.random() - 0.5);
        result.andereHalluzinationen[shuffled[0]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }
  }

  // 40% chance to add Ich-Störungen
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.4) {
    const ichHaftigSymptoms = Object.values(FormTypes.IchHaftigkeitSymptom);
    const shuffled = [...ichHaftigSymptoms].sort(() => Math.random() - 0.5);
    result.ichHaftigkeit[shuffled[0]] = { selected: true, details: {} };
    symptomsGenerated++;
  }

  // 30% chance to add formal thought disorder
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.3) {
    const formaleDenkSymptoms = Object.values(FormTypes.FormaleDenkstoerungSymptom);
    const shuffled = [...formaleDenkSymptoms].sort(() => Math.random() - 0.5);
    result.formaleDenkstoerungen[shuffled[0]] = { selected: true, details: {} };
    symptomsGenerated++;
  }

  // 50% chance to add negative symptoms (verhalten/emotionales)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.5) {
    const whichNegative = Math.random();
    if (whichNegative < 0.5) {
      const verhaltenSymptoms = Object.values(FormTypes.PsychotischVerhaltenSymptom);
      const shuffled = [...verhaltenSymptoms].sort(() => Math.random() - 0.5);
      result.verhalten[shuffled[0]] = { selected: true, details: {} };
    } else {
      const emotionaleSymptoms = Object.values(FormTypes.PsychotischEmotionalesErlebenSymptom);
      const shuffled = [...emotionaleSymptoms].sort(() => Math.random() - 0.5);
      result.emotionalesErleben[shuffled[0]] = { selected: true, details: {} };
    }
    symptomsGenerated++;
  }

  // 10% chance to add katatone symptoms (rare)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.1) {
    const katatoneSymptoms = Object.values(FormTypes.KatatoneSymptom);
    const shuffled = [...katatoneSymptoms].sort(() => Math.random() - 0.5);
    result.katatoneSymptome[shuffled[0]] = { selected: true, details: {} };
    symptomsGenerated++;
  }

  return result;
}

// Creates empty OrganischeSymptomatik
function createEmptyOrganischeSymptomatik(): FormTypes.OrganischeSymptomatik {
  return {
    quantitativeBewusstsein: null,
    qualitativeBewusstsein: null,
    attentional: {},
    mnestisch: {},
    exekutiv: {},
    sprachlich: {},
    denkstoerungen: {},
    orientierung: {},
    emotionsbezogen: {},
    amnestisch: {},
    basaleAlltagskompetenzen: {},
    instrumentelleAlltagskompetenzen: {},
    andereSymptome: ''
  };
}

// Generates OrganischeSymptomatik with realistic clinical patterns
function generateOrganischeSymptomatik(maxSymptoms: number = 3): FormTypes.OrganischeSymptomatik {
  if (maxSymptoms <= 0) {
    return createEmptyOrganischeSymptomatik();
  }

  const result: FormTypes.OrganischeSymptomatik = {
    quantitativeBewusstsein: null,
    qualitativeBewusstsein: null,
    attentional: {},
    mnestisch: {},
    exekutiv: {},
    sprachlich: {},
    denkstoerungen: {},
    orientierung: {},
    emotionsbezogen: {},
    amnestisch: {},
    basaleAlltagskompetenzen: {},
    instrumentelleAlltagskompetenzen: {},
    andereSymptome: ''
  };

  let symptomsGenerated = 0;

  // Priority pattern: cognitive/memory symptoms most common (70%)
  // 20% Bewusstsein, 10% mixed
  const pattern = Math.random();

  if (pattern < 0.7) {
    // Cognitive/memory pattern
    // Mnestische Symptome (memory) - most common in organic
    if (symptomsGenerated < maxSymptoms) {
      const mnestischSymptoms = Object.values(FormTypes.OrganischMnestischSymptom);
      const shuffled = [...mnestischSymptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.mnestisch[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }

    // Attentionale Symptome (50% chance)
    if (symptomsGenerated < maxSymptoms && Math.random() < 0.5) {
      const attentionalSymptoms = Object.values(FormTypes.OrganischAttentionalSymptom);
      const shuffled = [...attentionalSymptoms].sort(() => Math.random() - 0.5);
      result.attentional[shuffled[0]] = { selected: true, details: {} };
      symptomsGenerated++;
    }

    // Orientierungsstörungen (40% chance)
    if (symptomsGenerated < maxSymptoms && Math.random() < 0.4) {
      const orientierungSymptoms = Object.values(FormTypes.OrganischOrientierungSymptom);
      const shuffled = [...orientierungSymptoms].sort(() => Math.random() - 0.5);
      result.orientierung[shuffled[0]] = { selected: true, details: {} };
      symptomsGenerated++;
    }
  } else if (pattern < 0.9) {
    // Bewusstsein pattern
    // Quantitative Bewusstseinsstörung (single-select)
    if (symptomsGenerated < maxSymptoms && Math.random() < 0.6) {
      const quantValues = Object.values(FormTypes.QuantitativeBewusstseinsstoerung);
      result.quantitativeBewusstsein = quantValues[Math.floor(Math.random() * quantValues.length)];
      symptomsGenerated++;
    }

    // Qualitative Bewusstseinsstörung (30% chance)
    if (symptomsGenerated < maxSymptoms && Math.random() < 0.3) {
      const qualValues = Object.values(FormTypes.QualitativeBewusstseinsstoerung);
      result.qualitativeBewusstsein = qualValues[Math.floor(Math.random() * qualValues.length)];
      symptomsGenerated++;
    }
  } else {
    // Mixed pattern - pick from various categories
    const availablePools = [
      { pool: Object.values(FormTypes.OrganischSprachlichSymptom), field: 'sprachlich' as const },
      { pool: Object.values(FormTypes.OrganischExekutivSymptom), field: 'exekutiv' as const },
      { pool: Object.values(FormTypes.OrganischDenkstoerungSymptom), field: 'denkstoerungen' as const },
    ];
    const shuffledPools = [...availablePools].sort(() => Math.random() - 0.5);

    for (const { pool, field } of shuffledPools) {
      if (symptomsGenerated >= maxSymptoms) break;
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      (result[field] as Record<string, FormTypes.CardSelectionEntry>)[shuffled[0]] = { selected: true, details: {} };
      symptomsGenerated++;
    }
  }

  // 30% chance to add emotionsbezogene Symptome
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.3) {
    const emotionSymptoms = Object.values(FormTypes.OrganischEmotionSymptom);
    const shuffled = [...emotionSymptoms].sort(() => Math.random() - 0.5);
    result.emotionsbezogen[shuffled[0]] = { selected: true, details: {} };
    symptomsGenerated++;
  }

  // 20% chance to add Alltagskompetenzen impairment
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.2) {
    const basaleItems = Object.values(FormTypes.BasaleAlltagskompetenz);
    const shuffled = [...basaleItems].sort(() => Math.random() - 0.5);
    const statuses = Object.values(FormTypes.AlltagskompetenzStatus);
    // More likely to be "mit Unterstützung" than "nicht möglich"
    const status = Math.random() < 0.7
      ? FormTypes.AlltagskompetenzStatus.MitUnterstuetzung
      : FormTypes.AlltagskompetenzStatus.NichtMoeglich;
    result.basaleAlltagskompetenzen[shuffled[0]] = status;
    symptomsGenerated++;
  }

  return result;
}

// Creates empty SomatoformeSymptomatik
function createEmptySomatoformeSymptomatik(): FormTypes.SomatoformeSymptomatik {
  return {
    koerperlicheSymptome: {},
    autonomeSymptome: {},
    hypochondrischeSymptome: {},
    schmerzSymptome: {},
    konversionSymptome: {},
    andereSymptome: ''
  };
}

// Generates SomatoformeSymptomatik with realistic clinical patterns
function generateSomatoformeSymptomatik(maxSymptoms: number = 3): FormTypes.SomatoformeSymptomatik {
  if (maxSymptoms <= 0) {
    return createEmptySomatoformeSymptomatik();
  }

  const result: FormTypes.SomatoformeSymptomatik = {
    koerperlicheSymptome: {},
    autonomeSymptome: {},
    hypochondrischeSymptome: {},
    schmerzSymptome: {},
    konversionSymptome: {},
    andereSymptome: ''
  };

  let symptomsGenerated = 0;

  // Priority pattern: körperliche symptoms most common (60%), schmerz (25%), conversion (15%)
  const pattern = Math.random();

  if (pattern < 0.6) {
    // Körperliche symptoms pattern - most common
    if (symptomsGenerated < maxSymptoms) {
      const koerperlichSymptoms = Object.values(FormTypes.SomatoformKoerperlichSymptom);
      const shuffled = [...koerperlichSymptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.koerperlicheSymptome[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }

    // 60% chance to add autonome Symptome
    if (symptomsGenerated < maxSymptoms && Math.random() < 0.6) {
      const autonomSymptoms = Object.values(FormTypes.SomatoformAutonomSymptom);
      const shuffled = [...autonomSymptoms].sort(() => Math.random() - 0.5);
      result.autonomeSymptome[shuffled[0]] = { selected: true, details: {} };
      symptomsGenerated++;
    }
  } else if (pattern < 0.85) {
    // Schmerz pattern
    if (symptomsGenerated < maxSymptoms) {
      const schmerzSymptoms = Object.values(FormTypes.SomatoformSchmerzSymptom);
      const shuffled = [...schmerzSymptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.schmerzSymptome[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }
  } else {
    // Konversion pattern (rare)
    if (symptomsGenerated < maxSymptoms) {
      const konversionSymptoms = Object.values(FormTypes.SomatoformKonversionSymptom);
      const shuffled = [...konversionSymptoms].sort(() => Math.random() - 0.5);
      result.konversionSymptome[shuffled[0]] = { selected: true, details: {} };
      symptomsGenerated++;
    }
  }

  // 40% chance to add hypochondrische Symptome
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.4) {
    const hypochondrischSymptoms = Object.values(FormTypes.SomatoformHypochondrischSymptom);
    const shuffled = [...hypochondrischSymptoms].sort(() => Math.random() - 0.5);
    result.hypochondrischeSymptome[shuffled[0]] = { selected: true, details: {} };
    symptomsGenerated++;
  }

  return result;
}

// Creates empty NichtorganischeSchlafstoerungen
function createEmptyNichtorganischeSchlafstoerungen(): FormTypes.NichtorganischeSchlafstoerungen {
  return {
    insomnie: {},
    hypersomnie: {},
    rhythmus: {},
    parasomnie: {},
    andereSymptome: ''
  };
}

// Generates NichtorganischeSchlafstoerungen with realistic clinical patterns
function generateNichtorganischeSchlafstoerungen(maxSymptoms: number = 3): FormTypes.NichtorganischeSchlafstoerungen {
  if (maxSymptoms <= 0) {
    return createEmptyNichtorganischeSchlafstoerungen();
  }

  const result: FormTypes.NichtorganischeSchlafstoerungen = {
    insomnie: {},
    hypersomnie: {},
    rhythmus: {},
    parasomnie: {},
    andereSymptome: ''
  };

  let symptomsGenerated = 0;

  // Priority pattern: insomnie most common (70%), hypersomnie (20%), parasomnie/rhythmus (10%)
  const pattern = Math.random();

  if (pattern < 0.7) {
    // Insomnie pattern - most common
    if (symptomsGenerated < maxSymptoms) {
      const insomnieSymptoms = Object.values(FormTypes.SchlafInsomniesymptom);
      const shuffled = [...insomnieSymptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.insomnie[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }

    // 40% chance to add rhythmus störung
    if (symptomsGenerated < maxSymptoms && Math.random() < 0.4) {
      const rhythmusSymptoms = Object.values(FormTypes.SchlafRhythmusStoerung);
      const shuffled = [...rhythmusSymptoms].sort(() => Math.random() - 0.5);
      result.rhythmus[shuffled[0]] = { selected: true, details: {} };
      symptomsGenerated++;
    }
  } else if (pattern < 0.9) {
    // Hypersomnie pattern
    if (symptomsGenerated < maxSymptoms) {
      const hypersomnieSymptoms = Object.values(FormTypes.SchlafHypersomniesymptom);
      const shuffled = [...hypersomnieSymptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.hypersomnie[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }
  } else {
    // Parasomnie pattern (rare)
    if (symptomsGenerated < maxSymptoms) {
      const parasomnieSymptoms = Object.values(FormTypes.SchlafParasomniesymptom);
      const shuffled = [...parasomnieSymptoms].sort(() => Math.random() - 0.5);
      result.parasomnie[shuffled[0]] = { selected: true, details: {} };
      symptomsGenerated++;
    }
  }

  return result;
}

// Creates empty Essstoerungen
function createEmptyEssstoerungen(): FormTypes.Essstoerungen {
  return {
    kognitiveSymptome: {},
    emotionaleSymptome: {},
    gewichtsregulierendeMassnahmen: {},
    anorexieSpezifisch: {},
    bulimieSpezifisch: {},
    bingeEatingSpezifisch: {},
    andereSymptome: ''
  };
}

// Generates Essstoerungen with realistic clinical patterns
function generateEssstoerungen(maxSymptoms: number = 3): FormTypes.Essstoerungen {
  if (maxSymptoms <= 0) {
    return createEmptyEssstoerungen();
  }

  const result: FormTypes.Essstoerungen = {
    kognitiveSymptome: {},
    emotionaleSymptome: {},
    gewichtsregulierendeMassnahmen: {},
    anorexieSpezifisch: {},
    bulimieSpezifisch: {},
    bingeEatingSpezifisch: {},
    andereSymptome: ''
  };

  let symptomsGenerated = 0;

  // Priority pattern: anorexie most common (40%), bulimie (35%), binge eating (25%)
  const pattern = Math.random();

  if (pattern < 0.4) {
    // Anorexie pattern - most common
    if (symptomsGenerated < maxSymptoms) {
      const anorexieSymptoms = Object.values(FormTypes.AnorexieSpezifischSymptom);
      const shuffled = [...anorexieSymptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.anorexieSpezifisch[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }

    // Add common kognitive symptoms
    if (symptomsGenerated < maxSymptoms && Math.random() < 0.7) {
      const kognitiveSymptoms = Object.values(FormTypes.EssstoerungKognitivSymptom);
      const shuffled = [...kognitiveSymptoms].sort(() => Math.random() - 0.5);
      result.kognitiveSymptome[shuffled[0]] = { selected: true, details: {} };
      symptomsGenerated++;
    }
  } else if (pattern < 0.75) {
    // Bulimie pattern
    if (symptomsGenerated < maxSymptoms) {
      const bulimieSymptoms = Object.values(FormTypes.BulimieSpezifischSymptom);
      const shuffled = [...bulimieSymptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.bulimieSpezifisch[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }

    // Add compensatory measures
    if (symptomsGenerated < maxSymptoms && Math.random() < 0.6) {
      const gewichtMassnahmen = Object.values(FormTypes.GewichtsregulierendeMassnahme);
      const shuffled = [...gewichtMassnahmen].sort(() => Math.random() - 0.5);
      result.gewichtsregulierendeMassnahmen[shuffled[0]] = { selected: true, details: {} };
      symptomsGenerated++;
    }
  } else {
    // Binge Eating pattern
    if (symptomsGenerated < maxSymptoms) {
      const bingeSymptoms = Object.values(FormTypes.BingeEatingSpezifischSymptom);
      const shuffled = [...bingeSymptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.bingeEatingSpezifisch[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }
  }

  // Add emotional symptoms (common across all types)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.5) {
    const emotionalSymptoms = Object.values(FormTypes.EssstoerungEmotionalSymptom);
    const shuffled = [...emotionalSymptoms].sort(() => Math.random() - 0.5);
    result.emotionaleSymptome[shuffled[0]] = { selected: true, details: {} };
  }

  return result;
}

// Creates empty SubstanzbezogeneSymptomatik
function createEmptySubstanzbezogeneSymptomatik(): FormTypes.SubstanzbezogeneSymptomatik {
  return {
    abhaengigkeit: {},
    somatovegetativ: {},
    psychomotorik: {},
    verhalten: {},
    emotionalesErleben: {},
    schlaf: {},
    neurologisch: {},
    kognition: {},
    psychotisch: {},
    dissociativ: {},
    andereSymptome: ''
  };
}

// Generates SubstanzbezogeneSymptomatik with realistic clinical patterns
function generateSubstanzbezogeneSymptomatik(maxSymptoms: number = 3): FormTypes.SubstanzbezogeneSymptomatik {
  if (maxSymptoms <= 0) {
    return createEmptySubstanzbezogeneSymptomatik();
  }

  const result: FormTypes.SubstanzbezogeneSymptomatik = {
    abhaengigkeit: {},
    somatovegetativ: {},
    psychomotorik: {},
    verhalten: {},
    emotionalesErleben: {},
    schlaf: {},
    neurologisch: {},
    kognition: {},
    psychotisch: {},
    dissociativ: {},
    andereSymptome: ''
  };

  let symptomsGenerated = 0;

  // Priority pattern: abhängigkeit most common (50%), then somatovegetativ (25%), then emotional (25%)
  const pattern = Math.random();

  if (pattern < 0.5) {
    // Abhängigkeit-focused pattern - most common
    if (symptomsGenerated < maxSymptoms) {
      const abhaengigkeitSymptoms = Object.values(FormTypes.SubstanzAbhaengigkeitSymptom);
      const shuffled = [...abhaengigkeitSymptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.abhaengigkeit[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }

    // Add somatovegetative symptoms (common with substance use)
    if (symptomsGenerated < maxSymptoms && Math.random() < 0.6) {
      const somaSymptoms = Object.values(FormTypes.SubstanzSomatovegetativSymptom);
      const shuffled = [...somaSymptoms].sort(() => Math.random() - 0.5);
      result.somatovegetativ[shuffled[0]] = { selected: true, details: {} };
      symptomsGenerated++;
    }
  } else if (pattern < 0.75) {
    // Withdrawal pattern - somatovegetative focus
    if (symptomsGenerated < maxSymptoms) {
      const somaSymptoms = Object.values(FormTypes.SubstanzSomatovegetativSymptom);
      const shuffled = [...somaSymptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.somatovegetativ[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }

    // Add sleep symptoms
    if (symptomsGenerated < maxSymptoms && Math.random() < 0.5) {
      const schlafSymptoms = Object.values(FormTypes.SubstanzSchlafSymptom);
      const shuffled = [...schlafSymptoms].sort(() => Math.random() - 0.5);
      result.schlaf[shuffled[0]] = { selected: true, details: {} };
      symptomsGenerated++;
    }
  } else {
    // Behavioral/emotional pattern
    if (symptomsGenerated < maxSymptoms) {
      const verhaltenSymptoms = Object.values(FormTypes.SubstanzVerhaltenSymptom);
      const shuffled = [...verhaltenSymptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.verhalten[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }

    // Add emotional symptoms
    if (symptomsGenerated < maxSymptoms && Math.random() < 0.6) {
      const emotionalSymptoms = Object.values(FormTypes.SubstanzEmotionalSymptom);
      const shuffled = [...emotionalSymptoms].sort(() => Math.random() - 0.5);
      result.emotionalesErleben[shuffled[0]] = { selected: true, details: {} };
      symptomsGenerated++;
    }
  }

  // Add cognitive symptoms (common across all types)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.4) {
    const kognitivSymptoms = Object.values(FormTypes.SubstanzKognitivSymptom);
    const shuffled = [...kognitivSymptoms].sort(() => Math.random() - 0.5);
    result.kognition[shuffled[0]] = { selected: true, details: {} };
  }

  return result;
}

// Creates empty DissociativeSymptomatik
function createEmptyDissociativeSymptomatik(): FormTypes.DissociativeSymptomatik {
  return {
    amnesie: {},
    fugue: {},
    stupor: {},
    bewegungsstoerungen: {},
    krampfanfaelle: {},
    sensibilitaetsstoerungen: {},
    identitaetsstoerung: {},
    depersonalisationDerealisation: {},
    andereSymptome: ''
  };
}

// Generates DissociativeSymptomatik with realistic clinical patterns
function generateDissociativeSymptomatik(maxSymptoms: number = 3): FormTypes.DissociativeSymptomatik {
  if (maxSymptoms <= 0) {
    return createEmptyDissociativeSymptomatik();
  }

  const result: FormTypes.DissociativeSymptomatik = {
    amnesie: {},
    fugue: {},
    stupor: {},
    bewegungsstoerungen: {},
    krampfanfaelle: {},
    sensibilitaetsstoerungen: {},
    identitaetsstoerung: {},
    depersonalisationDerealisation: {},
    andereSymptome: ''
  };

  let symptomsGenerated = 0;

  // Priority pattern: depersonalisation/derealisation most common (50%), then amnesie (25%), then other (25%)
  const pattern = Math.random();

  if (pattern < 0.5) {
    // Depersonalisation/Derealisation focus - most common
    if (symptomsGenerated < maxSymptoms) {
      const dpDrSymptoms = Object.values(FormTypes.DepersonalisationDerealisationSymptom);
      const shuffled = [...dpDrSymptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.depersonalisationDerealisation[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }

    // Add amnesie symptoms
    if (symptomsGenerated < maxSymptoms && Math.random() < 0.4) {
      const amnesieSymptoms = Object.values(FormTypes.DissociativeAmnesieSymptom);
      const shuffled = [...amnesieSymptoms].sort(() => Math.random() - 0.5);
      result.amnesie[shuffled[0]] = { selected: true, details: {} };
      symptomsGenerated++;
    }
  } else if (pattern < 0.75) {
    // Amnesie/Fugue pattern
    if (symptomsGenerated < maxSymptoms) {
      const amnesieSymptoms = Object.values(FormTypes.DissociativeAmnesieSymptom);
      const shuffled = [...amnesieSymptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.amnesie[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }

    // Add fugue symptoms
    if (symptomsGenerated < maxSymptoms && Math.random() < 0.3) {
      const fugueSymptoms = Object.values(FormTypes.DissociativeFugueSymptom);
      const shuffled = [...fugueSymptoms].sort(() => Math.random() - 0.5);
      result.fugue[shuffled[0]] = { selected: true, details: {} };
      symptomsGenerated++;
    }
  } else {
    // Somatoform dissociation pattern (bewegungsstoerungen, sensibilitaetsstoerungen, krampfanfaelle)
    if (symptomsGenerated < maxSymptoms) {
      const bewegungSymptoms = Object.values(FormTypes.DissociativeBewegungsstoerungSymptom);
      const shuffled = [...bewegungSymptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.bewegungsstoerungen[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }

    // Add sensibilitaetsstoerungen
    if (symptomsGenerated < maxSymptoms && Math.random() < 0.5) {
      const sensSymptoms = Object.values(FormTypes.DissociativeSensibilitaetsstoerungSymptom);
      const shuffled = [...sensSymptoms].sort(() => Math.random() - 0.5);
      result.sensibilitaetsstoerungen[shuffled[0]] = { selected: true, details: {} };
      symptomsGenerated++;
    }
  }

  // Add depersonalisation/derealisation symptoms (common across all types)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.4) {
    const dpDrSymptoms = Object.values(FormTypes.DepersonalisationDerealisationSymptom);
    const shuffled = [...dpDrSymptoms].sort(() => Math.random() - 0.5);
    result.depersonalisationDerealisation[shuffled[0]] = { selected: true, details: {} };
  }

  return result;
}

// Creates empty Persoenlichkeitsstoerungen
function createEmptyPersoenlichkeitsstoerungen(): FormTypes.Persoenlichkeitsstoerungen {
  return {
    paranoide: {},
    schizoide: {},
    schizotype: {},
    antisoziale: {},
    impulsiverTyp: {},
    borderline: {},
    histrionische: {},
    narzisstische: {},
    vermeidend: {},
    dependente: {},
    zwanghafte: {},
    passivAggressiv: {},
    aenderungExtrembelastung: {},
    aenderungPsychKrankheit: {},
    andereSymptome: ''
  };
}

// Generates Persoenlichkeitsstoerungen with realistic clinical patterns
function generatePersoenlichkeitsstoerungen(maxSymptoms: number = 3): FormTypes.Persoenlichkeitsstoerungen {
  if (maxSymptoms <= 0) {
    return createEmptyPersoenlichkeitsstoerungen();
  }

  const result: FormTypes.Persoenlichkeitsstoerungen = {
    paranoide: {},
    schizoide: {},
    schizotype: {},
    antisoziale: {},
    impulsiverTyp: {},
    borderline: {},
    histrionische: {},
    narzisstische: {},
    vermeidend: {},
    dependente: {},
    zwanghafte: {},
    passivAggressiv: {},
    aenderungExtrembelastung: {},
    aenderungPsychKrankheit: {},
    andereSymptome: ''
  };

  let symptomsGenerated = 0;

  // Priority pattern: borderline and vermeidend most common (40%), then narzisstisch (30%), then other (30%)
  const pattern = Math.random();

  if (pattern < 0.4) {
    // Borderline/Vermeidend-focused pattern - most common
    if (Math.random() < 0.5) {
      // Borderline
      if (symptomsGenerated < maxSymptoms) {
        const borderlineSymptoms = Object.values(FormTypes.BorderlinePSSymptom);
        const shuffled = [...borderlineSymptoms].sort(() => Math.random() - 0.5);
        const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
        for (let i = 0; i < numToSelect; i++) {
          result.borderline[shuffled[i]] = { selected: true, details: {} };
          symptomsGenerated++;
        }
      }
    } else {
      // Vermeidend
      if (symptomsGenerated < maxSymptoms) {
        const vermeidendSymptoms = Object.values(FormTypes.VermeidendPSSymptom);
        const shuffled = [...vermeidendSymptoms].sort(() => Math.random() - 0.5);
        const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
        for (let i = 0; i < numToSelect; i++) {
          result.vermeidend[shuffled[i]] = { selected: true, details: {} };
          symptomsGenerated++;
        }
      }
    }
  } else if (pattern < 0.7) {
    // Narzisstisch pattern
    if (symptomsGenerated < maxSymptoms) {
      const narzisstischSymptoms = Object.values(FormTypes.NarzisstischePSSymptom);
      const shuffled = [...narzisstischSymptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.narzisstische[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }

    // Add dependente symptoms
    if (symptomsGenerated < maxSymptoms && Math.random() < 0.3) {
      const dependenteSymptoms = Object.values(FormTypes.DependentePSSymptom);
      const shuffled = [...dependenteSymptoms].sort(() => Math.random() - 0.5);
      result.dependente[shuffled[0]] = { selected: true, details: {} };
      symptomsGenerated++;
    }
  } else {
    // Other personality disorders pattern
    const otherEnums = [
      { enumObj: FormTypes.ParanoidePSSymptom, field: 'paranoide' as const },
      { enumObj: FormTypes.SchizoidePSSymptom, field: 'schizoide' as const },
      { enumObj: FormTypes.AntisozialePSSymptom, field: 'antisoziale' as const },
      { enumObj: FormTypes.ZwanghaftePSSymptom, field: 'zwanghafte' as const },
      { enumObj: FormTypes.HistrionischePSSymptom, field: 'histrionische' as const },
    ];
    const selected = otherEnums[Math.floor(Math.random() * otherEnums.length)];

    if (symptomsGenerated < maxSymptoms) {
      const symptoms = Object.values(selected.enumObj);
      const shuffled = [...symptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        (result[selected.field] as Record<string, FormTypes.CardSelectionEntry>)[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }
  }

  // Add impulsiver typ symptoms (common across borderline presentations)
  if (symptomsGenerated < maxSymptoms && Math.random() < 0.3) {
    const impulsivSymptoms = Object.values(FormTypes.ImpulsiverTypSymptom);
    const shuffled = [...impulsivSymptoms].sort(() => Math.random() - 0.5);
    result.impulsiverTyp[shuffled[0]] = { selected: true, details: {} };
  }

  return result;
}

// Creates an empty Impulskontrollstoerungen structure
function createEmptyImpulskontrollstoerungen(): FormTypes.Impulskontrollstoerungen {
  return {
    pathologischesSpielen: {},
    pyromanie: {},
    kleptomanie: {},
    trichotillomanie: {},
    andereSymptome: ''
  };
}

// Generates Impulskontrollstoerungen with realistic clinical patterns
function generateImpulskontrollstoerungen(maxSymptoms: number = 3): FormTypes.Impulskontrollstoerungen {
  if (maxSymptoms <= 0) {
    return createEmptyImpulskontrollstoerungen();
  }

  const result: FormTypes.Impulskontrollstoerungen = {
    pathologischesSpielen: {},
    pyromanie: {},
    kleptomanie: {},
    trichotillomanie: {},
    andereSymptome: ''
  };

  let symptomsGenerated = 0;

  // Priority pattern: pathologisches Spielen most common (50%), trichotillomanie (30%), others (20%)
  const pattern = Math.random();

  if (pattern < 0.5) {
    // Pathologisches Spielen - most common
    if (symptomsGenerated < maxSymptoms) {
      const symptoms = Object.values(FormTypes.PathologischesSpielenSymptom);
      const shuffled = [...symptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.pathologischesSpielen[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }
  } else if (pattern < 0.8) {
    // Trichotillomanie
    if (symptomsGenerated < maxSymptoms) {
      const symptoms = Object.values(FormTypes.TrichotillomanieSymptom);
      const shuffled = [...symptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.trichotillomanie[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }
  } else {
    // Pyromanie or Kleptomanie (rare)
    if (Math.random() < 0.5) {
      // Pyromanie
      if (symptomsGenerated < maxSymptoms) {
        const symptoms = Object.values(FormTypes.PyromanieSymptom);
        const shuffled = [...symptoms].sort(() => Math.random() - 0.5);
        const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
        for (let i = 0; i < numToSelect; i++) {
          result.pyromanie[shuffled[i]] = { selected: true, details: {} };
          symptomsGenerated++;
        }
      }
    } else {
      // Kleptomanie
      if (symptomsGenerated < maxSymptoms) {
        const symptoms = Object.values(FormTypes.KleptomanieSymptom);
        const shuffled = [...symptoms].sort(() => Math.random() - 0.5);
        const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
        for (let i = 0; i < numToSelect; i++) {
          result.kleptomanie[shuffled[i]] = { selected: true, details: {} };
          symptomsGenerated++;
        }
      }
    }
  }

  return result;
}

// Creates an empty SexuellbezogeneSymptome structure
function createEmptySexuellbezogeneSymptome(): FormTypes.SexuellbezogeneSymptome {
  return {
    funktionsstoerungen: {},
    praeferenzstoerungen: {},
    andereSymptome: ''
  };
}

// Generates SexuellbezogeneSymptome with realistic clinical patterns
function generateSexuellbezogeneSymptome(maxSymptoms: number = 3): FormTypes.SexuellbezogeneSymptome {
  if (maxSymptoms <= 0) {
    return createEmptySexuellbezogeneSymptome();
  }

  const result: FormTypes.SexuellbezogeneSymptome = {
    funktionsstoerungen: {},
    praeferenzstoerungen: {},
    andereSymptome: ''
  };

  let symptomsGenerated = 0;

  // Priority pattern: funktionsstoerungen more common (80%), praeferenzstoerungen rare (20%)
  const pattern = Math.random();

  if (pattern < 0.8) {
    // Sexuelle Funktionsstörungen - most common
    if (symptomsGenerated < maxSymptoms) {
      const symptoms = Object.values(FormTypes.SexuelleFunktionsstoerungSymptom);
      const shuffled = [...symptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.funktionsstoerungen[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }
  } else {
    // Störungen der Sexualpräferenz - rare
    if (symptomsGenerated < maxSymptoms) {
      const symptoms = Object.values(FormTypes.SexualpraeferenzstoerungSymptom);
      const shuffled = [...symptoms].sort(() => Math.random() - 0.5);
      const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms - symptomsGenerated);
      for (let i = 0; i < numToSelect; i++) {
        result.praeferenzstoerungen[shuffled[i]] = { selected: true, details: {} };
        symptomsGenerated++;
      }
    }
  }

  return result;
}

// Creates an empty GeschlechtsidentitaetSymptomatik structure
function createEmptyGeschlechtsidentitaet(): FormTypes.GeschlechtsidentitaetSymptomatik {
  return {
    symptome: {},
    andereSymptome: ''
  };
}

// Generates GeschlechtsidentitaetSymptomatik with realistic clinical patterns
function generateGeschlechtsidentitaet(maxSymptoms: number = 3): FormTypes.GeschlechtsidentitaetSymptomatik {
  if (maxSymptoms <= 0) {
    return createEmptyGeschlechtsidentitaet();
  }

  const result: FormTypes.GeschlechtsidentitaetSymptomatik = {
    symptome: {},
    andereSymptome: ''
  };

  const symptoms = Object.values(FormTypes.GeschlechtsidentitaetSymptom);
  const shuffled = [...symptoms].sort(() => Math.random() - 0.5);
  const numToSelect = Math.min(Math.floor(Math.random() * 2) + 1, maxSymptoms);

  for (let i = 0; i < numToSelect; i++) {
    result.symptome[shuffled[i]] = { selected: true, details: {} };
  }

  return result;
}

// Creates an empty HyperkinetischeStoerungen structure
function createEmptyHyperkinetischeStoerungen(): FormTypes.HyperkinetischeStoerungen {
  return {
    attentional: {},
    hyperaktiv: {},
    impulsiv: {},
    andereSymptome: ''
  };
}

// Generates HyperkinetischeStoerungen with realistic clinical patterns
function generateHyperkinetischeStoerungen(maxSymptoms: number = 3): FormTypes.HyperkinetischeStoerungen {
  if (maxSymptoms <= 0) {
    return createEmptyHyperkinetischeStoerungen();
  }

  const result: FormTypes.HyperkinetischeStoerungen = {
    attentional: {},
    hyperaktiv: {},
    impulsiv: {},
    andereSymptome: ''
  };

  // Pool all symptoms with priority weights (attentional most common)
  type SymptomEntry = {
    category: 'attentional' | 'hyperaktiv' | 'impulsiv';
    symptom: FormTypes.HyperkinetischAttentionalSymptom | FormTypes.HyperkinetischHyperaktivSymptom | FormTypes.HyperkinetischImpulsivSymptom;
    priority: number;
  };

  const pool: SymptomEntry[] = [];

  // Attentional symptoms (high priority - most common in ADHD)
  for (const s of Object.values(FormTypes.HyperkinetischAttentionalSymptom)) {
    pool.push({ category: 'attentional', symptom: s, priority: 3 });
  }

  // Hyperaktive symptoms (medium priority)
  for (const s of Object.values(FormTypes.HyperkinetischHyperaktivSymptom)) {
    pool.push({ category: 'hyperaktiv', symptom: s, priority: 2 });
  }

  // Impulsive symptoms (medium priority)
  for (const s of Object.values(FormTypes.HyperkinetischImpulsivSymptom)) {
    pool.push({ category: 'impulsiv', symptom: s, priority: 2 });
  }

  // Weighted shuffle
  const weighted = pool.flatMap(e => Array(e.priority).fill(e));
  const shuffled = [...weighted].sort(() => Math.random() - 0.5);

  // Select unique symptoms
  const seen = new Set<string>();
  let selected = 0;

  for (const entry of shuffled) {
    if (selected >= maxSymptoms) break;
    const key = `${entry.category}:${entry.symptom}`;
    if (seen.has(key)) continue;
    seen.add(key);

    if (entry.category === 'attentional') {
      result.attentional[entry.symptom as FormTypes.HyperkinetischAttentionalSymptom] = { selected: true, details: {} };
    } else if (entry.category === 'hyperaktiv') {
      result.hyperaktiv[entry.symptom as FormTypes.HyperkinetischHyperaktivSymptom] = { selected: true, details: {} };
    } else {
      result.impulsiv[entry.symptom as FormTypes.HyperkinetischImpulsivSymptom] = { selected: true, details: {} };
    }
    selected++;
  }

  return result;
}

// Creates an empty TicStoerungen structure
function createEmptyTicStoerungen(): FormTypes.TicStoerungen {
  return {
    motorischeTics: {},
    vokaleTics: {},
    touretteSyndrom: false,
    andereSymptome: ''
  };
}

// Generates TicStoerungen with realistic clinical patterns
function generateTicStoerungen(maxSymptoms: number = 3): FormTypes.TicStoerungen {
  if (maxSymptoms <= 0) {
    return createEmptyTicStoerungen();
  }

  const result: FormTypes.TicStoerungen = {
    motorischeTics: {},
    vokaleTics: {},
    touretteSyndrom: false,
    andereSymptome: ''
  };

  // Pool all symptoms with priority weights (motorische tics more common)
  type SymptomEntry = {
    category: 'motorisch' | 'vokal';
    symptom: FormTypes.MotorischeTicsSymptom | FormTypes.VokaleTicsSymptom;
    priority: number;
  };

  const pool: SymptomEntry[] = [];

  // Motorische Tics (higher priority - more common)
  for (const s of Object.values(FormTypes.MotorischeTicsSymptom)) {
    pool.push({ category: 'motorisch', symptom: s, priority: 3 });
  }

  // Vokale Tics
  for (const s of Object.values(FormTypes.VokaleTicsSymptom)) {
    pool.push({ category: 'vokal', symptom: s, priority: 2 });
  }

  // Weighted shuffle
  const weighted = pool.flatMap(e => Array(e.priority).fill(e));
  const shuffled = [...weighted].sort(() => Math.random() - 0.5);

  // Select unique symptoms
  const seen = new Set<string>();
  let selected = 0;

  for (const entry of shuffled) {
    if (selected >= maxSymptoms) break;
    const key = `${entry.category}:${entry.symptom}`;
    if (seen.has(key)) continue;
    seen.add(key);

    if (entry.category === 'motorisch') {
      result.motorischeTics[entry.symptom as FormTypes.MotorischeTicsSymptom] = { selected: true, details: {} };
    } else {
      result.vokaleTics[entry.symptom as FormTypes.VokaleTicsSymptom] = { selected: true, details: {} };
    }
    selected++;
  }

  // Small chance of Tourette-Syndrom if we have both motorisch and vokal tics
  const hasMotorisch = Object.keys(result.motorischeTics).length > 0;
  const hasVokal = Object.keys(result.vokaleTics).length > 0;
  if (hasMotorisch && hasVokal && Math.random() < 0.3) {
    result.touretteSyndrom = true;
  }

  return result;
}

function createEmptySuizidalitaetSymptomatik(): FormTypes.SuizidalitaetSymptomatik {
  return {
    symptome: {},
    andereSymptome: ''
  };
}

function generateSuizidalitaetSymptomatik(maxSymptoms: number = 3): FormTypes.SuizidalitaetSymptomatik {
  if (maxSymptoms <= 0) {
    return createEmptySuizidalitaetSymptomatik();
  }

  const result: FormTypes.SuizidalitaetSymptomatik = {
    symptome: {},
    andereSymptome: ''
  };

  // Pool all symptoms with priority weights
  type SymptomEntry = {
    symptom: FormTypes.SuizidalitaetSymptomatikSymptom;
    priority: number;
  };

  const pool: SymptomEntry[] = [];

  // All symptoms with equal priority
  for (const s of Object.values(FormTypes.SuizidalitaetSymptomatikSymptom)) {
    pool.push({ symptom: s, priority: 2 });
  }

  // Weighted shuffle
  const weighted: SymptomEntry[] = pool.flatMap(e => Array(e.priority).fill(e) as SymptomEntry[]);
  const shuffled = [...weighted].sort(() => Math.random() - 0.5);

  // Select unique symptoms
  const seen = new Set<string>();
  let selected = 0;

  for (const entry of shuffled) {
    if (selected >= maxSymptoms) break;
    if (seen.has(entry.symptom)) continue;
    seen.add(entry.symptom);

    result.symptome[entry.symptom] = { selected: true, details: {} };
    selected++;
  }

  return result;
}

function createEmptySonstigeSymptomatik(): FormTypes.SonstigeSymptomatik {
  return {
    krankheitseinsichtCompliance: {},
    andereSymptome: ''
  };
}

function generateSonstigeSymptomatik(maxSymptoms: number = 3): FormTypes.SonstigeSymptomatik {
  if (maxSymptoms <= 0) {
    return createEmptySonstigeSymptomatik();
  }

  const result: FormTypes.SonstigeSymptomatik = {
    krankheitseinsichtCompliance: {},
    andereSymptome: ''
  };

  // Pool all symptoms with priority weights
  type SymptomEntry = {
    symptom: FormTypes.KrankheitseinsichtComplianceSymptom;
    priority: number;
  };

  const pool: SymptomEntry[] = [];

  // All symptoms with equal priority
  for (const s of Object.values(FormTypes.KrankheitseinsichtComplianceSymptom)) {
    pool.push({ symptom: s, priority: 2 });
  }

  // Weighted shuffle
  const weighted: SymptomEntry[] = pool.flatMap(e => Array(e.priority).fill(e) as SymptomEntry[]);
  const shuffled = [...weighted].sort(() => Math.random() - 0.5);

  // Select unique symptoms
  const seen = new Set<string>();
  let selected = 0;

  for (const entry of shuffled) {
    if (selected >= maxSymptoms) break;
    if (seen.has(entry.symptom)) continue;
    seen.add(entry.symptom);

    result.krankheitseinsichtCompliance[entry.symptom] = { selected: true, details: {} };
    selected++;
  }

  return result;
}

// Template-based random sentences for SymptomatikKontext
const BEGINN_DAUER_TEMPLATES = [
  'Die Symptomatik habe vor etwa {ZEIT} begonnen.',
  'Erste Symptome seien vor ungefähr {ZEIT} aufgetreten.',
  'Der Symptombeginn liege etwa {ZEIT} zurück.',
  'Die beschriebene Symptomatik bestehe seit ca. {ZEIT}.',
];

const VERLAUF_TEMPLATES = [
  'Seit Symptombeginn zeige sich eine zunehmende Verschlechterung.',
  'Der Verlauf sei durch Phasen der Besserung und Verschlechterung gekennzeichnet.',
  'Die Symptomatik habe sich seit Beginn kontinuierlich verstärkt.',
  'Es zeige sich ein schwankender Verlauf mit Phasen relativer Stabilität.',
  'Im Verlauf habe sich die Symptomatik zunehmend chronifiziert.',
  'Zwischenzeitlich habe es Phasen der Besserung gegeben, die jedoch nicht anhielten.',
];

const AUSLOESER_TEMPLATES = [
  'Als Auslöser werde {EREIGNIS} genannt.',
  'Die Symptomatik sei im Kontext {EREIGNIS} aufgetreten.',
  'Den Beginn der Symptome führe {PRONOUN} auf {EREIGNIS} zurück.',
  '{EREIGNIS} habe zur Manifestation der Symptomatik geführt.',
];

const ZEITANGABEN = ['6 Monaten', '12 Monaten', '18 Monaten', '2 Jahren', '3 Jahren', 'etwa einem Jahr'];

const EREIGNISSE = [
  'eine Trennung vom Partner',
  'berufliche Konflikte',
  'den Verlust eines nahestehenden Menschen',
  'eine Kündigung',
  'anhaltende Belastungen am Arbeitsplatz',
  'familiäre Konflikte',
  'finanzielle Sorgen',
  'eine schwere Erkrankung',
];

// Generates random SymptomatikKontext data
function generateSymptomatikKontext(): FormTypes.SymptomatikKontext {
  const zeit = ZEITANGABEN[Math.floor(Math.random() * ZEITANGABEN.length)];
  const ereignis = EREIGNISSE[Math.floor(Math.random() * EREIGNISSE.length)];
  const pronoun = Math.random() < 0.5 ? 'der Patient' : 'die Patientin';

  const beginnTemplate = BEGINN_DAUER_TEMPLATES[Math.floor(Math.random() * BEGINN_DAUER_TEMPLATES.length)];
  const verlaufTemplate = VERLAUF_TEMPLATES[Math.floor(Math.random() * VERLAUF_TEMPLATES.length)];
  const ausloeserTemplate = AUSLOESER_TEMPLATES[Math.floor(Math.random() * AUSLOESER_TEMPLATES.length)];

  return {
    beginnUndDauer: beginnTemplate.replace('{ZEIT}', zeit),
    verlauf: verlaufTemplate,
    ausloeser: ausloeserTemplate
      .replace('{EREIGNIS}', ereignis)
      .replace('{PRONOUN}', pronoun),
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

// Creates an empty Traumafolgesymptomatik structure
function createEmptyTraumafolgesymptomatik(): FormTypes.Traumafolgesymptomatik {
  return {
    wiedererleben: {},
    vermeidungsverhalten: {},
    verhalten: {},
    uebererregung: {},
    somatovegetativ: {},
    emotionalesErleben: {},
    dissoziativ: {},
    kognition: {},
    anpassungsstoerung: {},
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
  let traumafolgesymptomatik = createEmptyTraumafolgesymptomatik();
  let psychotischeSymptomatik = createEmptyPsychotischeSymptomatik();
  let organischeSymptomatik = createEmptyOrganischeSymptomatik();
  let somatoformeSymptomatik = createEmptySomatoformeSymptomatik();
  let nichtorganischeSchlafstoerungen = createEmptyNichtorganischeSchlafstoerungen();
  let essstoerungen = createEmptyEssstoerungen();
  let substanzbezogeneSymptomatik = createEmptySubstanzbezogeneSymptomatik();
  let dissociativeSymptomatik = createEmptyDissociativeSymptomatik();
  let persoenlichkeitsstoerungen = createEmptyPersoenlichkeitsstoerungen();
  let impulskontrollstoerungen = createEmptyImpulskontrollstoerungen();
  let sexuellbezogeneSymptome = createEmptySexuellbezogeneSymptome();
  let geschlechtsidentitaet = createEmptyGeschlechtsidentitaet();
  let hyperkinetischeStoerungen = createEmptyHyperkinetischeStoerungen();
  let ticStoerungen = createEmptyTicStoerungen();
  let suizidalitaetSymptomatik = createEmptySuizidalitaetSymptomatik();
  let sonstigeSymptomatik = createEmptySonstigeSymptomatik();

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

  if (distribution.activeCategories.includes('trauma')) {
    traumafolgesymptomatik = generateTraumafolgesymptomatik(distribution.symptomsPerCategory.trauma);
  }

  if (distribution.activeCategories.includes('psychose')) {
    psychotischeSymptomatik = generatePsychotischeSymptomatik(distribution.symptomsPerCategory.psychose);
  }

  if (distribution.activeCategories.includes('organic')) {
    organischeSymptomatik = generateOrganischeSymptomatik(distribution.symptomsPerCategory.organic);
  }

  if (distribution.activeCategories.includes('somatoform')) {
    somatoformeSymptomatik = generateSomatoformeSymptomatik(distribution.symptomsPerCategory.somatoform);
  }

  if (distribution.activeCategories.includes('schlaf')) {
    nichtorganischeSchlafstoerungen = generateNichtorganischeSchlafstoerungen(distribution.symptomsPerCategory.schlaf);
  }

  if (distribution.activeCategories.includes('essstoerung')) {
    essstoerungen = generateEssstoerungen(distribution.symptomsPerCategory.essstoerung);
  }

  if (distribution.activeCategories.includes('substanz')) {
    substanzbezogeneSymptomatik = generateSubstanzbezogeneSymptomatik(distribution.symptomsPerCategory.substanz);
  }

  if (distribution.activeCategories.includes('dissociativ')) {
    dissociativeSymptomatik = generateDissociativeSymptomatik(distribution.symptomsPerCategory.dissociativ);
  }

  if (distribution.activeCategories.includes('persoenlichkeit')) {
    persoenlichkeitsstoerungen = generatePersoenlichkeitsstoerungen(distribution.symptomsPerCategory.persoenlichkeit);
  }

  if (distribution.activeCategories.includes('impulskontroll')) {
    impulskontrollstoerungen = generateImpulskontrollstoerungen(distribution.symptomsPerCategory.impulskontroll);
  }

  if (distribution.activeCategories.includes('sexuell')) {
    sexuellbezogeneSymptome = generateSexuellbezogeneSymptome(distribution.symptomsPerCategory.sexuell);
  }

  if (distribution.activeCategories.includes('geschlecht')) {
    geschlechtsidentitaet = generateGeschlechtsidentitaet(distribution.symptomsPerCategory.geschlecht);
  }

  if (distribution.activeCategories.includes('hyperkinetisch')) {
    hyperkinetischeStoerungen = generateHyperkinetischeStoerungen(distribution.symptomsPerCategory.hyperkinetisch);
  }

  if (distribution.activeCategories.includes('tic')) {
    ticStoerungen = generateTicStoerungen(distribution.symptomsPerCategory.tic);
  }

  if (distribution.activeCategories.includes('suizidalitaet')) {
    suizidalitaetSymptomatik = generateSuizidalitaetSymptomatik(distribution.symptomsPerCategory.suizidalitaet);
  }

  if (distribution.activeCategories.includes('sonstige')) {
    sonstigeSymptomatik = generateSonstigeSymptomatik(distribution.symptomsPerCategory.sonstige);
  }

  return {
    manischeSymptomatik,
    depressiveSymptomatik,
    angstsymptomatik,
    zwangssymptomatik,
    traumafolgesymptomatik,
    psychotischeSymptomatik,
    organischeSymptomatik,
    somatoformeSymptomatik,
    nichtorganischeSchlafstoerungen,
    essstoerungen,
    substanzbezogeneSymptomatik,
    dissociativeSymptomatik,
    persoenlichkeitsstoerungen,
    impulskontrollstoerungen,
    sexuellbezogeneSymptome,
    geschlechtsidentitaet,
    hyperkinetischeStoerungen,
    ticStoerungen,
    suizidalitaetSymptomatik,
    sonstigeSymptomatik,
    symptomatikKontext: generateSymptomatikKontext(),
  };
}
