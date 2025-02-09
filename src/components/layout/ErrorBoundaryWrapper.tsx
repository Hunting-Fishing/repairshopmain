
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
}

export function ErrorBoundaryWrapper({ children }: ErrorBoundaryWrapperProps) {
  return (
    <ErrorBoundary
      fallback={
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
