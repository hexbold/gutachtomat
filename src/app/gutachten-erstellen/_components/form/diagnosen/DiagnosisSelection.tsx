'use client';

import React, { useState, useMemo } from 'react';
import { searchDiagnoses } from '@/lib/data/icd10-diagnoses';
import type { DiagnosisItem } from '@/lib/data/icd10-diagnoses';
import * as FormTypes from '@/lib/core/form-types';
import { SelectedDiagnosisCard } from '../../shared/diagnosen/SelectedDiagnosisCard';
import { DiagnosisListView } from '../../shared/diagnosen/DiagnosisListView';

interface DiagnosisSelectionProps {
  formData: FormTypes.Kap5DiagnosenData;
  onAddDiagnosis: (code: string, name: string) => void;
  onRemoveDiagnosis: (code: string) => void;
  onSetSicherheit: (code: string, sicherheit: 'G' | 'V') => void;
}

export function DiagnosisSelection({
  formData,
  onAddDiagnosis,
  onRemoveDiagnosis,
  onSetSicherheit,
}: DiagnosisSelectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showListView, setShowListView] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Search results filtered by query
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      return [];
    }
    return searchDiagnoses(searchQuery);
  }, [searchQuery]);

  // Check if diagnosis is already selected
  const isDiagnosisSelected = (code: string) => {
    return formData.selectedDiagnoses.some((d) => d.code === code);
  };

  // Handle diagnosis selection from search or list
  const handleSelectDiagnosis = (diagnosis: DiagnosisItem) => {
    if (!isDiagnosisSelected(diagnosis.code)) {
      onAddDiagnosis(diagnosis.code, diagnosis.name);
      setSearchQuery(''); // Clear search after selection
      setShowSearchResults(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="relative">
        <label className="block text-sm font-medium mb-2">
          Diagnose suchen
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.trim().length >= 2);
              }}
              onFocus={() => {
                if (searchQuery.trim().length >= 2) {
                  setShowSearchResults(true);
                }
              }}
              placeholder="ICD-10 Code oder Diagnose eingeben (mind. 2 Zeichen)..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-y-auto">
                {searchResults.map((diagnosis) => {
                  const isSelected = isDiagnosisSelected(diagnosis.code);
                  const indentClass = diagnosis.level === 2 ? 'pl-4' : diagnosis.level === 3 ? 'pl-8' : '';
                  const isNonSelectableParent = !diagnosis.isSelectable && diagnosis.level === 2 && diagnosis.hasChildren;

                  // Non-selectable parents with level 3 children shown as headers
                  if (isNonSelectableParent) {
                    return (
                      <div
                        key={diagnosis.code}
                        className={`
                          w-full text-left px-4 py-1.5 bg-gray-50 border-b border-gray-200
                          ${indentClass}
                        `}
                      >
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="font-mono font-semibold">
                            {diagnosis.code}
                          </span>
                          <span className="font-medium">{diagnosis.name}</span>
                          <span className="text-gray-400 italic text-xs">
                            (Unterkategorie wählen)
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={diagnosis.code}
                      onClick={() => handleSelectDiagnosis(diagnosis)}
                      disabled={!diagnosis.isSelectable || isSelected}
                      className={`
                        w-full text-left px-4 py-2 hover:bg-gray-100
                        ${indentClass}
                        ${!diagnosis.isSelectable ? 'text-gray-400 cursor-not-allowed' : ''}
                        ${isSelected ? 'bg-green-50 text-green-700 cursor-not-allowed' : ''}
                        border-b border-gray-100 last:border-b-0
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold">
                              {diagnosis.code}
                            </span>
                            <span>{diagnosis.name}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-xs text-green-600 font-medium whitespace-nowrap ml-2">
                            Ausgewählt
                          </span>
                        )}
                      </div>
                      {diagnosis.section && diagnosis.level === 2 && diagnosis.isSelectable && (
                        <div className="text-xs text-gray-500 mt-1">
                          {diagnosis.section}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {showSearchResults && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500">
                Keine Diagnosen gefunden
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowListView(true)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors whitespace-nowrap"
          >
            Alle anzeigen
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-1">
          Suche nach ICD-10 Code (z.B. &quot;F32.1&quot;) oder Diagnosename (z.B. &quot;Depression&quot;)
        </p>
      </div>

      {/* List View Modal/Panel */}
      {showListView && (
        <DiagnosisListView
          onSelectDiagnosis={handleSelectDiagnosis}
          selectedCodes={formData.selectedDiagnoses.map((d) => d.code)}
          onClose={() => setShowListView(false)}
        />
      )}

      {/* Selected Diagnoses */}
      {formData.selectedDiagnoses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">
            Ausgewählte Diagnosen ({formData.selectedDiagnoses.length})
          </h3>
          <div className="space-y-3">
            {formData.selectedDiagnoses.map((diagnosis) => (
              <SelectedDiagnosisCard
                key={diagnosis.code}
                diagnosis={diagnosis}
                onRemove={() => onRemoveDiagnosis(diagnosis.code)}
                onSetSicherheit={(sicherheit) => onSetSicherheit(diagnosis.code, sicherheit)}
              />
            ))}
          </div>
        </div>
      )}

      {formData.selectedDiagnoses.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
          <p className="text-sm">Noch keine Diagnosen ausgewählt</p>
          <p className="text-xs mt-1">Verwenden Sie die Suche oder &quot;Alle anzeigen&quot;</p>
        </div>
      )}
    </div>
  );
}
