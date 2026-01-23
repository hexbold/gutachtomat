'use client';

import * as FormTypes from '@/lib/core/form-types';
import { highlightSearchText } from '@/lib/utils/highlight-utils';
import {
  TRAUMA_WIEDERERLEBEN_SYMPTOM_LABELS,
  TRAUMA_VERMEIDUNG_SYMPTOM_LABELS,
  TRAUMA_VERHALTEN_SYMPTOM_LABELS,
  TRAUMA_UEBERERREGUNG_SYMPTOM_LABELS,
  TRAUMA_SOMATOVEGETATIV_SYMPTOM_LABELS,
  TRAUMA_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS,
  TRAUMA_DISSOCIATIV_SYMPTOM_LABELS,
  TRAUMA_KOGNITION_SYMPTOM_LABELS,
  ANPASSUNGSSTOERUNG_SYMPTOM_LABELS,
} from '@/lib/core/form-labels';
import { getFormattedTraumaSymptoms } from '@/lib/utils/trauma-symptomatik-counter';
import { SymptomHandlers } from '@/hooks/useGutachtenForm';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TraumafolgesymptomatikModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  symptomHandlers: SymptomHandlers;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
}


export function TraumafolgesymptomatikModal({
  isOpen,
  onClose,
  formData,
  symptomHandlers,
  setNestedField
}: TraumafolgesymptomatikModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Expanded states for CardSelection pattern (one per section)
  const [expandedWiedererleben, setExpandedWiedererleben] = useState<Set<FormTypes.TraumaWiederErlebenSymptom>>(new Set());
  const [expandedVermeidung, setExpandedVermeidung] = useState<Set<FormTypes.TraumaVermeidungSymptom>>(new Set());
  const [expandedVerhalten, setExpandedVerhalten] = useState<Set<FormTypes.TraumaVerhaltenSymptom>>(new Set());
  const [expandedUebererregung, setExpandedUebererregung] = useState<Set<FormTypes.TraumaUebererregungSymptom>>(new Set());
  const [expandedSomatovegetativ, setExpandedSomatovegetativ] = useState<Set<FormTypes.TraumaSomatovegetativSymptom>>(new Set());
  const [expandedEmotionales, setExpandedEmotionales] = useState<Set<FormTypes.TraumaEmotionalesErlebenSymptom>>(new Set());
  const [expandedDissoziativ, setExpandedDissoziativ] = useState<Set<FormTypes.TraumaDissociativSymptom>>(new Set());
  const [expandedKognition, setExpandedKognition] = useState<Set<FormTypes.TraumaKognitionSymptom>>(new Set());
  const [expandedAnpassung, setExpandedAnpassung] = useState<Set<FormTypes.AnpassungsstoerungSymptom>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  const ts = formData.traumafolgesymptomatik;

  // Use shared utility for footer display - single source of truth
  const allSelectedSymptoms = getFormattedTraumaSymptoms(ts).sort((a, b) => a.localeCompare(b));

  // Filter symptoms by search query
  const filterBySearch = (label: string): boolean => {
    if (!searchQuery.trim()) return true;
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Highlight matching text in yellow (bound to current searchQuery)
  const highlight = (text: string) => highlightSearchText(text, searchQuery);

  // Reset all expanded states helper
  const resetAllExpanded = () => {
    setExpandedWiedererleben(new Set());
    setExpandedVermeidung(new Set());
    setExpandedVerhalten(new Set());
    setExpandedUebererregung(new Set());
    setExpandedSomatovegetativ(new Set());
    setExpandedEmotionales(new Set());
    setExpandedDissoziativ(new Set());
    setExpandedKognition(new Set());
    setExpandedAnpassung(new Set());
  };

  // Handler to close modal and reset local state
  const handleClose = () => {
    setSearchQuery('');
    resetAllExpanded();
    onClose();
  };

  // Handler to clear all selections and close
  const handleClearAndClose = () => {
    symptomHandlers.clearTraumafolgesymptomatik();
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
          <h2 className="text-2xl font-bold text-blue-900">Traumafolgesymptomatik</h2>
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
            {/* Wiedererleben des Traumas */}
            {Object.values(FormTypes.TraumaWiederErlebenSymptom).some(v => filterBySearch(TRAUMA_WIEDERERLEBEN_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Wiedererleben des Traumas')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.TraumaWiederErlebenSymptom)
                    .filter(v => filterBySearch(TRAUMA_WIEDERERLEBEN_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ts.wiedererleben?.[symptom]?.selected;
                      const isExpanded = expandedWiedererleben.has(symptom);
                      const details = ts.wiedererleben?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleCardToggle(
                                'traumafolgesymptomatik.wiedererleben',
                                symptom,
                                ts.wiedererleben,
                                expandedWiedererleben,
                                setExpandedWiedererleben
                              )}
                              title={TRAUMA_WIEDERERLEBEN_SYMPTOM_LABELS[symptom]}
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
                                {highlight(TRAUMA_WIEDERERLEBEN_SYMPTOM_LABELS[symptom])}
                              </span>
                            </button>
                            {isItemSelected && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newExpanded = new Set(expandedWiedererleben);
                                  if (isExpanded) {
                                    newExpanded.delete(symptom);
                                  } else {
                                    newExpanded.add(symptom);
                                  }
                                  setExpandedWiedererleben(newExpanded);
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
                                onChange={(e) => handleDetailsChange('traumafolgesymptomatik.wiedererleben', symptom, 'brackets', e.target.value, ts.wiedererleben)}
                                className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                placeholder="Spezifikation in Klammern (...)"
                                autoFocus
                              />
                              <input
                                type="text"
                                value={details?.text || ''}
                                onChange={(e) => handleDetailsChange('traumafolgesymptomatik.wiedererleben', symptom, 'text', e.target.value, ts.wiedererleben)}
                                onBlur={(e) => {
                                  const val = e.target.value.trim();
                                  if (val && !/[.!?]$/.test(val)) {
                                    handleDetailsChange('traumafolgesymptomatik.wiedererleben', symptom, 'text', `${val}.`, ts.wiedererleben);
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

            {/* Vermeidungsverhalten */}
            {Object.values(FormTypes.TraumaVermeidungSymptom).some(v => filterBySearch(TRAUMA_VERMEIDUNG_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Vermeidungsverhalten')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.TraumaVermeidungSymptom)
                    .filter(v => filterBySearch(TRAUMA_VERMEIDUNG_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ts.vermeidungsverhalten?.[symptom]?.selected;
                      const isExpanded = expandedVermeidung.has(symptom);
                      const details = ts.vermeidungsverhalten?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => handleCardToggle('traumafolgesymptomatik.vermeidungsverhalten', symptom, ts.vermeidungsverhalten, expandedVermeidung, setExpandedVermeidung)} title={TRAUMA_VERMEIDUNG_SYMPTOM_LABELS[symptom]} className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}>
                              {isItemSelected && (<div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg></div>)}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>{highlight(TRAUMA_VERMEIDUNG_SYMPTOM_LABELS[symptom])}</span>
                            </button>
                            {isItemSelected && (<button type="button" onClick={() => { const n = new Set(expandedVermeidung); isExpanded ? n.delete(symptom) : n.add(symptom); setExpandedVermeidung(n); }} className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`} title="Ergänzungen hinzufügen"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>)}
                          </div>
                          {isExpanded && (<div className="flex flex-col gap-1.5"><input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('traumafolgesymptomatik.vermeidungsverhalten', symptom, 'brackets', e.target.value, ts.vermeidungsverhalten)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus /><input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('traumafolgesymptomatik.vermeidungsverhalten', symptom, 'text', e.target.value, ts.vermeidungsverhalten)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('traumafolgesymptomatik.vermeidungsverhalten', symptom, 'text', `${val}.`, ts.vermeidungsverhalten); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Vollständigen Satz hinzufügen." /></div>)}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Verhalten */}
            {Object.values(FormTypes.TraumaVerhaltenSymptom).some(v => filterBySearch(TRAUMA_VERHALTEN_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Verhalten')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.TraumaVerhaltenSymptom)
                    .filter(v => filterBySearch(TRAUMA_VERHALTEN_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ts.verhalten?.[symptom]?.selected;
                      const isExpanded = expandedVerhalten.has(symptom);
                      const details = ts.verhalten?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => handleCardToggle('traumafolgesymptomatik.verhalten', symptom, ts.verhalten, expandedVerhalten, setExpandedVerhalten)} title={TRAUMA_VERHALTEN_SYMPTOM_LABELS[symptom]} className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}>
                              {isItemSelected && (<div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg></div>)}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>{highlight(TRAUMA_VERHALTEN_SYMPTOM_LABELS[symptom])}</span>
                            </button>
                            {isItemSelected && (<button type="button" onClick={() => { const n = new Set(expandedVerhalten); isExpanded ? n.delete(symptom) : n.add(symptom); setExpandedVerhalten(n); }} className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`} title="Ergänzungen hinzufügen"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>)}
                          </div>
                          {isExpanded && (<div className="flex flex-col gap-1.5"><input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('traumafolgesymptomatik.verhalten', symptom, 'brackets', e.target.value, ts.verhalten)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus /><input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('traumafolgesymptomatik.verhalten', symptom, 'text', e.target.value, ts.verhalten)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('traumafolgesymptomatik.verhalten', symptom, 'text', `${val}.`, ts.verhalten); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Vollständigen Satz hinzufügen." /></div>)}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Übererregung */}
            {Object.values(FormTypes.TraumaUebererregungSymptom).some(v => filterBySearch(TRAUMA_UEBERERREGUNG_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Übererregung')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.TraumaUebererregungSymptom)
                    .filter(v => filterBySearch(TRAUMA_UEBERERREGUNG_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ts.uebererregung?.[symptom]?.selected;
                      const isExpanded = expandedUebererregung.has(symptom);
                      const details = ts.uebererregung?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => handleCardToggle('traumafolgesymptomatik.uebererregung', symptom, ts.uebererregung, expandedUebererregung, setExpandedUebererregung)} title={TRAUMA_UEBERERREGUNG_SYMPTOM_LABELS[symptom]} className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}>
                              {isItemSelected && (<div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg></div>)}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>{highlight(TRAUMA_UEBERERREGUNG_SYMPTOM_LABELS[symptom])}</span>
                            </button>
                            {isItemSelected && (<button type="button" onClick={() => { const n = new Set(expandedUebererregung); isExpanded ? n.delete(symptom) : n.add(symptom); setExpandedUebererregung(n); }} className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`} title="Ergänzungen hinzufügen"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>)}
                          </div>
                          {isExpanded && (<div className="flex flex-col gap-1.5"><input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('traumafolgesymptomatik.uebererregung', symptom, 'brackets', e.target.value, ts.uebererregung)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus /><input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('traumafolgesymptomatik.uebererregung', symptom, 'text', e.target.value, ts.uebererregung)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('traumafolgesymptomatik.uebererregung', symptom, 'text', `${val}.`, ts.uebererregung); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Vollständigen Satz hinzufügen." /></div>)}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Somatovegetative Symptome */}
            {Object.values(FormTypes.TraumaSomatovegetativSymptom).some(v => filterBySearch(TRAUMA_SOMATOVEGETATIV_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Somatovegetative Symptome')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.TraumaSomatovegetativSymptom)
                    .filter(v => filterBySearch(TRAUMA_SOMATOVEGETATIV_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ts.somatovegetativ?.[symptom]?.selected;
                      const isExpanded = expandedSomatovegetativ.has(symptom);
                      const details = ts.somatovegetativ?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => handleCardToggle('traumafolgesymptomatik.somatovegetativ', symptom, ts.somatovegetativ, expandedSomatovegetativ, setExpandedSomatovegetativ)} title={TRAUMA_SOMATOVEGETATIV_SYMPTOM_LABELS[symptom]} className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}>
                              {isItemSelected && (<div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg></div>)}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>{highlight(TRAUMA_SOMATOVEGETATIV_SYMPTOM_LABELS[symptom])}</span>
                            </button>
                            {isItemSelected && (<button type="button" onClick={() => { const n = new Set(expandedSomatovegetativ); isExpanded ? n.delete(symptom) : n.add(symptom); setExpandedSomatovegetativ(n); }} className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`} title="Ergänzungen hinzufügen"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>)}
                          </div>
                          {isExpanded && (<div className="flex flex-col gap-1.5"><input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('traumafolgesymptomatik.somatovegetativ', symptom, 'brackets', e.target.value, ts.somatovegetativ)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus /><input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('traumafolgesymptomatik.somatovegetativ', symptom, 'text', e.target.value, ts.somatovegetativ)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('traumafolgesymptomatik.somatovegetativ', symptom, 'text', `${val}.`, ts.somatovegetativ); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Vollständigen Satz hinzufügen." /></div>)}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Emotionales Erleben */}
            {Object.values(FormTypes.TraumaEmotionalesErlebenSymptom).some(v => filterBySearch(TRAUMA_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Emotionales Erleben')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.TraumaEmotionalesErlebenSymptom)
                    .filter(v => filterBySearch(TRAUMA_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ts.emotionalesErleben?.[symptom]?.selected;
                      const isExpanded = expandedEmotionales.has(symptom);
                      const details = ts.emotionalesErleben?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => handleCardToggle('traumafolgesymptomatik.emotionalesErleben', symptom, ts.emotionalesErleben, expandedEmotionales, setExpandedEmotionales)} title={TRAUMA_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS[symptom]} className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}>
                              {isItemSelected && (<div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg></div>)}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>{highlight(TRAUMA_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS[symptom])}</span>
                            </button>
                            {isItemSelected && (<button type="button" onClick={() => { const n = new Set(expandedEmotionales); isExpanded ? n.delete(symptom) : n.add(symptom); setExpandedEmotionales(n); }} className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`} title="Ergänzungen hinzufügen"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>)}
                          </div>
                          {isExpanded && (<div className="flex flex-col gap-1.5"><input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('traumafolgesymptomatik.emotionalesErleben', symptom, 'brackets', e.target.value, ts.emotionalesErleben)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus /><input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('traumafolgesymptomatik.emotionalesErleben', symptom, 'text', e.target.value, ts.emotionalesErleben)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('traumafolgesymptomatik.emotionalesErleben', symptom, 'text', `${val}.`, ts.emotionalesErleben); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Vollständigen Satz hinzufügen." /></div>)}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Dissoziative Symptome */}
            {Object.values(FormTypes.TraumaDissociativSymptom).some(v => filterBySearch(TRAUMA_DISSOCIATIV_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Dissoziative Symptome')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.TraumaDissociativSymptom)
                    .filter(v => filterBySearch(TRAUMA_DISSOCIATIV_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ts.dissoziativ?.[symptom]?.selected;
                      const isExpanded = expandedDissoziativ.has(symptom);
                      const details = ts.dissoziativ?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => handleCardToggle('traumafolgesymptomatik.dissoziativ', symptom, ts.dissoziativ, expandedDissoziativ, setExpandedDissoziativ)} title={TRAUMA_DISSOCIATIV_SYMPTOM_LABELS[symptom]} className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}>
                              {isItemSelected && (<div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg></div>)}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>{highlight(TRAUMA_DISSOCIATIV_SYMPTOM_LABELS[symptom])}</span>
                            </button>
                            {isItemSelected && (<button type="button" onClick={() => { const n = new Set(expandedDissoziativ); isExpanded ? n.delete(symptom) : n.add(symptom); setExpandedDissoziativ(n); }} className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`} title="Ergänzungen hinzufügen"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>)}
                          </div>
                          {isExpanded && (<div className="flex flex-col gap-1.5"><input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('traumafolgesymptomatik.dissoziativ', symptom, 'brackets', e.target.value, ts.dissoziativ)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus /><input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('traumafolgesymptomatik.dissoziativ', symptom, 'text', e.target.value, ts.dissoziativ)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('traumafolgesymptomatik.dissoziativ', symptom, 'text', `${val}.`, ts.dissoziativ); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Vollständigen Satz hinzufügen." /></div>)}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Kognition */}
            {Object.values(FormTypes.TraumaKognitionSymptom).some(v => filterBySearch(TRAUMA_KOGNITION_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Kognition')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.TraumaKognitionSymptom)
                    .filter(v => filterBySearch(TRAUMA_KOGNITION_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ts.kognition?.[symptom]?.selected;
                      const isExpanded = expandedKognition.has(symptom);
                      const details = ts.kognition?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => handleCardToggle('traumafolgesymptomatik.kognition', symptom, ts.kognition, expandedKognition, setExpandedKognition)} title={TRAUMA_KOGNITION_SYMPTOM_LABELS[symptom]} className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}>
                              {isItemSelected && (<div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg></div>)}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>{highlight(TRAUMA_KOGNITION_SYMPTOM_LABELS[symptom])}</span>
                            </button>
                            {isItemSelected && (<button type="button" onClick={() => { const n = new Set(expandedKognition); isExpanded ? n.delete(symptom) : n.add(symptom); setExpandedKognition(n); }} className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`} title="Ergänzungen hinzufügen"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>)}
                          </div>
                          {isExpanded && (<div className="flex flex-col gap-1.5"><input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('traumafolgesymptomatik.kognition', symptom, 'brackets', e.target.value, ts.kognition)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus /><input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('traumafolgesymptomatik.kognition', symptom, 'text', e.target.value, ts.kognition)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('traumafolgesymptomatik.kognition', symptom, 'text', `${val}.`, ts.kognition); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Vollständigen Satz hinzufügen." /></div>)}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Anpassungsstörungspezifische Symptome */}
            {Object.values(FormTypes.AnpassungsstoerungSymptom).some(v => filterBySearch(ANPASSUNGSSTOERUNG_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Anpassungsstörungspezifische Symptome')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.AnpassungsstoerungSymptom)
                    .filter(v => filterBySearch(ANPASSUNGSSTOERUNG_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ts.anpassungsstoerung?.[symptom]?.selected;
                      const isExpanded = expandedAnpassung.has(symptom);
                      const details = ts.anpassungsstoerung?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => handleCardToggle('traumafolgesymptomatik.anpassungsstoerung', symptom, ts.anpassungsstoerung, expandedAnpassung, setExpandedAnpassung)} title={ANPASSUNGSSTOERUNG_SYMPTOM_LABELS[symptom]} className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${isItemSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'} focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}>
                              {isItemSelected && (<div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg></div>)}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>{highlight(ANPASSUNGSSTOERUNG_SYMPTOM_LABELS[symptom])}</span>
                            </button>
                            {isItemSelected && (<button type="button" onClick={() => { const n = new Set(expandedAnpassung); isExpanded ? n.delete(symptom) : n.add(symptom); setExpandedAnpassung(n); }} className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isExpanded || hasDetails ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'}`} title="Ergänzungen hinzufügen"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>)}
                          </div>
                          {isExpanded && (<div className="flex flex-col gap-1.5"><input type="text" value={details?.brackets || ''} onChange={(e) => handleDetailsChange('traumafolgesymptomatik.anpassungsstoerung', symptom, 'brackets', e.target.value, ts.anpassungsstoerung)} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Spezifikation in Klammern (...)" autoFocus /><input type="text" value={details?.text || ''} onChange={(e) => handleDetailsChange('traumafolgesymptomatik.anpassungsstoerung', symptom, 'text', e.target.value, ts.anpassungsstoerung)} onBlur={(e) => { const val = e.target.value.trim(); if (val && !/[.!?]$/.test(val)) handleDetailsChange('traumafolgesymptomatik.anpassungsstoerung', symptom, 'text', `${val}.`, ts.anpassungsstoerung); }} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm" placeholder="Vollständigen Satz hinzufügen." /></div>)}
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
                value={ts.andereSymptome}
                onChange={(e) =>
                  symptomHandlers.setNestedTextField('traumafolgesymptomatik.andereSymptome', e.target.value)
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
