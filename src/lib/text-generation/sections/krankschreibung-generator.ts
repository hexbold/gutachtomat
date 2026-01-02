import * as FormTypes from '@/lib/core/form-types';
import { Clause, createClause } from '../sentence-combiner';

// Sentence templates

const TEMPLATES = {
  [FormTypes.KrankschreibungDurch.Hausarzt]: 'sei aktuell durch den behandelnden Hausarzt krankgeschrieben',
  [FormTypes.KrankschreibungDurch.Psychiater]: 'sei aktuell durch den behandelnden Psychiater krankgeschrieben',
  ANDERE: (andereText: string) => `sei aktuell durch ${andereText} krankgeschrieben`,
  NO_DETAILS: 'sei aktuell krankgeschrieben'
} as const;

// Constructs clause for sick leave status
export function constructKrankschreibungClauses(
  krankschreibung: FormTypes.Krankschreibung
): Clause[] {
  // STEP 1: If not on sick leave, return empty
  if (!krankschreibung.krankgeschrieben) {
    return [];
  }

  // STEP 2: Determine the clause text based on details
  const details = krankschreibung.details;
  let text = '';

  if (details === null) {
    // On sick leave but no details about who issued it
    text = TEMPLATES.NO_DETAILS;
  } else {
    switch (details.durch) {
      case FormTypes.KrankschreibungDurch.Hausarzt:
        text = TEMPLATES[FormTypes.KrankschreibungDurch.Hausarzt];
        break;
      case FormTypes.KrankschreibungDurch.Psychiater:
        text = TEMPLATES[FormTypes.KrankschreibungDurch.Psychiater];
        break;
      case FormTypes.KrankschreibungDurch.Andere:
        if (details.durchAndere.trim()) {
          text = TEMPLATES.ANDERE(details.durchAndere.trim());
        } else {
          // Fallback if "andere" selected but no text provided
          text = TEMPLATES.NO_DETAILS;
        }
        break;
    }
  }

  return [createClause(text, 'sickleave', 7)];
}

// Provides test examples
export function getKrankschreibungExamples(): {
  krankschreibung: FormTypes.Krankschreibung;
  sentence: string;
}[] {
  return [
    {
      krankschreibung: { krankgeschrieben: false },
      sentence: ''
    },
    {
      krankschreibung: { krankgeschrieben: true, details: null },
      sentence: TEMPLATES.NO_DETAILS
    },
    {
      krankschreibung: {
        krankgeschrieben: true,
        details: { durch: FormTypes.KrankschreibungDurch.Hausarzt }
      },
      sentence: TEMPLATES[FormTypes.KrankschreibungDurch.Hausarzt]
    },
    {
      krankschreibung: {
        krankgeschrieben: true,
        details: { durch: FormTypes.KrankschreibungDurch.Psychiater }
      },
      sentence: TEMPLATES[FormTypes.KrankschreibungDurch.Psychiater]
    },
    {
      krankschreibung: {
        krankgeschrieben: true,
        details: {
          durch: FormTypes.KrankschreibungDurch.Andere,
          durchAndere: 'den behandelnden Neurologen'
        }
      },
      sentence: 'sei aktuell durch den behandelnden Neurologen krankgeschrieben'
    }
  ];
}
