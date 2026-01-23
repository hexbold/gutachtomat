'use client';

import { Kapitel6Handlers } from '@/hooks/useGutachtenForm';
import * as FormTypes from '@/lib/core/form-types';
import { SOMATOFORME_INTERVENTION_LABELS } from '@/lib/core/form-labels';
import { InterventionModal } from './InterventionModal';

interface SomatoformeInterventionenModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormTypes.Form;
  kapitel6Handlers: Kapitel6Handlers;
}

export function SomatoformeInterventionenModal({
  isOpen,
  onClose,
  formData,
  kapitel6Handlers,
}: SomatoformeInterventionenModalProps) {
  return (
    <InterventionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Interventionen: Somatoforme Störungen"
      headerGradient="bg-gradient-to-r from-emerald-50 to-green-50"
      disorderType="somatoforme"
      data={formData.kapitel6.behandlungsplan.somatoforme}
      labels={SOMATOFORME_INTERVENTION_LABELS}
      kapitel6Handlers={kapitel6Handlers}
    />
  );
}
