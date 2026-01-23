import * as FormTypes from '@/lib/core/form-types';
import { Clause, createClause } from '../sentence-combiner';

// Sentence templates

const TEMPLATES = {
  LIVES_ALONE: 'lebe allein',
  LIVES_WITH: 'lebe mit',
  LIVES_AT: 'lebe',
  TOGETHER: 'zusammen',
  AT_PARENTS: 'bei den Eltern',
  IN_WG: 'in einer Wohngemeinschaft',
  UNSPECIFIED: 'Wohnsituation nicht spezifiziert'
} as const;

const PEOPLE_LABELS = {
  PARTNER: 'Partner*in',
  CHILDREN: 'Kindern'
} as const;

// Constructs clause for living situation
export function constructWohnsituationClauses(wohnsituation: FormTypes.WohnsituationField): Clause[] {
  // STEP 1: Handle null (not specified)
  if (wohnsituation === null) {
    return [];
  }

  // STEP 2: Handle "lives alone"
  if (wohnsituation.lebtAllein) {
    return [createClause(TEMPLATES.LIVES_ALONE, 'living', 5)];
  }

  // STEP 3: Extract selection flags from product type
  const flags = {
    hasPartner: wohnsituation.mitPartner,
    hasKinder: wohnsituation.mitKindern,
    hasEltern: wohnsituation.beiEltern,
    hasWG: wohnsituation.inWG
  };

  // STEP 4: Build sentence components
  const people = buildPeopleList(flags);
  const context = buildContext(flags);

  // STEP 5: Combine into clause text
  const text = combineSentenceParts(people, context);

  return [createClause(text, 'living', 5)];
}

// ---
// Helper functions
// ---

interface SelectionFlags {
  hasPartner: boolean;
  hasKinder: boolean;
  hasEltern: boolean;
  hasWG: boolean;
}

// Builds list of people patient lives with
function buildPeopleList(flags: SelectionFlags): string[] {
  const people: string[] = [];
  if (flags.hasPartner) people.push(PEOPLE_LABELS.PARTNER);
  if (flags.hasKinder) people.push(PEOPLE_LABELS.CHILDREN);
  return people;
}

// Determines living context (parents, WG, or both)
function buildContext(flags: SelectionFlags): string {
  const contexts: string[] = [];
  if (flags.hasEltern) contexts.push(TEMPLATES.AT_PARENTS);
  if (flags.hasWG) contexts.push(TEMPLATES.IN_WG);

  // Combine contexts: "bei den Eltern in einer Wohngemeinschaft"
  return contexts.join(' ');
}

// Combines people and context into natural sentence
function combineSentenceParts(people: string[], context: string): string {
  const hasPeople = people.length > 0;
  const hasContext = context.length > 0;

  // Case 1: People + Context (e.g., "lebe mit Partner*in bei den Eltern")
  if (hasPeople && hasContext) {
    const peopleText = formatPeopleList(people);
    return `${TEMPLATES.LIVES_WITH} ${peopleText} ${context}`;
  }

  // Case 2: Only People (e.g., "lebe mit Partner*in zusammen")
  if (hasPeople) {
    const peopleText = formatPeopleList(people);
    return `${TEMPLATES.LIVES_WITH} ${peopleText} ${TEMPLATES.TOGETHER}`;
  }

  // Case 3: Only Context (e.g., "lebe bei den Eltern")
  if (hasContext) {
    return `${TEMPLATES.LIVES_AT} ${context}`;
  }

  // Case 4: Fallback (shouldn't happen with valid type)
  return TEMPLATES.UNSPECIFIED;
}

// Formats list into natural German: ['A', 'B'] => "A und B"
function formatPeopleList(people: string[]): string {
  if (people.length === 1) {
    return people[0];
  }

  // Join all but last with comma, then add "und" before last
  const allButLast = people.slice(0, -1).join(', ');
  const last = people[people.length - 1];
  return `${allButLast} und ${last}`;
}

// Provides test examples
export function getWohnsituationExamples(): { wohnsituation: FormTypes.WohnsituationField, sentence: string }[] {
  return [
    // Null (not specified)
    { wohnsituation: null, sentence: '' },

    // Lives alone
    { wohnsituation: { lebtAllein: true }, sentence: 'lebe allein' },

    // Single selections (with others)
    { wohnsituation: { lebtAllein: false, mitPartner: true, mitKindern: false, beiEltern: false, inWG: false }, sentence: 'lebe mit Partner*in zusammen' },
    { wohnsituation: { lebtAllein: false, mitPartner: false, mitKindern: true, beiEltern: false, inWG: false }, sentence: 'lebe mit Kindern zusammen' },
    { wohnsituation: { lebtAllein: false, mitPartner: false, mitKindern: false, beiEltern: true, inWG: false }, sentence: 'lebe bei den Eltern' },
    { wohnsituation: { lebtAllein: false, mitPartner: false, mitKindern: false, beiEltern: false, inWG: true }, sentence: 'lebe in einer Wohngemeinschaft' },

    // Two people
    { wohnsituation: { lebtAllein: false, mitPartner: true, mitKindern: true, beiEltern: false, inWG: false }, sentence: 'lebe mit Partner*in und Kindern zusammen' },

    // People + Context
    { wohnsituation: { lebtAllein: false, mitPartner: true, mitKindern: false, beiEltern: false, inWG: true }, sentence: 'lebe mit Partner*in in einer Wohngemeinschaft' },
    { wohnsituation: { lebtAllein: false, mitPartner: true, mitKindern: false, beiEltern: true, inWG: false }, sentence: 'lebe mit Partner*in bei den Eltern' },

    // Complex combinations
    { wohnsituation: { lebtAllein: false, mitPartner: true, mitKindern: true, beiEltern: false, inWG: true }, sentence: 'lebe mit Partner*in und Kindern in einer Wohngemeinschaft' },
    { wohnsituation: { lebtAllein: false, mitPartner: true, mitKindern: true, beiEltern: true, inWG: false }, sentence: 'lebe mit Partner*in und Kindern bei den Eltern' },

    // Both contexts (bei Eltern + WG)
    { wohnsituation: { lebtAllein: false, mitPartner: false, mitKindern: false, beiEltern: true, inWG: true }, sentence: 'lebe bei den Eltern in einer Wohngemeinschaft' },
    { wohnsituation: { lebtAllein: false, mitPartner: true, mitKindern: false, beiEltern: true, inWG: true }, sentence: 'lebe mit Partner*in bei den Eltern in einer Wohngemeinschaft' },
  ];
}
