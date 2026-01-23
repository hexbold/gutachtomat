'use client';

import { Kapitel6Handlers } from '@/hooks/useGutachtenForm';
import * as FormTypes from '@/lib/core/form-types';
import * as Labels from '@/lib/core/form-labels';
import { useState } from 'react';
import {
  ProblemBewaeltigungModal,
  ZwischenmenschlichModal,
  WohlbefindenModal,
  SelbstbezogenModal,
} from '../../shared/kapitel6-modals/therapieziele';
import {
  AllgemeineInterventionenModal,
  DepressionInterventionenModal,
  BipolareInterventionenModal,
  AngstInterventionenModal,
  BorderlineInterventionenModal,
  PTBSInterventionenModal,
  ZwangInterventionenModal,
  SomatoformeInterventionenModal,
  AnorexieInterventionenModal,
  BulimieInterventionenModal,
  PsychoseInterventionenModal,
} from '../../shared/kapitel6-modals/behandlungsplan';
import {
  countProblemBewaeltigung,
  countZwischenmenschlich,
  countWohlbefinden,
  countSelbstbezogen,
} from '@/lib/utils/therapieziele-counter';
import {
  countAllgemeineInterventionen,
  countDepressionInterventionen,
  countBipolareInterventionen,
  countAngstInterventionen,
  countBorderlineInterventionen,
  countPTBSInterventionen,
  countZwangInterventionen,
  countSomatoformeInterventionen,
  countAnorexieInterventionen,
  countBulimieInterventionen,
  countPsychoseInterventionen,
} from '@/lib/utils/behandlungsplan-counter';
import {
  countGuenstigeFaktoren,
  countUnguenstigeFaktoren,
} from '@/lib/utils/prognose-counter';

interface WizardStep7Props {
  formData: FormTypes.Form;
  kapitel6Handlers: Kapitel6Handlers;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
  currentSubStep: number;
  onSubStepChange: (substep: number) => void;
}

interface SubStep {
  id: number;
  title: string;
  shortTitle: string;
}

const SUB_STEPS: SubStep[] = [
  { id: 1, title: 'Therapieziele', shortTitle: 'Therapieziele' },
  { id: 2, title: 'Behandlungsplan', shortTitle: 'Behandlungsplan' },
  { id: 3, title: 'Begründung des Settings', shortTitle: 'Begründung' },
  { id: 4, title: 'Prognose', shortTitle: 'Prognose' },
];

