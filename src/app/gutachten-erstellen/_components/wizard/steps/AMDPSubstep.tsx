'use client';

import * as FormTypes from '@/lib/core/form-types';
import { BefundHandlers } from '@/hooks/useGutachtenForm';
import { useState } from 'react';
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

interface AMDPSubstepProps {
  formData: FormTypes.Form;
  befundHandlers: BefundHandlers;
  confirmedPages: Set<number>;
  completedPages: Set<number>;
  onConfirmPage: (page: number) => void;
  onCompletePage: (page: number) => void;
  onCurrentPageChange: (page: number) => void;
}

interface AMDPPage {
  id: number;
  title: string;
  shortTitle: string;
}

const AMDP_PAGES: AMDPPage[] = [
  { id: 1, title: 'Erscheinung & Kontakt', shortTitle: 'B1-B2' },
  { id: 2, title: 'Kognitive Funktionen', shortTitle: 'B3-B7' },
  { id: 3, title: 'Denken & Wahrnehmung', shortTitle: 'B8-B11' },
  { id: 4, title: 'Angst & Zwang', shortTitle: 'B12-B13' },
  { id: 5, title: 'Affekt & Verhalten', shortTitle: 'B14-B16' },
  { id: 6, title: 'Risiko & Einsicht', shortTitle: 'B17-B18' },
];

interface SymptomCardProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

function SymptomCard({ label, isSelected, onClick }: SymptomCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`
        relative p-3 rounded-lg border-2 transition-all duration-200 text-left min-h-[60px] flex items-center
        ${isSelected
          ? 'border-blue-500 bg-accent-blue-light shadow-sm'
          : 'border-border-primary bg-surface-primary hover:border-blue-300 hover:bg-accent-blue-light/30'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-400
      `}
    >
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      )}
      <span className={`text-sm font-semibold leading-snug pr-6 line-clamp-2 ${isSelected ? 'text-blue-700' : 'text-text-secondary'}`}>
        {label}
      </span>
    </button>
  );
}

