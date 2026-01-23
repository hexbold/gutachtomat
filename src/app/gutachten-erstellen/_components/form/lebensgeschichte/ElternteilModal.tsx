'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as FormTypes from '@/lib/core/form-types';
import {
  BEZIEHUNGS_EIGENSCHAFT_LABELS,
  KRITISCHE_VERHALTENSWEISE_LABELS,
  VERLETZTES_GRUNDBEDUERFNIS_LABELS,
} from '@/lib/core/form-labels';

interface ElternteilModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: 'Vater' | 'Mutter';
  data: FormTypes.ElternteilData;
  onChange: (data: FormTypes.ElternteilData) => void;
}

export function ElternteilModal({ isOpen, onClose, title, data, onChange }: ElternteilModalProps) {
  const [mounted, setMounted] = useState(false);
  const [expandedEigenschaften, setExpandedEigenschaften] = useState<Set<FormTypes.BeziehungsEigenschaft>>(new Set());
  const [expandedVerhaltensweisen, setExpandedVerhaltensweisen] = useState<Set<FormTypes.KritischeVerhaltensweise>>(new Set());
  const [expandedGrundbeduerfnisse, setExpandedGrundbeduerfnisse] = useState<Set<FormTypes.VerletztesGrundbeduerfnis>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateData = (updates: Partial<FormTypes.ElternteilData>) => {
    onChange({ ...data, ...updates });
  };

  const handleCardToggle = <E extends string>(
    fieldName: keyof FormTypes.ElternteilData,
    item: E,
    currentSelection: FormTypes.CardSelection<E> | undefined,
    expandedSet: Set<E>,
    setExpanded: React.Dispatch<React.SetStateAction<Set<E>>>
  ) => {
    const newSelection = { ...currentSelection };
    if (newSelection[item as keyof typeof newSelection]) {
      delete newSelection[item as keyof typeof newSelection];
      if (expandedSet.has(item)) {
        const newExpanded = new Set(expandedSet);
        newExpanded.delete(item);
        setExpanded(newExpanded);
      }
    } else {
      (newSelection as Record<string, FormTypes.CardSelectionEntry>)[item] = { selected: true, details: {} };
    }
    updateData({ [fieldName]: newSelection });
  };

  const handleDetailsChange = <E extends string>(
    fieldName: keyof FormTypes.ElternteilData,
    item: E,
    field: 'brackets' | 'text',
    value: string,
    currentSelection: FormTypes.CardSelection<E> | undefined
  ) => {
    const currentEntry = currentSelection?.[item as keyof typeof currentSelection];
    const newSelection = {
      ...currentSelection,
      [item]: {
        selected: true,
        details: { ...currentEntry?.details, [field]: value || undefined },
      },
    };
    updateData({ [fieldName]: newSelection });
  };

  const resetAllExpanded = () => {
    setExpandedEigenschaften(new Set());
    setExpandedVerhaltensweisen(new Set());
    setExpandedGrundbeduerfnisse(new Set());
  };

  const handleClose = () => {
    resetAllExpanded();
    onClose();
  };

  const handleClearAll = () => {
    onChange({
      geburtsjahr: '',
      beruf: '',
      beziehungsEigenschaften: {},
      beziehungsEigenschaftenAndere: '',
      kritischeVerhaltensweisen: {},
      kritischeVerhaltensweiseAndere: '',
      verletzteGrundbeduerfnisse: {},
      verletzteGrundbeduerfnisseAndere: '',
    });
    resetAllExpanded();
  };

  const totalSelected =
    Object.keys(data.beziehungsEigenschaften || {}).length +
    Object.keys(data.kritischeVerhaltensweisen || {}).length +
    Object.keys(data.verletzteGrundbeduerfnisse || {}).length;

  const getSelectedLabels = (): string[] => {
    const labels: string[] = [];
    for (const key of Object.keys(data.beziehungsEigenschaften || {}) as FormTypes.BeziehungsEigenschaft[]) {
      labels.push(BEZIEHUNGS_EIGENSCHAFT_LABELS[key]);
    }
    for (const key of Object.keys(data.kritischeVerhaltensweisen || {}) as FormTypes.KritischeVerhaltensweise[]) {
      labels.push(KRITISCHE_VERHALTENSWEISE_LABELS[key]);
    }
    for (const key of Object.keys(data.verletzteGrundbeduerfnisse || {}) as FormTypes.VerletztesGrundbeduerfnis[]) {
      labels.push(VERLETZTES_GRUNDBEDUERFNIS_LABELS[key]);
    }
    return labels;
  };

  const renderCardGrid = <E extends string>(
    enumValues: E[],
    labels: Record<E, string>,
    fieldName: keyof FormTypes.ElternteilData,
    currentSelection: FormTypes.CardSelection<E> | undefined,
    expandedSet: Set<E>,
    setExpanded: React.Dispatch<React.SetStateAction<Set<E>>>
  ) => (
    <div className="grid grid-cols-2 gap-2.5">
      {enumValues.map((item) => {
        const isItemSelected = !!currentSelection?.[item as keyof typeof currentSelection]?.selected;
        const isExpanded = expandedSet.has(item);
        const details = currentSelection?.[item as keyof typeof currentSelection]?.details;
        const hasDetails = !!(details?.brackets?.trim() || details?.text?.trim());
        return (
          <div key={item} className="flex flex-col gap-1.5">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleCardToggle(fieldName, item, currentSelection, expandedSet, setExpanded)}
                title={labels[item]}
                className={`flex-1 relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center ${
                  isItemSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-sm'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300 hover:bg-blue-50/30'
                } focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}
              >
                {isItemSelected && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
                <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isItemSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  {labels[item]}
                </span>
              </button>
              {isItemSelected && (
                <button
                  type="button"
                  onClick={() => {
                    const newExpanded = new Set(expandedSet);
                    if (isExpanded) {
                      newExpanded.delete(item);
                    } else {
                      newExpanded.add(item);
                    }
                    setExpanded(newExpanded);
                  }}
                  className={`px-2.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                    isExpanded || hasDetails
                      ? 'bg-blue-500 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-300 dark:border-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
                  }`}
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
                  onChange={(e) => handleDetailsChange(fieldName, item, 'brackets', e.target.value, currentSelection)}
                  className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-sm"
                  placeholder="Spezifikation in Klammern (...)"
                  autoFocus
                />
                <input
                  type="text"
                  value={details?.text || ''}
                  onChange={(e) => handleDetailsChange(fieldName, item, 'text', e.target.value, currentSelection)}
                  onBlur={(e) => {
                    const val = e.target.value.trim();
                    if (val && !/[.!?]$/.test(val)) {
                      handleDetailsChange(fieldName, item, 'text', `${val}.`, currentSelection);
                    }
                  }}
                  className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-sm"
                  placeholder="Vollständigen Satz hinzufügen."
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed top-36 bottom-4 left-4 right-[46%] z-40 flex items-start justify-center p-2">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border-2 border-blue-200 dark:border-blue-800 w-full max-w-5xl max-h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-b-2 border-blue-200 dark:border-blue-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">{title}</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearAll}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Basic info row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Geburtsjahr</label>
              <input
                type="text"
                value={data.geburtsjahr}
                onChange={(e) => updateData({ geburtsjahr: e.target.value })}
                placeholder="z.B. 1955"
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white dark:bg-gray-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Beruf</label>
              <input
                type="text"
                value={data.beruf}
                onChange={(e) => updateData({ beruf: e.target.value })}
                placeholder="z.B. Lehrer"
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white dark:bg-gray-800 text-sm"
              />
            </div>
          </div>

          {/* Beziehungseigenschaften */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Beziehungseigenschaften</h3>
            {renderCardGrid(
              Object.values(FormTypes.BeziehungsEigenschaft),
              BEZIEHUNGS_EIGENSCHAFT_LABELS,
              'beziehungsEigenschaften',
              data.beziehungsEigenschaften,
              expandedEigenschaften,
              setExpandedEigenschaften
            )}
            <div className="mt-3">
              <input
                type="text"
                value={data.beziehungsEigenschaftenAndere}
                onChange={(e) => updateData({ beziehungsEigenschaftenAndere: e.target.value })}
                placeholder="Andere Eigenschaften..."
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white dark:bg-gray-800 text-sm"
              />
            </div>
          </div>

          {/* Kritische Verhaltensweisen */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Kritische Verhaltensweisen</h3>
            {renderCardGrid(
              Object.values(FormTypes.KritischeVerhaltensweise),
              KRITISCHE_VERHALTENSWEISE_LABELS,
              'kritischeVerhaltensweisen',
              data.kritischeVerhaltensweisen,
              expandedVerhaltensweisen,
              setExpandedVerhaltensweisen
            )}
            <div className="mt-3">
              <input
                type="text"
                value={data.kritischeVerhaltensweiseAndere}
                onChange={(e) => updateData({ kritischeVerhaltensweiseAndere: e.target.value })}
                placeholder="Andere kritische Verhaltensweisen..."
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white dark:bg-gray-800 text-sm"
              />
            </div>
          </div>

          {/* Verletzte Grundbedürfnisse */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Verletzte Grundbedürfnisse</h3>
            {renderCardGrid(
              Object.values(FormTypes.VerletztesGrundbeduerfnis),
              VERLETZTES_GRUNDBEDUERFNIS_LABELS,
              'verletzteGrundbeduerfnisse',
              data.verletzteGrundbeduerfnisse,
              expandedGrundbeduerfnisse,
              setExpandedGrundbeduerfnisse
            )}
            <div className="mt-3">
              <input
                type="text"
                value={data.verletzteGrundbeduerfnisseAndere}
                onChange={(e) => updateData({ verletzteGrundbeduerfnisseAndere: e.target.value })}
                placeholder="Andere verletzte Grundbedürfnisse..."
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white dark:bg-gray-800 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        {totalSelected > 0 && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              <strong>Ausgewählt ({totalSelected}):</strong> {getSelectedLabels().join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
