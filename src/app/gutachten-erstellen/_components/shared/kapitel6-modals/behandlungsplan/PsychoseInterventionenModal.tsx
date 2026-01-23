'use client';

import { Kapitel6Handlers } from '@/hooks/useGutachtenForm';
import * as FormTypes from '@/lib/core/form-types';
import { PSYCHOSE_INTERVENTION_LABELS } from '@/lib/core/form-labels';
import { InterventionModal } from './InterventionModal';

interface PsychoseInterventionenModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  kapitel6Handlers: Kapitel6Handlers;
}

export function PsychoseInterventionenModal({
  isOpen,
  onClose,
  formData,
  kapitel6Handlers,
}: PsychoseInterventionenModalProps) {
  return (
    <InterventionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Interventionen: Psychosen"
      headerGradient="bg-gradient-to-r from-sky-50 to-blue-50"
      disorderType="psychose"
      data={formData.kapitel6.behandlungsplan.psychose}
      labels={PSYCHOSE_INTERVENTION_LABELS}
      kapitel6Handlers={kapitel6Handlers}
    />
  );
}
