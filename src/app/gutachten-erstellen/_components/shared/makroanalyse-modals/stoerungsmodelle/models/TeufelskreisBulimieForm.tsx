'use client';

import * as FormTypes from '@/lib/core/form-types';

interface TeufelskreisBulimieFormProps {
  data: FormTypes.TeufelskreisBulimieModellData;
  onUpdate: (data: FormTypes.TeufelskreisBulimieModellData) => void;
}

export function TeufelskreisBulimieForm({ data, onUpdate }: TeufelskreisBulimieFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">Teufelskreis der Bulimie</h3>
        <p className="text-sm text-blue-700">
          Das Modell beschreibt den Kreislauf von Fixierung auf Körpergewicht,
          Nahrungsrestriktion, Heißhunger, Essanfall und kompensatorischem Verhalten.
        </p>
      </div>

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <label className="block text-sm font-bold text-gray-900 mb-3">Teufelskreis-Komponenten</label>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">1. Fixierung auf Körpergewicht/Figur</label>
            <textarea
              value={data.fixierungKoerpergewicht}
              onChange={(e) => onUpdate({ ...data, fixierungKoerpergewicht: e.target.value })}
              rows={2}
              placeholder="z.B. Ständiges Wiegen, Körperschema-Störung, übermäßige Beschäftigung mit Aussehen..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 text-center text-gray-400">↓</div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">2. Nahrungsrestriktion</label>
            <textarea
              value={data.nahrungsrestriktion}
              onChange={(e) => onUpdate({ ...data, nahrungsrestriktion: e.target.value })}
              rows={2}
              placeholder="z.B. Strenge Diäten, Verbotene Lebensmittel, Kalorienzählen..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 text-center text-gray-400">↓</div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">3. Unterzuckerung/Hunger</label>
            <textarea
              value={data.unterzuckerung}
              onChange={(e) => onUpdate({ ...data, unterzuckerung: e.target.value })}
              rows={2}
              placeholder="z.B. Physiologischer Hungerzustand, niedriger Blutzucker..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 text-center text-gray-400">↓</div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">4. Heißhungeranfall</label>
            <textarea
              value={data.heisshungeranfall}
              onChange={(e) => onUpdate({ ...data, heisshungeranfall: e.target.value })}
              rows={2}
              placeholder="z.B. Kontrollverlust, große Nahrungsmengen, schnelles Essen..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 text-center text-gray-400">↓</div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">5. Ekel, Scham, Angst vor Gewichtszunahme</label>
            <textarea
              value={data.ekelSchamAngst}
              onChange={(e) => onUpdate({ ...data, ekelSchamAngst: e.target.value })}
              rows={2}
              placeholder="z.B. Intensive Schuldgefühle, Panik vor Gewichtszunahme, Selbstverachtung..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 text-center text-gray-400">↓</div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">6. Erbrechen/Kompensatorisches Verhalten</label>
            <textarea
              value={data.erbrechen}
              onChange={(e) => onUpdate({ ...data, erbrechen: e.target.value })}
              rows={2}
              placeholder="z.B. Selbstinduziertes Erbrechen, Abführmittel, exzessiver Sport..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 text-center text-gray-400">↻</div>
            <span className="text-xs text-gray-500 italic">Kreislauf beginnt erneut</span>
          </div>
        </div>
      </div>
    </div>
  );
}
