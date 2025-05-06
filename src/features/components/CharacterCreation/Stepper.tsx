import React from "react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-2 sm:gap-4 overflow-x-auto py-2 px-1 rounded-md bg-[var(--sidebar-bg)] shadow">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <button
            key={index}
            onClick={() => onStepClick(index)}
            className={`flex items-center space-x-2 px-3 py-2 rounded transition-all text-sm font-medium focus:outline-none
              ${isActive ? "bg-purple-600 text-yellow-300 shadow" :
                isCompleted ? "text-green-400 hover:text-green-300" :
                "text-gray-400 hover:text-gray-300"}`}
          >
            <span className="font-bold">{index + 1}.</span>
            <span>{step}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Stepper;
