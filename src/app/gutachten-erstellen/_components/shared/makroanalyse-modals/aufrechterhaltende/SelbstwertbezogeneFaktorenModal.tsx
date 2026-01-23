'use client';

import * as FormTypes from '@/lib/core/form-types';
import { SELBSTWERTBEZOGENE_FAKTOREN_LABELS } from '@/lib/core/form-labels';
import { MakroanalyseHandlers } from '@/hooks/useGutachtenForm';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface SelbstwertbezogeneFaktorenModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FormTypes.SelbstwertbezogeneFaktorenData;
  onUpdate: MakroanalyseHandlers['updateSelbstwertbezogeneFaktoren'];
}

export function SelbstwertbezogeneFaktorenModal({
  isOpen,
  onClose,
  data,
  onUpdate
}: SelbstwertbezogeneFaktorenModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = (item: FormTypes.SelbstwertbezogeneFaktoren) => {
    const current = data.faktoren;
    if (current[item]) {
      const { [item]: _, ...rest } = current;
      onUpdate({ faktoren: rest });
    } else {
      onUpdate({
        faktoren: { ...current, [item]: { selected: true, details: {} } }
      });
    }
  };

  const selectedCount = Object.keys(data.faktoren).length;

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed top-36 bottom-4 left-4 right-[46%] z-40 flex items-start justify-center p-2">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-200 w-full max-w-5xl max-h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-900">Selbstwertbezogene Faktoren</h2>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg cursor-pointer"
          >
            Bestätigen
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6">
          <div>
            <label className="block text-base font-bold text-gray-900 mb-3">Selbstwertbezogene Faktoren</label>
            <div className="grid grid-cols-2 gap-2.5">
              {Object.values(FormTypes.SelbstwertbezogeneFaktoren).map((item) => {
                const isSelected = !!data.faktoren[item];
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleToggle(item)}
                    className={`
                      relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center
                      ${isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer
                    `}
                  >
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    )}
                    <span className={`text-sm font-semibold leading-snug pr-6 ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                      {SELBSTWERTBEZOGENE_FAKTOREN_LABELS[item]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Andere */}
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Andere selbstwertbezogene Faktoren</label>
            <textarea
              value={data.andere}
              onChange={(e) => onUpdate({ andere: e.target.value })}
              rows={3}
              placeholder="Weitere selbstwertbezogene Faktoren..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        {selectedCount > 0 && (
          <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-blue-200">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-700">{selectedCount} Angabe(n) erfasst</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
