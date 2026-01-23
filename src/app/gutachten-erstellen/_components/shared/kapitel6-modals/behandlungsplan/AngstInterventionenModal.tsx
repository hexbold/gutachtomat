'use client';

import { Kapitel6Handlers } from '@/hooks/useGutachtenForm';
import * as FormTypes from '@/lib/core/form-types';
import { ANGST_INTERVENTION_LABELS } from '@/lib/core/form-labels';
import { InterventionModal } from './InterventionModal';

interface AngstInterventionenModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  kapitel6Handlers: Kapitel6Handlers;
}

export function AngstInterventionenModal({
  isOpen,
  onClose,
  formData,
  kapitel6Handlers,
}: AngstInterventionenModalProps) {
  return (
    <InterventionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Interventionen: Angststörungen"
      headerGradient="bg-gradient-to-r from-yellow-50 to-amber-50"
      disorderType="angst"
      data={formData.kapitel6.behandlungsplan.angst}
      labels={ANGST_INTERVENTION_LABELS}
      kapitel6Handlers={kapitel6Handlers}
    />
  );
}
