'use client';

import * as FormTypes from '@/lib/core/form-types';
import { highlightSearchText } from '@/lib/utils/highlight-utils';
import {
  MANISCHE_STIMMUNG_SYMPTOM_LABELS,
  MANISCHE_ANTRIEB_SYMPTOM_LABELS,
  MANISCHE_SPRACHE_KOGNITION_SYMPTOM_LABELS,
  MANISCHE_VEGETATIV_SYMPTOM_LABELS,
  MANISCHE_SELBSTERLEBEN_SYMPTOM_LABELS,
  MANISCHES_VERHALTEN_SYMPTOM_LABELS,
  IMPULSIVES_VERHALTEN_DETAIL_LABELS,
  MANISCHE_PSYCHOTISCH_SYMPTOM_LABELS,
  MANISCHE_DISSOCIATIV_SYMPTOM_LABELS,
  IMPULSIVES_VERHALTEN_LABEL,
} from '@/lib/core/form-labels';
import { getFormattedManischeSymptoms } from '@/lib/utils/manische-symptomatik-counter';
import { SymptomHandlers } from '@/hooks/useGutachtenForm';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ManischeSymptomatikModalProps {
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

export function ManischeSymptomatikModal({
  isOpen,
  onClose,
  formData,
  symptomHandlers,
  setNestedField
}: ManischeSymptomatikModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isImpulsivesManuallyExpanded, setIsImpulsivesManuallyExpanded] = useState(false);
  const [expandedStimmung, setExpandedStimmung] = useState<Set<FormTypes.ManischeStimmungSymptom>>(new Set());
  const [expandedAntrieb, setExpandedAntrieb] = useState<Set<FormTypes.ManischeAntriebSymptom>>(new Set());
  const [expandedSprache, setExpandedSprache] = useState<Set<FormTypes.ManischeSpracheKognitionSymptom>>(new Set());
  const [expandedVegetativ, setExpandedVegetativ] = useState<Set<FormTypes.ManischeVegetativSymptom>>(new Set());
  const [expandedSelbsterleben, setExpandedSelbsterleben] = useState<Set<FormTypes.ManischeSelbsterlebenSymptom>>(new Set());
  const [expandedVerhalten, setExpandedVerhalten] = useState<Set<FormTypes.ManischesVerhaltenSymptom>>(new Set());
  const [expandedPsychotisch, setExpandedPsychotisch] = useState<Set<FormTypes.ManischePsychotischSymptom>>(new Set());
  const [expandedDissoziativ, setExpandedDissoziativ] = useState<Set<FormTypes.ManischeDissociativSymptom>>(new Set());
  const [expandedImpulsives, setExpandedImpulsives] = useState<Set<FormTypes.ImpulsivesVerhaltenDetail>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  const ms = formData.manischeSymptomatik;

  // Check if "Impulsives Verhalten" section has any content (selected or andere filled)
  const hasImpulsivesContent =
    Object.values(ms.verhalten.impulsivesVerhalten.details).some(entry => entry?.selected) ||
    ms.verhalten.impulsivesVerhalten.andere.trim() !== '';

  // Check if any sub-item matches the search query (auto-expand when searching for sub-items)
  const searchLower = searchQuery.trim().toLowerCase();
  const hasSubItemMatchingSearch = searchLower !== '' &&
    Object.values(FormTypes.ImpulsivesVerhaltenDetail).some(v =>
      IMPULSIVES_VERHALTEN_DETAIL_LABELS[v].toLowerCase().includes(searchLower)
    );

  // Expanded if has content OR manually expanded OR sub-item matches search
  const isImpulsivesVerhaltenExpanded = hasImpulsivesContent || isImpulsivesManuallyExpanded || hasSubItemMatchingSearch;

  // Use shared utility for footer display - single source of truth
  const allSelectedSymptoms = getFormattedManischeSymptoms(ms).sort((a, b) => a.localeCompare(b));

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
    setIsImpulsivesManuallyExpanded(false);
    setExpandedStimmung(new Set());
    setExpandedAntrieb(new Set());
    setExpandedSprache(new Set());
    setExpandedVegetativ(new Set());
    setExpandedSelbsterleben(new Set());
    setExpandedVerhalten(new Set());
    setExpandedPsychotisch(new Set());
    setExpandedDissoziativ(new Set());
    setExpandedImpulsives(new Set());
    onClose();
  };

  // Handler to toggle a Psychotische Symptome item selection
  const handlePsychotischToggle = (symptom: FormTypes.ManischePsychotischSymptom) => {
    const currentSymptome = ms.psychotischeSymptome || {};
    const newSymptome = { ...currentSymptome };

    if (newSymptome[symptom]) {
      // Currently selected -> deselect (remove)
      delete newSymptome[symptom];
      // Close expanded details if this item was expanded
      if (expandedPsychotisch.has(symptom)) {
        const newExpanded = new Set(expandedPsychotisch);
        newExpanded.delete(symptom);
        setExpandedPsychotisch(newExpanded);
      }
    } else {
      // Not selected -> select with empty details
      newSymptome[symptom] = { selected: true, details: {} };
    }

    setNestedField('manischeSymptomatik.psychotischeSymptome', newSymptome as unknown as Record<string, unknown>);
  };

  // Handler to update a Psychotische Symptome detail field (brackets or text)
  const handlePsychotischDetailsChange = (
    symptom: FormTypes.ManischePsychotischSymptom,
    field: 'brackets' | 'text',
    value: string
  ) => {
    const currentSymptome = ms.psychotischeSymptome || {};
    const currentEntry = currentSymptome[symptom];
    const newSymptome = { ...currentSymptome };

    // Update or create the entry, preserving existing details
    newSymptome[symptom] = {
      selected: true,
      details: {
        ...currentEntry?.details,
        [field]: value || undefined
      }
    };

    setNestedField('manischeSymptomatik.psychotischeSymptome', newSymptome as unknown as Record<string, unknown>);
  };

  // Handler to toggle a Stimmung item selection (CardSelection pattern)
  const handleStimmungToggle = (symptom: FormTypes.ManischeStimmungSymptom) => {
    const currentSelection = ms.stimmungEmotionalesErleben || {};
    const newSelection = { ...currentSelection };

    if (newSelection[symptom]) {
      // Currently selected -> deselect (remove)
      delete newSelection[symptom];
      // Close expanded details if this item was expanded
      if (expandedStimmung.has(symptom)) {
        const newExpanded = new Set(expandedStimmung);
        newExpanded.delete(symptom);
        setExpandedStimmung(newExpanded);
      }
    } else {
      // Not selected -> select with empty details
      newSelection[symptom] = { selected: true, details: {} };
    }

    setNestedField('manischeSymptomatik.stimmungEmotionalesErleben', newSelection as unknown as Record<string, unknown>);
  };

  // Handler to update a Stimmung detail field (brackets or text)
  const handleStimmungDetailsChange = (
    symptom: FormTypes.ManischeStimmungSymptom,
    field: 'brackets' | 'text',
    value: string
  ) => {
    const currentSelection = ms.stimmungEmotionalesErleben || {};
    const currentEntry = currentSelection[symptom];
    const newSelection = { ...currentSelection };

    // Update or create the entry, preserving existing details
    newSelection[symptom] = {
      selected: true,
      details: {
        ...currentEntry?.details,
        [field]: value || undefined
      }
    };

    setNestedField('manischeSymptomatik.stimmungEmotionalesErleben', newSelection as unknown as Record<string, unknown>);
  };

  // Handler to toggle an Antrieb item selection (CardSelection pattern)
  const handleAntriebToggle = (symptom: FormTypes.ManischeAntriebSymptom) => {
    const currentSelection = ms.antriebEnergiePsychomotorik || {};
    const newSelection = { ...currentSelection };
    if (newSelection[symptom]) {
      delete newSelection[symptom];
      if (expandedAntrieb.has(symptom)) {
        const newExpanded = new Set(expandedAntrieb);
        newExpanded.delete(symptom);
        setExpandedAntrieb(newExpanded);
      }
    } else {
      newSelection[symptom] = { selected: true, details: {} };
    }
    setNestedField('manischeSymptomatik.antriebEnergiePsychomotorik', newSelection as unknown as Record<string, unknown>);
  };

  const handleAntriebDetailsChange = (
    symptom: FormTypes.ManischeAntriebSymptom,
    field: 'brackets' | 'text',
    value: string
  ) => {
    const currentSelection = ms.antriebEnergiePsychomotorik || {};
    const currentEntry = currentSelection[symptom];
    const newSelection = { ...currentSelection };
    newSelection[symptom] = {
      selected: true,
      details: { ...currentEntry?.details, [field]: value || undefined }
    };
    setNestedField('manischeSymptomatik.antriebEnergiePsychomotorik', newSelection as unknown as Record<string, unknown>);
  };

  // Handler to toggle a Sprache item selection (CardSelection pattern)
  const handleSpracheToggle = (symptom: FormTypes.ManischeSpracheKognitionSymptom) => {
    const currentSelection = ms.spracheKognition || {};
    const newSelection = { ...currentSelection };
    if (newSelection[symptom]) {
      delete newSelection[symptom];
      if (expandedSprache.has(symptom)) {
        const newExpanded = new Set(expandedSprache);
        newExpanded.delete(symptom);
        setExpandedSprache(newExpanded);
      }
    } else {
      newSelection[symptom] = { selected: true, details: {} };
    }
    setNestedField('manischeSymptomatik.spracheKognition', newSelection as unknown as Record<string, unknown>);
  };

  const handleSpracheDetailsChange = (
    symptom: FormTypes.ManischeSpracheKognitionSymptom,
    field: 'brackets' | 'text',
    value: string
  ) => {
    const currentSelection = ms.spracheKognition || {};
    const currentEntry = currentSelection[symptom];
    const newSelection = { ...currentSelection };
    newSelection[symptom] = {
      selected: true,
      details: { ...currentEntry?.details, [field]: value || undefined }
    };
    setNestedField('manischeSymptomatik.spracheKognition', newSelection as unknown as Record<string, unknown>);
  };

  // Handler to toggle a Vegetativ item selection (CardSelection pattern)
  const handleVegetativToggle = (symptom: FormTypes.ManischeVegetativSymptom) => {
    const currentSelection = ms.vegetativeSymptome || {};
    const newSelection = { ...currentSelection };
    if (newSelection[symptom]) {
      delete newSelection[symptom];
      if (expandedVegetativ.has(symptom)) {
        const newExpanded = new Set(expandedVegetativ);
        newExpanded.delete(symptom);
        setExpandedVegetativ(newExpanded);
      }
    } else {
      newSelection[symptom] = { selected: true, details: {} };
    }
    setNestedField('manischeSymptomatik.vegetativeSymptome', newSelection as unknown as Record<string, unknown>);
  };

  const handleVegetativDetailsChange = (
    symptom: FormTypes.ManischeVegetativSymptom,
    field: 'brackets' | 'text',
    value: string
  ) => {
    const currentSelection = ms.vegetativeSymptome || {};
    const currentEntry = currentSelection[symptom];
    const newSelection = { ...currentSelection };
    newSelection[symptom] = {
      selected: true,
      details: { ...currentEntry?.details, [field]: value || undefined }
    };
    setNestedField('manischeSymptomatik.vegetativeSymptome', newSelection as unknown as Record<string, unknown>);
  };

  // Handler to toggle a Selbsterleben item selection (CardSelection pattern)
  const handleSelbsterlebenToggle = (symptom: FormTypes.ManischeSelbsterlebenSymptom) => {
    const currentSelection = ms.selbsterleben || {};
    const newSelection = { ...currentSelection };
    if (newSelection[symptom]) {
      delete newSelection[symptom];
      if (expandedSelbsterleben.has(symptom)) {
        const newExpanded = new Set(expandedSelbsterleben);
        newExpanded.delete(symptom);
        setExpandedSelbsterleben(newExpanded);
      }
    } else {
      newSelection[symptom] = { selected: true, details: {} };
    }
    setNestedField('manischeSymptomatik.selbsterleben', newSelection as unknown as Record<string, unknown>);
  };

  const handleSelbsterlebenDetailsChange = (
    symptom: FormTypes.ManischeSelbsterlebenSymptom,
    field: 'brackets' | 'text',
    value: string
  ) => {
    const currentSelection = ms.selbsterleben || {};
    const currentEntry = currentSelection[symptom];
    const newSelection = { ...currentSelection };
    newSelection[symptom] = {
      selected: true,
      details: { ...currentEntry?.details, [field]: value || undefined }
    };
    setNestedField('manischeSymptomatik.selbsterleben', newSelection as unknown as Record<string, unknown>);
  };

  // Handler to toggle a Verhalten item selection (CardSelection pattern)
  const handleVerhaltenToggle = (symptom: FormTypes.ManischesVerhaltenSymptom) => {
    const currentSelection = ms.verhalten.selection || {};
    const newSelection = { ...currentSelection };
    if (newSelection[symptom]) {
      delete newSelection[symptom];
      if (expandedVerhalten.has(symptom)) {
        const newExpanded = new Set(expandedVerhalten);
        newExpanded.delete(symptom);
        setExpandedVerhalten(newExpanded);
      }
    } else {
      newSelection[symptom] = { selected: true, details: {} };
    }
    setNestedField('manischeSymptomatik.verhalten.selection', newSelection as unknown as Record<string, unknown>);
  };

  const handleVerhaltenDetailsChange = (
    symptom: FormTypes.ManischesVerhaltenSymptom,
    field: 'brackets' | 'text',
    value: string
  ) => {
    const currentSelection = ms.verhalten.selection || {};
    const currentEntry = currentSelection[symptom];
    const newSelection = { ...currentSelection };
    newSelection[symptom] = {
      selected: true,
      details: { ...currentEntry?.details, [field]: value || undefined }
    };
    setNestedField('manischeSymptomatik.verhalten.selection', newSelection as unknown as Record<string, unknown>);
  };

  // Handler to toggle a Dissoziativ item selection (CardSelection pattern)
  const handleDissoziativToggle = (symptom: FormTypes.ManischeDissociativSymptom) => {
    const currentSelection = ms.dissoziativeSymptome || {};
    const newSelection = { ...currentSelection };
    if (newSelection[symptom]) {
      delete newSelection[symptom];
      if (expandedDissoziativ.has(symptom)) {
        const newExpanded = new Set(expandedDissoziativ);
        newExpanded.delete(symptom);
        setExpandedDissoziativ(newExpanded);
      }
    } else {
      newSelection[symptom] = { selected: true, details: {} };
    }
    setNestedField('manischeSymptomatik.dissoziativeSymptome', newSelection as unknown as Record<string, unknown>);
  };

  const handleDissoziativDetailsChange = (
    symptom: FormTypes.ManischeDissociativSymptom,
    field: 'brackets' | 'text',
    value: string
  ) => {
    const currentSelection = ms.dissoziativeSymptome || {};
    const currentEntry = currentSelection[symptom];
    const newSelection = { ...currentSelection };
    newSelection[symptom] = {
      selected: true,
      details: { ...currentEntry?.details, [field]: value || undefined }
    };
    setNestedField('manischeSymptomatik.dissoziativeSymptome', newSelection as unknown as Record<string, unknown>);
  };

  // Handler to toggle an Impulsives Verhalten sub-item (CardSelection pattern)
  const handleImpulsivesToggle = (symptom: FormTypes.ImpulsivesVerhaltenDetail) => {
    const currentDetails = ms.verhalten.impulsivesVerhalten.details;
    const newDetails = { ...currentDetails };
    if (newDetails[symptom]) {
      delete newDetails[symptom];
      if (expandedImpulsives.has(symptom)) {
        const newExpanded = new Set(expandedImpulsives);
        newExpanded.delete(symptom);
        setExpandedImpulsives(newExpanded);
      }
    } else {
      newDetails[symptom] = { selected: true, details: {} };
    }
    setNestedField('manischeSymptomatik.verhalten.impulsivesVerhalten.details', newDetails as unknown as Record<string, unknown>);
  };

  const handleImpulsivesDetailsChange = (
    symptom: FormTypes.ImpulsivesVerhaltenDetail,
    field: 'brackets' | 'text',
    value: string
  ) => {
    const currentDetails = ms.verhalten.impulsivesVerhalten.details;
    const currentEntry = currentDetails[symptom];
    const newDetails = { ...currentDetails };
    newDetails[symptom] = {
      selected: true,
      details: { ...currentEntry?.details, [field]: value || undefined }
    };
    setNestedField('manischeSymptomatik.verhalten.impulsivesVerhalten.details', newDetails as unknown as Record<string, unknown>);
  };

  // Handler to clear all selections and close
  const handleClearAndClose = () => {
    // Use shared clear function for consistency with main page
    symptomHandlers.clearManischeSymptomatik();
    handleClose();
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed top-36 bottom-4 left-4 right-[46%] z-40 flex items-start justify-center p-2">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-200 w-full max-w-5xl max-h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-900">Manische Symptomatik</h2>
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
              disabled={isImpulsivesManuallyExpanded && !hasImpulsivesContent}
              className={`px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-200 ${
                isImpulsivesManuallyExpanded && !hasImpulsivesContent
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg cursor-pointer'
              }`}
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
            {/* Stimmung und emotionales Erleben - Cards with expandable details */}
            {Object.values(FormTypes.ManischeStimmungSymptom).some(v => filterBySearch(MANISCHE_STIMMUNG_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Stimmung und emotionales Erleben')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.ManischeStimmungSymptom)
                    .filter(v => filterBySearch(MANISCHE_STIMMUNG_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ms.stimmungEmotionalesErleben?.[symptom]?.selected;
                      const isExpanded = expandedStimmung.has(symptom);
                      const details = ms.stimmungEmotionalesErleben?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          {/* Card row with flex for edit button */}
                          <div className="flex gap-1.5">
                            {/* Card - shrinks when edit button appears */}
                            <button
                              type="button"
                              onClick={() => handleStimmungToggle(symptom)}
                              title={MANISCHE_STIMMUNG_SYMPTOM_LABELS[symptom]}
                              className={`
                                flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center
                                ${isItemSelected
                                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                                  : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                                }
                                focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer
                              `}
                            >
                              {/* Checkmark indicator */}
                              {isItemSelected && (
                                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M5 13l4 4L19 7"></path>
                                  </svg>
                                </div>
                              )}
                              {/* Label */}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                                {highlight(MANISCHE_STIMMUNG_SYMPTOM_LABELS[symptom])}
                              </span>
                            </button>
                            {/* Edit button - appears outside card when selected */}
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
                          {/* Expanded detail inputs - card width only */}
                          {isExpanded && (
                            <div className="flex flex-col gap-1.5">
                              <input
                                type="text"
                                value={details?.brackets || ''}
                                onChange={(e) => handleStimmungDetailsChange(symptom, 'brackets', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                placeholder="Spezifikation in Klammern (...)"
                                autoFocus
                              />
                              <input
                                type="text"
                                value={details?.text || ''}
                                onChange={(e) => handleStimmungDetailsChange(symptom, 'text', e.target.value)}
                                onBlur={(e) => {
                                  const val = e.target.value.trim();
                                  if (val && !/[.!?]$/.test(val)) {
                                    handleStimmungDetailsChange(symptom, 'text', `${val}.`);
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

            {/* Antrieb, Energie und Psychomotorik - Cards with expandable details */}
            {Object.values(FormTypes.ManischeAntriebSymptom).some(v => filterBySearch(MANISCHE_ANTRIEB_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Antrieb, Energie und Psychomotorik')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.ManischeAntriebSymptom)
                    .filter(v => filterBySearch(MANISCHE_ANTRIEB_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ms.antriebEnergiePsychomotorik?.[symptom]?.selected;
                      const isExpanded = expandedAntrieb.has(symptom);
                      const details = ms.antriebEnergiePsychomotorik?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleAntriebToggle(symptom)}
                              title={MANISCHE_ANTRIEB_SYMPTOM_LABELS[symptom]}
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
                                {highlight(MANISCHE_ANTRIEB_SYMPTOM_LABELS[symptom])}
                              </span>
                            </button>
                            {isItemSelected && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newExpanded = new Set(expandedAntrieb);
                                  if (isExpanded) {
                                    newExpanded.delete(symptom);
                                  } else {
                                    newExpanded.add(symptom);
                                  }
                                  setExpandedAntrieb(newExpanded);
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
                                onChange={(e) => handleAntriebDetailsChange(symptom, 'brackets', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                placeholder="Spezifikation in Klammern (...)"
                                autoFocus
                              />
                              <input
                                type="text"
                                value={details?.text || ''}
                                onChange={(e) => handleAntriebDetailsChange(symptom, 'text', e.target.value)}
                                onBlur={(e) => {
                                  const val = e.target.value.trim();
                                  if (val && !/[.!?]$/.test(val)) {
                                    handleAntriebDetailsChange(symptom, 'text', `${val}.`);
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

            {/* Sprache und Kognition - Cards with expandable details */}
            {Object.values(FormTypes.ManischeSpracheKognitionSymptom).some(v => filterBySearch(MANISCHE_SPRACHE_KOGNITION_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Sprache und Kognition')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.ManischeSpracheKognitionSymptom)
                    .filter(v => filterBySearch(MANISCHE_SPRACHE_KOGNITION_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ms.spracheKognition?.[symptom]?.selected;
                      const isExpanded = expandedSprache.has(symptom);
                      const details = ms.spracheKognition?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSpracheToggle(symptom)}
                              title={MANISCHE_SPRACHE_KOGNITION_SYMPTOM_LABELS[symptom]}
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
                                {highlight(MANISCHE_SPRACHE_KOGNITION_SYMPTOM_LABELS[symptom])}
                              </span>
                            </button>
                            {isItemSelected && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newExpanded = new Set(expandedSprache);
                                  if (isExpanded) {
                                    newExpanded.delete(symptom);
                                  } else {
                                    newExpanded.add(symptom);
                                  }
                                  setExpandedSprache(newExpanded);
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
                                onChange={(e) => handleSpracheDetailsChange(symptom, 'brackets', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                placeholder="Spezifikation in Klammern (...)"
                                autoFocus
                              />
                              <input
                                type="text"
                                value={details?.text || ''}
                                onChange={(e) => handleSpracheDetailsChange(symptom, 'text', e.target.value)}
                                onBlur={(e) => {
                                  const val = e.target.value.trim();
                                  if (val && !/[.!?]$/.test(val)) {
                                    handleSpracheDetailsChange(symptom, 'text', `${val}.`);
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

            {/* Vegetative Symptome - Cards with expandable details */}
            {Object.values(FormTypes.ManischeVegetativSymptom).some(v => filterBySearch(MANISCHE_VEGETATIV_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Vegetative Symptome')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.ManischeVegetativSymptom)
                    .filter(v => filterBySearch(MANISCHE_VEGETATIV_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ms.vegetativeSymptome?.[symptom]?.selected;
                      const isExpanded = expandedVegetativ.has(symptom);
                      const details = ms.vegetativeSymptome?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleVegetativToggle(symptom)}
                              title={MANISCHE_VEGETATIV_SYMPTOM_LABELS[symptom]}
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
                                {highlight(MANISCHE_VEGETATIV_SYMPTOM_LABELS[symptom])}
                              </span>
                            </button>
                            {isItemSelected && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newExpanded = new Set(expandedVegetativ);
                                  if (isExpanded) {
                                    newExpanded.delete(symptom);
                                  } else {
                                    newExpanded.add(symptom);
                                  }
                                  setExpandedVegetativ(newExpanded);
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
                                onChange={(e) => handleVegetativDetailsChange(symptom, 'brackets', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                placeholder="Spezifikation in Klammern (...)"
                                autoFocus
                              />
                              <input
                                type="text"
                                value={details?.text || ''}
                                onChange={(e) => handleVegetativDetailsChange(symptom, 'text', e.target.value)}
                                onBlur={(e) => {
                                  const val = e.target.value.trim();
                                  if (val && !/[.!?]$/.test(val)) {
                                    handleVegetativDetailsChange(symptom, 'text', `${val}.`);
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

            {/* Selbsterleben - Cards with expandable details */}
            {Object.values(FormTypes.ManischeSelbsterlebenSymptom).some(v => filterBySearch(MANISCHE_SELBSTERLEBEN_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Selbsterleben')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.ManischeSelbsterlebenSymptom)
                    .filter(v => filterBySearch(MANISCHE_SELBSTERLEBEN_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ms.selbsterleben?.[symptom]?.selected;
                      const isExpanded = expandedSelbsterleben.has(symptom);
                      const details = ms.selbsterleben?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSelbsterlebenToggle(symptom)}
                              title={MANISCHE_SELBSTERLEBEN_SYMPTOM_LABELS[symptom]}
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
                                {highlight(MANISCHE_SELBSTERLEBEN_SYMPTOM_LABELS[symptom])}
                              </span>
                            </button>
                            {isItemSelected && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newExpanded = new Set(expandedSelbsterleben);
                                  if (isExpanded) {
                                    newExpanded.delete(symptom);
                                  } else {
                                    newExpanded.add(symptom);
                                  }
                                  setExpandedSelbsterleben(newExpanded);
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
                                onChange={(e) => handleSelbsterlebenDetailsChange(symptom, 'brackets', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                placeholder="Spezifikation in Klammern (...)"
                                autoFocus
                              />
                              <input
                                type="text"
                                value={details?.text || ''}
                                onChange={(e) => handleSelbsterlebenDetailsChange(symptom, 'text', e.target.value)}
                                onBlur={(e) => {
                                  const val = e.target.value.trim();
                                  if (val && !/[.!?]$/.test(val)) {
                                    handleSelbsterlebenDetailsChange(symptom, 'text', `${val}.`);
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

            {/* Verhalten - Cards with expandable details for main selection */}
            {(Object.values(FormTypes.ManischesVerhaltenSymptom).some(v => filterBySearch(MANISCHES_VERHALTEN_SYMPTOM_LABELS[v])) ||
              filterBySearch(IMPULSIVES_VERHALTEN_LABEL) ||
              Object.values(FormTypes.ImpulsivesVerhaltenDetail).some(v => filterBySearch(IMPULSIVES_VERHALTEN_DETAIL_LABELS[v]))) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Verhalten')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Regular verhalten items (4 items) - Cards with expandable details */}
                  {Object.values(FormTypes.ManischesVerhaltenSymptom)
                    .filter(v => filterBySearch(MANISCHES_VERHALTEN_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ms.verhalten.selection?.[symptom]?.selected;
                      const isExpanded = expandedVerhalten.has(symptom);
                      const details = ms.verhalten.selection?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleVerhaltenToggle(symptom)}
                              title={MANISCHES_VERHALTEN_SYMPTOM_LABELS[symptom]}
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
                                {highlight(MANISCHES_VERHALTEN_SYMPTOM_LABELS[symptom])}
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
                                onChange={(e) => handleVerhaltenDetailsChange(symptom, 'brackets', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                placeholder="Spezifikation in Klammern (...)"
                                autoFocus
                              />
                              <input
                                type="text"
                                value={details?.text || ''}
                                onChange={(e) => handleVerhaltenDetailsChange(symptom, 'text', e.target.value)}
                                onBlur={(e) => {
                                  const val = e.target.value.trim();
                                  if (val && !/[.!?]$/.test(val)) {
                                    handleVerhaltenDetailsChange(symptom, 'text', `${val}.`);
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

                  {/* Impulsives Verhalten - expandable (stays SymptomSelection) */}
                  {/* Show if parent label matches OR any sub-item matches the search */}
                  {(filterBySearch(IMPULSIVES_VERHALTEN_LABEL) ||
                    Object.values(FormTypes.ImpulsivesVerhaltenDetail).some(v => filterBySearch(IMPULSIVES_VERHALTEN_DETAIL_LABELS[v]))) && (
                    <SymptomCard
                      label={IMPULSIVES_VERHALTEN_LABEL}
                      highlightedLabel={highlight(IMPULSIVES_VERHALTEN_LABEL)}
                      isSelected={hasImpulsivesContent}
                      onClick={() => {
                        // Toggle expand/collapse
                        if (isImpulsivesVerhaltenExpanded) {
                          // Collapse: clear all impulsives data and manual expansion
                          for (const key of Object.keys(ms.verhalten.impulsivesVerhalten.details)) {
                            handleToggle('manischeSymptomatik.verhalten.impulsivesVerhalten.details', key);
                          }
                          symptomHandlers.setNestedTextField('manischeSymptomatik.verhalten.impulsivesVerhalten.andere', '');
                          setIsImpulsivesManuallyExpanded(false);
                        } else {
                          // Expand: set manual expansion
                          setIsImpulsivesManuallyExpanded(true);
                        }
                      }}
                      isExpandable={true}
                      isExpanded={isImpulsivesVerhaltenExpanded}
                    />
                  )}
                </div>

                {/* Nested: Impulsives Verhalten sub-items - shown only when expanded */}
                {isImpulsivesVerhaltenExpanded && (
                  <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg shadow-sm">
                    <div className="mb-3 flex items-center gap-4">
                      <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        {highlight('Impulsives Verhalten')} - Details:
                      </h4>
                    </div>
                    {/* Hint: at least one symptom required */}
                    {!hasImpulsivesContent && (
                      <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
                        <span className="font-medium">Hinweis:</span> Mindestens ein Symptom muss ausgewählt oder im Textfeld &quot;Andere&quot; eingetragen werden.
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Filter sub-items: show all if no search or parent matches, otherwise only matching */}
                      {Object.values(FormTypes.ImpulsivesVerhaltenDetail)
                        .filter(v => {
                          // No search or parent label matches -> show all
                          if (!searchLower || filterBySearch(IMPULSIVES_VERHALTEN_LABEL)) return true;
                          // Otherwise filter to matching sub-items only
                          return IMPULSIVES_VERHALTEN_DETAIL_LABELS[v].toLowerCase().includes(searchLower);
                        })
                        .map((symptom) => {
                          const isItemSelected = !!ms.verhalten.impulsivesVerhalten.details[symptom]?.selected;
                          const isExpanded = expandedImpulsives.has(symptom);
                          const details = ms.verhalten.impulsivesVerhalten.details[symptom]?.details;
                          const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                          return (
                            <div key={symptom} className="flex flex-col gap-1.5">
                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleImpulsivesToggle(symptom)}
                                  title={IMPULSIVES_VERHALTEN_DETAIL_LABELS[symptom]}
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
                                    {highlight(IMPULSIVES_VERHALTEN_DETAIL_LABELS[symptom])}
                                  </span>
                                </button>
                                {isItemSelected && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newExpanded = new Set(expandedImpulsives);
                                      if (isExpanded) {
                                        newExpanded.delete(symptom);
                                      } else {
                                        newExpanded.add(symptom);
                                      }
                                      setExpandedImpulsives(newExpanded);
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
                                    onChange={(e) => handleImpulsivesDetailsChange(symptom, 'brackets', e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    placeholder="Spezifikation in Klammern (...)"
                                    autoFocus
                                  />
                                  <input
                                    type="text"
                                    value={details?.text || ''}
                                    onChange={(e) => handleImpulsivesDetailsChange(symptom, 'text', e.target.value)}
                                    onBlur={(e) => {
                                      const val = e.target.value.trim();
                                      if (val && !/[.!?]$/.test(val)) {
                                        handleImpulsivesDetailsChange(symptom, 'text', `${val}.`);
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
                    {/* Andere field for impulsives */}
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-blue-900 mb-2">Andere</label>
                      <input
                        type="text"
                        value={ms.verhalten.impulsivesVerhalten.andere}
                        onChange={(e) =>
                          symptomHandlers.setNestedTextField('manischeSymptomatik.verhalten.impulsivesVerhalten.andere', e.target.value)
                        }
                        className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        placeholder="Weitere impulsive Verhaltensweisen..."
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Psychotische Symptome - Cards with expandable details */}
            {Object.values(FormTypes.ManischePsychotischSymptom).some(v => filterBySearch(MANISCHE_PSYCHOTISCH_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Psychotische Symptome')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.ManischePsychotischSymptom)
                    .filter(v => filterBySearch(MANISCHE_PSYCHOTISCH_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ms.psychotischeSymptome?.[symptom]?.selected;
                      const isExpanded = expandedPsychotisch.has(symptom);
                      const details = ms.psychotischeSymptome?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          {/* Card row with flex for edit button */}
                          <div className="flex gap-1.5">
                            {/* Card - shrinks when edit button appears */}
                            <button
                              type="button"
                              onClick={() => handlePsychotischToggle(symptom)}
                              title={MANISCHE_PSYCHOTISCH_SYMPTOM_LABELS[symptom]}
                              className={`
                                flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center
                                ${isItemSelected
                                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                                  : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                                }
                                focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer
                              `}
                            >
                              {/* Checkmark indicator */}
                              {isItemSelected && (
                                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M5 13l4 4L19 7"></path>
                                  </svg>
                                </div>
                              )}
                              {/* Label */}
                              <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                                {highlight(MANISCHE_PSYCHOTISCH_SYMPTOM_LABELS[symptom])}
                              </span>
                            </button>
                            {/* Edit button - appears outside card when selected */}
                            {isItemSelected && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newExpanded = new Set(expandedPsychotisch);
                                  if (isExpanded) {
                                    newExpanded.delete(symptom);
                                  } else {
                                    newExpanded.add(symptom);
                                  }
                                  setExpandedPsychotisch(newExpanded);
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
                          {/* Expanded detail inputs - card width only */}
                          {isExpanded && (
                            <div className="flex flex-col gap-1.5">
                              <input
                                type="text"
                                value={details?.brackets || ''}
                                onChange={(e) => handlePsychotischDetailsChange(symptom, 'brackets', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                placeholder="Spezifikation in Klammern (...)"
                                autoFocus
                              />
                              <input
                                type="text"
                                value={details?.text || ''}
                                onChange={(e) => handlePsychotischDetailsChange(symptom, 'text', e.target.value)}
                                onBlur={(e) => {
                                  const val = e.target.value.trim();
                                  if (val && !/[.!?]$/.test(val)) {
                                    handlePsychotischDetailsChange(symptom, 'text', `${val}.`);
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

            {/* Dissoziative Symptome - Cards with expandable details */}
            {Object.values(FormTypes.ManischeDissociativSymptom).some(v => filterBySearch(MANISCHE_DISSOCIATIV_SYMPTOM_LABELS[v])) && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Dissoziative Symptome')}</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(FormTypes.ManischeDissociativSymptom)
                    .filter(v => filterBySearch(MANISCHE_DISSOCIATIV_SYMPTOM_LABELS[v]))
                    .map((symptom) => {
                      const isItemSelected = !!ms.dissoziativeSymptome?.[symptom]?.selected;
                      const isExpanded = expandedDissoziativ.has(symptom);
                      const details = ms.dissoziativeSymptome?.[symptom]?.details;
                      const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
                      return (
                        <div key={symptom} className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDissoziativToggle(symptom)}
                              title={MANISCHE_DISSOCIATIV_SYMPTOM_LABELS[symptom]}
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
                                {highlight(MANISCHE_DISSOCIATIV_SYMPTOM_LABELS[symptom])}
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
                                onChange={(e) => handleDissoziativDetailsChange(symptom, 'brackets', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                placeholder="Spezifikation in Klammern (...)"
                                autoFocus
                              />
                              <input
                                type="text"
                                value={details?.text || ''}
                                onChange={(e) => handleDissoziativDetailsChange(symptom, 'text', e.target.value)}
                                onBlur={(e) => {
                                  const val = e.target.value.trim();
                                  if (val && !/[.!?]$/.test(val)) {
                                    handleDissoziativDetailsChange(symptom, 'text', `${val}.`);
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

            {/* Andere Symptome - Text Field */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                Andere Symptome
              </label>
              <textarea
                value={ms.andereSymptome}
                onChange={(e) =>
                  symptomHandlers.setNestedTextField('manischeSymptomatik.andereSymptome', e.target.value)
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
