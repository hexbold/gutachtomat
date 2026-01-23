'use client';

import * as FormTypes from '@/lib/core/form-types';
import { SymptomHandlers } from '@/hooks/useGutachtenForm';
import {
  ManischeSymptomatikModal,
  DepressiveSymptomatikModal,
  AngstsymptomatikModal,
  ZwangssymptomatikModal,
  HyperkinetischeStoerungenModal,
  TicStoerungenModal,
  SuizidalitaetSymptomatikModal,
  SonstigeSymptomatikModal,
} from '../../../shared/symptomatik-modals';
import { getFormattedManischeSymptoms } from '@/lib/utils/manische-symptomatik-counter';
import { getFormattedDepressiveSymptoms } from '@/lib/utils/depressive-symptomatik-counter';
import { getFormattedAngstSymptoms } from '@/lib/utils/angstsymptomatik-counter';
import { getFormattedZwangSymptoms } from '@/lib/utils/zwangssymptomatik-counter';
import { getFormattedHyperkinetischeStoerungen } from '@/lib/utils/hyperkinetische-counter';
import { getFormattedTicStoerungen } from '@/lib/utils/tic-stoerungen-counter';
import { getFormattedSuizidalitaetSymptomatik } from '@/lib/utils/suizidalitaet-symptomatik-counter';
import { getFormattedSonstigeSymptomatik } from '@/lib/utils/sonstige-symptomatik-counter';
import { useState } from 'react';

interface DiagnosticSymptomsSectionProps {
  formData: FormTypes.Form;
  symptomHandlers: SymptomHandlers;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
}

