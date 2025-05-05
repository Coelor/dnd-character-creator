import React from "react";
import { PALETTE } from "../DashboardLayout";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-2 sm:gap-4 overflow-x-auto py-2 px-1 rounded-md bg-[var(--sidebar-bg)] shadow">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div
            key={index}
            className={`flex items-center space-x-2 px-3 py-2 rounded transition-all text-sm font-medium
              ${isActive ? "bg-purple-600 text-yellow-300 shadow" :
                isCompleted ? "text-green-400" :
                "text-gray-400"}`}
          >
            <span className="font-bold">{index + 1}.</span>
            <span>{step}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
