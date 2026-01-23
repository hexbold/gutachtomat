import * as FormTypes from '@/lib/core/form-types';
import { CollapsibleSectionHeader } from './CollapsibleSectionHeader';
import { ArrayHandlers, SomatischerBefundHandlers } from '@/hooks/useGutachtenForm';

// TODO: This component needs to be refactored to use the new type-safe Somato data structures.
// For now, it's a placeholder while the wizard (WizardStep4.tsx) is being updated.
// The wizard is the primary UI for this chapter - this form view is secondary.

interface SomatischerBefundProps {
  formData: FormTypes.Form;
  setNestedField: (fieldPath: string, value: string) => void;
  setNestedBoolean: (fieldPath: string, value: boolean) => void;
  arrayHandlers: ArrayHandlers;
  expansionState: FormTypes.SectionExpansionState;
  onSectionToggle: (section: keyof FormTypes.SectionExpansionState) => void;
  somatischerBefundHandlers?: SomatischerBefundHandlers;
}

export function SomatischerBefund({
  expansionState,
  onSectionToggle,
}: SomatischerBefundProps) {
  return (
    <section className="mb-12">
      <CollapsibleSectionHeader
        title="Kapitel 3: Somatischer Befund"
        isExpanded={expansionState.kapitel3}
        onToggle={() => onSectionToggle('kapitel3')}
      />
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        expansionState.kapitel3 ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className={`space-y-8 transition-all duration-200 ${
          expansionState.kapitel3 ? 'transform translate-y-0 delay-100' : 'transform -translate-y-2'
        }`}>
          <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-amber-800 dark:text-amber-200 text-center">
              Kapitel 3 wird derzeit im Wizard bearbeitet.
              Bitte nutzen Sie den Wizard (oben) für die Eingabe des somatischen Befunds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