export function AMDPSubstep({
  formData,
  befundHandlers,
  confirmedPages,
  completedPages,
  onConfirmPage,
  onCompletePage,
  onCurrentPageChange
}: AMDPSubstepProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Notify parent of current page changes
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    onCurrentPageChange(newPage);
  };

  const canGoNext = currentPage < AMDP_PAGES.length;
  const canGoPrev = currentPage > 1;

  const handleConfirm = () => {
    // Mark current page as completed
    onCompletePage(currentPage);

    // Automatically move to next page if available
    if (canGoNext) {
      const nextPage = currentPage + 1;
      onConfirmPage(nextPage); // Make next page accessible
      handlePageChange(nextPage);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      handlePageChange(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    // Only allow clicking on confirmed pages
    if (confirmedPages.has(pageNumber)) {
      handlePageChange(pageNumber);
    }
  };

  return (
    <div className="space-y-4">
      {/* Horizontal Navigation Bar */}
      <div className="flex gap-2 p-3 bg-surface-secondary rounded-lg border border-border-primary">
        {AMDP_PAGES.map((page) => {
          const isActive = currentPage === page.id;
          const isCompleted = completedPages.has(page.id) && !isActive;
          const isAccessible = confirmedPages.has(page.id);
          const isLocked = !isAccessible;

          return (
            <button
              key={page.id}
              onClick={() => handlePageClick(page.id)}
              disabled={isLocked}
              className={`
                flex-1 p-2 rounded-md border-2 transition-all duration-200
                ${isActive
                  ? 'border-blue-500 bg-accent-blue-light shadow-sm'
                  : isCompleted
                  ? 'border-green-500 bg-accent-green-light hover:bg-accent-green-light cursor-pointer'
                  : isLocked
                  ? 'border-border-primary bg-surface-secondary opacity-50 cursor-not-allowed'
                  : 'border-border-primary bg-surface-primary hover:border-blue-300 hover:bg-accent-blue-light/50 cursor-pointer'
                }
              `}
            >
              <div className="flex flex-col items-center gap-1">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${isActive
                    ? 'bg-blue-500 text-white'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : isLocked
                    ? 'bg-surface-tertiary text-text-quaternary'
                    : 'bg-surface-tertiary text-text-tertiary'
                  }
                `}>
                  {isCompleted ? '✓' : isLocked ? '🔒' : page.id}
                </div>
                <div className={`text-xs font-semibold leading-tight text-center ${
                  isActive ? 'text-blue-700' : isCompleted ? 'text-green-700' : isLocked ? 'text-text-quaternary' : 'text-text-secondary'
                }`}>
                  {page.shortTitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Page Header */}
      <div className="pt-2">
        <h4 className="text-lg font-bold text-text-primary">
          {AMDP_PAGES[currentPage - 1].title}
        </h4>
        <p className="text-sm text-text-tertiary mt-1">
          Psychopathologischer Befund nach AMDP-System
        </p>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
            {/* Page 1: Erscheinung & Kontakt (B1-B2) */}
            {currentPage === 1 && (
              <>
                <div>
                  <h5 className="text-base font-semibold text-text-primary mb-1">B1 Erscheinungsbild - Allgemein</h5>
                  <p className="text-xs text-text-tertiary mb-3">Äußeres Erscheinungsbild und Pflege</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Pflegezustand</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {b1PflegezustandOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b1.pflegezustand.includes(option)}
                            onClick={() => befundHandlers.toggle('b1', 'pflegezustand', option)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Körpergeruch</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {b1KoerpergeruchOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b1.koerpergeruch.includes(option)}
                            onClick={() => befundHandlers.toggle('b1', 'koerpergeruch', option)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Kleidungsstil</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {b1KleidungsstilOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b1.kleidungsstil.includes(option)}
                            onClick={() => befundHandlers.toggle('b1', 'kleidungsstil', option)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Kleidungszustand</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {b1KleidungszustandOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b1.kleidungszustand.includes(option)}
                            onClick={() => befundHandlers.toggle('b1', 'kleidungszustand', option)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-base font-semibold text-text-primary mb-1">B2 Kontaktverhalten</h5>
                  <p className="text-xs text-text-tertiary mb-3">Erster Eindruck und Kontaktgestaltung</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Erster Eindruck</label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {b2ErsterEindruckOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b2.ersterEindruck.includes(option)}
                            onClick={() => befundHandlers.toggle('b2', 'ersterEindruck', option)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Kontaktverhalten</label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {b2KontaktverhaltenOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b2.kontaktverhalten.includes(option)}
                            onClick={() => befundHandlers.toggle('b2', 'kontaktverhalten', option)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Page 2: Kognitive Funktionen (B3-B7) */}
            {currentPage === 2 && (
              <>
                <div>
                  <h5 className="text-base font-semibold text-text-primary mb-1">B3 Sprache</h5>
                  <p className="text-xs text-text-tertiary mb-3">Sprachliche Besonderheiten</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {b3SpracheOptions.map((option) => (
                      <SymptomCard
                        key={option}
                        label={option}
                        isSelected={formData.b3.sprache.includes(option)}
                        onClick={() => befundHandlers.toggle('b3', 'sprache', option)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-base font-semibold text-text-primary mb-1">B4 Bewusstsein</h5>
                  <p className="text-xs text-text-tertiary mb-3">Bewusstseinszustand</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Quantitatives Bewusstsein</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {b4QuantitativesBewusstseinOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b4.quantitativesBewusstsein.includes(option)}
                            onClick={() => befundHandlers.toggle('b4', 'quantitativesBewusstsein', option)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Qualitatives Bewusstsein</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {b4QualitativesBewusstseinOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b4.qualitativesBewusstsein.includes(option)}
                            onClick={() => befundHandlers.toggle('b4', 'qualitativesBewusstsein', option)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-base font-semibold text-text-primary mb-1">B5 Orientierung</h5>
                  <p className="text-xs text-text-tertiary mb-3">Orientierung zu Ort, Zeit, Person und Situation</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {b5OrientierungOptions.map((option) => (
                      <SymptomCard
                        key={option}
                        label={option}
                        isSelected={formData.b5.orientierung.includes(option)}
                        onClick={() => befundHandlers.toggle('b5', 'orientierung', option)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-base font-semibold text-text-primary mb-1">B6 Mnestik</h5>
                  <p className="text-xs text-text-tertiary mb-3">Gedächtnisfunktionen</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {b6MnestikOptions.map((option) => (
                      <SymptomCard
                        key={option}
                        label={option}
                        isSelected={formData.b6.mnestik.includes(option)}
                        onClick={() => befundHandlers.toggle('b6', 'mnestik', option)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-base font-semibold text-text-primary mb-1">B7 Konzentration und Auffassung</h5>
                  <p className="text-xs text-text-tertiary mb-3">Aufmerksamkeit und Konzentrationsfähigkeit</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {b7KonzentrationOptions.map((option) => (
                      <SymptomCard
                        key={option}
                        label={option}
                        isSelected={formData.b7.konzentration.includes(option)}
                        onClick={() => befundHandlers.toggle('b7', 'konzentration', option)}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Page 3: Denken & Wahrnehmung (B8-B11) */}
            {currentPage === 3 && (
              <>
                <div>
                  <h5 className="text-base font-semibold text-text-primary mb-1">B8 Formales Denken</h5>
                  <p className="text-xs text-text-tertiary mb-3">Struktur und Geschwindigkeit des Denkens</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Denkstruktur</label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {b8DenkstrukturOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b8.denkstruktur.includes(option)}
                            onClick={() => befundHandlers.toggle('b8', 'denkstruktur', option)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Denkgeschwindigkeit</label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {b8DenkgeschwindigkeitOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b8.denkgeschwindigkeit.includes(option)}
                            onClick={() => befundHandlers.toggle('b8', 'denkgeschwindigkeit', option)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-base font-semibold text-text-primary mb-1">B9 Wahrnehmung</h5>
                  <p className="text-xs text-text-tertiary mb-3">Halluzinationen und Sinnestäuschungen</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {b9HalluzinationenOptions.map((option) => (
                      <SymptomCard
                        key={option}
                        label={option}
                        isSelected={formData.b9.halluzinationen.includes(option)}
                        onClick={() => befundHandlers.toggle('b9', 'halluzinationen', option)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-base font-semibold text-text-primary mb-1">B10 Inhaltliches Denken</h5>
                  <p className="text-xs text-text-tertiary mb-3">Wahnhafte Überzeugungen</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {b10InhaltlichesDenkenOptions.map((option) => (
                      <SymptomCard
                        key={option}
                        label={option}
                        isSelected={formData.b10.inhaltlichesDenken.includes(option)}
                        onClick={() => befundHandlers.toggle('b10', 'inhaltlichesDenken', option)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-base font-semibold text-text-primary mb-1">B11 Ich-Störungen</h5>
                  <p className="text-xs text-text-tertiary mb-3">Störungen der Ich-Grenzen</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Keine Ich-Störungen</label>
                      <div className="grid grid-cols-1 gap-2.5">
                        {b11KeineIchStorungenOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b11.keineIchStorungen.includes(option)}
                            onClick={() => befundHandlers.toggle('b11', 'keineIchStorungen', option)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Psychotische Ich-Störungen</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {b11PsychotischeIchStorungenOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b11.psychotischeIchStorungen.includes(option)}
                            onClick={() => befundHandlers.toggle('b11', 'psychotischeIchStorungen', option)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Nicht-psychotische Ich-Störungen</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {b11NichtPsychotischeIchStorungenOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b11.nichtPsychotischeIchStorungen.includes(option)}
                            onClick={() => befundHandlers.toggle('b11', 'nichtPsychotischeIchStorungen', option)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Page 4: Angst & Zwang (B12-B13) */}
            {currentPage === 4 && (
              <>
                <div>
                  <h5 className="text-base font-semibold text-text-primary mb-1">B12 Ängste</h5>
                  <p className="text-xs text-text-tertiary mb-3">Arten von Ängsten und Begleitsymptomatik</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Arten von Ängsten</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {b12ArtenVonAngstenOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b12.artenVonAngsten.includes(option)}
                            onClick={() => befundHandlers.toggle('b12', 'artenVonAngsten', option)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Symptome und Kompensation</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {b12SymptomeKompensationOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b12.symptomeKompensation.includes(option)}
                            onClick={() => befundHandlers.toggle('b12', 'symptomeKompensation', option)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-base font-semibold text-text-primary mb-1">B13 Zwänge</h5>
                  <p className="text-xs text-text-tertiary mb-3">Zwangsgedanken und Zwangshandlungen</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {b13ZwangeOptions.map((option) => (
                      <SymptomCard
                        key={option}
                        label={option}
                        isSelected={formData.b13.zwange.includes(option)}
                        onClick={() => befundHandlers.toggle('b13', 'zwange', option)}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Page 5: Affekt & Verhalten (B14-B16) */}
            {currentPage === 5 && (
              <>
                <div>
                  <h5 className="text-base font-semibold text-text-primary mb-1">B14 Stimmung und Affekt</h5>
                  <p className="text-xs text-text-tertiary mb-3">Emotionale Befindlichkeit</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Stimmung</label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {b14StimmungOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b14.stimmung.includes(option)}
                            onClick={() => befundHandlers.toggle('b14', 'stimmung', option)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Affekt</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {b14AffektOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b14.affekt.includes(option)}
                            onClick={() => befundHandlers.toggle('b14', 'affekt', option)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-base font-semibold text-text-primary mb-1">B15 Antrieb, Interesse und Freudeempfinden</h5>
                  <p className="text-xs text-text-tertiary mb-3">Motivation und Aktivitätsniveau</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {b15AntriebOptions.map((option) => (
                      <SymptomCard
                        key={option}
                        label={option}
                        isSelected={formData.b15.antrieb.includes(option)}
                        onClick={() => befundHandlers.toggle('b15', 'antrieb', option)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-base font-semibold text-text-primary mb-1">B16 Psychomotorik</h5>
                  <p className="text-xs text-text-tertiary mb-3">Motorisches Verhalten</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {b16PsychomotorikOptions.map((option) => (
                      <SymptomCard
                        key={option}
                        label={option}
                        isSelected={formData.b16.psychomotorik.includes(option)}
                        onClick={() => befundHandlers.toggle('b16', 'psychomotorik', option)}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Page 6: Risiko & Einsicht (B17-B18) */}
            {currentPage === 6 && (
              <>
                <div>
                  <h5 className="text-base font-semibold text-text-primary mb-1">B17 Suizidalität</h5>
                  <p className="text-xs text-text-tertiary mb-3">Selbstgefährdung und Absprachefähigkeit</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Grad der Suizidalität</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {b17GradDerSuizidalitaOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b17.gradDerSuizidalitat.includes(option)}
                            onClick={() => befundHandlers.toggle('b17', 'gradDerSuizidalitat', option)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Pakt / Absprachefähigkeit</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {b17PaktAbspracheFahigkeitOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b17.paktAbspracheFahigkeit.includes(option)}
                            onClick={() => befundHandlers.toggle('b17', 'paktAbspracheFahigkeit', option)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Abklärung von Suizidalität</label>
                      <div className="grid grid-cols-1 gap-2.5">
                        {b17AbklarungVonSuizidalitaOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b17.abklarungVonSuizidalitat.includes(option)}
                            onClick={() => befundHandlers.toggle('b17', 'abklarungVonSuizidalitat', option)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-base font-semibold text-text-primary mb-1">B18 Krankheitseinstellung</h5>
                  <p className="text-xs text-text-tertiary mb-3">Einsicht und Behandlungsmotivation</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Krankheitseinsicht</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {b18KrankheitseinsichtOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b18.krankheitseinsicht.includes(option)}
                            onClick={() => befundHandlers.toggle('b18', 'krankheitseinsicht', option)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Behandlungsbereitschaft</label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {b18BehandlungsbereitschaftOptions.map((option) => (
                          <SymptomCard
                            key={option}
                            label={option}
                            isSelected={formData.b18.behandlungsbereitschaft.includes(option)}
                            onClick={() => befundHandlers.toggle('b18', 'behandlungsbereitschaft', option)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t border-border-primary">
            <button
              onClick={handlePrev}
              disabled={!canGoPrev}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg transition-all border-2
                ${canGoPrev
                  ? 'bg-surface-primary text-text-secondary hover:bg-hover-surface border-border-primary hover:border-blue-300 cursor-pointer'
                  : 'bg-surface-secondary text-text-quaternary cursor-not-allowed border-border-primary'
                }
              `}
            >
              ← Zurück
            </button>

            <div className="text-sm text-text-tertiary self-center font-medium">
              {currentPage} von {AMDP_PAGES.length}
            </div>

            {canGoNext && (
              <button
                onClick={handleConfirm}
                className="px-6 py-2 text-sm font-semibold rounded-lg transition-all border-2 bg-green-600 hover:bg-green-700 text-white border-green-600 hover:shadow-md cursor-pointer"
              >
                Weiter →
              </button>
            )}
            {!canGoNext && (
              <div className="px-6 py-2 text-sm font-medium text-text-tertiary">
                Klicken Sie auf &quot;Auswahl bestätigen&quot; unten
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
