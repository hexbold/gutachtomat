'use client';

import * as FormTypes from '@/lib/core/form-types';
import { highlightSearchText } from '@/lib/utils/highlight-utils';
import { BefundHandlers } from '@/hooks/useGutachtenForm';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  aengsteArtenOptions,
  aengsteSymptomeKompensationOptions,
} from '@/lib/core/options/befund-sections';

interface AengsteModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  befundHandlers: BefundHandlers;
}

function SymptomCard({
  label,
  highlightedLabel,
  isSelected,
  onClick,
}: {
  label: string;
  highlightedLabel?: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full text-left p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
      }`}
    >
      <span className="text-sm text-foreground">{highlightedLabel || label}</span>
      {isSelected && (
        <span className="absolute top-2 right-2 text-blue-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
      )}
    </button>
  );
}

export function AengsteModal({
  isOpen,
  onClose,
  formData,
  befundHandlers,
}: AengsteModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = formData.aengste;

  const allSelected = [
    ...data.artenVonAngsten,
    ...data.symptomeKompensation,
  ];

  const filterBySearch = (label: string): boolean => {
    if (!searchQuery.trim()) return true;
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const highlight = (text: string) => highlightSearchText(text, searchQuery);

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  const handleClearAll = () => {
    befundHandlers.clearAengste();
    handleClose();
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed top-36 bottom-4 left-4 right-[46%] z-40 flex items-start justify-center p-2">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border-2 border-blue-200 dark:border-blue-800 w-full max-w-5xl max-h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-b-2 border-blue-200 dark:border-blue-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Ängste</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearAll}
              className="relative group p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              aria-label="Auswahl löschen"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Auswahl löschen
              </span>
            </button>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg cursor-pointer"
            >
              Bestätigen
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ängste durchsuchen..."
              className="w-full px-4 py-3 pl-10 pr-10 border-2 border-blue-200 dark:border-blue-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
          {/* Arten von Ängsten */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Arten von Ängsten</h3>
            <div className="grid grid-cols-2 gap-2">
              {aengsteArtenOptions.filter(filterBySearch).map((option) => (
                <SymptomCard
                  key={option}
                  label={option}
                  highlightedLabel={highlight(option)}
                  isSelected={data.artenVonAngsten.includes(option)}
                  onClick={() => befundHandlers.toggle('aengste', 'artenVonAngsten', option)}
                />
              ))}
            </div>
          </div>

          {/* Symptome und Kompensation */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Symptome und Kompensation</h3>
            <div className="grid grid-cols-2 gap-2">
              {aengsteSymptomeKompensationOptions.filter(filterBySearch).map((option) => (
                <SymptomCard
                  key={option}
                  label={option}
                  highlightedLabel={highlight(option)}
                  isSelected={data.symptomeKompensation.includes(option)}
                  onClick={() => befundHandlers.toggle('aengste', 'symptomeKompensation', option)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        {allSelected.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              <strong>Ausgewählt ({allSelected.length}):</strong> {allSelected.join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
