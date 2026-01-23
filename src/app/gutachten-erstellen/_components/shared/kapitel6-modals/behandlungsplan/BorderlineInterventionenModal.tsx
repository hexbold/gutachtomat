'use client';

import { Kapitel6Handlers } from '@/hooks/useGutachtenForm';
import * as FormTypes from '@/lib/core/form-types';
import { BORDERLINE_INTERVENTION_LABELS } from '@/lib/core/form-labels';
import { InterventionModal } from './InterventionModal';

interface BorderlineInterventionenModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  kapitel6Handlers: Kapitel6Handlers;
}

export function BorderlineInterventionenModal({
  isOpen,
  onClose,
  formData,
  kapitel6Handlers,
}: BorderlineInterventionenModalProps) {
  return (
    <InterventionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Interventionen: Borderline Persönlichkeitsstörung"
      headerGradient="bg-gradient-to-r from-red-50 to-rose-50"
      disorderType="borderline"
      data={formData.kapitel6.behandlungsplan.borderline}
      labels={BORDERLINE_INTERVENTION_LABELS}
      kapitel6Handlers={kapitel6Handlers}
    />
  );
}
