import * as FormLabels from '@/lib/core/form-labels';
import * as FormTypes from '@/lib/core/form-types';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface WizardStep2Props {
  formData: FormTypes.Form;
  onFieldChange: (field: keyof FormTypes.Form, value: string) => void;
  setKinder: (value: FormTypes.Kinder) => void;
  setWohnsituation: (value: FormTypes.WohnsituationField) => void;
  setNestedField?: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
}

interface SelectableCardProps {
  id: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: string;
  isDisabled?: boolean;
}

function SelectableCard({ label, isSelected, onClick, icon, isDisabled }: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`
        relative flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 min-h-[75px]
        ${isDisabled
          ? 'border-border-primary bg-surface-secondary opacity-50 cursor-not-allowed'
          : isSelected
            ? 'border-blue-500 bg-accent-blue-light shadow-sm'
            : 'border-border-primary bg-surface-primary hover:border-blue-300 hover:bg-accent-blue-light/30'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-400
      `}
    >
      {/* Checkmark indicator */}
      {isSelected && !isDisabled && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col items-center gap-1.5 w-full">
        {icon && <span className="text-2xl">{icon}</span>}
        <span className={`text-base font-semibold text-center leading-snug ${isSelected && !isDisabled ? 'text-blue-700' : 'text-text-secondary'}`}>
          {label}
        </span>
      </div>
    </button>
  );
}

interface MultiSelectCardProps {
  id: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: string;
  isDisabled?: boolean;
}

function MultiSelectCard({ label, isSelected, onClick, icon, isDisabled }: MultiSelectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`
        relative flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 min-h-[75px]
        ${isDisabled
          ? 'border-border-primary bg-surface-secondary opacity-50 cursor-not-allowed'
          : isSelected
            ? 'border-blue-500 bg-accent-blue-light shadow-sm'
            : 'border-border-primary bg-surface-primary hover:border-blue-300 hover:bg-accent-blue-light/30'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-400
      `}
    >
      {/* Checkmark indicator */}
      {isSelected && !isDisabled && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col items-center gap-1.5 w-full">
        {icon && <span className="text-2xl">{icon}</span>}
        <span className={`text-base font-semibold text-center leading-snug ${isSelected && !isDisabled ? 'text-blue-700' : 'text-text-secondary'}`}>
          {label}
        </span>
      </div>
    </button>
  );
}

