import * as FormConfig from '@/lib/core/form-config';
import * as FormTypes from '@/lib/core/form-types';
import { RadioSection } from './RadioSection';
import { CollapsibleSectionHeader } from './CollapsibleSectionHeader';

interface GeneralApplicationDataProps {
  formData: FormTypes.Form;
  onFieldChange: (field: keyof FormTypes.Form, value: string) => void;
  expansionState: FormTypes.SectionExpansionState;
  onSectionToggle: (section: keyof FormTypes.SectionExpansionState) => void;
}

export function GeneralApplicationData({ formData, onFieldChange, expansionState, onSectionToggle }: GeneralApplicationDataProps) {
  return (
    <section className="mb-12">
      <CollapsibleSectionHeader
        title="Allgemeine Antragsdaten"
        isExpanded={expansionState.allgemeineAntragsdaten}
        onToggle={() => onSectionToggle('allgemeineAntragsdaten')}
      />
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        expansionState.allgemeineAntragsdaten ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className={`space-y-8 transition-all duration-200 ${
          expansionState.allgemeineAntragsdaten ? 'transform translate-y-0 delay-100' : 'transform -translate-y-2'
        }`}>
        <RadioSection
          title="1. Welche Therapieform wird beantragt?"
          options={FormConfig.FORM_OPTIONS.therapieform}
          selectedValue={formData.therapieform}
          onValueChange={(value) => onFieldChange('therapieform', value)}
          name="therapieform"
        />

        <RadioSection
          title="2. Welche Behandlungsform wird beantragt?"
          options={FormConfig.FORM_OPTIONS.behandlungsform}
          selectedValue={formData.behandlungsform}
          onValueChange={(value) => onFieldChange('behandlungsform', value)}
          name="behandlungsform"
        />

        <RadioSection
          title="3. Welche Art von Antrag wird erstellt?"
          options={FormConfig.FORM_OPTIONS.antragsart}
          selectedValue={formData.antragsart}
          onValueChange={(value) => onFieldChange('antragsart', value)}
          name="antragsart"
        />
        </div>
      </div>
    </section>
  );
}