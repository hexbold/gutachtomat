/**
 * Testdiagnostik Test Data Generator
 *
 * Generates random data for psychological test procedures
 */

import * as FormTypes from '../core/form-types';
import { getAllTestVerfahren, TestVerfahren } from '../data/test-verfahren';

export interface TestdiagnostikData {
  testdiagnostik: FormTypes.TestdiagnostikData;
}

/**
 * Helper: Randomly selects N items from an array
 */
function selectRandomItems<T>(array: T[], min: number, max: number): T[] {
  const numItems = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numItems);
}

/**
 * Helper: Generates a random date within the last N days
 */
function generateRandomDate(daysAgo: number): string {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - Math.floor(Math.random() * daysAgo));
  return pastDate.toISOString().split('T')[0]; // YYYY-MM-DD format
}

/**
 * Helper: Generates a random score in a given range
 */
function generateRandomScore(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Sample notes for test results
 */
const sampleNotes = [
  'Erhöhte Werte im Vergleich zur Normstichprobe.',
  'Unauffälliges Ergebnis.',
  'Leicht erhöhte Werte.',
  'Deutlich erhöhte Werte.',
  'Im klinisch auffälligen Bereich.',
  'Ergebnisse sind mit Vorbefunden konsistent.',
  'Hinweise auf Symptombelastung.',
  '',
  '',
  '', // Empty more often to simulate occasional notes
];

/**
 * Main function: Generates Testdiagnostik data
 */
export function generateTestdiagnostik(): TestdiagnostikData {
  const allTests = getAllTestVerfahren();
  const selectedTests = selectRandomItems(allTests, 0, 3);

  const tests: FormTypes.SelectedTestVerfahren[] = selectedTests.map((test: TestVerfahren) => {
    const hasDate = Math.random() > 0.2; // 80% chance of having a date
    const hasScore = Math.random() > 0.3; // 70% chance of having a score
    const note = sampleNotes[Math.floor(Math.random() * sampleNotes.length)];

    return {
      abbreviation: test.abbreviation,
      name: test.name,
      durchfuehrungsdatum: hasDate ? generateRandomDate(30) : null,
      score: hasScore ? generateRandomScore(10, 40) : null,
      notizen: note || null,
    };
  });

  return {
    testdiagnostik: {
      selectedTests: tests,
    },
  };
}
