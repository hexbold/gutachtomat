/**
 * LivePreviewPanel Component
 *
 * Displays real-time generated assessment text as the user fills out the wizard.
 * Updates instantly without requiring any backend calls.
 * Highlights newly added/changed sentences for 2.5 seconds.
 */

import React, { useState, useEffect } from 'react';
import * as FormTypes from '@/lib/core/form-types';
import * as FormLabels from '@/lib/core/form-labels';
import ReactMarkdown from 'react-markdown';

interface LivePreviewPanelProps {
  generatedText: FormTypes.GeneratedTextResult;
  geschlecht?: FormTypes.Geschlecht;
  alter?: string;
  patientenchiffre?: FormTypes.Patientenchiffre;
  datumBerichterstellung?: FormTypes.DatumBerichterstellung;
}

export function LivePreviewPanel({
  generatedText,
  geschlecht,
  alter,
  patientenchiffre,
  datumBerichterstellung,
}: LivePreviewPanelProps) {
  const [activeHighlights, setActiveHighlights] = useState<string[]>([]);
  const [highlightKey, setHighlightKey] = useState<number>(0);

  // Format patient info - O(1) lookup using GESCHLECHT_LABELS
  const geschlechtLabel = geschlecht ? FormLabels.GESCHLECHT_LABELS[geschlecht] : '';
  const alterText = alter ? `${alter} Jahre` : '';
  const chiffreText = patientenchiffre || '';

  // Format date from ISO (YYYY-MM-DD) to German format (DD.MM.YYYY)
  const datumText = datumBerichterstellung
    ? datumBerichterstellung.split('-').reverse().join('.')
    : '';

  // Update active highlights when new sentences are highlighted
  useEffect(() => {
    if (generatedText.highlightedSentences.length > 0 && generatedText.highlightTimestamp) {
      // Force animation restart by incrementing key
      setHighlightKey(prev => prev + 1);
      setActiveHighlights(generatedText.highlightedSentences);

      // Clear highlights after 2.5 seconds
      const timer = setTimeout(() => {
        setActiveHighlights([]);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [generatedText.highlightTimestamp, generatedText.highlightedSentences]);

  // Helper function to check if text should be highlighted and apply highlighting
  const highlightText = (text: string | React.ReactNode) => {
    if (activeHighlights.length === 0) {
      return text;
    }

    // Handle arrays of React nodes (e.g., when markdown creates <br> tags)
    if (Array.isArray(text)) {
      return text.map((child, idx) => {
        if (typeof child === 'string') {
          return <React.Fragment key={idx}>{highlightTextString(child)}</React.Fragment>;
        }
        return child;
      });
    }

    // Handle simple strings
    if (typeof text === 'string') {
      return highlightTextString(text);
    }

    return text;
  };

  // Helper to highlight a single string
  const highlightTextString = (text: string) => {
    // Check if any highlight matches exist in this text
    const result: React.ReactNode[] = [];
    let remainingText = text;

    activeHighlights.forEach((highlight, idx) => {
      const highlightIndex = remainingText.indexOf(highlight);

      if (highlightIndex !== -1) {
        // Add text before highlight
        if (highlightIndex > 0) {
          result.push(remainingText.substring(0, highlightIndex));
        }

        // Add highlighted text
        result.push(
          <mark
            key={`${highlightKey}-${idx}`}
            className="bg-yellow-200/70 dark:bg-yellow-500/30 px-1 rounded transition-all duration-300"
            style={{
              animation: 'highlightFade 2.5s ease-out forwards'
            }}
          >
            {highlight}
          </mark>
        );

        // Update remaining text
        remainingText = remainingText.substring(highlightIndex + highlight.length);
      }
    });

    // Add any remaining text
    if (remainingText) {
      result.push(remainingText);
    }

    return result.length > 0 ? <>{result}</> : text;
  };

  // Custom components for react-markdown - just bold headings
  const markdownComponents = {
    // Main chapter headings (## Kapitel 1, etc.)
    h2: ({...props}) => (
      <h2 className="font-bold" {...props} />
    ),
    // Section headings (### A Symptomatik, etc.)
    h3: ({...props}) => (
      <h3 className="font-bold" {...props} />
    ),
    // Subsection headings (#### 1. Erscheinungsbild, etc.)
    h4: ({...props}) => (
      <h4 className="font-bold" {...props} />
    ),
    // Paragraphs with highlighting support - justified text with hyphenation
    p: ({children, ...props}: React.HTMLAttributes<HTMLParagraphElement> & { children?: React.ReactNode }) => (
      <p className="my-2 leading-tight text-justify hyphens-auto" lang="de" {...props}>
        {highlightText(children)}
      </p>
    ),
  };

  return (
    <div className="h-full flex flex-col bg-surface-primary">
      {/* Header - Patient Info in 1x4 Layout */}
      <div className="border-b border-gray-200 px-4 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="grid grid-cols-4 gap-x-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-medium">Patientenchiffre</span>
            <span className="text-xs text-gray-900 font-semibold truncate">{chiffreText || '—'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-medium">Geschlecht</span>
            <span className="text-xs text-gray-900 font-semibold">{geschlechtLabel || '—'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-medium">Alter</span>
            <span className="text-xs text-gray-900 font-semibold">{alterText || '—'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-medium">Datum</span>
            <span className="text-xs text-gray-900 font-semibold">{datumText || '—'}</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
          {generatedText.text && generatedText.text !== 'Beginnen Sie mit dem Ausfüllen des Formulars, um eine Vorschau zu sehen...' ? (
            <div className="prose prose-sm max-w-none text-sm text-gray-800">
              <ReactMarkdown components={markdownComponents}>
                {generatedText.text}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-4 text-sm">
                  Beginnen Sie mit dem Ausfüllen des Formulars
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Die Vorschau erscheint automatisch
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
