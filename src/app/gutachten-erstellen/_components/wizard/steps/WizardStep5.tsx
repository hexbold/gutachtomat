'use client';

import { useState } from 'react';
import * as FormTypes from '@/lib/core/form-types';
import * as FormLabels from '@/lib/core/form-labels';
import { ArrayHandlers, LebensgeschichteHandlers, FunktionalesBedingungsmodellHandlers, MakroanalyseHandlers } from '@/hooks/useGutachtenForm';
import { LebensgeschichteSubstep } from '../../../_components/form/lebensgeschichte';
import {
  KognitiveFaktorenModal,
  EmotionaleFaktorenModal,
  VerhaltensbezogeneFaktorenModal,
  SelbstwertbezogeneFaktorenModal,
  KompetenzdefiziteModal,
  SubstanzabhaengigkeitModal,
  WeitereFaktorenModal
} from '../../shared/makroanalyse-modals/aufrechterhaltende';
import {
  StoerungsmodellPickerModal,
  StoerungsmodellCard,
  StoerungsmodellEditModal
} from '../../shared/makroanalyse-modals/stoerungsmodelle';

interface WizardStep5Props {
  formData: FormTypes.Form;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
  arrayHandlers: ArrayHandlers;
  lebensgeschichteHandlers: LebensgeschichteHandlers;
  funktionalesBedingungsmodellHandlers: FunktionalesBedingungsmodellHandlers;
  makroanalyseHandlers: MakroanalyseHandlers;
  currentSubStep: number;
  onSubStepChange: (substep: number) => void;
}

interface SubStep {
  id: number;
  title: string;
  shortTitle: string;
}

const SUB_STEPS: SubStep[] = [
  { id: 1, title: 'Lebensgeschichte', shortTitle: 'Lebensgeschichte' },
  { id: 2, title: 'Krankheitsanamnese', shortTitle: 'Krankheitsanamnese' },
  { id: 3, title: 'SORKC-Modell', shortTitle: 'SORKC' },
  { id: 4, title: 'Makroanalyse', shortTitle: 'Makroanalyse' },
  { id: 5, title: 'Prädisponierende Faktoren', shortTitle: 'Prädisponierende Faktoren' },
  { id: 6, title: 'Auslösende Bedingungen', shortTitle: 'Auslösende Bedingungen' },
  { id: 7, title: 'Aufrechterhaltende Bedingungen', shortTitle: 'Aufrechterhaltende Bedingungen' },
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

// Delete button component for SORKC entries
function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1.5 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}

