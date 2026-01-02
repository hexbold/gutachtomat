interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isLastStep: boolean;
  canProceed: boolean; // Based on validation
  isLoading?: boolean;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isLastStep,
  canProceed,
  isLoading = false,
}: WizardNavigationProps) {
  const isFirstStep = currentStep === 1;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="flex items-center justify-between">
          {/* Left: Back button (only show if not first step) */}
          {!isFirstStep ? (
            <button
              onClick={onPrevious}
              className="pointer-events-auto flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 text-text-secondary border-2 border-border-primary hover:border-blue-300 hover:bg-hover-surface active:bg-active-surface cursor-pointer"
            >
              <span className="text-xl">←</span>
              <span className="hidden sm:inline">Zurück</span>
            </button>
          ) : (
            <div></div>
          )}

          {/* Center: Step indicator (mobile only) */}
          <div className="md:hidden text-sm text-text-tertiary font-medium">
            Schritt {currentStep} von {totalSteps}
          </div>

          {/* Right: Next/Submit button */}
          {isLastStep ? (
            <button
              onClick={onSubmit}
              disabled={!canProceed || isLoading}
              className={`
                pointer-events-auto flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold
                transition-all duration-200
                ${canProceed && !isLoading
                  ? 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg hover:scale-105 cursor-pointer'
                  : 'bg-border-secondary text-text-quaternary cursor-not-allowed'
                }
              `}
            >
              <span className="text-xl">{isLoading ? '⏳' : '📄'}</span>
              <span>
                {isLoading ? 'Erstelle Gutachten...' : 'Gutachten erstellen'}
              </span>
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={!canProceed}
              className={`
                pointer-events-auto flex items-center space-x-2 px-6 py-3 rounded-lg font-medium
                transition-all duration-200
                ${canProceed
                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md cursor-pointer'
                  : 'bg-border-secondary text-text-quaternary cursor-not-allowed'
                }
              `}
            >
              <span className="hidden sm:inline">Weiter</span>
              <span className="text-xl">→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
