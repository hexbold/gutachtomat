'use client';

import { useState } from 'react';
import * as FormTypes from '@/lib/core/form-types';
import {
  BEZIEHUNGS_EIGENSCHAFT_LABELS,
  KRITISCHE_VERHALTENSWEISE_LABELS,
  VERLETZTES_GRUNDBEDUERFNIS_LABELS,
} from '@/lib/core/form-labels';

interface ElternteilSectionProps {
  title: 'Vater' | 'Mutter';
  data: FormTypes.Elternteil;
  onChange: (data: FormTypes.Elternteil) => void;
}

export function ElternteilSection({ title, data, onChange }: ElternteilSectionProps) {
  const [expandedEigenschaften, setExpandedEigenschaften] = useState<Set<FormTypes.BeziehungsEigenschaft>>(new Set());
  const [expandedVerhaltensweisen, setExpandedVerhaltensweisen] = useState<Set<FormTypes.KritischeVerhaltensweise>>(new Set());
  const [expandedGrundbeduerfnisse, setExpandedGrundbeduerfnisse] = useState<Set<FormTypes.VerletztesGrundbeduerfnis>>(new Set());

  const isVorhanden = data.vorhanden;
  const elternteilData = isVorhanden ? data.data : null;

  const handleToggleVorhanden = () => {
    if (isVorhanden) {
      onChange({ vorhanden: false });
    } else {
      onChange({
        vorhanden: true,
        data: {
          geburtsjahr: '',
          beruf: '',
          beziehungsEigenschaften: {},
          beziehungsEigenschaftenAndere: '',
          kritischeVerhaltensweisen: {},
          kritischeVerhaltensweiseAndere: '',
          verletzteGrundbeduerfnisse: {},
          verletzteGrundbeduerfnisseAndere: '',
        },
      });
    }
  };

  const updateData = (updates: Partial<FormTypes.ElternteilData>) => {
    if (!isVorhanden || !elternteilData) return;
    onChange({
      vorhanden: true,
      data: { ...elternteilData, ...updates },
    });
  };

  // Generic CardSelection toggle handler
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

  // Generic details change handler
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

  // Generic card rendering
  const renderCardGrid = <E extends string>(
    enumValues: E[],
    labels: Record<E, string>,
    fieldName: keyof FormTypes.ElternteilData,
    currentSelection: FormTypes.CardSelection<E> | undefined,
    expandedSet: Set<E>,
    setExpanded: React.Dispatch<React.SetStateAction<Set<E>>>
  ) => (
    <div className="grid grid-cols-2 gap-2">
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
                className={`flex-1 relative p-2.5 rounded-lg border-2 transition-all duration-200 text-left min-h-[48px] flex items-center ${
                  isItemSelected
                    ? 'border-blue-500 bg-accent-blue-light shadow-sm'
                    : 'border-border-primary bg-surface-primary hover:border-blue-300 hover:bg-accent-blue-light/30'
                } focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}
              >
                {isItemSelected && (
                  <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
                <span className={`text-xs font-semibold leading-snug pr-5 line-clamp-2 ${isItemSelected ? 'text-blue-700' : 'text-text-secondary'}`}>
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
                  className={`px-2 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                    isExpanded || hasDetails
                      ? 'bg-blue-500 text-white border-blue-600 shadow-sm'
                      : 'bg-surface-primary text-text-tertiary border-border-primary hover:bg-accent-blue-light/30 hover:text-blue-600 hover:border-blue-300'
                  }`}
                  title="Ergänzungen hinzufügen"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
            </div>
            {isExpanded && (
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={details?.brackets || ''}
                  onChange={(e) => handleDetailsChange(fieldName, item, 'brackets', e.target.value, currentSelection)}
                  className="w-full px-2 py-1.5 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-surface-primary text-xs"
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
                  className="w-full px-2 py-1.5 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-surface-primary text-xs"
                  placeholder="Vollständigen Satz hinzufügen."
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="border-2 border-border-primary rounded-lg bg-surface-secondary/30">
      {/* Header with toggle */}
      <div className="flex items-center justify-between p-3 border-b border-border-primary">
        <h4 className="text-base font-semibold text-text-primary">{title}</h4>
        <button
          type="button"
          onClick={handleToggleVorhanden}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
            isVorhanden ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
              isVorhanden ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Content (only shown when vorhanden) */}
      {isVorhanden && elternteilData && (
        <div className="p-3 space-y-4">
          {/* Basic info row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Geburtsjahr</label>
              <input
                type="text"
                value={elternteilData.geburtsjahr}
                onChange={(e) => updateData({ geburtsjahr: e.target.value })}
                placeholder="z.B. 1955"
                className="w-full px-2 py-1.5 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Beruf</label>
              <input
                type="text"
                value={elternteilData.beruf}
                onChange={(e) => updateData({ beruf: e.target.value })}
                placeholder="z.B. Lehrer"
                className="w-full px-2 py-1.5 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary text-sm"
              />
            </div>
          </div>

          {/* Beziehungseigenschaften */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">Beziehungseigenschaften</label>
            {renderCardGrid(
              Object.values(FormTypes.BeziehungsEigenschaft),
              BEZIEHUNGS_EIGENSCHAFT_LABELS,
              'beziehungsEigenschaften',
              elternteilData.beziehungsEigenschaften,
              expandedEigenschaften,
              setExpandedEigenschaften
            )}
            <div className="mt-2">
              <input
                type="text"
                value={elternteilData.beziehungsEigenschaftenAndere}
                onChange={(e) => updateData({ beziehungsEigenschaftenAndere: e.target.value })}
                placeholder="Andere Eigenschaften..."
                className="w-full px-2 py-1.5 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary text-sm"
              />
            </div>
          </div>

          {/* Kritische Verhaltensweisen */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">Kritische Verhaltensweisen</label>
            {renderCardGrid(
              Object.values(FormTypes.KritischeVerhaltensweise),
              KRITISCHE_VERHALTENSWEISE_LABELS,
              'kritischeVerhaltensweisen',
              elternteilData.kritischeVerhaltensweisen,
              expandedVerhaltensweisen,
              setExpandedVerhaltensweisen
            )}
            <div className="mt-2">
              <input
                type="text"
                value={elternteilData.kritischeVerhaltensweiseAndere}
                onChange={(e) => updateData({ kritischeVerhaltensweiseAndere: e.target.value })}
                placeholder="Andere kritische Verhaltensweisen..."
                className="w-full px-2 py-1.5 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary text-sm"
              />
            </div>
          </div>

          {/* Verletzte Grundbedürfnisse */}
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">Verletzte Grundbedürfnisse</label>
            {renderCardGrid(
              Object.values(FormTypes.VerletztesGrundbeduerfnis),
              VERLETZTES_GRUNDBEDUERFNIS_LABELS,
              'verletzteGrundbeduerfnisse',
              elternteilData.verletzteGrundbeduerfnisse,
              expandedGrundbeduerfnisse,
              setExpandedGrundbeduerfnisse
            )}
            <div className="mt-2">
              <input
                type="text"
                value={elternteilData.verletzteGrundbeduerfnisseAndere}
                onChange={(e) => updateData({ verletzteGrundbeduerfnisseAndere: e.target.value })}
                placeholder="Andere verletzte Grundbedürfnisse..."
                className="w-full px-2 py-1.5 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
