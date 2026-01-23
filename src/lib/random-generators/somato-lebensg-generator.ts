/**
 * Somato and Diagnoses Test Data Generator
 *
 * Generates random data for:
 * - Somato1-5 (Somatic findings, medication, prior treatment, family history, substance use)
 * - Kap5Diagnosen (Diagnoses)
 *
 * Note: LebensgA, Krankheitsanamnese, and FunktionalesBedingungsmodell are now in
 * behandlungsrelevante-angaben-generator.ts
 */

import { icd10Diagnoses } from '../data/icd10-diagnoses';
import * as FormTypes from '../core/form-types';

export interface SomatoDiagnosenData {
  somato1: FormTypes.Somato1Data;
  somato2: FormTypes.Somato2Data;
  somato3: FormTypes.Somato3Data;
  somato4: FormTypes.Somato4Data;
  somato5: FormTypes.Somato5Data;
  kap5Diagnosen: FormTypes.Kap5DiagnosenData;
}

// Helper to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Main function: Generates somato and diagnoses data
 */
export function generateSomatoDiagnosen(): SomatoDiagnosenData {
  // Diagnoses
  const selectableDiagnoses = icd10Diagnoses.filter((d) => d.isSelectable);
  const numDiagnoses = Math.floor(Math.random() * 4) + 1;
  const shuffled = [...selectableDiagnoses].sort(() => Math.random() - 0.5);
  const selectedDiagnoses = shuffled.slice(0, numDiagnoses).map((diagnosis) => ({
    code: diagnosis.code,
    name: diagnosis.name,
    sicherheit: (Math.random() < 0.7 ? 'G' : 'V') as 'G' | 'V',
  }));

  // Somato1: Somatische Vorerkrankungen (discriminated union)
  const hasVorerkrankungen = Math.random() < 0.4;
  const somato1: FormTypes.Somato1Data = {
    somatischeVorerkrankungen: hasVorerkrankungen
      ? { vorhanden: true, details: 'Arterielle Hypertonie, Diabetes mellitus Typ 2' }
      : { vorhanden: false },
    konsiliarberichtVorhanden: Math.random() < 0.5,
    konsiliarberichtText: Math.random() < 0.3 ? 'Konsiliarbericht des Hausarztes liegt vor.' : '',
  };

  // Somato2: Medikation (array-based)
  const keineMedikation = Math.random() < 0.3;
  const somato2: FormTypes.Somato2Data = {
    keineMedikation,
    medikamente: keineMedikation ? [] : [
      {
        id: generateId(),
        praeparat: 'Sertralin',
        kategorie: FormTypes.MedikamentKategorie.SelektiveAntidepressiva,
        subkategorie: 'SSRI',
        dosierung: Math.floor(Math.random() * 150) + 25,
        einnahmeSeit: {
          wert: Math.floor(Math.random() * 12) + 1,
          einheit: FormTypes.EinnahmeEinheit.Monate,
        },
        verordnung: { durch: FormTypes.Verordnung.Psychiater },
      },
    ],
  };

  // Somato3: Vorbehandlungen (array-based)
  const keineVorbehandlung = Math.random() < 0.3;
  const somato3: FormTypes.Somato3Data = {
    keineVorbehandlung,
    vorbehandlungen: keineVorbehandlung ? [] : [
      {
        id: generateId(),
        art: FormTypes.VorbehandlungArt.Psychotherapeutisch,
        setting: FormTypes.VorbehandlungSetting.Ambulant,
        zeitraum: {
          von: null,
          bis: null,
          textBeschreibung: 'ca. 2 Jahre',
        },
        ort: 'Universitätsklinik München',
        abschlussberichte: FormTypes.AbschlussberichteStatus.Vorhanden,
      },
    ],
    aktuelleBehandlung: Math.random() < 0.5 ? true : null,
    zusatztext: '',
  };

  // Somato4: Familienanamnese (discriminated union)
  const familieUnauffaellig = Math.random() < 0.7;
  const somato4: FormTypes.Somato4Data = {
    familienanamnese: familieUnauffaellig
      ? { unauffaellig: true }
      : { unauffaellig: false, details: 'Depression bei Mutter, Angststörung bei Schwester' },
  };

  // Somato5: Suchtanamnese (discriminated union with nested structure)
  const keineSucht = Math.random() < 0.4;
  const somato5: FormTypes.Somato5Data = {
    suchtanamnese: keineSucht
      ? { keineSucht: true }
      : {
          keineSucht: false,
          konsum: {
            alkohol: Math.random() < 0.6 ? {
              konsumArten: [
                { art: FormTypes.AlkoholArt.Wein, mengeLiter: 0.3, mengeGlaeser: 2 },
              ],
              haeufigkeit: { typ: FormTypes.KonsumHaeufigkeit.Woechentlich },
            } : null,
            nikotin: Math.random() < 0.5 ? [
              { form: FormTypes.NikotinForm.Zigaretten, anzahlProTag: Math.floor(Math.random() * 15) + 5 },
            ] : null,
            thc: null,
            illegaleDrogen: [],
            medikamentenMissbrauch: [],
            andereSuchtform: '',
            zusatztext: '',
          },
        },
  };

  return {
    somato1,
    somato2,
    somato3,
    somato4,
    somato5,
    kap5Diagnosen: {
      selectedDiagnoses,
    },
  };
}
