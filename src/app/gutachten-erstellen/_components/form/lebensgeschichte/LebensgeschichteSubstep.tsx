'use client';

import * as FormTypes from '@/lib/core/form-types';
import { LebensgeschichteHandlers } from '@/hooks/useGutachtenForm';
import { BiographischeEinordnung } from './BiographischeEinordnung';
import { LebensgeschichtlicheEntwicklung } from './LebensgeschichtlicheEntwicklung';

interface LebensgeschichteSubstepProps {
  formData: FormTypes.Form;
  lebensgeschichteHandlers: LebensgeschichteHandlers;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
}

export function LebensgeschichteSubstep({ formData, lebensgeschichteHandlers, setNestedField }: LebensgeschichteSubstepProps) {
  return (
    <div className="space-y-8">
      {/* Section 1: Einordnung */}
      <div>
        <h4 className="text-lg font-semibold text-text-primary mb-4">
          Kurze biographische Einordnung
        </h4>
        <BiographischeEinordnung
          data={formData.lebensgA.kurzeBiographischeEinordnung}
          handlers={lebensgeschichteHandlers}
          setNestedField={setNestedField}
        />
      </div>

      {/* Section 2: Entwicklung */}
      <div>
        <h4 className="text-lg font-semibold text-text-primary mb-4">
          Lebensgeschichtliche Entwicklung
        </h4>
        <LebensgeschichtlicheEntwicklung
          data={formData.lebensgA.lebensgeschichtlicheEntwicklung}
          setNestedField={(path, value) => setNestedField(path, value)}
        />
      </div>
    </div>
  );
}
