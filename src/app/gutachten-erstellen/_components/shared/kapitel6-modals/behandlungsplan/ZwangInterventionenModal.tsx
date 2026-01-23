'use client';

import { Kapitel6Handlers } from '@/hooks/useGutachtenForm';
import * as FormTypes from '@/lib/core/form-types';
import { ZWANG_INTERVENTION_LABELS } from '@/lib/core/form-labels';
import { InterventionModal } from './InterventionModal';

interface ZwangInterventionenModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  kapitel6Handlers: Kapitel6Handlers;
}

export function ZwangInterventionenModal({
  isOpen,
  onClose,
  formData,
  kapitel6Handlers,
}: ZwangInterventionenModalProps) {
  return (
    <InterventionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Interventionen: Zwangsstörung"
      headerGradient="bg-gradient-to-r from-orange-50 to-amber-50"
      disorderType="zwang"
      data={formData.kapitel6.behandlungsplan.zwang}
      labels={ZWANG_INTERVENTION_LABELS}
      kapitel6Handlers={kapitel6Handlers}
    />
  );
}
