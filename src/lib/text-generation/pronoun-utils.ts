// Pronoun utilities for German psychological reports

export interface GenderPronouns {
  // Subject pronouns (Nominativ)
  er: string;          // "Er" / "Sie" / "Die Person"
  sie: string;         // "Sie" (always "Sie" in formal reports)

  // Formal patient reference
  derDie: string;      // "Der Patient" / "Die Patientin" / "Die Person"
  patient: string;     // "Patient" / "Patientin" / "Person"
  seiDerDie: string;   // "sei der Patient" / "sei die Patientin" (for temporal markers)

  // Possessive pronouns
  sein: string;        // "sein" / "ihr" / "das"
  seine: string;       // "seine" / "ihre" / "die"
  seiner: string;      // "seiner" / "ihrer" / "deren"
  seinem: string;      // "seinem" / "ihrem" / "deren"
  seinen: string;      // "seinen" / "ihren" / "deren"

  // Object pronouns (Akkusativ)
  ihn: string;         // "ihn" / "sie" / "die Person"

  // Dative pronouns
  ihm: string;         // "ihm" / "ihr" / "der Person"
}

// Returns appropriate pronouns based on gender ID
export function getPronounsForGender(geschlechtId: string | null): GenderPronouns {
  switch (geschlechtId) {
    case 'm': // Männlich (male)
      return {
        er: 'Er',
        sie: 'Sie',
        derDie: 'Der Patient',
        patient: 'Patient',
        seiDerDie: 'sei der Patient',
        sein: 'sein',
        seine: 'seine',
        seiner: 'seiner',
        seinem: 'seinem',
        seinen: 'seinen',
        ihn: 'ihn',
        ihm: 'ihm',
      };

    case 'w': // Weiblich (female)
      return {
        er: 'Sie',
        sie: 'Sie',
        derDie: 'Die Patientin',
        patient: 'Patientin',
        seiDerDie: 'sei die Patientin',
        sein: 'ihr',
        seine: 'ihre',
        seiner: 'ihrer',
        seinem: 'ihrem',
        seinen: 'ihren',
        ihn: 'sie',
        ihm: 'ihr',
      };

    case 'd': // Divers - defaults to masculine form (standard in German professional documents)
    case null:
    default:
      return {
        er: 'Er',
        sie: 'Sie',
        derDie: 'Der Patient',
        patient: 'Patient',
        seiDerDie: 'sei der Patient',
        sein: 'sein',
        seine: 'seine',
        seiner: 'seiner',
        seinem: 'seinem',
        seinen: 'seinen',
        ihn: 'ihn',
        ihm: 'ihm',
      };
  }
}

// @deprecated Use getPronounsForGender() for full pronoun support
export function getPatientPronoun(geschlechtId: string | null): string {
  const pronouns = getPronounsForGender(geschlechtId);
  return pronouns.derDie;
}