// SORKC Entry Card component
function SorkcEntryCard({
  entry,
  onUpdate,
  onRemove,
}: {
  entry: FormTypes.SorkcEntry;
  onUpdate: (updates: Partial<Omit<FormTypes.SorkcEntry, 'id'>>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="bg-surface-primary border-2 border-border-primary rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h5 className="text-base font-semibold text-text-primary">SORKC-Analyse</h5>
        <DeleteButton onClick={onRemove} />
      </div>

      <div className="space-y-4">
        {/* Titel / Reaktion */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Reaktion/Diagnose (z.B. &quot;depressiven Reaktion mit Rückzug&quot;)</label>
          <input
            type="text"
            value={entry.titel}
            onChange={(e) => onUpdate({ titel: e.target.value })}
            placeholder="Welche Reaktion wird analysiert?"
            className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
          />
        </div>

        {/* Typische Stimuli */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Typische Stimuli</label>
          <input
            type="text"
            value={entry.typischeStimuli}
            onChange={(e) => onUpdate({ typischeStimuli: e.target.value })}
            placeholder="z.B. Alleine Zuhause nach der Arbeit, Gedanken an frühere Beziehungen..."
            className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
          />
        </div>

        {/* Situation */}
        <div className="border-2 border-border-primary rounded-lg p-3 bg-surface-secondary/30">
          <label className="block text-sm font-semibold text-text-primary mb-2">S: Situation</label>
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Extern</label>
              <input
                type="text"
                value={entry.situationExtern}
                onChange={(e) => onUpdate({ situationExtern: e.target.value })}
                placeholder="Externe Situationsmerkmale..."
                className="w-full px-2 py-1.5 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Intern</label>
              <input
                type="text"
                value={entry.situationIntern}
                onChange={(e) => onUpdate({ situationIntern: e.target.value })}
                placeholder="Interne Situationsmerkmale..."
                className="w-full px-2 py-1.5 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary text-sm"
              />
            </div>
          </div>
        </div>

        {/* Organismus */}
        <div className="border-2 border-border-primary rounded-lg p-3 bg-surface-secondary/30">
          <label className="block text-sm font-semibold text-text-primary mb-2">O: Organismus</label>
          <input
            type="text"
            value={entry.organismus}
            onChange={(e) => onUpdate({ organismus: e.target.value })}
            placeholder="Biologische, kognitive Variablen (z.B. Grundannahmen)..."
            className="w-full px-2 py-1.5 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary text-sm"
          />
        </div>

        {/* Reaktion */}
        <div className="border-2 border-border-primary rounded-lg p-3 bg-surface-secondary/30">
          <label className="block text-sm font-semibold text-text-primary mb-2">R: Reaktion</label>
          <div className="space-y-2">
            {[
              { key: 'reaktionKognitiv', label: 'Kognitiv', placeholder: 'Gedanken, Bewertungen...' },
              { key: 'reaktionEmotional', label: 'Emotional', placeholder: 'Gefühle, Emotionen...' },
              { key: 'reaktionPhysiologisch', label: 'Physiologisch', placeholder: 'Körperliche Reaktionen...' },
              { key: 'reaktionBehavioral', label: 'Behavioral', placeholder: 'Verhaltensweisen...' }
            ].map(item => (
              <div key={item.key}>
                <label className="block text-xs font-medium text-text-secondary mb-1">{item.label}</label>
                <input
                  type="text"
                  value={entry[item.key as keyof FormTypes.SorkcEntry] as string}
                  onChange={(e) => onUpdate({ [item.key]: e.target.value })}
                  placeholder={item.placeholder}
                  className="w-full px-2 py-1.5 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Konsequenz */}
        <div className="border-2 border-border-primary rounded-lg p-3 bg-surface-secondary/30">
          <label className="block text-sm font-semibold text-text-primary mb-2">C: Konsequenz</label>

          <div className="mb-3">
            <h6 className="text-xs font-semibold text-text-primary mb-2">Kurzfristig</h6>
            <div className="space-y-2">
              {[
                { key: 'konsequenzKurzfristigPositiveVerstaerkung', label: 'Positive Verstärkung (C+)', desc: 'Eintreten angenehmer Konsequenz' },
                { key: 'konsequenzKurzfristigNegativeVerstaerkung', label: 'Negative Verstärkung (C-/)', desc: 'Ausbleiben unangenehmer Konsequenz' },
                { key: 'konsequenzKurzfristigPositiveBestrafung', label: 'Positive Bestrafung (C-)', desc: 'Eintreten unangenehmer Konsequenz' },
                { key: 'konsequenzKurzfristigNegativeBestrafung', label: 'Negative Bestrafung (C+/)', desc: 'Ausbleiben angenehmer Konsequenz' }
              ].map(item => (
                <div key={item.key} className="flex items-center gap-2">
                  <span className="text-xs font-medium text-text-secondary w-44 flex-shrink-0" title={item.desc}>{item.label}</span>
                  <input
                    type="text"
                    value={entry[item.key as keyof FormTypes.SorkcEntry] as string}
                    onChange={(e) => onUpdate({ [item.key]: e.target.value })}
                    className="flex-1 px-2 py-1 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h6 className="text-xs font-semibold text-text-primary mb-2">Langfristig</h6>
            <div className="space-y-2">
              {[
                { key: 'konsequenzLangfristigPositiveVerstaerkung', label: 'Positive Verstärkung (C+)', desc: 'Eintreten angenehmer Konsequenz' },
                { key: 'konsequenzLangfristigNegativeVerstaerkung', label: 'Negative Verstärkung (C-/)', desc: 'Ausbleiben unangenehmer Konsequenz' },
                { key: 'konsequenzLangfristigPositiveBestrafung', label: 'Positive Bestrafung (C-)', desc: 'Eintreten unangenehmer Konsequenz' },
                { key: 'konsequenzLangfristigNegativeBestrafung', label: 'Negative Bestrafung (C+/)', desc: 'Ausbleiben angenehmer Konsequenz' }
              ].map(item => (
                <div key={item.key} className="flex items-center gap-2">
                  <span className="text-xs font-medium text-text-secondary w-44 flex-shrink-0" title={item.desc}>{item.label}</span>
                  <input
                    type="text"
                    value={entry[item.key as keyof FormTypes.SorkcEntry] as string}
                    onChange={(e) => onUpdate({ [item.key]: e.target.value })}
                    className="flex-1 px-2 py-1 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type AufrechterhaltendModalId = 'kognitiv' | 'emotional' | 'verhaltens' | 'selbstwert' | 'kompetenz' | 'substanz' | 'weitere' | null;

export function WizardStep5({
  formData,
  setNestedField,
  arrayHandlers,
  lebensgeschichteHandlers,
  funktionalesBedingungsmodellHandlers,
  makroanalyseHandlers,
  currentSubStep,
  onSubStepChange,
}: WizardStep5Props) {
  const [openModal, setOpenModal] = useState<AufrechterhaltendModalId>(null);
  const [stoerungsmodellPickerOpen, setStoerungsmodellPickerOpen] = useState<FormTypes.StoerungsmodellZuordnung | null>(null);
  const [editingStoerungsmodell, setEditingStoerungsmodell] = useState<FormTypes.StoerungsmodellEntry | null>(null);

  const handleSubStepClick = (stepNumber: number) => {
    onSubStepChange(stepNumber);
  };

  const aufrechterhaltende = formData.funktionalesBedingungsmodell.aufrechterhaltendeBedingungen;
  const praedisponierend = formData.funktionalesBedingungsmodell.praedisponierendeFaktoren;
  const ausloesend = formData.funktionalesBedingungsmodell.ausloesendeBedingungen;

  // Get Störungsmodelle for a specific section
  const getModelleForZuordnung = (zuordnung: FormTypes.StoerungsmodellZuordnung): FormTypes.StoerungsmodellEntry[] => {
    switch (zuordnung) {
      case FormTypes.StoerungsmodellZuordnung.Praedisponierend:
        return praedisponierend.stoerungsmodelle;
      case FormTypes.StoerungsmodellZuordnung.Ausloesend:
        return ausloesend.stoerungsmodelle;
      case FormTypes.StoerungsmodellZuordnung.Aufrechterhaltend:
        return aufrechterhaltende.stoerungsmodelle;
      default:
        return [];
    }
  };

  const handleAddStoerungsmodell = (typ: FormTypes.StoerungsmodellTyp) => {
    if (stoerungsmodellPickerOpen) {
      makroanalyseHandlers.addStoerungsmodell(stoerungsmodellPickerOpen, typ);
      setStoerungsmodellPickerOpen(null);
    }
  };

  const handleEditStoerungsmodell = (entry: FormTypes.StoerungsmodellEntry) => {
    setEditingStoerungsmodell(entry);
  };

  const handleUpdateStoerungsmodell = (updates: Partial<FormTypes.StoerungsmodellData>) => {
    if (editingStoerungsmodell) {
      makroanalyseHandlers.updateStoerungsmodell(editingStoerungsmodell.id, updates);
      // Compute updated entry locally to avoid reading from stale state
      setEditingStoerungsmodell({
        ...editingStoerungsmodell,
        modell: { ...editingStoerungsmodell.modell, ...updates } as FormTypes.StoerungsmodellData
      });
    }
  };

  return (
    <>
      {/* Störungsmodell Modals */}
      <StoerungsmodellPickerModal
        isOpen={stoerungsmodellPickerOpen !== null}
        onClose={() => setStoerungsmodellPickerOpen(null)}
        zuordnung={stoerungsmodellPickerOpen || FormTypes.StoerungsmodellZuordnung.Aufrechterhaltend}
        onSelect={handleAddStoerungsmodell}
      />
      <StoerungsmodellEditModal
        isOpen={editingStoerungsmodell !== null}
        onClose={() => setEditingStoerungsmodell(null)}
        entry={editingStoerungsmodell}
        onUpdate={handleUpdateStoerungsmodell}
      />

      {/* Aufrechterhaltende Modals */}
      <KognitiveFaktorenModal
        isOpen={openModal === 'kognitiv'}
        onClose={() => setOpenModal(null)}
        data={aufrechterhaltende.kognitiveFaktoren}
        onUpdate={makroanalyseHandlers.updateKognitiveFaktoren}
      />
      <EmotionaleFaktorenModal
        isOpen={openModal === 'emotional'}
        onClose={() => setOpenModal(null)}
        data={aufrechterhaltende.emotionaleFaktoren}
        onUpdate={makroanalyseHandlers.updateEmotionaleFaktoren}
      />
      <VerhaltensbezogeneFaktorenModal
        isOpen={openModal === 'verhaltens'}
        onClose={() => setOpenModal(null)}
        data={aufrechterhaltende.verhaltensbezogeneFaktoren}
        onUpdate={makroanalyseHandlers.updateVerhaltensbezogeneFaktoren}
      />
      <SelbstwertbezogeneFaktorenModal
        isOpen={openModal === 'selbstwert'}
        onClose={() => setOpenModal(null)}
        data={aufrechterhaltende.selbstwertbezogeneFaktoren}
        onUpdate={makroanalyseHandlers.updateSelbstwertbezogeneFaktoren}
      />
      <KompetenzdefiziteModal
        isOpen={openModal === 'kompetenz'}
        onClose={() => setOpenModal(null)}
        data={aufrechterhaltende.kompetenzdefizite}
        onUpdate={makroanalyseHandlers.updateKompetenzdefizite}
      />
      <SubstanzabhaengigkeitModal
        isOpen={openModal === 'substanz'}
        onClose={() => setOpenModal(null)}
        data={aufrechterhaltende.substanzabhaengigkeit}
        onUpdate={makroanalyseHandlers.updateSubstanzabhaengigkeit}
      />
      <WeitereFaktorenModal
        isOpen={openModal === 'weitere'}
        onClose={() => setOpenModal(null)}
        data={aufrechterhaltende.weitereFaktoren}
        onUpdate={makroanalyseHandlers.updateWeitereFaktoren}
      />

      {/* Main Content */}
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
                    <div className={`text-xs font-semibold leading-snug line-clamp-2 hyphens-auto ${isActive ? 'text-blue-700' : 'text-text-secondary'}`} lang="de">
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
              <LebensgeschichteSubstep
                formData={formData}
                lebensgeschichteHandlers={lebensgeschichteHandlers}
                setNestedField={setNestedField}
              />
            )}

            {/* Step 2: Krankheitsanamnese */}
            {currentSubStep === 2 && (
              <div className="space-y-6">
                {/* In welcher Situation kommt der Patient in Psychotherapie? */}
                <div className="border-2 border-border-primary rounded-lg p-4 bg-surface-secondary/30">
                  <h4 className="text-base font-semibold text-text-primary mb-4">In welcher Situation kommt der Patient in Psychotherapie?</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Anhaltende Belastungssituation</label>
                      <textarea
                        rows={1}
                        value={formData.krankheitsanamnese.anhaltendeBelastungssituation}
                        onChange={(e) => setNestedField('krankheitsanamnese.anhaltendeBelastungssituation', e.target.value)}
                        onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                        placeholder="z.B. seit Jahren bestehender Arbeitsplatzkonflikt..."
                        className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-none overflow-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Akute Belastungssituation</label>
                      <textarea
                        rows={1}
                        value={formData.krankheitsanamnese.akuteBelastungssituation}
                        onChange={(e) => setNestedField('krankheitsanamnese.akuteBelastungssituation', e.target.value)}
                        onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                        placeholder="z.B. kürzliche Trennung vom Partner..."
                        className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-none overflow-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Krisensituation</label>
                      <textarea
                        rows={1}
                        value={formData.krankheitsanamnese.krisensituation}
                        onChange={(e) => setNestedField('krankheitsanamnese.krisensituation', e.target.value)}
                        onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                        placeholder="z.B. akute suizidale Krise nach Jobverlust..."
                        className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-none overflow-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Andere</label>
                      <textarea
                        rows={1}
                        value={formData.krankheitsanamnese.situationAndere}
                        onChange={(e) => setNestedField('krankheitsanamnese.situationAndere', e.target.value)}
                        onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                        placeholder="Sonstige Situationsbeschreibung..."
                        className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-none overflow-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Beginn, Dauer und Verlauf der Symptomatik */}
                <div className="border-2 border-border-primary rounded-lg p-4 bg-surface-secondary/30">
                  <h4 className="text-base font-semibold text-text-primary mb-4">Beginn, Dauer und Verlauf der Symptomatik</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Erstauftreten der Symptome</label>
                      <textarea
                        rows={1}
                        value={formData.krankheitsanamnese.erstauftretenSymptome}
                        onChange={(e) => setNestedField('krankheitsanamnese.erstauftretenSymptome', e.target.value)}
                        onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                        placeholder="z.B. erstmals im Alter von 25 Jahren..."
                        className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-none overflow-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Beginn der aktuellen Symptome seit</label>
                      <textarea
                        rows={1}
                        value={formData.krankheitsanamnese.beginnAktuelleSymptome}
                        onChange={(e) => setNestedField('krankheitsanamnese.beginnAktuelleSymptome', e.target.value)}
                        onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                        placeholder="z.B. seit ca. 6 Monaten..."
                        className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-none overflow-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Dauer der aktuellen Symptome</label>
                      <textarea
                        rows={1}
                        value={formData.krankheitsanamnese.dauerAktuelleSymptome}
                        onChange={(e) => setNestedField('krankheitsanamnese.dauerAktuelleSymptome', e.target.value)}
                        onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                        placeholder="z.B. seit etwa einem halben Jahr anhaltend..."
                        className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-none overflow-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Verlauf der aktuellen Symptome</label>
                      <textarea
                        rows={1}
                        value={formData.krankheitsanamnese.verlaufAktuelleSymptome}
                        onChange={(e) => setNestedField('krankheitsanamnese.verlaufAktuelleSymptome', e.target.value)}
                        onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                        placeholder="z.B. chronisch-progredient mit Exazerbationen..."
                        className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-none overflow-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Auslöser der Symptomatik */}
                <div className="border-2 border-border-primary rounded-lg p-4 bg-surface-secondary/30">
                  <h4 className="text-base font-semibold text-text-primary mb-4">Auslöser der Symptomatik (nur kurze Angabe!)</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Auslöser der Symptomatik in der Vergangenheit</label>
                      <textarea
                        rows={1}
                        value={formData.krankheitsanamnese.ausloeserVergangenheit}
                        onChange={(e) => setNestedField('krankheitsanamnese.ausloeserVergangenheit', e.target.value)}
                        onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                        placeholder="z.B. frühere Trennungserfahrungen..."
                        className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-none overflow-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Auslöser aktuell vorliegenden Symptomatik</label>
                      <textarea
                        rows={1}
                        value={formData.krankheitsanamnese.ausloeserAktuell}
                        onChange={(e) => setNestedField('krankheitsanamnese.ausloeserAktuell', e.target.value)}
                        onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                        placeholder="z.B. Kündigung und Partnerschaftskonflikt..."
                        className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-none overflow-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: SORKC-Modell */}
            {currentSubStep === 3 && (
              <div className="space-y-5">
                <h4 className="text-lg font-semibold text-text-primary">Mikroanalyse – Verhaltensanalyse (SORKC nach Kanfer)</h4>
                <p className="text-sm text-text-tertiary">Erstellen Sie für jede relevante Diagnose/Reaktion eine separate SORKC-Analyse.</p>

                {/* List of SORKC entries */}
                <div className="space-y-4">
                  {formData.funktionalesBedingungsmodell.sorkcEntries.map((entry) => (
                    <SorkcEntryCard
                      key={entry.id}
                      entry={entry}
                      onUpdate={(updates) => funktionalesBedingungsmodellHandlers.updateSorkcEntry(entry.id, updates)}
                      onRemove={() => funktionalesBedingungsmodellHandlers.removeSorkcEntry(entry.id)}
                    />
                  ))}
                </div>

                {/* Add new SORKC entry button */}
                <button
                  type="button"
                  onClick={() => funktionalesBedingungsmodellHandlers.addSorkcEntry()}
                  className="w-full p-3 border-2 border-dashed border-border-primary rounded-lg text-text-tertiary hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  + Neue SORKC-Analyse hinzufügen
                </button>
              </div>
            )}

            {/* Step 4: Makroanalyse */}
            {currentSubStep === 4 && (
              <div className="space-y-5">
                <h4 className="text-lg font-semibold text-text-primary">Makroanalyse</h4>
                <p className="text-sm text-text-tertiary">Ergänzen Sie den Titel der Makroanalyse und fügen Sie ggf. einleitenden Text hinzu.</p>

                <div className="border-2 border-border-primary rounded-lg p-4 bg-surface-secondary/30 space-y-4">
                  {/* Heading extension */}
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">Ergänzung zum Titel (optional)</label>
                    <input
                      type="text"
                      value={formData.funktionalesBedingungsmodell.makroanalyseIntro?.headingExtension || ''}
                      onChange={(e) => makroanalyseHandlers.updateMakroanalyseIntro({ headingExtension: e.target.value })}
                      placeholder="z.B. zur Entstehung der Depression"
                      className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                    />
                    <p className="text-xs text-text-tertiary mt-1">Erscheint als: &quot;Makroanalyse {formData.funktionalesBedingungsmodell.makroanalyseIntro?.headingExtension || '[Ergänzung]'}:&quot;</p>
                  </div>

                  {/* Content textarea */}
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">Inhalt (optional)</label>
                    <textarea
                      value={formData.funktionalesBedingungsmodell.makroanalyseIntro?.content || ''}
                      onChange={(e) => makroanalyseHandlers.updateMakroanalyseIntro({ content: e.target.value })}
                      placeholder="Einleitender Text zur Makroanalyse..."
                      rows={4}
                      className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-y"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Prädisponierende Faktoren */}
            {currentSubStep === 5 && (
              <div className="space-y-5">
                <h4 className="text-lg font-semibold text-text-primary">Prädisponierende Faktoren/Vulnerabilitäten</h4>

                {/* Kognitiv-emotionale Vulnerabilität */}
                <div className="border-2 border-border-primary rounded-lg p-4 bg-surface-secondary/30">
                  <h5 className="text-base font-bold text-text-primary mb-3">1. Kognitiv-emotionale Vulnerabilität</h5>

                  {/* Grundbedürfnisse (nach Grawe) */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-text-secondary mb-3">Grundbedürfnisse (nach Grawe)</label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {(Object.keys(FormLabels.GRAWE_GRUNDBEDUERFNIS_LABELS) as FormTypes.GraweGrundbeduerfnis[]).map(key => (
                        <OptionCard
                          key={key}
                          label={FormLabels.GRAWE_GRUNDBEDUERFNIS_LABELS[key]}
                          isSelected={formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.plananalyse.grundbeduerfnisse[key]?.selected || false}
                          onClick={() => {
                            const current = formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.plananalyse.grundbeduerfnisse;
                            makroanalyseHandlers.updatePraedisponierendeFaktoren({
                              kognitivEmotional: {
                                ...formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional,
                                plananalyse: {
                                  ...formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.plananalyse,
                                  grundbeduerfnisse: {
                                    ...current,
                                    [key]: { selected: !current[key]?.selected, details: current[key]?.details || '' }
                                  }
                                }
                              }
                            });
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-text-secondary whitespace-nowrap">Andere Bedürfnisse</label>
                      <input
                        type="text"
                        value={formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.plananalyse.grundbeduerfnisseAndere || ''}
                        onChange={(e) => makroanalyseHandlers.updatePraedisponierendeFaktoren({
                          kognitivEmotional: {
                            ...formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional,
                            plananalyse: {
                              ...formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.plananalyse,
                              grundbeduerfnisseAndere: e.target.value
                            }
                          }
                        })}
                        placeholder="Weitere Bedürfnisse..."
                        className="flex-1 px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                      />
                    </div>
                  </div>

                  {/* Bindungsmuster */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-text-secondary mb-2">Bindungsmuster</label>
                    <select
                      value={formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.fruehkindlicheErfahrungen.bindungsmuster || ''}
                      onChange={(e) => makroanalyseHandlers.updatePraedisponierendeFaktoren({
                        kognitivEmotional: {
                          ...formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional,
                          fruehkindlicheErfahrungen: {
                            ...formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.fruehkindlicheErfahrungen,
                            bindungsmuster: e.target.value as FormTypes.Bindungsmuster || null
                          }
                        }
                      })}
                      className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                    >
                      <option value="">-- Nicht angegeben --</option>
                      {(Object.keys(FormLabels.BINDUNGSMUSTER_LABELS) as FormTypes.Bindungsmuster[]).map(key => (
                        <option key={key} value={key}>{FormLabels.BINDUNGSMUSTER_LABELS[key]}</option>
                      ))}
                    </select>
                  </div>

                  {/* Grundannahmen */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-text-secondary mb-2">Dysfunktionale Grundannahmen</label>
                    <div className="space-y-2">
                      {formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.plananalyse.grundannahmen.map((annahme, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={annahme}
                            onChange={(e) => {
                              const updated = [...formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.plananalyse.grundannahmen];
                              updated[index] = e.target.value;
                              makroanalyseHandlers.updatePraedisponierendeFaktoren({
                                kognitivEmotional: {
                                  ...formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional,
                                  plananalyse: {
                                    ...formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.plananalyse,
                                    grundannahmen: updated
                                  }
                                }
                              });
                            }}
                            placeholder="z.B. 'Ich bin wertlos'"
                            className="flex-1 px-2 py-1.5 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                          />
                          <button
                            type="button"
                            onClick={() => makroanalyseHandlers.removeGrundannahme(index)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => makroanalyseHandlers.addGrundannahme('')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        + Grundannahme hinzufügen
                      </button>
                    </div>
                  </div>

                  {/* Pläne */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-text-secondary mb-2">Pläne, Oberpläne und Motive</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm w-40">Annäherungspläne</span>
                        <input
                          type="text"
                          value={formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.plananalyse.annaeherungsplaene || ''}
                          onChange={(e) => makroanalyseHandlers.updatePraedisponierendeFaktoren({
                            kognitivEmotional: {
                              ...formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional,
                              plananalyse: {
                                ...formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.plananalyse,
                                annaeherungsplaene: e.target.value
                              }
                            }
                          })}
                          className="flex-1 px-2 py-1.5 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm w-40">Vermeidungspläne</span>
                        <input
                          type="text"
                          value={formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.plananalyse.vermeidungsplaene || ''}
                          onChange={(e) => makroanalyseHandlers.updatePraedisponierendeFaktoren({
                            kognitivEmotional: {
                              ...formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional,
                              plananalyse: {
                                ...formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.plananalyse,
                                vermeidungsplaene: e.target.value
                              }
                            }
                          })}
                          className="flex-1 px-2 py-1.5 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Persönlichkeit */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-text-secondary mb-2">Persönlichkeit und Temperament</label>
                    <input
                      type="text"
                      value={formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.persoenlichkeitTemperament || ''}
                      onChange={(e) => makroanalyseHandlers.updatePraedisponierendeFaktoren({
                        kognitivEmotional: {
                          ...formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional,
                          persoenlichkeitTemperament: e.target.value
                        }
                      })}
                      className="w-full px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                    />
                  </div>

                  {/* Frühkindliche Erfahrungen */}
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-3">Frühkindliche Erfahrungen</label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {(Object.keys(FormLabels.FRUEHKINDLICHE_ERFAHRUNG_LABELS) as FormTypes.FruehkindlicheErfahrung[]).map(key => (
                        <OptionCard
                          key={key}
                          label={FormLabels.FRUEHKINDLICHE_ERFAHRUNG_LABELS[key]}
                          isSelected={formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.fruehkindlicheErfahrungen.erfahrungen[key]?.selected || false}
                          onClick={() => {
                            const current = formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.fruehkindlicheErfahrungen.erfahrungen;
                            makroanalyseHandlers.updatePraedisponierendeFaktoren({
                              kognitivEmotional: {
                                ...formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional,
                                fruehkindlicheErfahrungen: {
                                  ...formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.fruehkindlicheErfahrungen,
                                  erfahrungen: {
                                    ...current,
                                    [key]: { selected: !current[key]?.selected, details: current[key]?.details || '' }
                                  }
                                }
                              }
                            });
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-text-secondary whitespace-nowrap">Andere</label>
                      <input
                        type="text"
                        value={formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.fruehkindlicheErfahrungen.erfahrungenAndere || ''}
                        onChange={(e) => makroanalyseHandlers.updatePraedisponierendeFaktoren({
                          kognitivEmotional: {
                            ...formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional,
                            fruehkindlicheErfahrungen: {
                              ...formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.kognitivEmotional.fruehkindlicheErfahrungen,
                              erfahrungenAndere: e.target.value
                            }
                          }
                        })}
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
                    {(Object.keys(FormLabels.BIOLOGISCHE_VULNERABILITAET_LABELS) as FormTypes.BiologischeVulnerabilitaet[]).map(key => (
                      <OptionCard
                        key={key}
                        label={FormLabels.BIOLOGISCHE_VULNERABILITAET_LABELS[key]}
                        isSelected={formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.biologischGenetisch[key]?.selected || false}
                        onClick={() => {
                          const current = formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.biologischGenetisch;
                          makroanalyseHandlers.updatePraedisponierendeFaktoren({
                            biologischGenetisch: {
                              ...current,
                              [key]: { selected: !current[key]?.selected, details: current[key]?.details || '' }
                            }
                          });
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-text-secondary whitespace-nowrap">Andere</label>
                    <input
                      type="text"
                      value={formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.biologischGenetischAndere || ''}
                      onChange={(e) => makroanalyseHandlers.updatePraedisponierendeFaktoren({
                        biologischGenetischAndere: e.target.value
                      })}
                      placeholder="Weitere biologische Faktoren..."
                      className="flex-1 px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                    />
                  </div>
                </div>

                {/* Soziale Vulnerabilität */}
                <div className="border-2 border-border-primary rounded-lg p-4 bg-surface-secondary/30">
                  <h5 className="text-base font-bold text-text-primary mb-3">3. Soziale Vulnerabilität</h5>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {(Object.keys(FormLabels.SOZIALE_VULNERABILITAET_LABELS) as FormTypes.SozialeVulnerabilitaet[]).map(key => (
                      <OptionCard
                        key={key}
                        label={FormLabels.SOZIALE_VULNERABILITAET_LABELS[key]}
                        isSelected={formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.sozial[key]?.selected || false}
                        onClick={() => {
                          const current = formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.sozial;
                          makroanalyseHandlers.updatePraedisponierendeFaktoren({
                            sozial: {
                              ...current,
                              [key]: { selected: !current[key]?.selected, details: current[key]?.details || '' }
                            }
                          });
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-text-secondary whitespace-nowrap">Andere</label>
                    <input
                      type="text"
                      value={formData.funktionalesBedingungsmodell.praedisponierendeFaktoren.sozialAndere || ''}
                      onChange={(e) => makroanalyseHandlers.updatePraedisponierendeFaktoren({
                        sozialAndere: e.target.value
                      })}
                      placeholder="Weitere soziale Faktoren..."
                      className="flex-1 px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                    />
                  </div>
                </div>

                {/* Störungsspezifische Modelle */}
                <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50/30">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-base font-bold text-purple-900">Störungsspezifische Modelle</h5>
                    <button
                      type="button"
                      onClick={() => setStoerungsmodellPickerOpen(FormTypes.StoerungsmodellZuordnung.Praedisponierend)}
                      className="px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      + Modell hinzufügen
                    </button>
                  </div>
                  {getModelleForZuordnung(FormTypes.StoerungsmodellZuordnung.Praedisponierend).length === 0 ? (
                    <p className="text-sm text-purple-600 italic">Keine Modelle zugeordnet</p>
                  ) : (
                    <div className="space-y-2">
                      {getModelleForZuordnung(FormTypes.StoerungsmodellZuordnung.Praedisponierend).map(entry => (
                        <StoerungsmodellCard
                          key={entry.id}
                          entry={entry}
                          onEdit={() => handleEditStoerungsmodell(entry)}
                          onRemove={() => makroanalyseHandlers.removeStoerungsmodell(entry.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 6: Auslösende Bedingungen */}
            {currentSubStep === 6 && (
              <div className="space-y-5">
                <h4 className="text-lg font-semibold text-text-primary">Auslösende Bedingungen</h4>
                <p className="text-sm text-text-tertiary">Wählen Sie die zutreffenden auslösenden Bedingungen aus oder geben Sie an, dass diese nicht eruiert wurden.</p>

                {/* Nicht eruiert checkbox */}
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="nichtEruiert"
                    checked={formData.funktionalesBedingungsmodell.ausloesendeBedingungen.nichtEruiert}
                    onChange={(e) => makroanalyseHandlers.setNichtEruiert(e.target.checked)}
                    className="w-4 h-4 rounded border-border-primary text-blue-500 focus:ring-blue-400"
                  />
                  <label htmlFor="nichtEruiert" className="text-sm font-medium text-text-secondary">
                    Auslösende Bedingungen nicht eruiert
                  </label>
                </div>

                {/* Only show selection when nicht eruiert is false */}
                {!formData.funktionalesBedingungsmodell.ausloesendeBedingungen.nichtEruiert && (
                  <div className="space-y-4">
                    {/* Grid of AusloesendeBedingung cards */}
                    <div className="grid grid-cols-2 gap-2">
                      {Object.values(FormTypes.AusloesendeBedingung).map((bedingung) => {
                        const isSelected = !!formData.funktionalesBedingungsmodell.ausloesendeBedingungen.bedingungen[bedingung];
                        return (
                          <OptionCard
                            key={bedingung}
                            label={FormLabels.AUSLOESENDE_BEDINGUNG_LABELS[bedingung]}
                            isSelected={isSelected}
                            onClick={() => {
                              const current = formData.funktionalesBedingungsmodell.ausloesendeBedingungen.bedingungen;
                              if (isSelected) {
                                // Remove
                                const { [bedingung]: _, ...rest } = current;
                                makroanalyseHandlers.updateAusloesendeBedingungen({ bedingungen: rest });
                              } else {
                                // Add
                                makroanalyseHandlers.updateAusloesendeBedingungen({
                                  bedingungen: { ...current, [bedingung]: { selected: true, details: {} } }
                                });
                              }
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Andere */}
                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-2">Andere auslösende Bedingungen</label>
                      <textarea
                        value={formData.funktionalesBedingungsmodell.ausloesendeBedingungen.andere}
                        onChange={(e) => makroanalyseHandlers.updateAusloesendeBedingungen({ andere: e.target.value })}
                        rows={2}
                        placeholder="Weitere auslösende Faktoren..."
                        className="w-full px-2 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                      />
                    </div>
                  </div>
                )}

                {/* Störungsspezifische Modelle */}
                <div className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50/30">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-base font-bold text-orange-900">Störungsspezifische Modelle</h5>
                    <button
                      type="button"
                      onClick={() => setStoerungsmodellPickerOpen(FormTypes.StoerungsmodellZuordnung.Ausloesend)}
                      className="px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
                    >
                      + Modell hinzufügen
                    </button>
                  </div>
                  {getModelleForZuordnung(FormTypes.StoerungsmodellZuordnung.Ausloesend).length === 0 ? (
                    <p className="text-sm text-orange-600 italic">Keine Modelle zugeordnet</p>
                  ) : (
                    <div className="space-y-2">
                      {getModelleForZuordnung(FormTypes.StoerungsmodellZuordnung.Ausloesend).map(entry => (
                        <StoerungsmodellCard
                          key={entry.id}
                          entry={entry}
                          onEdit={() => handleEditStoerungsmodell(entry)}
                          onRemove={() => makroanalyseHandlers.removeStoerungsmodell(entry.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 7: Aufrechterhaltende Bedingungen */}
            {currentSubStep === 7 && (
              <div className="space-y-5">
                <h4 className="text-lg font-semibold text-text-primary">Aufrechterhaltende Bedingungen</h4>
                <p className="text-sm text-text-tertiary">Wählen Sie die relevanten Kategorien aus. Klicken Sie auf eine Kategorie, um die Details zu bearbeiten.</p>

                {/* 7 Category buttons (will open modals when implemented) */}
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'kognitiv', title: '1. Kognitive Faktoren', subtitle: 'Grundannahmen, Denkfehler, automatische Gedanken' },
                    { id: 'emotional', title: '2. Emotionale Faktoren', subtitle: 'Emotionsregulation, Wahrnehmung von Emotionen' },
                    { id: 'verhaltens', title: '3. Verhaltensbezogene Faktoren', subtitle: 'Vermeidung, Sicherheitsverhalten, Rückzug' },
                    { id: 'selbstwert', title: '4. Selbstwertbezogene Faktoren', subtitle: 'Selbstkonzept, Selbstabwertung' },
                    { id: 'kompetenz', title: '5. Kompetenzdefizite', subtitle: 'Soziale Interaktion, Problemlösung' },
                    { id: 'substanz', title: '6. Substanzabhängigkeit', subtitle: 'Craving, Toleranz, Entzug' },
                    { id: 'weitere', title: '7. Weitere Faktoren', subtitle: 'Stressoren, Krankheitsgewinn' },
                  ].map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setOpenModal(category.id as AufrechterhaltendModalId)}
                      className="p-4 rounded-lg border-2 border-border-primary bg-surface-primary hover:border-blue-400 hover:bg-accent-blue-light/30 transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-text-primary">{category.title}</div>
                          <div className="text-xs text-text-tertiary mt-0.5">{category.subtitle}</div>
                        </div>
                        <svg className="w-5 h-5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Störungsspezifische Modelle */}
                <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50/30">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-base font-bold text-red-900">Störungsspezifische Modelle</h5>
                    <button
                      type="button"
                      onClick={() => setStoerungsmodellPickerOpen(FormTypes.StoerungsmodellZuordnung.Aufrechterhaltend)}
                      className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      + Modell hinzufügen
                    </button>
                  </div>
                  {getModelleForZuordnung(FormTypes.StoerungsmodellZuordnung.Aufrechterhaltend).length === 0 ? (
                    <p className="text-sm text-red-600 italic">Keine Modelle zugeordnet</p>
                  ) : (
                    <div className="space-y-2">
                      {getModelleForZuordnung(FormTypes.StoerungsmodellZuordnung.Aufrechterhaltend).map(entry => (
                        <StoerungsmodellCard
                          key={entry.id}
                          entry={entry}
                          onEdit={() => handleEditStoerungsmodell(entry)}
                          onRemove={() => makroanalyseHandlers.removeStoerungsmodell(entry.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
    </>
  );
}
