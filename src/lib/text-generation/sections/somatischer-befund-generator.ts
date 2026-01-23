/**
 * Somatischer Befund Text Generator
 *
 * Generates flowing German prose with Konjunktiv I for Chapter 3 (Kapitel 3)
 * using the new type-safe data structures with discriminated unions.
 */

import * as FormTypes from '../../core/form-types';
import * as FormLabels from '../../core/form-labels';
import { getPronounsForGender } from '../pronoun-utils';

// ============================================================================
// SOMATO1: Somatische Vorerkrankungen + Konsiliarbericht
// ============================================================================

export function generateSomato1Text(
  data: FormTypes.Somato1Data,
  geschlecht: FormTypes.Geschlecht | null
): string {
  // Return empty if no selection made yet
  if (!data.somatischeVorerkrankungen) return '';

  const pronouns = getPronounsForGender(geschlecht);
  const parts: string[] = [];

  // Somatische Vorerkrankungen (discriminated union)
  if (data.somatischeVorerkrankungen.vorhanden) {
    parts.push(`${pronouns.derDie} berichte von folgenden somatischen Vorerkrankungen: ${data.somatischeVorerkrankungen.details}`);
  } else {
    parts.push(`${pronouns.derDie} ${geschlecht === 'w' ? 'sei' : 'sei'} körperlich gesund`);
  }

  // Konsiliarbericht
  if (data.konsiliarberichtVorhanden && data.konsiliarberichtText) {
    parts.push(`Im Konsiliarbericht ${data.konsiliarberichtText}`);
  }

  return parts.join('. ') + (parts.length > 0 ? '.' : '');
}

export function constructSomato1Content(
  data: FormTypes.Somato1Data,
  geschlecht: FormTypes.Geschlecht | null
): FormTypes.ParagraphNode[] {
  const text = generateSomato1Text(data, geschlecht);
  if (!text) return [];

  return [{
    type: 'paragraph',
    text,
    id: 'somato1-content'
  }];
}

// ============================================================================
// SOMATO2: Psychopharmakologische Medikation
// ============================================================================

function formatMedikamentEntry(
  med: FormTypes.MedikamentEntry
): string {
  const parts: string[] = [];

  // Präparat name
  if (med.praeparat) {
    parts.push(med.praeparat);
  }

  // Dosierung
  if (med.dosierung !== null) {
    parts.push(`${med.dosierung} mg`);
  }

  // Einnahme seit (Dauer)
  if (med.einnahmeSeit) {
    const einheitLabel = med.einnahmeSeit.einheit
      ? FormLabels.EINNAHME_EINHEIT_LABELS[med.einnahmeSeit.einheit]
      : '';
    parts.push(`seit ${med.einnahmeSeit.wert} ${einheitLabel}`);
  }

  // Verordnung (discriminated union)
  if (med.verordnung) {
    const verordnungLabel = FormLabels.VERORDNUNG_LABELS[med.verordnung.durch];
    if (med.verordnung.durch === FormTypes.Verordnung.Sonstige) {
      parts.push(`verordnet durch ${med.verordnung.sonstigeText || 'Sonstige'}`);
    } else {
      parts.push(`verordnet durch ${verordnungLabel}`);
    }
  }

  return parts.join(' ');
}

export function generateSomato2Text(
  data: FormTypes.Somato2Data,
  geschlecht: FormTypes.Geschlecht | null
): string {
  const pronouns = getPronounsForGender(geschlecht);

  if (data.keineMedikation) {
    return `${pronouns.derDie} nehme keine psychopharmakologische Medikation ein.`;
  }

  if (data.medikamente.length === 0) {
    return '';
  }

  // Single medication
  if (data.medikamente.length === 1) {
    const medText = formatMedikamentEntry(data.medikamente[0]);
    return `${pronouns.derDie} nehme ${medText} ein.`;
  }

  // Multiple medications
  const medTexts = data.medikamente
    .filter(med => med.praeparat)
    .map(med => formatMedikamentEntry(med));

  if (medTexts.length === 0) return '';

  const lastMed = medTexts.pop();
  return `${pronouns.derDie} nehme ${medTexts.join(', ')} sowie ${lastMed} ein.`;
}

