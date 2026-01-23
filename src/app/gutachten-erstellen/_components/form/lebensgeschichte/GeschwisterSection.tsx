'use client';

import * as FormTypes from '@/lib/core/form-types';
import { GeschwisterHandlers } from '@/hooks/useGutachtenForm';
import { GESCHLECHT_LABELS } from '@/lib/core/form-labels';

interface GeschwisterSectionProps {
  data: FormTypes.Geschwister;
  handlers: GeschwisterHandlers;
}

export function GeschwisterSection({ data, handlers }: GeschwisterSectionProps) {
  const keineGeschwister = data.keineGeschwister;
  const liste = keineGeschwister ? [] : data.liste;

  return (
    <div className="border-2 border-border-primary rounded-lg bg-surface-secondary/30">
      {/* Header with toggle */}
      <div className="flex items-center justify-between p-3 border-b border-border-primary">
        <h4 className="text-base font-semibold text-text-primary">Geschwister</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-tertiary">Keine Geschwister</span>
          <button
            type="button"
            onClick={() => handlers.setKeineGeschwister(!keineGeschwister)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              keineGeschwister ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                keineGeschwister ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Content (only shown when has Geschwister) */}
      {!keineGeschwister && (
        <div className="p-3 space-y-3">
          {/* List of Geschwister */}
          {liste.map((geschwister, index) => (
            <div key={geschwister.id} className="border-2 border-border-primary rounded-lg p-3 bg-surface-primary">
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-sm font-semibold text-text-primary">Geschwister {index + 1}</span>
                <button
                  type="button"
                  onClick={() => handlers.remove(geschwister.id)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="Entfernen"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Geburtsjahr</label>
                  <input
                    type="text"
                    value={geschwister.geburtsjahr}
                    onChange={(e) => handlers.update(geschwister.id, { geburtsjahr: e.target.value })}
                    placeholder="z.B. 1988"
                    className="w-full px-2 py-1.5 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Geschlecht</label>
                  <select
                    value={geschwister.geschlecht || ''}
                    onChange={(e) => handlers.update(geschwister.id, { geschlecht: (e.target.value || null) as FormTypes.GeschlechtField })}
                    className="w-full px-2 py-1.5 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary text-sm"
                  >
                    <option value="">Auswählen...</option>
                    {Object.values(FormTypes.Geschlecht).map((g) => (
                      <option key={g} value={g}>{GESCHLECHT_LABELS[g]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Beziehung</label>
                  <input
                    type="text"
                    value={geschwister.beziehung}
                    onChange={(e) => handlers.update(geschwister.id, { beziehung: e.target.value })}
                    placeholder="z.B. eng, distanziert"
                    className="w-full px-2 py-1.5 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary text-sm"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add button */}
          <button
            type="button"
            onClick={handlers.add}
            className="w-full py-2 px-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Geschwister hinzufügen
          </button>
        </div>
      )}
    </div>
  );
}
