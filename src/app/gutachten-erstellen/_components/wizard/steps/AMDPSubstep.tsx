'use client';

import * as FormTypes from '@/lib/core/form-types';
import { BefundHandlers } from '@/hooks/useGutachtenForm';
import { useState } from 'react';
import {
  ErscheinungsbildModal,
  KontaktverhaltenModal,
  SpracheModal,
  BewusstseinModal,
  OrientierungModal,
  MnestikModal,
  KonzentrationUndAuffassungModal,
  FormalesDenkenModal,
  WahrnehmungModal,
  InhaltlichesDenkenModal,
  IchStoerungenModal,
  AengsteModal,
  ZwaengeModal,
  StimmungUndAffektModal,
  AntriebInteresseFreudeModal,
  PsychomotorikModal,
  SuizidalitaetModal,
  KrankheitseinstellungModal,
} from '../../shared/befund-modals';

interface AMDPSubstepProps {
  formData: FormTypes.Form;
  befundHandlers: BefundHandlers;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
}

type ModalType =
  | 'erscheinungsbild' | 'kontaktverhalten' | 'sprache' | 'bewusstsein'
  | 'orientierung' | 'mnestik' | 'konzentrationUndAuffassung' | 'formalesDenken'
  | 'wahrnehmung' | 'inhaltlichesDenken' | 'ichStoerungen' | 'aengste'
  | 'zwaenge' | 'stimmungUndAffekt' | 'antriebInteresseFreude' | 'psychomotorik'
  | 'suizidalitaet' | 'krankheitseinstellung' | null;

interface BefundSection {
  id: ModalType;
  title: string;
  description: string;
  getCount: (formData: FormTypes.Form) => number;
}

// Map section IDs to their clear function names
const CLEAR_FUNCTION_MAP: Record<NonNullable<ModalType>, keyof BefundHandlers> = {
  erscheinungsbild: 'clearErscheinungsbild',
  kontaktverhalten: 'clearKontaktverhalten',
  sprache: 'clearSprache',
  bewusstsein: 'clearBewusstsein',
  orientierung: 'clearOrientierung',
  mnestik: 'clearMnestik',
  konzentrationUndAuffassung: 'clearKonzentrationUndAuffassung',
  formalesDenken: 'clearFormalesDenken',
  wahrnehmung: 'clearWahrnehmung',
  inhaltlichesDenken: 'clearInhaltlichesDenken',
  ichStoerungen: 'clearIchStoerungen',
  aengste: 'clearAengste',
  zwaenge: 'clearZwaenge',
  stimmungUndAffekt: 'clearStimmungUndAffekt',
  antriebInteresseFreude: 'clearAntriebInteresseFreude',
  psychomotorik: 'clearPsychomotorik',
  suizidalitaet: 'clearSuizidalitaet',
  krankheitseinstellung: 'clearKrankheitseinstellung',
};

