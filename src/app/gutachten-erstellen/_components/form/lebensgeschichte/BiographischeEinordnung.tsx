'use client';

import { useState } from 'react';
import * as FormTypes from '@/lib/core/form-types';
import { LebensgeschichteHandlers } from '@/hooks/useGutachtenForm';
import { ElternteilModal } from './ElternteilModal';
import { GeschwisterSection } from './GeschwisterSection';
import { AndereBezugspersonenSection } from './AndereBezugspersonenSection';
import {
  BEZIEHUNGS_EIGENSCHAFT_LABELS,
  KRITISCHE_VERHALTENSWEISE_LABELS,
  VERLETZTES_GRUNDBEDUERFNIS_LABELS,
} from '@/lib/core/form-labels';

interface BiographischeEinordnungProps {
  data: FormTypes.KurzeBiographischeEinordnung;
  handlers: LebensgeschichteHandlers;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
}

const emptyElternteilData: FormTypes.ElternteilData = {
  geburtsjahr: '',
  beruf: '',
  beziehungsEigenschaften: {},
  beziehungsEigenschaftenAndere: '',
  kritischeVerhaltensweisen: {},
  kritischeVerhaltensweiseAndere: '',
  verletzteGrundbeduerfnisse: {},
  verletzteGrundbeduerfnisseAndere: '',
};

function getElternteilSummary(elternteilData: FormTypes.ElternteilData): string {
  const parts: string[] = [];

  const eigenschaftenCount = Object.keys(elternteilData.beziehungsEigenschaften || {}).length;
  if (eigenschaftenCount > 0) {
    const labels = (Object.keys(elternteilData.beziehungsEigenschaften || {}) as FormTypes.BeziehungsEigenschaft[])
      .slice(0, 2)
      .map(k => BEZIEHUNGS_EIGENSCHAFT_LABELS[k]);
    parts.push(labels.join(', ') + (eigenschaftenCount > 2 ? ` +${eigenschaftenCount - 2}` : ''));
  }

  const verhaltensCount = Object.keys(elternteilData.kritischeVerhaltensweisen || {}).length;
  if (verhaltensCount > 0) {
    const labels = (Object.keys(elternteilData.kritischeVerhaltensweisen || {}) as FormTypes.KritischeVerhaltensweise[])
      .slice(0, 2)
      .map(k => KRITISCHE_VERHALTENSWEISE_LABELS[k]);
    parts.push(labels.join(', ') + (verhaltensCount > 2 ? ` +${verhaltensCount - 2}` : ''));
  }

  const grundbeduerfnisseCount = Object.keys(elternteilData.verletzteGrundbeduerfnisse || {}).length;
  if (grundbeduerfnisseCount > 0) {
    const labels = (Object.keys(elternteilData.verletzteGrundbeduerfnisse || {}) as FormTypes.VerletztesGrundbeduerfnis[])
      .slice(0, 2)
      .map(k => VERLETZTES_GRUNDBEDUERFNIS_LABELS[k]);
    parts.push(labels.join(', ') + (grundbeduerfnisseCount > 2 ? ` +${grundbeduerfnisseCount - 2}` : ''));
  }

  if (parts.length === 0) {
    return 'Keine Angaben';
  }

  return parts.join(' | ');
}

