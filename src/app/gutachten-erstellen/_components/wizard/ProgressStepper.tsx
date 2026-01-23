import {
  DocumentTextIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  PencilSquareIcon,
  MagnifyingGlassPlusIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { ComponentType, SVGProps } from 'react';

interface Step {
  number: number;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  shortLabel: string; // For mobile
}

interface ProgressStepperProps {
  currentStep: number;
  completedSteps: Set<number>;
  visitedSteps: Set<number>;
  onStepClick: (step: number) => void;
}

const STEPS: Step[] = [
  { number: 1, label: 'Basisdaten', icon: DocumentTextIcon, shortLabel: 'Basisdaten' },
  { number: 2, label: 'Soziodemographische Daten', icon: HomeIcon, shortLabel: 'Soziodemographie' },
  { number: 3, label: 'Symptomatik und psychischer Befund', icon: ClipboardDocumentListIcon, shortLabel: 'Symptomatik' },
  { number: 4, label: 'Somatischer Befund und Konsiliarbericht', icon: HeartIcon, shortLabel: 'Somatischer Befund' },
  { number: 5, label: 'Behandlungsrelevante Angaben', icon: PencilSquareIcon, shortLabel: 'Behandlungsrelevante Angaben' },
  { number: 6, label: 'Diagnosen', icon: MagnifyingGlassPlusIcon, shortLabel: 'Diagnosen' },
  { number: 7, label: 'Behandlungsplan', icon: ClipboardDocumentCheckIcon, shortLabel: 'Behandlungsplan' },
  { number: 8, label: 'Überprüfung', icon: CheckCircleIcon, shortLabel: 'Prüfung' },
];

export function ProgressStepper({
  currentStep,
  completedSteps,
  visitedSteps,
  onStepClick,
}: ProgressStepperProps) {
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber === currentStep && completedSteps.has(stepNumber)) return 'completed-current';
    if (completedSteps.has(stepNumber)) return 'completed';
    if (stepNumber === currentStep) return 'current';
    if (visitedSteps.has(stepNumber)) return 'visited';
    return 'upcoming';
  };

  const canClickStep = (stepNumber: number) => {
    // Can only click visited or completed steps
    return visitedSteps.has(stepNumber) || completedSteps.has(stepNumber);
  };

  const getProgressPercentage = () => {
    return ((currentStep - 1) / (STEPS.length - 1)) * 100;
  };

  const getCompletedPercentage = () => {
    if (completedSteps.size === 0) return 0;
    const maxCompleted = Math.max(...Array.from(completedSteps));
    return ((maxCompleted - 1) / (STEPS.length - 1)) * 100;
  };

  return (
    <>
      {/* Desktop: Horizontal stepper at the top */}
      <div className="hidden md:block w-full bg-surface-secondary border-b border-border-primary mt-3">
        <div className="">
          <div className="max-w-[1900px] mx-auto px-6 py-3">
            {/* Steps */}
            <div className="flex items-center justify-center">
              {STEPS.map((step, index) => {
                const status = getStepStatus(step.number);
                const clickable = canClickStep(step.number);
                const isFirst = index === 0;
                const isLast = index === STEPS.length - 1;

                // Create clip-path for chevron tabs
                // All tabs have straight left edge and chevron on right (except last)
                const clipPath = isLast
                  ? 'none' // Last step - no clipping, just rectangle
                  : 'polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%)'; // Chevron on right

                return (
                  <button
                    key={step.number}
                    onClick={() => clickable && onStepClick(step.number)}
                    disabled={!clickable}
                    className={`
                      flex items-center gap-2 py-2 transition-all duration-300 relative
                      ${clickable ? 'cursor-pointer hover:brightness-110' : 'cursor-not-allowed'}
                      ${isFirst ? 'pl-4 pr-5 rounded-l-md' : isLast ? 'pl-5 pr-4 rounded-r-md' : 'pl-5 pr-5'}
                    `}
                    style={{
                      backgroundColor:
                        status === 'completed-current' ? '#4ade80' :
                        status === 'current' ? '#2563eb' :
                        status === 'completed' ? '#22c55e' :
                        status === 'visited' ? '#9ca3af' :
                        '#e5e7eb',
                      clipPath: clipPath,
                      marginLeft: isFirst ? '0' : '-15px',
                      zIndex: STEPS.length - index,
                    }}
                    title={step.label}
                  >
                    {/* Icon */}
                    <step.icon className={`w-4 h-4 ${status === 'current' || status === 'completed' || status === 'completed-current' || status === 'visited' ? 'text-white' : 'text-text-quaternary'}`} />

                    {/* Label */}
                    <span
                      className={`
                        text-xs font-medium whitespace-nowrap
                        ${status === 'current' || status === 'completed' || status === 'completed-current' || status === 'visited'
                          ? 'text-white'
                          : 'text-text-quaternary'
                        }
                        ${status === 'current' || status === 'completed-current' ? 'font-bold' : ''}
                      `}
                    >
                      {step.shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Compact stepper at the top */}
      <div className="md:hidden w-full bg-surface-secondary border-b border-border-primary mt-4">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="bg-surface-primary px-4 py-2">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  {(() => {
                    const IconComponent = STEPS[currentStep - 1].icon;
                    return <IconComponent className="w-5 h-5 text-white" />;
                  })()}
                </div>
                <div>
                  <div className="text-xs text-text-quaternary">Schritt {currentStep} von {STEPS.length}</div>
                  <div className="font-semibold text-sm text-text-primary">{STEPS[currentStep - 1].label}</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-border-primary rounded-full overflow-hidden relative">
                {/* Green bar for completed steps */}
                <div
                  className="absolute h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${getCompletedPercentage()}%` }}
                />
                {/* Blue bar for current progress (from last completed to current) */}
                <div
                  className="absolute h-full bg-blue-600 transition-all duration-500"
                  style={{
                    left: `${getCompletedPercentage()}%`,
                    width: `${getProgressPercentage() - getCompletedPercentage()}%`
                  }}
                />
              </div>

              {/* Step dots */}
              <div className="flex justify-center space-x-2 mt-2">
                {STEPS.map((step) => (
                  <button
                    key={step.number}
                    onClick={() => canClickStep(step.number) && onStepClick(step.number)}
                    disabled={!canClickStep(step.number)}
                    className={`
                      w-2 h-2 rounded-full transition-all duration-300
                      ${step.number === currentStep && completedSteps.has(step.number)
                        ? 'bg-green-400 w-8'
                        : step.number === currentStep
                        ? 'bg-blue-600 w-8'
                        : completedSteps.has(step.number)
                        ? 'bg-green-500'
                        : 'bg-border-secondary'
                      }
                    `}
                    aria-label={`Schritt ${step.number}: ${step.label}`}
                  />
                ))}
              </div>
          </div>
        </div>
      </div>
    </>
  );
}
