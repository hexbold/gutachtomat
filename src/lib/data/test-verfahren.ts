/**
 * Testdiagnostische Verfahren - Psychological diagnostic tests catalog
 * Organized by category with abbreviation and full name
 */

export const testVerfahrenCategories = [
  'Allgemeine Screenings',
  'Depression',
  'Angststörungen',
  'Soziale Phobie',
  'Sorgen',
  'Zwangsstörungen',
  'Trauma / PTBS',
  'Sucht / Substanzgebrauch',
  'Essstörungen',
  'Persönlichkeitsstörungen',
  'ADHS',
  'Somatisierungsstörungen',
  'Dissoziation',
  'Zwanghaftes Grübeln / Ruminieren',
  'Interpersonelle Probleme / Bindung',
  'Psychotische Symptomatik',
  'Schlafstörungen',
  'Transsexualismus',
  'Sexuelle Funktionsstörungen',
  'Tic-Störungen',
  'Autismus-Spektrum-Störungen',
] as const;

export type TestCategory = (typeof testVerfahrenCategories)[number];

export interface TestVerfahren {
  abbreviation: string;
  name: string;
}

export const testVerfahrenByCategory: Record<TestCategory, TestVerfahren[]> = {
  'Allgemeine Screenings': [
    { abbreviation: 'SCL-90-R', name: 'Symptomcheckliste-90-Revised' },
    { abbreviation: 'BSI', name: 'Brief Symptom Inventory' },
    { abbreviation: 'DASS', name: 'Depression, Anxiety, Stress Scales' },
    { abbreviation: 'GHQ', name: 'General Health Questionnaire' },
    { abbreviation: 'PHQ', name: 'Patient Health Questionnaire – Gesamtskala' },
    { abbreviation: 'CORE-OM', name: 'Clinical Outcomes in Routine Evaluation' },
    { abbreviation: 'DIPS', name: 'Diagnostisches Interview bei psychischen Störungen' },
    { abbreviation: 'CIDI', name: 'Composite International Diagnostic Interview' },
    { abbreviation: 'ICD-10 Checklisten', name: 'ICD-10 Checklisten' },
  ],

  Depression: [
    { abbreviation: 'BDI-II', name: 'Beck Depression Inventory-II' },
    { abbreviation: 'PHQ-9', name: 'Patient Health Questionnaire-9' },
    { abbreviation: 'MADRS-S', name: 'Montgomery-Åsberg Depression Rating Scale – Self-Report' },
    { abbreviation: 'HADS-D', name: 'Hospital Anxiety and Depression Scale – Depression' },
    { abbreviation: 'CES-D', name: 'Center for Epidemiological Studies Depression Scale' },
  ],

  Angststörungen: [
    { abbreviation: 'GAD-7', name: 'Generalized Anxiety Disorder Scale-7' },
    { abbreviation: 'F-DIPS', name: 'Diagnostisches Interview Psychischer Störungen für GAS' },
    { abbreviation: 'HAMA-S', name: 'Hamilton Anxiety Rating Scale – Self-Report' },
    { abbreviation: 'HAMA', name: 'Hamilton Anxiety Rating Scale' },
    { abbreviation: 'HADS-A', name: 'Hospital Anxiety and Depression Scale – Anxiety' },
    { abbreviation: 'PAS', name: 'Panik- und Agoraphobieskala' },
    { abbreviation: 'STAI', name: 'State-Trait Anxiety Inventory' },
  ],

  'Soziale Phobie': [
    { abbreviation: 'SIAS', name: 'Soziale Interaktions-Angst-Skala' },
    { abbreviation: 'SPS', name: 'Soziale Phobie-Skala' },
    { abbreviation: 'SPS-P', name: 'Soziale Phobie-Skala – Performanzsituationen' },
    { abbreviation: 'SPIN', name: 'Social Phobia Inventory' },
    { abbreviation: 'SPAI', name: 'Social Phobia and Anxiety Inventory' },
    { abbreviation: 'LSAS', name: 'Liebowitz-Soziale-Angst-Skala' },
  ],

  Sorgen: [
    { abbreviation: 'WDQ', name: 'Worry Domain Questionnaire' },
    { abbreviation: 'PSWQ', name: 'Penn State Worry Questionnaire' },
    { abbreviation: 'MCQ', name: 'Meta-Kognitions-Fragebogen' },
  ],

  Zwangsstörungen: [
    { abbreviation: 'Y-BOCS', name: 'Yale-Brown Obsessive Compulsive Scale' },
    { abbreviation: 'OCI-R', name: 'Obsessive-Compulsive Inventory – Revised' },
    { abbreviation: 'DOCS', name: 'Dimensional Obsessive-Compulsive Scale' },
    { abbreviation: 'FOCI', name: 'Florida Obsessive-Compulsive Inventory' },
  ],

  'Trauma / PTBS': [
    { abbreviation: 'PCL-5', name: 'PTSD Checklist for DSM-5' },
    { abbreviation: 'IES-R', name: 'Impact of Event Scale – Revised' },
    { abbreviation: 'HTQ', name: 'Harvard Trauma Questionnaire' },
    { abbreviation: 'CTQ', name: 'Child Trauma Questionnaire' },
  ],

  'Sucht / Substanzgebrauch': [
    { abbreviation: 'AUDIT', name: 'Alcohol Use Disorders Identification Test' },
    { abbreviation: 'DUDIT', name: 'Drug Use Disorders Identification Test' },
    { abbreviation: 'FTND', name: 'Fagerström Test for Nicotine Dependence' },
  ],

  Essstörungen: [
    { abbreviation: 'EDE-Q', name: 'Eating Disorder Examination Questionnaire' },
    { abbreviation: 'EDI-3', name: 'Eating Disorder Inventory' },
    { abbreviation: 'SCOFF', name: 'SCOFF-Screening' },
  ],

  Persönlichkeitsstörungen: [
    { abbreviation: 'SKID-5-PD', name: 'Strukturiertes Klinisches Interview für DSM-5' },
    { abbreviation: 'PID-5', name: 'Personality Inventory for DSM-5' },
    { abbreviation: 'BSL-23', name: 'Borderline Symptom List' },
    { abbreviation: 'PAI', name: 'Personality Assessment Inventory' },
  ],

  ADHS: [
    { abbreviation: 'ASRS', name: 'Adult ADHD Self-Report Scale' },
    { abbreviation: 'CAARS', name: 'Conners Adult ADHD Rating Scales' },
  ],

  Somatisierungsstörungen: [
    { abbreviation: 'PHQ-15', name: 'Patient Health Questionnaire-15' },
    { abbreviation: 'SOMS-2', name: 'Screening für Somatoforme Störungen' },
    { abbreviation: 'SDQ-20', name: 'Somatoforme Dissoziationsskala' },
  ],

  Dissoziation: [
    { abbreviation: 'DES-II', name: 'Dissociative Experiences Scale' },
    { abbreviation: 'FDS', name: 'Fragebogen zu Dissoziativen Symptomen' },
  ],

  'Zwanghaftes Grübeln / Ruminieren': [
    { abbreviation: 'RRS', name: 'Ruminative Responses Scale' },
  ],

  'Interpersonelle Probleme / Bindung': [
    { abbreviation: 'IIP', name: 'Inventar Interpersoneller Probleme' },
    { abbreviation: 'ECR-R', name: 'Experiences in Close Relationships – Revised' },
  ],

  'Psychotische Symptomatik': [
    { abbreviation: 'CAPE', name: 'Community Assessment of Psychic Experiences' },
    { abbreviation: 'PQ-B', name: 'Prodromal Questionnaire – Brief' },
    { abbreviation: 'PQ-16', name: 'Prodromal Questionnaire-16' },
    { abbreviation: 'PANSS', name: 'Positive and Negative Syndrome Scale' },
    { abbreviation: 'SAPS', name: 'Scale for Assessment of Positive Symptoms' },
    { abbreviation: 'SANS', name: 'Scale for Assessment of Negative Symptoms' },
  ],

  Schlafstörungen: [
    { abbreviation: 'PSQI', name: 'Pittsburgh Sleep Quality Index' },
    { abbreviation: 'ISI', name: 'Insomnia Severity Index' },
  ],

  Transsexualismus: [
    { abbreviation: 'GIDYQ-AA', name: 'Gender Identity/Gender Dysphoria Questionnaire for Adolescents and Adults' },
    { abbreviation: 'UGDS', name: 'Utrecht Gender Dysphoria Scale' },
    { abbreviation: 'GPSQ', name: 'Gender Preoccupation and Stability Questionnaire' },
    { abbreviation: 'TCS', name: 'Transgender Congruence Scale' },
    { abbreviation: 'BEST', name: 'Body Image Scale for Transsexuals' },
    { abbreviation: 'ENIGI', name: 'ENIGI-Fragebögen' },
  ],

  'Sexuelle Funktionsstörungen': [
    { abbreviation: 'FSFI', name: 'Female Sexual Function Index' },
    { abbreviation: 'FSDS-R', name: 'Female Sexual Distress Scale – Revised' },
    { abbreviation: 'IIEF', name: 'International Index of Erectile Function' },
    { abbreviation: 'PEDT', name: 'Premature Ejaculation Diagnostic Tool' },
    { abbreviation: 'SHIM', name: 'Sexual Health Inventory for Men' },
    { abbreviation: 'SDI', name: 'Sexual Desire Inventory' },
    { abbreviation: 'CSFQ', name: 'Changes in Sexual Functioning Questionnaire' },
    { abbreviation: 'SSS-W/S', name: 'Sexual Satisfaction Scales' },
  ],

  'Tic-Störungen': [
    { abbreviation: 'YGTSS', name: 'Yale Global Tic Severity Scale' },
    { abbreviation: 'YCMI', name: 'Yale Child Motor Inventory' },
    { abbreviation: 'STSS', name: 'Shapiro Tourette Syndrome Severity Scale' },
    { abbreviation: 'PUTS', name: 'Premonitory Urge for Tics Scale' },
    { abbreviation: 'ATQ', name: 'Adult Tic Questionnaire' },
  ],

  'Autismus-Spektrum-Störungen': [
    { abbreviation: 'AQ', name: 'Autism-Spectrum Quotient' },
    { abbreviation: 'RAADS-R', name: 'Ritvo Autism Asperger Diagnostic Scale – Revised' },
    { abbreviation: 'SRS-2', name: 'Social Responsiveness Scale – Erwachsene' },
    { abbreviation: 'GQ-ASC', name: 'Girls Questionnaire for Autism Spectrum Conditions' },
    { abbreviation: 'CAT-Q', name: 'Camouflaging Autistic Traits Questionnaire' },
  ],
};

