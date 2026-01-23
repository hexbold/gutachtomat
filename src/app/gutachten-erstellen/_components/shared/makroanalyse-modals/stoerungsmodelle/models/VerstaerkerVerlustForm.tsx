'use client';

import * as FormTypes from '@/lib/core/form-types';

interface VerstaerkerVerlustFormProps {
  data: FormTypes.VerstaerkerVerlustModellData;
  onUpdate: (data: FormTypes.VerstaerkerVerlustModellData) => void;
}

interface CheckboxWithTextProps {
  label: string;
  value: { selected: boolean; text: string };
  onChange: (value: { selected: boolean; text: string }) => void;
  placeholder: string;
}

function CheckboxWithText({ label, value, onChange, placeholder }: CheckboxWithTextProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={value.selected}
          onChange={(e) => onChange({ ...value, selected: e.target.checked })}
          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      {value.selected && (
        <textarea
          value={value.text}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
          rows={2}
          placeholder={placeholder}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ml-8"
        />
      )}
    </div>
  );
}

export function VerstaerkerVerlustForm({ data, onUpdate }: VerstaerkerVerlustFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">Verstärkerverlust-Modell der Depression (nach Lewinsohn)</h3>
        <p className="text-sm text-blue-700">
          Depressionen entstehen durch einen Mangel an positiver Verstärkung. Wählen Sie die zutreffenden
          Faktoren aus und ergänzen Sie Details.
        </p>
      </div>

      <div className="space-y-4">
        <CheckboxWithText
          label="Verlust positiver Verstärker"
          value={data.verlustPositiverVerstaerker}
          onChange={(v) => onUpdate({ ...data, verlustPositiverVerstaerker: v })}
          placeholder="z.B. Verlust des Partners, Tod eines Angehörigen, Arbeitsplatzverlust..."
        />

        <CheckboxWithText
          label="Mangel an Erreichbarkeit von Verstärkern"
          value={data.mangelErreichbarkeitVerstaerker}
          onChange={(v) => onUpdate({ ...data, mangelErreichbarkeitVerstaerker: v })}
          placeholder="z.B. fehlende soziale Kontakte, eingeschränkte Mobilität..."
        />

        <CheckboxWithText
          label="Mangel an positiven Erlebnissen"
          value={data.mangelPositiveErlebnisse}
          onChange={(v) => onUpdate({ ...data, mangelPositiveErlebnisse: v })}
          placeholder="z.B. keine Freizeitaktivitäten, kein Erleben von Freude..."
        />

        <CheckboxWithText
          label="Mangel an Fertigkeiten"
          value={data.mangelFertigkeiten}
          onChange={(v) => onUpdate({ ...data, mangelFertigkeiten: v })}
          placeholder="z.B. fehlende soziale Kompetenzen, mangelnde Problemlösefähigkeiten..."
        />

        <CheckboxWithText
          label="Reduzierte Aktivität"
          value={data.reduzierteAktivitaet}
          onChange={(v) => onUpdate({ ...data, reduzierteAktivitaet: v })}
          placeholder="z.B. Rückzug, Passivität, Antriebslosigkeit..."
        />

        <CheckboxWithText
          label="Mangel an sozialer Verstärkung"
          value={data.sozialeVerstaerkung}
          onChange={(v) => onUpdate({ ...data, sozialeVerstaerkung: v })}
          placeholder="z.B. fehlende positive Rückmeldungen, mangelnde Wertschätzung..."
        />

        <CheckboxWithText
          label="Soziale Isolation"
          value={data.sozialeIsolation}
          onChange={(v) => onUpdate({ ...data, sozialeIsolation: v })}
          placeholder="z.B. Einsamkeit, Rückzug aus sozialen Beziehungen..."
        />
      </div>
    </div>
  );
}
