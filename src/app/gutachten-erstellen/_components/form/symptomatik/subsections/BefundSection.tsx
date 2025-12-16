'use client';

import * as FormTypes from '@/lib/core/form-types';
import { BefundHandlers } from '@/hooks/useGutachtenForm';
import { ExpandableSubsection } from '../shared/ExpandableSubsection';
import {
  b1PflegezustandOptions,
  b1KoerpergeruchOptions,
  b1KleidungsstilOptions,
  b1KleidungszustandOptions,
  b2ErsterEindruckOptions,
  b2KontaktverhaltenOptions,
  b3SpracheOptions,
  b4QuantitativesBewusstseinOptions,
  b4QualitativesBewusstseinOptions,
  b5OrientierungOptions,
  b6MnestikOptions,
  b7KonzentrationOptions,
  b8DenkstrukturOptions,
  b8DenkgeschwindigkeitOptions,
  b9HalluzinationenOptions,
  b10InhaltlichesDenkenOptions,
  b11KeineIchStorungenOptions,
  b11PsychotischeIchStorungenOptions,
  b11NichtPsychotischeIchStorungenOptions,
  b12ArtenVonAngstenOptions,
  b12SymptomeKompensationOptions,
  b13ZwangeOptions,
  b14StimmungOptions,
  b14AffektOptions,
  b15AntriebOptions,
  b16PsychomotorikOptions,
  b17GradDerSuizidalitaOptions,
  b17PaktAbspracheFahigkeitOptions,
  b17AbklarungVonSuizidalitaOptions,
  b18KrankheitseinsichtOptions,
  b18BehandlungsbereitschaftOptions,
} from '@/lib/core/options/befund-sections';

interface BefundSectionProps {
  formData: FormTypes.Form;
  befundHandlers: BefundHandlers;
  expansionState: FormTypes.SectionExpansionState;
  onSectionToggle: (section: keyof FormTypes.SectionExpansionState) => void;
}

