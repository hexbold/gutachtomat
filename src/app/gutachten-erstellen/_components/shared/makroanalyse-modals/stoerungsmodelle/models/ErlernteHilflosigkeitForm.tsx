'use client';

import * as FormTypes from '@/lib/core/form-types';

interface ErlernteHilflosigkeitFormProps {
  data: FormTypes.ErlernteHilflosigkeitModellData;
  onUpdate: (data: FormTypes.ErlernteHilflosigkeitModellData) => void;
}

export function ErlernteHilflosigkeitForm({ data, onUpdate }: ErlernteHilflosigkeitFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">Erlernte Hilflosigkeit (nach Seligman)</h3>
        <p className="text-sm text-blue-700">
          Depressionen entstehen durch die Erfahrung, dass eigenes Verhalten keinen Einfluss auf die
          Umwelt hat. Die Attribution von Misserfolgen auf interne, stabile und globale Ursachen verstärkt
          Hilflosigkeitsüberzeugungen.
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Negatives Erleben</label>
        <textarea
          value={data.negativesErleben}
          onChange={(e) => onUpdate({ ...data, negativesErleben: e.target.value })}
          rows={3}
          placeholder="Welche negativen Erfahrungen und Ereignisse führten zur depressiven Symptomatik?"
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Wahrnehmung von Unkontrollierbarkeit</label>
        <textarea
          value={data.wahrnehmungUnkontrollierbarkeit}
          onChange={(e) => onUpdate({ ...data, wahrnehmungUnkontrollierbarkeit: e.target.value })}
          rows={3}
          placeholder="Welche Erfahrungen führten zum Erleben von Unkontrollierbarkeit der Situation?"
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Depressiver Attributionsstil</label>
        <textarea
          value={data.depressiverAttributionsstil}
          onChange={(e) => onUpdate({ ...data, depressiverAttributionsstil: e.target.value })}
          rows={3}
          placeholder="Internal, stabil, global - z.B. 'Ich bin schuld (internal), das wird immer so sein (stabil), das betrifft alle Bereiche meines Lebens (global)'"
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <label className="block text-sm font-bold text-gray-900 mb-3">Auswirkungen der erlernten Hilflosigkeit</label>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Emotional</label>
            <input
              type="text"
              value={data.erlernteHilflosigkeitEmotional}
              onChange={(e) => onUpdate({ ...data, erlernteHilflosigkeitEmotional: e.target.value })}
              placeholder="z.B. Traurigkeit, Hoffnungslosigkeit, Angst"
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Motivational</label>
            <input
              type="text"
              value={data.erlernteHilflosigkeitMotivational}
              onChange={(e) => onUpdate({ ...data, erlernteHilflosigkeitMotivational: e.target.value })}
              placeholder="z.B. Passivität, Antriebslosigkeit, Aufgeben"
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Kognitiv</label>
            <input
              type="text"
              value={data.erlernteHilflosigkeitKognitiv}
              onChange={(e) => onUpdate({ ...data, erlernteHilflosigkeitKognitiv: e.target.value })}
              placeholder="z.B. 'Es hat keinen Sinn', 'Ich kann nichts ändern'"
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
