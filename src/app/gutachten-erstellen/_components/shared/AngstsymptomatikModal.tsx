'use client';

import { SymptomHandlers } from '@/hooks/useGutachtenForm';
import { highlightSearchText } from '@/lib/utils/highlight-utils';
import {
  AGORAPHOBIE_BEREICH_LABELS,
  AGORAPHOBIE_FLUCHT_LABELS,
  AGORAPHOBIE_PANIKSYMPTOMATIK_LABELS,
  ANGST_DISSOCIATIV_SYMPTOM_LABELS,
  ANGST_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS,
  ANGST_KOGNITION_SYMPTOM_LABELS,
  ANGST_PANIKSTOERUNG_SYMPTOM_LABELS,
  ANGST_SORGEN_LABEL,
  ANGST_SORGEN_TYP_LABELS,
  ANGST_VEGETATIV_SYMPTOM_LABELS,
  ANGST_VERHALTEN_FELD_LABELS,
  GENERALISIERTE_ANGST_SYMPTOM_LABELS,
  SOZIALE_PHOBIE_BEREICH_LABELS,
  SOZIALE_PHOBIE_HAUPTSYMPTOM_LABELS,
  SOZIALE_PHOBIE_VEGETATIV_LABELS,
  SPEZIFISCHE_PHOBIE_LABELS,
} from '@/lib/core/form-labels';
import * as FormTypes from '@/lib/core/form-types';
import { getFormattedAngstSymptoms } from '@/lib/utils/angstsymptomatik-counter';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface AngstsymptomatikModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  symptomHandlers: SymptomHandlers;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
}

interface SymptomCardProps {
  label: string;
  highlightedLabel?: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  isExpandable?: boolean;
  isExpanded?: boolean;
}

