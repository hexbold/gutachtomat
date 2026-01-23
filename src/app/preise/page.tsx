import Link from 'next/link';
import { CheckIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';

export default function PreisePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 leading-relaxed">
            Wählen Sie hier das passende Modell für<br />Ihre PTV3-Gutachtenerstellung.
          </h1>
        </div>

        {/* Alle Pakete beinhalten */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 border-2 border-blue-600 dark:border-blue-400">
            <h3 className="text-lg md:text-xl font-bold text-foreground text-center mb-4">Alle Pakete beinhalten:</h3>
            <div className="grid grid-cols-3 gap-x-8 gap-y-3 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-foreground/70">
              <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>Alle Funktionen</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/70">
              <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>KI-gestützter Feinschliff</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/70">
              <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>PDF-Export</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/70">
              <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>PTV3-Gutachten</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/70">
              <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>Speicheroptionen</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/70">
              <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>DSGVO-Konformität</span>
            </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto">

          {/* Approbierte Psychotherapeuten */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-6">
              Approbierte Psychotherapeut:innen
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* 1 Monat */}
              <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-blue-900/50">
                <div className="text-center mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">1-Monats-Abo</h3>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    25 €
                  </div>
                  <div className="text-foreground/60">pro Monat</div>
                </div>
                <div className="text-center text-foreground/70 mb-6">
                  <span className="text-lg font-medium">5 Berichte</span> inklusive
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all cursor-pointer">
                  Abo auswählen
                </button>
              </div>

              {/* 3 Monate */}
              <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-lg border-2 border-blue-500 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-sm font-semibold py-1 px-4 rounded-full">
                  Beliebt
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">3-Monats-Abo</h3>
                  <div className="relative flex justify-center">
                    <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">60 €</span>
                    <span className="absolute left-[calc(50%+3rem)] top-1/2 -translate-y-1/2 text-2xl text-foreground/50">
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-full h-0.5 bg-foreground/50 rotate-[-12deg]"></span>
                      </span>
                      75 €
                    </span>
                  </div>
                  <div className="text-foreground/60">für 3 Monate</div>
                </div>
                <div className="text-center text-foreground/70 mb-6">
                  <span className="text-lg font-medium">15 Berichte</span> inklusive
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all cursor-pointer">
                  Abo auswählen
                </button>
              </div>
            </div>
          </div>

          {/* PiAs */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
              Psychotherapeut:innen in Ausbildung (PiAs)
            </h2>
            <p className="text-center text-foreground/60 mb-6">Vergünstigte Preise mit Nachweis</p>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* 1 Monat PiA */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 shadow-lg border border-purple-200 dark:border-purple-800/50">
                <div className="text-center mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">1-Monats-Abo</h3>
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                    20 €
                  </div>
                  <div className="text-foreground/60">pro Monat</div>
                </div>
                <div className="text-center text-foreground/70 mb-6">
                  <span className="text-lg font-medium">5 Berichte</span> inklusive
                </div>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all cursor-pointer">
                  Abo auswählen
                </button>
              </div>

              {/* 3 Monate PiA */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 shadow-lg border-2 border-purple-500 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-sm font-semibold py-1 px-4 rounded-full">
                  Beliebt
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">3-Monats-Abo</h3>
                  <div className="relative flex justify-center">
                    <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">40 €</span>
                    <span className="absolute left-[calc(50%+3rem)] top-1/2 -translate-y-1/2 text-2xl text-foreground/50">
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-full h-0.5 bg-foreground/50 rotate-[-12deg]"></span>
                      </span>
                      60 €
                    </span>
                  </div>
                  <div className="text-foreground/60">für 3 Monate</div>
                </div>
                <div className="text-center text-foreground/70 mb-6">
                  <span className="text-lg font-medium">15 Berichte</span> inklusive
                </div>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all cursor-pointer">
                  Abo auswählen
                </button>
              </div>
            </div>
          </div>

          {/* Einzelne Pakete */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-6">
              Einzelne Pakete
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* 1 Bericht */}
              <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">1 Bericht</h3>
                  <div className="text-4xl font-bold text-gray-700 dark:text-gray-300">
                    7 €
                  </div>
                  <div className="text-foreground/60">einmalig</div>
                </div>
                <div className="text-center text-foreground/70 mb-6">
                  Kein Abo erforderlich
                </div>
                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all cursor-pointer">
                  Bericht kaufen
                </button>
              </div>

              {/* 3 Berichte */}
              <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">3 Berichte</h3>
                  <div className="relative flex justify-center">
                    <span className="text-4xl font-bold text-gray-700 dark:text-gray-300">20 €</span>
                    <span className="absolute left-[calc(50%+3rem)] top-1/2 -translate-y-1/2 text-2xl text-foreground/50">
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-full h-0.5 bg-foreground/50 rotate-[-12deg]"></span>
                      </span>
                      21 €
                    </span>
                  </div>
                  <div className="text-foreground/60">einmalig</div>
                </div>
                <div className="text-center text-foreground/70 mb-6">
                  Kein Abo erforderlich
                </div>
                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all cursor-pointer">
                  Paket kaufen
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Free Trial Banner */}
        <div className="max-w-3xl mx-auto mt-12 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-5 md:p-6 text-white text-center shadow-lg">
            <div className="text-2xl font-bold mb-2">7 Tage den Gutachtomaten kostenlos testen</div>
            <p className="text-white/90 mb-3">
              Testen Sie alle Funktionen und erstellen Sie kostenlos drei PTV3-Gutachten innerhalb 7 Tage!
            </p>
            <Link href="/gutachten-erstellen">
              <button className="bg-white text-green-600 font-semibold py-2 px-5 rounded-lg hover:bg-green-50 transition-all cursor-pointer inline-flex items-center gap-2">
                Jetzt kostenlos starten
                <ArrowRightCircleIcon className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

      </div>

      {/* FAQ Section */}
      <section className="py-12 px-6 md:px-12 bg-blue-200 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Fragen zu den Preisen?
          </h2>
          <p className="text-foreground/70 mb-6">
            Schauen Sie in unsere FAQ oder kontaktieren Sie uns direkt.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/faqs" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 font-semibold py-3 px-6 rounded-xl border border-foreground/10 transition-all shadow-sm hover:shadow-md cursor-pointer">
              FAQ ansehen
              <ArrowRightCircleIcon className="w-5 h-5" />
            </Link>
            <Link href="/kontakt" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer">
              Kontakt aufnehmen
              <ArrowRightCircleIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

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
