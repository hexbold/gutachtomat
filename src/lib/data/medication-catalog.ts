/**
 * Medication Catalog for Chapter 3: Somatischer Befund
 *
 * 13 categories (A-M) of psychopharmacological and other medications
 * Used for searchable medication selection in the wizard
 */

import {
  MedikamentKategorie,
  AntidepressivaSubkategorie,
  AntipsychotikaSubkategorie,
} from '@/lib/core/form-types';

export interface MedicationItem {
  name: string;
  kategorie: MedikamentKategorie;
  subkategorie?: AntidepressivaSubkategorie | AntipsychotikaSubkategorie | string;
}

export const MEDICATION_CATALOG: MedicationItem[] = [
  // ============================================================================
  // A. Selektive Antidepressiva
  // ============================================================================

  // SSRI
  { name: 'Citalopram', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.SSRI },
  { name: 'Escitalopram', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.SSRI },
  { name: 'Sertralin', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.SSRI },
  { name: 'Paroxetin', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.SSRI },
  { name: 'Fluoxetin', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.SSRI },
  { name: 'Fluvoxamin', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.SSRI },

  // SNRI
  { name: 'Venlafaxin', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.SNRI },
  { name: 'Duloxetin', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.SNRI },
  { name: 'Desvenlafaxin', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.SNRI },
  { name: 'Levomilnacipran', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.SNRI },

  // NDRI
  { name: 'Bupropion', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.NDRI },

  // Tetrazyklische Antidepressiva
  { name: 'Mirtazapin', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.Tetrazyklische },
  { name: 'Trazodon', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.Tetrazyklische },

  // Trizyklische Antidepressiva
  { name: 'Amitriptylin', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.Trizyklische },
  { name: 'Nortriptylin', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.Trizyklische },
  { name: 'Trimipramin', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.Trizyklische },
  { name: 'Imipramin', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.Trizyklische },
  { name: 'Clomipramin', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.Trizyklische },

  // MAO-Hemmer
  { name: 'Moclobemid', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.MAOHemmer },
  { name: 'Tranylcypromin', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.MAOHemmer },

  // Andere Antidepressiva
  { name: 'Agomelatin', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.Andere },
  { name: 'Tianeptin', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.Andere },
  { name: 'Vortioxetin', kategorie: MedikamentKategorie.SelektiveAntidepressiva, subkategorie: AntidepressivaSubkategorie.Andere },

  // ============================================================================
  // B. Antipsychotika
  // ============================================================================

  // Typische Antipsychotika
  { name: 'Haloperidol', kategorie: MedikamentKategorie.Antipsychotika, subkategorie: AntipsychotikaSubkategorie.Typische },
  { name: 'Perazin', kategorie: MedikamentKategorie.Antipsychotika, subkategorie: AntipsychotikaSubkategorie.Typische },
  { name: 'Fluphenazin', kategorie: MedikamentKategorie.Antipsychotika, subkategorie: AntipsychotikaSubkategorie.Typische },
  { name: 'Chlorpromazin', kategorie: MedikamentKategorie.Antipsychotika, subkategorie: AntipsychotikaSubkategorie.Typische },

  // Atypische Antipsychotika
  { name: 'Olanzapin', kategorie: MedikamentKategorie.Antipsychotika, subkategorie: AntipsychotikaSubkategorie.Atypische },
  { name: 'Quetiapin', kategorie: MedikamentKategorie.Antipsychotika, subkategorie: AntipsychotikaSubkategorie.Atypische },
  { name: 'Risperidon', kategorie: MedikamentKategorie.Antipsychotika, subkategorie: AntipsychotikaSubkategorie.Atypische },
  { name: 'Aripiprazol', kategorie: MedikamentKategorie.Antipsychotika, subkategorie: AntipsychotikaSubkategorie.Atypische },
  { name: 'Clozapin', kategorie: MedikamentKategorie.Antipsychotika, subkategorie: AntipsychotikaSubkategorie.Atypische },
  { name: 'Amisulprid', kategorie: MedikamentKategorie.Antipsychotika, subkategorie: AntipsychotikaSubkategorie.Atypische },
  { name: 'Ziprasidon', kategorie: MedikamentKategorie.Antipsychotika, subkategorie: AntipsychotikaSubkategorie.Atypische },
  { name: 'Paliperidon', kategorie: MedikamentKategorie.Antipsychotika, subkategorie: AntipsychotikaSubkategorie.Atypische },

  // ============================================================================
  // C. Anxiolytika
  // ============================================================================
  { name: 'Diazepam', kategorie: MedikamentKategorie.Anxiolytika },
  { name: 'Lorazepam', kategorie: MedikamentKategorie.Anxiolytika },
  { name: 'Alprazolam', kategorie: MedikamentKategorie.Anxiolytika },
  { name: 'Oxazepam', kategorie: MedikamentKategorie.Anxiolytika },
  { name: 'Bromazepam', kategorie: MedikamentKategorie.Anxiolytika },
  { name: 'Clonazepam', kategorie: MedikamentKategorie.Anxiolytika },

  // ============================================================================
  // D. Stimmungsstabilisierer
  // ============================================================================
  { name: 'Lithium', kategorie: MedikamentKategorie.Stimmungsstabilisierer },
  { name: 'Valproat', kategorie: MedikamentKategorie.Stimmungsstabilisierer },
  { name: 'Lamotrigin', kategorie: MedikamentKategorie.Stimmungsstabilisierer },
  { name: 'Carbamazepin', kategorie: MedikamentKategorie.Stimmungsstabilisierer },

  // ============================================================================
  // E. Hypnotika
  // ============================================================================
  { name: 'Zolpidem', kategorie: MedikamentKategorie.Hypnotika },
  { name: 'Zopiclon', kategorie: MedikamentKategorie.Hypnotika },
  { name: 'Lormetazepam', kategorie: MedikamentKategorie.Hypnotika },
  { name: 'Melatonin', kategorie: MedikamentKategorie.Hypnotika },

  // ============================================================================
  // F. ADHS-Medikation
  // ============================================================================
  { name: 'Methylphenidat', kategorie: MedikamentKategorie.ADHSMedikation },
  { name: 'Lisdexamfetamin', kategorie: MedikamentKategorie.ADHSMedikation },
  { name: 'Atomoxetin', kategorie: MedikamentKategorie.ADHSMedikation },

  // ============================================================================
  // G. Spezielle Medikation
  // ============================================================================
  { name: 'Esketamin', kategorie: MedikamentKategorie.SpezielleMedikation },
  { name: 'Psilocybin', kategorie: MedikamentKategorie.SpezielleMedikation },
  { name: 'Ketamin-Infusionstherapie', kategorie: MedikamentKategorie.SpezielleMedikation },

  // ============================================================================
  // H. Schilddrüsenmedikation
  // ============================================================================
  { name: 'Levothyroxin', kategorie: MedikamentKategorie.Schilddruesenmedikation },
  { name: 'Liothyronin', kategorie: MedikamentKategorie.Schilddruesenmedikation },

  // ============================================================================
  // I. Schmerzmedikation
  // ============================================================================
  { name: 'Ibuprofen', kategorie: MedikamentKategorie.Schmerzmedikation },
  { name: 'Naproxen', kategorie: MedikamentKategorie.Schmerzmedikation },
  { name: 'Tilidin/Naloxon', kategorie: MedikamentKategorie.Schmerzmedikation },
  { name: 'Pregabalin', kategorie: MedikamentKategorie.Schmerzmedikation },
  { name: 'Gabapentin', kategorie: MedikamentKategorie.Schmerzmedikation },

  // ============================================================================
  // J. Herz-Kreislauf-Medikation
  // ============================================================================
  { name: 'Metoprolol', kategorie: MedikamentKategorie.HerzKreislaufMedikation },
  { name: 'Bisoprolol', kategorie: MedikamentKategorie.HerzKreislaufMedikation },
  { name: 'Ramipril', kategorie: MedikamentKategorie.HerzKreislaufMedikation },
  { name: 'Amlodipin', kategorie: MedikamentKategorie.HerzKreislaufMedikation },
  { name: 'ASS', kategorie: MedikamentKategorie.HerzKreislaufMedikation },
  { name: 'Apixaban', kategorie: MedikamentKategorie.HerzKreislaufMedikation },
  { name: 'Marcumar', kategorie: MedikamentKategorie.HerzKreislaufMedikation },
  { name: 'ACE-Hemmer', kategorie: MedikamentKategorie.HerzKreislaufMedikation },
  { name: 'AT1-Blocker', kategorie: MedikamentKategorie.HerzKreislaufMedikation },

  // ============================================================================
  // K. Diabetes-Medikation
  // ============================================================================
  { name: 'Metformin', kategorie: MedikamentKategorie.DiabetesMedikation },
  { name: 'Insulin', kategorie: MedikamentKategorie.DiabetesMedikation },

  // ============================================================================
  // L. Substitutionsbehandlungen / Suchtmitteltherapie
  // ============================================================================
  { name: 'Methadon', kategorie: MedikamentKategorie.Substitutionsbehandlungen },
  { name: 'Buprenorphin', kategorie: MedikamentKategorie.Substitutionsbehandlungen },
  { name: 'Naltrexon', kategorie: MedikamentKategorie.Substitutionsbehandlungen },

  // ============================================================================
  // M. Hormonelle Präparate
  // ============================================================================
  { name: 'Ethinylestradiol', kategorie: MedikamentKategorie.HormonellePraeparate },
  { name: 'Levonorgestrel', kategorie: MedikamentKategorie.HormonellePraeparate },
  { name: 'Drospirenon', kategorie: MedikamentKategorie.HormonellePraeparate },
  { name: 'Testosteron-Gele', kategorie: MedikamentKategorie.HormonellePraeparate },
  { name: 'Östrogenpflaster', kategorie: MedikamentKategorie.HormonellePraeparate },
  { name: 'Antibabypille', kategorie: MedikamentKategorie.HormonellePraeparate },
];

/**
 * Search medications by name (case-insensitive)
 */
export function searchMedications(query: string): MedicationItem[] {
  const lowerQuery = query.toLowerCase();
  return MEDICATION_CATALOG.filter(med =>
    med.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get medications by category
 */
export function getMedicationsByCategory(kategorie: MedikamentKategorie): MedicationItem[] {
  return MEDICATION_CATALOG.filter(med => med.kategorie === kategorie);
}

/**
 * Get medications by subcategory (for antidepressiva and antipsychotika)
 */
export function getMedicationsBySubcategory(
  kategorie: MedikamentKategorie,
  subkategorie: AntidepressivaSubkategorie | AntipsychotikaSubkategorie
): MedicationItem[] {
  return MEDICATION_CATALOG.filter(
    med => med.kategorie === kategorie && med.subkategorie === subkategorie
  );
}
