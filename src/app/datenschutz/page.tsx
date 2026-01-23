'use client';

import Link from 'next/link';

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 scroll-smooth">

      {/* Hero Section */}
      <section className="relative py-14 flex items-center justify-center overflow-hidden">
        <div className="text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-blue-600 dark:text-blue-400">Datenschutzerklärung</span>
          </h1>
          <p className="text-lg text-foreground/70">
            Stand: Januar 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative pb-16">
        <div className="max-w-4xl mx-auto px-6 md:px-12">

          {/* Disclaimer Banner */}
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-8">
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              <strong>Hinweis:</strong> Diese Datenschutzerklärung befindet sich noch in der Entwurfsphase und wurde noch nicht abschließend juristisch geprüft.
              Wir arbeiten daran, diese so bald wie möglich finalisieren zu lassen. Bei Fragen wenden Sie sich bitte an uns.
            </p>
          </div>

          {/* Content Sections */}
          <div className="prose prose-slate dark:prose-invert max-w-none">

            {/* 1. Allgemeines */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">1. Allgemeines</h2>
              <p className="text-foreground/80 leading-relaxed text-justify hyphens-auto" lang="de">
                Der Schutz Ihrer personenbezogenen Daten ist uns ein wichtiges Anliegen. In dieser Datenschutzerklärung
                informieren wir Sie über die Verarbeitung Ihrer Daten bei der Nutzung unseres Dienstes Gutachtomat.
              </p>
              <p className="text-foreground/80 leading-relaxed text-justify hyphens-auto mt-4" lang="de">
                Gutachtomat ist ein webbasiertes Werkzeug, das Psychotherapeuten bei der Erstellung von PTV3-Berichten
                für Krankenkassen unterstützt. Der Dienst ist kein Medizinprodukt im Sinne der Medical Device Regulation
                (MDR) und dient ausschließlich als Textverarbeitungshilfe.
              </p>
              <p className="text-foreground/80 leading-relaxed mt-4">
                Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
              </p>
              <p className="text-foreground/80 leading-relaxed mt-2 italic">
                [Name und Anschrift des Verantwortlichen]<br />
                [E-Mail-Adresse]
              </p>
            </section>

            {/* 2. Erhebung und Verarbeitung */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">2. Erhebung und Verarbeitung personenbezogener Daten</h2>

              <h3 className="text-lg md:text-xl font-semibold text-foreground mt-6 mb-3">2.1 Daten bei der Registrierung</h3>
              <p className="text-foreground/80 leading-relaxed text-justify hyphens-auto" lang="de">
                Bei der Erstellung eines Benutzerkontos erheben wir folgende Daten:
              </p>
              <ul className="list-disc list-inside text-foreground/80 mt-2 space-y-1">
                <li>E-Mail-Adresse</li>
                <li>Name (sofern angegeben)</li>
                <li>Passwort in verschlüsselter Form</li>
              </ul>
              <p className="text-foreground/80 leading-relaxed text-justify hyphens-auto mt-4" lang="de">
                Diese Daten sind erforderlich, um Ihnen den Zugang zum Dienst zu ermöglichen und Ihr Konto zu verwalten.
                Die Rechtsgrundlage für diese Verarbeitung ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
              </p>

              <h3 className="text-lg md:text-xl font-semibold text-foreground mt-6 mb-3">2.2 Daten bei der Nutzung des Dienstes</h3>
              <p className="text-foreground/80 leading-relaxed text-justify hyphens-auto" lang="de">
                Bei der Erstellung von PTV3-Berichten geben Sie Informationen in verschiedene Formularfelder ein.
                Es liegt in Ihrer Verantwortung als Nutzer, sicherzustellen, dass Sie keine direkt identifizierenden
                Patientendaten eingeben. Wir empfehlen dringend, ausschließlich pseudonymisierte Daten zu verwenden
                (z.B. &quot;Patient A&quot; oder Chiffren statt Klarnamen).
              </p>
              <p className="text-foreground/80 leading-relaxed text-justify hyphens-auto mt-4" lang="de">
                Die von Ihnen eingegebenen Daten werden in unserer Datenbank gespeichert. Die Datenbank ist durch
                Verschlüsselung im Ruhezustand (encryption at rest) sowie verschlüsselte Verbindungen geschützt.
              </p>

              <h3 className="text-lg md:text-xl font-semibold text-foreground mt-6 mb-3">2.3 Optionale KI-gestützte Textverbesserung</h3>
              <p className="text-foreground/80 leading-relaxed text-justify hyphens-auto" lang="de">
                Gutachtomat bietet optional die Möglichkeit, eingegebene Texte durch künstliche Intelligenz verbessern
                zu lassen. Diese Funktion ist standardmäßig deaktiviert und muss von Ihnen aktiv eingeschaltet werden.
              </p>
              <p className="text-foreground/80 leading-relaxed text-justify hyphens-auto mt-4" lang="de">
                Wenn Sie diese Funktion nutzen, werden die betreffenden Textabschnitte an den KI-Dienst Anthropic (Claude)
                übermittelt. Anthropic verarbeitet die Daten ausschließlich zur Erbringung des Dienstes und nutzt sie
                nicht für eigene Trainingszwecke. Mit Anthropic besteht ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO.
                Da Anthropic seinen Sitz in den USA hat, erfolgt die Datenübertragung auf Grundlage von EU-Standardvertragsklauseln (SCCs).
              </p>
              <p className="text-foreground/80 leading-relaxed text-justify hyphens-auto mt-4" lang="de">
                Die Nutzung der KI-Funktion setzt voraus, dass Sie ausschließlich pseudonymisierte Daten eingegeben haben.
                Durch die Aktivierung der Funktion bestätigen Sie, dass dies der Fall ist. Die Rechtsgrundlage ist
                Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
              </p>
            </section>

            {/* 3. Eingesetzte Dienstleister */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">3. Eingesetzte Dienstleister</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                Zur Bereitstellung unseres Dienstes setzen wir folgende Unterauftragnehmer ein:
              </p>

              <h3 className="text-lg md:text-xl font-semibold text-foreground mt-6 mb-3">3.1 Clerk (Authentifizierung)</h3>
              <p className="text-foreground/80 leading-relaxed text-justify hyphens-auto" lang="de">
                Für die Benutzerverwaltung und Anmeldung nutzen wir Clerk (Clerk, Inc., USA). Clerk verarbeitet Ihre
                Anmeldedaten, um einen sicheren Zugang zu ermöglichen. Die Datenübertragung in die USA erfolgt auf
                Grundlage von EU-Standardvertragsklauseln.
              </p>

              <h3 className="text-lg md:text-xl font-semibold text-foreground mt-6 mb-3">3.2 Supabase (Datenbank)</h3>
              <p className="text-foreground/80 leading-relaxed text-justify hyphens-auto" lang="de">
                Ihre Daten werden bei Supabase gespeichert. Wir nutzen einen Datenbankserver am Standort Frankfurt am Main
                (Deutschland), sodass Ihre Daten innerhalb der EU verbleiben. Supabase verschlüsselt alle Daten im
                Ruhezustand und bei der Übertragung.
              </p>

              <h3 className="text-lg md:text-xl font-semibold text-foreground mt-6 mb-3">3.3 Vercel (Hosting)</h3>
              <p className="text-foreground/80 leading-relaxed text-justify hyphens-auto" lang="de">
                Die Webseite und Anwendung wird über Vercel (Vercel, Inc., USA) bereitgestellt. Vercel verarbeitet dabei
                technisch notwendige Verbindungsdaten wie IP-Adressen. Die Datenübertragung erfolgt auf Grundlage von
                EU-Standardvertragsklauseln.
              </p>
            </section>

            {/* 4. Speicherdauer */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">4. Speicherdauer</h2>
              <p className="text-foreground/80 leading-relaxed text-justify hyphens-auto" lang="de">
                Ihre Kontodaten werden gespeichert, solange Ihr Benutzerkonto besteht. Bei Löschung Ihres Kontos werden
                alle zugehörigen Daten innerhalb von 30 Tagen gelöscht.
              </p>
              <p className="text-foreground/80 leading-relaxed text-justify hyphens-auto mt-4" lang="de">
                Die von Ihnen erstellten Berichte werden gespeichert, bis Sie diese löschen oder Ihr Konto auflösen.
              </p>
            </section>

            {/* 5. Ihre Rechte */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">5. Ihre Rechte</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                Nach der DSGVO stehen Ihnen folgende Rechte zu:
              </p>
              <ul className="space-y-3 text-foreground/80">
                <li>
                  <strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie haben das Recht, Auskunft über die von uns
                  verarbeiteten personenbezogenen Daten zu erhalten.
                </li>
                <li>
                  <strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Sie können die Berichtigung unrichtiger
                  oder die Vervollständigung unvollständiger Daten verlangen.
                </li>
                <li>
                  <strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer Daten verlangen,
                  sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
                </li>
                <li>
                  <strong>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Unter bestimmten
                  Voraussetzungen können Sie die Einschränkung der Verarbeitung verlangen.
                </li>
                <li>
                  <strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie haben das Recht, Ihre Daten
                  in einem strukturierten, gängigen Format zu erhalten.
                </li>
                <li>
                  <strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie können der Verarbeitung Ihrer Daten widersprechen.
                </li>
                <li>
                  <strong>Widerrufsrecht (Art. 7 Abs. 3 DSGVO):</strong> Eine erteilte Einwilligung können Sie jederzeit
                  mit Wirkung für die Zukunft widerrufen.
                </li>
              </ul>
              <p className="text-foreground/80 leading-relaxed mt-4">
                Zur Ausübung Ihrer Rechte wenden Sie sich bitte an die oben genannte Kontaktadresse.
              </p>
            </section>

            {/* 6. Beschwerderecht */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">6. Beschwerderecht</h2>
              <p className="text-foreground/80 leading-relaxed text-justify hyphens-auto" lang="de">
                Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer
                personenbezogenen Daten zu beschweren.
              </p>
            </section>

            {/* 7. Datensicherheit */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">7. Datensicherheit</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten vor unbefugtem Zugriff,
                Verlust oder Missbrauch zu schützen. Dazu gehören insbesondere:
              </p>
              <ul className="list-disc list-inside text-foreground/80 space-y-1">
                <li>Verschlüsselte Übertragung aller Daten mittels TLS</li>
                <li>Verschlüsselung der gespeicherten Daten durch unseren Datenbankanbieter</li>
                <li>Datenspeicherung in der EU (Frankfurt)</li>
                <li>Regelmäßige Sicherheitsupdates</li>
                <li>Zugriffsbeschränkungen auf Administratorebene</li>
              </ul>
            </section>

            {/* 8. Änderungen */}
            <section className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">8. Änderungen dieser Datenschutzerklärung</h2>
              <p className="text-foreground/80 leading-relaxed text-justify hyphens-auto" lang="de">
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte rechtliche
                Anforderungen oder Änderungen unseres Dienstes anzupassen. Die aktuelle Fassung ist stets auf
                unserer Webseite abrufbar.
              </p>
            </section>

            {/* Contact */}
            <section className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-foreground/80">
                Bei Fragen zum Datenschutz wenden Sie sich bitte an: <span className="italic">[E-Mail-Adresse]</span>
              </p>
            </section>

          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-slate-800 px-8 md:px-12 py-4 text-blue-600 dark:text-blue-400 text-base">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-5 md:gap-7 flex-wrap">
          <span className="font-medium">Copyright © 2025 Gutachtomat</span>
          <Link href="/nutzungsbedingungen" className="hover:underline">Nutzungsbedingungen</Link>
          <Link href="/datenschutz" className="hover:underline font-semibold">Datenschutz</Link>
          <Link href="/impressum" className="hover:underline">Impressum</Link>
          <div className="flex items-center gap-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 dark:hover:text-blue-300 transition-colors" aria-label="Instagram">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 dark:hover:text-blue-300 transition-colors" aria-label="Facebook">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 dark:hover:text-blue-300 transition-colors" aria-label="LinkedIn">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
