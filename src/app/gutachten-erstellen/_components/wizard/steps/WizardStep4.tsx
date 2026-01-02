'use client';

import * as FormTypes from '@/lib/core/form-types';
import { ArrayHandlers } from '@/hooks/useGutachtenForm';
import * as FormConfig from '@/lib/core/form-config';

interface WizardStep4Props {
  formData: FormTypes.Form;
  setNestedField: (fieldPath: string, value: string) => void;
  setNestedBoolean: (fieldPath: string, value: boolean) => void;
  arrayHandlers: ArrayHandlers;
  addIllegaleDroge: () => void;
  removeIllegaleDroge: (id: string) => void;
  updateIllegaleDroge: (id: string, field: 'suchtmittel' | 'menge' | 'mengeEinheit' | 'haeufigkeit', value: string) => void;
  currentSubStep: number;
  onSubStepChange: (substep: number) => void;
}

interface SubStep {
  id: number;
  title: string;
  shortTitle: string;
}

const SUB_STEPS: SubStep[] = [
  { id: 1, title: 'Somatische Vorerkrankungen', shortTitle: 'Vorerkrankungen' },
  { id: 2, title: 'Psychopharmakologische Medikation', shortTitle: 'Medikation' },
  { id: 3, title: 'Vorbehandlungen', shortTitle: 'Vorbehandlungen' },
  { id: 4, title: 'Familienanamnese', shortTitle: 'Familie' },
  { id: 5, title: 'Suchtanamnese', shortTitle: 'Sucht' },
];

