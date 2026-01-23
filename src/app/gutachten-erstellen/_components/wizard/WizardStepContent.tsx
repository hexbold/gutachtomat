import * as FormTypes from '@/lib/core/form-types';
import { SymptomHandlers, BefundHandlers, ArrayHandlers, DiagnosisHandlers, TestdiagnostikHandlers, SomatischerBefundHandlers, LebensgeschichteHandlers, FunktionalesBedingungsmodellHandlers, MakroanalyseHandlers, Kapitel6Handlers } from '@/hooks/useGutachtenForm';
import { WizardStep1 } from './steps/WizardStep1';
import { WizardStep2 } from './steps/WizardStep2';
import { WizardStep3 } from './steps/WizardStep3';
import { WizardStep4 } from './steps/WizardStep4';
import { WizardStep5 } from './steps/WizardStep5';
import { WizardStep6 } from './steps/WizardStep6';
import { WizardStep7 } from './steps/WizardStep7';
import {
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface WizardStepContentProps {
  step: number;
  formData: FormTypes.Form;
  submission: FormTypes.SubmissionState;
  expansionState: FormTypes.SectionExpansionState;
  wizardState: FormTypes.WizardState;
  updateField: (field: keyof FormTypes.Form, value: string | FormTypes.Patientenchiffre) => void;
  updateAlter: (value: FormTypes.Alter) => void;
  setKinder: (value: FormTypes.Kinder) => void;
  setWohnsituation: (value: FormTypes.WohnsituationField) => void;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
  setNestedBoolean: (fieldPath: string, value: boolean) => void;
  symptomHandlers: SymptomHandlers;
  befundHandlers: BefundHandlers;
  arrayHandlers: ArrayHandlers;
  diagnosisHandlers: DiagnosisHandlers;
  testdiagnostikHandlers: TestdiagnostikHandlers;
  somatischerBefundHandlers: SomatischerBefundHandlers;
  lebensgeschichteHandlers: LebensgeschichteHandlers;
  funktionalesBedingungsmodellHandlers: FunktionalesBedingungsmodellHandlers;
  makroanalyseHandlers: MakroanalyseHandlers;
  kapitel6Handlers: Kapitel6Handlers;
  toggleSectionExpansion: (section: keyof FormTypes.SectionExpansionState) => void;
  setStep3SubStep: (substep: number) => void;
  setStep4SubStep: (substep: number) => void;
  setStep5SubStep: (substep: number) => void;
  setStep7SubStep: (substep: number) => void;
  // Navigation props
  onNextStep: () => void;
  onPreviousStep: () => void;
  submitForm: () => void;
  canProceed: boolean;
  isLastStep: boolean;
}

export function WizardStepContent({
  step,
  formData,
  submission,
  wizardState,
  updateField,
  updateAlter,
  setKinder,
  setWohnsituation,
  setNestedField,
  setNestedBoolean,
  symptomHandlers,
  befundHandlers,
  arrayHandlers,
  diagnosisHandlers,
  testdiagnostikHandlers,
  somatischerBefundHandlers,
  lebensgeschichteHandlers,
  funktionalesBedingungsmodellHandlers,
  makroanalyseHandlers,
  kapitel6Handlers,
  setStep3SubStep,
  setStep4SubStep,
  setStep5SubStep,
  setStep7SubStep,
  onNextStep,
  onPreviousStep,
  submitForm,
  canProceed,
  isLastStep,
}: WizardStepContentProps) {
  const isFirstStep = step === 1;

  return (
    <div className="h-full flex flex-col">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6">
          {/* Step Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-blue-600 mb-1">
              {step === 1 && 'Basisdaten'}
              {step === 2 && 'Soziodemographische Daten'}
              {step === 3 && 'Symptomatik und psychischer Befund'}
              {step === 4 && 'Somatischer Befund und Konsiliarbericht'}
              {step === 5 && 'Behandlungsrelevante Angaben'}
              {step === 6 && 'Diagnosen nach ICD-10'}
              {step === 7 && 'Behandlungsplan, Therapieziele und Prognose'}
              {step === 8 && !submission.result && 'Überprüfung & Generierung'}
            </h2>
          </div>

          {/* Step Content */}
          <div>
        {step === 1 && (
          <WizardStep1
            formData={formData}
            onFieldChange={updateField}
            onAlterChange={updateAlter}
          />
        )}

        {step === 2 && (
          <WizardStep2
            formData={formData}
            onFieldChange={updateField}
            setKinder={setKinder}
            setWohnsituation={setWohnsituation}
            setNestedField={setNestedField}
          />
        )}

        {step === 3 && (
          <WizardStep3
            formData={formData}
            onFieldChange={updateField}
            symptomHandlers={symptomHandlers}
            befundHandlers={befundHandlers}
            testdiagnostikHandlers={testdiagnostikHandlers}
            setNestedField={setNestedField}
            currentSubStep={wizardState.step3CurrentSubStep}
            onSubStepChange={setStep3SubStep}
          />
        )}

        {step === 4 && (
          <WizardStep4
            formData={formData}
            setNestedField={setNestedField}
            setNestedBoolean={setNestedBoolean}
            arrayHandlers={arrayHandlers}
            somatischerBefundHandlers={somatischerBefundHandlers}
            currentSubStep={wizardState.step4CurrentSubStep}
            onSubStepChange={setStep4SubStep}
          />
        )}

        {step === 5 && (
          <WizardStep5
            formData={formData}
            setNestedField={setNestedField}
            arrayHandlers={arrayHandlers}
            lebensgeschichteHandlers={lebensgeschichteHandlers}
            funktionalesBedingungsmodellHandlers={funktionalesBedingungsmodellHandlers}
            makroanalyseHandlers={makroanalyseHandlers}
            currentSubStep={wizardState.step5CurrentSubStep}
            onSubStepChange={setStep5SubStep}
          />
        )}

        {step === 6 && (
          <WizardStep6
            formData={formData.kap5Diagnosen}
            onAddDiagnosis={diagnosisHandlers.addDiagnosis}
            onRemoveDiagnosis={diagnosisHandlers.removeDiagnosis}
            onSetSicherheit={diagnosisHandlers.setSicherheit}
          />
        )}

        {step === 7 && (
          <WizardStep7
            formData={formData}
            kapitel6Handlers={kapitel6Handlers}
            setNestedField={setNestedField}
            currentSubStep={wizardState.step7CurrentSubStep}
            onSubStepChange={setStep7SubStep}
          />
        )}

        {step === 8 && (
          <div>
            {/* Empty state - no result yet */}
            {!submission.result && !submission.isLoading && !submission.error && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                  <DocumentTextIcon className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-text-secondary mb-2">
                  Bereit zur Generierung
                </h3>
                <p className="text-text-tertiary mb-4">
                  Klicken Sie auf &quot;Gutachten erstellen&quot;, um Ihr vollständiges Gutachten zu generieren.
                </p>
                <div className="max-w-md mx-auto text-left bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-text-secondary">
                  <p className="font-medium mb-2 flex items-center gap-1.5"><CheckIcon className="w-4 h-4 text-blue-600" /> Alle Daten erfasst:</p>
                  <ul className="space-y-1 text-text-tertiary">
                    <li>• Basisdaten</li>
                    <li>• Soziodemographische Daten</li>
                    <li>• Symptomatik & Befund</li>
                    <li>• Somatischer Befund</li>
                    <li>• Kapitel 4</li>
                    <li>• Diagnosen</li>
                    <li>• Behandlungsplan</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Loading state */}
            {submission.isLoading && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                  <ClockIcon className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  Gutachten wird erstellt...
                </h3>
                <p className="text-text-tertiary">
                  Bitte warten Sie einen Moment
                </p>
              </div>
            )}

            {/* Error state */}
            {submission.error && (
              <div className="py-8">
                <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-red-900 mb-1">Fehler bei der Generierung</h3>
                      <p className="text-red-700">{submission.error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
        </div>
      </div>

      {/* Navigation Bar - Sticky at bottom */}
      <div className="border-t border-border-primary bg-surface-primary">
        <div className="max-w-3xl mx-auto px-6 py-3">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Left: Back button */}
            <div className="flex justify-start">
              {!isFirstStep ? (
                <button
                  onClick={onPreviousStep}
                  className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded font-medium transition-all duration-200 text-text-secondary hover:text-blue-600 hover:bg-hover-surface cursor-pointer"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm">Zurück</span>
                </button>
              ) : null}
            </div>

            {/* Center: Status message for Step 1 or step indicator for others */}
            <div className="flex justify-center">
              {step === 1 ? (
                // Status message for step 1
                formData.geschlecht && formData.alter !== null && formData.patientenchiffre && formData.datumBerichterstellung ? (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 hidden sm:inline">Pflichtfelder ausgefüllt</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <InformationCircleIcon className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700 hidden sm:inline">Alle Felder erforderlich</span>
                  </div>
                )
              ) : (
                // Step indicator for other steps (mobile only)
                <div className="md:hidden text-xs text-text-tertiary font-medium">
                  {step}/8
                </div>
              )}
            </div>

            {/* Right: Next/Submit button */}
            <div className="flex justify-end">
              {isLastStep ? (
                <button
                  onClick={submitForm}
                  disabled={!canProceed || submission.isLoading}
                  className={`
                    flex items-center justify-center space-x-1.5 px-4 py-2 rounded font-semibold text-sm
                    transition-all duration-200
                    ${canProceed && !submission.isLoading
                      ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                      : 'bg-border-secondary text-text-quaternary cursor-not-allowed'
                    }
                  `}
                >
                  {submission.isLoading ? <ClockIcon className="w-5 h-5" /> : <DocumentTextIcon className="w-5 h-5" />}
                  <span className="hidden sm:inline">
                    {submission.isLoading ? 'Erstelle...' : 'Erstellen'}
                  </span>
                </button>
              ) : (
                <button
                  onClick={onNextStep}
                  disabled={!canProceed}
                  className={`
                    flex items-center justify-center space-x-1.5 px-4 py-2 rounded font-medium text-sm
                    transition-all duration-200
                    ${canProceed
                      ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                      : 'bg-border-secondary text-text-quaternary cursor-not-allowed'
                    }
                  `}
                >
                  <span className="hidden sm:inline">Weiter</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
