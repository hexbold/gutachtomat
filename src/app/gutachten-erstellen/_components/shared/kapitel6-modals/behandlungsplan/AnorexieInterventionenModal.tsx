'use client';

import { Kapitel6Handlers } from '@/hooks/useGutachtenForm';
import * as FormTypes from '@/lib/core/form-types';
import { ANOREXIE_INTERVENTION_LABELS } from '@/lib/core/form-labels';
import { InterventionModal } from './InterventionModal';

interface AnorexieInterventionenModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  kapitel6Handlers: Kapitel6Handlers;
}

export function AnorexieInterventionenModal({
  isOpen,
  onClose,
  formData,
  kapitel6Handlers,
}: AnorexieInterventionenModalProps) {
  return (
    <InterventionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Interventionen: Anorexia Nervosa"
      headerGradient="bg-gradient-to-r from-pink-50 to-rose-50"
      disorderType="anorexie"
      data={formData.kapitel6.behandlungsplan.anorexie}
      labels={ANOREXIE_INTERVENTION_LABELS}
      kapitel6Handlers={kapitel6Handlers}
    />
  );
}
