import { ArrayHandlers, BefundHandlers, DiagnosisHandlers, SomatischerBefundHandlers, SymptomHandlers, TestdiagnostikHandlers } from '@/hooks/useGutachtenForm';
import * as FormTypes from '@/lib/core/form-types';
import { SHOW_DEV_BANNER } from '@/lib/constants';
import { LivePreviewPanel } from '../shared/LivePreviewPanel';
import { useEffect } from 'react';
import { Basisdaten } from './Basisdaten';
import { SociodemographicData } from './SociodemographicData';
import { SymptomatikSection } from './SymptomatikSection';
import { SomatischerBefund } from './SomatischerBefund';
import { Kapitel4 } from './Kapitel4';
import { DiagnosisSelection } from './diagnosen/DiagnosisSelection';
import { GeneralApplicationData } from './GeneralApplicationData';
import { CollapsibleSectionHeader } from './CollapsibleSectionHeader';

interface FormContainerProps {
  formData: FormTypes.Form;
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
  testdiagnostikHandlers: TestdiagnostikHandlers;
  arrayHandlers: ArrayHandlers;
  diagnosisHandlers: DiagnosisHandlers;
  somatischerBefundHandlers: SomatischerBefundHandlers;
  toggleSectionExpansion: (section: keyof FormTypes.SectionExpansionState) => void;
  submitForm: () => void;
}

export function FormContainer({
  formData,
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
  testdiagnostikHandlers,
  arrayHandlers,
  diagnosisHandlers,
  somatischerBefundHandlers,
  toggleSectionExpansion,
}: FormContainerProps) {
  // Prevent body scroll when form is mounted
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

  return (
    <div className={`fixed inset-0 ${SHOW_DEV_BANNER ? 'top-[104px]' : 'top-[64px]'} flex flex-col bg-surface-secondary overflow-hidden`}>
      {/* Header - matches ProgressStepper height */}
      <div className="text-center border-b border-border-primary bg-surface-secondary">
        <div className="max-w-[1900px] mx-auto px-6 py-3">
          <div className="py-1.5">
            <h1 className="text-base font-bold text-foreground">
              Formular-Ansicht
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Area - Two Column Layout (fills viewport, no main scroll) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Form Content (independently scrollable) */}
        <div className="flex-1 md:flex-[0_0_55%] flex flex-col border-r border-border-primary overflow-y-auto">
          <div className="px-8 py-6">
          <Basisdaten
            formData={formData}
            onFieldChange={updateField}
            onAlterChange={updateAlter}
            expansionState={expansionState}
            onSectionToggle={toggleSectionExpansion}
          />
          <SociodemographicData
            formData={formData}
            onFieldChange={updateField}
            setKinder={setKinder}
            setWohnsituation={setWohnsituation}
            setNestedField={setNestedField}
            expansionState={expansionState}
            onSectionToggle={toggleSectionExpansion}
          />
          <SymptomatikSection
            formData={formData}
            onFieldChange={updateField}
            symptomHandlers={symptomHandlers}
            befundHandlers={befundHandlers}
            testdiagnostikHandlers={testdiagnostikHandlers}
            setNestedField={setNestedField}
            expansionState={expansionState}
            onSectionToggle={toggleSectionExpansion}
          />
          <SomatischerBefund
            formData={formData}
            setNestedField={setNestedField}
            setNestedBoolean={setNestedBoolean}
            arrayHandlers={arrayHandlers}
            expansionState={expansionState}
            onSectionToggle={toggleSectionExpansion}
          />
          <Kapitel4
            formData={formData}
            setNestedField={setNestedField}
            arrayHandlers={arrayHandlers}
            expansionState={expansionState}
            onSectionToggle={toggleSectionExpansion}
          />

          {/* Kapitel 5: Diagnosen */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <CollapsibleSectionHeader
              title="Kapitel 5: Diagnosen"
              isExpanded={expansionState.kapitel5}
              onToggle={() => toggleSectionExpansion('kapitel5')}
            />
            {expansionState.kapitel5 && (
              <div className="mt-4">
                <DiagnosisSelection
                  formData={formData.kap5Diagnosen}
                  onAddDiagnosis={diagnosisHandlers.addDiagnosis}
                  onRemoveDiagnosis={diagnosisHandlers.removeDiagnosis}
                  onSetSicherheit={diagnosisHandlers.setSicherheit}
                />
              </div>
            )}
          </div>

          {/* Kapitel 6: Behandlungsplan und Prognose */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <CollapsibleSectionHeader
              title="Kapitel 6: Behandlungsplan und Prognose"
              isExpanded={expansionState.kapitel6}
              onToggle={() => toggleSectionExpansion('kapitel6')}
            />
            {expansionState.kapitel6 && (
              <div className="mt-4">
                <GeneralApplicationData
                  formData={formData}
                  onFieldChange={updateField}
                  expansionState={expansionState}
                  onSectionToggle={toggleSectionExpansion}
                />
              </div>
            )}
          </div>
          </div>
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
