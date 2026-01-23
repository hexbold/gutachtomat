// Smart sentence combiner for Kapitel 1 with varied structures and conjunctions

import { getPronounsForGender } from './pronoun-utils';

// ---
// Types
// ---

// A clause is a sentence fragment that can be combined with others
export interface Clause {
  /** The text content (without subject, starts with verb) */
  text: string;
  /** Category for smart combining */
  category: 'age' | 'education' | 'job' | 'family' | 'living' | 'financial' | 'sickleave' | 'other';
  /** Priority for sentence ordering (lower = earlier) */
  priority: number;
}

// German sentence starters for variety in formal reports
const VARIETY_STARTERS = [
  'Zudem',           // additionally/moreover
  'Des Weiteren',    // furthermore
  'Darüber hinaus',  // beyond that/in addition
] as const;

// Gets next variety starter different from last one
function getNextVarietyStarter(lastStarter: string | null, currentIndex: number): string {
  // If last starter wasn't a variety starter, just use the current index
  const isVarietyStarter = lastStarter && (VARIETY_STARTERS as readonly string[]).includes(lastStarter);
  if (!isVarietyStarter) {
    return VARIETY_STARTERS[currentIndex % VARIETY_STARTERS.length];
  }

  // Find a starter that's different from the last one
  let starter = VARIETY_STARTERS[currentIndex % VARIETY_STARTERS.length];
  let attempts = 0;

  while (starter === lastStarter && attempts < VARIETY_STARTERS.length) {
    currentIndex = (currentIndex + 1) % VARIETY_STARTERS.length;
    starter = VARIETY_STARTERS[currentIndex];
    attempts++;
  }

  return starter;
}

// Combines clauses into natural, varied sentences
export function combineClauses(
  clauses: Clause[],
  geschlechtId: string | null
): string[] {
  if (clauses.length === 0) return [];

  // Sort by priority
  const sorted = [...clauses].sort((a, b) => a.priority - b.priority);

  // Get pronouns
  const p = getPronounsForGender(geschlechtId);

  const sentences: string[] = [];
  let usedPronounCount = 0;
  let lastSentenceStarter: string | null = null;
  let varietyStarterIndex = 0;

  // Group clauses that should be combined
  const groups = groupRelatedClauses(sorted);

  groups.forEach((group, groupIndex) => {
    let sentence = '';

    // Decide on subject/pronoun usage
    if (groupIndex === 0) {
      // First sentence: always use full subject
      sentence = `${p.derDie} ${group[0].text}`;
      usedPronounCount = 0;
      lastSentenceStarter = p.derDie;
    } else if (shouldUseTemporal(group)) {
      // Special case: sick leave gets temporal marker + subject
      // Remove leading "sei aktuell" from clause since we're adding "Aktuell sei..."
      const clauseText = group[0].text.replace(/^sei\s+aktuell\s+/, '');
      sentence = `Aktuell ${p.seiDerDie} ${clauseText}`;
      usedPronounCount = 0;
      lastSentenceStarter = 'Aktuell';
    } else if (usedPronounCount >= 2 && groupIndex > 0) {
      // After 2 pronouns, alternate between variety starters and full subject
      // This creates a natural pattern: pronoun -> pronoun -> variety starter -> full subject -> pronoun...

      const isLastStarterVariety = lastSentenceStarter && (VARIETY_STARTERS as readonly string[]).includes(lastSentenceStarter);
      if (isLastStarterVariety) {
        // Last sentence used a variety starter, so use full subject this time
        // (Next sentence will use pronoun since usedPronounCount resets to 0)
        sentence = `${p.derDie} ${group[0].text}`;
        usedPronounCount = 0;
        lastSentenceStarter = p.derDie;
      } else {
        // Use variety starter for variety
        // Get next variety starter that's different from last starter
        const varietyStarter = getNextVarietyStarter(lastSentenceStarter, varietyStarterIndex);
        varietyStarterIndex = (varietyStarterIndex + 1) % VARIETY_STARTERS.length;

        // German V2 word order: starter + verb + pronoun + rest
        // Our clauses start with verb, so we insert pronoun after first word
        const clauseText = group[0].text;
        const firstSpaceIndex = clauseText.indexOf(' ');
        if (firstSpaceIndex > 0) {
          const verb = clauseText.substring(0, firstSpaceIndex);
          const rest = clauseText.substring(firstSpaceIndex);
          sentence = `${varietyStarter} ${verb} ${p.er.toLowerCase()}${rest}`;
        } else {
          // Single-word clause (rare), just add pronoun
          sentence = `${varietyStarter} ${clauseText} ${p.er.toLowerCase()}`;
        }
        usedPronounCount++;
        lastSentenceStarter = varietyStarter;
      }
    } else if (usedPronounCount >= 4) {
      // After 4 pronouns, reintroduce subject for clarity (unless it would duplicate)
      if (lastSentenceStarter === p.derDie) {
        // Last sentence already used full subject, use pronoun instead
        sentence = `${p.er} ${group[0].text}`;
        usedPronounCount++;
        lastSentenceStarter = p.er;
      } else {
        sentence = `${p.derDie} ${group[0].text}`;
        usedPronounCount = 0;
        lastSentenceStarter = p.derDie;
      }
    } else {
      // Use pronoun for flow, but avoid consecutive identical starters
      if (lastSentenceStarter === p.er) {
        // Last sentence also started with pronoun, use variety starter instead
        const varietyStarter = getNextVarietyStarter(lastSentenceStarter, varietyStarterIndex);
        varietyStarterIndex = (varietyStarterIndex + 1) % VARIETY_STARTERS.length;

        const clauseText = group[0].text;
        const firstSpaceIndex = clauseText.indexOf(' ');
        if (firstSpaceIndex > 0) {
          const verb = clauseText.substring(0, firstSpaceIndex);
          const rest = clauseText.substring(firstSpaceIndex);
          sentence = `${varietyStarter} ${verb} ${p.er.toLowerCase()}${rest}`;
        } else {
          sentence = `${varietyStarter} ${clauseText} ${p.er.toLowerCase()}`;
        }
        usedPronounCount++;
        lastSentenceStarter = varietyStarter;
      } else {
        // Safe to use pronoun
        sentence = `${p.er} ${group[0].text}`;
        usedPronounCount++;
        lastSentenceStarter = p.er;
      }
    }

    // Add additional clauses from the same group with conjunctions
    for (let i = 1; i < group.length; i++) {
      const clause = group[i];

      // Use comma for all but last, "und" for last clause
      const isLastClause = i === group.length - 1;

      if (isLastClause && group.length > 2) {
        // Multiple clauses: use ", X, Y und Z"
        sentence += ` und ${clause.text}`;
      } else if (isLastClause && group.length === 2) {
        // Two clauses: use "X und Y"
        sentence += ` und ${clause.text}`;
      } else {
        // Middle clauses: use comma
        sentence += `, ${clause.text}`;
      }
    }

    sentence += '.';
    sentences.push(sentence);
  });

  return sentences;
}

