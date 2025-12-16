/**
 * Somato and Lebensg Test Data Generator
 *
 * Generates random data for:
 * - Somato1-5 (Somatic findings, medication, prior treatment, family history, substance use)
 * - LebensgA/B/C (Life history, illness history, functional analysis)
 * - Kap5Diagnosen (Diagnoses)
 *
 * Note: This is a simplified version. The LebensgC section is particularly complex
 * and may need enhancement for more realistic test data.
 */

import * as FormConfig from '@/lib/core/form-config';
import { icd10Diagnoses } from '../data/icd10-diagnoses';
import * as FormTypes from '../core/form-types';

export interface SomatoLebensgData {
  c: string;
  somato1: FormTypes.Somato1Data;
  somato2: FormTypes.Somato2Data;
  somato3: FormTypes.Somato3Data;
  somato4: FormTypes.Somato4Data;
  somato5: FormTypes.Somato5Data;
  lebensgA: FormTypes.LebensgAData;
  lebensgB: FormTypes.LebensgBData;
  lebensgC: FormTypes.LebensgCData;
  kap5Diagnosen: FormTypes.Kap5DiagnosenData;
}

/**
 * Main function: Generates all somato, lebensg, and diagnoses data
 */
export function generateSomatoLebensg(): SomatoLebensgData {
  // Random helpers
  const randomHaeufigkeit = () => {
    const options = FormConfig.FORM_OPTIONS.konsumHaeufigkeit;
    return options[Math.floor(Math.random() * options.length)].id;
  };

  // Somato5: Complex addiction data
  const keineSucht = Math.random() < 0.4;
  const alkoholSuchtmittel = keineSucht ? [] : FormConfig.FORM_OPTIONS.alkoholSuchtmittel
    .filter(() => Math.random() < 0.5)
    .map(opt => opt.id);

  const hasBier = alkoholSuchtmittel.includes('alkohol_bier');
  const hasWein = alkoholSuchtmittel.includes('alkohol_wein');
  const hasSchnaps = alkoholSuchtmittel.includes('alkohol_schnaps');
  const hasRauchen = Math.random() >= 0.3;
  const hasThc = Math.random() >= 0.8;

  // Diagnoses
  const selectableDiagnoses = icd10Diagnoses.filter((d) => d.isSelectable);
  const numDiagnoses = Math.floor(Math.random() * 4) + 1;
  const shuffled = [...selectableDiagnoses].sort(() => Math.random() - 0.5);
  const selectedDiagnoses = shuffled.slice(0, numDiagnoses).map((diagnosis) => ({
    code: diagnosis.code,
    name: diagnosis.name,
    sicherheit: (Math.random() < 0.7 ? 'G' : 'V') as 'G' | 'V',
  }));

  return {
    c: 'Zufällige testdiagnostische Ergebnisse',

    somato1: {
      somatischeVorerkrankungen: FormConfig.FORM_OPTIONS.somatischeVorerkrankungen[
        Math.floor(Math.random() * FormConfig.FORM_OPTIONS.somatischeVorerkrankungen.length)
      ].id,
    },

    somato2: {
      keineMedikation: Math.random() < 0.3,
      praeparat: Math.random() < 0.3 ? '' : 'Sertralin',
      dosierung: Math.random() < 0.3 ? '' : (Math.floor(Math.random() * 150) + 25).toString(),
      dauerEinheit: Math.random() < 0.5 ? 'dauer_wochen' : 'dauer_monate',
      dauerWert: (Math.floor(Math.random() * 24) + 1).toString(),
      verschriebenVon: FormConfig.FORM_OPTIONS.verschriebenVon[
        Math.floor(Math.random() * FormConfig.FORM_OPTIONS.verschriebenVon.length)
      ].id,
      verschriebenVonAndere: Math.random() < 0.7 ? '' : 'Neurologe',
    },

    somato3: (() => {
      const keineVorbehandlung = Math.random() < 0.3;
      if (keineVorbehandlung) {
        return {
          keineVorbehandlung: true,
          settingVorbehandlung: '',
          behandlungszeitraumEinheit: '',
          behandlungszeitraumWert: '',
          behandlungsort: '',
          abschlussberichte: '',
          abschlussberichteAndere: '',
        };
      }
      return {
        keineVorbehandlung: false,
        settingVorbehandlung: FormConfig.FORM_OPTIONS.settingVorbehandlung[
          Math.floor(Math.random() * FormConfig.FORM_OPTIONS.settingVorbehandlung.length)
        ].id,
        behandlungszeitraumEinheit: Math.random() < 0.5 ? 'zeitraum_wochen' : 'zeitraum_monate',
        behandlungszeitraumWert: (Math.floor(Math.random() * 52) + 1).toString(),
        behandlungsort: Math.random() < 0.3 ? '' : 'Universitätsklinik',
        abschlussberichte: FormConfig.FORM_OPTIONS.abschlussberichte[
          Math.floor(Math.random() * FormConfig.FORM_OPTIONS.abschlussberichte.length)
        ].id,
        abschlussberichteAndere: Math.random() < 0.7 ? '' : 'Teilweise vorhanden',
      };
    })(),

    somato4: (() => {
      const selectedOption = Math.random() < 0.7 ? 'familie_unauffaellig' : 'familie_haeufung';
      return {
        familienanamnese: selectedOption,
        familiaeHaeufungText: selectedOption === 'familie_haeufung' && Math.random() < 0.8
          ? 'Depression bei Mutter, Angststörung bei Schwester'
          : '',
      };
    })(),

    somato5: keineSucht ? {
      keineSucht: true,
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
    } : {
      keineSucht: false,
      alkoholSuchtmittel,
      bierMengeLiter: hasBier && Math.random() < 0.6 ? (Math.random() * 2 + 0.3).toFixed(1) : '',
      bierMengeGlaeser: hasBier && Math.random() < 0.6 ? (Math.floor(Math.random() * 5) + 1).toString() : '',
      weinMengeLiter: hasWein && Math.random() < 0.6 ? (Math.random() * 1.5 + 0.2).toFixed(1) : '',
      weinMengeGlaeser: hasWein && Math.random() < 0.6 ? (Math.floor(Math.random() * 4) + 1).toString() : '',
      schnapsMengeLiter: hasSchnaps && Math.random() < 0.6 ? (Math.random() * 0.5 + 0.1).toFixed(1) : '',
      schnapsMengeGlaeser: hasSchnaps && Math.random() < 0.6 ? (Math.floor(Math.random() * 3) + 1).toString() : '',
      alkoholHaeufigkeit: alkoholSuchtmittel.length > 0 ? randomHaeufigkeit() : '',
      rauchenAnzahl: hasRauchen ? (Math.floor(Math.random() * 20) + 5).toString() : '',
      rauchenHaeufigkeit: hasRauchen ? randomHaeufigkeit() : '',
      thcMenge: hasThc ? (Math.random() * 5 + 0.5).toFixed(1) : '',
      thcHaeufigkeit: hasThc ? randomHaeufigkeit() : '',
      illegaleDrogen: [], // Simplified - can be enhanced
      andereSuchtform: Math.random() < 0.85 ? '' : 'Spielsucht',
    },

    // Simplified Lebensg sections with placeholder text
    lebensgA: {
      a1BiographischeEinordnung: 'Geboren 1985 in München. Aufgewachsen in bürgerlichem Umfeld mit beiden Eltern und einem jüngeren Geschwister.',
      a2Entwicklung: 'Unauffällige Geburt und Kindheitsentwicklung. Gute schulische Leistungen.',
    },

    lebensgB: {
      b1SituationPsychotherapie: 'Patient kommt aufgrund anhaltender Belastungssituation in Behandlung.',
      b2BeginnDauerVerlauf: 'Symptombeginn vor ca. 18 Monaten mit zunehmender Verschlechterung.',
      b3AusloesendeFaktoren: 'Auslösende Faktoren: Trennung, berufliche Konflikte.',
    },

    // Simplified LebensgC - this section is very complex and would need ~300+ lines
    // TODO: Enhance with full SORKC and vulnerability analysis
    lebensgC: {
      c1SituationExtern: 'Konfliktgespräch mit Vorgesetztem',
      c1SituationIntern: 'Gedanken an Arbeitsplatzverlust',
      c1Organismus: 'Erhöhte Stressanfälligkeit',
      c1ReaktionKognitiv: 'Ich versage, ich bin nicht gut genug',
      c1ReaktionEmotional: 'Angst, Traurigkeit',
      c1ReaktionPhysiologisch: 'Herzrasen, Schwitzen',
      c1ReaktionBehavioral: 'Rückzug, Vermeidung',
      c1KonsequenzKurzfristigCPlus: 'Spannungsreduktion',
      c1KonsequenzKurzfristigCMinus: 'Keine unangenehme Konfrontation',
      c1KonsequenzKurzfristigCPlusSlash: 'Vorübergehende Erleichterung',
      c1KonsequenzKurzfristigCMinusSlash: 'Vermeidung von Kritik',
      c1KonsequenzLangfristigCPlus: 'Keine',
      c1KonsequenzLangfristigCMinus: 'Verschlechterung der Arbeitssituation',
      c1KonsequenzLangfristigCPlusSlash: 'Zunahme sozialer Isolation',
      c1KonsequenzLangfristigCMinusSlash: 'Verstärkung der Symptomatik',
      c21KognitivGrundbeduerfnisse: ['Bindung', 'Selbstwerterhöhung'],
      c21KognitivGrundbeduerfnisseAndere: '',
      c21KognitivGrundannahmen: 'Ich bin nicht gut genug.',
      c21KognitivPlaeneAnnaehrung: 'Anerkennung erhalten',
      c21KognitivPlaeneVermeidung: 'Kritik vermeiden',
      c21KognitivPlaeneAndere: '',
      c21KognitivPersoenlichkeit: 'Introvertiert, gewissenhaft',
      c21KognitivFruehkindlich: [],
      c21KognitivFruehkindlichAndere: '',
      c21BiologischGenetisch: [],
      c21BiologischGenetischAndere: '',
      c21SozialeVulnerabilitaet: [],
      c21SozialeVulnerabilitaetAndere: '',
      c22BelastendeLebensereignisse: 'Trennung vom Partner',
      c22KumulationVonBelastungen: 'Anhaltende familiäre Konflikte',
      c22TraumatischeEreignisse: '',
      c22Andere: '',
      // C2.3 - Simplified aufrechterhaltende Bedingungen
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

    kap5Diagnosen: {
      selectedDiagnoses,
    },
  };
}
