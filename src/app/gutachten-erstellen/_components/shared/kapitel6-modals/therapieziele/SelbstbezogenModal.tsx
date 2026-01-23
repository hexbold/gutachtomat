'use client';

import { Kapitel6Handlers } from '@/hooks/useGutachtenForm';
import { highlightSearchText } from '@/lib/utils/highlight-utils';
import * as FormTypes from '@/lib/core/form-types';
import * as Labels from '@/lib/core/form-labels';
import { countSelbstbezogen } from '@/lib/utils/therapieziele-counter';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface SelbstbezogenModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  kapitel6Handlers: Kapitel6Handlers;
}

interface TherapiezielCardProps {
  label: string;
  highlightedLabel?: React.ReactNode;
  isSelected: boolean;
  brackets?: string;
  onToggle: () => void;
  onBracketsChange: (value: string) => void;
}

function TherapiezielCard({
  label,
  highlightedLabel,
  isSelected,
  brackets,
  onToggle,
  onBracketsChange,
}: TherapiezielCardProps) {
  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={onToggle}
        title={label}
        className={`
          relative w-full p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center
          ${isSelected
            ? 'border-blue-500 bg-blue-50 shadow-sm'
            : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer
        `}
      >
        {isSelected && (
          <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        )}
        <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
          {highlightedLabel ?? label}
        </span>
      </button>
      {isSelected && (
        <input
          type="text"
          value={brackets || ''}
          onChange={(e) => onBracketsChange(e.target.value)}
          placeholder="Ergänzung (erscheint in Klammern)..."
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  count: number;
  matchesSearch?: boolean;
}

function CollapsibleSection({ title, children, isExpanded, onToggle, count, matchesSearch }: CollapsibleSectionProps) {
  return (
    <div className={`border rounded-lg overflow-hidden ${matchesSearch ? 'ring-2 ring-yellow-400' : ''}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-gray-700">{title}</span>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              {count}
            </span>
          )}
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {isExpanded && (
        <div className="p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

const SUBCATEGORIES = [
  { key: 'selbsteinstellung', label: 'Selbsteinstellung', labels: Labels.THERAPIEZIEL_SELBSTEINSTELLUNG_LABELS },
  { key: 'beduerfnisse', label: 'Bedürfnisse', labels: Labels.THERAPIEZIEL_BEDUERFNISSE_LABELS },
  { key: 'leistung', label: 'Leistung', labels: Labels.THERAPIEZIEL_LEISTUNG_LABELS },
  { key: 'gefuehle', label: 'Gefühle', labels: Labels.THERAPIEZIEL_GEFUEHLE_LABELS },
] as const;

export function SelbstbezogenModal({
  isOpen,
  onClose,
  formData,
  kapitel6Handlers,
}: SelbstbezogenModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['selbsteinstellung']));

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = formData.kapitel6.therapieziele.selbstbezogen;
  const totalCount = countSelbstbezogen(data);

  const toggleSection = (key: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleClearAll = () => {
    kapitel6Handlers.clearTherapiezieleCategory('selbstbezogen');
  };

  const filterItems = (labels: Record<string, string>): [string, string][] => {
    if (!searchQuery.trim()) {
      return Object.entries(labels);
    }
    const query = searchQuery.toLowerCase();
    return Object.entries(labels).filter(([, label]) =>
      label.toLowerCase().includes(query)
    );
  };

  const sectionHasMatches = (labels: Record<string, string>): boolean => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return Object.values(labels).some(label => label.toLowerCase().includes(query));
  };

  const getSubcategoryCount = (key: string): number => {
    const subcategoryData = data[key as keyof typeof data] as Record<string, { selected?: true }>;
    return Object.values(subcategoryData).filter(entry => entry?.selected).length;
  };

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl w-[95vw] max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-800">
            Therapieziele: Selbstbezogene Ziele
          </h2>
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
          {SUBCATEGORIES.map(({ key, label, labels }) => {
            const hasMatches = sectionHasMatches(labels);
            if (!hasMatches && searchQuery.trim()) return null;

            const filteredItems = filterItems(labels);
            const subcategoryData = data[key as keyof typeof data] as Record<string, { selected?: true; details?: { brackets?: string } }>;

            return (
              <CollapsibleSection
                key={key}
                title={label}
                isExpanded={expandedSections.has(key) || (searchQuery.trim() !== '' && hasMatches)}
                onToggle={() => toggleSection(key)}
                count={getSubcategoryCount(key)}
                matchesSearch={searchQuery.trim() !== '' && hasMatches}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredItems.map(([enumValue, itemLabel]) => {
                    const entry = subcategoryData[enumValue];
                    const isSelected = entry?.selected === true;
                    const brackets = entry?.details?.brackets;

                    return (
                      <TherapiezielCard
                        key={enumValue}
                        label={itemLabel}
                        highlightedLabel={searchQuery ? highlightSearchText(itemLabel, searchQuery) : undefined}
                        isSelected={isSelected}
                        brackets={brackets}
                        onToggle={() => kapitel6Handlers.toggleTherapieziel('selbstbezogen', key, enumValue)}
                        onBracketsChange={(value) => kapitel6Handlers.setTherapiezielDetails('selbstbezogen', key, enumValue, { brackets: value })}
                      />
                    );
                  })}
                </div>
              </CollapsibleSection>
            );
          })}
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
              {totalCount} {totalCount === 1 ? 'Ziel' : 'Ziele'} ausgewählt
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
