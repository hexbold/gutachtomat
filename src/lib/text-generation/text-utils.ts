/**
 * Shared text utilities for text generation
 */

/**
 * Ensures text ends with proper punctuation (., !, or ?)
 */
export function ensurePunctuation(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  if (/[.!?]$/.test(trimmed)) return trimmed;
  return trimmed + '.';
}
