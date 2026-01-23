'use client';

import * as FormTypes from '@/lib/core/form-types';

interface TeufelskreisZwangHandlungenFormProps {
  data: FormTypes.TeufelskreisZwangshandlungenModellData;
  onUpdate: (data: FormTypes.TeufelskreisZwangshandlungenModellData) => void;
}

export function TeufelskreisZwangHandlungenForm({ data, onUpdate }: TeufelskreisZwangHandlungenFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">Teufelskreis der Zwangshandlungen</h3>
        <p className="text-sm text-blue-700">
          Das Modell beschreibt, wie Zwangshandlungen durch externe/interne Auslöser,
          dysfunktionale Grundannahmen und Befürchtungen aufrechterhalten werden.
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Externe/Interne Auslöser</label>
        <textarea
          value={data.externeInterneAusloeser}
          onChange={(e) => onUpdate({ ...data, externeInterneAusloeser: e.target.value })}
          rows={2}
          placeholder="z.B. Bestimmte Gegenstände, Situationen, Gedanken..."
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Dysfunktionale Grundannahmen</label>
        <textarea
          value={data.dysfunktionaleGrundannahmen}
          onChange={(e) => onUpdate({ ...data, dysfunktionaleGrundannahmen: e.target.value })}
          rows={2}
          placeholder="z.B. 'Gedanken können Schaden verursachen', 'Ich bin verantwortlich für alles'..."
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Zwangsbefürchtung</label>
        <textarea
          value={data.zwangsbefuerchtung}
          onChange={(e) => onUpdate({ ...data, zwangsbefuerchtung: e.target.value })}
          rows={2}
          placeholder="z.B. 'Wenn ich nicht kontrolliere, passiert etwas Schlimmes'..."
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Zwangshandlung</label>
        <textarea
          value={data.zwangshandlung}
          onChange={(e) => onUpdate({ ...data, zwangshandlung: e.target.value })}
          rows={2}
          placeholder="z.B. Wiederholtes Kontrollieren, Waschen, Ordnen..."
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Aufrechterhaltung der Zwangshandlung</label>
        <textarea
          value={data.zwangshandlungAufrechterhaltung}
          onChange={(e) => onUpdate({ ...data, zwangshandlungAufrechterhaltung: e.target.value })}
          rows={2}
          placeholder="z.B. Kurzfristige Angstreduktion, Verstärkung durch Erleichterung..."
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}
