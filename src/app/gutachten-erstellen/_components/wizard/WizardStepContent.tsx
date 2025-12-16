import * as FormTypes from '@/lib/core/form-types';
import { SymptomHandlers, A4Handlers, A5Handlers, BefundHandlers, ArrayHandlers, DiagnosisHandlers } from '@/hooks/useGutachtenForm';
import { WizardStep1 } from './steps/WizardStep1';
import { WizardStep2 } from './steps/WizardStep2';
import { WizardStep3 } from './steps/WizardStep3';
import { WizardStep4 } from './steps/WizardStep4';
import { WizardStep5 } from './steps/WizardStep5';
import { WizardStep6 } from './steps/WizardStep6';
import { WizardStep7 } from './steps/WizardStep7';

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
  addIllegaleDroge: () => void;
  removeIllegaleDroge: (id: string) => void;
  updateIllegaleDroge: (id: string, field: 'suchtmittel' | 'menge' | 'mengeEinheit' | 'haeufigkeit', value: string) => void;
  symptomHandlers: SymptomHandlers;
  a4Handlers: A4Handlers;
  a5Handlers: A5Handlers;
  befundHandlers: BefundHandlers;
  arrayHandlers: ArrayHandlers;
  diagnosisHandlers: DiagnosisHandlers;
  toggleSectionExpansion: (section: keyof FormTypes.SectionExpansionState) => void;
  confirmStep3Substep: (substep: number) => void;
  completeStep3Substep: (substep: number) => void;
  confirmAmdpPage: (page: number) => void;
  completeAmdpPage: (page: number) => void;
  confirmStep4Substep: (substep: number) => void;
  completeStep4Substep: (substep: number) => void;
  confirmStep5Substep: (substep: number) => void;
  completeStep5Substep: (substep: number) => void;
  // Navigation props
  onNextStep: () => void;
  onPreviousStep: () => void;
  submitForm: () => void;
  canProceed: boolean;
  isLastStep: boolean;
}

const STEP_CONFIG = [
  {
    number: 1,
    title: 'Basisdaten',
    icon: '📄',
    description: 'Erfassen Sie die grundlegenden Patientendaten und Angaben zum Antrag',
    estimatedTime: '5-10 Minuten',
  },
  {
    number: 2,
    title: 'Soziodemographische Daten',
    icon: '🏠',
    description: 'Dokumentieren Sie die soziodemographischen Merkmale des Patienten',
    estimatedTime: '5-10 Minuten',
  },
  {
    number: 3,
    title: 'Symptomatik',
    icon: '📋',
    description: 'Erfassen Sie Symptomatik, psychopathologischen Befund und Testdiagnostik',
    estimatedTime: '15-20 Minuten',
  },
  {
    number: 4,
    title: 'Somatischer Befund und Konsiliarbericht',
    icon: '🏥',
    description: 'Dokumentieren Sie den körperlichen Befund und Substanzkonsum',
    estimatedTime: '10-15 Minuten',
  },
  {
    number: 5,
    title: 'Behandlungsrelevante Angaben',
    icon: '📝',
    description: 'Weitere relevante Informationen',
    estimatedTime: '10-15 Minuten',
  },
  {
    number: 6,
    title: 'Diagnosen nach ICD-10',
    icon: '🎯',
    description: 'Wählen Sie die relevanten ICD-10 Diagnosen aus',
    estimatedTime: '5-10 Minuten',
  },
  {
    number: 7,
    title: 'Behandlungsplan, Therapieziele und Prognose',
    icon: '📋',
    description: 'Erfassen Sie die therapiebezogenen Antragsinformationen',
    estimatedTime: '2-5 Minuten',
  },
  {
    number: 8,
    title: 'Überprüfung & Generierung',
    icon: '✅',
    description: 'Überprüfen Sie Ihre Eingaben und generieren Sie das Gutachten',
    estimatedTime: '5 Minuten',
  },
];

