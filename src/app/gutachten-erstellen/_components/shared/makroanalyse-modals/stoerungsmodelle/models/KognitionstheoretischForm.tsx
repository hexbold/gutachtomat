'use client';

import * as FormTypes from '@/lib/core/form-types';

interface KognitionstheoretischFormProps {
  data: FormTypes.KognitionstheoretischModellData;
  onUpdate: (data: FormTypes.KognitionstheoretischModellData) => void;
}

export function KognitionstheoretischForm({ data, onUpdate }: KognitionstheoretischFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">Kognitionstheoretisches Modell der Depression (nach Beck)</h3>
        <p className="text-sm text-blue-700">
          Die kognitive Triade beschreibt negative Sichtweisen auf sich selbst, die Welt und die Zukunft.
          Dysfunktionale Grundannahmen und automatische negative Gedanken halten die Depression aufrecht.
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Externe/Interne Auslöser</label>
        <textarea
          value={data.externeInterneAusloeser}
          onChange={(e) => onUpdate({ ...data, externeInterneAusloeser: e.target.value })}
          rows={3}
          placeholder="Welche externen (Lebensereignisse, Situationen) oder internen (Gedanken, Erinnerungen) Auslöser aktivieren die depressive Symptomatik?"
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Automatische negative Gedanken</label>
        <textarea
          value={data.automatischeNegativeGedanken}
          onChange={(e) => onUpdate({ ...data, automatischeNegativeGedanken: e.target.value })}
          rows={3}
          placeholder="z.B. 'Ich bin wertlos', 'Ich kann das nicht', 'Die anderen denken schlecht über mich'"
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Dysfunktionale Grundannahmen</label>
        <textarea
          value={data.dysfunktionaleGrundannahmen}
          onChange={(e) => onUpdate({ ...data, dysfunktionaleGrundannahmen: e.target.value })}
          rows={3}
          placeholder="z.B. 'Wenn ich nicht perfekt bin, bin ich ein totaler Versager', 'Ich muss immer stark sein'"
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Depressive Symptomatik</label>
        <textarea
          value={data.depressiveSymptomatik}
          onChange={(e) => onUpdate({ ...data, depressiveSymptomatik: e.target.value })}
          rows={3}
          placeholder="Beschreibung der resultierenden depressiven Symptome (emotional, kognitiv, motivational, physiologisch)"
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}
