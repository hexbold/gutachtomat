'use client';

import * as FormTypes from '@/lib/core/form-types';
import { highlightSearchText } from '@/lib/utils/highlight-utils';
import {
  DEPRESSIVE_STIMMUNG_SYMPTOM_LABELS,
  DEPRESSIVE_ANTRIEB_SYMPTOM_LABELS,
  DEPRESSIVE_SELBSTERLEBEN_SYMPTOM_LABELS,
  DEPRESSIVE_VEGETATIV_SYMPTOM_LABELS,
  DEPRESSIVE_PSYCHOMOTORIK_SYMPTOM_LABELS,
  DEPRESSIVE_KOGNITION_SYMPTOM_LABELS,
  DEPRESSIVES_VERHALTEN_SYMPTOM_LABELS,
  DEPRESSIVE_PSYCHOTISCH_SYMPTOM_LABELS,
  DEPRESSIVE_DISSOCIATIV_SYMPTOM_LABELS,
} from '@/lib/core/form-labels';
import { getFormattedDepressiveSymptoms } from '@/lib/utils/depressive-symptomatik-counter';
import { SymptomHandlers } from '@/hooks/useGutachtenForm';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DepressiveSymptomatikModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  symptomHandlers: SymptomHandlers;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
}


export function DepressiveSymptomatikModal({
  isOpen,
  onClose,
  formData,
  symptomHandlers,
  setNestedField
}: DepressiveSymptomatikModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Expanded states for CardSelection pattern (one per section)
  const [expandedStimmung, setExpandedStimmung] = useState<Set<FormTypes.DepressiveStimmungSymptom>>(new Set());
  const [expandedAntrieb, setExpandedAntrieb] = useState<Set<FormTypes.DepressiveAntriebSymptom>>(new Set());
  const [expandedSelbsterleben, setExpandedSelbsterleben] = useState<Set<FormTypes.DepressiveSelbsterlebenSymptom>>(new Set());
  const [expandedVegetativ, setExpandedVegetativ] = useState<Set<FormTypes.DepressiveVegetativSymptom>>(new Set());
  const [expandedPsychomotorik, setExpandedPsychomotorik] = useState<Set<FormTypes.DepressivePsychomotorikSymptom>>(new Set());
  const [expandedKognition, setExpandedKognition] = useState<Set<FormTypes.DepressiveKognitionSymptom>>(new Set());
  const [expandedVerhalten, setExpandedVerhalten] = useState<Set<FormTypes.DepressivesVerhaltenSymptom>>(new Set());
  const [expandedPsychotisch, setExpandedPsychotisch] = useState<Set<FormTypes.DepressivePsychotischSymptom>>(new Set());
  const [expandedDissoziativ, setExpandedDissoziativ] = useState<Set<FormTypes.DepressiveDissociativSymptom>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  const ds = formData.depressiveSymptomatik;

  // Use shared utility for footer display - single source of truth
  const allSelectedSymptoms = getFormattedDepressiveSymptoms(ds).sort((a, b) => a.localeCompare(b));

  // Filter symptoms by search query
  const filterBySearch = (label: string): boolean => {
    if (!searchQuery.trim()) return true;
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Highlight matching text in yellow (bound to current searchQuery)
  const highlight = (text: string) => highlightSearchText(text, searchQuery);

  // Reset all expanded states helper
  const resetAllExpanded = () => {
    setExpandedStimmung(new Set());
    setExpandedAntrieb(new Set());
    setExpandedSelbsterleben(new Set());
    setExpandedVegetativ(new Set());
    setExpandedPsychomotorik(new Set());
    setExpandedKognition(new Set());
    setExpandedVerhalten(new Set());
    setExpandedPsychotisch(new Set());
    setExpandedDissoziativ(new Set());
  };

  // Handler to close modal and reset local state
  const handleClose = () => {
    setSearchQuery('');
    resetAllExpanded();
    onClose();
  };

  // Handler to clear all selections and close
  const handleClearAndClose = () => {
    // Use shared clear function for consistency with main page
    symptomHandlers.clearDepressiveSymptomatik();
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
      // Close expanded if deselected
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

  const modalContent = (
    <div className="fixed top-36 bottom-4 left-4 right-[46%] z-40 flex items-start justify-center p-2">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-200 w-full max-w-5xl max-h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-900">Depressive Symptomatik</h2>
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
            {/* Stimmung und emotionales Erleben */}
            {Object.values(FormTypes.DepressiveStimmungSymptom).some(v => filterBySearch(DEPRESSIVE_STIMMUNG_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Stimmung und emotionales Erleben')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.DepressiveStimmungSymptom)
                    .filter(v => filterBySearch(DEPRESSIVE_STIMMUNG_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ds.stimmungEmotionalesErleben?.[symptom]?.selected;
                      const isExpanded = expandedStimmung.has(symptom);
                      const details = ds.stimmungEmotionalesErleben?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleCardToggle(
                                'depressiveSymptomatik.stimmungEmotionalesErleben',
                                symptom,
                                ds.stimmungEmotionalesErleben,
                                expandedStimmung,
                                setExpandedStimmung
                              )}
                              title={DEPRESSIVE_STIMMUNG_SYMPTOM_LABELS[symptom]}
                              className={`
                                flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center
                                ${isItemSelected
                                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                                  : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                                }
                                focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer
                              `}
                            >
                              {isItemSelected && (
                                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M5 13l4 4L19 7"></path>
                                  </svg>
                                </div>
                              )}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                                {highlight(DEPRESSIVE_STIMMUNG_SYMPTOM_LABELS[symptom])}
                              </span>
                            </button>
                            {isItemSelected && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newExpanded = new Set(expandedStimmung);
                                  if (isExpanded) {
                                    newExpanded.delete(symptom);
                                  } else {
                                    newExpanded.add(symptom);
                                  }
                                  setExpandedStimmung(newExpanded);
                                }}
                                className={`
                                  px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                                  ${isExpanded || hasDetails
                                    ? 'bg-blue-500 text-white border-blue-600 shadow-sm'
                                    : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
                                  }
                                `}
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
                                onChange={(e) => handleDetailsChange('depressiveSymptomatik.stimmungEmotionalesErleben', symptom, 'brackets', e.target.value, ds.stimmungEmotionalesErleben)}
                                className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                placeholder="Spezifikation in Klammern (...)"
                                autoFocus
                              />
                              <input
                                type="text"
                                value={details?.text || ''}
                                onChange={(e) => handleDetailsChange('depressiveSymptomatik.stimmungEmotionalesErleben', symptom, 'text', e.target.value, ds.stimmungEmotionalesErleben)}
                                onBlur={(e) => {
                                  const val = e.target.value.trim();
                                  if (val && !/[.!?]$/.test(val)) {
                                    handleDetailsChange('depressiveSymptomatik.stimmungEmotionalesErleben', symptom, 'text', `${val}.`, ds.stimmungEmotionalesErleben);
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
            )}

            {/* Antrieb, Energie und Psychomotorik */}
            {Object.values(FormTypes.DepressiveAntriebSymptom).some(v => filterBySearch(DEPRESSIVE_ANTRIEB_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Antrieb, Energie und Psychomotorik')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.DepressiveAntriebSymptom)
                    .filter(v => filterBySearch(DEPRESSIVE_ANTRIEB_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ds.antriebEnergiePsychomotorik?.[symptom]?.selected;
                      const isExpanded = expandedAntrieb.has(symptom);
                      const details = ds.antriebEnergiePsychomotorik?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleCardToggle('depressiveSymptomatik.antriebEnergiePsychomotorik', symptom, ds.antriebEnergiePsychomotorik, expandedAntrieb, setExpandedAntrieb)}
                              title={DEPRESSIVE_ANTRIEB_SYMPTOM_LABELS[symptom]}
                              className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}
                            >
                              {isItemSelected && (
                                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg>
                                </div>
                              )}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>{highlight(DEPRESSIVE_ANTRIEB_SYMPTOM_LABELS[symptom])}</span>
                            </button>
                            {isItemSelected && (
                              <button type="button" onClick={() => { const n = new Set(expandedAntrieb); isExpanded ? n.delete(symptom) : n.add(symptom); setExpandedAntrieb(n); }}
                                className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`} title="Ergänzungen hinzufügen">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </button>
                            )}
                          </div>
                          {isExpanded && (
                            <div className="flex flex-col gap-1.5">
                              <input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('depressiveSymptomatik.antriebEnergiePsychomotorik', symptom, 'brackets', e.target.value, ds.antriebEnergiePsychomotorik)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus />
                              <input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('depressiveSymptomatik.antriebEnergiePsychomotorik', symptom, 'text', e.target.value, ds.antriebEnergiePsychomotorik)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('depressiveSymptomatik.antriebEnergiePsychomotorik', symptom, 'text', `${val}.`, ds.antriebEnergiePsychomotorik); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Vollständigen Satz hinzufügen." />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Selbsterleben */}
            {Object.values(FormTypes.DepressiveSelbsterlebenSymptom).some(v => filterBySearch(DEPRESSIVE_SELBSTERLEBEN_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Selbsterleben')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.DepressiveSelbsterlebenSymptom)
                    .filter(v => filterBySearch(DEPRESSIVE_SELBSTERLEBEN_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ds.selbsterleben?.[symptom]?.selected;
                      const isExpanded = expandedSelbsterleben.has(symptom);
                      const details = ds.selbsterleben?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => handleCardToggle('depressiveSymptomatik.selbsterleben', symptom, ds.selbsterleben, expandedSelbsterleben, setExpandedSelbsterleben)} title={DEPRESSIVE_SELBSTERLEBEN_SYMPTOM_LABELS[symptom]} className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}>
                              {isItemSelected && (<div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg></div>)}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>{highlight(DEPRESSIVE_SELBSTERLEBEN_SYMPTOM_LABELS[symptom])}</span>
                            </button>
                            {isItemSelected && (<button type="button" onClick={() => { const n = new Set(expandedSelbsterleben); isExpanded ? n.delete(symptom) : n.add(symptom); setExpandedSelbsterleben(n); }} className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`} title="Ergänzungen hinzufügen"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>)}
                          </div>
                          {isExpanded && (<div className="flex flex-col gap-1.5"><input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('depressiveSymptomatik.selbsterleben', symptom, 'brackets', e.target.value, ds.selbsterleben)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus /><input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('depressiveSymptomatik.selbsterleben', symptom, 'text', e.target.value, ds.selbsterleben)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('depressiveSymptomatik.selbsterleben', symptom, 'text', `${val}.`, ds.selbsterleben); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Vollständigen Satz hinzufügen." /></div>)}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Somatovegetative Symptome */}
            {Object.values(FormTypes.DepressiveVegetativSymptom).some(v => filterBySearch(DEPRESSIVE_VEGETATIV_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Somatovegetative Symptome')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.DepressiveVegetativSymptom)
                    .filter(v => filterBySearch(DEPRESSIVE_VEGETATIV_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ds.vegetativeSomatischeSymptome?.[symptom]?.selected;
                      const isExpanded = expandedVegetativ.has(symptom);
                      const details = ds.vegetativeSomatischeSymptome?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => handleCardToggle('depressiveSymptomatik.vegetativeSomatischeSymptome', symptom, ds.vegetativeSomatischeSymptome, expandedVegetativ, setExpandedVegetativ)} title={DEPRESSIVE_VEGETATIV_SYMPTOM_LABELS[symptom]} className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}>
                              {isItemSelected && (<div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg></div>)}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>{highlight(DEPRESSIVE_VEGETATIV_SYMPTOM_LABELS[symptom])}</span>
                            </button>
                            {isItemSelected && (<button type="button" onClick={() => { const n = new Set(expandedVegetativ); isExpanded ? n.delete(symptom) : n.add(symptom); setExpandedVegetativ(n); }} className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`} title="Ergänzungen hinzufügen"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>)}
                          </div>
                          {isExpanded && (<div className="flex flex-col gap-1.5"><input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('depressiveSymptomatik.vegetativeSomatischeSymptome', symptom, 'brackets', e.target.value, ds.vegetativeSomatischeSymptome)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus /><input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('depressiveSymptomatik.vegetativeSomatischeSymptome', symptom, 'text', e.target.value, ds.vegetativeSomatischeSymptome)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('depressiveSymptomatik.vegetativeSomatischeSymptome', symptom, 'text', `${val}.`, ds.vegetativeSomatischeSymptome); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Vollständigen Satz hinzufügen." /></div>)}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Psychomotorik */}
            {Object.values(FormTypes.DepressivePsychomotorikSymptom).some(v => filterBySearch(DEPRESSIVE_PSYCHOMOTORIK_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Psychomotorik')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.DepressivePsychomotorikSymptom)
                    .filter(v => filterBySearch(DEPRESSIVE_PSYCHOMOTORIK_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ds.psychomotorischeSymptome?.[symptom]?.selected;
                      const isExpanded = expandedPsychomotorik.has(symptom);
                      const details = ds.psychomotorischeSymptome?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => handleCardToggle('depressiveSymptomatik.psychomotorischeSymptome', symptom, ds.psychomotorischeSymptome, expandedPsychomotorik, setExpandedPsychomotorik)} title={DEPRESSIVE_PSYCHOMOTORIK_SYMPTOM_LABELS[symptom]} className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}>
                              {isItemSelected && (<div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg></div>)}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>{highlight(DEPRESSIVE_PSYCHOMOTORIK_SYMPTOM_LABELS[symptom])}</span>
                            </button>
                            {isItemSelected && (<button type="button" onClick={() => { const n = new Set(expandedPsychomotorik); isExpanded ? n.delete(symptom) : n.add(symptom); setExpandedPsychomotorik(n); }} className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`} title="Ergänzungen hinzufügen"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>)}
                          </div>
                          {isExpanded && (<div className="flex flex-col gap-1.5"><input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('depressiveSymptomatik.psychomotorischeSymptome', symptom, 'brackets', e.target.value, ds.psychomotorischeSymptome)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus /><input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('depressiveSymptomatik.psychomotorischeSymptome', symptom, 'text', e.target.value, ds.psychomotorischeSymptome)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('depressiveSymptomatik.psychomotorischeSymptome', symptom, 'text', `${val}.`, ds.psychomotorischeSymptome); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Vollständigen Satz hinzufügen." /></div>)}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Kognition */}
            {Object.values(FormTypes.DepressiveKognitionSymptom).some(v => filterBySearch(DEPRESSIVE_KOGNITION_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Kognition')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.DepressiveKognitionSymptom)
                    .filter(v => filterBySearch(DEPRESSIVE_KOGNITION_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ds.kognition?.[symptom]?.selected;
                      const isExpanded = expandedKognition.has(symptom);
                      const details = ds.kognition?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => handleCardToggle('depressiveSymptomatik.kognition', symptom, ds.kognition, expandedKognition, setExpandedKognition)} title={DEPRESSIVE_KOGNITION_SYMPTOM_LABELS[symptom]} className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}>
                              {isItemSelected && (<div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg></div>)}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>{highlight(DEPRESSIVE_KOGNITION_SYMPTOM_LABELS[symptom])}</span>
                            </button>
                            {isItemSelected && (<button type="button" onClick={() => { const n = new Set(expandedKognition); isExpanded ? n.delete(symptom) : n.add(symptom); setExpandedKognition(n); }} className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`} title="Ergänzungen hinzufügen"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>)}
                          </div>
                          {isExpanded && (<div className="flex flex-col gap-1.5"><input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('depressiveSymptomatik.kognition', symptom, 'brackets', e.target.value, ds.kognition)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus /><input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('depressiveSymptomatik.kognition', symptom, 'text', e.target.value, ds.kognition)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('depressiveSymptomatik.kognition', symptom, 'text', `${val}.`, ds.kognition); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Vollständigen Satz hinzufügen." /></div>)}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Verhalten */}
            {Object.values(FormTypes.DepressivesVerhaltenSymptom).some(v => filterBySearch(DEPRESSIVES_VERHALTEN_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Verhalten')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.DepressivesVerhaltenSymptom)
                    .filter(v => filterBySearch(DEPRESSIVES_VERHALTEN_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ds.verhalten?.[symptom]?.selected;
                      const isExpanded = expandedVerhalten.has(symptom);
                      const details = ds.verhalten?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => handleCardToggle('depressiveSymptomatik.verhalten', symptom, ds.verhalten, expandedVerhalten, setExpandedVerhalten)} title={DEPRESSIVES_VERHALTEN_SYMPTOM_LABELS[symptom]} className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}>
                              {isItemSelected && (<div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg></div>)}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>{highlight(DEPRESSIVES_VERHALTEN_SYMPTOM_LABELS[symptom])}</span>
                            </button>
                            {isItemSelected && (<button type="button" onClick={() => { const n = new Set(expandedVerhalten); isExpanded ? n.delete(symptom) : n.add(symptom); setExpandedVerhalten(n); }} className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`} title="Ergänzungen hinzufügen"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>)}
                          </div>
                          {isExpanded && (<div className="flex flex-col gap-1.5"><input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('depressiveSymptomatik.verhalten', symptom, 'brackets', e.target.value, ds.verhalten)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus /><input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('depressiveSymptomatik.verhalten', symptom, 'text', e.target.value, ds.verhalten)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('depressiveSymptomatik.verhalten', symptom, 'text', `${val}.`, ds.verhalten); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Vollständigen Satz hinzufügen." /></div>)}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Psychotische Symptome */}
            {Object.values(FormTypes.DepressivePsychotischSymptom).some(v => filterBySearch(DEPRESSIVE_PSYCHOTISCH_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Psychotische Symptome')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.DepressivePsychotischSymptom)
                    .filter(v => filterBySearch(DEPRESSIVE_PSYCHOTISCH_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ds.psychotischeSymptome?.[symptom]?.selected;
                      const isExpanded = expandedPsychotisch.has(symptom);
                      const details = ds.psychotischeSymptome?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => handleCardToggle('depressiveSymptomatik.psychotischeSymptome', symptom, ds.psychotischeSymptome, expandedPsychotisch, setExpandedPsychotisch)} title={DEPRESSIVE_PSYCHOTISCH_SYMPTOM_LABELS[symptom]} className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}>
                              {isItemSelected && (<div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg></div>)}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>{highlight(DEPRESSIVE_PSYCHOTISCH_SYMPTOM_LABELS[symptom])}</span>
                            </button>
                            {isItemSelected && (<button type="button" onClick={() => { const n = new Set(expandedPsychotisch); isExpanded ? n.delete(symptom) : n.add(symptom); setExpandedPsychotisch(n); }} className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`} title="Ergänzungen hinzufügen"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>)}
                          </div>
                          {isExpanded && (<div className="flex flex-col gap-1.5"><input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('depressiveSymptomatik.psychotischeSymptome', symptom, 'brackets', e.target.value, ds.psychotischeSymptome)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus /><input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('depressiveSymptomatik.psychotischeSymptome', symptom, 'text', e.target.value, ds.psychotischeSymptome)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('depressiveSymptomatik.psychotischeSymptome', symptom, 'text', `${val}.`, ds.psychotischeSymptome); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Vollständigen Satz hinzufügen." /></div>)}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Dissoziative Symptome */}
            {Object.values(FormTypes.DepressiveDissociativSymptom).some(v => filterBySearch(DEPRESSIVE_DISSOCIATIV_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Dissoziative Symptome')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.DepressiveDissociativSymptom)
                    .filter(v => filterBySearch(DEPRESSIVE_DISSOCIATIV_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ds.dissoziativeSymptome?.[symptom]?.selected;
                      const isExpanded = expandedDissoziativ.has(symptom);
                      const details = ds.dissoziativeSymptome?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => handleCardToggle('depressiveSymptomatik.dissoziativeSymptome', symptom, ds.dissoziativeSymptome, expandedDissoziativ, setExpandedDissoziativ)} title={DEPRESSIVE_DISSOCIATIV_SYMPTOM_LABELS[symptom]} className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}>
                              {isItemSelected && (<div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg></div>)}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>{highlight(DEPRESSIVE_DISSOCIATIV_SYMPTOM_LABELS[symptom])}</span>
                            </button>
                            {isItemSelected && (<button type="button" onClick={() => { const n = new Set(expandedDissoziativ); isExpanded ? n.delete(symptom) : n.add(symptom); setExpandedDissoziativ(n); }} className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`} title="Ergänzungen hinzufügen"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>)}
                          </div>
                          {isExpanded && (<div className="flex flex-col gap-1.5"><input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('depressiveSymptomatik.dissoziativeSymptome', symptom, 'brackets', e.target.value, ds.dissoziativeSymptome)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus /><input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('depressiveSymptomatik.dissoziativeSymptome', symptom, 'text', e.target.value, ds.dissoziativeSymptome)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('depressiveSymptomatik.dissoziativeSymptome', symptom, 'text', `${val}.`, ds.dissoziativeSymptome); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Vollständigen Satz hinzufügen." /></div>)}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Andere Symptome - Text Field */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                Andere
              </label>
              <textarea
                value={ds.andereSymptome}
                onChange={(e) =>
                  symptomHandlers.setNestedTextField('depressiveSymptomatik.andereSymptome', e.target.value)
                }
                rows={4}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/30 hover:bg-blue-50/50 transition-colors"
                placeholder="Weitere Symptome hier eintragen..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        {allSelectedSymptoms.length > 0 && (
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-blue-200">
            <div className="text-sm text-gray-600 line-clamp-2">
              <span className="font-semibold text-gray-700">Ausgewählte Symptome ({allSelectedSymptoms.length}): </span>
              {allSelectedSymptoms.join(', ')}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
