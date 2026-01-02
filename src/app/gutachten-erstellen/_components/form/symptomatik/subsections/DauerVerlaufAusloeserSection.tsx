'use client';

import * as FormTypes from '@/lib/core/form-types';

interface DauerVerlaufAusloeserSectionProps {
  formData: FormTypes.Form;
  setNestedField: (fieldPath: string, value: string | number | boolean | null | Record<string, unknown>) => void;
}

export function DauerVerlaufAusloeserSection({
  formData,
  setNestedField,
}: DauerVerlaufAusloeserSectionProps) {
  return (
    <div className="space-y-6">
      {/* Beginn und Dauer der Symptomatik */}
      <div>
        <h4 className="text-base font-semibold text-text-primary mb-2">
          Beginn und Dauer der Symptomatik
        </h4>
        <textarea
          value={formData.symptomatikKontext.beginnUndDauer}
          onChange={(e) => setNestedField('symptomatikKontext.beginnUndDauer', e.target.value)}
          onBlur={(e) => {
            const val = e.target.value.trim();
            if (val && !/[.!?]$/.test(val)) {
              setNestedField('symptomatikKontext.beginnUndDauer', `${val}.`);
            }
          }}
          placeholder="z.B. Die Symptomatik habe vor etwa 6 Monaten begonnen..."
          rows={4}
          className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
        />
      </div>

      {/* Verlauf der aktuellen Symptomatik */}
      <div>
        <h4 className="text-base font-semibold text-text-primary mb-2">
          Verlauf der aktuellen Symptomatik
        </h4>
        <textarea
          value={formData.symptomatikKontext.verlauf}
          onChange={(e) => setNestedField('symptomatikKontext.verlauf', e.target.value)}
          onBlur={(e) => {
            const val = e.target.value.trim();
            if (val && !/[.!?]$/.test(val)) {
              setNestedField('symptomatikKontext.verlauf', `${val}.`);
            }
          }}
          placeholder="z.B. Seit Symptombeginn zeige sich eine zunehmende Verschlechterung..."
          rows={4}
          className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
        />
      </div>

      {/* Auslöser für die aktuelle Symptomatik */}
      <div>
        <h4 className="text-base font-semibold text-text-primary mb-2">
          Auslöser für die aktuelle Symptomatik
        </h4>
        <textarea
          value={formData.symptomatikKontext.ausloeser}
          onChange={(e) => setNestedField('symptomatikKontext.ausloeser', e.target.value)}
          onBlur={(e) => {
            const val = e.target.value.trim();
            if (val && !/[.!?]$/.test(val)) {
              setNestedField('symptomatikKontext.ausloeser', `${val}.`);
            }
          }}
          placeholder="z.B. Als Auslöser werde eine Trennung vom Partner genannt..."
          rows={4}
          className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
        />
      </div>
    </div>
  );
}
