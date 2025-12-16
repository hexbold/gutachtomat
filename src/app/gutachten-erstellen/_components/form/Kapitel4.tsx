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

            {/* B1: In welcher Situation kommt der Patient in Psychotherapie? */}
            <div className="mb-6">
              <label className="block text-base font-medium text-foreground mb-2">
                B1: In welcher Situation kommt der Patient in Psychotherapie?
              </label>
              <textarea
                value={formData.lebensgB.b1SituationPsychotherapie}
                onChange={(e) => setNestedField('lebensgB.b1SituationPsychotherapie', e.target.value)}
                placeholder="z.B. Belastungssituation (anhaltend, akut), Krisensituation"
                rows={4}
                className="w-full p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              />
            </div>

            {/* B2: Beginn, Dauer und Verlauf der Symptomatik */}
            <div className="mb-6">
              <label className="block text-base font-medium text-foreground mb-2">
                B2: Beginn, Dauer und Verlauf der Symptomatik
              </label>
              <textarea
                value={formData.lebensgB.b2BeginnDauerVerlauf}
                onChange={(e) => setNestedField('lebensgB.b2BeginnDauerVerlauf', e.target.value)}
                placeholder="z.B. Beschreibung des Symptombeginns, zeitlicher Verlauf, Schwankungen"
                rows={6}
                className="w-full p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              />
            </div>

            {/* B3: Auslösende Faktoren */}
            <div className="mb-6">
              <label className="block text-base font-medium text-foreground mb-2">
                B3: Auslösende Faktoren
              </label>
              <textarea
                value={formData.lebensgB.b3AusloesendeFaktoren}
                onChange={(e) => setNestedField('lebensgB.b3AusloesendeFaktoren', e.target.value)}
                placeholder="z.B. Auslöser der aktuell vorliegenden Symptomatik: Verlust von Angehörigen/Freunden, Trennung, Scheidung, Partnerlosigkeit, Akute oder anhaltende Konflikte (Arbeit, Partner, Familie, Erbschaft), Arbeitslosigkeit, Arbeitsplatzwechsel, Umzug, Anhaltende soziale Isolation, Finanzielle Not, Belastendes oder traumatisches Ereignis, Anhaltende dysfunktionale Verhaltensmuster, Anhaltende Identitätsfindungsschwierigkeiten"
                rows={8}
                className="w-full p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              />
            </div>
          </div>

          {/* Subsection C: Funktionales Bedingungsmodell */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              C. Funktionales Bedingungsmodell
            </h3>

            {/* C1: Funktionales Bedingungsmodell */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-foreground mb-4">
                C1: Mikroanalyse – Vertikale Verhaltensanalyse (SORKC nach Kanfer)
              </h4>

              {/* 1. Situation */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  1. Situation
                </label>
                <div className="ml-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground w-24">Extern</label>
                    <input
                      type="text"
                      value={formData.lebensgC.c1SituationExtern}
                      onChange={(e) => setNestedField('lebensgC.c1SituationExtern', e.target.value)}
                      className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground w-24">Intern</label>
                    <input
                      type="text"
                      value={formData.lebensgC.c1SituationIntern}
                      onChange={(e) => setNestedField('lebensgC.c1SituationIntern', e.target.value)}
                      className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Organismus */}
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-foreground w-32">2. Organismus</label>
                  <input
                    type="text"
                    value={formData.lebensgC.c1Organismus}
                    onChange={(e) => setNestedField('lebensgC.c1Organismus', e.target.value)}
                    className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 3. Reaktion */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  3. Reaktion
                </label>
                <div className="ml-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground w-32">Kognitiv</label>
                    <input
                      type="text"
                      value={formData.lebensgC.c1ReaktionKognitiv}
                      onChange={(e) => setNestedField('lebensgC.c1ReaktionKognitiv', e.target.value)}
                      className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground w-32">Emotional</label>
                    <input
                      type="text"
                      value={formData.lebensgC.c1ReaktionEmotional}
                      onChange={(e) => setNestedField('lebensgC.c1ReaktionEmotional', e.target.value)}
                      className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground w-32">Physiologisch</label>
                    <input
                      type="text"
                      value={formData.lebensgC.c1ReaktionPhysiologisch}
                      onChange={(e) => setNestedField('lebensgC.c1ReaktionPhysiologisch', e.target.value)}
                      className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground w-32">Behavioral</label>
                    <input
                      type="text"
                      value={formData.lebensgC.c1ReaktionBehavioral}
                      onChange={(e) => setNestedField('lebensgC.c1ReaktionBehavioral', e.target.value)}
                      className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Konsequenz */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  4. Konsequenz
                </label>

                {/* 4.1 Kurzfristig */}
                <div className="ml-4 mb-3">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    4.1 Kurzfristig
                  </label>
                  <div className="ml-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-foreground w-16">C+</label>
                      <input
                        type="text"
                        value={formData.lebensgC.c1KonsequenzKurzfristigCPlus}
                        onChange={(e) => setNestedField('lebensgC.c1KonsequenzKurzfristigCPlus', e.target.value)}
                        className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-foreground w-16">C-</label>
                      <input
                        type="text"
                        value={formData.lebensgC.c1KonsequenzKurzfristigCMinus}
                        onChange={(e) => setNestedField('lebensgC.c1KonsequenzKurzfristigCMinus', e.target.value)}
                        className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-foreground w-16">C+/</label>
                      <input
                        type="text"
                        value={formData.lebensgC.c1KonsequenzKurzfristigCPlusSlash}
                        onChange={(e) => setNestedField('lebensgC.c1KonsequenzKurzfristigCPlusSlash', e.target.value)}
                        className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-foreground w-16">C-/</label>
                      <input
                        type="text"
                        value={formData.lebensgC.c1KonsequenzKurzfristigCMinusSlash}
                        onChange={(e) => setNestedField('lebensgC.c1KonsequenzKurzfristigCMinusSlash', e.target.value)}
                        className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 4.2 Langfristig */}
                <div className="ml-4">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    4.2 Langfristig
                  </label>
                  <div className="ml-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-foreground w-16">C+</label>
                      <input
                        type="text"
                        value={formData.lebensgC.c1KonsequenzLangfristigCPlus}
                        onChange={(e) => setNestedField('lebensgC.c1KonsequenzLangfristigCPlus', e.target.value)}
                        className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-foreground w-16">C-</label>
                      <input
                        type="text"
                        value={formData.lebensgC.c1KonsequenzLangfristigCMinus}
                        onChange={(e) => setNestedField('lebensgC.c1KonsequenzLangfristigCMinus', e.target.value)}
                        className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-foreground w-16">C+/</label>
                      <input
                        type="text"
                        value={formData.lebensgC.c1KonsequenzLangfristigCPlusSlash}
                        onChange={(e) => setNestedField('lebensgC.c1KonsequenzLangfristigCPlusSlash', e.target.value)}
                        className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-foreground w-16">C-/</label>
                      <input
                        type="text"
                        value={formData.lebensgC.c1KonsequenzLangfristigCMinusSlash}
                        onChange={(e) => setNestedField('lebensgC.c1KonsequenzLangfristigCMinusSlash', e.target.value)}
                        className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subsection C2: Makroanalyse */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              C2: Makroanalyse – Horizontale Verhaltensanalyse
            </h3>

            {/* C2.1: Prädisponierende Faktoren/Vulnerabilitäten */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-foreground mb-4">
                C2.1 Prädisponierende Faktoren/Vulnerabilitäten
              </h4>

              {/* 1. Kognitiv-emotionale Vulnerabilität */}
              <div className="mb-6">
                <h5 className="text-base font-semibold text-foreground mb-3">
                  1. Kognitiv-emotionale Vulnerabilität
                </h5>

                {/* 1.1 Elemente aus Plananalyse und Kognitionsanalyse */}
                <div className="ml-4 mb-4">
                  <h6 className="text-sm font-semibold text-foreground mb-3">
                    1.1 Elemente aus Plananalyse und Kognitionsanalyse
                  </h6>

                  {/* Grundbedürfnisse (nach Grawe) */}
                  <div className="ml-4 mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Grundbedürfnisse (nach Grawe)
                    </label>
                    <div className="ml-4 space-y-2">
                      {['Bindung', 'Autonomie/Kontrolle', 'Selbstwerterhöhung', 'Lustgewinn/Unlustvermeidung', 'innere Konsistenz'].map(item => (
                        <label key={item} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.lebensgC.c21KognitivGrundbeduerfnisse.includes(item)}
                            onChange={() => arrayHandlers.toggle('lebensgC.c21KognitivGrundbeduerfnisse', item)}
                            className="rounded border-foreground/20"
                          />
                          <span className="text-sm">{item}</span>
                        </label>
                      ))}
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Andere Bedürfnisse</span>
                        <input
                          type="text"
                          value={formData.lebensgC.c21KognitivGrundbeduerfnisseAndere}
                          onChange={(e) => setNestedField('lebensgC.c21KognitivGrundbeduerfnisseAndere', e.target.value)}
                          className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Grundannahmen */}
                  <div className="ml-4 mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Grundannahmen
                    </label>
                    <textarea
                      value={formData.lebensgC.c21KognitivGrundannahmen}
                      onChange={(e) => setNestedField('lebensgC.c21KognitivGrundannahmen', e.target.value)}
                      rows={3}
                      className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Pläne, Oberpläne und Motive */}
                  <div className="ml-4 mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Pläne, Oberpläne und Motive
                    </label>
                    <div className="ml-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-foreground w-40">Annäherungspläne</label>
                        <input
                          type="text"
                          value={formData.lebensgC.c21KognitivPlaeneAnnaehrung}
                          onChange={(e) => setNestedField('lebensgC.c21KognitivPlaeneAnnaehrung', e.target.value)}
                          className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-foreground w-40">Vermeidungspläne</label>
                        <input
                          type="text"
                          value={formData.lebensgC.c21KognitivPlaeneVermeidung}
                          onChange={(e) => setNestedField('lebensgC.c21KognitivPlaeneVermeidung', e.target.value)}
                          className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-foreground w-40">Andere</label>
                        <input
                          type="text"
                          value={formData.lebensgC.c21KognitivPlaeneAndere}
                          onChange={(e) => setNestedField('lebensgC.c21KognitivPlaeneAndere', e.target.value)}
                          className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1.2 Persönlichkeit und Temperament */}
                <div className="ml-4 mb-4">
                  <h6 className="text-sm font-semibold text-foreground mb-2">
                    1.2 Persönlichkeit und Temperament
                  </h6>
                  <input
                    type="text"
                    value={formData.lebensgC.c21KognitivPersoenlichkeit}
                    onChange={(e) => setNestedField('lebensgC.c21KognitivPersoenlichkeit', e.target.value)}
                    className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* 1.3 Frühkindliche Erfahrungen */}
                <div className="ml-4 mb-4">
                  <h6 className="text-sm font-semibold text-foreground mb-2">
                    1.3 Frühkindliche Erfahrungen
                  </h6>
                  <div className="ml-4 space-y-2">
                    {[
                      'Häufig wechselnde frühe Beziehungen',
                      'Verlust der Mutter',
                      'Mütterliche Tätigkeit im 1. Lebensjahr',
                      'Trennung der Eltern vor oder kurz nach der Geburt',
                      'Alleinerziehendes Elternteil'
                    ].map(item => (
                      <label key={item} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.lebensgC.c21KognitivFruehkindlich.includes(item)}
                          onChange={() => arrayHandlers.toggle('lebensgC.c21KognitivFruehkindlich', item)}
                          className="rounded border-foreground/20"
                        />
                        <span className="text-sm">{item}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Andere</span>
                      <input
                        type="text"
                        value={formData.lebensgC.c21KognitivFruehkindlichAndere}
                        onChange={(e) => setNestedField('lebensgC.c21KognitivFruehkindlichAndere', e.target.value)}
                        className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Biologische / genetische Vulnerabilität */}
              <div className="mb-6">
                <h5 className="text-base font-semibold text-foreground mb-3">
                  2. Biologische / genetische Vulnerabilität
                </h5>
                <div className="ml-4 space-y-2">
                  {[
                    'Psychische oder organische Störungen eines Elternteils/beider Eltern',
                    'Genetische Disposition zu Erkrankungen'
                  ].map(item => (
                    <label key={item} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.lebensgC.c21BiologischGenetisch.includes(item)}
                        onChange={() => arrayHandlers.toggle('lebensgC.c21BiologischGenetisch', item)}
                        className="rounded border-foreground/20"
                      />
                      <span className="text-sm">{item}</span>
                    </label>
                  ))}
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Andere</span>
                    <input
                      type="text"
                      value={formData.lebensgC.c21BiologischGenetischAndere}
                      onChange={(e) => setNestedField('lebensgC.c21BiologischGenetischAndere', e.target.value)}
                      className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Soziale Vulnerabilität */}
              <div className="mb-6">
                <h5 className="text-base font-semibold text-foreground mb-3">
                  3. Soziale Vulnerabilität
                </h5>
                <div className="ml-4 space-y-2">
                  {[
                    'Niedriger sozioökonomischer Status',
                    'Finanzen/Wohnen',
                    'Lerndefizite/Modelllernen',
                    'Große Familie und wenig Wohnraum',
                    'Kriminalität und Dissozialität eines Elternteils',
                    'Schlechte Kontakte zu Gleichaltrigen',
                    'Beziehungspathologie in der Familie, chronische Familienkonflikte'
                  ].map(item => (
                    <label key={item} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.lebensgC.c21SozialeVulnerabilitaet.includes(item)}
                        onChange={() => arrayHandlers.toggle('lebensgC.c21SozialeVulnerabilitaet', item)}
                        className="rounded border-foreground/20"
                      />
                      <span className="text-sm">{item}</span>
                    </label>
                  ))}
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Andere</span>
                    <input
                      type="text"
                      value={formData.lebensgC.c21SozialeVulnerabilitaetAndere}
                      onChange={(e) => setNestedField('lebensgC.c21SozialeVulnerabilitaetAndere', e.target.value)}
                      className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* C2.2: Auslösende Bedingungen */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-foreground mb-4">
                C2.2 Auslösende Bedingungen
              </h4>

              {/* Belastende/kritische Lebensereignisse */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Belastende/kritische Lebensereignisse
                </label>
                <textarea
                  value={formData.lebensgC.c22BelastendeLebensereignisse}
                  onChange={(e) => setNestedField('lebensgC.c22BelastendeLebensereignisse', e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Kumulation von Belastungen */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Kumulation von Belastungen
                </label>
                <textarea
                  value={formData.lebensgC.c22KumulationVonBelastungen}
                  onChange={(e) => setNestedField('lebensgC.c22KumulationVonBelastungen', e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Traumatische Ereignisse */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Traumatische Ereignisse
                </label>
                <textarea
                  value={formData.lebensgC.c22TraumatischeEreignisse}
                  onChange={(e) => setNestedField('lebensgC.c22TraumatischeEreignisse', e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Andere */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Andere
                </label>
                <textarea
                  value={formData.lebensgC.c22Andere}
                  onChange={(e) => setNestedField('lebensgC.c22Andere', e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* C2.3: Aufrechterhaltende Bedingungen */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-foreground mb-4">
                C2.3 Aufrechterhaltende Bedingungen
              </h4>

              <div className="space-y-3">
                {/* 1. Dysfunktionale Kognitionen */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.lebensgC.c23DysfunktionaleKognitionen.includes('selected')}
                      onChange={() => arrayHandlers.toggle('lebensgC.c23DysfunktionaleKognitionen', 'selected')}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0"
                    />
                    <span className="text-base font-medium text-foreground">Dysfunktionale Kognitionen</span>
                  </label>
                  <div className="ml-8 space-y-2 mt-2">
                    <div className={`flex items-center gap-2 ${!formData.lebensgC.c23DysfunktionaleKognitionen.includes('selected') ? 'opacity-40' : ''}`}>
                      <span className="text-sm w-64">Denkfehler / Denkverzerrungen</span>
                      <input
                        type="text"
                        value={formData.lebensgC.c23DenkfehlerText}
                        onChange={(e) => setNestedField('lebensgC.c23DenkfehlerText', e.target.value)}
                        disabled={!formData.lebensgC.c23DysfunktionaleKognitionen.includes('selected')}
                        className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-foreground/5 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className={`flex items-center gap-2 ${!formData.lebensgC.c23DysfunktionaleKognitionen.includes('selected') ? 'opacity-40' : ''}`}>
                      <span className="text-sm w-64">Negative automatische Gedanken</span>
                      <input
                        type="text"
                        value={formData.lebensgC.c23AutomatischeGedankenText}
                        onChange={(e) => setNestedField('lebensgC.c23AutomatischeGedankenText', e.target.value)}
                        disabled={!formData.lebensgC.c23DysfunktionaleKognitionen.includes('selected')}
                        className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-foreground/5 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className={`flex items-center gap-2 ${!formData.lebensgC.c23DysfunktionaleKognitionen.includes('selected') ? 'opacity-40' : ''}`}>
                      <span className="text-sm w-64">Internal stabile Misserfolgsattributionen</span>
                      <input
                        type="text"
                        value={formData.lebensgC.c23MisserfolgsattributionenText}
                        onChange={(e) => setNestedField('lebensgC.c23MisserfolgsattributionenText', e.target.value)}
                        disabled={!formData.lebensgC.c23DysfunktionaleKognitionen.includes('selected')}
                        className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-foreground/5 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Grübeln */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.lebensgC.c23Gruebeln.includes('Grübeln')}
                      onChange={() => arrayHandlers.toggle('lebensgC.c23Gruebeln', 'Grübeln')}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0"
                    />
                    <span className="text-base font-medium text-foreground">Grübeln</span>
                  </label>
                </div>

                {/* 3. Dysfunktionale Emotionsregulationsstrategien */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.lebensgC.c23Emotionsregulationsstrategien.includes('selected')}
                      onChange={() => arrayHandlers.toggle('lebensgC.c23Emotionsregulationsstrategien', 'selected')}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0"
                    />
                    <span className="text-base font-medium text-foreground">Dysfunktionale Emotionsregulationsstrategien (selbstschädigendes oder impulsives Verhalten)</span>
                  </label>
                  <div className={`ml-8 space-y-2 mt-2 ${!formData.lebensgC.c23Emotionsregulationsstrategien.includes('selected') ? 'opacity-40' : ''}`}>
                    {[
                      'Selbstverletzendes Verhalten',
                      'Bulimisches Erbrechen',
                      'Riskantes Sexualverhalten',
                      'Riskantes Fahrverhalten',
                      'Substanzmissbrauch'
                    ].map(item => (
                      <label key={item} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.lebensgC.c23Emotionsregulationsstrategien.includes(item)}
                          onChange={() => arrayHandlers.toggle('lebensgC.c23Emotionsregulationsstrategien', item)}
                          disabled={!formData.lebensgC.c23Emotionsregulationsstrategien.includes('selected')}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 disabled:cursor-not-allowed"
                        />
                        <span className="text-sm text-foreground">{item}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-2 p-2">
                      <input
                        type="checkbox"
                        checked={formData.lebensgC.c23Emotionsregulationsstrategien.includes('Andere')}
                        onChange={() => arrayHandlers.toggle('lebensgC.c23Emotionsregulationsstrategien', 'Andere')}
                        disabled={!formData.lebensgC.c23Emotionsregulationsstrategien.includes('selected')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 disabled:cursor-not-allowed"
                      />
                      <span className="text-sm">Andere</span>
                      {formData.lebensgC.c23Emotionsregulationsstrategien.includes('Andere') && (
                        <input
                          type="text"
                          value={formData.lebensgC.c23EmotionsregulationsstrategienAndere}
                          onChange={(e) => setNestedField('lebensgC.c23EmotionsregulationsstrategienAndere', e.target.value)}
                          className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Dysfunktionale Situations- und Selbstwirksamkeitserwartungen */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.lebensgC.c23Selbstwirksamkeitserwartungen.includes('selected')}
                      onChange={() => arrayHandlers.toggle('lebensgC.c23Selbstwirksamkeitserwartungen', 'selected')}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0"
                    />
                    <span className="text-base font-medium text-foreground">Dysfunktionale Situations- und Selbstwirksamkeitserwartungen</span>
                  </label>
                  <div className="ml-8 space-y-2 mt-2">
                    <div className={`flex items-center gap-2 ${!formData.lebensgC.c23Selbstwirksamkeitserwartungen.includes('selected') ? 'opacity-40' : ''}`}>
                      <span className="text-sm w-64">Situations-Kompetenz-Erwartungen</span>
                      <input
                        type="text"
                        value={formData.lebensgC.c23SituationsKompetenzText}
                        onChange={(e) => setNestedField('lebensgC.c23SituationsKompetenzText', e.target.value)}
                        disabled={!formData.lebensgC.c23Selbstwirksamkeitserwartungen.includes('selected')}
                        className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-foreground/5 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className={`flex items-center gap-2 ${!formData.lebensgC.c23Selbstwirksamkeitserwartungen.includes('selected') ? 'opacity-40' : ''}`}>
                      <span className="text-sm w-64">Situations-Reaktions-Erwartungen</span>
                      <input
                        type="text"
                        value={formData.lebensgC.c23SituationsReaktionText}
                        onChange={(e) => setNestedField('lebensgC.c23SituationsReaktionText', e.target.value)}
                        disabled={!formData.lebensgC.c23Selbstwirksamkeitserwartungen.includes('selected')}
                        className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-foreground/5 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className={`flex items-center gap-2 ${!formData.lebensgC.c23Selbstwirksamkeitserwartungen.includes('selected') ? 'opacity-40' : ''}`}>
                      <span className="text-sm w-64">Situations-Ergebnis-Erwartungen</span>
                      <input
                        type="text"
                        value={formData.lebensgC.c23SituationsErgebnisText}
                        onChange={(e) => setNestedField('lebensgC.c23SituationsErgebnisText', e.target.value)}
                        disabled={!formData.lebensgC.c23Selbstwirksamkeitserwartungen.includes('selected')}
                        className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-foreground/5 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Dysfunktionale Bewältigungsstile */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.lebensgC.c23Bewaeltigungsstile.includes('selected')}
                      onChange={() => arrayHandlers.toggle('lebensgC.c23Bewaeltigungsstile', 'selected')}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0"
                    />
                    <span className="text-base font-medium text-foreground">Dysfunktionale Bewältigungsstile</span>
                  </label>
                  <div className={`ml-8 space-y-2 mt-2 ${!formData.lebensgC.c23Bewaeltigungsstile.includes('selected') ? 'opacity-40' : ''}`}>
                    {['Erdulden', 'Vermeidung (aktiv/passiv)', 'Überkompensation'].map(item => (
                      <label key={item} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.lebensgC.c23Bewaeltigungsstile.includes(item)}
                          onChange={() => arrayHandlers.toggle('lebensgC.c23Bewaeltigungsstile', item)}
                          disabled={!formData.lebensgC.c23Bewaeltigungsstile.includes('selected')}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 disabled:cursor-not-allowed"
                        />
                        <span className="text-sm text-foreground">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 6. Selbstwertproblematik */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.lebensgC.c23Selbstwertproblematik.includes('selected')}
                      onChange={() => arrayHandlers.toggle('lebensgC.c23Selbstwertproblematik', 'selected')}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0"
                    />
                    <span className="text-base font-medium text-foreground">Selbstwertproblematik</span>
                  </label>
                  <div className={`ml-8 space-y-2 mt-2 ${!formData.lebensgC.c23Selbstwertproblematik.includes('selected') ? 'opacity-40' : ''}`}>
                    {['Negatives Selbstkonzept', 'Selbstabwertung', 'Selbsthass'].map(item => (
                      <label key={item} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.lebensgC.c23Selbstwertproblematik.includes(item)}
                          onChange={() => arrayHandlers.toggle('lebensgC.c23Selbstwertproblematik', item)}
                          disabled={!formData.lebensgC.c23Selbstwertproblematik.includes('selected')}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 disabled:cursor-not-allowed"
                        />
                        <span className="text-sm text-foreground">{item}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-2 p-2">
                      <input
                        type="checkbox"
                        checked={formData.lebensgC.c23Selbstwertproblematik.includes('Andere')}
                        onChange={() => arrayHandlers.toggle('lebensgC.c23Selbstwertproblematik', 'Andere')}
                        disabled={!formData.lebensgC.c23Selbstwertproblematik.includes('selected')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 disabled:cursor-not-allowed"
                      />
                      <span className="text-sm">Andere</span>
                      {formData.lebensgC.c23Selbstwertproblematik.includes('Andere') && (
                        <input
                          type="text"
                          value={formData.lebensgC.c23SelbstwertproblematikAndere}
                          onChange={(e) => setNestedField('lebensgC.c23SelbstwertproblematikAndere', e.target.value)}
                          className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* 7. Kompetenzdefizite */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.lebensgC.c23Kompetenzdefizite.includes('selected')}
                      onChange={() => arrayHandlers.toggle('lebensgC.c23Kompetenzdefizite', 'selected')}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0"
                    />
                    <span className="text-base font-medium text-foreground">Kompetenzdefizite</span>
                  </label>
                  <div className={`ml-8 space-y-2 mt-2 ${!formData.lebensgC.c23Kompetenzdefizite.includes('selected') ? 'opacity-40' : ''}`}>
                    {[
                      'Defizite in der Aufnahme und Aufrechterhaltung sozialer Kontakte',
                      'Dysfunktionale Beziehungsgestaltung und intime Beziehungsfähigkeit',
                      'Defizite in der Selbstregulation, im Gesundheits- und Entspannungsverhalten',
                      'Selbstwahrnehmungsdefizite',
                      'Mangelnde Fähigkeit zur Selbstverstärkung',
                      'Mangelnde Frustrationstoleranz',
                      'Distressintoleranz',
                      'Wahrnehmungsabwehr von Emotionen und Defizite im Emotionsausdruck',
                      'Selbstüberforderung',
                      'Defizite in der Autonomieentwicklung',
                      'Diskrepanz zwischen Anspruchsniveau und Leistungsvermögen',
                      'Generalisiertes Reaktanzverhalten'
                    ].map(item => (
                      <label key={item} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.lebensgC.c23Kompetenzdefizite.includes(item)}
                          onChange={() => arrayHandlers.toggle('lebensgC.c23Kompetenzdefizite', item)}
                          disabled={!formData.lebensgC.c23Kompetenzdefizite.includes('selected')}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 disabled:cursor-not-allowed"
                        />
                        <span className="text-sm text-foreground">{item}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-2 p-2">
                      <input
                        type="checkbox"
                        checked={formData.lebensgC.c23Kompetenzdefizite.includes('Andere')}
                        onChange={() => arrayHandlers.toggle('lebensgC.c23Kompetenzdefizite', 'Andere')}
                        disabled={!formData.lebensgC.c23Kompetenzdefizite.includes('selected')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 disabled:cursor-not-allowed"
                      />
                      <span className="text-sm">Andere</span>
                      {formData.lebensgC.c23Kompetenzdefizite.includes('Andere') && (
                        <input
                          type="text"
                          value={formData.lebensgC.c23KompetenzdefiziteAndere}
                          onChange={(e) => setNestedField('lebensgC.c23KompetenzdefiziteAndere', e.target.value)}
                          className="flex-1 p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* 8. Sozialer Rückzug */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.lebensgC.c23SozialerRueckzug.includes('Sozialer Rückzug')}
                      onChange={() => arrayHandlers.toggle('lebensgC.c23SozialerRueckzug', 'Sozialer Rückzug')}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0"
                    />
                    <span className="text-base font-medium text-foreground">Sozialer Rückzug</span>
                  </label>
                </div>

                {/* 9. Operante Verstärkung */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.lebensgC.c23OperanteVerstaerkung.includes('Operante Verstärkung')}
                      onChange={() => arrayHandlers.toggle('lebensgC.c23OperanteVerstaerkung', 'Operante Verstärkung')}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0"
                    />
                    <span className="text-base font-medium text-foreground">Operante Verstärkung des Problemverhaltens (z.B. Vermeidungsverhalten)</span>
                  </label>
                </div>

                {/* 10. Teufelskreismodelle */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.lebensgC.c23Teufelskreismodelle.includes('selected')}
                      onChange={() => arrayHandlers.toggle('lebensgC.c23Teufelskreismodelle', 'selected')}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0"
                    />
                    <span className="text-base font-medium text-foreground">Teufelskreismodelle</span>
                  </label>
                  <div className={`ml-8 space-y-2 mt-2 ${!formData.lebensgC.c23Teufelskreismodelle.includes('selected') ? 'opacity-40' : ''}`}>
                    {[
                      'Angststörungen',
                      'Essstörungen',
                      'Zwangserkrankungen',
                      'Depressive Erkrankungen',
                      'Interaktioneller Teufelskreis'
                    ].map(item => (
                      <label key={item} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.lebensgC.c23Teufelskreismodelle.includes(item)}
                          onChange={() => arrayHandlers.toggle('lebensgC.c23Teufelskreismodelle', item)}
                          disabled={!formData.lebensgC.c23Teufelskreismodelle.includes('selected')}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 disabled:cursor-not-allowed"
                        />
                        <span className="text-sm text-foreground">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 11. Gelernte Hilflosigkeit */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.lebensgC.c23GelernteHilflosigkeit.includes('Gelernte Hilflosigkeit')}
                      onChange={() => arrayHandlers.toggle('lebensgC.c23GelernteHilflosigkeit', 'Gelernte Hilflosigkeit')}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0"
                    />
                    <span className="text-base font-medium text-foreground">Gelernte Hilflosigkeit</span>
                  </label>
                </div>

                {/* 12. Chronische Stressoren */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.lebensgC.c23ChronischeStressoren.includes('Chronische Stressoren')}
                      onChange={() => arrayHandlers.toggle('lebensgC.c23ChronischeStressoren', 'Chronische Stressoren')}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0"
                    />
                    <span className="text-base font-medium text-foreground">Chronische Stressoren und hohes Anspannungsniveau</span>
                  </label>
                </div>

                {/* 13. Abhängigkeiten */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.lebensgC.c23Abhaengigkeiten.includes('Abhängigkeiten')}
                      onChange={() => arrayHandlers.toggle('lebensgC.c23Abhaengigkeiten', 'Abhängigkeiten')}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0"
                    />
                    <span className="text-base font-medium text-foreground">Körperliche oder psychische Abhängigkeiten</span>
                  </label>
                </div>

                {/* 14. Krankheitsgewinn */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.lebensgC.c23KrankheitsgewinnInternale.includes('selected') || formData.lebensgC.c23KrankheitsgewinnExternale.includes('selected')}
                      onChange={() => {
                        const hasSelected = formData.lebensgC.c23KrankheitsgewinnInternale.includes('selected') || formData.lebensgC.c23KrankheitsgewinnExternale.includes('selected');
                        if (hasSelected) {
                          arrayHandlers.toggle('lebensgC.c23KrankheitsgewinnInternale', 'selected');
                          arrayHandlers.toggle('lebensgC.c23KrankheitsgewinnExternale', 'selected');
                        } else {
                          arrayHandlers.toggle('lebensgC.c23KrankheitsgewinnInternale', 'selected');
                          arrayHandlers.toggle('lebensgC.c23KrankheitsgewinnExternale', 'selected');
                        }
                      }}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0"
                    />
                    <span className="text-base font-medium text-foreground">Krankheitsgewinn bzw. Krankheitsfolgen als Verstärker</span>
                  </label>
                  <div className={`ml-8 space-y-3 mt-2 ${!(formData.lebensgC.c23KrankheitsgewinnInternale.includes('selected') || formData.lebensgC.c23KrankheitsgewinnExternale.includes('selected')) ? 'opacity-40' : ''}`}>
                    {/* Internale Funktionalität */}
                    <div>
                      <h6 className="text-sm font-semibold text-foreground mb-2">
                        Internale Funktionalität
                      </h6>
                      <div className="ml-4 space-y-2">
                        {[
                          'Selbstwertgefühlstabilisierung',
                          'Identitätssicherung / Aufrechterhaltung eines Selbstbildes',
                          'Unlustvermeidung (Abwehr von Affekten und Stimmungen wie Scham, Trauer, Wut)',
                          'Selbststimulation'
                        ].map(item => (
                          <label key={item} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                            <input
                              type="checkbox"
                              checked={formData.lebensgC.c23KrankheitsgewinnInternale.includes(item)}
                              onChange={() => arrayHandlers.toggle('lebensgC.c23KrankheitsgewinnInternale', item)}
                              disabled={!formData.lebensgC.c23KrankheitsgewinnInternale.includes('selected')}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 disabled:cursor-not-allowed"
                            />
                            <span className="text-sm text-foreground">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Externale/interaktionelle Funktionalität */}
                    <div>
                      <h6 className="text-sm font-semibold text-foreground mb-2">
                        Externale/interaktionelle Funktionalität
                      </h6>
                      <div className="ml-4 space-y-2">
                        {[
                          'Zuwendung und Aufmerksamkeit',
                          'Bindungsabsicherung',
                          'Abgrenzung',
                          'Kontrolle über soziales Umfeld (z.B. Partner, Familie, Freunde)',
                          'Anstrengungsvermeidung und Aufgabenentlastung',
                          'Erreichen von Vorteilen (Rente und Versicherung)'
                        ].map(item => (
                          <label key={item} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                            <input
                              type="checkbox"
                              checked={formData.lebensgC.c23KrankheitsgewinnExternale.includes(item)}
                              onChange={() => arrayHandlers.toggle('lebensgC.c23KrankheitsgewinnExternale', item)}
                              disabled={!formData.lebensgC.c23KrankheitsgewinnExternale.includes('selected')}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 disabled:cursor-not-allowed"
                            />
                            <span className="text-sm text-foreground">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 15. Andere */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Andere
                  </label>
                  <textarea
                    value={formData.lebensgC.c23Andere}
                    onChange={(e) => setNestedField('lebensgC.c23Andere', e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Weitere aufrechterhaltende Bedingungen..."
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
