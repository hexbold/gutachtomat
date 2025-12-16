import * as FormLabels from '@/lib/core/form-labels';
import * as FormTypes from '@/lib/core/form-types';
import { CollapsibleSectionHeader } from './CollapsibleSectionHeader';

interface SelectableCardProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

function SelectableCard({ label, isSelected, onClick }: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        p-3 rounded-lg border-2 text-left transition-all duration-200
        ${isSelected
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-foreground/20 hover:border-foreground/40 text-foreground'
        }
      `}
    >
      <span className="text-base">{label}</span>
    </button>
  );
}

interface SociodemographicDataProps {
  formData: FormTypes.Form;
  onFieldChange: (field: keyof FormTypes.Form, value: string) => void;
  setKinder: (value: FormTypes.Kinder) => void;
  setWohnsituation: (value: FormTypes.WohnsituationField) => void;
  setNestedField?: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
  expansionState: FormTypes.SectionExpansionState;
  onSectionToggle: (section: keyof FormTypes.SectionExpansionState) => void;
}

export function SociodemographicData({ formData, onFieldChange, setKinder, setWohnsituation, setNestedField, expansionState, onSectionToggle }: SociodemographicDataProps) {
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

  return (
    <section className="mb-12">
      <CollapsibleSectionHeader
        title="Soziodemographie"
        isExpanded={expansionState.soziodemographischeDaten}
        onToggle={() => onSectionToggle('soziodemographischeDaten')}
      />
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expansionState.soziodemographischeDaten ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className={`space-y-8 transition-all duration-200 ${expansionState.soziodemographischeDaten ? 'transform translate-y-0 delay-100' : 'transform -translate-y-2'
          }`}>
          {/* Bildungsweg */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              {FormLabels.FIELD_LABELS.bildungsweg}
            </h3>

            <div className="space-y-6 pl-6">
              {/* Schulabschluss */}
              <div>
                <h4 className="text-lg font-medium text-foreground mb-3">
                  {FormLabels.BILDUNGSWEG_FIELD_LABELS.schulabschluss}
                </h4>
                <div className="space-y-3">
                  {/* Hauptschule */}
                  <label className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="radio"
                      name="schulabschluss"
                      value={FormTypes.Schulabschluss.Hauptschule}
                      checked={formData.bildungsweg.schulabschluss === FormTypes.Schulabschluss.Hauptschule}
                      onChange={() => setNestedField?.('bildungsweg.schulabschluss', FormTypes.Schulabschluss.Hauptschule)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                    />
                    <span className="text-lg text-foreground">{FormLabels.SCHULABSCHLUSS_LABELS[FormTypes.Schulabschluss.Hauptschule]}</span>
                  </label>
                  {/* Mittlere Reife */}
                  <label className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="radio"
                      name="schulabschluss"
                      value={FormTypes.Schulabschluss.MittlereReife}
                      checked={formData.bildungsweg.schulabschluss === FormTypes.Schulabschluss.MittlereReife}
                      onChange={() => setNestedField?.('bildungsweg.schulabschluss', FormTypes.Schulabschluss.MittlereReife)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                    />
                    <span className="text-lg text-foreground">{FormLabels.SCHULABSCHLUSS_LABELS[FormTypes.Schulabschluss.MittlereReife]}</span>
                  </label>
                  {/* Abitur */}
                  <label className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="radio"
                      name="schulabschluss"
                      value={FormTypes.Schulabschluss.Abitur}
                      checked={formData.bildungsweg.schulabschluss === FormTypes.Schulabschluss.Abitur}
                      onChange={() => setNestedField?.('bildungsweg.schulabschluss', FormTypes.Schulabschluss.Abitur)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                    />
                    <span className="text-lg text-foreground">{FormLabels.SCHULABSCHLUSS_LABELS[FormTypes.Schulabschluss.Abitur]}</span>
                  </label>
                  {/* Kein Abschluss */}
                  <label className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="radio"
                      name="schulabschluss"
                      value={FormTypes.Schulabschluss.KeinAbschluss}
                      checked={formData.bildungsweg.schulabschluss === FormTypes.Schulabschluss.KeinAbschluss}
                      onChange={() => setNestedField?.('bildungsweg.schulabschluss', FormTypes.Schulabschluss.KeinAbschluss)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                    />
                    <span className="text-lg text-foreground">{FormLabels.SCHULABSCHLUSS_LABELS[FormTypes.Schulabschluss.KeinAbschluss]}</span>
                  </label>
                </div>
              </div>

              {/* Berufsausbildung */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={formData.bildungsweg.berufsausbildung !== null}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNestedField?.('bildungsweg.berufsausbildung', {
                          als: '',
                          status: FormTypes.AusbildungStatus.Laufend
                        });
                      } else {
                        setNestedField?.('bildungsweg.berufsausbildung', null);
                      }
                    }}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                  />
                  <span className="text-lg font-medium text-foreground">{FormLabels.BILDUNGSWEG_FIELD_LABELS.berufsausbildung}</span>
                </label>
                {formData.bildungsweg.berufsausbildung !== null && (
                  <div className="space-y-3 pl-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div>
                      <label className="block text-sm text-foreground/70 mb-1">Ausbildung als:</label>
                      <input
                        type="text"
                        value={formData.bildungsweg.berufsausbildung.als}
                        onChange={(e) => {
                          setNestedField?.('bildungsweg.berufsausbildung', {
                            ...formData.bildungsweg.berufsausbildung,
                            als: e.target.value
                          });
                        }}
                        placeholder="z.B. Kaufmann/-frau, Elektriker/in"
                        className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm text-foreground/70 mb-1">Status:</label>
                      {/* Laufend */}
                      <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="radio"
                          name="berufsausbildungStatus"
                          value={FormTypes.AusbildungStatus.Laufend}
                          checked={formData.bildungsweg.berufsausbildung?.status === FormTypes.AusbildungStatus.Laufend}
                          onChange={() => {
                            if (formData.bildungsweg.berufsausbildung) {
                              setNestedField?.('bildungsweg.berufsausbildung', {
                                ...formData.bildungsweg.berufsausbildung,
                                status: FormTypes.AusbildungStatus.Laufend
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                        />
                        <span className="text-sm text-foreground">{FormLabels.AUSBILDUNG_STATUS_LABELS[FormTypes.AusbildungStatus.Laufend]}</span>
                      </label>
                      {/* Abgeschlossen */}
                      <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="radio"
                          name="berufsausbildungStatus"
                          value={FormTypes.AusbildungStatus.Abgeschlossen}
                          checked={formData.bildungsweg.berufsausbildung?.status === FormTypes.AusbildungStatus.Abgeschlossen}
                          onChange={() => {
                            if (formData.bildungsweg.berufsausbildung) {
                              setNestedField?.('bildungsweg.berufsausbildung', {
                                ...formData.bildungsweg.berufsausbildung,
                                status: FormTypes.AusbildungStatus.Abgeschlossen
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                        />
                        <span className="text-sm text-foreground">{FormLabels.AUSBILDUNG_STATUS_LABELS[FormTypes.AusbildungStatus.Abgeschlossen]}</span>
                      </label>
                      {/* Abgebrochen */}
                      <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="radio"
                          name="berufsausbildungStatus"
                          value={FormTypes.AusbildungStatus.Abgebrochen}
                          checked={formData.bildungsweg.berufsausbildung?.status === FormTypes.AusbildungStatus.Abgebrochen}
                          onChange={() => {
                            if (formData.bildungsweg.berufsausbildung) {
                              setNestedField?.('bildungsweg.berufsausbildung', {
                                ...formData.bildungsweg.berufsausbildung,
                                status: FormTypes.AusbildungStatus.Abgebrochen
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                        />
                        <span className="text-sm text-foreground">{FormLabels.AUSBILDUNG_STATUS_LABELS[FormTypes.AusbildungStatus.Abgebrochen]}</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Studium */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={formData.bildungsweg.studium !== null}
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
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                  />
                  <span className="text-lg font-medium text-foreground">{FormLabels.BILDUNGSWEG_FIELD_LABELS.studium}</span>
                </label>
                {formData.bildungsweg.studium !== null && (
                  <div className="space-y-3 pl-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div>
                      <label className="block text-sm text-foreground/70 mb-1">{FormLabels.STUDIUM_FIELD_LABELS.fach}:</label>
                      <input
                        type="text"
                        value={formData.bildungsweg.studium.fach}
                        onChange={(e) => {
                          setNestedField?.('bildungsweg.studium', {
                            ...formData.bildungsweg.studium,
                            fach: e.target.value
                          });
                        }}
                        placeholder="z.B. Psychologie, Medizin"
                        className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm text-foreground/70 mb-1">{FormLabels.STUDIUM_FIELD_LABELS.status}:</label>
                      {/* Laufend */}
                      <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="radio"
                          name="studiumStatus"
                          value={FormTypes.StudiumStatus.Laufend}
                          checked={formData.bildungsweg.studium?.status === FormTypes.StudiumStatus.Laufend}
                          onChange={() => {
                            if (formData.bildungsweg.studium) {
                              setNestedField?.('bildungsweg.studium', {
                                ...formData.bildungsweg.studium,
                                status: FormTypes.StudiumStatus.Laufend
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                        />
                        <span className="text-sm text-foreground">{FormLabels.STUDIUM_STATUS_LABELS[FormTypes.StudiumStatus.Laufend]}</span>
                      </label>
                      {/* Abgeschlossen */}
                      <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="radio"
                          name="studiumStatus"
                          value={FormTypes.StudiumStatus.Abgeschlossen}
                          checked={formData.bildungsweg.studium?.status === FormTypes.StudiumStatus.Abgeschlossen}
                          onChange={() => {
                            if (formData.bildungsweg.studium) {
                              setNestedField?.('bildungsweg.studium', {
                                ...formData.bildungsweg.studium,
                                status: FormTypes.StudiumStatus.Abgeschlossen
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                        />
                        <span className="text-sm text-foreground">{FormLabels.STUDIUM_STATUS_LABELS[FormTypes.StudiumStatus.Abgeschlossen]}</span>
                      </label>
                      {/* Abgebrochen */}
                      <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="radio"
                          name="studiumStatus"
                          value={FormTypes.StudiumStatus.Abgebrochen}
                          checked={formData.bildungsweg.studium?.status === FormTypes.StudiumStatus.Abgebrochen}
                          onChange={() => {
                            if (formData.bildungsweg.studium) {
                              setNestedField?.('bildungsweg.studium', {
                                ...formData.bildungsweg.studium,
                                status: FormTypes.StudiumStatus.Abgebrochen
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                        />
                        <span className="text-sm text-foreground">{FormLabels.STUDIUM_STATUS_LABELS[FormTypes.StudiumStatus.Abgebrochen]}</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Promotion */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={formData.bildungsweg.promotion !== null}
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
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                  />
                  <span className="text-lg font-medium text-foreground">{FormLabels.BILDUNGSWEG_FIELD_LABELS.promotion}</span>
                </label>
                {formData.bildungsweg.promotion !== null && (
                  <div className="space-y-3 pl-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div>
                      <label className="block text-sm text-foreground/70 mb-1">{FormLabels.PROMOTION_FIELD_LABELS.fach}:</label>
                      <input
                        type="text"
                        value={formData.bildungsweg.promotion.fach}
                        onChange={(e) => {
                          setNestedField?.('bildungsweg.promotion', {
                            ...formData.bildungsweg.promotion,
                            fach: e.target.value
                          });
                        }}
                        placeholder="z.B. Klinische Psychologie"
                        className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm text-foreground/70 mb-1">{FormLabels.PROMOTION_FIELD_LABELS.status}:</label>
                      {/* Laufend */}
                      <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="radio"
                          name="promotionStatus"
                          value={FormTypes.PromotionStatus.Laufend}
                          checked={formData.bildungsweg.promotion?.status === FormTypes.PromotionStatus.Laufend}
                          onChange={() => {
                            if (formData.bildungsweg.promotion) {
                              setNestedField?.('bildungsweg.promotion', {
                                ...formData.bildungsweg.promotion,
                                status: FormTypes.PromotionStatus.Laufend
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                        />
                        <span className="text-sm text-foreground">{FormLabels.PROMOTION_STATUS_LABELS[FormTypes.PromotionStatus.Laufend]}</span>
                      </label>
                      {/* Abgeschlossen */}
                      <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="radio"
                          name="promotionStatus"
                          value={FormTypes.PromotionStatus.Abgeschlossen}
                          checked={formData.bildungsweg.promotion?.status === FormTypes.PromotionStatus.Abgeschlossen}
                          onChange={() => {
                            if (formData.bildungsweg.promotion) {
                              setNestedField?.('bildungsweg.promotion', {
                                ...formData.bildungsweg.promotion,
                                status: FormTypes.PromotionStatus.Abgeschlossen
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                        />
                        <span className="text-sm text-foreground">{FormLabels.PROMOTION_STATUS_LABELS[FormTypes.PromotionStatus.Abgeschlossen]}</span>
                      </label>
                      {/* Abgebrochen */}
                      <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="radio"
                          name="promotionStatus"
                          value={FormTypes.PromotionStatus.Abgebrochen}
                          checked={formData.bildungsweg.promotion?.status === FormTypes.PromotionStatus.Abgebrochen}
                          onChange={() => {
                            if (formData.bildungsweg.promotion) {
                              setNestedField?.('bildungsweg.promotion', {
                                ...formData.bildungsweg.promotion,
                                status: FormTypes.PromotionStatus.Abgebrochen
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                        />
                        <span className="text-sm text-foreground">{FormLabels.PROMOTION_STATUS_LABELS[FormTypes.PromotionStatus.Abgebrochen]}</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Beruf */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">{FormLabels.FIELD_LABELS.beruf}</h3>
            <div className="space-y-4">
              {/* Aktuell beschäftigt */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer mb-2">
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
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                  />
                  <span className="text-base font-medium text-foreground">{FormLabels.BERUF_STATUS_FIELD_LABELS.beschaeftigung}</span>
                </label>
                {formData.beruf.beschaeftigung !== null && (
                  <div className="space-y-3 ml-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    {/* Berufsbezeichnung */}
                    <div>
                      <label className="block text-sm text-foreground/70 mb-1">{FormLabels.BESCHAEFTIGUNG_FIELD_LABELS.berufsbezeichnung}:</label>
                      <input
                        type="text"
                        value={formData.beruf.beschaeftigung.berufsbezeichnung}
                        onChange={(e) => {
                          if (formData.beruf.beschaeftigung) {
                            setNestedField?.('beruf.beschaeftigung', {
                              ...formData.beruf.beschaeftigung,
                              berufsbezeichnung: e.target.value
                            });
                          }
                        }}
                        placeholder="z.B. Kaufmann/-frau, Ingenieur/in"
                        className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    {/* Anstellungsart */}
                    <div className="space-y-2">
                      <label className="block text-sm text-foreground/70 mb-1">{FormLabels.BESCHAEFTIGUNG_FIELD_LABELS.anstellungsart}:</label>
                      {/* Vollzeit */}
                      <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="radio"
                          name="anstellungsart"
                          value={FormTypes.Anstellungsart.Vollzeit}
                          checked={formData.beruf.beschaeftigung?.anstellungsart === FormTypes.Anstellungsart.Vollzeit}
                          onChange={() => {
                            if (formData.beruf.beschaeftigung) {
                              setNestedField?.('beruf.beschaeftigung', {
                                ...formData.beruf.beschaeftigung,
                                anstellungsart: FormTypes.Anstellungsart.Vollzeit
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                        />
                        <span className="text-sm text-foreground">{FormLabels.ANSTELLUNGSART_LABELS[FormTypes.Anstellungsart.Vollzeit]}</span>
                      </label>
                      {/* Teilzeit */}
                      <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="radio"
                          name="anstellungsart"
                          value={FormTypes.Anstellungsart.Teilzeit}
                          checked={formData.beruf.beschaeftigung?.anstellungsart === FormTypes.Anstellungsart.Teilzeit}
                          onChange={() => {
                            if (formData.beruf.beschaeftigung) {
                              setNestedField?.('beruf.beschaeftigung', {
                                ...formData.beruf.beschaeftigung,
                                anstellungsart: FormTypes.Anstellungsart.Teilzeit
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                        />
                        <span className="text-sm text-foreground">{FormLabels.ANSTELLUNGSART_LABELS[FormTypes.Anstellungsart.Teilzeit]}</span>
                      </label>
                      {/* Minijob */}
                      <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="radio"
                          name="anstellungsart"
                          value={FormTypes.Anstellungsart.MiniJob}
                          checked={formData.beruf.beschaeftigung?.anstellungsart === FormTypes.Anstellungsart.MiniJob}
                          onChange={() => {
                            if (formData.beruf.beschaeftigung) {
                              setNestedField?.('beruf.beschaeftigung', {
                                ...formData.beruf.beschaeftigung,
                                anstellungsart: FormTypes.Anstellungsart.MiniJob
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                        />
                        <span className="text-sm text-foreground">{FormLabels.ANSTELLUNGSART_LABELS[FormTypes.Anstellungsart.MiniJob]}</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Arbeitslos seit */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer mb-2">
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
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                  />
                  <span className="text-base font-medium text-foreground">{FormLabels.ARBEITSLOSIGKEIT_FIELD_LABELS.arbeitslos} seit:</span>
                </label>
                {formData.beruf.arbeitslosigkeit.arbeitslos && (
                  <div className="grid grid-cols-4 gap-3 ml-6">
                    <div>
                      <label className="block text-xs text-foreground/70 mb-1">{FormLabels.DAUER_FIELD_LABELS.jahre}:</label>
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
                        className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-foreground/70 mb-1">{FormLabels.DAUER_FIELD_LABELS.monate}:</label>
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
                        className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-foreground/70 mb-1">{FormLabels.DAUER_FIELD_LABELS.wochen}:</label>
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
                        className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-foreground/70 mb-1">{FormLabels.DAUER_FIELD_LABELS.tage}:</label>
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
                        className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Rente seit */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer mb-2">
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
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                  />
                  <span className="text-base font-medium text-foreground">{FormLabels.RENTE_FIELD_LABELS.berentet} seit:</span>
                </label>
                {formData.beruf.rente.berentet && (
                  <div className="grid grid-cols-4 gap-3 ml-6">
                    <div>
                      <label className="block text-xs text-foreground/70 mb-1">{FormLabels.DAUER_FIELD_LABELS.jahre}:</label>
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
                        className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-foreground/70 mb-1">{FormLabels.DAUER_FIELD_LABELS.monate}:</label>
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
                        className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-foreground/70 mb-1">{FormLabels.DAUER_FIELD_LABELS.wochen}:</label>
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
                        className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-foreground/70 mb-1">{FormLabels.DAUER_FIELD_LABELS.tage}:</label>
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
                        className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Familienstand */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">{FormLabels.FIELD_LABELS.familienstand}</h3>
            <div className="space-y-3">
              {/* Ledig */}
              <label className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="radio"
                  name="familienstand"
                  value={FormTypes.Familienstand.Ledig}
                  checked={formData.familienstand === FormTypes.Familienstand.Ledig}
                  onChange={() => {
                    const newValue = formData.familienstand === FormTypes.Familienstand.Ledig ? '' : FormTypes.Familienstand.Ledig;
                    onFieldChange('familienstand', newValue);
                  }}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                />
                <span className="text-lg text-foreground">{FormLabels.FAMILIENSTAND_LABELS[FormTypes.Familienstand.Ledig]}</span>
              </label>
              {/* Partnerschaft */}
              <label className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="radio"
                  name="familienstand"
                  value={FormTypes.Familienstand.Partnerschaft}
                  checked={formData.familienstand === FormTypes.Familienstand.Partnerschaft}
                  onChange={() => {
                    const newValue = formData.familienstand === FormTypes.Familienstand.Partnerschaft ? '' : FormTypes.Familienstand.Partnerschaft;
                    onFieldChange('familienstand', newValue);
                  }}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                />
                <span className="text-lg text-foreground">{FormLabels.FAMILIENSTAND_LABELS[FormTypes.Familienstand.Partnerschaft]}</span>
              </label>
              {/* Verheiratet */}
              <label className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="radio"
                  name="familienstand"
                  value={FormTypes.Familienstand.Verheiratet}
                  checked={formData.familienstand === FormTypes.Familienstand.Verheiratet}
                  onChange={() => {
                    const newValue = formData.familienstand === FormTypes.Familienstand.Verheiratet ? '' : FormTypes.Familienstand.Verheiratet;
                    onFieldChange('familienstand', newValue);
                  }}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                />
                <span className="text-lg text-foreground">{FormLabels.FAMILIENSTAND_LABELS[FormTypes.Familienstand.Verheiratet]}</span>
              </label>
              {/* Geschieden */}
              <label className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="radio"
                  name="familienstand"
                  value={FormTypes.Familienstand.Geschieden}
                  checked={formData.familienstand === FormTypes.Familienstand.Geschieden}
                  onChange={() => {
                    const newValue = formData.familienstand === FormTypes.Familienstand.Geschieden ? '' : FormTypes.Familienstand.Geschieden;
                    onFieldChange('familienstand', newValue);
                  }}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                />
                <span className="text-lg text-foreground">{FormLabels.FAMILIENSTAND_LABELS[FormTypes.Familienstand.Geschieden]}</span>
              </label>
              {/* Getrennt */}
              <label className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="radio"
                  name="familienstand"
                  value={FormTypes.Familienstand.Getrennt}
                  checked={formData.familienstand === FormTypes.Familienstand.Getrennt}
                  onChange={() => {
                    const newValue = formData.familienstand === FormTypes.Familienstand.Getrennt ? '' : FormTypes.Familienstand.Getrennt;
                    onFieldChange('familienstand', newValue);
                  }}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                />
                <span className="text-lg text-foreground">{FormLabels.FAMILIENSTAND_LABELS[FormTypes.Familienstand.Getrennt]}</span>
              </label>
              {/* Verwitwet */}
              <label className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="radio"
                  name="familienstand"
                  value={FormTypes.Familienstand.Verwitwet}
                  checked={formData.familienstand === FormTypes.Familienstand.Verwitwet}
                  onChange={() => {
                    const newValue = formData.familienstand === FormTypes.Familienstand.Verwitwet ? '' : FormTypes.Familienstand.Verwitwet;
                    onFieldChange('familienstand', newValue);
                  }}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                />
                <span className="text-lg text-foreground">{FormLabels.FAMILIENSTAND_LABELS[FormTypes.Familienstand.Verwitwet]}</span>
              </label>
            </div>
          </div>

          {/* Anzahl Kinder */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">{FormLabels.FIELD_LABELS.kinder}</h3>
            <select
              value={kinderAnzahl ?? ''}
              onChange={handleAnzahlKinderChange}
              className="w-full p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            >
              <option value="">{FormLabels.KINDER_UI_LABELS.selectPlaceholder}</option>
              {Array.from({ length: 11 }, (_, i) => i).map((count) => (
                <option key={count} value={count}>{count}</option>
              ))}
            </select>
          </div>

          {/* Alter der Kinder */}
          {kinderAnzahl !== null && kinderAnzahl > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">{FormLabels.KINDER_UI_LABELS.sectionHeading}</h3>
              <div className="space-y-4">
                {kinderDetails.map((child, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-foreground/10 rounded-lg">
                    <span className="text-lg font-medium text-foreground min-w-[80px]">{FormLabels.KINDER_UI_LABELS.getChildLabel(index)}:</span>

                    <div className="flex-1 relative flex items-center">
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
                        className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-9"
                      />
                      {child.alter !== null && (
                        <button
                          type="button"
                          onClick={() => handleChildAlterUpdate(index, null)}
                          className="absolute right-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                          title="Alter entfernen"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {/* Männlich */}
                      <button
                        type="button"
                        onClick={() => handleChildGeschlechtUpdate(index, FormTypes.Geschlecht.M)}
                        className={`px-3 py-1 text-sm font-medium rounded-lg border transition-colors ${
                          child.geschlecht === FormTypes.Geschlecht.M
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-foreground border-foreground/20 hover:border-blue-300'
                        }`}
                      >
                        {FormLabels.CHILD_GESCHLECHT_COMPACT_LABELS[FormTypes.Geschlecht.M]}
                      </button>
                      {/* Weiblich */}
                      <button
                        type="button"
                        onClick={() => handleChildGeschlechtUpdate(index, FormTypes.Geschlecht.W)}
                        className={`px-3 py-1 text-sm font-medium rounded-lg border transition-colors ${
                          child.geschlecht === FormTypes.Geschlecht.W
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-foreground border-foreground/20 hover:border-blue-300'
                        }`}
                      >
                        {FormLabels.CHILD_GESCHLECHT_COMPACT_LABELS[FormTypes.Geschlecht.W]}
                      </button>
                      {/* Divers */}
                      <button
                        type="button"
                        onClick={() => handleChildGeschlechtUpdate(index, FormTypes.Geschlecht.D)}
                        className={`px-3 py-1 text-sm font-medium rounded-lg border transition-colors ${
                          child.geschlecht === FormTypes.Geschlecht.D
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-foreground border-foreground/20 hover:border-blue-300'
                        }`}
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
            <h3 className="text-xl font-semibold text-foreground mb-4">Wohnsituation</h3>
            <div className="space-y-3">
              {/* Alleine option - exclusive */}
              <label
                className={`flex items-center space-x-4 p-3 rounded-lg transition-colors cursor-pointer hover:bg-foreground/5`}
              >
                <input
                  type="checkbox"
                  checked={formData.wohnsituation?.lebtAllein === true}
                  onChange={() => {
                    if (formData.wohnsituation?.lebtAllein === true) {
                      setWohnsituation(null);
                    } else {
                      setWohnsituation({ lebtAllein: true });
                    }
                  }}
                  className="w-5 h-5 focus:ring-2 flex-shrink-0 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-lg text-foreground">{FormLabels.WOHNSITUATION_UI_LABELS.lebtAllein}</span>
              </label>

              {/* Mit Partner/in */}
              <label
                className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${formData.wohnsituation?.lebtAllein === true
                  ? 'cursor-not-allowed opacity-50 bg-foreground/5'
                  : 'cursor-pointer hover:bg-foreground/5'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={formData.wohnsituation !== null && !formData.wohnsituation.lebtAllein && formData.wohnsituation.mitPartner}
                  disabled={formData.wohnsituation?.lebtAllein === true}
                  onChange={() => {
                    const w = formData.wohnsituation;
                    if (w === null || w.lebtAllein) {
                      setWohnsituation({ lebtAllein: false, mitPartner: true, mitKindern: false, beiEltern: false, inWG: false });
                    } else {
                      const newMitPartner = !w.mitPartner;
                      if (!newMitPartner && !w.mitKindern && !w.beiEltern && !w.inWG) {
                        setWohnsituation(null);
                      } else {
                        setWohnsituation({ ...w, mitPartner: newMitPartner } as FormTypes.WohnsituationData);
                      }
                    }
                  }}
                  className={`w-5 h-5 focus:ring-2 flex-shrink-0 ${formData.wohnsituation?.lebtAllein === true
                    ? 'text-gray-400 focus:ring-gray-300 cursor-not-allowed'
                    : 'text-blue-600 focus:ring-blue-500'
                    }`}
                />
                <span className={`text-lg ${formData.wohnsituation?.lebtAllein === true ? 'text-foreground/50' : 'text-foreground'}`}>
                  {FormLabels.WOHNSITUATION_UI_LABELS.mitPartner}
                </span>
              </label>

              {/* Mit Kind/ern */}
              <label
                className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${formData.wohnsituation?.lebtAllein === true
                  ? 'cursor-not-allowed opacity-50 bg-foreground/5'
                  : 'cursor-pointer hover:bg-foreground/5'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={formData.wohnsituation !== null && !formData.wohnsituation.lebtAllein && formData.wohnsituation.mitKindern}
                  disabled={formData.wohnsituation?.lebtAllein === true}
                  onChange={() => {
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
                  className={`w-5 h-5 focus:ring-2 flex-shrink-0 ${formData.wohnsituation?.lebtAllein === true
                    ? 'text-gray-400 focus:ring-gray-300 cursor-not-allowed'
                    : 'text-blue-600 focus:ring-blue-500'
                    }`}
                />
                <span className={`text-lg ${formData.wohnsituation?.lebtAllein === true ? 'text-foreground/50' : 'text-foreground'}`}>
                  {FormLabels.WOHNSITUATION_UI_LABELS.mitKindern}
                </span>
              </label>

              {/* Bei Eltern */}
              <label
                className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${formData.wohnsituation?.lebtAllein === true
                  ? 'cursor-not-allowed opacity-50 bg-foreground/5'
                  : 'cursor-pointer hover:bg-foreground/5'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={formData.wohnsituation !== null && !formData.wohnsituation.lebtAllein && formData.wohnsituation.beiEltern}
                  disabled={formData.wohnsituation?.lebtAllein === true}
                  onChange={() => {
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
                  className={`w-5 h-5 focus:ring-2 flex-shrink-0 ${formData.wohnsituation?.lebtAllein === true
                    ? 'text-gray-400 focus:ring-gray-300 cursor-not-allowed'
                    : 'text-blue-600 focus:ring-blue-500'
                    }`}
                />
                <span className={`text-lg ${formData.wohnsituation?.lebtAllein === true ? 'text-foreground/50' : 'text-foreground'}`}>
                  {FormLabels.WOHNSITUATION_UI_LABELS.beiEltern}
                </span>
              </label>

              {/* In WG */}
              <label
                className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${formData.wohnsituation?.lebtAllein === true
                  ? 'cursor-not-allowed opacity-50 bg-foreground/5'
                  : 'cursor-pointer hover:bg-foreground/5'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={formData.wohnsituation !== null && !formData.wohnsituation.lebtAllein && formData.wohnsituation.inWG}
                  disabled={formData.wohnsituation?.lebtAllein === true}
                  onChange={() => {
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
                  className={`w-5 h-5 focus:ring-2 flex-shrink-0 ${formData.wohnsituation?.lebtAllein === true
                    ? 'text-gray-400 focus:ring-gray-300 cursor-not-allowed'
                    : 'text-blue-600 focus:ring-blue-500'
                    }`}
                />
                <span className={`text-lg ${formData.wohnsituation?.lebtAllein === true ? 'text-foreground/50' : 'text-foreground'}`}>
                  {FormLabels.WOHNSITUATION_UI_LABELS.inWG}
                </span>
              </label>
            </div>
          </div>

          {/* Finanzielle Situation */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">{FormLabels.FIELD_LABELS.finanzielleSituation}</h3>
            <div className="space-y-3">
              {/* Angespannt */}
              <label className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="radio"
                  name="finanzielleSituation"
                  value={FormTypes.FinanzielleSituation.Angespannt}
                  checked={formData.finanzielleSituation === FormTypes.FinanzielleSituation.Angespannt}
                  onChange={() => {
                    const newValue = formData.finanzielleSituation === FormTypes.FinanzielleSituation.Angespannt ? null : FormTypes.FinanzielleSituation.Angespannt;
                    setNestedField?.('finanzielleSituation', newValue);
                  }}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                />
                <span className="text-lg text-foreground">{FormLabels.FINANZIELLE_SITUATION_LABELS[FormTypes.FinanzielleSituation.Angespannt]}</span>
              </label>
              {/* Ausreichend */}
              <label className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="radio"
                  name="finanzielleSituation"
                  value={FormTypes.FinanzielleSituation.Ausreichend}
                  checked={formData.finanzielleSituation === FormTypes.FinanzielleSituation.Ausreichend}
                  onChange={() => {
                    const newValue = formData.finanzielleSituation === FormTypes.FinanzielleSituation.Ausreichend ? null : FormTypes.FinanzielleSituation.Ausreichend;
                    setNestedField?.('finanzielleSituation', newValue);
                  }}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                />
                <span className="text-lg text-foreground">{FormLabels.FINANZIELLE_SITUATION_LABELS[FormTypes.FinanzielleSituation.Ausreichend]}</span>
              </label>
              {/* Stabil */}
              <label className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="radio"
                  name="finanzielleSituation"
                  value={FormTypes.FinanzielleSituation.Stabil}
                  checked={formData.finanzielleSituation === FormTypes.FinanzielleSituation.Stabil}
                  onChange={() => {
                    const newValue = formData.finanzielleSituation === FormTypes.FinanzielleSituation.Stabil ? null : FormTypes.FinanzielleSituation.Stabil;
                    setNestedField?.('finanzielleSituation', newValue);
                  }}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                />
                <span className="text-lg text-foreground">{FormLabels.FINANZIELLE_SITUATION_LABELS[FormTypes.FinanzielleSituation.Stabil]}</span>
              </label>
            </div>
          </div>

          {/* Aktuelle Krankschreibung */}
          <div>
            <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
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
                className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
              />
              <span className="text-xl font-semibold text-foreground">Aktuell krankgeschrieben</span>
            </label>

            {/* Krankschreibung durch - nur wenn krankgeschrieben */}
            {formData.krankschreibung.krankgeschrieben && (() => {
              const details = formData.krankschreibung.details;
              const selectedDurch = details?.durch ?? null;

              return (
                <div className="mt-4 ml-8 pl-4 space-y-3 border-l-2 border-blue-300">
                  <h4 className="text-lg font-medium text-foreground mb-3">Krankschreibung durch (optional)</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Hausarzt */}
                    <SelectableCard
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
                        className="w-full p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      />
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}