export function constructSomato2Content(
  data: FormTypes.Somato2Data,
  geschlecht: FormTypes.Geschlecht | null
): FormTypes.ParagraphNode[] {
  const text = generateSomato2Text(data, geschlecht);
  if (!text) return [];

  return [{
    type: 'paragraph',
    text,
    id: 'somato2-medikation'
  }];
}

// ============================================================================
// SOMATO3: Psychotherapeutische/psychosomatische/psychiatrische Vorbehandlungen
// ============================================================================

function formatVorbehandlungEntry(
  vorb: FormTypes.VorbehandlungEntry
): string {
  const parts: string[] = [];

  // Art der Vorbehandlung
  if (vorb.art) {
    const artLabel = FormLabels.VORBEHANDLUNG_ART_LABELS[vorb.art];
    parts.push(artLabel.toLowerCase() + 'e');
  }

  // Setting
  if (vorb.setting) {
    const settingLabel = FormLabels.VORBEHANDLUNG_SETTING_LABELS[vorb.setting];
    parts.push(settingLabel.toLowerCase() + ' Behandlung');
  }

  // Zeitraum
  if (vorb.zeitraum.textBeschreibung) {
    parts.push(`(${vorb.zeitraum.textBeschreibung})`);
  } else if (vorb.zeitraum.von || vorb.zeitraum.bis) {
    const vonStr = vorb.zeitraum.von
      ? new Date(vorb.zeitraum.von).toLocaleDateString('de-DE', { month: '2-digit', year: 'numeric' })
      : '';
    const bisStr = vorb.zeitraum.bis
      ? new Date(vorb.zeitraum.bis).toLocaleDateString('de-DE', { month: '2-digit', year: 'numeric' })
      : '';
    if (vonStr && bisStr) {
      parts.push(`von ${vonStr} bis ${bisStr}`);
    } else if (vonStr) {
      parts.push(`seit ${vonStr}`);
    }
  }

  // Ort
  if (vorb.ort) {
    parts.push(`in ${vorb.ort}`);
  }

  return parts.join(' ');
}

export function generateSomato3Text(
  data: FormTypes.Somato3Data,
  geschlecht: FormTypes.Geschlecht | null
): string {
  const pronouns = getPronounsForGender(geschlecht);
  const sentences: string[] = [];

  if (data.keineVorbehandlung) {
    sentences.push(`${pronouns.derDie} habe keine psychotherapeutischen, psychosomatischen oder psychiatrischen Vorbehandlungen durchlaufen`);
  } else if (data.vorbehandlungen.length > 0) {
    const vorbTexts = data.vorbehandlungen
      .filter(v => v.art || v.setting || v.ort)
      .map(v => formatVorbehandlungEntry(v));

    if (vorbTexts.length === 1) {
      sentences.push(`${pronouns.derDie} habe ${vorbTexts[0]} in Anspruch genommen`);
    } else if (vorbTexts.length > 1) {
      const lastVorb = vorbTexts.pop();
      sentences.push(`${pronouns.derDie} habe ${vorbTexts.join(', ')} sowie ${lastVorb} in Anspruch genommen`);
    }

    // Abschlussberichte
    const abschlussberichte = data.vorbehandlungen
      .filter(v => v.abschlussberichte)
      .map(v => {
        if (!v.abschlussberichte) return null;
        return FormLabels.ABSCHLUSSBERICHTE_STATUS_LABELS[v.abschlussberichte].toLowerCase();
      })
      .filter(Boolean);

    if (abschlussberichte.length > 0) {
      sentences.push(`Abschlussberichte seien ${abschlussberichte[0]}`);
    }
  }

  // Aktuelle Behandlung
  if (data.aktuelleBehandlung !== null) {
    if (data.aktuelleBehandlung) {
      sentences.push(`Aktuell befinde sich ${pronouns.er.toLowerCase()} in psychotherapeutischer Behandlung`);
    } else {
      sentences.push(`Aktuell befinde sich ${pronouns.er.toLowerCase()} nicht in psychotherapeutischer Behandlung`);
    }
  }

  // Zusatztext
  if (data.zusatztext) {
    sentences.push(data.zusatztext);
  }

  return sentences.join('. ') + (sentences.length > 0 ? '.' : '');
}

