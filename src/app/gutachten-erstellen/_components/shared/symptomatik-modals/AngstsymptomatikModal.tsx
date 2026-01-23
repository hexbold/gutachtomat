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
  ANGST_SOMATOVEGETATIV_SYMPTOM_LABELS,
  ANGST_VERHALTEN_FELD_LABELS,
  GENERALISIERTE_ANGST_HAUPTSYMPTOM_LABELS,
  GENERALISIERTE_ANGST_SORGEN_LABELS,
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

  // Expanded state for CardSelection pattern (Emotionales Erleben)
  const [expandedEmotionalesErleben, setExpandedEmotionalesErleben] = useState<Set<FormTypes.AngstEmotionalesErlebenSymptom>>(new Set());

  // Expanded state for CardSelection pattern (Kognition)
  const [expandedKognition, setExpandedKognition] = useState<Set<FormTypes.AngstKognitionSymptom>>(new Set());

  // Expanded state for Sorgen top-level details (edit button)
  const [isSorgenTopLevelExpanded, setIsSorgenTopLevelExpanded] = useState(false);

  // Expanded state for CardSelection pattern (Somatovegetative Symptome)
  const [expandedSomatovegetativ, setExpandedSomatovegetativ] = useState<Set<FormTypes.AngstSomatovegetativSymptom>>(new Set());

  // Expanded state for CardSelection pattern (Verhalten)
  const [expandedVerhalten, setExpandedVerhalten] = useState<Set<FormTypes.AngstVerhaltenFeld>>(new Set());

  // Expanded state for CardSelection pattern (Dissoziative Symptome)
  const [expandedDissoziativ, setExpandedDissoziativ] = useState<Set<FormTypes.AngstDissociativSymptom>>(new Set());

  // Expanded state for CardSelection pattern (Panikstörung)
  const [expandedPanikstoerung, setExpandedPanikstoerung] = useState<Set<FormTypes.AngstPanikstoerungSymptom>>(new Set());

  // Expanded state for CardSelection pattern (Agoraphobie Paniksymptomatik)
  const [expandedAgoraphobiePaniksymptomatik, setExpandedAgoraphobiePaniksymptomatik] = useState<Set<FormTypes.AgoraphobiePaniksymptomatik>>(new Set());

  // Expanded state for CardSelection pattern (Agoraphobie Bereiche)
  const [expandedAgoraphobieBereiche, setExpandedAgoraphobieBereiche] = useState<Set<FormTypes.AgoraphobieBereich>>(new Set());

  // Expanded state for CardSelection pattern (Agoraphobie Flucht)
  const [expandedAgoraphobieFlucht, setExpandedAgoraphobieFlucht] = useState<Set<FormTypes.AgoraphobieFlucht>>(new Set());

  // Expanded state for CardSelection pattern (Soziale Phobie Hauptsymptome)
  const [expandedSozialePhobieHauptsymptome, setExpandedSozialePhobieHauptsymptome] = useState<Set<FormTypes.SozialePhobieHauptsymptom>>(new Set());

  // Expanded state for CardSelection pattern (Soziale Phobie Bereich)
  const [expandedSozialePhobieBereich, setExpandedSozialePhobieBereich] = useState<Set<FormTypes.SozialePhobieBereichSymptom>>(new Set());

  // Expanded state for CardSelection pattern (Soziale Phobie Vegetativ)
  const [expandedSozialePhobieVegetativ, setExpandedSozialePhobieVegetativ] = useState<Set<FormTypes.SozialePhobieVegetativSymptom>>(new Set());

  // Expanded state for CardSelection pattern (Spezifische Phobien)
  const [expandedSpezifischePhobien, setExpandedSpezifischePhobien] = useState<Set<FormTypes.SpezifischePhobieSymptom>>(new Set());

  // Expanded state for CardSelection pattern (Generalisierte Angst Hauptsymptome)
  const [expandedGenAngstHaupt, setExpandedGenAngstHaupt] = useState<Set<FormTypes.GeneralisierteAngstHauptsymptom>>(new Set());

  // Expanded state for CardSelection pattern (Generalisierte Angst Sorgen)
  const [expandedGenAngstSorgen, setExpandedGenAngstSorgen] = useState<Set<FormTypes.GeneralisierteAngstSorgenSymptom>>(new Set());

  // Manual expansion state for Sorgen sub-section
  const [isGenAngstSorgenSectionExpanded, setIsGenAngstSorgenSectionExpanded] = useState(false);

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

  // Generic CardSelection toggle handler (for Emotionales Erleben)
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

  // Generic details change handler (for CardSelection pattern)
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
    // Use shared clear function for consistency with main page
    symptomHandlers.clearAngstsymptomatik();

    // Reset all local UI expansion states
    setExpandedEmotionalesErleben(new Set());
    setExpandedKognition(new Set());
    setIsSorgenTopLevelExpanded(false);
    setIsSorgenManuallyExpanded(false);
    setExpandedSomatovegetativ(new Set());
    setExpandedVerhalten(new Set());
    setExpandedDissoziativ(new Set());
    setExpandedPanikstoerung(new Set());
    setExpandedSpezifischePhobien(new Set());
    setExpandedGenAngstHaupt(new Set());
    setExpandedGenAngstSorgen(new Set());
    setIsGenAngstSorgenSectionExpanded(false);

    handleClose();
  };

  // Handler to toggle Sorgen on/off
  const handleToggleSorgen = () => {
    if (isSorgenExpanded) {
      // Collapse: clear sorgen data and manual expansion
      // Remove sorgen from kognition by reconstructing without it (preserve other CardSelection items)
      const newKognition: FormTypes.AngstKognition = {};
      for (const [key, val] of Object.entries(angst.kognition)) {
        if (key !== 'sorgen' && val && typeof val === 'object' && 'selected' in val) {
          newKognition[key as FormTypes.AngstKognitionSymptom] = val as FormTypes.CardSelectionEntry;
        }
      }
      setNestedField('angstsymptomatik.kognition', newKognition as unknown as Record<string, unknown>);
      setIsSorgenManuallyExpanded(false);
      setIsSorgenTopLevelExpanded(false);
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
    // Preserve top-level brackets/text when toggling sub-items
    newKognition.sorgen = { ...angst.kognition.sorgen, selected: true, details: newDetails };
    setNestedField('angstsymptomatik.kognition', newKognition as unknown as Record<string, unknown>);
  };

  // Handler to update a Sorgen detail field (brackets or text)
  const handleSorgenDetailChange = (
    sorgenTyp: FormTypes.AngstSorgenTyp,
    field: 'brackets' | 'text',
    value: string
  ) => {
    const currentDetails = angst.kognition.sorgen?.details || {};
    const currentEntry = currentDetails[sorgenTyp];
    const newDetails = { ...currentDetails };

    // Update the specified field while preserving other fields
    newDetails[sorgenTyp] = {
      selected: true,
      details: {
        ...currentEntry?.details,
        [field]: value || undefined
      }
    };

    const newKognition: FormTypes.AngstKognition = { ...angst.kognition };
    newKognition.sorgen = { ...angst.kognition.sorgen, selected: true, details: newDetails };
    setNestedField('angstsymptomatik.kognition', newKognition as unknown as Record<string, unknown>);
  };

  // Handler for top-level Sorgen brackets/text
  const handleSorgenTopLevelChange = (field: 'brackets' | 'text', value: string) => {
    const newKognition: FormTypes.AngstKognition = { ...angst.kognition };
    newKognition.sorgen = {
      ...angst.kognition.sorgen,
      selected: true,
      details: angst.kognition.sorgen?.details || {},
      [field]: value || undefined
    };
    setNestedField('angstsymptomatik.kognition', newKognition as unknown as Record<string, unknown>);
  };

  // Handler for Sorgen "andere" free text
  const handleSorgenAndereChange = (value: string) => {
    const newKognition: FormTypes.AngstKognition = { ...angst.kognition };
    newKognition.sorgen = {
      ...angst.kognition.sorgen,
      selected: true,
      details: angst.kognition.sorgen?.details || {},
      andere: value || undefined
    };
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
            {/* Emotionales Erleben (CardSelection pattern) */}
            {(filterBySearch('Emotionales Erleben') ||
              Object.values(FormTypes.AngstEmotionalesErlebenSymptom).some(v => filterBySearch(ANGST_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Emotionales Erleben')}</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(FormTypes.AngstEmotionalesErlebenSymptom)
                      .filter(v => filterBySearch(ANGST_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS[v]) || filterBySearch('Emotionales Erleben'))
                      .map((symptom) => {
                        const isItemSelected = !!angst.emotionalesErleben?.[symptom]?.selected;
                        const isExpanded = expandedEmotionalesErleben.has(symptom);
                        const details = angst.emotionalesErleben?.[symptom]?.details;
                        const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                        return (
                          <div key={symptom} className="flex flex-col gap-1.5">
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleCardToggle(
                                  'angstsymptomatik.emotionalesErleben',
                                  symptom,
                                  angst.emotionalesErleben,
                                  expandedEmotionalesErleben,
                                  setExpandedEmotionalesErleben
                                )}
                                title={ANGST_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS[symptom]}
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
                                  {highlight(ANGST_EMOTIONALES_ERLEBEN_SYMPTOM_LABELS[symptom])}
                                </span>
                              </button>
                              {isItemSelected && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newExpanded = new Set(expandedEmotionalesErleben);
                                    if (isExpanded) {
                                      newExpanded.delete(symptom);
                                    } else {
                                      newExpanded.add(symptom);
                                    }
                                    setExpandedEmotionalesErleben(newExpanded);
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
                                  onChange={(e) => handleDetailsChange('angstsymptomatik.emotionalesErleben', symptom, 'brackets', e.target.value, angst.emotionalesErleben)}
                                  className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                  placeholder="Spezifikation in Klammern (...)"
                                  autoFocus
                                />
                                <input
                                  type="text"
                                  value={details?.text || ''}
                                  onChange={(e) => handleDetailsChange('angstsymptomatik.emotionalesErleben', symptom, 'text', e.target.value, angst.emotionalesErleben)}
                                  onBlur={(e) => {
                                    const val = e.target.value.trim();
                                    if (val && !/[.!?]$/.test(val)) {
                                      handleDetailsChange('angstsymptomatik.emotionalesErleben', symptom, 'text', `${val}.`, angst.emotionalesErleben);
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

            {/* Kognition */}
            {(filterBySearch('Kognition') ||
              Object.values(FormTypes.AngstKognitionSymptom).some(v => filterBySearch(ANGST_KOGNITION_SYMPTOM_LABELS[v])) ||
              filterBySearch(ANGST_SORGEN_LABEL) ||
              Object.values(FormTypes.AngstSorgenTyp).some(v => filterBySearch(ANGST_SORGEN_TYP_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Kognition')}</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Kognition symptoms (CardSelection pattern) */}
                    {Object.values(FormTypes.AngstKognitionSymptom)
                      .filter(v => filterBySearch(ANGST_KOGNITION_SYMPTOM_LABELS[v]) || filterBySearch('Kognition'))
                      .map((symptom) => {
                        const entry = angst.kognition[symptom];
                        const isItemSelected = !!entry?.selected;
                        const isExpanded = expandedKognition.has(symptom);
                        const details = entry?.details;
                        const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                        return (
                          <div key={symptom} className="flex flex-col gap-1.5">
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleCardToggle(
                                  'angstsymptomatik.kognition',
                                  symptom,
                                  angst.kognition as FormTypes.CardSelection<FormTypes.AngstKognitionSymptom>,
                                  expandedKognition,
                                  setExpandedKognition
                                )}
                                title={ANGST_KOGNITION_SYMPTOM_LABELS[symptom]}
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
                                  {highlight(ANGST_KOGNITION_SYMPTOM_LABELS[symptom])}
                                </span>
                              </button>
                              {isItemSelected && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newExpanded = new Set(expandedKognition);
                                    if (isExpanded) {
                                      newExpanded.delete(symptom);
                                    } else {
                                      newExpanded.add(symptom);
                                    }
                                    setExpandedKognition(newExpanded);
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
                                  onChange={(e) => handleDetailsChange('angstsymptomatik.kognition', symptom, 'brackets', e.target.value, angst.kognition as FormTypes.CardSelection<FormTypes.AngstKognitionSymptom>)}
                                  className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                  placeholder="Ergänzungen in Klammern (...)"
                                  autoFocus
                                />
                                <input
                                  type="text"
                                  value={details?.text || ''}
                                  onChange={(e) => handleDetailsChange('angstsymptomatik.kognition', symptom, 'text', e.target.value, angst.kognition as FormTypes.CardSelection<FormTypes.AngstKognitionSymptom>)}
                                  onBlur={(e) => {
                                    const val = e.target.value.trim();
                                    if (val && !/[.!?]$/.test(val)) {
                                      handleDetailsChange('angstsymptomatik.kognition', symptom, 'text', `${val}.`, angst.kognition as FormTypes.CardSelection<FormTypes.AngstKognitionSymptom>);
                                    }
                                  }}
                                  className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                  placeholder="Ergänzungssatz hinzufügen"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}

                    {/* Sorgen - expandable with edit button */}
                    {(filterBySearch('Kognition') ||
                      filterBySearch(ANGST_SORGEN_LABEL) ||
                      Object.values(FormTypes.AngstSorgenTyp).some(v => filterBySearch(ANGST_SORGEN_TYP_LABELS[v]))) && (
                        <div className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={handleToggleSorgen}
                              title={ANGST_SORGEN_LABEL}
                              className={`
                                flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center
                                ${isSorgenSelected
                                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                                  : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                                }
                                focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer
                              `}
                            >
                              {isSorgenSelected && (
                                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M5 13l4 4L19 7"></path>
                                  </svg>
                                </div>
                              )}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isSorgenSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                                {highlight(ANGST_SORGEN_LABEL)}
                              </span>
                              <div className={`absolute bottom-1.5 left-1/2 transform -translate-x-1/2 transition-transform duration-200 ${isSorgenExpanded ? 'rotate-180' : ''}`}>
                                <svg className={`w-5 h-5 ${isSorgenSelected ? 'text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>
                            {isSorgenSelected && (
                              <button
                                type="button"
                                onClick={() => setIsSorgenTopLevelExpanded(!isSorgenTopLevelExpanded)}
                                className={`
                                  px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                                  ${isSorgenTopLevelExpanded || !!(angst.kognition.sorgen?.brackets?.trim() || angst.kognition.sorgen?.text?.trim())
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
                          {/* Top-level Sorgen details - shown when edit button is clicked */}
                          {isSorgenTopLevelExpanded && (
                            <div className="flex flex-col gap-1.5">
                              <input
                                type="text"
                                value={angst.kognition.sorgen?.brackets || ''}
                                onChange={(e) => handleSorgenTopLevelChange('brackets', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                placeholder="Ergänzungen in Klammern (...)"
                                autoFocus
                              />
                              <input
                                type="text"
                                value={angst.kognition.sorgen?.text || ''}
                                onChange={(e) => handleSorgenTopLevelChange('text', e.target.value)}
                                onBlur={(e) => {
                                  const val = e.target.value.trim();
                                  if (val && !/[.!?]$/.test(val)) {
                                    handleSorgenTopLevelChange('text', `${val}.`);
                                  }
                                }}
                                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                placeholder="Ergänzungssatz hinzufügen"
                              />
                            </div>
                          )}
                        </div>
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
                        {/* Filter sub-items: show all if no search or parent matches/selected, otherwise only matching */}
                        {Object.values(FormTypes.AngstSorgenTyp)
                          .filter(v => {
                            // No search or parent label matches or parent is selected -> show all
                            if (!searchLower || filterBySearch(ANGST_SORGEN_LABEL) || isSorgenSelected) return true;
                            // Otherwise filter to matching sub-items only
                            return ANGST_SORGEN_TYP_LABELS[v].toLowerCase().includes(searchLower);
                          })
                          .map((sorgenTyp) => {
                            const isItemSelected = !!angst.kognition.sorgen?.details[sorgenTyp]?.selected;
                            const details = angst.kognition.sorgen?.details[sorgenTyp]?.details;
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
                                {/* Detail inputs - shown when selected */}
                                {isItemSelected && (
                                  <div className="flex flex-col gap-1.5">
                                    <input
                                      type="text"
                                      value={details?.brackets || ''}
                                      onChange={(e) => handleSorgenDetailChange(sorgenTyp, 'brackets', e.target.value)}
                                      className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                      placeholder="Ergänzungen in Klammern (...)"
                                    />
                                    <input
                                      type="text"
                                      value={details?.text || ''}
                                      onChange={(e) => handleSorgenDetailChange(sorgenTyp, 'text', e.target.value)}
                                      onBlur={(e) => {
                                        const val = e.target.value.trim();
                                        if (val && !/[.!?]$/.test(val)) {
                                          handleSorgenDetailChange(sorgenTyp, 'text', `${val}.`);
                                        }
                                      }}
                                      className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                      placeholder="Ergänzungssatz hinzufügen"
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                      {/* Andere text field */}
                      <div className="mt-3">
                        <input
                          type="text"
                          value={angst.kognition.sorgen?.andere || ''}
                          onChange={(e) => handleSorgenAndereChange(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                          placeholder="Andere Sorgen..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* Somatovegetative Symptome (CardSelection pattern) */}
            {(filterBySearch('Somatovegetativ') ||
              Object.values(FormTypes.AngstSomatovegetativSymptom).some(v => filterBySearch(ANGST_SOMATOVEGETATIV_SYMPTOM_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Somatovegetative Symptome')}</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(FormTypes.AngstSomatovegetativSymptom)
                      .filter(v => filterBySearch(ANGST_SOMATOVEGETATIV_SYMPTOM_LABELS[v]) || filterBySearch('Somatovegetativ'))
                      .map((symptom) => {
                        const isItemSelected = !!angst.somatovegetativeSymptome?.[symptom]?.selected;
                        const isExpanded = expandedSomatovegetativ.has(symptom);
                        const details = angst.somatovegetativeSymptome?.[symptom]?.details;
                        const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                        return (
                          <div key={symptom} className="flex flex-col gap-1.5">
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleCardToggle(
                                  'angstsymptomatik.somatovegetativeSymptome',
                                  symptom,
                                  angst.somatovegetativeSymptome,
                                  expandedSomatovegetativ,
                                  setExpandedSomatovegetativ
                                )}
                                title={ANGST_SOMATOVEGETATIV_SYMPTOM_LABELS[symptom]}
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
                                  {highlight(ANGST_SOMATOVEGETATIV_SYMPTOM_LABELS[symptom])}
                                </span>
                              </button>
                              {isItemSelected && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newExpanded = new Set(expandedSomatovegetativ);
                                    if (isExpanded) {
                                      newExpanded.delete(symptom);
                                    } else {
                                      newExpanded.add(symptom);
                                    }
                                    setExpandedSomatovegetativ(newExpanded);
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
                                  onChange={(e) => handleDetailsChange('angstsymptomatik.somatovegetativeSymptome', symptom, 'brackets', e.target.value, angst.somatovegetativeSymptome)}
                                  className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                  placeholder="Spezifikation in Klammern (...)"
                                  autoFocus
                                />
                                <input
                                  type="text"
                                  value={details?.text || ''}
                                  onChange={(e) => handleDetailsChange('angstsymptomatik.somatovegetativeSymptome', symptom, 'text', e.target.value, angst.somatovegetativeSymptome)}
                                  onBlur={(e) => {
                                    const val = e.target.value.trim();
                                    if (val && !/[.!?]$/.test(val)) {
                                      handleDetailsChange('angstsymptomatik.somatovegetativeSymptome', symptom, 'text', `${val}.`, angst.somatovegetativeSymptome);
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

            {/* Verhalten (CardSelection pattern) */}
            {(filterBySearch('Verhalten') ||
              Object.values(FormTypes.AngstVerhaltenFeld).some(v => filterBySearch(ANGST_VERHALTEN_FELD_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Verhalten')}</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(FormTypes.AngstVerhaltenFeld)
                      .filter(v => filterBySearch(ANGST_VERHALTEN_FELD_LABELS[v]) || filterBySearch('Verhalten'))
                      .map((symptom) => {
                        const isItemSelected = !!angst.verhalten?.[symptom]?.selected;
                        const isExpanded = expandedVerhalten.has(symptom);
                        const details = angst.verhalten?.[symptom]?.details;
                        const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                        return (
                          <div key={symptom} className="flex flex-col gap-1.5">
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleCardToggle(
                                  'angstsymptomatik.verhalten',
                                  symptom,
                                  angst.verhalten,
                                  expandedVerhalten,
                                  setExpandedVerhalten
                                )}
                                title={ANGST_VERHALTEN_FELD_LABELS[symptom]}
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
                                  {highlight(ANGST_VERHALTEN_FELD_LABELS[symptom])}
                                </span>
                              </button>
                              {isItemSelected && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newExpanded = new Set(expandedVerhalten);
                                    if (isExpanded) {
                                      newExpanded.delete(symptom);
                                    } else {
                                      newExpanded.add(symptom);
                                    }
                                    setExpandedVerhalten(newExpanded);
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
                                  onChange={(e) => handleDetailsChange('angstsymptomatik.verhalten', symptom, 'brackets', e.target.value, angst.verhalten)}
                                  className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                  placeholder="Spezifikation in Klammern (...)"
                                  autoFocus
                                />
                                <input
                                  type="text"
                                  value={details?.text || ''}
                                  onChange={(e) => handleDetailsChange('angstsymptomatik.verhalten', symptom, 'text', e.target.value, angst.verhalten)}
                                  onBlur={(e) => {
                                    const val = e.target.value.trim();
                                    if (val && !/[.!?]$/.test(val)) {
                                      handleDetailsChange('angstsymptomatik.verhalten', symptom, 'text', `${val}.`, angst.verhalten);
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

            {/* Dissoziative Symptome (CardSelection pattern) */}
            {(filterBySearch('Dissoziative Symptome') ||
              filterBySearch('Dissoziativ') ||
              Object.values(FormTypes.AngstDissociativSymptom).some(v => filterBySearch(ANGST_DISSOCIATIV_SYMPTOM_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Dissoziative Symptome')}</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(FormTypes.AngstDissociativSymptom)
                      .filter(v => filterBySearch(ANGST_DISSOCIATIV_SYMPTOM_LABELS[v]) || filterBySearch('Dissoziative Symptome') || filterBySearch('Dissoziativ'))
                      .map((symptom) => {
                        const isItemSelected = !!angst.dissoziativeSymptome?.[symptom]?.selected;
                        const isExpanded = expandedDissoziativ.has(symptom);
                        const details = angst.dissoziativeSymptome?.[symptom]?.details;
                        const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                        return (
                          <div key={symptom} className="flex flex-col gap-1.5">
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleCardToggle(
                                  'angstsymptomatik.dissoziativeSymptome',
                                  symptom,
                                  angst.dissoziativeSymptome,
                                  expandedDissoziativ,
                                  setExpandedDissoziativ
                                )}
                                title={ANGST_DISSOCIATIV_SYMPTOM_LABELS[symptom]}
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
                                  {highlight(ANGST_DISSOCIATIV_SYMPTOM_LABELS[symptom])}
                                </span>
                              </button>
                              {isItemSelected && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newExpanded = new Set(expandedDissoziativ);
                                    if (isExpanded) {
                                      newExpanded.delete(symptom);
                                    } else {
                                      newExpanded.add(symptom);
                                    }
                                    setExpandedDissoziativ(newExpanded);
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
                                  onChange={(e) => handleDetailsChange('angstsymptomatik.dissoziativeSymptome', symptom, 'brackets', e.target.value, angst.dissoziativeSymptome)}
                                  className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                  placeholder="Spezifikation in Klammern (...)"
                                  autoFocus
                                />
                                <input
                                  type="text"
                                  value={details?.text || ''}
                                  onChange={(e) => handleDetailsChange('angstsymptomatik.dissoziativeSymptome', symptom, 'text', e.target.value, angst.dissoziativeSymptome)}
                                  onBlur={(e) => {
                                    const val = e.target.value.trim();
                                    if (val && !/[.!?]$/.test(val)) {
                                      handleDetailsChange('angstsymptomatik.dissoziativeSymptome', symptom, 'text', `${val}.`, angst.dissoziativeSymptome);
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

            {/* Spezifische Angstsymptome - wrapper for Panikstörung and Agoraphobie */}
            {(filterBySearch('Spezifische Angstsymptome') ||
              filterBySearch('Panikstörung') ||
              filterBySearch('Panik') ||
              filterBySearch('Agoraphobie') ||
              filterBySearch('Paniksymptomatik') ||
              filterBySearch('Bereiche der Agoraphobie') ||
              filterBySearch('Fluchtmöglichkeiten') ||
              Object.values(FormTypes.AngstPanikstoerungSymptom).some(v => filterBySearch(ANGST_PANIKSTOERUNG_SYMPTOM_LABELS[v])) ||
              Object.values(FormTypes.AgoraphobiePaniksymptomatik).some(v => filterBySearch(AGORAPHOBIE_PANIKSYMPTOMATIK_LABELS[v])) ||
              Object.values(FormTypes.AgoraphobieBereich).some(v => filterBySearch(AGORAPHOBIE_BEREICH_LABELS[v])) ||
              Object.values(FormTypes.AgoraphobieFlucht).some(v => filterBySearch(AGORAPHOBIE_FLUCHT_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Spezifische Angstsymptome')}</h3>

            {/* Panikstörung (CardSelection pattern) */}
            {(filterBySearch('Spezifische Angstsymptome') ||
              filterBySearch('Panikstörung') ||
              filterBySearch('Panik') ||
              Object.values(FormTypes.AngstPanikstoerungSymptom).some(v => filterBySearch(ANGST_PANIKSTOERUNG_SYMPTOM_LABELS[v]))) && (
                <div>
                  <h4 className="text-base font-semibold text-gray-800 mb-3">{highlight('Panikstörung')}</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(FormTypes.AngstPanikstoerungSymptom)
                      .filter(v => filterBySearch(ANGST_PANIKSTOERUNG_SYMPTOM_LABELS[v]) || filterBySearch('Panikstörung') || filterBySearch('Panik'))
                      .map((symptom) => {
                        const isItemSelected = !!angst.panikstoerung?.[symptom]?.selected;
                        const isExpanded = expandedPanikstoerung.has(symptom);
                        const details = angst.panikstoerung?.[symptom]?.details;
                        const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                        return (
                          <div key={symptom} className="flex flex-col gap-1.5">
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleCardToggle(
                                  'angstsymptomatik.panikstoerung',
                                  symptom,
                                  angst.panikstoerung,
                                  expandedPanikstoerung,
                                  setExpandedPanikstoerung
                                )}
                                title={ANGST_PANIKSTOERUNG_SYMPTOM_LABELS[symptom]}
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
                                  {highlight(ANGST_PANIKSTOERUNG_SYMPTOM_LABELS[symptom])}
                                </span>
                              </button>
                              {isItemSelected && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newExpanded = new Set(expandedPanikstoerung);
                                    if (isExpanded) {
                                      newExpanded.delete(symptom);
                                    } else {
                                      newExpanded.add(symptom);
                                    }
                                    setExpandedPanikstoerung(newExpanded);
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
                                  onChange={(e) => handleDetailsChange('angstsymptomatik.panikstoerung', symptom, 'brackets', e.target.value, angst.panikstoerung)}
                                  className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                  placeholder="Spezifikation in Klammern (...)"
                                  autoFocus
                                />
                                <input
                                  type="text"
                                  value={details?.text || ''}
                                  onChange={(e) => handleDetailsChange('angstsymptomatik.panikstoerung', symptom, 'text', e.target.value, angst.panikstoerung)}
                                  onBlur={(e) => {
                                    const val = e.target.value.trim();
                                    if (val && !/[.!?]$/.test(val)) {
                                      handleDetailsChange('angstsymptomatik.panikstoerung', symptom, 'text', `${val}.`, angst.panikstoerung);
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

            {/* Agoraphobie */}
            {(filterBySearch('Spezifische Angstsymptome') ||
              filterBySearch('Agoraphobie') ||
              filterBySearch('Paniksymptomatik') ||
              filterBySearch('Bereiche der Agoraphobie') ||
              filterBySearch('Fluchtmöglichkeiten') ||
              Object.values(FormTypes.AgoraphobiePaniksymptomatik).some(v => filterBySearch(AGORAPHOBIE_PANIKSYMPTOMATIK_LABELS[v])) ||
              Object.values(FormTypes.AgoraphobieBereich).some(v => filterBySearch(AGORAPHOBIE_BEREICH_LABELS[v])) ||
              Object.values(FormTypes.AgoraphobieFlucht).some(v => filterBySearch(AGORAPHOBIE_FLUCHT_LABELS[v]))) && (
                <div className="mt-6">
                  <h4 className="text-base font-semibold text-gray-800 mb-3">{highlight('Agoraphobie')}</h4>

                  {/* Paniksymptomatik CardSelection Grid */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">{highlight('Paniksymptomatik')}:</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {Object.values(FormTypes.AgoraphobiePaniksymptomatik)
                        .filter(v => filterBySearch(AGORAPHOBIE_PANIKSYMPTOMATIK_LABELS[v]) || filterBySearch('Paniksymptomatik') || filterBySearch('Agoraphobie'))
                        .map((option) => {
                          const isItemSelected = !!angst.agoraphobie.paniksymptomatik?.[option]?.selected;
                          const isExpanded = expandedAgoraphobiePaniksymptomatik.has(option);
                          const details = angst.agoraphobie.paniksymptomatik?.[option]?.details;
                          const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                          return (
                            <div key={option} className="flex flex-col gap-1.5">
                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentSelection = angst.agoraphobie.paniksymptomatik || {};
                                    if (isItemSelected) {
                                      // Deselect - remove this option
                                      const newSelection = { ...currentSelection };
                                      delete newSelection[option];
                                      setNestedField('angstsymptomatik.agoraphobie.paniksymptomatik', newSelection as unknown as Record<string, unknown>);
                                      // Close expanded if deselected
                                      if (expandedAgoraphobiePaniksymptomatik.has(option)) {
                                        const newExpanded = new Set(expandedAgoraphobiePaniksymptomatik);
                                        newExpanded.delete(option);
                                        setExpandedAgoraphobiePaniksymptomatik(newExpanded);
                                      }
                                    } else {
                                      // Select this option - MUTUAL EXCLUSIVITY: clear the other option first
                                      const otherOption = option === FormTypes.AgoraphobiePaniksymptomatik.Mit
                                        ? FormTypes.AgoraphobiePaniksymptomatik.Ohne
                                        : FormTypes.AgoraphobiePaniksymptomatik.Mit;

                                      // Check if switching from the other option (not just first selection)
                                      const isSwitching = !!currentSelection[otherOption]?.selected;

                                      const newSelection: FormTypes.AgoraphobiePaniksymptomatikSelection = {
                                        [option]: { selected: true, details: {} }
                                      };
                                      setNestedField('angstsymptomatik.agoraphobie.paniksymptomatik', newSelection as unknown as Record<string, unknown>);

                                      // When switching between Mit/Ohne, clear all sub-items
                                      if (isSwitching) {
                                        setNestedField('angstsymptomatik.agoraphobie.bereiche', {} as unknown as Record<string, unknown>);
                                        setNestedField('angstsymptomatik.agoraphobie.bereicheAndere', '');
                                        setNestedField('angstsymptomatik.agoraphobie.fluchtmoeglichkeiten', {} as unknown as Record<string, unknown>);
                                        setNestedField('angstsymptomatik.agoraphobie.fluchtmoeglichkeitenAndere', '');
                                        // Also clear expanded states for sub-items
                                        setExpandedAgoraphobieBereiche(new Set());
                                        setExpandedAgoraphobieFlucht(new Set());
                                      }

                                      // Close expanded state for the other option
                                      if (expandedAgoraphobiePaniksymptomatik.has(otherOption)) {
                                        const newExpanded = new Set(expandedAgoraphobiePaniksymptomatik);
                                        newExpanded.delete(otherOption);
                                        setExpandedAgoraphobiePaniksymptomatik(newExpanded);
                                      }
                                    }
                                  }}
                                  title={AGORAPHOBIE_PANIKSYMPTOMATIK_LABELS[option]}
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
                                    {highlight(AGORAPHOBIE_PANIKSYMPTOMATIK_LABELS[option])}
                                  </span>
                                </button>
                                {isItemSelected && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newExpanded = new Set(expandedAgoraphobiePaniksymptomatik);
                                      if (isExpanded) {
                                        newExpanded.delete(option);
                                      } else {
                                        newExpanded.add(option);
                                      }
                                      setExpandedAgoraphobiePaniksymptomatik(newExpanded);
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
                                    onChange={(e) => handleDetailsChange('angstsymptomatik.agoraphobie.paniksymptomatik', option, 'brackets', e.target.value, angst.agoraphobie.paniksymptomatik)}
                                    className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    placeholder="Spezifikation in Klammern (...)"
                                    autoFocus
                                  />
                                  <input
                                    type="text"
                                    value={details?.text || ''}
                                    onChange={(e) => handleDetailsChange('angstsymptomatik.agoraphobie.paniksymptomatik', option, 'text', e.target.value, angst.agoraphobie.paniksymptomatik)}
                                    onBlur={(e) => {
                                      const val = e.target.value.trim();
                                      if (val && !/[.!?]$/.test(val)) {
                                        handleDetailsChange('angstsymptomatik.agoraphobie.paniksymptomatik', option, 'text', `${val}.`, angst.agoraphobie.paniksymptomatik);
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

                  {/* Conditional: Bereiche and Fluchtmöglichkeiten - shown when paniksymptomatik is selected OR searching for sub-items */}
                  {(Object.values(angst.agoraphobie.paniksymptomatik || {}).some(entry => entry?.selected) || (searchQuery.trim() !== '' && (
                    filterBySearch('Bereiche der Agoraphobie') ||
                    filterBySearch('Fluchtmöglichkeiten') ||
                    Object.values(FormTypes.AgoraphobieBereich).some(v => filterBySearch(AGORAPHOBIE_BEREICH_LABELS[v])) ||
                    Object.values(FormTypes.AgoraphobieFlucht).some(v => filterBySearch(AGORAPHOBIE_FLUCHT_LABELS[v]))
                  ))) && (
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg shadow-sm space-y-6">
                      {/* Bereiche - CardSelection pattern */}
                      {(!searchQuery.trim() || Object.values(angst.agoraphobie.paniksymptomatik || {}).some(entry => entry?.selected) || filterBySearch('Bereiche der Agoraphobie') || Object.values(FormTypes.AgoraphobieBereich).some(v => filterBySearch(AGORAPHOBIE_BEREICH_LABELS[v]))) && (
                      <div>
                        <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          {highlight('Bereiche der Agoraphobie')}:
                        </h4>
                        <div className="grid grid-cols-2 gap-2.5 mb-3">
                          {Object.values(FormTypes.AgoraphobieBereich)
                            .filter(v => !searchQuery.trim() || Object.values(angst.agoraphobie.paniksymptomatik || {}).some(entry => entry?.selected) || filterBySearch(AGORAPHOBIE_BEREICH_LABELS[v]) || filterBySearch('Bereiche der Agoraphobie'))
                            .map((bereich) => {
                              const isItemSelected = !!angst.agoraphobie.bereiche?.[bereich]?.selected;
                              const isExpanded = expandedAgoraphobieBereiche.has(bereich);
                              const details = angst.agoraphobie.bereiche?.[bereich]?.details;
                              const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                              return (
                                <div key={bereich} className="flex flex-col gap-1.5">
                                  <div className="flex gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleCardToggle(
                                        'angstsymptomatik.agoraphobie.bereiche',
                                        bereich,
                                        angst.agoraphobie.bereiche,
                                        expandedAgoraphobieBereiche,
                                        setExpandedAgoraphobieBereiche
                                      )}
                                      title={AGORAPHOBIE_BEREICH_LABELS[bereich]}
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
                                        {highlight(AGORAPHOBIE_BEREICH_LABELS[bereich])}
                                      </span>
                                    </button>
                                    {isItemSelected && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newExpanded = new Set(expandedAgoraphobieBereiche);
                                          if (isExpanded) {
                                            newExpanded.delete(bereich);
                                          } else {
                                            newExpanded.add(bereich);
                                          }
                                          setExpandedAgoraphobieBereiche(newExpanded);
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
                                        onChange={(e) => handleDetailsChange('angstsymptomatik.agoraphobie.bereiche', bereich, 'brackets', e.target.value, angst.agoraphobie.bereiche)}
                                        className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                        placeholder="Spezifikation in Klammern (...)"
                                        autoFocus
                                      />
                                      <input
                                        type="text"
                                        value={details?.text || ''}
                                        onChange={(e) => handleDetailsChange('angstsymptomatik.agoraphobie.bereiche', bereich, 'text', e.target.value, angst.agoraphobie.bereiche)}
                                        onBlur={(e) => {
                                          const val = e.target.value.trim();
                                          if (val && !/[.!?]$/.test(val)) {
                                            handleDetailsChange('angstsymptomatik.agoraphobie.bereiche', bereich, 'text', `${val}.`, angst.agoraphobie.bereiche);
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
                        <input
                          type="text"
                          value={angst.agoraphobie.bereicheAndere}
                          onChange={(e) => setNestedField('angstsymptomatik.agoraphobie.bereicheAndere', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          placeholder="Andere Bereiche..."
                        />
                      </div>
                      )}

                      {/* Fluchtmöglichkeiten - CardSelection pattern */}
                      {(!searchQuery.trim() || Object.values(angst.agoraphobie.paniksymptomatik || {}).some(entry => entry?.selected) || filterBySearch('Fluchtmöglichkeiten') || Object.values(FormTypes.AgoraphobieFlucht).some(v => filterBySearch(AGORAPHOBIE_FLUCHT_LABELS[v]))) && (
                      <div>
                        <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          {highlight('Fluchtmöglichkeiten')}:
                        </h4>
                        <div className="grid grid-cols-2 gap-2.5 mb-3">
                          {Object.values(FormTypes.AgoraphobieFlucht)
                            .filter(v => !searchQuery.trim() || Object.values(angst.agoraphobie.paniksymptomatik || {}).some(entry => entry?.selected) || filterBySearch(AGORAPHOBIE_FLUCHT_LABELS[v]) || filterBySearch('Fluchtmöglichkeiten'))
                            .map((flucht) => {
                              const isItemSelected = !!angst.agoraphobie.fluchtmoeglichkeiten?.[flucht]?.selected;
                              const isExpanded = expandedAgoraphobieFlucht.has(flucht);
                              const details = angst.agoraphobie.fluchtmoeglichkeiten?.[flucht]?.details;
                              const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                              return (
                                <div key={flucht} className="flex flex-col gap-1.5">
                                  <div className="flex gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleCardToggle(
                                        'angstsymptomatik.agoraphobie.fluchtmoeglichkeiten',
                                        flucht,
                                        angst.agoraphobie.fluchtmoeglichkeiten,
                                        expandedAgoraphobieFlucht,
                                        setExpandedAgoraphobieFlucht
                                      )}
                                      title={AGORAPHOBIE_FLUCHT_LABELS[flucht]}
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
                                        {highlight(AGORAPHOBIE_FLUCHT_LABELS[flucht])}
                                      </span>
                                    </button>
                                    {isItemSelected && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newExpanded = new Set(expandedAgoraphobieFlucht);
                                          if (isExpanded) {
                                            newExpanded.delete(flucht);
                                          } else {
                                            newExpanded.add(flucht);
                                          }
                                          setExpandedAgoraphobieFlucht(newExpanded);
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
                                        onChange={(e) => handleDetailsChange('angstsymptomatik.agoraphobie.fluchtmoeglichkeiten', flucht, 'brackets', e.target.value, angst.agoraphobie.fluchtmoeglichkeiten)}
                                        className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                        placeholder="Spezifikation in Klammern (...)"
                                        autoFocus
                                      />
                                      <input
                                        type="text"
                                        value={details?.text || ''}
                                        onChange={(e) => handleDetailsChange('angstsymptomatik.agoraphobie.fluchtmoeglichkeiten', flucht, 'text', e.target.value, angst.agoraphobie.fluchtmoeglichkeiten)}
                                        onBlur={(e) => {
                                          const val = e.target.value.trim();
                                          if (val && !/[.!?]$/.test(val)) {
                                            handleDetailsChange('angstsymptomatik.agoraphobie.fluchtmoeglichkeiten', flucht, 'text', `${val}.`, angst.agoraphobie.fluchtmoeglichkeiten);
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
                        <input
                          type="text"
                          value={angst.agoraphobie.fluchtmoeglichkeitenAndere}
                          onChange={(e) => setNestedField('angstsymptomatik.agoraphobie.fluchtmoeglichkeitenAndere', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          placeholder="Andere Fluchtmöglichkeiten..."
                        />
                      </div>
                      )}
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

                  {/* Hauptsymptome - CardSelection pattern with edit buttons */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(FormTypes.SozialePhobieHauptsymptom)
                      .filter(v => filterBySearch(SOZIALE_PHOBIE_HAUPTSYMPTOM_LABELS[v]) || filterBySearch('Soziale Phobie'))
                      .map((symptom) => {
                        const hasData = 'hauptsymptome' in angst.sozialePhobie;
                        const isSymptomSelected = hasData && !!(angst.sozialePhobie as FormTypes.SozialePhobieSelected).hauptsymptome[symptom]?.selected;
                        const isExpanded = expandedSozialePhobieHauptsymptome.has(symptom);
                        const details = hasData ? (angst.sozialePhobie as FormTypes.SozialePhobieSelected).hauptsymptome[symptom]?.details : undefined;
                        const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                        return (
                          <div key={symptom} className="flex flex-col gap-1.5">
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  if (!hasData) {
                                    // Initialize structure with this symptom selected (CardSelection pattern)
                                    const newSozialePhobie: FormTypes.SozialePhobieSelected = {
                                      hauptsymptome: { [symptom]: { selected: true, details: {} } },
                                      bereichSozialerAengste: { selection: {}, andere: '' },
                                      vegetativeSymptome: { selection: {}, andere: '' }
                                    };
                                    setNestedField('angstsymptomatik.sozialePhobie', newSozialePhobie as unknown as Record<string, unknown>);
                                  } else {
                                    const sozialePhobie = angst.sozialePhobie as FormTypes.SozialePhobieSelected;
                                    const newHauptsymptome = { ...sozialePhobie.hauptsymptome };
                                    if (isSymptomSelected) {
                                      delete newHauptsymptome[symptom];
                                      // Also collapse when deselecting
                                      const newExpanded = new Set(expandedSozialePhobieHauptsymptome);
                                      newExpanded.delete(symptom);
                                      setExpandedSozialePhobieHauptsymptome(newExpanded);
                                    } else {
                                      newHauptsymptome[symptom] = { selected: true, details: {} };
                                    }
                                    setNestedField('angstsymptomatik.sozialePhobie', {
                                      ...sozialePhobie,
                                      hauptsymptome: newHauptsymptome
                                    } as unknown as Record<string, unknown>);
                                  }
                                }}
                                title={SOZIALE_PHOBIE_HAUPTSYMPTOM_LABELS[symptom]}
                                className={`
                                  flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center
                                  ${isSymptomSelected
                                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                                    : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                                  }
                                  focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer
                                `}
                              >
                                {isSymptomSelected && (
                                  <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                      <path d="M5 13l4 4L19 7"></path>
                                    </svg>
                                  </div>
                                )}
                                <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isSymptomSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                                  {highlight(SOZIALE_PHOBIE_HAUPTSYMPTOM_LABELS[symptom])}
                                </span>
                              </button>
                              {isSymptomSelected && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newExpanded = new Set(expandedSozialePhobieHauptsymptome);
                                    if (isExpanded) {
                                      newExpanded.delete(symptom);
                                    } else {
                                      newExpanded.add(symptom);
                                    }
                                    setExpandedSozialePhobieHauptsymptome(newExpanded);
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
                            {isExpanded && hasData && (
                              <div className="flex flex-col gap-1.5">
                                <input
                                  type="text"
                                  value={details?.brackets || ''}
                                  onChange={(e) => {
                                    const sozialePhobie = angst.sozialePhobie as FormTypes.SozialePhobieSelected;
                                    const current = sozialePhobie.hauptsymptome[symptom];
                                    const newHauptsymptome = {
                                      ...sozialePhobie.hauptsymptome,
                                      [symptom]: {
                                        selected: true,
                                        details: {
                                          ...current?.details,
                                          brackets: e.target.value || undefined
                                        }
                                      }
                                    };
                                    setNestedField('angstsymptomatik.sozialePhobie', {
                                      ...sozialePhobie,
                                      hauptsymptome: newHauptsymptome
                                    } as unknown as Record<string, unknown>);
                                  }}
                                  className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                  placeholder="Spezifikation in Klammern (...)"
                                  autoFocus
                                />
                                <input
                                  type="text"
                                  value={details?.text || ''}
                                  onChange={(e) => {
                                    const sozialePhobie = angst.sozialePhobie as FormTypes.SozialePhobieSelected;
                                    const current = sozialePhobie.hauptsymptome[symptom];
                                    const newHauptsymptome = {
                                      ...sozialePhobie.hauptsymptome,
                                      [symptom]: {
                                        selected: true,
                                        details: {
                                          ...current?.details,
                                          text: e.target.value || undefined
                                        }
                                      }
                                    };
                                    setNestedField('angstsymptomatik.sozialePhobie', {
                                      ...sozialePhobie,
                                      hauptsymptome: newHauptsymptome
                                    } as unknown as Record<string, unknown>);
                                  }}
                                  onBlur={(e) => {
                                    const val = e.target.value.trim();
                                    if (val && !/[.!?]$/.test(val)) {
                                      const sozialePhobie = angst.sozialePhobie as FormTypes.SozialePhobieSelected;
                                      const current = sozialePhobie.hauptsymptome[symptom];
                                      const newHauptsymptome = {
                                        ...sozialePhobie.hauptsymptome,
                                        [symptom]: {
                                          selected: true,
                                          details: {
                                            ...current?.details,
                                            text: `${val}.`
                                          }
                                        }
                                      };
                                      setNestedField('angstsymptomatik.sozialePhobie', {
                                        ...sozialePhobie,
                                        hauptsymptome: newHauptsymptome
                                      } as unknown as Record<string, unknown>);
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

                  {/* Bereich sozialer Ängste - expandable card in its own row (CardSelection pattern) */}
                  {(filterBySearch('Bereich sozialer Ängste') ||
                    Object.values(FormTypes.SozialePhobieBereichSymptom).some(v => filterBySearch(SOZIALE_PHOBIE_BEREICH_LABELS[v])) ||
                    filterBySearch('Soziale Phobie')) && (() => {
                      const hasData = 'hauptsymptome' in angst.sozialePhobie;
                      const hasBereichSelected = hasData &&
                        (Object.values((angst.sozialePhobie as FormTypes.SozialePhobieSelected).bereichSozialerAengste.selection).some(e => e?.selected) ||
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
                                    .filter(v => !searchQuery.trim() || hasBereichSelected || filterBySearch(SOZIALE_PHOBIE_BEREICH_LABELS[v]) || filterBySearch('Soziale Phobie') || filterBySearch('Bereich sozialer Ängste'))
                                    .map((bereich) => {
                                      const isBereichItemSelected = !!sozialePhobie.bereichSozialerAengste.selection[bereich]?.selected;
                                      const isBereichItemExpanded = expandedSozialePhobieBereich.has(bereich);
                                      const bereichDetails = sozialePhobie.bereichSozialerAengste.selection[bereich]?.details;
                                      const hasBereichDetails = !!(bereichDetails?.brackets?.trim() || bereichDetails?.text?.trim());
                                      return (
                                        <div key={bereich} className="flex flex-col gap-1.5">
                                          <div className="flex gap-1.5">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const newSelection = { ...sozialePhobie.bereichSozialerAengste.selection };
                                                if (isBereichItemSelected) {
                                                  delete newSelection[bereich];
                                                  // Also collapse when deselecting
                                                  const newExpanded = new Set(expandedSozialePhobieBereich);
                                                  newExpanded.delete(bereich);
                                                  setExpandedSozialePhobieBereich(newExpanded);
                                                } else {
                                                  newSelection[bereich] = { selected: true, details: {} };
                                                }
                                                setNestedField('angstsymptomatik.sozialePhobie', {
                                                  ...sozialePhobie,
                                                  bereichSozialerAengste: {
                                                    ...sozialePhobie.bereichSozialerAengste,
                                                    selection: newSelection
                                                  }
                                                } as unknown as Record<string, unknown>);
                                              }}
                                              title={SOZIALE_PHOBIE_BEREICH_LABELS[bereich]}
                                              className={`
                                                flex-1 relative p-2.5 rounded-lg border-2 text-left text-sm font-medium transition-all duration-200
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
                                            {isBereichItemSelected && (
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const newExpanded = new Set(expandedSozialePhobieBereich);
                                                  if (isBereichItemExpanded) {
                                                    newExpanded.delete(bereich);
                                                  } else {
                                                    newExpanded.add(bereich);
                                                  }
                                                  setExpandedSozialePhobieBereich(newExpanded);
                                                }}
                                                className={`
                                                  px-2 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                                                  ${isBereichItemExpanded || hasBereichDetails
                                                    ? 'bg-blue-500 text-white border-blue-600 shadow-sm'
                                                    : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
                                                  }
                                                `}
                                                title="Ergänzungen hinzufügen"
                                              >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                              </button>
                                            )}
                                          </div>
                                          {isBereichItemExpanded && (
                                            <div className="flex flex-col gap-1.5">
                                              <input
                                                type="text"
                                                value={bereichDetails?.brackets || ''}
                                                onChange={(e) => {
                                                  const current = sozialePhobie.bereichSozialerAengste.selection[bereich];
                                                  const newSelection = {
                                                    ...sozialePhobie.bereichSozialerAengste.selection,
                                                    [bereich]: {
                                                      selected: true,
                                                      details: {
                                                        ...current?.details,
                                                        brackets: e.target.value || undefined
                                                      }
                                                    }
                                                  };
                                                  setNestedField('angstsymptomatik.sozialePhobie', {
                                                    ...sozialePhobie,
                                                    bereichSozialerAengste: {
                                                      ...sozialePhobie.bereichSozialerAengste,
                                                      selection: newSelection
                                                    }
                                                  } as unknown as Record<string, unknown>);
                                                }}
                                                className="w-full px-2.5 py-1.5 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                placeholder="Spezifikation in Klammern (...)"
                                                autoFocus
                                              />
                                              <input
                                                type="text"
                                                value={bereichDetails?.text || ''}
                                                onChange={(e) => {
                                                  const current = sozialePhobie.bereichSozialerAengste.selection[bereich];
                                                  const newSelection = {
                                                    ...sozialePhobie.bereichSozialerAengste.selection,
                                                    [bereich]: {
                                                      selected: true,
                                                      details: {
                                                        ...current?.details,
                                                        text: e.target.value || undefined
                                                      }
                                                    }
                                                  };
                                                  setNestedField('angstsymptomatik.sozialePhobie', {
                                                    ...sozialePhobie,
                                                    bereichSozialerAengste: {
                                                      ...sozialePhobie.bereichSozialerAengste,
                                                      selection: newSelection
                                                    }
                                                  } as unknown as Record<string, unknown>);
                                                }}
                                                onBlur={(e) => {
                                                  const val = e.target.value.trim();
                                                  if (val && !/[.!?]$/.test(val)) {
                                                    const current = sozialePhobie.bereichSozialerAengste.selection[bereich];
                                                    const newSelection = {
                                                      ...sozialePhobie.bereichSozialerAengste.selection,
                                                      [bereich]: {
                                                        selected: true,
                                                        details: {
                                                          ...current?.details,
                                                          text: `${val}.`
                                                        }
                                                      }
                                                    };
                                                    setNestedField('angstsymptomatik.sozialePhobie', {
                                                      ...sozialePhobie,
                                                      bereichSozialerAengste: {
                                                        ...sozialePhobie.bereichSozialerAengste,
                                                        selection: newSelection
                                                      }
                                                    } as unknown as Record<string, unknown>);
                                                  }
                                                }}
                                                className="w-full px-2.5 py-1.5 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                placeholder="Vollständigen Satz hinzufügen."
                                              />
                                            </div>
                                          )}
                                        </div>
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

                  {/* Vegetative Symptome - expandable card in its own row (CardSelection pattern) */}
                  {(filterBySearch('Vegetative Symptome') ||
                    Object.values(FormTypes.SozialePhobieVegetativSymptom).some(v => filterBySearch(SOZIALE_PHOBIE_VEGETATIV_LABELS[v])) ||
                    filterBySearch('Soziale Phobie')) && (() => {
                      const hasData = 'hauptsymptome' in angst.sozialePhobie;
                      const hasVegSelected = hasData &&
                        (Object.values((angst.sozialePhobie as FormTypes.SozialePhobieSelected).vegetativeSymptome.selection).some(e => e?.selected) ||
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
                                    .filter(v => !searchQuery.trim() || hasVegSelected || filterBySearch(SOZIALE_PHOBIE_VEGETATIV_LABELS[v]) || filterBySearch('Soziale Phobie') || filterBySearch('Vegetative Symptome'))
                                    .map((veg) => {
                                      const isVegItemSelected = !!sozialePhobie.vegetativeSymptome.selection[veg]?.selected;
                                      const isVegItemExpanded = expandedSozialePhobieVegetativ.has(veg);
                                      const vegDetails = sozialePhobie.vegetativeSymptome.selection[veg]?.details;
                                      const hasVegDetails = !!(vegDetails?.brackets?.trim() || vegDetails?.text?.trim());
                                      return (
                                        <div key={veg} className="flex flex-col gap-1.5">
                                          <div className="flex gap-1.5">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const newSelection = { ...sozialePhobie.vegetativeSymptome.selection };
                                                if (isVegItemSelected) {
                                                  delete newSelection[veg];
                                                  // Also collapse when deselecting
                                                  const newExpanded = new Set(expandedSozialePhobieVegetativ);
                                                  newExpanded.delete(veg);
                                                  setExpandedSozialePhobieVegetativ(newExpanded);
                                                } else {
                                                  newSelection[veg] = { selected: true, details: {} };
                                                }
                                                setNestedField('angstsymptomatik.sozialePhobie', {
                                                  ...sozialePhobie,
                                                  vegetativeSymptome: {
                                                    ...sozialePhobie.vegetativeSymptome,
                                                    selection: newSelection
                                                  }
                                                } as unknown as Record<string, unknown>);
                                              }}
                                              title={SOZIALE_PHOBIE_VEGETATIV_LABELS[veg]}
                                              className={`
                                                flex-1 relative p-2.5 rounded-lg border-2 text-left text-sm font-medium transition-all duration-200
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
                                            {isVegItemSelected && (
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const newExpanded = new Set(expandedSozialePhobieVegetativ);
                                                  if (isVegItemExpanded) {
                                                    newExpanded.delete(veg);
                                                  } else {
                                                    newExpanded.add(veg);
                                                  }
                                                  setExpandedSozialePhobieVegetativ(newExpanded);
                                                }}
                                                className={`
                                                  px-2 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                                                  ${isVegItemExpanded || hasVegDetails
                                                    ? 'bg-blue-500 text-white border-blue-600 shadow-sm'
                                                    : 'bg-white text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
                                                  }
                                                `}
                                                title="Ergänzungen hinzufügen"
                                              >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                              </button>
                                            )}
                                          </div>
                                          {isVegItemExpanded && (
                                            <div className="flex flex-col gap-1.5">
                                              <input
                                                type="text"
                                                value={vegDetails?.brackets || ''}
                                                onChange={(e) => {
                                                  const current = sozialePhobie.vegetativeSymptome.selection[veg];
                                                  const newSelection = {
                                                    ...sozialePhobie.vegetativeSymptome.selection,
                                                    [veg]: {
                                                      selected: true,
                                                      details: {
                                                        ...current?.details,
                                                        brackets: e.target.value || undefined
                                                      }
                                                    }
                                                  };
                                                  setNestedField('angstsymptomatik.sozialePhobie', {
                                                    ...sozialePhobie,
                                                    vegetativeSymptome: {
                                                      ...sozialePhobie.vegetativeSymptome,
                                                      selection: newSelection
                                                    }
                                                  } as unknown as Record<string, unknown>);
                                                }}
                                                className="w-full px-2.5 py-1.5 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                placeholder="Spezifikation in Klammern (...)"
                                                autoFocus
                                              />
                                              <input
                                                type="text"
                                                value={vegDetails?.text || ''}
                                                onChange={(e) => {
                                                  const current = sozialePhobie.vegetativeSymptome.selection[veg];
                                                  const newSelection = {
                                                    ...sozialePhobie.vegetativeSymptome.selection,
                                                    [veg]: {
                                                      selected: true,
                                                      details: {
                                                        ...current?.details,
                                                        text: e.target.value || undefined
                                                      }
                                                    }
                                                  };
                                                  setNestedField('angstsymptomatik.sozialePhobie', {
                                                    ...sozialePhobie,
                                                    vegetativeSymptome: {
                                                      ...sozialePhobie.vegetativeSymptome,
                                                      selection: newSelection
                                                    }
                                                  } as unknown as Record<string, unknown>);
                                                }}
                                                onBlur={(e) => {
                                                  const val = e.target.value.trim();
                                                  if (val && !/[.!?]$/.test(val)) {
                                                    const current = sozialePhobie.vegetativeSymptome.selection[veg];
                                                    const newSelection = {
                                                      ...sozialePhobie.vegetativeSymptome.selection,
                                                      [veg]: {
                                                        selected: true,
                                                        details: {
                                                          ...current?.details,
                                                          text: `${val}.`
                                                        }
                                                      }
                                                    };
                                                    setNestedField('angstsymptomatik.sozialePhobie', {
                                                      ...sozialePhobie,
                                                      vegetativeSymptome: {
                                                        ...sozialePhobie.vegetativeSymptome,
                                                        selection: newSelection
                                                      }
                                                    } as unknown as Record<string, unknown>);
                                                  }
                                                }}
                                                className="w-full px-2.5 py-1.5 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                placeholder="Vollständigen Satz hinzufügen."
                                              />
                                            </div>
                                          )}
                                        </div>
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

            {/* Spezifische (isolierte) Phobien - CardSelection pattern */}
            {(filterBySearch('Spezifische Phobien') ||
              filterBySearch('Spezifische (isolierte) Phobien') ||
              Object.values(FormTypes.SpezifischePhobieSymptom).some(v => filterBySearch(SPEZIFISCHE_PHOBIE_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Spezifische (isolierte) Phobien')}</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(FormTypes.SpezifischePhobieSymptom)
                      .filter(v => filterBySearch(SPEZIFISCHE_PHOBIE_LABELS[v]) || filterBySearch('Spezifische Phobien') || filterBySearch('Spezifische (isolierte) Phobien'))
                      .map((symptom) => {
                        const isItemSelected = !!angst.spezifischePhobien?.[symptom]?.selected;
                        const isExpanded = expandedSpezifischePhobien.has(symptom);
                        const details = angst.spezifischePhobien?.[symptom]?.details;
                        const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                        return (
                          <div key={symptom} className="flex flex-col gap-1.5">
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleCardToggle(
                                  'angstsymptomatik.spezifischePhobien',
                                  symptom,
                                  angst.spezifischePhobien,
                                  expandedSpezifischePhobien,
                                  setExpandedSpezifischePhobien
                                )}
                                title={SPEZIFISCHE_PHOBIE_LABELS[symptom]}
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
                                  {highlight(SPEZIFISCHE_PHOBIE_LABELS[symptom])}
                                </span>
                              </button>
                              {isItemSelected && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newExpanded = new Set(expandedSpezifischePhobien);
                                    if (isExpanded) {
                                      newExpanded.delete(symptom);
                                    } else {
                                      newExpanded.add(symptom);
                                    }
                                    setExpandedSpezifischePhobien(newExpanded);
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
                                  onChange={(e) => handleDetailsChange('angstsymptomatik.spezifischePhobien', symptom, 'brackets', e.target.value, angst.spezifischePhobien)}
                                  className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                  placeholder="Spezifikation in Klammern (...)"
                                  autoFocus
                                />
                                <input
                                  type="text"
                                  value={details?.text || ''}
                                  onChange={(e) => handleDetailsChange('angstsymptomatik.spezifischePhobien', symptom, 'text', e.target.value, angst.spezifischePhobien)}
                                  onBlur={(e) => {
                                    const val = e.target.value.trim();
                                    if (val && !/[.!?]$/.test(val)) {
                                      handleDetailsChange('angstsymptomatik.spezifischePhobien', symptom, 'text', `${val}.`, angst.spezifischePhobien);
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

            {/* Generalisierte Angststörung - CardSelection pattern */}
            {(filterBySearch('Generalisierte Angststörung') ||
              filterBySearch('Generalisiert') ||
              filterBySearch('Sorgenbezogene Symptomatik') ||
              Object.values(FormTypes.GeneralisierteAngstHauptsymptom).some(v => filterBySearch(GENERALISIERTE_ANGST_HAUPTSYMPTOM_LABELS[v])) ||
              Object.values(FormTypes.GeneralisierteAngstSorgenSymptom).some(v => filterBySearch(GENERALISIERTE_ANGST_SORGEN_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Generalisierte Angststörung')}</h3>

                  {/* Hauptsymptome - CardSelection pattern */}
                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    {Object.values(FormTypes.GeneralisierteAngstHauptsymptom)
                      .filter(v => !searchQuery.trim() || filterBySearch(GENERALISIERTE_ANGST_HAUPTSYMPTOM_LABELS[v]) || filterBySearch('Generalisierte Angststörung') || filterBySearch('Generalisiert'))
                      .map((symptom) => {
                        const hasData = angst.generalisierteAngst && 'hauptsymptome' in angst.generalisierteAngst;
                        const genAngst = hasData ? angst.generalisierteAngst as FormTypes.GeneralisierteAngstSelected : null;
                        const isItemSelected = !!genAngst?.hauptsymptome?.[symptom]?.selected;
                        const isExpanded = expandedGenAngstHaupt.has(symptom);
                        const details = genAngst?.hauptsymptome?.[symptom]?.details;
                        const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                        return (
                          <div key={symptom} className="flex flex-col gap-1.5">
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  if (!hasData) {
                                    // Initialize structure with CardSelection entry
                                    const newGenAngst: FormTypes.GeneralisierteAngstSelected = {
                                      hauptsymptome: { [symptom]: { selected: true, details: {} } },
                                      sorgen: { selection: {}, andere: '' }
                                    };
                                    setNestedField('angstsymptomatik.generalisierteAngst', newGenAngst as unknown as Record<string, unknown>);
                                  } else {
                                    const newHauptsymptome = { ...genAngst!.hauptsymptome };
                                    if (isItemSelected) {
                                      delete newHauptsymptome[symptom];
                                      // Close expanded if deselected
                                      if (expandedGenAngstHaupt.has(symptom)) {
                                        const newExpanded = new Set(expandedGenAngstHaupt);
                                        newExpanded.delete(symptom);
                                        setExpandedGenAngstHaupt(newExpanded);
                                      }
                                    } else {
                                      newHauptsymptome[symptom] = { selected: true, details: {} };
                                    }
                                    setNestedField('angstsymptomatik.generalisierteAngst', {
                                      ...genAngst,
                                      hauptsymptome: newHauptsymptome
                                    } as unknown as Record<string, unknown>);
                                  }
                                }}
                                title={GENERALISIERTE_ANGST_HAUPTSYMPTOM_LABELS[symptom]}
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
                                  {highlight(GENERALISIERTE_ANGST_HAUPTSYMPTOM_LABELS[symptom])}
                                </span>
                              </button>
                              {isItemSelected && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newExpanded = new Set(expandedGenAngstHaupt);
                                    if (isExpanded) {
                                      newExpanded.delete(symptom);
                                    } else {
                                      newExpanded.add(symptom);
                                    }
                                    setExpandedGenAngstHaupt(newExpanded);
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
                                  onChange={(e) => {
                                    const newHauptsymptome = {
                                      ...genAngst!.hauptsymptome,
                                      [symptom]: {
                                        selected: true,
                                        details: { ...details, brackets: e.target.value || undefined }
                                      }
                                    };
                                    setNestedField('angstsymptomatik.generalisierteAngst', {
                                      ...genAngst,
                                      hauptsymptome: newHauptsymptome
                                    } as unknown as Record<string, unknown>);
                                  }}
                                  className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                  placeholder="Spezifikation in Klammern (...)"
                                  autoFocus
                                />
                                <input
                                  type="text"
                                  value={details?.text || ''}
                                  onChange={(e) => {
                                    const newHauptsymptome = {
                                      ...genAngst!.hauptsymptome,
                                      [symptom]: {
                                        selected: true,
                                        details: { ...details, text: e.target.value || undefined }
                                      }
                                    };
                                    setNestedField('angstsymptomatik.generalisierteAngst', {
                                      ...genAngst,
                                      hauptsymptome: newHauptsymptome
                                    } as unknown as Record<string, unknown>);
                                  }}
                                  onBlur={(e) => {
                                    const val = e.target.value.trim();
                                    if (val && !/[.!?]$/.test(val)) {
                                      const newHauptsymptome = {
                                        ...genAngst!.hauptsymptome,
                                        [symptom]: {
                                          selected: true,
                                          details: { ...details, text: `${val}.` }
                                        }
                                      };
                                      setNestedField('angstsymptomatik.generalisierteAngst', {
                                        ...genAngst,
                                        hauptsymptome: newHauptsymptome
                                      } as unknown as Record<string, unknown>);
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

                    {/* Sorgenbezogene Symptomatik - Expandable Card (in same grid) */}
                    {(filterBySearch('Sorgenbezogene Symptomatik') ||
                      Object.values(FormTypes.GeneralisierteAngstSorgenSymptom).some(v => filterBySearch(GENERALISIERTE_ANGST_SORGEN_LABELS[v])) ||
                      filterBySearch('Generalisierte Angst')) && (() => {
                        const hasData = angst.generalisierteAngst && 'hauptsymptome' in angst.generalisierteAngst;
                        const hasSorgenSelected = hasData &&
                          (Object.values((angst.generalisierteAngst as FormTypes.GeneralisierteAngstSelected).sorgen.selection).some(e => e?.selected) ||
                            (angst.generalisierteAngst as FormTypes.GeneralisierteAngstSelected).sorgen.andere.trim() !== '');
                        const hasSorgenSubItemMatchingSearch = searchQuery.trim() !== '' &&
                          Object.values(FormTypes.GeneralisierteAngstSorgenSymptom).some(v => filterBySearch(GENERALISIERTE_ANGST_SORGEN_LABELS[v]));
                        const isSorgenExpanded = hasSorgenSelected || isGenAngstSorgenSectionExpanded || hasSorgenSubItemMatchingSearch;

                        return (
                          <SymptomCard
                            label="Sorgenbezogene Symptomatik"
                            highlightedLabel={highlight('Sorgenbezogene Symptomatik')}
                            isSelected={hasSorgenSelected}
                            onClick={() => {
                              if (!hasData) {
                                // Initialize structure and expand
                                const newGenAngst: FormTypes.GeneralisierteAngstSelected = {
                                  hauptsymptome: {},
                                  sorgen: { selection: {}, andere: '' }
                                };
                                setNestedField('angstsymptomatik.generalisierteAngst', newGenAngst as unknown as Record<string, unknown>);
                                setIsGenAngstSorgenSectionExpanded(true);
                              } else {
                                // Toggle expansion
                                setIsGenAngstSorgenSectionExpanded(!isSorgenExpanded);
                              }
                            }}
                            isExpandable={true}
                            isExpanded={isSorgenExpanded}
                          />
                        );
                      })()}
                  </div>

                  {/* Expanded: Sorgenbezogene Symptomatik sub-items */}
                  {(() => {
                    const hasData = angst.generalisierteAngst && 'hauptsymptome' in angst.generalisierteAngst;
                    const genAngst = hasData ? angst.generalisierteAngst as FormTypes.GeneralisierteAngstSelected : null;
                    const hasSorgenSelected = hasData &&
                      (Object.values((angst.generalisierteAngst as FormTypes.GeneralisierteAngstSelected).sorgen.selection).some(e => e?.selected) ||
                        (angst.generalisierteAngst as FormTypes.GeneralisierteAngstSelected).sorgen.andere.trim() !== '');
                    const hasSorgenSubItemMatchingSearch = searchQuery.trim() !== '' &&
                      Object.values(FormTypes.GeneralisierteAngstSorgenSymptom).some(v => filterBySearch(GENERALISIERTE_ANGST_SORGEN_LABELS[v]));
                    const isSorgenExpanded = hasSorgenSelected || isGenAngstSorgenSectionExpanded || hasSorgenSubItemMatchingSearch;

                    if (!hasData || !isSorgenExpanded) return null;

                    return (
                      <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg shadow-sm">
                        <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          {highlight('Sorgenbezogene Symptomatik')}:
                        </h4>
                        <div className="grid grid-cols-2 gap-2.5 mb-3">
                          {Object.values(FormTypes.GeneralisierteAngstSorgenSymptom)
                            .filter(v => !searchQuery.trim() || hasSorgenSelected || filterBySearch(GENERALISIERTE_ANGST_SORGEN_LABELS[v]) || filterBySearch('Generalisierte Angst') || filterBySearch('Sorgenbezogene Symptomatik'))
                            .map((symptom) => {
                              const isItemSelected = !!genAngst?.sorgen?.selection?.[symptom]?.selected;
                                  const isExpanded = expandedGenAngstSorgen.has(symptom);
                                  const details = genAngst?.sorgen?.selection?.[symptom]?.details;
                                  const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                                  return (
                                    <div key={symptom} className="flex flex-col gap-1.5">
                                      <div className="flex gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (!hasData) {
                                              // Initialize structure with CardSelection entry
                                              const newGenAngst: FormTypes.GeneralisierteAngstSelected = {
                                                hauptsymptome: {},
                                                sorgen: { selection: { [symptom]: { selected: true, details: {} } }, andere: '' }
                                              };
                                              setNestedField('angstsymptomatik.generalisierteAngst', newGenAngst as unknown as Record<string, unknown>);
                                            } else {
                                              const newSelection = { ...genAngst!.sorgen.selection };
                                              if (isItemSelected) {
                                                delete newSelection[symptom];
                                                // Close expanded if deselected
                                                if (expandedGenAngstSorgen.has(symptom)) {
                                                  const newExpanded = new Set(expandedGenAngstSorgen);
                                                  newExpanded.delete(symptom);
                                                  setExpandedGenAngstSorgen(newExpanded);
                                                }
                                              } else {
                                                newSelection[symptom] = { selected: true, details: {} };
                                              }
                                              setNestedField('angstsymptomatik.generalisierteAngst', {
                                                ...genAngst,
                                                sorgen: { ...genAngst!.sorgen, selection: newSelection }
                                              } as unknown as Record<string, unknown>);
                                            }
                                          }}
                                          title={GENERALISIERTE_ANGST_SORGEN_LABELS[symptom]}
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
                                            {highlight(GENERALISIERTE_ANGST_SORGEN_LABELS[symptom])}
                                          </span>
                                        </button>
                                        {isItemSelected && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newExpanded = new Set(expandedGenAngstSorgen);
                                              if (isExpanded) {
                                                newExpanded.delete(symptom);
                                              } else {
                                                newExpanded.add(symptom);
                                              }
                                              setExpandedGenAngstSorgen(newExpanded);
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
                                            onChange={(e) => {
                                              const newSelection = {
                                                ...genAngst!.sorgen.selection,
                                                [symptom]: {
                                                  selected: true,
                                                  details: { ...details, brackets: e.target.value || undefined }
                                                }
                                              };
                                              setNestedField('angstsymptomatik.generalisierteAngst', {
                                                ...genAngst,
                                                sorgen: { ...genAngst!.sorgen, selection: newSelection }
                                              } as unknown as Record<string, unknown>);
                                            }}
                                            className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                            placeholder="Spezifikation in Klammern (...)"
                                            autoFocus
                                          />
                                          <input
                                            type="text"
                                            value={details?.text || ''}
                                            onChange={(e) => {
                                              const newSelection = {
                                                ...genAngst!.sorgen.selection,
                                                [symptom]: {
                                                  selected: true,
                                                  details: { ...details, text: e.target.value || undefined }
                                                }
                                              };
                                              setNestedField('angstsymptomatik.generalisierteAngst', {
                                                ...genAngst,
                                                sorgen: { ...genAngst!.sorgen, selection: newSelection }
                                              } as unknown as Record<string, unknown>);
                                            }}
                                            onBlur={(e) => {
                                              const val = e.target.value.trim();
                                              if (val && !/[.!?]$/.test(val)) {
                                                const newSelection = {
                                                  ...genAngst!.sorgen.selection,
                                                  [symptom]: {
                                                    selected: true,
                                                    details: { ...details, text: `${val}.` }
                                                  }
                                                };
                                                setNestedField('angstsymptomatik.generalisierteAngst', {
                                                  ...genAngst,
                                                  sorgen: { ...genAngst!.sorgen, selection: newSelection }
                                                } as unknown as Record<string, unknown>);
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

                            {/* Andere text field */}
                            <div>
                              <input
                                type="text"
                                value={genAngst?.sorgen?.andere || ''}
                                onChange={(e) => {
                                  if (!hasData) {
                                    const newGenAngst: FormTypes.GeneralisierteAngstSelected = {
                                      hauptsymptome: {},
                                      sorgen: { selection: {}, andere: e.target.value }
                                    };
                                    setNestedField('angstsymptomatik.generalisierteAngst', newGenAngst as unknown as Record<string, unknown>);
                                  } else {
                                    setNestedField('angstsymptomatik.generalisierteAngst', {
                                      ...genAngst,
                                      sorgen: { ...genAngst!.sorgen, andere: e.target.value }
                                    } as unknown as Record<string, unknown>);
                                  }
                                }}
                                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                placeholder="Andere sorgenbezogene Symptome..."
                              />
                        </div>
                      </div>
                    );
                  })()}
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