// ---
// Helper functions
// ---

// Groups related clauses into single sentences
function groupRelatedClauses(clauses: Clause[]): Clause[][] {
  const groups: Clause[][] = [];
  let currentGroup: Clause[] = [];

  clauses.forEach((clause) => {
    if (currentGroup.length === 0) {
      // Start new group
      currentGroup.push(clause);
    } else {
      const lastClause = currentGroup[currentGroup.length - 1];

      // Combine if related or if current group is still short
      if (shouldCombine(lastClause, clause, currentGroup.length)) {
        currentGroup.push(clause);
      } else {
        // Finish current group and start new one
        groups.push(currentGroup);
        currentGroup = [clause];
      }
    }
  });

  // Add last group
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

// Determines if two clauses should be combined
function shouldCombine(
  clause1: Clause,
  clause2: Clause,
  currentGroupLength: number
): boolean {
  // Never combine more than 2 clauses (gets too long)
  if (currentGroupLength >= 2) return false;

  // Always keep age separate (important introductory info)
  if (clause1.category === 'age') return false;

  // Sick leave gets its own sentence with temporal marker
  if (clause2.category === 'sickleave') return false;

  // ALWAYS combine clauses of the same category (e.g., multiple education items)
  if (clause1.category === clause2.category) {
    return true;
  }

  // Combine related but different categories
  const relatedPairs: [string, string][] = [
    ['education', 'job'],          // "studierte X und arbeite als Y"
    ['living', 'financial'],       // "wohne X, verdiene Y und sei Z"
    ['job', 'family'],             // "sei X von Beruf, sei verheiratet..."
  ];

  return relatedPairs.some(
    ([cat1, cat2]) =>
      (clause1.category === cat1 && clause2.category === cat2) ||
      (clause1.category === cat2 && clause2.category === cat1)
  );
}

// Checks if group should use temporal marker
function shouldUseTemporal(group: Clause[]): boolean {
  return group.some(clause => clause.category === 'sickleave');
}

// ---
// Clause builders
// ---

// Creates clause object with proper formatting
export function createClause(
  text: string,
  category: Clause['category'],
  priority: number
): Clause {
  return {
    text: text.trim(),
    category,
    priority
  };
}

// Combines text fragments with "und": ['A', 'B', 'C'] => "A, B und C"
export function combineWithUnd(fragments: string[]): string {
  if (fragments.length === 0) return '';
  if (fragments.length === 1) return fragments[0];
  if (fragments.length === 2) return fragments.join(' und ');

  // 3 or more: "X, Y und Z"
  return fragments.slice(0, -1).join(', ') + ' und ' + fragments[fragments.length - 1];
}
