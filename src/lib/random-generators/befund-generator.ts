/**
 * Befund (AMDP) Test Data Generator
 *
 * Generates random psychopathological findings data for B1-B18 sections
 */

import {
  b1PflegezustandOptions,
  b1KoerpergeruchOptions,
  b1KleidungsstilOptions,
  b1KleidungszustandOptions,
  b2ErsterEindruckOptions,
  b2KontaktverhaltenOptions,
  b3SpracheOptions,
  b4QuantitativesBewusstseinOptions,
  b4QualitativesBewusstseinOptions,
  b5OrientierungOptions,
  b6MnestikOptions,
  b7KonzentrationOptions,
  b8DenkstrukturOptions,
  b8DenkgeschwindigkeitOptions,
  b9HalluzinationenOptions,
  b10InhaltlichesDenkenOptions,
  b11KeineIchStorungenOptions,
  b11PsychotischeIchStorungenOptions,
  b11NichtPsychotischeIchStorungenOptions,
  b12ArtenVonAngstenOptions,
  b12SymptomeKompensationOptions,
  b13ZwangeOptions,
  b14StimmungOptions,
  b14AffektOptions,
  b15AntriebOptions,
  b16PsychomotorikOptions,
  b17GradDerSuizidalitaOptions,
  b17PaktAbspracheFahigkeitOptions,
  b17AbklarungVonSuizidalitaOptions,
  b18KrankheitseinsichtOptions,
  b18BehandlungsbereitschaftOptions,
} from '../core/options/befund-sections';
import * as FormTypes from '../core/form-types';

export interface BefundData {
  b1: FormTypes.B1Data;
  b2: FormTypes.B2Data;
  b3: FormTypes.B3Data;
  b4: FormTypes.B4Data;
  b5: FormTypes.B5Data;
  b6: FormTypes.B6Data;
  b7: FormTypes.B7Data;
  b8: FormTypes.B8Data;
  b9: FormTypes.B9Data;
  b10: FormTypes.B10Data;
  b11: FormTypes.B11Data;
  b12: FormTypes.B12Data;
  b13: FormTypes.B13Data;
  b14: FormTypes.B14Data;
  b15: FormTypes.B15Data;
  b16: FormTypes.B16Data;
  b17: FormTypes.B17Data;
  b18: FormTypes.B18Data;
}

/**
 * Helper: Randomly selects N items from an array
 */
function selectRandomItems<T>(array: T[], min: number, max: number): T[] {
  const numItems = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numItems);
}

/**
 * Helper: Picks one random item from an array
 */
function pickOne<T>(array: T[]): T[] {
  return [array[Math.floor(Math.random() * array.length)]];
}

/**
 * Main function: Generates all befund (AMDP) data
 */
export function generateBefund(): BefundData {
  return {
    // B1 - Erscheinungsbild (Appearance)
    b1: {
      pflegezustand: pickOne(b1PflegezustandOptions),
      koerpergeruch: selectRandomItems(b1KoerpergeruchOptions, 1, 2),
      kleidungsstil: pickOne(b1KleidungsstilOptions),
      kleidungszustand: selectRandomItems(b1KleidungszustandOptions, 1, 2),
    },

    // B2 - Kontaktverhalten (Contact Behavior)
    b2: {
      ersterEindruck: selectRandomItems(b2ErsterEindruckOptions, 0, 2),
      kontaktverhalten: selectRandomItems(b2KontaktverhaltenOptions, 2, 5),
    },

    // B3 - Sprache (Speech)
    b3: {
      sprache: selectRandomItems(b3SpracheOptions, 0, 3),
    },

    // B4 - Bewusstsein (Consciousness)
    b4: {
      quantitativesBewusstsein: pickOne(b4QuantitativesBewusstseinOptions),
      qualitativesBewusstsein: pickOne(b4QualitativesBewusstseinOptions),
    },

    // B5 - Orientierung (Orientation)
    b5: {
      orientierung: pickOne(b5OrientierungOptions),
    },

    // B6 - Mnestik (Memory)
    b6: {
      mnestik: pickOne(b6MnestikOptions),
    },

    // B7 - Konzentration (Concentration)
    b7: {
      konzentration: pickOne(b7KonzentrationOptions),
    },

    // B8 - Formales Denken (Formal Thinking)
    b8: {
      denkstruktur: selectRandomItems(b8DenkstrukturOptions, 1, 3),
      denkgeschwindigkeit: pickOne(b8DenkgeschwindigkeitOptions),
    },

    // B9 - Wahrnehmung (Perception/Hallucinations)
    b9: {
      halluzinationen: selectRandomItems(b9HalluzinationenOptions, 0, 2),
    },

    // B10 - Inhaltliches Denken (Content of Thought/Delusions)
    b10: {
      inhaltlichesDenken: selectRandomItems(b10InhaltlichesDenkenOptions, 1, 2),
    },

    // B11 - Ich-Störungen (Ego Disturbances)
    b11: {
      keineIchStorungen: Math.random() < 0.7 ? b11KeineIchStorungenOptions : [],
      psychotischeIchStorungen: Math.random() < 0.2 ? selectRandomItems(b11PsychotischeIchStorungenOptions, 1, 2) : [],
      nichtPsychotischeIchStorungen: Math.random() < 0.3 ? selectRandomItems(b11NichtPsychotischeIchStorungenOptions, 1, 2) : [],
    },

    // B12 - Ängste (Fears/Anxiety)
    b12: {
      artenVonAngsten: selectRandomItems(b12ArtenVonAngstenOptions, 1, 4),
      symptomeKompensation: selectRandomItems(b12SymptomeKompensationOptions, 1, 3),
    },

    // B13 - Zwänge (Obsessions/Compulsions)
    b13: {
      zwange: selectRandomItems(b13ZwangeOptions, 1, 2),
    },

    // B14 - Stimmung und Affekt (Mood and Affect)
    b14: {
      stimmung: selectRandomItems(b14StimmungOptions, 1, 3),
      affekt: selectRandomItems(b14AffektOptions, 1, 3),
    },

    // B15 - Antrieb (Drive)
    b15: {
      antrieb: selectRandomItems(b15AntriebOptions, 1, 3),
    },

    // B16 - Psychomotorik (Psychomotor)
    b16: {
      psychomotorik: pickOne(b16PsychomotorikOptions),
    },

    // B17 - Suizidalität (Suicidality)
    b17: {
      gradDerSuizidalitat: selectRandomItems(b17GradDerSuizidalitaOptions, 1, 2),
      paktAbspracheFahigkeit: Math.random() < 0.8 ? selectRandomItems(b17PaktAbspracheFahigkeitOptions, 1, 2) : [],
      abklarungVonSuizidalitat: Math.random() < 0.6 ? b17AbklarungVonSuizidalitaOptions : [],
    },

    // B18 - Krankheitseinstellung (Attitude towards Illness)
    b18: {
      krankheitseinsicht: pickOne(b18KrankheitseinsichtOptions),
      behandlungsbereitschaft: pickOne(b18BehandlungsbereitschaftOptions),
    },
  };
}
