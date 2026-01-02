/**
 * Kapitel 1 Text Generator
 *
 * Generates natural, varied Kapitel 1 text by:
 * - Collecting clauses from all generators
 * - Combining them with intelligent pronoun usage
 * - Varying sentence structures
 * - Creating natural flow
 */

import { combineClauses, type Clause } from './sentence-combiner';
import type * as FormTypes from '../core/form-types';
import { constructAlterClause } from './sections/alter-generator';
import { constructBildungswegClauses } from './sections/bildungsweg-generator';
import { constructBerufClauses } from './sections/beruf-generator';
import { constructWohnsituationClauses } from './sections/wohnsituation-generator';
import { constructFinanzielleSituationClauses } from './sections/finanzielle-situation-generator';
import { constructKrankschreibungClauses } from './sections/krankschreibung-generator';

/**
 * Generates improved Kapitel 1 text with natural sentence flow
 *
 * @param formData - The form data
 * @returns Combined paragraph text
 */
export function generateImprovedKapitel1(formData: FormTypes.Form): string {
  const geschlechtId = formData.geschlecht;
  const clauses: Clause[] = [];

  // Priority 1: Age (always first)
  const alterClause = constructAlterClause(formData.alter);
  if (alterClause) {
    clauses.push(alterClause);
  }

  // Priority 2+: Education (can be multiple clauses)
  const bildungswegClauses = constructBildungswegClauses(formData.bildungsweg);
  clauses.push(...bildungswegClauses);

  // Priority 4+: Job + Family (can be multiple clauses)
  // Extract kinder data from discriminated union
  const kinderData = formData.kinder;
  const anzahlKinder = kinderData?.anzahl ?? null;
  const kinderDetails: FormTypes.KindDetails[] = (kinderData && kinderData.anzahl > 0 && 'details' in kinderData)
    ? [...kinderData.details]
    : [];
  const berufClauses = constructBerufClauses(
    formData.beruf,
    formData.familienstand,
    anzahlKinder,
    kinderDetails
  );
  clauses.push(...berufClauses);

  // Priority 5: Living situation
  const wohnsituationClauses = constructWohnsituationClauses(formData.wohnsituation);
  clauses.push(...wohnsituationClauses);

  // Priority 6: Financial situation
  const finanzielleSituationClauses = constructFinanzielleSituationClauses(formData.finanzielleSituation);
  clauses.push(...finanzielleSituationClauses);

  // Priority 7: Sick leave (last, often gets temporal marker)
  const krankschreibungClauses = constructKrankschreibungClauses(formData.krankschreibung);
  clauses.push(...krankschreibungClauses);

  // Combine clauses into natural sentences
  const sentences = combineClauses(clauses, geschlechtId);

  return sentences.join(' ');
}
