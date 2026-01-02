import * as FormTypes from '../../core/form-types';
import { constructTherapyContent, constructTreatmentContent } from './therapy-generator';
import { constructApplicationContent } from './application-generator';

// Constructs Kapitel 6: Behandlungsplan und Prognose
export function generateKapitel6Content(formData: FormTypes.Form): FormTypes.ParagraphNode[] {
  const content: FormTypes.ParagraphNode[] = [];

  // 1. Application Type (Antragsart)
  if (formData.antragsart) {
    content.push(...constructApplicationContent(formData.antragsart));
  }

  // 2. Therapy Form(s) (Therapieform)
  // Note: therapieform is stored as a single string in Form, but the generator
  // expects an array. We convert it to an array if it exists.
  if (formData.therapieform) {
    const therapieIds = formData.therapieform ? [formData.therapieform] : [];
    content.push(...constructTherapyContent(therapieIds));
  }

  // 3. Treatment Form(s) (Behandlungsform)
  // Note: behandlungsform is stored as a single string in Form, but the generator
  // expects an array. We convert it to an array if it exists.
  if (formData.behandlungsform) {
    const behandlungIds = formData.behandlungsform ? [formData.behandlungsform] : [];
    content.push(...constructTreatmentContent(behandlungIds));
  }

  return content;
}

// @deprecated Use generateKapitel6Content for structured output
export function generateKapitel6Text(formData: FormTypes.Form): string {
  const content = generateKapitel6Content(formData);

  // Convert paragraph nodes to text with double line breaks between paragraphs
  return content
    .map(node => node.text)
    .filter(Boolean)
    .join('\n\n');
}
