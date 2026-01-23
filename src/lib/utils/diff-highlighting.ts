/**
 * Secure Diff Highlighting for AI Text Comparison
 *
 * Uses a custom marker approach that is secure by design:
 * 1. Strip markdown from both texts to get plain text
 * 2. Diff plain text to find added words
 * 3. Map positions back to AI markdown
 * 4. Insert markers (not HTML) at diff positions
 * 5. Render markdown with react-markdown (escapes all HTML)
 * 6. Replace markers with <mark> tags after rendering
 *
 * Security: HTML in AI output is always escaped before markers
 * are replaced, making XSS injection impossible by design.
 */

import * as Diff from 'diff';

// Highlight markers - Unicode characters unlikely in German medical text
export const HIGHLIGHT_START = '\u{E000}HL\u{E001}'; // Private Use Area characters
export const HIGHLIGHT_END = '\u{E000}/HL\u{E001}';

// Underline markers - for secure underline rendering without rehype-raw
export const UNDERLINE_START = '\u{E000}UL\u{E001}';
export const UNDERLINE_END = '\u{E000}/UL\u{E001}';

/**
 * Position mapping from plain text to markdown
 */
interface PositionMapping {
  plainIndex: number;
  mdIndex: number;
}

/**
 * Result of stripping markdown
 */
interface StripResult {
  text: string;
  mappings: PositionMapping[];
}

/**
 * Range in the markdown that should be highlighted
 */
interface HighlightRange {
  start: number;
  end: number;
}

/**
 * Strip markdown syntax and build position mapping.
 * Maps each character position in plain text to its position in markdown.
 */
export function stripMarkdownWithMapping(markdown: string): StripResult {
  const mappings: PositionMapping[] = [];
  let plainText = '';
  let mdIndex = 0;
  let plainIndex = 0;

  while (mdIndex < markdown.length) {
    const remaining = markdown.slice(mdIndex);

    // Bold: **text** or __text__
    const boldMatch = remaining.match(/^(\*\*|__)(.+?)\1/);
    if (boldMatch) {
      const innerText = boldMatch[2];
      for (let i = 0; i < innerText.length; i++) {
        mappings.push({ plainIndex: plainIndex + i, mdIndex: mdIndex + boldMatch[1].length + i });
      }
      plainText += innerText;
      plainIndex += innerText.length;
      mdIndex += boldMatch[0].length;
      continue;
    }

    // Italic: *text* or _text_ (but not ** or __)
    const italicMatch = remaining.match(/^(\*|_)(?!\1)(.+?)\1(?!\1)/);
    if (italicMatch) {
      const innerText = italicMatch[2];
      for (let i = 0; i < innerText.length; i++) {
        mappings.push({ plainIndex: plainIndex + i, mdIndex: mdIndex + italicMatch[1].length + i });
      }
      plainText += innerText;
      plainIndex += innerText.length;
      mdIndex += italicMatch[0].length;
      continue;
    }

    // Underline: <u>text</u>
    const underlineMatch = remaining.match(/^<u>(.+?)<\/u>/);
    if (underlineMatch) {
      const innerText = underlineMatch[1];
      for (let i = 0; i < innerText.length; i++) {
        mappings.push({ plainIndex: plainIndex + i, mdIndex: mdIndex + 3 + i }); // +3 for "<u>"
      }
      plainText += innerText;
      plainIndex += innerText.length;
      mdIndex += underlineMatch[0].length;
      continue;
    }

    // Headers: ## text, ### text, #### text
    const headerMatch = remaining.match(/^(#{1,6})\s+/);
    if (headerMatch && (mdIndex === 0 || markdown[mdIndex - 1] === '\n')) {
      // Skip the header markers but keep newline context
      mdIndex += headerMatch[0].length;
      continue;
    }

    // Links: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]*)\]\([^)]*\)/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      for (let i = 0; i < linkText.length; i++) {
        mappings.push({ plainIndex: plainIndex + i, mdIndex: mdIndex + 1 + i }); // +1 for [
      }
      plainText += linkText;
      plainIndex += linkText.length;
      mdIndex += linkMatch[0].length;
      continue;
    }

    // List markers: - item, * item, 1. item
    const listMatch = remaining.match(/^(\s*)([*\-]|\d+\.)\s+/);
    if (listMatch && (mdIndex === 0 || markdown[mdIndex - 1] === '\n')) {
      // Keep leading whitespace in plain text for structure
      if (listMatch[1]) {
        for (let i = 0; i < listMatch[1].length; i++) {
          mappings.push({ plainIndex: plainIndex + i, mdIndex: mdIndex + i });
        }
        plainText += listMatch[1];
        plainIndex += listMatch[1].length;
      }
      mdIndex += listMatch[0].length;
      continue;
    }

    // Regular character - direct mapping
    mappings.push({ plainIndex, mdIndex });
    plainText += markdown[mdIndex];
    plainIndex++;
    mdIndex++;
  }

  return { text: plainText, mappings };
}

/**
 * Find the markdown index for a given plain text index.
 */
