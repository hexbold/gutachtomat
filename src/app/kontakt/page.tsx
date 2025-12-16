import Link from 'next/link';

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Kontakt
          </h1>
          <p className="text-lg text-foreground/70 leading-relaxed">
            Haben Sie Fragen oder möchten Sie mehr über den Gutachtomat erfahren?
            Unser Team steht Ihnen gerne zur Verfügung und unterstützt Sie bei allen Anliegen
            rund um die automatisierte Gutachtenerstellung.
          </p>
        </div>

        {/* Technical Support Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-lg border border-foreground/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-blue-600/10 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Technischer Support</h2>
                <p className="text-foreground/60 text-sm">Wir helfen Ihnen bei allen technischen Fragen</p>
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground/60 mb-1">E-Mail</p>
                  <a
                    href="mailto:support@ptv3gutachtomat.de"
                    className="text-foreground text-lg font-medium hover:text-blue-600 transition-colors"
                  >
                    support@ptv3gutachtomat.de
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground/60 mb-1">Telefon</p>
                  <a
                    href="tel:+4930123456700"
                    className="text-foreground text-lg font-medium hover:text-blue-600 transition-colors"
                  >
                    +49 30 123 456 700
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground/60 mb-1">Erreichbarkeit</p>
                  <p className="text-foreground text-lg font-medium">
                    Montag - Freitag, 9:00 - 17:00 Uhr
                  </p>
                  <p className="text-foreground/60 text-sm mt-1">
                    Antwortzeit: In der Regel innerhalb von 24 Stunden
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ / Quick Help Section */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-2xl p-8 md:p-12 border border-blue-600/20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Schnelle Hilfe benötigt?
            </h2>
            <p className="text-foreground/70 mb-8 leading-relaxed">
              Bevor Sie uns kontaktieren, werfen Sie einen Blick in unsere FAQ-Sektion
              oder die Dokumentation. Viele häufige Fragen werden dort bereits beantwortet.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-foreground font-semibold py-3 px-6 rounded-xl border border-foreground/10 transition-all shadow-sm hover:shadow-md cursor-pointer">
                FAQ ansehen
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer">
                Dokumentation
              </button>
            </div>
          </div>
        </div>
      </div>

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