export function WizardStepContent({
  step,
  formData,
  submission,
  expansionState,
  wizardState,
  updateField,
  updateAlter,
  setKinder,
  setWohnsituation,
  setNestedField,
  setNestedBoolean,
  addIllegaleDroge,
  removeIllegaleDroge,
  updateIllegaleDroge,
  symptomHandlers,
  a4Handlers,
  a5Handlers,
  befundHandlers,
  arrayHandlers,
  diagnosisHandlers,
  toggleSectionExpansion,
  confirmStep3Substep,
  completeStep3Substep,
  confirmAmdpPage,
  completeAmdpPage,
  confirmStep4Substep,
  completeStep4Substep,
  confirmStep5Substep,
  completeStep5Substep,
  onNextStep,
  onPreviousStep,
  submitForm,
  canProceed,
  isLastStep,
}: WizardStepContentProps) {
  const config = STEP_CONFIG[step - 1];
  const isFirstStep = step === 1;

  return (
    <div className="h-full flex flex-col">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6">
          {/* Step Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-blue-600 mb-1">
              {config.title}
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
            a4Handlers={a4Handlers}
            a5Handlers={a5Handlers}
            befundHandlers={befundHandlers}
            setNestedField={setNestedField}
            confirmedSubSteps={wizardState.step3ConfirmedSubSteps}
            completedSubSteps={wizardState.step3CompletedSubSteps}
            onConfirmSubStep={confirmStep3Substep}
            onCompleteSubStep={completeStep3Substep}
            amdpConfirmedPages={wizardState.amdpConfirmedPages}
            amdpCompletedPages={wizardState.amdpCompletedPages}
            onConfirmAmdpPage={confirmAmdpPage}
            onCompleteAmdpPage={completeAmdpPage}
          />
        )}

        {step === 4 && (
          <WizardStep4
            formData={formData}
            setNestedField={setNestedField}
            setNestedBoolean={setNestedBoolean}
            arrayHandlers={arrayHandlers}
            addIllegaleDroge={addIllegaleDroge}
            removeIllegaleDroge={removeIllegaleDroge}
            updateIllegaleDroge={updateIllegaleDroge}
            confirmedSubSteps={wizardState.step4ConfirmedSubSteps}
            completedSubSteps={wizardState.step4CompletedSubSteps}
            onConfirmSubStep={confirmStep4Substep}
            onCompleteSubStep={completeStep4Substep}
          />
        )}

        {step === 5 && (
          <WizardStep5
            formData={formData}
            setNestedField={setNestedField}
            arrayHandlers={arrayHandlers}
            confirmedSubSteps={wizardState.step5ConfirmedSubSteps}
            completedSubSteps={wizardState.step5CompletedSubSteps}
            onConfirmSubStep={confirmStep5Substep}
            onCompleteSubStep={completeStep5Substep}
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
            onFieldChange={updateField}
          />
        )}

        {step === 8 && (
          <div>
            {/* Empty state - no result yet */}
            {!submission.result && !submission.isLoading && !submission.error && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-4xl">📄</span>
                </div>
                <h3 className="text-xl font-semibold text-text-secondary mb-2">
                  Bereit zur Generierung
                </h3>
                <p className="text-text-tertiary mb-4">
                  Klicken Sie auf &quot;Gutachten erstellen&quot;, um Ihr vollständiges Gutachten zu generieren.
                </p>
                <div className="max-w-md mx-auto text-left bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-text-secondary">
                  <p className="font-medium mb-2">✓ Alle Daten erfasst:</p>
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
                  <span className="text-4xl">⏳</span>
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
                      <span className="text-red-600 text-xl">⚠️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-red-900 mb-1">Fehler bei der Generierung</h3>
                      <p className="text-red-700">{submission.error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success state - show result */}
            {submission.result && !submission.isLoading && (
              <div className="py-6">
                <div className="mb-6 flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-text-primary">
                    Gutachten erfolgreich erstellt
                  </h3>
                </div>

                {/* Result display */}
                <div className="bg-surface-primary border-2 border-green-200 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-lg font-medium text-text-secondary">Generiertes Gutachten</h4>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(submission.result || '');
                        alert('Text in Zwischenablage kopiert!');
                      }}
                      className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      📋 Kopieren
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <div className="text-text-primary leading-relaxed whitespace-pre-line font-serif">
                      {submission.result}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    onClick={() => window.print()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                  >
                    <span>🖨️</span>
                    <span>Drucken</span>
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([submission.result || ''], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Gutachten_${new Date().toISOString().split('T')[0]}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                  >
                    <span>💾</span>
                    <span>Als Datei speichern</span>
                  </button>
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
                  <span className="text-lg">←</span>
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
                    <span className="text-green-600 font-medium">✓</span>
                    <span className="text-green-700 hidden sm:inline">Pflichtfelder ausgefüllt</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-blue-600">ℹ️</span>
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
                  <span className="text-base">{submission.isLoading ? '⏳' : '📄'}</span>
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
                  <span className="text-lg">→</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
