
import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { Progress } from "./progress";

interface Step {
  id: string;
  title: string;
  description?: string;
}

interface MultiStepFormProps {
  steps: Step[];
  currentStep: number;
  isSubmitting?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function MultiStepForm({
  steps,
  currentStep,
  isSubmitting,
  className,
  children
}: MultiStepFormProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className={cn("space-y-8", className)}>
      <div className="space-y-4">
        <Progress value={progress} />
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            
            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border transition-colors",
                  isActive && "border-primary bg-primary/5",
                  isCompleted && "border-green-500 bg-green-500/5",
                  !isActive && !isCompleted && "border-muted bg-muted/5"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold",
                    isActive && "border-primary text-primary",
                    isCompleted && "border-green-500 bg-green-500 text-white",
                    !isActive && !isCompleted && "border-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className={cn(
                    "text-sm font-medium",
                    isActive && "text-primary",
                    isCompleted && "text-green-500",
                    !isActive && !isCompleted && "text-muted-foreground"
                  )}>
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={cn(
        "relative rounded-lg border bg-card p-6",
        isSubmitting && "opacity-50"
      )}>
        {isSubmitting && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
