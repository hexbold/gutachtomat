'use client';

import * as FormTypes from '@/lib/core/form-types';
import { ArrayHandlers } from '@/hooks/useGutachtenForm';
import { useState, useEffect } from 'react';

interface WizardStep5Props {
  formData: FormTypes.Form;
  setNestedField: (fieldPath: string, value: string) => void;
  arrayHandlers: ArrayHandlers;
  confirmedSubSteps: Set<number>;
  completedSubSteps: Set<number>;
  onConfirmSubStep: (substep: number) => void;
  onCompleteSubStep: (substep: number) => void;
}

interface SubStep {
  id: number;
  title: string;
  shortTitle: string;
}

const SUB_STEPS: SubStep[] = [
  { id: 1, title: 'Lebensgeschichte', shortTitle: 'Biographie' },
  { id: 2, title: 'Krankheitsanamnese', shortTitle: 'Anamnese' },
  { id: 3, title: 'SORKC-Modell', shortTitle: 'SORKC' },
  { id: 4, title: 'Prädisponierende Faktoren', shortTitle: 'Vulnerabilität' },
  { id: 5, title: 'Auslösende & Aufrechterhaltende Bedingungen', shortTitle: 'Bedingungen' },
];

interface OptionCardProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

function OptionCard({ label, isSelected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`
        relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center
        ${isSelected
          ? 'border-blue-500 bg-accent-blue-light shadow-sm'
          : 'border-border-primary bg-surface-primary hover:border-blue-300 hover:bg-accent-blue-light/30'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-400
      `}
    >
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      )}
      <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isSelected ? 'text-blue-700' : 'text-text-secondary'}`}>
        {label}
      </span>
    </button>
  );
}

export function WizardStep5({
  formData,
  setNestedField,
  arrayHandlers,
  confirmedSubSteps,
  completedSubSteps,
  onConfirmSubStep,
  onCompleteSubStep,
}: WizardStep5Props) {
  const [currentSubStep, setCurrentSubStep] = useState(1);

  const canGoNext = currentSubStep < SUB_STEPS.length;
  const canGoPrev = currentSubStep > 1;

  // Auto-complete the last substep when user navigates to it
  useEffect(() => {
    if (currentSubStep === SUB_STEPS.length && !completedSubSteps.has(currentSubStep)) {
      onCompleteSubStep(currentSubStep);
    }
  }, [currentSubStep, completedSubSteps, onCompleteSubStep]);

  const handleConfirm = () => {
    onCompleteSubStep(currentSubStep);
    if (canGoNext) {
      const nextStep = currentSubStep + 1;
      onConfirmSubStep(nextStep);
      setCurrentSubStep(nextStep);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentSubStep(currentSubStep - 1);
    }
  };

  const handleSubStepClick = (stepNumber: number) => {
    if (confirmedSubSteps.has(stepNumber)) {
      setCurrentSubStep(stepNumber);
    }
  };

  return (
    <div className="flex gap-4">
      {/* Vertical Navigation Sidebar */}
      <div className="w-40 flex-shrink-0">
        <div className="sticky top-4 space-y-2">
          {SUB_STEPS.map((step) => {
            const isActive = currentSubStep === step.id;
            const isConfirmed = confirmedSubSteps.has(step.id) && step.id !== currentSubStep;
            const isAccessible = confirmedSubSteps.has(step.id);
            const isLocked = !isAccessible;

            return (
              <button
                key={step.id}
                onClick={() => handleSubStepClick(step.id)}
                disabled={isLocked}
                className={`
                  w-full text-left p-2.5 rounded-md border-2 transition-all duration-200
                  ${isActive
                    ? 'border-blue-500 bg-accent-blue-light shadow-sm'
                    : isConfirmed
                    ? 'border-green-500 bg-accent-green-light hover:bg-accent-green-light cursor-pointer'
                    : isLocked
                    ? 'border-border-primary bg-surface-secondary opacity-50 cursor-not-allowed'
                    : 'border-border-primary bg-surface-primary hover:border-blue-300 hover:bg-accent-blue-light/50 cursor-pointer'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                    ${isActive
                      ? 'bg-blue-500 text-white'
                      : isConfirmed
                      ? 'bg-green-500 text-white'
                      : isLocked
                      ? 'bg-surface-tertiary text-text-quaternary'
                      : 'bg-surface-tertiary text-text-tertiary'
                    }
                  `}>
                    {isConfirmed ? '✓' : isLocked ? '🔒' : step.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold leading-tight truncate ${
                      isActive ? 'text-blue-700' : isConfirmed ? 'text-green-700' : isLocked ? 'text-text-quaternary' : 'text-text-secondary'
                    }`}>
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
            {/* Step 1: Lebensgeschichte */}
            {currentSubStep === 1 && (
              <>
                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-3">A1: Kurze biographische Einordnung</h4>
                  <p className="text-sm text-text-tertiary mb-2">Geburtsjahr und Geburtsort, Familie und wichtige Bezugspersonen, Finanzielles Umfeld der Familie, Familiäres/häusliches Umfeld, Wohnsituation</p>
                  <textarea
                    value={formData.lebensgA.a1BiographischeEinordnung}
                    onChange={(e) => setNestedField('lebensgA.a1BiographischeEinordnung', e.target.value)}
                    placeholder="z.B. Geboren 1985 in Berlin, aufgewachsen in kleiner Familie mit zwei Geschwistern..."
                    rows={6}
                    className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
                  />
                </div>

                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-3">A2: Entwicklung</h4>
                  <p className="text-sm text-text-tertiary mb-2">Geburt, Kindheit und Erziehung, Kindergarten, Schule, Freundschaften, Jugend, Ausbildung/Studium, Beruf, Partnerschaften/Sexualität, Interessen/Hobbies, Prägende/traumatische Erfahrungen</p>
                  <textarea
                    value={formData.lebensgA.a2Entwicklung}
                    onChange={(e) => setNestedField('lebensgA.a2Entwicklung', e.target.value)}
                    placeholder="z.B. Unauffällige frühkindliche Entwicklung, erfolgreich Abitur abgeschlossen, Studium der BWL..."
                    rows={8}
                    className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
                  />
                </div>
              </>
            )}

            {/* Step 2: Krankheitsanamnese */}
            {currentSubStep === 2 && (
              <>
                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-3">B1: In welcher Situation kommt der Patient in Psychotherapie?</h4>
                  <p className="text-sm text-text-tertiary mb-2">Belastungssituation (anhaltend, akut), Krisensituation</p>
                  <textarea
                    value={formData.lebensgB.b1SituationPsychotherapie}
                    onChange={(e) => setNestedField('lebensgB.b1SituationPsychotherapie', e.target.value)}
                    placeholder="z.B. Patient kommt nach Kündigung und anschließender depressiver Episode..."
                    rows={4}
                    className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
                  />
                </div>

                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-3">B2: Beginn, Dauer und Verlauf der Symptomatik</h4>
                  <p className="text-sm text-text-tertiary mb-2">Beschreibung des Symptombeginns, zeitlicher Verlauf, Schwankungen</p>
                  <textarea
                    value={formData.lebensgB.b2BeginnDauerVerlauf}
                    onChange={(e) => setNestedField('lebensgB.b2BeginnDauerVerlauf', e.target.value)}
                    placeholder="z.B. Erstmaliges Auftreten der Symptome vor 2 Jahren, schleichender Beginn..."
                    rows={6}
                    className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
                  />
                </div>

                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-3">B3: Auslösende Faktoren</h4>
                  <p className="text-sm text-text-tertiary mb-2">Verlust, Trennung, Konflikte, Arbeitslosigkeit, soziale Isolation, finanzielle Not, belastende/traumatische Ereignisse, dysfunktionale Verhaltensmuster, Identitätsfindungsschwierigkeiten</p>
                  <textarea
                    value={formData.lebensgB.b3AusloesendeFaktoren}
                    onChange={(e) => setNestedField('lebensgB.b3AusloesendeFaktoren', e.target.value)}
                    placeholder="z.B. Verlust des Arbeitsplatzes, Trennung vom Partner, finanzielle Notlage..."
                    rows={8}
                    className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
                  />
                </div>
              </>
            )}

            {/* Step 3: SORKC-Modell */}
            {currentSubStep === 3 && (
              <div className="space-y-5">
                <h4 className="text-lg font-semibold text-text-primary">C1: Mikroanalyse – Vertikale Verhaltensanalyse (SORKC nach Kanfer)</h4>

                {/* Situation */}
                <div className="border-2 border-border-primary rounded-lg p-4 bg-surface-secondary/30">
                  <label className="block text-base font-semibold text-text-primary mb-3">1. Situation</label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Extern</label>
                      <input
                        type="text"
                        value={formData.lebensgC.c1SituationExtern}
                        onChange={(e) => setNestedField('lebensgC.c1SituationExtern', e.target.value)}
                        placeholder="Externe Situationsmerkmale..."
                        className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Intern</label>
                      <input
                        type="text"
                        value={formData.lebensgC.c1SituationIntern}
                        onChange={(e) => setNestedField('lebensgC.c1SituationIntern', e.target.value)}
                        placeholder="Interne Situationsmerkmale..."
                        className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Organismus */}
                <div className="border-2 border-border-primary rounded-lg p-4 bg-surface-secondary/30">
                  <label className="block text-base font-semibold text-text-primary mb-2">2. Organismus</label>
                  <input
                    type="text"
                    value={formData.lebensgC.c1Organismus}
                    onChange={(e) => setNestedField('lebensgC.c1Organismus', e.target.value)}
                    placeholder="Biologische, kognitive Variablen..."
                    className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                  />
                </div>

                {/* Reaktion */}
                <div className="border-2 border-border-primary rounded-lg p-4 bg-surface-secondary/30">
                  <label className="block text-base font-semibold text-text-primary mb-3">3. Reaktion</label>
                  <div className="space-y-3">
                    {[
                      { key: 'Kognitiv', field: 'c1ReaktionKognitiv', placeholder: 'Gedanken, Bewertungen...' },
                      { key: 'Emotional', field: 'c1ReaktionEmotional', placeholder: 'Gefühle, Emotionen...' },
                      { key: 'Physiologisch', field: 'c1ReaktionPhysiologisch', placeholder: 'Körperliche Reaktionen...' },
                      { key: 'Behavioral', field: 'c1ReaktionBehavioral', placeholder: 'Verhaltensweisen...' }
                    ].map(item => (
                      <div key={item.key}>
                        <label className="block text-sm font-medium text-text-secondary mb-1">{item.key}</label>
                        <input
                          type="text"
                          value={formData.lebensgC[item.field as keyof typeof formData.lebensgC] as string}
                          onChange={(e) => setNestedField(`lebensgC.${item.field}`, e.target.value)}
                          placeholder={item.placeholder}
                          className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Konsequenz */}
                <div className="border-2 border-border-primary rounded-lg p-4 bg-surface-secondary/30">
                  <label className="block text-base font-semibold text-text-primary mb-3">4. Konsequenz</label>

                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-text-primary mb-3">4.1 Kurzfristig</h5>
                    <div className="space-y-2">
                      {[
                        { label: 'C+', field: 'c1KonsequenzKurzfristigCPlus' },
                        { label: 'C-', field: 'c1KonsequenzKurzfristigCMinus' },
                        { label: 'C+/', field: 'c1KonsequenzKurzfristigCPlusSlash' },
                        { label: 'C-/', field: 'c1KonsequenzKurzfristigCMinusSlash' }
                      ].map(item => (
                        <div key={item.label} className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text-secondary w-12">{item.label}</span>
                          <input
                            type="text"
                            value={formData.lebensgC[item.field as keyof typeof formData.lebensgC] as string}
                            onChange={(e) => setNestedField(`lebensgC.${item.field}`, e.target.value)}
                            className="flex-1 px-2 py-1.5 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-text-primary mb-3">4.2 Langfristig</h5>
                    <div className="space-y-2">
                      {[
                        { label: 'C+', field: 'c1KonsequenzLangfristigCPlus' },
                        { label: 'C-', field: 'c1KonsequenzLangfristigCMinus' },
                        { label: 'C+/', field: 'c1KonsequenzLangfristigCPlusSlash' },
                        { label: 'C-/', field: 'c1KonsequenzLangfristigCMinusSlash' }
                      ].map(item => (
                        <div key={item.label} className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text-secondary w-12">{item.label}</span>
                          <input
                            type="text"
                            value={formData.lebensgC[item.field as keyof typeof formData.lebensgC] as string}
                            onChange={(e) => setNestedField(`lebensgC.${item.field}`, e.target.value)}
                            className="flex-1 px-2 py-1.5 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Prädisponierende Faktoren */}
            {currentSubStep === 4 && (
              <div className="space-y-5">
                <h4 className="text-lg font-semibold text-text-primary">C2.1: Prädisponierende Faktoren/Vulnerabilitäten</h4>

                {/* Kognitiv-emotionale Vulnerabilität */}
                <div className="border-2 border-border-primary rounded-lg p-4 bg-surface-secondary/30">
                  <h5 className="text-base font-bold text-text-primary mb-3">1. Kognitiv-emotionale Vulnerabilität</h5>

                  {/* Grundbedürfnisse */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-text-secondary mb-3">Grundbedürfnisse (nach Grawe)</label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {['Bindung', 'Autonomie/Kontrolle', 'Selbstwerterhöhung', 'Lustgewinn/Unlustvermeidung', 'innere Konsistenz'].map(item => (
                        <OptionCard
                          key={item}
                          label={item}
                          isSelected={formData.lebensgC.c21KognitivGrundbeduerfnisse.includes(item)}
                          onClick={() => arrayHandlers.toggle('lebensgC.c21KognitivGrundbeduerfnisse', item)}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-text-secondary whitespace-nowrap">Andere Bedürfnisse</label>
                      <input
                        type="text"
                        value={formData.lebensgC.c21KognitivGrundbeduerfnisseAndere}
                        onChange={(e) => setNestedField('lebensgC.c21KognitivGrundbeduerfnisseAndere', e.target.value)}
                        placeholder="Weitere Bedürfnisse..."
                        className="flex-1 px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                      />
                    </div>
                  </div>

                  {/* Grundannahmen */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-text-secondary mb-2">Grundannahmen</label>
                    <textarea
                      value={formData.lebensgC.c21KognitivGrundannahmen}
                      onChange={(e) => setNestedField('lebensgC.c21KognitivGrundannahmen', e.target.value)}
                      rows={3}
                      className="w-full px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                    />
                  </div>

                  {/* Pläne */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-text-secondary mb-2">Pläne, Oberpläne und Motive</label>
                    <div className="space-y-2">
                      {[
                        { label: 'Annäherungspläne', field: 'c21KognitivPlaeneAnnaehrung' },
                        { label: 'Vermeidungspläne', field: 'c21KognitivPlaeneVermeidung' },
                        { label: 'Andere', field: 'c21KognitivPlaeneAndere' }
                      ].map(item => (
                        <div key={item.label} className="flex items-center gap-2">
                          <span className="text-sm w-40">{item.label}</span>
                          <input
                            type="text"
                            value={formData.lebensgC[item.field as keyof typeof formData.lebensgC] as string}
                            onChange={(e) => setNestedField(`lebensgC.${item.field}`, e.target.value)}
                            className="flex-1 px-2 py-1.5 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Persönlichkeit */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-text-secondary mb-2">Persönlichkeit und Temperament</label>
                    <input
                      type="text"
                      value={formData.lebensgC.c21KognitivPersoenlichkeit}
                      onChange={(e) => setNestedField('lebensgC.c21KognitivPersoenlichkeit', e.target.value)}
                      className="w-full px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                    />
                  </div>

                  {/* Frühkindliche Erfahrungen */}
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-3">Frühkindliche Erfahrungen</label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {[
                        'Häufig wechselnde frühe Beziehungen',
                        'Verlust der Mutter',
                        'Mütterliche Tätigkeit im 1. Lebensjahr',
                        'Trennung der Eltern vor oder kurz nach der Geburt',
                        'Alleinerziehendes Elternteil'
                      ].map(item => (
                        <OptionCard
                          key={item}
                          label={item}
                          isSelected={formData.lebensgC.c21KognitivFruehkindlich.includes(item)}
                          onClick={() => arrayHandlers.toggle('lebensgC.c21KognitivFruehkindlich', item)}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-text-secondary whitespace-nowrap">Andere</label>
                      <input
                        type="text"
                        value={formData.lebensgC.c21KognitivFruehkindlichAndere}
                        onChange={(e) => setNestedField('lebensgC.c21KognitivFruehkindlichAndere', e.target.value)}
                        placeholder="Weitere Erfahrungen..."
                        className="flex-1 px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Biologische / genetische Vulnerabilität */}
                <div className="border-2 border-border-primary rounded-lg p-4 bg-surface-secondary/30">
                  <h5 className="text-base font-bold text-text-primary mb-3">2. Biologische / genetische Vulnerabilität</h5>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      'Psychische oder organische Störungen eines Elternteils/beider Eltern',
                      'Genetische Disposition zu Erkrankungen'
                    ].map(item => (
                      <OptionCard
                        key={item}
                        label={item}
                        isSelected={formData.lebensgC.c21BiologischGenetisch.includes(item)}
                        onClick={() => arrayHandlers.toggle('lebensgC.c21BiologischGenetisch', item)}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-text-secondary whitespace-nowrap">Andere</label>
                    <input
                      type="text"
                      value={formData.lebensgC.c21BiologischGenetischAndere}
                      onChange={(e) => setNestedField('lebensgC.c21BiologischGenetischAndere', e.target.value)}
                      placeholder="Weitere biologische Faktoren..."
                      className="flex-1 px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                    />
                  </div>
                </div>

                {/* Soziale Vulnerabilität */}
                <div className="border-2 border-border-primary rounded-lg p-4 bg-surface-secondary/30">
                  <h5 className="text-base font-bold text-text-primary mb-3">3. Soziale Vulnerabilität</h5>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      'Niedriger sozioökonomischer Status',
                      'Finanzen/Wohnen',
                      'Lerndefizite/Modelllernen',
                      'Große Familie und wenig Wohnraum',
                      'Kriminalität und Dissozialität eines Elternteils',
                      'Schlechte Kontakte zu Gleichaltrigen',
                      'Beziehungspathologie in der Familie, chronische Familienkonflikte'
                    ].map(item => (
                      <OptionCard
                        key={item}
                        label={item}
                        isSelected={formData.lebensgC.c21SozialeVulnerabilitaet.includes(item)}
                        onClick={() => arrayHandlers.toggle('lebensgC.c21SozialeVulnerabilitaet', item)}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-text-secondary whitespace-nowrap">Andere</label>
                    <input
                      type="text"
                      value={formData.lebensgC.c21SozialeVulnerabilitaetAndere}
                      onChange={(e) => setNestedField('lebensgC.c21SozialeVulnerabilitaetAndere', e.target.value)}
                      placeholder="Weitere soziale Faktoren..."
                      className="flex-1 px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Auslösende & Aufrechterhaltende Bedingungen */}
            {currentSubStep === 5 && (
              <div className="space-y-5">
                {/* C2.2: Auslösende Bedingungen */}
                <div>
                  <h4 className="text-lg font-semibold text-text-primary mb-3">C2.2: Auslösende Bedingungen</h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-2">Belastende/kritische Lebensereignisse</label>
                      <textarea
                        value={formData.lebensgC.c22BelastendeLebensereignisse}
                        onChange={(e) => setNestedField('lebensgC.c22BelastendeLebensereignisse', e.target.value)}
                        rows={3}
                        className="w-full px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-2">Kumulation von Belastungen</label>
                      <textarea
                        value={formData.lebensgC.c22KumulationVonBelastungen}
                        onChange={(e) => setNestedField('lebensgC.c22KumulationVonBelastungen', e.target.value)}
                        rows={3}
                        className="w-full px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-2">Traumatische Ereignisse</label>
                      <textarea
                        value={formData.lebensgC.c22TraumatischeEreignisse}
                        onChange={(e) => setNestedField('lebensgC.c22TraumatischeEreignisse', e.target.value)}
                        rows={3}
                        className="w-full px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-2">Andere</label>
                      <textarea
                        value={formData.lebensgC.c22Andere}
                        onChange={(e) => setNestedField('lebensgC.c22Andere', e.target.value)}
                        rows={3}
                        className="w-full px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* C2.3: Aufrechterhaltende Bedingungen */}
                <div>
                  <h4 className="text-lg font-semibold text-text-primary mb-3">C2.3: Aufrechterhaltende Bedingungen</h4>
                  <p className="text-sm text-text-tertiary mb-3">Wählen Sie die zutreffenden Faktoren aus</p>

                  <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                    {/* Summary cards for each category */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Dysfunktionale Kognitionen', field: 'c23DysfunktionaleKognitionen' },
                        { label: 'Grübeln', field: 'c23Gruebeln', value: 'Grübeln' },
                        { label: 'Dysfunktionale Emotionsregulation', field: 'c23Emotionsregulationsstrategien' },
                        { label: 'Selbstwirksamkeitserwartungen', field: 'c23Selbstwirksamkeitserwartungen' },
                        { label: 'Bewältigungsstile', field: 'c23Bewaeltigungsstile' },
                        { label: 'Selbstwertproblematik', field: 'c23Selbstwertproblematik' },
                        { label: 'Kompetenzdefizite', field: 'c23Kompetenzdefizite' },
                        { label: 'Sozialer Rückzug', field: 'c23SozialerRueckzug', value: 'Sozialer Rückzug' },
                        { label: 'Operante Verstärkung', field: 'c23OperanteVerstaerkung', value: 'Operante Verstärkung' },
                        { label: 'Teufelskreismodelle', field: 'c23Teufelskreismodelle' },
                        { label: 'Gelernte Hilflosigkeit', field: 'c23GelernteHilflosigkeit', value: 'Gelernte Hilflosigkeit' },
                        { label: 'Chronische Stressoren', field: 'c23ChronischeStressoren', value: 'Chronische Stressoren' },
                        { label: 'Abhängigkeiten', field: 'c23Abhaengigkeiten', value: 'Abhängigkeiten' },
                        { label: 'Krankheitsgewinn', field: 'c23KrankheitsgewinnInternale' }
                      ].map(item => {
                        const fieldValue = formData.lebensgC[item.field as keyof typeof formData.lebensgC] as string[];
                        const isSelected = item.value ? fieldValue.includes(item.value) : fieldValue.includes('selected');
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => {
                              if (item.value) {
                                arrayHandlers.toggle(`lebensgC.${item.field}`, item.value);
                              } else {
                                arrayHandlers.toggle(`lebensgC.${item.field}`, 'selected');
                              }
                            }}
                            className={`
                              p-2.5 rounded-lg border-2 transition-all text-left text-sm font-medium
                              ${isSelected
                                ? 'border-blue-500 bg-accent-blue-light text-blue-700'
                                : 'border-border-primary bg-surface-primary text-text-secondary hover:border-blue-300'
                              }
                            `}
                          >
                            {isSelected && <span className="mr-1">✓</span>}
                            {item.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Andere */}
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-text-secondary mb-2">Andere aufrechterhaltende Bedingungen</label>
                      <textarea
                        value={formData.lebensgC.c23Andere}
                        onChange={(e) => setNestedField('lebensgC.c23Andere', e.target.value)}
                        rows={3}
                        placeholder="Weitere Faktoren..."
                        className="w-full px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t border-border-primary">
            <button
              onClick={handlePrev}
              disabled={!canGoPrev}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg transition-all border-2
                ${canGoPrev
                  ? 'bg-surface-primary text-text-secondary hover:bg-hover-surface border-border-primary hover:border-blue-300 cursor-pointer'
                  : 'bg-surface-secondary text-text-quaternary cursor-not-allowed border-border-primary'
                }
              `}
            >
              ← Zurück
            </button>

            <div className="text-sm text-text-tertiary self-center font-medium">
              {currentSubStep} von {SUB_STEPS.length}
            </div>

            {canGoNext ? (
              <button
                onClick={handleConfirm}
                className="px-6 py-2 text-sm font-semibold rounded-lg transition-all border-2 bg-green-600 hover:bg-green-700 text-white border-green-600 hover:shadow-md cursor-pointer"
              >
                Auswahl bestätigen ✓
              </button>
            ) : (
              <div className="w-[140px]">{/* Spacer to maintain layout */}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
