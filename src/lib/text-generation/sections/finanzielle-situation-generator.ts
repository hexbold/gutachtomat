import * as FormTypes from '@/lib/core/form-types';
import { Clause, createClause } from '../sentence-combiner';

// Sentence templates for financial situations
const TEMPLATES: Record<FormTypes.FinanzielleSituation, string> = {
  [FormTypes.FinanzielleSituation.Angespannt]: 'beschreibe die finanzielle Situation als angespannt',
  [FormTypes.FinanzielleSituation.Ausreichend]: 'beschreibe die finanzielle Situation als ausreichend',
  [FormTypes.FinanzielleSituation.Stabil]: 'beschreibe die finanzielle Situation als stabil',
};

// Constructs clause for financial situation
export function constructFinanzielleSituationClauses(
  finanzielleSituation: FormTypes.FinanzielleSituationField
): Clause[] {
  if (finanzielleSituation === null) {
    return [];
  }

  const text = TEMPLATES[finanzielleSituation];
  return [createClause(text, 'financial', 6)];
}

// Gets label for financial situation (for debugging)
export function getFinanzielleSituationLabel(
  finanzielleSituation: FormTypes.FinanzielleSituationField
): string {
  if (finanzielleSituation === null) {
    return '';
  }

  const labels: Record<FormTypes.FinanzielleSituation, string> = {
    [FormTypes.FinanzielleSituation.Angespannt]: 'Angespannt',
    [FormTypes.FinanzielleSituation.Ausreichend]: 'Ausreichend',
    [FormTypes.FinanzielleSituation.Stabil]: 'Stabil',
  };

  return labels[finanzielleSituation];
}

// Provides test examples
export function getFinanzielleSituationExamples(): { situation: FormTypes.FinanzielleSituationField; sentence: string }[] {
  return [
    {
      situation: FormTypes.FinanzielleSituation.Angespannt,
      sentence: TEMPLATES[FormTypes.FinanzielleSituation.Angespannt]
    },
    {
      situation: FormTypes.FinanzielleSituation.Ausreichend,
      sentence: TEMPLATES[FormTypes.FinanzielleSituation.Ausreichend]
    },
    {
      situation: FormTypes.FinanzielleSituation.Stabil,
      sentence: TEMPLATES[FormTypes.FinanzielleSituation.Stabil]
    },
    {
      situation: null,
      sentence: ''
    }
  ];
}