function SymptomCard({ label, highlightedLabel, isSelected, onClick, isExpandable, isExpanded }: SymptomCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`
        relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center
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
      <span className={`text-sm font-semibold leading-snug pr-6 ${isExpandable ? 'pb-6' : ''} line-clamp-2 ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
        {highlightedLabel ?? label}
      </span>
      {isExpandable && (
        <div className={`absolute bottom-1.5 left-1/2 transform -translate-x-1/2 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}
    </button>
  );
}

// Helper to check if a symptom is selected in a SymptomSelection
function isSelected<E extends string>(selection: FormTypes.SymptomSelection<E>, value: E): boolean {
  return selection[value] === 'selected';
}

export function AngstsymptomatikModal({
  isOpen,
  onClose,
  formData,
  symptomHandlers,
  setNestedField
}: AngstsymptomatikModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSorgenManuallyExpanded, setIsSorgenManuallyExpanded] = useState(false);
  const [isBereichManuallyExpanded, setIsBereichManuallyExpanded] = useState(false);
  const [isVegetativManuallyExpanded, setIsVegetativManuallyExpanded] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const angst = formData.angstsymptomatik;

  // Check if "Sorgen" is selected (sorgen key exists with selected: true)
  const isSorgenSelected = !!angst.kognition.sorgen?.selected;

  // Check if any Sorgen sub-item matches the search query (auto-expand when searching for sub-items)
  const searchLower = searchQuery.trim().toLowerCase();
  const hasSorgenSubItemMatchingSearch = searchLower !== '' &&
    Object.values(FormTypes.AngstSorgenTyp).some(v =>
      ANGST_SORGEN_TYP_LABELS[v].toLowerCase().includes(searchLower)
    );

  // Expanded if selected OR manually expanded OR sub-item matches search
  const isSorgenExpanded = isSorgenSelected || isSorgenManuallyExpanded || hasSorgenSubItemMatchingSearch;

  // Use shared utility for counting - sorted alphabetically for display
  const allSelectedSymptoms = getFormattedAngstSymptoms(angst).sort((a, b) => a.localeCompare(b));

  // Filter symptoms by search query
  const filterBySearch = (label: string): boolean => {
    if (!searchQuery.trim()) return true;
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Highlight matching text in yellow (bound to current searchQuery)
  const highlight = (text: string) => highlightSearchText(text, searchQuery);

  // Toggle handler for symptom selections (uses Partial<Record<Enum, 'selected'>> pattern)
  const handleToggle = (fieldPath: string, value: string) => {
    symptomHandlers.toggleSelectionField(fieldPath, value);
  };

  // Handler to close modal and reset local state
  const handleClose = () => {
    setSearchQuery('');
    setIsSorgenManuallyExpanded(false);
    setIsBereichManuallyExpanded(false);
    setIsVegetativManuallyExpanded(false);
    onClose();
  };

  // Handler to clear all selections and close
  const handleClearAndClose = () => {
    // Deselect all currently selected items by toggling them off
    // Emotionales Erleben
    for (const key of Object.keys(angst.emotionalesErleben)) {
      handleToggle('angstsymptomatik.emotionalesErleben', key);
    }
    // Kognition - simple symptoms (exclude 'sorgen' key)
    for (const key of Object.keys(angst.kognition)) {
      if (key !== 'sorgen') {
        handleToggle('angstsymptomatik.kognition', key);
      }
    }
    // Clear Sorgen by setting kognition to only have remaining simple symptoms
    if (angst.kognition.sorgen) {
      // Remove sorgen from kognition by reconstructing without it
      const newKognition: FormTypes.AngstKognition = {};
      for (const [key, val] of Object.entries(angst.kognition)) {
        if (key !== 'sorgen' && val === 'selected') {
          newKognition[key as FormTypes.AngstKognitionSymptom] = 'selected';
        }
      }
      setNestedField('angstsymptomatik.kognition', newKognition as unknown as Record<string, unknown>);
    }
    // Vegetative und somatische Symptome
    for (const key of Object.keys(angst.vegetativeSymptome)) {
      handleToggle('angstsymptomatik.vegetativeSymptome', key);
    }
    // Clear Verhalten text fields
    setNestedField('angstsymptomatik.verhalten', {});
    // Clear Dissoziative Symptome
    for (const key of Object.keys(angst.dissoziativeSymptome)) {
      handleToggle('angstsymptomatik.dissoziativeSymptome', key);
    }
    // Clear Panikstörung
    for (const key of Object.keys(angst.panikstoerung)) {
      handleToggle('angstsymptomatik.panikstoerung', key);
    }
    // Clear Agoraphobie
    setNestedField('angstsymptomatik.agoraphobie', {});
    // Clear Soziale Phobie
    setNestedField('angstsymptomatik.sozialePhobie', {});
    // Clear Spezifische Phobien
    for (const key of Object.keys(angst.spezifischePhobien)) {
      handleToggle('angstsymptomatik.spezifischePhobien', key);
    }
    // Clear Generalisierte Angststörung
    for (const key of Object.keys(angst.generalisierteAngst.selection)) {
      handleToggle('angstsymptomatik.generalisierteAngst.selection', key);
    }
    symptomHandlers.setNestedTextField('angstsymptomatik.generalisierteAngst.sorgenLebensbereiche', '');
    // Clear text field
    symptomHandlers.setNestedTextField('angstsymptomatik.andereSymptome', '');

    handleClose();
  };

  // Handler to toggle Sorgen on/off
  const handleToggleSorgen = () => {
    if (isSorgenExpanded) {
      // Collapse: clear sorgen data and manual expansion
      // Remove sorgen from kognition by reconstructing without it
      const newKognition: FormTypes.AngstKognition = {};
      for (const [key, val] of Object.entries(angst.kognition)) {
        if (key !== 'sorgen' && val === 'selected') {
          newKognition[key as FormTypes.AngstKognitionSymptom] = 'selected';
        }
      }
      setNestedField('angstsymptomatik.kognition', newKognition as unknown as Record<string, unknown>);
      setIsSorgenManuallyExpanded(false);
    } else {
      // Expand: set manual expansion and add sorgen with empty details
      const newKognition: FormTypes.AngstKognition = { ...angst.kognition };
      newKognition.sorgen = { selected: true, details: {} };
      setNestedField('angstsymptomatik.kognition', newKognition as unknown as Record<string, unknown>);
      setIsSorgenManuallyExpanded(true);
    }
  };

  // Handler to toggle a Sorgen detail item selection
  const handleSorgenDetailToggle = (sorgenTyp: FormTypes.AngstSorgenTyp) => {
    const currentDetails = angst.kognition.sorgen?.details || {};
    const newDetails = { ...currentDetails };

    if (newDetails[sorgenTyp]) {
      // Currently selected -> deselect (remove)
      delete newDetails[sorgenTyp];
    } else {
      // Not selected -> select with empty details
      newDetails[sorgenTyp] = { selected: true, details: {} };
    }

    const newKognition: FormTypes.AngstKognition = { ...angst.kognition };
    newKognition.sorgen = { selected: true, details: newDetails };
    setNestedField('angstsymptomatik.kognition', newKognition as unknown as Record<string, unknown>);
  };

  // Handler to update a Sorgen detail text
  const handleSorgenDetailTextChange = (sorgenTyp: FormTypes.AngstSorgenTyp, text: string) => {
    const currentDetails = angst.kognition.sorgen?.details || {};
    const newDetails = { ...currentDetails };

    // Update the text field while preserving selected state
    newDetails[sorgenTyp] = {
      selected: true,
      details: { text: text || undefined }
    };

    const newKognition: FormTypes.AngstKognition = { ...angst.kognition };
    newKognition.sorgen = { selected: true, details: newDetails };
    setNestedField('angstsymptomatik.kognition', newKognition as unknown as Record<string, unknown>);
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed top-36 bottom-4 left-4 right-[46%] z-40 flex items-start justify-center p-2">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-200 w-full max-w-5xl max-h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-900">Angstsymptomatik</h2>
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
            {/* Emotionales Erleben */}
            {(filterBySearch('Emotionales Erleben') ||
              Object.values(FormTypes.AngstEmotionalesErlebenSymptom).some(v => filterBySearch(ANGST_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Emotionales Erleben')}</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(FormTypes.AngstEmotionalesErlebenSymptom)
                      .filter(v => filterBySearch(ANGST_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS[v]) || filterBySearch('Emotionales Erleben'))
                      .map((symptom) => (
                        <SymptomCard
                          key={symptom}
                          label={ANGST_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS[symptom]}
                          highlightedLabel={highlight(ANGST_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS[symptom])}
                          isSelected={isSelected(angst.emotionalesErleben, symptom)}
                          onClick={() => handleToggle('angstsymptomatik.emotionalesErleben', symptom)}
                        />
                      ))}
                  </div>
                </div>
              )}

            {/* Kognition */}
            {(filterBySearch('Kognition') ||
              Object.values(FormTypes.AngstKognitionSymptom).some(v => filterBySearch(ANGST_KOGNITION_SYMPTOM_LABELS[v])) ||
              filterBySearch(ANGST_SORGEN_LABEL) ||
              Object.values(FormTypes.AngstSorgenTyp).some(v => filterBySearch(ANGST_SORGEN_TYP_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Kognition')}</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Simple Kognition symptoms */}
                    {Object.values(FormTypes.AngstKognitionSymptom)
                      .filter(v => filterBySearch(ANGST_KOGNITION_SYMPTOM_LABELS[v]) || filterBySearch('Kognition'))
                      .map((symptom) => (
                        <SymptomCard
                          key={symptom}
                          label={ANGST_KOGNITION_SYMPTOM_LABELS[symptom]}
                          highlightedLabel={highlight(ANGST_KOGNITION_SYMPTOM_LABELS[symptom])}
                          isSelected={isSelected(angst.kognition, symptom)}
                          onClick={() => handleToggle('angstsymptomatik.kognition', symptom)}
                        />
                      ))}

                    {/* Sorgen - expandable */}
                    {(filterBySearch('Kognition') ||
                      filterBySearch(ANGST_SORGEN_LABEL) ||
                      Object.values(FormTypes.AngstSorgenTyp).some(v => filterBySearch(ANGST_SORGEN_TYP_LABELS[v]))) && (
                        <SymptomCard
                          label={ANGST_SORGEN_LABEL}
                          highlightedLabel={highlight(ANGST_SORGEN_LABEL)}
                          isSelected={isSorgenSelected}
                          onClick={handleToggleSorgen}
                          isExpandable={true}
                          isExpanded={isSorgenExpanded}
                        />
                      )}
                  </div>

                  {/* Nested: Sorgen sub-items - shown only when expanded */}
                  {isSorgenExpanded && (
                    <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg shadow-sm">
                      <div className="mb-3 flex items-center gap-4">
                        <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          {highlight('Sorgen')} - Details:
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        {/* Filter sub-items: show all if no search or parent matches, otherwise only matching */}
                        {Object.values(FormTypes.AngstSorgenTyp)
                          .filter(v => {
                            // No search or parent label matches -> show all
                            if (!searchLower || filterBySearch(ANGST_SORGEN_LABEL)) return true;
                            // Otherwise filter to matching sub-items only
                            return ANGST_SORGEN_TYP_LABELS[v].toLowerCase().includes(searchLower);
                          })
                          .map((sorgenTyp) => {
                            const isItemSelected = !!angst.kognition.sorgen?.details[sorgenTyp]?.selected;
                            const textValue = angst.kognition.sorgen?.details[sorgenTyp]?.details?.text || '';
                            return (
                              <div key={sorgenTyp} className="flex flex-col gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSorgenDetailToggle(sorgenTyp)}
                                  title={ANGST_SORGEN_TYP_LABELS[sorgenTyp]}
                                  className={`
                                    relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center
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
                                    {highlight(ANGST_SORGEN_TYP_LABELS[sorgenTyp])}
                                  </span>
                                </button>
                                {/* Text input - shown when selected */}
                                {isItemSelected && (
                                  <input
                                    type="text"
                                    value={textValue}
                                    onChange={(e) => handleSorgenDetailTextChange(sorgenTyp, e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    placeholder="Ergänzung hinzufügen..."
                                  />
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* Vegetative und somatische Symptome */}
            {(filterBySearch('Vegetative') ||
              filterBySearch('somatische') ||
              Object.values(FormTypes.AngstVegetativSymptom).some(v => filterBySearch(ANGST_VEGETATIV_SYMPTOM_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Vegetative und somatische Symptome')}</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(FormTypes.AngstVegetativSymptom)
                      .filter(v => filterBySearch(ANGST_VEGETATIV_SYMPTOM_LABELS[v]) || filterBySearch('Vegetative') || filterBySearch('somatische'))
                      .map((symptom) => (
                        <SymptomCard
                          key={symptom}
                          label={ANGST_VEGETATIV_SYMPTOM_LABELS[symptom]}
                          highlightedLabel={highlight(ANGST_VEGETATIV_SYMPTOM_LABELS[symptom])}
                          isSelected={isSelected(angst.vegetativeSymptome, symptom)}
                          onClick={() => handleToggle('angstsymptomatik.vegetativeSymptome', symptom)}
                        />
                      ))}
                  </div>
                </div>
              )}

            {/* Verhalten - Text Fields */}
            {(filterBySearch('Verhalten') ||
              Object.values(FormTypes.AngstVerhaltenFeld).some(v => filterBySearch(ANGST_VERHALTEN_FELD_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Verhalten')}</h3>
                  <div className="space-y-3">
                    {Object.values(FormTypes.AngstVerhaltenFeld)
                      .filter(v => filterBySearch(ANGST_VERHALTEN_FELD_LABELS[v]) || filterBySearch('Verhalten'))
                      .map((feld) => (
                        <div key={feld} className="flex items-center gap-3">
                          <label className="w-56 text-sm font-medium text-gray-700 flex-shrink-0">
                            {highlight(ANGST_VERHALTEN_FELD_LABELS[feld])}
                          </label>
                          <input
                            type="text"
                            value={angst.verhalten[feld] || ''}
                            onChange={(e) => {
                              const newVerhalten = { ...angst.verhalten };
                              if (e.target.value) {
                                newVerhalten[feld] = e.target.value;
                              } else {
                                delete newVerhalten[feld];
                              }
                              setNestedField('angstsymptomatik.verhalten', newVerhalten as unknown as Record<string, unknown>);
                            }}
                            className="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            placeholder="Beschreibung eingeben..."
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {/* Dissoziative Symptome */}
            {(filterBySearch('Dissoziative Symptome') ||
              filterBySearch('Dissoziativ') ||
              Object.values(FormTypes.AngstDissociativSymptom).some(v => filterBySearch(ANGST_DISSOCIATIV_SYMPTOM_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Dissoziative Symptome')}</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(FormTypes.AngstDissociativSymptom)
                      .filter(v => filterBySearch(ANGST_DISSOCIATIV_SYMPTOM_LABELS[v]) || filterBySearch('Dissoziative Symptome') || filterBySearch('Dissoziativ'))
                      .map((symptom) => (
                        <SymptomCard
                          key={symptom}
                          label={ANGST_DISSOCIATIV_SYMPTOM_LABELS[symptom]}
                          highlightedLabel={highlight(ANGST_DISSOCIATIV_SYMPTOM_LABELS[symptom])}
                          isSelected={isSelected(angst.dissoziativeSymptome, symptom)}
                          onClick={() => handleToggle('angstsymptomatik.dissoziativeSymptome', symptom)}
                        />
                      ))}
                  </div>
                </div>
              )}

            {/* Panikstörung */}
            {(filterBySearch('Panikstörung') ||
              filterBySearch('Panik') ||
              Object.values(FormTypes.AngstPanikstoerungSymptom).some(v => filterBySearch(ANGST_PANIKSTOERUNG_SYMPTOM_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Panikstörung')}</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(FormTypes.AngstPanikstoerungSymptom)
                      .filter(v => filterBySearch(ANGST_PANIKSTOERUNG_SYMPTOM_LABELS[v]) || filterBySearch('Panikstörung') || filterBySearch('Panik'))
                      .map((symptom) => (
                        <SymptomCard
                          key={symptom}
                          label={ANGST_PANIKSTOERUNG_SYMPTOM_LABELS[symptom]}
                          highlightedLabel={highlight(ANGST_PANIKSTOERUNG_SYMPTOM_LABELS[symptom])}
                          isSelected={isSelected(angst.panikstoerung, symptom)}
                          onClick={() => handleToggle('angstsymptomatik.panikstoerung', symptom)}
                        />
                      ))}
                  </div>
                </div>
              )}

            {/* Agoraphobie */}
            {(filterBySearch('Agoraphobie') ||
              filterBySearch('Paniksymptomatik') ||
              filterBySearch('Bereiche der Agoraphobie') ||
              filterBySearch('Fluchtmöglichkeiten') ||
              (['mit', 'ohne'] as const).some(v => filterBySearch(AGORAPHOBIE_PANIKSYMPTOMATIK_LABELS[v])) ||
              Object.values(FormTypes.AgoraphobieBereich).some(v => filterBySearch(AGORAPHOBIE_BEREICH_LABELS[v])) ||
              Object.values(FormTypes.AgoraphobieFlucht).some(v => filterBySearch(AGORAPHOBIE_FLUCHT_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Agoraphobie')}</h3>

                  {/* Paniksymptomatik Radio Selection */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">{highlight('Paniksymptomatik')}:</p>
                    <div className="flex gap-4">
                      {(['mit', 'ohne'] as const).map((option) => {
                        const isCurrentlySelected = 'paniksymptomatik' in angst.agoraphobie &&
                          (angst.agoraphobie as FormTypes.AgoraphobieMit | FormTypes.AgoraphobieOhne).paniksymptomatik === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              if (isCurrentlySelected) {
                                // Deselect - reset to empty object
                                setNestedField('angstsymptomatik.agoraphobie', {});
                              } else {
                                // Select this option - initialize with empty sub-fields
                                const newAgoraphobie: FormTypes.AgoraphobieMit | FormTypes.AgoraphobieOhne = {
                                  paniksymptomatik: option,
                                  bereiche: {},
                                  bereicheAndere: '',
                                  fluchtmoeglichkeiten: {},
                                  fluchtmoeglichkeitenAndere: ''
                                };
                                setNestedField('angstsymptomatik.agoraphobie', newAgoraphobie as unknown as Record<string, unknown>);
                              }
                            }}
                            className={`
                            px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200
                            ${isCurrentlySelected
                                ? 'border-blue-500 bg-blue-100 text-blue-800'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/30'
                              }
                            focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer
                          `}
                          >
                            {isCurrentlySelected && (
                              <svg className="inline w-4 h-4 mr-1.5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                            {highlight(AGORAPHOBIE_PANIKSYMPTOMATIK_LABELS[option])}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Conditional: Bereiche and Fluchtmöglichkeiten - shown when paniksymptomatik is selected OR searching for sub-items */}
                  {('paniksymptomatik' in angst.agoraphobie || (searchQuery.trim() !== '' && (
                    filterBySearch('Bereiche der Agoraphobie') ||
                    filterBySearch('Fluchtmöglichkeiten') ||
                    Object.values(FormTypes.AgoraphobieBereich).some(v => filterBySearch(AGORAPHOBIE_BEREICH_LABELS[v])) ||
                    Object.values(FormTypes.AgoraphobieFlucht).some(v => filterBySearch(AGORAPHOBIE_FLUCHT_LABELS[v]))
                  ))) && (
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg shadow-sm space-y-6">
                      {/* Bereiche - only show if matching search */}
                      {(!searchQuery.trim() || filterBySearch('Bereiche der Agoraphobie') || Object.values(FormTypes.AgoraphobieBereich).some(v => filterBySearch(AGORAPHOBIE_BEREICH_LABELS[v]))) && (
                      <div>
                        <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          {highlight('Bereiche der Agoraphobie')}:
                        </h4>
                        <div className="grid grid-cols-2 gap-2.5 mb-3">
                          {Object.values(FormTypes.AgoraphobieBereich)
                            .filter(v => !searchQuery.trim() || filterBySearch(AGORAPHOBIE_BEREICH_LABELS[v]) || filterBySearch('Bereiche der Agoraphobie'))
                            .map((bereich) => {
                              const hasData = 'paniksymptomatik' in angst.agoraphobie;
                              const isBereichSelected = hasData && (angst.agoraphobie as FormTypes.AgoraphobieMit | FormTypes.AgoraphobieOhne).bereiche[bereich] === 'selected';
                              return (
                                <button
                                  key={bereich}
                                  type="button"
                                  onClick={() => {
                                    if (!hasData) {
                                      // Initialize structure with this bereich selected
                                      const newAgoraphobie: FormTypes.AgoraphobieMit = {
                                        paniksymptomatik: 'mit',
                                        bereiche: { [bereich]: 'selected' },
                                        bereicheAndere: '',
                                        fluchtmoeglichkeiten: {},
                                        fluchtmoeglichkeitenAndere: ''
                                      };
                                      setNestedField('angstsymptomatik.agoraphobie', newAgoraphobie as unknown as Record<string, unknown>);
                                    } else {
                                      const agoraphobie = angst.agoraphobie as FormTypes.AgoraphobieMit | FormTypes.AgoraphobieOhne;
                                      const newBereiche = { ...agoraphobie.bereiche };
                                      if (isBereichSelected) {
                                        delete newBereiche[bereich];
                                      } else {
                                        newBereiche[bereich] = 'selected';
                                      }
                                      setNestedField('angstsymptomatik.agoraphobie', {
                                        ...agoraphobie,
                                        bereiche: newBereiche
                                      } as unknown as Record<string, unknown>);
                                    }
                                  }}
                                  className={`
                                  p-2.5 rounded-lg border-2 text-left text-sm font-medium transition-all duration-200
                                  ${isBereichSelected
                                      ? 'border-blue-500 bg-blue-100 text-blue-800'
                                      : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/30'
                                    }
                                  focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer
                                `}
                                >
                                  {isBereichSelected && (
                                    <svg className="inline w-4 h-4 mr-1.5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                      <path d="M5 13l4 4L19 7"></path>
                                    </svg>
                                  )}
                                  {highlight(AGORAPHOBIE_BEREICH_LABELS[bereich])}
                                </button>
                              );
                            })}
                        </div>
                        <input
                          type="text"
                          value={'paniksymptomatik' in angst.agoraphobie ? (angst.agoraphobie as FormTypes.AgoraphobieMit | FormTypes.AgoraphobieOhne).bereicheAndere : ''}
                          onChange={(e) => {
                            const hasData = 'paniksymptomatik' in angst.agoraphobie;
                            if (!hasData) {
                              const newAgoraphobie: FormTypes.AgoraphobieMit = {
                                paniksymptomatik: 'mit',
                                bereiche: {},
                                bereicheAndere: e.target.value,
                                fluchtmoeglichkeiten: {},
                                fluchtmoeglichkeitenAndere: ''
                              };
                              setNestedField('angstsymptomatik.agoraphobie', newAgoraphobie as unknown as Record<string, unknown>);
                            } else {
                              const agoraphobie = angst.agoraphobie as FormTypes.AgoraphobieMit | FormTypes.AgoraphobieOhne;
                              setNestedField('angstsymptomatik.agoraphobie', {
                                ...agoraphobie,
                                bereicheAndere: e.target.value
                              } as unknown as Record<string, unknown>);
                            }
                          }}
                          className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          placeholder="Andere Bereiche..."
                        />
                      </div>
                      )}

                      {/* Fluchtmöglichkeiten - only show if matching search */}
                      {(!searchQuery.trim() || filterBySearch('Fluchtmöglichkeiten') || Object.values(FormTypes.AgoraphobieFlucht).some(v => filterBySearch(AGORAPHOBIE_FLUCHT_LABELS[v]))) && (
                      <div>
                        <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          {highlight('Fluchtmöglichkeiten')}:
                        </h4>
                        <div className="grid grid-cols-2 gap-2.5 mb-3">
                          {Object.values(FormTypes.AgoraphobieFlucht)
                            .filter(v => !searchQuery.trim() || filterBySearch(AGORAPHOBIE_FLUCHT_LABELS[v]) || filterBySearch('Fluchtmöglichkeiten'))
                            .map((flucht) => {
                              const hasData = 'paniksymptomatik' in angst.agoraphobie;
                              const isFluchtSelected = hasData && (angst.agoraphobie as FormTypes.AgoraphobieMit | FormTypes.AgoraphobieOhne).fluchtmoeglichkeiten[flucht] === 'selected';
                              return (
                                <button
                                  key={flucht}
                                  type="button"
                                  onClick={() => {
                                    if (!hasData) {
                                      const newAgoraphobie: FormTypes.AgoraphobieMit = {
                                        paniksymptomatik: 'mit',
                                        bereiche: {},
                                        bereicheAndere: '',
                                        fluchtmoeglichkeiten: { [flucht]: 'selected' },
                                        fluchtmoeglichkeitenAndere: ''
                                      };
                                      setNestedField('angstsymptomatik.agoraphobie', newAgoraphobie as unknown as Record<string, unknown>);
                                    } else {
                                      const agoraphobie = angst.agoraphobie as FormTypes.AgoraphobieMit | FormTypes.AgoraphobieOhne;
                                      const newFlucht = { ...agoraphobie.fluchtmoeglichkeiten };
                                      if (isFluchtSelected) {
                                        delete newFlucht[flucht];
                                      } else {
                                        newFlucht[flucht] = 'selected';
                                      }
                                      setNestedField('angstsymptomatik.agoraphobie', {
                                        ...agoraphobie,
                                        fluchtmoeglichkeiten: newFlucht
                                      } as unknown as Record<string, unknown>);
                                    }
                                  }}
                                  className={`
                                  p-2.5 rounded-lg border-2 text-left text-sm font-medium transition-all duration-200
                                  ${isFluchtSelected
                                      ? 'border-blue-500 bg-blue-100 text-blue-800'
                                      : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/30'
                                    }
                                  focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer
                                `}
                                >
                                  {isFluchtSelected && (
                                    <svg className="inline w-4 h-4 mr-1.5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                      <path d="M5 13l4 4L19 7"></path>
                                    </svg>
                                  )}
                                  {highlight(AGORAPHOBIE_FLUCHT_LABELS[flucht])}
                                </button>
                              );
                            })}
                        </div>
                        <input
                          type="text"
                          value={'paniksymptomatik' in angst.agoraphobie ? (angst.agoraphobie as FormTypes.AgoraphobieMit | FormTypes.AgoraphobieOhne).fluchtmoeglichkeitenAndere : ''}
                          onChange={(e) => {
                            const hasData = 'paniksymptomatik' in angst.agoraphobie;
                            if (!hasData) {
                              const newAgoraphobie: FormTypes.AgoraphobieMit = {
                                paniksymptomatik: 'mit',
                                bereiche: {},
                                bereicheAndere: '',
                                fluchtmoeglichkeiten: {},
                                fluchtmoeglichkeitenAndere: e.target.value
                              };
                              setNestedField('angstsymptomatik.agoraphobie', newAgoraphobie as unknown as Record<string, unknown>);
                            } else {
                              const agoraphobie = angst.agoraphobie as FormTypes.AgoraphobieMit | FormTypes.AgoraphobieOhne;
                              setNestedField('angstsymptomatik.agoraphobie', {
                                ...agoraphobie,
                                fluchtmoeglichkeitenAndere: e.target.value
                              } as unknown as Record<string, unknown>);
                            }
                          }}
                          className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          placeholder="Andere Fluchtmöglichkeiten..."
                        />
                      </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            {/* Soziale Phobie */}
            {(filterBySearch('Soziale Phobie') ||
              filterBySearch('Bereich sozialer Ängste') ||
              filterBySearch('Vegetative Symptome') ||
              Object.values(FormTypes.SozialePhobieHauptsymptom).some(v => filterBySearch(SOZIALE_PHOBIE_HAUPTSYMPTOM_LABELS[v])) ||
              Object.values(FormTypes.SozialePhobieBereichSymptom).some(v => filterBySearch(SOZIALE_PHOBIE_BEREICH_LABELS[v])) ||
              Object.values(FormTypes.SozialePhobieVegetativSymptom).some(v => filterBySearch(SOZIALE_PHOBIE_VEGETATIV_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Soziale Phobie')}</h3>

                  {/* Hauptsymptome - always visible as regular checkboxes */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(FormTypes.SozialePhobieHauptsymptom)
                      .filter(v => filterBySearch(SOZIALE_PHOBIE_HAUPTSYMPTOM_LABELS[v]) || filterBySearch('Soziale Phobie'))
                      .map((symptom) => {
                        const hasData = 'hauptsymptome' in angst.sozialePhobie;
                        const isSymptomSelected = hasData && (angst.sozialePhobie as FormTypes.SozialePhobieSelected).hauptsymptome[symptom] === 'selected';
                        return (
                          <SymptomCard
                            key={symptom}
                            label={SOZIALE_PHOBIE_HAUPTSYMPTOM_LABELS[symptom]}
                            highlightedLabel={highlight(SOZIALE_PHOBIE_HAUPTSYMPTOM_LABELS[symptom])}
                            isSelected={isSymptomSelected}
                            onClick={() => {
                              if (!hasData) {
                                // Initialize structure with this symptom selected
                                const newSozialePhobie: FormTypes.SozialePhobieSelected = {
                                  hauptsymptome: { [symptom]: 'selected' },
                                  bereichSozialerAengste: { selection: {}, andere: '' },
                                  vegetativeSymptome: { selection: {}, andere: '' }
                                };
                                setNestedField('angstsymptomatik.sozialePhobie', newSozialePhobie as unknown as Record<string, unknown>);
                              } else {
                                const sozialePhobie = angst.sozialePhobie as FormTypes.SozialePhobieSelected;
                                const newHauptsymptome = { ...sozialePhobie.hauptsymptome };
                                if (isSymptomSelected) {
                                  delete newHauptsymptome[symptom];
                                } else {
                                  newHauptsymptome[symptom] = 'selected';
                                }
                                setNestedField('angstsymptomatik.sozialePhobie', {
                                  ...sozialePhobie,
                                  hauptsymptome: newHauptsymptome
                                } as unknown as Record<string, unknown>);
                              }
                            }}
                          />
                        );
                      })}
                  </div>

                  {/* Bereich sozialer Ängste - expandable card in its own row */}
                  {(filterBySearch('Bereich sozialer Ängste') ||
                    Object.values(FormTypes.SozialePhobieBereichSymptom).some(v => filterBySearch(SOZIALE_PHOBIE_BEREICH_LABELS[v])) ||
                    filterBySearch('Soziale Phobie')) && (() => {
                      const hasData = 'hauptsymptome' in angst.sozialePhobie;
                      const hasBereichSelected = hasData &&
                        (Object.keys((angst.sozialePhobie as FormTypes.SozialePhobieSelected).bereichSozialerAengste.selection).length > 0 ||
                          (angst.sozialePhobie as FormTypes.SozialePhobieSelected).bereichSozialerAengste.andere.trim() !== '');
                      const hasBereichSubItemMatchingSearch = searchQuery.trim() !== '' &&
                        Object.values(FormTypes.SozialePhobieBereichSymptom).some(v => filterBySearch(SOZIALE_PHOBIE_BEREICH_LABELS[v]));
                      const isBereichExpanded = hasBereichSelected || isBereichManuallyExpanded || hasBereichSubItemMatchingSearch;

                      return (
                        <>
                          <div className="grid grid-cols-2 gap-2.5 mt-2.5">
                            <SymptomCard
                              label="Bereich sozialer Ängste"
                              highlightedLabel={highlight('Bereich sozialer Ängste')}
                              isSelected={hasBereichSelected}
                              onClick={() => {
                                if (!hasData) {
                                  // Initialize structure and expand
                                  const newSozialePhobie: FormTypes.SozialePhobieSelected = {
                                    hauptsymptome: {},
                                    bereichSozialerAengste: { selection: {}, andere: '' },
                                    vegetativeSymptome: { selection: {}, andere: '' }
                                  };
                                  setNestedField('angstsymptomatik.sozialePhobie', newSozialePhobie as unknown as Record<string, unknown>);
                                  setIsBereichManuallyExpanded(true);
                                } else {
                                  // Toggle expansion
                                  setIsBereichManuallyExpanded(!isBereichExpanded);
                                }
                              }}
                              isExpandable={true}
                              isExpanded={isBereichExpanded}
                            />
                          </div>

                          {/* Expanded: Bereich sozialer Ängste sub-items */}
                          {hasData && isBereichExpanded && (() => {
                            const sozialePhobie = angst.sozialePhobie as FormTypes.SozialePhobieSelected;
                            return (
                              <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg shadow-sm">
                                <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                  </svg>
                                  {highlight('Bereich sozialer Ängste')}:
                                </h4>
                                <div className="grid grid-cols-2 gap-2.5 mb-3">
                                  {Object.values(FormTypes.SozialePhobieBereichSymptom)
                                    .filter(v => !searchQuery.trim() || filterBySearch(SOZIALE_PHOBIE_BEREICH_LABELS[v]) || filterBySearch('Soziale Phobie') || filterBySearch('Bereich sozialer Ängste'))
                                    .map((bereich) => {
                                      const isBereichItemSelected = sozialePhobie.bereichSozialerAengste.selection[bereich] === 'selected';
                                      return (
                                        <button
                                          key={bereich}
                                          type="button"
                                          onClick={() => {
                                            const newSelection = { ...sozialePhobie.bereichSozialerAengste.selection };
                                            if (isBereichItemSelected) {
                                              delete newSelection[bereich];
                                            } else {
                                              newSelection[bereich] = 'selected';
                                            }
                                            setNestedField('angstsymptomatik.sozialePhobie', {
                                              ...sozialePhobie,
                                              bereichSozialerAengste: {
                                                ...sozialePhobie.bereichSozialerAengste,
                                                selection: newSelection
                                              }
                                            } as unknown as Record<string, unknown>);
                                          }}
                                          className={`
                                        p-2.5 rounded-lg border-2 text-left text-sm font-medium transition-all duration-200
                                        ${isBereichItemSelected
                                              ? 'border-blue-500 bg-blue-100 text-blue-800'
                                              : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/30'
                                            }
                                        focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer
                                      `}
                                        >
                                          {isBereichItemSelected && (
                                            <svg className="inline w-4 h-4 mr-1.5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                              <path d="M5 13l4 4L19 7"></path>
                                            </svg>
                                          )}
                                          {highlight(SOZIALE_PHOBIE_BEREICH_LABELS[bereich])}
                                        </button>
                                      );
                                    })}
                                </div>
                                <input
                                  type="text"
                                  value={sozialePhobie.bereichSozialerAengste.andere}
                                  onChange={(e) => {
                                    setNestedField('angstsymptomatik.sozialePhobie', {
                                      ...sozialePhobie,
                                      bereichSozialerAengste: {
                                        ...sozialePhobie.bereichSozialerAengste,
                                        andere: e.target.value
                                      }
                                    } as unknown as Record<string, unknown>);
                                  }}
                                  className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                  placeholder="Andere Bereiche..."
                                />
                              </div>
                            );
                          })()}
                        </>
                      );
                    })()}

                  {/* Vegetative Symptome - expandable card in its own row */}
                  {(filterBySearch('Vegetative Symptome') ||
                    Object.values(FormTypes.SozialePhobieVegetativSymptom).some(v => filterBySearch(SOZIALE_PHOBIE_VEGETATIV_LABELS[v])) ||
                    filterBySearch('Soziale Phobie')) && (() => {
                      const hasData = 'hauptsymptome' in angst.sozialePhobie;
                      const hasVegSelected = hasData &&
                        (Object.keys((angst.sozialePhobie as FormTypes.SozialePhobieSelected).vegetativeSymptome.selection).length > 0 ||
                          (angst.sozialePhobie as FormTypes.SozialePhobieSelected).vegetativeSymptome.andere.trim() !== '');
                      const hasVegSubItemMatchingSearch = searchQuery.trim() !== '' &&
                        Object.values(FormTypes.SozialePhobieVegetativSymptom).some(v => filterBySearch(SOZIALE_PHOBIE_VEGETATIV_LABELS[v]));
                      const isVegExpanded = hasVegSelected || isVegetativManuallyExpanded || hasVegSubItemMatchingSearch;

                      return (
                        <>
                          <div className="grid grid-cols-2 gap-2.5 mt-2.5">
                            <SymptomCard
                              label="Vegetative Symptome (Soziale Phobie)"
                              highlightedLabel={highlight('Vegetative Symptome (Soziale Phobie)')}
                              isSelected={hasVegSelected}
                              onClick={() => {
                                if (!hasData) {
                                  // Initialize structure and expand
                                  const newSozialePhobie: FormTypes.SozialePhobieSelected = {
                                    hauptsymptome: {},
                                    bereichSozialerAengste: { selection: {}, andere: '' },
                                    vegetativeSymptome: { selection: {}, andere: '' }
                                  };
                                  setNestedField('angstsymptomatik.sozialePhobie', newSozialePhobie as unknown as Record<string, unknown>);
                                  setIsVegetativManuallyExpanded(true);
                                } else {
                                  // Toggle expansion
                                  setIsVegetativManuallyExpanded(!isVegExpanded);
                                }
                              }}
                              isExpandable={true}
                              isExpanded={isVegExpanded}
                            />
                          </div>

                          {/* Expanded: Vegetative Symptome sub-items */}
                          {hasData && isVegExpanded && (() => {
                            const sozialePhobie = angst.sozialePhobie as FormTypes.SozialePhobieSelected;
                            return (
                              <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg shadow-sm">
                                <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                  </svg>
                                  {highlight('Vegetative Symptome')}:
                                </h4>
                                <div className="grid grid-cols-2 gap-2.5 mb-3">
                                  {Object.values(FormTypes.SozialePhobieVegetativSymptom)
                                    .filter(v => !searchQuery.trim() || filterBySearch(SOZIALE_PHOBIE_VEGETATIV_LABELS[v]) || filterBySearch('Soziale Phobie') || filterBySearch('Vegetative Symptome'))
                                    .map((veg) => {
                                      const isVegItemSelected = sozialePhobie.vegetativeSymptome.selection[veg] === 'selected';
                                      return (
                                        <button
                                          key={veg}
                                          type="button"
                                          onClick={() => {
                                            const newSelection = { ...sozialePhobie.vegetativeSymptome.selection };
                                            if (isVegItemSelected) {
                                              delete newSelection[veg];
                                            } else {
                                              newSelection[veg] = 'selected';
                                            }
                                            setNestedField('angstsymptomatik.sozialePhobie', {
                                              ...sozialePhobie,
                                              vegetativeSymptome: {
                                                ...sozialePhobie.vegetativeSymptome,
                                                selection: newSelection
                                              }
                                            } as unknown as Record<string, unknown>);
                                          }}
                                          className={`
                                        p-2.5 rounded-lg border-2 text-left text-sm font-medium transition-all duration-200
                                        ${isVegItemSelected
                                              ? 'border-blue-500 bg-blue-100 text-blue-800'
                                              : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/30'
                                            }
                                        focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer
                                      `}
                                        >
                                          {isVegItemSelected && (
                                            <svg className="inline w-4 h-4 mr-1.5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                              <path d="M5 13l4 4L19 7"></path>
                                            </svg>
                                          )}
                                          {highlight(SOZIALE_PHOBIE_VEGETATIV_LABELS[veg])}
                                        </button>
                                      );
                                    })}
                                </div>
                                <input
                                  type="text"
                                  value={sozialePhobie.vegetativeSymptome.andere}
                                  onChange={(e) => {
                                    setNestedField('angstsymptomatik.sozialePhobie', {
                                      ...sozialePhobie,
                                      vegetativeSymptome: {
                                        ...sozialePhobie.vegetativeSymptome,
                                        andere: e.target.value
                                      }
                                    } as unknown as Record<string, unknown>);
                                  }}
                                  className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                  placeholder="Andere vegetative Symptome..."
                                />
                              </div>
                            );
                          })()}
                        </>
                      );
                    })()}
                </div>
              )}

            {/* Spezifische (isolierte) Phobien */}
            {(filterBySearch('Spezifische Phobien') ||
              filterBySearch('Spezifische (isolierte) Phobien') ||
              Object.values(FormTypes.SpezifischePhobieSymptom).some(v => filterBySearch(SPEZIFISCHE_PHOBIE_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Spezifische (isolierte) Phobien')}</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(FormTypes.SpezifischePhobieSymptom)
                      .filter(v => filterBySearch(SPEZIFISCHE_PHOBIE_LABELS[v]) || filterBySearch('Spezifische Phobien') || filterBySearch('Spezifische (isolierte) Phobien'))
                      .map((symptom) => (
                        <SymptomCard
                          key={symptom}
                          label={SPEZIFISCHE_PHOBIE_LABELS[symptom]}
                          highlightedLabel={highlight(SPEZIFISCHE_PHOBIE_LABELS[symptom])}
                          isSelected={isSelected(angst.spezifischePhobien, symptom)}
                          onClick={() => handleToggle('angstsymptomatik.spezifischePhobien', symptom)}
                        />
                      ))}
                  </div>
                </div>
              )}

            {/* Generalisierte Angststörung */}
            {(filterBySearch('Generalisierte Angststörung') ||
              filterBySearch('Generalisiert') ||
              filterBySearch('Sorgen beziehen sich') ||
              Object.values(FormTypes.GeneralisierteAngstSymptom).some(v => filterBySearch(GENERALISIERTE_ANGST_SYMPTOM_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Generalisierte Angststörung')}</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(FormTypes.GeneralisierteAngstSymptom)
                      .filter(v => filterBySearch(GENERALISIERTE_ANGST_SYMPTOM_LABELS[v]) || filterBySearch('Generalisierte Angststörung') || filterBySearch('Generalisiert'))
                      .map((symptom) => (
                        <SymptomCard
                          key={symptom}
                          label={GENERALISIERTE_ANGST_SYMPTOM_LABELS[symptom]}
                          highlightedLabel={highlight(GENERALISIERTE_ANGST_SYMPTOM_LABELS[symptom])}
                          isSelected={isSelected(angst.generalisierteAngst.selection, symptom)}
                          onClick={() => handleToggle('angstsymptomatik.generalisierteAngst.selection', symptom)}
                        />
                      ))}
                  </div>
                  {/* Text field for "Sorgen beziehen sich auf verschiedene realitätsbezogene Lebensbereiche" */}
                  <div className="mt-4">
                    <label className="block text-base font-bold text-gray-700 mb-2">
                      {highlight('Sorgen beziehen sich auf verschiedene realitätsbezogene Lebensbereiche')}
                    </label>
                    <input
                      type="text"
                      value={angst.generalisierteAngst.sorgenLebensbereiche}
                      onChange={(e) =>
                        symptomHandlers.setNestedTextField('angstsymptomatik.generalisierteAngst.sorgenLebensbereiche', e.target.value)
                      }
                      className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="z.B. Arbeit, Familie, Finanzen..."
                    />
                  </div>
                </div>
              )}

            {/* Andere Symptome - Text Field */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                Andere
              </label>
              <textarea
                value={angst.andereSymptome}
                onChange={(e) =>
                  symptomHandlers.setNestedTextField('angstsymptomatik.andereSymptome', e.target.value)
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
