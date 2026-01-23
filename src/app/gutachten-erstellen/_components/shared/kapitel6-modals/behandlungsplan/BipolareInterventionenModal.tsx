'use client';

import { Kapitel6Handlers } from '@/hooks/useGutachtenForm';
import * as FormTypes from '@/lib/core/form-types';
import { BIPOLARE_INTERVENTION_LABELS } from '@/lib/core/form-labels';
import { InterventionModal } from './InterventionModal';

interface BipolareInterventionenModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  kapitel6Handlers: Kapitel6Handlers;
}

export function BipolareInterventionenModal({
  isOpen,
  onClose,
  formData,
  kapitel6Handlers,
}: BipolareInterventionenModalProps) {
  return (
    <InterventionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Interventionen: Bipolare Störung"
      headerGradient="bg-gradient-to-r from-purple-50 to-violet-50"
      disorderType="bipolare"
      data={formData.kapitel6.behandlungsplan.bipolare}
      labels={BIPOLARE_INTERVENTION_LABELS}
      kapitel6Handlers={kapitel6Handlers}
    />
  );
}
