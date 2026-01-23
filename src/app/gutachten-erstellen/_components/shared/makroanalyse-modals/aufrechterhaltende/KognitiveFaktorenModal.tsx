'use client';

import * as FormTypes from '@/lib/core/form-types';
import { DENKFEHLER_LABELS } from '@/lib/core/form-labels';
import { MakroanalyseHandlers } from '@/hooks/useGutachtenForm';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface KognitiveFaktorenModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FormTypes.KognitiveFaktorenData;
  onUpdate: MakroanalyseHandlers['updateKognitiveFaktoren'];
}

export function KognitiveFaktorenModal({
  isOpen,
  onClose,
  data,
  onUpdate
}: KognitiveFaktorenModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newGrundannahme, setNewGrundannahme] = useState('');
  const [newGedanke, setNewGedanke] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter by search
  const filterBySearch = (label: string): boolean => {
    if (!searchQuery.trim()) return true;
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Handle close
  const handleClose = () => {
    setSearchQuery('');
    setNewGrundannahme('');
    setNewGedanke('');
    onClose();
  };

  // Toggle Denkfehler selection
  const handleDenkfehlerToggle = (denkfehler: FormTypes.Denkfehler) => {
    const current = data.denkfehler;
    if (current[denkfehler]) {
      const { [denkfehler]: _, ...rest } = current;
      onUpdate({ denkfehler: rest });
    } else {
      onUpdate({
        denkfehler: { ...current, [denkfehler]: { selected: true, details: {} } }
      });
    }
  };

  // Add Grundannahme
  const handleAddGrundannahme = () => {
    if (newGrundannahme.trim()) {
      onUpdate({ grundannahmen: [...data.grundannahmen, newGrundannahme.trim()] });
      setNewGrundannahme('');
    }
  };

  // Remove Grundannahme
  const handleRemoveGrundannahme = (index: number) => {
    onUpdate({ grundannahmen: data.grundannahmen.filter((_, i) => i !== index) });
  };

  // Add automatischer Gedanke
  const handleAddGedanke = () => {
    if (newGedanke.trim()) {
      onUpdate({ automatischeGedanken: [...data.automatischeGedanken, newGedanke.trim()] });
      setNewGedanke('');
    }
  };

  // Remove automatischer Gedanke
  const handleRemoveGedanke = (index: number) => {
    onUpdate({ automatischeGedanken: data.automatischeGedanken.filter((_, i) => i !== index) });
  };

  // Count selected
  const selectedCount = Object.keys(data.denkfehler).length +
    data.grundannahmen.length +
    data.automatischeGedanken.length +
    (data.gruebeln ? 1 : 0) +
    (data.sichSorgenMachen ? 1 : 0);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed top-36 bottom-4 left-4 right-[46%] z-40 flex items-start justify-center p-2">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-200 w-full max-w-5xl max-h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-900">Kognitive Faktoren</h2>
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg cursor-pointer"
          >
            Bestätigen
          </button>
        </div>

        {/* Search Field */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Denkfehler durchsuchen..."
              className="w-full px-4 py-3 pl-10 pr-10 border-2 border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6">
          {/* Grundannahmen */}
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50/50">
            <label className="block text-base font-bold text-gray-900 mb-3">Dysfunktionale Grundannahmen</label>
            <div className="space-y-2 mb-3">
              {data.grundannahmen.map((ga, index) => (
                <div key={index} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
                  <span className="flex-1 text-sm text-gray-700">{ga}</span>
                  <button
                    onClick={() => handleRemoveGrundannahme(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newGrundannahme}
                onChange={(e) => setNewGrundannahme(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddGrundannahme()}
                placeholder="z.B. 'Ich bin wertlos'"
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleAddGrundannahme}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                Hinzufügen
              </button>
            </div>
          </div>

          {/* Denkfehler */}
          <div>
            <label className="block text-base font-bold text-gray-900 mb-3">Denkfehler</label>
            <div className="grid grid-cols-2 gap-2.5">
              {Object.values(FormTypes.Denkfehler)
                .filter(d => filterBySearch(DENKFEHLER_LABELS[d]))
                .map((denkfehler) => {
                  const isSelected = !!data.denkfehler[denkfehler];
                  return (
                    <button
                      key={denkfehler}
                      type="button"
                      onClick={() => handleDenkfehlerToggle(denkfehler)}
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
                      <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                        {DENKFEHLER_LABELS[denkfehler]}
                      </span>
                    </button>
                  );
                })}
            </div>
            <div className="mt-3">
              <input
                type="text"
                value={data.denkfehlerAndere}
                onChange={(e) => onUpdate({ denkfehlerAndere: e.target.value })}
                placeholder="Andere Denkfehler..."
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Automatische Gedanken */}
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50/50">
            <label className="block text-base font-bold text-gray-900 mb-3">Negative automatische Gedanken</label>
            <div className="space-y-2 mb-3">
              {data.automatischeGedanken.map((gedanke, index) => (
                <div key={index} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
                  <span className="flex-1 text-sm text-gray-700">{gedanke}</span>
                  <button
                    onClick={() => handleRemoveGedanke(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newGedanke}
                onChange={(e) => setNewGedanke(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddGedanke()}
                placeholder="z.B. 'Ich schaffe das nie'"
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleAddGedanke}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                Hinzufügen
              </button>
            </div>
          </div>

          {/* Grübeln und Sich Sorgen machen */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Grübeln</label>
              <textarea
                value={data.gruebeln}
                onChange={(e) => onUpdate({ gruebeln: e.target.value })}
                rows={2}
                placeholder="Beschreibung..."
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Sich Sorgen machen</label>
              <textarea
                value={data.sichSorgenMachen}
                onChange={(e) => onUpdate({ sichSorgenMachen: e.target.value })}
                rows={2}
                placeholder="Beschreibung..."
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Erwartungen */}
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50/50">
            <label className="block text-base font-bold text-gray-900 mb-3">Situations-Erwartungen</label>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kompetenz-Erwartungen</label>
                <input
                  type="text"
                  value={data.situationsKompetenzErwartungen}
                  onChange={(e) => onUpdate({ situationsKompetenzErwartungen: e.target.value })}
                  placeholder="z.B. 'Ich bin nicht fähig, das zu schaffen'"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reaktion-Erwartungen</label>
                <input
                  type="text"
                  value={data.situationsReaktionErwartungen}
                  onChange={(e) => onUpdate({ situationsReaktionErwartungen: e.target.value })}
                  placeholder="z.B. 'Andere werden mich ablehnen'"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ergebnis-Erwartungen</label>
                <input
                  type="text"
                  value={data.situationsErgebnisErwartungen}
                  onChange={(e) => onUpdate({ situationsErgebnisErwartungen: e.target.value })}
                  placeholder="z.B. 'Es wird sowieso nichts bringen'"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Attributionsstil */}
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50/50">
            <label className="block text-base font-bold text-gray-900 mb-3">Dysfunktionaler Attributionsstil</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal</label>
                <input
                  type="text"
                  value={data.attributionsstilInternal}
                  onChange={(e) => onUpdate({ attributionsstilInternal: e.target.value })}
                  placeholder="z.B. 'Alles ist meine Schuld'"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Global</label>
                <input
                  type="text"
                  value={data.attributionsstilGlobal}
                  onChange={(e) => onUpdate({ attributionsstilGlobal: e.target.value })}
                  placeholder="z.B. 'Das passiert mir immer'"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stabil</label>
                <input
                  type="text"
                  value={data.attributionsstilStabil}
                  onChange={(e) => onUpdate({ attributionsstilStabil: e.target.value })}
                  placeholder="z.B. 'Das wird sich nie ändern'"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Andere */}
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Andere kognitive Faktoren</label>
            <textarea
              value={data.andere}
              onChange={(e) => onUpdate({ andere: e.target.value })}
              rows={3}
              placeholder="Weitere kognitive Faktoren..."
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
