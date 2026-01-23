'use client';

import * as FormTypes from '@/lib/core/form-types';

interface DreiFaktorenGASFormProps {
  data: FormTypes.DreiFaktorenGASModellData;
  onUpdate: (data: FormTypes.DreiFaktorenGASModellData) => void;
}

export function DreiFaktorenGASForm({ data, onUpdate }: DreiFaktorenGASFormProps) {
  const CheckboxItem = ({
    checked,
    onChange,
    label
  }: {
    checked: boolean;
    onChange: (value: boolean) => void;
    label: string;
  }) => (
    <label className="flex items-start gap-2 cursor-pointer py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">Drei-Faktoren-Modell der Generalisierten Angststörung</h3>
        <p className="text-sm text-blue-700">
          Das Modell unterscheidet prädisponierende, auslösende und aufrechterhaltende Faktoren
          für die Entwicklung und Persistenz der GAS.
        </p>
      </div>

      {/* Prädisponierende Faktoren */}
      <div className="border-2 border-yellow-200 rounded-lg p-4 bg-yellow-50/50">
        <label className="block text-sm font-bold text-yellow-900 mb-3">
          Prädisponierende Faktoren (Vulnerabilität)
        </label>
        <div className="space-y-1">
          <CheckboxItem
            checked={data.praedisponierendVeranlagung}
            onChange={(v) => onUpdate({ ...data, praedisponierendVeranlagung: v })}
            label="Genetische Veranlagung / familiäre Häufung"
          />
          <CheckboxItem
            checked={data.praedisponierendLernerfahrungen}
            onChange={(v) => onUpdate({ ...data, praedisponierendLernerfahrungen: v })}
            label="Frühe Lernerfahrungen (unsicherer Bindungsstil)"
          />
          <CheckboxItem
            checked={data.praedisponierendSelbstwirksamkeit}
            onChange={(v) => onUpdate({ ...data, praedisponierendSelbstwirksamkeit: v })}
            label="Geringe Selbstwirksamkeitserwartung"
          />
          <CheckboxItem
            checked={data.praedisponierendProblemloesung}
            onChange={(v) => onUpdate({ ...data, praedisponierendProblemloesung: v })}
            label="Defizitäre Problemlösefähigkeiten"
          />
          <CheckboxItem
            checked={data.praedisponierendGrundannahmen}
            onChange={(v) => onUpdate({ ...data, praedisponierendGrundannahmen: v })}
            label="Dysfunktionale Grundannahmen über Sorgen"
          />
        </div>
      </div>

      {/* Auslösende Faktoren */}
      <div className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50/50">
        <label className="block text-sm font-bold text-orange-900 mb-3">
          Auslösende Faktoren (Trigger)
        </label>
        <div className="space-y-1">
          <CheckboxItem
            checked={data.ausloesendAnforderungen}
            onChange={(v) => onUpdate({ ...data, ausloesendAnforderungen: v })}
            label="Erhöhte Anforderungen / Überforderung"
          />
          <CheckboxItem
            checked={data.ausloesendBelastungen}
            onChange={(v) => onUpdate({ ...data, ausloesendBelastungen: v })}
            label="Kritische Lebensereignisse / Belastungen"
          />
          <CheckboxItem
            checked={data.ausloesendMehrereFaktoren}
            onChange={(v) => onUpdate({ ...data, ausloesendMehrereFaktoren: v })}
            label="Kumulation mehrerer Stressoren"
          />
        </div>
      </div>

      {/* Aufrechterhaltende Faktoren */}
      <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50/50">
        <label className="block text-sm font-bold text-red-900 mb-3">
          Aufrechterhaltende Faktoren (Mechanismen)
        </label>
        <div className="grid grid-cols-2 gap-x-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 mb-1">Kognitive Vermeidung:</p>
            <CheckboxItem
              checked={data.aufrechterhaltendGruebeln}
              onChange={(v) => onUpdate({ ...data, aufrechterhaltendGruebeln: v })}
              label="Grübeln als Coping-Strategie"
            />
            <CheckboxItem
              checked={data.aufrechterhaltendGedankenstopp}
              onChange={(v) => onUpdate({ ...data, aufrechterhaltendGedankenstopp: v })}
              label="Gedankenstopp-Versuche"
            />
            <CheckboxItem
              checked={data.aufrechterhaltendAblenkung}
              onChange={(v) => onUpdate({ ...data, aufrechterhaltendAblenkung: v })}
              label="Ablenkung"
            />
            <CheckboxItem
              checked={data.aufrechterhaltendKognitiveVermeidung}
              onChange={(v) => onUpdate({ ...data, aufrechterhaltendKognitiveVermeidung: v })}
              label="Kognitive Vermeidung"
            />
            <CheckboxItem
              checked={data.aufrechterhaltendSorgenketten}
              onChange={(v) => onUpdate({ ...data, aufrechterhaltendSorgenketten: v })}
              label="Sorgenketten"
            />
            <CheckboxItem
              checked={data.aufrechterhaltendGedankenStattBilder}
              onChange={(v) => onUpdate({ ...data, aufrechterhaltendGedankenStattBilder: v })}
              label="Gedanken statt Bilder (Vermeidung mentaler Bilder)"
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 mb-1">Offene Vermeidung & Aufmerksamkeit:</p>
            <CheckboxItem
              checked={data.aufrechterhaltendOffeneVermeidung}
              onChange={(v) => onUpdate({ ...data, aufrechterhaltendOffeneVermeidung: v })}
              label="Offene Vermeidung von Situationen"
            />
            <CheckboxItem
              checked={data.aufrechterhaltendAufmerksamkeitBedrohlich}
              onChange={(v) => onUpdate({ ...data, aufrechterhaltendAufmerksamkeitBedrohlich: v })}
              label="Selektive Aufmerksamkeit auf Bedrohliches"
            />
            <CheckboxItem
              checked={data.aufrechterhaltendGefahrenbezogeneInterpretation}
              onChange={(v) => onUpdate({ ...data, aufrechterhaltendGefahrenbezogeneInterpretation: v })}
              label="Gefahrenbezogene Interpretation"
            />
            <CheckboxItem
              checked={data.aufrechterhaltendKonzentrationsprobleme}
              onChange={(v) => onUpdate({ ...data, aufrechterhaltendKonzentrationsprobleme: v })}
              label="Konzentrationsprobleme"
            />
            <CheckboxItem
              checked={data.aufrechterhaltendVerringerungLeistung}
              onChange={(v) => onUpdate({ ...data, aufrechterhaltendVerringerungLeistung: v })}
              label="Verringerung der Leistungsfähigkeit"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
