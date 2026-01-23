'use client';

import * as FormTypes from '@/lib/core/form-types';

interface TeufelskreisAngstFormProps {
  data: FormTypes.TeufelskreisAngstModellData;
  onUpdate: (data: FormTypes.TeufelskreisAngstModellData) => void;
}

export function TeufelskreisAngstForm({ data, onUpdate }: TeufelskreisAngstFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">Teufelskreis der Angst</h3>
        <p className="text-sm text-blue-700">
          Das Modell beschreibt, wie Angst durch einen sich selbst verstärkenden Kreislauf aufrechterhalten wird:
          Auslöser → Wahrnehmung → Bewertung → Körperliche Reaktionen → Verstärkung der Angst.
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Auslösende Situation</label>
        <textarea
          value={data.ausloesendeSituation}
          onChange={(e) => onUpdate({ ...data, ausloesendeSituation: e.target.value })}
          rows={2}
          placeholder="z.B. Menschenmengen, Prüfungssituationen, bestimmte Orte..."
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <label className="block text-sm font-bold text-gray-900 mb-3">Teufelskreis-Komponenten</label>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Wahrnehmung körperlicher Symptome</label>
            <textarea
              value={data.wahrnehmungKoerperlich}
              onChange={(e) => onUpdate({ ...data, wahrnehmungKoerperlich: e.target.value })}
              rows={2}
              placeholder="z.B. Herzrasen, Schwitzen, Zittern, Atemnot..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Dysfunktionale Bewertung</label>
            <textarea
              value={data.dysfunktionaleBewertung}
              onChange={(e) => onUpdate({ ...data, dysfunktionaleBewertung: e.target.value })}
              rows={2}
              placeholder="z.B. 'Ich bekomme einen Herzinfarkt', 'Ich werde ohnmächtig'"
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Gefühl der Angst</label>
            <textarea
              value={data.gefuehlAngst}
              onChange={(e) => onUpdate({ ...data, gefuehlAngst: e.target.value })}
              rows={2}
              placeholder="Beschreibung des Angsterlebens..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Physiologische Aktivierung</label>
            <textarea
              value={data.physiologischeAktivierung}
              onChange={(e) => onUpdate({ ...data, physiologischeAktivierung: e.target.value })}
              rows={2}
              placeholder="z.B. Adrenalinausschüttung, erhöhte Herzfrequenz..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Verstärkung der körperlichen Reaktion</label>
            <textarea
              value={data.verstaerkungKoerperlich}
              onChange={(e) => onUpdate({ ...data, verstaerkungKoerperlich: e.target.value })}
              rows={2}
              placeholder="z.B. Angst vor der Angst führt zu verstärkten Symptomen..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Vermeidungsverhalten</label>
        <textarea
          value={data.vermeidungsverhalten}
          onChange={(e) => onUpdate({ ...data, vermeidungsverhalten: e.target.value })}
          rows={2}
          placeholder="z.B. Meiden bestimmter Orte, Situationen oder Aktivitäten..."
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}
