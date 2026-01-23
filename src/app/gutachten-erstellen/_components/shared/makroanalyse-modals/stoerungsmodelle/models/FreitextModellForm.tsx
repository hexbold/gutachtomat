'use client';

import * as FormTypes from '@/lib/core/form-types';

interface FreitextModellFormProps {
  data: FormTypes.FreitextModellData;
  onUpdate: (data: FormTypes.FreitextModellData) => void;
}

export function FreitextModellForm({ data, onUpdate }: FreitextModellFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">Beschreibung / Inhalt</label>
        <textarea
          value={data.inhalt}
          onChange={(e) => onUpdate({ ...data, inhalt: e.target.value })}
          rows={10}
          placeholder="Beschreiben Sie hier das störungsspezifische Modell..."
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
        <p className="font-medium mb-2">Hinweis:</p>
        <p>Verwenden Sie dieses Freitextfeld, um ein individuelles störungsspezifisches Modell zu beschreiben, das nicht in der vordefinierten Liste enthalten ist.</p>
      </div>
    </div>
  );
}
