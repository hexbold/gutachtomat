'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRightCircleIcon, ClockIcon, StarIcon, CheckCircleIcon, ClipboardDocumentListIcon, AdjustmentsHorizontalIcon, LockClosedIcon, AcademicCapIcon, BookOpenIcon, BuildingOffice2Icon, ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export default function Ueber() {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 scroll-smooth">

      {/* Hero Section */}
      <section className="relative py-14 flex items-center justify-center overflow-hidden">
        <div className="text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Über den </span>
            <span className="text-blue-600 dark:text-blue-400">Gutachtomat</span>
          </h1>
          <p className="text-lg text-blue-600 dark:text-blue-400 font-bold max-w-4xl mx-auto">
            Praxisnah. Effizient. Automatisiert. Einfach Gutachtomat.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative">

        {/* Intro Section */}
        <section id="intro" className="pt-1 pb-10 px-6 md:px-12 scroll-mt-20">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-3">
              Unser Ziel
            </h2>
            <p className="text-foreground/70 text-base md:text-lg leading-relaxed text-justify hyphens-auto" lang="de">
              Willkommen bei Gutachtomat, einer spezialisierten Software zur automatisierten Erstellung von psychotherapeutischen Gutachten nach PTV3 für
              approbierte Psychotherapeut:innen sowie Psychotherapeut:innen in Ausbildung (PiAs) in Deutschland – mit Fokus auf
              Verhaltenstherapie für Erwachsene. Unser Tool unterstützt Sie dabei, PTV3-Gutachten mit wenigen Klicks schnell, vollständig und datenschutzkonform
              zu erstellen. Ideal für Praxisalltag und Ausbildung.
            </p>
          </div>
        </section>

        {/* How it works - Full width alternating background */}
        <section className="py-12 px-6 md:px-12 bg-gradient-to-b from-blue-200 to-blue-50 dark:from-blue-900 dark:to-blue-800">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                Wie funktioniert der Gutachtomat?
              </h2>
              <p className="text-blue-600 dark:text-blue-400 text-lg">In wenigen Klicks schnell ein vollständiges PTV3-Gutachten erstellen</p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1: Selection */}
              <div className="relative bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg pt-10 pb-6 px-6 border border-blue-100 dark:border-blue-900/50">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-md">1</span>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 text-center">
                  Auswahl von Patienteninformationen
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed text-justify hyphens-auto mb-4" lang="de">
                  Wählen Sie einfach und schnell alle relevanten patientenbezogenen Informationen aus. Der Gutachtomat führt dabei
                  Schritt für Schritt durch sämtliche Bereiche, die in den PTV3-Richtlinien vorgesehen sind –
                  von der Soziodemographie über Symptomatik und Befunde bis hin zum Behandlungsplan.
                </p>
                <button
                  onClick={() => setDetailsOpen(!detailsOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${detailsOpen ? 'rotate-180' : ''}`} />
                  {detailsOpen ? 'Details ausblenden' : 'Klicken Sie hier für weitere Details.'}
                </button>
                <div className={`grid grid-cols-1 gap-1.5 overflow-hidden transition-all duration-300 ${detailsOpen ? 'mt-4 max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  {[
                    'Soziodemographische Daten',
                    'Symptome und Diagnosen nach ICD-10',
                    'Psychopathologischer Befund nach AMDP',
                    'Somatischer Befund und Konsiliarbericht',
                    'Lebensgeschichte und Krankheitsanamnese',
                    'Spezifische Störungsmodelle',
                    'Vulnerabilitäts-, Auslöse- und Aufrechterhaltungsfaktoren',
                    'Behandlungsplan und Therapieziele'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-foreground/70">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Generation */}
              <div className="relative bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg pt-10 pb-6 px-6 border border-blue-100 dark:border-blue-900/50">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-cyan-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-md">2</span>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 text-center">
                  Automatische
                  <br />
                  Textgenerierung
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed text-justify hyphens-auto" lang="de">
                  Auf Basis Ihrer patientenspezifischen Eingaben erstellt der Gutachtomat in wenigen Sekunden ein vollständiges und formal korrektes PTV3-Gutachten.
                  Der fertige Gutachtentext kann jederzeit individuell angepasst und erweitert werden.
                </p>
              </div>

              {/* Step 3: Export */}
              <div className="relative bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg pt-10 pb-6 px-6 border border-blue-100 dark:border-blue-900/50">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-md">3</span>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 text-center">
                  Gutachten als
                  <br />
                  PDF-Datei exportieren
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed text-justify hyphens-auto" lang="de">
                  Exportieren Sie Ihr fertiges PTV3-Gutachten als PDF-Datei und reichen Sie es direkt bei der Krankenkasse für den Antrag auf ambulante Psychotherapie ein.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Target audience */}
        <section className="py-12 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                Für wen ist der Gutachtomat gedacht?
              </h2>
              <p className="text-blue-600 dark:text-blue-400 text-lg">Von der Ausbildung bis zur Niederlassung – und darüber hinaus</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <AcademicCapIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
                  title: 'Approbierte Psychotherapeut:innen',
                  desc: 'Psychologische und ärztliche Psychotherapeut:innen mit Approbation',
                  benefits: [
                    'Zeitersparnis im Praxisalltag',
                    'Mehr Zeit für therapeutische Arbeit',
                    'Professionelle Gutachtentexte mit wenigen Klicks'
                  ]
                },
                {
                  icon: <BookOpenIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
                  title: 'PiAs',
                  desc: 'Psychotherapeut:innen in Ausbildung',
                  benefits: [
                    'Lernunterstützung bei der Gutachtenerstellung',
                    'Orientierung an fachlichen Standards',
                    'Arbeitsentlastung während der anspruchsvollen Ausbildung'
                  ]
                },
                {
                  icon: <BuildingOffice2Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
                  title: 'Institutionen',
                  desc: 'Praxen, Ambulanzen und Ausbildungsinstitute',
                  benefits: [
                    'Einheitliche Qualitätsstandards',
                    'Arbeitsentlastung für Supervisor:innen und Leiter:innen',
                    'Zentrale Lösung für mehrere Therapeut:innen'
                  ]
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="group h-56 [perspective:1000px]"
                >
                  <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Vorderseite */}
                    <div className="absolute inset-0 bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg p-8 border border-blue-100 dark:border-blue-900/50 [backface-visibility:hidden]">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-3xl">{item.icon}</span>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">{item.title}</h3>
                      </div>
                      <p className="text-lg text-foreground/60">{item.desc}</p>
                      <ArrowRightCircleIcon className="absolute bottom-4 right-4 w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    {/* Rückseite */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl shadow-lg pt-4 px-6 pb-6 border border-blue-500 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 -ml-1">
                        <span className="w-5 flex-shrink-0">{item.icon}</span>
                        Ihre Vorteile
                      </h3>
                      <ul className="space-y-3">
                        {item.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2 text-white/90">
                            <CheckIcon className="w-5 h-5 text-blue-200 mt-0.5 flex-shrink-0" />
                            <span className="text-base">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits - Full width */}
        <section className="py-12 px-6 md:px-12 bg-gradient-to-b from-blue-200 to-blue-50 dark:from-blue-900 dark:to-blue-800">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-white mb-4">
                Ihre Vorteile
              </h2>
              <p className="text-blue-700 dark:text-blue-100 text-lg">Wie der Gutachtomat Sie bei Ihrer Arbeit als Psychotherapeut:in unterstützt</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[
                { icon: <ClockIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />, title: 'Zeitersparend', desc: 'Keine stundenlange und aufwendige Gutachtenerstellung mehr bei hoher fachlicher Qualität. ' },
                { icon: <StarIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />, title: 'Professionell', desc: 'Fachliche, klare und strukturierte Gutachtentexte nach PTV3.' },
                { icon: <CheckCircleIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />, title: 'Einfach', desc: 'Einfache und selbsterklärende Benutzung des Tools mit Tutorial.' },
                { icon: <ClipboardDocumentListIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />, title: 'Dokumentationssicher', desc: 'Vollständige und inhaltlich konsistente Textgenerierung mit allen relevanten PTV3-Bereichen.' },
                { icon: <AdjustmentsHorizontalIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />, title: 'Individuell anpassbar', desc: 'Der generierte Gutachtentext kann jederzeit frei bearbeitet, angepasst und erweitert werden.' },
                { icon: <LockClosedIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />, title: 'DSGVO-konform', desc: 'Zertifizierte und sichere Verarbeitung sensibler Patientendaten nach DSGVO-Vorschriften.' }
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-200 dark:border-blue-700 hover:bg-white/90 dark:hover:bg-slate-800/70 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-lg text-blue-700 dark:text-blue-300 font-bold">{item.title}</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-base">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission statement */}
        <section className="py-12 px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">
              Fokus zurück auf Psychotherapie
            </h2>
            <p className="text-foreground/70 text-lg leading-relaxed text-justify hyphens-auto" lang="de">
              Unser intelligentes Tool verfolgt ein zentrales Ziel: Psychotherapeut:innen von bürokratischem Aufwand zu entlasten.
              Anstatt mehrere Stunden mit formalen Anforderungen zu verbringen, soll wieder mehr Fokus auf die wesentliche Arbeit
              gelenkt werden – die therapeutische Arbeit mit den Patient:innen selbst. Mehr Raum für das, was wirklich zählt:
              die Behandlung psychischer Erkrankungen und die Verbesserung der Lebensqualität von Menschen, die Hilfe suchen und bekommen.
            </p>
          </div>
        </section>

        {/* Important notice */}
        <section className="pb-12 px-6 md:px-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-amber-50 dark:bg-amber-900/30 rounded-2xl shadow-lg p-6 md:p-8 border-2 border-amber-200 dark:border-amber-700/50">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">⚠️</span>
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-stone-900 dark:text-blue-400">
                    Wichtiger Hinweis
                  </h2>
                </div>
                <p className="text-foreground/70 text-base leading-relaxed text-justify hyphens-auto" lang="de">
                  Die automatische Gutachtengenerierung dient als Arbeitserleichterung und Prozessoptimierung, nicht als Ersatz für die fachliche Einschätzung.
                  Es bleibt entscheidend, jedes Gutachten individuell zu prüfen, inhaltlich zu reflektieren und verantwortungsvoll anzupassen.
                  Kurzum: Unser Tool soll Sie unterstützen – nicht um die therapeutische Verantwortung zu mindern, sondern um die eigene Zeit und Ressourcen
                  auf das Wesentliche zu fokussieren.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 px-6 md:px-12 bg-blue-200 dark:bg-slate-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Bereit, loszulegen?
            </h2>
            <p className="text-foreground/70 text-lg mb-8">
              Überzeugen Sie sich selbst von der Effizienz des Gutachtomats.
              <br />
              Erstellen Sie jetzt Ihr erstes Gutachten schnell mit wenigen Klicks.
            </p>
            <Link href="/gutachten-erstellen">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer inline-flex items-center gap-3">
                PTV3-Gutachten jetzt erstellen
                <ArrowRightCircleIcon className="w-8 h-8 text-white" />
              </button>
            </Link>
          </div>
        </section>

      </main>

      <footer className="bg-white dark:bg-slate-800 px-8 md:px-12 py-4 text-blue-600 dark:text-blue-400 text-base">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-5 md:gap-7 flex-wrap">
          <span className="font-medium">Copyright © 2025 Gutachtomat</span>
          <Link href="/nutzungsbedingungen" className="hover:underline">Nutzungsbedingungen</Link>
          <Link href="/datenschutz" className="hover:underline">Datenschutz</Link>
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
