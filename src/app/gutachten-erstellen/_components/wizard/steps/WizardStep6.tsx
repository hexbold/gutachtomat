'use client';

import React, { useState, useMemo } from 'react';
import { searchDiagnoses } from '@/lib/data/icd10-diagnoses';
import type { DiagnosisItem } from '@/lib/data/icd10-diagnoses';
import type * as FormTypes from '@/lib/core/form-types';
import { SelectedDiagnosisCard } from '../../shared/diagnosen/SelectedDiagnosisCard';
import { DiagnosisListView } from '../../shared/diagnosen/DiagnosisListView';

interface WizardStep6Props {
  formData: FormTypes.Kap5DiagnosenData;
  onAddDiagnosis: (code: string, name: string) => void;
  onRemoveDiagnosis: (code: string) => void;
  onSetSicherheit: (code: string, sicherheit: 'G' | 'V') => void;
}

export function WizardStep6({
  formData,
  onAddDiagnosis,
  onRemoveDiagnosis,
  onSetSicherheit,
}: WizardStep6Props) {
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-text-primary mb-2">
          ICD-10 Diagnosen auswählen
        </h3>
        <p className="text-sm text-text-tertiary">
          Suchen Sie nach ICD-10 Code oder Diagnosename und wählen Sie mindestens eine Diagnose aus
        </p>
      </div>

      {/* Search Section */}
      <div className="border-2 border-border-primary rounded-lg p-5 bg-surface-secondary/30">
        <label className="block text-base font-semibold text-text-primary mb-3">
          Diagnose suchen
        </label>
        <div className="flex gap-3">
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
              className="w-full px-4 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
            />

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-surface-primary border-2 border-border-primary rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {searchResults.map((diagnosis) => {
                  const isSelected = isDiagnosisSelected(diagnosis.code);
                  const indentClass = diagnosis.level === 2 ? 'pl-6' : diagnosis.level === 3 ? 'pl-12' : 'pl-4';
                  const isNonSelectableParent = !diagnosis.isSelectable && diagnosis.level === 2 && diagnosis.hasChildren;

                  // Non-selectable parents with level 3 children shown as headers
                  if (isNonSelectableParent) {
                    return (
                      <div
                        key={diagnosis.code}
                        className={`
                          w-full text-left px-4 py-2 bg-surface-secondary border-b border-border-primary
                          ${indentClass}
                        `}
                      >
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <span className="font-mono font-bold">
                            {diagnosis.code}
                          </span>
                          <span className="font-medium">{diagnosis.name}</span>
                          <span className="text-text-quaternary italic text-xs">
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
                        w-full text-left px-4 py-2.5 transition-colors
                        ${indentClass}
                        ${!diagnosis.isSelectable ? 'text-text-quaternary cursor-not-allowed' : 'hover:bg-accent-blue-light'}
                        ${isSelected ? 'bg-accent-green-light text-green-700 cursor-not-allowed' : ''}
                        border-b border-border-primary last:border-b-0
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-sm">
                              {diagnosis.code}
                            </span>
                            <span className="text-sm">{diagnosis.name}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-xs text-green-700 font-semibold whitespace-nowrap ml-2 flex items-center gap-1">
                            <span>✓</span>
                            <span>Ausgewählt</span>
                          </span>
                        )}
                      </div>
                      {diagnosis.section && diagnosis.level === 2 && diagnosis.isSelectable && (
                        <div className="text-xs text-text-tertiary mt-1">
                          {diagnosis.section}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {showSearchResults && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
              <div className="absolute z-10 w-full mt-2 bg-surface-primary border-2 border-border-primary rounded-lg shadow-lg p-4 text-center text-text-tertiary">
                Keine Diagnosen gefunden
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowListView(!showListView)}
            className="px-5 py-2.5 bg-surface-primary hover:bg-hover-surface border-2 border-border-primary text-text-secondary rounded-lg font-semibold transition-colors whitespace-nowrap hover:border-blue-300"
          >
            {showListView ? 'Liste ausblenden' : 'Alle anzeigen'}
          </button>
        </div>

        <p className="text-xs text-text-tertiary mt-2">
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
      {formData.selectedDiagnoses.length > 0 ? (
        <div className="border-2 border-border-primary rounded-lg p-5 bg-surface-secondary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-text-primary">
              Ausgewählte Diagnosen
            </h3>
            <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              {formData.selectedDiagnoses.length} {formData.selectedDiagnoses.length === 1 ? 'Diagnose' : 'Diagnosen'}
            </span>
          </div>
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
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-border-primary rounded-lg bg-surface-secondary/20">
          <div className="mb-3">
            <svg className="w-16 h-16 mx-auto text-text-quaternary" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <p className="text-base font-medium text-text-secondary mb-1">Noch keine Diagnosen ausgewählt</p>
          <p className="text-sm text-text-tertiary">Verwenden Sie die Suche oder klicken Sie auf &quot;Alle anzeigen&quot;</p>
        </div>
      )}
    </div>
  );
}
