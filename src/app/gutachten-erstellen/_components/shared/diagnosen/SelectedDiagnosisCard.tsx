'use client';

import React from 'react';
import * as FormTypes from '@/lib/core/form-types';
import { getDiagnosisByCode, getParentDiagnosis } from '@/lib/data/icd10-diagnoses';

interface SelectedDiagnosisCardProps {
  diagnosis: FormTypes.SelectedDiagnosisData;
  onRemove: () => void;
  onSetSicherheit: (sicherheit: 'G' | 'V') => void;
}

export function SelectedDiagnosisCard({
  diagnosis,
  onRemove,
  onSetSicherheit,
}: SelectedDiagnosisCardProps) {
  const diagnosisItem = getDiagnosisByCode(diagnosis.code);
  const parentDiagnosis = diagnosisItem?.level === 3 ? getParentDiagnosis(diagnosis.code) : undefined;

  return (
    <div className="bg-white border border-gray-300 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        {/* Diagnosis Info */}
        <div className="flex-1">
          {/* Show parent context for level 3 items */}
          {parentDiagnosis && (
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 5l7 7-7 7"></path>
              </svg>
              <span className="font-mono font-semibold">{parentDiagnosis.code}</span>
              <span>{parentDiagnosis.name}</span>
            </div>
          )}

          <div className="flex items-start gap-2">
            <span className="font-mono font-semibold text-blue-600">
              {diagnosis.code}
            </span>
            <span className="text-gray-800">{diagnosis.name}</span>
          </div>

          {/* Radio Buttons for Sicherheit */}
          <div className="mt-3 flex items-center gap-6">
            <label className="text-sm font-medium text-gray-700">
              Diagnosesicherheit:
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`sicherheit-${diagnosis.code}`}
                  value="G"
                  checked={diagnosis.sicherheit === 'G'}
                  onChange={() => onSetSicherheit('G')}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  <span className="font-semibold">(G)</span> Gesichert
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`sicherheit-${diagnosis.code}`}
                  value="V"
                  checked={diagnosis.sicherheit === 'V'}
                  onChange={() => onSetSicherheit('V')}
                  className="w-4 h-4 text-orange-600 focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">
                  <span className="font-semibold">(V)</span> Verdacht
                </span>
              </label>
            </div>
          </div>

          {/* Visual indicator if no sicherheit selected */}
          {!diagnosis.sicherheit && (
            <p className="text-xs text-red-500 mt-2">
              Bitte Diagnosesicherheit auswählen
            </p>
          )}
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full p-2 transition-colors"
          aria-label="Diagnose entfernen"
        >
          <svg
            className="w-5 h-5"
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
    </div>
  );
}
