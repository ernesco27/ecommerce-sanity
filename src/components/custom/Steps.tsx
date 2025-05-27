"use client";

import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

interface Step {
  id: string;
  name: string;
}

interface StepsProps {
  steps: readonly Step[];
  currentStep: string;
  onStepClick: (step: string) => void;
}

export function Steps({ steps, currentStep, onStepClick }: StepsProps) {
  return (
    <nav aria-label="Progress">
      <ol
        role="list"
        className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0"
      >
        {steps.map((step, stepIdx) => {
          const isCurrentStep = step.id === currentStep;
          const isCompleted =
            steps.findIndex((s) => s.id === currentStep) >
            steps.findIndex((s) => s.id === step.id);

          return (
            <li key={step.name} className="relative md:flex md:flex-1">
              {isCompleted ? (
                <button
                  type="button"
                  className="group flex w-full items-center"
                  onClick={() => onStepClick(step.id)}
                >
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-600">
                      <CheckIcon className="h-6 w-6 text-white" />
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-900">
                      {step.name}
                    </span>
                  </span>
                </button>
              ) : isCurrentStep ? (
                <button
                  type="button"
                  className="flex items-center px-6 py-4 text-sm font-medium"
                  aria-current="step"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-yellow-600">
                    <span className="text-yellow-600">{stepIdx + 1}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-yellow-600">
                    {step.name}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  className="group flex items-center"
                  onClick={() => onStepClick(step.id)}
                >
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300">
                      <span className="text-gray-500">{stepIdx + 1}</span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-500">
                      {step.name}
                    </span>
                  </span>
                </button>
              )}

              {stepIdx !== steps.length - 1 ? (
                <>
                  <div
                    className="absolute right-0 top-0 hidden h-full w-5 md:block"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-full w-full text-gray-300"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        vectorEffect="non-scaling-stroke"
                        stroke="currentcolor"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
