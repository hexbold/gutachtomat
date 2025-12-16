'use client';

import { A4Handlers, A5Handlers, BefundHandlers, SymptomHandlers } from '@/hooks/useGutachtenForm';
import * as FormTypes from '@/lib/core/form-types';
import { ExpandableSubsection } from './symptomatik/shared/ExpandableSubsection';
import { AnamnesesSection } from './symptomatik/subsections/AnamnesesSection';
import { BefundSection } from './symptomatik/subsections/BefundSection';
import { DiagnosticSymptomsSection } from './symptomatik/subsections/DiagnosticSymptomsSection';

interface SymptomatikSectionProps {
  formData: FormTypes.Form;
  onFieldChange: (field: keyof FormTypes.Form, value: string) => void;
  symptomHandlers: SymptomHandlers;
  a4Handlers: A4Handlers;
  a5Handlers: A5Handlers;
  befundHandlers: BefundHandlers;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
  expansionState: FormTypes.SectionExpansionState;
  onSectionToggle: (section: keyof FormTypes.SectionExpansionState) => void;
}

export function SymptomatikSection({
  formData,
  onFieldChange,
  symptomHandlers,
  a4Handlers,
  a5Handlers,
  befundHandlers,
  setNestedField,
  expansionState,
  onSectionToggle
}: SymptomatikSectionProps) {

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
          <ExpandableSubsection
            title="Symptome"
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

          <AnamnesesSection
            formData={formData}
            symptomHandlers={symptomHandlers}
            a4Handlers={a4Handlers}
            a5Handlers={a5Handlers}
            expansionState={expansionState}
            onSectionToggle={onSectionToggle}
          />

          <ExpandableSubsection
            title="B Psychopathologischer Befund / Psychischer Befund (AMDP)"
            isExpanded={expansionState.psychischerBefund}
            onToggle={() => toggleSection('psychischerBefund')}
            level={0}
          >
            <div>
              <BefundSection
                formData={formData}
                befundHandlers={befundHandlers}
                expansionState={expansionState}
                onSectionToggle={onSectionToggle}
              />
            </div>
          </ExpandableSubsection>

          <ExpandableSubsection
            title="C Testdiagnostische Ergebnisse"
            isExpanded={expansionState.testdiagnostischeErgebnisse}
            onToggle={() => toggleSection('testdiagnostischeErgebnisse')}
            level={0}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Testdiagnostische Ergebnisse
                </label>
                <input
                  type="text"
                  value={formData.c}
                  onChange={(e) => onFieldChange('c', e.target.value)}
                  placeholder="z.B. BDI-II Score: 28 (schwere Depression), BAI Score: 35..."
                  className="w-full p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </ExpandableSubsection>
        </div>
      </div>
    </section>
  );
}
