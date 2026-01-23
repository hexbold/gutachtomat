'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  testVerfahrenCategories,
  testVerfahrenByCategory,
  type TestVerfahren,
  type TestCategory,
} from '@/lib/data/test-verfahren';

interface TestVerfahrenListViewProps {
  onSelectTest: (test: TestVerfahren) => void;
  onClose: () => void;
}

export function TestVerfahrenListView({
  onSelectTest,
  onClose,
}: TestVerfahrenListViewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<TestCategory>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSection = (section: TestCategory) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  if (!mounted) return null;

  const modalContent = (
    <div className="fixed top-36 bottom-4 left-4 right-[46%] z-40 flex items-start justify-center p-2">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-200 w-full max-w-5xl max-h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-900">
            Alle Testdiagnostischen Verfahren
          </h2>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg cursor-pointer"
          >
            Fertig
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {testVerfahrenCategories.map((category) => {
              const tests = testVerfahrenByCategory[category];
              const isExpanded = expandedSections.has(category);

              return (
                <div key={category} className="border-2 border-blue-200 rounded-lg">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(category)}
                    className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 flex items-center justify-between font-semibold text-left transition-colors"
                  >
                    <span className="text-blue-900">{category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-normal">
                        {tests.length} Test{tests.length !== 1 ? 's' : ''}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-600 transition-transform ${
                          isExpanded ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </button>

                  {/* Section Content */}
                  {isExpanded && (
                    <div className="divide-y divide-gray-100">
                      {tests.map((test) => (
                        <button
                          key={test.abbreviation}
                          onClick={() => {
                            onSelectTest(test);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-blue-600">
                              {test.abbreviation}
                            </span>
                            <span className="text-sm text-gray-600">
                              ({test.name})
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
