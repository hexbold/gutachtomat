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
  TraumafolgesymptomatikModal,
  PsychotischeSymptomatikModal,
  OrganischeSymptomatikModal,
  SomatoformeSymptomatikModal,
  SchlafstoerungsModal,
  EssstoerungenModal,
  SubstanzbezogeneModal,
  DissociativeModal,
  PersoenlichkeitsstoerungenModal,
  ImpulskontrollstoerungenModal,
  SexuellbezogeneSymptomeModal,
  GeschlechtsidentitaetModal,
  HyperkinetischeStoerungenModal,
  TicStoerungenModal,
  SuizidalitaetSymptomatikModal,
  SonstigeSymptomatikModal,
} from '../../shared/symptomatik-modals';
import { getFormattedManischeSymptoms } from '@/lib/utils/manische-symptomatik-counter';
import { getFormattedDepressiveSymptoms } from '@/lib/utils/depressive-symptomatik-counter';
import { getFormattedAngstSymptoms } from '@/lib/utils/angstsymptomatik-counter';
import { getFormattedZwangSymptoms } from '@/lib/utils/zwangssymptomatik-counter';
import { getFormattedVerhaltensexzesse, getFormattedVerhaltensdefizite } from '@/lib/utils/verhaltensauffaelligkeiten-counter';
import { getFormattedTraumaSymptoms } from '@/lib/utils/trauma-symptomatik-counter';
import { getFormattedPsychotischeSymptoms } from '@/lib/utils/psychotische-symptomatik-counter';
import { getFormattedOrganischeSymptoms } from '@/lib/utils/organische-symptomatik-counter';
import { getFormattedSomatoformeSymptoms } from '@/lib/utils/somatoforme-symptomatik-counter';
import { getFormattedSchlafstoerungen } from '@/lib/utils/schlafstoerungen-counter';
import { getFormattedEssstoerungen } from '@/lib/utils/essstoerungen-counter';
import { getFormattedSubstanzbezogene } from '@/lib/utils/substanzbezogene-counter';
import { getFormattedDissociative } from '@/lib/utils/dissociative-counter';
import { getFormattedPersoenlichkeitsstoerungen } from '@/lib/utils/persoenlichkeitsstoerungen-counter';
import { getFormattedImpulskontrollstoerungen } from '@/lib/utils/impulskontrollstoerungen-counter';
import { getFormattedSexuellbezogeneSymptome } from '@/lib/utils/sexuellbezogene-counter';
import { getFormattedGeschlechtsidentitaet } from '@/lib/utils/geschlechtsidentitaet-counter';
import { getFormattedHyperkinetischeStoerungen } from '@/lib/utils/hyperkinetische-counter';
import { getFormattedTicStoerungen } from '@/lib/utils/tic-stoerungen-counter';
import { getFormattedSuizidalitaetSymptomatik } from '@/lib/utils/suizidalitaet-symptomatik-counter';
import { getFormattedSonstigeSymptomatik } from '@/lib/utils/sonstige-symptomatik-counter';
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
  const [isTraumaModalOpen, setIsTraumaModalOpen] = useState(false);
  const [isPsychotischeModalOpen, setIsPsychotischeModalOpen] = useState(false);
  const [isOrganischeModalOpen, setIsOrganischeModalOpen] = useState(false);
  const [isSomatoformeModalOpen, setIsSomatoformeModalOpen] = useState(false);
  const [isSchlafstoerungModalOpen, setIsSchlafstoerungModalOpen] = useState(false);
  const [isEssstoerungenModalOpen, setIsEssstoerungenModalOpen] = useState(false);
  const [isSubstanzbezogeneModalOpen, setIsSubstanzbezogeneModalOpen] = useState(false);
  const [isDissociativeModalOpen, setIsDissociativeModalOpen] = useState(false);
  const [isPersoenlichkeitsstoerungModalOpen, setIsPersoenlichkeitsstoerungModalOpen] = useState(false);
  const [isImpulskontrollModalOpen, setIsImpulskontrollModalOpen] = useState(false);
  const [isSexuellbezogeneModalOpen, setIsSexuellbezogeneModalOpen] = useState(false);
  const [isGeschlechtsidentitaetModalOpen, setIsGeschlechtsidentitaetModalOpen] = useState(false);
  const [isHyperkinetischeModalOpen, setIsHyperkinetischeModalOpen] = useState(false);
  const [isTicStoerungenModalOpen, setIsTicStoerungenModalOpen] = useState(false);
  const [isSuizidalitaetModalOpen, setIsSuizidalitaetModalOpen] = useState(false);
  const [isSonstigeModalOpen, setIsSonstigeModalOpen] = useState(false);
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

  // Count selected symptoms for Categories 5-20
  const traumaSelectedCount = getFormattedTraumaSymptoms(formData.traumafolgesymptomatik).length;
  const psychotischeSelectedCount = getFormattedPsychotischeSymptoms(formData.psychotischeSymptomatik).length;
  const organischeSelectedCount = getFormattedOrganischeSymptoms(formData.organischeSymptomatik).length;
  const somatoformeSelectedCount = getFormattedSomatoformeSymptoms(formData.somatoformeSymptomatik).length;
  const schlafstoerungSelectedCount = getFormattedSchlafstoerungen(formData.nichtorganischeSchlafstoerungen).length;
  const essstoerungenSelectedCount = getFormattedEssstoerungen(formData.essstoerungen).length;
  const substanzbezogeneSelectedCount = getFormattedSubstanzbezogene(formData.substanzbezogeneSymptomatik).length;
  const dissociativeSelectedCount = getFormattedDissociative(formData.dissociativeSymptomatik).length;
  const persoenlichkeitsstoerungSelectedCount = getFormattedPersoenlichkeitsstoerungen(formData.persoenlichkeitsstoerungen).length;
  const impulskontrollSelectedCount = getFormattedImpulskontrollstoerungen(formData.impulskontrollstoerungen).length;
  const sexuellbezogeneSelectedCount = getFormattedSexuellbezogeneSymptome(formData.sexuellbezogeneSymptome).length;
  const geschlechtsidentitaetSelectedCount = getFormattedGeschlechtsidentitaet(formData.geschlechtsidentitaet).length;
  const hyperkinetischeSelectedCount = getFormattedHyperkinetischeStoerungen(formData.hyperkinetischeStoerungen).length;
  const ticStoerungenSelectedCount = getFormattedTicStoerungen(formData.ticStoerungen).length;
  const suizidalitaetSelectedCount = getFormattedSuizidalitaetSymptomatik(formData.suizidalitaetSymptomatik).length;
  const sonstigeSelectedCount = getFormattedSonstigeSymptomatik(formData.sonstigeSymptomatik).length;

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

                {/* Button for Traumafolgesymptomatik */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsTraumaModalOpen(true)}
                    className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${
                      traumaSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">Traumafolgesymptomatik</h4>
                        {traumaSelectedCount > 0 && (
                          <p className="text-sm text-text-secondary mt-1">{traumaSelectedCount} Symptom{traumaSelectedCount !== 1 ? 'e' : ''} ausgewählt</p>
                        )}
                      </div>
                      <svg className="w-6 h-6 text-text-quaternary group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                  {traumaSelectedCount > 0 && (
                    <button onClick={() => { if (!window.confirm(`Möchten Sie wirklich alle ${traumaSelectedCount} ausgewählten Symptome löschen?`)) return; symptomHandlers.clearTraumafolgesymptomatik(); }} className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group">
                      <svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">Auswahl löschen</span>
                    </button>
                  )}
                </div>

                {/* Button for Psychotische Symptomatik */}
                <div className="flex gap-2">
                  <button onClick={() => setIsPsychotischeModalOpen(true)} className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${psychotischeSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">Psychotische Symptomatik</h4>
                        {psychotischeSelectedCount > 0 && (<p className="text-sm text-text-secondary mt-1">{psychotischeSelectedCount} Symptom{psychotischeSelectedCount !== 1 ? 'e' : ''} ausgewählt</p>)}
                      </div>
                      <svg className="w-6 h-6 text-text-quaternary group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                  {psychotischeSelectedCount > 0 && (<button onClick={() => { if (!window.confirm(`Möchten Sie wirklich alle ${psychotischeSelectedCount} ausgewählten Symptome löschen?`)) return; symptomHandlers.clearPsychotischeSymptomatik(); }} className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"><svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">Auswahl löschen</span></button>)}
                </div>

                {/* Button for Organische Symptomatik */}
                <div className="flex gap-2">
                  <button onClick={() => setIsOrganischeModalOpen(true)} className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${organischeSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">Organische Symptomatik</h4>
                        {organischeSelectedCount > 0 && (<p className="text-sm text-text-secondary mt-1">{organischeSelectedCount} Symptom{organischeSelectedCount !== 1 ? 'e' : ''} ausgewählt</p>)}
                      </div>
                      <svg className="w-6 h-6 text-text-quaternary group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                  {organischeSelectedCount > 0 && (<button onClick={() => { if (!window.confirm(`Möchten Sie wirklich alle ${organischeSelectedCount} ausgewählten Symptome löschen?`)) return; symptomHandlers.clearOrganischeSymptomatik(); }} className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"><svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">Auswahl löschen</span></button>)}
                </div>

                {/* Button for Somatoforme Symptomatik */}
                <div className="flex gap-2">
                  <button onClick={() => setIsSomatoformeModalOpen(true)} className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${somatoformeSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">Somatoforme Symptomatik</h4>
                        {somatoformeSelectedCount > 0 && (<p className="text-sm text-text-secondary mt-1">{somatoformeSelectedCount} Symptom{somatoformeSelectedCount !== 1 ? 'e' : ''} ausgewählt</p>)}
                      </div>
                      <svg className="w-6 h-6 text-text-quaternary group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                  {somatoformeSelectedCount > 0 && (<button onClick={() => { if (!window.confirm(`Möchten Sie wirklich alle ${somatoformeSelectedCount} ausgewählten Symptome löschen?`)) return; symptomHandlers.clearSomatoformeSymptomatik(); }} className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"><svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">Auswahl löschen</span></button>)}
                </div>

                {/* Button for Schlafstörungen */}
                <div className="flex gap-2">
                  <button onClick={() => setIsSchlafstoerungModalOpen(true)} className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${schlafstoerungSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">Schlafstörungen</h4>
                        {schlafstoerungSelectedCount > 0 && (<p className="text-sm text-text-secondary mt-1">{schlafstoerungSelectedCount} Symptom{schlafstoerungSelectedCount !== 1 ? 'e' : ''} ausgewählt</p>)}
                      </div>
                      <svg className="w-6 h-6 text-text-quaternary group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                  {schlafstoerungSelectedCount > 0 && (<button onClick={() => { if (!window.confirm(`Möchten Sie wirklich alle ${schlafstoerungSelectedCount} ausgewählten Symptome löschen?`)) return; symptomHandlers.clearNichtorganischeSchlafstoerungen(); }} className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"><svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">Auswahl löschen</span></button>)}
                </div>

                {/* Button for Essstörungen */}
                <div className="flex gap-2">
                  <button onClick={() => setIsEssstoerungenModalOpen(true)} className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${essstoerungenSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">Essstörungen</h4>
                        {essstoerungenSelectedCount > 0 && (<p className="text-sm text-text-secondary mt-1">{essstoerungenSelectedCount} Symptom{essstoerungenSelectedCount !== 1 ? 'e' : ''} ausgewählt</p>)}
                      </div>
                      <svg className="w-6 h-6 text-text-quaternary group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                  {essstoerungenSelectedCount > 0 && (<button onClick={() => { if (!window.confirm(`Möchten Sie wirklich alle ${essstoerungenSelectedCount} ausgewählten Symptome löschen?`)) return; symptomHandlers.clearEssstoerungen(); }} className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"><svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">Auswahl löschen</span></button>)}
                </div>

                {/* Button for Substanzbezogene Symptomatik */}
                <div className="flex gap-2">
                  <button onClick={() => setIsSubstanzbezogeneModalOpen(true)} className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${substanzbezogeneSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">Substanzbezogene Symptomatik</h4>
                        {substanzbezogeneSelectedCount > 0 && (<p className="text-sm text-text-secondary mt-1">{substanzbezogeneSelectedCount} Symptom{substanzbezogeneSelectedCount !== 1 ? 'e' : ''} ausgewählt</p>)}
                      </div>
                      <svg className="w-6 h-6 text-text-quaternary group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                  {substanzbezogeneSelectedCount > 0 && (<button onClick={() => { if (!window.confirm(`Möchten Sie wirklich alle ${substanzbezogeneSelectedCount} ausgewählten Symptome löschen?`)) return; symptomHandlers.clearSubstanzbezogeneSymptomatik(); }} className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"><svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">Auswahl löschen</span></button>)}
                </div>

                {/* Button for Dissoziative Symptomatik */}
                <div className="flex gap-2">
                  <button onClick={() => setIsDissociativeModalOpen(true)} className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${dissociativeSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">Dissoziative Symptomatik</h4>
                        {dissociativeSelectedCount > 0 && (<p className="text-sm text-text-secondary mt-1">{dissociativeSelectedCount} Symptom{dissociativeSelectedCount !== 1 ? 'e' : ''} ausgewählt</p>)}
                      </div>
                      <svg className="w-6 h-6 text-text-quaternary group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                  {dissociativeSelectedCount > 0 && (<button onClick={() => { if (!window.confirm(`Möchten Sie wirklich alle ${dissociativeSelectedCount} ausgewählten Symptome löschen?`)) return; symptomHandlers.clearDissociativeSymptomatik(); }} className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"><svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">Auswahl löschen</span></button>)}
                </div>

                {/* Button for Persönlichkeitsstörungen */}
                <div className="flex gap-2">
                  <button onClick={() => setIsPersoenlichkeitsstoerungModalOpen(true)} className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${persoenlichkeitsstoerungSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">Persönlichkeitsstörungen</h4>
                        {persoenlichkeitsstoerungSelectedCount > 0 && (<p className="text-sm text-text-secondary mt-1">{persoenlichkeitsstoerungSelectedCount} Symptom{persoenlichkeitsstoerungSelectedCount !== 1 ? 'e' : ''} ausgewählt</p>)}
                      </div>
                      <svg className="w-6 h-6 text-text-quaternary group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                  {persoenlichkeitsstoerungSelectedCount > 0 && (<button onClick={() => { if (!window.confirm(`Möchten Sie wirklich alle ${persoenlichkeitsstoerungSelectedCount} ausgewählten Symptome löschen?`)) return; symptomHandlers.clearPersoenlichkeitsstoerungen(); }} className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"><svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">Auswahl löschen</span></button>)}
                </div>

                {/* Button for Impulskontrollstörungen */}
                <div className="flex gap-2">
                  <button onClick={() => setIsImpulskontrollModalOpen(true)} className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${impulskontrollSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">Impulskontrollstörungen</h4>
                        {impulskontrollSelectedCount > 0 && (<p className="text-sm text-text-secondary mt-1">{impulskontrollSelectedCount} Symptom{impulskontrollSelectedCount !== 1 ? 'e' : ''} ausgewählt</p>)}
                      </div>
                      <svg className="w-6 h-6 text-text-quaternary group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                  {impulskontrollSelectedCount > 0 && (<button onClick={() => { if (!window.confirm(`Möchten Sie wirklich alle ${impulskontrollSelectedCount} ausgewählten Symptome löschen?`)) return; symptomHandlers.clearImpulskontrollstoerungen(); }} className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"><svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">Auswahl löschen</span></button>)}
                </div>

                {/* Button for Sexuellbezogene Symptome */}
                <div className="flex gap-2">
                  <button onClick={() => setIsSexuellbezogeneModalOpen(true)} className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${sexuellbezogeneSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">Sexuellbezogene Symptome</h4>
                        {sexuellbezogeneSelectedCount > 0 && (<p className="text-sm text-text-secondary mt-1">{sexuellbezogeneSelectedCount} Symptom{sexuellbezogeneSelectedCount !== 1 ? 'e' : ''} ausgewählt</p>)}
                      </div>
                      <svg className="w-6 h-6 text-text-quaternary group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                  {sexuellbezogeneSelectedCount > 0 && (<button onClick={() => { if (!window.confirm(`Möchten Sie wirklich alle ${sexuellbezogeneSelectedCount} ausgewählten Symptome löschen?`)) return; symptomHandlers.clearSexuellbezogeneSymptome(); }} className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"><svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">Auswahl löschen</span></button>)}
                </div>

                {/* Button for Geschlechtsidentität */}
                <div className="flex gap-2">
                  <button onClick={() => setIsGeschlechtsidentitaetModalOpen(true)} className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${geschlechtsidentitaetSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">Geschlechtsidentität</h4>
                        {geschlechtsidentitaetSelectedCount > 0 && (<p className="text-sm text-text-secondary mt-1">{geschlechtsidentitaetSelectedCount} Symptom{geschlechtsidentitaetSelectedCount !== 1 ? 'e' : ''} ausgewählt</p>)}
                      </div>
                      <svg className="w-6 h-6 text-text-quaternary group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                  {geschlechtsidentitaetSelectedCount > 0 && (<button onClick={() => { if (!window.confirm(`Möchten Sie wirklich alle ${geschlechtsidentitaetSelectedCount} ausgewählten Symptome löschen?`)) return; symptomHandlers.clearGeschlechtsidentitaet(); }} className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"><svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">Auswahl löschen</span></button>)}
                </div>

                {/* Button for Hyperkinetische Störungen */}
                <div className="flex gap-2">
                  <button onClick={() => setIsHyperkinetischeModalOpen(true)} className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${hyperkinetischeSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">Hyperkinetische Störungen</h4>
                        {hyperkinetischeSelectedCount > 0 && (<p className="text-sm text-text-secondary mt-1">{hyperkinetischeSelectedCount} Symptom{hyperkinetischeSelectedCount !== 1 ? 'e' : ''} ausgewählt</p>)}
                      </div>
                      <svg className="w-6 h-6 text-text-quaternary group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                  {hyperkinetischeSelectedCount > 0 && (<button onClick={() => { if (!window.confirm(`Möchten Sie wirklich alle ${hyperkinetischeSelectedCount} ausgewählten Symptome löschen?`)) return; symptomHandlers.clearHyperkinetischeStoerungen(); }} className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"><svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">Auswahl löschen</span></button>)}
                </div>

                {/* Button for Tic-Störungen */}
                <div className="flex gap-2">
                  <button onClick={() => setIsTicStoerungenModalOpen(true)} className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${ticStoerungenSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">Tic-Störungen</h4>
                        {ticStoerungenSelectedCount > 0 && (<p className="text-sm text-text-secondary mt-1">{ticStoerungenSelectedCount} Symptom{ticStoerungenSelectedCount !== 1 ? 'e' : ''} ausgewählt</p>)}
                      </div>
                      <svg className="w-6 h-6 text-text-quaternary group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                  {ticStoerungenSelectedCount > 0 && (<button onClick={() => { if (!window.confirm(`Möchten Sie wirklich alle ${ticStoerungenSelectedCount} ausgewählten Symptome löschen?`)) return; symptomHandlers.clearTicStoerungen(); }} className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"><svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">Auswahl löschen</span></button>)}
                </div>

                {/* Button for Suizidalität */}
                <div className="flex gap-2">
                  <button onClick={() => setIsSuizidalitaetModalOpen(true)} className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${suizidalitaetSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">Suizidalität</h4>
                        {suizidalitaetSelectedCount > 0 && (<p className="text-sm text-text-secondary mt-1">{suizidalitaetSelectedCount} Symptom{suizidalitaetSelectedCount !== 1 ? 'e' : ''} ausgewählt</p>)}
                      </div>
                      <svg className="w-6 h-6 text-text-quaternary group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                  {suizidalitaetSelectedCount > 0 && (<button onClick={() => { if (!window.confirm(`Möchten Sie wirklich alle ${suizidalitaetSelectedCount} ausgewählten Symptome löschen?`)) return; symptomHandlers.clearSuizidalitaetSymptomatik(); }} className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"><svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">Auswahl löschen</span></button>)}
                </div>

                {/* Button for Sonstige Symptomatik */}
                <div className="flex gap-2">
                  <button onClick={() => setIsSonstigeModalOpen(true)} className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${sonstigeSelectedCount > 0 ? 'border-blue-500' : 'border-border-primary'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">Sonstige Symptomatik</h4>
                        {sonstigeSelectedCount > 0 && (<p className="text-sm text-text-secondary mt-1">{sonstigeSelectedCount} Symptom{sonstigeSelectedCount !== 1 ? 'e' : ''} ausgewählt</p>)}
                      </div>
                      <svg className="w-6 h-6 text-text-quaternary group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </button>
                  {sonstigeSelectedCount > 0 && (<button onClick={() => { if (!window.confirm(`Möchten Sie wirklich alle ${sonstigeSelectedCount} ausgewählten Symptome löschen?`)) return; symptomHandlers.clearSonstigeSymptomatik(); }} className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"><svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">Auswahl löschen</span></button>)}
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

      {/* Modal for Traumafolgesymptomatik */}
      <TraumafolgesymptomatikModal
        isOpen={isTraumaModalOpen}
        onClose={() => setIsTraumaModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Psychotische Symptomatik */}
      <PsychotischeSymptomatikModal
        isOpen={isPsychotischeModalOpen}
        onClose={() => setIsPsychotischeModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Organische Symptomatik */}
      <OrganischeSymptomatikModal
        isOpen={isOrganischeModalOpen}
        onClose={() => setIsOrganischeModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Somatoforme Symptomatik */}
      <SomatoformeSymptomatikModal
        isOpen={isSomatoformeModalOpen}
        onClose={() => setIsSomatoformeModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Schlafstörungen */}
      <SchlafstoerungsModal
        isOpen={isSchlafstoerungModalOpen}
        onClose={() => setIsSchlafstoerungModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Essstörungen */}
      <EssstoerungenModal
        isOpen={isEssstoerungenModalOpen}
        onClose={() => setIsEssstoerungenModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Substanzbezogene Symptomatik */}
      <SubstanzbezogeneModal
        isOpen={isSubstanzbezogeneModalOpen}
        onClose={() => setIsSubstanzbezogeneModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Dissoziative Symptomatik */}
      <DissociativeModal
        isOpen={isDissociativeModalOpen}
        onClose={() => setIsDissociativeModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Persönlichkeitsstörungen */}
      <PersoenlichkeitsstoerungenModal
        isOpen={isPersoenlichkeitsstoerungModalOpen}
        onClose={() => setIsPersoenlichkeitsstoerungModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Impulskontrollstörungen */}
      <ImpulskontrollstoerungenModal
        isOpen={isImpulskontrollModalOpen}
        onClose={() => setIsImpulskontrollModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Sexuellbezogene Symptome */}
      <SexuellbezogeneSymptomeModal
        isOpen={isSexuellbezogeneModalOpen}
        onClose={() => setIsSexuellbezogeneModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Geschlechtsidentität */}
      <GeschlechtsidentitaetModal
        isOpen={isGeschlechtsidentitaetModalOpen}
        onClose={() => setIsGeschlechtsidentitaetModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Hyperkinetische Störungen */}
      <HyperkinetischeStoerungenModal
        isOpen={isHyperkinetischeModalOpen}
        onClose={() => setIsHyperkinetischeModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Tic-Störungen */}
      <TicStoerungenModal
        isOpen={isTicStoerungenModalOpen}
        onClose={() => setIsTicStoerungenModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Suizidalität */}
      <SuizidalitaetSymptomatikModal
        isOpen={isSuizidalitaetModalOpen}
        onClose={() => setIsSuizidalitaetModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />

      {/* Modal for Sonstige Symptomatik */}
      <SonstigeSymptomatikModal
        isOpen={isSonstigeModalOpen}
        onClose={() => setIsSonstigeModalOpen(false)}
        formData={formData}
        symptomHandlers={symptomHandlers}
        setNestedField={setNestedField}
      />
    </div>
  );
}
