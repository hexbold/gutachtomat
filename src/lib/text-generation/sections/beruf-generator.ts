import * as FormTypes from '../../core/form-types';
import { Clause, createClause } from '../sentence-combiner';
import { constructFamilyStatusClauses } from './family-status-generator';

// Formats duration into German text
function formatDauer(dauer: FormTypes.Dauer | null): string {
  if (!dauer) return '';

  const parts: string[] = [];

  if (dauer.jahre > 0) {
    parts.push(dauer.jahre === 1 ? '1 Jahr' : `${dauer.jahre} Jahren`);
  }
  if (dauer.monate > 0) {
    parts.push(dauer.monate === 1 ? '1 Monat' : `${dauer.monate} Monaten`);
  }
  if (dauer.wochen > 0) {
    parts.push(dauer.wochen === 1 ? '1 Woche' : `${dauer.wochen} Wochen`);
  }
  if (dauer.tage > 0) {
    parts.push(dauer.tage === 1 ? '1 Tag' : `${dauer.tage} Tagen`);
  }

  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts.join(' und ');

  // For 3 or more parts: "X, Y und Z"
  return parts.slice(0, -1).join(', ') + ' und ' + parts[parts.length - 1];
}

// Constructs clauses for profession and family status
export function constructBerufClauses(
  berufData: FormTypes.BerufStatus,
  familienstand: FormTypes.FamilienstandField,
  anzahlKinder: number | null,
  kinder: FormTypes.KindDetails[]
): Clause[] {
  // Get family status clauses
  const familyStatusClauses = constructFamilyStatusClauses(familienstand, anzahlKinder, kinder);

  // STEP 1: Check what content we have
  const beschaeftigung = berufData.beschaeftigung;
  const hasBerufsbezeichnung = beschaeftigung !== null && beschaeftigung.berufsbezeichnung.trim().length > 0;
  // Discriminated union: arbeitslosigkeit.arbeitslos is true or false
  const hasArbeitslos = berufData.arbeitslosigkeit.arbeitslos;
  // Discriminated union: rente.berentet is true or false
  const hasRente = berufData.rente.berentet;

  if (beschaeftigung === null && !hasArbeitslos && !hasRente && familyStatusClauses.length === 0) {
    return [];
  }

  const result: Clause[] = [];
  let priority = 4; // Job/family priority starts at 4

  // STEP 2: Build the main profession clause
  if (beschaeftigung !== null) {
    let text = 'sei';

    if (hasBerufsbezeichnung) {
      text += ` ${beschaeftigung.berufsbezeichnung} von Beruf`;
    }

    const anstellungsartLabel =
      beschaeftigung.anstellungsart === FormTypes.Anstellungsart.Vollzeit ? 'in Vollzeit' :
      beschaeftigung.anstellungsart === FormTypes.Anstellungsart.Teilzeit ? 'in Teilzeit' :
      beschaeftigung.anstellungsart === FormTypes.Anstellungsart.MiniJob ? 'in einem Mini-Job' :
      '';

    if (anstellungsartLabel) {
      if (hasBerufsbezeichnung) {
        text += ` ${anstellungsartLabel}`;
      } else {
        text += ` beschäftigt ${anstellungsartLabel}`;
      }
    }

    result.push(createClause(text, 'job', priority));
    priority += 0.1;
  }

  // STEP 3: Add family status clauses
  result.push(...familyStatusClauses);

  // STEP 4: Add unemployment clause if present (discriminated union narrowing)
  if (berufData.arbeitslosigkeit.arbeitslos) {
    const duration = formatDauer(berufData.arbeitslosigkeit.dauer);

    if (duration) {
      result.push(createClause(`sei seit ${duration} arbeitslos`, 'job', priority));
    } else {
      result.push(createClause('sei arbeitslos', 'job', priority));
    }
    priority += 0.1;
  }

  // STEP 5: Add retirement clause if present (discriminated union narrowing)
  if (berufData.rente.berentet) {
    const duration = formatDauer(berufData.rente.dauer);

    if (duration) {
      result.push(createClause(`sei seit ${duration} in Rente`, 'job', priority));
    } else {
      result.push(createClause('sei in Rente', 'job', priority));
    }
  }

  return result;
}