const BEFUND_SECTIONS: BefundSection[] = [
  {
    id: 'erscheinungsbild',
    title: 'Erscheinungsbild',
    description: 'Äußeres Erscheinungsbild und Pflege',
    getCount: (fd) =>
      Object.keys(fd.erscheinungsbild.pflegezustand || {}).length +
      Object.keys(fd.erscheinungsbild.koerpergeruch || {}).length +
      Object.keys(fd.erscheinungsbild.kleidungsstil || {}).length +
      Object.keys(fd.erscheinungsbild.kleidungszustand || {}).length +
      Object.keys(fd.erscheinungsbild.kleidungsangemessenheit || {}).length,
  },
  {
    id: 'kontaktverhalten',
    title: 'Kontaktverhalten',
    description: 'Erster Eindruck und Kontaktgestaltung',
    getCount: (fd) =>
      fd.kontaktverhalten.ersterEindruck.length +
      fd.kontaktverhalten.kontaktverhalten.length,
  },
  {
    id: 'sprache',
    title: 'Sprache',
    description: 'Sprachliche Besonderheiten',
    getCount: (fd) => fd.sprache.sprache.length,
  },
  {
    id: 'bewusstsein',
    title: 'Bewusstsein',
    description: 'Bewusstseinszustand',
    getCount: (fd) =>
      fd.bewusstsein.quantitativesBewusstsein.length +
      fd.bewusstsein.qualitativesBewusstsein.length,
  },
  {
    id: 'orientierung',
    title: 'Orientierung',
    description: 'Orientierung zu Ort, Zeit, Person und Situation',
    getCount: (fd) => fd.orientierung.orientierung.length,
  },
  {
    id: 'mnestik',
    title: 'Mnestik',
    description: 'Gedächtnisfunktionen',
    getCount: (fd) => fd.mnestik.mnestik.length,
  },
  {
    id: 'konzentrationUndAuffassung',
    title: 'Konzentration und Auffassung',
    description: 'Aufmerksamkeit und Konzentrationsfähigkeit',
    getCount: (fd) => fd.konzentrationUndAuffassung.konzentration.length,
  },
  {
    id: 'formalesDenken',
    title: 'Formales Denken',
    description: 'Struktur und Geschwindigkeit des Denkens',
    getCount: (fd) =>
      fd.formalesDenken.denkstruktur.length +
      fd.formalesDenken.denkgeschwindigkeit.length,
  },
  {
    id: 'wahrnehmung',
    title: 'Wahrnehmung',
    description: 'Halluzinationen und Sinnestäuschungen',
    getCount: (fd) => fd.wahrnehmung.halluzinationen.length,
  },
  {
    id: 'inhaltlichesDenken',
    title: 'Inhaltliches Denken',
    description: 'Wahnhafte Überzeugungen',
    getCount: (fd) => fd.inhaltlichesDenken.inhaltlichesDenken.length,
  },
  {
    id: 'ichStoerungen',
    title: 'Ich-Störungen',
    description: 'Störungen der Ich-Grenzen',
    getCount: (fd) =>
      fd.ichStoerungen.keineIchStorungen.length +
      fd.ichStoerungen.psychotischeIchStorungen.length +
      fd.ichStoerungen.nichtPsychotischeIchStorungen.length,
  },
  {
    id: 'aengste',
    title: 'Ängste',
    description: 'Arten von Ängsten und Begleitsymptomatik',
    getCount: (fd) =>
      fd.aengste.artenVonAngsten.length +
      fd.aengste.symptomeKompensation.length,
  },
  {
    id: 'zwaenge',
    title: 'Zwänge',
    description: 'Zwangsgedanken und Zwangshandlungen',
    getCount: (fd) => fd.zwaenge.zwange.length,
  },
  {
    id: 'stimmungUndAffekt',
    title: 'Stimmung und Affekt',
    description: 'Emotionale Befindlichkeit',
    getCount: (fd) =>
      fd.stimmungUndAffekt.stimmung.length +
      fd.stimmungUndAffekt.affekt.length,
  },
  {
    id: 'antriebInteresseFreude',
    title: 'Antrieb, Interesse und Freude',
    description: 'Motivation und Aktivitätsniveau',
    getCount: (fd) => fd.antriebInteresseFreude.antrieb.length,
  },
  {
    id: 'psychomotorik',
    title: 'Psychomotorik',
    description: 'Motorisches Verhalten',
    getCount: (fd) => fd.psychomotorik.psychomotorik.length,
  },
  {
    id: 'suizidalitaet',
    title: 'Suizidalität',
    description: 'Selbstgefährdung und Absprachefähigkeit',
    getCount: (fd) =>
      fd.suizidalitaet.gradDerSuizidalitat.length +
      fd.suizidalitaet.paktAbspracheFahigkeit.length +
      fd.suizidalitaet.abklarungVonSuizidalitat.length,
  },
  {
    id: 'krankheitseinstellung',
    title: 'Krankheitseinstellung',
    description: 'Einsicht und Behandlungsmotivation',
    getCount: (fd) =>
      fd.krankheitseinstellung.krankheitseinsicht.length +
      fd.krankheitseinstellung.behandlungsbereitschaft.length,
  },
];

