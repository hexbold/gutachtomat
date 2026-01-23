'use client';

import { Kapitel6Handlers } from '@/hooks/useGutachtenForm';
import * as FormTypes from '@/lib/core/form-types';
import { ALLGEMEINE_INTERVENTION_LABELS } from '@/lib/core/form-labels';
import { InterventionModal } from './InterventionModal';

interface AllgemeineInterventionenModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  kapitel6Handlers: Kapitel6Handlers;
}

export function AllgemeineInterventionenModal({
  isOpen,
  onClose,
  formData,
  kapitel6Handlers,
}: AllgemeineInterventionenModalProps) {
  return (
    <InterventionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Allgemeine Interventionen"
      headerGradient="bg-gradient-to-r from-slate-50 to-gray-100"
      disorderType="allgemeine"
      data={formData.kapitel6.behandlungsplan.allgemeine}
      labels={ALLGEMEINE_INTERVENTION_LABELS}
      kapitel6Handlers={kapitel6Handlers}
    />
  );
}
