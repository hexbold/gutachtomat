'use client';

import { BefundHandlers, SymptomHandlers, TestdiagnostikHandlers } from '@/hooks/useGutachtenForm';
import * as FormTypes from '@/lib/core/form-types';
import { useState } from 'react';
import {
  ManischeSymptomatikModal,
  DepressiveSymptomatikModal,
  AngstsymptomatikModal,
  ZwangssymptomatikModal,
  VerhaltensexzesseModal,
  VerhaltensdefiziteModal,
} from '../../shared/symptomatik-modals';
import { getFormattedManischeSymptoms } from '@/lib/utils/manische-symptomatik-counter';
import { getFormattedDepressiveSymptoms } from '@/lib/utils/depressive-symptomatik-counter';
import { getFormattedAngstSymptoms } from '@/lib/utils/angstsymptomatik-counter';
import { getFormattedZwangSymptoms } from '@/lib/utils/zwangssymptomatik-counter';
import { getFormattedVerhaltensexzesse, getFormattedVerhaltensdefizite } from '@/lib/utils/verhaltensauffaelligkeiten-counter';
import { AMDPSubstep } from './AMDPSubstep';
import { SelectedTestCard, TestVerfahrenListView } from '../../shared/testdiagnostik';
import { searchTestVerfahren, type TestVerfahren } from '@/lib/data/test-verfahren';

interface WizardStep3Props {
  formData: FormTypes.Form;
  onFieldChange: (field: keyof FormTypes.Form, value: string) => void;
  symptomHandlers: SymptomHandlers;
  befundHandlers: BefundHandlers;
  testdiagnostikHandlers: TestdiagnostikHandlers;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
  currentSubStep: number;
  onSubStepChange: (substep: number) => void;
}

interface SubStep {
  id: number;
  title: string;
  shortTitle: string;
}

const SUB_STEPS: SubStep[] = [
  { id: 1, title: 'Kategorisierte Symptomatik nach ICD-10', shortTitle: 'Symptomatik' },
  { id: 2, title: 'Dauer, Verlauf und Auslöser', shortTitle: 'Dauer, Verlauf und Auslöser' },
  { id: 3, title: 'Verhaltensexzesse und Verhaltensdefizite', shortTitle: 'Verhaltensdefizite und -exzesse' },
  { id: 4, title: 'AMDP Befund', shortTitle: 'Psychischer Befund' },
  { id: 5, title: 'Testdiagnostik', shortTitle: 'Testdiagnostik' },
];

