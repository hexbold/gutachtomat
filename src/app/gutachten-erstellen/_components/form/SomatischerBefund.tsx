import * as FormConfig from '@/lib/core/form-config';
import * as FormTypes from '@/lib/core/form-types';
import { CollapsibleSectionHeader } from './CollapsibleSectionHeader';
import { RadioSection } from './RadioSection';
import { ArrayHandlers } from '@/hooks/useGutachtenForm';

interface SomatischerBefundProps {
  formData: FormTypes.Form;
  setNestedField: (fieldPath: string, value: string) => void;
  setNestedBoolean: (fieldPath: string, value: boolean) => void;
  arrayHandlers: ArrayHandlers;
  expansionState: FormTypes.SectionExpansionState;
  onSectionToggle: (section: keyof FormTypes.SectionExpansionState) => void;
  addIllegaleDroge: () => void;
  removeIllegaleDroge: (id: string) => void;
  updateIllegaleDroge: (id: string, field: 'suchtmittel' | 'menge' | 'mengeEinheit' | 'haeufigkeit', value: string) => void;
}

export function SomatischerBefund({ formData, setNestedField, setNestedBoolean, arrayHandlers, expansionState, onSectionToggle, addIllegaleDroge, removeIllegaleDroge, updateIllegaleDroge }: SomatischerBefundProps) {
  const isKeineMedikation = formData.somato2.keineMedikation;
  const isKeineVorbehandlung = formData.somato3.keineVorbehandlung;
  const isFamilieHaeufung = formData.somato4.familienanamnese === 'familie_haeufung';
  const isKeineSucht = formData.somato5.keineSucht;

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
          {/* Subsection 1 */}
          <RadioSection
            title="1. Somatische Vorerkrankungen (aus Konsiliarbericht!)"
            options={FormConfig.FORM_OPTIONS.somatischeVorerkrankungen}
            selectedValue={formData.somato1.somatischeVorerkrankungen}
            onValueChange={(value) => setNestedField('somato1.somatischeVorerkrankungen', value)}
            name="somatischeVorerkrankungen"
          />

          {/* Subsection 2 */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              2. Psychopharmakologische Medikation zu Behandlungsbeginn (und -ende)
            </h3>

            {/* Keine Medikation Checkbox */}
            <div className="mb-4">
              <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="checkbox"
                  checked={isKeineMedikation}
                  onChange={(e) => setNestedBoolean('somato2.keineMedikation', e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                />
                <span className="text-lg text-foreground">Keine psychopharmakologische Medikation</span>
              </label>
            </div>

            {/* Medication Details (disabled if keine Medikation) */}
            <div className={`space-y-4 ${isKeineMedikation ? 'opacity-50 pointer-events-none' : ''}`}>
              {/* Präparat */}
              <div>
                <label className="block text-lg font-medium text-foreground mb-2">
                  Präparat
                </label>
                <input
                  type="text"
                  value={formData.somato2.praeparat}
                  onChange={(e) => setNestedField('somato2.praeparat', e.target.value)}
                  disabled={isKeineMedikation}
                  placeholder="Präparat eingeben"
                  className="w-full p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg disabled:bg-gray-100"
                />
              </div>

              {/* Dosierung */}
              <div>
                <label className="block text-lg font-medium text-foreground mb-2">
                  Dosierung (mg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.somato2.dosierung}
                  onChange={(e) => setNestedField('somato2.dosierung', e.target.value)}
                  disabled={isKeineMedikation}
                  placeholder="z.B. 50"
                  className="w-full p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg disabled:bg-gray-100"
                />
              </div>

              {/* Dauer der Medikation */}
              <div>
                <label className="block text-lg font-medium text-foreground mb-3">
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
                        <span className="text-lg text-foreground">{option.label}</span>
                      </label>
                      {formData.somato2.dauerEinheit === option.id && (
                        <input
                          type="number"
                          value={formData.somato2.dauerWert}
                          onChange={(e) => setNestedField('somato2.dauerWert', e.target.value)}
                          disabled={isKeineMedikation}
                          placeholder="Anzahl"
                          className="w-32 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Verschrieben von */}
              <div>
                <label className="block text-lg font-medium text-foreground mb-3">
                  Verschrieben von
                </label>
                <div className="space-y-3">
                  {FormConfig.FORM_OPTIONS.verschriebenVon.map((option) => (
                    <div key={option.id}>
                      <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="radio"
                          name="verschriebenVon"
                          value={option.id}
                          checked={formData.somato2.verschriebenVon === option.id}
                          onChange={(e) => setNestedField('somato2.verschriebenVon', e.target.value)}
                          disabled={isKeineMedikation}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-lg text-foreground">{option.label}</span>
                      </label>
                      {option.id === 'verschr_andere' && formData.somato2.verschriebenVon === 'verschr_andere' && (
                        <input
                          type="text"
                          value={formData.somato2.verschriebenVonAndere}
                          onChange={(e) => setNestedField('somato2.verschriebenVonAndere', e.target.value)}
                          disabled={isKeineMedikation}
                          placeholder="Bitte angeben"
                          className="ml-8 mt-2 w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Subsection 3 */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              3. Psychotherapeutische/psychosomatische/psychiatrische Vorbehandlungen
            </h3>

            {/* Keine Vorbehandlung Checkbox */}
            <div className="mb-4">
              <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="checkbox"
                  checked={isKeineVorbehandlung}
                  onChange={(e) => setNestedBoolean('somato3.keineVorbehandlung', e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                />
                <span className="text-lg text-foreground">Keine vorherigen psychotherapeutischen/psychosomatischen/psychiatrischen Vorbehandlung</span>
              </label>
            </div>

            {/* Vorbehandlung Details (disabled if keine Vorbehandlung) */}
            <div className={`space-y-4 ${isKeineVorbehandlung ? 'opacity-50 pointer-events-none' : ''}`}>
              {/* Setting der Vorbehandlung */}
              <div>
                <label className="block text-lg font-medium text-foreground mb-3">
                  Setting der Vorbehandlung
                </label>
                <div className="space-y-3">
                  {FormConfig.FORM_OPTIONS.settingVorbehandlung.map((option) => (
                    <label key={option.id} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                      <input
                        type="radio"
                        name="settingVorbehandlung"
                        value={option.id}
                        checked={formData.somato3.settingVorbehandlung === option.id}
                        onChange={(e) => setNestedField('somato3.settingVorbehandlung', e.target.value)}
                        disabled={isKeineVorbehandlung}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-lg text-foreground">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Behandlungszeitraum der Vorbehandlung */}
              <div>
                <label className="block text-lg font-medium text-foreground mb-3">
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
                        <span className="text-lg text-foreground">{option.label}</span>
                      </label>
                      {formData.somato3.behandlungszeitraumEinheit === option.id && (
                        <input
                          type="number"
                          value={formData.somato3.behandlungszeitraumWert}
                          onChange={(e) => setNestedField('somato3.behandlungszeitraumWert', e.target.value)}
                          disabled={isKeineVorbehandlung}
                          placeholder="Anzahl"
                          className="w-32 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Behandlungsort der Vorbehandlung */}
              <div>
                <label className="block text-lg font-medium text-foreground mb-2">
                  Behandlungsort der Vorbehandlung
                </label>
                <input
                  type="text"
                  value={formData.somato3.behandlungsort}
                  onChange={(e) => setNestedField('somato3.behandlungsort', e.target.value)}
                  disabled={isKeineVorbehandlung}
                  placeholder="Behandlungsort eingeben"
                  className="w-full p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg disabled:bg-gray-100"
                />
              </div>

              {/* Abschlussberichte Vorbehandlungen */}
              <div>
                <label className="block text-lg font-medium text-foreground mb-3">
                  Abschlussberichte Vorbehandlungen
                </label>
                <div className="space-y-3">
                  {FormConfig.FORM_OPTIONS.abschlussberichte.map((option) => (
                    <div key={option.id}>
                      <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="radio"
                          name="abschlussberichte"
                          value={option.id}
                          checked={formData.somato3.abschlussberichte === option.id}
                          onChange={(e) => setNestedField('somato3.abschlussberichte', e.target.value)}
                          disabled={isKeineVorbehandlung}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-lg text-foreground">{option.label}</span>
                      </label>
                      {option.id === 'abschluss_andere' && formData.somato3.abschlussberichte === 'abschluss_andere' && (
                        <input
                          type="text"
                          value={formData.somato3.abschlussberichteAndere}
                          onChange={(e) => setNestedField('somato3.abschlussberichteAndere', e.target.value)}
                          disabled={isKeineVorbehandlung}
                          placeholder="Bitte angeben"
                          className="ml-8 mt-2 w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Subsection 4 */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              4. Familienanamnese
            </h3>

            <div className="space-y-3">
              {FormConfig.FORM_OPTIONS.familienanamnese.map((option) => (
                <div key={option.id}>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="radio"
                      name="familienanamnese"
                      value={option.id}
                      checked={formData.somato4.familienanamnese === option.id}
                      onChange={(e) => setNestedField('somato4.familienanamnese', e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-lg text-foreground">{option.label}</span>
                  </label>
                  {option.id === 'familie_haeufung' && isFamilieHaeufung && (
                    <input
                      type="text"
                      value={formData.somato4.familiaeHaeufungText}
                      onChange={(e) => setNestedField('somato4.familiaeHaeufungText', e.target.value)}
                      placeholder="Bitte angeben"
                      className="ml-8 mt-2 w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Subsection 5 */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              5. Suchtanamnese
            </h3>

            {/* Keine Sucht Checkbox */}
            <div className="mb-4">
              <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="checkbox"
                  checked={isKeineSucht}
                  onChange={(e) => setNestedBoolean('somato5.keineSucht', e.target.checked)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                />
                <span className="text-lg text-foreground">Kein Hinweis auf Sucht oder schädlichen Gebrauch einer Substanz</span>
              </label>
            </div>

            {/* Suchtanamnese Details (disabled if keine Sucht) */}
            <div className={`space-y-6 ${isKeineSucht ? 'opacity-50 pointer-events-none' : ''}`}>

              {/* Alkohol */}
              <div className="border border-foreground/20 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-foreground mb-3">Alkohol</h4>

                {/* Suchtmittel (multiple selection) */}
                <div className="mb-4">
                  <label className="block text-base font-medium text-foreground mb-2">
                    Suchtmittel
                  </label>
                  <div className="space-y-2">
                    {FormConfig.FORM_OPTIONS.alkoholSuchtmittel.map((option) => (
                      <label key={option.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.somato5.alkoholSuchtmittel.includes(option.id)}
                          onChange={() => arrayHandlers.toggle('somato5.alkoholSuchtmittel', option.id)}
                          disabled={isKeineSucht}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-base text-foreground">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Menge für Bier */}
                {formData.somato5.alkoholSuchtmittel.includes('alkohol_bier') && (
                  <div className="mb-4">
                    <label className="block text-base font-medium text-foreground mb-2">
                      Bier - Menge
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-foreground/70 mb-1">
                          Liter
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.somato5.bierMengeLiter}
                          onChange={(e) => setNestedField('somato5.bierMengeLiter', e.target.value)}
                          disabled={isKeineSucht}
                          placeholder="z.B. 0.5"
                          className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-foreground/70 mb-1">
                          Gläser
                        </label>
                        <input
                          type="number"
                          value={formData.somato5.bierMengeGlaeser}
                          onChange={(e) => setNestedField('somato5.bierMengeGlaeser', e.target.value)}
                          disabled={isKeineSucht}
                          placeholder="z.B. 2"
                          className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Menge für Wein */}
                {formData.somato5.alkoholSuchtmittel.includes('alkohol_wein') && (
                  <div className="mb-4">
                    <label className="block text-base font-medium text-foreground mb-2">
                      Wein - Menge
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-foreground/70 mb-1">
                          Liter
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.somato5.weinMengeLiter}
                          onChange={(e) => setNestedField('somato5.weinMengeLiter', e.target.value)}
                          disabled={isKeineSucht}
                          placeholder="z.B. 0.5"
                          className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-foreground/70 mb-1">
                          Gläser
                        </label>
                        <input
                          type="number"
                          value={formData.somato5.weinMengeGlaeser}
                          onChange={(e) => setNestedField('somato5.weinMengeGlaeser', e.target.value)}
                          disabled={isKeineSucht}
                          placeholder="z.B. 2"
                          className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Menge für Schnaps */}
                {formData.somato5.alkoholSuchtmittel.includes('alkohol_schnaps') && (
                  <div className="mb-4">
                    <label className="block text-base font-medium text-foreground mb-2">
                      Schnaps - Menge
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-foreground/70 mb-1">
                          Liter
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.somato5.schnapsMengeLiter}
                          onChange={(e) => setNestedField('somato5.schnapsMengeLiter', e.target.value)}
                          disabled={isKeineSucht}
                          placeholder="z.B. 0.5"
                          className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-foreground/70 mb-1">
                          Gläser
                        </label>
                        <input
                          type="number"
                          value={formData.somato5.schnapsMengeGlaeser}
                          onChange={(e) => setNestedField('somato5.schnapsMengeGlaeser', e.target.value)}
                          disabled={isKeineSucht}
                          placeholder="z.B. 2"
                          className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Häufigkeit */}
                <div>
                  <label className="block text-base font-medium text-foreground mb-2">
                    Häufigkeit
                  </label>
                  <div className="space-y-2">
                    {FormConfig.FORM_OPTIONS.konsumHaeufigkeit.map((option) => (
                      <label key={option.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="radio"
                          name="alkoholHaeufigkeit"
                          value={option.id}
                          checked={formData.somato5.alkoholHaeufigkeit === option.id}
                          onChange={(e) => setNestedField('somato5.alkoholHaeufigkeit', e.target.value)}
                          disabled={isKeineSucht}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-base text-foreground">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rauchen (Tabak-Konsum) */}
              <div className="border border-foreground/20 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-foreground mb-3">Rauchen (Tabak-Konsum)</h4>

                <div className="mb-4">
                  <label className="block text-base font-medium text-foreground mb-2">
                    Anzahl Zigaretten
                  </label>
                  <input
                    type="number"
                    value={formData.somato5.rauchenAnzahl}
                    onChange={(e) => setNestedField('somato5.rauchenAnzahl', e.target.value)}
                    disabled={isKeineSucht}
                    placeholder="z.B. 10"
                    className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-foreground mb-2">
                    Häufigkeit
                  </label>
                  <div className="space-y-2">
                    {FormConfig.FORM_OPTIONS.konsumHaeufigkeit.map((option) => (
                      <label key={option.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="radio"
                          name="rauchenHaeufigkeit"
                          value={option.id}
                          checked={formData.somato5.rauchenHaeufigkeit === option.id}
                          onChange={(e) => setNestedField('somato5.rauchenHaeufigkeit', e.target.value)}
                          disabled={isKeineSucht}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-base text-foreground">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* THC-Konsum */}
              <div className="border border-foreground/20 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-foreground mb-3">THC-Konsum</h4>

                <div className="mb-4">
                  <label className="block text-base font-medium text-foreground mb-2">
                    Menge (in Gramm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.somato5.thcMenge}
                    onChange={(e) => setNestedField('somato5.thcMenge', e.target.value)}
                    disabled={isKeineSucht}
                    placeholder="z.B. 2.5"
                    className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-foreground mb-2">
                    Häufigkeit
                  </label>
                  <div className="space-y-2">
                    {FormConfig.FORM_OPTIONS.konsumHaeufigkeit.map((option) => (
                      <label key={option.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="radio"
                          name="thcHaeufigkeit"
                          value={option.id}
                          checked={formData.somato5.thcHaeufigkeit === option.id}
                          onChange={(e) => setNestedField('somato5.thcHaeufigkeit', e.target.value)}
                          disabled={isKeineSucht}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-base text-foreground">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Illegale Drogen */}
              <div className="border border-foreground/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-foreground">Illegale Drogen</h4>
                  <button
                    type="button"
                    onClick={addIllegaleDroge}
                    disabled={isKeineSucht}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <span className="text-xl">+</span>
                    <span>Hinzufügen</span>
                  </button>
                </div>

                {!formData.somato5.illegaleDrogen || formData.somato5.illegaleDrogen.length === 0 ? (
                  <p className="text-sm text-foreground/60 italic">Keine illegalen Drogen hinzugefügt</p>
                ) : (
                  <div className="space-y-4">
                    {formData.somato5.illegaleDrogen.map((droge) => (
                      <div key={droge.id} className="border border-foreground/10 rounded-lg p-4 bg-foreground/5 relative">
                        <button
                          type="button"
                          onClick={() => removeIllegaleDroge(droge.id)}
                          disabled={isKeineSucht}
                          className="absolute top-2 right-2 text-red-600 hover:text-red-800 disabled:text-gray-400"
                          title="Entfernen"
                        >
                          <span className="text-xl">×</span>
                        </button>

                        <div className="mb-4">
                          <label className="block text-base font-medium text-foreground mb-2">
                            Suchtmittel
                          </label>
                          <input
                            type="text"
                            value={droge.suchtmittel}
                            onChange={(e) => updateIllegaleDroge(droge.id, 'suchtmittel', e.target.value)}
                            disabled={isKeineSucht}
                            placeholder="z.B. Kokain"
                            className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-base font-medium text-foreground mb-2">
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
                              className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            />
                            <select
                              value={droge.mengeEinheit}
                              onChange={(e) => updateIllegaleDroge(droge.id, 'mengeEinheit', e.target.value)}
                              disabled={isKeineSucht}
                              className="p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 min-w-[80px]"
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
                          <label className="block text-base font-medium text-foreground mb-2">
                            Häufigkeit
                          </label>
                          <div className="space-y-2">
                            {FormConfig.FORM_OPTIONS.konsumHaeufigkeit.map((option) => (
                              <label key={option.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                                <input
                                  type="radio"
                                  name={`illegaleHaeufigkeit-${droge.id}`}
                                  value={option.id}
                                  checked={droge.haeufigkeit === option.id}
                                  onChange={(e) => updateIllegaleDroge(droge.id, 'haeufigkeit', e.target.value)}
                                  disabled={isKeineSucht}
                                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="text-base text-foreground">{option.label}</span>
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
                <label className="block text-base font-medium text-foreground mb-2">
                  Andere Suchtform
                </label>
                <input
                  type="text"
                  value={formData.somato5.andereSuchtform}
                  onChange={(e) => setNestedField('somato5.andereSuchtform', e.target.value)}
                  disabled={isKeineSucht}
                  placeholder="z.B. Spielsucht, Medikamentenmissbrauch"
                  className="w-full p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