export function WizardStep2({
  formData,
  onFieldChange,
  setKinder,
  setWohnsituation,
  setNestedField
}: WizardStep2Props) {

  // Helper to get current details array from Kinder
  const getCurrentDetails = (): FormTypes.KindDetails[] => {
    if (formData.kinder === null || formData.kinder.anzahl === 0) return [];
    return [...formData.kinder.details];
  };

  // Helper to create a Kinder object for a given count, preserving existing details
  const createKinderForCount = (count: number): FormTypes.Kinder => {
    if (count === 0) return { anzahl: 0 };
    const existingDetails = getCurrentDetails();
    const details: FormTypes.KindDetails[] = [];
    for (let i = 0; i < count; i++) {
      details.push(existingDetails[i] ?? { alter: null, geschlecht: null });
    }
    return { anzahl: count, details } as FormTypes.Kinder;
  };

  const handleAnzahlKinderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '') {
      setKinder(null); // Reset to "Anzahl auswählen"
    } else {
      const count = parseInt(value);
      setKinder(createKinderForCount(count));
    }
  };

  const handleChildAlterUpdate = (index: number, alter: FormTypes.Alter) => {
    const details = getCurrentDetails();
    if (index < details.length) {
      details[index] = { ...details[index], alter };
      setKinder({ anzahl: details.length, details } as FormTypes.Kinder);
    }
  };

  const handleChildGeschlechtUpdate = (index: number, geschlecht: FormTypes.GeschlechtField) => {
    const details = getCurrentDetails();
    if (index < details.length) {
      // Toggle: if same value clicked, set to null
      const newGeschlecht = details[index].geschlecht === geschlecht ? null : geschlecht;
      details[index] = { ...details[index], geschlecht: newGeschlecht };
      setKinder({ anzahl: details.length, details } as FormTypes.Kinder);
    }
  };

  // Get anzahl for display (null = not selected, 0+ = selected)
  const kinderAnzahl = formData.kinder?.anzahl ?? null;
  const kinderDetails = getCurrentDetails();

  // Defensive check for bildungsweg
  const bildungsweg = formData.bildungsweg || {
    schulabschluss: null,
    berufsausbildung: null,
    studium: null,
    promotion: null,
  };

  return (
    <div className="space-y-8">
      {/* ===== BILDUNGSWEG SECTION ===== */}
      <div className="space-y-5">
        <h2 className="text-lg font-bold text-text-primary pb-2 border-b-2 border-blue-500">
          {FormLabels.FIELD_LABELS.bildungsweg}
        </h2>

        {/* Höchster Schulabschluss */}
        <div>
          <label className="block text-base font-semibold text-text-primary mb-2">
            {FormLabels.BILDUNGSWEG_FIELD_LABELS.schulabschluss}
          </label>
        <div className="grid grid-cols-2 gap-2.5">
          {/* Hauptschule */}
          <SelectableCard
            id={FormTypes.Schulabschluss.Hauptschule}
            label={FormLabels.SCHULABSCHLUSS_LABELS[FormTypes.Schulabschluss.Hauptschule]}
            isSelected={bildungsweg.schulabschluss === FormTypes.Schulabschluss.Hauptschule}
            onClick={() => setNestedField?.('bildungsweg.schulabschluss', bildungsweg.schulabschluss === FormTypes.Schulabschluss.Hauptschule ? null : FormTypes.Schulabschluss.Hauptschule)}
          />
          {/* Mittlere Reife */}
          <SelectableCard
            id={FormTypes.Schulabschluss.MittlereReife}
            label={FormLabels.SCHULABSCHLUSS_LABELS[FormTypes.Schulabschluss.MittlereReife]}
            isSelected={bildungsweg.schulabschluss === FormTypes.Schulabschluss.MittlereReife}
            onClick={() => setNestedField?.('bildungsweg.schulabschluss', bildungsweg.schulabschluss === FormTypes.Schulabschluss.MittlereReife ? null : FormTypes.Schulabschluss.MittlereReife)}
          />
          {/* Abitur */}
          <SelectableCard
            id={FormTypes.Schulabschluss.Abitur}
            label={FormLabels.SCHULABSCHLUSS_LABELS[FormTypes.Schulabschluss.Abitur]}
            isSelected={bildungsweg.schulabschluss === FormTypes.Schulabschluss.Abitur}
            onClick={() => setNestedField?.('bildungsweg.schulabschluss', bildungsweg.schulabschluss === FormTypes.Schulabschluss.Abitur ? null : FormTypes.Schulabschluss.Abitur)}
          />
          {/* Kein Abschluss */}
          <SelectableCard
            id={FormTypes.Schulabschluss.KeinAbschluss}
            label={FormLabels.SCHULABSCHLUSS_LABELS[FormTypes.Schulabschluss.KeinAbschluss]}
            isSelected={bildungsweg.schulabschluss === FormTypes.Schulabschluss.KeinAbschluss}
            onClick={() => setNestedField?.('bildungsweg.schulabschluss', bildungsweg.schulabschluss === FormTypes.Schulabschluss.KeinAbschluss ? null : FormTypes.Schulabschluss.KeinAbschluss)}
          />
        </div>
      </div>

      {/* Berufsausbildung */}
      <div>
        <label className="flex items-center gap-3 mb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={bildungsweg.berufsausbildung !== null}
            onChange={(e) => {
              if (e.target.checked) {
                // Set object with default values when checking
                setNestedField?.('bildungsweg.berufsausbildung', {
                  als: '',
                  status: FormTypes.AusbildungStatus.Laufend
                });
              } else {
                // Set to null when unchecking
                setNestedField?.('bildungsweg.berufsausbildung', null);
              }
            }}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400 border-2 border-border-primary"
          />
          <span className="text-base font-semibold text-text-primary">
            {FormLabels.BILDUNGSWEG_FIELD_LABELS.berufsausbildung}
          </span>
        </label>

        {bildungsweg.berufsausbildung !== null && (
          <div className="ml-8 space-y-3 p-4 bg-accent-blue-light/30 rounded-lg border border-blue-200">
            <div>
              <label htmlFor="berufsausbildungAls" className="block text-sm font-medium text-text-secondary mb-1">
                Ausbildung als:
              </label>
              <input
                id="berufsausbildungAls"
                type="text"
                value={bildungsweg.berufsausbildung.als}
                onChange={(e) => setNestedField?.('bildungsweg.berufsausbildung', {
                  ...bildungsweg.berufsausbildung,
                  als: e.target.value
                })}
                placeholder="z.B. Kaufmann/-frau, Elektriker/in"
                className="w-full px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Status:</label>
              <div className="flex gap-2">
                {/* Laufend */}
                <button
                  type="button"
                  onClick={() => {
                    if (bildungsweg.berufsausbildung) {
                      setNestedField?.('bildungsweg.berufsausbildung', {
                        ...bildungsweg.berufsausbildung,
                        status: FormTypes.AusbildungStatus.Laufend
                      });
                    }
                  }}
                  className={`
                    flex-1 px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-all
                    ${bildungsweg.berufsausbildung?.status === FormTypes.AusbildungStatus.Laufend
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-border-primary bg-surface-primary text-text-tertiary hover:border-blue-300'
                    }
                  `}
                >
                  {FormLabels.AUSBILDUNG_STATUS_LABELS[FormTypes.AusbildungStatus.Laufend]}
                </button>
                {/* Abgeschlossen */}
                <button
                  type="button"
                  onClick={() => {
                    if (bildungsweg.berufsausbildung) {
                      setNestedField?.('bildungsweg.berufsausbildung', {
                        ...bildungsweg.berufsausbildung,
                        status: FormTypes.AusbildungStatus.Abgeschlossen
                      });
                    }
                  }}
                  className={`
                    flex-1 px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-all
                    ${bildungsweg.berufsausbildung?.status === FormTypes.AusbildungStatus.Abgeschlossen
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-border-primary bg-surface-primary text-text-tertiary hover:border-blue-300'
                    }
                  `}
                >
                  {FormLabels.AUSBILDUNG_STATUS_LABELS[FormTypes.AusbildungStatus.Abgeschlossen]}
                </button>
                {/* Abgebrochen */}
                <button
                  type="button"
                  onClick={() => {
                    if (bildungsweg.berufsausbildung) {
                      setNestedField?.('bildungsweg.berufsausbildung', {
                        ...bildungsweg.berufsausbildung,
                        status: FormTypes.AusbildungStatus.Abgebrochen
                      });
                    }
                  }}
                  className={`
                    flex-1 px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-all
                    ${bildungsweg.berufsausbildung?.status === FormTypes.AusbildungStatus.Abgebrochen
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-border-primary bg-surface-primary text-text-tertiary hover:border-blue-300'
                    }
                  `}
                >
                  {FormLabels.AUSBILDUNG_STATUS_LABELS[FormTypes.AusbildungStatus.Abgebrochen]}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Studium */}
      <div>
        <label className="flex items-center gap-3 mb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={bildungsweg.studium !== null}
            onChange={(e) => {
              if (e.target.checked) {
                // Set object with default values when checking
                setNestedField?.('bildungsweg.studium', {
                  fach: '',
                  status: FormTypes.StudiumStatus.Laufend
                });
              } else {
                // Set to null when unchecking
                setNestedField?.('bildungsweg.studium', null);
              }
            }}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400 border-2 border-border-primary"
          />
          <span className="text-base font-semibold text-text-primary">
            {FormLabels.BILDUNGSWEG_FIELD_LABELS.studium}
          </span>
        </label>

        {bildungsweg.studium !== null && (
          <div className="ml-8 space-y-3 p-4 bg-accent-blue-light/30 rounded-lg border border-blue-200">
            <div>
              <label htmlFor="studiumFach" className="block text-sm font-medium text-text-secondary mb-1">
                {FormLabels.STUDIUM_FIELD_LABELS.fach}:
              </label>
              <input
                id="studiumFach"
                type="text"
                value={bildungsweg.studium.fach}
                onChange={(e) => setNestedField?.('bildungsweg.studium', {
                  ...bildungsweg.studium,
                  fach: e.target.value
                })}
                placeholder="z.B. Psychologie, Medizin"
                className="w-full px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">{FormLabels.STUDIUM_FIELD_LABELS.status}:</label>
              <div className="flex gap-2">
                {/* Laufend */}
                <button
                  type="button"
                  onClick={() => {
                    if (bildungsweg.studium) {
                      setNestedField?.('bildungsweg.studium', {
                        ...bildungsweg.studium,
                        status: FormTypes.StudiumStatus.Laufend
                      });
                    }
                  }}
                  className={`
                    flex-1 px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-all
                    ${bildungsweg.studium?.status === FormTypes.StudiumStatus.Laufend
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-border-primary bg-surface-primary text-text-tertiary hover:border-blue-300'
                    }
                  `}
                >
                  {FormLabels.STUDIUM_STATUS_LABELS[FormTypes.StudiumStatus.Laufend]}
                </button>
                {/* Abgeschlossen */}
                <button
                  type="button"
                  onClick={() => {
                    if (bildungsweg.studium) {
                      setNestedField?.('bildungsweg.studium', {
                        ...bildungsweg.studium,
                        status: FormTypes.StudiumStatus.Abgeschlossen
                      });
                    }
                  }}
                  className={`
                    flex-1 px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-all
                    ${bildungsweg.studium?.status === FormTypes.StudiumStatus.Abgeschlossen
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-border-primary bg-surface-primary text-text-tertiary hover:border-blue-300'
                    }
                  `}
                >
                  {FormLabels.STUDIUM_STATUS_LABELS[FormTypes.StudiumStatus.Abgeschlossen]}
                </button>
                {/* Abgebrochen */}
                <button
                  type="button"
                  onClick={() => {
                    if (bildungsweg.studium) {
                      setNestedField?.('bildungsweg.studium', {
                        ...bildungsweg.studium,
                        status: FormTypes.StudiumStatus.Abgebrochen
                      });
                    }
                  }}
                  className={`
                    flex-1 px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-all
                    ${bildungsweg.studium?.status === FormTypes.StudiumStatus.Abgebrochen
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-border-primary bg-surface-primary text-text-tertiary hover:border-blue-300'
                    }
                  `}
                >
                  {FormLabels.STUDIUM_STATUS_LABELS[FormTypes.StudiumStatus.Abgebrochen]}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Promotion */}
      <div>
        <label className="flex items-center gap-3 mb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={bildungsweg.promotion !== null}
            onChange={(e) => {
              if (e.target.checked) {
                // Set object with default values when checking
                setNestedField?.('bildungsweg.promotion', {
                  fach: '',
                  status: FormTypes.PromotionStatus.Laufend
                });
              } else {
                // Set to null when unchecking
                setNestedField?.('bildungsweg.promotion', null);
              }
            }}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400 border-2 border-border-primary"
          />
          <span className="text-base font-semibold text-text-primary">
            {FormLabels.BILDUNGSWEG_FIELD_LABELS.promotion}
          </span>
        </label>

        {bildungsweg.promotion !== null && (
          <div className="ml-8 space-y-3 p-4 bg-accent-blue-light/30 rounded-lg border border-blue-200">
            <div>
              <label htmlFor="promotionFach" className="block text-sm font-medium text-text-secondary mb-1">
                {FormLabels.PROMOTION_FIELD_LABELS.fach}:
              </label>
              <input
                id="promotionFach"
                type="text"
                value={bildungsweg.promotion.fach}
                onChange={(e) => setNestedField?.('bildungsweg.promotion', {
                  ...bildungsweg.promotion,
                  fach: e.target.value
                })}
                placeholder="z.B. Klinische Psychologie"
                className="w-full px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">{FormLabels.PROMOTION_FIELD_LABELS.status}:</label>
              <div className="flex gap-2">
                {/* Laufend */}
                <button
                  type="button"
                  onClick={() => {
                    if (bildungsweg.promotion) {
                      setNestedField?.('bildungsweg.promotion', {
                        ...bildungsweg.promotion,
                        status: FormTypes.PromotionStatus.Laufend
                      });
                    }
                  }}
                  className={`
                    flex-1 px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-all
                    ${bildungsweg.promotion?.status === FormTypes.PromotionStatus.Laufend
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-border-primary bg-surface-primary text-text-tertiary hover:border-blue-300'
                    }
                  `}
                >
                  {FormLabels.PROMOTION_STATUS_LABELS[FormTypes.PromotionStatus.Laufend]}
                </button>
                {/* Abgeschlossen */}
                <button
                  type="button"
                  onClick={() => {
                    if (bildungsweg.promotion) {
                      setNestedField?.('bildungsweg.promotion', {
                        ...bildungsweg.promotion,
                        status: FormTypes.PromotionStatus.Abgeschlossen
                      });
                    }
                  }}
                  className={`
                    flex-1 px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-all
                    ${bildungsweg.promotion?.status === FormTypes.PromotionStatus.Abgeschlossen
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-border-primary bg-surface-primary text-text-tertiary hover:border-blue-300'
                    }
                  `}
                >
                  {FormLabels.PROMOTION_STATUS_LABELS[FormTypes.PromotionStatus.Abgeschlossen]}
                </button>
                {/* Abgebrochen */}
                <button
                  type="button"
                  onClick={() => {
                    if (bildungsweg.promotion) {
                      setNestedField?.('bildungsweg.promotion', {
                        ...bildungsweg.promotion,
                        status: FormTypes.PromotionStatus.Abgebrochen
                      });
                    }
                  }}
                  className={`
                    flex-1 px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-all
                    ${bildungsweg.promotion?.status === FormTypes.PromotionStatus.Abgebrochen
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-border-primary bg-surface-primary text-text-tertiary hover:border-blue-300'
                    }
                  `}
                >
                  {FormLabels.PROMOTION_STATUS_LABELS[FormTypes.PromotionStatus.Abgebrochen]}
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* ===== BERUFLICHER STATUS SECTION ===== */}
      <div className="space-y-5">
        <h2 className="text-lg font-bold text-text-primary pb-2 border-b-2 border-blue-500">
          {FormLabels.FIELD_LABELS.beruf}
        </h2>

        {/* Aktuell beschäftigt */}
        <div>
          <label className="flex items-center gap-3 mb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.beruf.beschaeftigung !== null}
              onChange={(e) => {
                if (e.target.checked) {
                  setNestedField?.('beruf.beschaeftigung', {
                    berufsbezeichnung: '',
                    anstellungsart: FormTypes.Anstellungsart.Vollzeit
                  });
                } else {
                  setNestedField?.('beruf.beschaeftigung', null);
                }
              }}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400 border-2 border-border-primary"
            />
            <span className="text-base font-semibold text-text-primary">
              {FormLabels.BERUF_STATUS_FIELD_LABELS.beschaeftigung}
            </span>
          </label>

          {formData.beruf.beschaeftigung !== null && (
            <div className="ml-8 space-y-3 p-4 bg-accent-blue-light/30 rounded-lg border border-blue-200">
              <div>
                <label htmlFor="berufsbezeichnung" className="block text-sm font-medium text-text-secondary mb-1">
                  {FormLabels.BESCHAEFTIGUNG_FIELD_LABELS.berufsbezeichnung}
                </label>
                <input
                  id="berufsbezeichnung"
                  type="text"
                  value={formData.beruf.beschaeftigung.berufsbezeichnung}
                  onChange={(e) => setNestedField?.('beruf.beschaeftigung', {
                    ...formData.beruf.beschaeftigung,
                    berufsbezeichnung: e.target.value
                  })}
                  placeholder="z.B. Kaufmann/-frau, Ingenieur/in"
                  className="w-full px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">{FormLabels.BESCHAEFTIGUNG_FIELD_LABELS.anstellungsart}:</label>
                <div className="flex gap-2">
                  {/* Vollzeit */}
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.beruf.beschaeftigung) {
                        setNestedField?.('beruf.beschaeftigung', {
                          ...formData.beruf.beschaeftigung,
                          anstellungsart: FormTypes.Anstellungsart.Vollzeit
                        });
                      }
                    }}
                    className={`
                      flex-1 px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-all
                      ${formData.beruf.beschaeftigung?.anstellungsart === FormTypes.Anstellungsart.Vollzeit
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-border-primary bg-surface-primary text-text-tertiary hover:border-blue-300'
                      }
                    `}
                  >
                    {FormLabels.ANSTELLUNGSART_LABELS[FormTypes.Anstellungsart.Vollzeit]}
                  </button>
                  {/* Teilzeit */}
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.beruf.beschaeftigung) {
                        setNestedField?.('beruf.beschaeftigung', {
                          ...formData.beruf.beschaeftigung,
                          anstellungsart: FormTypes.Anstellungsart.Teilzeit
                        });
                      }
                    }}
                    className={`
                      flex-1 px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-all
                      ${formData.beruf.beschaeftigung?.anstellungsart === FormTypes.Anstellungsart.Teilzeit
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-border-primary bg-surface-primary text-text-tertiary hover:border-blue-300'
                      }
                    `}
                  >
                    {FormLabels.ANSTELLUNGSART_LABELS[FormTypes.Anstellungsart.Teilzeit]}
                  </button>
                  {/* Minijob */}
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.beruf.beschaeftigung) {
                        setNestedField?.('beruf.beschaeftigung', {
                          ...formData.beruf.beschaeftigung,
                          anstellungsart: FormTypes.Anstellungsart.MiniJob
                        });
                      }
                    }}
                    className={`
                      flex-1 px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-all
                      ${formData.beruf.beschaeftigung?.anstellungsart === FormTypes.Anstellungsart.MiniJob
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-border-primary bg-surface-primary text-text-tertiary hover:border-blue-300'
                      }
                    `}
                  >
                    {FormLabels.ANSTELLUNGSART_LABELS[FormTypes.Anstellungsart.MiniJob]}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Arbeitslosigkeit */}
        <div>
          <label className="flex items-center gap-3 mb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.beruf.arbeitslosigkeit.arbeitslos}
              onChange={(e) => {
                if (e.target.checked) {
                  setNestedField?.('beruf.arbeitslosigkeit', {
                    arbeitslos: true,
                    dauer: { jahre: 0, monate: 0, wochen: 0, tage: 0 }
                  });
                } else {
                  setNestedField?.('beruf.arbeitslosigkeit', { arbeitslos: false });
                }
              }}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400 border-2 border-border-primary"
            />
            <span className="text-base font-semibold text-text-primary">
              {FormLabels.BERUF_STATUS_FIELD_LABELS.arbeitslosigkeit}
            </span>
          </label>

          {formData.beruf.arbeitslosigkeit.arbeitslos && (
            <div className="ml-8 space-y-3 p-4 bg-accent-blue-light/30 rounded-lg border border-blue-200">
              <label className="block text-sm font-medium text-text-secondary mb-2">{FormLabels.ARBEITSLOSIGKEIT_FIELD_LABELS.dauer}:</label>
              <div className="grid grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-text-tertiary mb-1">{FormLabels.DAUER_FIELD_LABELS.jahre}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.beruf.arbeitslosigkeit.dauer?.jahre ?? 0}
                    onChange={(e) => {
                      const currentDauer = formData.beruf.arbeitslosigkeit.arbeitslos ? formData.beruf.arbeitslosigkeit.dauer : null;
                      setNestedField?.('beruf.arbeitslosigkeit', {
                        arbeitslos: true,
                        dauer: { ...(currentDauer ?? { jahre: 0, monate: 0, wochen: 0, tage: 0 }), jahre: parseInt(e.target.value, 10) || 0 }
                      });
                    }}
                    placeholder="0"
                    className="w-full px-2 py-1.5 text-sm border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-tertiary mb-1">{FormLabels.DAUER_FIELD_LABELS.monate}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.beruf.arbeitslosigkeit.dauer?.monate ?? 0}
                    onChange={(e) => {
                      const currentDauer = formData.beruf.arbeitslosigkeit.arbeitslos ? formData.beruf.arbeitslosigkeit.dauer : null;
                      setNestedField?.('beruf.arbeitslosigkeit', {
                        arbeitslos: true,
                        dauer: { ...(currentDauer ?? { jahre: 0, monate: 0, wochen: 0, tage: 0 }), monate: parseInt(e.target.value, 10) || 0 }
                      });
                    }}
                    placeholder="0"
                    className="w-full px-2 py-1.5 text-sm border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-tertiary mb-1">{FormLabels.DAUER_FIELD_LABELS.wochen}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.beruf.arbeitslosigkeit.dauer?.wochen ?? 0}
                    onChange={(e) => {
                      const currentDauer = formData.beruf.arbeitslosigkeit.arbeitslos ? formData.beruf.arbeitslosigkeit.dauer : null;
                      setNestedField?.('beruf.arbeitslosigkeit', {
                        arbeitslos: true,
                        dauer: { ...(currentDauer ?? { jahre: 0, monate: 0, wochen: 0, tage: 0 }), wochen: parseInt(e.target.value, 10) || 0 }
                      });
                    }}
                    placeholder="0"
                    className="w-full px-2 py-1.5 text-sm border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-tertiary mb-1">{FormLabels.DAUER_FIELD_LABELS.tage}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.beruf.arbeitslosigkeit.dauer?.tage ?? 0}
                    onChange={(e) => {
                      const currentDauer = formData.beruf.arbeitslosigkeit.arbeitslos ? formData.beruf.arbeitslosigkeit.dauer : null;
                      setNestedField?.('beruf.arbeitslosigkeit', {
                        arbeitslos: true,
                        dauer: { ...(currentDauer ?? { jahre: 0, monate: 0, wochen: 0, tage: 0 }), tage: parseInt(e.target.value, 10) || 0 }
                      });
                    }}
                    placeholder="0"
                    className="w-full px-2 py-1.5 text-sm border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rente */}
        <div>
          <label className="flex items-center gap-3 mb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.beruf.rente.berentet}
              onChange={(e) => {
                if (e.target.checked) {
                  setNestedField?.('beruf.rente', {
                    berentet: true,
                    dauer: { jahre: 0, monate: 0, wochen: 0, tage: 0 }
                  });
                } else {
                  setNestedField?.('beruf.rente', { berentet: false });
                }
              }}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400 border-2 border-border-primary"
            />
            <span className="text-base font-semibold text-text-primary">
              {FormLabels.BERUF_STATUS_FIELD_LABELS.rente}
            </span>
          </label>

          {formData.beruf.rente.berentet && (
            <div className="ml-8 space-y-3 p-4 bg-accent-blue-light/30 rounded-lg border border-blue-200">
              <label className="block text-sm font-medium text-text-secondary mb-2">{FormLabels.RENTE_FIELD_LABELS.dauer}:</label>
              <div className="grid grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-text-tertiary mb-1">{FormLabels.DAUER_FIELD_LABELS.jahre}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.beruf.rente.dauer?.jahre ?? 0}
                    onChange={(e) => {
                      const currentDauer = formData.beruf.rente.berentet ? formData.beruf.rente.dauer : null;
                      setNestedField?.('beruf.rente', {
                        berentet: true,
                        dauer: { ...(currentDauer ?? { jahre: 0, monate: 0, wochen: 0, tage: 0 }), jahre: parseInt(e.target.value, 10) || 0 }
                      });
                    }}
                    placeholder="0"
                    className="w-full px-2 py-1.5 text-sm border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-tertiary mb-1">{FormLabels.DAUER_FIELD_LABELS.monate}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.beruf.rente.dauer?.monate ?? 0}
                    onChange={(e) => {
                      const currentDauer = formData.beruf.rente.berentet ? formData.beruf.rente.dauer : null;
                      setNestedField?.('beruf.rente', {
                        berentet: true,
                        dauer: { ...(currentDauer ?? { jahre: 0, monate: 0, wochen: 0, tage: 0 }), monate: parseInt(e.target.value, 10) || 0 }
                      });
                    }}
                    placeholder="0"
                    className="w-full px-2 py-1.5 text-sm border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-tertiary mb-1">{FormLabels.DAUER_FIELD_LABELS.wochen}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.beruf.rente.dauer?.wochen ?? 0}
                    onChange={(e) => {
                      const currentDauer = formData.beruf.rente.berentet ? formData.beruf.rente.dauer : null;
                      setNestedField?.('beruf.rente', {
                        berentet: true,
                        dauer: { ...(currentDauer ?? { jahre: 0, monate: 0, wochen: 0, tage: 0 }), wochen: parseInt(e.target.value, 10) || 0 }
                      });
                    }}
                    placeholder="0"
                    className="w-full px-2 py-1.5 text-sm border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-tertiary mb-1">{FormLabels.DAUER_FIELD_LABELS.tage}</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.beruf.rente.dauer?.tage ?? 0}
                    onChange={(e) => {
                      const currentDauer = formData.beruf.rente.berentet ? formData.beruf.rente.dauer : null;
                      setNestedField?.('beruf.rente', {
                        berentet: true,
                        dauer: { ...(currentDauer ?? { jahre: 0, monate: 0, wochen: 0, tage: 0 }), tage: parseInt(e.target.value, 10) || 0 }
                      });
                    }}
                    placeholder="0"
                    className="w-full px-2 py-1.5 text-sm border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Familienstand */}
      <div>
        <label className="block text-base font-semibold text-text-primary mb-2">
          {FormLabels.FIELD_LABELS.familienstand}
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {/* Ledig */}
          <SelectableCard
            id={FormTypes.Familienstand.Ledig}
            label={FormLabels.FAMILIENSTAND_LABELS[FormTypes.Familienstand.Ledig]}
            isSelected={formData.familienstand === FormTypes.Familienstand.Ledig}
            onClick={() => onFieldChange('familienstand', formData.familienstand === FormTypes.Familienstand.Ledig ? '' : FormTypes.Familienstand.Ledig)}
          />
          {/* Partnerschaft */}
          <SelectableCard
            id={FormTypes.Familienstand.Partnerschaft}
            label={FormLabels.FAMILIENSTAND_LABELS[FormTypes.Familienstand.Partnerschaft]}
            isSelected={formData.familienstand === FormTypes.Familienstand.Partnerschaft}
            onClick={() => onFieldChange('familienstand', formData.familienstand === FormTypes.Familienstand.Partnerschaft ? '' : FormTypes.Familienstand.Partnerschaft)}
          />
          {/* Verheiratet */}
          <SelectableCard
            id={FormTypes.Familienstand.Verheiratet}
            label={FormLabels.FAMILIENSTAND_LABELS[FormTypes.Familienstand.Verheiratet]}
            isSelected={formData.familienstand === FormTypes.Familienstand.Verheiratet}
            onClick={() => onFieldChange('familienstand', formData.familienstand === FormTypes.Familienstand.Verheiratet ? '' : FormTypes.Familienstand.Verheiratet)}
          />
          {/* Geschieden */}
          <SelectableCard
            id={FormTypes.Familienstand.Geschieden}
            label={FormLabels.FAMILIENSTAND_LABELS[FormTypes.Familienstand.Geschieden]}
            isSelected={formData.familienstand === FormTypes.Familienstand.Geschieden}
            onClick={() => onFieldChange('familienstand', formData.familienstand === FormTypes.Familienstand.Geschieden ? '' : FormTypes.Familienstand.Geschieden)}
          />
          {/* Getrennt */}
          <SelectableCard
            id={FormTypes.Familienstand.Getrennt}
            label={FormLabels.FAMILIENSTAND_LABELS[FormTypes.Familienstand.Getrennt]}
            isSelected={formData.familienstand === FormTypes.Familienstand.Getrennt}
            onClick={() => onFieldChange('familienstand', formData.familienstand === FormTypes.Familienstand.Getrennt ? '' : FormTypes.Familienstand.Getrennt)}
          />
          {/* Verwitwet */}
          <SelectableCard
            id={FormTypes.Familienstand.Verwitwet}
            label={FormLabels.FAMILIENSTAND_LABELS[FormTypes.Familienstand.Verwitwet]}
            isSelected={formData.familienstand === FormTypes.Familienstand.Verwitwet}
            onClick={() => onFieldChange('familienstand', formData.familienstand === FormTypes.Familienstand.Verwitwet ? '' : FormTypes.Familienstand.Verwitwet)}
          />
        </div>
      </div>

      {/* Anzahl Kinder */}
      <div>
        <label htmlFor="anzahlKinder" className="block text-base font-semibold text-text-primary mb-2">
          {FormLabels.FIELD_LABELS.kinder}
        </label>
        <div className="relative">
          <select
            id="anzahlKinder"
            value={kinderAnzahl ?? ''}
            onChange={handleAnzahlKinderChange}
            className="w-full px-4 py-3 text-base font-medium border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-surface-primary appearance-none cursor-pointer hover:border-blue-300"
          >
            <option value="">{FormLabels.KINDER_UI_LABELS.selectPlaceholder}</option>
            {Array.from({ length: 11 }, (_, i) => i).map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? FormLabels.KINDER_UI_LABELS.childPrefix : `${FormLabels.KINDER_UI_LABELS.childPrefix}er`}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-text-quaternary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Alter der Kinder */}
      {kinderAnzahl !== null && kinderAnzahl > 0 && (
        <div className="bg-accent-blue-light/30 p-4 rounded-lg border border-blue-200">
          <label className="block text-base font-semibold text-text-primary mb-3">
            {FormLabels.KINDER_UI_LABELS.sectionHeading}
          </label>
          <div className="space-y-2.5">
            {kinderDetails.map((child, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-surface-primary border border-border-primary rounded-lg">
                <span className="text-sm font-medium text-text-secondary min-w-[60px]">{FormLabels.KINDER_UI_LABELS.getChildLabel(index)}</span>

                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={child.alter ?? ''}
                    onChange={(e) => {
                      let value = e.target.valueAsNumber;
                      // When stepping up from empty, browser gives 1 (min + step), but we want 0
                      if (child.alter === null && value === 1) {
                        value = 0;
                      }
                      handleChildAlterUpdate(index, isNaN(value) ? null : value);
                    }}
                    min={0}
                    max={99}
                    placeholder={FormLabels.KINDER_UI_LABELS.alterPlaceholder}
                    className="w-24 px-3 py-2 text-sm border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 pr-8"
                  />
                  {child.alter !== null && (
                    <button
                      type="button"
                      onClick={() => handleChildAlterUpdate(index, null)}
                      className="absolute right-2 p-0.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                      title="Alter entfernen"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="flex gap-2 ml-auto">
                  {/* Männlich */}
                  <button
                    type="button"
                    onClick={() => handleChildGeschlechtUpdate(index, FormTypes.Geschlecht.M)}
                    className={`
                      px-3 py-1.5 text-sm font-semibold rounded-lg border-2 transition-all
                      ${child.geschlecht === FormTypes.Geschlecht.M
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-border-primary bg-surface-primary text-text-tertiary hover:border-blue-300'
                      }
                    `}
                  >
                    {FormLabels.CHILD_GESCHLECHT_COMPACT_LABELS[FormTypes.Geschlecht.M]}
                  </button>
                  {/* Weiblich */}
                  <button
                    type="button"
                    onClick={() => handleChildGeschlechtUpdate(index, FormTypes.Geschlecht.W)}
                    className={`
                      px-3 py-1.5 text-sm font-semibold rounded-lg border-2 transition-all
                      ${child.geschlecht === FormTypes.Geschlecht.W
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-border-primary bg-surface-primary text-text-tertiary hover:border-blue-300'
                      }
                    `}
                  >
                    {FormLabels.CHILD_GESCHLECHT_COMPACT_LABELS[FormTypes.Geschlecht.W]}
                  </button>
                  {/* Divers */}
                  <button
                    type="button"
                    onClick={() => handleChildGeschlechtUpdate(index, FormTypes.Geschlecht.D)}
                    className={`
                      px-3 py-1.5 text-sm font-semibold rounded-lg border-2 transition-all
                      ${child.geschlecht === FormTypes.Geschlecht.D
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-border-primary bg-surface-primary text-text-tertiary hover:border-blue-300'
                      }
                    `}
                  >
                    {FormLabels.CHILD_GESCHLECHT_COMPACT_LABELS[FormTypes.Geschlecht.D]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wohnsituation */}
      <div>
        <label className="block text-base font-semibold text-text-primary mb-2">
          {FormLabels.FIELD_LABELS.wohnsituation}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Alleine option - exclusive */}
          <MultiSelectCard
            id="lebtAllein"
            label={FormLabels.WOHNSITUATION_UI_LABELS.lebtAllein}
            isSelected={formData.wohnsituation?.lebtAllein === true}
            onClick={() => {
              if (formData.wohnsituation?.lebtAllein === true) {
                // Deselect: set to null
                setWohnsituation(null);
              } else {
                // Select: set to lives alone
                setWohnsituation({ lebtAllein: true });
              }
            }}
          />

          {/* Mit Partner/in */}
          <MultiSelectCard
            id="mitPartner"
            label={FormLabels.WOHNSITUATION_UI_LABELS.mitPartner}
            isSelected={formData.wohnsituation !== null && !formData.wohnsituation.lebtAllein && formData.wohnsituation.mitPartner}
            isDisabled={formData.wohnsituation?.lebtAllein === true}
            onClick={() => {
              const w = formData.wohnsituation;
              if (w === null || w.lebtAllein) {
                // First selection when null or switching from alone
                setWohnsituation({ lebtAllein: false, mitPartner: true, mitKindern: false, beiEltern: false, inWG: false });
              } else {
                // Toggle mitPartner
                const newMitPartner = !w.mitPartner;
                // If turning off and no others are true, set to null
                if (!newMitPartner && !w.mitKindern && !w.beiEltern && !w.inWG) {
                  setWohnsituation(null);
                } else {
                  // Type assertion needed because spread loses literal type info
                  // We've validated at least one field is true above
                  setWohnsituation({ ...w, mitPartner: newMitPartner } as FormTypes.WohnsituationData);
                }
              }
            }}
          />

          {/* Mit Kind/ern */}
          <MultiSelectCard
            id="mitKindern"
            label={FormLabels.WOHNSITUATION_UI_LABELS.mitKindern}
            isSelected={formData.wohnsituation !== null && !formData.wohnsituation.lebtAllein && formData.wohnsituation.mitKindern}
            isDisabled={formData.wohnsituation?.lebtAllein === true}
            onClick={() => {
              const w = formData.wohnsituation;
              if (w === null || w.lebtAllein) {
                setWohnsituation({ lebtAllein: false, mitPartner: false, mitKindern: true, beiEltern: false, inWG: false });
              } else {
                const newMitKindern = !w.mitKindern;
                if (!w.mitPartner && !newMitKindern && !w.beiEltern && !w.inWG) {
                  setWohnsituation(null);
                } else {
                  setWohnsituation({ ...w, mitKindern: newMitKindern } as FormTypes.WohnsituationData);
                }
              }
            }}
          />

          {/* Bei Eltern */}
          <MultiSelectCard
            id="beiEltern"
            label={FormLabels.WOHNSITUATION_UI_LABELS.beiEltern}
            isSelected={formData.wohnsituation !== null && !formData.wohnsituation.lebtAllein && formData.wohnsituation.beiEltern}
            isDisabled={formData.wohnsituation?.lebtAllein === true}
            onClick={() => {
              const w = formData.wohnsituation;
              if (w === null || w.lebtAllein) {
                setWohnsituation({ lebtAllein: false, mitPartner: false, mitKindern: false, beiEltern: true, inWG: false });
              } else {
                const newBeiEltern = !w.beiEltern;
                if (!w.mitPartner && !w.mitKindern && !newBeiEltern && !w.inWG) {
                  setWohnsituation(null);
                } else {
                  setWohnsituation({ ...w, beiEltern: newBeiEltern } as FormTypes.WohnsituationData);
                }
              }
            }}
          />

          {/* In WG */}
          <MultiSelectCard
            id="inWG"
            label={FormLabels.WOHNSITUATION_UI_LABELS.inWG}
            isSelected={formData.wohnsituation !== null && !formData.wohnsituation.lebtAllein && formData.wohnsituation.inWG}
            isDisabled={formData.wohnsituation?.lebtAllein === true}
            onClick={() => {
              const w = formData.wohnsituation;
              if (w === null || w.lebtAllein) {
                setWohnsituation({ lebtAllein: false, mitPartner: false, mitKindern: false, beiEltern: false, inWG: true });
              } else {
                const newInWG = !w.inWG;
                if (!w.mitPartner && !w.mitKindern && !w.beiEltern && !newInWG) {
                  setWohnsituation(null);
                } else {
                  setWohnsituation({ ...w, inWG: newInWG } as FormTypes.WohnsituationData);
                }
              }
            }}
          />
        </div>
        {formData.wohnsituation?.lebtAllein === true && (
          <p className="mt-3 text-sm text-text-tertiary italic flex items-center gap-1.5">
            <InformationCircleIcon className="w-4 h-4 inline-block flex-shrink-0" />
            <span>Bei Auswahl von &quot;Alleine&quot; sind andere Optionen nicht verfügbar</span>
          </p>
        )}
      </div>

      {/* Finanzielle Situation */}
      <div>
        <label className="block text-base font-semibold text-text-primary mb-2">
          {FormLabels.FIELD_LABELS.finanzielleSituation}
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {/* Angespannt */}
          <SelectableCard
            id={FormTypes.FinanzielleSituation.Angespannt}
            label={FormLabels.FINANZIELLE_SITUATION_LABELS[FormTypes.FinanzielleSituation.Angespannt]}
            isSelected={formData.finanzielleSituation === FormTypes.FinanzielleSituation.Angespannt}
            onClick={() => {
              const newValue = formData.finanzielleSituation === FormTypes.FinanzielleSituation.Angespannt ? null : FormTypes.FinanzielleSituation.Angespannt;
              setNestedField?.('finanzielleSituation', newValue);
            }}
          />
          {/* Ausreichend */}
          <SelectableCard
            id={FormTypes.FinanzielleSituation.Ausreichend}
            label={FormLabels.FINANZIELLE_SITUATION_LABELS[FormTypes.FinanzielleSituation.Ausreichend]}
            isSelected={formData.finanzielleSituation === FormTypes.FinanzielleSituation.Ausreichend}
            onClick={() => {
              const newValue = formData.finanzielleSituation === FormTypes.FinanzielleSituation.Ausreichend ? null : FormTypes.FinanzielleSituation.Ausreichend;
              setNestedField?.('finanzielleSituation', newValue);
            }}
          />
          {/* Stabil */}
          <SelectableCard
            id={FormTypes.FinanzielleSituation.Stabil}
            label={FormLabels.FINANZIELLE_SITUATION_LABELS[FormTypes.FinanzielleSituation.Stabil]}
            isSelected={formData.finanzielleSituation === FormTypes.FinanzielleSituation.Stabil}
            onClick={() => {
              const newValue = formData.finanzielleSituation === FormTypes.FinanzielleSituation.Stabil ? null : FormTypes.FinanzielleSituation.Stabil;
              setNestedField?.('finanzielleSituation', newValue);
            }}
          />
        </div>
      </div>

      {/* Aktuelle Krankschreibung */}
      <div>
        <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-secondary/50 transition-colors cursor-pointer">
          <input
            type="checkbox"
            checked={formData.krankschreibung.krankgeschrieben}
            onChange={(e) => {
              if (e.target.checked) {
                setNestedField?.('krankschreibung', { krankgeschrieben: true, details: null });
              } else {
                setNestedField?.('krankschreibung', { krankgeschrieben: false });
              }
            }}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
          />
          <span className="text-base font-semibold text-text-primary">{FormLabels.FIELD_LABELS.krankschreibung}</span>
        </label>

        {/* Krankschreibung durch - nur wenn krankgeschrieben */}
        {formData.krankschreibung.krankgeschrieben && (() => {
          const details = formData.krankschreibung.details;
          const selectedDurch = details?.durch ?? null;

          return (
            <div className="mt-3 ml-8 space-y-2 pl-4 border-l-2 border-blue-300">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Krankschreibung durch (optional)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {/* Hausarzt */}
                <SelectableCard
                  id="hausarzt"
                  label="Hausarzt/Hausärztin"
                  isSelected={selectedDurch === FormTypes.KrankschreibungDurch.Hausarzt}
                  onClick={() => {
                    if (selectedDurch === FormTypes.KrankschreibungDurch.Hausarzt) {
                      setNestedField?.('krankschreibung', { krankgeschrieben: true, details: null });
                    } else {
                      setNestedField?.('krankschreibung', { krankgeschrieben: true, details: { durch: FormTypes.KrankschreibungDurch.Hausarzt } });
                    }
                  }}
                />
                {/* Psychiater */}
                <SelectableCard
                  id="psychiater"
                  label="Psychiater/in"
                  isSelected={selectedDurch === FormTypes.KrankschreibungDurch.Psychiater}
                  onClick={() => {
                    if (selectedDurch === FormTypes.KrankschreibungDurch.Psychiater) {
                      setNestedField?.('krankschreibung', { krankgeschrieben: true, details: null });
                    } else {
                      setNestedField?.('krankschreibung', { krankgeschrieben: true, details: { durch: FormTypes.KrankschreibungDurch.Psychiater } });
                    }
                  }}
                />
                {/* Andere */}
                <SelectableCard
                  id="andere"
                  label="Andere"
                  isSelected={selectedDurch === FormTypes.KrankschreibungDurch.Andere}
                  onClick={() => {
                    if (selectedDurch === FormTypes.KrankschreibungDurch.Andere) {
                      setNestedField?.('krankschreibung', { krankgeschrieben: true, details: null });
                    } else {
                      setNestedField?.('krankschreibung', { krankgeschrieben: true, details: { durch: FormTypes.KrankschreibungDurch.Andere, durchAndere: '' } });
                    }
                  }}
                />
              </div>

              {/* Text field for "Andere" */}
              {selectedDurch === FormTypes.KrankschreibungDurch.Andere && details?.durch === FormTypes.KrankschreibungDurch.Andere && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={details.durchAndere}
                    onChange={(e) => setNestedField?.('krankschreibung', {
                      krankgeschrieben: true,
                      details: { durch: FormTypes.KrankschreibungDurch.Andere, durchAndere: e.target.value }
                    })}
                    placeholder="Bitte angeben..."
                    className="w-full p-2.5 border border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
                  />
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
