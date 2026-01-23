'use client';

import { Kapitel6Handlers } from '@/hooks/useGutachtenForm';
import * as FormTypes from '@/lib/core/form-types';
import { DEPRESSION_INTERVENTION_LABELS } from '@/lib/core/form-labels';
import { InterventionModal } from './InterventionModal';

interface DepressionInterventionenModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  kapitel6Handlers: Kapitel6Handlers;
}

export function DepressionInterventionenModal({
  isOpen,
  onClose,
  formData,
  kapitel6Handlers,
}: DepressionInterventionenModalProps) {
  return (
    <InterventionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Interventionen: Unipolare Depression"
      headerGradient="bg-gradient-to-r from-blue-50 to-indigo-50"
      disorderType="depression"
      data={formData.kapitel6.behandlungsplan.depression}
      labels={DEPRESSION_INTERVENTION_LABELS}
      kapitel6Handlers={kapitel6Handlers}
    />
  );
}
