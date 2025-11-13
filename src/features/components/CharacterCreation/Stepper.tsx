import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

const Stepper = ({ steps, currentStep, onStepClick }: StepperProps) => {
  return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-(--color-border)">
        <div
          className="h-full bg-(--color-accent) transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = index <= currentStep;

          return (
            <button
              key={index}
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={`flex flex-col items-center gap-2 ${
                isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
              }`}
            >
              {/* Circle */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  transition-all border-2
                  ${
                    isActive
                      ? 'bg-(--color-accent) border-(--color-accent) text-white scale-110'
                      : isCompleted
                      ? 'bg-(--color-success) border-(--color-success) text-white'
                      : 'bg-(--color-bg) border-(--color-border)'
                  }
                `}
                style={
                  !isActive && !isCompleted
                    ? { color: 'var(--color-text-secondary)' }
                    : undefined
                }
              >
                {isCompleted ? <Check size={18} /> : index + 1}
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium hidden sm:block ${
                  isActive ? 'font-semibold' : ''
                }`}
                style={{
                  color: isActive
                    ? 'var(--color-accent)'
                    : isCompleted
                    ? 'var(--color-success)'
                    : 'var(--color-text-secondary)',
                }}
              >
                {step}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;