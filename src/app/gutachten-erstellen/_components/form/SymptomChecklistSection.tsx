'use client';

import { useState } from 'react';

interface SymptomChecklistSectionProps {
  description?: string;
  symptoms: readonly string[];
  selectedSymptoms: string[];
  onSymptomToggle: (symptom: string) => void;
  andereSymptome?: string;
  onAndereSymptomeChange?: (value: string) => void;
  andereSymptomePlaceholder?: string;
}

export function SymptomChecklistSection({
  description,
  symptoms,
  selectedSymptoms,
  onSymptomToggle,
  andereSymptome,
  onAndereSymptomeChange,
  andereSymptomePlaceholder = "Weitere Symptome beschreiben..."
}: SymptomChecklistSectionProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredSymptoms = symptoms.filter(symptom =>
    symptom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {description && (
        <p className="text-foreground/80 text-sm">
          {description}
        </p>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Symptome durchsuchen..."
          className="w-full p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm pr-10"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-4 w-4 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Results counter */}
      <p className="text-xs text-foreground/60">
        {filteredSymptoms.length} von {symptoms.length} Symptomen angezeigt
      </p>

      {/* Symptoms Checkboxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Left column - first half */}
        <div className="space-y-3">
          {filteredSymptoms.slice(0, Math.ceil(filteredSymptoms.length / 2)).map((symptom) => (
            <label key={symptom} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
              <input
                type="checkbox"
                checked={selectedSymptoms.includes(symptom)}
                onChange={() => onSymptomToggle(symptom)}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
              />
              <span className="text-sm text-foreground leading-relaxed">{symptom}</span>
            </label>
          ))}
        </div>
        {/* Right column - second half */}
        <div className="space-y-3">
          {filteredSymptoms.slice(Math.ceil(filteredSymptoms.length / 2)).map((symptom) => (
            <label key={symptom} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
              <input
                type="checkbox"
                checked={selectedSymptoms.includes(symptom)}
                onChange={() => onSymptomToggle(symptom)}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
              />
              <span className="text-sm text-foreground leading-relaxed">{symptom}</span>
            </label>
          ))}
        </div>
      </div>

      {/* No results message */}
      {filteredSymptoms.length === 0 && searchTerm && (
        <div className="text-center py-8 text-foreground/60">
          <p>Keine Symptome gefunden für &quot;{searchTerm}&quot;</p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Suche zurücksetzen
          </button>
        </div>
      )}

      {/* Andere Symptome Text Input - only show if props are provided */}
      {andereSymptome !== undefined && onAndereSymptomeChange && (
        <div className="mt-6">
          <h5 className="text-lg font-medium text-foreground mb-3">Andere Symptome</h5>
          <textarea
            value={andereSymptome}
            onChange={(e) => onAndereSymptomeChange(e.target.value)}
            placeholder={andereSymptomePlaceholder}
            className="w-full p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[100px] resize-vertical"
          />
        </div>
      )}

      {/* Selected Symptoms Summary */}
      {selectedSymptoms.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
          <h5 className="font-medium text-foreground mb-2">
            Ausgewählte Symptome ({selectedSymptoms.length}):
          </h5>
          <div className="text-sm text-foreground/80">
            {[...selectedSymptoms].sort().map((symptom, index) => (
              <span key={symptom}>
                {symptom}{index < selectedSymptoms.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
