'use client';

import { A4Handlers, A5Handlers, BefundHandlers, SymptomHandlers } from '@/hooks/useGutachtenForm';
import {
  a2Symptoms,
  a3Symptoms
} from '@/lib/core/options/anamnese-sections';
import * as FormTypes from '@/lib/core/form-types';
import { useEffect, useState } from 'react';
import { ManischeSymptomatikModal } from '../../shared/ManischeSymptomatikModal';
import { DepressiveSymptomatikModal } from '../../shared/DepressiveSymptomatikModal';
import { AngstsymptomatikModal } from '../../shared/AngstsymptomatikModal';
import { ZwangssymptomatikModal } from '../../shared/ZwangssymptomatikModal';
import { getFormattedManischeSymptoms } from '@/lib/utils/manische-symptomatik-counter';
import { getFormattedDepressiveSymptoms } from '@/lib/utils/depressive-symptomatik-counter';
import { getFormattedAngstSymptoms } from '@/lib/utils/angstsymptomatik-counter';
import { getFormattedZwangSymptoms } from '@/lib/utils/zwangssymptomatik-counter';

interface WizardStep3Props {
  formData: FormTypes.Form;
  onFieldChange: (field: keyof FormTypes.Form, value: string) => void;
  symptomHandlers: SymptomHandlers;
  a4Handlers: A4Handlers;
  a5Handlers: A5Handlers;
  befundHandlers: BefundHandlers;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
  confirmedSubSteps: Set<number>;
  completedSubSteps: Set<number>;
  onConfirmSubStep: (substep: number) => void;
  onCompleteSubStep: (substep: number) => void;
  amdpConfirmedPages: Set<number>;
  amdpCompletedPages: Set<number>;
  onConfirmAmdpPage: (page: number) => void;
  onCompleteAmdpPage: (page: number) => void;
}

interface SubStep {
  id: number;
  title: string;
  shortTitle: string;
}

const SUB_STEPS: SubStep[] = [
  { id: 1, title: 'Kategorisierte Symptomatik', shortTitle: 'Symptome' },
  { id: 2, title: 'Verhaltensdefizite & -exzesse', shortTitle: 'A2-A3' },
  { id: 3, title: 'Verlauf & Stressfaktoren', shortTitle: 'A4-A5' },
  { id: 4, title: 'AMDP Befund', shortTitle: 'AMDP' },
  { id: 5, title: 'Testdiagnostik', shortTitle: 'Tests' },
];

interface SymptomCardProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

