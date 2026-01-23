'use client';

import React from 'react';
import * as FormTypes from '@/lib/core/form-types';

interface SelectedTestCardProps {
  test: FormTypes.SelectedTestVerfahren;
  index: number;
  onRemove: () => void;
  onUpdate: (field: keyof FormTypes.SelectedTestVerfahren, value: string | number | null) => void;
}

export function SelectedTestCard({
  test,
  index,
  onRemove,
  onUpdate,
}: SelectedTestCardProps) {
  return (
    <div className="bg-white border border-gray-300 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        {/* Test Info */}
        <div className="flex-1 space-y-3">
          {/* Test Name */}
          <div className="flex items-start gap-2">
            <span className="font-semibold text-blue-600">
              {test.abbreviation}
            </span>
            <span className="text-gray-600 text-sm">({test.name})</span>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Input */}
            <div>
              <label
                htmlFor={`date-${index}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Durchführungsdatum
              </label>
              <input
                type="date"
                id={`date-${index}`}
                value={test.durchfuehrungsdatum || ''}
                onChange={(e) => onUpdate('durchfuehrungsdatum', e.target.value || null)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Score Input */}
            <div>
              <label
                htmlFor={`score-${index}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Score
              </label>
              <input
                type="number"
                id={`score-${index}`}
                value={test.score ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  onUpdate('score', value === '' ? null : Number(value));
                }}
                placeholder="z.B. 24"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <label
              htmlFor={`notizen-${index}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notizen
            </label>
            <textarea
              id={`notizen-${index}`}
              value={test.notizen || ''}
              onChange={(e) => onUpdate('notizen', e.target.value || null)}
              placeholder="Optionale Anmerkungen zum Testergebnis..."
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full p-2 transition-colors flex-shrink-0"
          aria-label="Test entfernen"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
