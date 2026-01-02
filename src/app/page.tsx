import Link from 'next/link';
import { LockClosedIcon, BoltIcon, ClipboardDocumentCheckIcon, AdjustmentsHorizontalIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import AnimatedSteps from '@/components/AnimatedSteps';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900">
      <div className="w-full flex flex-col">

        <main className="flex-1 px-12 pt-12 pb-20">
          {/* Hero Section */}
          <div className="max-w-5xl mx-auto text-center space-y-8 mb-20">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="text-blue-600 dark:text-blue-400 text-6xl md:text-7xl">Gutachtomat</span>
              <span className="block text-foreground text-4xl md:text-5xl mt-4">Psychotherapeutische Gutachten</span>
              <span className="text-foreground text-4xl md:text-5xl mt-2"> automatisch erstellen.</span>
            </h2>
            <p className="block text-xl text-blue-600 dark:text-blue-400 font-bold -mt-2 max-w-4xl mx-auto">
              Praxisnah. Effizient. Automatisiert. Einfach Gutachtomat.
            </p>

            <p className="text-xl text-foreground/70 leading-relaxed max-w-4xl mx-auto">
              Erstellen Sie hier vollständige und fachliche PTV3 Gutachten mit Schwerpunkt Verhaltenstherapie für Erwachsene. 
              Wählen Sie einfach die relevanten patientenspezifischen Informationen aus. Der Gutachtomat generiert Ihnen automatisch ein vollständiges PTV3-Gutachten.
              
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/gutachten-erstellen">
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer inline-flex items-center gap-3">
                  PTV3-Gutachten jetzt erstellen
                  <ArrowRightCircleIcon className="w-8 h-8 text-white" />
                </button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-12">
            Ihre Vorteile durch den Gutachtomaten:
          </h3>
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3 mb-20">
            <div className="p-6 rounded-2xl bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <BoltIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-bold text-foreground">Zeitersparnis</h3>
              </div>
              <p className="text-foreground/70 leading-relaxed text-justify hyphens-auto break-words overflow-hidden" lang="de">
                Reduzieren Sie den Zeitaufwand für die Gutachtenerstellung um bis zu 80% durch die automatisierte Textgenerierung. Keine stundenlange Gutachtenerstellung mehr – Fokus zurück auf die Therapie.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <AdjustmentsHorizontalIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-bold text-foreground"> Patientenspezifisch</h3>
              </div>
              <p className="text-foreground/70 leading-relaxed text-justify hyphens-auto break-words overflow-hidden" lang="de">
                Passen Sie jedes Gutachten individuell an Ihre Patient:innen an - mit einer umfassenden Symptomauflistung, Krankheitsanamnese, Lebensgeschichte, Behandlungsplänen und -zielen.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <ClipboardDocumentCheckIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-bold text-foreground">PTV3-konform</h3>
              </div>
              <p className="text-foreground/70 leading-relaxed text-justify hyphens-auto break-words overflow-hidden" lang="de">
                Die Inhalte und Struktur des Gutachtomaten entsprechen den aktuellen Richtlinien von PTV3-Gutachten für den Antrag auf ambulante Psychotherapien an die geseztlichen Krankenkassen.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <LockClosedIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-bold text-foreground">DSGVO-konform</h3>
              </div>
              <p className="text-foreground/70 leading-relaxed text-justify hyphens-auto break-words overflow-hidden" lang="de">
                Zertifizierte und sichere Verarbeitung sensibler Patientendaten nach DSGVO Vorschriften.
              </p>
            </div>
          </div>

          {/* How it Works */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-12">
              So funktioniert der Gutachtomat:
            </h3>
            <AnimatedSteps />
            

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-20">
              <Link href="/gutachten-erstellen">
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer inline-flex items-center gap-3">
                  PTV3-Gutachten jetzt erstellen
                  <ArrowRightCircleIcon className="w-8 h-8 text-white" />
                </button>
              </Link>
            </div>
          </div>
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
    </div>
  );
}