// Helper type for search results
export type TestVerfahrenWithCategory = TestVerfahren & { category: TestCategory };

/**
 * Search tests by abbreviation or name (case-insensitive)
 * Returns matching tests with their category
 */
export function searchTestVerfahren(query: string): TestVerfahrenWithCategory[] {
  if (query.length < 2) return [];

  const q = query.toLowerCase();
  const results: TestVerfahrenWithCategory[] = [];

  for (const [category, tests] of Object.entries(testVerfahrenByCategory)) {
    for (const test of tests) {
      if (
        test.abbreviation.toLowerCase().includes(q) ||
        test.name.toLowerCase().includes(q)
      ) {
        results.push({ ...test, category: category as TestCategory });
      }
    }
  }

  return results;
}

/**
 * Get all tests as a flat array with category
 */
export function getAllTestVerfahren(): TestVerfahrenWithCategory[] {
  const results: TestVerfahrenWithCategory[] = [];

  for (const [category, tests] of Object.entries(testVerfahrenByCategory)) {
    for (const test of tests) {
      results.push({ ...test, category: category as TestCategory });
    }
  }

  return results;
}

/**
 * Get a specific test by abbreviation
 */
export function getTestByAbbreviation(
  abbreviation: string
): TestVerfahrenWithCategory | undefined {
  for (const [category, tests] of Object.entries(testVerfahrenByCategory)) {
    const test = tests.find((t) => t.abbreviation === abbreviation);
    if (test) {
      return { ...test, category: category as TestCategory };
    }
  }
  return undefined;
}