export function constructSomato3Content(
  data: FormTypes.Somato3Data,
  geschlecht: FormTypes.Geschlecht | null
): FormTypes.ParagraphNode[] {
  const text = generateSomato3Text(data, geschlecht);
  if (!text) return [];

  return [{
    type: 'paragraph',
    text,
    id: 'somato3-vorbehandlungen'
  }];
}

// ============================================================================
// SOMATO4: Familienanamnese
// ============================================================================

export function generateSomato4Text(
  data: FormTypes.Somato4Data,
  geschlecht: FormTypes.Geschlecht | null
): string {
  // Return empty if no selection made yet
  if (!data.familienanamnese) return '';

  const pronouns = getPronounsForGender(geschlecht);

  if (data.familienanamnese.unauffaellig) {
    return `Die Familienanamnese sei unauffällig.`;
  }

  if (data.familienanamnese.details) {
    return `Zur Familienanamnese berichte ${pronouns.er.toLowerCase()}: ${data.familienanamnese.details}.`;
  }

  return '';
}

export function constructSomato4Content(
  data: FormTypes.Somato4Data,
  geschlecht: FormTypes.Geschlecht | null
): FormTypes.ParagraphNode[] {
  const text = generateSomato4Text(data, geschlecht);
  if (!text) return [];

  return [{
    type: 'paragraph',
    text,
    id: 'somato4-familienanamnese'
  }];
}

// ============================================================================
// SOMATO5: Suchtanamnese
// ============================================================================

function formatHaeufigkeit(h: FormTypes.Haeufigkeit): string {
  if (h.typ === FormTypes.KonsumHaeufigkeit.Andere) {
    return h.text || 'gelegentlich';
  }
  return FormLabels.KONSUM_HAEUFIGKEIT_LABELS[h.typ].toLowerCase();
}

function formatAlkoholKonsum(data: FormTypes.AlkoholData): string {
  const parts: string[] = [];

  for (const konsum of data.konsumArten) {
    const artLabel = FormLabels.ALKOHOL_ART_LABELS[konsum.art];
    const mengeTeile: string[] = [];

    if (konsum.mengeLiter !== null && konsum.mengeLiter > 0) {
      mengeTeile.push(`${konsum.mengeLiter} Liter`);
    }
    if (konsum.mengeGlaeser !== null && konsum.mengeGlaeser > 0) {
      mengeTeile.push(`${konsum.mengeGlaeser} Gläser`);
    }

    if (mengeTeile.length > 0) {
      parts.push(`${artLabel} (${mengeTeile.join(' bzw. ')})`);
    } else {
      parts.push(artLabel);
    }
  }

  const haeufigkeit = formatHaeufigkeit(data.haeufigkeit);
  return parts.length > 0
    ? `trinke ${haeufigkeit} ${parts.join(', ')}`
    : '';
}