function plainToMdIndex(mappings: PositionMapping[], plainIdx: number): number {
  // Find the mapping for this plain index
  for (const m of mappings) {
    if (m.plainIndex === plainIdx) {
      return m.mdIndex;
    }
  }
  // If exact match not found, find closest
  let closest = mappings[0];
  for (const m of mappings) {
    if (m.plainIndex <= plainIdx && m.plainIndex > closest.plainIndex) {
      closest = m;
    }
  }
  // Offset by the difference
  return closest ? closest.mdIndex + (plainIdx - closest.plainIndex) : plainIdx;
}

/**
 * Compute diff between original and improved text.
 * Returns ranges in the improved markdown that should be highlighted.
 */
export function computeDiffRanges(
  originalMd: string,
  improvedMd: string
): HighlightRange[] {
  // Strip markdown from both texts
  const originalStrip = stripMarkdownWithMapping(originalMd);
  const improvedStrip = stripMarkdownWithMapping(improvedMd);

  // Compute word-level diff on plain text
  const changes = Diff.diffWords(originalStrip.text, improvedStrip.text);

  // Find positions of added text in improved plain text
  const ranges: HighlightRange[] = [];
  let improvedPlainIdx = 0;

  for (const change of changes) {
    if (change.removed) {
      // Skip removed text - it's not in improved
      continue;
    }

    if (change.added) {
      // This text was added - find its position in markdown
      const startPlain = improvedPlainIdx;
      let endPlain = improvedPlainIdx + change.value.length;

      // Trim trailing whitespace from the range to avoid markers landing
      // before markdown syntax like ## headers
      let trimmedValue = change.value;
      while (trimmedValue.length > 0 && /\s/.test(trimmedValue[trimmedValue.length - 1])) {
        trimmedValue = trimmedValue.slice(0, -1);
        endPlain--;
      }

      // Only add range if there's actual content after trimming
      if (trimmedValue.length > 0) {
        // Map to markdown positions
        const startMd = plainToMdIndex(improvedStrip.mappings, startPlain);
        const endMd = plainToMdIndex(improvedStrip.mappings, endPlain - 1) + 1;

        ranges.push({ start: startMd, end: endMd });
      }
    }

    // Advance position in improved text (for both added and unchanged)
    if (!change.removed) {
      improvedPlainIdx += change.value.length;
    }
  }

  return ranges;
}

/**
 * Merge overlapping or adjacent ranges.
 */
function mergeRanges(ranges: HighlightRange[]): HighlightRange[] {
  if (ranges.length === 0) return [];

  // Sort by start position
  const sorted = [...ranges].sort((a, b) => a.start - b.start);

  const merged: HighlightRange[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    // If overlapping or adjacent, merge
    if (current.start <= last.end + 1) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

/**
 * Insert highlight markers into markdown at specified ranges.
 * Inserts in reverse order to preserve indices.
 */
export function insertHighlightMarkers(
  markdown: string,
  ranges: HighlightRange[]
): string {
  if (ranges.length === 0) return markdown;

  // Merge overlapping ranges
  const mergedRanges = mergeRanges(ranges);

  // Sort by start position descending (insert from end to preserve indices)
  const sortedRanges = [...mergedRanges].sort((a, b) => b.start - a.start);

  let result = markdown;

  for (const range of sortedRanges) {
    // Clamp to valid bounds
    const start = Math.max(0, Math.min(range.start, result.length));
    const end = Math.max(start, Math.min(range.end, result.length));

    // Insert end marker first, then start marker
    result = result.slice(0, end) + HIGHLIGHT_END + result.slice(end);
    result = result.slice(0, start) + HIGHLIGHT_START + result.slice(start);
  }

  return result;
}

/**
 * Replace markers with HTML tags.
 * Should only be called on already-rendered (escaped) HTML.
 * Handles both highlight markers and underline markers.
 */
export function replaceMarkersWithHtml(html: string): string {
  return html
    .replace(new RegExp(escapeRegExp(HIGHLIGHT_START), 'g'), '<mark class="bg-yellow-200 dark:bg-yellow-900/50 px-0.5 rounded">')
    .replace(new RegExp(escapeRegExp(HIGHLIGHT_END), 'g'), '</mark>')
    .replace(new RegExp(escapeRegExp(UNDERLINE_START), 'g'), '<u>')
    .replace(new RegExp(escapeRegExp(UNDERLINE_END), 'g'), '</u>');
}

/**
 * Convert <u>text</u> HTML to underline markers before react-markdown processing.
 * This allows secure underline rendering without using rehype-raw.
 */
export function convertUnderlineToMarkers(text: string): string {
  return text
    .replace(/<u>/g, UNDERLINE_START)
    .replace(/<\/u>/g, UNDERLINE_END);
}

/**
 * Escape special regex characters in a string.
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Main function: Create markdown with highlight markers for diff visualization.
 * Returns markdown string with markers - call replaceMarkersWithHtml after
 * rendering to HTML to get final highlighted output.
 */
export function createHighlightedMarkdown(
  originalMd: string,
  improvedMd: string
): string {
  const ranges = computeDiffRanges(originalMd, improvedMd);
  return insertHighlightMarkers(improvedMd, ranges);
}
