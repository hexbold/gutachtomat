'use client';

import * as FormTypes from '@/lib/core/form-types';

interface LebensgeschichtlicheEntwicklungProps {
  data: FormTypes.LebensgeschichtlicheEntwicklung;
  setNestedField: (fieldPath: string, value: string) => void;
}

const FIELDS: { key: keyof FormTypes.LebensgeschichtlicheEntwicklung; heading: string; placeholder: string }[] = [
  { key: 'kindheitUndErziehung', heading: 'Kindheit und Erziehung', placeholder: 'z.B. Aufgewachsen in einem ländlichen Umfeld mit strenger Erziehung...' },
  { key: 'jugend', heading: 'Jugend', placeholder: 'z.B. Die Jugend sei von Konflikten mit den Eltern geprägt gewesen...' },
  { key: 'schulischerBeruflichWerdegang', heading: 'Schulischer und beruflicher Werdegang', placeholder: 'z.B. Habe das Abitur mit gutem Erfolg abgeschlossen und anschließend studiert...' },
  { key: 'finanziellesFamiliaresUmfeld', heading: 'Finanzielles und familiäres Umfeld', placeholder: 'z.B. Die Familie habe in bescheidenen Verhältnissen gelebt...' },
  { key: 'beziehungen', heading: 'Beziehungen und Partnerschaften', placeholder: 'z.B. Sei seit 10 Jahren verheiratet und habe zwei Kinder...' },
  { key: 'interessenHobbies', heading: 'Interessen und Hobbies', placeholder: 'z.B. Habe sich früher für Sport interessiert, heute kaum noch Hobbies...' },
  { key: 'praegendeTraumatischeEreignisse', heading: 'Prägende oder traumatische Ereignisse', placeholder: 'z.B. Der Tod des Vaters vor 5 Jahren sei ein einschneidendes Erlebnis gewesen...' },
  { key: 'andere', heading: 'Sonstiges', placeholder: 'z.B. Weitere relevante Informationen zur Lebensgeschichte...' },
];

export function LebensgeschichtlicheEntwicklung({ data, setNestedField }: LebensgeschichtlicheEntwicklungProps) {
  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-base font-semibold text-text-primary mb-3">Lebensgeschichtliche Entwicklung</h4>
        <p className="text-sm text-text-tertiary mb-4">
          Detaillierte Beschreibung der lebensgeschichtlichen Entwicklung in verschiedenen Bereichen
        </p>
      </div>

      <div className="space-y-4">
        {FIELDS.map(({ key, heading, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              {heading}
            </label>
            <textarea
              value={data[key]}
              onChange={(e) => setNestedField(`lebensgA.lebensgeschichtlicheEntwicklung.${key}`, e.target.value)}
              placeholder={placeholder}
              rows={3}
              className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
            />
          </div>
        ))}
      </div>

      {/* Weitere Angaben */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">Weitere Angaben zur Entwicklung</label>
        <textarea
          value={data.weitereAngaben}
          onChange={(e) => setNestedField('lebensgA.lebensgeschichtlicheEntwicklung.weitereAngaben', e.target.value)}
          placeholder="Zusätzliche Informationen zur lebensgeschichtlichen Entwicklung..."
          rows={4}
          className="w-full px-3 py-2.5 text-base border-2 border-border-primary rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-surface-primary resize-vertical"
        />
      </div>
    </div>
  );
}