function formatNikotinKonsum(data: FormTypes.NikotinKonsum[]): string {
  const parts: string[] = [];

  for (const nikotin of data) {
    const formLabel = FormLabels.NIKOTIN_FORM_LABELS[nikotin.form];

    switch (nikotin.form) {
      case FormTypes.NikotinForm.Zigaretten:
        if (nikotin.anzahlProTag !== null) {
          parts.push(`${nikotin.anzahlProTag} ${formLabel} pro Tag`);
        } else {
          parts.push(formLabel);
        }
        break;
      case FormTypes.NikotinForm.Snus:
        if (nikotin.portionenProTag !== null) {
          parts.push(`${nikotin.portionenProTag} Portionen ${formLabel} pro Tag`);
        } else {
          parts.push(formLabel);
        }
        break;
      case FormTypes.NikotinForm.Schnupftabak:
        if (nikotin.mengeProTag) {
          parts.push(`${nikotin.mengeProTag} ${formLabel} pro Tag`);
        } else {
          parts.push(formLabel);
        }
        break;
      case FormTypes.NikotinForm.Vape:
        if (nikotin.mlProTag !== null) {
          parts.push(`${nikotin.mlProTag} ml Vape-Liquid pro Tag`);
        } else {
          parts.push(formLabel);
        }
        break;
    }
  }

  return parts.length > 0 ? `rauche ${parts.join(', ')}` : '';
}

function formatTHCKonsum(data: FormTypes.THCData): string {
  const parts: string[] = ['konsumiere THC'];

  if (data.mengeGramm !== null) {
    parts.push(`(ca. ${data.mengeGramm} g)`);
  }

  parts.push(formatHaeufigkeit(data.haeufigkeit));

  return parts.join(' ');
}

function formatIllegaleDrogen(data: FormTypes.IllegaleDrogenEntry[]): string {
  const entries = data
    .filter(d => d.suchtmittel)
    .map(d => {
      const parts = [d.suchtmittel];
      if (d.menge !== null) {
        const einheitLabel = FormLabels.MENGE_EINHEIT_LABELS[d.mengeEinheit];
        parts.push(`(${d.menge} ${einheitLabel})`);
      }
      parts.push(formatHaeufigkeit(d.haeufigkeit));
      return parts.join(' ');
    });

  if (entries.length === 0) return '';

  return `konsumiere ${entries.join(', ')}`;
}

function formatMedikamentenMissbrauch(data: FormTypes.MedikamentenMissbrauchEntry[]): string {
  const entries = data
    .filter(d => d.substanz)
    .map(d => {
      const parts = [d.substanz];
      if (d.menge !== null) {
        const einheitLabel = FormLabels.MENGE_EINHEIT_LABELS[d.mengeEinheit];
        parts.push(`(${d.menge} ${einheitLabel})`);
      }
      parts.push(formatHaeufigkeit(d.haeufigkeit));
      return parts.join(' ');
    });

  if (entries.length === 0) return '';

  return `missbrauche Medikamente: ${entries.join(', ')}`;
}

export function generateSomato5Text(
  data: FormTypes.Somato5Data,
  geschlecht: FormTypes.Geschlecht | null
): string {
  // Return empty if no selection made yet
  if (!data.suchtanamnese) return '';

  const pronouns = getPronounsForGender(geschlecht);

  // Handle discriminated union
  if (data.suchtanamnese.keineSucht) {
    return `${pronouns.derDie} gebe an, keine Suchtmittel zu konsumieren.`;
  }

  const konsum = data.suchtanamnese.konsum;
  const sentences: string[] = [];

  // Alkohol
  if (konsum.alkohol) {
    const alkoholText = formatAlkoholKonsum(konsum.alkohol);
    if (alkoholText) {
      sentences.push(`${pronouns.derDie} ${alkoholText}`);
    }
  }

  // Nikotin
  if (konsum.nikotin && konsum.nikotin.length > 0) {
    const nikotinText = formatNikotinKonsum(konsum.nikotin);
    if (nikotinText) {
      sentences.push(`${pronouns.er} ${nikotinText}`);
    }
  }

  // THC
  if (konsum.thc) {
    const thcText = formatTHCKonsum(konsum.thc);
    if (thcText) {
      sentences.push(`${pronouns.er} ${thcText}`);
    }
  }

  // Illegale Drogen
  if (konsum.illegaleDrogen.length > 0) {
    const illegalText = formatIllegaleDrogen(konsum.illegaleDrogen);
    if (illegalText) {
      sentences.push(`${pronouns.er} ${illegalText}`);
    }
  }

  // Medikamenten-Missbrauch
  if (konsum.medikamentenMissbrauch.length > 0) {
    const missbrauchText = formatMedikamentenMissbrauch(konsum.medikamentenMissbrauch);
    if (missbrauchText) {
      sentences.push(`${pronouns.er} ${missbrauchText}`);
    }
  }

  // Andere Suchtform
  if (konsum.andereSuchtform) {
    sentences.push(`Weitere Suchtformen: ${konsum.andereSuchtform}`);
  }

  // Zusatztext
  if (konsum.zusatztext) {
    sentences.push(konsum.zusatztext);
  }

  if (sentences.length === 0) {
    return '';
  }

  return sentences.join('. ') + '.';
}

