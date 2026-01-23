'use client';

import * as FormTypes from '@/lib/core/form-types';

interface KognitivSozialePhobieFormProps {
  data: FormTypes.KognitivSozialePhobieModellData;
  onUpdate: (data: FormTypes.KognitivSozialePhobieModellData) => void;
}

export function KognitivSozialePhobieForm({ data, onUpdate }: KognitivSozialePhobieFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">Kognitives Modell der Sozialen Phobie</h3>
        <p className="text-sm text-blue-700">
          Nach Clark & Wells: Das Modell beschreibt, wie negatives Selbstbild, erhöhte Selbstaufmerksamkeit
          und Sicherheitsverhalten die soziale Angst aufrechterhalten.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Negatives Selbst als soziales Objekt</label>
          <textarea
            value={data.negativesSelbst}
            onChange={(e) => onUpdate({ ...data, negativesSelbst: e.target.value })}
            rows={3}
            placeholder="z.B. 'Ich wirke inkompetent', 'Andere sehen, dass ich rot werde', 'Ich bin langweilig'..."
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Erhöhte Selbstaufmerksamkeit</label>
          <textarea
            value={data.erhoehtesSelbstaufmerksamkeit}
            onChange={(e) => onUpdate({ ...data, erhoehtesSelbstaufmerksamkeit: e.target.value })}
            rows={3}
            placeholder="z.B. Fokus auf eigene Körperempfindungen, mentale Selbstbeobachtung, 'Beobachter-Perspektive'..."
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Fehlattribution körperlicher Symptome</label>
        <textarea
          value={data.fehlattribution}
          onChange={(e) => onUpdate({ ...data, fehlattribution: e.target.value })}
          rows={2}
          placeholder="z.B. 'Mein Zittern sieht jeder', 'Mein Schwitzen ist für alle sichtbar'..."
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <label className="block text-sm font-bold text-gray-900 mb-3">Aufrechterhaltende Verhaltensweisen</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sicherheitsverhalten</label>
            <textarea
              value={data.sicherheitsverhalten}
              onChange={(e) => onUpdate({ ...data, sicherheitsverhalten: e.target.value })}
              rows={2}
              placeholder="z.B. Blickkontakt vermeiden, leise sprechen, Hände verstecken..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Übermäßige Vorbereitung</label>
            <textarea
              value={data.uebermaessigeVorbereitung}
              onChange={(e) => onUpdate({ ...data, uebermaessigeVorbereitung: e.target.value })}
              rows={2}
              placeholder="z.B. Sätze auswendig lernen, Gesprächsthemen vorbereiten..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <label className="block text-sm font-bold text-gray-900 mb-3">Antizipatorische Prozesse</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Antizipatorische Verhinderung</label>
            <textarea
              value={data.antizipatorischeVerhinderung}
              onChange={(e) => onUpdate({ ...data, antizipatorischeVerhinderung: e.target.value })}
              rows={2}
              placeholder="z.B. Absagen von Terminen, Vermeidung sozialer Situationen im Voraus..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Antizipatorische Vorbeugung</label>
            <textarea
              value={data.antizipatorischeVorbeugung}
              onChange={(e) => onUpdate({ ...data, antizipatorischeVorbeugung: e.target.value })}
              rows={2}
              placeholder="z.B. Grübeln über mögliche Peinlichkeiten, mentales Durchspielen..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Versuche, die Wirkung auf andere zu kontrollieren</label>
        <textarea
          value={data.versucheWirkungKontrollieren}
          onChange={(e) => onUpdate({ ...data, versucheWirkungKontrollieren: e.target.value })}
          rows={2}
          placeholder="z.B. Perfektionistisches Verhalten, Anpassung an vermutete Erwartungen..."
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}
