/**
 * AI Diff Highlighting Utilities
 *
 * Secure diff highlighting for comparing original text with AI-improved text.
 * Uses plain-text diffing for accurate comparison, then renders with custom
 * React elements for full control over formatting.
 *
 * Security: All text is rendered through React.createElement which automatically
 * escapes HTML. Highlights are applied as React <mark> elements, not raw HTML.
 *
 * Algorithm:
 * 1. Strip markdown from both texts to get plain text
 * 2. Diff plain text to find added words with positions
 * 3. Insert markers into AI markdown at diff positions
 * 4. Parse markdown structure (headers, bold labels, paragraphs)
 * 5. Render with React elements, converting markers to <mark> elements
 */

import React from 'react';
import {
  createHighlightedMarkdown,
  HIGHLIGHT_START,
  HIGHLIGHT_END,
} from './diff-highlighting';

interface ContentPart {
  type: 'text' | 'header';
  content: string;
  level?: 'h2' | 'h3' | 'h4';
}

/**
 * Split content into text and header parts.
 * Handles highlight markers that may appear before header markers.
 */
function splitContentByHeaders(content: string): ContentPart[] {
  const parts: ContentPart[] = [];
  const lines = content.split('\n');
  let currentText: string[] = [];

  // Helper to strip highlight markers for pattern matching
  const stripMarkers = (s: string) =>
    s.replace(new RegExp(`${HIGHLIGHT_START}|${HIGHLIGHT_END}`, 'g'), '');

  const flushText = () => {
    if (currentText.length > 0) {
      const text = currentText.join('\n').trim();
      if (text) {
        parts.push({ type: 'text', content: text });
      }
      currentText = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    // Strip markers before checking for header patterns
    const withoutMarkers = stripMarkers(trimmed);

    if (withoutMarkers.startsWith('#### ')) {
      flushText();
      parts.push({ type: 'header', level: 'h4', content: trimmed.replace(/^.*?####\s*/, '') });
    } else if (withoutMarkers.startsWith('### ')) {
      flushText();
      parts.push({ type: 'header', level: 'h3', content: trimmed.replace(/^.*?###\s*/, '') });
    } else if (withoutMarkers.startsWith('## ')) {
      flushText();
      parts.push({ type: 'header', level: 'h2', content: trimmed.replace(/^.*?##\s*/, '') });
    } else {
      currentText.push(line);
    }
  }

  flushText();
  return parts;
}

/**
 * Process text to convert highlight markers to React <mark> elements.
 * Handles bold (**text**), underline (<u>text</u>) formatting as well.
 */
function processTextWithHighlights(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let idx = 0;
  let remaining = text;

  while (remaining.length > 0) {
    // Find the next marker, bold, or underline
    const startMarkerIdx = remaining.indexOf(HIGHLIGHT_START);
    const boldIdx = remaining.indexOf('**');
    const underlineIdx = remaining.indexOf('<u>');

    // Determine what comes first
    const nextMarker = startMarkerIdx !== -1 ? startMarkerIdx : Infinity;
    const nextBold = boldIdx !== -1 ? boldIdx : Infinity;
    const nextUnderline = underlineIdx !== -1 ? underlineIdx : Infinity;
    const nextSpecial = Math.min(nextMarker, nextBold, nextUnderline);

    if (nextSpecial === Infinity) {
      // No more special sequences - add remaining text
      if (remaining) {
        nodes.push(remaining);
      }
      break;
    }

    // Add text before the special sequence
    if (nextSpecial > 0) {
      nodes.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }

    if (nextMarker <= nextBold && nextMarker <= nextUnderline) {
      // Handle highlight marker
      const endMarkerIdx = remaining.indexOf(HIGHLIGHT_END);
      if (endMarkerIdx !== -1) {
        const highlightedContent = remaining.slice(HIGHLIGHT_START.length, endMarkerIdx);
        // Recursively process content inside highlight (may contain bold/underline)
        const innerNodes = processTextWithHighlights(highlightedContent, `${keyPrefix}-hi${idx}`);
        nodes.push(
          React.createElement(
            'mark',
            { key: `${keyPrefix}-m${idx++}`, className: 'bg-yellow-200 dark:bg-yellow-900/50 px-0.5 rounded' },
            ...innerNodes
          )
        );
        remaining = remaining.slice(endMarkerIdx + HIGHLIGHT_END.length);
      } else {
        // Unclosed marker - treat as text
        nodes.push(HIGHLIGHT_START);
        remaining = remaining.slice(HIGHLIGHT_START.length);
      }
    } else if (nextBold <= nextUnderline) {
      // Handle bold **text**
      const closeIdx = remaining.indexOf('**', 2);
      if (closeIdx !== -1) {
        const boldContent = remaining.slice(2, closeIdx);
        // Recursively process content inside bold (may contain highlights/underline)
        const innerNodes = processTextWithHighlights(boldContent, `${keyPrefix}-b${idx}`);
        nodes.push(
          React.createElement(
            'strong',
            { key: `${keyPrefix}-s${idx++}` },
            ...innerNodes
          )
        );
        remaining = remaining.slice(closeIdx + 2);
      } else {
        // Unclosed bold - treat as text
        nodes.push('**');
        remaining = remaining.slice(2);
      }
    } else {
      // Handle underline <u>text</u>
      const closeIdx = remaining.indexOf('</u>');
      if (closeIdx !== -1) {
        const underlineContent = remaining.slice(3, closeIdx); // 3 = length of "<u>"
        // Recursively process content inside underline (may contain highlights/bold)
        const innerNodes = processTextWithHighlights(underlineContent, `${keyPrefix}-u${idx}`);
        nodes.push(
          React.createElement(
            'u',
            { key: `${keyPrefix}-ul${idx++}` },
            ...innerNodes
          )
        );
        remaining = remaining.slice(closeIdx + 4); // 4 = length of "</u>"
      } else {
        // Unclosed underline - treat as text
        nodes.push('<u>');
        remaining = remaining.slice(3);
      }
    }
  }

  return nodes;
}

/**
 * Render highlighted text with proper headers and formatting.
 * Returns React nodes ready to render.
 */
export function renderHighlightedText(
  originalText: string,
  improvedText: string
): React.ReactNode {
  // Create markdown with highlight markers
  const highlightedMarkdown = createHighlightedMarkdown(originalText, improvedText);

  // Parse into content parts (headers and text blocks)
  const parts = splitContentByHeaders(highlightedMarkdown);

  const result: React.ReactNode[] = [];
  let partIdx = 0;

  for (const part of parts) {
    const keyPrefix = `p${partIdx}`;

    if (part.type === 'header') {
      // Process header content for highlights
      const headerNodes = processTextWithHighlights(part.content, `${keyPrefix}-hc`);
      result.push(
        React.createElement(
          part.level!,
          { key: `${keyPrefix}-h`, className: 'font-bold mt-4 mb-2' },
          ...headerNodes
        )
      );
    } else {
      // Process text content for highlights and bold
      const textNodes = processTextWithHighlights(part.content, `${keyPrefix}-tc`);
      result.push(
        React.createElement(
          'p',
          { key: `${keyPrefix}-p`, className: 'my-2 leading-tight text-justify hyphens-auto', lang: 'de' },
          ...textNodes
        )
      );
    }

    partIdx++;
  }

  return React.createElement(React.Fragment, null, ...result);
}
