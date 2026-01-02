// Generates educational background clauses for sentence combiner

import * as FormTypes from '../../core/form-types';
import { Clause, createClause } from '../sentence-combiner';

// Constructs clauses for Bildungsweg (educational path)
export function constructBildungswegClauses(
  bildungsweg: FormTypes.Bildungsweg | null
): Clause[] {
  if (!bildungsweg) return [];

  const clauses: Clause[] = [];
  let priority = 2; // Start after age (1)

  // Schulabschluss
  if (bildungsweg.schulabschluss) {
    const schulabschlussLabels: Record<FormTypes.Schulabschluss, string> = {
      [FormTypes.Schulabschluss.Hauptschule]: 'den Hauptschulabschluss',
      [FormTypes.Schulabschluss.MittlereReife]: 'die Mittlere Reife',
      [FormTypes.Schulabschluss.Abitur]: 'das Abitur',
      [FormTypes.Schulabschluss.KeinAbschluss]: '',
    };

    const abschluss = schulabschlussLabels[bildungsweg.schulabschluss];

    if (bildungsweg.schulabschluss === FormTypes.Schulabschluss.KeinAbschluss) {
      clauses.push(createClause('habe keinen Schulabschluss erworben', 'education', priority++));
    } else if (abschluss) {
      clauses.push(createClause(`habe ${abschluss} erworben`, 'education', priority++));
    }
  }

  // Berufsausbildung
  if (bildungsweg.berufsausbildung !== null) {
    const profession = bildungsweg.berufsausbildung.als;
    const status = bildungsweg.berufsausbildung.status;

    if (profession && status) {
      switch (status) {
        case FormTypes.AusbildungStatus.Laufend:
          clauses.push(createClause(`absolviere derzeit eine Berufsausbildung als ${profession}`, 'education', priority++));
          break;
        case FormTypes.AusbildungStatus.Abgeschlossen:
          clauses.push(createClause(`habe eine Berufsausbildung als ${profession} abgeschlossen`, 'education', priority++));
          break;
        case FormTypes.AusbildungStatus.Abgebrochen:
          clauses.push(createClause(`habe eine Berufsausbildung als ${profession} begonnen, diese jedoch abgebrochen`, 'education', priority++));
          break;
      }
    } else if (profession) {
      clauses.push(createClause(`habe eine Berufsausbildung als ${profession} absolviert`, 'education', priority++));
    } else if (status) {
      switch (status) {
        case FormTypes.AusbildungStatus.Laufend:
          clauses.push(createClause('absolviere derzeit eine Berufsausbildung', 'education', priority++));
          break;
        case FormTypes.AusbildungStatus.Abgeschlossen:
          clauses.push(createClause('habe eine Berufsausbildung abgeschlossen', 'education', priority++));
          break;
        case FormTypes.AusbildungStatus.Abgebrochen:
          clauses.push(createClause('habe eine Berufsausbildung begonnen, diese jedoch abgebrochen', 'education', priority++));
          break;
      }
    }
  }

  // Studium
  if (bildungsweg.studium !== null) {
    const subject = bildungsweg.studium.fach;
    const status = bildungsweg.studium.status;

    if (subject && status) {
      switch (status) {
        case FormTypes.StudiumStatus.Laufend:
          clauses.push(createClause(`studiere derzeit ${subject}`, 'education', priority++));
          break;
        case FormTypes.StudiumStatus.Abgeschlossen:
          clauses.push(createClause(`habe ein Studium in ${subject} abgeschlossen`, 'education', priority++));
          break;
        case FormTypes.StudiumStatus.Abgebrochen:
          clauses.push(createClause(`habe ein Studium in ${subject} begonnen, dieses jedoch abgebrochen`, 'education', priority++));
          break;
      }
    } else if (subject) {
      clauses.push(createClause(`habe ${subject} studiert`, 'education', priority++));
    } else if (status) {
      switch (status) {
        case FormTypes.StudiumStatus.Laufend:
          clauses.push(createClause('studiere derzeit', 'education', priority++));
          break;
        case FormTypes.StudiumStatus.Abgeschlossen:
          clauses.push(createClause('habe ein Studium abgeschlossen', 'education', priority++));
          break;
        case FormTypes.StudiumStatus.Abgebrochen:
          clauses.push(createClause('habe ein Studium begonnen, dieses jedoch abgebrochen', 'education', priority++));
          break;
      }
    }
  }

  // Promotion
  if (bildungsweg.promotion !== null) {
    const subject = bildungsweg.promotion.fach;
    const status = bildungsweg.promotion.status;

    if (subject && status) {
      switch (status) {
        case FormTypes.PromotionStatus.Laufend:
          clauses.push(createClause(`promoviere derzeit in ${subject}`, 'education', priority++));
          break;
        case FormTypes.PromotionStatus.Abgeschlossen:
          clauses.push(createClause(`habe in ${subject} promoviert`, 'education', priority++));
          break;
        case FormTypes.PromotionStatus.Abgebrochen:
          clauses.push(createClause(`habe eine Promotion in ${subject} begonnen, diese jedoch abgebrochen`, 'education', priority++));
          break;
      }
    } else if (subject) {
      clauses.push(createClause(`habe in ${subject} promoviert`, 'education', priority++));
    } else if (status) {
      switch (status) {
        case FormTypes.PromotionStatus.Laufend:
          clauses.push(createClause('promoviere derzeit', 'education', priority++));
          break;
        case FormTypes.PromotionStatus.Abgeschlossen:
          clauses.push(createClause('habe promoviert', 'education', priority++));
          break;
        case FormTypes.PromotionStatus.Abgebrochen:
          clauses.push(createClause('habe eine Promotion begonnen, diese jedoch abgebrochen', 'education', priority++));
          break;
      }
    }
  }

  return clauses;
}
