import * as FormLabels from '../../core/form-labels';
import * as FormTypes from '../../core/form-types';

// Constructs structured patient information and report metadata content
export function constructPatientInfoContent(
  geschlechtId: FormTypes.Geschlecht | null,
  alter: FormTypes.Alter,
  patientenchiffre: FormTypes.Patientenchiffre,
  datumBerichterstellung: FormTypes.DatumBerichterstellung
): (FormTypes.ParagraphNode | FormTypes.LineBreakNode)[] {
  // STEP 1: Extract and format individual fields
  const geschlecht = getGeschlechtLabel(geschlechtId);
  const alterText = formatAlter(alter);
  const chiffreText = patientenchiffre || '';
  const datumText = formatDatum(datumBerichterstellung);

  // STEP 2: Return empty array if all fields are empty
  if (!geschlecht && !alterText && !chiffreText && !datumText) {
    return [];
  }

  // STEP 3: Build structured content with line breaks for proper formatting
  const content: (FormTypes.ParagraphNode | FormTypes.LineBreakNode)[] = [];

  content.push({ type: 'paragraph', text: `Patientenchiffre: ${chiffreText}`, id: 'patient-chiffre' });
  content.push({ type: 'break' });
  content.push({ type: 'paragraph', text: `Geschlecht: ${geschlecht}`, id: 'patient-geschlecht' });
  content.push({ type: 'break' });
  content.push({ type: 'paragraph', text: `Alter: ${alterText}`, id: 'patient-alter' });

  // Add report date on separate line if provided (report metadata, not patient info)
  if (datumText) {
    content.push({ type: 'break' });
    content.push({ type: 'paragraph', text: `Datum der Berichterstellung: ${datumText}`, id: 'report-date' });
  }

  return content;
}

// ---
// Helper functions
// ---

// Gets German label for gender ID
function getGeschlechtLabel(id: FormTypes.Geschlecht | null): string {
  if (!id) return '';
  // Direct O(1) lookup from GESCHLECHT_LABELS
  return FormLabels.GESCHLECHT_LABELS[id] || '';
}

// Formats age as "X Jahre"
function formatAlter(alter: FormTypes.Alter): string {
  if (alter === null) return '';
  return `${alter} Jahre`;
}

// Formats ISO date (YYYY-MM-DD) to German format (DD.MM.YYYY)
function formatDatum(datum: FormTypes.DatumBerichterstellung): string {
  if (!datum) return '';

  // Parse ISO date (YYYY-MM-DD)
  const [year, month, day] = datum.split('-');

  // Return German format (DD.MM.YYYY)
  return `${day}.${month}.${year}`;
}

// Provides test examples
export function getPatientInfoExamples(): {
  geschlechtId: string | null;
  alter: FormTypes.Alter;
  patientenchiffre: FormTypes.Patientenchiffre;
  datumBerichterstellung: FormTypes.DatumBerichterstellung;
  content: (FormTypes.ParagraphNode | FormTypes.LineBreakNode)[];
}[] {
  return [
    // Complete patient info with date
    {
      geschlechtId: 'm', // männlich
      alter: 45,
      patientenchiffre: 'PAT-2024-001',
      datumBerichterstellung: '2024-01-23',
      content: [
        { type: 'paragraph', text: 'Patientenchiffre: PAT-2024-001', id: 'patient-chiffre' },
        { type: 'break' },
        { type: 'paragraph', text: 'Geschlecht: männlich', id: 'patient-geschlecht' },
        { type: 'break' },
        { type: 'paragraph', text: 'Alter: 45 Jahre', id: 'patient-alter' },
        { type: 'break' },
        { type: 'paragraph', text: 'Datum der Berichterstellung: 23.01.2024', id: 'report-date' }
      ]
    },

    // All fields empty
    {
      geschlechtId: null,
      alter: null,
      patientenchiffre: null,
      datumBerichterstellung: null,
      content: []
    }
  ];
}