export function WizardStep3({
  formData,
  onFieldChange,
  symptomHandlers,
  befundHandlers,
  testdiagnostikHandlers,
  setNestedField,
  currentSubStep,
  onSubStepChange,
}: WizardStep3Props) {
  const [isManischeModalOpen, setIsManischeModalOpen] = useState(false);
  const [isDepressiveModalOpen, setIsDepressiveModalOpen] = useState(false);
  const [isAngstModalOpen, setIsAngstModalOpen] = useState(false);
  const [isZwangModalOpen, setIsZwangModalOpen] = useState(false);
  const [isVerhaltensexzesseModalOpen, setIsVerhaltensexzesseModalOpen] = useState(false);
  const [isVerhaltensdefiziteModalOpen, setIsVerhaltensdefiziteModalOpen] = useState(false);
  const [isTestListViewOpen, setIsTestListViewOpen] = useState(false);
  const [testSearchQuery, setTestSearchQuery] = useState('');
  const testSearchResults = searchTestVerfahren(testSearchQuery);

  const handleSelectTest = (test: TestVerfahren) => {
    testdiagnostikHandlers.addTest(test.abbreviation, test.name);
    setTestSearchQuery('');
  };

  const handleSubStepClick = (stepNumber: number) => {
    onSubStepChange(stepNumber);
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

  // Count selected Verhaltensauffaelligkeiten using shared utilities
  const exzesseSelectedCount = getFormattedVerhaltensexzesse(formData.verhaltensauffaelligkeiten).length;
  const defiziteSelectedCount = getFormattedVerhaltensdefizite(formData.verhaltensauffaelligkeiten).length;

  return (
    <div className="flex gap-4">
      {/* Vertical Navigation Sidebar */}
      <div className="w-40 flex-shrink-0">
        <div className="sticky top-4 space-y-2">
          {SUB_STEPS.map((step) => {
            const isActive = currentSubStep === step.id;

            return (
              <button
                key={step.id}
                onClick={() => handleSubStepClick(step.id)}
                className={`
                  w-full text-left p-2.5 rounded-md border-2 transition-all duration-200 cursor-pointer
                  ${isActive
                    ? 'border-blue-500 bg-accent-blue-light shadow-sm'
                    : 'border-border-primary bg-surface-primary hover:border-blue-300 hover:bg-accent-blue-light/50'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                    ${isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-surface-tertiary text-text-tertiary'
                    }
                  `}>
                    {step.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold leading-tight ${isActive ? 'text-blue-700' : 'text-text-secondary'}`}>
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
                        if (!window.confirm(`Möchten Sie wirklich alle ${manischeSelectedCount} ausgewählten Symptome löschen?`)) {
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
                        if (!window.confirm(`Möchten Sie wirklich alle ${depressiveSelectedCount} ausgewählten Symptome löschen?`)) {
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
                        if (!window.confirm(`Möchten Sie wirklich alle ${angstSelectedCount} ausgewählten Symptome löschen?`)) {
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

                {/* Placeholder for future sections (5-20) */}
                <div className="text-sm text-text-tertiary italic px-4 py-2">
                  Weitere Symptomatik-Kategorien (5-20) folgen hier...
                </div>
              </div>
            )}

            {/* Step 3: Verhaltensexzesse & Verhaltensdefizite */}
            {currentSubStep === 3 && (
              <div className="space-y-3">
                {/* Button for Verhaltensexzesse with delete option */}
                <div className="flex gap-2">
                  <button
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
              </div>
            )}

            {/* Substep 2: Dauer, Verlauf und Auslöser */}
            {currentSubStep === 2 && (
              <div className="space-y-6">
                {/* Beginn und Dauer der Symptomatik */}
                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-2">
                    Beginn und Dauer der Symptomatik
                  </h4>
                  <textarea
                    value={formData.symptomatikKontext.beginnUndDauer}
                    onChange={(e) => setNestedField('symptomatikKontext.beginnUndDauer', e.target.value)}
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      if (val && !/[.!?]$/.test(val)) {
                        setNestedField('symptomatikKontext.beginnUndDauer', `${val}.`);
                      }
                    }}
                    placeholder="z.B. Die Symptomatik habe vor etwa 6 Monaten begonnen..."
                    rows={4}
                    className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
                  />
                </div>

                {/* Verlauf der aktuellen Symptomatik */}
                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-2">
                    Verlauf der aktuellen Symptomatik
                  </h4>
                  <textarea
                    value={formData.symptomatikKontext.verlauf}
                    onChange={(e) => setNestedField('symptomatikKontext.verlauf', e.target.value)}
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      if (val && !/[.!?]$/.test(val)) {
                        setNestedField('symptomatikKontext.verlauf', `${val}.`);
                      }
                    }}
                    placeholder="z.B. Seit Symptombeginn zeige sich eine zunehmende Verschlechterung..."
                    rows={4}
                    className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
                  />
                </div>

                {/* Auslöser für die aktuelle Symptomatik */}
                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-2">
                    Auslöser für die aktuelle Symptomatik
                  </h4>
                  <textarea
                    value={formData.symptomatikKontext.ausloeser}
                    onChange={(e) => setNestedField('symptomatikKontext.ausloeser', e.target.value)}
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      if (val && !/[.!?]$/.test(val)) {
                        setNestedField('symptomatikKontext.ausloeser', `${val}.`);
                      }
                    }}
                    placeholder="z.B. Als Auslöser werde eine Trennung vom Partner genannt..."
                    rows={4}
                    className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
                  />
                </div>
              </div>
            )}

            {/* Substep 4: AMDP Befund / Psychischer Befund */}
            {currentSubStep === 4 && (
              <AMDPSubstep
                formData={formData}
                befundHandlers={befundHandlers}
                setNestedField={setNestedField}
              />
            )}

            {/* Substep 5: Testdiagnostik */}
            {currentSubStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-primary">Testdiagnostische Verfahren</h3>

                {/* Search and Add Section */}
                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Test hinzufügen
                    </label>
                    <input
                      type="text"
                      value={testSearchQuery}
                      onChange={(e) => setTestSearchQuery(e.target.value)}
                      placeholder="Test suchen (z.B. BDI-II, GAD-7, PCL-5...)"
                      className="w-full p-3 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-surface-primary"
                    />

                    {/* Search Results Dropdown */}
                    {testSearchQuery.length >= 2 && testSearchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {testSearchResults.map((test) => (
                          <button
                            key={test.abbreviation}
                            onClick={() => handleSelectTest(test)}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
                          >
                            <span className="font-semibold text-blue-600">{test.abbreviation}</span>
                            <span className="text-gray-600 text-sm ml-2">({test.name})</span>
                            <span className="text-gray-400 text-xs ml-2">– {test.category}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {testSearchQuery.length >= 2 && testSearchResults.length === 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
                        Keine Tests gefunden
                      </div>
                    )}
                  </div>

                  {/* Show All Button */}
                  <button
                    onClick={() => setIsTestListViewOpen(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                  >
                    Alle anzeigen →
                  </button>
                </div>

                {/* Selected Tests */}
                {formData.testdiagnostik.selectedTests.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-text-secondary">
                      Ausgewählte Tests ({formData.testdiagnostik.selectedTests.length})
                    </h4>
                    <div className="space-y-3">
                      {formData.testdiagnostik.selectedTests.map((test, index) => (
                        <SelectedTestCard
                          key={`${test.abbreviation}-${index}`}
                          test={test}
                          index={index}
                          onRemove={() => testdiagnostikHandlers.removeTest(index)}
                          onUpdate={(field, value) => testdiagnostikHandlers.updateTest(index, field, value)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {formData.testdiagnostik.selectedTests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Noch keine Tests hinzugefügt.</p>
                    <p className="text-sm mt-1">Suchen Sie nach einem Test oder klicken Sie auf &quot;Alle anzeigen&quot;.</p>
                  </div>
                )}
              </div>
            )}

            {/* TestVerfahren List View Modal */}
            {isTestListViewOpen && (
              <TestVerfahrenListView
                onSelectTest={handleSelectTest}
                onClose={() => setIsTestListViewOpen(false)}
              />
            )}
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

      {/* Modal for Verhaltensexzesse */}
      <VerhaltensexzesseModal
        isOpen={isVerhaltensexzesseModalOpen}
        onClose={() => setIsVerhaltensexzesseModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Verhaltensdefizite */}
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
