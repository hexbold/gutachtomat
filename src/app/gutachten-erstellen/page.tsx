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
    befundHandlers,
    arrayHandlers,
    diagnosisHandlers,
    testdiagnostikHandlers,
    toggleSectionExpansion,
    generateRandomData,
    submitForm,
    setWizardStep,
    nextStep,
    previousStep,
    setViewMode,
    setStep3SubStep,
    setStep4SubStep,
    setStep5SubStep,
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
          befundHandlers={befundHandlers}
          arrayHandlers={arrayHandlers}
          diagnosisHandlers={diagnosisHandlers}
          testdiagnostikHandlers={testdiagnostikHandlers}
          toggleSectionExpansion={toggleSectionExpansion}
          onStepChange={setWizardStep}
          onNextStep={nextStep}
          onPreviousStep={previousStep}
          submitForm={submitForm}
          setStep3SubStep={setStep3SubStep}
          setStep4SubStep={setStep4SubStep}
          setStep5SubStep={setStep5SubStep}
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
            befundHandlers={befundHandlers}
            testdiagnostikHandlers={testdiagnostikHandlers}
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