export function BefundSection({
  formData,
  befundHandlers,
  expansionState,
  onSectionToggle,
}: BefundSectionProps) {
  const toggleSection = (section: keyof FormTypes.SectionExpansionState) => {
    onSectionToggle(section);
  };

  return (
    <div>
      {/* ============================================================ */}
      {/* B1 - Erscheinungsbild */}
      {/* ============================================================ */}
      <ExpandableSubsection
        title="1 Erscheinungsbild"
        isExpanded={expansionState.erscheinungsbildAllgemein}
        onToggle={() => toggleSection('erscheinungsbildAllgemein')}
        level={1}
      >
        <div className="space-y-6">
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">1.1 Allgemein - Pflegezustand</h5>
            <div className="space-y-2">
              {b1PflegezustandOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b1.pflegezustand.includes(option)}
                    onChange={() => befundHandlers.toggle('b1', 'pflegezustand', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">Körpergeruch</h5>
            <div className="space-y-2">
              {b1KoerpergeruchOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b1.koerpergeruch.includes(option)}
                    onChange={() => befundHandlers.toggle('b1', 'koerpergeruch', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">Kleidung - Kleidungsstil</h5>
            <div className="space-y-2">
              {b1KleidungsstilOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b1.kleidungsstil.includes(option)}
                    onChange={() => befundHandlers.toggle('b1', 'kleidungsstil', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">Kleidungszustand und -angemessenheit</h5>
            <div className="space-y-2">
              {b1KleidungszustandOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b1.kleidungszustand.includes(option)}
                    onChange={() => befundHandlers.toggle('b1', 'kleidungszustand', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {(formData.b1.pflegezustand.length > 0 || formData.b1.koerpergeruch.length > 0 ||
            formData.b1.kleidungsstil.length > 0 || formData.b1.kleidungszustand.length > 0) && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung Erscheinungsbild:</h5>
              <div className="text-sm text-foreground/80 space-y-1">
                {formData.b1.pflegezustand.length > 0 && (
                  <p><strong>Pflegezustand:</strong> {formData.b1.pflegezustand.join(', ')}</p>
                )}
                {formData.b1.koerpergeruch.length > 0 && (
                  <p><strong>Körpergeruch:</strong> {formData.b1.koerpergeruch.join(', ')}</p>
                )}
                {formData.b1.kleidungsstil.length > 0 && (
                  <p><strong>Kleidungsstil:</strong> {formData.b1.kleidungsstil.join(', ')}</p>
                )}
                {formData.b1.kleidungszustand.length > 0 && (
                  <p><strong>Kleidungszustand:</strong> {formData.b1.kleidungszustand.join(', ')}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>

      {/* ============================================================ */}
      {/* B2 - Kontaktverhalten */}
      {/* ============================================================ */}
      <ExpandableSubsection
        title="2 Kontaktverhalten"
        isExpanded={expansionState.kontaktverhalten}
        onToggle={() => toggleSection('kontaktverhalten')}
        level={1}
      >
        <div className="space-y-6">
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">2.1 Erster Eindruck</h5>
            <div className="space-y-2">
              {b2ErsterEindruckOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b2.ersterEindruck.includes(option)}
                    onChange={() => befundHandlers.toggle('b2', 'ersterEindruck', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">2.2 Kontaktverhalten</h5>
            <div className="space-y-2">
              {b2KontaktverhaltenOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b2.kontaktverhalten.includes(option)}
                    onChange={() => befundHandlers.toggle('b2', 'kontaktverhalten', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {(formData.b2.ersterEindruck.length > 0 || formData.b2.kontaktverhalten.length > 0) && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung Kontaktverhalten:</h5>
              <div className="text-sm text-foreground/80 space-y-1">
                {formData.b2.ersterEindruck.length > 0 && (
                  <p><strong>Erster Eindruck:</strong> {formData.b2.ersterEindruck.join(', ')}</p>
                )}
                {formData.b2.kontaktverhalten.length > 0 && (
                  <p><strong>Kontaktverhalten:</strong> {formData.b2.kontaktverhalten.join(', ')}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>

      {/* ============================================================ */}
      {/* B3 - Sprache */}
      {/* ============================================================ */}
      <ExpandableSubsection
        title="3 Sprache"
        isExpanded={expansionState.sprache}
        onToggle={() => toggleSection('sprache')}
        level={1}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            {b3SpracheOptions.map((option) => (
              <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.b3.sprache.includes(option)}
                  onChange={() => befundHandlers.toggle('b3', 'sprache', option)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                />
                <span className="text-sm text-foreground leading-relaxed">{option}</span>
              </label>
            ))}
          </div>

          {formData.b3.sprache.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung Sprache:</h5>
              <div className="text-sm text-foreground/80">
                {formData.b3.sprache.join(', ')}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>

      {/* ============================================================ */}
      {/* B4 - Bewusstsein */}
      {/* ============================================================ */}
      <ExpandableSubsection
        title="4 Bewusstsein"
        isExpanded={expansionState.bewusstsein}
        onToggle={() => toggleSection('bewusstsein')}
        level={1}
      >
        <div className="space-y-6">
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">4.1 Quantitatives Bewusstsein</h5>
            <div className="space-y-2">
              {b4QuantitativesBewusstseinOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b4.quantitativesBewusstsein.includes(option)}
                    onChange={() => befundHandlers.toggle('b4', 'quantitativesBewusstsein', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">4.2 Qualitatives Bewusstsein</h5>
            <div className="space-y-2">
              {b4QualitativesBewusstseinOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b4.qualitativesBewusstsein.includes(option)}
                    onChange={() => befundHandlers.toggle('b4', 'qualitativesBewusstsein', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {(formData.b4.quantitativesBewusstsein.length > 0 || formData.b4.qualitativesBewusstsein.length > 0) && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung Bewusstsein:</h5>
              <div className="text-sm text-foreground/80 space-y-1">
                {formData.b4.quantitativesBewusstsein.length > 0 && (
                  <p><strong>Quantitativ:</strong> {formData.b4.quantitativesBewusstsein.join(', ')}</p>
                )}
                {formData.b4.qualitativesBewusstsein.length > 0 && (
                  <p><strong>Qualitativ:</strong> {formData.b4.qualitativesBewusstsein.join(', ')}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>

      {/* ============================================================ */}
      {/* B5 - Orientierung */}
      {/* ============================================================ */}
      <ExpandableSubsection
        title="5 Orientierung"
        isExpanded={expansionState.orientierung}
        onToggle={() => toggleSection('orientierung')}
        level={1}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            {b5OrientierungOptions.map((option) => (
              <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.b5.orientierung.includes(option)}
                  onChange={() => befundHandlers.toggle('b5', 'orientierung', option)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                />
                <span className="text-sm text-foreground leading-relaxed">{option}</span>
              </label>
            ))}
          </div>

          {formData.b5.orientierung.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung Orientierung:</h5>
              <div className="text-sm text-foreground/80">
                {formData.b5.orientierung.join(', ')}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>

      {/* ============================================================ */}
      {/* B6 - Mnestik */}
      {/* ============================================================ */}
      <ExpandableSubsection
        title="6 Mnestik"
        isExpanded={expansionState.mnestik}
        onToggle={() => toggleSection('mnestik')}
        level={1}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            {b6MnestikOptions.map((option) => (
              <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.b6.mnestik.includes(option)}
                  onChange={() => befundHandlers.toggle('b6', 'mnestik', option)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                />
                <span className="text-sm text-foreground leading-relaxed">{option}</span>
              </label>
            ))}
          </div>

          {formData.b6.mnestik.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung Mnestik:</h5>
              <div className="text-sm text-foreground/80">
                {formData.b6.mnestik.join(', ')}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>

      {/* ============================================================ */}
      {/* B7 - Konzentration */}
      {/* ============================================================ */}
      <ExpandableSubsection
        title="7 Konzentration"
        isExpanded={expansionState.konzentration}
        onToggle={() => toggleSection('konzentration')}
        level={1}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            {b7KonzentrationOptions.map((option) => (
              <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.b7.konzentration.includes(option)}
                  onChange={() => befundHandlers.toggle('b7', 'konzentration', option)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                />
                <span className="text-sm text-foreground leading-relaxed">{option}</span>
              </label>
            ))}
          </div>

          {formData.b7.konzentration.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung Konzentration:</h5>
              <div className="text-sm text-foreground/80">
                {formData.b7.konzentration.join(', ')}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>

      {/* ============================================================ */}
      {/* B8 - Formales Denken */}
      {/* ============================================================ */}
      <ExpandableSubsection
        title="8 Formales Denken"
        isExpanded={expansionState.formalesDenken}
        onToggle={() => toggleSection('formalesDenken')}
        level={1}
      >
        <div className="space-y-6">
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">8.1 Denkstruktur</h5>
            <div className="space-y-2">
              {b8DenkstrukturOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b8.denkstruktur.includes(option)}
                    onChange={() => befundHandlers.toggle('b8', 'denkstruktur', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">8.2 Denkgeschwindigkeit</h5>
            <div className="space-y-2">
              {b8DenkgeschwindigkeitOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b8.denkgeschwindigkeit.includes(option)}
                    onChange={() => befundHandlers.toggle('b8', 'denkgeschwindigkeit', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {(formData.b8.denkstruktur.length > 0 || formData.b8.denkgeschwindigkeit.length > 0) && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung Formales Denken:</h5>
              <div className="text-sm text-foreground/80 space-y-1">
                {formData.b8.denkstruktur.length > 0 && (
                  <p><strong>Denkstruktur:</strong> {formData.b8.denkstruktur.join(', ')}</p>
                )}
                {formData.b8.denkgeschwindigkeit.length > 0 && (
                  <p><strong>Denkgeschwindigkeit:</strong> {formData.b8.denkgeschwindigkeit.join(', ')}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>

      {/* ============================================================ */}
      {/* B9 - Wahrnehmung */}
      {/* ============================================================ */}
      <ExpandableSubsection
        title="9 Wahrnehmung"
        isExpanded={expansionState.wahrnehmung}
        onToggle={() => toggleSection('wahrnehmung')}
        level={1}
      >
        <div className="space-y-6">
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">9.1 Halluzinationen</h5>
            <div className="space-y-2">
              {b9HalluzinationenOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b9.halluzinationen.includes(option)}
                    onChange={() => befundHandlers.toggle('b9', 'halluzinationen', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {formData.b9.halluzinationen.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung Wahrnehmung:</h5>
              <div className="text-sm text-foreground/80">
                <strong>Halluzinationen:</strong> {formData.b9.halluzinationen.join(', ')}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>

      {/* ============================================================ */}
      {/* B10 - Inhaltliches Denken */}
      {/* ============================================================ */}
      <ExpandableSubsection
        title="10 Inhaltliches Denken"
        isExpanded={expansionState.inhaltlichesDenken}
        onToggle={() => toggleSection('inhaltlichesDenken')}
        level={1}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            {b10InhaltlichesDenkenOptions.map((option) => (
              <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.b10.inhaltlichesDenken.includes(option)}
                  onChange={() => befundHandlers.toggle('b10', 'inhaltlichesDenken', option)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                />
                <span className="text-sm text-foreground leading-relaxed">{option}</span>
              </label>
            ))}
          </div>

          {formData.b10.inhaltlichesDenken.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung Inhaltliches Denken:</h5>
              <div className="text-sm text-foreground/80">
                {formData.b10.inhaltlichesDenken.join(', ')}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>

      {/* ============================================================ */}
      {/* B11 - Ich-Störungen */}
      {/* ============================================================ */}
      <ExpandableSubsection
        title="11 Ich-Störungen"
        isExpanded={expansionState.ichStorungen}
        onToggle={() => toggleSection('ichStorungen')}
        level={1}
      >
        <div className="space-y-6">
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">11.1 Keine Ich-Störungen</h5>
            <div className="space-y-2">
              {b11KeineIchStorungenOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b11.keineIchStorungen.includes(option)}
                    onChange={() => befundHandlers.toggle('b11', 'keineIchStorungen', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">11.2 Psychotische Ich-Störungen</h5>
            <div className="space-y-2">
              {b11PsychotischeIchStorungenOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b11.psychotischeIchStorungen.includes(option)}
                    onChange={() => befundHandlers.toggle('b11', 'psychotischeIchStorungen', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">11.3 Nicht-Psychotische Ich-Störungen</h5>
            <div className="space-y-2">
              {b11NichtPsychotischeIchStorungenOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b11.nichtPsychotischeIchStorungen.includes(option)}
                    onChange={() => befundHandlers.toggle('b11', 'nichtPsychotischeIchStorungen', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {(formData.b11.keineIchStorungen.length > 0 || formData.b11.psychotischeIchStorungen.length > 0 ||
            formData.b11.nichtPsychotischeIchStorungen.length > 0) && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung Ich-Störungen:</h5>
              <div className="text-sm text-foreground/80 space-y-1">
                {formData.b11.keineIchStorungen.length > 0 && (
                  <p><strong>Keine Ich-Störungen:</strong> {formData.b11.keineIchStorungen.join(', ')}</p>
                )}
                {formData.b11.psychotischeIchStorungen.length > 0 && (
                  <p><strong>Psychotische Ich-Störungen:</strong> {formData.b11.psychotischeIchStorungen.join(', ')}</p>
                )}
                {formData.b11.nichtPsychotischeIchStorungen.length > 0 && (
                  <p><strong>Nicht-Psychotische Ich-Störungen:</strong> {formData.b11.nichtPsychotischeIchStorungen.join(', ')}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>

      {/* ============================================================ */}
      {/* B12 - Ängste */}
      {/* ============================================================ */}
      <ExpandableSubsection
        title="12 Ängste"
        isExpanded={expansionState.angste}
        onToggle={() => toggleSection('angste')}
        level={1}
      >
        <div className="space-y-6">
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">12.1 Arten von Ängsten</h5>
            <div className="space-y-2">
              {b12ArtenVonAngstenOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b12.artenVonAngsten.includes(option)}
                    onChange={() => befundHandlers.toggle('b12', 'artenVonAngsten', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">12.2 Symptome und Kompensation</h5>
            <div className="space-y-2">
              {b12SymptomeKompensationOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b12.symptomeKompensation.includes(option)}
                    onChange={() => befundHandlers.toggle('b12', 'symptomeKompensation', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {(formData.b12.artenVonAngsten.length > 0 || formData.b12.symptomeKompensation.length > 0) && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung Ängste:</h5>
              <div className="text-sm text-foreground/80 space-y-1">
                {formData.b12.artenVonAngsten.length > 0 && (
                  <p><strong>Arten von Ängsten:</strong> {formData.b12.artenVonAngsten.join(', ')}</p>
                )}
                {formData.b12.symptomeKompensation.length > 0 && (
                  <p><strong>Symptome/Kompensation:</strong> {formData.b12.symptomeKompensation.join(', ')}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>

      {/* ============================================================ */}
      {/* B13 - Zwänge */}
      {/* ============================================================ */}
      <ExpandableSubsection
        title="13 Zwänge"
        isExpanded={expansionState.zwange}
        onToggle={() => toggleSection('zwange')}
        level={1}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            {b13ZwangeOptions.map((option) => (
              <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.b13.zwange.includes(option)}
                  onChange={() => befundHandlers.toggle('b13', 'zwange', option)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                />
                <span className="text-sm text-foreground leading-relaxed">{option}</span>
              </label>
            ))}
          </div>

          {formData.b13.zwange.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung Zwänge:</h5>
              <div className="text-sm text-foreground/80">
                {formData.b13.zwange.join(', ')}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>

      {/* ============================================================ */}
      {/* B14 - Stimmung und Affekt */}
      {/* ============================================================ */}
      <ExpandableSubsection
        title="14 Stimmung und Affekt"
        isExpanded={expansionState.stimmungUndAffekt}
        onToggle={() => toggleSection('stimmungUndAffekt')}
        level={1}
      >
        <div className="space-y-6">
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">14.1 Stimmung</h5>
            <div className="space-y-2">
              {b14StimmungOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b14.stimmung.includes(option)}
                    onChange={() => befundHandlers.toggle('b14', 'stimmung', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">14.2 Affekt</h5>
            <div className="space-y-2">
              {b14AffektOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b14.affekt.includes(option)}
                    onChange={() => befundHandlers.toggle('b14', 'affekt', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {(formData.b14.stimmung.length > 0 || formData.b14.affekt.length > 0) && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung Stimmung und Affekt:</h5>
              <div className="text-sm text-foreground/80 space-y-1">
                {formData.b14.stimmung.length > 0 && (
                  <p><strong>Stimmung:</strong> {formData.b14.stimmung.join(', ')}</p>
                )}
                {formData.b14.affekt.length > 0 && (
                  <p><strong>Affekt:</strong> {formData.b14.affekt.join(', ')}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>

      {/* ============================================================ */}
      {/* B15 - Antrieb, Interesse, Freude */}
      {/* ============================================================ */}
      <ExpandableSubsection
        title="15 Antrieb, Interesse, Freude"
        isExpanded={expansionState.antriebInteresseFreude}
        onToggle={() => toggleSection('antriebInteresseFreude')}
        level={1}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            {b15AntriebOptions.map((option) => (
              <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.b15.antrieb.includes(option)}
                  onChange={() => befundHandlers.toggle('b15', 'antrieb', option)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                />
                <span className="text-sm text-foreground leading-relaxed">{option}</span>
              </label>
            ))}
          </div>

          {formData.b15.antrieb.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung Antrieb:</h5>
              <div className="text-sm text-foreground/80">
                {formData.b15.antrieb.join(', ')}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>

      {/* ============================================================ */}
      {/* B16 - Psychomotorik */}
      {/* ============================================================ */}
      <ExpandableSubsection
        title="16 Psychomotorik"
        isExpanded={expansionState.psychomotorik}
        onToggle={() => toggleSection('psychomotorik')}
        level={1}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            {b16PsychomotorikOptions.map((option) => (
              <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.b16.psychomotorik.includes(option)}
                  onChange={() => befundHandlers.toggle('b16', 'psychomotorik', option)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                />
                <span className="text-sm text-foreground leading-relaxed">{option}</span>
              </label>
            ))}
          </div>

          {formData.b16.psychomotorik.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung Psychomotorik:</h5>
              <div className="text-sm text-foreground/80">
                {formData.b16.psychomotorik.join(', ')}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>

      {/* ============================================================ */}
      {/* B17 - Suizidalität */}
      {/* ============================================================ */}
      <ExpandableSubsection
        title="17 Suizidalität"
        isExpanded={expansionState.suizidalitat}
        onToggle={() => toggleSection('suizidalitat')}
        level={1}
      >
        <div className="space-y-6">
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">17.1 Grad der Suizidalität</h5>
            <div className="space-y-2">
              {b17GradDerSuizidalitaOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b17.gradDerSuizidalitat.includes(option)}
                    onChange={() => befundHandlers.toggle('b17', 'gradDerSuizidalitat', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">17.2 Pakt/Absprachefähigkeit</h5>
            <div className="space-y-2">
              {b17PaktAbspracheFahigkeitOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b17.paktAbspracheFahigkeit.includes(option)}
                    onChange={() => befundHandlers.toggle('b17', 'paktAbspracheFahigkeit', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">17.3 Abklärung von Suizidalität</h5>
            <div className="space-y-2">
              {b17AbklarungVonSuizidalitaOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b17.abklarungVonSuizidalitat.includes(option)}
                    onChange={() => befundHandlers.toggle('b17', 'abklarungVonSuizidalitat', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {(formData.b17.gradDerSuizidalitat.length > 0 || formData.b17.paktAbspracheFahigkeit.length > 0 ||
            formData.b17.abklarungVonSuizidalitat.length > 0) && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung Suizidalität:</h5>
              <div className="text-sm text-foreground/80 space-y-1">
                {formData.b17.gradDerSuizidalitat.length > 0 && (
                  <p><strong>Grad der Suizidalität:</strong> {formData.b17.gradDerSuizidalitat.join(', ')}</p>
                )}
                {formData.b17.paktAbspracheFahigkeit.length > 0 && (
                  <p><strong>Pakt/Absprachefähigkeit:</strong> {formData.b17.paktAbspracheFahigkeit.join(', ')}</p>
                )}
                {formData.b17.abklarungVonSuizidalitat.length > 0 && (
                  <p><strong>Abklärung:</strong> {formData.b17.abklarungVonSuizidalitat.join(', ')}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>

      {/* ============================================================ */}
      {/* B18 - Krankheitseinstellung */}
      {/* ============================================================ */}
      <ExpandableSubsection
        title="18 Krankheitseinstellung"
        isExpanded={expansionState.krankheitseinstellung}
        onToggle={() => toggleSection('krankheitseinstellung')}
        level={1}
      >
        <div className="space-y-6">
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">18.1 Krankheitseinsicht</h5>
            <div className="space-y-2">
              {b18KrankheitseinsichtOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b18.krankheitseinsicht.includes(option)}
                    onChange={() => befundHandlers.toggle('b18', 'krankheitseinsicht', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">18.2 Behandlungsbereitschaft</h5>
            <div className="space-y-2">
              {b18BehandlungsbereitschaftOptions.map((option) => (
                <label key={option} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.b18.behandlungsbereitschaft.includes(option)}
                    onChange={() => befundHandlers.toggle('b18', 'behandlungsbereitschaft', option)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {(formData.b18.krankheitseinsicht.length > 0 || formData.b18.behandlungsbereitschaft.length > 0) && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Zusammenfassung Krankheitseinstellung:</h5>
              <div className="text-sm text-foreground/80 space-y-1">
                {formData.b18.krankheitseinsicht.length > 0 && (
                  <p><strong>Krankheitseinsicht:</strong> {formData.b18.krankheitseinsicht.join(', ')}</p>
                )}
                {formData.b18.behandlungsbereitschaft.length > 0 && (
                  <p><strong>Behandlungsbereitschaft:</strong> {formData.b18.behandlungsbereitschaft.join(', ')}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </ExpandableSubsection>
    </div>
  );
}