export function DiagnosticSymptomsSection({
  formData,
  symptomHandlers,
  setNestedField,
}: DiagnosticSymptomsSectionProps) {
  const [isManischeModalOpen, setIsManischeModalOpen] = useState(false);
  const [isDepressiveModalOpen, setIsDepressiveModalOpen] = useState(false);
  const [isAngstModalOpen, setIsAngstModalOpen] = useState(false);
  const [isZwangModalOpen, setIsZwangModalOpen] = useState(false);
  const [isHyperkinetischeModalOpen, setIsHyperkinetischeModalOpen] = useState(false);
  const [isTicStoerungenModalOpen, setIsTicStoerungenModalOpen] = useState(false);
  const [isSuizidalitaetModalOpen, setIsSuizidalitaetModalOpen] = useState(false);
  const [isSonstigeModalOpen, setIsSonstigeModalOpen] = useState(false);

  const manischeSelectedCount = getFormattedManischeSymptoms(formData.manischeSymptomatik).length;
  const depressiveSelectedCount = getFormattedDepressiveSymptoms(formData.depressiveSymptomatik).length;
  const angstSelectedCount = getFormattedAngstSymptoms(formData.angstsymptomatik).length;
  const zwangSelectedCount = getFormattedZwangSymptoms(formData.zwangssymptomatik).length;
  const hyperkinetischeSelectedCount = getFormattedHyperkinetischeStoerungen(formData.hyperkinetischeStoerungen).length;
  const ticStoerungenSelectedCount = getFormattedTicStoerungen(formData.ticStoerungen).length;
  const suizidalitaetSelectedCount = getFormattedSuizidalitaetSymptomatik(formData.suizidalitaetSymptomatik).length;
  const sonstigeSelectedCount = getFormattedSonstigeSymptomatik(formData.sonstigeSymptomatik).length;

  return (
    <>
      <div className="space-y-3">
        {/* Button for Manische Symptomatik with delete option */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsManischeModalOpen(true)}
            className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${
              manischeSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">
                  1. Manische Symptomatik
                </h3>
                {manischeSelectedCount > 0 && (
                  <p className="text-sm text-text-secondary mt-1">
                    {manischeSelectedCount} Symptom{manischeSelectedCount !== 1 ? 'e' : ''} ausgewählt
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
          {manischeSelectedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                if (!window.confirm(`Möchten Sie wirklich alle ${manischeSelectedCount} ausgewählten manischen Symptome löschen?`)) {
                  return;
                }
                symptomHandlers.clearManischeSymptomatik();
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

        {/* Button for Depressive Symptomatik with delete option */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsDepressiveModalOpen(true)}
            className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${
              depressiveSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">
                  2. Depressive Symptomatik
                </h3>
                {depressiveSelectedCount > 0 && (
                  <p className="text-sm text-text-secondary mt-1">
                    {depressiveSelectedCount} Symptom{depressiveSelectedCount !== 1 ? 'e' : ''} ausgewählt
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
          {depressiveSelectedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                if (!window.confirm(`Möchten Sie wirklich alle ${depressiveSelectedCount} ausgewählten depressiven Symptome löschen?`)) {
                  return;
                }
                symptomHandlers.clearDepressiveSymptomatik();
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

        {/* Button for Angstsymptomatik with delete option */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsAngstModalOpen(true)}
            className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${
              angstSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">
                  3. Angstsymptomatik
                </h3>
                {angstSelectedCount > 0 && (
                  <p className="text-sm text-text-secondary mt-1">
                    {angstSelectedCount} Symptom{angstSelectedCount !== 1 ? 'e' : ''} ausgewählt
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
          {angstSelectedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                if (!window.confirm(`Möchten Sie wirklich alle ${angstSelectedCount} ausgewählten Angstsymptome löschen?`)) {
                  return;
                }
                symptomHandlers.clearAngstsymptomatik();
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

        {/* Button for Zwangssymptomatik with delete option */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsZwangModalOpen(true)}
            className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${
              zwangSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">
                  4. Zwangssymptomatik
                </h3>
                {zwangSelectedCount > 0 && (
                  <p className="text-sm text-text-secondary mt-1">
                    {zwangSelectedCount} Symptom{zwangSelectedCount !== 1 ? 'e' : ''} eingetragen
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
          {zwangSelectedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                if (!window.confirm(`Möchten Sie wirklich alle ${zwangSelectedCount} eingetragenen Zwangssymptome löschen?`)) {
                  return;
                }
                symptomHandlers.clearZwangssymptomatik();
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

        {/* Button for Hyperkinetische Störungen with delete option */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsHyperkinetischeModalOpen(true)}
            className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${
              hyperkinetischeSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">
                  17. Hyperkinetische Störungen
                </h3>
                {hyperkinetischeSelectedCount > 0 && (
                  <p className="text-sm text-text-secondary mt-1">
                    {hyperkinetischeSelectedCount} Symptom{hyperkinetischeSelectedCount !== 1 ? 'e' : ''} ausgewählt
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
          {hyperkinetischeSelectedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                if (!window.confirm(`Möchten Sie wirklich alle ${hyperkinetischeSelectedCount} ausgewählten Symptome löschen?`)) {
                  return;
                }
                symptomHandlers.clearHyperkinetischeStoerungen();
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

        {/* Button for Tic-Störungen with delete option */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsTicStoerungenModalOpen(true)}
            className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${
              ticStoerungenSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">
                  18. Tic-Störungen
                </h3>
                {ticStoerungenSelectedCount > 0 && (
                  <p className="text-sm text-text-secondary mt-1">
                    {ticStoerungenSelectedCount} Symptom{ticStoerungenSelectedCount !== 1 ? 'e' : ''} ausgewählt
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
          {ticStoerungenSelectedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                if (!window.confirm(`Möchten Sie wirklich alle ${ticStoerungenSelectedCount} ausgewählten Symptome löschen?`)) {
                  return;
                }
                symptomHandlers.clearTicStoerungen();
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

        {/* Button for Suizidalität with delete option */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsSuizidalitaetModalOpen(true)}
            className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${
              suizidalitaetSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">
                  19. Suizidalität
                </h3>
                {suizidalitaetSelectedCount > 0 && (
                  <p className="text-sm text-text-secondary mt-1">
                    {suizidalitaetSelectedCount} Symptom{suizidalitaetSelectedCount !== 1 ? 'e' : ''} ausgewählt
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
          {suizidalitaetSelectedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                if (!window.confirm(`Möchten Sie wirklich alle ${suizidalitaetSelectedCount} ausgewählten Symptome löschen?`)) {
                  return;
                }
                symptomHandlers.clearSuizidalitaetSymptomatik();
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

        {/* Button for Sonstige Symptomatik with delete option */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsSonstigeModalOpen(true)}
            className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${
              sonstigeSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">
                  20. Sonstige Symptomatik
                </h3>
                {sonstigeSelectedCount > 0 && (
                  <p className="text-sm text-text-secondary mt-1">
                    {sonstigeSelectedCount} Symptom{sonstigeSelectedCount !== 1 ? 'e' : ''} ausgewählt
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
          {sonstigeSelectedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                if (!window.confirm(`Möchten Sie wirklich alle ${sonstigeSelectedCount} ausgewählten Symptome löschen?`)) {
                  return;
                }
                symptomHandlers.clearSonstigeSymptomatik();
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
      </div>

      {/* Manische Symptomatik Modal */}
      <ManischeSymptomatikModal
        isOpen={isManischeModalOpen}
        onClose={() => setIsManischeModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Depressive Symptomatik Modal */}
      <DepressiveSymptomatikModal
        isOpen={isDepressiveModalOpen}
        onClose={() => setIsDepressiveModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Angstsymptomatik Modal */}
      <AngstsymptomatikModal
        isOpen={isAngstModalOpen}
        onClose={() => setIsAngstModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Zwangssymptomatik Modal */}
      <ZwangssymptomatikModal
        isOpen={isZwangModalOpen}
        onClose={() => setIsZwangModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Hyperkinetische Störungen Modal */}
      <HyperkinetischeStoerungenModal
        isOpen={isHyperkinetischeModalOpen}
        onClose={() => setIsHyperkinetischeModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Tic-Störungen Modal */}
      <TicStoerungenModal
        isOpen={isTicStoerungenModalOpen}
        onClose={() => setIsTicStoerungenModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Suizidalität Modal */}
      <SuizidalitaetSymptomatikModal
        isOpen={isSuizidalitaetModalOpen}
        onClose={() => setIsSuizidalitaetModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Sonstige Symptomatik Modal */}
      <SonstigeSymptomatikModal
        isOpen={isSonstigeModalOpen}
        onClose={() => setIsSonstigeModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />
    </>
  );
}
