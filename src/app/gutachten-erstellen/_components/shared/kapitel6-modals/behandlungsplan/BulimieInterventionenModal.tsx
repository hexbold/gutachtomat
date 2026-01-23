'use client';

import { Kapitel6Handlers } from '@/hooks/useGutachtenForm';
import * as FormTypes from '@/lib/core/form-types';
import { BULIMIE_INTERVENTION_LABELS } from '@/lib/core/form-labels';
import { InterventionModal } from './InterventionModal';

interface BulimieInterventionenModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  kapitel6Handlers: Kapitel6Handlers;
}

export function BulimieInterventionenModal({
  isOpen,
  onClose,
  formData,
  kapitel6Handlers,
}: BulimieInterventionenModalProps) {
  return (
    <InterventionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Interventionen: Bulimia Nervosa"
      headerGradient="bg-gradient-to-r from-fuchsia-50 to-pink-50"
      disorderType="bulimie"
      data={formData.kapitel6.behandlungsplan.bulimie}
      labels={BULIMIE_INTERVENTION_LABELS}
      kapitel6Handlers={kapitel6Handlers}
    />
  );
}
