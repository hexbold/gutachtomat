import * as FormLabels from '@/lib/core/form-labels';
import * as FormTypes from '../../core/form-types';
import { Clause, createClause } from '../sentence-combiner';

// Number words

const NUMBER_WORDS: Record<number, string> = {
  0: 'keine',
  1: 'ein',
  2: 'zwei',
  3: 'drei'
  // For 4+, we use the number itself
} as const;

// Constructs clauses for family status and children
export function constructFamilyStatusClauses(
  familienstand: FormTypes.FamilienstandField,
  anzahlKinder: number | null,
  kinder: FormTypes.KindDetails[]
): Clause[] {
  const clauses: Clause[] = [];

  // STEP 1: Add family status clause if set
  if (familienstand) {
    const label = FormLabels.FAMILIENSTAND_LABELS[familienstand];
    clauses.push(createClause(`sei ${label.toLowerCase()}`, 'family', 4));
  }

  // STEP 2: Add children information as separate clause
  // Only output when anzahlKinder is explicitly set (not null)
  // null = "Anzahl auswählen" (no selection) -> no output
  // 0 = explicitly selected "0" -> output "habe keine Kinder"
  if (anzahlKinder !== null) {
    const childrenPart = buildChildrenPart(anzahlKinder, kinder);
    clauses.push(createClause(childrenPart, 'family', 4.1));
  }

  return clauses;
}

// Builds children part as standalone clause
function buildChildrenPart(anzahlKinder: number, kinder: FormTypes.KindDetails[]): string {
  // Case 1: No children
  if (anzahlKinder === 0) {
    return 'habe keine Kinder';
  }

  // Case 2: One child
  if (anzahlKinder === 1) {
    return buildSingleChildText(kinder);
  }

  // Case 3: Multiple children
  return buildMultipleChildrenText(anzahlKinder, kinder);
}

// Builds text for single child
function buildSingleChildText(kinder: FormTypes.KindDetails[]): string {
  // Check if child has ANY data (partial or complete)
  if (kinder.length > 0) {
    const child = kinder[0];
    const details = formatChildDetails(child);
    if (details) {
      return `habe ein Kind (${details})`;
    }
  }

  return 'habe ein Kind';
}

// Builds text for multiple children
function buildMultipleChildrenText(anzahlKinder: number, kinder: FormTypes.KindDetails[]): string {
  const numberWord = getNumberWord(anzahlKinder);

  // Format all children that have ANY data
  const detailsList = kinder
    .map(formatChildDetails)
    .filter(details => details !== ''); // Remove empty entries

  if (detailsList.length > 0) {
    return `habe ${numberWord} Kinder (${detailsList.join(', ')})`;
  }

  return `habe ${numberWord} Kinder`;
}

// Formats child details: "m12J." or "12J." or "m" or ""
function formatChildDetails(child: FormTypes.KindDetails): string {
  const hasGeschlecht = child.geschlecht !== null;
  const hasAlter = child.alter !== null;

  if (hasGeschlecht && hasAlter) {
    return `${child.geschlecht}${child.alter}J.`;
  }
  if (hasAlter) {
    return `${child.alter}J.`;
  }
  if (hasGeschlecht) {
    return `${child.geschlecht}`;
  }
  return '';
}

// Gets German word for number (zwei, drei) or returns number
function getNumberWord(count: number): string {
  return NUMBER_WORDS[count] || count.toString();
}

// Provides test examples
export function getFamilyStatusExamples(): {
  familienstand: FormTypes.Familienstand;
  anzahlKinder: number;
  kinder: FormTypes.KindDetails[];
  sentence: string;
}[] {
  return [
    {
      familienstand: FormTypes.Familienstand.Verheiratet,
      anzahlKinder: 0,
      kinder: [],
      sentence: 'ist verheiratet und hat keine Kinder'
    },
    {
      familienstand: FormTypes.Familienstand.Ledig,
      anzahlKinder: 1,
      kinder: [{ alter: 15, geschlecht: FormTypes.Geschlecht.W }],
      sentence: 'ist ledig und hat ein Kind (w15J.)'
    },
    {
      familienstand: FormTypes.Familienstand.Getrennt,
      anzahlKinder: 2,
      kinder: [
        { alter: 12, geschlecht: FormTypes.Geschlecht.M },
        { alter: 15, geschlecht: FormTypes.Geschlecht.W }
      ],
      sentence: 'ist getrennt und hat zwei Kinder (m12J., w15J.)'
    },
    {
      familienstand: FormTypes.Familienstand.Geschieden,
      anzahlKinder: 3,
      kinder: [
        { alter: 8, geschlecht: FormTypes.Geschlecht.M },
        { alter: 12, geschlecht: FormTypes.Geschlecht.W },
        { alter: 16, geschlecht: FormTypes.Geschlecht.D }
      ],
      sentence: 'ist geschieden und hat drei Kinder (m8J., w12J., d16J.)'
    }
  ];
}