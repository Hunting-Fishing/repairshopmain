
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva(
  "animate-spin transition-all duration-200 ease-in-out",
  {
    variants: {
      variant: {
        primary: "text-primary",
        secondary: "text-muted-foreground",
      },
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8"
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

export function LoadingSpinner({
  className,
  variant,
  size,
  label,
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "group hover:[--speed:0.5s]",
        className
      )}
      {...props}
    >
      <Loader2 
        className={cn(
          spinnerVariants({ variant, size }),
          "animate-[spin_var(--speed)_linear_infinite]"
        )}
        style={{ "--speed": "0.75s" } as React.CSSProperties}
      />
      {label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
      <span className="sr-only">Loading</span>
    </div>
  );
}
