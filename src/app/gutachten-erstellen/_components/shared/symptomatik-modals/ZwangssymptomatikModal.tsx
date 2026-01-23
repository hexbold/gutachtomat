'use client';

import { SymptomHandlers } from '@/hooks/useGutachtenForm';
import { highlightSearchText } from '@/lib/utils/highlight-utils';
import {
  ZWANGSGEDANKEN_WIEDERKEHREND_FELD_LABELS,
  ZWANGSGEDANKEN_WIEDERKEHREND_LABEL,
  ZWANGSGEDANKEN_FIELD_LABELS,
  ZWANGSHANDLUNG_TYP_LABELS,
  ZWANGSHANDLUNGEN_LABEL,
  ZWANGSBEZOGENE_KOGNITION_SYMPTOM_LABELS,
} from '@/lib/core/form-labels';
import * as FormTypes from '@/lib/core/form-types';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ZwangssymptomatikModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  symptomHandlers: SymptomHandlers;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
}

interface TextFieldCardProps {
  label: string;
  highlightedLabel?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  isExpandable?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

function TextFieldCard({ label, highlightedLabel, value, onChange, isExpandable, isExpanded, onToggleExpand }: TextFieldCardProps) {
  const hasValue = value.trim() !== '';

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onToggleExpand}
        className={`
          relative w-full p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center
          ${hasValue
            ? 'border-blue-500 bg-blue-50 shadow-sm'
            : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer
        `}
      >
        {hasValue && (
          <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        )}
        <span className={`text-sm font-semibold leading-snug pr-6 ${isExpandable ? 'pb-6' : ''} line-clamp-2 ${hasValue ? 'text-blue-700' : 'text-gray-700'}`}>
          {highlightedLabel ?? label}
        </span>
        {isExpandable && (
          <div className={`absolute bottom-1.5 left-1/2 transform -translate-x-1/2 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className={`w-5 h-5 ${hasValue ? 'text-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </button>
      {!isExpandable && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          placeholder="Beschreibung eingeben..."
        />
      )}
    </div>
  );
}

interface SymptomCardProps {
  label: string;
  highlightedLabel?: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

function SymptomCard({ label, highlightedLabel, isSelected, onClick }: SymptomCardProps) {
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
      <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
        {highlightedLabel ?? label}
      </span>
    </button>
  );
}

export function ZwangssymptomatikModal({
  isOpen,
  onClose,
  formData,
  symptomHandlers,
  setNestedField
}: ZwangssymptomatikModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isWiederkehrendExpanded, setIsWiederkehrendExpanded] = useState(false);
  const [isZwangshandlungenManuallyExpanded, setIsZwangshandlungenManuallyExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const zwang = formData.zwangssymptomatik;
  const zwangsgedanken = zwang.zwangsgedanken;
  const zwangshandlungen = zwang.zwangshandlungen;

  // Check if zwangsgedanken has data (discriminated union check)
  const hasZwangsgedankenData = 'wiederkehrendeZwangsgedanken' in zwangsgedanken;
  const zwangsgedankenData = hasZwangsgedankenData ? zwangsgedanken as FormTypes.ZwangsgedankenSelected : null;

  // Check if zwangshandlungen has data (discriminated union check)
  const hasZwangshandlungenData = 'selected' in zwangshandlungen && zwangshandlungen.selected === true;
  const zwangshandlungenData = hasZwangshandlungenData ? zwangshandlungen as FormTypes.ZwangshandlungenSelected : null;

  // Check if any Zwangshandlung sub-item is actually selected or "andere" has content
  const hasZwangshandlungenContent = zwangshandlungenData && (
    Object.values(zwangshandlungenData.details).some(v => v?.selected) ||
    zwangshandlungenData.andere.trim() !== ''
  );

  // Check if any wiederkehrende field has content
  const hasWiederkehrendContent = zwangsgedankenData &&
    Object.values(zwangsgedankenData.wiederkehrendeZwangsgedanken).some(v => v && v.trim() !== '');

  // Check if any sub-item matches search
  const searchLower = searchQuery.trim().toLowerCase();
  const hasWiederkehrendSubItemMatchingSearch = searchLower !== '' &&
    Object.values(FormTypes.ZwangsgedankenWiederkehrendFeld).some(v =>
      ZWANGSGEDANKEN_WIEDERKEHREND_FELD_LABELS[v].toLowerCase().includes(searchLower)
    );

  // Check if any Zwangshandlungen sub-item matches the search query
  const hasZwangshandlungenSubItemMatchingSearch = searchLower !== '' &&
    Object.values(FormTypes.ZwangshandlungTyp).some(v =>
      ZWANGSHANDLUNG_TYP_LABELS[v].toLowerCase().includes(searchLower)
    );

  // Expanded if has content OR manually expanded OR sub-item matches search
  const isWiederkehrendSectionExpanded = hasWiederkehrendContent || isWiederkehrendExpanded || hasWiederkehrendSubItemMatchingSearch;

  // Zwangshandlungen expanded if selected OR manually expanded OR sub-item matches search
  const isZwangshandlungenExpanded = hasZwangshandlungenData || isZwangshandlungenManuallyExpanded || hasZwangshandlungenSubItemMatchingSearch;

  // Count selected symptoms
  const getSelectedSymptomCount = (): number => {
    let count = 0;
    if (zwangsgedankenData) {
      // Count non-empty wiederkehrende fields
      count += Object.values(zwangsgedankenData.wiederkehrendeZwangsgedanken).filter(v => v && v.trim() !== '').length;
      // Count non-empty direct fields
      if (zwangsgedankenData.zwanghafteIdeen.trim()) count++;
      if (zwangsgedankenData.bildhafteZwangsvorstellungen.trim()) count++;
      if (zwangsgedankenData.zwangsimpulse.trim()) count++;
    }
    if (zwangshandlungenData) {
      // Count selected Zwangshandlungen items
      count += Object.values(zwangshandlungenData.details).filter(v => v?.selected).length;
      // Count "andere" if filled
      if (zwangshandlungenData.andere.trim()) count++;
    }
    // Count zwangsbezogene Kognitionen
    count += Object.values(zwang.zwangsbezogeneKognitionen).filter(v => v === 'selected').length;
    if (zwang.andereSymptome.trim()) count++;
    return count;
  };

  // Get all selected symptoms as strings for footer display
  const getAllSelectedSymptoms = (): string[] => {
    const symptoms: string[] = [];
    if (zwangsgedankenData) {
      // Add wiederkehrende fields with values
      for (const [key, val] of Object.entries(zwangsgedankenData.wiederkehrendeZwangsgedanken)) {
        if (val && val.trim()) {
          const label = ZWANGSGEDANKEN_WIEDERKEHREND_FELD_LABELS[key as FormTypes.ZwangsgedankenWiederkehrendFeld];
          symptoms.push(`${label}: ${val.trim()}`);
        }
      }
      // Add direct fields
      if (zwangsgedankenData.zwanghafteIdeen.trim()) {
        symptoms.push(`Zwanghafte Ideen: ${zwangsgedankenData.zwanghafteIdeen.trim()}`);
      }
      if (zwangsgedankenData.bildhafteZwangsvorstellungen.trim()) {
        symptoms.push(`Bildhafte Zwangsvorstellungen: ${zwangsgedankenData.bildhafteZwangsvorstellungen.trim()}`);
      }
      if (zwangsgedankenData.zwangsimpulse.trim()) {
        symptoms.push(`Zwangsimpulse: ${zwangsgedankenData.zwangsimpulse.trim()}`);
      }
    }
    if (zwangshandlungenData) {
      // Add selected Zwangshandlungen items
      for (const [key, entry] of Object.entries(zwangshandlungenData.details)) {
        if (entry?.selected) {
          const label = ZWANGSHANDLUNG_TYP_LABELS[key as FormTypes.ZwangshandlungTyp];
          const text = entry.details?.text?.trim();
          symptoms.push(text ? `${label}: ${text}` : label);
        }
      }
      // Add "andere" if filled
      if (zwangshandlungenData.andere.trim()) {
        symptoms.push(`Andere Zwangshandlungen: ${zwangshandlungenData.andere.trim()}`);
      }
    }
    // Add zwangsbezogene Kognitionen
    for (const [key, val] of Object.entries(zwang.zwangsbezogeneKognitionen)) {
      if (val === 'selected') {
        symptoms.push(ZWANGSBEZOGENE_KOGNITION_SYMPTOM_LABELS[key as FormTypes.ZwangsbezogeneKognitionSymptom]);
      }
    }
    if (zwang.andereSymptome.trim()) {
      symptoms.push(`Andere: ${zwang.andereSymptome.trim()}`);
    }
    return symptoms.sort((a, b) => a.localeCompare(b));
  };

  // Filter symptoms by search query
  const filterBySearch = (label: string): boolean => {
    if (!searchQuery.trim()) return true;
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Highlight matching text
  const highlight = (text: string) => highlightSearchText(text, searchQuery);

  // Helper to check if a symptom is selected (simple checkbox pattern)
  const isSelected = <E extends string>(selection: Partial<Record<E, 'selected'>>, value: E): boolean => {
    return selection[value] === 'selected';
  };

  // Handler to toggle selection (simple checkbox pattern)
  const handleToggle = (fieldPath: string, value: string) => {
    symptomHandlers.toggleSelectionField(fieldPath, value);
  };

  // Helper to initialize zwangsgedanken data if not present
  const ensureZwangsgedankenData = (): FormTypes.ZwangsgedankenSelected => {
    if (hasZwangsgedankenData) {
      return zwangsgedankenData!;
    }
    return {
      wiederkehrendeZwangsgedanken: {},
      zwanghafteIdeen: '',
      bildhafteZwangsvorstellungen: '',
      zwangsimpulse: ''
    };
  };

  // Handler to update wiederkehrende text field
  const handleWiederkehrendChange = (feld: FormTypes.ZwangsgedankenWiederkehrendFeld, value: string) => {
    const data = ensureZwangsgedankenData();
    const newWiederkehrend = { ...data.wiederkehrendeZwangsgedanken };

    if (value.trim()) {
      newWiederkehrend[feld] = value;
    } else {
      delete newWiederkehrend[feld];
    }

    setNestedField('zwangssymptomatik.zwangsgedanken', {
      ...data,
      wiederkehrendeZwangsgedanken: newWiederkehrend
    } as unknown as Record<string, unknown>);
  };

  // Handler to update direct text fields
  const handleDirectFieldChange = (field: 'zwanghafteIdeen' | 'bildhafteZwangsvorstellungen' | 'zwangsimpulse', value: string) => {
    const data = ensureZwangsgedankenData();
    setNestedField('zwangssymptomatik.zwangsgedanken', {
      ...data,
      [field]: value
    } as unknown as Record<string, unknown>);
  };

  // Helper to initialize zwangshandlungen data if not present
  const ensureZwangshandlungenData = (): FormTypes.ZwangshandlungenSelected => {
    if (hasZwangshandlungenData) {
      return zwangshandlungenData!;
    }
    return {
      selected: true,
      details: {},
      andere: ''
    };
  };

  // Handler to toggle Zwangshandlungen section on/off
  const handleToggleZwangshandlungen = () => {
    if (isZwangshandlungenExpanded) {
      // Collapse: clear zwangshandlungen data and manual expansion
      setNestedField('zwangssymptomatik.zwangshandlungen', {});
      setIsZwangshandlungenManuallyExpanded(false);
    } else {
      // Expand: set manual expansion and initialize data
      const data = ensureZwangshandlungenData();
      setNestedField('zwangssymptomatik.zwangshandlungen', data as unknown as Record<string, unknown>);
      setIsZwangshandlungenManuallyExpanded(true);
    }
  };

  // Handler to toggle a Zwangshandlung item selection
  const handleZwangshandlungToggle = (typ: FormTypes.ZwangshandlungTyp) => {
    const data = ensureZwangshandlungenData();
    const newDetails = { ...data.details };

    if (newDetails[typ]) {
      // Currently selected -> deselect (remove)
      delete newDetails[typ];
    } else {
      // Not selected -> select with empty details
      newDetails[typ] = { selected: true, details: {} };
    }

    setNestedField('zwangssymptomatik.zwangshandlungen', {
      ...data,
      details: newDetails
    } as unknown as Record<string, unknown>);
  };

  // Handler to update a Zwangshandlung detail text field
  const handleZwangshandlungTextChange = (typ: FormTypes.ZwangshandlungTyp, text: string) => {
    const data = ensureZwangshandlungenData();
    const newDetails = { ...data.details };

    // Update or create the entry with the new text
    newDetails[typ] = {
      selected: true,
      details: { text: text || undefined }
    };

    setNestedField('zwangssymptomatik.zwangshandlungen', {
      ...data,
      details: newDetails
    } as unknown as Record<string, unknown>);
  };

  // Handler to update Zwangshandlungen "andere" text field
  const handleZwangshandlungenAndereChange = (text: string) => {
    const data = ensureZwangshandlungenData();
    setNestedField('zwangssymptomatik.zwangshandlungen', {
      ...data,
      andere: text
    } as unknown as Record<string, unknown>);
  };

  // Handler to close modal and reset state
  const handleClose = () => {
    setSearchQuery('');
    setIsWiederkehrendExpanded(false);
    setIsZwangshandlungenManuallyExpanded(false);
    onClose();
  };

  // Handler to clear all selections and close
  const handleClearAndClose = () => {
    // Use shared clear function for consistency with main page
    symptomHandlers.clearZwangssymptomatik();
    handleClose();
  };

  if (!isOpen || !mounted) return null;

  const allSelectedSymptoms = getAllSelectedSymptoms();

  const modalContent = (
    <div className="fixed top-36 bottom-4 left-4 right-[46%] z-40 flex items-start justify-center p-2">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-200 w-full max-w-5xl max-h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-900">Zwangssymptomatik</h2>
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
            {/* Zwangsgedanken Section */}
            {(filterBySearch('Zwangsgedanken') ||
              filterBySearch(ZWANGSGEDANKEN_WIEDERKEHREND_LABEL) ||
              filterBySearch(ZWANGSGEDANKEN_FIELD_LABELS.zwanghafteIdeen) ||
              filterBySearch(ZWANGSGEDANKEN_FIELD_LABELS.bildhafteZwangsvorstellungen) ||
              filterBySearch(ZWANGSGEDANKEN_FIELD_LABELS.zwangsimpulse) ||
              Object.values(FormTypes.ZwangsgedankenWiederkehrendFeld).some(v => filterBySearch(ZWANGSGEDANKEN_WIEDERKEHREND_FELD_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Zwangsgedanken')}</h3>

                  {/* Quälende und wiederkehrende Zwangsgedanken - Expandable */}
                  {(filterBySearch('Zwangsgedanken') ||
                    filterBySearch(ZWANGSGEDANKEN_WIEDERKEHREND_LABEL) ||
                    Object.values(FormTypes.ZwangsgedankenWiederkehrendFeld).some(v => filterBySearch(ZWANGSGEDANKEN_WIEDERKEHREND_FELD_LABELS[v]))) && (
                      <>
                        <div className="mb-4">
                          <TextFieldCard
                            label={ZWANGSGEDANKEN_WIEDERKEHREND_LABEL}
                            highlightedLabel={highlight(ZWANGSGEDANKEN_WIEDERKEHREND_LABEL)}
                            value={hasWiederkehrendContent ? 'has-content' : ''}
                            onChange={() => {}}
                            isExpandable={true}
                            isExpanded={isWiederkehrendSectionExpanded}
                            onToggleExpand={() => setIsWiederkehrendExpanded(!isWiederkehrendSectionExpanded)}
                          />
                        </div>

                        {/* Expanded: Nested text fields */}
                        {isWiederkehrendSectionExpanded && (
                          <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg shadow-sm">
                            <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                              {highlight(ZWANGSGEDANKEN_WIEDERKEHREND_LABEL)} - Details:
                            </h4>
                            <div className="space-y-3">
                              {Object.values(FormTypes.ZwangsgedankenWiederkehrendFeld)
                                .filter(v => {
                                  if (!searchLower || filterBySearch(ZWANGSGEDANKEN_WIEDERKEHREND_LABEL)) return true;
                                  return ZWANGSGEDANKEN_WIEDERKEHREND_FELD_LABELS[v].toLowerCase().includes(searchLower);
                                })
                                .map((feld) => (
                                  <div key={feld} className="flex items-center gap-3">
                                    <label className="w-64 text-sm font-medium text-gray-700 flex-shrink-0">
                                      {highlight(ZWANGSGEDANKEN_WIEDERKEHREND_FELD_LABELS[feld])}
                                    </label>
                                    <input
                                      type="text"
                                      value={zwangsgedankenData?.wiederkehrendeZwangsgedanken[feld] || ''}
                                      onChange={(e) => handleWiederkehrendChange(feld, e.target.value)}
                                      className="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                      placeholder="Beschreibung eingeben..."
                                    />
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                  {/* Direct text fields */}
                  <div className="space-y-4">
                    {/* Zwanghafte Ideen */}
                    {(filterBySearch('Zwangsgedanken') || filterBySearch(ZWANGSGEDANKEN_FIELD_LABELS.zwanghafteIdeen)) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {highlight(ZWANGSGEDANKEN_FIELD_LABELS.zwanghafteIdeen)}
                        </label>
                        <input
                          type="text"
                          value={zwangsgedankenData?.zwanghafteIdeen || ''}
                          onChange={(e) => handleDirectFieldChange('zwanghafteIdeen', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          placeholder="Beschreibung eingeben..."
                        />
                      </div>
                    )}

                    {/* Bildhafte Zwangsvorstellungen */}
                    {(filterBySearch('Zwangsgedanken') || filterBySearch(ZWANGSGEDANKEN_FIELD_LABELS.bildhafteZwangsvorstellungen)) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {highlight(ZWANGSGEDANKEN_FIELD_LABELS.bildhafteZwangsvorstellungen)}
                        </label>
                        <input
                          type="text"
                          value={zwangsgedankenData?.bildhafteZwangsvorstellungen || ''}
                          onChange={(e) => handleDirectFieldChange('bildhafteZwangsvorstellungen', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          placeholder="Beschreibung eingeben..."
                        />
                      </div>
                    )}

                    {/* Zwangsimpulse */}
                    {(filterBySearch('Zwangsgedanken') || filterBySearch(ZWANGSGEDANKEN_FIELD_LABELS.zwangsimpulse)) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {highlight(ZWANGSGEDANKEN_FIELD_LABELS.zwangsimpulse)}
                        </label>
                        <input
                          type="text"
                          value={zwangsgedankenData?.zwangsimpulse || ''}
                          onChange={(e) => handleDirectFieldChange('zwangsimpulse', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          placeholder="Beschreibung eingeben..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Zwangshandlungen und Zwangsrituale Section */}
            {(filterBySearch('Zwangshandlungen') ||
              filterBySearch('Zwangsrituale') ||
              filterBySearch(ZWANGSHANDLUNGEN_LABEL) ||
              Object.values(FormTypes.ZwangshandlungTyp).some(v => filterBySearch(ZWANGSHANDLUNG_TYP_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{highlight('Zwangshandlungen und Zwangsrituale')}</h3>

                  {/* Expandable header card */}
                  <div className="mb-4">
                    <TextFieldCard
                      label={ZWANGSHANDLUNGEN_LABEL}
                      highlightedLabel={highlight(ZWANGSHANDLUNGEN_LABEL)}
                      value={hasZwangshandlungenContent ? 'has-content' : ''}
                      onChange={() => {}}
                      isExpandable={true}
                      isExpanded={isZwangshandlungenExpanded}
                      onToggleExpand={handleToggleZwangshandlungen}
                    />
                  </div>

                  {/* Expanded: Clickable items with optional text fields */}
                  {isZwangshandlungenExpanded && (
                    <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg shadow-sm">
                      <div className="mb-3 flex items-center gap-4">
                        <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          {highlight(ZWANGSHANDLUNGEN_LABEL)} - Klicken zum Auswählen, Text optional:
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {/* Filter sub-items: show all if no search or parent matches, otherwise only matching */}
                        {Object.values(FormTypes.ZwangshandlungTyp)
                          .filter(v => {
                            // No search or parent label matches -> show all
                            if (!searchLower || filterBySearch(ZWANGSHANDLUNGEN_LABEL) || filterBySearch('Zwangshandlungen')) return true;
                            // Otherwise filter to matching sub-items only
                            return ZWANGSHANDLUNG_TYP_LABELS[v].toLowerCase().includes(searchLower);
                          })
                          .map((typ) => {
                            const isItemSelected = !!zwangshandlungenData?.details[typ]?.selected;
                            return (
                              <div key={typ} className="flex items-center gap-3">
                                {/* Clickable selection button */}
                                <button
                                  type="button"
                                  onClick={() => handleZwangshandlungToggle(typ)}
                                  className={`
                                  flex-shrink-0 w-56 px-3 py-2 rounded-lg border-2 text-left text-sm font-medium transition-all duration-200
                                  ${isItemSelected
                                      ? 'border-blue-500 bg-blue-100 text-blue-800'
                                      : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/30'
                                    }
                                  focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer
                                `}
                                >
                                  <span className="flex items-center gap-2">
                                    {isItemSelected && (
                                      <svg className="w-4 h-4 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M5 13l4 4L19 7"></path>
                                      </svg>
                                    )}
                                    {highlight(ZWANGSHANDLUNG_TYP_LABELS[typ])}
                                  </span>
                                </button>
                                {/* Optional text input - only shown when selected */}
                                {isItemSelected && (
                                  <input
                                    type="text"
                                    value={zwangshandlungenData?.details[typ]?.details?.text || ''}
                                    onChange={(e) => handleZwangshandlungTextChange(typ, e.target.value)}
                                    className="flex-1 px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    placeholder="Details eingeben (optional)..."
                                  />
                                )}
                              </div>
                            );
                          })}

                        {/* Andere text field */}
                        <div className="mt-4 pt-3 border-t border-blue-200">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Andere Zwangshandlungen
                          </label>
                          <input
                            type="text"
                            value={zwangshandlungenData?.andere || ''}
                            onChange={(e) => handleZwangshandlungenAndereChange(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            placeholder="Andere Zwangshandlungen beschreiben..."
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* Zwangsbezogene Kognitionen und Emotionen Section */}
            {(filterBySearch('Zwangsbezogene Kognitionen') ||
              filterBySearch('Kognitionen') ||
              filterBySearch('Emotionen') ||
              Object.values(FormTypes.ZwangsbezogeneKognitionSymptom).some(v =>
                filterBySearch(ZWANGSBEZOGENE_KOGNITION_SYMPTOM_LABELS[v]))) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {highlight('Zwangsbezogene Kognitionen und Emotionen')}
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(FormTypes.ZwangsbezogeneKognitionSymptom)
                      .filter(v => filterBySearch(ZWANGSBEZOGENE_KOGNITION_SYMPTOM_LABELS[v]) ||
                                   filterBySearch('Zwangsbezogene Kognitionen'))
                      .map((symptom) => (
                        <SymptomCard
                          key={symptom}
                          label={ZWANGSBEZOGENE_KOGNITION_SYMPTOM_LABELS[symptom]}
                          highlightedLabel={highlight(ZWANGSBEZOGENE_KOGNITION_SYMPTOM_LABELS[symptom])}
                          isSelected={isSelected(zwang.zwangsbezogeneKognitionen, symptom)}
                          onClick={() => handleToggle('zwangssymptomatik.zwangsbezogeneKognitionen', symptom)}
                        />
                      ))}
                  </div>
                </div>
              )}

            {/* Andere Symptome - Text Field */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                Andere
              </label>
              <textarea
                value={zwang.andereSymptome}
                onChange={(e) =>
                  symptomHandlers.setNestedTextField('zwangssymptomatik.andereSymptome', e.target.value)
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
              <span className="font-semibold text-gray-700">Eingetragene Symptome ({getSelectedSymptomCount()}): </span>
              {allSelectedSymptoms.join(', ')}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
