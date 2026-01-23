'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { ArrowRightCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function TutorialPage() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-16 pb-6">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-center whitespace-nowrap">
            Sehen Sie den <span className="text-blue-600 dark:text-blue-400">Gutachtomat</span> in Aktion
          </h1>

          <p className="text-lg text-foreground/70 leading-relaxed text-center max-w-3xl">
            Entdecken Sie hier, wie Sie einfach und schnell psychotherapeutische
            PTV3-Gutachten erstellen können. Von der Symptomauswahl bis zum fertigen Dokument.
          </p>
        </div>
      </div>

      {/* Main Tutorial Video - with blue background */}
      <section className="py-12 px-6 md:px-12 bg-gradient-to-b from-blue-200 to-blue-50 dark:from-blue-900 dark:to-blue-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-2">
            Vollständiges Tutorial
          </h2>
          <p className="text-center text-blue-600 dark:text-blue-400 mb-8">
            Schauen Sie sich hier die komplette Demonstration vom Gutachtomat an: Von der ersten Eingabe bis zum fertigen Gutachten
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-2xl border border-foreground/10">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center relative overflow-hidden">
              {/* Video Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform cursor-pointer">
                    <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-foreground/50 font-medium">Tutorial-Video</p>
                  <p className="text-foreground/30 text-sm">Vollständiger Überblick (3:45 Min.)</p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-lg text-sm font-medium text-foreground shadow-md">
                3:45
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16">
        {/* Step by Step Section */}
        <div className="mb-24">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-2">
            Schritt für Schritt Tutorial
          </h2>
          <p className="text-center text-blue-600 dark:text-blue-400 mb-12">
            Finden Sie hier heraus, wie Sie Ihr PTV3-Gutachten in vier einfachen Schritten erstellen können.
          </p>

          <div className="space-y-24">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <span className="w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">1</span>
                  Schritt 1
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4">
                  Auswahl patientenspezifischer Informationen
                </h3>
                <p className="text-foreground/70 leading-relaxed mb-6">
                  Wählen Sie die diagnostischen und patientenspezifischen Informationen einfach durch einige Klicks aus.
                  Der Gutachtomat führt Sie intuitiv durch den Prozess und bietet Ihnen alle relevanten
                  Auswahlmöglichkeiten für Ihr PTV3-Gutachten.
                </p>
                <ul className="space-y-2 text-foreground/70">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span> Symptome und Diagnosen nach ICD-10</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span> Psychopathologischer Befund nach AMDP</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Funktionale Störungsmodelle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Behandlungsziele und -pläne</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-xl border border-foreground/10">
                  <div
                    className="aspect-video rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setLightboxImage('/Tutorial-1A.png')}
                  >
                    <Image
                      src="/Tutorial-1A.png"
                      alt="Screenshot: Informationsauswahl"
                      width={800}
                      height={450}
                      className="w-full h-full object-contain bg-gray-50 dark:bg-gray-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-xl border border-foreground/10">
                  <div className="aspect-video bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950/30 dark:to-sky-900/20 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-sky-600/10 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <p className="text-foreground/40 text-sm font-medium">[Screenshot: Textgenerierung]</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <span className="w-6 h-6 bg-white text-sky-600 rounded-full flex items-center justify-center font-bold text-xs">2</span>
                  Schritt 2
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4">
                  Automatische Textgenerierung
                </h3>
                <p className="text-foreground/70 leading-relaxed mb-6">
                  Der Gutachtomat erstellt auf Basis Ihrer Eingaben ein vollständiges und formal
                  korrektes PTV3-Gutachten in wenigen Sekunden. Die Textgenerierung erfolgt
                  automatisch und in Echtzeit.
                </p>
                <ul className="space-y-2 text-foreground/70">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Vollständige Sätze durch einige Klicks generieren lassen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Echtzeit-Vorschau der Texte während der Eingabe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span> Formal korrekte PTV3-Struktur </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <span className="w-6 h-6 bg-white text-cyan-500 rounded-full flex items-center justify-center font-bold text-xs">3</span>
                  Schritt 3
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4">
                  Überprüfung generierter Texte
                </h3>
                <p className="text-foreground/70 leading-relaxed mb-6">
                  Prüfen Sie das automatisch generierte PTV3-Gutachten. Der Text kann jederzeit
                  individuell angepasst und erweitert werden, um Ihren spezifischen Anforderungen
                  zu entsprechen.
                </p>
                <ul className="space-y-2 text-foreground/70">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Individuelle Anpassungen jederzeit möglich</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Texte durch zusätzliche Detailangaben erweiterbar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Vollständige Kontrolle über Inhalte</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-xl border border-foreground/10">
                  <div className="aspect-video bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/30 dark:to-cyan-900/20 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                      </div>
                      <p className="text-foreground/40 text-sm font-medium">[Screenshot: Textüberprüfung]</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-xl border border-foreground/10">
                  <div className="aspect-video bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/30 dark:to-teal-900/20 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-teal-400/10 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-foreground/40 text-sm font-medium">[Screenshot: PDF-Download]</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-teal-400 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <span className="w-6 h-6 bg-white text-teal-400 rounded-full flex items-center justify-center font-bold text-xs">4</span>
                  Schritt 4
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4">
                  Herunterladen von PTV3-Gutachten
                </h3>
                <p className="text-foreground/70 leading-relaxed mb-6">
                  Laden Sie einfach und schnell Ihr vollständiges PTV3-Gutachten als PDF-Datei
                  herunter. Das fertige Gutachten ist sofort einsatzbereit und entspricht allen
                  aktuellen PTV3-Richtlinien.
                </p>
                <ul className="space-y-2 text-foreground/70">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Download als PDF-Datei</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>PTV3-konforme Formatierung</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Ausgedruckte Kopie direkt an Krankenkasse verschicken </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Example Output Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8 md:p-12 border border-blue-600/20">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Beispiel-Gutachten
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Sehen Sie hier ein vollständiges Beispiel-Gutachten, das mit dem Gutachtomat
                erstellt wurde. Beachten Sie die professionelle Struktur und
                präzise Formulierung.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center border-2 border-dashed border-foreground/20">
                  <div className="text-center p-4">
                    <svg className="w-16 h-16 mx-auto mb-3 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-foreground/50 font-medium mb-1">Beispiel-Gutachten</p>
                    <p className="text-foreground/30 text-sm">F33.1 - Rezidivierende Depression</p>
                  </div>
                </div>
                <p className="text-center text-foreground/60 text-sm mt-3">Seite 1 von 3</p>
              </div>

              <div className="flex flex-col justify-center space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Vollständige Symptomatik</p>
                    <p className="text-sm text-foreground/60">Alle ICD-10 relevanten Symptome dokumentiert</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">AMDP-Befunde</p>
                    <p className="text-sm text-foreground/60">Strukturierte psychopathologische Befunde</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">PTV3-Konformität</p>
                    <p className="text-sm text-foreground/60">Entspricht allen aktuellen Richtlinien</p>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Beispiel-PDF herunterladen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>

      {/* CTA Section */}
      <section className="pt-12 pb-12 px-6 md:px-12 bg-blue-200 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Bereit, loszulegen?
          </h2>
          <p className="text-foreground/70 text-lg mb-8">
            Überzeugen Sie sich selbst von der Effizienz des Gutachtomats.
            <br />
            Erstellen Sie jetzt Ihr erstes Gutachten schnell mit wenigen Klicks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/gutachten-erstellen">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer inline-flex items-center gap-3">
                PTV3-Gutachten jetzt erstellen
                <ArrowRightCircleIcon className="w-8 h-8 text-white" />
              </button>
            </Link>
            <Link href="/faqs">
              <button className="bg-white hover:bg-gray-50 text-blue-600 text-xl font-semibold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer border border-blue-200 inline-flex items-center gap-3">
                Fragen? Hier unsere FAQs
                <ArrowRightCircleIcon className="w-8 h-8 text-blue-600" />
              </button>
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

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setLightboxImage(null)}
            aria-label="Schließen"
          >
            <XMarkIcon className="w-10 h-10" />
          </button>
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightboxImage}
              alt="Vergrößertes Bild"
              width={1600}
              height={900}
              className="object-contain max-h-[90vh] w-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
