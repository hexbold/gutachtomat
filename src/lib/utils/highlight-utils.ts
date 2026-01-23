/**
 * Change Detection and Highlighting Utilities
 *
 * This module provides utilities for detecting text changes and identifying
 * which sentences should be highlighted in the live preview.
 *
 * Used by the text generation system to provide visual feedback when
 * the user makes changes to the form.
 */

import * as Diff from 'diff';
import React from 'react';

/**
 * Highlight matching search text in yellow
 * Can be used in any modal component that has search functionality
 *
 * @param text The text to search within
 * @param searchQuery The current search query
 * @returns React nodes with matching text wrapped in yellow highlight
 */
export function highlightSearchText(text: string, searchQuery: string): React.ReactNode {
  if (!searchQuery.trim()) return text;
  const query = searchQuery.trim();
  // Escape special regex characters in the query
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);
  if (parts.length === 1) return text; // No match found
  // Wrap in span to prevent flex gap issues when parent has gap styling
  return React.createElement(
    'span',
    null,
    ...parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? React.createElement('mark', { key: i, className: 'bg-yellow-200' }, part)
        : part
    )
  );
}

/**
 * Helper function to check if a position in text is a real sentence boundary
 * A real sentence boundary is: period/exclamation/question mark + space + capital letter
 * This avoids treating abbreviations like "m0J." or "Dr." as sentence ends
 */
function isSentenceBoundary(text: string, position: number): boolean {
  // Check if current position is a sentence-ending punctuation
  const currentChar = text[position];
  if (currentChar !== '.' && currentChar !== '!' && currentChar !== '?') {
    return false;
  }

  // Check if followed by space
  if (position + 1 >= text.length || text[position + 1] !== ' ') {
    return false;
  }

  // Check if followed by capital letter (or newline)
  if (position + 2 >= text.length) {
    return true; // End of text is a boundary
  }

  const charAfterSpace = text[position + 2];
  return /[A-ZÄÖÜ]/.test(charAfterSpace) || charAfterSpace === '\n';
}

/**
 * Expand a position in text to the surrounding sentence boundaries
 * Skips over section headers (all caps) and whitespace to find actual sentences
 * Stops at newlines - works with both regular (\n) and markdown line breaks (  \n)
 * since trim() removes trailing spaces after extraction
 */
function expandToSentenceBoundaries(text: string, position: number): { start: number; end: number } {
  let start = position;
  let end = position;

  // Skip initial whitespace/newlines to find the actual content
  while (start < text.length && /[\s\n]/.test(text[start])) {
    start++;
    end++;
  }

  // Expand backward to sentence start
  while (start > 0) {
    const char = text[start - 1];

    // Stop at newlines
    if (char === '\n') {
      break;
    }

    if (start >= 2 && isSentenceBoundary(text, start - 2)) {
      start--; // Move past the space after the period
      break;
    }

    start--;
  }

  // Expand forward to sentence end
  while (end < text.length) {
    const char = text[end];

    // Stop at newlines
    if (char === '\n') {
      break;
    }

    if (isSentenceBoundary(text, end)) {
      end++; // Include the period
      break;
    }

    end++;
  }

  // If we got a header line (markdown headers), skip to actual content
  const extracted = text.substring(start, end).trim();
  const isHeader = (line: string) => {
    const trimmed = line.trim();
    // Detect markdown headers (##, ###, ####)
    return /^#{2,4}\s+/.test(trimmed);
  };

  if (isHeader(extracted)) {
    // This is a header, skip ALL consecutive headers to find the actual sentence
    let nextStart = end;

    // Keep skipping headers and whitespace until we find real content
    while (nextStart < text.length) {
      // Skip newlines/whitespace
      while (nextStart < text.length && /[\s\n]/.test(text[nextStart])) {
        nextStart++;
      }

      if (nextStart >= text.length) break;

      // Find the end of the current line
      let lineEnd = nextStart;
      while (lineEnd < text.length && text[lineEnd] !== '\n') {
        lineEnd++;
      }

      const currentLine = text.substring(nextStart, lineEnd).trim();

      // Check if this line is also a header
      if (isHeader(currentLine)) {
        // Skip this header and continue
        nextStart = lineEnd;
        continue;
      }

      // Found a non-header line! Find its sentence boundary
      let nextEnd = nextStart;
      while (nextEnd < text.length) {
        const char = text[nextEnd];

        // Stop at newlines
        if (char === '\n') {
          break;
        }

        if (isSentenceBoundary(text, nextEnd)) {
          nextEnd++; // Include the period
          break;
        }

        nextEnd++;
      }

      // Use this sentence if it's valid
      const nextExtracted = text.substring(nextStart, nextEnd).trim();
      if (nextExtracted.length >= 3) {
        start = nextStart;
        end = nextEnd;
      }
      break;
    }
  }

  return { start, end };
}

/**
 * Find ALL newly added or changed text by comparing old and new text
 *
 * Uses the 'diff' library for robust change detection, then expands to sentence boundaries
 * to provide context for the highlighted changes.
 *
 * @param oldText The previous text content
 * @param newText The new text content
 * @returns An array of all changed sentences (empty array if no changes)
 */
export function findNewSentences(oldText: string, newText: string): string[] {
  const placeholderText = 'Beginnen Sie mit dem Ausfüllen des Formulars, um eine Vorschau zu sehen...';

  if (!oldText || oldText === placeholderText) {
    return []; // Don't highlight on initial load
  }

  if (oldText === newText) {
    return []; // No change
  }

  // Use diff library to find ALL changes
  const changes = Diff.diffChars(oldText, newText);

  // Find ALL added OR modified parts
  const changedPositions: Array<{ position: number; length: number }> = [];
  let position = 0;
  let hasRemoval = false;

  for (let i = 0; i < changes.length; i++) {
    const change = changes[i];

    if (change.added) {
      // Found added text - record it
      changedPositions.push({
        position: position,
        length: change.value.length
      });
      position += change.value.length;
      hasRemoval = false; // Reset removal flag
    } else if (change.removed) {
      // Text was removed - mark this position as changed
      // The position where the removal happened should be highlighted
      hasRemoval = true;
      // Don't advance position in newText (removed content doesn't exist there)
    } else {
      // Unchanged text - advance position
      // If there was a removal before this unchanged part, highlight this position
      // (to show what comes after the removal)
      if (hasRemoval) {
        changedPositions.push({
          position: position,
          length: Math.min(change.value.length, 50) // Capture a bit of the unchanged part after removal
        });
        hasRemoval = false;
      }
      position += change.value.length;
    }
  }

  // If no changes found, nothing to highlight
  if (changedPositions.length === 0) {
    return [];
  }

  // Expand each change to sentence boundaries and collect all highlights
  const highlightedSentences: string[] = [];
  const seenSentences = new Set<string>(); // Avoid duplicates

  for (const change of changedPositions) {
    // Expand to sentence boundaries
    const { start, end } = expandToSentenceBoundaries(newText, change.position);
    const highlighted = newText.substring(start, end).trim();

    // Filter out headers, very short changes, and duplicates
    // Allow long sentences (up to 2000 chars) for symptom lists
    if (
      highlighted.length >= 3 &&
      highlighted.length <= 2000 &&
      highlighted !== highlighted.toUpperCase() &&
      !seenSentences.has(highlighted)
    ) {
      highlightedSentences.push(highlighted);
      seenSentences.add(highlighted);
    }
  }

  return highlightedSentences;
}
