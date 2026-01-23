'use client';

import { useRef, useImperativeHandle, forwardRef } from 'react';
import dynamic from 'next/dynamic';
import type { MDXEditorMethods } from '@mdxeditor/editor';

// Dynamic import to avoid SSR issues with MDXEditor
const MDXEditorComponent = dynamic(
  () => import('./MDXEditorInitialized'),
  { ssr: false }
);

/**
 * Normalize markdown output from MDXEditor.
 * MDXEditor strips trailing spaces before newlines, breaking soft line breaks.
 * This adds two spaces before every single \n (not \n\n paragraph breaks).
 */
function normalizeMarkdown(markdown: string): string {
  return markdown.replace(/([^\n])\n(?!\n)/g, '$1  \n');
}

export interface MarkdownEditorHandle {
  getMarkdown: () => string;
  save: () => void;
}

interface MarkdownEditorProps {
  /** Initial Markdown content */
  initialMarkdown: string;
  /** Callback when user saves */
  onSave: (markdown: string) => void;
  /** Callback when user cancels */
  onCancel: () => void;
  /** Callback when content changes (for tracking editor state externally) */
  onChange?: (markdown: string) => void;
  /** Optional additional class names */
  className?: string;
  /** Hide built-in save/cancel buttons (for external control) */
  hideButtons?: boolean;
}

export const MarkdownEditor = forwardRef<MarkdownEditorHandle, MarkdownEditorProps>(
  function MarkdownEditor({
    initialMarkdown,
    onSave,
    onCancel,
    onChange,
    className = '',
    hideButtons = false,
  }, ref) {
  const editorRef = useRef<MDXEditorMethods>(null);

  const handleSave = () => {
    if (editorRef.current) {
      const markdown = normalizeMarkdown(editorRef.current.getMarkdown());
      onSave(markdown);
    }
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getMarkdown: () => normalizeMarkdown(editorRef.current?.getMarkdown() ?? ''),
    save: handleSave,
  }));

  return (
    <div className={`border border-gray-300 rounded-lg bg-white ${className}`}>
      {/* Editor content area with German text styling */}
      <div
        className="[&_.mdxeditor]:text-justify [&_.mdxeditor]:[hyphens:auto]
                   [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-2
                   [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2
                   [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:mt-3 [&_h4]:mb-1
                   [&_p]:mb-3 [&_p]:leading-relaxed
                   [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-3
                   [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-3
                   [&_li]:mb-1"
        lang="de"
      >
        <MDXEditorComponent
          editorRef={editorRef}
          markdown={initialMarkdown}
          onChange={onChange}
          className="min-h-[400px]"
        />
      </div>

      {/* Action buttons - can be hidden when controlled externally */}
      {!hideButtons && (
        <div className="flex justify-end gap-2 p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 transition-colors"
          >
            Speichern
          </button>
        </div>
      )}
    </div>
  );
});
