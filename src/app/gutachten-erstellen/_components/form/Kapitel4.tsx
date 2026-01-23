import * as FormTypes from '@/lib/core/form-types';
import { CollapsibleSectionHeader } from './CollapsibleSectionHeader';

interface Kapitel4Props {
  formData: FormTypes.Form;
  setNestedField: (fieldPath: string, value: string) => void;
  arrayHandlers: {
    toggle: (fieldPath: string, value: string) => void;
  };
  expansionState: FormTypes.SectionExpansionState;
  onSectionToggle: (section: keyof FormTypes.SectionExpansionState) => void;
}

export function Kapitel4({ formData, setNestedField, arrayHandlers, expansionState, onSectionToggle }: Kapitel4Props) {
  return (
    <section className="mb-12">
      <CollapsibleSectionHeader
        title="Kapitel 4: Relevante Angaben zur Lebensgeschichte"
        isExpanded={expansionState.kapitel4}
        onToggle={() => onSectionToggle('kapitel4')}
      />
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        expansionState.kapitel4 ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className={`space-y-8 transition-all duration-200 ${
          expansionState.kapitel4 ? 'transform translate-y-0 delay-100' : 'transform -translate-y-2'
        }`}>
          {/* Subsection A: Relevante Angaben zur Lebensgeschichte */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              A. Relevante Angaben zur Lebensgeschichte
            </h3>

            {/* A1: Kurze biographische Einordnung */}
            <div className="mb-6">
              <label className="block text-base font-medium text-foreground mb-2">
                A1: Kurze biographische Einordnung
              </label>
              <textarea
                value={formData.lebensgA.a1BiographischeEinordnung}
                onChange={(e) => setNestedField('lebensgA.a1BiographischeEinordnung', e.target.value)}
                placeholder="z.B. Geburtsjahr und Geburtsort, Familie und wichtige Bezugspersonen, Finanzielles Umfeld der Familie, Familiäres/häusliches Umfeld, Wohnsituation"
                rows={6}
                className="w-full p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              />
            </div>

            {/* A2: Entwicklung */}
            <div className="mb-6">
              <label className="block text-base font-medium text-foreground mb-2">
                A2: Entwicklung
              </label>
              <textarea
                value={formData.lebensgA.a2Entwicklung}
                onChange={(e) => setNestedField('lebensgA.a2Entwicklung', e.target.value)}
                placeholder="z.B. Geburt, Kindheit und Erziehung, Kindergarten, Schule, Freundschaften, Jugend, Ausbildung/Studium, Beruf, Partnerschaften/Sexualität, Interessen/Hobbies, Prägende/traumatische Erfahrungen"
                rows={8}
                className="w-full p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              />
            </div>
          </div>

          {/* Subsection B: Relevante Angaben zur Krankheitsanamnese */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              B. Relevante Angaben zur Krankheitsanamnese
            </h3>

            {/* In welcher Situation kommt der Patient in Psychotherapie? */}
            <div className="mb-6 border border-foreground/20 rounded-lg p-4">
              <h4 className="text-base font-medium text-foreground mb-3">In welcher Situation kommt der Patient in Psychotherapie?</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Anhaltende Belastungssituation</label>
                  <textarea
                    rows={1}
                    value={formData.krankheitsanamnese.anhaltendeBelastungssituation}
                    onChange={(e) => setNestedField('krankheitsanamnese.anhaltendeBelastungssituation', e.target.value)}
                    onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                    placeholder="z.B. seit Jahren bestehender Arbeitsplatzkonflikt..."
                    className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Akute Belastungssituation</label>
                  <textarea
                    rows={1}
                    value={formData.krankheitsanamnese.akuteBelastungssituation}
                    onChange={(e) => setNestedField('krankheitsanamnese.akuteBelastungssituation', e.target.value)}
                    onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                    placeholder="z.B. kürzliche Trennung vom Partner..."
                    className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Krisensituation</label>
                  <textarea
                    rows={1}
                    value={formData.krankheitsanamnese.krisensituation}
                    onChange={(e) => setNestedField('krankheitsanamnese.krisensituation', e.target.value)}
                    onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                    placeholder="z.B. akute suizidale Krise nach Jobverlust..."
                    className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Andere</label>
                  <textarea
                    rows={1}
                    value={formData.krankheitsanamnese.situationAndere}
                    onChange={(e) => setNestedField('krankheitsanamnese.situationAndere', e.target.value)}
                    onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                    placeholder="Sonstige Situationsbeschreibung..."
                    className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Beginn, Dauer und Verlauf der Symptomatik */}
            <div className="mb-6 border border-foreground/20 rounded-lg p-4">
              <h4 className="text-base font-medium text-foreground mb-3">Beginn, Dauer und Verlauf der Symptomatik</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Erstauftreten der Symptome</label>
                  <textarea
                    rows={1}
                    value={formData.krankheitsanamnese.erstauftretenSymptome}
                    onChange={(e) => setNestedField('krankheitsanamnese.erstauftretenSymptome', e.target.value)}
                    onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                    placeholder="z.B. erstmals im Alter von 25 Jahren..."
                    className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Beginn der aktuellen Symptome seit</label>
                  <textarea
                    rows={1}
                    value={formData.krankheitsanamnese.beginnAktuelleSymptome}
                    onChange={(e) => setNestedField('krankheitsanamnese.beginnAktuelleSymptome', e.target.value)}
                    onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                    placeholder="z.B. seit ca. 6 Monaten..."
                    className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Dauer der aktuellen Symptome</label>
                  <textarea
                    rows={1}
                    value={formData.krankheitsanamnese.dauerAktuelleSymptome}
                    onChange={(e) => setNestedField('krankheitsanamnese.dauerAktuelleSymptome', e.target.value)}
                    onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                    placeholder="z.B. seit etwa einem halben Jahr anhaltend..."
                    className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Verlauf der aktuellen Symptome</label>
                  <textarea
                    rows={1}
                    value={formData.krankheitsanamnese.verlaufAktuelleSymptome}
                    onChange={(e) => setNestedField('krankheitsanamnese.verlaufAktuelleSymptome', e.target.value)}
                    onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                    placeholder="z.B. chronisch-progredient mit Exazerbationen..."
                    className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Auslöser der Symptomatik */}
            <div className="mb-6 border border-foreground/20 rounded-lg p-4">
              <h4 className="text-base font-medium text-foreground mb-3">Auslöser der Symptomatik (nur kurze Angabe!)</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Auslöser der Symptomatik in der Vergangenheit</label>
                  <textarea
                    rows={1}
                    value={formData.krankheitsanamnese.ausloeserVergangenheit}
                    onChange={(e) => setNestedField('krankheitsanamnese.ausloeserVergangenheit', e.target.value)}
                    onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                    placeholder="z.B. frühere Trennungserfahrungen..."
                    className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">Auslöser aktuell vorliegenden Symptomatik</label>
                  <textarea
                    rows={1}
                    value={formData.krankheitsanamnese.ausloeserAktuell}
                    onChange={(e) => setNestedField('krankheitsanamnese.ausloeserAktuell', e.target.value)}
                    onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                    placeholder="z.B. Kündigung und Partnerschaftskonflikt..."
                    className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
