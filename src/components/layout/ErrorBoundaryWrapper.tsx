
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
}

export function ErrorBoundaryWrapper({ children }: ErrorBoundaryWrapperProps) {
  const handleError = async (error: Error) => {
    console.error('Global error:', error);
  };

  const errorFallback = (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Something went wrong. Please try refreshing the page.
      </AlertDescription>
    </Alert>
  );

  return (
    <ErrorBoundary 
      fallback={errorFallback}
      onError={handleError}
      type="default"
    >
      {children}
    </ErrorBoundary>
  );
}
