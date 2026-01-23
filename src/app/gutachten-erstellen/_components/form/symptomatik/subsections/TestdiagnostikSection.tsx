'use client';

import { useState } from 'react';
import * as FormTypes from '@/lib/core/form-types';
import { TestdiagnostikHandlers } from '@/hooks/useGutachtenForm';
import { SelectedTestCard, TestVerfahrenListView } from '../../../shared/testdiagnostik';
import { searchTestVerfahren, type TestVerfahren } from '@/lib/data/test-verfahren';

interface TestdiagnostikSectionProps {
  formData: FormTypes.Form;
  testdiagnostikHandlers: TestdiagnostikHandlers;
}

export function TestdiagnostikSection({
  formData,
  testdiagnostikHandlers,
}: TestdiagnostikSectionProps) {
  const [isTestListViewOpen, setIsTestListViewOpen] = useState(false);
  const [testSearchQuery, setTestSearchQuery] = useState('');
  const testSearchResults = searchTestVerfahren(testSearchQuery);

  const handleSelectTest = (test: TestVerfahren) => {
    testdiagnostikHandlers.addTest(test.abbreviation, test.name);
    setTestSearchQuery('');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-text-primary">Testdiagnostische Verfahren</h3>

      {/* Search and Add Section */}
      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Test hinzufügen
          </label>
          <input
            type="text"
            value={testSearchQuery}
            onChange={(e) => setTestSearchQuery(e.target.value)}
            placeholder="Test suchen (z.B. BDI-II, GAD-7, PCL-5...)"
            className="w-full p-3 border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-surface-primary"
          />

          {/* Search Results Dropdown */}
          {testSearchQuery.length >= 2 && testSearchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {testSearchResults.map((test) => (
                <button
                  key={test.abbreviation}
                  type="button"
                  onClick={() => handleSelectTest(test)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
                >
                  <span className="font-semibold text-blue-600">{test.abbreviation}</span>
                  <span className="text-gray-600 text-sm ml-2">({test.name})</span>
                  <span className="text-gray-400 text-xs ml-2">– {test.category}</span>
                </button>
              ))}
            </div>
          )}

          {testSearchQuery.length >= 2 && testSearchResults.length === 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
              Keine Tests gefunden
            </div>
          )}
        </div>

        {/* Show All Button */}
        <button
          type="button"
          onClick={() => setIsTestListViewOpen(true)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
        >
          Alle anzeigen →
        </button>
      </div>

      {/* Selected Tests */}
      {formData.testdiagnostik.selectedTests.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-text-secondary">
            Ausgewählte Tests ({formData.testdiagnostik.selectedTests.length})
          </h4>
          <div className="space-y-3">
            {formData.testdiagnostik.selectedTests.map((test, index) => (
              <SelectedTestCard
                key={`${test.abbreviation}-${index}`}
                test={test}
                index={index}
                onRemove={() => testdiagnostikHandlers.removeTest(index)}
                onUpdate={(field, value) => testdiagnostikHandlers.updateTest(index, field, value)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {formData.testdiagnostik.selectedTests.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Noch keine Tests hinzugefügt.</p>
          <p className="text-sm mt-1">Suchen Sie nach einem Test oder klicken Sie auf &quot;Alle anzeigen&quot;.</p>
        </div>
      )}

      {/* TestVerfahren List View Modal */}
      {isTestListViewOpen && (
        <TestVerfahrenListView
          onSelectTest={handleSelectTest}
          onClose={() => setIsTestListViewOpen(false)}
        />
      )}
    </div>
  );
}
