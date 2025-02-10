
import React from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  fallbackComponent?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error) => void;
  type?: "auth" | "calendar" | "default";
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    try {
      await supabase.from('error_logs').insert({
        error_message: error.message,
        error_stack: error.stack,
        component_name: this.props.type || 'default',
        route: window.location.pathname,
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    this.props.onError?.(error);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        const FallbackComponent = this.props.fallbackComponent;
        return <FallbackComponent error={this.state.error!} reset={this.resetError} />;
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Different UI based on error boundary type
      switch (this.props.type) {
        case "auth":
          return (
            <div className="min-h-screen flex items-center justify-center p-4">
              <Alert variant="destructive" className="max-w-lg">
                <AlertTitle>Authentication Error</AlertTitle>
                <AlertDescription className="mt-2">
                  {this.state.error?.message || "There was an error with authentication"}
                </AlertDescription>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </Alert>
            </div>
          );

        default:
          return (
            <Alert variant="destructive" className="flex flex-col items-center p-6">
              <AlertCircle className="h-6 w-6 mb-2" />
              <AlertTitle className="mb-2">An error occurred</AlertTitle>
              <AlertDescription className="text-center mb-4">
                {this.state.error?.message || "Something went wrong. Please try again."}
              </AlertDescription>
              <Button 
                variant="outline"
                onClick={this.resetError}
                className="flex items-center gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                Try Again
              </Button>
            </Alert>
          );
      }
    }

    return this.props.children;
  }
}
