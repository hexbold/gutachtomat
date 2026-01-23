'use client';

import { BefundHandlers, SymptomHandlers, TestdiagnostikHandlers } from '@/hooks/useGutachtenForm';
import * as FormTypes from '@/lib/core/form-types';
import { ExpandableSubsection } from './symptomatik/shared/ExpandableSubsection';
import { DiagnosticSymptomsSection } from './symptomatik/subsections/DiagnosticSymptomsSection';
import { DauerVerlaufAusloeserSection } from './symptomatik/subsections/DauerVerlaufAusloeserSection';
import { VerhaltensauffaelligkeitenSection } from './symptomatik/subsections/VerhaltensauffaelligkeitenSection';
import { TestdiagnostikSection } from './symptomatik/subsections/TestdiagnostikSection';
import { AMDPSubstep } from '../wizard/steps/AMDPSubstep';

interface SymptomatikSectionProps {
  formData: FormTypes.Form;
  onFieldChange: (field: keyof FormTypes.Form, value: string) => void;
  symptomHandlers: SymptomHandlers;
  befundHandlers: BefundHandlers;
  testdiagnostikHandlers: TestdiagnostikHandlers;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
  expansionState: FormTypes.SectionExpansionState;
  onSectionToggle: (section: keyof FormTypes.SectionExpansionState) => void;
}

export function SymptomatikSection({
  formData,
  onFieldChange,
  symptomHandlers,
  befundHandlers,
  testdiagnostikHandlers,
  setNestedField,
  expansionState,
  onSectionToggle
}: SymptomatikSectionProps) {
  // Suppress unused variable warning - onFieldChange kept for backward compatibility
  void onFieldChange;

  const toggleSection = (section: keyof FormTypes.SectionExpansionState) => {
    onSectionToggle(section);
  };

  return (
    <section className="mb-12">
      <button
        onClick={() => toggleSection('kapitel2')}
        className={`w-full text-left hover:bg-foreground/5 hover:shadow-sm active:scale-[0.98] transition-all duration-200 ease-in-out rounded-md group mb-8 pb-3 border border-foreground/40 p-4 ${expansionState.kapitel2 ? 'bg-foreground/5' : ''}`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-foreground">
            Symptomatik
          </h2>
          <span className={`text-2xl text-foreground/60 ml-2 transition-all duration-200 ease-in-out ${expansionState.kapitel2 ? 'scale-110' : 'scale-100'}`}>
            {expansionState.kapitel2 ? '−' : '+'}
          </span>
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expansionState.kapitel2 ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className={`space-y-2 transition-all duration-200 ${expansionState.kapitel2 ? 'transform translate-y-0 delay-100' : 'transform -translate-y-2'
          }`}>
          {/* Substep 1: Kategorisierte Symptomatik nach ICD-10 */}
          <ExpandableSubsection
            title="Kategorisierte Symptomatik nach ICD-10"
            isExpanded={expansionState.symptomatik}
            onToggle={() => toggleSection('symptomatik')}
            level={0}
          >
            <DiagnosticSymptomsSection
              formData={formData}
              symptomHandlers={symptomHandlers}
              setNestedField={setNestedField}
            />
          </ExpandableSubsection>

          {/* Substep 2: Dauer, Verlauf und Ausloeser */}
          <ExpandableSubsection
            title="Dauer, Verlauf und Auslöser"
            isExpanded={expansionState.dauerVerlaufAusloeser}
            onToggle={() => toggleSection('dauerVerlaufAusloeser')}
            level={0}
          >
            <DauerVerlaufAusloeserSection
              formData={formData}
              setNestedField={setNestedField}
            />
          </ExpandableSubsection>

          {/* Substep 3: Verhaltensexzesse und Verhaltensdefizite */}
          <ExpandableSubsection
            title="Verhaltensexzesse und Verhaltensdefizite"
            isExpanded={expansionState.verhaltensauffaelligkeiten}
            onToggle={() => toggleSection('verhaltensauffaelligkeiten')}
            level={0}
          >
            <VerhaltensauffaelligkeitenSection
              formData={formData}
              symptomHandlers={symptomHandlers}
              setNestedField={setNestedField}
            />
          </ExpandableSubsection>

          {/* Substep 4: AMDP Befund */}
          <ExpandableSubsection
            title="AMDP Befund"
            isExpanded={expansionState.psychischerBefund}
            onToggle={() => toggleSection('psychischerBefund')}
            level={0}
          >
            <div>
              <AMDPSubstep
                formData={formData}
                befundHandlers={befundHandlers}
                setNestedField={setNestedField}
              />
            </div>
          </ExpandableSubsection>

          {/* Substep 5: Testdiagnostik */}
          <ExpandableSubsection
            title="Testdiagnostik"
            isExpanded={expansionState.testdiagnostischeErgebnisse}
            onToggle={() => toggleSection('testdiagnostischeErgebnisse')}
            level={0}
          >
            <TestdiagnostikSection
              formData={formData}
              testdiagnostikHandlers={testdiagnostikHandlers}
            />
          </ExpandableSubsection>
        </div>
      </div>
    </section>
  );
}
