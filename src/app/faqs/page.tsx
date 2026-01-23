'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, InformationCircleIcon, Cog6ToothIcon, CurrencyEuroIcon, ShieldCheckIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const faqCategories = [
    {
      category: 'Allgemeines',
      icon: InformationCircleIcon,
      faqs: [
        {
          question: 'Was ist der Gutachtomat?',
          answer: 'Der Gutachtomat ist eine spezialisierte Software für Psychotherapeut:innen zur automatisierten Erstellung von psychotherapeutischen Gutachten nach PTV3-Richtlinien mit Schwerpunkt Verhaltenstherapie in Deutschland. Der Gutachtomat ist nach allen erforderlichen PTV3-Abschnitte strukturiert und generiert professionelle Textbausteine basierend auf Ihren Angaben.'
        },
        {
          question: 'Ersetzt der Gutachtomat die fachliche Expertise als Psychotherapeut:in?',
          answer: 'Der Gutachtomat ist ein Tool, welches Psychotherapeut:innen bei der automatischen PTV3-Gutachtenerstellung im Sinne einer Arbeitserleichterung und Prozessoptimierung unterstützt. Unser Tool gilt nicht als Ersatz für die fachliche Einschätzung: Es bleibt entscheidend, jedes Gutachten individuell zu prüfen, inhaltlich zu reflektieren und verantwortungsvoll anzupassen.'
        },
        {
          question: 'Für welche Antragsarten wird der Gutachtomat verwendet?',
          answer: 'Der Gutachtomat unterstützt Sie bei der Erstellung von Erst-, Fortführungs- und Umwandlungsanträgen nach den PTV3-Richtlinien für den Antrag für eine ambulante Psychotherapie an den Gutachter in den gesetztlichen Krankenkassen Deutschlands.'
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
          answer: 'Sie wählen einfach die relevanten patientenbezogenen Informationen durch einige Klicks aus und können jederzeit eigene Notizen hinzufügen. Durch Ihre Angaben generiert der Gutachtomat automatisch und zeitgleich ein grober Text, welcher mit einem KI-Feinschliff sprachllich perfketioniert werden kann. Dadurch generiert der Gutachtomat durch Ihre Angaben ein vollständiges PTV3-Gutachten, das Sie als Word-Dokument oder PDF-Datei exportieren können.'
        },
        {
          question: 'Kann ich den automatisch generierten Text bearbeiten?',
          answer: 'Ja, der generierte Gutachtentext kann jederzeit individuell angepasst und erweitert werden. Durch den KI-Feinschliff und Ihre manuelle Anpassnungen haben Sie die vollständige Kontrolle über die Inhalte Ihres PTV3-Gutachtens.'
        }
      ]
    },
    {
      category: 'Kosten und Abonnement',
      icon: CurrencyEuroIcon,
      faqs: [
        {
          question: 'Was kostet der Gutachtomat?',
          answer: 'Informationen zu unseren Preisen und Abonnementmodellen finden Sie auf unserer Preisseite. Falls Sie weitere Fragen zu unseren Preisen oder Abomodellen haben, können Sie uns direkt kontaktieren.'
        },
        {
          question: 'Gibt es eine kostenlose Testversion?',
          answer: 'Ja, Sie können den Gutachtomat eine Woche kostenlos testen, um sich von der Funktionalität und Effektivität zu überzeugen.'
        },
        {
          question: 'Wie kann ich mein monatliches Abo beendigen?',
          answer: 'Sie können Ihr Abo jederzeit monatlich zum Ende des Vertragsmonats beenden. Während der kostenlosen Probewoche können Sie jederzeit ein darauffolgendes Monatsabo ablehnen, natürlich ohne zusätzliche Gebühren.'
        },
        {
          question: 'Spare ich durch den Gutachtomat wirklich Zeit und Geld?',
          answer: 'Der Gutachtomat ist ein sehr effektives und leicht bedienbares Tool, welches die automatische PTV3-Gutachtenerstellung unterstützt. Durch wenige Klicks und Ihre Notizen werden Texte für das Gutachten zeitgleich generiert. Mit dem KI-Feinschliff können einzelne Abschnitte schnell überarbeitet werden. Durch die große Zeitersparnis bei der Gutachtenerstellung können Sie Ihre Kapazität für weitere ambulante psychotherapeutische Gespräche investieren.'
        },
        {
          question: 'Gibt es ein zeitliches Limit beim Einzelbericht-Paket?',
          answer: 'Nein, wenn Sie einzelne Berichte gekauft haben, gibt es hierfür kein zeitliches Limit. Ihre erworbenen Berichte bleiben unbegrenzt gültig und können jederzeit erstellt werden – ganz nach Ihrem Bedarf.'
        },
        {
          question: 'Ich bin Psychotherapeut:in in Ausbildung. Wie kann ich meinen Nachweis für den Gutachtomat-Rabatt hinterlegen?',
          answer: 'Als PiA können Sie beim Abschluss eines der gewünschten Abomodelle (mit PiA-Rabatt) ganz einfach Ihren Ausbildungsnachweis (z.B. eine Bestätigung Ihres Ausbildungsinstituts) als PDF, PNG oder JPG hochladen. Unser Team überprüft Ihren Nachweis schnellstmöglich. Sobald die Prüfung abgeschlossen ist, erhalten Sie eine E-Mail mit der Bestätigung, dass Ihr Abo erfolgreich mit dem PiA-Rabatt aktiviert wurde.'
        },
        {
          question: 'Wieso gibt es einen PiA-Rabatt?',
          answer: 'Die Ausbildung zum/zur Psychotherapeut:in ist nicht nur fachlich anspruchsvoll, sondern oft auch finanziell herausfordernd. Deshalb möchten wir PiAs – ähnlich wie bei klassischen Studierendenrabatten – den Zugang zum Gutachtomat erleichtern und von einer spürbaren Arbeitsentlastung profitieren.'
        }
      ]
    },
    {
      category: 'Datenschutz',
      icon: ShieldCheckIcon,
      faqs: [
        {
          question: 'Werden die Patientendaten DSGVO-konform verarbeitet?',
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
      <section className="relative pt-16 pb-8 flex items-center justify-center overflow-hidden">
        <div className="text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            Häufig gestellte Fragen
          </h1>
        </div>
      </section>

      {/* FAQ Content */}
      <main className="px-6 md:px-12 pb-16">
        <div className="max-w-3xl mx-auto">
          {faqCategories.map((category, catIndex) => (
            <div key={catIndex} className="mb-10">
              <h2 className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
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

        </div>
      </main>

      {/* CTA Section */}
      <section className="py-12 px-6 md:px-12 bg-blue-200 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Haben Sie weitere Fragen oder Anliegen?
          </h2>
          <p className="text-foreground/70 text-lg mb-6">
            Wenden Sie sich an uns bei Fragen oder technischen Schwierigkeiten.<br />Wir helfen Ihnen gerne weiter.
          </p>
          <Link href="/kontakt">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer inline-flex items-center gap-2">
              Kontaktieren Sie uns
              <ArrowRightCircleIcon className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>

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
