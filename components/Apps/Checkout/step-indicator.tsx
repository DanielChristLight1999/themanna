"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCheckoutStore } from "@/stores/checkoutstore"

export default function StepIndicator() {
    const currentStep = useCheckoutStore((state) => state.currentStep)
    const goToStep = useCheckoutStore((state) => state.goToStep)

  const steps = [
    { id: 1, name: "Delivery", completed: currentStep > 1, editable: currentStep > 1 },
    { id: 2, name: "Payment", completed: currentStep > 2, editable: false },
    { id: 3, name: "Confirmation", completed: false, editable: false },
  ]

  const handleStepClick = (stepId: number) => {
    // Only allow clicking on completed steps that are editable
    if (steps[stepId - 1].editable) {
      goToStep(stepId)
    }
  }

  return (
    <nav aria-label="Checkout Progress" className="mb-8">
      <ol className="flex items-center w-full">
        {steps.map((step, index) => (
          <li key={step.id} className={cn("flex items-center relative", index < steps.length - 1 ? "flex-1" : "")}>
            <button
              type="button"
              onClick={() => handleStepClick(step.id)}
              disabled={!step.editable && step.id !== currentStep}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium border transition-colors",
                step.completed
                  ? "bg-primary text-primary-foreground border-primary"
                  : step.id === currentStep
                    ? "border-primary text-primary"
                    : "border-muted-foreground/30 text-muted-foreground",
                step.editable ? "cursor-pointer hover:bg-primary/90 hover:text-primary-foreground" : "",
              )}
              aria-current={step.id === currentStep ? "step" : undefined}
            >
              {step.completed ? <Check className="h-4 w-4" /> : step.id}
            </button>

            <span className="ml-2 text-sm font-medium">{step.name}</span>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-4 bg-muted-foreground/30",
                  step.completed && steps[index + 1].completed ? "bg-primary" : "",
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
