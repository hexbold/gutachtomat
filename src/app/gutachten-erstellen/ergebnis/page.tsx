'use client';

import { useEffect, useState, useMemo, Suspense, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useStorage } from '@/contexts/StorageContext';
import { createUUID } from '@/lib/storage/storage-types';
import { renderHighlightedText } from '@/lib/utils/ai-diff-highlight';
import { formatToMarkdown } from '@/lib/text-generation/markdown-formatter';
import { convertUnderlineToMarkers, UNDERLINE_START, UNDERLINE_END } from '@/lib/utils/diff-highlighting';
import { MarkdownEditor, type MarkdownEditorHandle } from '@/components/editor/MarkdownEditor';
import type { AssessmentStructure, Geschlecht } from '@/lib/core/form-types';
import { GESCHLECHT_LABELS } from '@/lib/core/form-labels';
import {
  DocumentTextIcon,
  CheckIcon,
  SparklesIcon,
  ArrowPathIcon,
  ClipboardDocumentIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  CloudIcon,
  ComputerDesktopIcon,
  ArrowsRightLeftIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

/**
 * Data structure for the generated gutachten result.
 * V3 format: JSON structure + Markdown (with MDXEditor)
 *
 * Design (Phase 7):
 * - aiImprovedMarkdown is the current AI suggestion (can be edited)
 * - originalAiMarkdown preserves original AI output for revert
 * - aiEdited tracks if user has edited the AI text
 */
interface GutachtenResult {
  id?: string;
  createdAt: number;
  // V3 format (JSON + Markdown)
  originalStructure?: AssessmentStructure;
  currentMarkdown?: string | null;
  aiImproved?: boolean;
  aiImprovedMarkdown?: string | null;  // Current AI suggestion (can be edited)
  originalAiMarkdown?: string | null;  // Original AI output (for revert)
  aiEdited?: boolean;                  // User has edited AI text
  // Basic patient info (Basisdaten)
  patientenchiffre?: string | null;
  geschlecht?: Geschlecht | null;
  alter?: number | null;
  datumBerichterstellung?: string | null;
}

/**
 * Ergebnis (Result) Page Content
 */
function ErgebnisPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { adapter, isReady, isInitializing, storageMode } = useStorage();
  const [gutachten, setGutachten] = useState<GutachtenResult | null>(null);
  const [gutachtenId, setGutachtenId] = useState<string | null>(null);
  const [isImproving, setIsImproving] = useState(false);
  const [aiConsentGiven, setAiConsentGiven] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'haiku' | 'sonnet'>('haiku');
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAI, setIsEditingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [streamError, setStreamError] = useState<string | null>(null);
  // Track AI editor content to survive component remounts (MDXEditor's markdown prop is only read at mount)
  const [aiEditorContent, setAiEditorContent] = useState<string | null>(null);
  // Track main editor content to survive component remounts
  const [mainEditorContent, setMainEditorContent] = useState<string | null>(null);
  const aiEditorRef = useRef<MarkdownEditorHandle>(null);
  const editorRef = useRef<MarkdownEditorHandle>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasLoadedRef = useRef(false);

  // Load result from storage - only on initial mount
  // Skip reload if user is editing to prevent losing unsaved changes
  useEffect(() => {
    if (!isReady || !adapter) return;

    // Skip reload if already loaded and user is editing
    if (hasLoadedRef.current && (isEditingAI || isEditing)) {
      return;
    }

    const loadGutachten = async () => {
      const urlId = searchParams.get('id');

      if (urlId) {
        // Skip if we already loaded this ID
        if (hasLoadedRef.current && gutachtenId === urlId) {
          return;
        }

        // Load from storage adapter
        const completed = await adapter.loadCompleted(createUUID(urlId));
        if (completed) {
          setGutachtenId(urlId);
          // V3 format: JSON + Markdown
          setGutachten({
            id: urlId,
            originalStructure: completed.generatedText.originalStructure,
            currentMarkdown: completed.generatedText.currentMarkdown,
            aiImproved: completed.generatedText.aiImproved ?? false,
            aiImprovedMarkdown: completed.generatedText.aiImprovedMarkdown ?? null,
            originalAiMarkdown: completed.generatedText.originalAiMarkdown ?? null,
            aiEdited: completed.generatedText.aiEdited === true,  // Strict boolean check
            createdAt: completed.meta.createdAt,
            // Basic patient info from formData
            patientenchiffre: completed.formData.patientenchiffre,
            geschlecht: completed.formData.geschlecht,
            alter: completed.formData.alter,
            datumBerichterstellung: completed.formData.datumBerichterstellung,
          });
          hasLoadedRef.current = true;
          return;
        }
      }

      // No result found, redirect to dashboard
      router.replace('/gutachten');
    };

    loadGutachten();
  }, [searchParams, router, isReady, adapter, isEditingAI, isEditing, gutachtenId]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Get current display text (for copy/download)
  const getCurrentText = (): string => {
    if (!gutachten) return '';
    // Use currentMarkdown if user has edited, otherwise generate from JSON structure
    if (gutachten.currentMarkdown) {
      return gutachten.currentMarkdown;
    }
    if (gutachten.originalStructure) {
      return formatToMarkdown(gutachten.originalStructure);
    }
    return '';
  };

  // Get current markdown for editor and display
  const getCurrentMarkdown = useCallback((): string => {
    if (!gutachten) return '';
    if (gutachten.currentMarkdown) {
      return gutachten.currentMarkdown;
    }
    if (gutachten.originalStructure) {
      return formatToMarkdown(gutachten.originalStructure);
    }
    return '';
  }, [gutachten]);

  // AI improvement handler - sends markdown to AI and stores improved markdown (with streaming)
  const handleImproveWithAI = async () => {
    if (!aiConsentGiven || isImproving || !gutachten || !adapter || !gutachtenId) return;

    setIsImproving(true);
    setIsStreaming(true);
    setStreamedText('');
    setStreamError(null);

    // Create abort controller for cleanup
    abortControllerRef.current = new AbortController();

    try {
      // Get markdown for AI - send user's edits if available, otherwise original
      const textForAI = getCurrentMarkdown();

      const response = await fetch('/api/improve-text?stream=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textForAI, model: selectedModel }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              // Streaming complete - transition to diff view
              setIsStreaming(false);
              const updated = {
                ...gutachten,
                aiImprovedMarkdown: accumulatedText,
                aiImproved: true,
                originalAiMarkdown: gutachten.originalAiMarkdown ?? accumulatedText,
                aiEdited: false,
              };
              setGutachten(updated);
              await adapter.saveAiImprovedMarkdown(createUUID(gutachtenId), accumulatedText);
            } else {
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  accumulatedText += parsed.text;
                  setStreamedText(accumulatedText);
                } else if (parsed.error) {
                  throw new Error(parsed.error);
                }
              } catch {
                // Ignore JSON parse errors for incomplete chunks
              }
            }
          }
        }
      }
    } catch (error) {
      // Don't show error if aborted
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('AI improvement was cancelled');
      } else {
        console.error('AI improvement failed:', error);
        setStreamError('KI-Verbesserung fehlgeschlagen. Bitte erneut versuchen.');
      }
      setIsStreaming(false);
    } finally {
      setIsImproving(false);
      abortControllerRef.current = null;
    }
  };

  // Revert to original
  const handleRevertToOriginal = useCallback(async () => {
    if (!gutachten || !adapter || !gutachtenId) return;

    // Clear currentMarkdown, aiImproved, and aiImprovedMarkdown
    const updated = { ...gutachten, currentMarkdown: null, aiImproved: false, aiImprovedMarkdown: null };
    setGutachten(updated);
    await adapter.revertCompletedToOriginal(createUUID(gutachtenId));
  }, [gutachten, adapter, gutachtenId]);

  // Accept AI improvement - copy aiImprovedMarkdown to currentMarkdown
  const handleAcceptAI = useCallback(async () => {
    if (!gutachten || !gutachten.aiImprovedMarkdown || !adapter || !gutachtenId) return;

    const updated = { ...gutachten, currentMarkdown: gutachten.aiImprovedMarkdown, aiImprovedMarkdown: null };
    setGutachten(updated);

    await adapter.acceptAiImprovement(createUUID(gutachtenId));
  }, [gutachten, adapter, gutachtenId]);

  // Reject AI improvement - clear aiImprovedMarkdown, keep currentMarkdown
  const handleRejectAI = useCallback(async () => {
    if (!gutachten || !adapter || !gutachtenId) return;

    const updated = { ...gutachten, aiImprovedMarkdown: null, aiImproved: false };
    setGutachten(updated);

    await adapter.rejectAiImprovement(createUUID(gutachtenId));
  }, [gutachten, adapter, gutachtenId]);

  // Handle save from editor
  const handleSaveEdit = useCallback(async (markdown: string) => {
    if (!gutachten || !adapter || !gutachtenId) return;

    setIsSaving(true);
    try {
      const updated = { ...gutachten, currentMarkdown: markdown };
      setGutachten(updated);
      setMainEditorContent(null);  // Clear tracked content after successful save
      setIsEditing(false);

      await adapter.updateCompletedMarkdown(createUUID(gutachtenId), markdown);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Speichern fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSaving(false);
    }
  }, [gutachten, adapter, gutachtenId]);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    setMainEditorContent(null);
    setIsEditing(false);
  }, []);

  // Start edit - initialize tracked content
  const handleStartEdit = useCallback(() => {
    setMainEditorContent(getCurrentMarkdown());
    setIsEditing(true);
  }, [getCurrentMarkdown]);

  // Save AI edit
  const handleSaveAIEdit = useCallback(async (markdown: string) => {
    if (!gutachten || !adapter || !gutachtenId) return;

    setIsSaving(true);
    try {
      const updated = { ...gutachten, aiImprovedMarkdown: markdown, aiEdited: true };
      setGutachten(updated);
      setAiEditorContent(null);  // Clear tracked content after successful save
      setIsEditingAI(false);

      await adapter.updateAiImprovedMarkdown(createUUID(gutachtenId), markdown);
    } catch (error) {
      console.error('AI edit save failed:', error);
      alert('Speichern fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSaving(false);
    }
  }, [gutachten, adapter, gutachtenId]);

  // Cancel AI edit
  const handleCancelAIEdit = useCallback(() => {
    setAiEditorContent(null);
    setIsEditingAI(false);
  }, []);

  // Start AI edit - initialize tracked content
  const handleStartEditAI = useCallback(() => {
    setAiEditorContent(gutachten?.aiImprovedMarkdown || '');
    setIsEditingAI(true);
  }, [gutachten]);

  // Revert to original AI output
  const handleRevertToOriginalAI = useCallback(async () => {
    if (!gutachten || !gutachten.originalAiMarkdown || !adapter || !gutachtenId) return;

    // Confirmation dialog before reverting
    const confirmed = window.confirm(
      'Möchten Sie wirklich zum KI-Original zurückkehren? Ihre Bearbeitungen gehen verloren.'
    );
    if (!confirmed) return;

    try {
      // Capture the original value BEFORE any async operations (in case of stale closure)
      const originalAiMarkdown = gutachten.originalAiMarkdown;

      await adapter.revertToOriginalAiMarkdown(createUUID(gutachtenId));

      // Reload from adapter to get fresh data (avoids stale closure issues)
      const reloaded = await adapter.loadCompleted(createUUID(gutachtenId));
      if (reloaded) {
        setGutachten({
          id: gutachtenId,
          createdAt: reloaded.meta.createdAt,
          originalStructure: reloaded.generatedText.originalStructure,
          currentMarkdown: reloaded.generatedText.currentMarkdown ?? null,
          aiImproved: reloaded.generatedText.aiImproved ?? false,
          aiImprovedMarkdown: reloaded.generatedText.aiImprovedMarkdown ?? null,
          originalAiMarkdown: reloaded.generatedText.originalAiMarkdown ?? null,
          aiEdited: reloaded.generatedText.aiEdited === true,
        });
      } else {
        // Fallback: Use captured value if reload fails
        setGutachten(prev => prev ? {
          ...prev,
          aiImprovedMarkdown: originalAiMarkdown,
          aiEdited: false,
        } : null);
      }
    } catch (error) {
      console.error('Revert to original AI failed:', error);
      alert('Zurücksetzen fehlgeschlagen. Bitte versuchen Sie es erneut.');
    }
  }, [gutachten, adapter, gutachtenId]);

  // Copy text to clipboard
  const handleCopyText = async () => {
    if (!gutachten) return;
    const textToCopy = getCurrentText();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Download as file
  const handleDownload = () => {
    if (!gutachten) return;
    const textToDownload = getCurrentText();
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Gutachten_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Compute whether text has been modified
  const isModified = gutachten ? gutachten.currentMarkdown !== null : false;

  // Render highlighted content for AI-improved text (memoized for performance)
  const highlightedContent = useMemo(() => {
    if (!gutachten || !gutachten.aiImprovedMarkdown) return null;
    // Inline getCurrentMarkdown logic to avoid dependency issues
    const originalMarkdown = gutachten.currentMarkdown
      ?? (gutachten.originalStructure ? formatToMarkdown(gutachten.originalStructure) : '');
    return renderHighlightedText(originalMarkdown, gutachten.aiImprovedMarkdown);
  }, [gutachten]);

  // Helper to process underline markers in text content
  const processUnderlineInText = (text: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    let remaining = text;
    let idx = 0;

    while (remaining.length > 0) {
      const startIdx = remaining.indexOf(UNDERLINE_START);
      if (startIdx === -1) {
        if (remaining) nodes.push(remaining);
        break;
      }

      // Add text before marker
      if (startIdx > 0) {
        nodes.push(remaining.slice(0, startIdx));
      }

      // Find end marker
      const afterStart = remaining.slice(startIdx + UNDERLINE_START.length);
      const endIdx = afterStart.indexOf(UNDERLINE_END);
      if (endIdx !== -1) {
        const underlineContent = afterStart.slice(0, endIdx);
        nodes.push(<u key={`u-${idx++}`}>{underlineContent}</u>);
        remaining = afterStart.slice(endIdx + UNDERLINE_END.length);
      } else {
        // Unclosed marker - treat as text
        nodes.push(UNDERLINE_START);
        remaining = afterStart;
      }
    }

    return nodes;
  };

  // Process children to handle underline markers
  const processChildren = (children: React.ReactNode): React.ReactNode => {
    if (typeof children === 'string') {
      const processed = processUnderlineInText(children);
      return processed.length === 1 ? processed[0] : <>{processed}</>;
    }
    if (Array.isArray(children)) {
      return children.map((child, i) =>
        typeof child === 'string'
          ? <React.Fragment key={i}>{processUnderlineInText(child)}</React.Fragment>
          : child
      );
    }
    return children;
  };

  // Custom markdown components matching LivePreviewPanel styling
  // With underline marker processing for <u> tag support
  const markdownComponents = {
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }) => (
      <h2 className="font-bold" {...props}>{processChildren(children)}</h2>
    ),
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }) => (
      <h3 className="font-bold" {...props}>{processChildren(children)}</h3>
    ),
    h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children?: React.ReactNode }) => (
      <h4 className="font-bold" {...props}>{processChildren(children)}</h4>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { children?: React.ReactNode }) => (
      <p className="my-2 leading-tight text-justify hyphens-auto" lang="de" {...props}>{processChildren(children)}</p>
    ),
  };

  // Loading state while checking storage
  if (!gutachten || isInitializing || !isReady) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
            <DocumentTextIcon className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-text-tertiary">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Header */}
      <div className="bg-surface-primary border-b border-border-primary px-6 py-2">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Title */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
              <CheckIcon className="w-4 h-4 text-green-600" />
            </div>
            <h1 className="text-lg font-bold text-text-primary">
              Gutachten erstellt
            </h1>
          </div>
          {/* Basic patient info - centered */}
          <div className="flex items-center divide-x divide-border-secondary text-sm">
            {gutachten.patientenchiffre && (
              <div className="px-3 first:pl-0">
                <span className="text-text-tertiary">Chiffre </span>
                <span className="font-medium text-text-primary">{gutachten.patientenchiffre}</span>
              </div>
            )}
            {gutachten.geschlecht && (
              <div className="px-3">
                <span className="text-text-tertiary">Geschlecht </span>
                <span className="font-medium text-text-primary">{GESCHLECHT_LABELS[gutachten.geschlecht]}</span>
              </div>
            )}
            {gutachten.alter != null && (
              <div className="px-3">
                <span className="text-text-tertiary">Alter </span>
                <span className="font-medium text-text-primary">{gutachten.alter} Jahre</span>
              </div>
            )}
            {gutachten.datumBerichterstellung && (
              <div className="px-3 last:pr-0">
                <span className="text-text-tertiary">Datum </span>
                <span className="font-medium text-text-primary">{new Date(gutachten.datumBerichterstellung).toLocaleDateString('de-DE')}</span>
              </div>
            )}
          </div>
          {/* Storage mode indicator */}
          <div className="flex items-center gap-1.5 text-sm text-foreground/60">
            {storageMode === 'local' ? (
              <>
                <ComputerDesktopIcon className="w-4 h-4" />
                <span>Lokal</span>
              </>
            ) : (
              <>
                <CloudIcon className="w-4 h-4" />
                <span>Cloud</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================
          TWO-MODE DESIGN:
          - Single View: Big purple top bar with all controls + export buttons
          - Comparison View: Slim comparison bar, read-only side-by-side
          ======================================================================== */}

      {/* SINGLE VIEW: Top Bar - KI Controls + Actions (only when NOT in comparison mode) */}
      {!gutachten.aiImprovedMarkdown && !isImproving && (
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Left - KI Controls */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-900">KI-Textverbesserung</span>
                </div>
                <label className="flex items-center gap-2 text-sm text-purple-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={aiConsentGiven}
                    onChange={(e) => setAiConsentGiven(e.target.checked)}
                    className="w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Einwilligung zur KI-Verarbeitung</span>
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as 'haiku' | 'sonnet')}
                  className="text-sm px-3 py-2 rounded-lg border border-purple-300 bg-white text-purple-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="haiku">Haiku (Schnell)</option>
                  <option value="sonnet">Sonnet (Qualität)</option>
                </select>
                <button
                  onClick={handleImproveWithAI}
                  disabled={!aiConsentGiven || isImproving}
                  className={`
                    text-sm px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2
                    ${aiConsentGiven && !isImproving
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-purple-200 text-purple-400 cursor-not-allowed'
                    }
                  `}
                >
                  {gutachten?.aiImproved ? (
                    <>
                      <SparklesIcon className="w-4 h-4" />
                      <span>Erneut mit KI verbessern</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-4 h-4" />
                      <span>Mit KI verbessern</span>
                    </>
                  )}
                </button>
                {isModified && (
                  <button
                    onClick={handleRevertToOriginal}
                    className="text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-100 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                    <span>Original wiederherstellen</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* COMPARISON VIEW: Slim Comparison Bar (only when AI suggestion is active) */}
      {(gutachten.aiImprovedMarkdown || isImproving) && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
            {/* Left - Status indicator */}
            <div className="flex items-center gap-2 text-gray-600">
              <ArrowsRightLeftIcon className="w-5 h-5" />
              <span className="font-medium">Vergleich aktiv</span>
            </div>
            {/* Right - Model selector + Regenerate button */}
            <div className="flex items-center gap-3">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as 'haiku' | 'sonnet')}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="haiku">Haiku (Schnell)</option>
                <option value="sonnet">Sonnet (Qualität)</option>
              </select>
              <button
                onClick={handleImproveWithAI}
                disabled={!aiConsentGiven || isImproving}
                className={`
                  text-sm px-4 py-1.5 rounded-lg font-medium transition-colors inline-flex items-center gap-2
                  ${aiConsentGiven && !isImproving
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-purple-200 text-purple-400 cursor-not-allowed'
                  }
                `}
              >
                {isImproving ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    <span>Verbessere...</span>
                  </>
                ) : (
                  <>
                    <ArrowPathIcon className="w-4 h-4" />
                    <span>Erneut verbessern</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className={`mx-auto px-6 pb-8 ${
        // Wide layout for side-by-side comparison view
        (gutachten.aiImprovedMarkdown || isImproving) ? 'max-w-7xl' : 'max-w-4xl'
      }`}>
        {isEditing ? (
          /* SINGLE VIEW: Edit mode - show MDXEditor */
          <div className="bg-surface-primary border-2 border-amber-300 rounded-xl shadow-lg">
            {/* Header with action buttons */}
            <div className="bg-amber-50 px-4 py-3 border-b border-amber-200 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PencilIcon className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">Bearbeiten</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                  <span>Abbrechen</span>
                </button>
                <button
                  onClick={() => editorRef.current?.save()}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5"
                >
                  <CheckIcon className="w-3.5 h-3.5" />
                  <span>Speichern</span>
                </button>
              </div>
            </div>
            {/* Editor without bottom buttons */}
            {/* Use mainEditorContent to survive component remounts (MDXEditor only reads markdown prop at mount) */}
            <MarkdownEditor
              ref={editorRef}
              initialMarkdown={mainEditorContent ?? getCurrentMarkdown()}
              onChange={setMainEditorContent}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
              hideButtons={true}
            />
          </div>
        ) : (gutachten.aiImprovedMarkdown || isImproving) ? (
          /* COMPARISON VIEW: Side-by-side read-only comparison */
          <div className="grid grid-cols-2 gap-6">
            {/* Left Panel - Original/Current (read-only, no buttons) */}
            <div className={`bg-surface-primary border-2 ${isModified ? 'border-amber-300' : 'border-green-200'} rounded-xl shadow-lg`}>
              {/* Header - Label only, no action buttons */}
              <div className={`${isModified ? 'bg-amber-50' : 'bg-green-50'} px-4 py-3 border-b ${isModified ? 'border-amber-200' : 'border-green-200'} rounded-t-xl`}>
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className={`w-5 h-5 ${isModified ? 'text-amber-600' : 'text-green-600'}`} />
                  <span className={`text-sm font-medium ${isModified ? 'text-amber-700' : 'text-green-700'}`}>
                    {isModified ? 'Aktuell (bearbeitet)' : 'Original'}
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className="p-6">
                <div className="prose prose-sm max-w-none text-text-primary leading-relaxed">
                  <ReactMarkdown components={markdownComponents}>
                    {convertUnderlineToMarkers(getCurrentMarkdown())}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Right Panel - AI Suggestion (with editing support) */}
            <div className="bg-surface-primary border-2 border-purple-300 rounded-xl shadow-lg">
              {/* Header with action buttons */}
              <div className="bg-purple-50 px-4 py-3 border-b border-purple-200 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isStreaming ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 text-purple-600 animate-spin" />
                      <span className="text-sm text-purple-600 font-medium">
                        Generiere...
                      </span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-purple-600 font-medium">
                        {gutachten.aiEdited ? 'KI-verbessert (bearbeitet)' : 'KI-Vorschlag'}
                      </span>
                    </>
                  )}
                </div>
                {/* Action buttons - change based on edit mode */}
                {!isImproving && (
                  <div className="flex gap-2">
                    {isEditingAI ? (
                      // Edit mode: Show Save/Cancel
                      <>
                        <button
                          onClick={handleCancelAIEdit}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                        >
                          <XMarkIcon className="w-3.5 h-3.5" />
                          <span>Abbrechen</span>
                        </button>
                        <button
                          onClick={() => aiEditorRef.current?.save()}
                          disabled={isSaving}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <CheckIcon className="w-3.5 h-3.5" />
                          <span>{isSaving ? 'Speichern...' : 'Speichern'}</span>
                        </button>
                      </>
                    ) : (
                      // View mode: Show Übernehmen/Bearbeiten/Verwerfen/KI-Original
                      <>
                        <button
                          onClick={handleAcceptAI}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1.5"
                        >
                          <CheckIcon className="w-3.5 h-3.5" />
                          <span>Übernehmen</span>
                        </button>
                        <button
                          onClick={handleStartEditAI}
                          className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-100 border border-amber-300 rounded-lg hover:bg-amber-200 transition-colors flex items-center gap-1.5"
                        >
                          <PencilIcon className="w-3.5 h-3.5" />
                          <span>Bearbeiten</span>
                        </button>
                        <button
                          onClick={handleRejectAI}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                        >
                          <XMarkIcon className="w-3.5 h-3.5" />
                          <span>Verwerfen</span>
                        </button>
                        {/* KI-Original button - only when user has edited */}
                        {gutachten.aiEdited === true && gutachten.originalAiMarkdown && (
                          <button
                            onClick={handleRevertToOriginalAI}
                            className="px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-100 border border-purple-300 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-1.5"
                          >
                            <ArrowPathIcon className="w-3.5 h-3.5" />
                            <span>KI-Original</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
              {/* Content */}
              <div className="p-6">
                {/* Error display */}
                {streamError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-700 text-sm">{streamError}</p>
                    <button
                      onClick={() => setStreamError(null)}
                      className="text-red-600 text-xs underline mt-2"
                    >
                      Schließen
                    </button>
                  </div>
                )}
                {isStreaming ? (
                  // Streaming state - show live markdown render
                  <div className="prose prose-sm max-w-none text-text-primary leading-relaxed">
                    <ReactMarkdown components={markdownComponents}>
                      {convertUnderlineToMarkers(streamedText)}
                    </ReactMarkdown>
                    {/* Blinking cursor indicator */}
                    <span className="inline-block w-2 h-4 bg-purple-500 animate-pulse ml-1" />
                  </div>
                ) : isImproving ? (
                  // Fallback loading state (in case streaming doesn't start)
                  <div className="flex flex-col items-center justify-center py-20 text-purple-500">
                    <ArrowPathIcon className="w-12 h-12 animate-spin mb-4" />
                    <span className="text-lg">Verbinde...</span>
                  </div>
                ) : isEditingAI ? (
                  // Editing mode - show MDXEditor (buttons are in header)
                  // Use aiEditorContent to survive component remounts (MDXEditor only reads markdown prop at mount)
                  <MarkdownEditor
                    ref={aiEditorRef}
                    initialMarkdown={aiEditorContent ?? gutachten.aiImprovedMarkdown ?? ''}
                    onChange={setAiEditorContent}
                    onSave={handleSaveAIEdit}
                    onCancel={handleCancelAIEdit}
                    hideButtons={true}
                  />
                ) : (
                  // AI text with diff highlights
                  <div className="prose prose-sm max-w-none text-text-primary leading-relaxed whitespace-pre-wrap text-justify hyphens-auto" lang="de">
                    {highlightedContent}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* SINGLE VIEW: View mode - single column */
          <div className={`bg-surface-primary border-2 ${isModified ? 'border-amber-300' : 'border-green-200'} rounded-xl shadow-lg`}>
            {/* Header with status and action buttons */}
            <div className={`${isModified ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'} px-4 py-3 border-b rounded-t-xl flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <DocumentTextIcon className={`w-5 h-5 ${isModified ? 'text-amber-600' : 'text-green-600'}`} />
                <span className={`text-sm font-medium ${isModified ? 'text-amber-700' : 'text-green-700'}`}>
                  {isModified ? 'Bearbeitet' : 'Original'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleStartEdit}
                  className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-100 border border-amber-300 rounded-lg hover:bg-amber-200 transition-colors flex items-center gap-1.5"
                >
                  <PencilIcon className="w-3.5 h-3.5" />
                  <span>Bearbeiten</span>
                </button>
                <button
                  onClick={handleCopyText}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    copySuccess
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {copySuccess ? <CheckIcon className="w-3.5 h-3.5" /> : <ClipboardDocumentIcon className="w-3.5 h-3.5" />}
                  <span>{copySuccess ? 'Kopiert!' : 'Kopieren'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                >
                  <PrinterIcon className="w-3.5 h-3.5" />
                  <span>Drucken</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5"
                >
                  <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                  <span>Speichern</span>
                </button>
              </div>
            </div>
            {/* Content */}
            <div className="p-6 prose prose-sm max-w-none text-text-primary leading-relaxed">
              <ReactMarkdown components={markdownComponents}>
                {convertUnderlineToMarkers(getCurrentMarkdown())}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Ergebnis (Result) Page
 *
 * Displays the final generated gutachten after the wizard is complete.
 * Includes AI text improvement functionality.
 */
export default function ErgebnisPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface-secondary flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
              <DocumentTextIcon className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-text-tertiary">Laden...</p>
          </div>
        </div>
      }
    >
      <ErgebnisPageContent />
    </Suspense>
  );
}