export function AMDPSubstep({ formData, befundHandlers, setNestedField }: AMDPSubstepProps) {
  const [openModal, setOpenModal] = useState<ModalType>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h4 className="text-lg font-bold text-text-primary">
          Psychopathologischer Befund
        </h4>
        <p className="text-sm text-text-tertiary mt-1">
          Befund nach AMDP-System - Klicken Sie auf eine Kategorie, um Details auszuwählen
        </p>
      </div>

      {/* Section Buttons - Vertical List */}
      <div className="space-y-3">
        {BEFUND_SECTIONS.map((section) => {
          const count = section.getCount(formData);
          const hasSelections = count > 0;
          const clearFn = section.id ? CLEAR_FUNCTION_MAP[section.id] : null;

          return (
            <div key={section.id} className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpenModal(section.id)}
                className={`flex-1 text-left p-4 bg-surface-primary border-2 rounded-lg hover:border-blue-500 hover:bg-accent-blue-light transition-all duration-200 cursor-pointer group ${
                  hasSelections ? 'border-blue-500' : 'border-border-primary'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary group-hover:text-blue-700">
                      {section.title}
                    </h4>
                    {hasSelections && (
                      <p className="text-sm text-text-secondary mt-1">
                        {count} Merkmal{count !== 1 ? 'e' : ''} ausgewählt
                      </p>
                    )}
                  </div>
                  <svg
                    className="w-6 h-6 text-text-quaternary group-hover:text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              {/* Delete button - only shown when selections exist */}
              {hasSelections && clearFn && (
                <button
                  type="button"
                  onClick={() => {
                    if (!window.confirm(`Möchten Sie wirklich alle ${count} ausgewählten Merkmale löschen?`)) {
                      return;
                    }
                    (befundHandlers[clearFn] as () => void)();
                  }}
                  className="relative p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-400 transition-all duration-200 cursor-pointer group"
                >
                  <svg className="w-6 h-6 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-semibold text-red-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Auswahl löschen
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <ErscheinungsbildModal
        isOpen={openModal === 'erscheinungsbild'}
        onClose={() => setOpenModal(null)}
        formData={formData}
        befundHandlers={befundHandlers}
        setNestedField={setNestedField}
      />
      <KontaktverhaltenModal
        isOpen={openModal === 'kontaktverhalten'}
        onClose={() => setOpenModal(null)}
        formData={formData}
        befundHandlers={befundHandlers}
      />
      <SpracheModal
        isOpen={openModal === 'sprache'}
        onClose={() => setOpenModal(null)}
        formData={formData}
        befundHandlers={befundHandlers}
      />
      <BewusstseinModal
        isOpen={openModal === 'bewusstsein'}
        onClose={() => setOpenModal(null)}
        formData={formData}
        befundHandlers={befundHandlers}
      />
      <OrientierungModal
        isOpen={openModal === 'orientierung'}
        onClose={() => setOpenModal(null)}
        formData={formData}
        befundHandlers={befundHandlers}
      />
      <MnestikModal
        isOpen={openModal === 'mnestik'}
        onClose={() => setOpenModal(null)}
        formData={formData}
        befundHandlers={befundHandlers}
      />
      <KonzentrationUndAuffassungModal
        isOpen={openModal === 'konzentrationUndAuffassung'}
        onClose={() => setOpenModal(null)}
        formData={formData}
        befundHandlers={befundHandlers}
      />
      <FormalesDenkenModal
        isOpen={openModal === 'formalesDenken'}
        onClose={() => setOpenModal(null)}
        formData={formData}
        befundHandlers={befundHandlers}
      />
      <WahrnehmungModal
        isOpen={openModal === 'wahrnehmung'}
        onClose={() => setOpenModal(null)}
        formData={formData}
        befundHandlers={befundHandlers}
      />
      <InhaltlichesDenkenModal
        isOpen={openModal === 'inhaltlichesDenken'}
        onClose={() => setOpenModal(null)}
        formData={formData}
        befundHandlers={befundHandlers}
      />
      <IchStoerungenModal
        isOpen={openModal === 'ichStoerungen'}
        onClose={() => setOpenModal(null)}
        formData={formData}
        befundHandlers={befundHandlers}
      />
      <AengsteModal
        isOpen={openModal === 'aengste'}
        onClose={() => setOpenModal(null)}
        formData={formData}
        befundHandlers={befundHandlers}
      />
      <ZwaengeModal
        isOpen={openModal === 'zwaenge'}
        onClose={() => setOpenModal(null)}
        formData={formData}
        befundHandlers={befundHandlers}
      />
      <StimmungUndAffektModal
        isOpen={openModal === 'stimmungUndAffekt'}
        onClose={() => setOpenModal(null)}
        formData={formData}
        befundHandlers={befundHandlers}
      />
      <AntriebInteresseFreudeModal
        isOpen={openModal === 'antriebInteresseFreude'}
        onClose={() => setOpenModal(null)}
        formData={formData}
        befundHandlers={befundHandlers}
      />
      <PsychomotorikModal
        isOpen={openModal === 'psychomotorik'}
        onClose={() => setOpenModal(null)}
        formData={formData}
        befundHandlers={befundHandlers}
      />
      <SuizidalitaetModal
        isOpen={openModal === 'suizidalitaet'}
        onClose={() => setOpenModal(null)}
        formData={formData}
        befundHandlers={befundHandlers}
      />
      <KrankheitseinstellungModal
        isOpen={openModal === 'krankheitseinstellung'}
        onClose={() => setOpenModal(null)}
        formData={formData}
        befundHandlers={befundHandlers}
      />
    </div>
  );
}
