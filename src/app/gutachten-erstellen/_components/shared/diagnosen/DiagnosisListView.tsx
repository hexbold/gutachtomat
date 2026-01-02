'use client';

import React, { useState } from 'react';
import { diagnosisSections, getDiagnosesBySection } from '@/lib/data/icd10-diagnoses';
import type { DiagnosisItem } from '@/lib/data/icd10-diagnoses';

interface DiagnosisListViewProps {
  onSelectDiagnosis: (diagnosis: DiagnosisItem) => void;
  selectedCodes: string[];
  onClose: () => void;
}

export function DiagnosisListView({
  onSelectDiagnosis,
  selectedCodes,
  onClose,
}: DiagnosisListViewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const isDiagnosisSelected = (code: string) => selectedCodes.includes(code);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Alle ICD-10 Diagnosen (F10-F69)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
            aria-label="Schließen"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {diagnosisSections.map((section) => {
              const sectionDiagnoses = getDiagnosesBySection(section);
              const isExpanded = expandedSections.has(section);

              return (
                <div key={section} className="border border-gray-200 rounded-md">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section)}
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between font-semibold text-left transition-colors"
                  >
                    <span className="text-gray-800">{section}</span>
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${
                        isExpanded ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  {/* Section Content */}
                  {isExpanded && (
                    <div className="divide-y divide-gray-100">
                      {sectionDiagnoses.map((diagnosis) => {
                        const isSelected = isDiagnosisSelected(diagnosis.code);
                        const indentClass =
                          diagnosis.level === 2
                            ? 'pl-4'
                            : diagnosis.level === 3
                            ? 'pl-8'
                            : '';
                        const isNonSelectableParent = !diagnosis.isSelectable && diagnosis.level === 2 && diagnosis.hasChildren;

                        // Non-selectable parents with level 3 children shown as headers
                        if (isNonSelectableParent) {
                          return (
                            <div
                              key={diagnosis.code}
                              className={`
                                w-full text-left px-4 py-2 bg-gray-50 border-b border-gray-200
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
                            onClick={() => onSelectDiagnosis(diagnosis)}
                            disabled={!diagnosis.isSelectable || isSelected}
                            className={`
                              w-full text-left px-4 py-2.5 hover:bg-blue-50
                              ${indentClass}
                              ${
                                !diagnosis.isSelectable
                                  ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                                  : ''
                              }
                              ${isSelected ? 'bg-green-50 cursor-not-allowed' : ''}
                              transition-colors
                            `}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-baseline gap-2 flex-wrap">
                                  <span className="font-mono font-semibold text-sm text-blue-600">
                                    {diagnosis.code}
                                  </span>
                                  <span className="text-sm text-gray-800">
                                    {diagnosis.name}
                                  </span>
                                </div>
                                {diagnosis.hasChildren && diagnosis.isSelectable && (
                                  <span className="text-xs text-gray-500 mt-1 inline-block">
                                    Weitere Unterkategorien verfügbar
                                  </span>
                                )}
                              </div>
                              {isSelected && (
                                <span className="text-xs text-green-600 font-medium whitespace-nowrap">
                                  Ausgewählt
                                </span>
                              )}
                              {!diagnosis.isSelectable && !isSelected && diagnosis.level !== 2 && (
                                <span className="text-xs text-gray-400 italic whitespace-nowrap">
                                  Nicht wählbar
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {selectedCodes.length} Diagnose{selectedCodes.length !== 1 ? 'n' : ''} ausgewählt
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              Fertig
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
