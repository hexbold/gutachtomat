import * as FormTypes from '@/lib/core/form-types';

export interface SymptomHandlers {
  onSymptomToggle: (value: string) => void;
  onAndereSymptomeChange: (value: string) => void;
}

export interface BaseSubsectionProps {
  formData: FormTypes.Form;
  onFieldChange: (field: keyof FormTypes.Form, value: string) => void;
  expansionState: FormTypes.SectionExpansionState;
  onSectionToggle: (section: keyof FormTypes.SectionExpansionState) => void;
}

export interface ExpandableSubsectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  level?: number;
}
