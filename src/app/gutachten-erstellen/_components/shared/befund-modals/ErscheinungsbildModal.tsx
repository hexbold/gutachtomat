'use client';

import * as FormTypes from '@/lib/core/form-types';
import {
  ERSCHEINUNGSBILD_PFLEGEZUSTAND_LABELS,
  ERSCHEINUNGSBILD_KOERPERGERUCH_LABELS,
  ERSCHEINUNGSBILD_KLEIDUNGSSTIL_LABELS,
  ERSCHEINUNGSBILD_KLEIDUNGSZUSTAND_LABELS,
  ERSCHEINUNGSBILD_KLEIDUNGSANGEMESSENHEIT_LABELS,
} from '@/lib/core/form-labels';
import { highlightSearchText } from '@/lib/utils/highlight-utils';
import { BefundHandlers } from '@/hooks/useGutachtenForm';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ErscheinungsbildModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  befundHandlers: BefundHandlers;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
}

export function ErscheinungsbildModal({
  isOpen,
  onClose,
  formData,
  befundHandlers,
  setNestedField,
}: ErscheinungsbildModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Expanded states for CardSelection pattern (one per section)
  const [expandedPflegezustand, setExpandedPflegezustand] = useState<Set<FormTypes.ErscheinungsbildPflegezustand>>(new Set());
  const [expandedKoerpergeruch, setExpandedKoerpergeruch] = useState<Set<FormTypes.ErscheinungsbildKoerpergeruch>>(new Set());
  const [expandedKleidungsstil, setExpandedKleidungsstil] = useState<Set<FormTypes.ErscheinungsbildKleidungsstil>>(new Set());
  const [expandedKleidungszustand, setExpandedKleidungszustand] = useState<Set<FormTypes.ErscheinungsbildKleidungszustand>>(new Set());
  const [expandedKleidungsangemessenheit, setExpandedKleidungsangemessenheit] = useState<Set<FormTypes.ErscheinungsbildKleidungsangemessenheit>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = formData.erscheinungsbild;

  // Count all selected items
  const totalSelected =
    Object.keys(data.pflegezustand || {}).length +
    Object.keys(data.koerpergeruch || {}).length +
    Object.keys(data.kleidungsstil || {}).length +
    Object.keys(data.kleidungszustand || {}).length +
    Object.keys(data.kleidungsangemessenheit || {}).length;

  // Collect all selected labels for the footer
  const getSelectedLabels = (): string[] => {
    const labels: string[] = [];

    for (const key of Object.keys(data.pflegezustand || {}) as FormTypes.ErscheinungsbildPflegezustand[]) {
      labels.push(ERSCHEINUNGSBILD_PFLEGEZUSTAND_LABELS[key]);
    }
    for (const key of Object.keys(data.koerpergeruch || {}) as FormTypes.ErscheinungsbildKoerpergeruch[]) {
      labels.push(ERSCHEINUNGSBILD_KOERPERGERUCH_LABELS[key]);
    }
    for (const key of Object.keys(data.kleidungsstil || {}) as FormTypes.ErscheinungsbildKleidungsstil[]) {
      labels.push(ERSCHEINUNGSBILD_KLEIDUNGSSTIL_LABELS[key]);
    }
    for (const key of Object.keys(data.kleidungszustand || {}) as FormTypes.ErscheinungsbildKleidungszustand[]) {
      labels.push(ERSCHEINUNGSBILD_KLEIDUNGSZUSTAND_LABELS[key]);
    }
    for (const key of Object.keys(data.kleidungsangemessenheit || {}) as FormTypes.ErscheinungsbildKleidungsangemessenheit[]) {
      labels.push(ERSCHEINUNGSBILD_KLEIDUNGSANGEMESSENHEIT_LABELS[key]);
    }

    return labels;
  };

  const filterBySearch = (label: string): boolean => {
    if (!searchQuery.trim()) return true;
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const highlight = (text: string) => highlightSearchText(text, searchQuery);

  // Reset all expanded states helper
  const resetAllExpanded = () => {
    setExpandedPflegezustand(new Set());
    setExpandedKoerpergeruch(new Set());
    setExpandedKleidungsstil(new Set());
    setExpandedKleidungszustand(new Set());
    setExpandedKleidungsangemessenheit(new Set());
  };

  const handleClose = () => {
    setSearchQuery('');
    resetAllExpanded();
    onClose();
  };

  const handleClearAll = () => {
    befundHandlers.clearErscheinungsbild();
    handleClose();
  };

  // Generic CardSelection toggle handler
  const handleCardToggle = <E extends string>(
    fieldPath: string,
    item: E,
    currentSelection: FormTypes.CardSelection<E> | undefined,
    expandedSet: Set<E>,
    setExpanded: React.Dispatch<React.SetStateAction<Set<E>>>
  ) => {
    const newSelection = { ...currentSelection };
    if (newSelection[item as keyof typeof newSelection]) {
      delete newSelection[item as keyof typeof newSelection];
      // Close expanded if deselected
      if (expandedSet.has(item)) {
        const newExpanded = new Set(expandedSet);
        newExpanded.delete(item);
        setExpanded(newExpanded);
      }
    } else {
      (newSelection as Record<string, FormTypes.CardSelectionEntry>)[item] = { selected: true, details: {} };
    }
    setNestedField(fieldPath, newSelection as unknown as Record<string, unknown>);
  };

  // Generic details change handler
  const handleDetailsChange = <E extends string>(
    fieldPath: string,
    item: E,
    field: 'brackets' | 'text',
    value: string,
    currentSelection: FormTypes.CardSelection<E> | undefined
  ) => {
    const currentEntry = currentSelection?.[item as keyof typeof currentSelection];
    const newSelection = {
      ...currentSelection,
      [item]: {
        selected: true,
        details: { ...currentEntry?.details, [field]: value || undefined }
      }
    };
    setNestedField(fieldPath, newSelection as unknown as Record<string, unknown>);
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed top-36 bottom-4 left-4 right-[46%] z-40 flex items-start justify-center p-2">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border-2 border-blue-200 dark:border-blue-800 w-full max-w-5xl max-h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-b-2 border-blue-200 dark:border-blue-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Erscheinungsbild</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearAll}
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

        {/* Search */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Erscheinungsbild durchsuchen..."
              className="w-full px-4 py-3 pl-10 pr-10 border-2 border-blue-200 dark:border-blue-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
          {/* Pflegezustand */}
          {Object.values(FormTypes.ErscheinungsbildPflegezustand).some(v => filterBySearch(ERSCHEINUNGSBILD_PFLEGEZUSTAND_LABELS[v])) && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{highlight('Pflegezustand')}</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.values(FormTypes.ErscheinungsbildPflegezustand)
                  .filter(v => filterBySearch(ERSCHEINUNGSBILD_PFLEGEZUSTAND_LABELS[v]))
                  .map((item) => {
                    const isItemSelected = !!data.pflegezustand?.[item]?.selected;
                    const isExpanded = expandedPflegezustand.has(item);
                    const details = data.pflegezustand?.[item]?.details;
                    const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                    return (
                      <div key={item} className="flex flex-col gap-1.5">
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCardToggle('erscheinungsbild.pflegezustand', item, data.pflegezustand, expandedPflegezustand, setExpandedPflegezustand)}
                            title={ERSCHEINUNGSBILD_PFLEGEZUSTAND_LABELS[item]}
                            className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-sm' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}
                          >
                            {isItemSelected && (
                              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              </div>
                            )}
                            <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                              {highlight(ERSCHEINUNGSBILD_PFLEGEZUSTAND_LABELS[item])}
                            </span>
                          </button>
                          {isItemSelected && (
                            <button
                              type="button"
                              onClick={() => {
                                const newExpanded = new Set(expandedPflegezustand);
                                if (isExpanded) {
                                  newExpanded.delete(item);
                                } else {
                                  newExpanded.add(item);
                                }
                                setExpandedPflegezustand(newExpanded);
                              }}
                              className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-300 dark:border-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`}
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
                              onChange={(e) => handleDetailsChange('erscheinungsbild.pflegezustand', item, 'brackets', e.target.value, data.pflegezustand)}
                              className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-sm"
                              placeholder="Spezifikation in Klammern (...)"
                              autoFocus
                            />
                            <input
                              type="text"
                              value={details?.text || ''}
                              onChange={(e) => handleDetailsChange('erscheinungsbild.pflegezustand', item, 'text', e.target.value, data.pflegezustand)}
                              onBlur={(e) => {
                                const val = e.target.value.trim();
                                if (val && !/[.!?]$/.test(val)) {
                                  handleDetailsChange('erscheinungsbild.pflegezustand', item, 'text', `${val}.`, data.pflegezustand);
                                }
                              }}
                              className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-sm"
                              placeholder="Vollständigen Satz hinzufügen."
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Körpergeruch */}
          {Object.values(FormTypes.ErscheinungsbildKoerpergeruch).some(v => filterBySearch(ERSCHEINUNGSBILD_KOERPERGERUCH_LABELS[v])) && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{highlight('Körpergeruch')}</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.values(FormTypes.ErscheinungsbildKoerpergeruch)
                  .filter(v => filterBySearch(ERSCHEINUNGSBILD_KOERPERGERUCH_LABELS[v]))
                  .map((item) => {
                    const isItemSelected = !!data.koerpergeruch?.[item]?.selected;
                    const isExpanded = expandedKoerpergeruch.has(item);
                    const details = data.koerpergeruch?.[item]?.details;
                    const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                    return (
                      <div key={item} className="flex flex-col gap-1.5">
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCardToggle('erscheinungsbild.koerpergeruch', item, data.koerpergeruch, expandedKoerpergeruch, setExpandedKoerpergeruch)}
                            title={ERSCHEINUNGSBILD_KOERPERGERUCH_LABELS[item]}
                            className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-sm' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}
                          >
                            {isItemSelected && (
                              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              </div>
                            )}
                            <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                              {highlight(ERSCHEINUNGSBILD_KOERPERGERUCH_LABELS[item])}
                            </span>
                          </button>
                          {isItemSelected && (
                            <button
                              type="button"
                              onClick={() => { const n = new Set(expandedKoerpergeruch); isExpanded ? n.delete(item) : n.add(item); setExpandedKoerpergeruch(n); }}
                              className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-300 dark:border-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`}
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
                            <input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('erscheinungsbild.koerpergeruch', item, 'brackets', e.target.value, data.koerpergeruch)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus />
                            <input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('erscheinungsbild.koerpergeruch', item, 'text', e.target.value, data.koerpergeruch)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('erscheinungsbild.koerpergeruch', item, 'text', `${val}.`, data.koerpergeruch); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-sm" placeholder="Vollständigen Satz hinzufügen." />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Kleidungsstil */}
          {Object.values(FormTypes.ErscheinungsbildKleidungsstil).some(v => filterBySearch(ERSCHEINUNGSBILD_KLEIDUNGSSTIL_LABELS[v])) && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{highlight('Kleidungsstil')}</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.values(FormTypes.ErscheinungsbildKleidungsstil)
                  .filter(v => filterBySearch(ERSCHEINUNGSBILD_KLEIDUNGSSTIL_LABELS[v]))
                  .map((item) => {
                    const isItemSelected = !!data.kleidungsstil?.[item]?.selected;
                    const isExpanded = expandedKleidungsstil.has(item);
                    const details = data.kleidungsstil?.[item]?.details;
                    const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                    return (
                      <div key={item} className="flex flex-col gap-1.5">
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCardToggle('erscheinungsbild.kleidungsstil', item, data.kleidungsstil, expandedKleidungsstil, setExpandedKleidungsstil)}
                            title={ERSCHEINUNGSBILD_KLEIDUNGSSTIL_LABELS[item]}
                            className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-sm' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}
                          >
                            {isItemSelected && (
                              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              </div>
                            )}
                            <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                              {highlight(ERSCHEINUNGSBILD_KLEIDUNGSSTIL_LABELS[item])}
                            </span>
                          </button>
                          {isItemSelected && (
                            <button
                              type="button"
                              onClick={() => { const n = new Set(expandedKleidungsstil); isExpanded ? n.delete(item) : n.add(item); setExpandedKleidungsstil(n); }}
                              className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-300 dark:border-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`}
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
                            <input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('erscheinungsbild.kleidungsstil', item, 'brackets', e.target.value, data.kleidungsstil)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus />
                            <input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('erscheinungsbild.kleidungsstil', item, 'text', e.target.value, data.kleidungsstil)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('erscheinungsbild.kleidungsstil', item, 'text', `${val}.`, data.kleidungsstil); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-sm" placeholder="Vollständigen Satz hinzufügen." />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Kleidungszustand */}
          {Object.values(FormTypes.ErscheinungsbildKleidungszustand).some(v => filterBySearch(ERSCHEINUNGSBILD_KLEIDUNGSZUSTAND_LABELS[v])) && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{highlight('Kleidungszustand')}</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.values(FormTypes.ErscheinungsbildKleidungszustand)
                  .filter(v => filterBySearch(ERSCHEINUNGSBILD_KLEIDUNGSZUSTAND_LABELS[v]))
                  .map((item) => {
                    const isItemSelected = !!data.kleidungszustand?.[item]?.selected;
                    const isExpanded = expandedKleidungszustand.has(item);
                    const details = data.kleidungszustand?.[item]?.details;
                    const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                    return (
                      <div key={item} className="flex flex-col gap-1.5">
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCardToggle('erscheinungsbild.kleidungszustand', item, data.kleidungszustand, expandedKleidungszustand, setExpandedKleidungszustand)}
                            title={ERSCHEINUNGSBILD_KLEIDUNGSZUSTAND_LABELS[item]}
                            className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-sm' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}
                          >
                            {isItemSelected && (
                              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              </div>
                            )}
                            <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                              {highlight(ERSCHEINUNGSBILD_KLEIDUNGSZUSTAND_LABELS[item])}
                            </span>
                          </button>
                          {isItemSelected && (
                            <button
                              type="button"
                              onClick={() => { const n = new Set(expandedKleidungszustand); isExpanded ? n.delete(item) : n.add(item); setExpandedKleidungszustand(n); }}
                              className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-300 dark:border-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`}
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
                            <input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('erscheinungsbild.kleidungszustand', item, 'brackets', e.target.value, data.kleidungszustand)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus />
                            <input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('erscheinungsbild.kleidungszustand', item, 'text', e.target.value, data.kleidungszustand)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('erscheinungsbild.kleidungszustand', item, 'text', `${val}.`, data.kleidungszustand); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-sm" placeholder="Vollständigen Satz hinzufügen." />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Kleidungsangemessenheit */}
          {Object.values(FormTypes.ErscheinungsbildKleidungsangemessenheit).some(v => filterBySearch(ERSCHEINUNGSBILD_KLEIDUNGSANGEMESSENHEIT_LABELS[v])) && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{highlight('Kleidungsangemessenheit')}</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.values(FormTypes.ErscheinungsbildKleidungsangemessenheit)
                  .filter(v => filterBySearch(ERSCHEINUNGSBILD_KLEIDUNGSANGEMESSENHEIT_LABELS[v]))
                  .map((item) => {
                    const isItemSelected = !!data.kleidungsangemessenheit?.[item]?.selected;
                    const isExpanded = expandedKleidungsangemessenheit.has(item);
                    const details = data.kleidungsangemessenheit?.[item]?.details;
                    const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                    return (
                      <div key={item} className="flex flex-col gap-1.5">
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCardToggle('erscheinungsbild.kleidungsangemessenheit', item, data.kleidungsangemessenheit, expandedKleidungsangemessenheit, setExpandedKleidungsangemessenheit)}
                            title={ERSCHEINUNGSBILD_KLEIDUNGSANGEMESSENHEIT_LABELS[item]}
                            className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-sm' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}
                          >
                            {isItemSelected && (
                              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              </div>
                            )}
                            <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                              {highlight(ERSCHEINUNGSBILD_KLEIDUNGSANGEMESSENHEIT_LABELS[item])}
                            </span>
                          </button>
                          {isItemSelected && (
                            <button
                              type="button"
                              onClick={() => { const n = new Set(expandedKleidungsangemessenheit); isExpanded ? n.delete(item) : n.add(item); setExpandedKleidungsangemessenheit(n); }}
                              className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-300 dark:border-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`}
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
                            <input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('erscheinungsbild.kleidungsangemessenheit', item, 'brackets', e.target.value, data.kleidungsangemessenheit)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus />
                            <input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('erscheinungsbild.kleidungsangemessenheit', item, 'text', e.target.value, data.kleidungsangemessenheit)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('erscheinungsbild.kleidungsangemessenheit', item, 'text', `${val}.`, data.kleidungsangemessenheit); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-sm" placeholder="Vollständigen Satz hinzufügen." />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {totalSelected > 0 && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              <strong>Ausgewählt ({totalSelected}):</strong> {getSelectedLabels().join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
