'use client';

import * as FormTypes from '@/lib/core/form-types';
import { SymptomHandlers, A4Handlers, A5Handlers } from '@/hooks/useGutachtenForm';
import { SymptomChecklistSection } from '../../SymptomChecklistSection';
import { ExpandableSubsection } from '../shared/ExpandableSubsection';
import {
  a2Symptoms,
  a3Symptoms,
  a4SeitWannOptions,
  a4VerstaerkungOptions,
  a5StressfaktorenOptions
} from '@/lib/core/options/anamnese-sections';

interface AnamnesesSectionProps {
  formData: FormTypes.Form;
  symptomHandlers: SymptomHandlers;
  a4Handlers: A4Handlers;
  a5Handlers: A5Handlers;
  expansionState: FormTypes.SectionExpansionState;
  onSectionToggle: (section: keyof FormTypes.SectionExpansionState) => void;
}

export function AnamnesesSection({
  formData,
  symptomHandlers,
  a4Handlers,
  a5Handlers,
  expansionState,
  onSectionToggle
}: AnamnesesSectionProps) {
  return (
    <>
      <ExpandableSubsection
        title="A2 Verhaltensdefizite"
        isExpanded={expansionState.symptomatikA2}
        onToggle={() => onSectionToggle('symptomatikA2')}
        level={0}
      >
        <SymptomChecklistSection
          description="A2 Verhaltensdefizite - Symptome auswählen"
          symptoms={a2Symptoms}
          selectedSymptoms={formData.a2.symptoms}
          onSymptomToggle={(value) => symptomHandlers.toggleSymptom('a2', value)}
          andereSymptome={formData.a2.andereSymptome}
          onAndereSymptomeChange={(value) => symptomHandlers.setAndereSymptome('a2', value)}
          andereSymptomePlaceholder="Weitere Verhaltensdefizite beschreiben..."
        />
      </ExpandableSubsection>

      <ExpandableSubsection
        title="A3 Verhaltensexzesse"
        isExpanded={expansionState.symptomatikA3}
        onToggle={() => onSectionToggle('symptomatikA3')}
        level={0}
      >
        <SymptomChecklistSection
          description="A3 Verhaltensexzesse - Symptome auswählen"
          symptoms={a3Symptoms}
          selectedSymptoms={formData.a3.symptoms}
          onSymptomToggle={(value) => symptomHandlers.toggleSymptom('a3', value)}
          andereSymptome={formData.a3.andereSymptome}
          onAndereSymptomeChange={(value) => symptomHandlers.setAndereSymptome('a3', value)}
          andereSymptomePlaceholder="Weitere Verhaltensexzesse beschreiben..."
        />
      </ExpandableSubsection>

      <ExpandableSubsection
        title="A4 Verlauf und Dauer Symptomatik"
        isExpanded={expansionState.symptomatikA4}
        onToggle={() => onSectionToggle('symptomatikA4')}
        level={0}
      >
        <div className="space-y-6">
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">Seit wann besteht die Symptomatik?</h5>
            <div className="space-y-2">
              {a4SeitWannOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.a4.seitWann.includes(option)}
                    onChange={() => a4Handlers.toggleSeitWann(option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-foreground mb-2">Anderer Zeitraum</label>
              <input
                type="text"
                value={formData.a4.seitWannAndere}
                onChange={(e) => a4Handlers.setSeitWannAndere(e.target.value)}
                placeholder="Bitte angeben..."
                className="w-full p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">Hat sich die Symptomatik weiter verstärkt?</h5>
            <div className="space-y-2">
              {a4VerstaerkungOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.a4.verstaerkung.includes(option)}
                    onChange={() => a4Handlers.toggleVerstaerkung(option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-foreground mb-2">Anderer Zeitraum</label>
              <input
                type="text"
                value={formData.a4.verstaerkungAndere}
                onChange={(e) => a4Handlers.setVerstaerkungAndere(e.target.value)}
                placeholder="Bitte angeben..."
                className="w-full p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {(formData.a4.seitWann.length > 0 || formData.a4.verstaerkung.length > 0) && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung:</h5>
              <div className="text-sm text-foreground/80 space-y-1">
                {formData.a4.seitWann.length > 0 && (
                  <p><strong>Seit:</strong> {formData.a4.seitWann.join(', ')}</p>
                )}
                {formData.a4.verstaerkung.length > 0 && (
                  <p><strong>Verstärkung:</strong> {formData.a4.verstaerkung.join(', ')}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>

      <ExpandableSubsection
        title="A5 Aktuelle Stressfaktoren / Auslöser"
        isExpanded={expansionState.symptomatikA5}
        onToggle={() => onSectionToggle('symptomatikA5')}
        level={0}
      >
        <div className="space-y-6">
          <p className="text-foreground/80 text-sm">
            Aktuelle Stressfaktoren / Auslöser für die aktuelle Symptomatik auswählen
          </p>

          <div className="space-y-2">
            {a5StressfaktorenOptions.map((option) => (
              <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.a5.stressfaktoren.includes(option)}
                  onChange={() => a5Handlers.toggleStressfaktor(option)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                />
                <span className="text-sm text-foreground leading-relaxed">{option}</span>
              </label>
            ))}
          </div>

          <div className="mt-6">
            <h5 className="text-lg font-medium text-foreground mb-3">Andere Stressfaktoren</h5>
            <textarea
              value={formData.a5.andereStressfaktoren}
              onChange={(e) => a5Handlers.setAndereStressfaktoren(e.target.value)}
              placeholder="Weitere Stressfaktoren beschreiben..."
              className="w-full p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[100px] resize-vertical"
            />
          </div>

          {formData.a5.stressfaktoren.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">
                Ausgewählte Stressfaktoren ({formData.a5.stressfaktoren.length}):
              </h5>
              <div className="text-sm text-foreground/80">
                {[...formData.a5.stressfaktoren].sort().map((faktor, index) => (
                  <span key={faktor}>
                    {faktor}{index < formData.a5.stressfaktoren.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>
    </>
  );
}
