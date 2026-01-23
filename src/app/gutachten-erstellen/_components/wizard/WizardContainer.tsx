import { ArrayHandlers, BefundHandlers, DiagnosisHandlers, SomatischerBefundHandlers, SymptomHandlers, TestdiagnostikHandlers, LebensgeschichteHandlers, FunktionalesBedingungsmodellHandlers, MakroanalyseHandlers, Kapitel6Handlers } from '@/hooks/useGutachtenForm';
import * as FormTypes from '@/lib/core/form-types';
import { SHOW_DEV_BANNER } from '@/lib/constants';
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
  onStepChange: (step: number) => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
  submitForm: () => void;
  setStep3SubStep: (substep: number) => void;
  setStep4SubStep: (substep: number) => void;
  setStep5SubStep: (substep: number) => void;
  setStep7SubStep: (substep: number) => void;
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
  toggleSectionExpansion,
  onStepChange,
  onNextStep,
  onPreviousStep,
  submitForm,
  setStep3SubStep,
  setStep4SubStep,
  setStep5SubStep,
  setStep7SubStep,
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
        // Symptomatik - always valid (no completion tracking)
        return true;
      case 4:
        // Somatischer Befund - always valid (no completion tracking)
        return true;
      case 5:
        // Kapitel 4 - always valid (no completion tracking)
        return true;
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

  // Helper to check if a step has substeps
  const stepsWithSubsteps = [3, 4, 5, 7];
  const hasSubsteps = (step: number) => stepsWithSubsteps.includes(step);
  const getSubstepCount = (step: number) => {
    if (step === 5) return 7;  // Step 5 has 7 substeps
    if (step === 7) return 4;  // Step 7 has 4 substeps
    return 5;  // Steps 3 and 4 have 5 substeps
  };

  // Get current substep for the current step
  const getCurrentSubStep = (): number => {
    switch (wizardState.currentStep) {
      case 3: return wizardState.step3CurrentSubStep;
      case 4: return wizardState.step4CurrentSubStep;
      case 5: return wizardState.step5CurrentSubStep;
      case 7: return wizardState.step7CurrentSubStep;
      default: return 1;
    }
  };

  // Set substep for a given step
  const setSubStepForStep = (step: number, substep: number) => {
    switch (step) {
      case 3: setStep3SubStep(substep); break;
      case 4: setStep4SubStep(substep); break;
      case 5: setStep5SubStep(substep); break;
      case 7: setStep7SubStep(substep); break;
    }
  };

  const handleNextStep = () => {
    if (!canProceed) return;

    const currentStep = wizardState.currentStep;
    const currentSubStep = getCurrentSubStep();

    // If on a step with substeps and not on the last substep, go to next substep
    if (hasSubsteps(currentStep) && currentSubStep < getSubstepCount(currentStep)) {
      setSubStepForStep(currentStep, currentSubStep + 1);
    } else {
      // Go to next main step (and reset its substep to 1 if it has substeps)
      onNextStep();
      const nextStep = currentStep + 1;
      if (hasSubsteps(nextStep)) {
        setSubStepForStep(nextStep, 1);
      }
    }
  };

  const handlePreviousStep = () => {
    const currentStep = wizardState.currentStep;
    const currentSubStep = getCurrentSubStep();

    // If on a step with substeps and not on the first substep, go to previous substep
    if (hasSubsteps(currentStep) && currentSubStep > 1) {
      setSubStepForStep(currentStep, currentSubStep - 1);
    } else {
      // Go to previous main step
      const prevStep = currentStep - 1;
      if (prevStep >= 1) {
        onPreviousStep();
        // If previous step has substeps, go to its last substep
        if (hasSubsteps(prevStep)) {
          setSubStepForStep(prevStep, getSubstepCount(prevStep));
        }
      }
    }
  };

  const handleStepClick = (step: number) => {
    onStepChange(step);
  };

  return (
    <div className={`fixed inset-0 ${SHOW_DEV_BANNER ? 'top-[104px]' : 'top-[64px]'} flex flex-col bg-surface-secondary overflow-hidden`}>
      {/* Progress Stepper at top */}
      <ProgressStepper
        currentStep={wizardState.currentStep}
        completedSteps={wizardState.completedSteps}
        visitedSteps={wizardState.visitedSteps}
        onStepClick={handleStepClick}
      />

      {/* Main Content Area - Two Column Layout (fills viewport, no main scroll) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left/Main Column - Wizard Content (independently scrollable) */}
        <div className="flex flex-col overflow-hidden flex-1 md:flex-[0_0_55%] border-r border-border-primary">
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
            symptomHandlers={symptomHandlers}
            befundHandlers={befundHandlers}
            arrayHandlers={arrayHandlers}
            diagnosisHandlers={diagnosisHandlers}
            testdiagnostikHandlers={testdiagnostikHandlers}
            somatischerBefundHandlers={somatischerBefundHandlers}
            lebensgeschichteHandlers={lebensgeschichteHandlers}
            funktionalesBedingungsmodellHandlers={funktionalesBedingungsmodellHandlers}
            makroanalyseHandlers={makroanalyseHandlers}
            kapitel6Handlers={kapitel6Handlers}
            toggleSectionExpansion={toggleSectionExpansion}
            setStep3SubStep={setStep3SubStep}
            setStep4SubStep={setStep4SubStep}
            setStep5SubStep={setStep5SubStep}
            setStep7SubStep={setStep7SubStep}
            onNextStep={handleNextStep}
            onPreviousStep={handlePreviousStep}
            submitForm={submitForm}
            canProceed={canProceed}
            isLastStep={isLastStep}
          />
        </div>

        {/* Right Column - Live Preview */}
        <div className="flex-1 md:flex-[0_0_45%] flex flex-col overflow-hidden">
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