export function WizardStep7({
  formData,
  kapitel6Handlers,
  setNestedField,
  currentSubStep,
  onSubStepChange,
}: WizardStep7Props) {
  // Therapieziele modal states
  const [isProblemBewaeltigungModalOpen, setIsProblemBewaeltigungModalOpen] = useState(false);
  const [isZwischenmenschlichModalOpen, setIsZwischenmenschlichModalOpen] = useState(false);
  const [isWohlbefindenModalOpen, setIsWohlbefindenModalOpen] = useState(false);
  const [isSelbstbezogenModalOpen, setIsSelbstbezogenModalOpen] = useState(false);

  // Behandlungsplan modal states
  const [isAllgemeineModalOpen, setIsAllgemeineModalOpen] = useState(false);
  const [isDepressionModalOpen, setIsDepressionModalOpen] = useState(false);
  const [isBipolareModalOpen, setIsBipolareModalOpen] = useState(false);
  const [isAngstModalOpen, setIsAngstModalOpen] = useState(false);
  const [isBorderlineModalOpen, setIsBorderlineModalOpen] = useState(false);
  const [isPTBSModalOpen, setIsPTBSModalOpen] = useState(false);
  const [isZwangModalOpen, setIsZwangModalOpen] = useState(false);
  const [isSomatoformeModalOpen, setIsSomatoformeModalOpen] = useState(false);
  const [isAnorexieModalOpen, setIsAnorexieModalOpen] = useState(false);
  const [isBulimieModalOpen, setIsBulimieModalOpen] = useState(false);
  const [isPsychoseModalOpen, setIsPsychoseModalOpen] = useState(false);

  const handleSubStepClick = (stepNumber: number) => {
    onSubStepChange(stepNumber);
  };

  // Therapieziele counts
  const therapieziele = formData.kapitel6.therapieziele;
  const problemBewaeltigungCount = countProblemBewaeltigung(therapieziele.problemBewaeltigung);
  const zwischenmenschlichCount = countZwischenmenschlich(therapieziele.zwischenmenschlich);
  const wohlbefindenCount = countWohlbefinden(therapieziele.wohlbefinden);
  const selbstbezogenCount = countSelbstbezogen(therapieziele.selbstbezogen);

  // Behandlungsplan counts
  const behandlungsplan = formData.kapitel6.behandlungsplan;
  const allgemeineCount = countAllgemeineInterventionen(behandlungsplan.allgemeine);
  const depressionCount = countDepressionInterventionen(behandlungsplan.depression);
  const bipolareCount = countBipolareInterventionen(behandlungsplan.bipolare);
  const angstCount = countAngstInterventionen(behandlungsplan.angst);
  const borderlineCount = countBorderlineInterventionen(behandlungsplan.borderline);
  const ptbsCount = countPTBSInterventionen(behandlungsplan.ptbs);
  const zwangCount = countZwangInterventionen(behandlungsplan.zwang);
  const somatoformeCount = countSomatoformeInterventionen(behandlungsplan.somatoforme);
  const anorexieCount = countAnorexieInterventionen(behandlungsplan.anorexie);
  const bulimieCount = countBulimieInterventionen(behandlungsplan.bulimie);
  const psychoseCount = countPsychoseInterventionen(behandlungsplan.psychose);

  // Prognose counts
  const prognose = formData.kapitel6.prognose;
  const guenstigeCount = countGuenstigeFaktoren(prognose.guenstigeFaktoren);
  const unguenstigeCount = countUnguenstigeFaktoren(prognose.unguenstigeFaktoren);

  // Begründung data
  const begruendung = formData.kapitel6.begruendungSetting;

  // Generic button component for modal triggers
  const ModalTriggerButton = ({
    onClick,
    onClear,
    title,
    count,
    color = 'blue',
  }: {
    onClick: () => void;
    onClear: () => void;
    title: string;
    count: number;
    color?: 'blue' | 'purple' | 'green' | 'orange';
  }) => {
    const colorClasses = {
      blue: {
        border: count > 0 ? 'border-blue-500' : 'border-border-primary',
        hover: 'hover:border-blue-500 hover:bg-accent-blue-light',
        text: 'group-hover:text-blue-700',
        icon: 'group-hover:text-blue-500',
      },
      purple: {
        border: count > 0 ? 'border-purple-500' : 'border-border-primary',
        hover: 'hover:border-purple-500 hover:bg-purple-50',
        text: 'group-hover:text-purple-700',
        icon: 'group-hover:text-purple-500',
      },
      green: {
        border: count > 0 ? 'border-green-500' : 'border-border-primary',
        hover: 'hover:border-green-500 hover:bg-green-50',
        text: 'group-hover:text-green-700',
        icon: 'group-hover:text-green-500',
      },
      orange: {
        border: count > 0 ? 'border-orange-500' : 'border-border-primary',
        hover: 'hover:border-orange-500 hover:bg-orange-50',
        text: 'group-hover:text-orange-700',
        icon: 'group-hover:text-orange-500',
      },
    };
    const colors = colorClasses[color];

    return (
      <div className="flex gap-2">
        <button
          onClick={onClick}
          className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg ${colors.hover} transition-all duration-200 cursor-pointer group ${colors.border}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`text-lg font-semibold text-text-primary ${colors.text}`}>
                {title}
              </h4>
              {count > 0 && (
                <p className="text-sm text-text-secondary mt-1">
                  {count} ausgewählt
                </p>
              )}
            </div>
            <svg
              className={`w-6 h-6 text-text-quaternary ${colors.icon}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
        {count > 0 && (
          <button
            onClick={() => {
              if (!window.confirm(`Möchten Sie wirklich alle ${count} ausgewählten Elemente löschen?`)) {
                return;
              }
              onClear();
            }}
            className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"
          >
            <svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    );
  };

  // Prognose Card Selection component
  const PrognoseFaktorCard = ({
    label,
    isSelected,
    onToggle,
  }: {
    label: string;
    isSelected: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`
        relative w-full p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center
        ${isSelected
          ? 'border-blue-500 bg-blue-50 shadow-sm'
          : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer
      `}
    >
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      )}
      <span className={`text-sm font-medium leading-snug pr-6 ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
        {label}
      </span>
    </button>
  );

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
                    <div className={`text-xs font-semibold leading-tight ${isActive ? 'text-blue-700' : 'text-text-secondary'}`}>
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
            {/* Step 1: Therapieziele */}
            {currentSubStep === 1 && (
              <div className="space-y-3">
                <ModalTriggerButton
                  onClick={() => setIsProblemBewaeltigungModalOpen(true)}
                  onClear={() => kapitel6Handlers.clearTherapiezieleCategory('problemBewaeltigung')}
                  title="Bewältigung bestimmter Probleme"
                  count={problemBewaeltigungCount}
                  color="blue"
                />
                <ModalTriggerButton
                  onClick={() => setIsZwischenmenschlichModalOpen(true)}
                  onClear={() => kapitel6Handlers.clearTherapiezieleCategory('zwischenmenschlich')}
                  title="Zwischenmenschlich"
                  count={zwischenmenschlichCount}
                  color="purple"
                />
                <ModalTriggerButton
                  onClick={() => setIsWohlbefindenModalOpen(true)}
                  onClear={() => kapitel6Handlers.clearTherapiezieleCategory('wohlbefinden')}
                  title="Wohlbefinden / Funktionsfähigkeit"
                  count={wohlbefindenCount}
                  color="green"
                />
                <ModalTriggerButton
                  onClick={() => setIsSelbstbezogenModalOpen(true)}
                  onClear={() => kapitel6Handlers.clearTherapiezieleCategory('selbstbezogen')}
                  title="Selbstbezogene Ziele"
                  count={selbstbezogenCount}
                  color="orange"
                />
              </div>
            )}

            {/* Step 2: Behandlungsplan */}
            {currentSubStep === 2 && (
              <div className="space-y-3">
                <ModalTriggerButton
                  onClick={() => setIsAllgemeineModalOpen(true)}
                  onClear={() => kapitel6Handlers.clearInterventionCategory('allgemeine')}
                  title="Allgemeine Interventionen"
                  count={allgemeineCount}
                  color="blue"
                />
                <ModalTriggerButton
                  onClick={() => setIsDepressionModalOpen(true)}
                  onClear={() => kapitel6Handlers.clearInterventionCategory('depression')}
                  title="Depression"
                  count={depressionCount}
                  color="blue"
                />
                <ModalTriggerButton
                  onClick={() => setIsBipolareModalOpen(true)}
                  onClear={() => kapitel6Handlers.clearInterventionCategory('bipolare')}
                  title="Bipolare Störungen"
                  count={bipolareCount}
                  color="blue"
                />
                <ModalTriggerButton
                  onClick={() => setIsAngstModalOpen(true)}
                  onClear={() => kapitel6Handlers.clearInterventionCategory('angst')}
                  title="Angststörungen"
                  count={angstCount}
                  color="blue"
                />
                <ModalTriggerButton
                  onClick={() => setIsBorderlineModalOpen(true)}
                  onClear={() => kapitel6Handlers.clearInterventionCategory('borderline')}
                  title="Borderline-Persönlichkeitsstörung"
                  count={borderlineCount}
                  color="blue"
                />
                <ModalTriggerButton
                  onClick={() => setIsPTBSModalOpen(true)}
                  onClear={() => kapitel6Handlers.clearInterventionCategory('ptbs')}
                  title="PTBS / Traumafolgestörungen"
                  count={ptbsCount}
                  color="blue"
                />
                <ModalTriggerButton
                  onClick={() => setIsZwangModalOpen(true)}
                  onClear={() => kapitel6Handlers.clearInterventionCategory('zwang')}
                  title="Zwangsstörungen"
                  count={zwangCount}
                  color="blue"
                />
                <ModalTriggerButton
                  onClick={() => setIsSomatoformeModalOpen(true)}
                  onClear={() => kapitel6Handlers.clearInterventionCategory('somatoforme')}
                  title="Somatoforme Störungen"
                  count={somatoformeCount}
                  color="blue"
                />
                <ModalTriggerButton
                  onClick={() => setIsAnorexieModalOpen(true)}
                  onClear={() => kapitel6Handlers.clearInterventionCategory('anorexie')}
                  title="Anorexia Nervosa"
                  count={anorexieCount}
                  color="blue"
                />
                <ModalTriggerButton
                  onClick={() => setIsBulimieModalOpen(true)}
                  onClear={() => kapitel6Handlers.clearInterventionCategory('bulimie')}
                  title="Bulimia Nervosa"
                  count={bulimieCount}
                  color="blue"
                />
                <ModalTriggerButton
                  onClick={() => setIsPsychoseModalOpen(true)}
                  onClear={() => kapitel6Handlers.clearInterventionCategory('psychose')}
                  title="Psychotische Störungen"
                  count={psychoseCount}
                  color="blue"
                />
              </div>
            )}

            {/* Step 3: Begründung des Settings (Inline - no modals) */}
            {currentSubStep === 3 && (
              <div className="space-y-6">
                {/* Therapieform */}
                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-3">Therapieform</h4>
                  <div className="flex gap-4">
                    {Object.entries(Labels.THERAPIEFORM_SETTING_LABELS).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="therapieform"
                          checked={begruendung.therapieform === key}
                          onChange={() => kapitel6Handlers.setTherapieform(key as FormTypes.TherapieformSetting)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-text-primary">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Anzahl Sitzungen */}
                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-3">Anzahl Sitzungen</h4>
                  <div className="space-y-2">
                    <div className="flex gap-4 flex-wrap">
                      {Object.entries(Labels.ANZAHL_SITZUNGEN_LABELS).map(([key, label]) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="anzahlSitzungen"
                            checked={begruendung.anzahlSitzungen === key}
                            onChange={() => kapitel6Handlers.setAnzahlSitzungen(key as FormTypes.AnzahlSitzungen, undefined)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-text-primary">{label}</span>
                        </label>
                      ))}
                    </div>
                    {begruendung.anzahlSitzungen === FormTypes.AnzahlSitzungen.Andere && (
                      <input
                        type="number"
                        value={begruendung.anzahlSitzungenAndere || ''}
                        onChange={(e) => kapitel6Handlers.setAnzahlSitzungen(FormTypes.AnzahlSitzungen.Andere, parseInt(e.target.value) || undefined)}
                        placeholder="Anzahl eingeben..."
                        className="mt-2 w-32 px-3 py-2 text-sm border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      />
                    )}
                  </div>
                </div>

                {/* Therapie-Setting */}
                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-3">Therapie-Setting</h4>
                  <div className="flex gap-4 flex-wrap">
                    {Object.entries(Labels.THERAPIE_SETTING_LABELS).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="therapieSetting"
                          checked={begruendung.setting === key}
                          onChange={() => kapitel6Handlers.setSetting(key as FormTypes.TherapieSetting)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-text-primary">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mitbehandler */}
                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-3">Mitbehandler</h4>
                  <div className="space-y-2">
                    <div className="flex gap-4 flex-wrap">
                      {Object.entries(Labels.MITBEHANDLER_LABELS).map(([key, label]) => {
                        const isSelected = begruendung.mitbehandler[key as FormTypes.Mitbehandler]?.selected || false;
                        return (
                          <label key={key} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => kapitel6Handlers.toggleMitbehandler(key as FormTypes.Mitbehandler)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-text-primary">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                    {begruendung.mitbehandler[FormTypes.Mitbehandler.Andere]?.selected && (
                      <input
                        type="text"
                        value={begruendung.mitbehandlerAndere}
                        onChange={(e) => setNestedField('kapitel6.begruendungSetting.mitbehandlerAndere', e.target.value)}
                        placeholder="Andere Mitbehandler eingeben..."
                        className="mt-2 w-full px-3 py-2 text-sm border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      />
                    )}
                  </div>
                </div>

                {/* Begründungstext */}
                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-2">
                    Begründungstext (optional)
                  </h4>
                  <textarea
                    value={begruendung.begruendungstext}
                    onChange={(e) => setNestedField('kapitel6.begruendungSetting.begruendungstext', e.target.value)}
                    placeholder="Optionale Begründung für das gewählte Setting..."
                    rows={4}
                    className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Prognose */}
            {currentSubStep === 4 && (
              <div className="space-y-8">
                {/* Günstige Faktoren */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-base font-semibold text-text-primary">
                      Prognostisch günstige Faktoren
                    </h4>
                    {guenstigeCount > 0 && (
                      <span className="text-sm text-green-600 font-medium">
                        {guenstigeCount} ausgewählt
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(Labels.PROGNOSTISCH_GUENSTIG_LABELS).map(([key, label]) => {
                      const isSelected = prognose.guenstigeFaktoren[key as FormTypes.PrognostischGuenstig]?.selected || false;
                      return (
                        <PrognoseFaktorCard
                          key={key}
                          label={label}
                          isSelected={isSelected}
                          onToggle={() => kapitel6Handlers.toggleGuenstigerFaktor(key as FormTypes.PrognostischGuenstig)}
                        />
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    value={prognose.guenstigeFaktorenAndere}
                    onChange={(e) => setNestedField('kapitel6.prognose.guenstigeFaktorenAndere', e.target.value)}
                    placeholder="Andere günstige Faktoren..."
                    className="mt-3 w-full px-3 py-2 text-sm border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>

                {/* Ungünstige Faktoren */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-base font-semibold text-text-primary">
                      Prognostisch ungünstige Faktoren
                    </h4>
                    {unguenstigeCount > 0 && (
                      <span className="text-sm text-orange-600 font-medium">
                        {unguenstigeCount} ausgewählt
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(Labels.PROGNOSTISCH_UNGUENSTIG_LABELS).map(([key, label]) => {
                      const isSelected = prognose.unguenstigeFaktoren[key as FormTypes.PrognostischUnguenstig]?.selected || false;
                      return (
                        <PrognoseFaktorCard
                          key={key}
                          label={label}
                          isSelected={isSelected}
                          onToggle={() => kapitel6Handlers.toggleUnguenstigerFaktor(key as FormTypes.PrognostischUnguenstig)}
                        />
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    value={prognose.unguenstigeFaktorenAndere}
                    onChange={(e) => setNestedField('kapitel6.prognose.unguenstigeFaktorenAndere', e.target.value)}
                    placeholder="Andere ungünstige Faktoren..."
                    className="mt-3 w-full px-3 py-2 text-sm border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>

                {/* Eingeschätzte Prognose */}
                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-3">
                    Eingeschätzte Prognose
                  </h4>
                  <div className="flex gap-4">
                    {Object.entries(Labels.EINGESCHAETZTE_PROGNOSE_LABELS).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="eingeschaetztePrognose"
                          checked={prognose.eingeschaetztePrognose === key}
                          onChange={() => kapitel6Handlers.setEingeschaetztePrognose(key as FormTypes.EingeschaetztePrognose)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-text-primary">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Freier Prognosetext */}
                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-2">
                    Ergänzender Prognosetext (optional)
                  </h4>
                  <textarea
                    value={prognose.prognosetextFrei}
                    onChange={(e) => setNestedField('kapitel6.prognose.prognosetextFrei', e.target.value)}
                    placeholder="Optionale ergänzende Angaben zur Prognose..."
                    rows={4}
                    className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Therapieziele Modals */}
      <ProblemBewaeltigungModal
        isOpen={isProblemBewaeltigungModalOpen}
        onClose={() => setIsProblemBewaeltigungModalOpen(false)}
        formData={formData}
        kapitel6Handlers={kapitel6Handlers}
      />
      <ZwischenmenschlichModal
        isOpen={isZwischenmenschlichModalOpen}
        onClose={() => setIsZwischenmenschlichModalOpen(false)}
        formData={formData}
        kapitel6Handlers={kapitel6Handlers}
      />
      <WohlbefindenModal
        isOpen={isWohlbefindenModalOpen}
        onClose={() => setIsWohlbefindenModalOpen(false)}
        formData={formData}
        kapitel6Handlers={kapitel6Handlers}
      />
      <SelbstbezogenModal
        isOpen={isSelbstbezogenModalOpen}
        onClose={() => setIsSelbstbezogenModalOpen(false)}
        formData={formData}
        kapitel6Handlers={kapitel6Handlers}
      />

      {/* Behandlungsplan Modals */}
      <AllgemeineInterventionenModal
        isOpen={isAllgemeineModalOpen}
        onClose={() => setIsAllgemeineModalOpen(false)}
        formData={formData}
        kapitel6Handlers={kapitel6Handlers}
      />
      <DepressionInterventionenModal
        isOpen={isDepressionModalOpen}
        onClose={() => setIsDepressionModalOpen(false)}
        formData={formData}
        kapitel6Handlers={kapitel6Handlers}
      />
      <BipolareInterventionenModal
        isOpen={isBipolareModalOpen}
        onClose={() => setIsBipolareModalOpen(false)}
        formData={formData}
        kapitel6Handlers={kapitel6Handlers}
      />
      <AngstInterventionenModal
        isOpen={isAngstModalOpen}
        onClose={() => setIsAngstModalOpen(false)}
        formData={formData}
        kapitel6Handlers={kapitel6Handlers}
      />
      <BorderlineInterventionenModal
        isOpen={isBorderlineModalOpen}
        onClose={() => setIsBorderlineModalOpen(false)}
        formData={formData}
        kapitel6Handlers={kapitel6Handlers}
      />
      <PTBSInterventionenModal
        isOpen={isPTBSModalOpen}
        onClose={() => setIsPTBSModalOpen(false)}
        formData={formData}
        kapitel6Handlers={kapitel6Handlers}
      />
      <ZwangInterventionenModal
        isOpen={isZwangModalOpen}
        onClose={() => setIsZwangModalOpen(false)}
        formData={formData}
        kapitel6Handlers={kapitel6Handlers}
      />
      <SomatoformeInterventionenModal
        isOpen={isSomatoformeModalOpen}
        onClose={() => setIsSomatoformeModalOpen(false)}
        formData={formData}
        kapitel6Handlers={kapitel6Handlers}
      />
      <AnorexieInterventionenModal
        isOpen={isAnorexieModalOpen}
        onClose={() => setIsAnorexieModalOpen(false)}
        formData={formData}
        kapitel6Handlers={kapitel6Handlers}
      />
      <BulimieInterventionenModal
        isOpen={isBulimieModalOpen}
        onClose={() => setIsBulimieModalOpen(false)}
        formData={formData}
        kapitel6Handlers={kapitel6Handlers}
      />
      <PsychoseInterventionenModal
        isOpen={isPsychoseModalOpen}
        onClose={() => setIsPsychoseModalOpen(false)}
        formData={formData}
        kapitel6Handlers={kapitel6Handlers}
      />
    </div>
  );
}