export function constructSomato5Content(
  data: FormTypes.Somato5Data,
  geschlecht: FormTypes.Geschlecht | null
): FormTypes.ParagraphNode[] {
  const text = generateSomato5Text(data, geschlecht);
  if (!text) return [];

  return [{
    type: 'paragraph',
    text,
    id: 'somato5-suchtanamnese'
  }];
}

// ============================================================================
// COMBINED: Full Kapitel 3 Generator
// ============================================================================

export interface SomatischerBefundData {
  somato1: FormTypes.Somato1Data;
  somato2: FormTypes.Somato2Data;
  somato3: FormTypes.Somato3Data;
  somato4: FormTypes.Somato4Data;
  somato5: FormTypes.Somato5Data;
  geschlecht: FormTypes.Geschlecht | null;
}

export function generateSomatischerBefundText(data: SomatischerBefundData): string {
  const sections: string[] = [];

  const somato1Text = generateSomato1Text(data.somato1, data.geschlecht);
  if (somato1Text) sections.push(somato1Text);

  const somato2Text = generateSomato2Text(data.somato2, data.geschlecht);
  if (somato2Text) sections.push(somato2Text);

  const somato3Text = generateSomato3Text(data.somato3, data.geschlecht);
  if (somato3Text) sections.push(somato3Text);

  const somato4Text = generateSomato4Text(data.somato4, data.geschlecht);
  if (somato4Text) sections.push(somato4Text);

  const somato5Text = generateSomato5Text(data.somato5, data.geschlecht);
  if (somato5Text) sections.push(somato5Text);

  return sections.join('\n\n');
}

export function constructSomatischerBefundContent(
  data: SomatischerBefundData
): FormTypes.ParagraphNode[] {
  const lines: string[] = [];

  // Somato1: Somatische Vorerkrankungen - no label, appears directly after chapter title
  const somato1Text = generateSomato1Text(data.somato1, data.geschlecht);
  if (somato1Text) {
    lines.push(somato1Text);
  }

  // Somato2: Medikation - with bold inline label
  const somato2Text = generateSomato2Text(data.somato2, data.geschlecht);
  if (somato2Text) {
    lines.push(`**Medikation:** ${somato2Text}`);
  }

  // Somato3: Vorbehandlungen - with bold inline label
  const somato3Text = generateSomato3Text(data.somato3, data.geschlecht);
  if (somato3Text) {
    lines.push(`**Vorbehandlungen:** ${somato3Text}`);
  }

  // Somato4: Familienanamnese - with bold inline label
  const somato4Text = generateSomato4Text(data.somato4, data.geschlecht);
  if (somato4Text) {
    lines.push(`**Familienanamnese:** ${somato4Text}`);
  }

  // Somato5: Suchtanamnese - with bold inline label
  const somato5Text = generateSomato5Text(data.somato5, data.geschlecht);
  if (somato5Text) {
    lines.push(`**Suchtanamnese:** ${somato5Text}`);
  }

  if (lines.length === 0) {
    return [];
  }

  // Join all lines with markdown line breaks (two spaces + newline)
  return [{
    type: 'paragraph',
    text: lines.join('  \n'),
    id: 'somatischer-befund-content'
  }];
}
