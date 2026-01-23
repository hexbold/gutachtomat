'use client';

import * as FormTypes from '@/lib/core/form-types';
import { highlightSearchText } from '@/lib/utils/highlight-utils';
import {
  FORMALE_WAHNMERKMALE_LABELS,
  INHALTLICHE_WAHNMERKMALE_LABELS,
  STIMMEN_HOEREN_TYP_LABELS,
  ANDERE_HALLUZINATION_TYP_LABELS,
  ICH_HAFTIGKEIT_SYMPTOM_LABELS,
  ICH_STOERUNG_ANDERE_SYMPTOM_LABELS,
  FORMALE_DENKSTOERUNG_SYMPTOM_LABELS,
  PSYCHOTISCH_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS,
  PSYCHOTISCH_VERHALTEN_SYMPTOM_LABELS,
  PSYCHOTISCH_KOGNITION_SYMPTOM_LABELS,
  KATATONE_SYMPTOM_LABELS,
} from '@/lib/core/form-labels';
import { getFormattedPsychotischeSymptoms } from '@/lib/utils/psychotische-symptomatik-counter';
import { SymptomHandlers } from '@/hooks/useGutachtenForm';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface PsychotischeSymptomatikModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  symptomHandlers: SymptomHandlers;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
}

export function PsychotischeSymptomatikModal({
  isOpen,
  onClose,
  formData,
  symptomHandlers,
  setNestedField
}: PsychotischeSymptomatikModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Expanded states for CardSelection sections
  const [expandedFormaleWahn, setExpandedFormaleWahn] = useState<Set<FormTypes.FormaleWahnmerkmale>>(new Set());
  const [expandedInhaltlicheWahn, setExpandedInhaltlicheWahn] = useState<Set<FormTypes.InhaltlicheWahnmerkmale>>(new Set());
  const [expandedStimmenHoeren, setExpandedStimmenHoeren] = useState<Set<FormTypes.StimmenHoerenTyp>>(new Set());
  const [expandedAndereHalluz, setExpandedAndereHalluz] = useState<Set<FormTypes.AndereHalluzinationTyp>>(new Set());
  const [expandedIchHaftigkeit, setExpandedIchHaftigkeit] = useState<Set<FormTypes.IchHaftigkeitSymptom>>(new Set());
  const [expandedIchStoerungAndere, setExpandedIchStoerungAndere] = useState<Set<FormTypes.IchStoerungAndereSymptom>>(new Set());
  const [expandedFormaleDenk, setExpandedFormaleDenk] = useState<Set<FormTypes.FormaleDenkstoerungSymptom>>(new Set());
  const [expandedEmotionales, setExpandedEmotionales] = useState<Set<FormTypes.PsychotischEmotionalesErlebenSymptom>>(new Set());
  const [expandedVerhalten, setExpandedVerhalten] = useState<Set<FormTypes.PsychotischVerhaltenSymptom>>(new Set());
  const [expandedKognition, setExpandedKognition] = useState<Set<FormTypes.PsychotischKognitionSymptom>>(new Set());
  const [expandedKatatone, setExpandedKatatone] = useState<Set<FormTypes.KatatoneSymptom>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  const ps = formData.psychotischeSymptomatik;

  // Use shared utility for footer display
  const allSelectedSymptoms = getFormattedPsychotischeSymptoms(ps).sort((a, b) => a.localeCompare(b));

  // Filter symptoms by search query
  const filterBySearch = (label: string): boolean => {
    if (!searchQuery.trim()) return true;
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Highlight matching text
  const highlight = (text: string) => highlightSearchText(text, searchQuery);

  // Reset all expanded states
  const resetAllExpanded = () => {
    setExpandedFormaleWahn(new Set());
    setExpandedInhaltlicheWahn(new Set());
    setExpandedStimmenHoeren(new Set());
    setExpandedAndereHalluz(new Set());
    setExpandedIchHaftigkeit(new Set());
    setExpandedIchStoerungAndere(new Set());
    setExpandedFormaleDenk(new Set());
    setExpandedEmotionales(new Set());
    setExpandedVerhalten(new Set());
    setExpandedKognition(new Set());
    setExpandedKatatone(new Set());
  };

  const handleClose = () => {
    setSearchQuery('');
    resetAllExpanded();
    onClose();
  };

  const handleClearAndClose = () => {
    symptomHandlers.clearPsychotischeSymptomatik();
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

  // Special handlers for akustischeHalluzination discriminated union
  const handleAkustischeTypeChange = (newType: 'none' | 'stimmenhoeren' | 'akoasmen') => {
    if (newType === 'none') {
      setNestedField('psychotischeSymptomatik.akustischeHalluzination', { type: 'none' });
    } else if (newType === 'stimmenhoeren') {
      setNestedField('psychotischeSymptomatik.akustischeHalluzination', { type: 'stimmenhoeren', subtypes: {} });
    } else {
      setNestedField('psychotischeSymptomatik.akustischeHalluzination', { type: 'akoasmen' });
    }
    setExpandedStimmenHoeren(new Set());
  };

  // Handler for Stimmenhören subtypes
  const handleStimmenHoerenToggle = (symptom: FormTypes.StimmenHoerenTyp) => {
    if (ps.akustischeHalluzination.type !== 'stimmenhoeren') return;
    const subtypes = ps.akustischeHalluzination.subtypes;
    const newSubtypes = { ...subtypes };
    if (newSubtypes[symptom]) {
      delete newSubtypes[symptom];
      if (expandedStimmenHoeren.has(symptom)) {
        const newExpanded = new Set(expandedStimmenHoeren);
        newExpanded.delete(symptom);
        setExpandedStimmenHoeren(newExpanded);
      }
    } else {
      (newSubtypes as Record<string, FormTypes.CardSelectionEntry>)[symptom] = { selected: true, details: {} };
    }
    setNestedField('psychotischeSymptomatik.akustischeHalluzination', { type: 'stimmenhoeren', subtypes: newSubtypes });
  };

  const handleStimmenHoerenDetailsChange = (
    symptom: FormTypes.StimmenHoerenTyp,
    field: 'brackets' | 'text',
    value: string
  ) => {
    if (ps.akustischeHalluzination.type !== 'stimmenhoeren') return;
    const subtypes = ps.akustischeHalluzination.subtypes;
    const currentEntry = subtypes[symptom];
    const newSubtypes = {
      ...subtypes,
      [symptom]: {
        selected: true,
        details: { ...currentEntry?.details, [field]: value || undefined }
      }
    };
    setNestedField('psychotischeSymptomatik.akustischeHalluzination', { type: 'stimmenhoeren', subtypes: newSubtypes });
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
    if (!values.some(v => filterBySearch(labels[v]))) return null;

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
          <h2 className="text-2xl font-bold text-blue-900">Psychotische Symptomatik</h2>
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
            {/* Wahnhafte Symptome Header */}
            {(Object.values(FormTypes.FormaleWahnmerkmale).some(v => filterBySearch(FORMALE_WAHNMERKMALE_LABELS[v])) ||
              Object.values(FormTypes.InhaltlicheWahnmerkmale).some(v => filterBySearch(INHALTLICHE_WAHNMERKMALE_LABELS[v]))) && (
              <div className="border-b-2 border-gray-200 pb-2">
                <h2 className="text-xl font-bold text-gray-800">{highlight('Wahnhafte Symptome')}</h2>
              </div>
            )}

            {/* Formale Wahnmerkmale */}
            {renderCardSection(
              'Formale Wahnmerkmale',
              FormTypes.FormaleWahnmerkmale,
              FORMALE_WAHNMERKMALE_LABELS,
              'psychotischeSymptomatik.formaleWahnmerkmale',
              ps.formaleWahnmerkmale,
              expandedFormaleWahn,
              setExpandedFormaleWahn
            )}

            {/* Inhaltliche Wahnmerkmale */}
            {renderCardSection(
              'Inhaltliche Wahnmerkmale',
              FormTypes.InhaltlicheWahnmerkmale,
              INHALTLICHE_WAHNMERKMALE_LABELS,
              'psychotischeSymptomatik.inhaltlicheWahnmerkmale',
              ps.inhaltlicheWahnmerkmale,
              expandedInhaltlicheWahn,
              setExpandedInhaltlicheWahn
            )}

            {/* Halluzinatorische Symptome Header */}
            {(filterBySearch('Akustische Halluzinationen') ||
              filterBySearch('Stimmenhören') ||
              filterBySearch('Akoasmen') ||
              Object.values(FormTypes.StimmenHoerenTyp).some(v => filterBySearch(STIMMEN_HOEREN_TYP_LABELS[v])) ||
              Object.values(FormTypes.AndereHalluzinationTyp).some(v => filterBySearch(ANDERE_HALLUZINATION_TYP_LABELS[v]))) && (
              <div className="border-b-2 border-gray-200 pb-2 pt-4">
                <h2 className="text-xl font-bold text-gray-800">{highlight('Halluzinatorische Symptome')}</h2>
              </div>
            )}

            {/* Akustische Halluzinationen - Special discriminated union handling */}
            {(filterBySearch('Akustische Halluzinationen') || filterBySearch('Stimmenhören') || filterBySearch('Akoasmen') ||
              Object.values(FormTypes.StimmenHoerenTyp).some(v => filterBySearch(STIMMEN_HOEREN_TYP_LABELS[v]))) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Akustische Halluzinationen')}</h3>
                <div className="space-y-4">
                  {/* Type selection: None / Stimmenhören / Akoasmen */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleAkustischeTypeChange('none')}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${ps.akustischeHalluzination.type === 'none' ? 'border-gray-500 bg-gray-100 text-gray-700' : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'}`}
                    >
                      Keine
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAkustischeTypeChange('stimmenhoeren')}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${ps.akustischeHalluzination.type === 'stimmenhoeren' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-500 hover:border-blue-300'}`}
                    >
                      {highlight('Stimmenhören')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAkustischeTypeChange('akoasmen')}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${ps.akustischeHalluzination.type === 'akoasmen' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-500 hover:border-blue-300'}`}
                    >
                      {highlight('Akoasmen')}
                    </button>
                  </div>

                  {/* Stimmenhören subtypes */}
                  {ps.akustischeHalluzination.type === 'stimmenhoeren' && (
                    <div className="ml-4 border-l-4 border-blue-300 pl-4">
                      <p className="text-sm text-gray-600 mb-3">Art der Stimmen:</p>
                      <div className="grid grid-cols-2 gap-2.5">
                        {Object.values(FormTypes.StimmenHoerenTyp)
                          .filter(v => filterBySearch(STIMMEN_HOEREN_TYP_LABELS[v]))
                          .map((symptom) => {
                            const subtypes = ps.akustischeHalluzination.type === 'stimmenhoeren' ? ps.akustischeHalluzination.subtypes : {};
                            const isItemSelected = !!subtypes[symptom]?.selected;
                            const isExpanded = expandedStimmenHoeren.has(symptom);
                            const details = subtypes[symptom]?.details;
                            const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                            return (
                              <div key={symptom} className="flex flex-col gap-1.5">
                                <div className="flex gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleStimmenHoerenToggle(symptom)}
                                    title={STIMMEN_HOEREN_TYP_LABELS[symptom]}
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
                                      {highlight(STIMMEN_HOEREN_TYP_LABELS[symptom])}
                                    </span>
                                  </button>
                                  {isItemSelected && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const n = new Set(expandedStimmenHoeren);
                                        isExpanded ? n.delete(symptom) : n.add(symptom);
                                        setExpandedStimmenHoeren(n);
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
                                      onChange={(e) => handleStimmenHoerenDetailsChange(symptom, 'brackets', e.target.value)}
                                      className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                      placeholder="Spezifikation in Klammern (...)"
                                      autoFocus
                                    />
                                    <input
                                      type="text"
                                      value={details?.text || ''}
                                      onChange={(e) => handleStimmenHoerenDetailsChange(symptom, 'text', e.target.value)}
                                      onBlur={(e) => {
                                        const val = e.target.value.trim();
                                        if (val && !/[.!?]$/.test(val)) {
                                          handleStimmenHoerenDetailsChange(symptom, 'text', `${val}.`);
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
                </div>
              </div>
            )}

            {/* Andere Halluzinationen */}
            {renderCardSection(
              'Andere Halluzinationen',
              FormTypes.AndereHalluzinationTyp,
              ANDERE_HALLUZINATION_TYP_LABELS,
              'psychotischeSymptomatik.andereHalluzinationen',
              ps.andereHalluzinationen,
              expandedAndereHalluz,
              setExpandedAndereHalluz
            )}

            {/* Ich-Störungen Header */}
            {(Object.values(FormTypes.IchHaftigkeitSymptom).some(v => filterBySearch(ICH_HAFTIGKEIT_SYMPTOM_LABELS[v])) ||
              Object.values(FormTypes.IchStoerungAndereSymptom).some(v => filterBySearch(ICH_STOERUNG_ANDERE_SYMPTOM_LABELS[v]))) && (
              <div className="border-b-2 border-gray-200 pb-2 pt-4">
                <h2 className="text-xl font-bold text-gray-800">{highlight('Ich-Störungen')}</h2>
              </div>
            )}

            {/* Störungen der Ich-Haftigkeit */}
            {renderCardSection(
              'Störungen der Ich-Haftigkeit',
              FormTypes.IchHaftigkeitSymptom,
              ICH_HAFTIGKEIT_SYMPTOM_LABELS,
              'psychotischeSymptomatik.ichHaftigkeit',
              ps.ichHaftigkeit,
              expandedIchHaftigkeit,
              setExpandedIchHaftigkeit
            )}

            {/* Andere Ich-Störungen */}
            {renderCardSection(
              'Andere Ich-Störungen',
              FormTypes.IchStoerungAndereSymptom,
              ICH_STOERUNG_ANDERE_SYMPTOM_LABELS,
              'psychotischeSymptomatik.ichStoerungAndere',
              ps.ichStoerungAndere,
              expandedIchStoerungAndere,
              setExpandedIchStoerungAndere
            )}

            {/* Formale Denkstörungen */}
            {renderCardSection(
              'Formale Denkstörungen',
              FormTypes.FormaleDenkstoerungSymptom,
              FORMALE_DENKSTOERUNG_SYMPTOM_LABELS,
              'psychotischeSymptomatik.formaleDenkstoerungen',
              ps.formaleDenkstoerungen,
              expandedFormaleDenk,
              setExpandedFormaleDenk
            )}

            {/* Emotionales Erleben */}
            {renderCardSection(
              'Emotionales Erleben',
              FormTypes.PsychotischEmotionalesErlebenSymptom,
              PSYCHOTISCH_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS,
              'psychotischeSymptomatik.emotionalesErleben',
              ps.emotionalesErleben,
              expandedEmotionales,
              setExpandedEmotionales
            )}

            {/* Verhalten */}
            {renderCardSection(
              'Verhalten',
              FormTypes.PsychotischVerhaltenSymptom,
              PSYCHOTISCH_VERHALTEN_SYMPTOM_LABELS,
              'psychotischeSymptomatik.verhalten',
              ps.verhalten,
              expandedVerhalten,
              setExpandedVerhalten
            )}

            {/* Kognition */}
            {renderCardSection(
              'Kognition',
              FormTypes.PsychotischKognitionSymptom,
              PSYCHOTISCH_KOGNITION_SYMPTOM_LABELS,
              'psychotischeSymptomatik.kognition',
              ps.kognition,
              expandedKognition,
              setExpandedKognition
            )}

            {/* Katatone Symptome */}
            {renderCardSection(
              'Katatone Symptome',
              FormTypes.KatatoneSymptom,
              KATATONE_SYMPTOM_LABELS,
              'psychotischeSymptomatik.katatoneSymptome',
              ps.katatoneSymptome,
              expandedKatatone,
              setExpandedKatatone
            )}

            {/* Andere Symptome - Text Field */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                Andere
              </label>
              <textarea
                value={ps.andereSymptome}
                onChange={(e) =>
                  symptomHandlers.setNestedTextField('psychotischeSymptomatik.andereSymptome', e.target.value)
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