export function WizardStep4({
  formData,
  setNestedField,
  setNestedBoolean,
  arrayHandlers,
  addIllegaleDroge,
  removeIllegaleDroge,
  updateIllegaleDroge,
  currentSubStep,
  onSubStepChange,
}: WizardStep4Props) {
  const isKeineMedikation = formData.somato2.keineMedikation;
  const isKeineVorbehandlung = formData.somato3.keineVorbehandlung;
  const isFamilieHaeufung = formData.somato4.familienanamnese === 'familie_haeufung';
  const isKeineSucht = formData.somato5.keineSucht;

  const handleSubStepClick = (stepNumber: number) => {
    onSubStepChange(stepNumber);
  };

  return (
    <div className="flex gap-4">
      {/* Vertical Navigation Sidebar */}
      <div className="w-40 flex-shrink-0">
        <div className="sticky top-4 space-y-2">
          {SUB_STEPS.map((step) => {
            const isActive = currentSubStep === step.id;

            return (
              <button
                key={step.id}
                onClick={() => handleSubStepClick(step.id)}
                className={`
                  w-full text-left p-2.5 rounded-md border-2 transition-all duration-200 cursor-pointer
                  ${isActive
                    ? 'border-blue-500 bg-accent-blue-light shadow-sm'
                    : 'border-border-primary bg-surface-primary hover:border-blue-300 hover:bg-accent-blue-light/50'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                    ${isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-surface-tertiary text-text-tertiary'
                    }
                  `}>
                    {step.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold leading-tight truncate ${isActive ? 'text-blue-700' : 'text-text-secondary'}`}>
                      {step.shortTitle}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="space-y-6">
          {/* Substep Header */}
          <div className="mb-2">
            <h3 className="text-xl font-bold text-text-primary">
              {SUB_STEPS[currentSubStep - 1].title}
            </h3>
          </div>

          {/* Substep Content */}
          <div className="space-y-6">
            {/* Step 1: Somatische Vorerkrankungen */}
            {currentSubStep === 1 && (
              <div>
                <p className="text-sm text-text-tertiary mb-3">Informationen aus dem Konsiliarbericht</p>
                <div className="space-y-3">
                  {FormConfig.FORM_OPTIONS.somatischeVorerkrankungen.map((option) => (
                    <label key={option.id} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-accent-blue-light/20 transition-colors border-2 border-border-primary">
                      <input
                        type="radio"
                        name="somatischeVorerkrankungen"
                        value={option.id}
                        checked={formData.somato1.somatischeVorerkrankungen === option.id}
                        onChange={(e) => setNestedField('somato1.somatischeVorerkrankungen', e.target.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-base text-text-primary font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Medikation */}
            {currentSubStep === 2 && (
              <div>
                {/* Keine Medikation Checkbox */}
                <div className="mb-5">
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 border-border-primary hover:bg-accent-blue-light/20 transition-colors">
                    <input
                      type="checkbox"
                      checked={isKeineMedikation}
                      onChange={(e) => setNestedBoolean('somato2.keineMedikation', e.target.checked)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                    />
                    <span className="text-base text-text-primary font-semibold">Keine psychopharmakologische Medikation</span>
                  </label>
                </div>

                {/* Medication Details */}
                <div className={`space-y-4 ${isKeineMedikation ? 'opacity-50 pointer-events-none' : ''}`}>
                  {/* Präparat */}
                  <div>
                    <label className="block text-base font-semibold text-text-primary mb-2">
                      Präparat
                    </label>
                    <input
                      type="text"
                      value={formData.somato2.praeparat}
                      onChange={(e) => setNestedField('somato2.praeparat', e.target.value)}
                      disabled={isKeineMedikation}
                      placeholder="Präparat eingeben"
                      className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary"
                    />
                  </div>

                  {/* Dosierung */}
                  <div>
                    <label className="block text-base font-semibold text-text-primary mb-2">
                      Dosierung (mg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.somato2.dosierung}
                      onChange={(e) => setNestedField('somato2.dosierung', e.target.value)}
                      disabled={isKeineMedikation}
                      placeholder="z.B. 50"
                      className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary"
                    />
                  </div>

                  {/* Dauer der Medikation */}
                  <div>
                    <label className="block text-base font-semibold text-text-primary mb-3">
                      Dauer der Medikation
                    </label>
                    <div className="space-y-3">
                      {FormConfig.FORM_OPTIONS.dauerEinheit.map((option) => (
                        <div key={option.id} className="flex items-center space-x-4">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="dauerEinheit"
                              value={option.id}
                              checked={formData.somato2.dauerEinheit === option.id}
                              onChange={(e) => setNestedField('somato2.dauerEinheit', e.target.value)}
                              disabled={isKeineMedikation}
                              className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-base text-text-primary">{option.label}</span>
                          </label>
                          {formData.somato2.dauerEinheit === option.id && (
                            <input
                              type="number"
                              value={formData.somato2.dauerWert}
                              onChange={(e) => setNestedField('somato2.dauerWert', e.target.value)}
                              disabled={isKeineMedikation}
                              placeholder="Anzahl"
                              className="w-32 px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verschrieben von */}
                  <div>
                    <label className="block text-base font-semibold text-text-primary mb-3">
                      Verschrieben von
                    </label>
                    <div className="space-y-3">
                      {FormConfig.FORM_OPTIONS.verschriebenVon.map((option) => (
                        <div key={option.id}>
                          <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-accent-blue-light/20 transition-colors border-2 border-border-primary">
                            <input
                              type="radio"
                              name="verschriebenVon"
                              value={option.id}
                              checked={formData.somato2.verschriebenVon === option.id}
                              onChange={(e) => setNestedField('somato2.verschriebenVon', e.target.value)}
                              disabled={isKeineMedikation}
                              className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-base text-text-primary">{option.label}</span>
                          </label>
                          {option.id === 'verschr_andere' && formData.somato2.verschriebenVon === 'verschr_andere' && (
                            <input
                              type="text"
                              value={formData.somato2.verschriebenVonAndere}
                              onChange={(e) => setNestedField('somato2.verschriebenVonAndere', e.target.value)}
                              disabled={isKeineMedikation}
                              placeholder="Bitte angeben"
                              className="ml-8 mt-2 w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Vorbehandlungen */}
            {currentSubStep === 3 && (
              <div>
                {/* Keine Vorbehandlung Checkbox */}
                <div className="mb-5">
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 border-border-primary hover:bg-accent-blue-light/20 transition-colors">
                    <input
                      type="checkbox"
                      checked={isKeineVorbehandlung}
                      onChange={(e) => setNestedBoolean('somato3.keineVorbehandlung', e.target.checked)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                    />
                    <span className="text-base text-text-primary font-semibold">Keine vorherigen psychotherapeutischen/psychosomatischen/psychiatrischen Vorbehandlung</span>
                  </label>
                </div>

                {/* Vorbehandlung Details */}
                <div className={`space-y-5 ${isKeineVorbehandlung ? 'opacity-50 pointer-events-none' : ''}`}>
                  {/* Setting der Vorbehandlung */}
                  <div>
                    <label className="block text-base font-semibold text-text-primary mb-3">
                      Setting der Vorbehandlung
                    </label>
                    <div className="space-y-2">
                      {FormConfig.FORM_OPTIONS.settingVorbehandlung.map((option) => (
                        <label key={option.id} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-accent-blue-light/20 transition-colors border-2 border-border-primary">
                          <input
                            type="radio"
                            name="settingVorbehandlung"
                            value={option.id}
                            checked={formData.somato3.settingVorbehandlung === option.id}
                            onChange={(e) => setNestedField('somato3.settingVorbehandlung', e.target.value)}
                            disabled={isKeineVorbehandlung}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-base text-text-primary">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Behandlungszeitraum */}
                  <div>
                    <label className="block text-base font-semibold text-text-primary mb-3">
                      Behandlungszeitraum der Vorbehandlung
                    </label>
                    <div className="space-y-3">
                      {FormConfig.FORM_OPTIONS.behandlungszeitraumEinheit.map((option) => (
                        <div key={option.id} className="flex items-center space-x-4">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="behandlungszeitraumEinheit"
                              value={option.id}
                              checked={formData.somato3.behandlungszeitraumEinheit === option.id}
                              onChange={(e) => setNestedField('somato3.behandlungszeitraumEinheit', e.target.value)}
                              disabled={isKeineVorbehandlung}
                              className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-base text-text-primary">{option.label}</span>
                          </label>
                          {formData.somato3.behandlungszeitraumEinheit === option.id && (
                            <input
                              type="number"
                              value={formData.somato3.behandlungszeitraumWert}
                              onChange={(e) => setNestedField('somato3.behandlungszeitraumWert', e.target.value)}
                              disabled={isKeineVorbehandlung}
                              placeholder="Anzahl"
                              className="w-32 px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Behandlungsort */}
                  <div>
                    <label className="block text-base font-semibold text-text-primary mb-2">
                      Behandlungsort der Vorbehandlung
                    </label>
                    <input
                      type="text"
                      value={formData.somato3.behandlungsort}
                      onChange={(e) => setNestedField('somato3.behandlungsort', e.target.value)}
                      disabled={isKeineVorbehandlung}
                      placeholder="Behandlungsort eingeben"
                      className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary"
                    />
                  </div>

                  {/* Abschlussberichte */}
                  <div>
                    <label className="block text-base font-semibold text-text-primary mb-3">
                      Abschlussberichte Vorbehandlungen
                    </label>
                    <div className="space-y-2">
                      {FormConfig.FORM_OPTIONS.abschlussberichte.map((option) => (
                        <div key={option.id}>
                          <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-accent-blue-light/20 transition-colors border-2 border-border-primary">
                            <input
                              type="radio"
                              name="abschlussberichte"
                              value={option.id}
                              checked={formData.somato3.abschlussberichte === option.id}
                              onChange={(e) => setNestedField('somato3.abschlussberichte', e.target.value)}
                              disabled={isKeineVorbehandlung}
                              className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-base text-text-primary">{option.label}</span>
                          </label>
                          {option.id === 'abschluss_andere' && formData.somato3.abschlussberichte === 'abschluss_andere' && (
                            <input
                              type="text"
                              value={formData.somato3.abschlussberichteAndere}
                              onChange={(e) => setNestedField('somato3.abschlussberichteAndere', e.target.value)}
                              disabled={isKeineVorbehandlung}
                              placeholder="Bitte angeben"
                              className="ml-8 mt-2 w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Familienanamnese */}
            {currentSubStep === 4 && (
              <div>
                <div className="space-y-2">
                  {FormConfig.FORM_OPTIONS.familienanamnese.map((option) => (
                    <div key={option.id}>
                      <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-accent-blue-light/20 transition-colors border-2 border-border-primary">
                        <input
                          type="radio"
                          name="familienanamnese"
                          value={option.id}
                          checked={formData.somato4.familienanamnese === option.id}
                          onChange={(e) => setNestedField('somato4.familienanamnese', e.target.value)}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-base text-text-primary font-medium">{option.label}</span>
                      </label>
                      {option.id === 'familie_haeufung' && isFamilieHaeufung && (
                        <input
                          type="text"
                          value={formData.somato4.familiaeHaeufungText}
                          onChange={(e) => setNestedField('somato4.familiaeHaeufungText', e.target.value)}
                          placeholder="Bitte angeben"
                          className="ml-8 mt-2 w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Suchtanamnese */}
            {currentSubStep === 5 && (
              <div>
                {/* Keine Sucht Checkbox */}
                <div className="mb-5">
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 border-border-primary hover:bg-accent-blue-light/20 transition-colors">
                    <input
                      type="checkbox"
                      checked={isKeineSucht}
                      onChange={(e) => setNestedBoolean('somato5.keineSucht', e.target.checked)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                    />
                    <span className="text-base text-text-primary font-semibold">Kein Hinweis auf Sucht oder schädlichen Gebrauch einer Substanz</span>
                  </label>
                </div>

                {/* Suchtanamnese Details */}
                <div className={`space-y-5 ${isKeineSucht ? 'opacity-50 pointer-events-none' : ''}`}>
                  {/* Alkohol */}
                  <div className="border-2 border-border-primary rounded-lg p-4 bg-surface-secondary/30">
                    <h4 className="text-base font-bold text-text-primary mb-3">Alkohol</h4>

                    {/* Suchtmittel (multiple selection) */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-text-secondary mb-2">
                        Suchtmittel
                      </label>
                      <div className="space-y-2">
                        {FormConfig.FORM_OPTIONS.alkoholSuchtmittel.map((option) => (
                          <label key={option.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-accent-blue-light/20 transition-colors">
                            <input
                              type="checkbox"
                              checked={formData.somato5.alkoholSuchtmittel.includes(option.id)}
                              onChange={() => arrayHandlers.toggle('somato5.alkoholSuchtmittel', option.id)}
                              disabled={isKeineSucht}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-sm text-text-primary">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Menge für Bier */}
                    {formData.somato5.alkoholSuchtmittel.includes('alkohol_bier') && (
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-text-secondary mb-2">
                          Bier - Menge
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-text-tertiary mb-1">
                              Liter
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={formData.somato5.bierMengeLiter}
                              onChange={(e) => setNestedField('somato5.bierMengeLiter', e.target.value)}
                              disabled={isKeineSucht}
                              placeholder="z.B. 0.5"
                              className="w-full px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-text-tertiary mb-1">
                              Gläser
                            </label>
                            <input
                              type="number"
                              value={formData.somato5.bierMengeGlaeser}
                              onChange={(e) => setNestedField('somato5.bierMengeGlaeser', e.target.value)}
                              disabled={isKeineSucht}
                              placeholder="z.B. 2"
                              className="w-full px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Menge für Wein */}
                    {formData.somato5.alkoholSuchtmittel.includes('alkohol_wein') && (
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-text-secondary mb-2">
                          Wein - Menge
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-text-tertiary mb-1">
                              Liter
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={formData.somato5.weinMengeLiter}
                              onChange={(e) => setNestedField('somato5.weinMengeLiter', e.target.value)}
                              disabled={isKeineSucht}
                              placeholder="z.B. 0.5"
                              className="w-full px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-text-tertiary mb-1">
                              Gläser
                            </label>
                            <input
                              type="number"
                              value={formData.somato5.weinMengeGlaeser}
                              onChange={(e) => setNestedField('somato5.weinMengeGlaeser', e.target.value)}
                              disabled={isKeineSucht}
                              placeholder="z.B. 2"
                              className="w-full px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Menge für Schnaps */}
                    {formData.somato5.alkoholSuchtmittel.includes('alkohol_schnaps') && (
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-text-secondary mb-2">
                          Schnaps - Menge
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-text-tertiary mb-1">
                              Liter
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={formData.somato5.schnapsMengeLiter}
                              onChange={(e) => setNestedField('somato5.schnapsMengeLiter', e.target.value)}
                              disabled={isKeineSucht}
                              placeholder="z.B. 0.5"
                              className="w-full px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-text-tertiary mb-1">
                              Gläser
                            </label>
                            <input
                              type="number"
                              value={formData.somato5.schnapsMengeGlaeser}
                              onChange={(e) => setNestedField('somato5.schnapsMengeGlaeser', e.target.value)}
                              disabled={isKeineSucht}
                              placeholder="z.B. 2"
                              className="w-full px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Häufigkeit */}
                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-2">
                        Häufigkeit
                      </label>
                      <div className="space-y-2">
                        {FormConfig.FORM_OPTIONS.konsumHaeufigkeit.map((option) => (
                          <label key={option.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-accent-blue-light/20 transition-colors">
                            <input
                              type="radio"
                              name="alkoholHaeufigkeit"
                              value={option.id}
                              checked={formData.somato5.alkoholHaeufigkeit === option.id}
                              onChange={(e) => setNestedField('somato5.alkoholHaeufigkeit', e.target.value)}
                              disabled={isKeineSucht}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-sm text-text-primary">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rauchen (Tabak-Konsum) */}
                  <div className="border-2 border-border-primary rounded-lg p-4 bg-surface-secondary/30">
                    <h4 className="text-base font-bold text-text-primary mb-3">Rauchen (Tabak-Konsum)</h4>

                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-text-secondary mb-2">
                        Anzahl Zigaretten
                      </label>
                      <input
                        type="number"
                        value={formData.somato5.rauchenAnzahl}
                        onChange={(e) => setNestedField('somato5.rauchenAnzahl', e.target.value)}
                        disabled={isKeineSucht}
                        placeholder="z.B. 10"
                        className="w-full px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-2">
                        Häufigkeit
                      </label>
                      <div className="space-y-2">
                        {FormConfig.FORM_OPTIONS.konsumHaeufigkeit.map((option) => (
                          <label key={option.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-accent-blue-light/20 transition-colors">
                            <input
                              type="radio"
                              name="rauchenHaeufigkeit"
                              value={option.id}
                              checked={formData.somato5.rauchenHaeufigkeit === option.id}
                              onChange={(e) => setNestedField('somato5.rauchenHaeufigkeit', e.target.value)}
                              disabled={isKeineSucht}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-sm text-text-primary">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* THC-Konsum */}
                  <div className="border-2 border-border-primary rounded-lg p-4 bg-surface-secondary/30">
                    <h4 className="text-base font-bold text-text-primary mb-3">THC-Konsum</h4>

                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-text-secondary mb-2">
                        Menge (in Gramm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.somato5.thcMenge}
                        onChange={(e) => setNestedField('somato5.thcMenge', e.target.value)}
                        disabled={isKeineSucht}
                        placeholder="z.B. 2.5"
                        className="w-full px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-2">
                        Häufigkeit
                      </label>
                      <div className="space-y-2">
                        {FormConfig.FORM_OPTIONS.konsumHaeufigkeit.map((option) => (
                          <label key={option.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-accent-blue-light/20 transition-colors">
                            <input
                              type="radio"
                              name="thcHaeufigkeit"
                              value={option.id}
                              checked={formData.somato5.thcHaeufigkeit === option.id}
                              onChange={(e) => setNestedField('somato5.thcHaeufigkeit', e.target.value)}
                              disabled={isKeineSucht}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-sm text-text-primary">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Illegale Drogen */}
                  <div className="border-2 border-border-primary rounded-lg p-4 bg-surface-secondary/30">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-base font-bold text-text-primary">Illegale Drogen</h4>
                      <button
                        type="button"
                        onClick={addIllegaleDroge}
                        disabled={isKeineSucht}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-surface-tertiary disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                      >
                        <span className="text-lg">+</span>
                        <span>Hinzufügen</span>
                      </button>
                    </div>

                    {!formData.somato5.illegaleDrogen || formData.somato5.illegaleDrogen.length === 0 ? (
                      <p className="text-sm text-text-tertiary italic">Keine illegalen Drogen hinzugefügt</p>
                    ) : (
                      <div className="space-y-3">
                        {formData.somato5.illegaleDrogen.map((droge) => (
                          <div key={droge.id} className="border-2 border-border-secondary rounded-lg p-3 bg-surface-primary relative">
                            <button
                              type="button"
                              onClick={() => removeIllegaleDroge(droge.id)}
                              disabled={isKeineSucht}
                              className="absolute top-2 right-2 text-red-600 hover:text-red-800 disabled:text-text-quaternary"
                              title="Entfernen"
                            >
                              <span className="text-xl">×</span>
                            </button>

                            <div className="mb-3">
                              <label className="block text-sm font-semibold text-text-secondary mb-1">
                                Suchtmittel
                              </label>
                              <input
                                type="text"
                                value={droge.suchtmittel}
                                onChange={(e) => updateIllegaleDroge(droge.id, 'suchtmittel', e.target.value)}
                                disabled={isKeineSucht}
                                placeholder="z.B. Kokain"
                                className="w-full px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary"
                              />
                            </div>

                            <div className="mb-3">
                              <label className="block text-sm font-semibold text-text-secondary mb-1">
                                Menge
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  step="0.1"
                                  value={droge.menge}
                                  onChange={(e) => updateIllegaleDroge(droge.id, 'menge', e.target.value)}
                                  disabled={isKeineSucht}
                                  placeholder="z.B. 1.5"
                                  className="flex-1 px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary"
                                />
                                <select
                                  value={droge.mengeEinheit}
                                  onChange={(e) => updateIllegaleDroge(droge.id, 'mengeEinheit', e.target.value)}
                                  disabled={isKeineSucht}
                                  className="px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary min-w-[80px]"
                                >
                                  <option value="">Einheit</option>
                                  {FormConfig.FORM_OPTIONS.mengeEinheit.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                      {unit.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-text-secondary mb-2">
                                Häufigkeit
                              </label>
                              <div className="space-y-1">
                                {FormConfig.FORM_OPTIONS.konsumHaeufigkeit.map((option) => (
                                  <label key={option.id} className="flex items-center space-x-2 cursor-pointer p-1.5 rounded-lg hover:bg-accent-blue-light/20 transition-colors">
                                    <input
                                      type="radio"
                                      name={`illegaleHaeufigkeit-${droge.id}`}
                                      value={option.id}
                                      checked={droge.haeufigkeit === option.id}
                                      onChange={(e) => updateIllegaleDroge(droge.id, 'haeufigkeit', e.target.value)}
                                      disabled={isKeineSucht}
                                      className="w-3 h-3 text-blue-600 focus:ring-blue-500 focus:ring-2"
                                    />
                                    <span className="text-xs text-text-primary">{option.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Andere Suchtform */}
                  <div>
                    <label className="block text-base font-semibold text-text-primary mb-2">
                      Andere Suchtform
                    </label>
                    <input
                      type="text"
                      value={formData.somato5.andereSuchtform}
                      onChange={(e) => setNestedField('somato5.andereSuchtform', e.target.value)}
                      disabled={isKeineSucht}
                      placeholder="z.B. Spielsucht, Medikamentenmissbrauch"
                      className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary disabled:bg-surface-secondary"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
