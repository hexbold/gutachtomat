'use client';

import * as FormTypes from '@/lib/core/form-types';
import { STOERUNGSMODELL_TYP_LABELS } from '@/lib/core/form-labels';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface StoerungsmodellPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  zuordnung: FormTypes.StoerungsmodellZuordnung;
  onSelect: (typ: FormTypes.StoerungsmodellTyp) => void;
}

// Group models by category for better UX
const MODEL_CATEGORIES = [
  {
    title: 'Depressive Störungen',
    models: [
      FormTypes.StoerungsmodellTyp.VerstaerkerVerlustDepression,
      FormTypes.StoerungsmodellTyp.ErlernteHilflosigkeit,
      FormTypes.StoerungsmodellTyp.KognitionstheoretischDepression,
    ]
  },
  {
    title: 'Angststörungen',
    models: [
      FormTypes.StoerungsmodellTyp.TeufelskreisAngst,
      FormTypes.StoerungsmodellTyp.KognitivSozialePhobie,
      FormTypes.StoerungsmodellTyp.DreiFaktorenGAS,
    ]
  },
  {
    title: 'Zwangsstörungen',
    models: [
      FormTypes.StoerungsmodellTyp.TeufelskreisZwangserkrankung,
      FormTypes.StoerungsmodellTyp.TeufelskreisZwangshandlungen,
      FormTypes.StoerungsmodellTyp.ZweiFaktorenZwang,
    ]
  },
  {
    title: 'Essstörungen',
    models: [
      FormTypes.StoerungsmodellTyp.TeufelskreisBulimie,
    ]
  },
  {
    title: 'Persönlichkeitsstörungen',
    models: [
      FormTypes.StoerungsmodellTyp.BiopsychosozialBorderline,
    ]
  },
  {
    title: 'Eigenes Modell',
    models: [
      FormTypes.StoerungsmodellTyp.FreitextModell,
    ]
  }
];

export function StoerungsmodellPickerModal({
  isOpen,
  onClose,
  zuordnung,
  onSelect
}: StoerungsmodellPickerModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelect = (typ: FormTypes.StoerungsmodellTyp) => {
    onSelect(typ);
    setSearchQuery('');
    onClose();
  };

  const filterBySearch = (label: string): boolean => {
    if (!searchQuery.trim()) return true;
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const getZuordnungLabel = () => {
    switch (zuordnung) {
      case FormTypes.StoerungsmodellZuordnung.Praedisponierend:
        return 'Prädisponierende Faktoren';
      case FormTypes.StoerungsmodellZuordnung.Ausloesend:
        return 'Auslösende Bedingungen';
      case FormTypes.StoerungsmodellZuordnung.Aufrechterhaltend:
        return 'Aufrechterhaltende Bedingungen';
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed top-36 bottom-4 left-4 right-[46%] z-40 flex items-start justify-center p-2">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-200 w-full max-w-5xl max-h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">Störungsspezifisches Modell hinzufügen</h2>
            <p className="text-sm text-blue-700 mt-1">Zuordnung: {getZuordnungLabel()}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Field */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Modelle durchsuchen..."
              className="w-full px-4 py-3 pl-10 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6">
          {MODEL_CATEGORIES.map((category) => {
            const visibleModels = category.models.filter(m => filterBySearch(STOERUNGSMODELL_TYP_LABELS[m]));
            if (visibleModels.length === 0) return null;

            return (
              <div key={category.title}>
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">{category.title}</h3>
                <div className="grid grid-cols-1 gap-2">
                  {visibleModels.map((typ) => (
                    <button
                      key={typ}
                      type="button"
                      onClick={() => handleSelect(typ)}
                      className="p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-700">
                          {STOERUNGSMODELL_TYP_LABELS[typ]}
                        </span>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
