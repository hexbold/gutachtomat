import * as FormLabels from '@/lib/core/form-labels';
import * as FormTypes from '@/lib/core/form-types';
import { CollapsibleSectionHeader } from './CollapsibleSectionHeader';
import { DatePickerWithQuickSelect } from '../shared/DatePickerWithQuickSelect';

interface BasisdatenProps {
  formData: FormTypes.Form;
  onFieldChange: (
    field: keyof FormTypes.Form,
    value: string | FormTypes.Patientenchiffre | FormTypes.DatumBerichterstellung
  ) => void;
  onAlterChange: (value: FormTypes.Alter) => void;
  expansionState: FormTypes.SectionExpansionState;
  onSectionToggle: (section: keyof FormTypes.SectionExpansionState) => void;
}

interface FieldLabelProps {
  label: string;
  required?: boolean;
}

interface RadioOptionProps {
  id: string;
  label: string;
  name: string;
  checked: boolean;
  onChange: (value: string) => void;
}

const INPUT_BASE_CLASSES =
  'w-full p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg';

function FieldLabel({ label, required }: FieldLabelProps) {
  return (
    <h3 className="text-lg font-medium text-foreground mb-4">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </h3>
  );
}

function RadioOption({ id, label, name, checked, onChange }: RadioOptionProps) {
  return (
    <label
      key={id}
      className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors"
    >
      <input
        type="radio"
        name={name}
        value={id}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
      />
      <span className="text-lg text-foreground">{label}</span>
    </label>
  );
}

export function Basisdaten({
  formData,
  onFieldChange,
  onAlterChange,
  expansionState,
  onSectionToggle,
}: BasisdatenProps) {
  const isExpanded = expansionState.patientenInformationen;

  return (
    <section className="mb-12">
      <CollapsibleSectionHeader
        title="Basisdaten"
        isExpanded={isExpanded}
        onToggle={() => onSectionToggle('patientenInformationen')}
      />

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div
          className={`space-y-6 transition-all duration-200 ${isExpanded ? 'transform translate-y-0 delay-100' : 'transform -translate-y-2'
            }`}
        >
          <div>
            <FieldLabel
              label={FormLabels.FIELD_LABELS.geschlecht}
              required={true}
            />
            <div className="space-y-3">
              <RadioOption
                id={FormTypes.Geschlecht.M}
                label={FormLabels.GESCHLECHT_LABELS[FormTypes.Geschlecht.M]}
                name="geschlecht"
                checked={formData.geschlecht === FormTypes.Geschlecht.M}
                onChange={() => onFieldChange('geschlecht', FormTypes.Geschlecht.M)}
              />
              <RadioOption
                id={FormTypes.Geschlecht.W}
                label={FormLabels.GESCHLECHT_LABELS[FormTypes.Geschlecht.W]}
                name="geschlecht"
                checked={formData.geschlecht === FormTypes.Geschlecht.W}
                onChange={() => onFieldChange('geschlecht', FormTypes.Geschlecht.W)}
              />
              <RadioOption
                id={FormTypes.Geschlecht.D}
                label={FormLabels.GESCHLECHT_LABELS[FormTypes.Geschlecht.D]}
                name="geschlecht"
                checked={formData.geschlecht === FormTypes.Geschlecht.D}
                onChange={() => onFieldChange('geschlecht', FormTypes.Geschlecht.D)}
              />
            </div>
          </div>

          <div>
            <FieldLabel
              label={FormLabels.FIELD_LABELS.alter}
              required={true}
            />
            <input
              type="number"
              value={formData.alter ?? ''}
              onChange={(e) => {
                const value = e.target.valueAsNumber;
                onAlterChange(isNaN(value) ? null : value);
              }}
              min={0}
              max={120}
              placeholder="Alter in Jahren eingeben"
              className={INPUT_BASE_CLASSES}
            />
          </div>

          <div>
            <FieldLabel
              label={FormLabels.FIELD_LABELS.patientenchiffre}
              required={true}
            />
            <input
              type="text"
              value={formData.patientenchiffre ?? ''}
              onChange={(e) => onFieldChange('patientenchiffre', e.target.value || null)}
              placeholder="Patientenchiffre eingeben"
              className={INPUT_BASE_CLASSES}
            />
          </div>

          <div>
            <FieldLabel
              label={FormLabels.FIELD_LABELS.datumBerichterstellung}
              required={true}
            />
            <DatePickerWithQuickSelect
              value={formData.datumBerichterstellung}
              onChange={(dateStr) => onFieldChange('datumBerichterstellung', dateStr)}
              placeholder="TT.MM.JJJJ"
              required={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
