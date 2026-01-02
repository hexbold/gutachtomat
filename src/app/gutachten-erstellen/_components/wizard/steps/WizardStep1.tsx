import * as FormTypes from '@/lib/core/form-types';
import * as FormLabels from '@/lib/core/form-labels';
import { DatePickerWithQuickSelect } from '../../shared/DatePickerWithQuickSelect';

interface WizardStep1Props {
  formData: FormTypes.Form;
  onFieldChange: (field: keyof FormTypes.Form, value: string | FormTypes.Patientenchiffre | FormTypes.DatumBerichterstellung) => void;
  onAlterChange: (value: FormTypes.Alter) => void;
}

interface SelectableCardProps {
  id: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: string;
}

interface FieldLabelProps {
  htmlFor?: string;
  label: string;
  required?: boolean;
}

function FieldLabel({ htmlFor, label, required }: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-base font-semibold text-text-primary mb-2"
    >
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function SelectableCard({ label, isSelected, onClick, icon }: SelectableCardProps) {
  const baseClasses = "relative flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 min-h-[75px] focus:outline-none focus:ring-2 focus:ring-blue-400";
  const stateClasses = isSelected
    ? "border-blue-500 bg-accent-blue-light shadow-sm"
    : "border-border-primary bg-surface-primary hover:border-blue-300 hover:bg-accent-blue-light/30";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${stateClasses}`}
    >
      {/* Checkmark indicator */}
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      <div className="flex flex-col items-center gap-1.5 w-full">
        {icon && <span className="text-2xl">{icon}</span>}
        <span className={`text-base font-semibold text-center leading-snug ${
          isSelected ? 'text-blue-700' : 'text-text-secondary'
        }`}>
          {label}
        </span>
      </div>
    </button>
  );
}

export function WizardStep1({ formData, onFieldChange, onAlterChange }: WizardStep1Props) {
  const inputClasses = "w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-surface-primary";

  return (
    <div className="space-y-6">
      <section className="space-y-7 pb-8 border-b border-border-primary">
        <h3 className="text-lg font-bold text-text-primary pb-2 border-b-2 border-blue-500">
          Patienteninformationen
        </h3>

        <div>
          <FieldLabel
            label={FormLabels.FIELD_LABELS.geschlecht}
            required={true}
          />
          <div className="grid grid-cols-3 gap-2.5">
            <SelectableCard
              id={FormTypes.Geschlecht.M}
              label={FormLabels.GESCHLECHT_LABELS[FormTypes.Geschlecht.M]}
              isSelected={formData.geschlecht === FormTypes.Geschlecht.M}
              onClick={() => onFieldChange('geschlecht', FormTypes.Geschlecht.M)}
            />
            <SelectableCard
              id={FormTypes.Geschlecht.W}
              label={FormLabels.GESCHLECHT_LABELS[FormTypes.Geschlecht.W]}
              isSelected={formData.geschlecht === FormTypes.Geschlecht.W}
              onClick={() => onFieldChange('geschlecht', FormTypes.Geschlecht.W)}
            />
            <SelectableCard
              id={FormTypes.Geschlecht.D}
              label={FormLabels.GESCHLECHT_LABELS[FormTypes.Geschlecht.D]}
              isSelected={formData.geschlecht === FormTypes.Geschlecht.D}
              onClick={() => onFieldChange('geschlecht', FormTypes.Geschlecht.D)}
            />
          </div>
        </div>

        <div>
          <FieldLabel
            htmlFor="alter"
            label={FormLabels.FIELD_LABELS.alter}
            required={true}
          />
          <input
            id="alter"
            type="number"
            value={formData.alter ?? ''}
            onChange={(e) => {
              const value = e.target.valueAsNumber;
              onAlterChange(isNaN(value) ? null : value);
            }}
            min={0}
            max={120}
            placeholder="Alter in Jahren eingeben"
            className={inputClasses}
          />
        </div>

        <div>
          <FieldLabel
            htmlFor="patientenchiffre"
            label={FormLabels.FIELD_LABELS.patientenchiffre}
            required={true}
          />
          <input
              id="patientenchiffre"
              type="text"
              value={formData.patientenchiffre ?? ''}
              onChange={(e) => onFieldChange('patientenchiffre', e.target.value || null)}
              placeholder="Patientenchiffre eingeben"
              className={inputClasses}
            />
        </div>
      </section>

      <section className="space-y-4 pb-8">
        <h3 className="text-lg font-bold text-text-primary pb-2 border-b-2 border-blue-500">
          Datum der Berichterstellung
          <span className="text-red-500 ml-1">*</span>
        </h3>

        <DatePickerWithQuickSelect
          value={formData.datumBerichterstellung}
          onChange={(dateStr) => onFieldChange('datumBerichterstellung', dateStr)}
          placeholder="TT.MM.JJJJ"
          className={inputClasses}
          required={true}
        />
      </section>
    </div>
  );
}
