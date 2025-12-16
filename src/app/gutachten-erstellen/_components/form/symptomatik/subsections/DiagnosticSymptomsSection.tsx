'use client';

import * as FormTypes from '@/lib/core/form-types';
import { SymptomHandlers } from '@/hooks/useGutachtenForm';
import { ManischeSymptomatikModal } from '../../../shared/ManischeSymptomatikModal';
import { DepressiveSymptomatikModal } from '../../../shared/DepressiveSymptomatikModal';
import { AngstsymptomatikModal } from '../../../shared/AngstsymptomatikModal';
import { ZwangssymptomatikModal } from '../../../shared/ZwangssymptomatikModal';
import { getFormattedManischeSymptoms } from '@/lib/utils/manische-symptomatik-counter';
import { getFormattedDepressiveSymptoms } from '@/lib/utils/depressive-symptomatik-counter';
import { getFormattedAngstSymptoms } from '@/lib/utils/angstsymptomatik-counter';
import { getFormattedZwangSymptoms } from '@/lib/utils/zwangssymptomatik-counter';
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

  const manischeSelectedCount = getFormattedManischeSymptoms(formData.manischeSymptomatik).length;
  const depressiveSelectedCount = getFormattedDepressiveSymptoms(formData.depressiveSymptomatik).length;
  const angstSelectedCount = getFormattedAngstSymptoms(formData.angstsymptomatik).length;
  const zwangSelectedCount = getFormattedZwangSymptoms(formData.zwangssymptomatik).length;

  return (
    <>
      <div className="space-y-3">
        {/* Button for Manische Symptomatik */}
        <button
          onClick={() => setIsManischeModalOpen(true)}
          className="w-full text-left p-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                1. Manische Symptomatik
              </h3>
              {manischeSelectedCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {manischeSelectedCount} Symptom{manischeSelectedCount !== 1 ? 'e' : ''} ausgewählt
                </p>
              )}
            </div>
            <svg
              className="w-6 h-6 text-gray-400 group-hover:text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Button for Depressive Symptomatik */}
        <button
          onClick={() => setIsDepressiveModalOpen(true)}
          className="w-full text-left p-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                2. Depressive Symptomatik
              </h3>
              {depressiveSelectedCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {depressiveSelectedCount} Symptom{depressiveSelectedCount !== 1 ? 'e' : ''} ausgewählt
                </p>
              )}
            </div>
            <svg
              className="w-6 h-6 text-gray-400 group-hover:text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Button for Angstsymptomatik */}
        <button
          onClick={() => setIsAngstModalOpen(true)}
          className="w-full text-left p-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                3. Angstsymptomatik
              </h3>
              {angstSelectedCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {angstSelectedCount} Symptom{angstSelectedCount !== 1 ? 'e' : ''} ausgewählt
                </p>
              )}
            </div>
            <svg
              className="w-6 h-6 text-gray-400 group-hover:text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Button for Zwangssymptomatik */}
        <button
          onClick={() => setIsZwangModalOpen(true)}
          className="w-full text-left p-4 bg-white border-2 border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700">
                4. Zwangssymptomatik
              </h3>
              {zwangSelectedCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {zwangSelectedCount} Symptom{zwangSelectedCount !== 1 ? 'e' : ''} eingetragen
                </p>
              )}
            </div>
            <svg
              className="w-6 h-6 text-gray-400 group-hover:text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Placeholder for future sections (5-20) */}
        <div className="text-sm text-gray-500 italic px-4 py-2">
          Weitere Symptomatik-Kategorien (5-20) folgen hier...
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
    </>
  );
}
