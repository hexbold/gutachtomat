'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, InformationCircleIcon, Cog6ToothIcon, CurrencyEuroIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const faqCategories = [
    {
      category: 'Allgemeines',
      icon: InformationCircleIcon,
      faqs: [
        {
          question: 'Was ist der Gutachtomat?',
          answer: 'Der Gutachtomat ist eine spezialisierte Software zur automatisierten Erstellung von psychotherapeutischen Gutachten nach PTV3-Richtlinien mit Schwerpunkt Verhaltenstherapie in Deutschland.'
        },
        {
          question: 'Für welche Antragsarten wird der Gutachtomat verwendet?',
          answer: 'Der Gutachtomat BerichtBiber unterstützt Sie bei der Erstellung von Erst-, Fortführungs- und Umwandlungsanträgen nach dem PTV3-Verfahren.'
        },
        {
          question: 'Für wen ist der Gutachtomat geeignet?',
          answer: 'Der Gutachtomat richtet sich an approbierte Psychotherapeut:innen, Psychotherapeut:innen in Ausbildung (PiAs) sowie Institutionen wie Praxen, Ambulanzen und Ausbildungsinstitute.'
        }
      ]
    },
    {
      category: 'Funktionen',
      icon: Cog6ToothIcon,
      faqs: [
        {
          question: 'Wie funktioniert die Gutachtenerstellung?',
          answer: 'Sie wählen einfach die relevanten patientenbezogenen Informationen aus, der Gutachtomat generiert automatisch ein vollständiges PTV3-Gutachten, das Sie als PDF exportieren können.'
        },
        {
          question: 'Kann ich das generierte Gutachten bearbeiten?',
          answer: 'Ja, der generierte Gutachtentext kann individuell angepasst und erweitert werden, bevor Sie ihn als PDF exportieren.'
        }
      ]
    },
    {
      category: 'Kosten und Abonnement',
      icon: CurrencyEuroIcon,
      faqs: [
        {
          question: 'Was kostet der Gutachtomat?',
          answer: 'Informationen zu unseren Preisen und Abonnementmodellen finden Sie auf unserer Preisseite oder kontaktieren Sie uns direkt.'
        },
        {
          question: 'Gibt es eine kostenlose Testversion?',
          answer: 'Ja, Sie können den Gutachtomat eine Woche kostenlos testen, um sich von der Funktionalität und Effektivität zu überzeugen.'
        }
      ]
    },
    {
      category: 'Datenschutz',
      icon: ShieldCheckIcon,
      faqs: [
        {
          question: 'Ist der Gutachtomat DSGVO-konform?',
          answer: 'Ja, der Gutachtomat verarbeitet alle sensiblen Patientendaten nach DSGVO-Vorschriften mit zertifizierten und sicheren Verarbeitungsmethoden.'
        },
        {
          question: 'Wo werden meine Daten gespeichert?',
          answer: 'Alle Daten werden auf sicheren Servern in Deutschland gespeichert und unterliegen den strengen deutschen Datenschutzgesetzen.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900">

      {/* Hero Section */}
      <section className="relative py-16 flex items-center justify-center overflow-hidden">
        <div className="text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            Häufig gestellte Fragen
          </h1>
          <p className="text-xl text-foreground/70">
            Alles, was Sie über den Gutachtomaten wissen müssen
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <main className="px-6 md:px-12 pb-16">
        <div className="max-w-3xl mx-auto">
          {faqCategories.map((category, catIndex) => (
            <div key={catIndex} className="mb-10">
              <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                <category.icon className="w-6 h-6" />
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const uniqueKey = `${catIndex}-${faqIndex}`;
                  return (
                    <div
                      key={uniqueKey}
                      className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900/50 overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenIndex(openIndex === uniqueKey ? null : uniqueKey)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer"
                      >
                        <span className="text-lg font-semibold text-foreground">{faq.question}</span>
                        <ChevronDownIcon
                          className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform duration-200 flex-shrink-0 ml-4 ${
                            openIndex === uniqueKey ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          openIndex === uniqueKey ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p className="px-6 pb-5 text-foreground/70 leading-relaxed text-justify hyphens-auto" lang="de">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <p className="text-foreground/70 text-lg mb-6">
              Haben Sie weitere Fragen? Kontaktieren Sie uns gerne.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/kontakt">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer inline-flex items-center gap-2">
                  Kontakt aufnehmen
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/gutachten-erstellen">
                <button className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl border border-blue-200 dark:border-blue-800 cursor-pointer">
                  Gutachten erstellen
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 px-8 md:px-12 py-4 text-blue-600 dark:text-blue-400 text-base">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-5 md:gap-7 flex-wrap">
          <span className="font-medium">Copyright © 2025 Gutachtomat</span>
          <Link href="/nutzungsbedingungen" className="hover:underline">Nutzungsbedingungen</Link>
          <Link href="/datenschutz" className="hover:underline">Datenschutz</Link>
          <Link href="/impressum" className="hover:underline">Impressum</Link>
        </div>
      </footer>
    </div>
  );
}
