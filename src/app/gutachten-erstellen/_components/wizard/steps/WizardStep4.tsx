'use client';

import * as FormTypes from '@/lib/core/form-types';
import * as FormLabels from '@/lib/core/form-labels';
import { ArrayHandlers, SomatischerBefundHandlers } from '@/hooks/useGutachtenForm';
import { useState, useMemo } from 'react';
import { MEDICATION_CATALOG, MedicationItem } from '@/lib/data/medication-catalog';

interface WizardStep4Props {
  formData: FormTypes.Form;
  setNestedField: (fieldPath: string, value: string) => void;
  setNestedBoolean: (fieldPath: string, value: boolean) => void;
  arrayHandlers: ArrayHandlers;
  somatischerBefundHandlers?: SomatischerBefundHandlers;
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

// Medication search function
function searchMedications(query: string): MedicationItem[] {
  if (!query || query.length < 2) return [];
  const lowerQuery = query.toLowerCase();
  return MEDICATION_CATALOG.filter(med =>
    med.name.toLowerCase().includes(lowerQuery)
  ).slice(0, 10);
}

// Reusable SelectableCard component
function SelectableCard({
  label,
  isSelected,
  onClick,
  className = '',
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex items-center justify-center p-3 rounded-lg border-2
        transition-all duration-200 min-h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer
        ${isSelected
          ? 'border-blue-500 bg-accent-blue-light shadow-sm'
          : 'border-border-primary bg-surface-primary hover:border-blue-300 hover:bg-accent-blue-light/50'
        }
        ${className}
      `}
    >
      {isSelected && (
        <div className="absolute top-1 right-1">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-text-secondary'}`}>
        {label}
      </span>
    </button>
  );
}

// Delete button component
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

// Add button component
function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full p-3 border-2 border-dashed border-border-primary rounded-lg text-text-tertiary hover:border-blue-400 hover:text-blue-600 transition-colors"
    >
      + {label}
    </button>
  );
}

