'use client';

import * as FormTypes from '@/lib/core/form-types';
import { STOERUNGSMODELL_TYP_LABELS } from '@/lib/core/form-labels';

interface StoerungsmodellCardProps {
  entry: FormTypes.StoerungsmodellEntry;
  onEdit: () => void;
  onRemove: () => void;
}

export function StoerungsmodellCard({
  entry,
  onEdit,
  onRemove
}: StoerungsmodellCardProps) {
  const getTypLabel = () => {
    return STOERUNGSMODELL_TYP_LABELS[entry.modell.typ];
  };

  // Get a brief summary of the model content
  const getSummary = (): string => {
    const data = entry.modell;
    switch (data.typ) {
      case FormTypes.StoerungsmodellTyp.FreitextModell:
        return data.data.inhalt || 'Eigenes Modell';
      case FormTypes.StoerungsmodellTyp.VerstaerkerVerlustDepression:
        // Check if any factor is selected
        return Object.values(data.data).some(v => v.selected) ? 'Verstärkerverlust konfiguriert' : 'Noch nicht konfiguriert';
      case FormTypes.StoerungsmodellTyp.ErlernteHilflosigkeit:
        return data.data.wahrnehmungUnkontrollierbarkeit ? 'Hilflosigkeit konfiguriert' : 'Noch nicht konfiguriert';
      case FormTypes.StoerungsmodellTyp.KognitionstheoretischDepression:
        return data.data.automatischeNegativeGedanken ? 'Kognitive Triade konfiguriert' : 'Noch nicht konfiguriert';
      case FormTypes.StoerungsmodellTyp.TeufelskreisAngst:
        return data.data.ausloesendeSituation ? 'Angstkreislauf konfiguriert' : 'Noch nicht konfiguriert';
      default:
        return 'Modell konfiguriert';
    }
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-gray-900 truncate">{getTypLabel()}</h4>
          <p className="text-xs text-gray-500 mt-1 truncate">{getSummary()}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Bearbeiten"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Entfernen"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