export function BiographischeEinordnung({ data, handlers, setNestedField }: BiographischeEinordnungProps) {
  const [vaterModalOpen, setVaterModalOpen] = useState(false);
  const [mutterModalOpen, setMutterModalOpen] = useState(false);

  const handleVaterToggle = () => {
    if (data.vater.vorhanden) {
      setNestedField('lebensgA.kurzeBiographischeEinordnung.vater', { vorhanden: false });
    } else {
      setNestedField('lebensgA.kurzeBiographischeEinordnung.vater', {
        vorhanden: true,
        data: { ...emptyElternteilData },
      } as unknown as Record<string, unknown>);
    }
  };

  const handleMutterToggle = () => {
    if (data.mutter.vorhanden) {
      setNestedField('lebensgA.kurzeBiographischeEinordnung.mutter', { vorhanden: false });
    } else {
      setNestedField('lebensgA.kurzeBiographischeEinordnung.mutter', {
        vorhanden: true,
        data: { ...emptyElternteilData },
      } as unknown as Record<string, unknown>);
    }
  };

  const handleVaterChange = (newData: FormTypes.ElternteilData) => {
    setNestedField('lebensgA.kurzeBiographischeEinordnung.vater', {
      vorhanden: true,
      data: newData,
    } as unknown as Record<string, unknown>);
  };

  const handleMutterChange = (newData: FormTypes.ElternteilData) => {
    setNestedField('lebensgA.kurzeBiographischeEinordnung.mutter', {
      vorhanden: true,
      data: newData,
    } as unknown as Record<string, unknown>);
  };

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-base font-semibold text-text-primary mb-3">Kurze biographische Einordnung</h4>
        <p className="text-sm text-text-tertiary mb-4">
          Geburtsjahr und Geburtsort, Familie und wichtige Bezugspersonen, Beziehungseigenschaften, kritische Verhaltensweisen und verletzte Grundbedürfnisse
        </p>
      </div>

      {/* Basic info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Geburtsjahr</label>
          <input
            type="text"
            value={data.geburtsjahr}
            onChange={(e) => setNestedField('lebensgA.kurzeBiographischeEinordnung.geburtsjahr', e.target.value)}
            placeholder="z.B. 1985"
            className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Geburtsort</label>
          <input
            type="text"
            value={data.geburtsort}
            onChange={(e) => setNestedField('lebensgA.kurzeBiographischeEinordnung.geburtsort', e.target.value)}
            placeholder="z.B. München"
            className="w-full px-3 py-2 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary"
          />
        </div>
      </div>

      {/* Parents section - modal triggers */}
      <div className="grid grid-cols-2 gap-4">
        {/* Vater */}
        <div className="border-2 border-border-primary rounded-lg bg-surface-secondary/30">
          <div className="flex items-center justify-between p-3 border-b border-border-primary">
            <h4 className="text-base font-semibold text-text-primary">Vater</h4>
            <button
              type="button"
              onClick={handleVaterToggle}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                data.vater.vorhanden ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  data.vater.vorhanden ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          {data.vater.vorhanden && data.vater.data && (
            <div className="p-3">
              <p className="text-sm text-text-tertiary mb-2 line-clamp-2">
                {getElternteilSummary(data.vater.data)}
              </p>
              <button
                type="button"
                onClick={() => setVaterModalOpen(true)}
                className="w-full px-3 py-2 text-sm font-medium text-blue-600 border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Bearbeiten
              </button>
            </div>
          )}
        </div>

        {/* Mutter */}
        <div className="border-2 border-border-primary rounded-lg bg-surface-secondary/30">
          <div className="flex items-center justify-between p-3 border-b border-border-primary">
            <h4 className="text-base font-semibold text-text-primary">Mutter</h4>
            <button
              type="button"
              onClick={handleMutterToggle}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                data.mutter.vorhanden ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  data.mutter.vorhanden ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          {data.mutter.vorhanden && data.mutter.data && (
            <div className="p-3">
              <p className="text-sm text-text-tertiary mb-2 line-clamp-2">
                {getElternteilSummary(data.mutter.data)}
              </p>
              <button
                type="button"
                onClick={() => setMutterModalOpen(true)}
                className="w-full px-3 py-2 text-sm font-medium text-blue-600 border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Bearbeiten
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ElternteilModal
        isOpen={vaterModalOpen}
        onClose={() => setVaterModalOpen(false)}
        title="Vater"
        data={data.vater.vorhanden && data.vater.data ? data.vater.data : emptyElternteilData}
        onChange={handleVaterChange}
      />
      <ElternteilModal
        isOpen={mutterModalOpen}
        onClose={() => setMutterModalOpen(false)}
        title="Mutter"
        data={data.mutter.vorhanden && data.mutter.data ? data.mutter.data : emptyElternteilData}
        onChange={handleMutterChange}
      />

      {/* Geschwister */}
      <GeschwisterSection
        data={data.geschwister}
        handlers={handlers.geschwister}
      />

      {/* Andere Bezugspersonen */}
      <AndereBezugspersonenSection
        data={data.andereBezugspersonen}
        handlers={handlers.andereBezugspersonen}
      />

      {/* Weitere Angaben */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">Weitere Angaben zur biographischen Einordnung</label>
        <textarea
          value={data.weitereAngaben}
          onChange={(e) => setNestedField('lebensgA.kurzeBiographischeEinordnung.weitereAngaben', e.target.value)}
          placeholder="Weitere relevante Informationen zur Familie, zum häuslichen Umfeld, zur Wohnsituation etc."
          rows={4}
          className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
        />
      </div>
    </div>
  );
}
