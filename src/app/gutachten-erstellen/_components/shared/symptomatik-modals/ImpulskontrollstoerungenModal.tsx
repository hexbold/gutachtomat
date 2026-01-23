'use client';

import * as FormTypes from '@/lib/core/form-types';
import { highlightSearchText } from '@/lib/utils/highlight-utils';
import {
  PATHOLOGISCHES_SPIELEN_LABELS,
  PYROMANIE_LABELS,
  KLEPTOMANIE_LABELS,
  TRICHOTILLOMANIE_LABELS,
} from '@/lib/core/form-labels';
import { getFormattedImpulskontrollstoerungen } from '@/lib/utils/impulskontrollstoerungen-counter';
import { SymptomHandlers } from '@/hooks/useGutachtenForm';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ImpulskontrollstoerungenModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  symptomHandlers: SymptomHandlers;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
}

export function ImpulskontrollstoerungenModal({
  isOpen,
  onClose,
  formData,
  symptomHandlers,
  setNestedField
}: ImpulskontrollstoerungenModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Expanded states for CardSelection sections
  const [expandedSpielen, setExpandedSpielen] = useState<Set<FormTypes.PathologischesSpielenSymptom>>(new Set());
  const [expandedPyromanie, setExpandedPyromanie] = useState<Set<FormTypes.PyromanieSymptom>>(new Set());
  const [expandedKleptomanie, setExpandedKleptomanie] = useState<Set<FormTypes.KleptomanieSymptom>>(new Set());
  const [expandedTrichotillomanie, setExpandedTrichotillomanie] = useState<Set<FormTypes.TrichotillomanieSymptom>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  const ik = formData.impulskontrollstoerungen;

  // Use shared utility for footer display
  const allSelectedSymptoms = getFormattedImpulskontrollstoerungen(ik).sort((a, b) => a.localeCompare(b));

  // Filter symptoms by search query
  const filterBySearch = (label: string): boolean => {
    if (!searchQuery.trim()) return true;
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Highlight matching text
  const highlight = (text: string) => highlightSearchText(text, searchQuery);

  // Reset all expanded states
  const resetAllExpanded = () => {
    setExpandedSpielen(new Set());
    setExpandedPyromanie(new Set());
    setExpandedKleptomanie(new Set());
    setExpandedTrichotillomanie(new Set());
  };

  const handleClose = () => {
    setSearchQuery('');
    resetAllExpanded();
    onClose();
  };

  const handleClearAndClose = () => {
    symptomHandlers.clearImpulskontrollstoerungen();
    handleClose();
  };

  // Generic CardSelection toggle handler
  const handleCardToggle = <E extends string>(
    fieldPath: string,
    symptom: E,
    currentSelection: FormTypes.CardSelection<E> | undefined,
    expandedSet: Set<E>,
    setExpanded: React.Dispatch<React.SetStateAction<Set<E>>>
  ) => {
    const newSelection = { ...currentSelection };
    if (newSelection[symptom as keyof typeof newSelection]) {
      delete newSelection[symptom as keyof typeof newSelection];
      if (expandedSet.has(symptom)) {
        const newExpanded = new Set(expandedSet);
        newExpanded.delete(symptom);
        setExpanded(newExpanded);
      }
    } else {
      (newSelection as Record<string, FormTypes.CardSelectionEntry>)[symptom] = { selected: true, details: {} };
    }
    setNestedField(fieldPath, newSelection as unknown as Record<string, unknown>);
  };

  // Generic details change handler
  const handleDetailsChange = <E extends string>(
    fieldPath: string,
    symptom: E,
    field: 'brackets' | 'text',
    value: string,
    currentSelection: FormTypes.CardSelection<E> | undefined
  ) => {
    const currentEntry = currentSelection?.[symptom as keyof typeof currentSelection];
    const newSelection = {
      ...currentSelection,
      [symptom]: {
        selected: true,
        details: { ...currentEntry?.details, [field]: value || undefined }
      }
    };
    setNestedField(fieldPath, newSelection as unknown as Record<string, unknown>);
  };

  if (!isOpen || !mounted) return null;

  // Reusable card rendering helper
  const renderCardSection = <E extends string>(
    title: string,
    enumObj: Record<string, E>,
    labels: Record<E, string>,
    fieldPath: string,
    currentSelection: FormTypes.CardSelection<E> | undefined,
    expandedSet: Set<E>,
    setExpanded: React.Dispatch<React.SetStateAction<Set<E>>>
  ) => {
    const values = Object.values(enumObj) as E[];
    if (!values.some(v => filterBySearch(labels[v])) && !filterBySearch(title)) return null;

    return (
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight(title)}</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {values
            .filter(v => filterBySearch(labels[v]))
            .map((symptom) => {
              const isItemSelected = !!currentSelection?.[symptom as keyof typeof currentSelection]?.selected;
              const isExpanded = expandedSet.has(symptom);
              const details = currentSelection?.[symptom as keyof typeof currentSelection]?.details;
              const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
              return (
                <div key={symptom} className="flex flex-col gap-1.5">
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCardToggle(fieldPath, symptom, currentSelection, expandedSet, setExpanded)}
                      title={labels[symptom]}
                      className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}
                    >
                      {isItemSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      )}
                      <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                        {highlight(labels[symptom])}
                      </span>
                    </button>
                    {isItemSelected && (
                      <button
                        type="button"
                        onClick={() => {
                          const n = new Set(expandedSet);
                          isExpanded ? n.delete(symptom) : n.add(symptom);
                          setExpanded(n);
                        }}
                        className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`}
                        title="Ergänzungen hinzufügen"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {isExpanded && (
                    <div className="flex flex-col gap-1.5">
                      <input
                        type="text"
                        value={details?.brackets || ''}
                        onChange={(e) => handleDetailsChange(fieldPath, symptom, 'brackets', e.target.value, currentSelection)}
                        className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                        placeholder="Spezifikation in Klammern (...)"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={details?.text || ''}
                        onChange={(e) => handleDetailsChange(fieldPath, symptom, 'text', e.target.value, currentSelection)}
                        onBlur={(e) => {
                          const val = e.target.value.trim();
                          if (val && !/[.!?]$/.test(val)) {
                            handleDetailsChange(fieldPath, symptom, 'text', `${val}.`, currentSelection);
                          }
                        }}
                        className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                        placeholder="Vollständigen Satz hinzufügen."
                      />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  const modalContent = (
    <div className="fixed top-36 bottom-4 left-4 right-[46%] z-40 flex items-start justify-center p-2">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-200 w-full max-w-5xl max-h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-900">Impulskontrollstörungen</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearAndClose}
              className="relative group p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              aria-label="Auswahl löschen"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Auswahl löschen
              </span>
            </button>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg cursor-pointer"
            >
              Bestätigen
            </button>
          </div>
        </div>

        {/* Search Field */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Symptome durchsuchen..."
              className="w-full px-4 py-3 pl-10 pr-10 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          <div className="space-y-8">
            {/* Pathologisches Spielen */}
            {renderCardSection(
              'Pathologisches Spielen',
              FormTypes.PathologischesSpielenSymptom,
              PATHOLOGISCHES_SPIELEN_LABELS,
              'impulskontrollstoerungen.pathologischesSpielen',
              ik.pathologischesSpielen,
              expandedSpielen,
              setExpandedSpielen
            )}

            {/* Pyromanie */}
            {renderCardSection(
              'Pyromanie',
              FormTypes.PyromanieSymptom,
              PYROMANIE_LABELS,
              'impulskontrollstoerungen.pyromanie',
              ik.pyromanie,
              expandedPyromanie,
              setExpandedPyromanie
            )}

            {/* Kleptomanie */}
            {renderCardSection(
              'Kleptomanie',
              FormTypes.KleptomanieSymptom,
              KLEPTOMANIE_LABELS,
              'impulskontrollstoerungen.kleptomanie',
              ik.kleptomanie,
              expandedKleptomanie,
              setExpandedKleptomanie
            )}

            {/* Trichotillomanie */}
            {renderCardSection(
              'Trichotillomanie',
              FormTypes.TrichotillomanieSymptom,
              TRICHOTILLOMANIE_LABELS,
              'impulskontrollstoerungen.trichotillomanie',
              ik.trichotillomanie,
              expandedTrichotillomanie,
              setExpandedTrichotillomanie
            )}

            {/* Andere Symptome */}
            {(filterBySearch('Andere') || filterBySearch('Symptome')) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Andere Symptome')}</h3>
                <textarea
                  value={ik.andereSymptome}
                  onChange={(e) => setNestedField('impulskontrollstoerungen.andereSymptome', e.target.value)}
                  rows={3}
                  placeholder="Weitere Impulskontrollstörungen..."
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {allSelectedSymptoms.length > 0 && (
          <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-blue-200">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-700">{allSelectedSymptoms.length} Symptom(e) ausgewählt:</span>{' '}
              <span className="text-gray-600">{allSelectedSymptoms.join(', ')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
