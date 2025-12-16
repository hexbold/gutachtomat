import { A4Handlers, A5Handlers, ArrayHandlers, BefundHandlers, DiagnosisHandlers, SymptomHandlers } from '@/hooks/useGutachtenForm';
import * as FormTypes from '@/lib/core/form-types';
import { LivePreviewPanel } from '../shared/LivePreviewPanel';
import { ProgressStepper } from './ProgressStepper';
import { WizardStepContent } from './WizardStepContent';
import { useEffect } from 'react';

interface WizardContainerProps {
  formData: FormTypes.Form;
  submission: FormTypes.SubmissionState;
  wizardState: FormTypes.WizardState;
  expansionState: FormTypes.SectionExpansionState;
  liveGeneratedText?: FormTypes.GeneratedTextResult;
  updateField: (field: keyof FormTypes.Form, value: string | FormTypes.Patientenchiffre | FormTypes.DatumBerichterstellung) => void;
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
  onStepChange: (step: number) => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
  submitForm: () => void;
  confirmStep3Substep: (substep: number) => void;
  completeStep3Substep: (substep: number) => void;
  confirmAmdpPage: (page: number) => void;
  completeAmdpPage: (page: number) => void;
  confirmStep4Substep: (substep: number) => void;
  completeStep4Substep: (substep: number) => void;
  confirmStep5Substep: (substep: number) => void;
  completeStep5Substep: (substep: number) => void;
}

export function WizardContainer({
  formData,
  submission,
  wizardState,
  expansionState,
  liveGeneratedText = { structure: { content: [] }, text: '', highlightedSentences: [], highlightTimestamp: null },
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
  onStepChange,
  onNextStep,
  onPreviousStep,
  submitForm,
  confirmStep3Substep,
  completeStep3Substep,
  confirmAmdpPage,
  completeAmdpPage,
  confirmStep4Substep,
  completeStep4Substep,
  confirmStep5Substep,
  completeStep5Substep,
}: WizardContainerProps) {
  // Prevent body scroll when wizard is mounted
  useEffect(() => {
    // Save original overflow style
    const originalOverflow = document.body.style.overflow;
    // Disable body scroll
    document.body.style.overflow = 'hidden';

    // Restore on unmount
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Step validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        // Basisdaten - require all 4 fields: geschlecht, alter, patientenchiffre, datumBerichterstellung
        return !!formData.geschlecht && formData.alter !== null && !!formData.patientenchiffre && !!formData.datumBerichterstellung;
      case 2:
        // Soziodemographie - all optional for now
        return true;
      case 3:
        // Symptomatik - require substeps 1-5 to be completed (substep 6 is optional)
        const requiredSubsteps = [1, 2, 3, 4, 5];
        return requiredSubsteps.every(substep => wizardState.step3CompletedSubSteps.has(substep));
      case 4:
        // Somatischer Befund - require all 5 substeps to be completed
        const requiredStep4Substeps = [1, 2, 3, 4, 5];
        return requiredStep4Substeps.every(substep => wizardState.step4CompletedSubSteps.has(substep));
      case 5:
        // Kapitel 4 - require all 5 substeps to be completed
        const requiredStep5Substeps = [1, 2, 3, 4, 5];
        return requiredStep5Substeps.every(substep => wizardState.step5CompletedSubSteps.has(substep));
      case 6:
        // Diagnosen - require at least one diagnosis
        return formData.kap5Diagnosen.selectedDiagnoses.length > 0;
      case 7:
        // Behandlungsplan - all optional
        return true;
      case 8:
        // Review - always valid
        return true;
      default:
        return true;
    }
  };

  const canProceed = validateStep(wizardState.currentStep);
  const isLastStep = wizardState.currentStep === 8;

  const handleNextStep = () => {
    if (canProceed) {
      onNextStep();
    }
  };

  const handlePreviousStep = () => {
    onPreviousStep();
  };

  const handleStepClick = (step: number) => {
    onStepChange(step);
  };

  return (
    <div className="fixed inset-0 top-[64px] flex flex-col bg-surface-secondary overflow-hidden">
      {/* Progress Stepper at top */}
      <ProgressStepper
        currentStep={wizardState.currentStep}
        completedSteps={wizardState.completedSteps}
        visitedSteps={wizardState.visitedSteps}
        onStepClick={handleStepClick}
      />

      {/* Main Content Area - Two Column Layout (fills viewport, no main scroll) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Wizard Content (independently scrollable) */}
        <div className="flex-1 md:flex-[0_0_55%] flex flex-col border-r border-border-primary">
          <WizardStepContent
            step={wizardState.currentStep}
            formData={formData}
            submission={submission}
            expansionState={expansionState}
            wizardState={wizardState}
            updateField={updateField}
            updateAlter={updateAlter}
            setKinder={setKinder}
            setWohnsituation={setWohnsituation}
            setNestedField={setNestedField}
            setNestedBoolean={setNestedBoolean}
            addIllegaleDroge={addIllegaleDroge}
            removeIllegaleDroge={removeIllegaleDroge}
            updateIllegaleDroge={updateIllegaleDroge}
            symptomHandlers={symptomHandlers}
            a4Handlers={a4Handlers}
            a5Handlers={a5Handlers}
            befundHandlers={befundHandlers}
            arrayHandlers={arrayHandlers}
            diagnosisHandlers={diagnosisHandlers}
            toggleSectionExpansion={toggleSectionExpansion}
            confirmStep3Substep={confirmStep3Substep}
            completeStep3Substep={completeStep3Substep}
            confirmAmdpPage={confirmAmdpPage}
            completeAmdpPage={completeAmdpPage}
            confirmStep4Substep={confirmStep4Substep}
            completeStep4Substep={completeStep4Substep}
            confirmStep5Substep={confirmStep5Substep}
            completeStep5Substep={completeStep5Substep}
            onNextStep={handleNextStep}
            onPreviousStep={handlePreviousStep}
            submitForm={submitForm}
            canProceed={canProceed}
            isLastStep={isLastStep}
          />
        </div>

        {/* Right Column - Live Preview (independently scrollable) */}
        <div className="flex-1 md:flex-[0_0_45%] flex flex-col">
          <LivePreviewPanel
            generatedText={liveGeneratedText}
            geschlecht={formData.geschlecht ?? undefined}
            alter={formData.alter !== null ? formData.alter.toString() : undefined}
            patientenchiffre={formData.patientenchiffre}
            datumBerichterstellung={formData.datumBerichterstellung ?? undefined}
          />
        </div>
      </div>
    </div>
  );
}
