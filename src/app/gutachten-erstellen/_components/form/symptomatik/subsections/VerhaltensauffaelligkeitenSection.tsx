'use client';

import { useState } from 'react';
import * as FormTypes from '@/lib/core/form-types';
import { SymptomHandlers } from '@/hooks/useGutachtenForm';
import { getFormattedVerhaltensexzesse, getFormattedVerhaltensdefizite } from '@/lib/utils/verhaltensauffaelligkeiten-counter';
import { VerhaltensexzesseModal, VerhaltensdefiziteModal } from '../../../shared/symptomatik-modals';

interface VerhaltensauffaelligkeitenSectionProps {
  formData: FormTypes.Form;
  symptomHandlers: SymptomHandlers;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
}

export function VerhaltensauffaelligkeitenSection({
  formData,
  symptomHandlers,
  setNestedField,
}: VerhaltensauffaelligkeitenSectionProps) {
  const [isVerhaltensexzesseModalOpen, setIsVerhaltensexzesseModalOpen] = useState(false);
  const [isVerhaltensdefiziteModalOpen, setIsVerhaltensdefiziteModalOpen] = useState(false);

  const exzesseSelectedCount = getFormattedVerhaltensexzesse(formData.verhaltensauffaelligkeiten).length;
  const defiziteSelectedCount = getFormattedVerhaltensdefizite(formData.verhaltensauffaelligkeiten).length;

  return (
    <div className="space-y-3">
      {/* Button for Verhaltensexzesse with delete option */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsVerhaltensexzesseModalOpen(true)}
          className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${
            exzesseSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">
                Verhaltensexzesse
              </h4>
              {exzesseSelectedCount > 0 && (
                <p className="text-sm text-text-secondary mt-1">
                  {exzesseSelectedCount} Symptom{exzesseSelectedCount !== 1 ? 'e' : ''} ausgewählt
                </p>
              )}
            </div>
            <svg
              className="w-6 h-6 text-text-quaternary group-hover:text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
        {/* Delete button - only shown when symptoms are selected */}
        {exzesseSelectedCount > 0 && (
          <button
            type="button"
            onClick={() => {
              if (!window.confirm(`Möchten Sie wirklich alle ${exzesseSelectedCount} ausgewählten Verhaltensexzesse löschen?`)) {
                return;
              }
              symptomHandlers.clearVerhaltensexzesse();
            }}
            className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"
          >
            <svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Auswahl löschen
            </span>
          </button>
        )}
      </div>

      {/* Button for Verhaltensdefizite with delete option */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsVerhaltensdefiziteModalOpen(true)}
          className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${
            defiziteSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">
                Verhaltensdefizite
              </h4>
              {defiziteSelectedCount > 0 && (
                <p className="text-sm text-text-secondary mt-1">
                  {defiziteSelectedCount} Symptom{defiziteSelectedCount !== 1 ? 'e' : ''} ausgewählt
                </p>
              )}
            </div>
            <svg
              className="w-6 h-6 text-text-quaternary group-hover:text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
        {/* Delete button - only shown when symptoms are selected */}
        {defiziteSelectedCount > 0 && (
          <button
            type="button"
            onClick={() => {
              if (!window.confirm(`Möchten Sie wirklich alle ${defiziteSelectedCount} ausgewählten Verhaltensdefizite löschen?`)) {
                return;
              }
              symptomHandlers.clearVerhaltensdefizite();
            }}
            className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"
          >
            <svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Auswahl löschen
            </span>
          </button>
        )}
      </div>

      {/* Modals */}
      <VerhaltensexzesseModal
        isOpen={isVerhaltensexzesseModalOpen}
        onClose={() => setIsVerhaltensexzesseModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />
      <VerhaltensdefiziteModal
        isOpen={isVerhaltensdefiziteModalOpen}
        onClose={() => setIsVerhaltensdefiziteModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />
    </div>
  );
}
