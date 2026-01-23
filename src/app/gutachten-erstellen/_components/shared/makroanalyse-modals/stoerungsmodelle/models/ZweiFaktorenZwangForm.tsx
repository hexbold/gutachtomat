'use client';

import * as FormTypes from '@/lib/core/form-types';

interface ZweiFaktorenZwangFormProps {
  data: FormTypes.ZweiFaktorenZwangModellData;
  onUpdate: (data: FormTypes.ZweiFaktorenZwangModellData) => void;
}

export function ZweiFaktorenZwangForm({ data, onUpdate }: ZweiFaktorenZwangFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">Zwei-Faktoren-Modell der Zwangserkrankung</h3>
        <p className="text-sm text-blue-700">
          Nach Mowrer: Die Zwangsstörung entsteht durch klassische Konditionierung (Faktor 1)
          und wird durch operante Konditionierung aufrechterhalten (Faktor 2).
        </p>
      </div>

      <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50/50">
        <label className="block text-sm font-bold text-blue-900 mb-2">
          Faktor 1: Klassische Konditionierung (Entstehung)
        </label>
        <textarea
          value={data.klassischeKonditionierung}
          onChange={(e) => onUpdate({ ...data, klassischeKonditionierung: e.target.value })}
          rows={4}
          placeholder="z.B. Ein neutraler Reiz (z.B. Türklinke) wird durch Assoziation mit einem aversiven Ereignis zu einem konditionierten Stimulus, der Angst auslöst..."
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50/50">
        <label className="block text-sm font-bold text-green-900 mb-2">
          Faktor 2: Operante Konditionierung (Aufrechterhaltung)
        </label>
        <textarea
          value={data.operanteKonditionierung}
          onChange={(e) => onUpdate({ ...data, operanteKonditionierung: e.target.value })}
          rows={4}
          placeholder="z.B. Die Zwangshandlung (Händewaschen) reduziert kurzfristig die Angst (negative Verstärkung), was das Verhalten aufrechterh&auml;lt und die Zwangsschleife verstärkt..."
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-700 mb-2">Therapeutische Implikation</h4>
        <p className="text-sm text-gray-600">
          <strong>Exposition mit Reaktionsverhinderung:</strong> Der Patient wird dem angstauslösenden
          Reiz ausgesetzt, ohne die Zwangshandlung auszuführen. Dadurch kann die konditionierte
          Angstreaktion gelöscht werden.
        </p>
      </div>
    </div>
  );
}