// Medication Entry Card
function MedicationEntryCard({
  entry,
  onUpdate,
  onRemove,
}: {
  entry: FormTypes.MedikamentEntry;
  onUpdate: (updates: Partial<Omit<FormTypes.MedikamentEntry, 'id'>>) => void;
  onRemove: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const searchResults = useMemo(() => searchMedications(searchQuery), [searchQuery]);

  const handleSelectMedication = (med: MedicationItem) => {
    onUpdate({
      praeparat: med.name,
      kategorie: med.kategorie,
      subkategorie: med.subkategorie || null,
    });
    setSearchQuery('');
  };

  return (
    <div className="bg-surface-primary border-2 border-border-primary rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h5 className="text-sm font-semibold text-text-primary">Medikament</h5>
        <DeleteButton onClick={onRemove} />
      </div>

      <div className="space-y-4">
        {/* Präparat with autocomplete */}
        <div className="relative">
          <label className="block text-sm font-medium text-text-secondary mb-1">Präparat</label>
          <input
            type="text"
            value={searchQuery || entry.praeparat}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!e.target.value) {
                onUpdate({ praeparat: '', kategorie: null, subkategorie: null });
              }
            }}
            placeholder="Medikament suchen..."
            className="w-full px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
          />
          {searchQuery.length >= 2 && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((med) => (
                <button
                  key={med.name}
                  type="button"
                  onClick={() => handleSelectMedication(med)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
                >
                  <span className="font-semibold text-blue-600">{med.name}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    ({FormLabels.MEDIKAMENT_KATEGORIE_LABELS[med.kategorie]})
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dosierung */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Dosierung (mg)</label>
          <input
            type="number"
            value={entry.dosierung ?? ''}
            onChange={(e) => onUpdate({ dosierung: e.target.value ? Number(e.target.value) : null })}
            placeholder="z.B. 50"
            className="w-full px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
          />
        </div>

        {/* Einnahme seit */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Einnahme seit</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={entry.einnahmeSeit?.wert ?? ''}
              onChange={(e) => onUpdate({
                einnahmeSeit: {
                  wert: e.target.value ? Number(e.target.value) : 0,
                  einheit: entry.einnahmeSeit?.einheit ?? FormTypes.EinnahmeEinheit.Monate,
                }
              })}
              placeholder="Anzahl"
              className="w-24 px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
            />
            <select
              value={entry.einnahmeSeit?.einheit ?? FormTypes.EinnahmeEinheit.Monate}
              onChange={(e) => onUpdate({
                einnahmeSeit: {
                  wert: entry.einnahmeSeit?.wert ?? 0,
                  einheit: e.target.value as FormTypes.EinnahmeEinheit,
                }
              })}
              className="flex-1 px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
            >
              {Object.entries(FormLabels.EINNAHME_EINHEIT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Verordnung */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Verordnet durch</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(FormLabels.VERORDNUNG_LABELS).map(([value, label]) => (
              <SelectableCard
                key={value}
                label={label}
                isSelected={entry.verordnung?.durch === value}
                onClick={() => {
                  if (value === FormTypes.Verordnung.Sonstige) {
                    onUpdate({ verordnung: { durch: FormTypes.Verordnung.Sonstige, sonstigeText: '' } });
                  } else {
                    onUpdate({ verordnung: { durch: value as FormTypes.Verordnung.Hausarzt | FormTypes.Verordnung.Psychiater } });
                  }
                }}
              />
            ))}
          </div>
          {entry.verordnung?.durch === FormTypes.Verordnung.Sonstige && (
            <input
              type="text"
              value={(entry.verordnung as { durch: FormTypes.Verordnung.Sonstige; sonstigeText: string }).sonstigeText || ''}
              onChange={(e) => onUpdate({
                verordnung: { durch: FormTypes.Verordnung.Sonstige, sonstigeText: e.target.value }
              })}
              placeholder="Bitte angeben..."
              className="mt-2 w-full px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Vorbehandlung Entry Card
function VorbehandlungEntryCard({
  entry,
  onUpdate,
  onRemove,
}: {
  entry: FormTypes.VorbehandlungEntry;
  onUpdate: (updates: Partial<Omit<FormTypes.VorbehandlungEntry, 'id'>>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="bg-surface-primary border-2 border-border-primary rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h5 className="text-sm font-semibold text-text-primary">Vorbehandlung</h5>
        <DeleteButton onClick={onRemove} />
      </div>

      <div className="space-y-4">
        {/* Art der Behandlung */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Art der Behandlung</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(FormLabels.VORBEHANDLUNG_ART_LABELS).map(([value, label]) => (
              <SelectableCard
                key={value}
                label={label}
                isSelected={entry.art === value}
                onClick={() => onUpdate({ art: value as FormTypes.VorbehandlungArt })}
              />
            ))}
          </div>
        </div>

        {/* Setting */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Setting</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(FormLabels.VORBEHANDLUNG_SETTING_LABELS).map(([value, label]) => (
              <SelectableCard
                key={value}
                label={label}
                isSelected={entry.setting === value}
                onClick={() => onUpdate({ setting: value as FormTypes.VorbehandlungSetting })}
              />
            ))}
          </div>
        </div>

        {/* Zeitraum */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Zeitraum</label>
          <input
            type="text"
            value={entry.zeitraum.textBeschreibung}
            onChange={(e) => onUpdate({
              zeitraum: { ...entry.zeitraum, textBeschreibung: e.target.value }
            })}
            placeholder="z.B. 01/2020 bis 12/2021, ca. 2 Jahre"
            className="w-full px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
          />
        </div>

        {/* Behandlungsort */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Behandlungsort</label>
          <input
            type="text"
            value={entry.ort}
            onChange={(e) => onUpdate({ ort: e.target.value })}
            placeholder="z.B. Universitätsklinik München"
            className="w-full px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
          />
        </div>

        {/* Abschlussberichte */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Abschlussberichte</label>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(FormLabels.ABSCHLUSSBERICHTE_STATUS_LABELS).map(([value, label]) => (
              <SelectableCard
                key={value}
                label={label}
                isSelected={entry.abschlussberichte === value}
                onClick={() => onUpdate({ abschlussberichte: value as FormTypes.AbschlussberichteStatus })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Häufigkeit Selector component
function HaeufigkeitSelector({
  value,
  onChange,
}: {
  value: FormTypes.Haeufigkeit | null;
  onChange: (value: FormTypes.Haeufigkeit) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-2">Häufigkeit</label>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(FormLabels.KONSUM_HAEUFIGKEIT_LABELS).map(([key, label]) => (
          <SelectableCard
            key={key}
            label={label}
            isSelected={value?.typ === key}
            onClick={() => {
              if (key === FormTypes.KonsumHaeufigkeit.Andere) {
                onChange({ typ: FormTypes.KonsumHaeufigkeit.Andere, text: '' });
              } else {
                onChange({ typ: key as FormTypes.KonsumHaeufigkeit.Taeglich | FormTypes.KonsumHaeufigkeit.Woechentlich | FormTypes.KonsumHaeufigkeit.Gelegentlich });
              }
            }}
          />
        ))}
      </div>
      {value?.typ === FormTypes.KonsumHaeufigkeit.Andere && (
        <input
          type="text"
          value={(value as { typ: FormTypes.KonsumHaeufigkeit.Andere; text: string }).text}
          onChange={(e) => onChange({ typ: FormTypes.KonsumHaeufigkeit.Andere, text: e.target.value })}
          placeholder="Bitte beschreiben..."
          className="mt-2 w-full px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
        />
      )}
    </div>
  );
}

// Illegale Droge Entry Card
function IllegaleDrogeEntryCard({
  entry,
  onUpdate,
  onRemove,
}: {
  entry: FormTypes.IllegaleDrogenEntry;
  onUpdate: (updates: Partial<Omit<FormTypes.IllegaleDrogenEntry, 'id'>>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="bg-surface-primary border-2 border-border-primary rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h5 className="text-sm font-semibold text-text-primary">Substanz</h5>
        <DeleteButton onClick={onRemove} />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Suchtmittel</label>
          <input
            type="text"
            value={entry.suchtmittel}
            onChange={(e) => onUpdate({ suchtmittel: e.target.value })}
            placeholder="z.B. Kokain, Heroin, Amphetamine"
            className="w-full px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-secondary mb-1">Menge</label>
            <input
              type="number"
              value={entry.menge ?? ''}
              onChange={(e) => onUpdate({ menge: e.target.value ? Number(e.target.value) : null })}
              placeholder="Menge"
              className="w-full px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
            />
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium text-text-secondary mb-1">Einheit</label>
            <select
              value={entry.mengeEinheit}
              onChange={(e) => onUpdate({ mengeEinheit: e.target.value as FormTypes.MengeEinheit })}
              className="w-full px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
            >
              {Object.entries(FormLabels.MENGE_EINHEIT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <HaeufigkeitSelector
          value={entry.haeufigkeit}
          onChange={(haeufigkeit) => onUpdate({ haeufigkeit })}
        />
      </div>
    </div>
  );
}

export function WizardStep4({
  formData,
  somatischerBefundHandlers,
  currentSubStep,
  onSubStepChange,
}: WizardStep4Props) {
  const handleSubStepClick = (stepNumber: number) => {
    onSubStepChange(stepNumber);
  };

  // Shortcuts for data and handlers
  const somato1 = formData.somato1;
  const somato2 = formData.somato2;
  const somato3 = formData.somato3;
  const somato4 = formData.somato4;
  const somato5 = formData.somato5;
  const handlers = somatischerBefundHandlers;

  // Get Sucht konsum data safely
  const suchtKonsum = somato5.suchtanamnese && somato5.suchtanamnese.keineSucht === false
    ? somato5.suchtanamnese.konsum
    : null;

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

          {/* Substep 1: Somatische Vorerkrankungen + Konsiliarbericht */}
          {currentSubStep === 1 && handlers && (
            <div className="space-y-6">
              {/* Somatische Vorerkrankungen */}
              <div>
                <h4 className="text-base font-semibold text-text-primary mb-3">Somatische Vorerkrankungen</h4>
                <div className="grid grid-cols-3 gap-2.5 mb-4">
                  <SelectableCard
                    label="Keine Vorerkrankungen"
                    isSelected={somato1.somatischeVorerkrankungen?.vorhanden === false}
                    onClick={() => handlers.somato1.setSomatischeVorerkrankungen({ vorhanden: false })}
                  />
                  <SelectableCard
                    label="Vorerkrankungen vorhanden"
                    isSelected={somato1.somatischeVorerkrankungen?.vorhanden === true}
                    onClick={() => handlers.somato1.setSomatischeVorerkrankungen({ vorhanden: true, details: '' })}
                  />
                  <SelectableCard
                    label="Keine Angabe"
                    isSelected={somato1.somatischeVorerkrankungen === null}
                    onClick={() => handlers.somato1.setSomatischeVorerkrankungen(null)}
                  />
                </div>
                {somato1.somatischeVorerkrankungen?.vorhanden === true && (
                  <textarea
                    value={(somato1.somatischeVorerkrankungen as { vorhanden: true; details: string }).details}
                    onChange={(e) => handlers.somato1.setSomatischeVorerkrankungen({
                      vorhanden: true,
                      details: e.target.value,
                    })}
                    placeholder="Beschreibung der somatischen Vorerkrankungen..."
                    rows={4}
                    className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
                  />
                )}
              </div>

              {/* Konsiliarbericht */}
              <div className="border-t border-border-primary pt-6">
                <h4 className="text-base font-semibold text-text-primary mb-3">Konsiliarbericht</h4>
                <label className="flex items-center gap-3 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={somato1.konsiliarberichtVorhanden}
                    onChange={(e) => handlers.somato1.setKonsiliarbericht(e.target.checked, somato1.konsiliarberichtText)}
                    className="w-5 h-5 text-blue-500 border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="text-sm font-medium text-text-primary">Konsiliarbericht vorhanden</span>
                </label>
                {somato1.konsiliarberichtVorhanden && (
                  <textarea
                    value={somato1.konsiliarberichtText}
                    onChange={(e) => handlers.somato1.setKonsiliarbericht(true, e.target.value)}
                    placeholder="Details zum Konsiliarbericht..."
                    rows={4}
                    className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
                  />
                )}
              </div>
            </div>
          )}

          {/* Substep 2: Medikation */}
          {currentSubStep === 2 && handlers && (
            <div className="space-y-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={somato2.keineMedikation}
                  onChange={(e) => handlers.somato2.setKeineMedikation(e.target.checked)}
                  className="w-5 h-5 text-blue-500 border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-sm font-medium text-text-primary">Keine Medikation</span>
              </label>

              {!somato2.keineMedikation && (
                <div className="space-y-4">
                  {somato2.medikamente.map((med) => (
                    <MedicationEntryCard
                      key={med.id}
                      entry={med}
                      onUpdate={(updates) => handlers.somato2.updateMedikament(med.id, updates)}
                      onRemove={() => handlers.somato2.removeMedikament(med.id)}
                    />
                  ))}
                  <AddButton label="Medikament hinzufügen" onClick={() => handlers.somato2.addMedikament()} />
                </div>
              )}
            </div>
          )}

          {/* Substep 3: Vorbehandlungen */}
          {currentSubStep === 3 && handlers && (
            <div className="space-y-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={somato3.keineVorbehandlung}
                  onChange={(e) => handlers.somato3.setKeineVorbehandlung(e.target.checked)}
                  className="w-5 h-5 text-blue-500 border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-sm font-medium text-text-primary">Keine Vorbehandlung</span>
              </label>

              {!somato3.keineVorbehandlung && (
                <div className="space-y-4">
                  {somato3.vorbehandlungen.map((vorb) => (
                    <VorbehandlungEntryCard
                      key={vorb.id}
                      entry={vorb}
                      onUpdate={(updates) => handlers.somato3.updateVorbehandlung(vorb.id, updates)}
                      onRemove={() => handlers.somato3.removeVorbehandlung(vorb.id)}
                    />
                  ))}
                  <AddButton label="Vorbehandlung hinzufügen" onClick={() => handlers.somato3.addVorbehandlung()} />
                </div>
              )}

              {/* Aktuelle Behandlung */}
              <div className="border-t border-border-primary pt-6">
                <h4 className="text-base font-semibold text-text-primary mb-3">Aktuell in Behandlung?</h4>
                <div className="grid grid-cols-3 gap-2">
                  <SelectableCard
                    label="Ja"
                    isSelected={somato3.aktuelleBehandlung === true}
                    onClick={() => handlers.somato3.setAktuelleBehandlung(true)}
                  />
                  <SelectableCard
                    label="Nein"
                    isSelected={somato3.aktuelleBehandlung === false}
                    onClick={() => handlers.somato3.setAktuelleBehandlung(false)}
                  />
                  <SelectableCard
                    label="Keine Angabe"
                    isSelected={somato3.aktuelleBehandlung === null}
                    onClick={() => handlers.somato3.setAktuelleBehandlung(null)}
                  />
                </div>
              </div>

              {/* Zusatztext */}
              <div className="border-t border-border-primary pt-6">
                <h4 className="text-base font-semibold text-text-primary mb-3">Zusätzliche Anmerkungen</h4>
                <textarea
                  value={somato3.zusatztext}
                  onChange={(e) => handlers.somato3.setZusatztext(e.target.value)}
                  placeholder="Optionale Ergänzungen zu den Vorbehandlungen..."
                  rows={3}
                  className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
                />
              </div>
            </div>
          )}

          {/* Substep 4: Familienanamnese */}
          {currentSubStep === 4 && handlers && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                <SelectableCard
                  label="Unauffällig"
                  isSelected={somato4.familienanamnese?.unauffaellig === true}
                  onClick={() => handlers.somato4.setFamilienanamnese({ unauffaellig: true })}
                />
                <SelectableCard
                  label="Auffälligkeiten vorhanden"
                  isSelected={somato4.familienanamnese?.unauffaellig === false}
                  onClick={() => handlers.somato4.setFamilienanamnese({ unauffaellig: false, details: '' })}
                />
                <SelectableCard
                  label="Keine Angabe"
                  isSelected={somato4.familienanamnese === null}
                  onClick={() => handlers.somato4.setFamilienanamnese(null)}
                />
              </div>

              {somato4.familienanamnese?.unauffaellig === false && (
                <textarea
                  value={(somato4.familienanamnese as { unauffaellig: false; details: string }).details}
                  onChange={(e) => handlers.somato4.setFamilienanamnese({
                    unauffaellig: false,
                    details: e.target.value,
                  })}
                  placeholder="Beschreiben Sie psychiatrische Erkrankungen bei Familienangehörigen ersten Grades..."
                  rows={4}
                  className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
                />
              )}

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Hinweis:</strong> Beschreiben Sie psychiatrische Erkrankungen bei Familienangehörigen
                  ersten Grades (Eltern, Geschwister, Kinder).
                </p>
              </div>
            </div>
          )}

          {/* Substep 5: Suchtanamnese */}
          {currentSubStep === 5 && handlers && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                <SelectableCard
                  label="Kein Hinweis auf Sucht"
                  isSelected={somato5.suchtanamnese?.keineSucht === true}
                  onClick={() => handlers.somato5.setKeineSucht(true)}
                />
                <SelectableCard
                  label="Suchtanamnese vorhanden"
                  isSelected={somato5.suchtanamnese?.keineSucht === false}
                  onClick={() => handlers.somato5.setKeineSucht(false)}
                />
                <SelectableCard
                  label="Keine Angabe"
                  isSelected={somato5.suchtanamnese === null}
                  onClick={() => handlers.somato5.setSuchtanamnese(null)}
                />
              </div>

              {somato5.suchtanamnese?.keineSucht === false && suchtKonsum && (
                <div className="space-y-8">
                  {/* Alkohol Section */}
                  <div className="border-t border-border-primary pt-6">
                    <h4 className="text-base font-bold text-text-primary flex items-center gap-2 mb-4">
                      <span>Alkohol</span>
                    </h4>

                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(FormLabels.ALKOHOL_ART_LABELS).map(([art, label]) => {
                          const isSelected = suchtKonsum.alkohol?.konsumArten.some(k => k.art === art) ?? false;
                          return (
                            <SelectableCard
                              key={art}
                              label={label}
                              isSelected={isSelected}
                              onClick={() => {
                                if (isSelected) {
                                  handlers.somato5.removeAlkoholKonsum(art as FormTypes.AlkoholArt);
                                } else {
                                  handlers.somato5.addAlkoholKonsum(art as FormTypes.AlkoholArt);
                                }
                              }}
                            />
                          );
                        })}
                      </div>

                      {suchtKonsum.alkohol && suchtKonsum.alkohol.konsumArten.length > 0 && (
                        <>
                          <div className="space-y-3">
                            {suchtKonsum.alkohol.konsumArten.map((konsum) => (
                              <div key={konsum.art} className="flex items-center gap-4 bg-surface-secondary p-3 rounded-lg">
                                <span className="font-medium text-text-primary w-20">
                                  {FormLabels.ALKOHOL_ART_LABELS[konsum.art]}:
                                </span>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={konsum.mengeLiter ?? ''}
                                    onChange={(e) => handlers.somato5.updateAlkoholKonsum(konsum.art, {
                                      mengeLiter: e.target.value ? Number(e.target.value) : null,
                                    })}
                                    placeholder="Liter"
                                    className="w-20 px-2 py-1 text-sm border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                                  />
                                  <span className="text-text-secondary text-sm">L oder</span>
                                  <input
                                    type="number"
                                    value={konsum.mengeGlaeser ?? ''}
                                    onChange={(e) => handlers.somato5.updateAlkoholKonsum(konsum.art, {
                                      mengeGlaeser: e.target.value ? Number(e.target.value) : null,
                                    })}
                                    placeholder="Gläser"
                                    className="w-20 px-2 py-1 text-sm border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                                  />
                                  <span className="text-text-secondary text-sm">Gläser</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <HaeufigkeitSelector
                            value={suchtKonsum.alkohol.haeufigkeit}
                            onChange={(haeufigkeit) => handlers.somato5.setAlkoholHaeufigkeit(haeufigkeit)}
                          />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Nikotin Section */}
                  <div className="border-t border-border-primary pt-6">
                    <h4 className="text-base font-bold text-text-primary flex items-center gap-2 mb-4">
                      <span>Nikotin</span>
                    </h4>

                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-2">
                        {Object.entries(FormLabels.NIKOTIN_FORM_LABELS).map(([form, label]) => {
                          const isSelected = suchtKonsum.nikotin?.some(n => n.form === form) ?? false;
                          return (
                            <SelectableCard
                              key={form}
                              label={label}
                              isSelected={isSelected}
                              onClick={() => {
                                if (isSelected) {
                                  handlers.somato5.removeNikotinKonsum(form as FormTypes.NikotinForm);
                                } else {
                                  // Add with default values based on form
                                  const nikotinForm = form as FormTypes.NikotinForm;
                                  let newKonsum: FormTypes.NikotinKonsum;
                                  switch (nikotinForm) {
                                    case FormTypes.NikotinForm.Zigaretten:
                                      newKonsum = { form: FormTypes.NikotinForm.Zigaretten, anzahlProTag: null };
                                      break;
                                    case FormTypes.NikotinForm.Snus:
                                      newKonsum = { form: FormTypes.NikotinForm.Snus, portionenProTag: null };
                                      break;
                                    case FormTypes.NikotinForm.Schnupftabak:
                                      newKonsum = { form: FormTypes.NikotinForm.Schnupftabak, mengeProTag: '' };
                                      break;
                                    case FormTypes.NikotinForm.Vape:
                                      newKonsum = { form: FormTypes.NikotinForm.Vape, mlProTag: null };
                                      break;
                                  }
                                  handlers.somato5.addNikotinKonsum(newKonsum);
                                }
                              }}
                            />
                          );
                        })}
                      </div>

                      {suchtKonsum.nikotin && suchtKonsum.nikotin.length > 0 && (
                        <div className="space-y-3">
                          {suchtKonsum.nikotin.map((konsum) => (
                            <div key={konsum.form} className="flex items-center gap-4 bg-surface-secondary p-3 rounded-lg">
                              <span className="font-medium text-text-primary w-28">
                                {FormLabels.NIKOTIN_FORM_LABELS[konsum.form]}:
                              </span>
                              {konsum.form === FormTypes.NikotinForm.Zigaretten && (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={(konsum as { form: FormTypes.NikotinForm.Zigaretten; anzahlProTag: number | null }).anzahlProTag ?? ''}
                                    onChange={(e) => handlers.somato5.updateNikotinKonsum({
                                      form: FormTypes.NikotinForm.Zigaretten,
                                      anzahlProTag: e.target.value ? Number(e.target.value) : null,
                                    })}
                                    placeholder="Anzahl"
                                    className="w-20 px-2 py-1 text-sm border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                                  />
                                  <span className="text-text-secondary text-sm">pro Tag</span>
                                </div>
                              )}
                              {konsum.form === FormTypes.NikotinForm.Snus && (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={(konsum as { form: FormTypes.NikotinForm.Snus; portionenProTag: number | null }).portionenProTag ?? ''}
                                    onChange={(e) => handlers.somato5.updateNikotinKonsum({
                                      form: FormTypes.NikotinForm.Snus,
                                      portionenProTag: e.target.value ? Number(e.target.value) : null,
                                    })}
                                    placeholder="Portionen"
                                    className="w-20 px-2 py-1 text-sm border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                                  />
                                  <span className="text-text-secondary text-sm">pro Tag</span>
                                </div>
                              )}
                              {konsum.form === FormTypes.NikotinForm.Schnupftabak && (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={(konsum as { form: FormTypes.NikotinForm.Schnupftabak; mengeProTag: string }).mengeProTag}
                                    onChange={(e) => handlers.somato5.updateNikotinKonsum({
                                      form: FormTypes.NikotinForm.Schnupftabak,
                                      mengeProTag: e.target.value,
                                    })}
                                    placeholder="z.B. mehrere Prisen"
                                    className="w-40 px-2 py-1 text-sm border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                                  />
                                  <span className="text-text-secondary text-sm">pro Tag</span>
                                </div>
                              )}
                              {konsum.form === FormTypes.NikotinForm.Vape && (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={(konsum as { form: FormTypes.NikotinForm.Vape; mlProTag: number | null }).mlProTag ?? ''}
                                    onChange={(e) => handlers.somato5.updateNikotinKonsum({
                                      form: FormTypes.NikotinForm.Vape,
                                      mlProTag: e.target.value ? Number(e.target.value) : null,
                                    })}
                                    placeholder="ml"
                                    className="w-20 px-2 py-1 text-sm border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                                  />
                                  <span className="text-text-secondary text-sm">ml pro Tag</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* THC Section */}
                  <div className="border-t border-border-primary pt-6">
                    <h4 className="text-base font-bold text-text-primary flex items-center gap-2 mb-4">
                      <span>THC / Cannabis</span>
                    </h4>

                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                      <input
                        type="checkbox"
                        checked={suchtKonsum.thc !== null}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handlers.somato5.setTHCData({
                              mengeGramm: null,
                              haeufigkeit: { typ: FormTypes.KonsumHaeufigkeit.Gelegentlich },
                            });
                          } else {
                            handlers.somato5.setTHCData(null);
                          }
                        }}
                        className="w-5 h-5 text-blue-500 border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400"
                      />
                      <span className="text-sm font-medium text-text-primary">THC-Konsum</span>
                    </label>

                    {suchtKonsum.thc && (
                      <div className="space-y-4 ml-8">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-text-secondary">Menge:</label>
                          <input
                            type="number"
                            step="0.1"
                            value={suchtKonsum.thc.mengeGramm ?? ''}
                            onChange={(e) => handlers.somato5.setTHCData({
                              ...suchtKonsum.thc!,
                              mengeGramm: e.target.value ? Number(e.target.value) : null,
                            })}
                            placeholder="Gramm"
                            className="w-20 px-2 py-1 text-sm border-2 border-border-primary rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                          />
                          <span className="text-text-secondary text-sm">g</span>
                        </div>

                        <HaeufigkeitSelector
                          value={suchtKonsum.thc.haeufigkeit}
                          onChange={(haeufigkeit) => handlers.somato5.setTHCData({
                            ...suchtKonsum.thc!,
                            haeufigkeit,
                          })}
                        />
                      </div>
                    )}
                  </div>

                  {/* Illegale Drogen Section */}
                  <div className="border-t border-border-primary pt-6">
                    <h4 className="text-base font-bold text-text-primary flex items-center gap-2 mb-4">
                      <span>Illegale Drogen</span>
                    </h4>

                    <div className="space-y-4">
                      {suchtKonsum.illegaleDrogen.map((droge) => (
                        <IllegaleDrogeEntryCard
                          key={droge.id}
                          entry={droge}
                          onUpdate={(updates) => handlers.somato5.updateIllegaleDroge(droge.id, updates)}
                          onRemove={() => handlers.somato5.removeIllegaleDroge(droge.id)}
                        />
                      ))}
                      <AddButton label="Substanz hinzufügen" onClick={() => handlers.somato5.addIllegaleDroge()} />
                    </div>
                  </div>

                  {/* Medikamenten-Missbrauch Section */}
                  <div className="border-t border-border-primary pt-6">
                    <h4 className="text-base font-bold text-text-primary flex items-center gap-2 mb-4">
                      <span>Medikamenten-Missbrauch</span>
                    </h4>

                    <div className="space-y-4">
                      {suchtKonsum.medikamentenMissbrauch.map((med) => (
                        <div key={med.id} className="bg-surface-primary border-2 border-border-primary rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <h5 className="text-sm font-semibold text-text-primary">Medikament</h5>
                            <DeleteButton onClick={() => handlers.somato5.removeMedikamentenMissbrauch(med.id)} />
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-text-secondary mb-1">Substanz</label>
                              <input
                                type="text"
                                value={med.substanz}
                                onChange={(e) => handlers.somato5.updateMedikamentenMissbrauch(med.id, { substanz: e.target.value })}
                                placeholder="z.B. Benzodiazepine, Opioide"
                                className="w-full px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                              />
                            </div>

                            <div className="flex gap-2">
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-text-secondary mb-1">Menge</label>
                                <input
                                  type="number"
                                  value={med.menge ?? ''}
                                  onChange={(e) => handlers.somato5.updateMedikamentenMissbrauch(med.id, {
                                    menge: e.target.value ? Number(e.target.value) : null,
                                  })}
                                  placeholder="Menge"
                                  className="w-full px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                                />
                              </div>
                              <div className="w-24">
                                <label className="block text-sm font-medium text-text-secondary mb-1">Einheit</label>
                                <select
                                  value={med.mengeEinheit}
                                  onChange={(e) => handlers.somato5.updateMedikamentenMissbrauch(med.id, {
                                    mengeEinheit: e.target.value as FormTypes.MengeEinheit,
                                  })}
                                  className="w-full px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                                >
                                  {Object.entries(FormLabels.MENGE_EINHEIT_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <HaeufigkeitSelector
                              value={med.haeufigkeit}
                              onChange={(haeufigkeit) => handlers.somato5.updateMedikamentenMissbrauch(med.id, { haeufigkeit })}
                            />
                          </div>
                        </div>
                      ))}
                      <AddButton label="Medikament hinzufügen" onClick={() => handlers.somato5.addMedikamentenMissbrauch()} />
                    </div>
                  </div>

                  {/* Andere Suchtformen & Zusatztext */}
                  <div className="border-t border-border-primary pt-6">
                    <h4 className="text-base font-bold text-text-primary flex items-center gap-2 mb-4">
                      <span>Weitere Angaben</span>
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Andere Suchtformen</label>
                        <input
                          type="text"
                          value={suchtKonsum.andereSuchtform}
                          onChange={(e) => handlers.somato5.setAndereSuchtform(e.target.value)}
                          placeholder="z.B. Spielsucht, Internetsucht"
                          className="w-full px-3 py-2 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Zusätzliche Anmerkungen</label>
                        <textarea
                          value={suchtKonsum.zusatztext}
                          onChange={(e) => handlers.somato5.setZusatztext(e.target.value)}
                          placeholder="Weitere Informationen zur Suchtanamnese..."
                          rows={3}
                          className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Fallback if handlers not available */}
          {!handlers && (
            <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-amber-800 dark:text-amber-200 text-center">
                Fehler: Die Formulardaten konnten nicht geladen werden.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
