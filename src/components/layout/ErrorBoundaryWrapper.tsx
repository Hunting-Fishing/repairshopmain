
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Suspense } from "react";
import { toast } from "@/hooks/use-toast";

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
}

export function ErrorBoundaryWrapper({ children }: ErrorBoundaryWrapperProps) {
  const handleError = async (error: Error) => {
    console.error('Global error:', error);
    toast({
      title: "Error",
      description: 'An unexpected error occurred. Please try again.',
      variant: "destructive"
    });
  };

  const errorFallback = (
    <Alert variant="destructive" className="m-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Something went wrong. Please try refreshing the page or contact support if the problem persists.
      </AlertDescription>
    </Alert>
  );

  const loadingFallback = (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" className="text-primary" />
    </div>
  );

  return (
    <ErrorBoundary 
      fallback={errorFallback}
      onError={handleError}
    >
      <Suspense fallback={loadingFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
