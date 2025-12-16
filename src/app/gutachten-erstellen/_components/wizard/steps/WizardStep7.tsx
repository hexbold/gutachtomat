import * as FormTypes from '@/lib/core/form-types';
import * as FormConfig from '@/lib/core/form-config';

interface WizardStep7Props {
  formData: FormTypes.Form;
  onFieldChange: (field: keyof FormTypes.Form, value: string) => void;
}

interface SelectableCardProps {
  id: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: string;
}

function SelectableCard({ label, isSelected, onClick, icon }: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 min-h-[75px]
        ${isSelected
          ? 'border-blue-500 bg-accent-blue-light shadow-sm'
          : 'border-border-primary bg-surface-primary hover:border-blue-300 hover:bg-accent-blue-light/30'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-400
      `}
    >
      {/* Checkmark indicator */}
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col items-center gap-1.5 w-full">
        {icon && <span className="text-2xl">{icon}</span>}
        <span className={`text-base font-semibold text-center leading-snug ${isSelected ? 'text-blue-700' : 'text-text-secondary'}`}>
          {label}
        </span>
      </div>
    </button>
  );
}

export function WizardStep7({ formData, onFieldChange }: WizardStep7Props) {
  return (
    <div className="space-y-6">
      {/* Allgemeine Antragsdaten */}
      <div className="space-y-7 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">📋</span>
          <h3 className="text-lg font-semibold text-text-primary">
            Allgemeine Antragsdaten
          </h3>
        </div>

        {/* Therapieform */}
        <div>
          <label className="block text-base font-semibold text-text-primary mb-2">
            Welche Therapieform wird beantragt?
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {FormConfig.FORM_OPTIONS.therapieform.map((option) => (
              <SelectableCard
                key={option.id}
                id={option.id}
                label={option.label}
                icon={
                  option.id === 'therapie_verhaltenstherapie' ? '🧠' :
                  option.id === 'therapie_analytisch' ? '🔍' :
                  option.id === 'therapie_tiefenpsychologisch' ? '💭' :
                  '🌐'
                }
                isSelected={formData.therapieform === option.id}
                onClick={() => onFieldChange('therapieform', option.id)}
              />
            ))}
          </div>
        </div>

        {/* Behandlungsform */}
        <div>
          <label className="block text-base font-semibold text-text-primary mb-2">
            Welche Behandlungsform wird beantragt?
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {FormConfig.FORM_OPTIONS.behandlungsform.map((option) => (
              <SelectableCard
                key={option.id}
                id={option.id}
                label={option.label}
                icon={
                  option.id === 'behandlung_einzel' ? '👤' :
                  option.id === 'behandlung_gruppe' ? '👥' :
                  '👤👥'
                }
                isSelected={formData.behandlungsform === option.id}
                onClick={() => onFieldChange('behandlungsform', option.id)}
              />
            ))}
          </div>
        </div>

        {/* Antragsart */}
        <div>
          <label className="block text-base font-semibold text-text-primary mb-2">
            Welche Art von Antrag wird erstellt?
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {FormConfig.FORM_OPTIONS.antragsart.map((option) => (
              <SelectableCard
                key={option.id}
                id={option.id}
                label={option.label}
                icon={
                  option.id === 'antrag_erst' ? '🆕' :
                  option.id === 'antrag_umwandlung' ? '🔄' :
                  '➡️'
                }
                isSelected={formData.antragsart === option.id}
                onClick={() => onFieldChange('antragsart', option.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Completion indicator */}
      {formData.therapieform && formData.behandlungsform && formData.antragsart && (
        <div className="p-3 bg-accent-green-light border border-green-200 rounded-lg flex items-start gap-2.5">
          <span className="text-green-600 text-lg flex-shrink-0">✓</span>
          <div>
            <p className="text-sm font-semibold text-green-800">Antragsdaten vollständig</p>
            <p className="text-sm text-green-700">Alle Informationen wurden erfasst</p>
          </div>
        </div>
      )}

      {/* Info message */}
      {(!formData.therapieform || !formData.behandlungsform || !formData.antragsart) && (
        <div className="p-3 bg-accent-blue-light border border-blue-200 rounded-lg flex items-start gap-2.5">
          <span className="text-blue-600 text-lg flex-shrink-0">ℹ️</span>
          <div>
            <p className="text-sm font-semibold text-blue-800">Zusätzliche Informationen</p>
            <p className="text-sm text-blue-700">
              Diese Informationen sind optional, aber hilfreich für ein vollständiges Gutachten
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
