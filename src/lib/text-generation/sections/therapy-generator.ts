import * as FormConfig from '@/lib/core/form-config';
import * as FormTypes from '../../core/form-types';

// Sentence templates

const TEMPLATES = {
  THERAPY_SINGLE: 'Es wird eine {FORM} beantragt.',
  THERAPY_TWO: 'Es werden {FORM1} und {FORM2} beantragt.',
  THERAPY_MULTIPLE: 'Es werden {FORMS} und {LAST_FORM} beantragt.',

  TREATMENT_SINGLE: 'Als Behandlungsform wird eine {FORM} gewählt.',
  TREATMENT_TWO: 'Als Behandlungsformen werden {FORM1} und {FORM2} gewählt.',
  TREATMENT_MULTIPLE: 'Als Behandlungsformen werden {FORMS} und {LAST_FORM} gewählt.'
} as const;

// Constructs structured content for requested therapy forms
export function constructTherapyContent(therapieIds: string[]): FormTypes.ParagraphNode[] {
  if (therapieIds.length === 0) return [];

  // Get labels for all selected therapy forms
  const labels = getLabelsByIds(therapieIds, 'therapieform');
  const text = buildListSentence(labels, 'therapy');

  return [{ type: 'paragraph', text, id: 'therapy-form' }];
}

// Constructs structured content for chosen treatment forms
export function constructTreatmentContent(behandlungIds: string[]): FormTypes.ParagraphNode[] {
  if (behandlungIds.length === 0) return [];

  // Get labels for all selected treatment forms
  const labels = getLabelsByIds(behandlungIds, 'behandlungsform');
  const text = buildListSentence(labels, 'treatment');

  return [{ type: 'paragraph', text, id: 'treatment-form' }];
}

// @deprecated Use constructTherapyContent for structured output
export function constructTherapySentence(therapieIds: string[]): string {
  if (therapieIds.length === 0) return '';

  // Get labels for all selected therapy forms
  const labels = getLabelsByIds(therapieIds, 'therapieform');

  return buildListSentence(labels, 'therapy');
}

// @deprecated Use constructTreatmentContent for structured output
export function constructTreatmentSentence(behandlungIds: string[]): string {
  if (behandlungIds.length === 0) return '';

  // Get labels for all selected treatment forms
  const labels = getLabelsByIds(behandlungIds, 'behandlungsform');

  return buildListSentence(labels, 'treatment');
}

// Gets German labels from FormConfig.FORM_OPTIONS
function getLabelsByIds(ids: string[], optionKey: 'therapieform' | 'behandlungsform'): string[] {
  return ids
    .map(id => {
      const option = FormConfig.FORM_OPTIONS[optionKey].find(opt => opt.id === id);
      return option?.label || '';
    })
    .filter(Boolean); // Remove empty strings
}

// Builds grammatically correct German list sentence
function buildListSentence(labels: string[], type: 'therapy' | 'treatment'): string {
  const templatePrefix = type === 'therapy' ? 'THERAPY' : 'TREATMENT';

  // Case 1: Single item
  if (labels.length === 1) {
    return TEMPLATES[`${templatePrefix}_SINGLE` as keyof typeof TEMPLATES]
      .replace('{FORM}', labels[0]);
  }

  // Case 2: Two items
  if (labels.length === 2) {
    return TEMPLATES[`${templatePrefix}_TWO` as keyof typeof TEMPLATES]
      .replace('{FORM1}', labels[0])
      .replace('{FORM2}', labels[1]);
  }

  // Case 3: Multiple items (3+)
  // Format: "Form1, Form2, Form3 und Form4"
  const labelsCopy = [...labels];
  const lastLabel = labelsCopy.pop()!; // Remove and get last item
  const formsCommaSeparated = labelsCopy.join(', ');

  return TEMPLATES[`${templatePrefix}_MULTIPLE` as keyof typeof TEMPLATES]
    .replace('{FORMS}', formsCommaSeparated)
    .replace('{LAST_FORM}', lastLabel);
}

// Provides test examples
export function getTherapyTreatmentExamples(): {
  type: string;
  ids: string[];
  sentence: string;
}[] {
  return [
    // Therapy examples
    {
      type: 'therapy',
      ids: ['therapie_verhaltenstherapie'], // Verhaltenstherapie
      sentence: 'Es wird eine Verhaltenstherapie beantragt.'
    },
    {
      type: 'therapy',
      ids: ['therapie_verhaltenstherapie', 'therapie_tiefenpsychologisch'], // Verhaltenstherapie, Tiefenpsychologisch-fundierte Therapie
      sentence: 'Es werden Verhaltenstherapie und Tiefenpsychologisch-fundierte Therapie beantragt.'
    },

    // Treatment examples
    {
      type: 'treatment',
      ids: ['behandlung_einzel'], // Einzeltherapie
      sentence: 'Als Behandlungsform wird eine Einzeltherapie gewählt.'
    },
    {
      type: 'treatment',
      ids: ['behandlung_einzel', 'behandlung_gruppe'], // Einzeltherapie, Gruppentherapie
      sentence: 'Als Behandlungsformen werden Einzeltherapie und Gruppentherapie gewählt.'
    }
  ];
}
