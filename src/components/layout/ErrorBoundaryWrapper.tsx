
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
}

export function ErrorBoundaryWrapper({ children }: ErrorBoundaryWrapperProps) {
  const handleError = async (error: Error) => {
    try {
      await supabase.from('error_logs').insert({
        error_message: error.message,
        error_stack: error.stack,
        component_name: 'Global',
        route: window.location.pathname,
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
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
    >
      {children}
    </ErrorBoundary>
  );
}
