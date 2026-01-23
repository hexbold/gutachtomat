/**
 * Krankheitsanamnese Text Generator
 *
 * Generates flowing prose (Fließtext) for the Krankheitsanamnese section
 * by concatenating all non-empty text fields.
 */

import { Krankheitsanamnese, ParagraphNode } from '@/lib/core/form-types';
import { ensurePunctuation } from '../text-utils';

/**
 * Constructs structured content for Krankheitsanamnese data
 * Concatenates all non-empty fields as Fließtext (flowing prose)
 */
export function constructKrankheitsanamneseContent(data: Krankheitsanamnese): ParagraphNode[] {
  const parts: string[] = [];

  const fields = [
    data.anhaltendeBelastungssituation,
    data.akuteBelastungssituation,
    data.krisensituation,
    data.situationAndere,
    data.erstauftretenSymptome,
    data.beginnAktuelleSymptome,
    data.dauerAktuelleSymptome,
    data.verlaufAktuelleSymptome,
    data.ausloeserVergangenheit,
    data.ausloeserAktuell,
  ];

  for (const field of fields) {
    if (field?.trim()) {
      parts.push(ensurePunctuation(field));
    }
  }

  if (parts.length === 0) return [];

  return [{
    type: 'paragraph',
    text: parts.join(' '),
    id: 'krankheitsanamnese'
  }];
}
