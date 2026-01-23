/**
 * Text Generator for Kapitel 6: Behandlungsplan, Therapieziele und Prognose
 *
 * Generates structured text for:
 * - Therapieziele (goals from Berner Inventar)
 * - Behandlungsplan (disorder-specific interventions)
 * - Begründung des Settings (therapy form, sessions, setting, mitbehandler)
 * - Prognose (günstige/ungünstige factors, eingeschätzte prognose)
 */

import * as Labels from '../../core/form-labels';
import * as FormTypes from '../../core/form-types';
import { getFormattedAllBehandlungsplan } from '../../utils/behandlungsplan-counter';
import {
  getFormattedGuenstigeFaktoren,
  getFormattedUnguenstigeFaktoren,
} from '../../utils/prognose-counter';
import {
  getFormattedProblemBewaeltigung,
  getFormattedSelbstbezogen,
  getFormattedWohlbefinden,
  getFormattedZwischenmenschlich,
} from '../../utils/therapieziele-counter';
import { getPronounsForGender } from '../pronoun-utils';

// ============================================================================
// THERAPIEZIELE GENERATION
// ============================================================================

function generateTherapiezieleText(
  therapieziele: FormTypes.TherapiezieleData,
  pronouns: ReturnType<typeof getPronounsForGender>
): string {
  const lines: string[] = [];

  // Collect all goals
  const problemBewaeltigung = getFormattedProblemBewaeltigung(therapieziele.problemBewaeltigung);
  const zwischenmenschlich = getFormattedZwischenmenschlich(therapieziele.zwischenmenschlich);
  const wohlbefinden = getFormattedWohlbefinden(therapieziele.wohlbefinden);
  const selbstbezogen = getFormattedSelbstbezogen(therapieziele.selbstbezogen);

  const allGoals = [
    ...problemBewaeltigung,
    ...zwischenmenschlich,
    ...wohlbefinden,
    ...selbstbezogen,
  ];

  if (allGoals.length === 0) {
    return '';
  }

  lines.push('**Therapieziele:**');
  lines.push('Als gemeinsame Therapieziele wurden die folgenden Unterziele vereinbart:');

  // Number the goals
  allGoals.forEach((goal, index) => {
    lines.push(`(${index + 1}) ${pronouns.derDie} kann ${goal.toLowerCase()};`);
  });

  return lines.join('  \n');
}

// ============================================================================
// BEHANDLUNGSPLAN GENERATION
// ============================================================================

function generateBehandlungsplanText(
  behandlungsplan: FormTypes.BehandlungsplanData
): string {
  const interventions = getFormattedAllBehandlungsplan(behandlungsplan);

  if (interventions.length === 0) {
    return '';
  }

  const lines: string[] = [];
  lines.push('**Behandlungsplan:**');
  lines.push('Als übergeordnete Behandlungselemente sind die folgenden Interventionen richtungsweisend:');

  interventions.forEach((intervention) => {
    lines.push(`• ${intervention}`);
  });

  return lines.join('  \n');
}

// ============================================================================
// BEGRÜNDUNG SETTING GENERATION
// ============================================================================

function generateBegruendungText(
  begruendung: FormTypes.BegruendungSettingData
): string {
  // Build the main sentence parts
  const parts: string[] = [];

  // Anzahl Sitzungen
  if (begruendung.anzahlSitzungen) {
    if (begruendung.anzahlSitzungen === FormTypes.AnzahlSitzungen.Andere && begruendung.anzahlSitzungenAndere) {
      parts.push(`${begruendung.anzahlSitzungenAndere} Einzelsitzungen`);
    } else {
      const sitzungenLabel = Labels.ANZAHL_SITZUNGEN_LABELS[begruendung.anzahlSitzungen];
      parts.push(`${sitzungenLabel.replace(' Sitzungen', '')} Einzelsitzungen`);
    }
  }

  // Setting
  if (begruendung.setting) {
    const settingLabel = Labels.THERAPIE_SETTING_LABELS[begruendung.setting];
    parts.push(settingLabel);
  }

  // Therapieform
  if (begruendung.therapieform) {
    if (begruendung.therapieform === FormTypes.TherapieformSetting.Kurzzeittherapie) {
      parts.push('im Rahmen einer Kurzzeittherapie');
    } else {
      parts.push('im Rahmen einer Langzeittherapie');
    }
  }

  // Mitbehandler
  const mitbehandlerList: string[] = [];
  for (const [key, entry] of Object.entries(begruendung.mitbehandler)) {
    if (entry?.selected) {
      const label = Labels.MITBEHANDLER_LABELS[key as FormTypes.Mitbehandler];
      mitbehandlerList.push(label);
    }
  }

  if (begruendung.mitbehandlerAndere?.trim()) {
    mitbehandlerList.push(begruendung.mitbehandlerAndere.trim());
  }

  const hasBegruendungstext = begruendung.begruendungstext?.trim();

  // Check if there's any content to output
  if (parts.length === 0 && mitbehandlerList.length === 0 && !hasBegruendungstext) {
    return '';
  }

  // Build output with heading
  const lines: string[] = [];
  lines.push('**Begründung des Settings und Kooperation mit Mitbehandlern:**');

  if (parts.length > 0) {
    lines.push(`Zunächst sollen ${parts.join(' ')} durchgeführt werden.`);
  }

  if (mitbehandlerList.length > 0) {
    lines.push(`Die Kooperation mit ${mitbehandlerList.length === 1 ? 'dem mitbehandelnden' : 'den mitbehandelnden'} ${mitbehandlerList.join(' und ')} soll über Kontaktaufnahme und Befundberichte sichergestellt werden.`);
  }

  if (hasBegruendungstext) {
    lines.push(begruendung.begruendungstext.trim());
  }

  return lines.join('\n');
}

