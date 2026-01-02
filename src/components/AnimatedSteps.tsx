'use client';

import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    number: 1,
    title: 'Auswahl patientenspezifischer Informationen',
    gradient: 'from-blue-600 to-blue-700',
    border: 'border-blue-100 dark:border-blue-900 hover:border-blue-300 dark:hover:border-blue-700',
  },
  {
    number: 2,
    title: 'Automatische Textgenerierung',
    gradient: 'from-sky-500 to-sky-600',
    border: 'border-sky-100 dark:border-sky-900 hover:border-sky-300 dark:hover:border-sky-700',
  },
  {
    number: 3,
    title: 'Überprüfung generierter Texte',
    gradient: 'from-cyan-500 to-cyan-600',
    border: 'border-cyan-100 dark:border-cyan-900 hover:border-cyan-300 dark:hover:border-cyan-700',
  },
  {
    number: 4,
    title: 'Herunterladen von PTV3-Gutachten',
    gradient: 'from-teal-400 to-teal-500',
    border: 'border-teal-100 dark:border-teal-900 hover:border-teal-300 dark:hover:border-teal-700',
  },
];

export default function AnimatedSteps() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger the animation for each step
            steps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps((prev) =>
                  prev.includes(index) ? prev : [...prev, index]
                );
              }, index * 150); // 150ms delay between each step
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="space-y-4">
      {steps.map((step, index) => (
        <div
          key={step.number}
          className={`flex gap-4 items-center bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border ${step.border} hover:shadow-lg transition-all duration-300
            ${visibleSteps.includes(index)
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
            }`}
          style={{
            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out, box-shadow 0.3s, border-color 0.3s',
          }}
        >
          <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${step.gradient} text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md`}>
            {step.number}
          </div>
          <h4 className="text-lg font-semibold text-foreground">
            {step.title}
          </h4>
        </div>
      ))}
    </div>
  );
}