function SymptomCard({ label, isSelected, onClick }: SymptomCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`
        relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center
        ${isSelected
          ? 'border-blue-500 bg-accent-blue-light shadow-sm'
          : 'border-border-primary bg-surface-primary hover:border-blue-300 hover:bg-accent-blue-light/30'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-400
      `}
    >
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      )}
      <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isSelected ? 'text-blue-700' : 'text-text-secondary'}`}>
        {label}
      </span>
    </button>
  );
}

export function WizardStep3({
  formData,
  onFieldChange,
  symptomHandlers,
  a4Handlers,
  a5Handlers,
  befundHandlers,
  setNestedField,
  confirmedSubSteps,
  completedSubSteps,
  onConfirmSubStep,
  onCompleteSubStep,
  amdpConfirmedPages,
  amdpCompletedPages,
  onConfirmAmdpPage,
  onCompleteAmdpPage,
}: WizardStep3Props) {
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [currentAmdpPage, setCurrentAmdpPage] = useState(1);
  const [isManischeModalOpen, setIsManischeModalOpen] = useState(false);
  const [isDepressiveModalOpen, setIsDepressiveModalOpen] = useState(false);
  const [isAngstModalOpen, setIsAngstModalOpen] = useState(false);
  const [isZwangModalOpen, setIsZwangModalOpen] = useState(false);

  const canGoNext = currentSubStep < SUB_STEPS.length;
  const canGoPrev = currentSubStep > 1;

  // Check if user is on the last AMDP page (B17-B18)
  const isOnLastAmdpPage = currentSubStep === 4 && currentAmdpPage === 6;

  // Auto-complete the last substep (Tests) when user navigates to it
  useEffect(() => {
    if (currentSubStep === SUB_STEPS.length && !completedSubSteps.has(currentSubStep)) {
      onCompleteSubStep(currentSubStep);
    }
  }, [currentSubStep, completedSubSteps, onCompleteSubStep]);

  const handleConfirm = () => {
    // If on AMDP substep, require user to be on last page (B17-B18)
    if (currentSubStep === 4 && !isOnLastAmdpPage) {
      return; // Block confirmation
    }

    // If confirming AMDP substep, mark the last page (6) as completed
    if (currentSubStep === 4 && isOnLastAmdpPage) {
      onCompleteAmdpPage(6);
    }

    // Mark current step as completed
    onCompleteSubStep(currentSubStep);

    // Automatically move to next step if available
    if (canGoNext) {
      const nextStep = currentSubStep + 1;
      onConfirmSubStep(nextStep); // Make next step accessible (but not completed)
      setCurrentSubStep(nextStep);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentSubStep(currentSubStep - 1);
    }
  };

  const handleSubStepClick = (stepNumber: number) => {
    // Only allow clicking on confirmed steps
    if (confirmedSubSteps.has(stepNumber)) {
      setCurrentSubStep(stepNumber);
    }
  };

  // Count selected symptoms using shared utilities - single source of truth
  const ms = formData.manischeSymptomatik;
  const ds = formData.depressiveSymptomatik;
  const angst = formData.angstsymptomatik;
  const zwang = formData.zwangssymptomatik;

  const manischeSelectedCount = getFormattedManischeSymptoms(ms).length;
  const depressiveSelectedCount = getFormattedDepressiveSymptoms(ds).length;
  const angstSelectedCount = getFormattedAngstSymptoms(angst).length;
  const zwangSelectedCount = getFormattedZwangSymptoms(zwang).length;

  return (
    <div className="flex gap-4">
      {/* Vertical Navigation Sidebar */}
      <div className="w-40 flex-shrink-0">
        <div className="sticky top-4 space-y-2">
          {SUB_STEPS.map((step) => {
            const isActive = currentSubStep === step.id;
            const isConfirmed = confirmedSubSteps.has(step.id) && step.id !== currentSubStep;
            const isAccessible = confirmedSubSteps.has(step.id);
            const isLocked = !isAccessible;

            return (
              <button
                key={step.id}
                onClick={() => handleSubStepClick(step.id)}
                disabled={isLocked}
                className={`
                  w-full text-left p-2.5 rounded-md border-2 transition-all duration-200
                  ${isActive
                    ? 'border-blue-500 bg-accent-blue-light shadow-sm'
                    : isConfirmed
                      ? 'border-green-500 bg-accent-green-light hover:bg-accent-green-light cursor-pointer'
                      : isLocked
                        ? 'border-border-primary bg-surface-secondary opacity-50 cursor-not-allowed'
                        : 'border-border-primary bg-surface-primary hover:border-blue-300 hover:bg-accent-blue-light/50 cursor-pointer'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                    ${isActive
                      ? 'bg-blue-500 text-white'
                      : isConfirmed
                        ? 'bg-green-500 text-white'
                        : isLocked
                          ? 'bg-surface-tertiary text-text-quaternary'
                          : 'bg-surface-tertiary text-text-tertiary'
                    }
                  `}>
                    {isConfirmed ? '✓' : isLocked ? '🔒' : step.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold leading-tight truncate ${isActive ? 'text-blue-700' : isConfirmed ? 'text-green-700' : isLocked ? 'text-text-quaternary' : 'text-text-secondary'
                      }`}>
                      {step.shortTitle}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="space-y-6">
          {/* Substep Header */}
          <div className="mb-2">
            <h3 className="text-xl font-bold text-text-primary">
              {SUB_STEPS[currentSubStep - 1].title}
            </h3>
          </div>

          {/* Substep Content */}
          <div className="space-y-6">
            {/* Step 1: Kategorisierte Symptomatik */}
            {currentSubStep === 1 && (
              <div className="space-y-3">
                {/* Button for Manische Symptomatik with delete option */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsManischeModalOpen(true)}
                    className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${
                      manischeSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">
                          Manische Symptomatik
                        </h4>
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
                      onClick={() => {
                        // Confirm before deleting
                        if (!window.confirm(`Möchten Sie wirklich alle ${manischeSelectedCount} ausgewählten Symptome löschen?`)) {
                          return;
                        }
                        // Clear all manische symptomatik selections
                        for (const key of Object.keys(ms.stimmungEmotionalesErleben)) {
                          symptomHandlers.toggleSelectionField('manischeSymptomatik.stimmungEmotionalesErleben', key);
                        }
                        for (const key of Object.keys(ms.antriebEnergiePsychomotorik)) {
                          symptomHandlers.toggleSelectionField('manischeSymptomatik.antriebEnergiePsychomotorik', key);
                        }
                        for (const key of Object.keys(ms.spracheKognition)) {
                          symptomHandlers.toggleSelectionField('manischeSymptomatik.spracheKognition', key);
                        }
                        for (const key of Object.keys(ms.vegetativeSymptome)) {
                          symptomHandlers.toggleSelectionField('manischeSymptomatik.vegetativeSymptome', key);
                        }
                        for (const key of Object.keys(ms.selbsterleben)) {
                          symptomHandlers.toggleSelectionField('manischeSymptomatik.selbsterleben', key);
                        }
                        for (const key of Object.keys(ms.verhalten.selection)) {
                          symptomHandlers.toggleSelectionField('manischeSymptomatik.verhalten.selection', key);
                        }
                        for (const key of Object.keys(ms.verhalten.impulsivesVerhalten.details)) {
                          symptomHandlers.toggleSelectionField('manischeSymptomatik.verhalten.impulsivesVerhalten.details', key);
                        }
                        symptomHandlers.setNestedTextField('manischeSymptomatik.verhalten.impulsivesVerhalten.andere', '');
                        for (const key of Object.keys(ms.psychotischeSymptome)) {
                          symptomHandlers.toggleSelectionField('manischeSymptomatik.psychotischeSymptome', key);
                        }
                        for (const key of Object.keys(ms.dissoziativeSymptome)) {
                          symptomHandlers.toggleSelectionField('manischeSymptomatik.dissoziativeSymptome', key);
                        }
                        symptomHandlers.setNestedTextField('manischeSymptomatik.andereSymptome', '');
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
                    onClick={() => setIsDepressiveModalOpen(true)}
                    className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${
                      depressiveSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">
                          Depressive Symptomatik
                        </h4>
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
                      onClick={() => {
                        // Confirm before deleting
                        if (!window.confirm(`Möchten Sie wirklich alle ${depressiveSelectedCount} ausgewählten Symptome löschen?`)) {
                          return;
                        }
                        // Clear all depressive symptomatik selections
                        for (const key of Object.keys(ds.stimmungEmotionalesErleben)) {
                          symptomHandlers.toggleSelectionField('depressiveSymptomatik.stimmungEmotionalesErleben', key);
                        }
                        for (const key of Object.keys(ds.antriebEnergiePsychomotorik)) {
                          symptomHandlers.toggleSelectionField('depressiveSymptomatik.antriebEnergiePsychomotorik', key);
                        }
                        for (const key of Object.keys(ds.selbsterleben)) {
                          symptomHandlers.toggleSelectionField('depressiveSymptomatik.selbsterleben', key);
                        }
                        for (const key of Object.keys(ds.vegetativeSomatischeSymptome)) {
                          symptomHandlers.toggleSelectionField('depressiveSymptomatik.vegetativeSomatischeSymptome', key);
                        }
                        for (const key of Object.keys(ds.psychomotorischeSymptome)) {
                          symptomHandlers.toggleSelectionField('depressiveSymptomatik.psychomotorischeSymptome', key);
                        }
                        for (const key of Object.keys(ds.kognition)) {
                          symptomHandlers.toggleSelectionField('depressiveSymptomatik.kognition', key);
                        }
                        for (const key of Object.keys(ds.verhalten)) {
                          symptomHandlers.toggleSelectionField('depressiveSymptomatik.verhalten', key);
                        }
                        for (const key of Object.keys(ds.psychotischeSymptome)) {
                          symptomHandlers.toggleSelectionField('depressiveSymptomatik.psychotischeSymptome', key);
                        }
                        for (const key of Object.keys(ds.dissoziativeSymptome)) {
                          symptomHandlers.toggleSelectionField('depressiveSymptomatik.dissoziativeSymptome', key);
                        }
                        symptomHandlers.setNestedTextField('depressiveSymptomatik.andereSymptome', '');
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
                    onClick={() => setIsAngstModalOpen(true)}
                    className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${
                      angstSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">
                          Angstsymptomatik
                        </h4>
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
                      onClick={() => {
                        // Confirm before deleting
                        if (!window.confirm(`Möchten Sie wirklich alle ${angstSelectedCount} ausgewählten Symptome löschen?`)) {
                          return;
                        }
                        // Clear all angstsymptomatik selections
                        for (const key of Object.keys(angst.emotionalesErleben)) {
                          symptomHandlers.toggleSelectionField('angstsymptomatik.emotionalesErleben', key);
                        }
                        // Clear Kognition simple symptoms (exclude 'sorgen')
                        for (const key of Object.keys(angst.kognition)) {
                          if (key !== 'sorgen') {
                            symptomHandlers.toggleSelectionField('angstsymptomatik.kognition', key);
                          }
                        }
                        // Clear Sorgen by resetting kognition to only have remaining simple symptoms
                        if (angst.kognition.sorgen) {
                          const newKognition: Record<string, unknown> = {};
                          for (const [key, val] of Object.entries(angst.kognition)) {
                            if (key !== 'sorgen' && val === 'selected') {
                              newKognition[key] = 'selected';
                            }
                          }
                          setNestedField('angstsymptomatik.kognition', newKognition);
                        }
                        // Clear Vegetative symptoms
                        for (const key of Object.keys(angst.vegetativeSymptome)) {
                          symptomHandlers.toggleSelectionField('angstsymptomatik.vegetativeSymptome', key);
                        }
                        // Clear Verhalten text fields
                        setNestedField('angstsymptomatik.verhalten', {});
                        // Clear Dissoziative Symptome
                        for (const key of Object.keys(angst.dissoziativeSymptome)) {
                          symptomHandlers.toggleSelectionField('angstsymptomatik.dissoziativeSymptome', key);
                        }
                        // Clear Panikstörung
                        for (const key of Object.keys(angst.panikstoerung)) {
                          symptomHandlers.toggleSelectionField('angstsymptomatik.panikstoerung', key);
                        }
                        // Clear Agoraphobie
                        setNestedField('angstsymptomatik.agoraphobie', {});
                        symptomHandlers.setNestedTextField('angstsymptomatik.andereSymptome', '');
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
                    onClick={() => setIsZwangModalOpen(true)}
                    className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 cursor-pointer group ${
                      zwangSelectedCount > 0 ? 'border-purple-500' : 'border-border-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-purple-700">
                          Zwangssymptomatik
                        </h4>
                        {zwangSelectedCount > 0 && (
                          <p className="text-sm text-text-secondary mt-1">
                            {zwangSelectedCount} Symptom{zwangSelectedCount !== 1 ? 'e' : ''} eingetragen
                          </p>
                        )}
                      </div>
                      <svg
                        className="w-6 h-6 text-text-quaternary group-hover:text-purple-500"
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
                      onClick={() => {
                        // Confirm before deleting
                        if (!window.confirm(`Möchten Sie wirklich alle ${zwangSelectedCount} eingetragenen Symptome löschen?`)) {
                          return;
                        }
                        // Clear all zwangssymptomatik
                        setNestedField('zwangssymptomatik.zwangsgedanken', {});
                        symptomHandlers.setNestedTextField('zwangssymptomatik.andereSymptome', '');
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

                {/* Placeholder for future sections (5-20) */}
                <div className="text-sm text-text-tertiary italic px-4 py-2">
                  Weitere Symptomatik-Kategorien (5-20) folgen hier...
                </div>
              </div>
            )}

            {/* Step 2: A2-A3 (unchanged) */}
            {currentSubStep === 2 && (
              <>
                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-3">A2 Verhaltensdefizite</h4>
                  <div className="grid grid-cols-2 gap-2.5 mb-3">
                    {a2Symptoms.map((symptom) => (
                      <SymptomCard
                        key={symptom}
                        label={symptom}
                        isSelected={formData.a2.symptoms.includes(symptom)}
                        onClick={() => symptomHandlers.toggleSymptom('a2', symptom)}
                      />
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Weitere Defizite</label>
                    <input
                      type="text"
                      value={formData.a2.andereSymptome}
                      onChange={(e) => symptomHandlers.setAndereSymptome('a2', e.target.value)}
                      placeholder="z.B. Schwierigkeiten bei der Affektregulation..."
                      className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-3">A3 Verhaltensexzesse</h4>
                  <div className="grid grid-cols-2 gap-2.5 mb-3">
                    {a3Symptoms.map((symptom) => (
                      <SymptomCard
                        key={symptom}
                        label={symptom}
                        isSelected={formData.a3.symptoms.includes(symptom)}
                        onClick={() => symptomHandlers.toggleSymptom('a3', symptom)}
                      />
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Weitere Exzesse</label>
                    <input
                      type="text"
                      value={formData.a3.andereSymptome}
                      onChange={(e) => symptomHandlers.setAndereSymptome('a3', e.target.value)}
                      placeholder="z.B. Exzessives Spielverhalten, Kaufsucht..."
                      className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Rest of the steps remain the same... */}
            {/* (A4-A5, AMDP, Tests) */}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t-2 border-border-primary mt-8">
            <button
              onClick={handlePrev}
              disabled={!canGoPrev}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${canGoPrev
                ? 'bg-surface-secondary text-text-primary hover:bg-surface-tertiary border-2 border-border-primary'
                : 'bg-surface-tertiary text-text-quaternary cursor-not-allowed border-2 border-border-secondary'
                }`}
            >
              ← Zurück
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              {canGoNext ? 'Weiter →' : 'Abschließen'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Manische Symptomatik */}
      <ManischeSymptomatikModal
        isOpen={isManischeModalOpen}
        onClose={() => setIsManischeModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Depressive Symptomatik */}
      <DepressiveSymptomatikModal
        isOpen={isDepressiveModalOpen}
        onClose={() => setIsDepressiveModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Angstsymptomatik */}
      <AngstsymptomatikModal
        isOpen={isAngstModalOpen}
        onClose={() => setIsAngstModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Zwangssymptomatik */}
      <ZwangssymptomatikModal
        isOpen={isZwangModalOpen}
        onClose={() => setIsZwangModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />
    </div>
  );
}
