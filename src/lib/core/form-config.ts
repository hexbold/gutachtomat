/**
 * Form Field Configuration - UI configuration for all form fields.
 * Uses discriminated unions for type safety.
 * Labels come from form-labels.ts.
 */

// --- Type Definitions ---

/** Base properties shared by all field configs */
type BaseFieldConfig = {
  required?: boolean;
  helpText?: string;
  disabled?: boolean;
};

/** Radio buttons - best for 2-5 options */
export type RadioFieldConfig = BaseFieldConfig & {
  component: 'radio';
  options: readonly { id: string; label: string }[];
};

/** Select/dropdown - best for 5+ options */
export type SelectFieldConfig = BaseFieldConfig & {
  component: 'select';
  options: readonly { id: string; label: string }[];
  multiple?: boolean;
};

/** Number input */
export type NumberFieldConfig = BaseFieldConfig & {
  component: 'number';
  min?: number;
  max?: number;
  placeholder?: string;
};

/** Text input - single line, default maxLength 255 */
export type TextFieldConfig = BaseFieldConfig & {
  component: 'text';
  placeholder?: string;
  maxLength?: number;
};

/** Textarea - multi-line, default maxLength 2000 */
export type TextareaFieldConfig = BaseFieldConfig & {
  component: 'textarea';
  placeholder?: string;
  maxLength?: number;
};

/** Checkbox - boolean toggle */
export type CheckboxFieldConfig = BaseFieldConfig & {
  component: 'checkbox';
};

/** Date picker - ISO format (YYYY-MM-DD) */
export type DateFieldConfig = BaseFieldConfig & {
  component: 'date';
  placeholder?: string;
  min?: string;
  max?: string;
};

/** Discriminated union based on 'component' property */
export type FieldConfig =
  | RadioFieldConfig
  | SelectFieldConfig
  | NumberFieldConfig
  | TextFieldConfig
  | TextareaFieldConfig
  | CheckboxFieldConfig
  | DateFieldConfig;

// --- Legacy Options (pending migration to enums) ---
export const FORM_OPTIONS = {
  therapieform: [
    { id: 'therapie_verhaltenstherapie', label: 'Verhaltenstherapie' },
    { id: 'therapie_analytisch', label: 'Analytische Therapie' },
    { id: 'therapie_tiefenpsychologisch', label: 'Tiefenpsychologisch-fundierte Therapie' },
    { id: 'therapie_systemisch', label: 'Systemische Therapie' }
  ],
  behandlungsform: [
    { id: 'behandlung_einzel', label: 'Einzeltherapie' },
    { id: 'behandlung_gruppe', label: 'Gruppentherapie' },
    { id: 'behandlung_einzel_gruppe', label: 'Kombination aus Einzel- und Gruppentherapie' }
  ],
  antragsart: [
    { id: 'antrag_erst', label: 'Erstantrag' },
    { id: 'antrag_umwandlung', label: 'Umwandlungsantrag' },
    { id: 'antrag_fortfuehrung', label: 'Fortführung' }
  ],
  somatischeVorerkrankungen: [
    { id: 'somatik_keine', label: 'Keine' },
    { id: 'somatik_vorhanden', label: 'Somatische Vorerkrankungen vorhanden' }
  ],
  dauerEinheit: [
    { id: 'dauer_wochen', label: 'seit Wochen' },
    { id: 'dauer_monate', label: 'seit Monaten' }
  ],
  verschriebenVon: [
    { id: 'verschr_hausarzt', label: 'Hausarzt/Hausärztin' },
    { id: 'verschr_psychiater', label: 'Psychiater/Psychiaterin' },
    { id: 'verschr_andere', label: 'Andere' }
  ],
  settingVorbehandlung: [
    { id: 'setting_stationaer', label: 'Stationäre Behandlung' },
    { id: 'setting_tagklinisch', label: 'Tagklinische Behandlung' },
    { id: 'setting_ambulant', label: 'Ambulante Behandlung' }
  ],
  behandlungszeitraumEinheit: [
    { id: 'zeitraum_wochen', label: 'Wochen' },
    { id: 'zeitraum_monate', label: 'Monate' }
  ],
  abschlussberichte: [
    { id: 'abschluss_vorhanden', label: 'Vorhanden' },
    { id: 'abschluss_nicht_vorhanden', label: 'Nicht vorhanden' },
    { id: 'abschluss_nicht_eingefordert', label: 'Konnten nicht eingefordert werden' },
    { id: 'abschluss_andere', label: 'Andere' }
  ],
  familienanamnese: [
    { id: 'familie_unauffaellig', label: 'Unauffällig' },
    { id: 'familie_haeufung', label: 'Familiäre Häufung psychischer Erkrankungen' }
  ],
  alkoholSuchtmittel: [
    { id: 'alkohol_bier', label: 'Bier' },
    { id: 'alkohol_wein', label: 'Wein' },
    { id: 'alkohol_schnaps', label: 'Schnaps' }
  ],
  konsumHaeufigkeit: [
    { id: 'haeufigkeit_taeglich', label: 'Täglich' },
    { id: 'haeufigkeit_woechentlich', label: 'Wöchentlich' },
    { id: 'haeufigkeit_gelegentlich', label: 'Gelegentlich' }
  ],
  mengeEinheit: [
    { id: 'einheit_g', label: 'g' },
    { id: 'einheit_mg', label: 'mg' },
    { id: 'einheit_ml', label: 'ml' },
    { id: 'einheit_l', label: 'l' }
  ]
} as const;
