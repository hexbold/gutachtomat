import * as FormTypes from '@/lib/core/form-types';
import ReactMarkdown from 'react-markdown';
import { DocumentTextIcon, ClockIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ResultPanelProps {
  submission: FormTypes.SubmissionState;
}

export function ResultPanel({ submission }: ResultPanelProps) {
  const { isLoading, result, error } = submission;

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
    // Paragraphs - justified text with hyphenation
    p: ({...props}) => (
      <p className="my-2 leading-relaxed text-justify hyphens-auto" lang="de" {...props} />
    ),
  };

  return (
    <aside className="w-1/2 flex-shrink-0">
      <div className="bg-white border border-foreground/20 rounded-xl shadow-lg sticky top-8 h-[calc(100vh-6rem)] flex flex-col">
        {/* Content - Scrollable */}
        <div className="flex-1 p-6 overflow-y-auto">
          {!result && !isLoading && !error && (
            <div className="text-center text-gray-500 py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <DocumentTextIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm leading-relaxed">
                Wählen Sie alle Optionen aus und klicken Sie auf &quot;Gutachten erstellen&quot;, um die Vorschau zu sehen.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                <ClockIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-blue-600">
                <p className="font-medium">Gutachten wird erstellt...</p>
                <p className="text-sm text-blue-500 mt-1">Bitte warten Sie einen Moment</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">Fehler:</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {result && !isLoading && (
            <div className="pt-4">
              <div className="flex items-center mb-6">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                  <CheckIcon className="w-4 h-4 text-green-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-700">Generiertes Gutachten</h4>
              </div>
              <div className="prose prose-sm max-w-none text-sm text-gray-800">
                <ReactMarkdown components={markdownComponents}>
                  {result}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}