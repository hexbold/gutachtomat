import * as FormConfig from '@/lib/core/form-config';
import * as FormTypes from '../../core/form-types';

// Application type IDs

const APPLICATION_IDS = {
  ERSTANTRAG: 'antrag_erst',        // Initial application
  UMWANDLUNG: 'antrag_umwandlung',        // Conversion request
  FORTFUEHRUNG: 'antrag_fortfuehrung'       // Continuation
} as const;

// Sentence templates for application types
const TEMPLATES = {
  ERSTANTRAG: 'Es handelt sich um einen {LABEL} für psychotherapeutische Behandlung.',
  UMWANDLUNG: 'Es handelt sich um einen {LABEL} zur Änderung der bereits bewilligten Therapieform.',
  FORTFUEHRUNG: 'Es handelt sich um eine {LABEL} der bereits begonnenen psychotherapeutischen Behandlung.',
  DEFAULT: 'Es handelt sich um einen {LABEL}.'
} as const;

// Constructs structured content for application type
export function constructApplicationContent(antragsId: string): FormTypes.ParagraphNode[] {
  // STEP 1: Get the German label for this application type
  const label = getAntragsLabel(antragsId);

  if (!label) {
    return [];
  }

  // STEP 2: Select appropriate template based on application type
  const template = selectTemplate(antragsId);

  // STEP 3: Insert label into template
  const text = template.replace('{LABEL}', label);

  return [{ type: 'paragraph', text, id: 'application-type' }];
}

// @deprecated Use constructApplicationContent for structured output
export function constructApplicationSentence(antragsId: string): string {
  // STEP 1: Get the German label for this application type
  const label = getAntragsLabel(antragsId);

  // STEP 2: Select appropriate template based on application type
  const template = selectTemplate(antragsId);

  // STEP 3: Insert label into template
  return template.replace('{LABEL}', label);
}

// Gets German label for application type ID
function getAntragsLabel(id: string): string {
  const option = FormConfig.FORM_OPTIONS.antragsart.find(opt => opt.id === id);
  return option?.label || '';
}

// Selects appropriate template based on application type
function selectTemplate(antragsId: string): string {
  switch (antragsId) {
    case APPLICATION_IDS.ERSTANTRAG:
      return TEMPLATES.ERSTANTRAG;

    case APPLICATION_IDS.UMWANDLUNG:
      return TEMPLATES.UMWANDLUNG;

    case APPLICATION_IDS.FORTFUEHRUNG:
      return TEMPLATES.FORTFUEHRUNG;

    default:
      // Fallback for unknown types
      return TEMPLATES.DEFAULT;
  }
}

// Provides test examples
export function getApplicationExamples(): {
  id: string;
  label: string;
  sentence: string;
}[] {
  return [
    // Initial application
    {
      id: APPLICATION_IDS.ERSTANTRAG,
      label: 'Erstantrag',
      sentence: 'Es handelt sich um einen Erstantrag für psychotherapeutische Behandlung.'
    },

    // Conversion request
    {
      id: APPLICATION_IDS.UMWANDLUNG,
      label: 'Umwandlungsantrag',
      sentence: 'Es handelt sich um einen Umwandlungsantrag zur Änderung der bereits bewilligten Therapieform.'
    },

    // Continuation
    {
      id: APPLICATION_IDS.FORTFUEHRUNG,
      label: 'Fortführung',
      sentence: 'Es handelt sich um eine Fortführung der bereits begonnenen psychotherapeutischen Behandlung.'
    }
  ];
}
