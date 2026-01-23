'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  const modalContent = (
    <div className="fixed top-36 bottom-4 left-4 right-[46%] z-40 flex items-start justify-center p-2">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-200 w-full max-w-5xl max-h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-900">
            Alle ICD-10 Diagnosen (F10-F69)
          </h2>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg cursor-pointer"
          >
            Fertig
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {diagnosisSections.map((section) => {
              const sectionDiagnoses = getDiagnosesBySection(section);
              const isExpanded = expandedSections.has(section);

              return (
                <div key={section} className="border-2 border-blue-200 rounded-lg">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section)}
                    className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 flex items-center justify-between font-semibold text-left transition-colors"
                  >
                    <span className="text-blue-900">{section}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-normal">
                        {sectionDiagnoses.length} Diagnose{sectionDiagnoses.length !== 1 ? 'n' : ''}
                      </span>
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
                    </div>
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
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
