'use client';

import * as FormTypes from '@/lib/core/form-types';

interface BiopsychosozialBorderlineFormProps {
  data: FormTypes.BiopsychosozialBorderlineModellData;
  onUpdate: (data: FormTypes.BiopsychosozialBorderlineModellData) => void;
}

export function BiopsychosozialBorderlineForm({ data, onUpdate }: BiopsychosozialBorderlineFormProps) {
  const CheckboxItem = ({
    checked,
    onChange,
    label
  }: {
    checked: boolean;
    onChange: (value: boolean) => void;
    label: string;
  }) => (
    <label className="flex items-start gap-2 cursor-pointer py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">Biopsychosoziales Modell der Borderline-Persönlichkeitsstörung</h3>
        <p className="text-sm text-blue-700">
          Nach Linehan: Das Modell beschreibt die Wechselwirkung zwischen biologischer Vulnerabilität,
          invalidierendem Umfeld und Störung der Emotionsregulation.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Soziale Faktoren */}
        <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50/50">
          <label className="block text-sm font-bold text-purple-900 mb-3">
            Soziale Faktoren (Invalidierendes Umfeld)
          </label>
          <div className="space-y-1">
            <CheckboxItem
              checked={data.sozialChronischeInvalidierung}
              onChange={(v) => onUpdate({ ...data, sozialChronischeInvalidierung: v })}
              label="Chronische Invalidierung in der Kindheit"
            />
            <CheckboxItem
              checked={data.sozialMissbrauch}
              onChange={(v) => onUpdate({ ...data, sozialMissbrauch: v })}
              label="Sexueller/physischer/emotionaler Missbrauch"
            />
            <CheckboxItem
              checked={data.sozialTraumata}
              onChange={(v) => onUpdate({ ...data, sozialTraumata: v })}
              label="Frühe Traumata"
            />
            <CheckboxItem
              checked={data.sozialUngueinstigeBedingungen}
              onChange={(v) => onUpdate({ ...data, sozialUngueinstigeBedingungen: v })}
              label="Ungünstige Entwicklungsbedingungen"
            />
          </div>
        </div>

        {/* Biologische Faktoren */}
        <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50/50">
          <label className="block text-sm font-bold text-green-900 mb-3">
            Biologische Faktoren (Vulnerabilität)
          </label>
          <div className="space-y-1">
            <CheckboxItem
              checked={data.biologischErhohtesErregungsniveau}
              onChange={(v) => onUpdate({ ...data, biologischErhohtesErregungsniveau: v })}
              label="Erhöhtes Erregungsniveau / emotionale Sensitivität"
            />
            <CheckboxItem
              checked={data.biologischErhoehteImpulsivitaet}
              onChange={(v) => onUpdate({ ...data, biologischErhoehteImpulsivitaet: v })}
              label="Erhöhte Impulsivität"
            />
          </div>
        </div>
      </div>

      {/* Störung der Emotionsregulation */}
      <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50/50">
        <label className="block text-sm font-bold text-red-900 mb-3">
          Störung der Emotionsregulation (Resultat)
        </label>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <CheckboxItem
            checked={data.stoerungEmotionsregulationIntensiv}
            onChange={(v) => onUpdate({ ...data, stoerungEmotionsregulationIntensiv: v })}
            label="Intensive, schnell wechselnde Emotionen"
          />
          <CheckboxItem
            checked={data.stoerungEmotionsregulationUnkontrollierbar}
            onChange={(v) => onUpdate({ ...data, stoerungEmotionsregulationUnkontrollierbar: v })}
            label="Emotionen als unkontrollierbar erlebt"
          />
          <CheckboxItem
            checked={data.stoerungEmotionsregulationEmotionsphobie}
            onChange={(v) => onUpdate({ ...data, stoerungEmotionsregulationEmotionsphobie: v })}
            label="Emotionsphobie (Angst vor eigenen Gefühlen)"
          />
          <CheckboxItem
            checked={data.stoerungEmotionsregulationDysfunktional}
            onChange={(v) => onUpdate({ ...data, stoerungEmotionsregulationDysfunktional: v })}
            label="Dysfunktionale Regulationsstrategien"
          />
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-700 mb-2">Transaktionales Modell</h4>
        <p className="text-sm text-gray-600">
          Die biologische Vulnerabilität und das invalidierende Umfeld verstärken sich gegenseitig:
          Ein emotional sensitives Kind löst möglicherweise mehr invalidierende Reaktionen aus,
          während Invalidierung die Entwicklung von Emotionsregulationsstrategien behindert.
        </p>
      </div>
    </div>
  );
}