// ============================================================================
// PROGNOSE GENERATION
// ============================================================================

function generatePrognoseText(
  prognose: FormTypes.PrognoseData
): string {
  // Günstige Faktoren
  const guenstige = getFormattedGuenstigeFaktoren(prognose.guenstigeFaktoren);
  if (prognose.guenstigeFaktorenAndere?.trim()) {
    guenstige.push(prognose.guenstigeFaktorenAndere.trim());
  }

  // Ungünstige Faktoren
  const unguenstige = getFormattedUnguenstigeFaktoren(prognose.unguenstigeFaktoren);
  if (prognose.unguenstigeFaktorenAndere?.trim()) {
    unguenstige.push(prognose.unguenstigeFaktorenAndere.trim());
  }

  const hasEinschaetzung = prognose.eingeschaetztePrognose;
  const hasPrognosetextFrei = prognose.prognosetextFrei?.trim();

  // Check if there's any content to output
  if (guenstige.length === 0 && unguenstige.length === 0 && !hasEinschaetzung && !hasPrognosetextFrei) {
    return '';
  }

  // Build prognosis text
  const prognoseParts: string[] = [];

  // Einschätzung
  if (hasEinschaetzung && prognose.eingeschaetztePrognose) {
    const einschaetzungLabel = Labels.EINGESCHAETZTE_PROGNOSE_LABELS[prognose.eingeschaetztePrognose];
    prognoseParts.push(`Die Prognose erscheint insgesamt ${einschaetzungLabel.toLowerCase()}.`);
  }

  // Günstige Faktoren
  if (guenstige.length > 0) {
    if (guenstige.length === 1) {
      prognoseParts.push(`Als prognostisch günstiger Faktor ist ${guenstige[0].toLowerCase()} zu nennen.`);
    } else {
      const last = guenstige.pop();
      prognoseParts.push(`Als prognostisch günstige Faktoren sind ${guenstige.map(g => g.toLowerCase()).join(', ')} sowie ${last?.toLowerCase()} zu nennen.`);
    }
  }

  // Ungünstige Faktoren
  if (unguenstige.length > 0) {
    if (unguenstige.length === 1) {
      prognoseParts.push(`Als prognostisch ungünstiger Faktor ist ${unguenstige[0].toLowerCase()} zu berücksichtigen.`);
    } else {
      const last = unguenstige.pop();
      prognoseParts.push(`Als prognostisch ungünstige Faktoren sind ${unguenstige.map(u => u.toLowerCase()).join(', ')} sowie ${last?.toLowerCase()} zu berücksichtigen.`);
    }
  }

  // Build output with heading
  const lines: string[] = [];
  lines.push('**Prognose:**');

  if (prognoseParts.length > 0) {
    lines.push(prognoseParts.join(' '));
  }

  // Additional text
  if (hasPrognosetextFrei) {
    lines.push(prognose.prognosetextFrei.trim());
  }

  return lines.join('\n');
}

// ============================================================================
// MAIN EXPORTS
// ============================================================================

/**
 * Generates structured content for Kapitel 6
 */
export function generateKapitel6Content(formData: FormTypes.Form): FormTypes.ParagraphNode[] {
  const content: FormTypes.ParagraphNode[] = [];
  const pronouns = getPronounsForGender(formData.geschlecht);
  const kapitel6 = formData.kapitel6;

  // 1. Therapieziele
  const therapiezieleText = generateTherapiezieleText(kapitel6.therapieziele, pronouns);
  if (therapiezieleText) {
    content.push({ type: 'paragraph', text: therapiezieleText });
  }

  // 2. Behandlungsplan
  const behandlungsplanText = generateBehandlungsplanText(kapitel6.behandlungsplan);
  if (behandlungsplanText) {
    content.push({ type: 'paragraph', text: behandlungsplanText });
  }

  // 3. Begründung des Settings
  const begruendungText = generateBegruendungText(kapitel6.begruendungSetting);
  if (begruendungText) {
    content.push({ type: 'paragraph', text: begruendungText });
  }

  // 4. Prognose
  const prognoseText = generatePrognoseText(kapitel6.prognose);
  if (prognoseText) {
    content.push({ type: 'paragraph', text: prognoseText });
  }

  return content;
}

/**
 * Generates plain text for Kapitel 6
 * @deprecated Use generateKapitel6Content for structured output
 */
export function generateKapitel6Text(formData: FormTypes.Form): string {
  const content = generateKapitel6Content(formData);

  // Convert paragraph nodes to text with double line breaks between paragraphs
  return content
    .map(node => node.text)
    .filter(Boolean)
    .join('\n\n');
}
