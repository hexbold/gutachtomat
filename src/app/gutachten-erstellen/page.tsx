'use client';

import { useGutachtenForm } from '@/hooks/useGutachtenForm';
import { WizardContainer } from './_components/wizard/WizardContainer';
import { FormContainer } from './_components/form/FormContainer';
import { DevToolsMenu } from './_components/shared/DevToolsMenu';
import { useEffect } from 'react';

export default function GutachtenErstellen() {
  const {
    formData,
    submission,
    expansionState,
    wizardState,
    liveGeneratedText,
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
    generateRandomData,
    submitForm,
    setWizardStep,
    nextStep,
    previousStep,
    setViewMode,
    confirmStep3Substep,
    completeStep3Substep,
    confirmAmdpPage,
    completeAmdpPage,
    confirmStep4Substep,
    completeStep4Substep,
    confirmStep5Substep,
    completeStep5Substep,
    dispatch,
  } = useGutachtenForm();

  // Load view mode from localStorage on mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('gutachten-view-mode');
      if (savedMode === 'wizard' || savedMode === 'form') {
        setViewMode(savedMode);
      }
    } catch (error) {
      console.error('Failed to load view mode:', error);
    }
  }, [setViewMode]);

  return (
    <>
      {/* Fixed Dev Tools Button - Appears in both views */}
      <div className="fixed top-20 right-8 z-[70]">
        <DevToolsMenu
          formData={formData}
          viewMode={wizardState.viewMode}
          generateRandomData={generateRandomData}
          setViewMode={setViewMode}
          dispatch={dispatch}
        />
      </div>

      {/* Wizard mode */}
      {wizardState.viewMode === 'wizard' ? (
        <div className="min-h-screen bg-surface-secondary">
          <WizardContainer
          formData={formData}
          submission={submission}
          wizardState={wizardState}
          expansionState={expansionState}
          liveGeneratedText={liveGeneratedText}
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
          onStepChange={setWizardStep}
          onNextStep={nextStep}
          onPreviousStep={previousStep}
          submitForm={submitForm}
          confirmStep3Substep={confirmStep3Substep}
          completeStep3Substep={completeStep3Substep}
          confirmAmdpPage={confirmAmdpPage}
          completeAmdpPage={completeAmdpPage}
          confirmStep4Substep={confirmStep4Substep}
          completeStep4Substep={completeStep4Substep}
          confirmStep5Substep={confirmStep5Substep}
          completeStep5Substep={completeStep5Substep}
        />
        </div>
      ) : (
        // Form mode (direct form layout)
        <div className="min-h-screen bg-surface-secondary">
          <FormContainer
            formData={formData}
            expansionState={expansionState}
            liveGeneratedText={liveGeneratedText}
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
            submitForm={submitForm}
          />
        </div>
      )}
    </>
  );
}