'use client';

import { Kapitel6Handlers } from '@/hooks/useGutachtenForm';
import { highlightSearchText } from '@/lib/utils/highlight-utils';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type CardSelectionEntry = { selected?: true; details?: { brackets?: string; text?: string } };

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  headerGradient: string;
  disorderType: string;
  data: Record<string, CardSelectionEntry | undefined>;
  labels: Record<string, string>;
  kapitel6Handlers: Kapitel6Handlers;
}

interface InterventionCardProps {
  label: string;
  highlightedLabel?: React.ReactNode;
  isSelected: boolean;
  text?: string;
  onToggle: () => void;
  onTextChange: (value: string) => void;
}

function InterventionCard({
  label,
  highlightedLabel,
  isSelected,
  text,
  onToggle,
  onTextChange,
}: InterventionCardProps) {
  return (
    <div
      className={`
        p-4 rounded-lg border-2 transition-all duration-200
        ${isSelected
          ? 'border-blue-500 bg-blue-50 shadow-sm'
          : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onToggle}
          className={`
            flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 transition-colors flex items-center justify-center
            ${isSelected
              ? 'bg-blue-500 border-blue-500'
              : 'border-gray-400 hover:border-blue-400'
            }
          `}
        >
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <button
            type="button"
            onClick={onToggle}
            className="text-left w-full"
          >
            <p className={`text-sm font-medium leading-relaxed ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
              {highlightedLabel ?? label}
            </p>
          </button>
          {isSelected && (
            <textarea
              value={text || ''}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Ergänzende Details..."
              rows={2}
              className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function InterventionModal({
  isOpen,
  onClose,
  title,
  headerGradient,
  disorderType,
  data,
  labels,
  kapitel6Handlers,
}: InterventionModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCount = Object.values(data).filter(entry => entry?.selected).length;

  const handleClearAll = () => {
    kapitel6Handlers.clearInterventionCategory(disorderType);
  };

  const filterItems = (): [string, string][] => {
    if (!searchQuery.trim()) {
      return Object.entries(labels);
    }
    const query = searchQuery.toLowerCase();
    return Object.entries(labels).filter(([, label]) =>
      label.toLowerCase().includes(query)
    );
  };

  if (!mounted || !isOpen) return null;

  const filteredItems = filterItems();

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl w-[95vw] max-w-3xl max-h-[90vh] flex flex-col">
        <div className={`flex items-center justify-between p-4 border-b ${headerGradient} rounded-t-xl`}>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Suchen..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredItems.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Keine Ergebnisse gefunden</p>
          ) : (
            filteredItems.map(([enumValue, label]) => {
              const entry = data[enumValue];
              const isSelected = entry?.selected === true;
              const text = entry?.details?.text;

              return (
                <InterventionCard
                  key={enumValue}
                  label={label}
                  highlightedLabel={searchQuery ? highlightSearchText(label, searchQuery) : undefined}
                  isSelected={isSelected}
                  text={text}
                  onToggle={() => kapitel6Handlers.toggleIntervention(disorderType, enumValue)}
                  onTextChange={(value) => kapitel6Handlers.setInterventionDetails(disorderType, enumValue, { text: value })}
                />
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between p-4 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={handleClearAll}
            disabled={totalCount === 0}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Alle löschen
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {totalCount} {totalCount === 1 ? 'Intervention' : 'Interventionen'} ausgewählt
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fertig
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
