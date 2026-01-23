'use client';

import { Kapitel6Handlers } from '@/hooks/useGutachtenForm';
import * as FormTypes from '@/lib/core/form-types';
import { PTBS_INTERVENTION_LABELS } from '@/lib/core/form-labels';
import { InterventionModal } from './InterventionModal';

interface PTBSInterventionenModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  kapitel6Handlers: Kapitel6Handlers;
}

export function PTBSInterventionenModal({
  isOpen,
  onClose,
  formData,
  kapitel6Handlers,
}: PTBSInterventionenModalProps) {
  return (
    <InterventionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Interventionen: PTBS"
      headerGradient="bg-gradient-to-r from-teal-50 to-cyan-50"
      disorderType="ptbs"
      data={formData.kapitel6.behandlungsplan.ptbs}
      labels={PTBS_INTERVENTION_LABELS}
      kapitel6Handlers={kapitel6Handlers}
    />
  );
}
