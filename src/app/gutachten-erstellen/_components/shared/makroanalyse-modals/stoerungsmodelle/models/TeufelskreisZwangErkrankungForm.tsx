'use client';

import * as FormTypes from '@/lib/core/form-types';

interface TeufelskreisZwangErkrankungFormProps {
  data: FormTypes.TeufelskreisZwangserkrankungModellData;
  onUpdate: (data: FormTypes.TeufelskreisZwangserkrankungModellData) => void;
}

export function TeufelskreisZwangErkrankungForm({ data, onUpdate }: TeufelskreisZwangErkrankungFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">Teufelskreis der Zwangserkrankung</h3>
        <p className="text-sm text-blue-700">
          Das Modell beschreibt den Kreislauf von aufdringlichen Gedanken, deren Fehlbewertung,
          emotionaler Reaktion und verschiedenen Bewältigungsstrategien, die den Zwang aufrechterhalten.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Aufdringlicher Gedanke</label>
          <textarea
            value={data.aufdringlicherGedanke}
            onChange={(e) => onUpdate({ ...data, aufdringlicherGedanke: e.target.value })}
            rows={2}
            placeholder="z.B. 'Ich könnte jemanden verletzen', 'Alles ist kontaminiert'..."
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Fehlbewertung</label>
          <textarea
            value={data.fehlbewertung}
            onChange={(e) => onUpdate({ ...data, fehlbewertung: e.target.value })}
            rows={2}
            placeholder="z.B. 'Der Gedanke bedeutet, dass ich gefährlich bin'..."
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Emotionale Reaktion</label>
        <textarea
          value={data.emotionaleReaktion}
          onChange={(e) => onUpdate({ ...data, emotionaleReaktion: e.target.value })}
          rows={2}
          placeholder="z.B. Angst, Ekel, Schuld, Scham..."
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <label className="block text-sm font-bold text-gray-900 mb-3">Bewältigungsstrategien</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Offene Zwangshandlung</label>
            <textarea
              value={data.offeneZwangshandlung}
              onChange={(e) => onUpdate({ ...data, offeneZwangshandlung: e.target.value })}
              rows={2}
              placeholder="z.B. Händewaschen, Kontrollieren..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Verdeckte Zwangshandlung</label>
            <textarea
              value={data.verdeckteZwangshandlung}
              onChange={(e) => onUpdate({ ...data, verdeckteZwangshandlung: e.target.value })}
              rows={2}
              placeholder="z.B. Mentales Zählen, Beten..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Gedankenunterdrückung</label>
            <textarea
              value={data.gedankenunterdrueckung}
              onChange={(e) => onUpdate({ ...data, gedankenunterdrueckung: e.target.value })}
              rows={2}
              placeholder="z.B. Versuche, den Gedanken nicht zu denken..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Vermeidung</label>
            <textarea
              value={data.vermeidung}
              onChange={(e) => onUpdate({ ...data, vermeidung: e.target.value })}
              rows={2}
              placeholder="z.B. Meiden bestimmter Orte oder Situationen..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Rückversicherung</label>
            <textarea
              value={data.rueckversicherung}
              onChange={(e) => onUpdate({ ...data, rueckversicherung: e.target.value })}
              rows={2}
              placeholder="z.B. Nachfragen bei anderen, ob alles in Ordnung ist..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Neutralisierende Zwangshandlungen</label>
            <textarea
              value={data.neutralisierendeZwangshandlungen}
              onChange={(e) => onUpdate({ ...data, neutralisierendeZwangshandlungen: e.target.value })}
              rows={2}
              placeholder="z.B. Gute Gedanken denken, um schlechte zu neutralisieren..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
